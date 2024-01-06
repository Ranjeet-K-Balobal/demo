import { Body, Controller, Delete, Get, HttpException, HttpStatus, NotFoundException, Param, Post, Put } from '@nestjs/common';
import {SupabaseService} from '../supabase.service';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: SupabaseService) {}
    @Post('create')
  async createProduct(@Body() productData: any) {
    const supabase = this.productsService.getSupabase();  
    
    const { data, error } = await supabase.from('products').upsert([productData]);

    if (error) {
      console.error('Error during product creation:', error.message);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to create product',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    console.log('Product created successfully:', data);
    return {
      status: HttpStatus.CREATED,
      message: 'Product created successfully',
      data: data,
    };
  }

  @Get(':products_id')
  async getProductById(@Param('products_id') productId: string) {
    const supabase = this.productsService.getSupabase(); // Assuming you have a method to get Supabase instance in your service

    // Query the product by ID
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('product_id', productId)
      .single();

    if (error) {
      console.error('Error fetching product:', error.message);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to fetch product',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (!data) {
      throw new NotFoundException('Product not found');
    }

    return {
      status: HttpStatus.OK,
      message: 'Product fetched successfully',
      data: data,
    };
  }

  @Put(':products_id')
  async updateProduct(@Param('products_id') productId: string, @Body() productData: any) {
    const supabase = this.productsService.getSupabase();

    // Update the product by ID
    const { data, error } = await supabase
      .from('products')
      .update(productData)
      .eq('product_id', productId);

    if (error) {
      console.error('Error updating product:', error.message);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to update product',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (!data) {
      throw new NotFoundException('Product not found');
    }

    return {
      status: HttpStatus.OK,
      message: 'Product updated successfully',
      data: data,
    };
  }

  @Delete(':products_id')
  async deleteProduct(@Param('products_id') productId: string) {
    const supabase = this.productsService.getSupabase();

    // Delete the product by ID
    const { data, error } = await supabase
      .from('products')
      .delete()
      .eq('product_id', productId)
      .single();

    if (error) {
      console.error('Error deleting product:', error.message);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to delete product',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (!data) {
      throw new NotFoundException('Product not found');
    }

    return {
      status: HttpStatus.OK,
      message: 'Product deleted successfully',
    };
  }
}
