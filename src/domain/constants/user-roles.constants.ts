export const USER_ROLES = {
    USER: 'USER',
    DOCTOR: 'DOCTOR',
    ADMIN: 'ADMIN',
    PATIENT: 'PATIENT'
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];