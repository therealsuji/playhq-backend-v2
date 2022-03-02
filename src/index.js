"use strict";
const {
  setDefaultUserPermission,
  setSeedData,
  isFirstRun,
} = require("./utils/seedData");
const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    const shouldSetDefaultData = await isFirstRun();
    if (shouldSetDefaultData) {
      setSeedData(strapi);
      setDefaultUserPermission(strapi);
    }
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    strapi.firebase = admin;
  },
};
