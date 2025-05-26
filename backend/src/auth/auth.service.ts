import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from '../admin/admin.service';
import { CustomersService } from '../customers/customers.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private adminService: AdminService,
    private customersService: CustomersService,
    private jwtService: JwtService,
  ) {}

  async validateAdmin(email: string, password: string) {
    const admin = await this.adminService.findByEmail(email);
    if (admin && await bcrypt.compare(password, admin.password)) {
      const { password, ...result } = admin;
      return result;
    }
    return null;
  }

  async validateCustomer(email: string, password: string) {
    const customer = await this.customersService.findByEmail(email);
    if (customer && await bcrypt.compare(password, customer.password)) {
      const { password, ...result } = customer;
      return result;
    }
    return null;
  }

  async loginAdmin(email: string, password: string) {
    const admin = await this.validateAdmin(email, password);
    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return {
      access_token: this.jwtService.sign({ 
        sub: admin.id, 
        email: admin.email,
        role: 'admin'
      }),
      user: admin
    };
  }

  async loginCustomer(email: string, password: string) {
    const customer = await this.validateCustomer(email, password);
    if (!customer) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return {
      access_token: this.jwtService.sign({ 
        sub: customer.id, 
        email: customer.email,
        role: 'customer'
      }),
      user: customer
    };
  }
} 