import mongoose, { Document, Types } from "mongoose";
export interface IMessage extends Document {
    roomId: Types.ObjectId;
    userId: Types.ObjectId;
    text: string;
    createdAt: Date;
}
export declare const Message: mongoose.Model<IMessage, {}, {}, {}, mongoose.Document<unknown, {}, IMessage, {}, mongoose.DefaultSchemaOptions> & IMessage & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any, IMessage>;
//# sourceMappingURL=msgmodels.d.ts.map