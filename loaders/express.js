const bodyparser = require("body-parser")
module.exports = async function (app, sequelizeConn) {
    //attach db client into middleware
    app.use((req, res, next) => {
        req.db = sequelizeConn;
        next();
    });
    app.use(bodyparser.json({ limit: "100mb" }));
    app.use((req, res, next) => {
        if (!req.user) req.user = "anonymous";
        next();
    })
    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE')
        res.setHeader('Access-Control-Allow-Headers', '*');
        next();
    })
    require("../routes")(app);
    app.get("/", (req, res) => res.send("Server is running fine....!!!!"));
}
