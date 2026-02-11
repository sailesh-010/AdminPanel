let allBills = [];
let filteredBills = [];
let currentModalBill = null;
let currentEditingBillIndex = -1;
let modalMode = 'view'; // 'view' or 'edit'
<<<<<<< HEAD
=======
let currentBillType = 'sell'; // 'sell' or 'buy'
>>>>>>> ba41301bbeabe398a7ecf859acb2f4a359f5b6b3

// Load bills on page load
document.addEventListener('DOMContentLoaded', function() {
    loadBills();
<<<<<<< HEAD
    renderBills(allBills);
    updateStats();
});

=======
    filterByBillType();
    updateStats();
});

// Switch bill type filter (Sell or Buy)
function switchBillType(type) {
    currentBillType = type;
    
    // Update button styles
    const sellBtn = document.getElementById('sellBillsBtn');
    const buyBtn = document.getElementById('buyBillsBtn');
    
    if (type === 'sell') {
        sellBtn.classList.add('active-bill-type');
        buyBtn.classList.remove('active-bill-type');
    } else {
        buyBtn.classList.add('active-bill-type');
        sellBtn.classList.remove('active-bill-type');
    }
    
    // Re-filter and display bills
    filterByBillType();
}

>>>>>>> ba41301bbeabe398a7ecf859acb2f4a359f5b6b3
// Load bills from localStorage
function loadBills() {
    const bills = localStorage.getItem('bills');
    allBills = bills ? JSON.parse(bills) : [];
<<<<<<< HEAD
    filteredBills = [...allBills];
=======
}

// Filter bills by type (sell or buy) and render
function filterByBillType() {
    // Filter bills based on current bill type (default to 'sell' for old bills without type)
    filteredBills = allBills.filter(bill => {
        const billType = bill.billMode || 'sell'; // Default to 'sell' for backward compatibility
        return billType === currentBillType;
    });
    
    renderBills(filteredBills);
    updateStats(filteredBills);
>>>>>>> ba41301bbeabe398a7ecf859acb2f4a359f5b6b3
}

