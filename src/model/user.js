const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

let Users = new Schema(
  {
    // UsersId: { type: Schema.ObjectId, ref: "Student" },
    name: { type: String, default: "", trim: true },
    mobile: { type: Number, required: true, unique: true },
    created_on: { type: Date, default: Date.now() },
    otp: { type: Number, length: 6 },
    locationData: [],
  },
  { versionKey: false }
);

module.exports = mongoose.model("Users", Users);
