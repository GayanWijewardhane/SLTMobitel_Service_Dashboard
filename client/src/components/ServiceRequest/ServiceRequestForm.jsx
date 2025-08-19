import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Typography,
  MenuItem,
  Box,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  Input,
  Chip,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Save, CloudUpload, Clear } from '@mui/icons-material';
import dayjs from 'dayjs';
import { useServiceRequests } from '../../context/ServiceRequestContext';

const ServiceRequestForm = ({ editingRequest, onCancel, onSuccess }) => {
  const { createServiceRequest, updateServiceRequest, uploadRCAFile, loading } = useServiceRequests();
  
  const [formData, setFormData] = useState({
    serviceNumber: '',
    node: '',
    issue: '',
    remark: '',
    openDate: dayjs(),
    closedDate: null,
    responsePersonMobitel: '',
    responsePersonHuawei: '',
    status: 'open',
    description: '',
    workAroundRectification: '',
    rcaFilePath: '',
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [fileUploading, setFileUploading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const statusOptions = [
    { value: 'open', label: 'Open' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'closed', label: 'Closed' },
  ];

  useEffect(() => {
    if (editingRequest) {
      setFormData({
        serviceNumber: editingRequest.serviceNumber || '',
        node: editingRequest.node || '',
        issue: editingRequest.issue || '',
        remark: editingRequest.remark || '',
        openDate: editingRequest.openDate ? dayjs(editingRequest.openDate) : dayjs(),
        closedDate: editingRequest.closedDate ? dayjs(editingRequest.closedDate) : null,
        responsePersonMobitel: editingRequest.responsePersonMobitel || '',
        responsePersonHuawei: editingRequest.responsePersonHuawei || '',
        status: editingRequest.status || 'open',
        description: editingRequest.description || '',
        workAroundRectification: editingRequest.workAroundRectification || '',
        rcaFilePath: editingRequest.rcaFilePath || '',
      });
    }
  }, [editingRequest]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear field error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.serviceNumber.trim()) {
      errors.serviceNumber = 'Service number is required';
    }
    
    if (!formData.openDate) {
      errors.openDate = 'Open date is required';
    }

    if (formData.status === 'closed' && !formData.closedDate) {
      errors.closedDate = 'Closed date is required when status is closed';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    let rcaFilePath = formData.rcaFilePath;

    // Upload file if selected
    if (selectedFile) {
      setFileUploading(true);
      const uploadResult = await uploadRCAFile(selectedFile);
      setFileUploading(false);
      
      if (!uploadResult.success) {
        return;
      }
      rcaFilePath = uploadResult.filePath;
    }

    // Prepare data for submission
    const submitData = {
      ...formData,
      openDate: formData.openDate.toISOString(),
      closedDate: formData.closedDate ? formData.closedDate.toISOString() : null,
      rcaFilePath,
    };

    try {
      let result;
      if (editingRequest) {
        result = await updateServiceRequest(editingRequest._id, submitData);
      } else {
        result = await createServiceRequest(submitData);
      }

      if (result.success) {
        resetForm();
        onSuccess && onSuccess();
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      serviceNumber: '',
      node: '',
      issue: '',
      remark: '',
      openDate: dayjs(),
      closedDate: null,
      responsePersonMobitel: '',
      responsePersonHuawei: '',
      status: 'open',
      description: '',
      workAroundRectification: '',
      rcaFilePath: '',
    });
    setSelectedFile(null);
    setFormErrors({});
  };

  const handleCancel = () => {
    resetForm();
    onCancel && onCancel();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
            {editingRequest ? 'Edit Service Request' : 'Create New Service Request'}
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Service Number */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Service Request Number"
                  value={formData.serviceNumber}
                  onChange={(e) => handleInputChange('serviceNumber', e.target.value)}
                  error={!!formErrors.serviceNumber}
                  helperText={formErrors.serviceNumber}
                  required
                />
              </Grid>

              {/* Node */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Node"
                  value={formData.node}
                  onChange={(e) => handleInputChange('node', e.target.value)}
                />
              </Grid>

              {/* Issue */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Issue"
                  value={formData.issue}
                  onChange={(e) => handleInputChange('issue', e.target.value)}
                />
              </Grid>

              {/* Remark */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Remark"
                  value={formData.remark}
                  onChange={(e) => handleInputChange('remark', e.target.value)}
                />
              </Grid>

              {/* Open Date */}
              <Grid item xs={12} md={6}>
                <DateTimePicker
                  label="Open Date"
                  value={formData.openDate}
                  onChange={(newValue) => handleInputChange('openDate', newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      error={!!formErrors.openDate}
                      helperText={formErrors.openDate}
                      required
                    />
                  )}
                />
              </Grid>

              {/* Closed Date */}
              <Grid item xs={12} md={6}>
                <DateTimePicker
                  label="Closed Date"
                  value={formData.closedDate}
                  onChange={(newValue) => handleInputChange('closedDate', newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      error={!!formErrors.closedDate}
                      helperText={formErrors.closedDate}
                    />
                  )}
                />
              </Grid>

              {/* Response Person Mobitel */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Response Person (Mobitel)"
                  value={formData.responsePersonMobitel}
                  onChange={(e) => handleInputChange('responsePersonMobitel', e.target.value)}
                />
              </Grid>

              {/* Response Person Huawei */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Response Person (Huawei)"
                  value={formData.responsePersonHuawei}
                  onChange={(e) => handleInputChange('responsePersonHuawei', e.target.value)}
                />
              </Grid>

              {/* Status */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.status}
                    label="Status"
                    onChange={(e) => handleInputChange('status', e.target.value)}
                  >
                    {statusOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* RCA File Upload */}
              <Grid item xs={12} md={6}>
                <Box>
                  <InputLabel sx={{ mb: 1 }}>RCA File</InputLabel>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<CloudUpload />}
                      disabled={fileUploading}
                    >
                      {fileUploading ? 'Uploading...' : 'Choose File'}
                      <input
                        type="file"
                        hidden
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.xlsx,.xls"
                      />
                    </Button>
                    {selectedFile && (
                      <Chip
                        label={selectedFile.name}
                        onDelete={() => setSelectedFile(null)}
                        color="primary"
                        variant="outlined"
                      />
                    )}
                    {formData.rcaFilePath && !selectedFile && (
                      <Chip
                        label="Current file"
                        color="success"
                        variant="outlined"
                        onClick={() => window.open(formData.rcaFilePath, '_blank')}
                      />
                    )}
                  </Box>
                </Box>
              </Grid>

              {/* Description */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
              </Grid>

              {/* Work Around / Rectification */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Work Around / Rectification"
                  value={formData.workAroundRectification}
                  onChange={(e) => handleInputChange('workAroundRectification', e.target.value)}
                />
              </Grid>

              {/* Form Actions */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={handleCancel}
                    startIcon={<Clear />}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading || fileUploading}
                    startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                  >
                    {loading ? 'Saving...' : editingRequest ? 'Update Request' : 'Create Request'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
};

export default ServiceRequestForm;
