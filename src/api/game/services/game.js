"use strict";

/**
 * game service.
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::game.game", ({ strapi }) => ({
  async create(ctx) {
    const { data } = ctx;
    const existingGame = await strapi.entityService.findMany("api::game.game", {
      filters: { api_id: data.api_id },
    });
    if (existingGame.length) {
      return existingGame[0];
    }
    const newGame = await strapi.entityService.create("api::game.game", {
      data,
    });
    return newGame;
  },
}));
