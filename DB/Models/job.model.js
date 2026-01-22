
import mongoose, { model, Types } from "mongoose";



const jobSchema = new mongoose.Schema(
  {
  jobTitle: {
    type: String,
    required: true
  },
  jobLocation: {
    type: String,
    enum: ['onsite', 'remotley', 'hybrid'],
    required: true
  },
  workingTime: {
    type: String,
    enum: ['part-time', 'full-time'],
    required: true
  },
  experience: {
    type: Number,
    required: true
  },
  jobDescription: {
    type: String,
    required: true
  },
  technicalSkills: {
    type: [String],
    required: true
  },
  softSkills: {
    type: [String]
  },
  addedBy: {
    type: Types.ObjectId,
    ref: 'User'
  },
  company: {
    type: Types.ObjectId,
    ref: "Company",
    required: true
  }
}, 
{
  timestamps: true,
  versionKey: false
})


const Job = mongoose.models.Job || mongoose.model('Job', jobSchema);

export default Job;

