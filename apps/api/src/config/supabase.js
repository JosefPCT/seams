import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

// Get the Project URL and API Key from the website itself
const supabaseUrl = process.env.SUPABASE_PROJECT_URL;
const supabaseKey = process.env.SUPABASE_PUBLIC_API_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export { supabase };

