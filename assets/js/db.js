const initDB = () => {
    if (!localStorage.getItem('zolog_users')) {
        localStorage.setItem('zolog_users', JSON.stringify([{ id: 1, name: 'Admin Pusat', role: 'admin', status: 'Aktif' }]));
    }
    if (!localStorage.getItem('zolog_resi')) {
        localStorage.setItem('zolog_resi', JSON.stringify([]));
    }
};

initDB();

export const db = {
    getUsers: () => JSON.parse(localStorage.getItem('zolog_users')),
    saveUser: (user) => {
        const users = db.getUsers();
        user.id = Date.now();
        users.push(user);
        localStorage.setItem('zolog_users', JSON.stringify(users));
    },
    deleteUser: (id) => {
        const users = db.getUsers().filter(u => u.id !== id);
        localStorage.setItem('zolog_users', JSON.stringify(users));
    },
    
    getResi: () => JSON.parse(localStorage.getItem('zolog_resi')),
    saveResi: (resi) => {
        const data = db.getResi();
        resi.id = 'AWB' + Date.now().toString().slice(-6);
        resi.tanggal = new Date().toISOString().split('T')[0];
        data.push(resi);
        localStorage.setItem('zolog_resi', JSON.stringify(data));
    }
};
