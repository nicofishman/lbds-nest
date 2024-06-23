import { SetMetadata } from "@nestjs/common";
import { Rol } from "src/auth/enum";


export const Roles = (...roles: Rol[]) => SetMetadata('roles', roles);