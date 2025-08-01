import User from "../models/user.model";
import ConnectionRequest from "../models/connection.model";
import { sendConnectionAcceptedEmail } from "../emails/emailHandlers";

export const sendConnectionRequest = async(req,res) => {
    try {
        const {userId} = req.params;
        const senderId = req.user._id;  

        if(senderId.toString() === userId) {
           return res.status(400).json({message: "You can't send a request to yourself"});
        }

        if(req.user.connection.includes(userId)) {
            return res.status(400).json({message: "You are already connected with this user"});
        }

        const existingRequest = await ConnectionRequest.findOne({sender: senderId, recipient: userId,
            status: "pending",
        });

        if(existingRequest) {
            return res.status(400).json({message:" A connection request is already exists"})
        }

        const newRequest = new ConnectionRequest({
            sender: senderId, 
            recipient: userId,
        });

        await newRequest.save();

        res.status(201).json({message:"Connection request send successfully"});
    } catch (error) {
        console.error("Error in sendConnectionRequest controller:", error);
        res.status(500).json({message:"Internal server error"});
    }
};

export const acceptConnectionRequest = async (req,res) => {
   try {
    const {requestId} = req.params;
    const userId = req.user._id;

    const request = await ConnectionRequest.findById(requestId)
        .populate("sender", "name,email,username")
        .populate("recipient", "name, username");
      
        if(!request) {
            return res.status(404).json({message:"Request not found"});
        }

        //check if the req is for the current user

        if(request.recipient.toString() !== userId) {
            return res.status(403).json({message:"You are not authorized to accept this request"});
        }

        if(request.status !== "pending") {
            return res.status(400).json({message:"Request is already processed"});
        }

        request.status = "accepted";
        await request.save();

        // if your friend then ur also my friend
         await User.findByIdAndUpdate(userId,{$addToSet:{connections: request.sender._id}});
         await User.findByIdAndUpdate(request.sender._id,
            {$addToSet:{connections: userId}});

            const Notification = await Notification({
                recipient: request.sender._id,
                type: "connectionRequestAccepted",
                relatedUser: userId,
            });

            await Notification.save();

            res.status(200).json({message:"Connection request accepted successfully"});

            const senderEmail = request.sender.email;
            const senderName = request.sender.name;
            const recipientName = request.recipient.name;
            const profileUrl = process.env.CLIENT_URL + "/profile/" + request.recipient.username;

            try {
                await sendConnectionAcceptedEmail(senderEmail,senderName,recipientName,
                    profileUrl
                );
            } catch (error) {
                console.error("Error in sendConnectionAcceptedEmail:",error);
            }

   } catch (error) {
    console.error("Error in acceptConnectionRequest controller:", error);
    res.status(500).json({message:"Internal server error"});
   }
};

export const rejectConnectionRequest = async (req,res) => {
    try {
        const {requestId} = req.params;
        const userId = req.user._id;

        const request = await ConnectionRequest.findById(requestId);

        if(request.recipient.toString() !== userId) {
            return res.status(403).json({message:"You are not authorized to reject this request"});
        }

        if(request.status !== "pending") {
            return res.status(400).json({message:"Request is already processed"});
        }

        request.status = "rejected";
        await request.save();

        res.status(200).json({message:"Connection request rejected "});

    } catch (error) {
        console.error("Error in rejectConnectionRequest controller:", error);
        res.status(500).json({message:"Internal server error"});
    }
}

export const getConnectionRequests = async (req,res) => {
    try {
        const userId = req.user._id;

        const requests = await ConnectionRequest.find({recipient: userId, status: "pending"}).populate("sender", "name username profilePicture headline connections");
        
        res.json(requests);
    } catch (error) {
        console.error("Error in getConnectionRequests controller:", error);
        res.status(500).json({message:"Internal server error"});
    }
};

export const getConnections = async (req,res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId).populate("connections", "name username profilePicture headline connectiojns");

        res.json(user.connections);
    } catch (error) {
        console.error("Error in getConnections controller:", error);
        res.json.status(500).json({message:"Internal server error"});
    }
};

export const removeConnection = async (req,res) => {
    try {
        const myId = req.user._id;
        const {userId} = req.params;

        await User.findByIdAndUpdate(myId,{$pull:{connections: userId}});
        await User.findByIdAndUpdate(userId,{$pull:{connections: myId}});

        res.json({message:"Connection removed successfully"});
    } catch (error) {
        console.error("Error in removeConnection controller:", error);
		res.status(500).json({ message: "Server error" });
    }
};

export const getConnectionStatus = async (req,res) => {
    try {
        const targetUserId = req.params.userId;
        const currentUserId = req.user._id;

        const currentUser = req.user;
        if(currentUser.connections.includes(targetUserId)){
            return res.json({status: "connected"});
        } 

        const pendingRequest = await ConnectionRequest.findOne({
            $or: [
                {sender: currentUserId, recipient: targetUserId},
                {sender: targetUserId, recipient: currentUserId},
            ],
            status: "pending",
        });

        if(pendingRequest) {
            if(pendingRequest.sender.toString() === currentUserId.toString()) {
                return res.json({status: "pending"});
            }else{
                return res.json({status: "received",requestId: pendingRequest._id});
            }
        }

        res.json({status: "notConnected"});
    } catch (error) {
        console.error("Error in getConnectionStatus controller:", error);
		res.status(500).json({ message: "Server error" });
    }
};