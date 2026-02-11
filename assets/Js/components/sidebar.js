// Sidebar Navigation Component
// Include this file in all pages and call initSidebar() after DOM loads

function createSidebar(activePage = '') {
    const sidebarHTML = `
        <!-- Mobile Sidebar Overlay -->
        <div id="sidebarOverlay" onclick="toggleSidebar()" class="fixed inset-0 bg-black bg-opacity-50 z-20 hidden lg:hidden"></div>

        <!-- SIDEBAR -->
        <aside id="sidebar" class="fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform -translate-x-full lg:translate-x-0 transition-transform duration-300 flex flex-col h-full shadow-xl lg:shadow-none">
            
            <!-- Logo -->
            <div class="p-6 border-b border-gray-100">
                <div class="flex items-center gap-3">
                    <div class="bg-[#E53935] text-white h-10 w-10 flex items-center justify-center rounded-lg font-bold text-2xl shadow-md">सा</div>
                    <div>
                        <h1 class="text-xl font-bold text-gray-800 tracking-tight">Jha System</h1>
                        <p class="text-[10px] text-gray-400 font-medium uppercase tracking-wider">"साझा समाधान, सजिलो व्यापार"</p>
                    </div>
                </div>
            </div>

            <!-- Navigation -->
            <nav class="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                <p class="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Main Menu</p>
                
                <a href="/dashboard" class="sidebar-link ${activePage === 'dashboard' ? 'active' : ''} flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-600">
                    <i class="fa-solid fa-house w-5 text-center transition-colors"></i> Dashboard
                </a>
                <a href="/sale" class="sidebar-link ${activePage === 'sale' ? 'active' : ''} flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-600">
                    <i class="fa-solid fa-cart-shopping w-5 text-center text-gray-400 transition-colors"></i> Sale
                </a>
                <a href="/stock" class="sidebar-link ${activePage === 'stock' || activePage === 'product' ? 'active' : ''} flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-600">
                    <i class="fa-solid fa-boxes-stacked w-5 text-center text-gray-400 transition-colors"></i> Stocks
                </a>
                
                <p class="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-6">Finance & People</p>
                
                <a href="/bill" class="sidebar-link ${activePage === 'bill' ? 'active' : ''} flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-600">
                    <i class="fa-solid fa-file-invoice w-5 text-center text-gray-400 transition-colors"></i> Create Bill
                </a>
                <a href="/bills" class="sidebar-link ${activePage === 'bills' ? 'active' : ''} flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-600">
                    <i class="fa-solid fa-list w-5 text-center text-gray-400 transition-colors"></i> Bills History
                </a>
                <a href="/revenue" class="sidebar-link ${activePage === 'revenue' ? 'active' : ''} flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-600">
                    <i class="fa-solid fa-chart-simple w-5 text-center text-gray-400 transition-colors"></i> Revenue
                </a>
                <a href="/workers" class="sidebar-link ${activePage === 'workers' ? 'active' : ''} flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-600">
                    <i class="fa-solid fa-user-group w-5 text-center text-gray-400 transition-colors"></i> Workers
                </a>
            </nav>

            <!-- Bottom Actions -->
            <div class="p-4 border-t border-gray-100">
                <a href="#" class="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-xl font-medium transition duration-200 opacity-50 cursor-not-allowed" title="Coming Soon">
                    <i class="fa-solid fa-gear w-5 text-center"></i> Settings
                </a>
                <a href="#" onclick="logout()" class="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-xl font-medium transition duration-200">
                    <i class="fa-solid fa-arrow-right-from-bracket w-5 text-center"></i> Log Out
                </a>
            </div>
        </aside>
    `;
    
    return sidebarHTML;
}

// Toggle Sidebar for mobile
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    sidebar.classList.toggle('-translate-x-full');
    overlay.classList.toggle('hidden');
}

// Logout function
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
}

// Initialize sidebar - call this in each page
function initSidebar(activePage) {
    const sidebarContainer = document.getElementById('sidebar-container');
    if (sidebarContainer) {
        sidebarContainer.innerHTML = createSidebar(activePage);
    }
}

// Get common styles for sidebar
function getSidebarStyles() {
    return `
        .sidebar-link {
            transition: all 0.2s;
        }
        .sidebar-link:hover, .sidebar-link.active {
            background: linear-gradient(90deg, #E53935 0%, #EF5350 100%);
            color: white;
            box-shadow: 0 4px 6px -1px rgba(229, 57, 53, 0.3);
            transform: translateX(4px);
        }
        .sidebar-link:hover i, .sidebar-link.active i {
            color: white;
        }
    `;
}
