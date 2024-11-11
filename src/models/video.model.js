import mongoose, {Schema} from "mongoose"
const videoSchema = new Schema({
    videofile:{
        type: string, //cloudinary url
        required: true

    },
    
    thumbnail:{
        type: string, //cloudinary url
        required: true
    
    },

    owner:{
        type: Schema.Types.ObjectId,
        ref: "User"
    },


    title: {
        type: string,
        required: true
    },

    description:{
        type: string,
        required: true
    },

    duration:{
        type: number
    },

    views:{
        type: number,
        default: 0
    },

    isPublished:{
        type: Boolean,
        default: true

    }



    
}, {timestamps:true})