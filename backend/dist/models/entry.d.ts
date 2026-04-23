import mongoose, { Document } from "mongoose";
export interface IEntry extends Document {
    username: string;
    score: number;
}
declare const Entry: mongoose.Model<IEntry, {}, {}, {}, mongoose.Document<unknown, {}, IEntry, {}, mongoose.DefaultSchemaOptions> & IEntry & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IEntry>;
export default Entry;
//# sourceMappingURL=entry.d.ts.map