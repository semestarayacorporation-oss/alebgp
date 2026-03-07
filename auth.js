// auth.js
import DB from './db.js';

const SESSION_KEY = 'albatros_session';

const Auth = {
    login: (username, password) => {
        const users = DB.getAll('users');
        const user = users.find(u => u.username === username && u.password === password);
        
        if (user) {
            // Hilangkan password dari sesi aktif demi keamanan dasar
            const { password: _, ...sessionUser } = user;
            localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
            return true;
        }
        return false;
    },
    logout: () => {
        localStorage.removeItem(SESSION_KEY);
        window.location.hash = '#/login'; // Redirect to login
    },
    getCurrentUser: () => {
        const session = localStorage.getItem(SESSION_KEY);
        return session ? JSON.parse(session) : null;
    },
    checkAccess: (allowedRoles) => {
        const user = Auth.getCurrentUser();
        if (!user) {
            window.location.hash = '#/login';
            return false;
        }
        if (allowedRoles.includes('ALL')) return true;
        if (user.role === 'Super Admin') return true; // Super admin bypass
        
        return allowedRoles.includes(user.role);
    }
};

export default Auth;
