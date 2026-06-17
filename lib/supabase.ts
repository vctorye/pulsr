import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zyzefxkmctqphtnfpjdz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5emVmeGttY3RxcGh0bmZwamR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwNTkwNDYsImV4cCI6MjA5MjYzNTA0Nn0.IEs7Qf8HPrRGOcffb18N8f5xqKwoECWzf6_oq2a-rnU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);