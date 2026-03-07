// finance.js
import DB from './db.js';

const FinanceModule = {
    currentTab: 'invoice',

    render: async () => {
        return `
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div class="mb-6">
                    <h2 class="text-2xl font-bold text-gray-800">Finance & Account Receivable (AR)</h2>
                    <p class="text-sm text-gray-500">Penagihan Piutang (Invoicing) & Laporan Aging</p>
                </div>

                <div class="flex border-b border-gray-200 mb-6 overflow-x-auto">
                    <button onclick="window.FinanceUI.switchTab('invoice')" id="tab-invoice" class="px-6 py-3 font-medium text-sm border-b-2 border-blue-600 text-blue-600 whitespace-nowrap">Proforma Invoice Generator</button>
                    <button onclick="window.FinanceUI.switchTab('aging')" id="tab-aging" class="px-6 py-3 font-medium text-sm border-b-2 border-transparent text-gray-500 hover:text-gray-700 whitespace-nowrap">Aging Report (30/60/90)</button>
                </div>

                <div id="finance-content">
                    </div>
            </div>
        `;
    },

    switchTab: (tabName) => {
        FinanceModule.currentTab = tabName;
        
        ['invoice', 'aging'].forEach(tab => {
            const el = document.getElementById(`tab-${tab}`);
            if (el) {
                if (tab === tabName) {
                    el.className = "px-6 py-3 font-medium text-sm border-b-2 border-blue-600 text-blue-600 whitespace-nowrap";
                } else {
                    el.className = "px-6 py-3 font-medium text-sm border-b-2 border-transparent text-gray-500 hover:text-gray-700 whitespace-nowrap";
                }
            }
        });

        FinanceModule.renderTabContent();
    },

    renderTabContent: () => {
        const container = document.getElementById('finance-content');
        if (!container) return;

        if (FinanceModule.currentTab === 'invoice') {
            container.innerHTML = FinanceModule.uiInvoice();
            FinanceModule.refreshUninvoicedList();
        }
        if (FinanceModule.currentTab === 'aging') {
            container.innerHTML = FinanceModule.uiAging();
            FinanceModule.refreshAgingReport();
        }
    },

    // ==========================================
    // 1. PROFORMA INVOICE GENERATOR
    // ==========================================
    uiInvoice: () => {
        return `
            <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div class="lg:col-span-3">
                    <h3 class="font-bold text-gray-700 mb-3 border-b pb-2">Resi Belum Ditagih (Uninvoiced AWB)</h3>
                    <div class="overflow-x-auto bg-gray-50 rounded border">
                        <table class="w-full text-sm text-left text-gray-600">
                            <thead class="bg-gray-200 text-gray-700">
                                <tr>
                                    <th class="p-3 w-10 text-center"><input type="checkbox" onchange="window.FinanceUI.toggleAllInvoice(this)"></th>
                                    <th class="p-3">AWB</th>
                                    <th class="p-3">Pelanggan (Pengirim)</th>
                                    <th class="p-3">Tgl Sistem</th>
                                    <th class="p-3 text-right">Nilai Tagihan (Rp)</th>
                                </tr>
                            </thead>
                            <tbody id="uninvoiced-list" class="bg-white">
                                </tbody>
                            <tfoot class="bg-blue-50 font-bold border-t">
                                <tr>
                                    <td colspan="4" class="p-3 text-right text-blue-900">Total Dipilih:</td>
                                    <td class="p-3 text-right text-blue-900" id="total-selected-invoice">0</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
                <div class="lg:col-span-1 bg-green-50 p-4 rounded-xl border border-green-100 h-fit">
                    <h3 class="font-bold text-green-900 mb-4 border-b border-green-200 pb-2">Generate Invoice</h3>
                    <form onsubmit="window.FinanceUI.generateInvoice(event)">
                        <div class="space-y-4">
                            <div>
                                <label class="block text-xs font-bold text-green-800 mb-1">Jatuh Tempo (Term of Payment)</label>
                                <select name="top_days" required class="w-full border border-green-300 rounded p-2.5 focus:ring-green-500 bg-white">
                                    <option value="14">14 Hari</option>
                                    <option value="30">30 Hari</option>
                                    <option value="60">60 Hari</option>
                                </select>
                            </div>
                            <button type="submit" class="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 shadow-md transition">
                                <i class="fas fa-file-invoice-dollar mr-2"></i> Terbitkan Invoice
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    },

    refreshUninvoicedList: () => {
        // Ambil resi yang belum masuk ke dalam invoice manapun (invoice_id kosong/null)
        const resi = DB.getAll('resi').filter(r => !r.invoice_id);
        const tbody = document.getElementById('uninvoiced-list');
        if (!tbody) return;

        if (resi.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" class="p-6 text-center text-gray-400 font-medium">Semua resi telah ditagihkan.</td></tr>`;
            document.getElementById('total-selected-invoice').innerText = '0';
            return;
        }

        let html = '';
        resi.forEach(r => {
            const dateStr = r.created_at ? new Date(r.created_at).toLocaleDateString('id-ID') : '-';
            html += `
                <tr class="border-b hover:bg-blue-50 transition">
                    <td class="p-3 text-center"><input type="checkbox" class="invoice-checkbox" value="${r.id}" data-price="${r.total_price}" data-customer="${r.pengirim_nama}" onchange="window.FinanceUI.calculateSelected()"></td>
                    <td class="p-3 font-bold text-gray-700">${r.awb}</td>
                    <td class="p-3 font-semibold text-blue-700">${r.pengirim_nama}</td>
                    <td class="p-3 text-xs text-gray-500">${dateStr}</td>
                    <td class="p-3 text-right font-medium">${r.total_price.toLocaleString('id-ID')}</td>
                </tr>
            `;
        });
        tbody.innerHTML = html;
        FinanceModule.calculateSelected();
    },

    toggleAllInvoice: (source) => {
        const checkboxes = document.querySelectorAll('.invoice-checkbox');
        checkboxes.forEach(cb => cb.checked = source.checked);
        FinanceModule.calculateSelected();
    },

    calculateSelected: () => {
        const checkboxes = document.querySelectorAll('.invoice-checkbox:checked');
        let total = 0;
        checkboxes.forEach(cb => {
            total += parseFloat(cb.getAttribute('data-price'));
        });
        document.getElementById('total-selected-invoice').innerText = total.toLocaleString('id-ID');
    },

    generateInvoice: (e) => {
        e.preventDefault();
        const checkboxes = document.querySelectorAll('.invoice-checkbox:checked');
        
        if (checkboxes.length === 0) {
            alert('Pilih minimal 1 resi untuk di-generate ke dalam Invoice!');
            return;
        }

        // Validasi: Pastikan semua resi yang dicentang berasal dari Pelanggan yang sama
        let customers = new Set();
        let totalAmount = 0;
        let resiIds = [];

        checkboxes.forEach(cb => {
            customers.add(cb.getAttribute('data-customer'));
            totalAmount += parseFloat(cb.getAttribute('data-price'));
            resiIds.push(cb.value);
        });

        if (customers.size > 1) {
            alert('GAGAL: Anda memilih resi dari pelanggan yang berbeda. Satu Invoice hanya untuk satu Pelanggan.');
            return;
        }

        const customerName = [...customers][0];
        const formData = new FormData(e.target);
        const topDays = parseInt(formData.get('top_days'));

        // Buat Nomor Invoice Random
        const invNo = 'INV-' + new Date().getFullYear() + '-' + Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        const today = new Date();
        const dueDate = new Date(today);
        dueDate.setDate(dueDate.getDate() + topDays);

        const newInvoice = {
            invoice_no: invNo,
            customer_name: customerName,
            amount: totalAmount,
            date: today.toISOString(),
            due_date: dueDate.toISOString(),
            status: 'Unpaid',
            resi_ids: resiIds
        };

        // Simpan ke db.js tabel 'invoices'
        const savedInvoice = DB.insert('invoices', newInvoice);

        // Update resi yang bersangkutan agar memiliki invoice_id
        resiIds.forEach(id => {
            DB.update('resi', id, { invoice_id: savedInvoice.id });
        });

        alert(`SUKSES! Invoice ${invNo} untuk ${customerName} senilai Rp ${totalAmount.toLocaleString('id-ID')} telah diterbitkan.`);
        e.target.reset();
        FinanceModule.refreshUninvoicedList();
    },

    // ==========================================
    // 2. AGING REPORT (Piutang 30/60/90)
    // ==========================================
    uiAging: () => {
        
        return `
            <div>
                <div class="flex justify-between items-center mb-4">
                    <h3 class="font-bold text-gray-700 border-b pb-2">Laporan Umur Piutang (Outstanding Aging)</h3>
                </div>
                <div class="overflow-x-auto bg-white rounded border">
                    <table class="w-full text-sm text-left">
                        <thead class="bg-red-50 text-red-800 border-b border-red-100">
                            <tr>
                                <th class="p-3">No. Invoice</th>
                                <th class="p-3">Pelanggan</th>
                                <th class="p-3 text-center">Jatuh Tempo</th>
                                <th class="p-3 text-right">Total (Rp)</th>
                                <th class="p-3 text-right text-green-700 font-bold">0-30 Hari</th>
                                <th class="p-3 text-right text-yellow-600 font-bold">31-60 Hari</th>
                                <th class="p-3 text-right text-orange-600 font-bold">61-90 Hari</th>
                                <th class="p-3 text-right text-red-600 font-bold">> 90 Hari</th>
                            </tr>
                        </thead>
                        <tbody id="aging-list" class="text-gray-600">
                            </tbody>
                        <tfoot class="bg-gray-100 font-bold border-t" id="aging-footer">
                            </tfoot>
                    </table>
                </div>
            </div>
        `;
    },

    refreshAgingReport: () => {
        // Tarik invoice yang belum dibayar lunas
        const invoices = DB.getAll('invoices').filter(inv => inv.status !== 'Paid');
        const tbody = document.getElementById('aging-list');
        const tfoot = document.getElementById('aging-footer');
        if (!tbody || !tfoot) return;

        if (invoices.length === 0) {
            tbody.innerHTML = `<tr><td colspan="8" class="p-8 text-center text-gray-400">Tidak ada piutang outstanding saat ini.</td></tr>`;
            tfoot.innerHTML = '';
            return;
        }

        let html = '';
        const today = new Date();
        
        // Accumulators untuk Total Bawah
        let sums = { total: 0, b30: 0, b60: 0, b90: 0, over90: 0 };

        invoices.forEach(inv => {
            const dueDate = new Date(inv.due_date);
            const dateStr = dueDate.toLocaleDateString('id-ID');
            
            // Hitung umur piutang dari tanggal invoice diterbitkan (bisa juga dari due date sesuai kebijakan standar akuntansi)
            const invoiceDate = new Date(inv.date);
            const diffTime = Math.abs(today - invoiceDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

            let b30 = 0, b60 = 0, b90 = 0, over90 = 0;

            if (diffDays <= 30) b30 = inv.amount;
            else if (diffDays <= 60) b60 = inv.amount;
            else if (diffDays <= 90) b90 = inv.amount;
            else over90 = inv.amount;

            // Tambahkan ke Accumulator
            sums.total += inv.amount;
            sums.b30 += b30;
            sums.b60 += b60;
            sums.b90 += b90;
            sums.over90 += over90;

            html += `
                <tr class="border-b hover:bg-red-50 transition">
                    <td class="p-3 font-bold text-red-700">${inv.invoice_no}</td>
                    <td class="p-3 font-semibold">${inv.customer_name}</td>
                    <td class="p-3 text-center text-xs text-gray-500">${dateStr}</td>
                    <td class="p-3 text-right font-medium">${inv.amount.toLocaleString('id-ID')}</td>
                    <td class="p-3 text-right">${b30 > 0 ? b30.toLocaleString('id-ID') : '-'}</td>
                    <td class="p-3 text-right">${b60 > 0 ? b60.toLocaleString('id-ID') : '-'}</td>
                    <td class="p-3 text-right">${b90 > 0 ? b90.toLocaleString('id-ID') : '-'}</td>
                    <td class="p-3 text-right font-bold text-red-600">${over90 > 0 ? over90.toLocaleString('id-ID') : '-'}</td>
                </tr>
            `;
        });

        tbody.innerHTML = html;

        // Render Total Bawah
        tfoot.innerHTML = `
            <tr>
                <td colspan="3" class="p-3 text-right text-gray-800 uppercase">Grand Total Outstanding:</td>
                <td class="p-3 text-right text-gray-800">${sums.total.toLocaleString('id-ID')}</td>
                <td class="p-3 text-right text-green-700">${sums.b30.toLocaleString('id-ID')}</td>
                <td class="p-3 text-right text-yellow-600">${sums.b60.toLocaleString('id-ID')}</td>
                <td class="p-3 text-right text-orange-600">${sums.b90.toLocaleString('id-ID')}</td>
                <td class="p-3 text-right text-red-600">${sums.over90.toLocaleString('id-ID')}</td>
            </tr>
        `;
    },

    init: () => {
        FinanceModule.switchTab('invoice');
    }
};

window.FinanceUI = FinanceModule;
export default FinanceModule;
