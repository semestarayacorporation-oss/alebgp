import { db } from '../js/db.js';

export const render = async () => `
    <div class="mb-6 flex justify-between items-center">
        <div>
            <h2 class="text-2xl font-bold text-gray-800">Dashboard Operations</h2>
            <p class="text-sm text-gray-500">Overview performa operasional pengiriman.</p>
        </div>
        <div class="flex space-x-3 items-center bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
            <span class="text-xs text-gray-500">Date:</span>
            <input type="date" class="text-xs border-none outline-none text-gray-700" value="2024-06-11">
            <span class="text-xs text-gray-500">-</span>
            <input type="date" class="text-xs border-none outline-none text-gray-700" value="2024-06-11">
            <select class="text-xs border-none outline-none text-gray-700 bg-gray-50 rounded px-2 py-1"><option>Kantor Jakarta</option></select>
            <button class="bg-indigo-600 text-white text-xs px-3 py-1.5 rounded hover:bg-indigo-700">Search</button>
        </div>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center flex flex-col items-center justify-center">
            <div class="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
            </div>
            <p class="text-xs text-gray-500 mb-1">Total Order</p>
            <h4 class="text-xl font-bold text-gray-800">140</h4>
        </div>
        <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center flex flex-col items-center justify-center">
            <div class="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            </div>
            <p class="text-xs text-gray-500 mb-1">Total Booking Order</p>
            <h4 class="text-xl font-bold text-gray-800">3</h4>
        </div>
        <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center flex flex-col items-center justify-center">
            <div class="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
            </div>
            <p class="text-xs text-gray-500 mb-1">Total Staging</p>
            <h4 class="text-xl font-bold text-gray-800">95</h4>
        </div>
        <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center flex flex-col items-center justify-center">
            <div class="w-10 h-10 rounded-lg bg-yellow-50 text-yellow-600 flex items-center justify-center mb-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <p class="text-xs text-gray-500 mb-1">On Process</p>
            <h4 class="text-xl font-bold text-gray-800">4</h4>
        </div>
        <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center flex flex-col items-center justify-center">
            <div class="w-10 h-10 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center mb-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
            </div>
            <p class="text-xs text-gray-500 mb-1">On Delivery</p>
            <h4 class="text-xl font-bold text-gray-800">28</h4>
        </div>
        <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center flex flex-col items-center justify-center">
            <div class="w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center mb-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <p class="text-xs text-gray-500 mb-1">Delivered</p>
            <h4 class="text-xl font-bold text-gray-800">10</h4>
        </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
            <h3 class="font-semibold text-gray-700 mb-4 border-b pb-2">Operation Overview</h3>
            <div class="flex-1 flex items-center justify-center relative h-48">
                <canvas id="opsOverviewChart"></canvas>
            </div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
            <h3 class="font-semibold text-gray-700 mb-4 border-b pb-2">Top 5 Destination</h3>
            <div class="overflow-x-auto">
                <table class="w-full text-left text-sm text-gray-600">
                    <thead class="bg-gray-50 text-gray-500 border-b">
                        <tr>
                            <th class="px-4 py-2 font-medium">DESTINATION NAME</th>
                            <th class="px-4 py-2 font-medium text-right">WEIGHT</th>
                            <th class="px-4 py-2 font-medium text-right">TRANSACTION</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        <tr><td class="px-4 py-2">Batam</td><td class="px-4 py-2 text-right">2,139 Kg</td><td class="px-4 py-2 text-right">32</td></tr>
                        <tr><td class="px-4 py-2">Pekanbaru</td><td class="px-4 py-2 text-right">3,425 Kg</td><td class="px-4 py-2 text-right">31</td></tr>
                        <tr><td class="px-4 py-2">Jakarta</td><td class="px-4 py-2 text-right">699 Kg</td><td class="px-4 py-2 text-right">19</td></tr>
                        <tr><td class="px-4 py-2">Bandung</td><td class="px-4 py-2 text-right">221 Kg</td><td class="px-4 py-2 text-right">11</td></tr>
                        <tr><td class="px-4 py-2">Palembang</td><td class="px-4 py-2 text-right">41 Kg</td><td class="px-4 py-2 text-right">9</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
`;

export const init = () => {
    // Render Chart.js Pie Chart
    const ctx = document.getElementById('opsOverviewChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['On Process', 'On Delivery', 'Delivered'],
            datasets: [{
                data: [4, 28, 10],
                backgroundColor: ['#3b82f6', '#f59e0b', '#10b981'],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'right', labels: { boxWidth: 12, font: { size: 11 } } }
            },
            cutout: '65%'
        }
    });
};
