import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('borrower')
export class BorrowerController {
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    return {
      message: 'This is a protected borrower endpoint',
      user: req.user,
      timestamp: new Date().toISOString(),
    };
  }
}
