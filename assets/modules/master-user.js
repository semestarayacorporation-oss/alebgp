import { getDB, saveDB } from '../js/db.js';

export const render = (container) => {
    let users = getDB('zolog_users');

    const renderTable = () => {
        const tbody = document.getElementById('userTableBody');
        tbody.innerHTML = users.map((u, index) => `
            <tr class="border-b border-slate-100 hover:bg-slate-50">
                <td class="p-4 text-sm text-slate-700">${index + 1}</td>
                <td class="p-4 text-sm font-medium text-slate-800">${u.name}</td>
                <td class="p-4 text-sm text-slate-600">${u.username}</td>
                <td class="p-4 text-sm text-slate-600">${u.role}</td>
                <td class="p-4 text-sm">
                    <button class="text-red-500 hover:text-red-700 text-sm delete-btn" data-id="${u.id}">Hapus</button>
                </td>
            </tr>
        `).join('');

        // Attach delete events
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                users = users.filter(u => u.id !== id);
                saveDB('zolog_users', users);
                renderTable();
            });
        });
    };

    container.innerHTML = `
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div class="p-6 border-b border-slate-200 flex justify-between items-center">
                <h2 class="text-lg font-semibold text-slate-800">Daftar Pengguna</h2>
            </div>
            <div class="p-6 bg-slate-50 border-b border-slate-200">
                <form id="addUserForm" class="flex gap-4 items-end">
                    <div class="flex-1">
                        <label class="block text-xs font-medium text-slate-500 mb-1">Nama Lengkap</label>
                        <input type="text" id="addName" class="w-full px-3 py-2 border rounded-lg text-sm" required>
                    </div>
                    <div class="flex-1">
                        <label class="block text-xs font-medium text-slate-500 mb-1">Username</label>
                        <input type="text" id="addUsername" class="w-full px-3 py-2 border rounded-lg text-sm" required>
                    </div>
                    <div class="flex-1">
                        <label class="block text-xs font-medium text-slate-500 mb-1">Role</label>
                        <select id="addRole" class="w-full px-3 py-2 border rounded-lg text-sm">
                            <option value="Admin Cabang">Admin Cabang</option>
                            <option value="CS Counter">CS Counter</option>
                            <option value="Operasional">Operasional</option>
                        </select>
                    </div>
                    <button type="submit" class="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">Tambah</button>
                </form>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-slate-50 border-b border-slate-200">
                            <th class="p-4 text-xs font-semibold text-slate-500 uppercase">No</th>
                            <th class="p-4 text-xs font-semibold text-slate-500 uppercase">Nama</th>
                            <th class="p-4 text-xs font-semibold text-slate-500 uppercase">Username</th>
                            <th class="p-4 text-xs font-semibold text-slate-500 uppercase">Role</th>
                            <th class="p-4 text-xs font-semibold text-slate-500 uppercase">Aksi</th>
                        </tr>
                    </thead>
                    <tbody id="userTableBody"></tbody>
                </table>
            </div>
        </div>
    `;

    renderTable();

    document.getElementById('addUserForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const newUser = {
            id: Date.now().toString(),
            name: document.getElementById('addName').value,
            username: document.getElementById('addUsername').value,
            role: document.getElementById('addRole').value
        };
        users.push(newUser);
        saveDB('zolog_users', users);
        renderTable();
        e.target.reset();
    });
};
