import { Injectable } from '@nestjs/common';
// eslint-disable-next-line prettier/prettier
import { createClient, SupabaseClient } from '@supabase/supabase-js';


@Injectable()
export class SupabaseService{
    private supabase : SupabaseClient;

    constructor(){
        this.supabase= createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_KEY,
        );
    }

    getSupabase(){
        return this.supabase;
    }
}