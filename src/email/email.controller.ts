import {
  Controller,
  Post,
  Body,
  ParseIntPipe,
  Param,
  Patch,
  NotAcceptableException,
} from '@nestjs/common';
import { ShortcodeEmailService } from './email.service';
import { PasswordDto } from './dto/pass.dto';

@Controller('verify')
export class PasswordResetController {
  constructor(private readonly shortcodeEmailService: ShortcodeEmailService) {}

  @Post('/shortcode/:id')
  async verifyCode(@Param('id', ParseIntPipe) id: number, @Body() dto: any) {
    // Verify the entered shortcode
    // Inside your controller method
    try {
      const result = await this.shortcodeEmailService.verifyCode(id, dto);
      // Verification successful, return userId and any other relevant information
      return {
        userId: result.userId,
        message: 'Verification successful',
        statusCode: 200,
      };
    } catch (error) {
      if (error instanceof NotAcceptableException) {
        // Handle invalid or expired short code error
        return { message: 'Invalid or expired short code', statusCode: 406 };
      } else {
        // Handle other errors
        return {
          message: 'An error occurred while verifying the short code',
          statusCode: 500,
        };
      }
    }

    // Return response indicating whether the entered shortcode is correct
  }

  @Patch('/updatePassword/:id')
  async resetPassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: PasswordDto,
  ) {
    await this.shortcodeEmailService.resetPassword(id, dto);
  }
}
