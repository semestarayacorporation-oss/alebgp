export const render = async () => `
    <div class="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <h2 class="text-2xl font-bold text-gray-800 w-full md:w-auto">Tracing</h2>
        <div class="relative w-full md:w-96">
            <input type="text" id="searchResi" placeholder="Type and search Connote / Resi..." class="w-full pl-10 pr-20 py-2.5 border rounded-full text-sm focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm">
            <svg class="w-5 h-5 text-gray-400 absolute left-4 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <button id="btnSearchTrace" class="absolute right-1 top-1 bottom-1 px-4 bg-indigo-50 text-indigo-700 font-medium text-xs rounded-full hover:bg-indigo-100">Search</button>
        </div>
    </div>

    <div id="tracingResult" class="hidden grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div class="bg-indigo-600 text-white text-center py-2 rounded-lg font-mono font-bold tracking-wider mb-4">ABCJKT240599939</div>
            <div class="flex gap-2 mb-4">
                <button class="flex-1 border border-indigo-200 text-indigo-600 py-1.5 rounded-lg text-xs font-medium hover:bg-indigo-50">View</button>
                <button class="flex-1 border border-orange-200 text-orange-600 py-1.5 rounded-lg text-xs font-medium hover:bg-orange-50">Print</button>
            </div>
            <div class="bg-green-100 text-green-700 text-center text-xs font-semibold py-1 rounded mb-4 uppercase">Verified</div>
            
            <div class="space-y-4 text-sm">
                <div class="flex justify-between border-b pb-2">
                    <span class="text-gray-500">Origin</span>
                    <span class="font-bold text-gray-800">JKT - JAKARTA</span>
                </div>
                <div class="flex justify-between border-b pb-2">
                    <span class="text-gray-500">Destination</span>
                    <span class="font-medium text-right text-gray-800">Ciracas, Jakarta Timur</span>
                </div>
                <div class="flex justify-between border-b pb-2">
                    <span class="text-gray-500">Item</span>
                    <span class="font-medium text-gray-800">MESIN FOTOCOPY</span>
                </div>
                <div class="flex justify-between pt-2">
                    <span class="text-gray-500 text-xs">Total Fee</span>
                    <span class="font-bold text-lg text-indigo-700">Rp. 1,571,500</span>
                </div>
            </div>
        </div>

        <div class="lg:col-span-2 space-y-6">
            <div class="border-b border-gray-200">
                <nav class="-mb-px flex space-x-8">
                    <a href="#" class="border-indigo-500 text-indigo-600 whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm">Overview</a>
                    <a href="#" class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm">History Operational</a>
                </nav>
            </div>

            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <h3 class="font-semibold text-gray-700 mb-4">Detail Cost</h3>
                <div class="grid grid-cols-4 gap-4 text-sm text-center">
                    <div><p class="text-gray-500 mb-1">Shipping</p><p class="font-bold">Rp 1.368.500</p></div>
                    <div><p class="text-gray-500 mb-1">Additional</p><p class="font-medium">Rp 203.000</p></div>
                    <div><p class="text-gray-500 mb-1">Discount</p><p class="font-medium text-red-500">Rp 0</p></div>
                    <div><p class="text-gray-500 mb-1">Total</p><p class="font-bold text-indigo-600">Rp 1.571.500</p></div>
                </div>
            </div>

            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <h3 class="font-semibold text-gray-700 mb-4">Last History Operational</h3>
                <div class="flex items-center justify-between p-4 bg-indigo-50/50 rounded-lg border border-indigo-100">
                    <div>
                        <p class="text-indigo-700 font-bold text-lg">Transfer Location</p>
                        <p class="text-xs text-gray-500 mt-1">2024-06-05 13:58:14</p>
                    </div>
                    <div class="text-right text-xs text-gray-600">
                        <p>Origin: PLM - Palembang</p>
                        <p>Destination: JKT - Jakarta</p>
                        <p>Created By: Riza - JKT</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
`;

export const init = () => {
    document.getElementById('btnSearchTrace').addEventListener('click', () => {
        const input = document.getElementById('searchResi').value;
        if(input) {
            // Tampilkan hasil mockup
            document.getElementById('tracingResult').classList.remove('hidden');
        } else {
            alert('Masukkan nomor resi terlebih dahulu.');
        }
    });
};
