const express = require("express");
const Routes = require("twilio/lib/rest/Routes");
const router = express.Router();
const authController = require("../controller/auth");

router.post("/register", authController.register);
router.post("/verifyOTP", authController.verifyOTP);
router.get("/userList", authController.getUserList);
router.post("/updateLocation", authController.updateCoordinates);
module.exports = router;
