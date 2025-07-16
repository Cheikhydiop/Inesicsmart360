"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const customErrors_1 = require("../../errors/customErrors");
// Énumération des rôles utilisateur
const UserRoleEnum = zod_1.z.enum([
    'ADMIN',
    'PROJECT_MANAGER',
    'SUPERVISOR',
    'TECHNICIAN',
    'CONTRACTOR',
    'CLIENT',
    'GOVERNMENT',
    'CALL_CENTER',
    'AUDITOR',
    'CITIZEN'
]);
// Schéma de validation pour l'inscription
const registerSchema = zod_1.z.object({
    name: zod_1.z
        .string({
        required_error: "Le nom est requis",
        invalid_type_error: "Le nom doit être une chaîne de caractères"
    })
        .min(2, "Le nom doit contenir au moins 2 caractères")
        .max(50, "Le nom ne peut pas dépasser 50 caractères")
        .trim(),
    email: zod_1.z
        .string({
        required_error: "L'email est requis",
        invalid_type_error: "L'email doit être une chaîne de caractères"
    })
        .email("Format d'email invalide")
        .toLowerCase()
        .trim(),
    password: zod_1.z
        .string({
        required_error: "Le mot de passe est requis",
        invalid_type_error: "Le mot de passe doit être une chaîne de caractères"
    })
        .min(8, "Le mot de passe doit contenir au moins 8 caractères")
        .max(128, "Le mot de passe ne peut pas dépasser 128 caractères")
        .regex(/[a-z]/, "Le mot de passe doit contenir au moins une lettre minuscule")
        .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une lettre majuscule")
        .regex(/\d/, "Le mot de passe doit contenir au moins un chiffre")
        .regex(/[!@#$%^&*(),.?":{}|<>]/, "Le mot de passe doit contenir au moins un caractère spécial"),
    role: UserRoleEnum.refine((value) => value !== undefined, { message: "Le rôle est requis" }),
    organization: zod_1.z
        .string()
        .max(100, "Le nom de l'organisation ne peut pas dépasser 100 caractères")
        .trim()
        .optional(),
    phoneNumber: zod_1.z
        .string()
        .regex(/^[\+]?[1-9][\d\s\-\(\)]{7,15}$/, "Format de numéro de téléphone invalide")
        .trim()
        .optional(),
    jobTitle: zod_1.z
        .string()
        .max(100, "Le titre du poste ne peut pas dépasser 100 caractères")
        .trim()
        .optional(),
    department: zod_1.z
        .string()
        .max(100, "Le nom du département ne peut pas dépasser 100 caractères")
        .trim()
        .optional(),
});
// Schéma de validation pour la connexion
const loginSchema = zod_1.z.object({
    email: zod_1.z
        .string({
        required_error: "L'email est requis",
        invalid_type_error: "L'email doit être une chaîne de caractères"
    })
        .email("Format d'email invalide")
        .toLowerCase()
        .trim(),
    password: zod_1.z
        .string({
        required_error: "Le mot de passe est requis",
        invalid_type_error: "Le mot de passe doit être une chaîne de caractères"
    })
        .min(1, "Le mot de passe ne peut pas être vide"),
});
// Schéma pour la validation de mot de passe seul
const passwordSchema = zod_1.z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .max(128, "Le mot de passe ne peut pas dépasser 128 caractères")
    .regex(/[a-z]/, "Le mot de passe doit contenir au moins une lettre minuscule")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une lettre majuscule")
    .regex(/\d/, "Le mot de passe doit contenir au moins un chiffre")
    .regex(/[!@#$%^&*(),.?":{}|<>]/, "Le mot de passe doit contenir au moins un caractère spécial");
class UserValidator {
    /**
     * Validation des données d'inscription
     */
    static validateRegister(data) {
        try {
            return registerSchema.parse(data);
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                const errorMessages = error.errors.map(err => err.message);
                throw new customErrors_1.ValidationError(errorMessages); // on envoie un tableau
            }
            throw new customErrors_1.ValidationError(['Erreur de validation inconnue']);
        }
    }
    /**
     * Validation des données de connexion
     */
    static validateLogin(data) {
        try {
            return loginSchema.parse(data);
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                const errorMessages = error.errors.map(err => err.message);
                throw new customErrors_1.ValidationError(errorMessages.join(', '));
            }
            throw new customErrors_1.ValidationError('Erreur de validation inconnue');
        }
    }
    /**
     * Validation du mot de passe seul
     */
    static validatePassword(password) {
        try {
            passwordSchema.parse(password);
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                const errorMessages = error.errors.map(err => err.message);
                throw new customErrors_1.ValidationError(errorMessages.join(', '));
            }
            throw new customErrors_1.ValidationError('Erreur de validation du mot de passe');
        }
    }
    /**
     * Validation partielle pour mise à jour (tous les champs optionnels)
     */
    static validateUpdate(data) {
        try {
            const updateSchema = registerSchema.partial().omit({ password: true });
            return updateSchema.parse(data);
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                const errorMessages = error.errors.map(err => err.message);
                throw new customErrors_1.ValidationError(errorMessages.join(', '));
            }
            throw new customErrors_1.ValidationError('Erreur de validation de mise à jour');
        }
    }
}
exports.default = UserValidator;
