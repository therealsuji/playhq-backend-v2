const { sanitizeUser } = require("../../utils/helper");

const getUserAuthBody = async (user, ctx) => {
  const sanitizedUser = await sanitizeUser(user, ctx);
  const jwt = await strapi.service("plugin::users-permissions.jwt").issue({
    id: user.id,
  });
  const refreshToken = await strapi
    .service("plugin::users-permissions.jwt")
    .issue(
      {
        id: user.id,
      },
      { expiresIn: "7d" }
    );
  return {
    user: sanitizedUser,
    jwt,
    refreshToken,
  };
};

module.exports = {
  async auth(ctx) {
    const { token, fcmToken } = ctx.request.body;
    try {
      const decodedToken = await strapi.firebase.auth().verifyIdToken(token);

      if (decodedToken.email) {
        ctx.body = "done";
        const existingUser = await strapi
          .service("plugin::users-permissions.user")
          .fetch({ email: decodedToken.email });
        if (existingUser) {
          const body = await getUserAuthBody(existingUser, ctx);
          ctx.body = body;
        } else {
          const defaultRole = await strapi
            .query("plugin::users-permissions.role") 
            .findOne({ where: { type: advanced.default_role } });
          const params = {};
          params.role = defaultRole.id;
          params.email = decodedToken.email;
          params.username = decodedToken.email.split("@")[0];
          params.confirmed = true;
          params.notification_token = fcmToken;
          const user = await strapi
            .service("plugin::users-permissions.user")
            .add(params);
          const body = await getUserAuthBody(user, ctx);
          ctx.body = body;
        }
      } else {
        ctx.badRequest("Invalid Token");
      }
    } catch (error) {
      console.log(error);
      ctx.badRequest("Invalid Token");
    }
  },
  async renewToken(ctx) {},
};
