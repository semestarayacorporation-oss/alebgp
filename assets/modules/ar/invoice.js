import { getDb, saveDb, generateId } from '../../js/db.js';

export const render = () => {
    return `
        <div class="bg-white p-6 rounded-xl shadow-md">
            <h3 class="text-lg font-bold mb-4 text-indigo-700">Generate Proforma Invoice</h3>
            <div class="mb-4 flex space-x-4">
                <button id="loadUninvoiced" class="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded">Tarik Resi B2B (Belum Invoice)</button>
                <button id="generateInv" class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Proses Invoice</button>
            </div>
            
            <table class="min-w-full bg-white border mt-4">
                <thead class="bg-gray-100">
                    <tr>
                        <th class="py-2 px-4 border text-left">Pilih</th>
                        <th class="py-2 px-4 border text-left">No Resi</th>
                        <th class="py-2 px-4 border text-right">Total (Rp)</th>
                    </tr>
                </thead>
                <tbody id="invTable"></tbody>
            </table>
        </div>
    `;
};

export const afterRender = () => {
    let pendingResi = [];
    const db = getDb();
    
    document.getElementById('loadUninvoiced').addEventListener('click', () => {
        // Asumsi data resi yang belum di-invoice dan statusnya tidak null
        pendingResi = db.resi.filter(r => r.type === 'Credit' || r.type === 'Cash'); // Mocked
        const tbody = document.getElementById('invTable');
        
        tbody.innerHTML = pendingResi.map(r => `
            <tr>
                <td class="py-2 px-4 border text-center"><input type="checkbox" class="resi-check" value="${r.id}" checked></td>
                <td class="py-2 px-4 border">${r.no_resi}</td>
                <td class="py-2 px-4 border text-right">${r.total.toLocaleString('id-ID')}</td>
            </tr>
        `).join('');
    });

    document.getElementById('generateInv').addEventListener('click', () => {
        const checks = document.querySelectorAll('.resi-check:checked');
        if(checks.length === 0) return alert('Pilih minimal 1 resi!');
        
        const totalAmount = Array.from(checks).reduce((sum, cb) => {
            const r = pendingResi.find(x => x.id === cb.value);
            return sum + (r ? parseFloat(r.total) : 0);
        }, 0);
        
        const invNo = 'INV/0824/' + Math.floor(Math.random()*10000);
        db.invoices.push({
            id: generateId(),
            invoice_no: invNo,
            amount: totalAmount,
            status: 'Proforma',
            date: new Date().toISOString()
        });
        
        saveDb(db);
        alert(`Invoice ${invNo} berhasil dibuat dengan total Rp ${totalAmount.toLocaleString('id-ID')}`);
        document.getElementById('invTable').innerHTML = '';
    });
};
