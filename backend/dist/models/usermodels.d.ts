import mongoose from "mongoose";
export interface IUser {
    name: string;
    email: string;
    passwordhash: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, mongoose.DefaultSchemaOptions> & IUser & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any, IUser>;
//# sourceMappingURL=usermodels.d.ts.map