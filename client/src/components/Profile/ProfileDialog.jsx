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
  Divider,
  Box,
  Chip,
} from '@mui/material';
import { Person, AdminPanelSettings } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const ProfileDialog = ({ open, onClose }) => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={2}>
          <Person />
          User Profile
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Username"
              value={user.username}
              disabled
              variant="outlined"
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="User ID"
              value={user.id}
              disabled
              variant="outlined"
            />
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Role
            </Typography>
            <Chip
              icon={user.role === 'admin' ? <AdminPanelSettings /> : <Person />}
              label={user.role === 'admin' ? 'Administrator' : 'User'}
              color={user.role === 'admin' ? 'primary' : 'default'}
              variant="outlined"
            />
          </Grid>
          
          {user.lastLogin && (
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Last Login"
                value={new Date(user.lastLogin).toLocaleString()}
                disabled
                variant="outlined"
              />
            </Grid>
          )}
          
          <Grid item xs={12}>
            <Divider />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Account Information
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              This profile information is managed by the system administrator.
              To update your details, please contact the admin.
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProfileDialog;
