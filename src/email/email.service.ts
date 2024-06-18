import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { PasswordDto } from './dto/pass.dto';
@Injectable()
export class ShortcodeEmailService {
  private readonly logger = new Logger(ShortcodeEmailService.name);
  constructor(
    private config: ConfigService,
    private prismaService: PrismaService,
  ) {}

  async sendSecurityAlert(email: string, userId: number) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: this.config.get('EMAIL_ADDRESS'),
        pass: this.config.get('APP_PASSWORD'),
      },
    });

    const shortcode = Math.floor(100000 + Math.random() * 900000).toString();
    await this.addVerifyCode(shortcode, userId);

    const mailConfigs = {
      from: this.config.get('EMAIL_ADDRESS'),
      to: email,
      subject: 'Password reset shortcode',
      text: `Your password reset shortcode is: ${shortcode}`,
    };

    try {
      const info = await transporter.sendMail(mailConfigs);
      console.log('Email sent: ' + info.response);
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  async addVerifyCode(shortcode: string, userId: number) {
    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() + 3); // Set expiration time to 5 minutes from now

    try {
      await this.prismaService.reset.create({
        data: {
          userId: userId,
          shortcode: shortcode,
          expiresAt: expirationTime,
        },
      });

      // Log the addition of the verification code
      this.logger.log(`Verification code added for user ${userId}`);

      // Schedule a job to delete expired entries
      this.scheduleExpirationCheck();
    } catch (error) {
      console.error('Error saving shortcode to database:', error);
      throw error;
    }
  }

  private scheduleExpirationCheck() {
    // Schedule a job to run every minute to check for expired entries and delete them
    setInterval(async () => {
      try {
        const currentTime = new Date();
        const expiredEntries = await this.prismaService.reset.findMany({
          where: {
            expiresAt: {
              lte: currentTime, // Find entries with expiration time less than or equal to current time
            },
          },
        });

        // Delete expired entries from the database
        await Promise.all(
          expiredEntries.map(async (entry) => {
            const user = await this.prismaService.reset.delete({
              where: {
                id: entry.id,
              },
            });
            if (!user) {
              throw new NotFoundException('not found');
            }
            this.logger.log(`Expired verification code deleted: ${entry.id}`);
          }),
        );
      } catch (error) {
        console.error('Error deleting expired entries:', error);
      }
    }, 60000); // Run the job every minute (60000 milliseconds)
  }

  async verifyCode(userId: number, dto: VerifyCodeDto) {
    const code = await this.prismaService.reset.findFirst({
      where: {
        userId: userId,
        shortcode: dto.shortcode,
      },
    });

    if (!code || code == null) {
      throw new NotFoundException('Invalid or expired short code');
    }

    return code;
  }

  async resetPassword(userId: number, dto: PasswordDto) {
    const user = await this.prismaService.users.findUnique({
      where: {
        id: userId,
      },
    });
    if (user) {
      const hash = await argon.hash(dto.password);
      await this.prismaService.users.update({
        where: {
          id: userId,
        },
        data: {
          password: hash,
        },
      });
      return { msg: 'Password reseted !' };
    } else {
      console.log('user not found');
      throw new NotFoundException(`user int this id ${userId}`);
    }
  }
}

interface VerifyCodeDto {
  shortcode: string;
}
