import { db } from '../js/db.js';

export const render = async () => `
    <div class="mb-6 flex justify-between items-center">
        <div>
            <h2 class="text-2xl font-bold text-gray-800">Master User</h2>
            <p class="text-sm text-gray-500">Kelola akses dan role pengguna sistem.</p>
        </div>
    </div>
    
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div class="p-5 border-b border-gray-100 bg-gray-50/50">
            <h3 class="font-semibold text-gray-700">Tambah User Baru</h3>
            <form id="formUser" class="mt-4 flex gap-4 items-end">
                <div class="flex-1">
                    <label class="block text-xs text-gray-500 mb-1">Nama Lengkap</label>
                    <input type="text" id="u_name" required class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                </div>
                <div class="flex-1">
                    <label class="block text-xs text-gray-500 mb-1">Role</label>
                    <select id="u_role" class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                        <option value="admin">Admin</option>
                        <option value="operator">Operator</option>
                    </select>
                </div>
                <button type="submit" class="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition shadow-sm">Simpan</button>
            </form>
        </div>
        
        <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-gray-600">
                <thead class="bg-gray-50 text-gray-700 border-b">
                    <tr>
                        <th class="px-6 py-3 font-medium">ID</th>
                        <th class="px-6 py-3 font-medium">Nama</th>
                        <th class="px-6 py-3 font-medium">Role</th>
                        <th class="px-6 py-3 font-medium text-right">Aksi</th>
                    </tr>
                </thead>
                <tbody id="userTableBody" class="divide-y divide-gray-100">
                    </tbody>
            </table>
        </div>
    </div>
`;

export const init = () => {
    const loadTable = () => {
        const users = db.getUsers();
        document.getElementById('userTableBody').innerHTML = users.map(u => `
            <tr class="hover:bg-gray-50 transition">
                <td class="px-6 py-4">USR-${u.id.toString().slice(-4)}</td>
                <td class="px-6 py-4 font-medium text-gray-800">${u.name}</td>
                <td class="px-6 py-4"><span class="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-semibold uppercase">${u.role}</span></td>
                <td class="px-6 py-4 text-right">
                    <button class="text-red-500 hover:text-red-700 text-sm font-medium btn-delete" data-id="${u.id}">Hapus</button>
                </td>
            </tr>
        `).join('');
        
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                db.deleteUser(parseInt(e.target.dataset.id));
                loadTable();
            });
        });
    };

    loadTable();

    document.getElementById('formUser').addEventListener('submit', (e) => {
        e.preventDefault();
        db.saveUser({
            name: document.getElementById('u_name').value,
            role: document.getElementById('u_role').value,
            status: 'Aktif'
        });
        e.target.reset();
        loadTable();
    });
};
