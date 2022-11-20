const initExpress = require("./express");
const { initDB } = require("./mysql");
async function initializeServer(app) {
    const sequelizeConn = await initDB();
    await initExpress(app, sequelizeConn);
}
module.exports = { initializeServer };