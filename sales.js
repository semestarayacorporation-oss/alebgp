// sales.js
import DB from './db.js';

const SalesModule = {
    currentTab: 'entri', // Default tab: entri, tarif, lacak, pickup

    render: async () => {
        return `
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div class="mb-6">
                    <h2 class="text-2xl font-bold text-gray-800">Front Desk Sales & CS</h2>
                    <p class="text-sm text-gray-500">Manajemen Resi, Tarif, dan Penjemputan</p>
                </div>

                <div class="flex border-b border-gray-200 mb-6 overflow-x-auto">
                    <button onclick="window.SalesUI.switchTab('entri')" id="tab-entri" class="px-6 py-3 font-medium text-sm border-b-2 border-blue-600 text-blue-600 whitespace-nowrap">Entri Resi Cash</button>
                    <button onclick="window.SalesUI.switchTab('tarif')" id="tab-tarif" class="px-6 py-3 font-medium text-sm border-b-2 border-transparent text-gray-500 hover:text-gray-700 whitespace-nowrap">Cek Tarif</button>
                    <button onclick="window.SalesUI.switchTab('lacak')" id="tab-lacak" class="px-6 py-3 font-medium text-sm border-b-2 border-transparent text-gray-500 hover:text-gray-700 whitespace-nowrap">Lacak Resi</button>
                    <button onclick="window.SalesUI.switchTab('pickup')" id="tab-pickup" class="px-6 py-3 font-medium text-sm border-b-2 border-transparent text-gray-500 hover:text-gray-700 whitespace-nowrap">Pick Up Runsheet</button>
                </div>

                <div id="sales-content">
                    </div>
            </div>
        `;
    },

    switchTab: (tabName) => {
        SalesModule.currentTab = tabName;
        
        // Update Tab Styles
        ['entri', 'tarif', 'lacak', 'pickup'].forEach(tab => {
            const el = document.getElementById(`tab-${tab}`);
            if (el) {
                if (tab === tabName) {
                    el.className = "px-6 py-3 font-medium text-sm border-b-2 border-blue-600 text-blue-600 whitespace-nowrap";
                } else {
                    el.className = "px-6 py-3 font-medium text-sm border-b-2 border-transparent text-gray-500 hover:text-gray-700 whitespace-nowrap";
                }
            }
        });

        SalesModule.renderTabContent();
    },

    renderTabContent: () => {
        const container = document.getElementById('sales-content');
        if (!container) return;

        if (SalesModule.currentTab === 'entri') container.innerHTML = SalesModule.uiEntriResi();
        if (SalesModule.currentTab === 'tarif') container.innerHTML = SalesModule.uiCekTarif();
        if (SalesModule.currentTab === 'lacak') container.innerHTML = SalesModule.uiLacakResi();
        if (SalesModule.currentTab === 'pickup') container.innerHTML = SalesModule.uiPickup();

        // Populate Dropdowns setelah UI dirender
        if (SalesModule.currentTab === 'entri' || SalesModule.currentTab === 'tarif') {
            SalesModule.populateDropdowns();
        }
        if (SalesModule.currentTab === 'pickup') {
            SalesModule.populateCouriers();
        }
    },

    // ==========================================
    // UI COMPONENTS & LOGIC PER TAB
    // ==========================================

    // 1. ENTRI RESI CASH
    uiEntriResi: () => {
        return `
            <form id="form-resi" onsubmit="window.SalesUI.saveResi(event)" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-4">
                    <h3 class="font-bold text-gray-700 border-b pb-2">Informasi Pengirim & Penerima</h3>
                    <div>
                        <label class="block text-xs font-medium text-gray-500">Nama Pengirim</label>
                        <input type="text" name="pengirim_nama" required class="w-full border rounded p-2 mt-1 focus:ring-blue-500">
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-gray-500">Nama Penerima</label>
                        <input type="text" name="penerima_nama" required class="w-full border rounded p-2 mt-1 focus:ring-blue-500">
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-gray-500">Alamat Lengkap Penerima</label>
                        <textarea name="penerima_alamat" required class="w-full border rounded p-2 mt-1 focus:ring-blue-500" rows="2"></textarea>
                    </div>
                </div>

                <div class="space-y-4">
                    <h3 class="font-bold text-gray-700 border-b pb-2">Detail Pengiriman</h3>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-medium text-gray-500">Kota Asal</label>
                            <select id="select-origin" name="origin_id" required class="w-full border rounded p-2 mt-1"><option value="">Pilih</option></select>
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-gray-500">Kota Tujuan</label>
                            <select id="select-destination" name="destination_id" required class="w-full border rounded p-2 mt-1"><option value="">Pilih</option></select>
                        </div>
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-gray-500">Layanan</label>
                        <select id="select-service" name="service_id" onchange="window.SalesUI.calculateVolume()" required class="w-full border rounded p-2 mt-1"><option value="">Pilih Layanan</option></select>
                    </div>

                    <div class="bg-gray-50 p-4 rounded border">
                        <label class="block text-xs font-bold text-gray-700 mb-2">Kalkulator Volumetrik (PxLxT / 4000)</label>
                        <div class="flex gap-2 mb-2">
                            <input type="number" id="dim_p" placeholder="P (cm)" onkeyup="window.SalesUI.calculateVolume()" class="w-1/3 border rounded p-1 text-sm">
                            <input type="number" id="dim_l" placeholder="L (cm)" onkeyup="window.SalesUI.calculateVolume()" class="w-1/3 border rounded p-1 text-sm">
                            <input type="number" id="dim_t" placeholder="T (cm)" onkeyup="window.SalesUI.calculateVolume()" class="w-1/3 border rounded p-1 text-sm">
                        </div>
                        <div class="flex gap-2 items-center">
                            <div class="w-1/2">
                                <label class="block text-xs text-gray-500">Berat Aktual (Kg)</label>
                                <input type="number" id="weight_actual" name="weight" onkeyup="window.SalesUI.calculateVolume()" required class="w-full border rounded p-1 mt-1 text-sm">
                            </div>
                            <div class="w-1/2 text-right">
                                <span class="text-xs text-gray-500">Chargeable Weight:</span>
                                <div class="font-bold text-lg text-blue-700"><span id="chargeable_weight">0</span> Kg</div>
                            </div>
                        </div>
                        <div class="mt-3 text-right">
                            <span class="text-xs text-gray-500">Total Biaya:</span>
                            <div class="font-bold text-xl text-green-600">Rp <span id="total_price">0</span></div>
                        </div>
                    </div>
                </div>

                <div class="md:col-span-2 text-right mt-4 border-t pt-4">
                    <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-700"><i class="fas fa-save mr-2"></i> Cetak & Simpan Resi</button>
                </div>
            </form>
        `;
    },

    calculateVolume: () => {
        const p = parseFloat(document.getElementById('dim_p')?.value) || 0;
        const l = parseFloat(document.getElementById('dim_l')?.value) || 0;
        const t = parseFloat(document.getElementById('dim_t')?.value) || 0;
        const actual = parseFloat(document.getElementById('weight_actual')?.value) || 0;
        
        // Standar darat/laut = 4000
        const volWeight = Math.ceil((p * l * t) / 4000); 
        const chargeable = Math.max(actual, volWeight);
        
        document.getElementById('chargeable_weight').innerText = chargeable;

        // Hitung Harga
        const serviceId = document.getElementById('select-service')?.value;
        if (serviceId && chargeable > 0) {
            const service = DB.getById('services', serviceId);
            if (service) {
                // Terapkan min_weight
                const finalWeight = Math.max(chargeable, service.min_weight);
                const total = finalWeight * service.price;
                document.getElementById('total_price').innerText = total.toLocaleString('id-ID');
            }
        } else {
            document.getElementById('total_price').innerText = '0';
        }
    },

    saveResi: (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        // Generate AWB Random
        const awb = 'ALB' + new Date().getTime().toString().slice(-6) + Math.floor(Math.random() * 100);
        
        const chargeable = parseFloat(document.getElementById('chargeable_weight').innerText);
        const totalPrice = parseFloat(document.getElementById('total_price').innerText.replace(/\./g, ''));

        const resiData = {
            ...data,
            awb: awb,
            chargeable_weight: chargeable,
            total_price: totalPrice,
            status: 'Manifested (Origin)', // Status awal operasional
            payment_type: 'Cash'
        };

        DB.insert('resi', resiData);
        alert(`Resi berhasil dibuat!\nNo AWB: ${awb}\nChargeable: ${chargeable} Kg\nTotal: Rp ${totalPrice.toLocaleString('id-ID')}`);
        e.target.reset();
        document.getElementById('chargeable_weight').innerText = '0';
        document.getElementById('total_price').innerText = '0';
    },

    // 2. CEK TARIF
    uiCekTarif: () => {
        return `
            <div class="max-w-xl mx-auto bg-gray-50 p-6 rounded-lg border">
                <h3 class="font-bold text-center mb-4 text-gray-700">Simulasi Tarif Publish</h3>
                <div class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-medium text-gray-500">Asal</label>
                            <select id="sim-origin" class="w-full border rounded p-2 mt-1"></select>
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-gray-500">Tujuan</label>
                            <select id="sim-dest" class="w-full border rounded p-2 mt-1"></select>
                        </div>
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-gray-500">Berat (Kg)</label>
                        <input type="number" id="sim-weight" value="1" class="w-full border rounded p-2 mt-1">
                    </div>
                    <button onclick="window.SalesUI.simulateTariff()" class="w-full bg-orange-500 text-white font-bold py-2 rounded hover:bg-orange-600">Hitung Tarif</button>
                </div>
                <div id="sim-result" class="mt-6 hidden">
                    <table class="w-full text-sm text-left border">
                        <thead class="bg-gray-200 text-gray-700">
                            <tr><th class="p-2">Layanan</th><th class="p-2">Min. Kg</th><th class="p-2 text-right">Total Biaya</th></tr>
                        </thead>
                        <tbody id="sim-result-body" class="bg-white"></tbody>
                    </table>
                </div>
            </div>
        `;
    },

    simulateTariff: () => {
        const weight = parseFloat(document.getElementById('sim-weight').value) || 1;
        const services = DB.getAll('services');
        const tbody = document.getElementById('sim-result-body');
        
        let html = '';
        services.forEach(srv => {
            const finalWeight = Math.max(weight, srv.min_weight);
            const total = finalWeight * srv.price;
            html += `<tr class="border-b"><td class="p-2 font-bold">${srv.name} (${srv.code})</td><td class="p-2">${srv.min_weight} Kg</td><td class="p-2 text-right text-blue-700 font-bold">Rp ${total.toLocaleString('id-ID')}</td></tr>`;
        });
        
        tbody.innerHTML = html;
        document.getElementById('sim-result').classList.remove('hidden');
    },

    // 3. LACAK RESI
    uiLacakResi: () => {
        return `
            <div class="max-w-xl mx-auto">
                <div class="flex gap-2 mb-6">
                    <input type="text" id="track-awb" placeholder="Masukkan No. AWB (Contoh: ALB...)" class="w-full border-2 border-blue-200 rounded-lg p-3 focus:border-blue-500 outline-none uppercase">
                    <button onclick="window.SalesUI.trackAwb()" class="bg-blue-600 text-white px-6 rounded-lg font-bold hover:bg-blue-700"><i class="fas fa-search"></i> Lacak</button>
                </div>
                <div id="track-result" class="bg-gray-50 p-4 rounded-lg border hidden">
                    </div>
            </div>
        `;
    },

    trackAwb: () => {
        const awb = document.getElementById('track-awb').value.trim().toUpperCase();
        const resiList = DB.getAll('resi');
        const resi = resiList.find(r => r.awb === awb);
        const resultDiv = document.getElementById('track-result');

        if (!resi) {
            resultDiv.innerHTML = `<p class="text-red-500 text-center font-bold">Resi tidak ditemukan di database.</p>`;
        } else {
            const service = DB.getById('services', resi.service_id);
            const origin = DB.getById('coverages', resi.origin_id);
            const dest = DB.getById('coverages', resi.destination_id);
            
            resultDiv.innerHTML = `
                <div class="border-b pb-3 mb-3">
                    <h4 class="text-lg font-bold text-blue-800">${resi.awb}</h4>
                    <p class="text-sm text-gray-500">Layanan: ${service ? service.name : '-'} | Berat: ${resi.chargeable_weight} Kg</p>
                </div>
                <div class="flex justify-between text-sm mb-4">
                    <div><span class="block text-gray-400 text-xs">Pengirim</span><span class="font-bold">${resi.pengirim_nama}</span><br>${origin ? origin.name : '-'}</div>
                    <div class="text-right"><span class="block text-gray-400 text-xs">Penerima</span><span class="font-bold">${resi.penerima_nama}</span><br>${dest ? dest.name : '-'}</div>
                </div>
                <div class="bg-blue-100 text-blue-800 p-2 rounded text-center font-bold text-sm">
                    Status Saat Ini: ${resi.status}
                </div>
            `;
        }
        resultDiv.classList.remove('hidden');
    },

    // 4. PICK UP RUNSHEET
    uiPickup: () => {
        return `
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="md:col-span-1 bg-gray-50 p-4 rounded border">
                    <h3 class="font-bold text-gray-700 mb-4">Form Request Pick Up</h3>
                    <form onsubmit="window.SalesUI.savePickup(event)">
                        <div class="space-y-3">
                            <div>
                                <label class="block text-xs font-medium text-gray-500">Nama Pelanggan/PT</label>
                                <input type="text" name="customer_name" required class="w-full border rounded p-2 text-sm">
                            </div>
                            <div>
                                <label class="block text-xs font-medium text-gray-500">Alamat Penjemputan</label>
                                <textarea name="address" required class="w-full border rounded p-2 text-sm" rows="2"></textarea>
                            </div>
                            <div>
                                <label class="block text-xs font-medium text-gray-500">Assign Kurir</label>
                                <select id="pickup-courier" name="courier_id" required class="w-full border rounded p-2 text-sm"></select>
                            </div>
                            <button type="submit" class="w-full bg-green-600 text-white font-bold py-2 rounded text-sm hover:bg-green-700">Buat Runsheet</button>
                        </div>
                    </form>
                </div>
                <div class="md:col-span-2">
                    <h3 class="font-bold text-gray-700 mb-4">Daftar Pick Up (Aktif)</h3>
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left border">
                            <thead class="bg-gray-100 text-gray-600">
                                <tr><th class="p-2">Tanggal</th><th class="p-2">Pelanggan</th><th class="p-2">Kurir</th><th class="p-2">Status</th></tr>
                            </thead>
                            <tbody id="pickup-list" class="bg-white">
                                </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    },

    savePickup: (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = { ...Object.fromEntries(formData.entries()), status: 'Requested', date: new Date().toLocaleDateString('id-ID') };
        DB.insert('pickups', data);
        e.target.reset();
        SalesModule.refreshPickupList();
    },

    refreshPickupList: () => {
        const pickups = DB.getAll('pickups');
        const tbody = document.getElementById('pickup-list');
        if (!tbody) return;
        
        if (pickups.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" class="p-4 text-center text-gray-400">Belum ada jadwal pick up.</td></tr>`;
            return;
        }

        let html = '';
        pickups.reverse().forEach(p => {
            const courier = DB.getById('couriers', p.courier_id);
            html += `<tr class="border-b"><td class="p-2">${p.date}</td><td class="p-2 font-bold">${p.customer_name}<br><span class="text-xs font-normal text-gray-500">${p.address}</span></td><td class="p-2">${courier ? courier.name : '-'}</td><td class="p-2"><span class="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-bold">${p.status}</span></td></tr>`;
        });
        tbody.innerHTML = html;
    },

    // ==========================================
    // UTILITIES (Dropdown Populators)
    // ==========================================
    populateDropdowns: () => {
        const coverages = DB.getAll('coverages');
        const services = DB.getAll('services');
        
        let covHTML = '<option value="">-- Pilih Wilayah --</option>';
        coverages.forEach(c => covHTML += `<option value="${c.id}">${c.name} (${c.type})</option>`);
        
        let srvHTML = '<option value="">-- Pilih Layanan --</option>';
        services.forEach(s => srvHTML += `<option value="${s.id}">${s.name} - Rp ${s.price.toLocaleString('id-ID')}/Kg</option>`);

        if(document.getElementById('select-origin')) document.getElementById('select-origin').innerHTML = covHTML;
        if(document.getElementById('select-destination')) document.getElementById('select-destination').innerHTML = covHTML;
        if(document.getElementById('select-service')) document.getElementById('select-service').innerHTML = srvHTML;
        
        if(document.getElementById('sim-origin')) document.getElementById('sim-origin').innerHTML = covHTML;
        if(document.getElementById('sim-dest')) document.getElementById('sim-dest').innerHTML = covHTML;
    },

    populateCouriers: () => {
        const couriers = DB.getAll('couriers');
        let html = '<option value="">-- Pilih Kurir --</option>';
        couriers.filter(c => c.status === 'Aktif').forEach(c => html += `<option value="${c.id}">${c.name}</option>`);
        if(document.getElementById('pickup-courier')) document.getElementById('pickup-courier').innerHTML = html;
        SalesModule.refreshPickupList();
    },

    init: () => {
        SalesModule.switchTab('entri');
    }
};

window.SalesUI = SalesModule;
export default SalesModule;
