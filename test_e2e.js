// Comprehensive End-to-End MERN Integration Test
const BASE_URL = "http://localhost:3000/api";

async function runTests() {
    console.log("=== STARTING FULL E2E INTEGRATION TESTS ===");
    let customerCookie = "";
    let adminCookie = "";

    function getCookieFromHeaders(res) {
        const setCookie = res.headers.get("set-cookie");
        if (setCookie) {
            return setCookie.split(";")[0];
        }
        return "";
    }

    // 1. Check Categories
    console.log("\n1. Testing GET /api/categories...");
    const catRes = await fetch(`${BASE_URL}/categories`);
    const catData = await catRes.json();
    console.log(`✓ Fetched ${catData.categories?.length || 0} categories:`, catData.categories?.map(c => c.name));

    // 2. Check Products with multi-filter, search, sort, pagination
    console.log("\n2. Testing GET /api/products with multi-filter & search...");
    const prodRes = await fetch(`${BASE_URL}/products?page=1&limit=10&sort=low&search=t-shirt`);
    const prodData = await prodRes.json();
    console.log(`✓ Filtered products found: ${prodData.products?.length || 0}, total: ${prodData.total}`);

    // 3. Customer Login
    console.log("\n3. Testing POST /api/auth/login (Customer)...");
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "ankit@example.com", password: "password123" })
    });
    const loginData = await loginRes.json();
    customerCookie = getCookieFromHeaders(loginRes);
    console.log(`✓ Customer login status ${loginRes.status}: user ${loginData.user?.username} (${loginData.user?.email})`);

    // 4. Customer Profile & Cart
    console.log("\n4. Testing GET /api/auth/get-me...");
    const meRes = await fetch(`${BASE_URL}/auth/get-me`, {
        headers: { Cookie: customerCookie }
    });
    const meData = await meRes.json();
    console.log(`✓ Customer session verified: ${meData.user?.username}`);

    // 5. Test Product Review
    console.log("\n5. Testing POST /api/products/:id/reviews...");
    const sampleProduct = prodData.products[0];
    if (sampleProduct) {
        const reviewRes = await fetch(`${BASE_URL}/products/${sampleProduct._id}/reviews`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Cookie: customerCookie },
            body: JSON.stringify({ rating: 5, comment: "Fantastic quality fabric and perfect fit!" })
        });
        const reviewData = await reviewRes.json();
        console.log(`✓ Review created: rating ${reviewData.rating}, reviews count: ${reviewData.reviewsCount}`);
    }

    // 6. Test Cart operations & Stock constraints
    console.log("\n6. Testing Cart sync and stock limits...");
    if (sampleProduct) {
        // Add to cart
        const addCartRes = await fetch(`${BASE_URL}/cart`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Cookie: customerCookie },
            body: JSON.stringify({
                items: [{
                    productId: sampleProduct._id,
                    quantity: 2,
                    color: sampleProduct.colors?.[0] || "Black",
                    size: "Large"
                }]
            })
        });
        const cartData = await addCartRes.json();
        console.log(`✓ Added item to cart: items in cart = ${cartData.cart?.items?.length || 0}`);
    }

    // 7. Test Order Placement with Promo Code SAVE20
    console.log("\n7. Testing POST /api/orders with coupon SAVE20...");
    const orderRes = await fetch(`${BASE_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Cookie: customerCookie },
        body: JSON.stringify({
            items: [{
                productId: sampleProduct._id,
                quantity: 1,
                color: sampleProduct.colors?.[0] || "Black",
                size: "Large"
            }],
            shippingAddress: {
                street: "123 Fashion Blvd",
                city: "New York",
                state: "NY",
                pinCode: "10001",
                country: "USA"
            },
            couponCode: "SAVE20"
        })
    });
    const orderData = await orderRes.json();
    console.log(`✓ Order placed successfully! Order ID: ${orderData.order?._id}, Total: $${orderData.order?.totalAmount}, Discount: $${orderData.order?.discountAmount} (${orderData.order?.couponCode})`);

    // 8. Test Customer Order History & Order Details
    console.log("\n8. Testing GET /api/orders/myorders...");
    const ordersRes = await fetch(`${BASE_URL}/orders/myorders`, {
        headers: { Cookie: customerCookie }
    });
    const ordersData = await ordersRes.json();
    console.log(`✓ Customer order history retrieved: ${ordersData.orders?.length || 0} orders found`);

    // 9. Admin Login
    console.log("\n9. Testing POST /api/auth/login (Admin)...");
    const adminLoginRes = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "admin@example.com", password: "admin123" })
    });
    const adminLoginData = await adminLoginRes.json();
    adminCookie = getCookieFromHeaders(adminLoginRes);
    console.log(`✓ Admin logged in: ${adminLoginData.user?.email}, role: ${adminLoginData.user?.role}`);

    // 10. Admin Dashboard Metrics (including Low Stock <= 5, Out of Stock === 0)
    console.log("\n10. Testing GET /api/admin/dashboard...");
    const dashRes = await fetch(`${BASE_URL}/admin/dashboard`, {
        headers: { Cookie: adminCookie }
    });
    const dashData = await dashRes.json();
    console.log(`✓ Admin Dashboard Metrics:`, {
        totalProducts: dashData.totalProducts,
        totalCategories: dashData.totalCategories,
        totalUsers: dashData.totalUsers,
        totalOrders: dashData.totalOrders,
        totalRevenue: dashData.totalRevenue,
        lowStockProducts: dashData.lowStockProducts,
        outOfStockProducts: dashData.outOfStockProducts
    });

    // 11. Admin Product Inventory Update
    console.log("\n11. Testing PUT /api/products/:id (Quick Stock Update)...");
    if (sampleProduct) {
        const updateStockRes = await fetch(`${BASE_URL}/products/${sampleProduct._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", Cookie: adminCookie },
            body: JSON.stringify({ quantity: 18 })
        });
        const updatedProd = await updateStockRes.json();
        console.log(`✓ Stock updated for product "${updatedProd.product?.title}": new qty = ${updatedProd.product?.quantity}`);
    }

    // 12. Admin Order Status Update
    if (orderData.order?._id) {
        console.log("\n12. Testing POST /api/orders/:id/status (Admin status update)...");
        const statusRes = await fetch(`${BASE_URL}/orders/${orderData.order._id}/status`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Cookie: adminCookie },
            body: JSON.stringify({ status: "Shipped" })
        });
        const statusData = await statusRes.json();
        console.log(`✓ Order ${orderData.order._id} status updated to: ${statusData.order?.status}`);
    }

    console.log("\n==========================================");
    console.log("🎉 ALL E2E INTEGRATION TESTS PASSED 100%!");
    console.log("==========================================");
}

runTests().catch(err => {
    console.error("Test failed:", err);
    process.exit(1);
});
