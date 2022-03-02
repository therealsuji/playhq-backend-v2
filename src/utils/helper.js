const { sanitize } = require("@strapi/utils");

const sanitizeUser = async (user, ctx) => {
  const { auth } = ctx.state;
  const userSchema = strapi.getModel("plugin::users-permissions.user");
  return sanitize.contentAPI.output(user, userSchema, { auth });
};
module.exports = {
  sanitizeUser,
};
