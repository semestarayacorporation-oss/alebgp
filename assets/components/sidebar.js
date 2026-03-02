export const renderSidebar = (userRole) => {
    const nav = document.getElementById('sidebar-nav');
    
    // Dynamic menu berdasarkan Role
    const menus = [
        { title: 'Dashboard', hash: '#/', showTo: ['Super Admin', 'Admin Cabang', 'CS Counter', 'Operasional', 'Finance / AR'] },
        { title: 'Data Master (Users)', hash: '#/master/users', showTo: ['Super Admin'] },
        { title: 'Entri Resi Cash', hash: '#/sales/resi-cash', showTo: ['Super Admin', 'CS Counter'] },
        { title: 'Outgoing (Ops)', hash: '#/operasional/outgoing', showTo: ['Super Admin', 'Operasional'] },
        { title: 'Invoicing (AR)', hash: '#/ar/invoice', showTo: ['Super Admin', 'Finance / AR'] }
    ];

    let html = '<ul class="space-y-2">';
    menus.forEach(menu => {
        if (menu.showTo.includes(userRole)) {
            html += `
                <li>
                    <a href="${menu.hash}" class="block px-4 py-2 hover:bg-indigo-800 transition-colors">
                        ${menu.title}
                    </a>
                </li>`;
        }
    });
    html += '</ul>';
    nav.innerHTML = html;
};
