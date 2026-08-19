import { Product, Category } from "@/types";
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from "@/lib/mock-data";

export interface GetProductsParams {
  category?: string;
  search?: string;
  sort?: string;
  inStock?: boolean;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

export interface SearchProductsResult {
  success: boolean;
  query: string;
  total: number;
  suggestions: string[];
  data: Product[];
}

export async function fetchProducts(params: GetProductsParams = {}): Promise<Product[]> {
  try {
    const searchParams = new URLSearchParams();
    if (params.category && params.category !== "semua") {
      searchParams.set("category", params.category);
    }
    if (params.search) {
      searchParams.set("search", params.search);
    }
    if (params.sort) {
      searchParams.set("sort", params.sort);
    }
    if (params.inStock) {
      searchParams.set("inStock", "true");
    }
    if (params.minPrice !== undefined) {
      searchParams.set("minPrice", params.minPrice.toString());
    }
    if (params.maxPrice !== undefined) {
      searchParams.set("maxPrice", params.maxPrice.toString());
    }
    if (params.page !== undefined) {
      searchParams.set("page", params.page.toString());
    }
    if (params.limit !== undefined) {
      searchParams.set("limit", params.limit.toString());
    }

    const query = searchParams.toString();
    const url = `/api/products${query ? `?${query}` : ""}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      throw new Error("Failed to fetch products from API");
    }
    const json = await res.json();
    return json.data;
  } catch (err) {
    // Fallback to local mock data
    return MOCK_PRODUCTS;
  }
}

export async function fetchProductsByCategory(
  categoryIdOrSlug: string,
  inStockOnly: boolean = false
): Promise<Product[]> {
  try {
    const res = await fetch(
      `/api/categories/${encodeURIComponent(categoryIdOrSlug)}/products${
        inStockOnly ? "?inStock=true" : ""
      }`,
      { cache: "no-store" }
    );
    if (!res.ok) throw new Error("Category products API error");
    const json = await res.json();
    return json.data;
  } catch (err) {
    const cat = MOCK_CATEGORIES.find(
      (c) => c.id === categoryIdOrSlug || c.slug === categoryIdOrSlug
    );
    let filtered = categoryIdOrSlug === "semua"
      ? [...MOCK_PRODUCTS]
      : MOCK_PRODUCTS.filter(
          (p) => p.categoryId === categoryIdOrSlug || (cat && p.categoryId === cat.id)
        );
    if (inStockOnly) filtered = filtered.filter((p) => p.stock > 0);
    return filtered;
  }
}

export async function searchProducts(
  query: string,
  limit: number = 10
): Promise<SearchProductsResult> {
  try {
    const res = await fetch(
      `/api/products/search?q=${encodeURIComponent(query)}&limit=${limit}`,
      { cache: "no-store" }
    );
    if (!res.ok) throw new Error("Search API failed");
    return await res.json();
  } catch (err) {
    const qLower = query.toLowerCase().trim();
    const matches = MOCK_PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(qLower) ||
        p.description.toLowerCase().includes(qLower) ||
        p.sku.toLowerCase().includes(qLower)
    );
    return {
      success: true,
      query,
      total: matches.length,
      suggestions: matches.slice(0, 5).map((m) => m.name),
      data: matches.slice(0, limit),
    };
  }
}

export async function fetchProductById(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`/api/products/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch (err) {
    return MOCK_PRODUCTS.find((p) => p.id === id || p.slug === id) || null;
  }
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await fetch("/api/categories", { cache: "no-store" });
    if (!res.ok) return MOCK_CATEGORIES;
    const json = await res.json();
    return json.data;
  } catch (err) {
    return MOCK_CATEGORIES;
  }
}
