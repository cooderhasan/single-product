import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { PaytrService } from './paytr.service';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [HttpModule, OrdersModule],
  controllers: [PaymentsController],
  providers: [PaymentsService, PaytrService],
  exports: [PaymentsService, PaytrService],
})
export class PaymentsModule {}
