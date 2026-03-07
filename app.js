// app.js

import DB from './db.js';
import Auth from './auth.js';
import Router from './router.js';

import MasterModule from './master.js';
import SalesModule from './sales.js';
import OperasionalModule from './operasional.js';
import LastMileModule from './lastmile.js';
import FinanceModule from './finance.js';
import TreasuryModule from './treasury.js';

const App = {
    init: () => {
        Router.init('app-content'); 

        // 1. DEFAULT ROUTE (Auto-Redirect jika path kosong)
        Router.addRoute('#/', () => {
            window.location.hash = Auth.getCurrentUser() ? '#/dashboard' : '#/login';
            return '';
        }, ['ALL']);

        // 2. FORM LOGIN UTAMA (Perbaikan: Terhubung ke auth.js)
        Router.addRoute('#/login', () => `
            <div class="flex flex-col items-center justify-center h-full max-w-sm mx-auto mt-10">
                <div class="bg-white p-8 rounded-xl shadow-lg w-full border border-gray-100">
                    <div class="text-center mb-6">
                        <i class="fas fa-truck-fast text-4xl text-blue-600 mb-2"></i>
                        <h2 class="text-2xl font-bold text-gray-800">Login Sistem</h2>
                        <p class="text-gray-500 text-sm">Masuk untuk melanjutkan</p>
                    </div>
                    <form onsubmit="window.processLogin(event)">
                        <div class="mb-4">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Username</label>
                            <input type="text" id="login-user" class="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-blue-500" required value="admin">
                        </div>
                        <div class="mb-6">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input type="password" id="login-pass" class="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-blue-500" required value="password123">
                        </div>
                        <button type="submit" class="w-full bg-blue-600 text-white font-bold py-2.5 rounded-lg hover:bg-blue-700 transition shadow-md">
                            Masuk ke Dashboard
                        </button>
                    </form>
                </div>
            </div>
        `, ['ALL']);

        // 3. DASHBOARD UMUM
        Router.addRoute('#/dashboard', () => `
            <div class="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
                <i class="fas fa-chart-line text-5xl text-blue-200 mb-4"></i>
                <h2 class="text-2xl font-bold text-gray-800">Selamat Datang di Albatros ERP</h2>
                <p class="text-gray-500 mt-2">Pilih menu di sebelah kiri untuk memulai aktivitas operasional Anda.</p>
            </div>
        `, ['ALL']);

        // 4. ROUTE MODUL-MODUL
        Router.addRoute('#/master', async () => {
            const html = await MasterModule.render();
            setTimeout(() => { window.MasterUI.init(); }, 50);
            return html;
        }, ['Super Admin', 'Customer Service']);

        Router.addRoute('#/sales', async () => {
            const html = await SalesModule.render();
            setTimeout(() => { window.SalesUI.init(); }, 50);
            return html;
        }, ['Super Admin', 'CS Counter', 'Sales Executive', 'Customer Service']);

        Router.addRoute('#/operasional', async () => {
            const html = await OperasionalModule.render();
            setTimeout(() => { window.OpsUI.init(); }, 50);
            return html;
        }, ['Super Admin', 'Operasional']);

        Router.addRoute('#/lastmile', async () => {
            const html = await LastMileModule.render();
            setTimeout(() => { window.LastMileUI.init(); }, 50);
            return html;
        }, ['Super Admin', 'Operasional']);

        Router.addRoute('#/finance', async () => {
            const html = await FinanceModule.render();
            setTimeout(() => { window.FinanceUI.init(); }, 50);
            return html;
        }, ['Super Admin', 'Finance / AR']);

        Router.addRoute('#/treasury', async () => {
            const html = await TreasuryModule.render();
            setTimeout(() => { window.TreasuryUI.init(); }, 50);
            return html;
        }, ['Super Admin', 'Finance / AR']);

        App.renderSidebarMenu();
    },

    // 5. RENDER SIDEBAR (RBAC DINAMIS)
    renderSidebarMenu: () => {
        const user = Auth.getCurrentUser();
        const sidebar = document.getElementById('sidebar-menu'); 
        
        if (!sidebar || !user) return;

        const menuItems = [
            { title: 'Dashboard Utama', icon: 'home', path: '#/dashboard', roles: ['ALL'] },
            { title: 'Data Master', icon: 'database', path: '#/master', roles: ['Super Admin', 'Customer Service'] },
            { title: 'Sales & CS', icon: 'shopping-cart', path: '#/sales', roles: ['Super Admin', 'CS Counter', 'Sales Executive', 'Customer Service'] },
            { title: 'Mid-Mile Ops', icon: 'truck', path: '#/operasional', roles: ['Super Admin', 'Operasional'] },
            { title: 'Last-Mile Ops', icon: 'motorcycle', path: '#/lastmile', roles: ['Super Admin', 'Operasional'] },
            { title: 'Finance / AR', icon: 'file-invoice-dollar', path: '#/finance', roles: ['Super Admin', 'Finance / AR'] },
            { title: 'Treasury / Kasir', icon: 'cash-register', path: '#/treasury', roles: ['Super Admin', 'Finance / AR'] }
        ];

        let menuHTML = `<ul class="space-y-2 font-medium">`;
        
        menuItems.forEach(item => {
            if (item.roles.includes('ALL') || item.roles.includes(user.role) || user.role === 'Super Admin') {
                menuHTML += `
                    <li>
                        <a href="${item.path}" class="flex items-center p-2 text-gray-200 rounded-lg hover:bg-blue-800 hover:text-white group transition-colors">
                            <i class="fas fa-${item.icon} w-6 text-center text-blue-400 group-hover:text-white"></i>
                            <span class="ml-3">${item.title}</span>
                        </a>
                    </li>
                `;
            }
        });
        
        menuHTML += `
            <li class="mt-8 border-t border-blue-800 pt-4">
                <button onclick="window.logoutApp()" class="w-full text-left flex items-center p-2 text-red-400 rounded-lg hover:bg-red-900 hover:text-red-300 transition-colors">
                    <i class="fas fa-sign-out-alt w-6 text-center"></i>
                    <span class="ml-3">Logout</span>
                </button>
            </li>
        </ul>`;

        sidebar.innerHTML = menuHTML;
    }
};

// ==========================================
// FUNGSI GLOBAL & BOOTSTRAP
// ==========================================

// Fungsi Proses Login
window.processLogin = (e) => {
    e.preventDefault();
    const user = document.getElementById('login-user').value;
    const pass = document.getElementById('login-pass').value;
    
    if (Auth.login(user, pass)) {
        // Arahkan ke dashboard dan lakukan reload untuk merender Sidebar & Nama Profil
        window.location.hash = '#/dashboard';
        window.location.reload(); 
    } else {
        alert('Gagal Login: Username atau password salah!');
    }
};

// Fungsi Logout
window.logoutApp = Auth.logout;

// Inisialisasi Aplikasi
document.addEventListener('DOMContentLoaded', App.init);
