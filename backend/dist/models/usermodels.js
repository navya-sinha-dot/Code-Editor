import mongoose, { Schema, Document } from "mongoose";
const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    passwordhash: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});
export const User = mongoose.model("User", UserSchema);
//# sourceMappingURL=usermodels.js.map