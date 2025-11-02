import crypto from "crypto";

export const generateOTP = (length=6, expiryMinutes=10) => {
    const otp = crypto
        .randomInt(0,Math.pow(10,length))
        .toString()
        .padStart(length, "0");

    const otpExpiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

    return {otp, otpExpiresAt};
}

