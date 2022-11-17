const initExpress = require("./express");
const { initDB } = require("./mysql");
async function initializeServer(app) {
    const sequelizeConn = await initDB();
    app.use((req, res, next) => {
        req.db = sequelizeConn;
        next();
    });
    await initExpress(app);

}
module.exports = { initializeServer };