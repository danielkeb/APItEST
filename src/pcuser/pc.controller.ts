import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Res,
  UploadedFile,
  UseInterceptors,
  //UseGuards,
} from '@nestjs/common';
import { NewPcService } from './pc.service';
import { NewPcDto } from './dto';
// import { AuthGuard } from 'src/auth/guard/auth.guard';
// import { RoleGuard } from 'src/auth/decorator/roles.guard';
// import { Roles } from 'src/auth/decorator/roles.decorator';
// import { Role } from 'src/auth/decorator/enums/role.enum';
// import { ApiBearerAuth } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { createReadStream } from 'fs';
import { join } from 'path';
import type { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('pcuser')
export class NewPcController {
  constructor(private newPcService: NewPcService) {}
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './images',
        filename: (req, file, cb) => {
          const ext = extname(file?.originalname).toLowerCase();
          if (['.jpg', '.png', '.jpeg'].includes(ext)) {
            cb(null, `${file?.fieldname}-${Date.now()}${ext}`);
          } else {
            cb(new Error('File extension is not allowed'), null);
          }
        },
      }),
    }),
  )
  @Post('add')
  //@ApiBearerAuth()
  //@UseGuards(AuthGuard, RoleGuard)
  //@Roles(Role.ADMIN)
  addNewPc(@Body() dto: NewPcDto, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    return this.newPcService.addNewPc(dto, file.path);
  }
  // @Get('get')
  // getNewPc(
  //   @Query('limit') limit: number = 5,
  //   @Query('search') search: string | null = null,
  // ) {
  //   return this.newPcService.getNewPc(limit, search);
  // }
  @Get('get')
  getNewPc() {
    return this.newPcService.getNewPc();
  }
  @Get('images/:filename')
  async openImg(
    @Param('filename') filename: string,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const filePath = join(process.cwd(), 'images', `${filename}`);
      const readableStream = createReadStream(filePath);

      // Set response headers
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Content-Disposition', `inline; filename=${filename}`);

      // Pipe the stream to the response
      readableStream.pipe(res);
    } catch (error) {
      console.error('Error opening image:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Error opening image');
    }
  }

  @Put('update/:userId')
  pcUserUpdate(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() dto: NewPcDto,
  ) {
    return this.newPcService.pcUserUpdate(userId, dto);
  }

  @Delete('delete/:userId')
  deleteUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.newPcService.deleteUser(userId);
  }

  @Get('get/:userId')
  getUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.newPcService.getUser(userId);
  }
  @Get('visualize')
  visualize() {
    return this.newPcService.visualize();
  }
}
