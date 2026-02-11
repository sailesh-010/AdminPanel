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

// ==================== BILL MANAGEMENT ====================

// Initialize
let billItems = [];
let billMode = 'sell'; // 'sell' or 'buy'

document.addEventListener('DOMContentLoaded', function() {
    // Set current date
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('billDate').value = today;

    // Set Bills link as active
    const billLink = document.querySelector('a[href="/bill"]');
    if (billLink) {
        setActive(billLink);
    }

    // Add event listeners
    setupEventListeners();
});

// Switch Bill Mode (Sell or Buy)
function switchBillMode(mode) {
    try {
        billMode = mode;
        
        // Update button styles
        const sellBtn = document.getElementById('sellModeBtn');
        const buyBtn = document.getElementById('buyModeBtn');
        
        if (mode === 'sell') {
            sellBtn.classList.add('active-mode');
            buyBtn.classList.remove('active-mode');
            const icon = document.querySelector('#retailerSection h3 i');
            if (icon) {
                icon.className = 'fa-solid fa-user-tie text-red-500';
            }
            document.getElementById('partyLabel').textContent = 'Retailer';
            document.getElementById('partyNameLabel').textContent = 'Retailer';
            document.getElementById('retailerName').placeholder = 'e.g., Sita Retailers, Gopal Kirana';
        } else {
            buyBtn.classList.add('active-mode');
            sellBtn.classList.remove('active-mode');
            const icon = document.querySelector('#retailerSection h3 i');
            if (icon) {
                icon.className = 'fa-solid fa-user-tie text-blue-500';
            }
            document.getElementById('partyLabel').textContent = 'Supplier/Vendor';
            document.getElementById('partyNameLabel').textContent = 'Supplier/Vendor';
            document.getElementById('retailerName').placeholder = 'e.g., Wholesale Supplier, Factory Name';
        }
        
        // Clear form
        clearBillForm();
    } catch (error) {
        console.error('Error in switchBillMode:', error);
        alert('Error switching bill mode. Please refresh the page.');
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Add Item Button
    document.getElementById('addItemBtn').addEventListener('click', addItem);

    // Discount calculation
    document.getElementById('discountPercent').addEventListener('change', updateCalculations);

    // Payment Type Change
    document.querySelectorAll('input[name="paymentType"]').forEach(radio => {
        radio.addEventListener('change', handlePaymentTypeChange);
    });

    // Paid Amount for Partial
    document.getElementById('paidAmount').addEventListener('keyup', updateRemainingBalance);

    // Save Button
    document.getElementById('saveBillBtn').addEventListener('click', saveBill);

    // Print Button
    document.getElementById('printBillBtn').addEventListener('click', printBill);

    // Reset Button
    document.getElementById('resetBtn').addEventListener('click', resetForm);
}

// Add Item to Bill
function addItem() {
    const productName = document.getElementById('productName').value.trim();
    const minSize = parseFloat(document.getElementById('minSize').value);
    const maxSize = parseFloat(document.getElementById('maxSize').value);
    const unit = document.getElementById('unit').value;
    const unitPrice = parseFloat(document.getElementById('unitPrice').value);

    // Validation
    if (!productName || isNaN(minSize) || isNaN(maxSize) || !unit || !unitPrice ||
        isNaN(unitPrice) || minSize < 0 || maxSize < 0 || maxSize < minSize || unitPrice < 0) {
        alert('Please fill all item fields with valid values and ensure Max Size >= Min Size');
        return;
    }

    // Create Item Object (calculate total as difference between max and min size * unitPrice)
    const item = {
        id: Date.now(),
        productName,
        minSize,
        maxSize,
        unit,
        unitPrice,
        total: (maxSize - minSize) * unitPrice
    };

    // Add to array
    billItems.push(item);

    // Add to UI
    renderItems();

    // Clear form
    document.getElementById('productName').value = '';
    document.getElementById('minSize').value = '';
    document.getElementById('maxSize').value = '';
    document.getElementById('unit').value = '';
    document.getElementById('unitPrice').value = '';
    document.getElementById('productName').focus();

    // Update calculations
    updateCalculations();
}

// Render Items
function renderItems() {
    const itemsList = document.getElementById('itemsList');
    
    if (billItems.length === 0) {
        itemsList.innerHTML = '<p class="text-center text-gray-400 text-sm py-6">Items will appear here after adding them</p>';
        return;
    }
    
    itemsList.innerHTML = '';

    billItems.forEach((item, index) => {
        const itemCard = document.createElement('div');
        itemCard.className = 'item-card bg-white p-3 rounded-lg border border-gray-200 fade-in shadow-sm hover:shadow-md transition';
        itemCard.innerHTML = `
            <div class="flex items-start justify-between gap-2">
                <div class="flex-1">
                    <p class="font-semibold text-gray-800 text-sm">${item.productName}</p>
                    <p class="text-xs text-gray-500">
                        ${item.minSize} - ${item.maxSize} ${item.unit} × Rs ${item.unitPrice.toFixed(2)} = <span class="font-bold text-gray-800">Rs ${item.total.toFixed(2)}</span>
                    </p>
                </div>
                <button onclick="removeItem(${item.id})" class="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition flex-shrink-0">
                    <i class="fa-solid fa-trash text-xs"></i>
                </button>
            </div>
        `;
        itemsList.appendChild(itemCard);
    });

    // Update item count
    document.getElementById('itemCount').textContent = billItems.length;
}

// Remove Item
function removeItem(itemId) {
    billItems = billItems.filter(item => item.id !== itemId);
    renderItems();
    updateCalculations();
}

// Update Calculations
function updateCalculations() {
    // Calculate subtotal
    const subtotal = billItems.reduce((sum, item) => sum + item.total, 0);

    // Get discount
    const discountPercent = parseFloat(document.getElementById('discountPercent').value) || 0;
    const discountAmount = (subtotal * discountPercent) / 100;

    // Calculate total (without tax)
    const totalAmount = subtotal - discountAmount;

    // Update UI
    document.getElementById('subtotal').textContent = subtotal.toFixed(2);
    document.getElementById('discountAmount').value = `Rs ${discountAmount.toFixed(2)}`;
    document.getElementById('totalAmount').textContent = totalAmount.toFixed(2);

    // Update remaining balance if partial payment
    updateRemainingBalance();
}

// Handle Payment Type Change
function handlePaymentTypeChange() {
    const paymentType = document.querySelector('input[name="paymentType"]:checked').value;
    const paidAmountDiv = document.getElementById('paidAmountDiv');

    if (paymentType === 'partial') {
        paidAmountDiv.classList.remove('hidden');
    } else {
        paidAmountDiv.classList.add('hidden');
        document.getElementById('paidAmount').value = '';
    }
}

// Update Remaining Balance
function updateRemainingBalance() {
    const paymentType = document.querySelector('input[name="paymentType"]:checked').value;
    
    if (paymentType === 'partial') {
        const totalAmount = parseFloat(document.getElementById('totalAmount').textContent);
        const paidAmount = parseFloat(document.getElementById('paidAmount').value) || 0;
        const remaining = totalAmount - paidAmount;
        document.getElementById('remainingBalance').textContent = remaining.toFixed(2);
    }
}

// Save Bill
function saveBill() {
    // Validation
    if (billItems.length === 0) {
        alert('Please add at least one item to the bill');
        return;
    }

    const retailerName = document.getElementById('retailerName').value.trim();
    const billTitle = document.getElementById('billTitle').value.trim();
    const billDate = document.getElementById('billDate').value;
    const paymentMethod = document.getElementById('paymentMethod').value;

    if (!retailerName || !billTitle || !billDate || !paymentMethod) {
        alert('Please fill all required fields');
        return;
    }

    const paymentType = document.querySelector('input[name="paymentType"]:checked').value;
    if (paymentType === 'partial') {
        const paidAmount = parseFloat(document.getElementById('paidAmount').value);
        if (!paidAmount || paidAmount <= 0) {
            alert('Please enter a valid paid amount for partial payment');
            return;
        }
    }

    // Prepare bill data
    const billData = {
        billTitle,
        billDate,
        retailerName,
        contactNumber: document.getElementById('contactNumber').value,
        email: document.getElementById('email').value,
        address: document.getElementById('address').value,
        items: billItems,
        subtotal: parseFloat(document.getElementById('subtotal').textContent),
        discountPercent: parseFloat(document.getElementById('discountPercent').value) || 0,
        discountAmount: parseFloat(document.getElementById('discountAmount').value.replace('Rs ', '')),
        totalAmount: parseFloat(document.getElementById('totalAmount').textContent),
        paymentType,
        paidAmount: paymentType === 'partial' ? parseFloat(document.getElementById('paidAmount').value) : parseFloat(document.getElementById('totalAmount').textContent),
        remainingBalance: paymentType === 'partial' ? parseFloat(document.getElementById('remainingBalance').textContent) : 0,
        paymentMethod,
        notes: document.getElementById('notes').value,
        createdAt: new Date().toISOString(),
        billMode: billMode, // Add bill mode (sell or buy)
        paymentHistory: paymentType === 'partial' ? [
            {
                date: new Date().toISOString().split('T')[0],
                amount: parseFloat(document.getElementById('paidAmount').value),
                type: 'initial'
            }
        ] : []
    };

    // Save to localStorage based on bill mode
    let bills = JSON.parse(localStorage.getItem('bills')) || [];
    bills.push(billData);
    localStorage.setItem('bills', JSON.stringify(bills));

    // Show success message
    const partyType = billMode === 'sell' ? 'Retailer' : 'Supplier/Vendor';
    alert(`✓ Bill saved successfully!\n\n${partyType}: ${retailerName}\nTotal: Rs ${billData.totalAmount.toFixed(2)}\nPayment Type: ${paymentType === 'full' ? 'Full Payment' : 'Partial Payment'}`);

    // Reset form
    resetForm();
}

// Print Bill
function printBill() {
    if (billItems.length === 0) {
        alert('Please add items to the bill before printing');
        return;
    }

    const billTitle = document.getElementById('billTitle').value || 'Bill';
    const retailerName = document.getElementById('retailerName').value || 'Retailer';
    const billDate = document.getElementById('billDate').value;
    const subtotal = document.getElementById('subtotal').textContent;
    const discountAmount = document.getElementById('discountAmount').value;
    const totalAmount = document.getElementById('totalAmount').textContent;
    const paymentType = document.querySelector('input[name="paymentType"]:checked').value;
    const paymentMethod = document.getElementById('paymentMethod').value;

    let itemsHtml = billItems.map((item, index) => `
        <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">${index + 1}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${item.productName}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${item.minSize} - ${item.maxSize} ${item.unit}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">Rs ${item.unitPrice.toFixed(2)}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">Rs ${item.total.toFixed(2)}</td>
        </tr>
    `).join('');

    let paidInfo = '';
    if (paymentType === 'partial') {
        const paidAmount = document.getElementById('paidAmount').value;
        const remaining = document.getElementById('remainingBalance').textContent;
        paidInfo = `
            <tr>
                <td colspan="4" style="border: 1px solid #ddd; padding: 8px; text-align: right; font-weight: bold;">Paid Amount:</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">Rs ${paidAmount}</td>
            </tr>
            <tr>
                <td colspan="4" style="border: 1px solid #ddd; padding: 8px; text-align: right; font-weight: bold;">Remaining Balance:</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: right; color: red; font-weight: bold;">Rs ${remaining}</td>
            </tr>
        `;
    }

    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Print Bill - ${billTitle}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; margin-bottom: 20px; }
                h1 { margin: 0; color: #E53935; }
                .bill-info { margin-bottom: 20px; }
                .bill-info p { margin: 5px 0; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                .summary { float: right; width: 300px; margin-top: 20px; }
                .summary p { display: flex; justify-content: space-between; margin: 8px 0; }
                .total { font-weight: bold; font-size: 18px; color: #E53935; border-top: 2px solid #E53935; padding-top: 10px; }
                .payment-badge { 
                    display: inline-block; 
                    padding: 5px 10px; 
                    background-color: ${paymentType === 'full' ? '#4CAF50' : '#FFC107'}; 
                    color: white; 
                    border-radius: 3px; 
                    margin: 5px 0;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>JHA SYSTEM</h1>
                <p style="color: #666; font-size: 12px;">"साझा समाधान, सजिलो व्यापार"</p>
                <h2>${billTitle}</h2>
            </div>

            <div class="bill-info">
                <p><strong>Date:</strong> ${billDate}</p>
                <p><strong>Retailer:</strong> ${retailerName}</p>
                <p><strong>Payment Type:</strong> <span class="payment-badge">${paymentType === 'full' ? 'Full Payment' : 'Partial Payment'}</span></p>
            </div>

            <table>
                <thead>
                    <tr style="background-color: #f5f5f5;">
                        <th style="border: 1px solid #ddd; padding: 8px;">S.N.</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Product</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Size</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Unit Price</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHtml}
                </tbody>
            </table>

            <div class="summary">
                <p><span>Subtotal:</span> <span>Rs ${subtotal}</span></p>
                <p><span>Discount:</span> <span>${discountAmount}</span></p>
                <p class="total"><span>Total:</span> <span>Rs ${totalAmount}</span></p>
                ${paidInfo}
            </div>

            <div style="clear: both; margin-top: 40px; text-align: center; color: #999; font-size: 12px;">
                <p>Thank you for your business!</p>
                <p>Payment Method: ${paymentMethod}</p>
            </div>

            <script>
                window.print();
                window.close();
            </script>
        </body>
        </html>
    `);
    printWindow.document.close();
}

// Reset Form
function resetForm() {
    // Clear items
    billItems = [];
    document.getElementById('itemsList').innerHTML = '';
    document.getElementById('itemCount').textContent = '0';

    // Reset form fields
    document.getElementById('retailerName').value = '';
    document.getElementById('contactNumber').value = '';
    document.getElementById('email').value = '';
    document.getElementById('address').value = '';
    document.getElementById('billTitle').value = '';
    document.getElementById('notes').value = '';

    // Reset numbers
    document.getElementById('discountPercent').value = '';
    document.getElementById('paidAmount').value = '';
    document.querySelector('input[name="paymentType"][value="full"]').checked = true;
    document.getElementById('paymentMethod').value = '';

    // Reset calculations
    document.getElementById('subtotal').textContent = '0.00';
    document.getElementById('discountAmount').value = 'Rs 0.00';
    document.getElementById('totalAmount').textContent = '0.00';
    document.getElementById('remainingBalance').textContent = '0.00';

    // Reset date
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('billDate').value = today;

    // Hide paid amount div
    document.getElementById('paidAmountDiv').classList.add('hidden');

    // Focus on retailer name
    document.getElementById('retailerName').focus();
}

// Clear form for mode switching
function clearBillForm() {
    try {
        // Clear items
        billItems = [];
        const itemsList = document.getElementById('itemsList');
        const itemCount = document.getElementById('itemCount');
        if (itemsList) itemsList.innerHTML = '';
        if (itemCount) itemCount.textContent = '0';

        // Reset form fields
        const fields = ['retailerName', 'contactNumber', 'email', 'address', 'billTitle', 'notes'];
        fields.forEach(id => {
            const elem = document.getElementById(id);
            if (elem) elem.value = '';
        });

        // Reset numbers
        const numberFields = ['discountPercent', 'paidAmount'];
        numberFields.forEach(id => {
            const elem = document.getElementById(id);
            if (elem) elem.value = '';
        });

        const paymentTypeRadio = document.querySelector('input[name="paymentType"][value="full"]');
        if (paymentTypeRadio) paymentTypeRadio.checked = true;

        const paymentMethod = document.getElementById('paymentMethod');
        if (paymentMethod) paymentMethod.value = '';

        // Reset calculations
        const textFields = {
            'subtotal': '0.00',
            'totalAmount': '0.00',
            'remainingBalance': '0.00'
        };
        Object.entries(textFields).forEach(([id, value]) => {
            const elem = document.getElementById(id);
            if (elem) elem.textContent = value;
        });

        const valueFields = {
            'discountAmount': 'Rs 0.00'
        };
        Object.entries(valueFields).forEach(([id, value]) => {
            const elem = document.getElementById(id);
            if (elem) elem.value = value;
        });

        // Reset date to today
        const billDate = document.getElementById('billDate');
        if (billDate) {
            const today = new Date().toISOString().split('T')[0];
            billDate.value = today;
        }

        // Hide paid amount div
        const paidAmountDiv = document.getElementById('paidAmountDiv');
        if (paidAmountDiv) paidAmountDiv.classList.add('hidden');

        // Focus on retailer name
        const retailerName = document.getElementById('retailerName');
        if (retailerName) retailerName.focus();
    } catch (error) {
        console.error('Error in clearBillForm:', error);
    }
}
