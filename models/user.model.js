import mongoose from "mongoose";
import JWT from "jsonwebtoken";
import bcrypt from "bcryptjs";

//Schema definition
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    otp:{
        type: String
    },
    otpExpiresAt: {
        type: Date
    },
    otpBlockedUntil:{
        type: Date
    },
    failedLoginAttempts:{
        type: Number,
        default: 0
    },
    accountLockedUntil:{
        type: Date
    },
    refreshToken: {
        type: String
    },
    provider:{
        type: String,
        enum: ["email", "google", "facebook"],
        default: "email"
    },
    googleId:{
        type: String
    },
    facebookId:{
        type: String
    }
},
{
    timestamps: true
}
);

//hashing password
userSchema.pre("save", async function (next) {
    if(!this.isModified("password"))return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

//hashing otps
userSchema.pre("save" ,async function (next) {
    if(!this.isModified("otp"))return next();
    const salt =  await bcrypt.genSalt(10);
    this.otp = await bcrypt.hash(this.otp, salt);
    next();
})

// compare passwords 

userSchema.methods.comparePassword = async function (password){
    return await bcrypt.compare(password, this.password);
}

//compare opt

userSchema.methods.compareOTP = async function (otp){
    return await bcrypt.compare(otp, this.otp);
}

//generate access token 

userSchema.methods.generateAccessToken = async function(){
    return JWT.sign(
        {
            _id: this._id,
            username: this.username,
            email: this.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );
}


//generate refresh token

userSchema.methods.generateRefreshToken = async function(){
    return JWT.sign(
        {
            _id: this._id,
            username: this.username,
            email: this.email
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

const User = mongoose.model("User", userSchema);
export default User