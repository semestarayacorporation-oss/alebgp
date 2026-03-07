// lastmile.js
import DB from './db.js';

const LastMileModule = {
    currentTab: 'dispatch',
    podId: null, // Menyimpan ID resi yang sedang di-update POD-nya

    render: async () => {
        return `
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div class="mb-6">
                    <h2 class="text-2xl font-bold text-gray-800">Operasional Last-Mile</h2>
                    <p class="text-sm text-gray-500">Dispatch Kurir & Entri POD (Proof of Delivery)</p>
                </div>

                <div class="flex border-b border-gray-200 mb-6 overflow-x-auto">
                    <button onclick="window.LastMileUI.switchTab('dispatch')" id="tab-dispatch" class="px-6 py-3 font-medium text-sm border-b-2 border-blue-600 text-blue-600 whitespace-nowrap">Dispatch Delivery</button>
                    <button onclick="window.LastMileUI.switchTab('pod')" id="tab-pod" class="px-6 py-3 font-medium text-sm border-b-2 border-transparent text-gray-500 hover:text-gray-700 whitespace-nowrap">Entry POD</button>
                </div>

                <div id="lastmile-content">
                    </div>
            </div>

            <div id="pod-modal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center hidden">
                <div class="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 transform transition-all">
                    <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-blue-50 rounded-t-xl">
                        <h3 class="text-lg font-bold text-blue-900" id="pod-modal-title">Entry POD: -</h3>
                        <button onclick="window.LastMileUI.closePODModal()" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times"></i></button>
                    </div>
                    <form id="pod-form" onsubmit="window.LastMileUI.savePOD(event)" class="p-6">
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Status Pengiriman</label>
                                <select name="status" id="pod-status" class="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-blue-500" required onchange="window.LastMileUI.togglePODFields()">
                                    <option value="Delivered">Terkirim (Delivered)</option>
                                    <option value="Undelivered">Gagal Terkirim (Undelivered / Return)</option>
                                </select>
                            </div>
                            <div id="penerima-field">
                                <label class="block text-sm font-medium text-gray-700 mb-1">Nama Penerima Aktual</label>
                                <input type="text" name="pod_receiver" id="pod-receiver" class="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-blue-500" placeholder="Cth: Bpk. Andi (Security)">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Keterangan / Catatan</label>
                                <textarea name="pod_notes" class="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-blue-500" rows="2" placeholder="Cth: Ditaruh di pos satpam..."></textarea>
                            </div>
                        </div>
                        <div class="mt-6 flex justify-end gap-3">
                            <button type="button" onclick="window.LastMileUI.closePODModal()" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Batal</button>
                            <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold"><i class="fas fa-save mr-1"></i> Simpan POD</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    },

    switchTab: (tabName) => {
        LastMileModule.currentTab = tabName;
        
        ['dispatch', 'pod'].forEach(tab => {
            const el = document.getElementById(`tab-${tab}`);
            if (el) {
                if (tab === tabName) {
                    el.className = "px-6 py-3 font-medium text-sm border-b-2 border-blue-600 text-blue-600 whitespace-nowrap";
                } else {
                    el.className = "px-6 py-3 font-medium text-sm border-b-2 border-transparent text-gray-500 hover:text-gray-700 whitespace-nowrap";
                }
            }
        });

        LastMileModule.renderTabContent();
    },

    renderTabContent: () => {
        const container = document.getElementById('lastmile-content');
        if (!container) return;

        if (LastMileModule.currentTab === 'dispatch') {
            container.innerHTML = LastMileModule.uiDispatch();
            LastMileModule.refreshDispatchList();
            LastMileModule.populateCouriers();
        }
        if (LastMileModule.currentTab === 'pod') {
            container.innerHTML = LastMileModule.uiPOD();
            LastMileModule.refreshPODList();
        }
    },

    // ==========================================
    // 1. DISPATCH DELIVERY (Runsheet)
    // ==========================================
    uiDispatch: () => {
        return `
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div class="lg:col-span-2">
                    <h3 class="font-bold text-gray-700 mb-3 border-b pb-2">Kargo Tersedia di Hub (Arrived at Hub)</h3>
                    <div class="overflow-x-auto bg-gray-50 rounded border">
                        <table class="w-full text-sm text-left text-gray-600">
                            <thead class="bg-gray-200 text-gray-700">
                                <tr>
                                    <th class="p-3 w-10 text-center"><input type="checkbox" onchange="window.LastMileUI.toggleAllDispatch(this)"></th>
                                    <th class="p-3">AWB</th>
                                    <th class="p-3">Penerima Tujuan</th>
                                    <th class="p-3">Alamat</th>
                                </tr>
                            </thead>
                            <tbody id="dispatch-list" class="bg-white">
                                </tbody>
                        </table>
                    </div>
                </div>
                <div class="lg:col-span-1 bg-blue-50 p-4 rounded-xl border border-blue-100 h-fit">
                    <h3 class="font-bold text-blue-900 mb-4 border-b border-blue-200 pb-2">Assign Kurir Delivery</h3>
                    <form onsubmit="window.LastMileUI.createDispatch(event)">
                        <div class="space-y-4">
                            <div>
                                <label class="block text-xs font-bold text-blue-800 uppercase mb-1">Pilih Kurir Bertugas</label>
                                <select id="dispatch-courier" name="courier_id" required class="w-full border border-blue-300 rounded p-2.5 focus:ring-blue-500"></select>
                            </div>
                            <button type="submit" class="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 shadow-md transition">
                                <i class="fas fa-motorcycle mr-2"></i> Buat Runsheet Delivery
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    },

    refreshDispatchList: () => {
        const resi = DB.getAll('resi').filter(r => r.status === 'Arrived at Hub');
        const tbody = document.getElementById('dispatch-list');
        if (!tbody) return;

        if (resi.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" class="p-6 text-center text-gray-400 font-medium">Tidak ada kargo yang menunggu dispatch.</td></tr>`;
            return;
        }

        let html = '';
        resi.forEach(r => {
            html += `
                <tr class="border-b hover:bg-blue-50 transition">
                    <td class="p-3 text-center"><input type="checkbox" class="dispatch-checkbox" value="${r.id}"></td>
                    <td class="p-3 font-bold text-blue-700">${r.awb}</td>
                    <td class="p-3 font-semibold">${r.penerima_nama}</td>
                    <td class="p-3 text-xs text-gray-500 truncate max-w-xs">${r.penerima_alamat}</td>
                </tr>
            `;
        });
        tbody.innerHTML = html;
    },

    populateCouriers: () => {
        const couriers = DB.getAll('couriers');
        let html = '<option value="">-- Pilih Kurir Aktif --</option>';
        couriers.filter(c => c.status === 'Aktif').forEach(c => html += `<option value="${c.id}">${c.name}</option>`);
        if(document.getElementById('dispatch-courier')) {
            document.getElementById('dispatch-courier').innerHTML = html;
        }
    },

    toggleAllDispatch: (source) => {
        const checkboxes = document.querySelectorAll('.dispatch-checkbox');
        checkboxes.forEach(cb => cb.checked = source.checked);
    },

    createDispatch: (e) => {
        e.preventDefault();
        const checkboxes = document.querySelectorAll('.dispatch-checkbox:checked');
        if (checkboxes.length === 0) {
            alert('Pilih minimal 1 resi untuk diserahkan ke kurir!');
            return;
        }

        const formData = new FormData(e.target);
        const courierId = formData.get('courier_id');
        const courierData = DB.getById('couriers', courierId);
        
        let count = 0;
        checkboxes.forEach(cb => {
            const resiId = cb.value;
            DB.update('resi', resiId, { 
                status: 'On Delivery',
                delivery_courier_id: courierId,
                delivery_courier_name: courierData ? courierData.name : 'Unknown'
            });
            count++;
        });

        alert(`Sukses! ${count} Resi telah ditugaskan ke kurir ${courierData.name} (Status: On Delivery).`);
        e.target.reset();
        LastMileModule.refreshDispatchList();
    },

    // ==========================================
    // 2. ENTRY POD (Proof of Delivery)
    // ==========================================
    uiPOD: () => {
        return `
            <div>
                <h3 class="font-bold text-gray-700 mb-3 border-b pb-2">Kargo Sedang Diantar (On Delivery)</h3>
                <div class="overflow-x-auto bg-white rounded border">
                    <table class="w-full text-sm text-left">
                        <thead class="bg-indigo-50 text-indigo-800 border-b border-indigo-100">
                            <tr>
                                <th class="p-3">AWB</th>
                                <th class="p-3">Tujuan / Alamat</th>
                                <th class="p-3">Kurir Bertugas</th>
                                <th class="p-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody id="pod-list" class="text-gray-600">
                            </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    refreshPODList: () => {
        const resi = DB.getAll('resi').filter(r => r.status === 'On Delivery');
        const tbody = document.getElementById('pod-list');
        if (!tbody) return;

        if (resi.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" class="p-8 text-center text-gray-400">Tidak ada kargo yang sedang dalam pengantaran saat ini.</td></tr>`;
            return;
        }

        let html = '';
        resi.forEach(r => {
            html += `
                <tr class="border-b hover:bg-gray-50">
                    <td class="p-3 font-bold text-indigo-700">${r.awb}</td>
                    <td class="p-3"><div class="font-semibold text-gray-800">${r.penerima_nama}</div><div class="text-xs text-gray-500">${r.penerima_alamat}</div></td>
                    <td class="p-3"><span class="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs font-bold"><i class="fas fa-motorcycle mr-1"></i> ${r.delivery_courier_name}</span></td>
                    <td class="p-3 text-right">
                        <button onclick="window.LastMileUI.openPODModal(${r.id}, '${r.awb}')" class="bg-indigo-600 text-white px-4 py-1.5 rounded shadow hover:bg-indigo-700 text-xs font-bold transition">
                            Entri POD
                        </button>
                    </td>
                </tr>
            `;
        });
        tbody.innerHTML = html;
    },

    // Modal Logic
    openPODModal: (id, awb) => {
        LastMileModule.podId = id;
        document.getElementById('pod-modal-title').innerText = `Entry POD: ${awb}`;
        document.getElementById('pod-modal').classList.remove('hidden');
    },

    closePODModal: () => {
        document.getElementById('pod-modal').classList.add('hidden');
        document.getElementById('pod-form').reset();
        LastMileModule.podId = null;
        LastMileModule.togglePODFields(); // Reset state
    },

    togglePODFields: () => {
        const status = document.getElementById('pod-status').value;
        const penerimaField = document.getElementById('penerima-field');
        const penerimaInput = document.getElementById('pod-receiver');
        
        if (status === 'Undelivered') {
            penerimaField.classList.add('hidden');
            penerimaInput.removeAttribute('required');
        } else {
            penerimaField.classList.remove('hidden');
            penerimaInput.setAttribute('required', 'true');
        }
    },

    savePOD: (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        // Setup data update berdasarkan status
        const updateData = {
            status: data.status, // Bisa 'Delivered' atau 'Undelivered'
            pod_date: new Date().toISOString(),
            pod_notes: data.pod_notes || ''
        };

        if (data.status === 'Delivered') {
            updateData.pod_receiver_name = data.pod_receiver;
        }

        DB.update('resi', LastMileModule.podId, updateData);
        
        alert(`Status resi berhasil diubah menjadi: ${data.status}`);
        LastMileModule.closePODModal();
        LastMileModule.refreshPODList();
    },

    init: () => {
        LastMileModule.switchTab('dispatch');
    }
};

window.LastMileUI = LastMileModule;
export default LastMileModule;
