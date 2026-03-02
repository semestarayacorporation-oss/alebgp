// Mock Database ES6 Module
export const generateId = () => '_' + Math.random().toString(36).substr(2, 9);

export const dbInit = () => {
    const initialState = {
        users: [
            { id: 'u1', username: 'admin', password: '123', role: 'Super Admin', name: 'Super Admin' },
            { id: 'u2', username: 'sales1', password: '123', role: 'CS Counter', name: 'User Sales' }
        ],
        roles: ['Super Admin', 'Admin Cabang', 'CS Counter', 'Operasional', 'Finance / AR'],
        customers: [{ id: 'c1', name: 'PT Angkasa Sejahtera', code: 'CUST-001' }],
        services: [{ id: 's1', name: 'Paket Darat', price: 15000 }],
        resi: [],
        outgoing: [],
        invoices: []
    };

    if (!localStorage.getItem('albatros_db')) {
        localStorage.setItem('albatros_db', JSON.stringify(initialState));
    }
};

export const getDb = () => JSON.parse(localStorage.getItem('albatros_db'));
export const saveDb = (data) => localStorage.setItem('albatros_db', JSON.stringify(data));
