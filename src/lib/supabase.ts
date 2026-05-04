import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://wlttenqvzdwsufrefdvd.supabase.co"
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_vr3jD_SCtcaJ3KEz6j9sow_VG3M4JDp"

export const supabase = createClient(supabaseUrl, supabaseKey)
