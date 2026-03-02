import { getDB, saveDB } from '../js/db.js';

export const render = (container) => {
    container.innerHTML = `
        <div class="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200">
            <div class="p-6 border-b border-slate-200">
                <h2 class="text-lg font-semibold text-slate-800">Form Entri Resi Cash</h2>
                <p class="text-sm text-slate-500 mt-1">Masukkan data pengiriman baru.</p>
            </div>
            <form id="resiForm" class="p-6 space-y-6">
                <div class="grid grid-cols-2 gap-6">
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Nama Customer / Pengirim</label>
                        <input type="text" id="r_customer" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Cth: PT. Hujan Rezeki" required>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Tanggal</label>
                        <input type="date" id="r_date" class="w-full px-4 py-2 border rounded-lg bg-slate-50" required>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-6">
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Kota Asal</label>
                        <input type="text" id="r_origin" value="Jakarta" class="w-full px-4 py-2 border rounded-lg" required>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Kota Tujuan</label>
                        <input type="text" id="r_dest" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" required>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-6">
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Berat (Kg)</label>
                        <input type="number" id="r_weight" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" required>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Total Biaya (Rp)</label>
                        <input type="number" id="r_price" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" required>
                    </div>
                </div>
                
                <div id="alertSuccess" class="hidden bg-green-50 text-green-700 p-4 rounded-lg text-sm border border-green-200">
                    Resi berhasil disimpan!
                </div>

                <div class="flex justify-end pt-4 border-t border-slate-100">
                    <button type="submit" class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-colors">
                        Simpan & Cetak Resi
                    </button>
                </div>
            </form>
        </div>
    `;

    document.getElementById('r_date').valueAsDate = new Date();

    document.getElementById('resiForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const resi = getDB('zolog_resi');
        const newResi = {
            id: `RS-${Math.floor(Math.random() * 10000)}`,
            date: document.getElementById('r_date').value,
            customer: document.getElementById('r_customer').value,
            origin: document.getElementById('r_origin').value,
            destination: document.getElementById('r_dest').value,
            weight: document.getElementById('r_weight').value,
            price: document.getElementById('r_price').value,
            status: 'Staging'
        };
        
        resi.push(newResi);
        saveDB('zolog_resi', resi);
        
        const alert = document.getElementById('alertSuccess');
        alert.classList.remove('hidden');
        e.target.reset();
        document.getElementById('r_date').valueAsDate = new Date();
        
        setTimeout(() => alert.classList.add('hidden'), 3000);
    });
};
