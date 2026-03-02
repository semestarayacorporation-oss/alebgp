import { dbInit } from './db.js';
import { initRouter } from './router.js';
import { renderSidebar } from './../components/sidebar.js';

document.addEventListener('DOMContentLoaded', () => {
    const session = JSON.parse(localStorage.getItem('session_user'));
    if(!session && window.location.pathname.includes('dashboard')) {
        window.location.href = 'index.html';
        return;
    }
    
    if(session) {
        document.getElementById('userInfo').innerText = `${session.name} (${session.role})`;
        dbInit();
        renderSidebar(session.role);
        
        window.addEventListener('hashchange', initRouter);
        initRouter();

        document.getElementById('logoutBtn').addEventListener('click', () => {
            localStorage.removeItem('session_user');
            window.location.href = 'index.html';
        });
    }
});
