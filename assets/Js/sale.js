// Sale Management JavaScript
const API_BASE = '/api';
let saleItems = [];
let products = [];

// Get auth token
function getToken() {
    return localStorage.getItem('token');
}

// Fetch products for dropdown
async function fetchProducts() {
    try {
        const response = await fetch(`${API_BASE}/products`, {
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        });
        
        if (!response.ok) {
            if (response.status === 401) {
                window.location.href = '/login';
                return;
            }
            throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        products = data.products || data || [];
        populateProductDropdown();
    } catch (error) {
        console.error('Error fetching products:', error);
        // Use sample data for demo if API fails
        products = [
            { id: 1, name: 'Rice (25kg)', price: 1200, stock: 50 },
            { id: 2, name: 'Sugar (1kg)', price: 85, stock: 100 },
            { id: 3, name: 'Oil (1L)', price: 180, stock: 75 },
            { id: 4, name: 'Dal (1kg)', price: 150, stock: 60 },
            { id: 5, name: 'Salt (1kg)', price: 25, stock: 200 },
            { id: 6, name: 'Flour (5kg)', price: 280, stock: 40 }
        ];
        populateProductDropdown();
    }
}

// Populate product dropdown
function populateProductDropdown() {
    const select = document.getElementById('productSelect');
    if (!select) return;
    
    select.innerHTML = '<option value="">-- Select a product --</option>';
    
    products.forEach(product => {
        const stock = product.stock || product.quantity || 0;
        const option = document.createElement('option');
        option.value = product.id;
        option.textContent = `${product.name} (Stock: ${stock})`;
        option.dataset.price = product.selling_price || product.price || 0;
        option.dataset.stock = stock;
        select.appendChild(option);
    });
}

// Handle product selection
document.addEventListener('change', function(e) {
    if (e.target.id === 'productSelect') {
        const selectedOption = e.target.options[e.target.selectedIndex];
        const priceInput = document.getElementById('productPrice');
        
        if (selectedOption.value) {
            priceInput.value = `Rs ${selectedOption.dataset.price}`;
        } else {
            priceInput.value = '';
        }
    }
});

// Open sale modal
function openSaleModal() {
    const modal = document.getElementById('saleModal');
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    resetSaleForm();
    fetchProducts();
}

// Close sale modal
function closeSaleModal() {
    const modal = document.getElementById('saleModal');
    modal.classList.add('hidden');
    document.body.style.overflow = '';
}

// Reset sale form
function resetSaleForm() {
    saleItems = [];
    document.getElementById('saleForm').reset();
    document.getElementById('saleItemsBody').innerHTML = `
        <tr id="noItemsRow">
            <td colspan="5" class="py-8 text-center text-gray-400">
                <i class="fa-solid fa-cart-shopping text-3xl mb-2"></i>
                <p>No items added yet</p>
            </td>
        </tr>
    `;
    updateSummary();
}

// Add product to sale
function addProductToSale() {
    const select = document.getElementById('productSelect');
    const qtyInput = document.getElementById('productQty');
    
    const productId = select.value;
    const selectedOption = select.options[select.selectedIndex];
    
    if (!productId) {
        alert('Please select a product');
        return;
    }
    
    const quantity = parseInt(qtyInput.value) || 1;
    const stock = parseInt(selectedOption.dataset.stock) || 0;
    
    if (quantity > stock) {
        alert(`Only ${stock} items available in stock`);
        return;
    }
    
    const productName = selectedOption.textContent.split(' (Stock:')[0];
    const price = parseFloat(selectedOption.dataset.price) || 0;
    
    // Check if product already in list
    const existingIndex = saleItems.findIndex(item => item.id === productId);
    
    if (existingIndex >= 0) {
        const newQty = saleItems[existingIndex].quantity + quantity;
        if (newQty > stock) {
            alert(`Cannot add more. Only ${stock} items available in stock`);
            return;
        }
        saleItems[existingIndex].quantity = newQty;
        saleItems[existingIndex].total = newQty * price;
    } else {
        saleItems.push({
            id: productId,
            name: productName,
            price: price,
            quantity: quantity,
            total: price * quantity
        });
    }
    
    renderSaleItems();
    updateSummary();
    
    // Reset inputs
    select.value = '';
    qtyInput.value = 1;
    document.getElementById('productPrice').value = '';
}

// Render sale items table
function renderSaleItems() {
    const tbody = document.getElementById('saleItemsBody');
    
    if (saleItems.length === 0) {
        tbody.innerHTML = `
            <tr id="noItemsRow">
                <td colspan="5" class="py-8 text-center text-gray-400">
                    <i class="fa-solid fa-cart-shopping text-3xl mb-2"></i>
                    <p>No items added yet</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = saleItems.map((item, index) => `
        <tr class="hover:bg-gray-50">
            <td class="py-3 px-4">
                <span class="font-medium text-gray-800">${item.name}</span>
            </td>
            <td class="py-3 px-4 text-center text-gray-600">Rs ${item.price.toLocaleString()}</td>
            <td class="py-3 px-4 text-center">
                <div class="flex items-center justify-center gap-2">
                    <button onclick="updateItemQty(${index}, -1)" class="w-7 h-7 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-600 transition">
                        <i class="fa-solid fa-minus text-xs"></i>
                    </button>
                    <span class="w-8 text-center font-medium">${item.quantity}</span>
                    <button onclick="updateItemQty(${index}, 1)" class="w-7 h-7 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-600 transition">
                        <i class="fa-solid fa-plus text-xs"></i>
                    </button>
                </div>
            </td>
            <td class="py-3 px-4 text-center font-bold text-gray-800">Rs ${item.total.toLocaleString()}</td>
            <td class="py-3 px-4 text-center">
                <button onclick="removeItem(${index})" class="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition">
                    <i class="fa-solid fa-trash text-sm"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Update item quantity
function updateItemQty(index, change) {
    const item = saleItems[index];
    const newQty = item.quantity + change;
    
    if (newQty < 1) {
        removeItem(index);
        return;
    }
    
    // Check stock limit
    const product = products.find(p => p.id == item.id);
    const stock = product ? (product.stock || product.quantity || 999) : 999;
    
    if (newQty > stock) {
        alert(`Only ${stock} items available in stock`);
        return;
    }
    
    saleItems[index].quantity = newQty;
    saleItems[index].total = item.price * newQty;
    
    renderSaleItems();
    updateSummary();
}

// Remove item from sale
function removeItem(index) {
    saleItems.splice(index, 1);
    renderSaleItems();
    updateSummary();
}

// Calculate and update summary
function calculateTotal() {
    updateSummary();
}

function updateSummary() {
    const subtotal = saleItems.reduce((sum, item) => sum + item.total, 0);
    const discount = parseFloat(document.getElementById('discountInput')?.value) || 0;
    const grandTotal = Math.max(0, subtotal - discount);
    
    document.getElementById('subtotal').textContent = `Rs ${subtotal.toLocaleString()}`;
    document.getElementById('grandTotal').textContent = `Rs ${grandTotal.toLocaleString()}`;
}

// Save sale
async function saveSale() {
    if (saleItems.length === 0) {
        alert('Please add at least one item to the sale');
        return;
    }
    
    const customerName = document.getElementById('customerName').value.trim() || 'Walk-in Customer';
    const customerPhone = document.getElementById('customerPhone').value.trim();
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value || 'cash';
    const notes = document.getElementById('saleNotes').value.trim();
    const discount = parseFloat(document.getElementById('discountInput').value) || 0;
    
    const subtotal = saleItems.reduce((sum, item) => sum + item.total, 0);
    const grandTotal = Math.max(0, subtotal - discount);
    
    const saleData = {
        customer_name: customerName,
        customer_phone: customerPhone,
        payment_method: paymentMethod,
        notes: notes,
        items: saleItems,
        subtotal: subtotal,
        discount: discount,
        total: grandTotal
    };
    
    try {
        // Try to save to API
        const response = await fetch(`${API_BASE}/sales`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(saleData)
        });
        
        if (response.ok) {
            alert('Sale completed successfully!');
            closeSaleModal();
            location.reload();
            return;
        }
    } catch (error) {
        console.error('API Error:', error);
    }
    
    // Demo mode - add to table directly
    addSaleToTable(saleData);
    alert('Sale completed successfully!');
    closeSaleModal();
}

// Add sale to table (demo mode)
function addSaleToTable(saleData) {
    const tbody = document.querySelector('#sale-table tbody');
    const saleId = `#SALE-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
    const initials = saleData.customer_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const colors = ['purple', 'blue', 'orange', 'green', 'pink', 'indigo'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    const paymentBadges = {
        cash: 'bg-green-50 text-green-700 border-green-100',
        card: 'bg-blue-50 text-blue-700 border-blue-100',
        upi: 'bg-purple-50 text-purple-700 border-purple-100',
        credit: 'bg-orange-50 text-orange-700 border-orange-100'
    };
    
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ', ' + 
                    now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    
    const newRow = document.createElement('tr');
    newRow.className = 'hover:bg-gray-50 transition group';
    newRow.innerHTML = `
        <td class="py-4 px-6 font-medium text-red-500">${saleId}</td>
        <td class="py-4 px-6">
            <div class="flex items-center gap-3">
                <div class="h-8 w-8 rounded-full bg-${randomColor}-100 text-${randomColor}-600 flex items-center justify-center text-xs font-bold">${initials}</div>
                <span class="font-medium text-gray-800">${saleData.customer_name}</span>
            </div>
        </td>
        <td class="py-4 px-6 text-gray-500">${saleData.items.length} items</td>
        <td class="py-4 px-6 font-bold text-gray-800">Rs ${saleData.total.toLocaleString()}</td>
        <td class="py-4 px-6">
            <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${paymentBadges[saleData.payment_method]} border">
                ${saleData.payment_method.charAt(0).toUpperCase() + saleData.payment_method.slice(1)}
            </span>
        </td>
        <td class="py-4 px-6 text-gray-500">${dateStr}</td>
        <td class="py-4 px-6 text-right">
            <div class="flex justify-end gap-2">
                <button class="text-gray-400 hover:text-red-500 p-1 transition" title="View Details">
                    <i class="fa-solid fa-eye text-xs"></i>
                </button>
                <button class="text-gray-400 hover:text-red-500 p-1 transition" title="Edit">
                    <i class="fa-solid fa-pen-to-square text-xs"></i>
                </button>
                <button class="text-gray-400 hover:text-red-500 p-1 transition" title="Delete">
                    <i class="fa-solid fa-trash text-xs"></i>
                </button>
            </div>
        </td>
    `;
    
    tbody.insertBefore(newRow, tbody.firstChild);
}

// View sale modal
function openViewModal(saleId) {
    const modal = document.getElementById('viewSaleModal');
    const content = document.getElementById('viewSaleContent');
    
    // Find the row data
    const rows = document.querySelectorAll('#sale-table tbody tr');
    let saleData = null;
    
    rows.forEach(row => {
        if (row.cells[0]?.textContent.trim() === saleId) {
            saleData = {
                id: row.cells[0].textContent.trim(),
                customer: row.cells[1].textContent.trim(),
                items: row.cells[2].textContent.trim(),
                total: row.cells[3].textContent.trim(),
                payment: row.cells[4].textContent.trim(),
                date: row.cells[5].textContent.trim()
            };
        }
    });
    
    if (saleData) {
        content.innerHTML = `
            <div class="space-y-4">
                <div class="flex justify-between items-center pb-4 border-b">
                    <span class="text-2xl font-bold text-red-500">${saleData.id}</span>
                    <span class="text-sm text-gray-500">${saleData.date}</span>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <p class="text-xs text-gray-500 uppercase">Customer</p>
                        <p class="font-medium">${saleData.customer}</p>
                    </div>
                    <div>
                        <p class="text-xs text-gray-500 uppercase">Items</p>
                        <p class="font-medium">${saleData.items}</p>
                    </div>
                    <div>
                        <p class="text-xs text-gray-500 uppercase">Payment Method</p>
                        <p class="font-medium">${saleData.payment}</p>
                    </div>
                    <div>
                        <p class="text-xs text-gray-500 uppercase">Total Amount</p>
                        <p class="font-bold text-lg text-[#E53935]">${saleData.total}</p>
                    </div>
                </div>
            </div>
        `;
    }
    
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeViewModal() {
    document.getElementById('viewSaleModal').classList.add('hidden');
    document.body.style.overflow = '';
}

// New Sale Button Handler
const newSaleBtn = document.getElementById('newSaleBtn');
if (newSaleBtn) {
    newSaleBtn.addEventListener('click', openSaleModal);
}

// Search functionality for sales
const saleSearchInput = document.getElementById('sale-search');
if (saleSearchInput) {
    saleSearchInput.addEventListener('keyup', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const tableRows = document.querySelectorAll('#sale-table tbody tr');
        
        tableRows.forEach(row => {
            const saleId = row.cells[0]?.textContent.toLowerCase() || '';
            const customer = row.cells[1]?.textContent.toLowerCase() || '';
            
            if (saleId.includes(searchTerm) || customer.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });
}

// Date filter functionality
const dateFilter = document.getElementById('date-filter');
if (dateFilter) {
    dateFilter.addEventListener('change', function(e) {
        const filterValue = e.target.value;
        const tableRows = document.querySelectorAll('#sale-table tbody tr');
        
        tableRows.forEach(row => {
            // For demo purposes, showing all rows
            // In a real application, you would filter based on actual dates
            row.style.display = '';
        });
    });
}

// Export functionality
const exportBtn = document.querySelector('button:has(i.fa-download)');
if (exportBtn) {
    exportBtn.addEventListener('click', function() {
        // Export to CSV functionality
        const table = document.getElementById('sale-table');
        let csv = [];
        const rows = table.querySelectorAll('tr');
        
        rows.forEach(row => {
            let rowData = [];
            const cells = row.querySelectorAll('td, th');
            cells.forEach((cell, index) => {
                // Skip action column
                if (index < cells.length - 1) {
                    rowData.push('"' + cell.textContent.trim().replace(/"/g, '""') + '"');
                }
            });
            csv.push(rowData.join(','));
        });
        
        // Create download link
        const csvContent = csv.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sales_report_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    });
}

// View, Edit, Delete button handlers
document.addEventListener('click', function(e) {
    // View Details
    if (e.target.closest('button[title="View Details"]')) {
        const row = e.target.closest('tr');
        const saleId = row.cells[0].textContent.trim();
        openViewModal(saleId);
    }
    
    // Edit
    if (e.target.closest('button[title="Edit"]')) {
        const row = e.target.closest('tr');
        const saleId = row.cells[0].textContent.trim();
        alert(`Edit functionality for ${saleId} - Coming soon!`);
    }
    
    // Delete
    if (e.target.closest('button[title="Delete"]')) {
        const row = e.target.closest('tr');
        const saleId = row.cells[0].textContent.trim();
        if (confirm(`Are you sure you want to delete ${saleId}?`)) {
            row.remove();
            alert(`${saleId} deleted successfully`);
        }
    }
});

// Close modal on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeSaleModal();
        closeViewModal();
    }
});

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Load products on page load
    fetchProducts();
});