module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'a7309eb669cb07364adf32ce2cc95a42'),
  },
});
