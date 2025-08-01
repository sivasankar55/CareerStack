import mongoose from "mongoose";

const connectionSchem = new mongoose.Schema({
    sender:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending",
    },
},{timestamps: true});


const ConnectionRequest = mongoose.model("ConnectionRequest", connectionSchem);
export default ConnectionRequest;
