"use strict";

/**
 *  user-games-list controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
const setList = async (ctx, type) => {
    
}
const addToList = async (ctx, type) => {
  const data = ctx.request.body;
  const { user } = ctx.state;

  const game = await strapi.service("api::game.game").create({
    data: data.game,
  });
  const existingWishlist = await strapi.entityService.findMany(
    "api::user-games-list.user-games-list",
    {
      filters: { game: game.id, user: user.id, list_type: type },
    }
  );
  if (existingWishlist.length) {
    return existingWishlist[0];
  }
  return await strapi.entityService.create(
    "api::user-games-list.user-games-list",
    {
      data: {
        game: game.id,
        user: user.id,
        platform: data.platform,
        list_type: type,
      },
    }
  );
};

module.exports = createCoreController(
  "api::user-games-list.user-games-list",
  ({ strapi }) => ({
    async addToGameLibrary(ctx) {
      try {
        const body = await addToList(ctx, "LIBRARY");
        ctx.body = body;
      } catch (error) {
        console.log(error);
        ctx.badRequest("Invalid Platform id or Genre", error);
      }
    },
    async addToWishList(ctx) {
      try {
        const body = await addToList(ctx, "WISHLIST");
        ctx.body = body;
      } catch (error) {
        console.log(error);
        ctx.badRequest("Invalid Platform id or Genre", error);
      }
    },
    async setGameLibrary(ctx) {},
    async setWishList(ctx) {},
  })
);
