import mongoose, { Schema } from "mongoose";
const entrySchema = new Schema({
    username: { type: String, require: true },
    score: { type: Number, require: true },
});
const Entry = mongoose.model("Entry", entrySchema);
export default Entry;
//# sourceMappingURL=entry.js.map