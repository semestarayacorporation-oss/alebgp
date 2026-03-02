import { getDb } from './db.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    if(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const user = document.getElementById('username').value;
            const pass = document.getElementById('password').value;
            
            const db = getDb() || { users: [{username:'admin', password:'123', role:'Super Admin'}] };
            const validUser = db.users.find(u => u.username === user && u.password === pass);
            
            if (validUser) {
                localStorage.setItem('session_user', JSON.stringify(validUser));
                window.location.href = 'dashboard.html#/';
            } else {
                alert('Username atau password salah!');
            }
        });
    }
});
