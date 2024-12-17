import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';
const generateAccessAndRefreshToken= async(userID)=>{
  try{
    const user= User.findById(userID)
   const accessToken= User.generateAccessToken()
    const refreshToken= User.generateRefreshToken()
    user.refreshToken= refreshToken
    await user.save({validateBeforeSave:false})
    return {accessToken, refreshToken}

  }catch(error){
    throw new ApiError(500, "Something went wrong while generating access and refresh token")
  }

}
const registerUser = asyncHandler(async (req, res) => {
  //get user details from frontend
  const {fullName, userName, password, email} = req.body
  console.log("Email:", email)
  console.log("Files:", req.files)
  

  //check for validation(fields not empty)
  if([fullName, email, password, userName].some((field)=>field?.trim()===""))
  {
    throw new ApiError(400, "All fields are required")
  }
  

  //check if user already exists
 const existedUser=await User.findOne({
  $or:[{email}, {userName}]
 })

 if(existedUser){
  throw new ApiError(409, "User with email or userName already exists")
 }

  

  //check for images (Avatar and coverImage)
  const avatarLocalPath=req.files?.avatar[0]?.path
  console.log("avatarImageLocalPath", avatarLocalPath)
  const coverImageLocalPath=req.files?.coverImage[0]?.path

  if(!avatarLocalPath){
    throw new ApiError(400, "Avatar image is required")
  }
  

  //upload images to cloudinary
  const avatar=await uploadOnCloudinary(avatarLocalPath)
  const coverImage=await uploadOnCloudinary(coverImageLocalPath)
  if(!avatar){
    throw new ApiError(400, "Avatar is required")
  }



  

  //user user entry in db
  const user= await User.create({
    email,
    password,
    fullName,
    userName:userName.toLowerCase(),
    avatar:avatar.url,
    coverImage:coverImage?.url||"" 

  })
  

  //remove password and refresh token from the response and check for user creation
  const createdUser=await User.findById(user._id).select("-password -refreshToken")
  if(!createdUser){
    throw new ApiError(500, "Something went wrong while creating user")
  }
  
  //return res
  return res.status(201).json(
    new ApiResponse(200, createdUser, "User created successfully")
  )
});

const loginUser= asyncHandler(async(req, res)=>{
  //get data from req.body
  const{fullName, password, userName, email}= req.body
  //cheeck for userName and email
  if(!userName|| !email){
    throw new ApiError(400, "UserName or password is required")
  }
  //find te user

 const user= await User.findOne({
    $or:[{email}, {userName}]
  })

  if(!user){
    throw new ApiError(404, "User doesn't exist")
  }
  //check for password
  const isPasswordValid= await user.isPasswordCorrect(password)
  if(!isPasswordValid){
    throw new ApiError(401, "Invalid user credentials")
  }

  //access and refresh token

 
 const{accessToken, refreshToken}= await generateAccessAndRefreshToken(user._id)
 const loggedInUser=await User.findById(user._id).select("-password -refreshToken")
  //send cookie

  const options={
    httpOnly:true,
    secure:true
  }
  //return response
  return res.status(200)
  .cookie("accessToken", accessToken, options)
  .cookile("refreshToken", refreshToken, options)
  .json(
    new ApiResponse(200,
      {
        user,
        loggedInUser,
        accessToken,
        refreshToken
      }, "User logged in successfully"
    )
  )
})

export { registerUser, loginUser };
