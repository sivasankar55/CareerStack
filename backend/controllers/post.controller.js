import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import cloudinary from "../lib/cloudinary.js";
import { sendCommentNotificationEmail } from "../emails/emailHandlers.js";
export const getFeedPosts =async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        if(!user) return res.status(404).json({error: "User not found"});

        const posts = await Post.find({author:{$in:[...req.user.connections, userId]}}).populate("author","name username profilePicture headline")
        .populate("comments.user", "name profilePicture")
        .sort({createdAt:-1}) // to get latest posts
        
        res.status(200).json(posts);
    } catch (error) {
        console.error("Error in getFeedPosts controller",error);
        res.status(500).json({message:"Internal server error"});
    }
};

export const createPost = async (req,res) => {
    try {

        const {content, image} = req.body;
        const author = req.user._id;
        let newPost;
        
        if(image) {
            const imgResult = await cloudinary.uploader.upload(image);
            newPost = await Post({
                author,
                content,
                image: imgResult.secure_url,
            });
        } else {
            newPost = await Post({
                author,
                content,
            });
        }
        await newPost.save();

        res.status(201).json(newPost);
        
    } catch (error) {
        console.error("Error in createPost controller",error);
        res.status(500).json({message:"Internal server error"});
    }
};

export const deletePost = async(req,res) => {
    try {
        const postId = req.params.id;
        const userId = req.user._id;

        const post  = await Post.findById(postId);

        if(!post) {
            return res.status(404).json({message:"Post not found"});
        }

        if(post.author.toString() !== userId.toString()) {
            return res.status(403).json({message:"You are not authorized to delete this post"});
        }

        if(post.image) {
            await cloudinary.uploader.destroy(post.image.split("/").pop().split(".")[0]);
        }
        await Post.findByIdAndDelete(postId);

        res.status(200).json({message:"Post deleted successfully"});

    } catch (error) {
        console.log("Error in delete post controller", error.message);
		res.status(500).json({ message: "Server error" });
    }
};

export const getPostById = async (req,res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId)
        .populate("author","name username profilePicture headline")
        .populate("comments.user","name profilePicture");

        res.status(200).json(post);

    } catch (error) {
        console.error("Error in getPostById controller:", error);
		res.status(500).json({ message: "Server error" });
    }
};

export const createComment = async(req,res) => {
    try {
        const postId = req.params.id;
        const {content} = req.body;
        const userId = req.user._id;

        const post = await Post.findByIdAndUpdate(postId,{
            $push:{
                comments: {
                    user: userId,
                    content,
                }},
            },
            {new:true}
           
        ).populate("author","name username profilePicture headline")

        if(post.author._id.toString() !== userId.toString()) {
            const newNotification = await Notification({
                recipient: post.author,
                type: "comment",
                relatedUser: userId, //currnet user who is commenting
                relatedPost: postId,
            });

            await newNotification.save();

            try {
                const postUrl = process.env.CLIENT_URL + "/post/" + postId;
                await sendCommentNotificationEmail(
                    post.author.email,
                    post.author.name,
                    post.content,
                    postUrl,  
                    content
            );
            } catch (error) {
                console.log("Error in sending comment notification email:", error);
            }
      
        }
        res.status(201).json(post);

    } catch (error) {
        console.log("Error in sending comment notification email:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const likePost = async(req,res) => {
    try{
       const postId = req.params.id;
       const post  = await Post.findById(postId);
       const userId = req.user._id;

       if(post.likes.includes(userId)) {
        post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
       }else{
        post.likes.push(userId);

        if(post.author.toString() !== userId.toString()) {
            const newNotification = await Notification({
                recipient: post.author,
                type: "like",
                relatedUser: userId,
                relatedPost: postId,
            });

            await newNotification.save();
        }
       }

       await post.save();
       res.status(200).json(post);
    }catch(error){
        console.error("Error in likePost controller:", error);
		res.status(500).json({ message: "Server error" });
    }
}; 