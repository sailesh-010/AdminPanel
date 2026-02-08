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

// New Sale Button Handler
const newSaleBtn = document.getElementById('newSaleBtn');
if (newSaleBtn) {
    newSaleBtn.addEventListener('click', function() {
        // You can replace this with actual implementation
        alert('New Sale form will open here');
    });
}

// Search functionality for sales
const saleSearchInput = document.getElementById('sale-search');
if (saleSearchInput) {
    saleSearchInput.addEventListener('keyup', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const tableRows = document.querySelectorAll('#sale-table tbody tr');
        
        tableRows.forEach(row => {
            const saleId = row.cells[0].textContent.toLowerCase();
            const customer = row.cells[1].textContent.toLowerCase();
            
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
        alert(`Viewing details for ${saleId}`);
        // In a real application, open a modal or navigate to details page
    }
    
    // Edit
    if (e.target.closest('button[title="Edit"]')) {
        const row = e.target.closest('tr');
        const saleId = row.cells[0].textContent.trim();
        alert(`Editing ${saleId}`);
        // In a real application, open an edit modal
    }
    
    // Delete
    if (e.target.closest('button[title="Delete"]')) {
        const row = e.target.closest('tr');
        const saleId = row.cells[0].textContent.trim();
        if (confirm(`Are you sure you want to delete ${saleId}?`)) {
            row.remove();
            alert(`${saleId} deleted successfully`);
            // In a real application, send a DELETE request to the server
        }
    }
});

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Set the Sale link as active
    const saleLink = document.querySelector('a[href="/sale"]');
    if (saleLink) {
        setActive(saleLink);
    }
});
