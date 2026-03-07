// router.js
import Auth from './auth.js';

const Router = {
    routes: {},
    rootElement: null,

    init: (rootElementId) => {
        Router.rootElement = document.getElementById(rootElementId);
        window.addEventListener('hashchange', Router.handleRoute);
        window.addEventListener('load', Router.handleRoute);
    },

    addRoute: (path, renderFunction, allowedRoles = ['ALL']) => {
        Router.routes[path] = { render: renderFunction, roles: allowedRoles };
    },

    handleRoute: async () => {
        let path = window.location.hash || '#/';
        
        // Bersihkan parameter query atau ID jika ada (contoh: #/edit/1)
        const basePath = path.split('/')[1] ? `#/${path.split('/')[1]}` : '#/';

        const route = Router.routes[basePath];

        if (route) {
            // Pengecekan RBAC sebelum render
            if (basePath !== '#/' && basePath !== '#/login') {
                if (!Auth.checkAccess(route.roles)) {
                    Router.rootElement.innerHTML = `<div class="p-4 bg-red-100 text-red-700">Akses Ditolak. Anda tidak memiliki izin.</div>`;
                    return;
                }
            }
            
            // Eksekusi fungsi render
            const htmlContent = await route.render();
            if(Router.rootElement && htmlContent) {
                 Router.rootElement.innerHTML = htmlContent;
            }
        } else {
            // 404 Route
            if(Router.rootElement) {
                Router.rootElement.innerHTML = `<div class="p-10 text-center text-2xl text-gray-500 font-bold">404 - Modul Tidak Ditemukan</div>`;
            }
        }
    },
    
    navigate: (path) => {
        window.location.hash = path;
    }
};

export default Router;
