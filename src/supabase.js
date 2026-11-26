import { createClient } from '@supabase/supabase-js';

// Paste your values from Supabase Dashboard -> Connect / Project Settings -> API Keys
const supabaseUrl = 'https://khdospeiqgvvyumsbhtl.supabase.co';
const supabasePublishableKey = 'sb_publishable_qlU9j2rEcrzXlSmruWWYyw_5kOJr5yc';

export const supabase = createClient(supabaseUrl, supabasePublishableKey);