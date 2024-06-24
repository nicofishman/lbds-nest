import { Controller, Get, NotFoundException, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/rol.decorator';
import { Rol } from 'src/auth/enum';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RolGuard } from 'src/auth/guards/rol.guard';
import { UserService } from 'src/user/user.service';

@Controller('user')
@UseGuards(JwtGuard)
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Roles(Rol.Admin)
  @UseGuards(RolGuard)
  @Get('/borrachos')
  async listaBorrachos() {
    return await this.userService.getAllBorrachos();
  }

  @Roles(Rol.Admin)
  @UseGuards(RolGuard)
  @Get('/borrachospagos')
  async listaBorrachosPagos() {
    return await this.userService.getAllBorrachosPagos();
  }

  @Get(':id')
  async getUserProfile(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.findById(id);
  }

  @Roles(Rol.Borracho)
  @UseGuards(RolGuard)
  @Post('pagar')
  async pagar(@Req() req: any) {
    const user = await this.userService.findByEmail(req.user.username);

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (user.pagoCuota) {
      return 'Ya pagaste la cuota';
    } else {
      await this.userService.pagarCuota(user.id);
      return 'Cuota pagada';
    }
  }
}
