export const render = async () => `
    <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Tariff Simulation</h2>
        <p class="text-sm text-gray-500">Cek daftar harga publish dan simulasi pengiriman.</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <form id="formSimulasi" class="space-y-4">
                <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1">Type *</label>
                    <select class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"><option>Retail & Cargo</option></select>
                </div>
                <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1">Origin *</label>
                    <input type="text" value="JAKARTA" class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                </div>
                <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1">Destination *</label>
                    <input type="text" value="Benowo, Surabaya, Jawa Timur" class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                </div>
                <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1">Service *</label>
                    <select class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"><option>PRIORITY DARAT</option></select>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-medium text-gray-600 mb-1">Weight Type</label>
                        <select class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"><option>KG</option></select>
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-gray-600 mb-1">Weight *</label>
                        <input type="number" id="t_weight" value="100" class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                    </div>
                </div>
                <div class="pt-2">
                    <button type="submit" class="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition shadow-sm">Search</button>
                </div>
            </form>
        </div>

        <div class="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hidden" id="resultContainer">
            <div class="p-4 border-b border-gray-100 bg-gray-50/50">
                <h3 class="font-semibold text-gray-700">Hasil Simulasi</h3>
            </div>
            <div class="p-6">
                <table class="w-full text-left text-sm text-gray-600 border-collapse">
                    <thead class="bg-indigo-50 text-indigo-800">
                        <tr>
                            <th class="px-4 py-3 font-semibold rounded-tl-lg">Min. Weight</th>
                            <th class="px-4 py-3 font-semibold">Lead Time</th>
                            <th class="px-4 py-3 font-semibold rounded-tr-lg text-right">Price (Rp)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="border-b border-gray-100">
                            <td class="px-4 py-4">1</td>
                            <td class="px-4 py-4">3 Hari</td>
                            <td class="px-4 py-4 text-right font-bold text-gray-800 text-lg" id="resPrice">0</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
`;

export const init = () => {
    document.getElementById('formSimulasi').addEventListener('submit', (e) => {
        e.preventDefault();
        const weight = document.getElementById('t_weight').value || 1;
        const basePricePerKg = 6000; // Contoh simulasi agar 100kg = 600.000
        const total = weight * basePricePerKg;
        
        document.getElementById('resPrice').innerText = total.toLocaleString('id-ID');
        document.getElementById('resultContainer').classList.remove('hidden');
    });
};
