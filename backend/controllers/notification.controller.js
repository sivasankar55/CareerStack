import Notification from "../models/notification.model.js";

export const getUserNotification = async (req,res) => {
    try {
        const user = req.user._id
        const notification = await Notification.find({user: user}).sort({createdAt: -1})
        .populate("relatedUser", "name username profilePicture")
        .populate("relatedPost", "content image");

        res.status(200).json(notification);
    } catch (error) {
        console.error("Error in getUserNotification controller:", error);
        res.status(500).json({message:"Internal server error"});
    }
};

export const makeNotificationAsRead = async (req, res)  => {
    try {
        const notificationId = req.params.id;

        const notification = await Notification.findByIdAndUpdate({ _id: notificationId, recipient : req.user._id},
            {read: true},
            {new: true}
        );

        res.json(notification);
    } catch (error) {
        console.error("Error in markNotificationRead controller:", error);
        res.status(500).json({message:"Internal server error"});
    }
};


export const deleteNotification = async (req,res) => {
    try {
        const notificationId = req.params.id;

        await Notification.findByIdAndDelete({
            _id: notificationId,
            recipient: req.user._id,
        });

        res.status(200).json({message:"Notification deleted successfully"});
    } catch (error) {
        console.error("Error in deleteNotification controller:", error);
        res.status(500).json({message:"Internal server error"});
    }
};