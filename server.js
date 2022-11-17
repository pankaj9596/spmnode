const express = require("express")
const http = require("http");
const { initializeServer } = require("./loaders");
const port = process.env.PORT || 8080;
(async function () {
    const app = express();
    await initializeServer(app);
    const server = http.createServer(app);
    server.listen(port, () => console.log(`Server is running on port : ${port}`))

})();