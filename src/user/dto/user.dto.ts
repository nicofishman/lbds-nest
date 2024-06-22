import { z } from "zod";

export const CreateUserDto = z.object({
  name: z.string()
    .min(3, { message: "El nombre debe tener al menos 3 caracteres" })
    .max(255, { message: "El nombre debe tener como máximo 255 caracteres" }),
  email: z.string({ required_error: "El email es requerido" })
    .email({ message: "El email debe tener un formato válido" }),
  password: z.string({ message: 'La contraseña es requerida y debe tener al menos 6 caracteres' })
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
});