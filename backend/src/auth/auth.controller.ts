import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('admin/login')
  async adminLogin(@Body() loginDto: { email: string; password: string }) {
    try {
      return await this.authService.loginAdmin(loginDto.email, loginDto.password);
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  @Post('customer/login')
  async customerLogin(@Body() loginDto: { email: string; password: string }) {
    try {
      return await this.authService.loginCustomer(loginDto.email, loginDto.password);
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
} 