import { createContext, useContext, useReducer } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_API_URL || '';

// Initial state
const initialState = {
  requests: [],
  stats: {
    total: 0,
    open: 0,
    inProgress: 0,
    closed: 0,
    recentRequests: 0,
  },
  loading: false,
  error: null,
  pagination: {
    current: 1,
    total: 1,
    count: 0,
    totalRecords: 0,
  },
  filters: {
    serviceNumber: '',
    status: '',
  },
};

// Action types
const SR_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_REQUESTS: 'SET_REQUESTS',
  SET_STATS: 'SET_STATS',
  ADD_REQUEST: 'ADD_REQUEST',
  UPDATE_REQUEST: 'UPDATE_REQUEST',
  DELETE_REQUEST: 'DELETE_REQUEST',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_FILTERS: 'SET_FILTERS',
  SET_PAGINATION: 'SET_PAGINATION',
};

// Reducer
const serviceRequestReducer = (state, action) => {
  switch (action.type) {
    case SR_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case SR_ACTIONS.SET_REQUESTS:
      return {
        ...state,
        requests: action.payload,
        loading: false,
        error: null,
      };
    case SR_ACTIONS.SET_STATS:
      return {
        ...state,
        stats: action.payload,
      };
    case SR_ACTIONS.ADD_REQUEST:
      return {
        ...state,
        requests: [action.payload, ...state.requests],
      };
    case SR_ACTIONS.UPDATE_REQUEST:
      return {
        ...state,
        requests: state.requests.map(req =>
          req._id === action.payload._id ? action.payload : req
        ),
      };
    case SR_ACTIONS.DELETE_REQUEST:
      return {
        ...state,
        requests: state.requests.filter(req => req._id !== action.payload),
      };
    case SR_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case SR_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    case SR_ACTIONS.SET_FILTERS:
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };
    case SR_ACTIONS.SET_PAGINATION:
      return {
        ...state,
        pagination: action.payload,
      };
    default:
      return state;
  }
};

// Create context
const ServiceRequestContext = createContext();

// Service Request provider component
export const ServiceRequestProvider = ({ children }) => {
  const [state, dispatch] = useReducer(serviceRequestReducer, initialState);

  // Get all service requests
  const getServiceRequests = async (page = 1, limit = 50) => {
    try {
      dispatch({ type: SR_ACTIONS.SET_LOADING, payload: true });

      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      // Add filters if they exist
      if (state.filters.serviceNumber) {
        params.append('serviceNumber', state.filters.serviceNumber);
      }
      if (state.filters.status) {
        params.append('status', state.filters.status);
      }

      const response = await axios.get(`/api/requests?${params}`);

      if (response.data.success) {
        dispatch({
          type: SR_ACTIONS.SET_REQUESTS,
          payload: response.data.data,
        });
        dispatch({
          type: SR_ACTIONS.SET_PAGINATION,
          payload: response.data.pagination,
        });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch requests';
      dispatch({
        type: SR_ACTIONS.SET_ERROR,
        payload: errorMessage,
      });
      toast.error(errorMessage);
    }
  };

  // Get dashboard statistics
  const getDashboardStats = async () => {
    try {
      const response = await axios.get(`/api/requests/stats`);
      if (response.data.success) {
        dispatch({
          type: SR_ACTIONS.SET_STATS,
          payload: response.data.data,
        });
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  // Create service request
  const createServiceRequest = async (requestData) => {
    try {
      dispatch({ type: SR_ACTIONS.SET_LOADING, payload: true });

      const response = await axios.post(`/api/requests`, requestData);

      if (response.data.success) {
        dispatch({
          type: SR_ACTIONS.ADD_REQUEST,
          payload: response.data.data,
        });
        toast.success('Service request created successfully!');
        return { success: true, data: response.data.data };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create request';
      dispatch({
        type: SR_ACTIONS.SET_ERROR,
        payload: errorMessage,
      });
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      dispatch({ type: SR_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Update service request
  const updateServiceRequest = async (id, requestData) => {
    try {
      dispatch({ type: SR_ACTIONS.SET_LOADING, payload: true });

      const response = await axios.put(`/api/requests/${id}`, requestData);

      if (response.data.success) {
        dispatch({
          type: SR_ACTIONS.UPDATE_REQUEST,
          payload: response.data.data,
        });
        toast.success('Service request updated successfully!');
        return { success: true, data: response.data.data };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update request';
      dispatch({
        type: SR_ACTIONS.SET_ERROR,
        payload: errorMessage,
      });
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      dispatch({ type: SR_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Delete service request
  const deleteServiceRequest = async (id) => {
    try {
      const response = await axios.delete(`/api/requests/${id}`);

      if (response.data.success) {
        dispatch({
          type: SR_ACTIONS.DELETE_REQUEST,
          payload: id,
        });
        toast.success('Service request deleted successfully!');
        return { success: true };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete request';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Upload RCA file
  const uploadRCAFile = async (file) => {
    try {
      const formData = new FormData();
      formData.append('rcaFile', file);

      const response = await axios.post('/api/requests/upload-rca', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        toast.success('File uploaded successfully!');
        return { success: true, filePath: response.data.filePath };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to upload file';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Export requests
  const exportRequests = async () => {
    try {
      const response = await axios.get(`/api/requests/export`, {
        responseType: 'blob',
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      const today = new Date().toISOString().split('T')[0];
      link.setAttribute('download', `service-requests-${today}.csv`);
      
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('Data exported successfully!');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to export data';
      toast.error(errorMessage);
    }
  };

  // Set filters
  const setFilters = (filters) => {
    dispatch({
      type: SR_ACTIONS.SET_FILTERS,
      payload: filters,
    });
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: SR_ACTIONS.CLEAR_ERROR });
  };

  const value = {
    ...state,
    getServiceRequests,
    getDashboardStats,
    createServiceRequest,
    updateServiceRequest,
    deleteServiceRequest,
    uploadRCAFile,
    exportRequests,
    setFilters,
    clearError,
  };

  return (
    <ServiceRequestContext.Provider value={value}>
      {children}
    </ServiceRequestContext.Provider>
  );
};

// Custom hook to use service request context
export const useServiceRequests = () => {
  const context = useContext(ServiceRequestContext);
  if (!context) {
    throw new Error('useServiceRequests must be used within a ServiceRequestProvider');
  }
  return context;
};
