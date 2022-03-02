const { auth, renewToken } = require("./user-permissions-controller");
const { routes } = require("./user-permission-routes");

module.exports = (plugin) => {
  plugin.controllers.auth["auth"] = auth;
  plugin.controllers.auth["renewToken"] = renewToken;

  plugin.routes["content-api"].routes.push(...routes);

  return plugin;
};
