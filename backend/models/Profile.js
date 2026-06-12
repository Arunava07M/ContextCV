import mongoose from 'mongoose'

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  summary: {
    type: String,
    maxLength: 500
  },
  skills: [
    {
      domain: { type: String, required: true }, 
      items: [{ type: String, trim: true }]     
    }
  ],
  experience: [
    {
      company: { type: String, required: true },
      role: { type: String, required: true },
      startDate: { type: Date },
      endDate: { type: Date },
      current: { type: Boolean, default: false },
      description: { type: String }
    }
  ],
  education: [
    {
      institution: { type: String, required: true },
      degree: { type: String, required: true },
      fieldOfStudy: { type: String },
      yearOfPassing: { type: Number }
    }
  ]
}, { timestamps: true })

const Profile = mongoose.model('Profile', profileSchema)
export default Profile