const Component = require('../models/Component');
const User = require('../models/User');
const Quotation = require('../models/Quotation');

const initialComponents = [
  // Processors
  {
    sku: 'CPU-INTEL-I7-13700H',
    name: 'Intel Core i7-13700H (14 Cores, up to 5.0 GHz)',
    category: 'Processor',
    brand: 'Intel',
    specifications: { Cores: '14 Cores (6P + 8E)', Clock: '5.0 GHz Turbo', Cache: '24MB Smart Cache', Power: '45W' },
    baseCost: 280,
    sellingPrice: 380,
    stockQuantity: 15,
    wattage: 45
  },
  {
    sku: 'CPU-INTEL-I9-13900HX',
    name: 'Intel Core i9-13900HX (24 Cores, up to 5.4 GHz)',
    category: 'Processor',
    brand: 'Intel',
    specifications: { Cores: '24 Cores (8P + 16E)', Clock: '5.4 GHz Turbo', Cache: '36MB Smart Cache', Power: '55W' },
    baseCost: 450,
    sellingPrice: 590,
    stockQuantity: 8,
    wattage: 55
  },
  {
    sku: 'CPU-AMD-R7-7840HS',
    name: 'AMD Ryzen 7 7840HS (8 Cores / 16 Threads)',
    category: 'Processor',
    brand: 'AMD',
    specifications: { Cores: '8 Cores / 16 Threads', Clock: '5.1 GHz Boost', Architecture: 'Zen 4', Power: '35W' },
    baseCost: 260,
    sellingPrice: 350,
    stockQuantity: 20,
    wattage: 35
  },
  {
    sku: 'CPU-AMD-R9-7945HX',
    name: 'AMD Ryzen 9 7945HX Extreme Gaming Edition',
    category: 'Processor',
    brand: 'AMD',
    specifications: { Cores: '16 Cores / 32 Threads', Clock: '5.4 GHz Boost', Architecture: 'Zen 4', Power: '55W' },
    baseCost: 480,
    sellingPrice: 620,
    stockQuantity: 6,
    wattage: 55
  },

  // RAM
  {
    sku: 'RAM-DDR5-16GB-4800',
    name: '16GB DDR5 4800MHz Dual-Channel SODIMM',
    category: 'RAM',
    brand: 'Crucial',
    specifications: { Capacity: '16GB (2x8GB)', Speed: '4800 MHz', Type: 'DDR5 SODIMM', Voltage: '1.1V' },
    baseCost: 45,
    sellingPrice: 75,
    stockQuantity: 30,
    wattage: 5
  },
  {
    sku: 'RAM-DDR5-32GB-5600',
    name: '32GB DDR5 5600MHz High-Speed Performance RAM',
    category: 'RAM',
    brand: 'Kingston Fury',
    specifications: { Capacity: '32GB (2x16GB)', Speed: '5600 MHz', Type: 'DDR5 SODIMM', CL: 'CL40' },
    baseCost: 95,
    sellingPrice: 145,
    stockQuantity: 25,
    wattage: 8
  },
  {
    sku: 'RAM-DDR5-64GB-5600',
    name: '64GB DDR5 5600MHz Studio Workstation RAM',
    category: 'RAM',
    brand: 'Corsair Vengeance',
    specifications: { Capacity: '64GB (2x32GB)', Speed: '5600 MHz', Type: 'DDR5 SODIMM', CL: 'CL40' },
    baseCost: 190,
    sellingPrice: 280,
    stockQuantity: 12,
    wattage: 10
  },

  // Storage
  {
    sku: 'SSD-NVME-1TB-GEN4',
    name: '1TB PCIe 4.0 NVMe M.2 SSD (7000 MB/s)',
    category: 'Storage',
    brand: 'Samsung 980 Pro',
    specifications: { Capacity: '1TB', FormFactor: 'M.2 2280', ReadSpeed: '7000 MB/s', WriteSpeed: '5000 MB/s' },
    baseCost: 65,
    sellingPrice: 105,
    stockQuantity: 40,
    wattage: 4
  },
  {
    sku: 'SSD-NVME-2TB-GEN4',
    name: '2TB PCIe 4.0 NVMe Ultra SSD (7450 MB/s)',
    category: 'Storage',
    brand: 'WD Black SN850X',
    specifications: { Capacity: '2TB', FormFactor: 'M.2 2280', ReadSpeed: '7450 MB/s', WriteSpeed: '6600 MB/s' },
    baseCost: 125,
    sellingPrice: 185,
    stockQuantity: 18,
    wattage: 5
  },
  {
    sku: 'SSD-NVME-4TB-GEN4',
    name: '4TB Enterprise PCIe NVMe High Capacity SSD',
    category: 'Storage',
    brand: 'Crucial T500',
    specifications: { Capacity: '4TB', FormFactor: 'M.2 2280', ReadSpeed: '7300 MB/s', WriteSpeed: '6800 MB/s' },
    baseCost: 260,
    sellingPrice: 380,
    stockQuantity: 8,
    wattage: 6
  },

  // Graphics Card
  {
    sku: 'GPU-RTX4060-8GB',
    name: 'NVIDIA GeForce RTX 4060 8GB GDDR6 (115W TGP)',
    category: 'Graphics Card',
    brand: 'NVIDIA',
    specifications: { VRAM: '8GB GDDR6', TGP: '115W', Architecture: 'Ada Lovelace', DLSS: 'DLSS 3.0' },
    baseCost: 240,
    sellingPrice: 340,
    stockQuantity: 15,
    wattage: 115
  },
  {
    sku: 'GPU-RTX4070-8GB',
    name: 'NVIDIA GeForce RTX 4070 8GB GDDR6 (140W TGP)',
    category: 'Graphics Card',
    brand: 'NVIDIA',
    specifications: { VRAM: '8GB GDDR6', TGP: '140W', Architecture: 'Ada Lovelace', DLSS: 'DLSS 3.5' },
    baseCost: 380,
    sellingPrice: 520,
    stockQuantity: 12,
    wattage: 140
  },
  {
    sku: 'GPU-RTX4090-16GB',
    name: 'NVIDIA GeForce RTX 4090 Laptop GPU 16GB GDDR6 (175W TGP)',
    category: 'Graphics Card',
    brand: 'NVIDIA',
    specifications: { VRAM: '16GB GDDR6', TGP: '175W', Architecture: 'Ada Lovelace', RayTracing: 'Full Path Tracing' },
    baseCost: 850,
    sellingPrice: 1150,
    stockQuantity: 5,
    wattage: 175
  },

  // Display
  {
    sku: 'DSP-15-FHD-144',
    name: '15.6" Full HD (1920x1080) 144Hz IPS Anti-Glare',
    category: 'Display',
    brand: 'LG Display',
    specifications: { Size: '15.6 inch', Resolution: '1920x1080', RefreshRate: '144Hz', ColorGamut: '100% sRGB', Brightness: '300 nits' },
    baseCost: 70,
    sellingPrice: 120,
    stockQuantity: 30,
    wattage: 8
  },
  {
    sku: 'DSP-16-QHD-240',
    name: '16.0" QHD+ (2560x1600) 240Hz 500 nits HDR Display',
    category: 'Display',
    brand: 'BOE',
    specifications: { Size: '16.0 inch', Resolution: '2560x1600', RefreshRate: '240Hz', ColorGamut: '100% DCI-P3', Brightness: '500 nits' },
    baseCost: 140,
    sellingPrice: 220,
    stockQuantity: 20,
    wattage: 12
  },
  {
    sku: 'DSP-16-OLED-4K',
    name: '16.0" 4K UHD+ (3840x2400) OLED 120Hz Touch Display',
    category: 'Display',
    brand: 'Samsung OLED',
    specifications: { Size: '16.0 inch', Resolution: '3840x2400', Panel: 'OLED', RefreshRate: '120Hz', Touch: 'Yes' },
    baseCost: 260,
    sellingPrice: 390,
    stockQuantity: 10,
    wattage: 15
  },

  // Battery
  {
    sku: 'BAT-70WH-STD',
    name: '70Wh 4-Cell Lithium-Polymer Battery',
    category: 'Battery',
    brand: 'Generic',
    specifications: { Capacity: '70Wh', Cells: '4-Cell', Chemistry: 'Li-Polymer', RapidCharge: '50% in 30 mins' },
    baseCost: 40,
    sellingPrice: 65,
    stockQuantity: 25,
    wattage: 0
  },
  {
    sku: 'BAT-99WH-PRO',
    name: '99.9Wh Flight-Approved High Capacity Battery',
    category: 'Battery',
    brand: 'Generic',
    specifications: { Capacity: '99.9Wh', Cells: '6-Cell', Chemistry: 'Li-Polymer', FlightLegal: 'Yes (Under 100Wh)' },
    baseCost: 75,
    sellingPrice: 115,
    stockQuantity: 18,
    wattage: 0
  },

  // Keyboard
  {
    sku: 'KBD-RGB-MEMBRANE',
    name: 'Single-Zone RGB Backlit Keyboard (US Layout)',
    category: 'Keyboard',
    brand: 'Generic',
    specifications: { Lighting: 'Single-Zone RGB', SwitchType: 'Membrane Dome', Layout: 'US English', Numpad: 'Yes' },
    baseCost: 25,
    sellingPrice: 45,
    stockQuantity: 30,
    wattage: 2
  },
  {
    sku: 'KBD-PERKEY-MECH',
    name: 'Per-Key RGB Cherry MX Low Profile Mechanical Keyboard',
    category: 'Keyboard',
    brand: 'Cherry MX',
    specifications: { Lighting: 'Per-Key RGB', SwitchType: 'Mechanical Low Profile', AntiGhosting: '100% N-Key Rollover' },
    baseCost: 65,
    sellingPrice: 105,
    stockQuantity: 15,
    wattage: 4
  },

  // Operating System
  {
    sku: 'OS-WIN11-HOME',
    name: 'Microsoft Windows 11 Home (64-bit Digital License)',
    category: 'Operating System',
    brand: 'Microsoft',
    specifications: { Edition: 'Windows 11 Home', License: 'OEM Perpetual', Language: 'Multilingual' },
    baseCost: 50,
    sellingPrice: 85,
    stockQuantity: 100,
    wattage: 0
  },
  {
    sku: 'OS-WIN11-PRO',
    name: 'Microsoft Windows 11 Pro with BitLocker & Remote Desktop',
    category: 'Operating System',
    brand: 'Microsoft',
    specifications: { Edition: 'Windows 11 Pro', Features: 'BitLocker, Hyper-V, Sandbox', License: 'OEM Business' },
    baseCost: 85,
    sellingPrice: 140,
    stockQuantity: 100,
    wattage: 0
  }
];

