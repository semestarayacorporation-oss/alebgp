import { getDB, saveDB } from '../js/db.js';

export const render = (container) => {
    let invoices = getDB('zolog_invoices');
    let customers = getDB('zolog_customers');

    // Kalkulasi Dashboard Keuangan
    const formatRp = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(angka);
    
    const updateDashboard = () => {
        const totalOutstanding = invoices.filter(i => i.status === 'Outstanding').reduce((sum, i) => sum + Number(i.amount), 0);
        const totalPaid = invoices.filter(i => i.status === 'Payment Received').reduce((sum, i) => sum + Number(i.amount), 0);
        
        document.getElementById('cardOutstanding').innerText = formatRp(totalOutstanding);
        document.getElementById('cardPaid').innerText = formatRp(totalPaid);
    };

    const renderTable = () => {
        const tbody = document.getElementById('invoiceTableBody');
        if (invoices.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="p-4 text-center text-sm text-slate-500">Belum ada data invoice.</td></tr>`;
            return;
        }

        tbody.innerHTML = invoices.map((inv) => {
            const isPaid = inv.status === 'Payment Received';
            const statusClass = isPaid ? 'bg-green-100 text-green-700' : 'bg-rose-100 text-rose-700';
            
            return `
            <tr class="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td class="p-4 text-sm font-medium text-slate-800">${inv.id}</td>
                <td class="p-4 text-sm text-slate-600">${inv.date}</td>
                <td class="p-4 text-sm font-semibold text-slate-700">${inv.customer}</td>
                <td class="p-4 text-sm text-slate-800 font-mono">${formatRp(inv.amount)}</td>
                <td class="p-4 text-sm">
                    <span class="px-2.5 py-1 rounded-full text-xs font-semibold ${statusClass}">${inv.status}</span>
                </td>
                <td class="p-4 text-sm">
                    ${!isPaid ? `<button class="text-white bg-emerald-500 hover:bg-emerald-600 text-xs px-3 py-1.5 rounded shadow-sm transition-colors pay-btn" data-id="${inv.id}">Terima Pembayaran</button>` : `<span class="text-slate-400 text-xs italic">Lunas</span>`}
                </td>
            </tr>
        `}).join('');

        // Event listener untuk tombol Terima Pembayaran
        document.querySelectorAll('.pay-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                if(confirm(`Konfirmasi penerimaan pembayaran untuk Invoice ${id}?`)) {
                    invoices = invoices.map(inv => inv.id === id ? { ...inv, status: 'Payment Received' } : inv);
                    saveDB('zolog_invoices', invoices);
                    renderTable();
                    updateDashboard();
                }
            });
        });
    };

    // Populasi dropdown customer
    const customerOptions = customers.map(c => `<option value="${c.company}">${c.id} - ${c.company}</option>`).join('');

    container.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div class="bg-white p-6 rounded-xl shadow-sm border border-rose-100 flex flex-col">
                <p class="text-sm font-medium text-rose-500 mb-1">Total Outstanding (Belum Dibayar)</p>
                <h3 class="text-3xl font-bold text-slate-800" id="cardOutstanding">Rp 0</h3>
            </div>
            <div class="bg-white p-6 rounded-xl shadow-sm border border-emerald-100 flex flex-col">
                <p class="text-sm font-medium text-emerald-500 mb-1">Total Payment Received (Lunas)</p>
                <h3 class="text-3xl font-bold text-slate-800" id="cardPaid">Rp 0</h3>
            </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div class="p-6 border-b border-slate-200 flex flex-col md:flex-row justify-between items-center bg-slate-50 gap-4">
                <h3 class="text-md font-semibold text-slate-800">Generate Invoice Baru</h3>
                <form id="addInvoiceForm" class="flex flex-wrap md:flex-nowrap gap-3 w-full md:w-auto">
                    <input type="date" id="inv_date" class="px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-indigo-500" required>
                    <select id="inv_customer" class="px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-indigo-500" required>
                        <option value="">-- Pilih Customer --</option>
                        ${customerOptions}
                    </select>
                    <input type="number" id="inv_amount" placeholder="Nominal Rp..." class="px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-indigo-500" required>
                    <button type="submit" class="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">Buat Tagihan</button>
                </form>
            </div>
            
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-white border-b border-slate-200">
                            <th class="p-4 text-xs font-semibold text-slate-500 uppercase">No. Invoice</th>
                            <th class="p-4 text-xs font-semibold text-slate-500 uppercase">Tanggal</th>
                            <th class="p-4 text-xs font-semibold text-slate-500 uppercase">Customer</th>
                            <th class="p-4 text-xs font-semibold text-slate-500 uppercase">Nominal</th>
                            <th class="p-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                            <th class="p-4 text-xs font-semibold text-slate-500 uppercase">Aksi Payment</th>
                        </tr>
                    </thead>
                    <tbody id="invoiceTableBody"></tbody>
                </table>
            </div>
        </div>
    `;

    document.getElementById('inv_date').valueAsDate = new Date();
    renderTable();
    updateDashboard();

    document.getElementById('addInvoiceForm').addEventListener('submit', (e) => {
        e.preventDefault();
        // Generate random Invoice Number: INV-2609-XXXX
        const randId = Math.floor(1000 + Math.random() * 9000);
        const dateObj = new Date();
        const yymm = `${dateObj.getFullYear().toString().slice(-2)}${(dateObj.getMonth()+1).toString().padStart(2, '0')}`;
        
        const newInvoice = {
            id: `INV-${yymm}-${randId}`,
            date: document.getElementById('inv_date').value,
            customer: document.getElementById('inv_customer').value,
            amount: document.getElementById('inv_amount').value,
            status: 'Outstanding'
        };
        
        invoices.unshift(newInvoice); // Masukkan ke paling atas
        saveDB('zolog_invoices', invoices);
        renderTable();
        updateDashboard();
        
        // Reset form except date
        document.getElementById('inv_customer').value = '';
        document.getElementById('inv_amount').value = '';
    });
};