// Render bills in table
function renderBills(bills) {
    const tbody = document.getElementById('billsTableBody');
    
    if (bills.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="px-6 py-8 text-center text-gray-500">
                    No bills found. Start by creating a new bill.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = bills.map((bill, index) => `
        <tr class="hover:bg-gray-50 transition">
            <td class="px-6 py-4 font-semibold text-gray-800">${bill.billTitle || 'N/A'}</td>
<<<<<<< HEAD
            <td class="px-6 py-4 text-gray-700">${bill.retailerName}</td>
            <td class="px-6 py-4 text-center text-gray-700">${bill.billDate}</td>
            <td class="px-6 py-4 text-right font-semibold text-gray-800">Rs ${bill.totalAmount.toFixed(2)}</td>
=======
            <td class="px-6 py-4 text-gray-700">${bill.retailerName || 'N/A'}</td>
            <td class="px-6 py-4 text-center text-gray-700">${bill.billDate || 'N/A'}</td>
            <td class="px-6 py-4 text-right font-semibold text-gray-800">Rs ${(bill.totalAmount || 0).toFixed(2)}</td>
>>>>>>> ba41301bbeabe398a7ecf859acb2f4a359f5b6b3
            <td class="px-6 py-4 text-center">
                <span class="px-3 py-1 rounded-full text-sm font-semibold ${bill.paymentType === 'full' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}">
                    ${bill.paymentType === 'full' ? 'Full' : 'Partial'}
                </span>
            </td>
<<<<<<< HEAD
            <td class="px-6 py-4 text-right text-gray-700">Rs ${bill.paidAmount.toFixed(2)}</td>
            <td class="px-6 py-4 text-right font-semibold ${bill.remainingBalance > 0 ? 'text-orange-600' : 'text-green-600'}">
                Rs ${bill.remainingBalance.toFixed(2)}
=======
            <td class="px-6 py-4 text-right text-gray-700">Rs ${(bill.paidAmount || 0).toFixed(2)}</td>
            <td class="px-6 py-4 text-right font-semibold ${(bill.remainingBalance || 0) > 0 ? 'text-orange-600' : 'text-green-600'}">
                Rs ${(bill.remainingBalance || 0).toFixed(2)}
>>>>>>> ba41301bbeabe398a7ecf859acb2f4a359f5b6b3
            </td>
            <td class="px-6 py-4 text-center">
                <div class="flex gap-2 justify-center flex-wrap">
                    <button onclick="viewBillDetails(${index})" class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded transition text-sm">
                        👁️ View
                    </button>
                    <button onclick="editBillPayment(${index})" class="bg-green-500 hover:bg-green-600 text-white font-semibold py-1 px-3 rounded transition text-sm">
                        ✏️ Edit
                    </button>
                    <button onclick="printBill(${index})" class="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-1 px-3 rounded transition text-sm">
                        🖨️ Print
                    </button>
                    <button onclick="deleteBill(${index})" class="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded transition text-sm">
                        🗑️ Delete
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Filter bills
function filterBills() {
    const searchRetailer = document.getElementById('searchRetailer').value.toLowerCase();
    const filterDate = document.getElementById('filterDate').value;
    const filterPaymentType = document.getElementById('filterPaymentType').value;

    filteredBills = allBills.filter(bill => {
<<<<<<< HEAD
=======
        const billType = bill.billMode || 'sell'; // Default to 'sell' for backward compatibility
        const matchType = billType === currentBillType;
>>>>>>> ba41301bbeabe398a7ecf859acb2f4a359f5b6b3
        const matchRetailer = bill.retailerName.toLowerCase().includes(searchRetailer);
        const matchDate = !filterDate || bill.billDate === filterDate;
        const matchPaymentType = !filterPaymentType || bill.paymentType === filterPaymentType;

<<<<<<< HEAD
        return matchRetailer && matchDate && matchPaymentType;
=======
        return matchType && matchRetailer && matchDate && matchPaymentType;
>>>>>>> ba41301bbeabe398a7ecf859acb2f4a359f5b6b3
    });

    renderBills(filteredBills);
    updateStats(filteredBills);
}

// Reset filters
function resetFilters() {
    document.getElementById('searchRetailer').value = '';
    document.getElementById('filterDate').value = '';
    document.getElementById('filterPaymentType').value = '';
    
<<<<<<< HEAD
    filteredBills = [...allBills];
    renderBills(filteredBills);
    updateStats(allBills);
=======
    filterByBillType();
>>>>>>> ba41301bbeabe398a7ecf859acb2f4a359f5b6b3
}

// View bill details in modal
function viewBillDetails(index) {
    modalMode = 'view';
    currentModalBill = filteredBills[index];
    const bill = currentModalBill;

<<<<<<< HEAD
    const itemsHtml = bill.items.map((item, i) => `
        <tr>
            <td class="px-4 py-2 border">${i + 1}</td>
            <td class="px-4 py-2 border">${item.productName}</td>
            <td class="px-4 py-2 border text-center">${item.minSize} - ${item.maxSize}</td>
            <td class="px-4 py-2 border text-right">Rs ${item.unitPrice.toFixed(2)}</td>
            <td class="px-4 py-2 border text-right">Rs ${item.total.toFixed(2)}</td>
=======
    if (!bill) {
        alert('Bill not found');
        return;
    }

    const items = bill.items || [];
    const itemsHtml = items.map((item, i) => `
        <tr>
            <td class="px-4 py-2 border">${i + 1}</td>
            <td class="px-4 py-2 border">${item.productName || 'N/A'}</td>
            <td class="px-4 py-2 border text-center">${item.minSize || 0} - ${item.maxSize || 0}</td>
            <td class="px-4 py-2 border text-right">Rs ${(item.unitPrice || 0).toFixed(2)}</td>
            <td class="px-4 py-2 border text-right">Rs ${(item.total || 0).toFixed(2)}</td>
>>>>>>> ba41301bbeabe398a7ecf859acb2f4a359f5b6b3
        </tr>
    `).join('');

    const detailsHtml = `
        <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <p class="text-gray-600 text-sm">Bill Title</p>
                    <p class="font-semibold text-gray-800">${bill.billTitle || 'N/A'}</p>
                </div>
                <div>
                    <p class="text-gray-600 text-sm">Date</p>
                    <p class="font-semibold text-gray-800">${bill.billDate}</p>
                </div>
                <div>
                    <p class="text-gray-600 text-sm">Retailer Name</p>
                    <p class="font-semibold text-gray-800">${bill.retailerName}</p>
                </div>
                <div>
                    <p class="text-gray-600 text-sm">Contact Number</p>
                    <p class="font-semibold text-gray-800">${bill.contactNumber || 'N/A'}</p>
                </div>
                <div>
                    <p class="text-gray-600 text-sm">Email</p>
                    <p class="font-semibold text-gray-800">${bill.email || 'N/A'}</p>
                </div>
                <div>
                    <p class="text-gray-600 text-sm">Address</p>
                    <p class="font-semibold text-gray-800">${bill.address || 'N/A'}</p>
                </div>
            </div>

            <div class="border-t pt-4">
                <p class="font-semibold text-gray-800 mb-2">Items</p>
                <table class="w-full border-collapse border">
                    <thead>
                        <tr class="bg-gray-100">
                            <th class="px-4 py-2 border text-left">S.N.</th>
                            <th class="px-4 py-2 border text-left">Product</th>
                            <th class="px-4 py-2 border text-center">Size</th>
                            <th class="px-4 py-2 border text-right">Unit Price</th>
                            <th class="px-4 py-2 border text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHtml}
                    </tbody>
                </table>
            </div>

            <div class="border-t pt-4 grid grid-cols-2 gap-4">
                <div>
                    <p class="text-gray-600 text-sm">Subtotal</p>
<<<<<<< HEAD
                    <p class="font-semibold text-gray-800">Rs ${bill.subtotal.toFixed(2)}</p>
                </div>
                <div>
                    <p class="text-gray-600 text-sm">Discount (${bill.discountPercent}%)</p>
                    <p class="font-semibold text-gray-800">Rs ${bill.discountAmount.toFixed(2)}</p>
                </div>
                <div>
                    <p class="text-gray-600 text-sm">Tax (${bill.taxPercent}%)</p>
                    <p class="font-semibold text-gray-800">Rs ${bill.taxAmount.toFixed(2)}</p>
                </div>
                <div class="border-t pt-2">
                    <p class="text-gray-600 text-sm">Total Amount</p>
                    <p class="font-bold text-lg text-indigo-600">Rs ${bill.totalAmount.toFixed(2)}</p>
=======
                    <p class="font-semibold text-gray-800">Rs ${(bill.subtotal || 0).toFixed(2)}</p>
                </div>
                <div>
                    <p class="text-gray-600 text-sm">Discount (${bill.discountPercent || 0}%)</p>
                    <p class="font-semibold text-gray-800">Rs ${(bill.discountAmount || 0).toFixed(2)}</p>
                </div>
                <div>
                    <p class="text-gray-600 text-sm">Tax (${bill.taxPercent || 0}%)</p>
                    <p class="font-semibold text-gray-800">Rs ${(bill.taxAmount || 0).toFixed(2)}</p>
                </div>
                <div class="border-t pt-2">
                    <p class="text-gray-600 text-sm">Total Amount</p>
                    <p class="font-bold text-lg text-indigo-600">Rs ${(bill.totalAmount || 0).toFixed(2)}</p>
>>>>>>> ba41301bbeabe398a7ecf859acb2f4a359f5b6b3
                </div>
            </div>

            <div class="border-t pt-4 grid grid-cols-2 gap-4">
                <div>
                    <p class="text-gray-600 text-sm">Payment Type</p>
                    <p class="font-semibold text-gray-800 px-3 py-1 bg-${bill.paymentType === 'full' ? 'green' : 'orange'}-100 rounded w-fit">
                        ${bill.paymentType === 'full' ? 'Full Payment' : 'Partial Payment'}
                    </p>
                </div>
                <div>
                    <p class="text-gray-600 text-sm">Payment Method</p>
                    <p class="font-semibold text-gray-800">${bill.paymentMethod || 'N/A'}</p>
                </div>
                <div>
                    <p class="text-gray-600 text-sm">Paid Amount</p>
<<<<<<< HEAD
                    <p class="font-semibold text-gray-800">Rs ${bill.paidAmount.toFixed(2)}</p>
=======
                    <p class="font-semibold text-gray-800">Rs ${(bill.paidAmount || 0).toFixed(2)}</p>
>>>>>>> ba41301bbeabe398a7ecf859acb2f4a359f5b6b3
                </div>
                <div>
                    <p class="text-gray-600 text-sm">Remaining Balance</p>
                    <p class="font-semibold ${bill.remainingBalance > 0 ? 'text-orange-600' : 'text-green-600'}">
<<<<<<< HEAD
                        Rs ${bill.remainingBalance.toFixed(2)}
=======
                        Rs ${(bill.remainingBalance || 0).toFixed(2)}
>>>>>>> ba41301bbeabe398a7ecf859acb2f4a359f5b6b3
                    </p>
                </div>
            </div>

            ${bill.paymentType === 'partial' && bill.paymentHistory && bill.paymentHistory.length > 0 ? `
            <div class="border-t pt-4">
                <p class="font-semibold text-gray-800 mb-3">Payment History</p>
                <div class="space-y-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
                    ${bill.paymentHistory.map((payment, i) => `
                        <div class="flex justify-between items-center p-2 bg-white rounded border border-gray-100">
                            <div>
                                <p class="text-sm font-medium text-gray-700">Payment #${i + 1}</p>
<<<<<<< HEAD
                                <p class="text-xs text-gray-500">Date: ${payment.date}</p>
                            </div>
                            <p class="font-bold text-green-600">Rs ${payment.amount.toFixed(2)}</p>
=======
                                <p class="text-xs text-gray-500">Date: ${payment.date || 'N/A'}</p>
                            </div>
                            <p class="font-bold text-green-600">Rs ${(payment.amount || 0).toFixed(2)}</p>
>>>>>>> ba41301bbeabe398a7ecf859acb2f4a359f5b6b3
                        </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}

            ${bill.notes ? `
                <div class="border-t pt-4">
                    <p class="text-gray-600 text-sm">Notes</p>
                    <p class="font-semibold text-gray-800">${bill.notes}</p>
                </div>
            ` : ''}
        </div>
    `;

    document.getElementById('billDetails').innerHTML = detailsHtml;
    
    // Reset button to Print mode
    const actionBtn = document.getElementById('modalActionBtn');
    actionBtn.textContent = '🖨️ Print';
    actionBtn.className = 'bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition';
    
    document.getElementById('billModal').classList.remove('hidden');
}

// Close modal
function closeBillModal() {
    document.getElementById('billModal').classList.add('hidden');
    currentModalBill = null;
}

// Print bill
function printBill(index) {
    const bill = filteredBills[index];
    printBillContent(bill);
}

// Print bill from modal
function printBillFromModal() {
    if (currentModalBill) {
        printBillContent(currentModalBill);
    }
}

// Print bill content
function printBillContent(bill) {
<<<<<<< HEAD
    const itemsHtml = bill.items.map((item, i) => `
        <tr style="border: 1px solid #ddd;">
            <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${i + 1}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${item.productName}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${item.minSize} - ${item.maxSize}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">Rs ${item.unitPrice.toFixed(2)}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">Rs ${item.total.toFixed(2)}</td>
=======
    const items = bill.items || [];
    const itemsHtml = items.map((item, i) => `
        <tr style="border: 1px solid #ddd;">
            <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${i + 1}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${item.productName || 'N/A'}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${item.minSize || 0} - ${item.maxSize || 0}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">Rs ${(item.unitPrice || 0).toFixed(2)}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">Rs ${(item.total || 0).toFixed(2)}</td>
>>>>>>> ba41301bbeabe398a7ecf859acb2f4a359f5b6b3
        </tr>
    `).join('');

    const printWindow = window.open('', '', 'width=900,height=600');
    const paymentType = bill.paymentType;

    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Bill - ${bill.billTitle}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #333; padding-bottom: 10px; }
                .header h1 { margin: 0; font-size: 24px; }
                .header p { margin: 5px 0; font-size: 12px; }
                .bill-info { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
                .bill-info p { margin: 5px 0; font-size: 14px; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                th { background-color: #f5f5f5; padding: 8px; border: 1px solid #ddd; text-align: left; }
                td { padding: 8px; }
                .totals { float: right; width: 40%; margin-bottom: 20px; }
                .totals p { margin: 5px 0; font-size: 14px; }
                .payment-badge { display: inline-block; padding: 5px 10px; background-color: ${paymentType === 'full' ? '#4CAF50' : '#FFC107'}; color: white; border-radius: 3px; margin: 5px 0; }
                .footer { text-align: center; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 10px; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>JHA SYSTEM</h1>
                <p style="color: #666;">साझा समाधान, सजिलो व्यापार</p>
                <h2>${bill.billTitle || 'Bill'}</h2>
            </div>

            <div class="bill-info">
                <div>
                    <p><strong>Date:</strong> ${bill.billDate}</p>
                    <p><strong>Retailer:</strong> ${bill.retailerName}</p>
                    <p><strong>Contact:</strong> ${bill.contactNumber || 'N/A'}</p>
                </div>
                <div>
                    <p><strong>Email:</strong> ${bill.email || 'N/A'}</p>
                    <p><strong>Address:</strong> ${bill.address || 'N/A'}</p>
                    <p><strong>Payment Type:</strong> <span class="payment-badge">${paymentType === 'full' ? 'Full Payment' : 'Partial Payment'}</span></p>
                </div>
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

            <div class="totals">
<<<<<<< HEAD
                <p><strong>Subtotal:</strong> Rs ${bill.subtotal.toFixed(2)}</p>
                <p><strong>Discount (${bill.discountPercent}%):</strong> Rs ${bill.discountAmount.toFixed(2)}</p>
                <p><strong>Tax (${bill.taxPercent}%):</strong> Rs ${bill.taxAmount.toFixed(2)}</p>
                <p style="border-top: 1px solid #ddd; padding-top: 5px;"><strong>Total:</strong> Rs ${bill.totalAmount.toFixed(2)}</p>
                <p><strong>Paid:</strong> Rs ${bill.paidAmount.toFixed(2)}</p>
                ${bill.remainingBalance > 0 ? `<p style="color: #FF6B6B;"><strong>Balance:</strong> Rs ${bill.remainingBalance.toFixed(2)}</p>` : `<p style="color: #4CAF50;"><strong>Status:</strong> Fully Paid</p>`}
=======
                <p><strong>Subtotal:</strong> Rs ${(bill.subtotal || 0).toFixed(2)}</p>
                <p><strong>Discount (${bill.discountPercent || 0}%):</strong> Rs ${(bill.discountAmount || 0).toFixed(2)}</p>
                <p><strong>Tax (${bill.taxPercent || 0}%):</strong> Rs ${(bill.taxAmount || 0).toFixed(2)}</p>
                <p style="border-top: 1px solid #ddd; padding-top: 5px;"><strong>Total:</strong> Rs ${(bill.totalAmount || 0).toFixed(2)}</p>
                <p><strong>Paid:</strong> Rs ${(bill.paidAmount || 0).toFixed(2)}</p>
                ${(bill.remainingBalance || 0) > 0 ? `<p style="color: #FF6B6B;"><strong>Balance:</strong> Rs ${(bill.remainingBalance || 0).toFixed(2)}</p>` : `<p style="color: #4CAF50;"><strong>Status:</strong> Fully Paid</p>`}
>>>>>>> ba41301bbeabe398a7ecf859acb2f4a359f5b6b3
            </div>

            <div style="clear: both;"></div>

            <div class="footer">
                <p>Thank you for your business!</p>
                <p>Generated on: ${new Date().toLocaleString()}</p>
            </div>
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// Delete bill
function deleteBill(index) {
    if (confirm('Are you sure you want to delete this bill? This action cannot be undone.')) {
        const billToDelete = filteredBills[index];
        allBills = allBills.filter(b => b !== billToDelete);
        localStorage.setItem('bills', JSON.stringify(allBills));
        
        loadBills();
        filterBills();
        alert('Bill deleted successfully!');
    }
}

// Delete all bills
function deleteAllBills() {
    if (confirm('Are you sure you want to delete ALL bills? This action cannot be undone.')) {
        localStorage.removeItem('bills');
        allBills = [];
        filteredBills = [];
        renderBills([]);
        updateStats();
        alert('All bills deleted successfully!');
    }
}

// Export to CSV
function exportToCSV() {
    if (filteredBills.length === 0) {
        alert('No bills to export!');
        return;
    }

    let csv = 'Bill Title,Retailer,Date,Total Amount,Paid Amount,Remaining Balance,Payment Type,Payment Method,Notes\n';
    
    filteredBills.forEach(bill => {
        const notes = bill.notes ? bill.notes.replace(/,/g, ';') : '';
<<<<<<< HEAD
        csv += `"${bill.billTitle || ''}","${bill.retailerName}","${bill.billDate}","${bill.totalAmount.toFixed(2)}","${bill.paidAmount.toFixed(2)}","${bill.remainingBalance.toFixed(2)}","${bill.paymentType}","${bill.paymentMethod || ''}","${notes}"\n`;
=======
        csv += `"${bill.billTitle || ''}","${bill.retailerName || ''}","${bill.billDate || ''}","${(bill.totalAmount || 0).toFixed(2)}","${(bill.paidAmount || 0).toFixed(2)}","${(bill.remainingBalance || 0).toFixed(2)}","${bill.paymentType || ''}","${bill.paymentMethod || ''}","${notes}"\n`;
>>>>>>> ba41301bbeabe398a7ecf859acb2f4a359f5b6b3
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bills_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

// Update statistics
function updateStats(bills = allBills) {
    const totalBills = bills.length;
<<<<<<< HEAD
    const totalRevenue = bills.reduce((sum, bill) => sum + bill.totalAmount, 0);
    const totalPaid = bills.reduce((sum, bill) => sum + bill.paidAmount, 0);
    const totalBalance = bills.reduce((sum, bill) => sum + bill.remainingBalance, 0);
=======
    const totalRevenue = bills.reduce((sum, bill) => sum + (bill.totalAmount || 0), 0);
    const totalPaid = bills.reduce((sum, bill) => sum + (bill.paidAmount || 0), 0);
    const totalBalance = bills.reduce((sum, bill) => sum + (bill.remainingBalance || 0), 0);
>>>>>>> ba41301bbeabe398a7ecf859acb2f4a359f5b6b3

    document.getElementById('totalBills').textContent = totalBills;
    document.getElementById('totalRevenue').textContent = `Rs ${totalRevenue.toFixed(2)}`;
    document.getElementById('totalPaid').textContent = `Rs ${totalPaid.toFixed(2)}`;
    document.getElementById('totalBalance').textContent = `Rs ${totalBalance.toFixed(2)}`;
}

// Edit Bill Payment - Update Remaining Balance
function editBillPayment(index) {
    modalMode = 'edit';
    currentModalBill = filteredBills[index];
    const bill = currentModalBill;
<<<<<<< HEAD
=======
    
    if (!bill) {
        alert('Bill not found');
        return;
    }
    
>>>>>>> ba41301bbeabe398a7ecf859acb2f4a359f5b6b3
    currentEditingBillIndex = allBills.findIndex(b => b === bill);

    const editHtml = `
        <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                <div>
                    <p class="text-gray-600 text-sm">Bill Title</p>
                    <p class="font-semibold text-gray-800">${bill.billTitle || 'N/A'}</p>
                </div>
                <div>
                    <p class="text-gray-600 text-sm">Retailer</p>
<<<<<<< HEAD
                    <p class="font-semibold text-gray-800">${bill.retailerName}</p>
                </div>
                <div>
                    <p class="text-gray-600 text-sm">Date</p>
                    <p class="font-semibold text-gray-800">${bill.billDate}</p>
                </div>
                <div>
                    <p class="text-gray-600 text-sm">Total Amount</p>
                    <p class="font-semibold text-gray-800">Rs ${bill.totalAmount.toFixed(2)}</p>
=======
                    <p class="font-semibold text-gray-800">${bill.retailerName || 'N/A'}</p>
                </div>
                <div>
                    <p class="text-gray-600 text-sm">Date</p>
                    <p class="font-semibold text-gray-800">${bill.billDate || 'N/A'}</p>
                </div>
                <div>
                    <p class="text-gray-600 text-sm">Total Amount</p>
                    <p class="font-semibold text-gray-800">Rs ${(bill.totalAmount || 0).toFixed(2)}</p>
>>>>>>> ba41301bbeabe398a7ecf859acb2f4a359f5b6b3
                </div>
            </div>

            <div class="border-t pt-4">
                <p class="font-bold text-gray-800 mb-4">Reduce Pending Amount</p>
                <div class="grid grid-cols-2 gap-4 bg-blue-50 p-4 rounded-lg mb-4 border border-blue-200">
                    <div>
                        <p class="text-gray-600 text-sm">Current Pending Balance</p>
<<<<<<< HEAD
                        <p class="font-bold text-lg text-blue-600">Rs ${bill.remainingBalance.toFixed(2)}</p>
                    </div>
                    <div>
                        <p class="text-gray-600 text-sm">Total Bill Amount</p>
                        <p class="font-bold text-lg text-gray-800">Rs ${bill.totalAmount.toFixed(2)}</p>
=======
                        <p class="font-bold text-lg text-blue-600">Rs ${(bill.remainingBalance || 0).toFixed(2)}</p>
                    </div>
                    <div>
                        <p class="text-gray-600 text-sm">Total Bill Amount</p>
                        <p class="font-bold text-lg text-gray-800">Rs ${(bill.totalAmount || 0).toFixed(2)}</p>
>>>>>>> ba41301bbeabe398a7ecf859acb2f4a359f5b6b3
                    </div>
                </div>

                <div class="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-4">
<<<<<<< HEAD
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Set New Pending Balance (Rs) <span class="text-red-500">*</span></label>
                    <input type="number" id="newPendingBalanceInput" min="0" step="0.01" placeholder="Enter new pending amount" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg" value="${bill.remainingBalance.toFixed(2)}">
                    <p class="text-xs text-gray-600 mt-2">Can set from 0 to Rs ${bill.totalAmount.toFixed(2)}</p>
=======
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Amount Given by Retailer (Rs) <span class="text-red-500">*</span></label>
                    <input type="number" id="newPendingBalanceInput" min="0" step="0.01" placeholder="Enter payment received" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg" value="0.00">
                    <p class="text-xs text-gray-600 mt-2">Can set from 0 to Rs ${(bill.remainingBalance || 0).toFixed(2)}</p>
>>>>>>> ba41301bbeabe398a7ecf859acb2f4a359f5b6b3
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div class="bg-orange-50 p-4 rounded-lg border border-orange-200">
                        <p class="text-sm font-semibold text-gray-700 mb-2">Amount to Reduce</p>
                        <p class="font-bold text-xl text-orange-600" id="reductionAmountDisplay">Rs 0.00</p>
                    </div>
                    <div class="bg-green-50 p-4 rounded-lg border border-green-200">
                        <p class="text-sm font-semibold text-gray-700 mb-2">New Paid Amount</p>
<<<<<<< HEAD
                        <p class="font-bold text-xl text-green-600" id="newPaidAmountDisplay">Rs ${bill.paidAmount.toFixed(2)}</p>
=======
                        <p class="font-bold text-xl text-green-600" id="newPaidAmountDisplay">Rs ${(bill.paidAmount || 0).toFixed(2)}</p>
>>>>>>> ba41301bbeabe398a7ecf859acb2f4a359f5b6b3
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('billDetails').innerHTML = editHtml;
    
    // Update modal button
    const actionBtn = document.getElementById('modalActionBtn');
    actionBtn.textContent = '💾 Update Balance';
    actionBtn.className = 'bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition';
    
    // Add event listener for real-time balance calculation
    setTimeout(() => {
        const newBalanceInput = document.getElementById('newPendingBalanceInput');
        if (newBalanceInput) {
            newBalanceInput.addEventListener('keyup', function() {
<<<<<<< HEAD
                const newBalance = parseFloat(this.value);
                
                if (isNaN(newBalance)) {
                    document.getElementById('reductionAmountDisplay').textContent = `Rs 0.00`;
                    document.getElementById('newPaidAmountDisplay').textContent = `Rs ${bill.paidAmount.toFixed(2)}`;
                    return;
                }

                // Ensure newBalance is within valid range
                const validBalance = Math.max(0, Math.min(newBalance, bill.totalAmount));
                const newPaidAmount = bill.totalAmount - validBalance;
                const paymentAmount = newPaidAmount - bill.paidAmount;
                
                document.getElementById('reductionAmountDisplay').textContent = `Rs ${Math.abs(paymentAmount).toFixed(2)}`;
=======
                const paymentReceived = parseFloat(this.value);
                
                if (isNaN(paymentReceived) || paymentReceived === 0) {
                    document.getElementById('reductionAmountDisplay').textContent = `Rs 0.00`;
                    document.getElementById('newPaidAmountDisplay').textContent = `Rs ${(bill.paidAmount || 0).toFixed(2)}`;
                    return;
                }

                // Ensure payment doesn't exceed pending balance and round to 2 decimal places
                const validPayment = Math.max(0, Math.min(paymentReceived, bill.remainingBalance || 0));
                const roundedPayment = Math.round(validPayment * 100) / 100;
                
                // Calculate new values
                const newPendingBalance = Math.round(((bill.remainingBalance || 0) - roundedPayment) * 100) / 100;
                const newPaidAmount = Math.round(((bill.paidAmount || 0) + roundedPayment) * 100) / 100;
                
                document.getElementById('reductionAmountDisplay').textContent = `Rs ${roundedPayment.toFixed(2)}`;
>>>>>>> ba41301bbeabe398a7ecf859acb2f4a359f5b6b3
                document.getElementById('newPaidAmountDisplay').textContent = `Rs ${newPaidAmount.toFixed(2)}`;
            });
            newBalanceInput.select();
        }
    }, 100);

    // Show modal
    document.getElementById('billModal').classList.remove('hidden');
}

// Handle Modal Action Button
function handleModalAction() {
    if (modalMode === 'edit') {
        savePaymentUpdate();
    } else {
        printBillFromModal();
    }
}

// Save Payment from Edit
function savePaymentUpdate() {
    if (currentEditingBillIndex === -1) return;
    
<<<<<<< HEAD
    const newBalanceInput = document.getElementById('newPendingBalanceInput');
    if (!newBalanceInput) return;

    const newBalance = parseFloat(newBalanceInput.value);
    const bill = allBills[currentEditingBillIndex];

    // Validation
    if (isNaN(newBalance)) {
=======
    const paymentInput = document.getElementById('newPendingBalanceInput');
    if (!paymentInput) return;

    const paymentReceived = parseFloat(paymentInput.value);
    const bill = allBills[currentEditingBillIndex];

    // Validation
    if (isNaN(paymentReceived)) {
>>>>>>> ba41301bbeabe398a7ecf859acb2f4a359f5b6b3
        alert('Please enter a valid amount');
        return;
    }

<<<<<<< HEAD
    if (newBalance < 0) {
        alert('Pending balance cannot be negative');
        return;
    }

    if (newBalance > bill.totalAmount) {
        alert(`Pending balance cannot exceed total bill amount: Rs ${bill.totalAmount.toFixed(2)}`);
        return;
    }

    // Calculate new paid amount to maintain: totalAmount = paidAmount + remainingBalance
    const newPaidAmount = bill.totalAmount - newBalance;
    const previousPaidAmount = bill.paidAmount;
    const previousRemainingBalance = bill.remainingBalance;

    // Update the bill - maintain the invariant
    bill.paidAmount = newPaidAmount;
    bill.remainingBalance = newBalance;

    // Verify the invariant holds
    const checkSum = bill.paidAmount + bill.remainingBalance;
    if (Math.abs(checkSum - bill.totalAmount) > 0.01) {
        // Rollback if there's a calculation error
        bill.paidAmount = previousPaidAmount;
        bill.remainingBalance = previousRemainingBalance;
        alert('Calculation error. Please try again.');
        return;
    }

    const paymentAmount = newPaidAmount - previousPaidAmount;

=======
    if (paymentReceived < 0) {
        alert('Payment amount cannot be negative');
        return;
    }

    if (paymentReceived === 0) {
        alert('Please enter an amount greater than 0');
        return;
    }

    if (paymentReceived > (bill.remainingBalance || 0)) {
        alert(`Payment cannot exceed pending balance: Rs ${(bill.remainingBalance || 0).toFixed(2)}`);
        return;
    }

    // Calculate new values based on payment received
    const roundedPayment = Math.round(paymentReceived * 100) / 100;
    const newPaidAmount = Math.round(((bill.paidAmount || 0) + roundedPayment) * 100) / 100;
    // Force remainingBalance to be derived from totalAmount - paidAmount to maintain invariant
    const newPendingBalance = Math.round(((bill.totalAmount || 0) - newPaidAmount) * 100) / 100;
    
    const previousPaidAmount = bill.paidAmount || 0;
    const previousRemainingBalance = bill.remainingBalance || 0;

    // Update the bill
    bill.paidAmount = newPaidAmount;
    bill.remainingBalance = newPendingBalance;

    // Force exact invariant by adjusting remainingBalance if needed (to handle floating-point errors)
    const calculatedRemainder = bill.totalAmount - bill.paidAmount;
    if (Math.abs(calculatedRemainder - bill.remainingBalance) < 0.01) {
        bill.remainingBalance = Math.round(calculatedRemainder * 100) / 100;
    }

>>>>>>> ba41301bbeabe398a7ecf859acb2f4a359f5b6b3
    // Initialize payment history if it doesn't exist
    if (!bill.paymentHistory) {
        bill.paymentHistory = [];
    }

<<<<<<< HEAD
    // Add to payment history if there's a new payment
    if (paymentAmount > 0) {
        bill.paymentHistory.push({
            date: new Date().toISOString().split('T')[0],
            amount: paymentAmount,
=======
    // Add to payment history only if there's a meaningful payment (> 0.01)
    if (Math.abs(roundedPayment) > 0.01) {
        bill.paymentHistory.push({
            date: new Date().toISOString().split('T')[0],
            amount: roundedPayment,
>>>>>>> ba41301bbeabe398a7ecf859acb2f4a359f5b6b3
            type: 'additional'
        });
    }

    // Save to localStorage
    allBills[currentEditingBillIndex] = bill;
    localStorage.setItem('bills', JSON.stringify(allBills));

<<<<<<< HEAD
    if (paymentAmount > 0) {
        alert(`✓ Payment of Rs ${paymentAmount.toFixed(2)} recorded successfully!\n\nPreviously Paid: Rs ${previousPaidAmount.toFixed(2)}\nNow Paid: Rs ${bill.paidAmount.toFixed(2)}\nRemaining Balance: Rs ${newBalance.toFixed(2)}`);
    } else if (paymentAmount < 0) {
        alert(`✓ Paid amount adjusted by Rs ${Math.abs(paymentAmount).toFixed(2)}\n\nPreviously Paid: Rs ${previousPaidAmount.toFixed(2)}\nNow Paid: Rs ${bill.paidAmount.toFixed(2)}\nRemaining Balance: Rs ${newBalance.toFixed(2)}`);
    } else {
        alert('No changes made');
    }
=======
    alert(`✓ Payment of Rs ${roundedPayment.toFixed(2)} recorded successfully!\n\nPreviously Paid: Rs ${previousPaidAmount.toFixed(2)}\nNow Paid: Rs ${(bill.paidAmount || 0).toFixed(2)}\nRemaining Balance: Rs ${newPendingBalance.toFixed(2)}`);
>>>>>>> ba41301bbeabe398a7ecf859acb2f4a359f5b6b3
    
    // Reset modal mode
    modalMode = 'view';
    currentEditingBillIndex = -1;
    
    // Reload the data
    loadBills();
    filterBills();
    closeBillModal();
}

// Close modal on outside click
document.addEventListener('click', function(event) {
    const modal = document.getElementById('billModal');
    if (event.target === modal) {
        closeBillModal();
    }
});
