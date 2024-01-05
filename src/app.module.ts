import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { UserController} from './user/user.controller';
import { SupabaseService} from './supabase.service';
// import { ProductsService } from './products/products.supabase.service';
import { ProductsController } from './products/products.controller';
import { PurchasesController } from './purchases/purchases.controller';

@Module({
  imports: [],
  controllers: [UserController,ProductsController, PurchasesController],
  providers: [SupabaseService],

})
export class AppModule {}
