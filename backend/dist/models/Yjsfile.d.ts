import mongoose from "mongoose";
export declare const YjsFile: mongoose.Model<{
    snapshot: Buffer<ArrayBufferLike>;
    roomId: string;
    fileId: string;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    snapshot: Buffer<ArrayBufferLike>;
    roomId: string;
    fileId: string;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    snapshot: Buffer<ArrayBufferLike>;
    roomId: string;
    fileId: string;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    snapshot: Buffer<ArrayBufferLike>;
    roomId: string;
    fileId: string;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    snapshot: Buffer<ArrayBufferLike>;
    roomId: string;
    fileId: string;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
}>> & Omit<{
    snapshot: Buffer<ArrayBufferLike>;
    roomId: string;
    fileId: string;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    [path: string]: mongoose.SchemaDefinitionProperty<undefined, any, any>;
} | {
    [x: string]: mongoose.SchemaDefinitionProperty<any, any, mongoose.Document<unknown, {}, {
        snapshot: Buffer<ArrayBufferLike>;
        roomId: string;
        fileId: string;
    } & mongoose.DefaultTimestampProps, {
        id: string;
    }, mongoose.ResolveSchemaOptions<{
        timestamps: true;
    }>> & Omit<{
        snapshot: Buffer<ArrayBufferLike>;
        roomId: string;
        fileId: string;
    } & mongoose.DefaultTimestampProps & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, {
    snapshot: mongoose.mongo.Binary;
    roomId: string;
    fileId: string;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    snapshot: mongoose.mongo.Binary;
    roomId: string;
    fileId: string;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=Yjsfile.d.ts.map