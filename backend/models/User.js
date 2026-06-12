import mongoose from 'mongoose'

// basic user schema, keeping it simple for now
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // dont want duplicate accounts with same email
  },
  password: {
    type: String,
    required: true,
  },
}, {
  timestamps: true // adds createdAt and updatedAt automatically
})

const User = mongoose.model('User', userSchema)

export default User