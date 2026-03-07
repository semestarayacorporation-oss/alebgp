// master.js
import DB from './db.js';

const MasterModule = {
    currentTab: 'couriers', // Default tab
    editId: null,

    // Konfigurasi struktur data per tab
    config: {
        couriers: {
            title: 'Data Kurir',
            fields: [
                { key: 'name', label: 'Nama Kurir', type: 'text' },
                { key: 'phone', label: 'No. Handphone', type: 'text' },
                { key: 'status', label: 'Status', type: 'select', options: ['Aktif', 'Non-Aktif'] }
            ]
        },
        armadas: {
            title: 'Data Armada',
            fields: [
                { key: 'plate_number', label: 'Plat Nomor', type: 'text' },
                { key: 'type', label: 'Tipe Kendaraan', type: 'select', options: ['Blind Van', 'CDE', 'CDD', 'Fuso', 'Wingbox'] },
                { key: 'capacity', label: 'Kapasitas (Kg)', type: 'number' }
            ]
        },
        coverages: {
            title: 'Coverage Area',
            fields: [
                { key: 'name', label: 'Nama Kota / Wilayah', type: 'text' },
                { key: 'type', label: 'Tipe Coverage', type: 'select', options: ['Origin', 'Destination', 'Keduanya'] }
            ]
        }
    },

    // 1. Render UI Utama (Dipanggil oleh router)
    render: async () => {
        return `
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <h2 class="text-2xl font-bold text-gray-800">Master Data Logistik</h2>
                    <button onclick="window.MasterUI.openModal()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow font-medium transition flex items-center gap-2">
                        <i class="fas fa-plus"></i> Tambah Data
                    </button>
                </div>

                <div class="flex border-b border-gray-200 mb-6 overflow-x-auto">
                    <button onclick="window.MasterUI.switchTab('couriers')" id="tab-couriers" class="px-6 py-3 font-medium text-sm border-b-2 border-blue-600 text-blue-600 whitespace-nowrap">Kurir</button>
                    <button onclick="window.MasterUI.switchTab('armadas')" id="tab-armadas" class="px-6 py-3 font-medium text-sm border-b-2 border-transparent text-gray-500 hover:text-gray-700 whitespace-nowrap">Armada</button>
                    <button onclick="window.MasterUI.switchTab('coverages')" id="tab-coverages" class="px-6 py-3 font-medium text-sm border-b-2 border-transparent text-gray-500 hover:text-gray-700 whitespace-nowrap">Coverage Area</button>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-sm text-left text-gray-500">
                        <thead class="text-xs text-gray-700 uppercase bg-gray-50" id="table-head">
                            </thead>
                        <tbody id="table-body">
                            </tbody>
                    </table>
                </div>
            </div>

            <div id="master-modal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center hidden">
                <div class="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 transform transition-all">
                    <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                        <h3 class="text-lg font-bold text-gray-800" id="modal-title">Tambah Data</h3>
                        <button onclick="window.MasterUI.closeModal()" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times"></i></button>
                    </div>
                    <form id="master-form" onsubmit="window.MasterUI.saveData(event)" class="p-6">
                        <div id="form-fields" class="space-y-4">
                            </div>
                        <div class="mt-6 flex justify-end gap-3">
                            <button type="button" onclick="window.MasterUI.closeModal()" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Batal</button>
                            <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Simpan Data</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    },

    // 2. Logika Switch Tab
    switchTab: (tabName) => {
        MasterModule.currentTab = tabName;
        
        // Update UI Tab Active State
        ['couriers', 'armadas', 'coverages'].forEach(tab => {
            const el = document.getElementById(`tab-${tab}`);
            if (el) {
                if (tab === tabName) {
                    el.className = "px-6 py-3 font-medium text-sm border-b-2 border-blue-600 text-blue-600 whitespace-nowrap";
                } else {
                    el.className = "px-6 py-3 font-medium text-sm border-b-2 border-transparent text-gray-500 hover:text-gray-700 whitespace-nowrap";
                }
            }
        });

        MasterModule.refreshTable();
    },

    // 3. Render Tabel berdasarkan Tab Aktif
    refreshTable: () => {
        const conf = MasterModule.config[MasterModule.currentTab];
        const data = DB.getAll(MasterModule.currentTab);
        
        const thead = document.getElementById('table-head');
        const tbody = document.getElementById('table-body');
        
        if (!thead || !tbody) return;

        // Render Header
        let headHTML = '<tr>';
        headHTML += `<th scope="col" class="px-6 py-3">ID</th>`;
        conf.fields.forEach(f => {
            headHTML += `<th scope="col" class="px-6 py-3">${f.label}</th>`;
        });
        headHTML += `<th scope="col" class="px-6 py-3 text-right">Aksi</th></tr>`;
        thead.innerHTML = headHTML;

        // Render Body
        if (data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="${conf.fields.length + 2}" class="px-6 py-8 text-center text-gray-400">Belum ada data ${conf.title}.</td></tr>`;
            return;
        }

        let bodyHTML = '';
        data.forEach(row => {
            bodyHTML += `<tr class="bg-white border-b hover:bg-gray-50">
                <td class="px-6 py-4 font-medium text-gray-900">${row.id}</td>`;
            
            conf.fields.forEach(f => {
                bodyHTML += `<td class="px-6 py-4">${row[f.key] || '-'}</td>`;
            });

            bodyHTML += `
                <td class="px-6 py-4 text-right">
                    <button onclick="window.MasterUI.openModal(${row.id})" class="text-blue-600 hover:text-blue-800 mr-3" title="Edit"><i class="fas fa-edit"></i></button>
                    <button onclick="window.MasterUI.deleteData(${row.id})" class="text-red-600 hover:text-red-800" title="Hapus"><i class="fas fa-trash"></i></button>
                </td>
            </tr>`;
        });
        tbody.innerHTML = bodyHTML;
    },

    // 4. Manajemen Form (Buka Modal)
    openModal: (id = null) => {
        MasterModule.editId = id;
        const conf = MasterModule.config[MasterModule.currentTab];
        const modal = document.getElementById('master-modal');
        const title = document.getElementById('modal-title');
        const fieldsContainer = document.getElementById('form-fields');
        
        title.innerText = id ? `Edit ${conf.title}` : `Tambah ${conf.title}`;
        
        let record = {};
        if (id) {
            record = DB.getById(MasterModule.currentTab, id);
        }

        // Generate Input Fields dynamically
        let fieldsHTML = '';
        conf.fields.forEach(f => {
            const val = record[f.key] || '';
            if (f.type === 'select') {
                let optionsHTML = f.options.map(opt => `<option value="${opt}" ${val === opt ? 'selected' : ''}>${opt}</option>`).join('');
                fieldsHTML += `
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">${f.label}</label>
                        <select name="${f.key}" class="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500" required>
                            <option value="">-- Pilih --</option>
                            ${optionsHTML}
                        </select>
                    </div>
                `;
            } else {
                fieldsHTML += `
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">${f.label}</label>
                        <input type="${f.type}" name="${f.key}" value="${val}" class="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500" required>
                    </div>
                `;
            }
        });

        fieldsContainer.innerHTML = fieldsHTML;
        modal.classList.remove('hidden');
    },

    closeModal: () => {
        document.getElementById('master-modal').classList.add('hidden');
        document.getElementById('master-form').reset();
        MasterModule.editId = null;
    },

    // 5. Simpan Data ke DB LocalStorage
    saveData: (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const dataObj = Object.fromEntries(formData.entries());
        
        if (MasterModule.editId) {
            DB.update(MasterModule.currentTab, MasterModule.editId, dataObj);
        } else {
            DB.insert(MasterModule.currentTab, dataObj);
        }
        
        MasterModule.closeModal();
        MasterModule.refreshTable();
    },

    // 6. Hapus Data dari DB LocalStorage
    deleteData: (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
            DB.delete(MasterModule.currentTab, id);
            MasterModule.refreshTable();
        }
    },

    // Inisialisasi setelah render DOM
    init: () => {
        MasterModule.switchTab('couriers'); // Load initial data
    }
};

// Expose ke Window Object untuk event HTML onclick
window.MasterUI = MasterModule;

export default MasterModule;
