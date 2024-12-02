import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helper/sendVerificatioEmail";
import { hash } from "crypto";

export async function POST(req: Request, res: Response) {
    await dbConnect();

    try {
        const {username , email, password} = await req.json();
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified : true,
        })
        if (existingUserVerifiedByUsername){
            return Response.json({
                success: false,
                message: "Username is already taken",
            }, {
                status: 400,
            })
        }

        const existingUserByEmail = await UserModel.findOne({
            email
        })
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return Response.json({
                    success: false,
                    message: "Email is already registered",
                }, {
                    status: 400,
                })
            }else{
                const hashedPassword = await bcrypt.hash(password,10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                await existingUserByEmail.save();   
            }
        }else{
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date;
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
            })
            await newUser.save();
        }

        // send verification email
        const emailResponse = await sendVerificationEmail(
            username,
            email,
            verifyCode
        )

        if(!emailResponse.success){
            return Response.json({
                success: false,
                message: "Failed to send verification email",
            }, {
                status: 500,
            })
        }

        return Response.json({
            success: true,
            message: "User register successfully.",
        }, {
            status: 201,
        })

    } catch (error) {
        console.error("Error registering user", error);
        return Response.json({
            success: false,
            message: "Error registering user",
        }, {
            status: 500,
        }
        )
    }
}