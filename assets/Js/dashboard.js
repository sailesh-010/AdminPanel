
// Sidebar Toggle for Mobile
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('sidebarOverlay');

function toggleSidebar() {
    sidebar.classList.toggle('-translate-x-full');
    overlay.classList.toggle('hidden');
}
// Active Link Handler
function setActive(element) {
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.classList.remove('active');
    });
    element.classList.add('active');
}

// Chart.js Implementation
const ctx = document.getElementById('salesChart').getContext('2d');
        
// Gradient for the line chart
let gradient = ctx.createLinearGradient(0, 0, 0, 400);
gradient.addColorStop(0, 'rgba(229, 57, 53, 0.2)');   
gradient.addColorStop(1, 'rgba(229, 57, 53, 0.0)');

const salesChart = new Chart(ctx, {
type: 'line',
data: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
        label: 'Revenue (Rs)',
        data: [12000, 19000, 15000, 25000, 22000, 30000, 28000],
        borderColor: '#E53935',
        backgroundColor: gradient,
        borderWidth: 2,
        pointBackgroundColor: '#fff',
        pointBorderColor: '#E53935',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: true,
        tension: 0.4
    },
    {
        label: 'Profit (Rs)',
        data: [4000, 6000, 5000, 8000, 7000, 10000, 9000],
        borderColor: '#3b82f6', // Blue color for profit
        borderWidth: 2,
        pointBackgroundColor: '#fff',
        pointBorderColor: '#3b82f6',
        pointRadius: 0, // Hide points for cleaner look
        pointHoverRadius: 4,
        borderDash: [5, 5], // Dashed line for profit
        fill: false,
        tension: 0.4
    }]
},
options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top',
            align: 'end',
            labels: {
                usePointStyle: true,
                boxWidth: 8,
                font: {
                    size: 10,
                    family: "'Inter', sans-serif"
                }
            }
        },
        tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            titleColor: '#1f2937',
            bodyColor: '#4b5563',
            borderColor: '#e5e7eb',
            borderWidth: 1,
            padding: 10,
            boxPadding: 4
        }
    },
    scales: {
        y: {
            beginAtZero: true,
            grid: {
                color: '#f3f4f6',
                drawBorder: false
            },
            ticks: {
                font: {
                    size: 10
                },
                callback: function(value) {
                    return 'Rs ' + value / 1000 + 'k';
                }
            }
        },
        x: {
            grid: {
                display: false
            },
            ticks: {
                font: {
                    size: 10
                }
            }
        }
    },
    interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false
    }
    }
});

const API_URL = '/api';
const token = localStorage.getItem('token');

const api = {
    get: async (endpoint) => {
        try {
            const url = `${API_URL}/${endpoint}`;
            console.log(`📡 Fetching: ${url}`);
            
            const response = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            
            if (!response.ok) {
                console.error(`❌ API error: ${response.status} ${response.statusText}`);
                throw new Error(`API error: ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log(`✅ Response:`, data);
            return data;
        } catch (error) {
            console.error(`🔴 Fetch failed for ${endpoint}:`, error);
            throw error;
        }
    },
};

async function logout() {
    try {
        const response = await fetch('/api/auth/logout', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Logout failed');
    } catch (error) {
        console.error(error);
    } finally {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/index.html';
    }
}

async function fetchOverview() {
    try {
        const response = await api.get('dashboard/overview');
        const data = response.data || response;
        document.getElementById('total-products').textContent = data.total_products || 0;
        document.getElementById('total-sales').textContent = data.total_sales || 0;
        document.getElementById('total-revenue').textContent = `Rs ${(data.total_revenue || 0).toLocaleString()}`;
        document.getElementById('total-profit').textContent = `Rs ${(data.total_profit || 0).toLocaleString()}`;
    } catch (error) {
        console.error('Failed to fetch overview:', error);
    }
}

async function fetchSalesAnalytics() {
    try {
        const response = await api.get('dashboard/sales-analytics');
        const data = response.data || response;
        
        if (!Array.isArray(data)) {
            console.error('Sales analytics data is not an array:', data);
            return;
        }
        
        const labels = data.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        const revenues = data.map(d => d.total_revenue);
        const profits = data.map(d => d.total_profit);

        salesChart.data.labels = labels;
        salesChart.data.datasets[0].data = revenues;
        salesChart.data.datasets[1].data = profits;
        salesChart.update();
    } catch (error) {
        console.error('Failed to fetch sales analytics:', error);
    }
}

async function fetchTopProducts() {
    try {
        const response = await api.get('dashboard/top-products');
        const data = response.data || response;
        const topProductsList = document.getElementById('top-products-list');
        topProductsList.innerHTML = ''; 
        data.forEach(product => {
            const productElement = document.createElement('div');
            productElement.className = 'flex items-center justify-between py-3';
            productElement.innerHTML = `
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                        <i class="fa-solid fa-box"></i>
                    </div>
                    <div>
                        <p class="font-medium text-sm text-gray-800">${product.name}</p>
                        <p class="text-xs text-gray-500">Sold: ${product.total_units_sold}</p>
                    </div>
                </div>
                <p class="font-semibold text-sm text-gray-800">Rs ${product.total_revenue.toLocaleString()}</p>
            `;
            topProductsList.appendChild(productElement);
        });
    } catch (error) {
        console.error('Failed to fetch top products:', error);
    }
}

async function fetchProducts() {
    const search = document.getElementById('product-search').value;
    const category = document.getElementById('category-filter').value;
    const inStock = document.getElementById('in-stock-filter').checked;

    let url = `products/search?name=${search}&category=${category}&inStock=${inStock}`;

    try {
        const response = await api.get(url);
        const products = response.products || response.data || [];
        renderProducts(products);
    } catch (error) {
        console.error('Failed to fetch products:', error);
    }
}

function renderProducts(products) {
    const productTableBody = document.querySelector('#product-table tbody');
    productTableBody.innerHTML = '';

    if (!products || products.length === 0) {
        productTableBody.innerHTML = '<tr><td colspan="4" class="text-center py-4">No products found</td></tr>';
        return;
    }

    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="py-4 px-6">${product.name}</td>
            <td class="py-4 px-6">${product.category}</td>
            <td class="py-4 px-6">Rs ${product.price.toLocaleString()}</td>
            <td class="py-4 px-6">${product.quantity}</td>
        `;
        productTableBody.appendChild(row);
    });
}

async function fetchCategories() {
    try {
        const response = await api.get('products/category');
        const categories = response.data || response;
        const categoryFilter = document.getElementById('category-filter');
        
        if (Array.isArray(categories)) {
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                categoryFilter.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Failed to fetch categories:', error);
    }
}

function initializeDashboard() {
    if (!token) {
        window.location.href = '/';
        return;
    }

    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.user_metadata) {
        document.getElementById('username').textContent = user.user_metadata.name || 'Admin User';
        document.getElementById('user-role').textContent = user.user_metadata.role || 'Store Manager';
        const initials = (user.user_metadata.name || 'AU').split(' ').map(n => n[0]).join('');
        document.getElementById('user-initials').textContent = initials;
    }

    document.getElementById('logout-button').addEventListener('click', logout);
    
    fetchOverview();
    fetchSalesAnalytics();
    fetchTopProducts();
    fetchProducts();
    fetchCategories();

    document.getElementById('product-search').addEventListener('input', fetchProducts);
    document.getElementById('category-filter').addEventListener('change', fetchProducts);
    document.getElementById('in-stock-filter').addEventListener('change', fetchProducts);
}

document.addEventListener('DOMContentLoaded', initializeDashboard);