import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import { Search, Refresh } from '@mui/icons-material';

import DashboardLayout from '../components/Layout/DashboardLayout';
import DashboardStats from '../components/Dashboard/DashboardStats';
import ServiceRequestForm from '../components/ServiceRequest/ServiceRequestForm';
import ServiceRequestTable from '../components/ServiceRequest/ServiceRequestTable';
import { useServiceRequests } from '../context/ServiceRequestContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    requests,
    stats,
    loading,
    pagination,
    filters,
    getServiceRequests,
    getDashboardStats,
    deleteServiceRequest,
    exportRequests,
    setFilters,
  } = useServiceRequests();

  const [currentTab, setCurrentTab] = useState('dashboard');
  const [editingRequest, setEditingRequest] = useState(null);
  const [searchFilters, setSearchFilters] = useState({
    serviceNumber: '',
    status: '',
  });

  // Set current tab based on route
  useEffect(() => {
    const path = location.pathname.split('/').pop();
    if (['dashboard', 'add-request', 'view-requests'].includes(path)) {
      setCurrentTab(path);
    } else {
      setCurrentTab('dashboard');
    }
  }, [location]);

  // Load initial data
  useEffect(() => {
    getDashboardStats();
    getServiceRequests();
  }, []);

  // Apply filters when they change
  useEffect(() => {
    getServiceRequests(1);
  }, [filters]);

  const handleTabChange = (tabId) => {
    setCurrentTab(tabId);
    navigate(`/${tabId}`);
    
    // Clear editing state when changing tabs
    if (tabId !== 'add-request') {
      setEditingRequest(null);
    }
  };

  const handleEditRequest = (request) => {
    setEditingRequest(request);
    setCurrentTab('add-request');
    navigate('/add-request');
  };

  const handleDeleteRequest = async (requestId) => {
    const result = await deleteServiceRequest(requestId);
    if (result.success) {
      // Refresh data
      getDashboardStats();
      getServiceRequests();
    }
  };

  const handleFormSuccess = () => {
    // Refresh data and go to view requests
    getDashboardStats();
    getServiceRequests();
    setEditingRequest(null);
    setCurrentTab('view-requests');
    navigate('/view-requests');
  };

  const handleFormCancel = () => {
    setEditingRequest(null);
  };

  const handleSearchChange = (field, value) => {
    setSearchFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleApplyFilters = () => {
    setFilters(searchFilters);
  };

  const handleClearFilters = () => {
    const clearFilters = { serviceNumber: '', status: '' };
    setSearchFilters(clearFilters);
    setFilters(clearFilters);
  };

  const handleRefresh = () => {
    getDashboardStats();
    getServiceRequests();
  };

  const handlePageChange = (page, limit = 50) => {
    getServiceRequests(page, limit);
  };

  const renderDashboardTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Dashboard Overview
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={handleRefresh}
        >
          Refresh
        </Button>
      </Box>
      <DashboardStats stats={stats} loading={loading} />
      
      {/* Recent Requests */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recent Service Requests
          </Typography>
          <ServiceRequestTable
            requests={requests.slice(0, 5)} // Show only first 5
            onEdit={handleEditRequest}
            onDelete={handleDeleteRequest}
            onExport={exportRequests}
            pagination={{ ...pagination, totalRecords: 5 }}
            onPageChange={() => {}} // Disable pagination for dashboard view
            loading={loading}
          />
        </CardContent>
      </Card>
    </Box>
  );

  const renderAddRequestTab = () => (
    <Box>
      <ServiceRequestForm
        editingRequest={editingRequest}
        onCancel={handleFormCancel}
        onSuccess={handleFormSuccess}
      />
    </Box>
  );

  const renderViewRequestsTab = () => (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Service Requests
      </Typography>
      
      {/* Search and Filter Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Search by SR Number"
                value={searchFilters.serviceNumber}
                onChange={(e) => handleSearchChange('serviceNumber', e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Filter by Status</InputLabel>
                <Select
                  value={searchFilters.status}
                  label="Filter by Status"
                  onChange={(e) => handleSearchChange('status', e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="open">Open</MenuItem>
                  <MenuItem value="in-progress">In Progress</MenuItem>
                  <MenuItem value="closed">Closed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={5}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleApplyFilters}
                >
                  Apply Filters
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleClearFilters}
                >
                  Clear
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleRefresh}
                  startIcon={<Refresh />}
                >
                  Refresh
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Requests Table */}
      <ServiceRequestTable
        requests={requests}
        onEdit={handleEditRequest}
        onDelete={handleDeleteRequest}
        onExport={exportRequests}
        pagination={pagination}
        onPageChange={handlePageChange}
        loading={loading}
      />
    </Box>
  );

  return (
    <DashboardLayout currentTab={currentTab} onTabChange={handleTabChange}>
      <Routes>
        <Route path="/dashboard" element={renderDashboardTab()} />
        <Route path="/add-request" element={renderAddRequestTab()} />
        <Route path="/view-requests" element={renderViewRequestsTab()} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </DashboardLayout>
  );
};

export default Dashboard;
