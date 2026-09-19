const { httpServerHandler } = require("cloudflare:node");
const app = require("./app");

module.exports = httpServerHandler({ port: 3005 }, app);
