const mongoose = require('mongoose');
const { createHmac, randomBytes } = require("node:crypto");
const { createTokenForUser } = require('../utils/authentication');

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    salt: {
        type: String,
    },
    profileImageURL: {
        type: String,
        default: "/images/default.png"
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER"
    }
}, { timestamps: true });

// Pre-save hook to hash the password before saving
userSchema.pre('save', function (next) {

    const user = this; //current user

    // Only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    try {
        // Generate a salt
        const salt = randomBytes(16).toString('hex');

        // Hash the password with the salt
        const hashedPassword = createHmac('sha256', salt)
            .update(user.password)
            .digest("hex")

        //replace the encryprtion
        user.salt = salt;
        user.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});


// Static method to match password and generate token
userSchema.statics.matchPasswordAndGenerateToken = async function (email, password) {
    try {
        const user = await this.findOne({ email });
        if (!user) throw new Error('User not found!');

        const salt = user.salt;
        const hashedPassword = user.password;

        const userProvidedHash = createHmac('sha256', salt)
            .update(password)
            .digest('hex');

        if (hashedPassword !== userProvidedHash) throw new Error('Incorrect Password');

        const token = createTokenForUser(user);
        return token;
    } catch (error) {
        throw new Error(error.message);
    }
};


// Create the User model
const User = mongoose.model('user', userSchema);

module.exports = User;