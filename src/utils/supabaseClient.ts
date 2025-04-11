import { createClient } from '@supabase/supabase-js';
 
 const supabaseUrl = 'https://rgmhmrypftckljyyrxcw.supabase.co';
 const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnbWhtcnlwZnRja2xqeXlyeGN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4NTk5MDcsImV4cCI6MjA1ODQzNTkwN30.-fdiRJECXhhs3mV6Dhxxua2iI1yzznk641d_HYQHga4';
 
 export const supabase = createClient(supabaseUrl, supabaseKey);