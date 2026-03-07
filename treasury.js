// treasury.js
import DB from './db.js';

const TreasuryModule = {
    currentTab: 'ar_receipt',
    activeInvoiceId: null,
    activePayableId: null,

    render: async () => {
        return `
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div class="mb-6 flex justify-between items-center">
                    <div>
                        <h2 class="text-2xl font-bold text-gray-800">Treasury & Cashier</h2>
                        <p class="text-sm text-gray-500">Manajemen Kas Masuk (AR) dan Kas Keluar (AP)</p>
                    </div>
                    <div class="bg-blue-50 text-blue-800 px-4 py-2 rounded-lg font-bold border border-blue-200">
                        Saldo Kas: Rp <span id="company-balance">Memuat...</span>
                    </div>
                </div>

                <div class="flex border-b border-gray-200 mb-6 overflow-x-auto">
                    <button onclick="window.TreasuryUI.switchTab('ar_receipt')" id="tab-ar_receipt" class="px-6 py-3 font-medium text-sm border-b-2 border-blue-600 text-blue-600 whitespace-nowrap">Penerimaan Kasir AR</button>
                    <button onclick="window.TreasuryUI.switchTab('ap_payment')" id="tab-ap_payment" class="px-6 py-3 font-medium text-sm border-b-2 border-transparent text-gray-500 hover:text-gray-700 whitespace-nowrap">Pencairan Vendor AP</button>
                </div>

                <div id="treasury-content">
                    </div>
            </div>

            <div id="modal-ar" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center hidden">
                <div class="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 transform transition-all">
                    <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-green-50 rounded-t-xl">
                        <h3 class="text-lg font-bold text-green-900" id="modal-ar-title">Terima Pembayaran</h3>
                        <button onclick="window.TreasuryUI.closeModal('ar')" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times"></i></button>
                    </div>
                    <form onsubmit="window.TreasuryUI.processARPayment(event)" class="p-6">
                        <div class="space-y-4">
                            <div class="bg-gray-50 p-3 rounded text-sm text-gray-700 mb-4 border border-gray-200">
                                <div>Sisa Tagihan: <strong class="text-red-600" id="ar-outstanding">Rp 0</strong></div>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Nominal Dibayar (Rp)</label>
                                <input type="number" name="payment_amount" id="ar-amount" required class="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-green-500">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Metode Pembayaran</label>
                                <select name="payment_method" required class="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-green-500">
                                    <option value="Transfer Bank">Transfer Bank</option>
                                    <option value="Giro / Cek">Giro / Cek</option>
                                    <option value="Tunai">Tunai / Cash Register</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Referensi / Bukti Transfer</label>
                                <input type="text" name="payment_ref" required class="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-green-500" placeholder="Cth: TRF-BCA-12345">
                            </div>
                        </div>
                        <div class="mt-6 flex justify-end gap-3">
                            <button type="button" onclick="window.TreasuryUI.closeModal('ar')" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Batal</button>
                            <button type="submit" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold"><i class="fas fa-check-circle mr-1"></i> Proses Pelunasan</button>
                        </div>
                    </form>
                </div>
            </div>

            <div id="modal-ap-add" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center hidden">
                <div class="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 transform transition-all">
                    <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-red-50 rounded-t-xl">
                        <h3 class="text-lg font-bold text-red-900">Entri Tagihan Vendor (AP)</h3>
                        <button onclick="window.TreasuryUI.closeModal('ap-add')" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times"></i></button>
                    </div>
                    <form onsubmit="window.TreasuryUI.addVendorBill(event)" class="p-6">
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Nama Vendor</label>
                                <input type="text" name="vendor_name" required class="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-red-500" placeholder="Cth: PT. Vendor Armada Bersama">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Nominal Tagihan (Rp)</label>
                                <input type="number" name="amount" required class="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-red-500">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
                                <textarea name="description" required class="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-red-500" rows="2" placeholder="Cth: Sewa Truk Wingbox JKT-SBY"></textarea>
                            </div>
                        </div>
                        <div class="mt-6 flex justify-end gap-3">
                            <button type="button" onclick="window.TreasuryUI.closeModal('ap-add')" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Batal</button>
                            <button type="submit" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-bold">Simpan Tagihan</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    },

    switchTab: (tabName) => {
        TreasuryModule.currentTab = tabName;
        
        ['ar_receipt', 'ap_payment'].forEach(tab => {
            const el = document.getElementById(`tab-${tab}`);
            if (el) {
                if (tab === tabName) {
                    el.className = "px-6 py-3 font-medium text-sm border-b-2 border-blue-600 text-blue-600 whitespace-nowrap";
                } else {
                    el.className = "px-6 py-3 font-medium text-sm border-b-2 border-transparent text-gray-500 hover:text-gray-700 whitespace-nowrap";
                }
            }
        });

        TreasuryModule.renderTabContent();
        TreasuryModule.calculateCompanyBalance();
    },

    renderTabContent: () => {
        const container = document.getElementById('treasury-content');
        if (!container) return;

        if (TreasuryModule.currentTab === 'ar_receipt') {
            container.innerHTML = TreasuryModule.uiAR();
            TreasuryModule.refreshARList();
        }
        if (TreasuryModule.currentTab === 'ap_payment') {
            container.innerHTML = TreasuryModule.uiAP();
            TreasuryModule.refreshAPList();
        }
    },

    // Kalkulasi Dummy Saldo Perusahaan (Kas Masuk - Kas Keluar)
    calculateCompanyBalance: () => {
        const receipts = DB.getAll('ar_receipts');
        const payments = DB.getAll('ap_payments');
        
        const totalIn = receipts.reduce((sum, r) => sum + r.amount, 0);
        const totalOut = payments.reduce((sum, p) => sum + p.amount, 0);
        
        const balance = totalIn - totalOut;
        const balEl = document.getElementById('company-balance');
        if (balEl) balEl.innerText = balance.toLocaleString('id-ID');
    },

    // ==========================================
    // 1. PENERIMAAN KASIR AR
    // ==========================================
    uiAR: () => {
        return `
            <div>
                <h3 class="font-bold text-gray-700 mb-3 border-b pb-2">Daftar Outstanding Invoice (Belum Lunas)</h3>
                <div class="overflow-x-auto bg-white rounded border">
                    <table class="w-full text-sm text-left">
                        <thead class="bg-green-50 text-green-800 border-b border-green-100">
                            <tr>
                                <th class="p-3">No. Invoice</th>
                                <th class="p-3">Pelanggan</th>
                                <th class="p-3 text-right">Total Invoice (Rp)</th>
                                <th class="p-3 text-right">Sisa Outstanding (Rp)</th>
                                <th class="p-3 text-center">Aksi Kasir</th>
                            </tr>
                        </thead>
                        <tbody id="ar-list" class="text-gray-600">
                            </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    refreshARList: () => {
        // Ambil invoice yang statusnya bukan Paid
        const invoices = DB.getAll('invoices').filter(inv => inv.status !== 'Paid');
        const tbody = document.getElementById('ar-list');
        if (!tbody) return;

        if (invoices.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" class="p-8 text-center text-gray-400">Semua Invoice telah lunas dibayar.</td></tr>`;
            return;
        }

        let html = '';
        invoices.forEach(inv => {
            // Kalkulasi pembayaran yang sudah masuk untuk invoice ini
            const receipts = DB.getAll('ar_receipts').filter(r => r.invoice_id === inv.id);
            const paidAmount = receipts.reduce((sum, r) => sum + r.amount, 0);
            const outstanding = inv.amount - paidAmount;

            html += `
                <tr class="border-b hover:bg-gray-50 transition">
                    <td class="p-3 font-bold text-gray-700">${inv.invoice_no}</td>
                    <td class="p-3 font-semibold text-blue-700">${inv.customer_name}</td>
                    <td class="p-3 text-right">${inv.amount.toLocaleString('id-ID')}</td>
                    <td class="p-3 text-right font-bold text-red-600">${outstanding.toLocaleString('id-ID')}</td>
                    <td class="p-3 text-center">
                        <button onclick="window.TreasuryUI.openARModal(${inv.id}, '${inv.invoice_no}', ${outstanding})" class="bg-green-600 text-white px-4 py-1.5 rounded shadow hover:bg-green-700 text-xs font-bold transition">
                            Terima Dana
                        </button>
                    </td>
                </tr>
            `;
        });
        tbody.innerHTML = html;
    },

    openARModal: (id, invoiceNo, outstanding) => {
        TreasuryModule.activeInvoiceId = id;
        document.getElementById('modal-ar-title').innerText = `Pelunasan: ${invoiceNo}`;
        document.getElementById('ar-outstanding').innerText = `Rp ${outstanding.toLocaleString('id-ID')}`;
        document.getElementById('ar-amount').value = outstanding; // Default full payment
        document.getElementById('ar-amount').max = outstanding;
        document.getElementById('modal-ar').classList.remove('hidden');
    },

    processARPayment: (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const amount = parseFloat(formData.get('payment_amount'));
        
        // Simpan Record Penerimaan
        const receipt = {
            invoice_id: TreasuryModule.activeInvoiceId,
            amount: amount,
            method: formData.get('payment_method'),
            reference: formData.get('payment_ref'),
            date: new Date().toISOString()
        };
        DB.insert('ar_receipts', receipt);

        // Update Status Invoice
        const inv = DB.getById('invoices', TreasuryModule.activeInvoiceId);
        const allReceipts = DB.getAll('ar_receipts').filter(r => r.invoice_id === inv.id);
        const totalPaid = allReceipts.reduce((sum, r) => sum + r.amount, 0);

        if (totalPaid >= inv.amount) {
            DB.update('invoices', inv.id, { status: 'Paid' });
            alert('Invoice telah lunas sepenuhnya!');
        } else {
            DB.update('invoices', inv.id, { status: 'Partial' });
            alert(`Pembayaran sebagian berhasil dicatat. Sisa tagihan: Rp ${(inv.amount - totalPaid).toLocaleString('id-ID')}`);
        }

        TreasuryModule.closeModal('ar');
        TreasuryModule.refreshARList();
        TreasuryModule.calculateCompanyBalance();
    },

    // ==========================================
    // 2. PENCAIRAN VENDOR AP
    // ==========================================
    uiAP: () => {
        return `
            <div>
                <div class="flex justify-between items-center mb-3 border-b pb-2">
                    <h3 class="font-bold text-gray-700">Daftar Tagihan Vendor (Account Payable)</h3>
                    <button onclick="document.getElementById('modal-ap-add').classList.remove('hidden')" class="bg-red-100 text-red-700 px-3 py-1.5 rounded hover:bg-red-200 text-sm font-bold border border-red-200">
                        <i class="fas fa-plus"></i> Entri Tagihan Baru
                    </button>
                </div>
                <div class="overflow-x-auto bg-white rounded border">
                    <table class="w-full text-sm text-left">
                        <thead class="bg-red-50 text-red-800 border-b border-red-100">
                            <tr>
                                <th class="p-3">Tanggal Tagihan</th>
                                <th class="p-3">Nama Vendor</th>
                                <th class="p-3">Keterangan</th>
                                <th class="p-3 text-right">Nominal (Rp)</th>
                                <th class="p-3 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody id="ap-list" class="text-gray-600">
                            </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    refreshAPList: () => {
        const payables = DB.getAll('ap_bills');
        const tbody = document.getElementById('ap-list');
        if (!tbody) return;

        if (payables.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" class="p-8 text-center text-gray-400">Belum ada tagihan vendor yang tercatat.</td></tr>`;
            return;
        }

        let html = '';
        payables.reverse().forEach(ap => {
            const dateStr = new Date(ap.created_at).toLocaleDateString('id-ID');
            const isPaid = ap.status === 'Paid';
            
            html += `
                <tr class="border-b hover:bg-gray-50 transition">
                    <td class="p-3 text-xs">${dateStr}</td>
                    <td class="p-3 font-bold text-gray-700">${ap.vendor_name}</td>
                    <td class="p-3 text-xs">${ap.description}</td>
                    <td class="p-3 text-right font-bold ${isPaid ? 'text-gray-400' : 'text-red-600'}">${parseFloat(ap.amount).toLocaleString('id-ID')}</td>
                    <td class="p-3 text-center">
                        ${isPaid ? 
                            `<span class="bg-gray-100 text-gray-500 px-2 py-1 rounded text-xs font-bold"><i class="fas fa-check"></i> Lunas</span>` : 
                            `<button onclick="window.TreasuryUI.processAPDisbursement(${ap.id}, '${ap.vendor_name}', ${ap.amount})" class="bg-red-600 text-white px-4 py-1.5 rounded shadow hover:bg-red-700 text-xs font-bold transition">Cairkan Dana</button>`
                        }
                    </td>
                </tr>
            `;
        });
        tbody.innerHTML = html;
    },

    addVendorBill: (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        data.status = 'Unpaid';
        
        DB.insert('ap_bills', data);
        TreasuryModule.closeModal('ap-add');
        TreasuryModule.refreshAPList();
    },

    processAPDisbursement: (id, vendorName, amount) => {
        if(confirm(`Anda akan mencairkan dana Kasir sebesar Rp ${amount.toLocaleString('id-ID')} untuk membayar ${vendorName}. Lanjutkan?`)) {
            // Update status tagihan AP
            DB.update('ap_bills', id, { status: 'Paid' });
            
            // Rekam di AP Payments untuk pengurang saldo
            DB.insert('ap_payments', {
                ap_bill_id: id,
                amount: parseFloat(amount),
                date: new Date().toISOString()
            });

            alert(`Pencairan dana untuk ${vendorName} berhasil diproses.`);
            TreasuryModule.refreshAPList();
            TreasuryModule.calculateCompanyBalance();
        }
    },

    closeModal: (type) => {
        if (type === 'ar') {
            document.getElementById('modal-ar').classList.add('hidden');
            TreasuryModule.activeInvoiceId = null;
        } else if (type === 'ap-add') {
            document.getElementById('modal-ap-add').classList.add('hidden');
        }
    },

    init: () => {
        TreasuryModule.switchTab('ar_receipt');
    }
};

window.TreasuryUI = TreasuryModule;
export default TreasuryModule;
