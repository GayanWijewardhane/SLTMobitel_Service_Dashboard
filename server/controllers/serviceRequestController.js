const ServiceRequest = require('../models/ServiceRequest');
const path = require('path');
const fs = require('fs');
const emailService = require('../services/emailService');
// @desc    Get all service requests
// @route   GET /api/requests
// @access  Private
const getServiceRequests = async (req, res) => {
  try {
    const { serviceNumber, status, page = 1, limit = 50 } = req.query;
    
    // Build query
    let query = {};
    
    if (serviceNumber) {
      query.serviceNumber = { $regex: serviceNumber, $options: 'i' };
    }
    
    if (status && status !== 'all') {
      query.status = status;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Get requests with pagination
    const requests = await ServiceRequest.find(query)
      .populate('createdBy', 'username')
      .populate('updatedBy', 'username')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    // Get total count for pagination
    const total = await ServiceRequest.countDocuments(query);

    res.json({
      success: true,
      data: requests,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        count: requests.length,
        totalRecords: total
      }
    });

  } catch (error) {
    console.error('Get requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching service requests'
    });
  }
};

// @desc    Get single service request
// @route   GET /api/requests/:id
// @access  Private
const getServiceRequest = async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id)
      .populate('createdBy', 'username')
      .populate('updatedBy', 'username');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Service request not found'
      });
    }

    res.json({
      success: true,
      data: request
    });

  } catch (error) {
    console.error('Get request error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching service request'
    });
  }
};

// @desc    Create service request
// @route   POST /api/requests
// @access  Private
const createServiceRequest = async (req, res) => {
  try {
    // Add user info to request data
    req.body.createdBy = req.user.id;
    req.body.updatedBy = req.user.id;

        // Handle file upload
    if (req.file) {
      req.body.rcaFilePath = `/uploads/${req.file.filename}`;
    }

    const request = new ServiceRequest(req.body);
    await request.save();

    // Populate user info for response
    await request.populate('createdBy', 'username');
    await request.populate('updatedBy', 'username');

     // Send email notification
    try {
      await emailService.sendNewRequestNotification(request, req.user.username);
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
      // Don't fail the request creation if email fails
    }   

    res.status(201).json({
      success: true,
      data: request,
      message: 'Service request created successfully'
    });

  } catch (error) {
    console.error('Create request error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Service request number already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating service request'
    });
  }
};

// @desc    Update service request
// @route   PUT /api/requests/:id
// @access  Private
const updateServiceRequest = async (req, res) => {
  try {
    // Get the current request to compare status
    const currentRequest = await ServiceRequest.findById(req.params.id);
    if (!currentRequest) {
      return res.status(404).json({ success: false, message: 'Service request not found' });
    }
    const oldStatus = currentRequest.status;

    // Add updated by user info
    req.body.updatedBy = req.user.id;

    // Handle file upload (if applicable, your previous logic here)
    if (req.file) {
      req.body.rcaFilePath = `/uploads/${req.file.filename}`;
      if (currentRequest.rcaFilePath) {
        const oldFilePath = path.join(__dirname, '../..', currentRequest.rcaFilePath);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
    }

    // Update request
    const request = await ServiceRequest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('createdBy', 'username')
     .populate('updatedBy', 'username');

    if (oldStatus !== request.status) {
      try {
        await emailService.sendStatusUpdateNotification(
          request,
          oldStatus,
          request.status,
          req.user.username
        );
      } catch (emailError) {
        console.error('Failed to send status update email:', emailError);
      }
    }

    res.json({
      success: true,
      data: request,
      message: 'Service request updated successfully'
    });
  } catch (error) {
    console.error('Update request error:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Service request number already exists'
      });
    }
    res.status(500).json({ success: false, message: 'Error updating service request' });
  }
};

// @desc    Delete service request
// @route   DELETE /api/requests/:id
// @access  Private
const deleteServiceRequest = async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Service request not found'
      });
    }

    // Delete associated RCA file if it exists
    if (request.rcaFilePath) {
      const filePath = path.join(__dirname, '../..', request.rcaFilePath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await ServiceRequest.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Service request deleted successfully'
    });

  } catch (error) {
    console.error('Delete request error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting service request'
    });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/requests/stats
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    const total = await ServiceRequest.countDocuments();
    const open = await ServiceRequest.countDocuments({ status: 'open' });
    const inProgress = await ServiceRequest.countDocuments({ status: 'in-progress' });
    const closed = await ServiceRequest.countDocuments({ status: 'closed' });

    // Get recent requests (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentRequests = await ServiceRequest.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    res.json({
      success: true,
      data: {
        total,
        open,
        inProgress,
        closed,
        recentRequests
      }
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics'
    });
  }
};

// @desc    Export service requests to CSV
// @route   GET /api/requests/export
// @access  Private
const exportRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find()
      .populate('createdBy', 'username')
      .populate('updatedBy', 'username')
      .sort({ createdAt: -1 });

    // Create CSV headers
    const headers = [
      'Service Number',
      'Node',
      'Issue',
      'Remark',
      'Open Date',
      'Closed Date',
      'Mobitel Contact',
      'Huawei Contact',
      'Status',
      'RCA File',
      'Description',
      'Work Around',
      'Created By',
      'Created Date',
      'Updated By',
      'Updated Date'
    ];

    // Create CSV rows
    const rows = requests.map(req => [
      req.serviceNumber || '',
      req.node || '',
      req.issue || '',
      req.remark || '',
      req.openDate ? new Date(req.openDate).toLocaleString() : '',
      req.closedDate ? new Date(req.closedDate).toLocaleString() : '',
      req.responsePersonMobitel || '',
      req.responsePersonHuawei || '',
      req.status || '',
      req.rcaFilePath || '',
      (req.description || '').replace(/"/g, '""'),
      (req.workAroundRectification || '').replace(/"/g, '""'),
      req.createdBy?.username || '',
      req.createdAt ? new Date(req.createdAt).toLocaleString() : '',
      req.updatedBy?.username || '',
      req.updatedAt ? new Date(req.updatedAt).toLocaleString() : ''
    ].map(field => `${field}`));

    // Combine headers and rows
    const csv = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');

    // Set headers for file download
    res.header('Content-Type', 'text/csv');
    res.attachment(`service-requests-${new Date().toISOString().split('T')[0]}.csv`);
    res.send(csv);

  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({
      success: false,
      message: 'Error exporting service requests'
    });
  }
};

module.exports = {
  getServiceRequests,
  getServiceRequest,
  createServiceRequest,
  updateServiceRequest,
  deleteServiceRequest,
  getDashboardStats,
  exportRequests
};
