import { ConflictException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { hash } from 'bcrypt';
import { Rol } from 'src/auth/enum';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from 'src/user/dto/user.dto';
import { z } from 'zod';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  async create(dto: z.infer<typeof CreateUserDto>): Promise<Omit<User, 'password'>> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (user) {
      throw new ConflictException('Ya existe el usuario');
    }

    const newUser = await this.prisma.user.create({
      data: {
        ...dto,
        password: await hash(dto.password, 10),
      },
    });

    const { password, ...result } = newUser;

    return result;
  }

  async findByEmail(email: User['email']): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  }

  async findById(id: User['id']): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
  }

  async pagarCuota(id: User['id']): Promise<User> {
    return this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        pagoCuota: true,
      },
    });
  }

  async getAllBorrachos(): Promise<User[]> {
    return this.prisma.user.findMany({
      where: {
        role: Rol.Borracho,
      },
    });
  }

  async getAllBorrachosPagos(): Promise<User[]> {
    return this.prisma.user.findMany({
      where: {
        role: Rol.Borracho,
        pagoCuota: true,
      },
    });
  }
}