const seedDatabase = async () => {
  try {
    console.log('Seeding initial data into database...');

    // Seed Admin & Sales Exec users
    await User.deleteMany({});
    const mainUser = new User({
      name: 'Prashant Dasar',
      email: 'prashantdasar2004@gmail.com',
      password: 'Pachhi@123',
      role: 'pricing_manager'
    });
    const salesUser = new User({
      name: 'Sarah Connor',
      email: 'sales@retailer.com',
      password: 'password123',
      role: 'sales_exec'
    });
    await mainUser.save();
    await salesUser.save();

    // Seed Components
    await Component.deleteMany({});
    const createdComponents = [];
    for (const compData of initialComponents) {
      const comp = new Component({
        ...compData,
        priceHistory: [{
          sellingPrice: compData.sellingPrice,
          baseCost: compData.baseCost,
          updatedAt: new Date(),
          updatedBy: 'System Seed',
          reason: 'Initial Product Import'
        }]
      });
      const saved = await comp.save();
      createdComponents.push(saved);
    }

    // Seed sample quotation
    await Quotation.deleteMany({});
    const selectedComps = createdComponents.slice(0, 7);
    const snapshots = selectedComps.map(c => ({
      componentId: c._id,
      sku: c.sku,
      name: c.name,
      category: c.category,
      brand: c.brand,
      sellingPriceAtQuote: c.sellingPrice,
      baseCostAtQuote: c.baseCost,
      specifications: c.specifications
    }));

    const subtotalCost = snapshots.reduce((s, i) => s + i.baseCostAtQuote, 0);
    const subtotalSelling = snapshots.reduce((s, i) => s + i.sellingPriceAtQuote, 0);
    const discountAmount = subtotalSelling * 0.05; // 5% discount
    const discountedTotal = subtotalSelling - discountAmount;
    const taxAmount = discountedTotal * 0.10;
    const finalTotal = discountedTotal + taxAmount;

    const sampleQuote = new Quotation({
      quoteNumber: 'QUO-20260807-0001',
      configName: 'Apex Pro Gaming Laptop Setup',
      customerName: 'TechCorp Solutions',
      customerEmail: 'procurement@techcorp.io',
      customerPhone: '+1 (555) 234-5678',
      components: snapshots,
      pricingSummary: {
        componentsSubtotalCost: subtotalCost,
        componentsSubtotalSelling: subtotalSelling,
        discountPercentage: 5,
        discountAmount,
        taxPercentage: 10,
        taxAmount,
        finalTotal,
        marginAmount: discountedTotal - subtotalCost,
        marginPercentage: Math.round(((discountedTotal - subtotalCost) / subtotalCost) * 100)
      },
      status: 'Approved',
      createdByName: salesUser.name,
      notes: 'Customer requested express priority build and shipping.'
    });

    await sampleQuote.save();

    console.log('Database seeded successfully!');
    console.log(`- Created ${createdComponents.length} components`);
    console.log(`- Created Demo Users: sales@retailer.com / admin@retailer.com`);
    console.log(`- Created Sample Quotation QUO-20260807-0001`);

    return true;
  } catch (err) {
    console.error('Seeding error:', err);
    return false;
  }
};

module.exports = { seedDatabase };
