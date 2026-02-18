import { Module, Logger } from '@nestjs/common';

import { LenderMobileController } from './lender_mobile.controller';
import { LenderMobileService } from './lender_mobile.service';

import { LenderApplicationsController } from './lender_applications.controller';
import { LenderApplicationsService } from './lender_applications.service';
import { LenderBorrowersController } from './lender_borrowers.controller';
import { LenderBorrowersService } from './lender_borrowers.service';

@Module({
  controllers: [LenderMobileController, LenderApplicationsController, LenderBorrowersController],
  providers: [
    LenderMobileService,
    LenderApplicationsService,
    LenderBorrowersService,
    Logger,
  ],
  exports: [LenderMobileService, LenderApplicationsService, LenderBorrowersService], // allows reuse in other modules if needed
})
export class LenderMobileModule {}