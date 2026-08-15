module.exports = {
  apps: [
    {
      name: 'auth-service',
      script: 'node',
      args: 'services/auth-service/src/index.js',
      cwd: '/home/adolphe/IUM-MORAVE',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '256M',
      env: {
        NODE_ENV: 'production',
        PORT: 4001
      },
      error_file: '/home/adolphe/IUM-MORAVE/logs/auth-service.error.log',
      out_file: '/home/adolphe/IUM-MORAVE/logs/auth-service.out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true
    },
    {
      name: 'core-api',
      script: 'node',
      args: 'services/core-api/src/index.js',
      cwd: '/home/adolphe/IUM-MORAVE',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 4002
      },
      error_file: '/home/adolphe/IUM-MORAVE/logs/core-api.error.log',
      out_file: '/home/adolphe/IUM-MORAVE/logs/core-api.out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true
    },
    {
      name: 'finance-service',
      script: 'node',
      args: 'services/finance-service/src/index.js',
      cwd: '/home/adolphe/IUM-MORAVE',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '256M',
      env: {
        NODE_ENV: 'production',
        PORT: 4003
      },
      error_file: '/home/adolphe/IUM-MORAVE/logs/finance-service.error.log',
      out_file: '/home/adolphe/IUM-MORAVE/logs/finance-service.out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true
    },
    {
      name: 'notification-service',
      script: 'node',
      args: 'services/notification-service/src/index.js',
      cwd: '/home/adolphe/IUM-MORAVE',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '256M',
      env: {
        NODE_ENV: 'production',
        PORT: 4004
      },
      error_file: '/home/adolphe/IUM-MORAVE/logs/notification-service.error.log',
      out_file: '/home/adolphe/IUM-MORAVE/logs/notification-service.out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true
    },
    {
      name: 'web',
      script: 'npm',
      args: 'run start',
      cwd: '/home/adolphe/IUM-MORAVE/apps/web',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: '/home/adolphe/IUM-MORAVE/logs/web.error.log',
      out_file: '/home/adolphe/IUM-MORAVE/logs/web.out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true
    },
    {
      name: 'student-space',
      script: 'npm',
      args: 'run start',
      cwd: '/home/adolphe/IUM-MORAVE/apps/student-space',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      error_file: '/home/adolphe/IUM-MORAVE/logs/student-space.error.log',
      out_file: '/home/adolphe/IUM-MORAVE/logs/student-space.out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true
    },
    {
      name: 'teacher-space',
      script: 'npm',
      args: 'run start',
      cwd: '/home/adolphe/IUM-MORAVE/apps/teacher-space',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 3002
      },
      error_file: '/home/adolphe/IUM-MORAVE/logs/teacher-space.error.log',
      out_file: '/home/adolphe/IUM-MORAVE/logs/teacher-space.out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true
    },
    {
      name: 'admin-dashboard',
      script: 'npm',
      args: 'run start',
      cwd: '/home/adolphe/IUM-MORAVE/apps/admin-dashboard',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 3003
      },
      error_file: '/home/adolphe/IUM-MORAVE/logs/admin-dashboard.error.log',
      out_file: '/home/adolphe/IUM-MORAVE/logs/admin-dashboard.out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true
    }
  ]
};
