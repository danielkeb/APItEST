import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Param,
  ParseIntPipe,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { AuthGuard } from './guard/auth.guard';
import { Roles } from './decorator/roles.decorator';
import { Role } from './decorator/enums/role.enum';
import { RoleGuard } from './decorator/roles.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @ApiOperation({ summary: 'Add a news item' })
  @ApiResponse({
    status: 201,
    description: 'The news has been successfully created.',
  })
  @Post('signup')
  signUp(@Body() dto: AuthDto) {
    return this.authService.signUp(dto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'sign in' })
  @ApiResponse({
    description: 'The news has been successfully logged.',
  })
  @Post('signin')
  signIn(@Body() dto: AuthDto) {
    return this.authService.signIn(dto);
  }

  @Get('get')
  //@UseGuards(AuthGuard)
  //@Roles(Role.Admin)
  getAllUsers() {
    return this.authService.getAllUsers();
  }
  //@UseGuards()

  @Get('get/:id')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.MODERATOR)
  searchUser(@Param('id', ParseIntPipe) id: number) {
    return this.authService.searchUser(id);
  }

  @Delete('user/:id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.authService.deleteUser(id);
  }
  @Get('all')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  getAll() {
    return this.authService.getAll();
  }
  @Post('forget/shortcode')
  async forgetPasswordShortCode(@Body() dto: any) {
    return this.authService.forgetPasswordShortCode(dto);
  }
}
