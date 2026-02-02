// Toggle Sidebar
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    sidebar.classList.toggle('-translate-x-full');
    overlay.classList.toggle('hidden');
}

// Set Active Menu Item
function setActive(element) {
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.classList.remove('active');
    });
    element.classList.add('active');
}

// Fetch categories
async function fetchCategories() {
    try {
        const token = localStorage.getItem('token');
        
        if (!token) {
            console.error('❌ No token found in localStorage');
            updateCategoryDropdown(['No categories available']);
            return;
        }
        
        console.log('📡 Fetching categories with token...');
        
        const response = await fetch('/api/products/category', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log(`📊 Response status: ${response.status}`);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Failed to fetch categories:', response.status, errorText);
            updateCategoryDropdown(['Error loading categories']);
            return;
        }

        const result = await response.json();
        console.log('✅ Categories response:', result);
        
        // Handle both { data: [...] } and direct array responses
        const categories = result.data || result;
        
        if (!Array.isArray(categories)) {
            console.error('❌ Categories is not an array:', categories);
            updateCategoryDropdown(['Invalid response format']);
            return;
        }

        if (categories.length === 0) {
            console.warn('⚠️ No categories found for this tenant');
            updateCategoryDropdown(['No categories available']);
            return;
        }

        console.log(`✅ Loaded ${categories.length} categories:`, categories);
        updateCategoryDropdown(categories);
        
    } catch (error) {
        console.error('🔴 Error fetching categories:', error);
        updateCategoryDropdown(['Error: ' + error.message]);
    }
}

// Helper function to update dropdown
function updateCategoryDropdown(categories) {
    const select = document.getElementById('productCategory');
    
    // Clear all options
    select.innerHTML = '';
    
    // Add default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select Category';
    select.appendChild(defaultOption);
    
    // Add categories
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        select.appendChild(option);
    });
}

// Load categories when the page loads
window.addEventListener('DOMContentLoaded', fetchCategories);

// Add Product Form Handler
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('addProductForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const successMessage = document.getElementById('successMessage');
        const errorMessage = document.getElementById('errorMessage');
        const submitBtn = e.target.querySelector('button[type="submit"]');
        
        const formData = {
            name: document.getElementById('productName').value.trim(),
            categoryId: document.getElementById('productCategory').value.trim(),
            price: parseFloat(document.getElementById('productPrice').value),
            minSize: parseFloat(document.getElementById('sizeMin').value),
            maxSize: parseFloat(document.getElementById('sizeMax').value),
            stockQuantity: parseInt(document.getElementById('productQuantity').value)
        };

        // Validation
        if (!formData.name) {
            showError(errorMessage, successMessage, 'Product name is required');
            return;
        }

        if (!formData.categoryId) {
            showError(errorMessage, successMessage, 'Category is required');
            return;
        }

        if (formData.price <= 0) {
            showError(errorMessage, successMessage, 'Price must be greater than 0');
            return;
        }

        if (formData.minSize < 0 || formData.maxSize < 0) {
            showError(errorMessage, successMessage, 'Size cannot be negative');
            return;
        }

        if (formData.minSize > formData.maxSize) {
            showError(errorMessage, successMessage, 'Minimum size cannot be greater than maximum size');
            return;
        }

        if (formData.numberOfSets <= 0) {
            showError(errorMessage, successMessage, 'Quantity must be at least 1');
            return;
        }

        // Disable button during submission
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner animate-spin mr-2"></i> Adding...';

        try {
            const token = localStorage.getItem('token');
            console.log('📤 Submitting product:', formData);
            
            // Send data to server
            const response = await fetch('/api/products/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            console.log('📥 Response:', data);
            
            if (response.ok) {
                showSuccess(errorMessage, successMessage);
                document.getElementById('addProductForm').reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fa-solid fa-check mr-2"></i> Add Product';

                // Redirect to dashboard
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 1500);
            } else {
                showError(errorMessage, successMessage, data.error || 'Failed to add product');
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fa-solid fa-check mr-2"></i> Add Product';
            }
        } catch (error) {
            console.error('🔴 Error:', error);
            showError(errorMessage, successMessage, 'Error: ' + error.message);
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fa-solid fa-check mr-2"></i> Add Product';
        }
    });
});

function showSuccess(errorMsg, successMsg) {
    successMsg.classList.remove('hidden');
    errorMsg.classList.add('hidden');
}

function showError(errorMsg, successMsg, message) {
    errorMsg.textContent = message;
    errorMsg.classList.remove('hidden');
    successMsg.classList.add('hidden');
}
