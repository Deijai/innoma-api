import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    roles: {
        type: [String],
        default: ['USER'],
        enum: ['USER', 'DOCTOR', 'ADMIN', 'PATIENT']
    },
    img: {
        type: String,
    },
    phone: {
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
    },

    // Campos específicos para DOCTOR
    specialties: [{
        type: Schema.Types.ObjectId,
        ref: 'Specialty',
    }],
    crm: {
        type: String,
        trim: true,
    },

    // Campos específicos para PATIENT
    birthDate: {
        type: Date,
    },
    cpf: {
        type: String,
        trim: true,
    },
    address: {
        street: { type: String, trim: true },
        number: { type: String, trim: true },
        complement: { type: String, trim: true },
        neighborhood: { type: String, trim: true },
        city: { type: String, trim: true },
        state: { type: String, trim: true },
        zipCode: { type: String, trim: true },
    }
}, {
    timestamps: true, // Adiciona createdAt e updatedAt automaticamente
});

export const UserModel = mongoose.model('User', userSchema);