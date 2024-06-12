import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://fhbgrfctagcblaygrogw.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZoYmdyZmN0YWdjYmxheWdyb2d3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgwMzcxODIsImV4cCI6MjAzMzYxMzE4Mn0.kFZzkafoh-QfTugx87WcJf6U-qGWli55SDeC6RBWMGg";

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
