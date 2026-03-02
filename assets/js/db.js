export const initDB = () => {
    // Tabel User
    if (!localStorage.getItem('zolog_users')) {
        localStorage.setItem('zolog_users', JSON.stringify([
            { id: Date.now().toString(), name: 'Taufik Kulrahman', username: 'admin', role: 'Super Admin' }
        ]));
    }
    // Tabel Resi
    if (!localStorage.getItem('zolog_resi')) {
        localStorage.setItem('zolog_resi', JSON.stringify([
            { id: 'RS-1001', date: new Date().toISOString().split('T')[0], customer: 'PT. Hujan Rezeki', origin: 'Jakarta', destination: 'Bogor', weight: 150, price: 750000, status: 'On Process' }
        ]));
    }
    // Tabel Master Pelanggan (Sesuai Guideline)
    if (!localStorage.getItem('zolog_customers')) {
        localStorage.setItem('zolog_customers', JSON.stringify([
            { id: 'CSJKT00001', company: 'PT. Hujan Rezeki', pic: 'Bpk. Budi', address: 'Jl. Sudirman No. 1, Jakarta Pusat' },
            { id: 'CSJKT00002', company: 'PT. Tira Satria Niaga', pic: 'Ibu Maria', address: 'Sedayu Bizpark Daan Mogot, Jakarta' }
        ]));
    }
    // Tabel AR / AP (Invoice Keuangan)
    if (!localStorage.getItem('zolog_invoices')) {
        localStorage.setItem('zolog_invoices', JSON.stringify([
            { id: 'INV-2609-001', date: new Date().toISOString().split('T')[0], customer: 'PT. Hujan Rezeki', amount: 2500000, status: 'Outstanding' },
            { id: 'INV-2609-002', date: new Date().toISOString().split('T')[0], customer: 'PT. Tira Satria Niaga', amount: 1850000, status: 'Payment Received' }
        ]));
    }
};

export const getDB = (table) => JSON.parse(localStorage.getItem(table) || '[]');
export const saveDB = (table, data) => localStorage.setItem(table, JSON.stringify(data));
