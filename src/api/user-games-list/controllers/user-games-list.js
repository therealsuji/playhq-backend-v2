"use strict";

/**
 *  user-games-list controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

const setList = (ctx, type) => {
  const { body } = ctx;
  const { user } = ctx.state;
  body.listType = type;
  body.user = user;
  ctx.body = body;


};

module.exports = createCoreController(
  "api::user-games-list.user-games-list",
  ({ strapi }) => ({
    async addToGameLibrary(ctx) {},
    async addToWishList(ctx) {},
    async setGameLibrary(ctx) {},
    async setWishList(ctx) {},
  })
);
