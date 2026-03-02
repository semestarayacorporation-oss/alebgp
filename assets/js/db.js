export const initDB = () => {
    if (!localStorage.getItem('zolog_users')) {
        localStorage.setItem('zolog_users', JSON.stringify([
            { id: Date.now().toString(), name: 'Taufik Kulrahman', username: 'admin', email: 'admin@bka.co.id', role: 'Super Admin' }
        ]));
    }
    if (!localStorage.getItem('zolog_resi')) {
        localStorage.setItem('zolog_resi', JSON.stringify([
            { id: 'RS-1001', date: new Date().toISOString().split('T')[0], customer: 'PT. Hujan Rezeki', origin: 'Jakarta', destination: 'Bogor', weight: 150, price: 750000, status: 'On Process' }
        ]));
    }
};

export const getDB = (table) => JSON.parse(localStorage.getItem(table) || '[]');
export const saveDB = (table, data) => localStorage.setItem(table, JSON.stringify(data));
