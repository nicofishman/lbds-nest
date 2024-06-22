import { CreateUserDto } from "src/user/dto/user.dto";

export const LoginDto = CreateUserDto.pick({ email: true, password: true });