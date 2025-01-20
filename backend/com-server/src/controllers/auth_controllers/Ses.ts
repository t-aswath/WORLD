import { Request, Response } from "express";
import { pool, transporter } from "../../utils/config.js";

export default async function otp(req: Request, res: Response) {
    const { email, otp } = req.body;
    console.log("kljl")

    const mailOptions = {
        from: process.env.VERIFIED_EMAIL,
        to: email,
        subject: "OTP for Password Reset",
        text: `Your OTP is ${otp}`,
    };

    const result = (await pool.query("SELECT * FROM institutions WHERE mail=$1;", [email])).rows;
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "OTP sent successfully" });
}
