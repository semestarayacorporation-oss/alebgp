import { db } from '../js/db.js';

export const render = async () => `
    <div class="mb-6 flex justify-between items-center">
        <div>
            <h2 class="text-2xl font-bold text-gray-800">Master Vendor</h2>
            <p class="text-sm text-gray-500">Kelola data vendor pendukung operasional.</p>
        </div>
        <button id="btnAddVendor" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center shadow-sm">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            Add New
        </button>
    </div>

    <div id="vendorFormContainer" class="hidden bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <h3 class="font-semibold text-gray-700 mb-4 border-b pb-2" id="vFormTitle">Tambah Vendor Baru</h3>
        <form id="formVendor" class="space-y-4">
            <input type="hidden" id="v_id">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1">Nama Vendor *</label>
                    <input type="text" id="v_name" required class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Contoh: DHL">
                </div>
                <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1">Email Vendor *</label>
                    <input type="email" id="v_email" required class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Contoh: dhl@mail.com">
                </div>
            </div>
            <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Alamat *</label>
                <textarea id="v_address" required rows="2" class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Masukkan alamat vendor"></textarea>
            </div>
            
             <div class="flex justify-end space-x-3 pt-4 border-t border-gray-100 mt-4">
                <button type="button" id="btnCancelVendor" class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition">Cancel</button>
                <button type="submit" class="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition shadow-sm">Submit</button>
            </div>
        </form>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 class="font-semibold text-gray-700">Vendor List</h3>
            <div class="relative">
                <input type="text" id="searchVendor" placeholder="Search by name..." class="pl-8 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-64">
                <svg class="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
        </div>
        
        <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-gray-600">
                <thead class="bg-gray-50 text-gray-700 border-b">
                    <tr>
                        <th class="px-6 py-3 font-medium">Team (Tags)</th>
                        <th class="px-6 py-3 font-medium">Name</th>
                        <th class="px-6 py-3 font-medium">Email</th>
                        <th class="px-6 py-3 font-medium">Address</th>
                        <th class="px-6 py-3 font-medium text-right">Actions</th>
                    </tr>
                </thead>
                <tbody id="vendorTableBody" class="divide-y divide-gray-100">
                    </tbody>
            </table>
        </div>
        <div class="p-4 border-t border-gray-100 text-xs text-gray-500 flex justify-between items-center">
            <span id="vendorCountInfo">Showing 0 entries</span>
        </div>
    </div>
`;

export const init = () => {
    // 1. Initialize Mock Data for Vendors if empty
    if (!localStorage.getItem('zolog_vendors')) {
        localStorage.setItem('zolog_vendors', JSON.stringify([
            { id: 1, name: 'DHL', email: 'dhl@mail.com', address: 'muara raya', teams: ['yogyakarta', 'jakarta'] },
            { id: 2, name: 'Batavia', email: 'harry@mail.com', address: 'test', teams: ['Banjarmasin', 'jakarta'] },
             { id: 3, name: 'agung sugianto', email: '-', address: 'test', teams: ['jakarta'] }
        ]));
    }

    const getVendors = () => JSON.parse(localStorage.getItem('zolog_vendors')) || [];
    const saveVendors = (data) => localStorage.setItem('zolog_vendors', JSON.stringify(data));

    const formContainer = document.getElementById('vendorFormContainer');
    const form = document.getElementById('formVendor');
    const formTitle = document.getElementById('vFormTitle');
    
    // UI Toggles
    document.getElementById('btnAddVendor').addEventListener('click', () => {
        form.reset();
        document.getElementById('v_id').value = '';
        formTitle.innerText = 'Tambah Vendor Baru';
        formContainer.classList.remove('hidden');
    });

    document.getElementById('btnCancelVendor').addEventListener('click', () => {
        formContainer.classList.add('hidden');
    });

    // Load Data
    const loadTable = (searchTerm = '') => {
        let vendors = getVendors();
        
        if (searchTerm) {
            searchTerm = searchTerm.toLowerCase();
            vendors = vendors.filter(v => v.name.toLowerCase().includes(searchTerm));
        }

        const renderTeams = (teams) => {
            if(!teams || !teams.length) return '-';
            return teams.map(t => `<span class="px-2 py-1 bg-green-100 text-green-700 text-[10px] rounded mr-1 uppercase">${t}</span>`).join('');
        };

        document.getElementById('vendorTableBody').innerHTML = vendors.map(v => `
            <tr class="hover:bg-gray-50 transition">
                <td class="px-6 py-4">${renderTeams(v.teams)}</td>
                <td class="px-6 py-4 font-medium text-gray-800">${v.name}</td>
                <td class="px-6 py-4 text-gray-500">${v.email}</td>
                <td class="px-6 py-4 text-gray-500">${v.address}</td>
                <td class="px-6 py-4 text-right space-x-3">
                    <button class="text-blue-500 hover:text-blue-700 transition btn-edit-vendor" data-id="${v.id}" title="Edit Data">
                        <svg class="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                    </button>
                    <button class="text-red-500 hover:text-red-700 transition btn-delete-vendor" data-id="${v.id}" title="Hapus Data">
                       <svg class="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                </td>
            </tr>
        `).join('') || `<tr><td colspan="5" class="text-center py-6 text-gray-500">Tidak ada data vendor.</td></tr>`;
        
        document.getElementById('vendorCountInfo').innerText = `Showing 1 to ${vendors.length} of ${vendors.length} entries`;

        // Attach Events
        document.querySelectorAll('.btn-delete-vendor').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.dataset.id);
                if(confirm('Apakah Anda yakin ingin menghapus data vendor ini?')) {
                    saveVendors(getVendors().filter(v => v.id !== id));
                    loadTable();
                }
            });
        });

        document.querySelectorAll('.btn-edit-vendor').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.dataset.id);
                const vendor = getVendors().find(v => v.id === id);
                if(vendor) {
                    document.getElementById('v_id').value = vendor.id;
                    document.getElementById('v_name').value = vendor.name;
                    document.getElementById('v_email').value = vendor.email;
                    document.getElementById('v_address').value = vendor.address;
                    
                    formTitle.innerText = 'Ubah Data Vendor';
                    formContainer.classList.remove('hidden');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
        });
    };

    loadTable();

    document.getElementById('searchVendor').addEventListener('input', (e) => {
        loadTable(e.target.value);
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const idInput = document.getElementById('v_id').value;
        let vendors = getVendors();

        const payload = {
            name: document.getElementById('v_name').value,
            email: document.getElementById('v_email').value,
            address: document.getElementById('v_address').value,
            teams: ['jakarta'] // Default mock data for new entries
        };

        if (idInput) {
            // Update
            const existingVendor = vendors.find(v => v.id === parseInt(idInput));
            payload.teams = existingVendor ? existingVendor.teams : ['jakarta'];
            vendors = vendors.map(v => v.id === parseInt(idInput) ? { ...v, ...payload } : v);
            alert('Data vendor berhasil diubah.');
        } else {
            // Insert
            payload.id = Date.now();
            vendors.push(payload);
            alert('Data vendor baru berhasil ditambahkan.');
        }

        saveVendors(vendors);
        formContainer.classList.add('hidden');
        loadTable();
    });
};
