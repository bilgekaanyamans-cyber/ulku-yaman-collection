// ─── API istekleri için yardımcı fonksiyonlar ────────────────

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "";

async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${url}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Bir hata oluştu" }));
    throw new Error(error.error || `HTTP ${res.status}`);
  }

  return res.json();
}

// ─── Ürünler ─────────────────────────────────────────────────

export type ProductFilters = {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  color?: string;
  size?: number;
  sort?: "newest" | "price-asc" | "price-desc" | "popular";
  featured?: boolean;
  page?: number;
  limit?: number;
};

export async function getProducts(filters?: ProductFilters) {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, val]) => {
      if (val !== undefined && val !== null) params.set(key, String(val));
    });
  }
  return fetcher<any>(`/api/products?${params}`);
}

export async function getProduct(slug: string) {
  return fetcher<any>(`/api/products/${slug}`);
}

export async function createProduct(data: any) {
  return fetcher<any>("/api/products", { method: "POST", body: JSON.stringify(data) });
}

// ─── Sepet ───────────────────────────────────────────────────

export async function getCart() {
  return fetcher<any>("/api/cart");
}

export async function addToCart(variantId: string, quantity = 1) {
  return fetcher<any>("/api/cart", {
    method: "POST",
    body: JSON.stringify({ variantId, quantity }),
  });
}

export async function updateCartItem(cartItemId: string, quantity: number) {
  return fetcher<any>("/api/cart", {
    method: "PATCH",
    body: JSON.stringify({ cartItemId, quantity }),
  });
}

export async function removeCartItem(cartItemId: string) {
  return fetcher<any>("/api/cart", {
    method: "DELETE",
    body: JSON.stringify({ cartItemId }),
  });
}

// ─── Siparişler ──────────────────────────────────────────────

export async function createOrder(data: {
  addressId: string;
  paymentMethod: string;
  installments?: number;
  couponCode?: string;
}) {
  return fetcher<any>("/api/orders", { method: "POST", body: JSON.stringify(data) });
}

export async function getOrders(params?: { status?: string; page?: number }) {
  const query = new URLSearchParams();
  if (params?.status) query.set("status", params.status);
  if (params?.page) query.set("page", String(params.page));
  return fetcher<any>(`/api/orders?${query}`);
}

export async function updateOrderStatus(orderId: string, status: string, extra?: any) {
  return fetcher<any>("/api/orders", {
    method: "PATCH",
    body: JSON.stringify({ orderId, status, ...extra }),
  });
}

// ─── Auth ────────────────────────────────────────────────────

export async function registerUser(data: { name: string; email: string; password: string }) {
  return fetcher<any>("/api/auth/register", { method: "POST", body: JSON.stringify(data) });
}
