import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { PartidoDto } from './dto/partido.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PartidoService {
  constructor(private readonly prisma: PrismaService) { }

  async crearPartido(partido: z.infer<typeof PartidoDto>) {
    return this.prisma.partido.create({ data: partido });
  }

  async getAll() {
    return this.prisma.partido.findMany();
  }
}
