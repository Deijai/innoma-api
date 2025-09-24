import mongoose, { Schema } from "mongoose";

const specialtySchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    }
}, {
    timestamps: true, // Adiciona createdAt e updatedAt automaticamente
});

export const SpecialtyModel = mongoose.model('Specialty', specialtySchema);