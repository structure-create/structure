// next.config.js
/** @type {import('next').NextConfig} */
const PY_API_URL = process.env.PYTHON_API_URL || 'http://localhost:8000';

module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/claude',
        destination: `${PY_API_URL}/api/claude`,
      },
    ]
  },
}