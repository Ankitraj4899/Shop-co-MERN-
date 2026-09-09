const API_URL = `${window.location.protocol}//${window.location.hostname}:3000/api`;

let savedToken = localStorage.getItem("shopco_token") || "";

export function setToken(token) {
    savedToken = token || "";
    if (token) {
        localStorage.setItem("shopco_token", token);
    } else {
        localStorage.removeItem("shopco_token");
    }
}

async function parseResponse(response) {
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
    }
    return data;
}

export async function apiRequest(path, options = {}, canRefresh = true) {
    const headers = {
        "Content-Type": "application/json",
        ...(savedToken ? { Authorization: `Bearer ${savedToken}` } : {}),
        ...(options.headers || {}),
    };

    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        credentials: "include",
        headers,
    });

    if (response.status === 401 && canRefresh && path !== "/auth/refresh") {
        const refreshed = await fetch(`${API_URL}/auth/refresh`, {
            method: "POST",
            credentials: "include",
        });

        if (refreshed.ok) {
            const refreshData = await refreshed.json().catch(() => ({}));
            if (refreshData.token) {
                setToken(refreshData.token);
            }
            return apiRequest(path, options, false);
        }
    }

    return parseResponse(response);
}

export const getProducts = (query = "page=1&limit=20") => apiRequest(`/products?${query}`);

export const getProduct = (id) => apiRequest(`/products/${id}`);

export const searchProducts = (key) => apiRequest(`/products/search?key=${encodeURIComponent(key)}`);

export const getSortedProducts = (sort) => apiRequest(`/products/${sort}`).then((data) => data.products || []);

export const getCart = () => apiRequest("/cart");

export const addToCart = (items) => apiRequest("/cart", {
    method: "POST",
    body: JSON.stringify({ items }),
});

export const updateCartItem = (productId, quantity) => apiRequest(`/cart/${productId}`, {
    method: "PUT",
    body: JSON.stringify({ quantity }),
});

export const removeCartItem = (productId) => apiRequest(`/cart/${productId}`, { method: "DELETE" });

export const clearCart = () => apiRequest("/cart", { method: "DELETE" });

export const createOrder = (items, shippingAddress, couponCode) => apiRequest("/orders", {
    method: "POST",
    body: JSON.stringify({ items, shippingAddress, couponCode }),
});

export const getOrders = () => apiRequest("/orders/myorders");

export const getOrder = (id) => apiRequest(`/orders/myorders/${id}`);

export const login = async (email, password) => {
    const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
    }, false);
    if (data.token) {
        setToken(data.token);
    }
    return data;
};

export const register = async (username, email, password) => {
    const data = await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({ username, email, password }),
    }, false);
    if (data.token) {
        setToken(data.token);
    }
    return data;
};

export const logout = async () => {
    try {
        await apiRequest("/auth/logout", { method: "POST" }, false);
    } finally {
        setToken("");
    }
};

export const getMe = () => apiRequest("/auth/get-me");

export const updateProfile = (profile) => apiRequest("/auth/profile", {
    method: "PUT",
    body: JSON.stringify(profile),
});

export const addProductReview = (productId, reviewData) => apiRequest(`/products/${productId}/reviews`, {
    method: "POST",
    body: JSON.stringify(reviewData),
});

export const getAdminDashboard = () => apiRequest("/admin/dashboard");

export const getAdminProducts = () => apiRequest("/products/admin/all");

export const createProduct = (product) => apiRequest("/products", { method: "POST", body: JSON.stringify(product) });

export const updateProduct = (id, product) => apiRequest(`/products/${id}`, { method: "PUT", body: JSON.stringify(product) });

export const deleteProduct = (id) => apiRequest(`/products/${id}`, { method: "DELETE" });

export const getCategories = () => apiRequest("/categories");

export const createCategory = (category) => apiRequest("/categories", { method: "POST", body: JSON.stringify(category) });

export const updateCategory = (id, category) => apiRequest(`/categories/${id}`, { method: "PUT", body: JSON.stringify(category) });

export const deleteCategory = (id) => apiRequest(`/categories/${id}`, { method: "DELETE" });

export const updateOrderStatus = (id, status) => apiRequest(`/orders/${id}/status`, { method: "POST", body: JSON.stringify({ status }) });

export const getAllOrders = () => apiRequest("/orders");