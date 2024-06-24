import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { PartidoDto } from './dto/partido.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Partido, Prisma } from '@prisma/client';

@Injectable()
export class PartidoService {
  constructor(private readonly prisma: PrismaService) { }

  async crearPartido(partido: z.infer<typeof PartidoDto>): Promise<Partido> {
    return this.prisma.partido.create({ data: partido });
  }

  async getAll(): Promise<Partido[]> {
    return this.prisma.partido.findMany();
  }

  async getById(id: number): Promise<Prisma.PartidoGetPayload<{ include: { borrachos: true } }> | null> {
    return this.prisma.partido.findUnique({
      where: {
        id: id,
      },
      include: {
        borrachos: true,
      }
    });
  }

  async asistirPartido(id: number, userId: number): Promise<Partido> {
    return this.prisma.partido.update({
      where: {
        id: id,
      },
      data: {
        borrachos: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }
}
