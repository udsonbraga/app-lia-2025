
import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.0.0";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

// Cors headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );
    
    const url = new URL(req.url);
    const operation = url.searchParams.get("operation");

    if (req.method === "GET") {
      if (operation === "check_table") {
        // Verificar se a tabela de produtos existe
        try {
          const { data, error } = await supabaseClient
            .from("products")
            .select("id")
            .limit(1);
          
          return new Response(JSON.stringify({ exists: !error }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          });
        } catch (error) {
          return new Response(JSON.stringify({ exists: false }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          });
        }
      } else if (operation === "get_all") {
        // Buscar todos os produtos
        const { data, error } = await supabaseClient
          .from("products")
          .select("*");
          
        if (error) throw error;
        
        return new Response(JSON.stringify(data || []), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }
    } else if (req.method === "POST") {
      const { operation, data } = await req.json();
      
      if (operation === "create_table") {
        // Criar tabela de produtos
        await supabaseClient.rpc("exec_sql", {
          sql: `
            CREATE TABLE IF NOT EXISTS public.products (
              id SERIAL PRIMARY KEY,
              name TEXT NOT NULL,
              price DECIMAL(10,2) NOT NULL,
              category TEXT NOT NULL,
              image TEXT NOT NULL
            );
          `
        });
        
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      } else if (operation === "insert") {
        const { name, price, category, image } = data;
        
        // Inserir novo produto
        const { data: newProduct, error } = await supabaseClient
          .from("products")
          .insert([{ name, price, category, image }])
          .select()
          .single();
          
        if (error) throw error;
        
        return new Response(JSON.stringify(newProduct), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 201,
        });
      } else if (operation === "update") {
        const { id, name, price, category, image } = data;
        
        // Atualizar produto
        const { data: updatedProduct, error } = await supabaseClient
          .from("products")
          .update({ name, price, category, image })
          .eq("id", id)
          .select()
          .single();
          
        if (error) throw error;
        
        return new Response(JSON.stringify(updatedProduct), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      } else if (operation === "delete") {
        const { id } = data;
        
        // Deletar produto
        const { error } = await supabaseClient
          .from("products")
          .delete()
          .eq("id", id);
          
        if (error) throw error;
        
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }
    }
    
    return new Response(JSON.stringify({ error: "Operation not supported" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  } catch (error) {
    console.error(error);
    
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
