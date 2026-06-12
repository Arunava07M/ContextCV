import mongoose from 'mongoose'

const vaultEntrySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  type: {
    type: String, 
    default: 'Project'
  },
  techStack: [{
    type: String,
    trim: true
  }],
  dateOrDuration: {
    type: String 
  },
  bullets: [{
    type: String 
  }],
  embedding: {
    type: [Number]
  }
}, { timestamps: true })

const VaultEntry = mongoose.model('VaultEntry', vaultEntrySchema)
export default VaultEntry