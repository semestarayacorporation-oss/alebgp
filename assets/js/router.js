import { render as renderOps, init as initOps } from '../modules/operasional-dashboard.js';
import { render as renderUser, init as initUser } from '../modules/master-user.js';
import { render as renderResi, init as initResi } from '../modules/sales-resi.js';
import { render as renderCustomer, init as initCustomer } from '../modules/master-customer.js';
import { render as renderVendor, init as initVendor } from '../modules/master-vendor.js';
import { render as renderTarif, init as initTarif } from '../modules/operasional-tarif.js';
import { render as renderTracing, init as initTracing } from '../modules/operasional-tracing.js';
import { render as renderDelivery, init as initDelivery } from '../modules/operasional-delivery.js';

const routes = {
    '#/dashboard-ops': { render: renderOps, init: initOps },
    '#/master-user': { render: renderUser, init: initUser },
    '#/resi-cash': { render: renderResi, init: initResi },
'#/master-customer': { render: renderCustomer, init: initCustomer },
'#/master-vendor': { render: renderVendor, init: initVendor },
'#/ops-tarif': { render: renderTarif, init: initTarif },
'#/ops-tracing': { render: renderTracing, init: initTracing },
'#/ops-delivery': { render: renderDelivery, init: initDelivery },
};

export const initRouter = () => {
    const contentDiv = document.getElementById('app-content');

    const handleRouteChange = async () => {
        let hash = window.location.hash;
        if (!hash) {
            hash = '#/dashboard-ops';
            window.location.hash = hash;
            return;
        }

        const route = routes[hash];
        if (route) {
            contentDiv.innerHTML = '<div class="text-center text-gray-500 py-10">Loading module...</div>';
            contentDiv.innerHTML = await route.render();
            if (route.init) route.init();
        } else {
            contentDiv.innerHTML = `<div class="p-8 bg-red-50 text-red-600 rounded-xl border border-red-200">404 - Module Not Found</div>`;
        }
    };

    window.addEventListener('hashchange', handleRouteChange);
    handleRouteChange(); // Trigger on initial load
};
