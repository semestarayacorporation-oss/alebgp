// db.js
const DB_KEY = 'albatros_express_db';

const defaultData = {
    users: [
        { id: 1, username: 'admin', password: 'password123', role: 'Super Admin', name: 'Administrator Cabang Utama' },
        { id: 2, username: 'cs1', password: 'password123', role: 'CS Counter', name: 'CS Counter 1' },
        { id: 3, username: 'ops1', password: 'password123', role: 'Operasional', name: 'Tim Operasional Jakarta' },
        { id: 4, username: 'fin1', password: 'password123', role: 'Finance / AR', name: 'Finance Staff' }
    ],
    roles: ['Super Admin', 'CS Counter', 'Customer Service', 'Sales Executive', 'Operasional', 'Finance / AR'],
    couriers: [],
    armadas: [],
    coverages: [{ id: 1, name: 'JAKARTA', type: 'Origin' }, { id: 2, name: 'Batam', type: 'Destination' }],
    customers: [],
    services: [
        { id: 1, code: 'PRI', name: 'PRIORITY DARAT', min_weight: 1, price: 600000 },
        { id: 2, code: 'REG', name: 'REGULAR CARGO', min_weight: 10, price: 250000 }
    ],
    resi: [],
    pickups: [],
    invoices: []
};

const DB = {
    init: () => {
        if (!localStorage.getItem(DB_KEY)) {
            localStorage.setItem(DB_KEY, JSON.stringify(defaultData));
            console.log('Database PT. Albatros Express diinisialisasi.');
        }
    },
    getAll: (table) => {
        const data = JSON.parse(localStorage.getItem(DB_KEY));
        return data[table] || [];
    },
    getById: (table, id) => {
        const rows = DB.getAll(table);
        return rows.find(row => row.id === parseInt(id));
    },
    insert: (table, record) => {
        const data = JSON.parse(localStorage.getItem(DB_KEY));
        if (!data[table]) data[table] = [];
        
        const newId = data[table].length > 0 ? Math.max(...data[table].map(r => r.id)) + 1 : 1;
        const newRecord = { id: newId, created_at: new Date().toISOString(), ...record };
        
        data[table].push(newRecord);
        localStorage.setItem(DB_KEY, JSON.stringify(data));
        return newRecord;
    },
    update: (table, id, updatedRecord) => {
        const data = JSON.parse(localStorage.getItem(DB_KEY));
        if (!data[table]) return null;
        
        const index = data[table].findIndex(r => r.id === parseInt(id));
        if (index !== -1) {
            data[table][index] = { ...data[table][index], ...updatedRecord, updated_at: new Date().toISOString() };
            localStorage.setItem(DB_KEY, JSON.stringify(data));
            return data[table][index];
        }
        return null;
    },
    delete: (table, id) => {
        const data = JSON.parse(localStorage.getItem(DB_KEY));
        if (!data[table]) return false;
        
        const initialLength = data[table].length;
        data[table] = data[table].filter(r => r.id !== parseInt(id));
        
        if (data[table].length < initialLength) {
            localStorage.setItem(DB_KEY, JSON.stringify(data));
            return true;
        }
        return false;
    }
};

// Auto-init saat file diload
DB.init();
export default DB;
