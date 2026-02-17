// Load environment variables from .env.production before starting Next.js
require('dotenv').config({ path: '.env.production' });

// Ensure NODE_ENV is set to production
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

// Start the Next.js server
require('./.next/standalone/server.js');
