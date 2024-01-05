import { Body, Controller, Get, HttpException, HttpStatus, NotFoundException, Param, Post } from '@nestjs/common';
import { SupabaseService } from '../supabase.service';

@Controller('purchases')
export class PurchasesController {
  constructor(private readonly supabaseService: SupabaseService) {}

  @Post('buy')
  async createPurchase(@Body() purchaseData: any) {
    const supabase = this.supabaseService.getSupabase(); // Assuming you have a method to get Supabase instance in your service

    const { data, error } = await supabase.from('purchases').upsert([purchaseData]);

    if (error) {
      console.error('Error during purchase creation:', error.message);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to create purchase',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    console.log('Purchase created successfully:', data);
    return {
      status: HttpStatus.CREATED,
      message: 'Purchase created successfully',
      data: data,
    };
  }

  @Get(':purchase_id')
  async getPurchaseById(@Param('purchase_id') purchaseId: string) {
    const supabase = this.supabaseService.getSupabase(); // Assuming you have a method to get Supabase instance in your service

    // Query the purchase by ID
    const { data, error } = await supabase
      .from('purchases')
      .select('*')
      .eq('purchase_id', purchaseId)
      .single();

    if (error) {
      console.error('Error fetching purchase:', error.message);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to fetch purchase',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (!data) {
      throw new NotFoundException('Purchase not found');
    }

    return {
      status: HttpStatus.OK,
      message: 'Purchase fetched successfully',
      data: data,
    };
  }
}
