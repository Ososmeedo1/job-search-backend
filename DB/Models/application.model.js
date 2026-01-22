import mongoose from "mongoose";

const { Schema, model, Types, models } = mongoose;

const applicationSchema = new Schema(
  {
    jobId: {
      type: Types.ObjectId,
      ref: "Job",
      required: true
    },
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true
    },
    userResume: {
      URLs: {
        fileUrl: {
          type: String,
          required: true
        },
        filePath: {
          type: String,
          required: true,
          unique: true
        },
        fileId: {
          type: String,
          required: true
        }
      }
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

const Application = models.Application || model('Application', applicationSchema);

export default Application;