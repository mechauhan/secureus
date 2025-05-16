const db = require("../services/dboperations");
const userModel = require("../model/user");
const { generateOTP } = require("../utils/sms");

const register = async (req, res, next) => {
  try {
    console.log("req.body.empId", req.body.empId);
    let { empId } = req.body;
    let searchObj = {
      empId,
    };

    let user = await db.getData(userModel, searchObj);
    let otp = generateOTP();
    if (!user) {
      //   await userModel.create({ empId, otp });
      //   let data = await db.insert(userModel, { empId, otp });
      const user1 = new userModel({ empId: empId });
      let data = await user1.save();
      return res.send({ message: "user added", data: { otp }, status: true });
    } else {
      let update = await db.findAndUpdate(userModel, { empId }, { otp: otp });
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
    let { empId, otp } = req.body;
    let searchObj = {
      empId,
      otp,
    };
    let user = await db.getData(userModel, searchObj);
    if (user.length > 0) {
      await db.findAndUpdate(userModel, { empId }, { otp: null });
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
    let { lat, long, empId } = req.body;
    let searchObj = {
      empId,
    };

    let user = await db.getData(userModel, searchObj);
    if (user && user.length > 0) {
      console.log("user", user);

      let data = await db.findAndUpdate(
        userModel,
        { empId },
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
  const { name, userFaceImageData, empId, isFaceVerified } = req.body;

  // Validate required fields
  if (!empId) {
    return res.status(400).json({
      message: "Invalid input: 'empId' are required.",
    });
  }

  try {
    // Check if a user with the same empId number already exists
    let user = await db.getData(userModel, { empId });
    console.log(user);
    if (user.length > 0) {
      // return res
      //   .status(409)
      //   .json({ message: "User with this empId number already exists." });
      const updatedUser = await db.findAndUpdate(
        userModel,
        { empId: empId },
        {
          name: name ? name : user[0].name,
          userFaceImageData: userFaceImageData
            ? userFaceImageData
            : user[0].userFaceImageData,
          isFaceVerified: isFaceVerified
            ? isFaceVerified
            : user[0].isFaceVerified,
        }
      );
      return res.status(200).json({
        message: "Data updated",
        // user: updatedUser,
      });
    }

    // Create a new user
    const newUser = new userModel({
      name,
      userFaceImageData,
      empId,
      isFaceVerified,
    });

    // Save the new user to the database
    const savedUser = await newUser.save();
   return  res.status(201).json({ message: "User added successfully", empId: empId });
  } catch (err) {
    console.error("Error adding user:", err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// app.patch("/updateFaceVerification/:id",

const updateFaceVerification = async (req, res) => {
  const userId = req.params.id; // Get user ID from the route parameter
  const { isFaceVerified } = req.body; // Get new status from the request body

  if (typeof isFaceVerified !== "boolean") {
    return res
      .status(400)
      .json({ message: "Invalid input: 'isFaceVerified' must be a boolean." });
  }

  try {
    const updatedUser = await db.findAndUpdate(
      userModel,
      { empId: userId },
      { isFaceVerified }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      message: "Face verification status updated successfully",
      // user: updatedUser,
    });
  } catch (err) {
    console.error("Error updating user:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getSingleUser = async (req, res) => {
  try {
    const userId = req.params.id;
    let user = await db.getData(userModel, { empId: userId });
    return res.send({ message: "User Details", data: user });
  } catch (error) {
    return res.send({ error });
  }
};

const getAllUsers = async (req, res) => {
  try {
    let user = await db.getData(userModel, {});
    return res.send({ message: "Users Detail", data: user });
  } catch (error) {
    return res.send({ error });
  }
};

module.exports = {
  register,
  verifyOTP,
  getUserList,
  updateCoordinates,
  userDetail,
  updateFaceVerification,
  getSingleUser,
  getAllUsers,
};
