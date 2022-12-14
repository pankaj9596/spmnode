const express = require("express");
const controller = require("./controller");
const router = express.Router();
router.route("/")
    .get(controller.getAllRequest)
    .post(controller.registerRetailer);
router.get("/validate", controller.validateEmail);
router.post("/action", controller.executeAction)
module.exports = router;