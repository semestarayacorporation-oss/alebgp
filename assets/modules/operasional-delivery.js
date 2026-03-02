export const render = async () => `
    <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Dispatch & POD</h2>
        <p class="text-sm text-gray-500">Manajemen pengiriman via Kurir dan update Proof of Delivery.</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="p-4 border-b border-gray-100 bg-gray-50/50">
                <h3 class="font-semibold text-gray-700">1. Dispatch Management (Kirim)</h3>
            </div>
            <div class="p-5">
                <form id="formDispatch" class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-medium text-gray-600 mb-1">Date *</label>
                            <input type="date" required class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-gray-600 mb-1">Scan Resi *</label>
                            <input type="text" required placeholder="AWB123..." class="w-full px-3 py-2 border border-indigo-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-indigo-50">
                        </div>
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-gray-600 mb-1">Location *</label>
                        <select class="w-full px-3 py-2 border rounded-lg text-sm"><option>Counter Jakarta</option></select>
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-gray-600 mb-1">Courier *</label>
                        <select class="w-full px-3 py-2 border rounded-lg text-sm"><option>Riza - Kurir Motor</option><option>Ahmad - Supir Truk</option></select>
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-gray-600 mb-1">Vehicle *</label>
                        <select class="w-full px-3 py-2 border rounded-lg text-sm"><option>B 1234 CD - CDE</option></select>
                    </div>
                    <div class="pt-3">
                        <button type="button" onclick="alert('Data Dispatch Disimpan! Resi siap diantar.')" class="w-full bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">Process Delivery</button>
                    </div>
                </form>
            </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="p-4 border-b border-gray-100 bg-gray-50/50">
                <h3 class="font-semibold text-gray-700">2. Entri Delivery Status (POD)</h3>
            </div>
            <div class="p-5">
                <form id="formPOD" class="space-y-4">
                    <div>
                        <label class="block text-xs font-medium text-gray-600 mb-1">Resi Number</label>
                        <input type="text" value="ABCJKT240599939" readonly class="w-full px-3 py-2 border rounded-lg text-sm bg-gray-100 outline-none font-mono">
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-medium text-gray-600 mb-1">Group Status *</label>
                            <select class="w-full px-3 py-2 border border-green-300 text-green-700 font-bold rounded-lg text-sm bg-green-50 outline-none"><option>DELIVERED</option><option>UNDELIVERED</option></select>
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-gray-600 mb-1">Status *</label>
                            <select class="w-full px-3 py-2 border rounded-lg text-sm"><option>Received By</option></select>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-medium text-gray-600 mb-1">Receipts Name *</label>
                            <input type="text" required placeholder="Nama Penerima" class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-gray-600 mb-1">Relationship</label>
                            <select class="w-full px-3 py-2 border rounded-lg text-sm"><option>RECIPIENT</option><option>SECURITY</option><option>FAMILY</option></select>
                        </div>
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-gray-600 mb-1">Upload Image (Bukti Foto) *</label>
                        <input type="file" class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer">
                    </div>
                    <div class="pt-3">
                        <button type="button" onclick="alert('Status POD Berhasil di Update!')" class="w-full bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition">Update Status</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
`;

export const init = () => {
    // Logic form interaktif ringan bisa ditaruh di sini
};
