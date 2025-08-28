import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Step,
  Stepper,
  StepLabel,
  Paper,
} from '@mui/material';
import { Lock, Visibility, VisibilityOff, Security, VpnKey } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const ChangePasswordDialog = ({ open, onClose }) => {
  const { changePassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); // 0 = admin verification, 1 = password change
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminVerified, setAdminVerified] = useState(false);
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [errors, setErrors] = useState({});

  // Admin password constant
  const ADMIN_PASSWORD = "1qaz!QAZ";

  const steps = ['Admin Verification', 'Change Password'];

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const validateAdminPassword = () => {
    if (!adminPassword) {
      setErrors({ admin: 'Admin password is required' });
      return false;
    }

    if (adminPassword !== ADMIN_PASSWORD) {
      setErrors({ admin: 'Invalid admin password' });
      return false;
    }

    setErrors({});
    return true;
  };

  const handleAdminVerification = (e) => {
    e.preventDefault();
    
    if (validateAdminPassword()) {
      setAdminVerified(true);
      setCurrentStep(1);
      toast.success('Admin verification successful');
    }
  };

  const validatePasswordForm = () => {
    const newErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters long';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (formData.currentPassword && formData.newPassword && 
        formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = 'New password must be different from current password';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const result = await changePassword(formData.currentPassword, formData.newPassword);
      
      if (result.success) {
        toast.success('Password changed successfully');
        handleClose();
      } else {
        setErrors({ currentPassword: result.error || 'Failed to change password' });
      }
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred' });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCurrentStep(0);
    setAdminPassword('');
    setAdminVerified(false);
    setShowAdminPassword(false);
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setErrors({});
    setShowPasswords({
      current: false,
      new: false,
      confirm: false,
    });
    onClose();
  };

  const handleBack = () => {
    setCurrentStep(0);
    setAdminVerified(false);
    setErrors({});
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'admin') {
      setShowAdminPassword(!showAdminPassword);
    } else {
      setShowPasswords(prev => ({
        ...prev,
        [field]: !prev[field],
      }));
    }
  };

  const renderAdminVerification = () => (
    <Box component="form" onSubmit={handleAdminVerification}>
      <DialogContent>
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Security color="primary" sx={{ fontSize: 48, mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Admin Verification Required
          </Typography>
          <Typography variant="body2" color="text.secondary">
            To change your password, please enter the admin password for security verification.
          </Typography>
        </Box>

        {errors.admin && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errors.admin}
          </Alert>
        )}

        <TextField
          fullWidth
          label="Admin Password"
          type={showAdminPassword ? 'text' : 'password'}
          value={adminPassword}
          onChange={(e) => {
            setAdminPassword(e.target.value);
            if (errors.admin) {
              setErrors(prev => ({ ...prev, admin: null }));
            }
          }}
          error={!!errors.admin}
          autoFocus
          InputProps={{
            startAdornment: <VpnKey sx={{ mr: 1, color: 'text.secondary' }} />,
            endAdornment: (
              <IconButton
                onClick={() => togglePasswordVisibility('admin')}
                edge="end"
              >
                {showAdminPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            ),
          }}
        />
      </DialogContent>
      
      <DialogActions>
        <Button onClick={handleClose}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          variant="contained"
          startIcon={<Security />}
        >
          Verify Admin
        </Button>
      </DialogActions>
    </Box>
  );

  const renderPasswordChange = () => (
    <Box component="form" onSubmit={handlePasswordSubmit}>
      <DialogContent>
        {errors.general && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errors.general}
          </Alert>
        )}

        <Paper elevation={1} sx={{ p: 2, mb: 3, bgcolor: 'success.light', color: 'success.contrastText' }}>
          <Box display="flex" alignItems="center" gap={1}>
            <Security fontSize="small" />
            <Typography variant="body2">
              Admin verification successful. You can now change your password.
            </Typography>
          </Box>
        </Paper>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Current Password"
              type={showPasswords.current ? 'text' : 'password'}
              value={formData.currentPassword}
              onChange={(e) => handleChange('currentPassword', e.target.value)}
              error={!!errors.currentPassword}
              helperText={errors.currentPassword}
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => togglePasswordVisibility('current')}
                    edge="end"
                  >
                    {showPasswords.current ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="New Password"
              type={showPasswords.new ? 'text' : 'password'}
              value={formData.newPassword}
              onChange={(e) => handleChange('newPassword', e.target.value)}
              error={!!errors.newPassword}
              helperText={errors.newPassword || 'Password must be at least 6 characters long'}
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => togglePasswordVisibility('new')}
                    edge="end"
                  >
                    {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Confirm New Password"
              type={showPasswords.confirm ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => togglePasswordVisibility('confirm')}
                    edge="end"
                  >
                    {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary">
              Password Requirements:
              <br />
              • At least 6 characters long
              <br />
              • Different from your current password
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={handleBack} disabled={loading}>
          Back
        </Button>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          variant="contained" 
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <Lock />}
        >
          {loading ? 'Changing...' : 'Change Password'}
        </Button>
      </DialogActions>
    </Box>
  );

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Lock />
          Change Password
        </Box>
        <Stepper activeStep={currentStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </DialogTitle>
      
      {currentStep === 0 && renderAdminVerification()}
      {currentStep === 1 && renderPasswordChange()}
    </Dialog>
  );
};

export default ChangePasswordDialog;
