import User from "../models/user.model.js";

export const getSuggestedConnections=async (req,res) => {
    try {
        const currentUser = await User.findById(req.user._id).select("connections");

        //find users whho are not already connected to the current user
        const suggestedUsers = await User.find({
            _id: {
                $ne: req.user._id, // exclude current user 
                $nin: currentUser.connections // current user connections exclude
            },
        })
        .select("name username profilePicture headline")
        .limit(3);

        res.json(suggestedUsers);

    } catch (error) {
     console.error("Error in getSuggestedConnections controller",error);   
     res.status(500).json({message:"Internal server error"});
    }
};

export const getPublicProfile= async (req,res) => {
    try {
        const user = await User.findOne({username: req.params.username}).select("-password");

        if(!user) {
            return res.status(404).json({message:"User not found"}); 
        }
        res.json(user);
    } catch (error) {
        console.error("Error in getPublicProfile controller",error);
        res.status(500).json({message:"Internal server error"});
    }
};

export const updateProfile = async (req,res) => {
    try {
        const allowedFields = [
            "name", 
            "username",
            "headline",
            "about",
            "location",
            "profilePicture",
            "bannerImg",
            "skills",
            "experience",
            "education"
        ];

        const  updatedData = {};

        for(const field of allowedFields) {
            if(req.body[field]) {
                updatedData[field] = req.body[field];
            }
        }
        //todo for images 

        const user = await User.findByIdAndUpdate(req.user._id,{$set:updatedData},{new:true}).select("-password");

        res.json(user);
    } catch (error) {
        console.error("Error in updateProfile controller",error);
        res.status(500).json({message:"Internal server error"});
    }
}