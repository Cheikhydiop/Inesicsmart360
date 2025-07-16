import { z } from 'zod';
import { ValidationError } from '../../errors/customErrors';

// Énumération des rôles utilisateur
const UserRoleEnum = z.enum([
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
const registerSchema = z.object({
  name: z
    .string({
      required_error: "Le nom est requis",
      invalid_type_error: "Le nom doit être une chaîne de caractères"
    })
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(50, "Le nom ne peut pas dépasser 50 caractères")
    .trim(),

  email: z
    .string({
      required_error: "L'email est requis",
      invalid_type_error: "L'email doit être une chaîne de caractères"
    })
    .email("Format d'email invalide")
    .toLowerCase()
    .trim(),

  password: z
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

  role: UserRoleEnum.refine(
    (value) => value !== undefined,
    { message: "Le rôle est requis" }
  ),

  organization: z
    .string()
    .max(100, "Le nom de l'organisation ne peut pas dépasser 100 caractères")
    .trim()
    .optional(),

  phoneNumber: z
    .string()
    .regex(
      /^[\+]?[1-9][\d\s\-\(\)]{7,15}$/,
      "Format de numéro de téléphone invalide"
    )
    .trim()
    .optional(),

  jobTitle: z
    .string()
    .max(100, "Le titre du poste ne peut pas dépasser 100 caractères")
    .trim()
    .optional(),

  department: z
    .string()
    .max(100, "Le nom du département ne peut pas dépasser 100 caractères")
    .trim()
    .optional(),
});

// Schéma de validation pour la connexion
const loginSchema = z.object({
  email: z
    .string({
      required_error: "L'email est requis",
      invalid_type_error: "L'email doit être une chaîne de caractères"
    })
    .email("Format d'email invalide")
    .toLowerCase()
    .trim(),

  password: z
    .string({
      required_error: "Le mot de passe est requis",
      invalid_type_error: "Le mot de passe doit être une chaîne de caractères"
    })
    .min(1, "Le mot de passe ne peut pas être vide"),
});

// Schéma pour la validation de mot de passe seul
const passwordSchema = z
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
  static validateRegister(data: unknown) {
    try {
      return registerSchema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map(err => err.message);
        throw new ValidationError(errorMessages); // on envoie un tableau
      }
      throw new ValidationError(['Erreur de validation inconnue']);
    }
  }
  

  /**
   * Validation des données de connexion
   */
  static validateLogin(data: unknown) {
    try {
      return loginSchema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map(err => err.message);
        throw new ValidationError(errorMessages.join(', '));
      }
      throw new ValidationError('Erreur de validation inconnue');
    }
  }

  /**
   * Validation du mot de passe seul
   */
  static validatePassword(password: string): void {
    try {
      passwordSchema.parse(password);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map(err => err.message);
        throw new ValidationError(errorMessages.join(', '));
      }
      throw new ValidationError('Erreur de validation du mot de passe');
    }
  }

  /**
   * Validation partielle pour mise à jour (tous les champs optionnels)
   */
  static validateUpdate(data: unknown) {
    try {
      const updateSchema = registerSchema.partial().omit({ password: true });
      return updateSchema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map(err => err.message);
        throw new ValidationError(errorMessages.join(', '));
      }
      throw new ValidationError('Erreur de validation de mise à jour');
    }
  }
}

// Export des types inférés de Zod
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UserRole = z.infer<typeof UserRoleEnum>;

export default UserValidator;