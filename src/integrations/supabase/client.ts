// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://erfmwrjrkcgachhlvxwn.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyZm13cmpya2NnYWNoaGx2eHduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUzNDE2OTYsImV4cCI6MjA1MDkxNzY5Nn0.wEOz0kN6cfQtU-NmZleRYZyouDLv71JWFzA8UqBGteg";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);