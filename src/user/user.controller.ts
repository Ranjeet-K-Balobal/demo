// src/user/user.controller.ts

import { Controller, Post, Body, NotFoundException, Param, Get } from '@nestjs/common';
import { SupabaseService } from '../supabase.service';


@Controller('user')
export class UserController {
  constructor(private readonly supabaseService: SupabaseService) {}

  @Post('signup')
  async signUpUser(@Body() userData: any) {
    const supabase = this.supabaseService.getSupabase();    
    const { data, error } = await supabase.from('users').upsert([userData]);

    if (error) {
      console.error('Error during signup:', error.message);
      return { success: false, message: 'Signup failed' };
    }

    console.log('User signed up successfully:', data);
    return { success: true, message: 'Signup successful' };
  }

  @Post('login')
  async loginUser(@Body() loginData: any) {
    const supabase = this.supabaseService.getSupabase();    
    const { data, error } = await supabase
      .from('users')
      .select()
      .eq('username', loginData.username)
      .eq('password', loginData.password);

    if (error) {
      console.error('Error during login:', error.message);
      return { success: false, message: 'Login failed' };
    }

    if (data && data.length > 0) {
      console.log('User logged in successfully:', data);
      return { success: true, message: 'Login successful', user: data[0] };
    } else {
      console.error('Invalid username or password');
      return { success: false, message: 'Invalid username or password' };
    }
  }
  @Get(':id')
    async getUserProfile(@Param('id') UserId: string) {
      const supabase = this.supabaseService.getSupabase();

      // Query the user by ID
      const { data, error } = await supabase
        .from('users')
        .select()
        .eq('id', UserId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error.message);
        throw new NotFoundException('User not found');
      }

      if (!data) {
        throw new NotFoundException('User not found');
      }

      return { success: true, user: data };
  }
}
