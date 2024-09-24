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
    if (user) {
      await db.findAndUpdate(
        userModel,
        { mobile },
        { locationData: [...user.locationData, { lat, long }] }
      );
    } else {
      return res.send({
        message: "User not registered",
        data: "failed to save cordinates",
        status: false,
      });
    }
  } catch (error) {
    return res.send({ error });
  }
};
module.exports = { register, verifyOTP, getUserList, updateCoordinates };
