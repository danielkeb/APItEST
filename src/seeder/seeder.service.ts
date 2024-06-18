import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service'; // Adjust the import path

@Injectable()
export class SeederService {
  constructor(private prisma: PrismaService) {}

  async seed() {
    await this.prisma.users.create({
      data: {
        id: 438,
        name: 'Daniel',
        email: 'danielkebede3811@gmail.com',
        role: 'admin',
        password: 'admin1234',
      },
    });
    return { msg: 'success' };
  }
}
