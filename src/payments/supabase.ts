import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();
const supabaseUrl = process.env.VITE_PROJECT_URL;
const supabaseKey = process.env.VITE_API_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);
