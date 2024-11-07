import mongoose, { Schema } from "mongoose";
const userSchema = new Schema(
  {
    username: {
      type: string,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    email: {
      type: string,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    fullName: {
      type: string,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    avatar: {
      type: string, // cloudnary url
      required: true,
    },

    coverImage: {
      type: string, // cloudnary url
    },

    password: {
      type: string,
      required: [true, "password is required"],
     
      
    },

    refreshToken: {
        type: string 
    },

    watchHistory:[
       {
        type: Schema.Types.ObjectId,
        ref: "Video"
       }
    ]
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
