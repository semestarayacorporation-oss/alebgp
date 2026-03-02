import { getDB, saveDB } from '../js/db.js';

export const render = (container) => {
    let resiList = getDB('zolog_resi');

    // Fungsi Render Tabel
    const renderTable = () => {
        const tbody = document.getElementById('opsTableBody');
        if (resiList.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="p-6 text-center text-sm text-slate-500">Belum ada data resi untuk diproses.</td></tr>`;
            return;
        }

        tbody.innerHTML = resiList.map((r) => {
            // Penentuan Warna Badge Status
            let badgeColor = 'bg-slate-100 text-slate-700'; // Default Staging
            if (r.status === 'On Process') badgeColor = 'bg-blue-100 text-blue-700';
            if (r.status === 'On Delivery') badgeColor = 'bg-amber-100 text-amber-700';
            if (r.status === 'Delivered') badgeColor = 'bg-green-100 text-green-700';

            // Penentuan Tombol Aksi Dinamis
            let actionBtn = '';
            if (r.status === 'Staging') {
                actionBtn = `<button class="action-btn text-white bg-blue-500 hover:bg-blue-600 text-xs px-3 py-1.5 rounded shadow-sm transition-colors" data-id="${r.id}" data-action="manifest">Proses Manifest</button>`;
            } else if (r.status === 'On Process') {
                actionBtn = `<button class="action-btn text-white bg-amber-500 hover:bg-amber-600 text-xs px-3 py-1.5 rounded shadow-sm transition-colors" data-id="${r.id}" data-action="delivery">Kirim (On Delivery)</button>`;
            } else if (r.status === 'On Delivery') {
                actionBtn = `<button class="action-btn text-white bg-emerald-500 hover:bg-emerald-600 text-xs px-3 py-1.5 rounded shadow-sm transition-colors" data-id="${r.id}" data-action="pod">Input POD</button>`;
            } else if (r.status === 'Delivered') {
                actionBtn = `<span class="text-xs text-slate-400 italic">Selesai (Penerima: ${r.pod_receiver || '-'})</span>`;
            }

            return `
            <tr class="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td class="p-4 text-sm font-medium text-slate-800">${r.id}</td>
                <td class="p-4 text-sm text-slate-600">${r.date}</td>
                <td class="p-4 text-sm font-semibold text-indigo-600">${r.origin} <span class="text-slate-400 font-normal">&rarr;</span> ${r.destination}</td>
                <td class="p-4 text-sm text-slate-600">${r.customer}</td>
                <td class="p-4 text-sm">
                    <span class="px-2.5 py-1 rounded-full text-xs font-semibold ${badgeColor}">${r.status}</span>
                </td>
                <td class="p-4 text-sm">
                    ${actionBtn}
                </td>
            </tr>
            `;
        }).join('');

        attachEventListeners();
    };

    // Fungsi untuk menangani event klik pada tombol aksi
    const attachEventListeners = () => {
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                const action = e.target.getAttribute('data-action');

                if (action === 'manifest') {
                    if (confirm(`Buat Manifest / Transfer Location untuk Resi ${id}?`)) {
                        updateStatus(id, 'On Process');
                    }
                } else if (action === 'delivery') {
                    if (confirm(`Tugaskan kurir dan mulai pengiriman (On Delivery) untuk Resi ${id}?`)) {
                        updateStatus(id, 'On Delivery');
                    }
                } else if (action === 'pod') {
                    openPodModal(id);
                }
            });
        });
    };

    // Fungsi update status ke LocalStorage
    const updateStatus = (id, newStatus, podData = null) => {
        resiList = resiList.map(r => {
            if (r.id === id) {
                return podData ? { ...r, status: newStatus, ...podData } : { ...r, status: newStatus };
            }
            return r;
        });
        saveDB('zolog_resi', resiList);
        renderTable();
    };

    // === UI UTAMA & MODAL POD ===
    container.innerHTML = `
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative">
            <div class="p-6 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                <div>
                    <h3 class="text-md font-semibold text-slate-800">Update Status & Tracking Operasional</h3>
                    <p class="text-xs text-slate-500 mt-1">Kelola Manifest, Assign Kurir, dan Input POD.</p>
                </div>
            </div>
            
            <div class="overflow-x-auto min-h-[400px]">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-white border-b border-slate-200">
                            <th class="p-4 text-xs font-semibold text-slate-500 uppercase">No. Resi</th>
                            <th class="p-4 text-xs font-semibold text-slate-500 uppercase">Tanggal</th>
                            <th class="p-4 text-xs font-semibold text-slate-500 uppercase">Rute (Origin &rarr; Dest)</th>
                            <th class="p-4 text-xs font-semibold text-slate-500 uppercase">Customer</th>
                            <th class="p-4 text-xs font-semibold text-slate-500 uppercase">Status Tracking</th>
                            <th class="p-4 text-xs font-semibold text-slate-500 uppercase">Aksi Operasional</th>
                        </tr>
                    </thead>
                    <tbody id="opsTableBody"></tbody>
                </table>
            </div>
        </div>

        <div id="podModal" class="hidden fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
            <div class="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden transform transition-all">
                <div class="p-5 border-b border-slate-100 flex justify-between items-center bg-indigo-50">
                    <h3 class="font-semibold text-indigo-900">Input Proof of Delivery (POD)</h3>
                    <button id="closePodModal" class="text-indigo-400 hover:text-indigo-600">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                <form id="podForm" class="p-5 space-y-4">
                    <input type="hidden" id="pod_resi_id">
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">No. Resi</label>
                        <input type="text" id="pod_resi_display" class="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600" disabled>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Nama Penerima Barang</label>
                        <input type="text" id="pod_receiver" class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Cth: Bpk. Budi (Security)" required>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Tanggal & Waktu Diterima</label>
                        <input type="datetime-local" id="pod_datetime" class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" required>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Catatan / Keterangan</label>
                        <textarea id="pod_notes" rows="2" class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Barang diterima dalam kondisi baik..."></textarea>
                    </div>
                    <div class="pt-4 flex justify-end gap-2">
                        <button type="button" id="cancelPodBtn" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors">Batal</button>
                        <button type="submit" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors">Simpan POD</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    // Inisialisasi Tabel Pertama Kali
    renderTable();

    // === LOGIKA MODAL ===
    const podModal = document.getElementById('podModal');
    const podForm = document.getElementById('podForm');

    const openPodModal = (id) => {
        document.getElementById('pod_resi_id').value = id;
        document.getElementById('pod_resi_display').value = id;
        
        // Set waktu saat ini sebagai default
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        document.getElementById('pod_datetime').value = now.toISOString().slice(0,16);
        
        podModal.classList.remove('hidden');
    };

    const closePodModal = () => {
        podModal.classList.add('hidden');
        podForm.reset();
    };

    document.getElementById('closePodModal').addEventListener('click', closePodModal);
    document.getElementById('cancelPodBtn').addEventListener('click', closePodModal);

    podForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('pod_resi_id').value;
        const podData = {
            pod_receiver: document.getElementById('pod_receiver').value,
            pod_datetime: document.getElementById('pod_datetime').value,
            pod_notes: document.getElementById('pod_notes').value
        };

        updateStatus(id, 'Delivered', podData);
        closePodModal();
        
        // Berikan feedback visual opsional
        alert(`POD untuk Resi ${id} berhasil disimpan. Status menjadi Delivered!`);
    });
};
