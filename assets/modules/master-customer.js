import { db } from '../js/db.js';

export const render = async () => `
    <div class="mb-6 flex justify-between items-center">
        <div>
            <h2 class="text-2xl font-bold text-gray-800">Master Pelanggan</h2>
            <p class="text-sm text-gray-500">Kelola data informasi pelanggan, alamat, dan invoice secara detail.</p>
        </div>
        <button id="btnAddCustomer" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center shadow-sm">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            Add New
        </button>
    </div>

    <div id="customerFormContainer" class="hidden bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <h3 class="font-semibold text-gray-700 mb-4 border-b pb-2" id="formTitle">Tambah Pelanggan Baru</h3>
        <form id="formCustomer" class="space-y-4">
            <input type="hidden" id="c_id">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1">Kode Pelanggan *</label>
                    <input type="text" id="c_code" required class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Contoh: CSJKT00001">
                </div>
                <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1">Nama Pelanggan *</label>
                    <input type="text" id="c_name" required class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Contoh: PT JAR">
                </div>
            </div>
            <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Alamat Lengkap *</label>
                <textarea id="c_address" required rows="3" class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Masukkan alamat lengkap"></textarea>
            </div>
            
             <div class="flex justify-end space-x-3 pt-4 border-t border-gray-100 mt-4">
                <button type="button" id="btnCancelCustomer" class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition">Cancel</button>
                <button type="submit" class="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition shadow-sm">Submit</button>
            </div>
        </form>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 class="font-semibold text-gray-700">Customer List</h3>
            <div class="relative">
                <input type="text" id="searchCustomer" placeholder="Search..." class="pl-8 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-64">
                <svg class="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
        </div>
        
        <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-gray-600">
                <thead class="bg-gray-50 text-gray-700 border-b">
                    <tr>
                        <th class="px-6 py-3 font-medium">Kode</th>
                        <th class="px-6 py-3 font-medium">Nama Pelanggan</th>
                        <th class="px-6 py-3 font-medium w-1/2">Alamat</th>
                        <th class="px-6 py-3 font-medium text-right">Actions</th>
                    </tr>
                </thead>
                <tbody id="customerTableBody" class="divide-y divide-gray-100">
                    </tbody>
            </table>
        </div>
        <div class="p-4 border-t border-gray-100 text-xs text-gray-500 flex justify-between items-center">
            <span id="customerCountInfo">Showing 0 entries</span>
        </div>
    </div>
`;

export const init = () => {
    // 1. Initialize Mock Data for Customers if empty
    if (!localStorage.getItem('zolog_customers')) {
        localStorage.setItem('zolog_customers', JSON.stringify([
            { id: 1, code: 'CSJKT00001', name: 'PT JAR', address: 'GREEN SEDAYU BIZPARK DAANMOGOT' },
            { id: 2, code: 'CSJKT00002', name: 'IBU MARIA', address: 'JL SOEKARNO HATTA NO 99 KEC PAYUNG SEKAKI KOTA PEKANBARU' },
             { id: 3, code: 'CSJKT00003', name: 'PT TIRA SATRIA NIAGA', address: 'Jl Raya pondok ungu km 28 Medan Satria Bekasi' }
        ]));
    }

    const getCustomers = () => JSON.parse(localStorage.getItem('zolog_customers')) || [];
    const saveCustomers = (data) => localStorage.setItem('zolog_customers', JSON.stringify(data));

    const formContainer = document.getElementById('customerFormContainer');
    const form = document.getElementById('formCustomer');
    const formTitle = document.getElementById('formTitle');
    
    // UI Toggles
    document.getElementById('btnAddCustomer').addEventListener('click', () => {
        form.reset();
        document.getElementById('c_id').value = '';
        formTitle.innerText = 'Tambah Pelanggan Baru';
        formContainer.classList.remove('hidden');
    });

    document.getElementById('btnCancelCustomer').addEventListener('click', () => {
        formContainer.classList.add('hidden');
    });

    // Load Data
    const loadTable = (searchTerm = '') => {
        let customers = getCustomers();
        
        if (searchTerm) {
            searchTerm = searchTerm.toLowerCase();
            customers = customers.filter(c => 
                c.name.toLowerCase().includes(searchTerm) || 
                c.code.toLowerCase().includes(searchTerm)
            );
        }

        document.getElementById('customerTableBody').innerHTML = customers.map(c => `
            <tr class="hover:bg-gray-50 transition">
                <td class="px-6 py-4 font-medium text-indigo-600">${c.code}</td>
                <td class="px-6 py-4 font-medium text-gray-800">${c.name}</td>
                <td class="px-6 py-4 text-gray-500 truncate max-w-xs" title="${c.address}">${c.address}</td>
                <td class="px-6 py-4 text-right space-x-3">
                    <button class="text-blue-500 hover:text-blue-700 transition btn-edit-customer" data-id="${c.id}" title="Edit Data">
                        <svg class="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                    </button>
                    <button class="text-red-500 hover:text-red-700 transition btn-delete-customer" data-id="${c.id}" title="Hapus Data">
                       <svg class="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                </td>
            </tr>
        `).join('') || `<tr><td colspan="4" class="text-center py-6 text-gray-500">Tidak ada data pelanggan.</td></tr>`;
        
        document.getElementById('customerCountInfo').innerText = `Showing ${customers.length} entries`;

        // Attach Events to Buttons
        document.querySelectorAll('.btn-delete-customer').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.dataset.id);
                if(confirm('Apakah Anda yakin ingin menghapus data pelanggan ini?')) {
                    saveCustomers(getCustomers().filter(c => c.id !== id));
                    loadTable();
                }
            });
        });

        document.querySelectorAll('.btn-edit-customer').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.dataset.id);
                const customer = getCustomers().find(c => c.id === id);
                if(customer) {
                    document.getElementById('c_id').value = customer.id;
                    document.getElementById('c_code').value = customer.code;
                    document.getElementById('c_name').value = customer.name;
                    document.getElementById('c_address').value = customer.address;
                    
                    formTitle.innerText = 'Ubah Data Pelanggan';
                    formContainer.classList.remove('hidden');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
        });
    };

    // Initial Load
    loadTable();

    // Search Feature
    document.getElementById('searchCustomer').addEventListener('input', (e) => {
        loadTable(e.target.value);
    });

    // Form Submit (Add/Edit)
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const idInput = document.getElementById('c_id').value;
        let customers = getCustomers();

        const payload = {
            code: document.getElementById('c_code').value,
            name: document.getElementById('c_name').value,
            address: document.getElementById('c_address').value
        };

        if (idInput) {
            // Update
            customers = customers.map(c => c.id === parseInt(idInput) ? { ...c, ...payload } : c);
            alert('Data pelanggan berhasil diubah.');
        } else {
            // Insert
            payload.id = Date.now();
            customers.push(payload);
            alert('Data pelanggan baru berhasil ditambahkan.');
        }

        saveCustomers(customers);
        formContainer.classList.add('hidden');
        loadTable();
    });
};
