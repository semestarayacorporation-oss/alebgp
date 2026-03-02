import { initRouter } from './router.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Auth Check
    const session = JSON.parse(localStorage.getItem('zolog_session'));
    if (!session) {
        window.location.href = 'index.html';
        return;
    }

    // 2. Set User Info
    document.getElementById('userInfo').innerHTML = `
        <span class="block font-medium text-white">${session.name}</span>
        <span class="text-xs">${session.role}</span>
    `;

    // 3. UI Interactions
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('zolog_session');
        window.location.href = 'index.html';
    });

    const sidebar = document.getElementById('sidebar');
    document.getElementById('sidebarToggle').addEventListener('click', () => {
        sidebar.classList.toggle('-ml-64');
    });

    // 4. Initialize Router
    initRouter();
});
