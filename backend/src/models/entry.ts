import mongoose, { Document, Schema } from "mongoose";

export interface IEntry extends Document {
  username: string;
  score: number;
}

const entrySchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 24,
      unique: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 9_999_999,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

entrySchema.index({ username: 1 }, { unique: true });

const Entry = mongoose.model<IEntry>("Entry", entrySchema);

export default Entry;
