import { initRouter } from './router.js';
import { checkAuth, logout, getUser } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Auth Guard
    if (!checkAuth()) {
        window.location.href = 'index.html';
        return;
    }

    const user = getUser();
    document.getElementById('userNameDisplay').innerText = `Welcome, ${user.username.toUpperCase()}`;

    // 2. Setup Sidebar Menu by Role
    const navMenu = document.getElementById('nav-menu');
    const menus = [
        { name: 'Dashboard Ops', hash: '#/dashboard-ops', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
        { name: 'Entri Resi Cash', hash: '#/resi-cash', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
// Tambahkan di dalam file app.js bagian `const menus = [...]`
{ name: 'Master Pelanggan', hash: '#/master-customer', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
{ name: 'Master Vendor', hash: '#/master-vendor', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' }
    ];

    if (user.role === 'admin') {
        menus.push({ name: 'Master User', hash: '#/master-user', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' });
    }

    navMenu.innerHTML = menus.map(m => `
        <a href="${m.hash}" class="flex items-center px-4 py-3 text-sm font-medium text-indigo-100 rounded-lg hover:bg-indigo-800 transition">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${m.icon}"></path></svg>
            ${m.name}
        </a>
    `).join('');

    // 3. UI Interactions
    document.getElementById('btnToggleSidebar').addEventListener('click', () => {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.toggle('-ml-64');
    });

    document.getElementById('btnLogout').addEventListener('click', () => {
        logout();
        window.location.href = 'index.html';
    });

    // 4. Init SPA Router
    initRouter();
});
