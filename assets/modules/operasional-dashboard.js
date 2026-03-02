import { getDB } from '../js/db.js';

export const render = (container) => {
    const resi = getDB('zolog_resi');
    const total = resi.length;
    const onProcess = resi.filter(r => r.status === 'On Process' || r.status === 'Staging').length;
    const delivered = resi.filter(r => r.status === 'Delivered').length;

    const recentResiHtml = resi.slice(-5).reverse().map(r => `
        <div class="flex justify-between items-center py-3 border-b border-slate-100 last:border-0">
            <div>
                <p class="text-sm font-medium text-slate-800">${r.id} - ${r.customer}</p>
                <p class="text-xs text-slate-500">${r.origin} &rarr; ${r.destination}</p>
            </div>
            <span class="px-2.5 py-1 rounded-full text-xs font-medium ${r.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}">
                ${r.status}
            </span>
        </div>
    `).join('');

    container.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
                <div class="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                </div>
                <div>
                    <p class="text-sm font-medium text-slate-500">Total Booking Order</p>
                    <p class="text-2xl font-bold text-slate-800">${total}</p>
                </div>
            </div>
            <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
                <div class="p-3 bg-amber-50 text-amber-600 rounded-lg">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                </div>
                <div>
                    <p class="text-sm font-medium text-slate-500">On Process</p>
                    <p class="text-2xl font-bold text-slate-800">${onProcess}</p>
                </div>
            </div>
            <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
                <div class="p-3 bg-green-50 text-green-600 rounded-lg">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <div>
                    <p class="text-sm font-medium text-slate-500">POD Delivered</p>
                    <p class="text-2xl font-bold text-slate-800">${delivered}</p>
                </div>
            </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 class="text-lg font-semibold text-slate-800 mb-4">Transaksi Terakhir</h3>
            <div class="flex flex-col">
                ${recentResiHtml || '<p class="text-sm text-slate-500">Belum ada transaksi.</p>'}
            </div>
        </div>
    `;
};
