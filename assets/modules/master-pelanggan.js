import { getDB, saveDB } from '../js/db.js';

export const render = (container) => {
    let customers = getDB('zolog_customers');

    const renderTable = () => {
        const tbody = document.getElementById('customerTableBody');
        if (customers.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" class="p-4 text-center text-sm text-slate-500">Belum ada data pelanggan.</td></tr>`;
            return;
        }

        tbody.innerHTML = customers.map((c, index) => `
            <tr class="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td class="p-4 text-sm font-medium text-slate-800">${c.id}</td>
                <td class="p-4 text-sm font-semibold text-indigo-600">${c.company}</td>
                <td class="p-4 text-sm text-slate-600">${c.pic}</td>
                <td class="p-4 text-sm text-slate-600 truncate max-w-xs" title="${c.address}">${c.address}</td>
                <td class="p-4 text-sm">
                    <button class="text-red-500 hover:text-red-700 font-medium text-xs bg-red-50 px-2 py-1 rounded delete-btn" data-id="${c.id}">Hapus</button>
                </td>
            </tr>
        `).join('');

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if(confirm('Yakin ingin menghapus pelanggan ini?')) {
                    const id = e.target.getAttribute('data-id');
                    customers = customers.filter(c => c.id !== id);
                    saveDB('zolog_customers', customers);
                    renderTable();
                }
            });
        });
    };

    container.innerHTML = `
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
            <div class="p-6 border-b border-slate-200 bg-slate-50">
                <h3 class="text-md font-semibold text-slate-800 mb-4">Tambah Pelanggan Baru</h3>
                <form id="addCustomerForm" class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div>
                        <label class="block text-xs font-medium text-slate-500 mb-1">Kode Pelanggan</label>
                        <input type="text" id="c_id" placeholder="Cth: CSJKT00003" class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" required>
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-slate-500 mb-1">Nama Perusahaan / Customer</label>
                        <input type="text" id="c_company" placeholder="PT. ABC..." class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" required>
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-slate-500 mb-1">Nama PIC</label>
                        <input type="text" id="c_pic" placeholder="Nama kontak..." class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" required>
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-slate-500 mb-1">Alamat Lengkap</label>
                        <input type="text" id="c_address" placeholder="Jalan, Kota..." class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" required>
                    </div>
                    <div class="md:col-span-4 flex justify-end">
                        <button type="submit" class="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                            Simpan Pelanggan
                        </button>
                    </div>
                </form>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-white border-b border-slate-200">
                            <th class="p-4 text-xs font-semibold text-slate-500 uppercase">Kode</th>
                            <th class="p-4 text-xs font-semibold text-slate-500 uppercase">Perusahaan</th>
                            <th class="p-4 text-xs font-semibold text-slate-500 uppercase">PIC</th>
                            <th class="p-4 text-xs font-semibold text-slate-500 uppercase">Alamat</th>
                            <th class="p-4 text-xs font-semibold text-slate-500 uppercase">Aksi</th>
                        </tr>
                    </thead>
                    <tbody id="customerTableBody"></tbody>
                </table>
            </div>
        </div>
    `;

    renderTable();

    document.getElementById('addCustomerForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const newCustomer = {
            id: document.getElementById('c_id').value.toUpperCase(),
            company: document.getElementById('c_company').value,
            pic: document.getElementById('c_pic').value,
            address: document.getElementById('c_address').value
        };
        
        // Cek duplikat ID
        if(customers.find(c => c.id === newCustomer.id)) {
            alert('Kode Pelanggan sudah terdaftar!');
            return;
        }

        customers.unshift(newCustomer); // Tambah di urutan teratas
        saveDB('zolog_customers', customers);
        renderTable();
        e.target.reset();
    });
};
