import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { Message } from "@/model/user";

export async function POST(req: Request, res: Response){
    await dbConnect();
    const { username, content } = await req.json();

    try {
        const user = await UserModel.findOne({username})

        if(!user){
            return Response.json({
                success: false,
                message: "User not found",
            },{status: 404})
        }
        // is uesr accepting message or not
        if(!user.isAcceptingMessage){
            return Response.json({
                success: false,
                message: "User is not accepting messages",
            },{status: 403})
        }

        const newMessage = {
            content,
            createdAt: new Date(),
        }

        user.messages.push(newMessage as Message)
        await user.save()

        return Response.json({
            success: true,
            message: "Message sent successfully",
        },{status: 201})

    } catch (error) {
        console.log("An expected error occurred: ", error);
        return Response.json({
            success: false,
            message: "Error while sending message",
        }, {status: 403})
        
    }
}