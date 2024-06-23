import { z } from "zod";

export const PartidoDto = z.object({
  fecha: z.string({ required_error: "La fecha es requerida" })
    .date("La fecha debe tener un formato válido YYYY-MM-DD")
    .refine((value) => new Date(value) >= new Date(), 'La fecha debe ser mayor o igual a la fecha actual')
    .transform((value) => new Date(value).toISOString()),
  hora: z.string({ required_error: "La hora es requerida" }).regex(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, { message: "La hora debe tener un formato válido" }),
  lugar: z.string({ required_error: "El lugar es requerido" }),
  rival: z.string({ required_error: "El rival es requerido" }),
  maxBorrachos: z.number({ required_error: "El número máximo de borrachos es requerido" }).int({ message: "El número máximo de borrachos debe ser un número entero" }),
});