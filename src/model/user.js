const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

let Users = new Schema(
  {
    // UsersId: { type: Schema.ObjectId, ref: "Student" },
    name: { type: String, default: "", trim: true },
    empId: { type: String, unique: true, required: true },
    created_on: { type: Date, default: Date.now() },
    userFaceImageData: {
      type: String, // Store as base64 string or a URL to the image
    },
    isFaceVerified: {
      type: Boolean,
      // required: true,
      default: false,
    },
    locationData: [],
  },
  { versionKey: false }
);

module.exports = mongoose.model("Users", Users);
