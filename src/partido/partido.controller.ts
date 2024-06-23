import { Body, ConflictException, Controller, Post, UseGuards } from '@nestjs/common';
import { PartidoService } from './partido.service';
import { ZodPipe } from 'src/filters/zod.pipe';
import { PartidoDto } from 'src/partido/dto/partido.dto';
import { z } from 'zod';
import { RolGuard } from 'src/auth/guards/rol.guard';
import { Rol } from 'src/auth/enum';
import { differenceInDays, differenceInMonths } from 'date-fns';
import { Partido } from '@prisma/client';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Roles } from 'src/auth/decorators/rol.decorator';

@Controller('partido')
export class PartidoController {
  constructor(private readonly partidoService: PartidoService) { }

  @Roles(Rol.Admin)
  @UseGuards(JwtGuard, RolGuard)
  @Post('crear')
  async crearPartido(@Body(new ZodPipe(PartidoDto)) dto: z.infer<typeof PartidoDto>) {
    const fecha = new Date(dto.fecha).toISOString();

    const partido = {
      ...dto,
      fecha,
    };

    try {
      await this.validarCondiciones(partido);
    } catch (e) {
      throw new ConflictException(e.message);
    }

    return this.partidoService.crearPartido(partido);
  }

  private async validarCondiciones(partido: z.infer<typeof PartidoDto>) {
    const partidos = await this.partidoService.getAll();

    await this.validarPartidosEnFecha(partidos, partido);
    await this.validarRival(partidos, partido);
  }

  private async validarPartidosEnFecha(partidos: Partido[], partido: z.infer<typeof PartidoDto>) {
    // Entre partido y partido deben haber 3 días de diferencia como mínimo.
    const fecha = new Date(partido.fecha);

    const partidosEnFecha = partidos.filter((p) => {
      const fechaPartido = new Date(p.fecha);

      const dayDiff = differenceInDays(fecha, fechaPartido);

      return dayDiff >= -3 && dayDiff <= 3;
    });

    if (partidosEnFecha.length > 0) {
      throw new Error('No se pueden crear partidos en fechas cercanas a otros partidos');
    }

    return true;
  }

  private async validarRival(partidos: Partido[], partido: z.infer<typeof PartidoDto>) {
    // No pueden jugar contra el mismo rival en un plazo menor a un mes
    const fecha = new Date(partido.fecha);

    const partidosMismoRival = partidos.filter((p) => p.rival === partido.rival);

    const partidosMismoRivalEnUnMes = partidosMismoRival.filter((p) => {
      const fechaPartido = new Date(p.fecha);

      const monthDiff = differenceInMonths(fecha, fechaPartido);

      return monthDiff >= -1 && monthDiff <= 1;
    });

    if (partidosMismoRivalEnUnMes.length > 0) {
      throw new ConflictException('No se pueden jugar partidos contra el mismo rival en un plazo menor a un mes');
    }

    return true;
  }
}
