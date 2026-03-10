import mongoose, { Document, Schema, CallbackError } from "mongoose"
import bcrypt from "bcryptjs"

//  Interface 

export interface IUser extends Document {
  name: string
  email: string
  password: string
  createdAt: Date
  updatedAt: Date
  // Instance method — we'll call this to check passwords
  comparePassword(candidatePassword: string): Promise<boolean>
}

//  Schema
const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,                    
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"]
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,                  
      trim: true,
      lowercase: true,               
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email"
      ]
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false                  
    }
  },
  {
    timestamps: true                 
  }
)

//  Pre-save Hook 
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return

  const salt = await bcrypt.genSalt(12)
  this.password = await bcrypt.hash(this.password, salt)
})

//  Instance Method 
// Called on a user document to verify password during login
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password)
}

//  Model 
const User = mongoose.model<IUser>("User", UserSchema)

export default User