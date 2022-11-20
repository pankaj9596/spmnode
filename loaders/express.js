const bodyparser = require("body-parser")
module.exports = async function (app, sequelizeConn) {
    //attach db client into middleware
    app.use((req, res, next) => {
        req.db = sequelizeConn;
        next();
    });
    app.use(bodyparser.json({ limit: "100mb" }))
    require("../routes")(app);
    app.get("/", (req, res) => res.send("Server is running fine....!!!!"));
}
