// operasional.js
import DB from './db.js';

const OperasionalModule = {
    currentTab: 'dashboard',

    render: async () => {
        return `
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div class="mb-6">
                    <h2 class="text-2xl font-bold text-gray-800">Operasional Mid-Mile</h2>
                    <p class="text-sm text-gray-500">Dashboard, Outgoing Manifest & Penerimaan Hub</p>
                </div>

                <div class="flex border-b border-gray-200 mb-6 overflow-x-auto">
                    <button onclick="window.OpsUI.switchTab('dashboard')" id="tab-dashboard" class="px-6 py-3 font-medium text-sm border-b-2 border-blue-600 text-blue-600 whitespace-nowrap">Dashboard (Chart)</button>
                    <button onclick="window.OpsUI.switchTab('outgoing')" id="tab-outgoing" class="px-6 py-3 font-medium text-sm border-b-2 border-transparent text-gray-500 hover:text-gray-700 whitespace-nowrap">Outgoing Manifest</button>
                    <button onclick="window.OpsUI.switchTab('incoming')" id="tab-incoming" class="px-6 py-3 font-medium text-sm border-b-2 border-transparent text-gray-500 hover:text-gray-700 whitespace-nowrap">Transit & Incoming</button>
                </div>

                <div id="ops-content">
                    </div>
            </div>
        `;
    },

    switchTab: (tabName) => {
        OperasionalModule.currentTab = tabName;
        
        // Update Tab Styles
        ['dashboard', 'outgoing', 'incoming'].forEach(tab => {
            const el = document.getElementById(`tab-${tab}`);
            if (el) {
                if (tab === tabName) {
                    el.className = "px-6 py-3 font-medium text-sm border-b-2 border-blue-600 text-blue-600 whitespace-nowrap";
                } else {
                    el.className = "px-6 py-3 font-medium text-sm border-b-2 border-transparent text-gray-500 hover:text-gray-700 whitespace-nowrap";
                }
            }
        });

        OperasionalModule.renderTabContent();
    },

    renderTabContent: () => {
        const container = document.getElementById('ops-content');
        if (!container) return;

        if (OperasionalModule.currentTab === 'dashboard') {
            container.innerHTML = OperasionalModule.uiDashboard();
            OperasionalModule.initChart();
        }
        if (OperasionalModule.currentTab === 'outgoing') {
            container.innerHTML = OperasionalModule.uiOutgoing();
            OperasionalModule.refreshOutgoingList();
            OperasionalModule.populateArmada();
        }
        if (OperasionalModule.currentTab === 'incoming') {
            container.innerHTML = OperasionalModule.uiIncoming();
            OperasionalModule.refreshIncomingList();
        }
    },

    // ==========================================
    // 1. DASHBOARD & CHART.JS
    // ==========================================
    uiDashboard: () => {
        const resi = DB.getAll('resi');
        const manifested = resi.filter(r => r.status === 'Manifested (Origin)').length;
        const inTransit = resi.filter(r => r.status === 'In Transit').length;
        const arrived = resi.filter(r => r.status === 'Arrived at Hub').length;

        return `
            <div class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-center justify-between">
                        <div>
                            <p class="text-xs text-blue-500 font-bold uppercase">Staging / Origin</p>
                            <h3 class="text-2xl font-bold text-blue-800">${manifested} <span class="text-sm font-normal">Resi</span></h3>
                        </div>
                        <i class="fas fa-boxes text-3xl text-blue-200"></i>
                    </div>
                    <div class="bg-yellow-50 p-4 rounded-lg border border-yellow-100 flex items-center justify-between">
                        <div>
                            <p class="text-xs text-yellow-500 font-bold uppercase">In Transit</p>
                            <h3 class="text-2xl font-bold text-yellow-800">${inTransit} <span class="text-sm font-normal">Resi</span></h3>
                        </div>
                        <i class="fas fa-truck-moving text-3xl text-yellow-200"></i>
                    </div>
                    <div class="bg-green-50 p-4 rounded-lg border border-green-100 flex items-center justify-between">
                        <div>
                            <p class="text-xs text-green-500 font-bold uppercase">Arrived at Hub</p>
                            <h3 class="text-2xl font-bold text-green-800">${arrived} <span class="text-sm font-normal">Resi</span></h3>
                        </div>
                        <i class="fas fa-warehouse text-3xl text-green-200"></i>
                    </div>
                </div>

                <div class="bg-white p-4 rounded-lg border">
                    <h3 class="font-bold text-gray-700 mb-4 border-b pb-2">Distribusi Status Pengiriman</h3>
                    <div class="relative h-64 w-full">
                        <canvas id="opsChart"></canvas>
                    </div>
                </div>
            </div>
        `;
    },

    initChart: () => {
        // Load Chart.js dinamis jika belum ada
        if (typeof Chart === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
            script.onload = () => OperasionalModule.renderChartConfig();
            document.head.appendChild(script);
        } else {
            OperasionalModule.renderChartConfig();
        }
    },

    renderChartConfig: () => {
        const canvas = document.getElementById('opsChart');
        if (!canvas) return;

        const resi = DB.getAll('resi');
        const labels = ['Manifested (Origin)', 'In Transit', 'Arrived at Hub', 'On Delivery', 'Delivered'];
        const dataCounts = labels.map(status => resi.filter(r => r.status === status).length);

        new Chart(canvas, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Jumlah Resi berdasarkan Status',
                    data: dataCounts,
                    backgroundColor: ['#3b82f6', '#eab308', '#22c55e', '#a855f7', '#14b8a6'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true, ticks: { precision: 0 } }
                }
            }
        });
    },

    // ==========================================
    // 2. OUTGOING MANIFEST (Pembuatan Surat Jalan)
    // ==========================================
    uiOutgoing: () => {
        
        return `
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div class="lg:col-span-2">
                    <h3 class="font-bold text-gray-700 mb-3">Resi Siap Diberangkatkan (Staging)</h3>
                    <div class="overflow-x-auto bg-gray-50 rounded border">
                        <table class="w-full text-sm text-left text-gray-600">
                            <thead class="bg-gray-200 text-gray-700">
                                <tr>
                                    <th class="p-3 w-10 text-center"><input type="checkbox" id="check-all" onchange="window.OpsUI.toggleAllResi(this)"></th>
                                    <th class="p-3">AWB</th>
                                    <th class="p-3">Rute</th>
                                    <th class="p-3">Berat</th>
                                </tr>
                            </thead>
                            <tbody id="outgoing-list" class="bg-white">
                                </tbody>
                        </table>
                    </div>
                </div>
                <div class="lg:col-span-1 bg-gray-50 p-4 rounded border h-fit">
                    <h3 class="font-bold text-gray-700 mb-4 border-b pb-2">Form Manifest</h3>
                    <form onsubmit="window.OpsUI.createManifest(event)">
                        <div class="space-y-4">
                            <div>
                                <label class="block text-xs font-medium text-gray-500">Pilih Armada</label>
                                <select id="manifest-armada" name="armada_id" required class="w-full border rounded p-2 mt-1"></select>
                            </div>
                            <div>
                                <label class="block text-xs font-medium text-gray-500">Nama Driver</label>
                                <input type="text" name="driver_name" required class="w-full border rounded p-2 mt-1" placeholder="Cth: Budi Santoso">
                            </div>
                            <button type="submit" class="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700">
                                <i class="fas fa-truck-loading mr-2"></i> Proses Outgoing
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    },

    refreshOutgoingList: () => {
        const resi = DB.getAll('resi').filter(r => r.status === 'Manifested (Origin)');
        const tbody = document.getElementById('outgoing-list');
        if (!tbody) return;

        if (resi.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" class="p-4 text-center text-gray-400">Tidak ada resi di Staging Area.</td></tr>`;
            return;
        }

        let html = '';
        resi.forEach(r => {
            const origin = DB.getById('coverages', r.origin_id)?.name || '-';
            const dest = DB.getById('coverages', r.destination_id)?.name || '-';
            html += `
                <tr class="border-b hover:bg-gray-50">
                    <td class="p-3 text-center"><input type="checkbox" class="resi-checkbox" value="${r.id}"></td>
                    <td class="p-3 font-bold text-blue-700">${r.awb}</td>
                    <td class="p-3 text-xs">${origin} &rarr; ${dest}</td>
                    <td class="p-3">${r.chargeable_weight} Kg</td>
                </tr>
            `;
        });
        tbody.innerHTML = html;
    },

    populateArmada: () => {
        const armadas = DB.getAll('armadas');
        let html = '<option value="">-- Pilih Armada --</option>';
        armadas.forEach(a => html += `<option value="${a.id}">${a.plate_number} (${a.type})</option>`);
        if(document.getElementById('manifest-armada')) {
            document.getElementById('manifest-armada').innerHTML = html;
        }
    },

    toggleAllResi: (source) => {
        const checkboxes = document.querySelectorAll('.resi-checkbox');
        checkboxes.forEach(cb => cb.checked = source.checked);
    },

    createManifest: (e) => {
        e.preventDefault();
        const checkboxes = document.querySelectorAll('.resi-checkbox:checked');
        if (checkboxes.length === 0) {
            alert('Pilih minimal 1 resi untuk diberangkatkan!');
            return;
        }

        const formData = new FormData(e.target);
        const manifestData = Object.fromEntries(formData.entries());
        
        // Update status resi yang dipilih menjadi 'In Transit'
        let count = 0;
        checkboxes.forEach(cb => {
            const resiId = cb.value;
            DB.update('resi', resiId, { 
                status: 'In Transit',
                manifest_driver: manifestData.driver_name,
                manifest_armada_id: manifestData.armada_id
            });
            count++;
        });

        alert(`${count} Resi berhasil diberangkatkan (Status: In Transit) dengan Driver ${manifestData.driver_name}.`);
        e.target.reset();
        OperasionalModule.refreshOutgoingList();
    },

    // ==========================================
    // 3. TRANSIT & INCOMING (Penerimaan di Hub)
    // ==========================================
    uiIncoming: () => {
        return `
            <div>
                <h3 class="font-bold text-gray-700 mb-3 border-b pb-2">Kargo Dalam Perjalanan (In Transit)</h3>
                <div class="overflow-x-auto">
                    <table class="w-full text-sm text-left border">
                        <thead class="bg-yellow-50 text-yellow-800 border-b border-yellow-200">
                            <tr>
                                <th class="p-3">No. AWB</th>
                                <th class="p-3">Rute Asal &rarr; Tujuan</th>
                                <th class="p-3">Driver / Armada</th>
                                <th class="p-3 text-right">Aksi Terima</th>
                            </tr>
                        </thead>
                        <tbody id="incoming-list" class="bg-white text-gray-600">
                            </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    refreshIncomingList: () => {
        const resi = DB.getAll('resi').filter(r => r.status === 'In Transit');
        const tbody = document.getElementById('incoming-list');
        if (!tbody) return;

        if (resi.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" class="p-8 text-center text-gray-400">Belum ada kargo yang sedang dalam perjalanan menuju Hub ini.</td></tr>`;
            return;
        }

        let html = '';
        resi.forEach(r => {
            const origin = DB.getById('coverages', r.origin_id)?.name || '-';
            const dest = DB.getById('coverages', r.destination_id)?.name || '-';
            const armada = DB.getById('armadas', r.manifest_armada_id)?.plate_number || 'Unknown';
            
            html += `
                <tr class="border-b hover:bg-gray-50">
                    <td class="p-3 font-bold text-yellow-600">${r.awb}</td>
                    <td class="p-3 text-xs">${origin} &rarr; <strong>${dest}</strong></td>
                    <td class="p-3 text-xs">${r.manifest_driver} (${armada})</td>
                    <td class="p-3 text-right">
                        <button onclick="window.OpsUI.receiveIncoming(${r.id}, '${r.awb}')" class="bg-green-600 text-white px-4 py-1.5 rounded shadow hover:bg-green-700 text-xs font-bold">
                            <i class="fas fa-check-circle mr-1"></i> Terima di Hub
                        </button>
                    </td>
                </tr>
            `;
        });
        tbody.innerHTML = html;
    },

    receiveIncoming: (id, awb) => {
        if(confirm(`Apakah Anda yakin menerima kargo ${awb} di Hub ini?`)) {
            DB.update('resi', id, { status: 'Arrived at Hub' });
            OperasionalModule.refreshIncomingList();
        }
    },

    init: () => {
        OperasionalModule.switchTab('dashboard');
    }
};

window.OpsUI = OperasionalModule;
export default OperasionalModule;
