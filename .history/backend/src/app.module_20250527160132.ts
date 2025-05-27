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
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', '147.93.131.105'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'laravel'),
        password: configService.get('DB_PASSWORD', 'secret'),
        database: configService.get('DB_DATABASE', 'gokselmanav'),
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
  ],
})
export class AppModule {}
