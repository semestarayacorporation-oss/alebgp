import { getDb } from './db.js';

const routes = {
    '/': { title: 'Dashboard', module: null }, // Bisa dibuat module dashboard terpisah
    '/master/users': { title: 'Master Data - Users', module: './../modules/master/users.js', allowed: ['Super Admin'] },
    '/sales/resi-cash': { title: 'Sales - Resi Cash', module: './../modules/sales/resi-cash.js', allowed: ['Super Admin', 'CS Counter'] },
    '/operasional/outgoing': { title: 'Operasional - Outgoing', module: './../modules/operasional/outgoing.js', allowed: ['Super Admin', 'Operasional'] },
    '/ar/invoice': { title: 'AR - Invoice', module: './../modules/ar/invoice.js', allowed: ['Super Admin', 'Finance / AR'] }
};

export const initRouter = async () => {
    const session = JSON.parse(localStorage.getItem('session_user'));
    if (!session) {
        window.location.href = 'index.html';
        return;
    }

    const route = window.location.hash.slice(1) || '/';
    const routeConfig = routes[route];
    
    if (routeConfig) {
        // RBAC Check
        if (routeConfig.allowed && !routeConfig.allowed.includes(session.role)) {
            document.getElementById('app-content').innerHTML = `<div class="p-4 bg-red-100 text-red-700 rounded-lg">Akses Ditolak. Role ${session.role} tidak diizinkan.</div>`;
            return;
        }

        document.getElementById('page-title').innerText = routeConfig.title;
        const container = document.getElementById('app-content');
        
        if (routeConfig.module) {
            container.innerHTML = '<p class="text-gray-500">Memuat modul...</p>';
            try {
                const module = await import(routeConfig.module);
                container.innerHTML = module.render();
                if(module.afterRender) module.afterRender();
            } catch (err) {
                container.innerHTML = `<div class="p-4 bg-red-100 text-red-700">Gagal memuat modul: ${err.message}</div>`;
            }
        } else {
            container.innerHTML = `<h2 class="text-2xl font-bold">Selamat Datang di Albatros, ${session.name}</h2>`;
        }
    } else {
        document.getElementById('app-content').innerHTML = '<h2 class="text-2xl font-bold text-gray-400">404 - Modul Tidak Ditemukan</h2>';
    }
};
