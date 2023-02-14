const mongoose = require("mongoose");

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
        required: true,
        enum: ["visitor", "member"],
        default: "visitor"
    },
    date: {
        type: Date,
        default: Date.now,
    }
});

userSchema.method.isVisitor = function() {
    return this.role == "visitor";
}

userSchema.method.isMemboer = function() {
    return this.role == "member";
}

// mongoose schema middleware
userSchema.pre("save");