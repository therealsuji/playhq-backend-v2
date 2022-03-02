"use strict";

/**
 * user-games-list router.
 */

const { createCoreRouter } = require("@strapi/strapi").factories;
module.exports = createCoreRouter("api::user-games-list.user-games-list", {
  only: [],
});
