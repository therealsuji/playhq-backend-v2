var glob = require("glob-promise");
const { platforms, genres } = require("./data");

const isFirstRun = async () => {
  const pluginStore = strapi.store({
    environment: strapi.config.environment,
    type: "type",
    name: "setup",
  });
  const initHasRun = await pluginStore.get({ key: "initHasRun" });
  await pluginStore.set({ key: "initHasRun", value: true });
  return !initHasRun;
};

const setSeedData = async (strapi) => {
  const platformPromise = strapi.db.query("api::platform.platform").createMany({
    data: platforms,
  });
  const genrePromise = strapi.db.query("api::genre.genre").createMany({
    data: genres,
  });

  await Promise.allSettled([platformPromise, genrePromise]);
};

const setDefaultUserPermission = async (strapi) => {
  const routeFiles = await glob("./src/api/**/routes/*.js");
  const parsedRoutes = {};

  for (let path of routeFiles) {
    path = path.replace("./src/", "../");
    const route = require(path);
    for (let r of route.routes) {
      const handlerName = r.handler.split(".").slice(-2)[1];
      const controllerName = r.handler.split(".").slice(-2)[0];
      parsedRoutes[controllerName] = {
        ...parsedRoutes[controllerName],
        [handlerName]: r.config.auth === false ? false : true,
      };
    }
  }
  const roles = await strapi
    .service("plugin::users-permissions.role")
    .getRoles();
  const _public = await strapi
    .service("plugin::users-permissions.role")
    .getRole(roles.filter((role) => role.type === "public")[0].id);
  const _authenticated = await strapi
    .service("plugin::users-permissions.role")
    .getRole(roles.filter((role) => role.type === "authenticated")[0].id);

  for (const permission of Object.keys(_public.permissions)) {
    if (permission.startsWith("api")) {
      for (const controller of Object.keys(
        _public.permissions[permission].controllers
      )) {
        for (const handlerName of Object.keys(parsedRoutes[controller])) {
          _public.permissions[permission].controllers[controller][
            handlerName
          ].enabled = parsedRoutes[controller][handlerName] == false;
          _authenticated.permissions[permission].controllers[controller][
            handlerName
          ].enabled = parsedRoutes[controller][handlerName] != false;
        }
      }
    } else if (permission.includes("users-permissions")) {
      // manully set permission for the user-permissions plugin
      _public.permissions[permission].controllers['auth']['auth'].enabled = true
      _public.permissions[permission].controllers['user']['me'].enabled = false
      _public.permissions[permission].controllers['auth']['connect'].enabled = false
      // _public.permissions[permission].controllers['auth']['register'].enabled = false
      _public.permissions[permission].controllers['auth']['callback'].enabled = false

      _authenticated.permissions[permission].controllers['user']['me'].enabled = true
      _authenticated.permissions[permission].controllers['auth']['auth'].enabled = true
      _authenticated.permissions[permission].controllers['auth']['connect'].enabled = false
      _authenticated.permissions[permission].controllers['auth']['register'].enabled = false
      _authenticated.permissions[permission].controllers['auth']['callback'].enabled = false
      
    }
  }
  await strapi
    .service("plugin::users-permissions.role")
    .updateRole(_public.id, _public);
  await strapi
    .service("plugin::users-permissions.role")
    .updateRole(_authenticated.id, _authenticated);
};
module.exports = { setDefaultUserPermission, isFirstRun, setSeedData };
