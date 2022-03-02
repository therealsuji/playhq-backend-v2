module.exports = {
  routes: [
    {
      method: "POST",
      path: "/user/auth",
      handler: "auth.auth",
      config: {
        policies: [],
        prefix: "",
      },
    },
    {
      method: "POST",
      path: "/user/renew-token",
      handler: "auth.renewToken",
      config: {
        policies: [],
        prefix: "",
      },
    },
  ],
};
