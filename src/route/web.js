const express = require("express");
const Routes = require("twilio/lib/rest/Routes");
const router = express.Router();
const authController = require("../controller/auth");

router.post("/register", authController.register);
router.post("/verifyOTP", authController.verifyOTP);
router.get("/userList", authController.getUserList);
router.post("/updateLocation", authController.updateCoordinates);
router.post("/addUpdateUser", authController.userDetail);
router.patch(
  "/updateFaceVerification/:id",
  authController.updateFaceVerification
);
router.get("/getSingleUser/:id", authController.getSingleUser);
router.get("/getAllUsers", authController.getAllUsers);
module.exports = router;
