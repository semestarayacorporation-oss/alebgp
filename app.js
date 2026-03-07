// app.js

// ==========================================
// 1. IMPORT ENGINE INTI & SEMUA MODUL
// ==========================================
import DB from './db.js';
import Auth from './auth.js';
import Router from './router.js';

// Import Modul Fungsional (Fase 4 - Fase 9)
import MasterModule from './master.js';
import SalesModule from './sales.js';
import OperasionalModule from './operasional.js';
import LastMileModule from './lastmile.js';
import FinanceModule from './finance.js';
import TreasuryModule from './treasury.js';

const App = {
    // ==========================================
    // 2. INISIALISASI APLIKASI & ROUTING
    // ==========================================
    init: () => {
        // Inisialisasi router pada container utama di dashboard.html
        Router.init('app-content'); 
        
        // Route Placeholder (Login & Dashboard Umum)
        Router.addRoute('#/login', () => `
            <div class="flex flex-col items-center justify-center h-full">
                <h2 class="text-2xl font-bold text-gray-700 mb-2">Sesi Berakhir</h2>
                <p class="text-gray-500 mb-4">Silakan kembali ke halaman utama untuk login.</p>
                <a href="corporate.html" class="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold">Ke Portal Utama</a>
            </div>
        `, ['ALL']);

        Router.addRoute('#/dashboard', () => `
            <div class="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
                <i class="fas fa-chart-line text-5xl text-blue-200 mb-4"></i>
                <h2 class="text-2xl font-bold text-gray-800">Selamat Datang di Albatros ERP</h2>
                <p class="text-gray-500 mt-2">Pilih menu di sebelah kiri untuk memulai aktivitas operasional Anda.</p>
            </div>
        `, ['ALL']);

        // Route Modul Master Data (Fase 4)
        Router.addRoute('#/master', async () => {
            const html = await MasterModule.render();
            setTimeout(() => { window.MasterUI.init(); }, 50);
            return html;
        }, ['Super Admin', 'Customer Service']);

        // Route Modul Front Desk Sales (Fase 5)
        Router.addRoute('#/sales', async () => {
            const html = await SalesModule.render();
            setTimeout(() => { window.SalesUI.init(); }, 50);
            return html;
        }, ['Super Admin', 'CS Counter', 'Sales Executive', 'Customer Service']);

        // Route Modul Mid-Mile Operasional (Fase 6)
        Router.addRoute('#/operasional', async () => {
            const html = await OperasionalModule.render();
            setTimeout(() => { window.OpsUI.init(); }, 50);
            return html;
        }, ['Super Admin', 'Operasional']);

        // Route Modul Last-Mile Operasional (Fase 7)
        Router.addRoute('#/lastmile', async () => {
            const html = await LastMileModule.render();
            setTimeout(() => { window.LastMileUI.init(); }, 50);
            return html;
        }, ['Super Admin', 'Operasional']);

        // Route Modul Finance / AR (Fase 8)
        Router.addRoute('#/finance', async () => {
            const html = await FinanceModule.render();
            setTimeout(() => { window.FinanceUI.init(); }, 50);
            return html;
        }, ['Super Admin', 'Finance / AR']);

        // Route Modul Treasury / Cashier (Fase 9)
        Router.addRoute('#/treasury', async () => {
            const html = await TreasuryModule.render();
            setTimeout(() => { window.TreasuryUI.init(); }, 50);
            return html;
        }, ['Super Admin', 'Finance / AR']);

        // Render menu sidebar berdasarkan Role pengguna yang login
        App.renderSidebarMenu();
    },

    // ==========================================
    // 3. RENDER SIDEBAR (RBAC DINAMIS)
    // ==========================================
    renderSidebarMenu: () => {
        const user = Auth.getCurrentUser();
        const sidebar = document.getElementById('sidebar-menu'); 
        
        if (!sidebar || !user) return;

        // Definisi RBAC Menu Lengkap dari Fase 1 hingga Fase 9
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
            // Logika pengecekan akses (Bypass jika Super Admin atau ALL)
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
        
        // Tombol Logout di bagian paling bawah
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
// 4. EXPOSE & BOOTSTRAP
// ==========================================
// Expose fungsi logout ke window object agar bisa dipanggil dari HTML (onclick)
window.logoutApp = Auth.logout;

// Jalankan App.init saat seluruh struktur DOM HTML selesai dimuat
document.addEventListener('DOMContentLoaded', App.init);
