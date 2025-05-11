const db = require("../services/dboperations");
const userModel = require("../model/user");
const { generateOTP } = require("../utils/sms");

const register = async (req, res, next) => {
  try {
    console.log("req.body.mobile", req.body.mobile);
    let { mobile } = req.body;
    let searchObj = {
      mobile,
    };

    let user = await db.getData(userModel, searchObj);
    let otp = generateOTP();
    if (!user) {
      //   await userModel.create({ mobile, otp });
      //   let data = await db.insert(userModel, { mobile, otp });
      const user1 = new userModel({ mobile: mobile });
      let data = await user1.save();
      return res.send({ message: "user added", data: { otp }, status: true });
    } else {
      let update = await db.findAndUpdate(userModel, { mobile }, { otp: otp });
      console.log(update);
      return res.send({
        message: "user data updated",
        data: { otp },
        status: true,
      });
    }
  } catch (error) {
    return res.send({ error });
  }
};

const verifyOTP = async (req, res) => {
  try {
    let { mobile, otp } = req.body;
    let searchObj = {
      mobile,
      otp,
    };
    let user = await db.getData(userModel, searchObj);
    if (user.length > 0) {
      await db.findAndUpdate(userModel, { mobile }, { otp: null });
      return res.send({
        message: "OTP Verified",
        data: "successfull",
        status: true,
      });
    } else {
      return res.send({
        message: "Wrong verification code",
        data: "failed",
        status: false,
      });
    }
  } catch (error) {
    return res.send({ error });
  }
};

const getUserList = async (req, res) => {
  try {
    let users = await db.getData(userModel, {});
    return res.send({ message: "Users List", data: users });
  } catch (error) {
    return res.send({ error });
  }
};

const updateCoordinates = async (req, res) => {
  try {
    let { lat, long, mobile } = req.body;
    let searchObj = {
      mobile,
    };

    let user = await db.getData(userModel, searchObj);
    if (user && user.length > 0) {
      console.log("user", user);

      let data = await db.findAndUpdate(
        userModel,
        { mobile },
        { locationData: [...user[0].locationData, { lat, long }] }
      );
      return res.send({
        message: "Location updated",
        data: data,
        status: false,
      });
    } else {
      return res.send({
        message: "User not registered",
        data: "failed to save cordinates",
        status: false,
      });
    }
  } catch (error) {
    console.log("error", error);

    return res.send({ error });
  }
};

const userDetail = async (req, res) => {
  const { userName, userFaceImageData, mobile, isFaceVerified } = req.body;

  // Validate required fields
  if (!userName || !mobile) {
    return res
      .status(400)
      .json({
        message: "Invalid input: 'userName' and 'mobile' are required.",
      });
  }

  try {
    // Check if a user with the same mobile number already exists
    let user = await db.getData(userModel, { mobile });
    if (user) {
      return res
        .status(409)
        .json({ message: "User with this mobile number already exists." });
    }

    // Create a new user
    const newUser = new userModel({
      userName,
      userFaceImageData,
      mobile,
      isFaceVerified,
    });

    // Save the new user to the database
    const savedUser = await newUser.save();
    res
      .status(201)
      .json({ message: "User added successfully", userId: savedUser._id });
  } catch (err) {
    console.error("Error adding user:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// app.patch("/updateFaceVerification/:id", 
  
const updateFaceVerification = async (req, res) => {
  const userId = req.params.id; // Get user ID from the route parameter
  const { isFaceVerified } = req.body; // Get new status from the request body

  if (typeof isFaceVerified !== "boolean") {
    return res.status(400).json({ message: "Invalid input: 'isFaceVerified' must be a boolean." });
  }

  try {
    const updatedUser = await db.findAndUpdate(
      userModel,
      { mobile :userId},
      { isFaceVerified }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: "Face verification status updated successfully", user: updatedUser });
  } catch (err) {
    console.error("Error updating user:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
}


module.exports = {
  register,
  verifyOTP,
  getUserList,
  updateCoordinates,
  userDetail,
  updateFaceVerification
};
