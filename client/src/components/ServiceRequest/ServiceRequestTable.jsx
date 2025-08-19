import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Divider,
  Link,
  TablePagination,
} from '@mui/material';
import {
  Edit,
  Delete,
  Visibility,
  GetApp,
  Close,
} from '@mui/icons-material';

const ServiceRequestTable = ({ 
  requests, 
  onEdit, 
  onDelete, 
  onExport,
  pagination,
  onPageChange,
  loading 
}) => {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'error';
      case 'in-progress':
        return 'warning';
      case 'closed':
        return 'success';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedRequest(null);
  };

  const handleDeleteClick = (request) => {
    setRequestToDelete(request);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (requestToDelete) {
      onDelete(requestToDelete._id);
    }
    setDeleteConfirmOpen(false);
    setRequestToDelete(null);
  };

  const handleCancelDelete = () => {
    setDeleteConfirmOpen(false);
    setRequestToDelete(null);
  };

  const handleChangePage = (event, newPage) => {
    onPageChange(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    onPageChange(1, parseInt(event.target.value, 10));
  };

  return (
    <Box>
      {/* Export Button */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          startIcon={<GetApp />}
          onClick={onExport}
          sx={{ mb: 2 }}
        >
          Export Data
        </Button>
      </Box>

      {/* Table */}
      <Paper sx={{ overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'grey.100' }}>
                  SR Number
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'grey.100' }}>
                  Node
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'grey.100' }}>
                  Status
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'grey.100' }}>
                  Open Date
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'grey.100' }}>
                  Closed Date
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'grey.100' }}>
                  RCA
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'grey.100' }} align="center">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography>Loading...</Typography>
                  </TableCell>
                </TableRow>
              ) : requests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      No service requests found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                requests.map((request) => (
                  <TableRow
                    key={request._id}
                    hover
                    sx={{ cursor: 'pointer' }}
                    onClick={() => handleViewDetails(request)}
                  >
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {request.serviceNumber}
                      </Typography>
                    </TableCell>
                    <TableCell>{request.node || 'N/A'}</TableCell>
                    <TableCell>
                      <Chip
                        label={request.status}
                        color={getStatusColor(request.status)}
                        size="small"
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(request.openDate)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(request.closedDate)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {request.rcaFilePath ? (
                        <Link
                          href={request.rcaFilePath}
                          target="_blank"
                          rel="noopener"
                          onClick={(e) => e.stopPropagation()}
                        >
                          View File
                        </Link>
                      ) : (
                        'N/A'
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Box onClick={(e) => e.stopPropagation()}>
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => handleViewDetails(request)}
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => onEdit(request)}
                            color="primary"
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteClick(request)}
                            color="error"
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={pagination.totalRecords}
          rowsPerPage={50}
          page={pagination.current - 1}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Details Dialog */}
      <Dialog
        open={detailsOpen}
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Service Request Details</Typography>
          <IconButton onClick={handleCloseDetails}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedRequest && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Service Request Number
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedRequest.serviceNumber}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Node
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedRequest.node || 'N/A'}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Status
                </Typography>
                <Chip
                  label={selectedRequest.status}
                  color={getStatusColor(selectedRequest.status)}
                  size="small"
                  sx={{ textTransform: 'capitalize', mt: 0.5 }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Issue
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedRequest.issue || 'N/A'}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Open Date
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {formatDate(selectedRequest.openDate)}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Closed Date
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {formatDate(selectedRequest.closedDate)}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Mobitel Contact
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedRequest.responsePersonMobitel || 'N/A'}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Huawei Contact
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedRequest.responsePersonHuawei || 'N/A'}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Description
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedRequest.description || 'N/A'}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Work Around / Rectification
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedRequest.workAroundRectification || 'N/A'}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  RCA File
                </Typography>
                {selectedRequest.rcaFilePath ? (
                  <Link
                    href={selectedRequest.rcaFilePath}
                    target="_blank"
                    rel="noopener"
                  >
                    View RCA File
                  </Link>
                ) : (
                  <Typography variant="body1">N/A</Typography>
                )}
              </Grid>
            </Grid>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleCancelDelete}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this service request?
            <br />
            <strong>SR Number: {requestToDelete?.serviceNumber}</strong>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ServiceRequestTable;
