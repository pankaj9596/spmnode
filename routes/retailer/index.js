const express = require("express");
const controller = require("./controller");
const router = express.Router();
router.post("/", controller.registerRetailer);
router.get("/validate", controller.validateEmail);
module.exports = router;