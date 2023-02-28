const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 16,
  },
  email: {
    type: String,
    required: true,
    minLength: 6,
    maxLength: 100,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
    maxLength: 1024,
  },
  role: {
    type: String,
    enum: ["visitor", "member"],
    default: "member",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

userSchema.method("isVisitor", function () {
  return this.role == "visitor";
});

userSchema.method("isMember", function () {
  return this.role == "member";
});

userSchema.method("isAdmin", function () {
  return this.role == "admin";
});

// mongoose schema middleware
userSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    // if password is modified or the data you saved is new.
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } else {
    return next();
  }
});

userSchema.method("comparePassword", function (password, cb) {
  bcrypt.compare(password, this.password, (err, isMatch) => {
    if (err) {
      return cb(err, isMatch);
    } else {
      cb(null, isMatch);
    }
  }); // bcrypt.compare(the password user enter when sign in, the password saved in database)
});

const User = mongoose.model("User", userSchema);
module.exports = User;