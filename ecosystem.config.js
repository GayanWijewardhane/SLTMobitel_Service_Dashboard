module.exports = {
  apps: [
    {
      name: 'sr-dashboard-backend',
      cwd: '/home/ns6/sr-dashboard-mern/server',
      script: 'server.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 5001
      },
      log_file: '/home/ns6/sr-dashboard-mern/logs/backend.log',
      error_file: '/home/ns6/sr-dashboard-mern/logs/backend-error.log',
      out_file: '/home/ns6/sr-dashboard-mern/logs/backend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      restart_delay: 1000,
      max_restarts: 10,
      min_uptime: '10s'
    },
    {
      name: 'sr-dashboard-frontend',
      cwd: '/home/ns6/sr-dashboard-mern/client',
      script: 'npx',
      args: 'vite preview --host 0.0.0.0 --port 5173',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production'
      },
      log_file: '/home/ns6/sr-dashboard-mern/logs/frontend.log',
      error_file: '/home/ns6/sr-dashboard-mern/logs/frontend-error.log',
      out_file: '/home/ns6/sr-dashboard-mern/logs/frontend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      restart_delay: 1000,
      max_restarts: 10,
      min_uptime: '10s'
    }
  ]
};
