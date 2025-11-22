import mongoose, { Document, Schema } from "mongoose";

export interface IEntry extends Document {
  username: string;
  score: number;
}

const entrySchema: Schema = new Schema({
  username: { type: String, require: true },
  score: { type: Number, require: true },
});

const Entry = mongoose.model<IEntry>("Entry", entrySchema);

export default Entry;
