import { Module } from '@nestjs/common';
import { BorrowerController } from './borrower.controller';
import { BorrowerService } from './borrower.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [BorrowerController],
  providers: [BorrowerService]
})
export class BorrowerModule {}
