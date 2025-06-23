import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CustomersModule } from './customers/customers.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { SettingsModule } from './settings/settings.module';
import { CartsModule } from './carts/carts.module';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { PaymentModule } from './payment/payment.module';
import { CategoryModule } from './category/category.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', '185.209.228.189'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'gokselmanav_user'),
        password: configService.get('DB_PASSWORD', 'gokselmanav_password_2024'),
        database: configService.get('DB_DATABASE', 'gokselmanav_db'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('NODE_ENV') !== 'production',
      }),
      inject: [ConfigService],
    }),
    CustomersModule,
    ProductsModule,
    OrdersModule,
    SettingsModule,
    CartsModule,
    AdminModule,
    AuthModule,
    PaymentModule,
    CategoryModule,
    UploadModule,
  ],
})
export class AppModule {}

