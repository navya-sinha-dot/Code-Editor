import mongoose, { Document, Types } from "mongoose";
export type Role = "OWNER" | "EDITOR" | "VIEWER";
export type FileType = "FILE" | "FOLDER";
interface IRoomMember {
    userId: Types.ObjectId;
    role: Role;
    joinedAt: Date;
}
interface IFileNode {
    _id: Types.ObjectId;
    name: string;
    type: FileType;
    path: string;
    contentSnapshot?: string;
    children?: IFileNode[];
    updatedAt: Date;
}
export interface IRoom extends Document {
    name: string;
    createdBy: Types.ObjectId;
    members: IRoomMember[];
    files: IFileNode[];
    createdAt: Date;
    updatedAt: Date;
}
export declare const Room: mongoose.Model<IRoom, {}, {}, {}, mongoose.Document<unknown, {}, IRoom, {}, mongoose.DefaultSchemaOptions> & IRoom & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any, IRoom>;
export {};
//# sourceMappingURL=roommodels.d.ts.map