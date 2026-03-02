import { db } from '../js/db.js';

export const render = async () => `
    <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Entri Resi Cash</h2>
        <p class="text-sm text-gray-500">Pembuatan Airway Bill (AWB) baru.</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <form id="formResi" class="space-y-5">
                <div class="grid grid-cols-2 gap-5">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Pengirim</label>
                        <input type="text" id="r_pengirim" required class="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Penerima</label>
                        <input type="text" id="r_penerima" required class="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none">
                    </div>
                </div>
                <div class="grid grid-cols-3 gap-5">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Tujuan</label>
                        <input type="text" id="r_tujuan" required class="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Berat (Kg)</label>
                        <input type="number" id="r_berat" min="1" required class="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Total Biaya (Rp)</label>
                        <input type="text" id="r_biaya" readonly class="w-full px-4 py-2 border border-indigo-200 bg-indigo-50 rounded-lg font-bold text-indigo-700 outline-none">
                    </div>
                </div>
                <div class="pt-4 flex justify-end">
                    <button type="submit" class="bg-indigo-600 text-white px-8 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition shadow-md">Cetak Resi</button>
                </div>
            </form>
        </div>
        
        <div class="bg-indigo-900 rounded-xl shadow-sm p-6 text-white flex flex-col justify-center">
            <h3 class="text-indigo-200 text-sm font-semibold uppercase tracking-wider mb-2">Tarif Dasar</h3>
            <div class="text-4xl font-bold mb-4">Rp 15.000 <span class="text-lg font-normal text-indigo-300">/ kg</span></div>
            <p class="text-sm text-indigo-200">Kalkulasi harga akan otomatis terisi saat berat barang dimasukkan pada form.</p>
        </div>
    </div>
`;

export const init = () => {
    const beratInput = document.getElementById('r_berat');
    const biayaInput = document.getElementById('r_biaya');
    const tarifDasar = 15000;

    beratInput.addEventListener('input', (e) => {
        const berat = parseFloat(e.target.value) || 0;
        biayaInput.value = (berat * tarifDasar).toLocaleString('id-ID');
    });

    document.getElementById('formResi').addEventListener('submit', (e) => {
        e.preventDefault();
        db.saveResi({
            pengirim: document.getElementById('r_pengirim').value,
            penerima: document.getElementById('r_penerima').value,
            tujuan: document.getElementById('r_tujuan').value,
            berat: beratInput.value,
            biaya: beratInput.value * tarifDasar
        });
        alert('Resi berhasil disimpan & dicetak!');
        e.target.reset();
        biayaInput.value = '';
    });
};
