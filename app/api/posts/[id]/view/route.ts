import { createSupabaseServerClient } from "@/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  if (!id) {
    return NextResponse.json({ error: "ID recquis" }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();

  // RPC call is better for atomic increments, but sql update is fine for low traffic
  // We can use the rpc if we create a function, but let's try direct update first which is blocked by RLS usually for anon
  // So we use rpc.
  
  // Actually, we can just use supabase.rpc if we define a function in migration.
  // OR, since this is a server route, we have service role access if we used createClient with service key?
  // But lib/supabase-server uses cookies. So it's acting as the user (anon or logged in).
  // Standard RLS prevents anon from updating posts.
  
  // OPTION: We need a Postgres function to strictly increment view count that is callable by anon.
  
  try {
    const { error } = await supabase.rpc("increment_view_count", { post_id: id });
    
    if (error) {
       // Fallback if RPC doesn't exist (until migration runs)
       console.error("RPC Error", error);
       return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
