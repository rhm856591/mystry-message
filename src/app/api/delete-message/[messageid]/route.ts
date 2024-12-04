import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function DELETE(req: Request, res: Response, {params}: {params: {messageid: string}}){
    const messageid = params.messageid
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user
    if(!session && !user){
        return Response.json({
            success: false,
            message: "User not authenticated",
        },{status: 401,})
    }
    try {
        const updateResult = await UserModel.updateOne(
            {_id: user._id},
            {$pull: {messages: {_id: messageid}}}
        )
        if(updateResult.modifiedCount === 0){
            return Response.json({
                success: false,
                message: "Message not found or user not authorized to delete it",
            },{status: 404})
        }
        return Response.json({
            success: true,
            message: "Message Deleted",
        },{status: 200})
    } catch (error) {
        console.log("Error while deleting message", error);

        return Response.json({
            success: false,
            message: "Error while deleting message",
        },{status: 500})
        
    }

    
}