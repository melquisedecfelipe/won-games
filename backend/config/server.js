module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 3333),
  admin: {
    auth: {
      secret: env('ADMIN_JWT_SECRET', '8ca9d94af059f1f1736841b408a7f4b8'),
    },
  },
});
