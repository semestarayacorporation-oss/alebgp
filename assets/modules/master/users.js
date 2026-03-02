import { getDb, saveDb, generateId } from '../../js/db.js';

export const render = () => {
    return `
        <div class="bg-white p-6 rounded-xl shadow-md">
            <div class="flex justify-between mb-4">
                <h3 class="text-lg font-bold">Daftar Pengguna</h3>
                <button id="addUserBtn" class="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700">Tambah User</button>
            </div>
            <div class="overflow-x-auto">
                <table class="min-w-full bg-white border border-gray-200">
                    <thead class="bg-gray-100">
                        <tr>
                            <th class="py-2 px-4 border-b text-left">Nama</th>
                            <th class="py-2 px-4 border-b text-left">Username</th>
                            <th class="py-2 px-4 border-b text-left">Role</th>
                            <th class="py-2 px-4 border-b text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody id="userTableBody"></tbody>
                </table>
            </div>
        </div>
    `;
};

export const afterRender = () => {
    const db = getDb();
    const tbody = document.getElementById('userTableBody');
    
    const loadTable = () => {
        tbody.innerHTML = db.users.map(u => `
            <tr>
                <td class="py-2 px-4 border-b">${u.name}</td>
                <td class="py-2 px-4 border-b">${u.username}</td>
                <td class="py-2 px-4 border-b">${u.role}</td>
                <td class="py-2 px-4 border-b text-center text-sm">
                    <button class="text-red-500 hover:text-red-700" onclick="alert('Delete module belum aktif')">Hapus</button>
                </td>
            </tr>
        `).join('');
    };

    loadTable();

    document.getElementById('addUserBtn').addEventListener('click', () => {
        const name = prompt("Nama User:");
        const username = prompt("Username:");
        const password = prompt("Password:");
        const role = prompt("Role (e.g. CS Counter):");
        
        if(name && username && role) {
            db.users.push({ id: generateId(), name, username, password, role });
            saveDb(db);
            loadTable();
        }
    });
};
