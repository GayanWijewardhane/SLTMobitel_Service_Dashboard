import { Grid, Card, CardContent, Typography, Box, LinearProgress } from '@mui/material';
import {
  Assignment,
  Error,
  Pending,
  CheckCircle,
  TrendingUp,
} from '@mui/icons-material';

const DashboardStats = ({ stats, loading }) => {
  const statCards = [
    {
      title: 'Total Requests',
      value: stats.total,
      icon: <Assignment />,
      color: '#0054a6',
      gradient: 'linear-gradient(135deg, #0054a6, #00a9e0)',
    },
    {
      title: 'Open',
      value: stats.open,
      icon: <Error />,
      color: '#f44336',
      gradient: 'linear-gradient(135deg, #f44336, #ff7961)',
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      icon: <Pending />,
      color: '#ff9800',
      gradient: 'linear-gradient(135deg, #ff9800, #ffb74d)',
    },
    {
      title: 'Closed',
      value: stats.closed,
      icon: <CheckCircle />,
      color: '#4caf50',
      gradient: 'linear-gradient(135deg, #4caf50, #81c784)',
    },
  ];

  if (loading) {
    return (
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[1, 2, 3, 4].map((item) => (
          <Grid item xs={12} sm={6} lg={3} key={item}>
            <Card sx={{ height: 140 }}>
              <CardContent>
                <LinearProgress />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {statCards.map((stat, index) => (
        <Grid item xs={12} sm={6} lg={3} key={index}>
          <Card
            sx={{
              height: 140,
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'pointer',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                background: stat.gradient,
              },
            }}
          >
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {stat.title}
                  </Typography>
                  <Typography
                    variant="h3"
                    component="div"
                    sx={{
                      fontWeight: 800,
                      background: stat.gradient,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      lineHeight: 1,
                    }}
                  >
                    {stat.value}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 48,
                    height: 48,
                    borderRadius: 3,
                    background: stat.gradient,
                    color: 'white',
                    fontSize: 24,
                  }}
                >
                  {stat.icon}
                </Box>
              </Box>
              
              {/* Progress Bar */}
              <Box sx={{ mt: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={stats.total > 0 ? (stat.value / stats.total) * 100 : 0}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: 'rgba(0,0,0,0.1)',
                    '& .MuiLinearProgress-bar': {
                      background: stat.gradient,
                      borderRadius: 3,
                    },
                  }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                  {stats.total > 0 ? `${Math.round((stat.value / stats.total) * 100)}%` : '0%'} of total
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
      
      {/* Recent Activity Card */}
      <Grid item xs={12} lg={6}>
        <Card sx={{ height: 140 }}>
          <CardContent sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 56,
                  height: 56,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #8dc63f, #5e9e0c)',
                  color: 'white',
                  mr: 3,
                }}
              >
                <TrendingUp sx={{ fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Recent Activity (30 days)
                </Typography>
                <Typography variant="h4" fontWeight="bold" color="primary">
                  {stats.recentRequests || 0}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  New requests this month
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default DashboardStats;
