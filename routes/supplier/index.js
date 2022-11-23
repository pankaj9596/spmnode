const express = require("express");
const controller = require("./controller");
const router = express.Router();
router.route("/")
    .get(controller.getAllSupplier);
router.route("/guest")
    .get(controller.getAllGuest)
    .post(controller.registerGuest);
router.get("/guest/validate", controller.validateEmail);
router.post("/guest/action", controller.executeAction);
module.exports = router;