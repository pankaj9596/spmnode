const express = require("express");
const controller = require("./controller");
const router = express.Router();
router.route("/guest")
    .get(controller.getAllGuest)
    .post(controller.registerGuest);
module.exports = router;