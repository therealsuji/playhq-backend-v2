module.exports = ({ env }) => ({
    'users-permissions': {
      config: {
        jwt: {
          expiresIn: '2d',
        },
      },
    },
  });