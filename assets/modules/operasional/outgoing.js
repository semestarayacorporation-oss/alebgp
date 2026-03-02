import { getDb, saveDb } from '../../js/db.js';

export const render = () => {
    return `
        <div class="bg-white p-6 rounded-xl shadow-md">
            <h3 class="text-lg font-bold mb-4">Manajemen Outgoing (Transit/Direct)</h3>
            <div class="flex mb-4 gap-4">
                <input type="text" id="scanResi" class="border p-2 rounded w-1/2" placeholder="Scan/Ketik Nomor Resi...">
                <button id="addOutgoing" class="bg-indigo-600 text-white px-4 py-2 rounded">Tambahkan ke Outgoing</button>
            </div>
            
            <table class="min-w-full bg-white border mt-4">
                <thead class="bg-gray-100">
                    <tr>
                        <th class="py-2 px-4 border text-left">No Resi</th>
                        <th class="py-2 px-4 border text-left">Penerima</th>
                        <th class="py-2 px-4 border text-left">Status</th>
                    </tr>
                </thead>
                <tbody id="outTable"></tbody>
            </table>
        </div>
    `;
};

export const afterRender = () => {
    const db = getDb();
    const tbody = document.getElementById('outTable');
    
    const renderTable = () => {
        const outList = db.resi.filter(r => r.status === 'Outgoing');
        tbody.innerHTML = outList.map(r => `
            <tr>
                <td class="py-2 px-4 border">${r.no_resi}</td>
                <td class="py-2 px-4 border">${r.penerima}</td>
                <td class="py-2 px-4 border text-green-600 font-bold">${r.status}</td>
            </tr>
        `).join('');
    };

    renderTable();

    document.getElementById('addOutgoing').addEventListener('click', () => {
        const resiInput = document.getElementById('scanResi').value;
        const resiIndex = db.resi.findIndex(r => r.no_resi === resiInput);
        
        if(resiIndex > -1) {
            db.resi[resiIndex].status = 'Outgoing';
            saveDb(db);
            renderTable();
            document.getElementById('scanResi').value = '';
        } else {
            alert("Nomor Resi tidak ditemukan di sistem!");
        }
    });
};
