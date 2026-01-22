
import mongoose, { Types } from "mongoose";



const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      unique: true
    },
    description: {
      type: String,
      required: true
    },
    industry: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    numOfEmployees: {
      from: {
        type: Number,
        required: true
      },
      to: {
        type: Number,
        required: true
      }
    },
    companyEmail: {
      type: String,
      required: true,
      unique: true
    },
    company_hr: {
      type: Types.ObjectId,
      ref: "User",
      required: true
    }
  }, 
  {
    timestamps: true,
    versionKey: false
  }
)


const Company = mongoose.models.Company || mongoose.model('Company', companySchema);

export default Company;


