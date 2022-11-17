const bodyparser = require("body-parser")
module.exports = async function (app) {
    app.use(bodyparser.json({ limit: "100mb" }))
    require("../routes")(app);
    app.get("/", (req, res) => res.send("Server is running fine....!!!!"));
}
