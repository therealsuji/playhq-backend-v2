module.exports = {
  routes: [
    {
      method: "POST",
      path: "/wish-list-games/add",
      handler: "user-games-list.addToWishList",
    },
    {
      method: "POST",
      path: "/library-games/add",
      handler: "user-games-list.addToGameLibrary",
    },
    {
      method: "POST",
      path: "/wish-list-games/set",
      handler: "user-games-list.setWishList",
    },
    {
      method: "POST",
      path: "/library-games/set",
      handler: "user-games-list.setGameLibrary",
    },
  ],
};
