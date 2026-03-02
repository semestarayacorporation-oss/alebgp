const routes = {
    '': { module: '../modules/operasional-dashboard.js', title: 'Dashboard Operasional' },
    '#/dashboard-ops': { module: '../modules/operasional-dashboard.js', title: 'Dashboard Operasional' },
    '#/master-user': { module: '../modules/master-user.js', title: 'Master User' },
    '#/resi-cash': { module: '../modules/sales-resi.js', title: 'Entri Resi Cash' }
};

export const initRouter = () => {
    const renderRoute = async () => {
        const hash = window.location.hash || '#/dashboard-ops';
        const route = routes[hash];
        const container = document.getElementById('app-content');
        const titleEl = document.getElementById('pageTitle');

        if (route) {
            container.innerHTML = '<div class="flex justify-center p-10"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>';
            titleEl.textContent = route.title;
            
            try {
                // Dynamic import for module
                const module = await import(route.module);
                container.innerHTML = ''; 
                module.render(container);
            } catch (error) {
                container.innerHTML = `<div class="p-4 bg-red-50 text-red-600 rounded-xl">Error loading module: ${error.message}</div>`;
            }
        } else {
            container.innerHTML = `<div class="p-4 bg-yellow-50 text-yellow-700 rounded-xl">404 - Modul tidak ditemukan</div>`;
        }
    };

    window.addEventListener('hashchange', renderRoute);
    renderRoute(); // Trigger on initial load
};
