const express = require('express');
const multer = require('multer');
const path = require('path');
const { auth } = require('../middleware/auth');
const {
  getServiceRequests,
  getServiceRequest,
  createServiceRequest,
  updateServiceRequest,
  deleteServiceRequest,
  getDashboardStats,
  exportRequests
} = require('../controllers/serviceRequestController');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow specific file types
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt|xlsx|xls/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images, PDFs, and documents are allowed.'));
    }
  }
});

// Apply auth middleware to all routes
router.use(auth);

// @route   GET /api/requests/stats
router.get('/stats', getDashboardStats);

// @route   GET /api/requests/export
router.get('/export', exportRequests);

// @route   GET /api/requests
router.get('/', getServiceRequests);

// @route   GET /api/requests/:id
router.get('/:id', getServiceRequest);

// @route   POST /api/requests
router.post('/', upload.single('rcaFile'), createServiceRequest);
// @route   PUT /api/requests/:id
router.put('/:id', upload.single('rcaFile'), updateServiceRequest);
// @route   DELETE /api/requests/:id
router.delete('/:id', deleteServiceRequest);

      
// @route   POST /api/upload-rca
router.post('/upload-rca', upload.single('rcaFile'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    res.json({
      success: true,
      filePath: `/uploads/${req.file.filename}`,
      originalName: req.file.originalname,
      message: 'File uploaded successfully'
    });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading file'
    });
  }
});

module.exports = router;
