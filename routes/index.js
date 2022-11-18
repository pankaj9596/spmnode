module.exports = function (app) {
    app.use("/master", require("./master"));
    app.use("/platformrequest", require("./platformrequest"));
}