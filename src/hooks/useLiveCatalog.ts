import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type LiveProduct = {
  id: string;
  category_slug: string;
  name: string;
  brand: string;
  highlight: string;
  specs: string[];
  price: string | null;
  price_note: string | null;
  in_stock: boolean;
  featured: boolean;
  image_url: string | null;
  sort_order: number;
};

export type LiveService = {
  slug: string;
  name: string;
  short_name: string;
  tagline: string;
  intro: string;
  image_url: string | null;
  included: string[];
  process: { step: string; title: string; desc: string }[];
  industries: string[];
};

export type LiveCategory = {
  slug: string;
  name: string;
  short_name: string;
  tagline: string;
  intro: string;
  image_url: string | null;
  brands: string[];
  use_cases: string[];
};

export function useLiveProducts(categorySlug: string) {
  const [rows, setRows] = useState<LiveProduct[] | null>(null);
  useEffect(() => {
    let alive = true;
    async function load() {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("category_slug", categorySlug)
        .order("sort_order")
        .order("name");
      if (alive) setRows(((data as unknown) as LiveProduct[]) ?? []);
    }
    load();
    const ch = supabase
      .channel(`products-${categorySlug}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, () => load())
      .subscribe();
    return () => { alive = false; supabase.removeChannel(ch); };
  }, [categorySlug]);
  return rows;
}

export function useLiveCategory(slug: string) {
  const [row, setRow] = useState<LiveCategory | null>(null);
  useEffect(() => {
    let alive = true;
    async function load() {
      const { data } = await supabase
        .from("product_categories")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (alive) setRow(((data as unknown) as LiveCategory) ?? null);
    }
    load();
    const ch = supabase
      .channel(`category-${slug}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "product_categories" }, () => load())
      .subscribe();
    return () => { alive = false; supabase.removeChannel(ch); };
  }, [slug]);
  return row;
}

export function useLiveService(slug: string) {
  const [row, setRow] = useState<LiveService | null>(null);
  useEffect(() => {
    let alive = true;
    async function load() {
      const { data } = await supabase
        .from("services")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (alive) setRow(((data as unknown) as LiveService) ?? null);
    }
    load();
    const ch = supabase
      .channel(`service-${slug}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "services" }, () => load())
      .subscribe();
    return () => { alive = false; supabase.removeChannel(ch); };
  }, [slug]);
  return row;
}