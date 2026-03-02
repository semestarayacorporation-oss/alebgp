import { getDb, saveDb, generateId } from '../../js/db.js';

export const render = () => {
    const db = getDb();
    const servicesOpt = db.services.map(s => `<option value="${s.price}">${s.name} (Rp ${s.price}/kg)</option>`).join('');
    
    return `
        <div class="bg-white p-6 rounded-xl shadow-md grid grid-cols-2 gap-6">
            <div>
                <h3 class="text-lg font-bold border-b pb-2 mb-4 text-indigo-700">1. Informasi Pengiriman Cash</h3>
                <div class="mb-3">
                    <label class="block text-sm font-semibold mb-1">Penerima</label>
                    <input type="text" id="penerima" class="w-full border rounded p-2" placeholder="Nama Penerima">
                </div>
                <div class="mb-3">
                    <label class="block text-sm font-semibold mb-1">Layanan</label>
                    <select id="layanan" class="w-full border rounded p-2">${servicesOpt}</select>
                </div>
                <div class="mb-3 flex space-x-4">
                    <div class="w-1/2">
                        <label class="block text-sm font-semibold mb-1">Berat Aktual (Kg)</label>
                        <input type="number" id="berat" class="w-full border rounded p-2" value="1" min="1">
                    </div>
                    <div class="w-1/2">
                        <label class="block text-sm font-semibold mb-1">Koli / Qty</label>
                        <input type="number" id="koli" class="w-full border rounded p-2" value="1" min="1">
                    </div>
                </div>
                <button id="calculateBtn" class="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 w-full mb-4">Get Price / Hitung Biaya</button>
            </div>
            <div class="bg-gray-50 p-6 rounded-xl border">
                <h3 class="text-lg font-bold mb-4">Checkout Rincian</h3>
                <div class="flex justify-between mb-2"><span>Subtotal:</span> <span id="subtotal">Rp 0</span></div>
                <div class="flex justify-between mb-2 text-xl font-bold text-indigo-700 border-t pt-2 mt-2">
                    <span>Grand Total:</span> <span id="gtotal">Rp 0</span>
                </div>
                <button id="submitResi" class="w-full bg-indigo-600 text-white font-bold py-3 mt-6 rounded-lg hover:bg-indigo-700">Submit Resi (Booking)</button>
            </div>
        </div>
    `;
};

export const afterRender = () => {
    let currentTotal = 0;
    document.getElementById('calculateBtn').addEventListener('click', () => {
        const berat = parseFloat(document.getElementById('berat').value);
        const pricePerKg = parseFloat(document.getElementById('layanan').value);
        currentTotal = berat * pricePerKg;
        
        document.getElementById('subtotal').innerText = `Rp ${currentTotal.toLocaleString('id-ID')}`;
        document.getElementById('gtotal').innerText = `Rp ${currentTotal.toLocaleString('id-ID')}`;
    });

    document.getElementById('submitResi').addEventListener('click', () => {
        if(currentTotal === 0) return alert("Hitung harga terlebih dahulu!");
        
        const db = getDb();
        const resiNo = 'ZLGCN' + Math.floor(Math.random() * 10000000);
        db.resi.push({
            id: generateId(),
            no_resi: resiNo,
            penerima: document.getElementById('penerima').value,
            berat: document.getElementById('berat').value,
            koli: document.getElementById('koli').value,
            total: currentTotal,
            status: 'Booking',
            type: 'Cash',
            date: new Date().toISOString()
        });
        saveDb(db);
        alert(`Resi ${resiNo} berhasil di-generate!`);
        window.location.hash = '#/'; // Back to dashboard
    });
};
