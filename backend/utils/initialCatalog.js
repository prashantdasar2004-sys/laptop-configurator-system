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
    stockQuantity: 40,
    wattage: 5
  },
  {
    sku: 'RAM-DDR5-32GB-5600',
    name: '32GB DDR5 5600MHz High Performance Kit',
    category: 'RAM',
    brand: 'Corsair Vengeance',
    specifications: { Capacity: '32GB (2x16GB)', Speed: '5600 MHz', Type: 'DDR5 SODIMM', Latency: 'CL40' },
    baseCost: 95,
    sellingPrice: 145,
    stockQuantity: 25,
    wattage: 8
  },
  {
    sku: 'RAM-DDR5-64GB-5600',
    name: '64GB DDR5 5600MHz Extreme Workstation Kit',
    category: 'RAM',
    brand: 'G.Skill Ripjaws',
    specifications: { Capacity: '64GB (2x32GB)', Speed: '5600 MHz', Type: 'DDR5 SODIMM', Latency: 'CL40' },
    baseCost: 190,
    sellingPrice: 285,
    stockQuantity: 12,
    wattage: 12
  },

  // Storage
  {
    sku: 'SSD-NVME-1TB-GEN4',
    name: '1TB M.2 NVMe PCIe 4.0 SSD (up to 7000MB/s)',
    category: 'Storage',
    brand: 'Samsung 980 Pro',
    specifications: { Capacity: '1TB', Interface: 'PCIe 4.0 x4', ReadSpeed: '7000 MB/s', WriteSpeed: '5000 MB/s' },
    baseCost: 65,
    sellingPrice: 105,
    stockQuantity: 30,
    wattage: 6
  },
  {
    sku: 'SSD-NVME-2TB-GEN4',
    name: '2TB M.2 NVMe PCIe 4.0 SSD (up to 7300MB/s)',
    category: 'Storage',
    brand: 'Western Digital Black SN850X',
    specifications: { Capacity: '2TB', Interface: 'PCIe 4.0 x4', ReadSpeed: '7300 MB/s', WriteSpeed: '6600 MB/s' },
    baseCost: 120,
    sellingPrice: 185,
    stockQuantity: 18,
    wattage: 7
  },

  // Graphics Cards
  {
    sku: 'GPU-RTX-4060-8GB',
    name: 'NVIDIA GeForce RTX 4060 8GB GDDR6 Mobile',
    category: 'Graphics Card',
    brand: 'NVIDIA',
    specifications: { VRAM: '8GB GDDR6', TGP: '115W', RayTracing: 'Gen 3', DLSS: 'DLSS 3.5' },
    baseCost: 290,
    sellingPrice: 420,
    stockQuantity: 15,
    wattage: 115
  },
  {
    sku: 'GPU-RTX-4070-8GB',
    name: 'NVIDIA GeForce RTX 4070 8GB GDDR6 Mobile',
    category: 'Graphics Card',
    brand: 'NVIDIA',
    specifications: { VRAM: '8GB GDDR6', TGP: '140W', RayTracing: 'Gen 3', DLSS: 'DLSS 3.5' },
    baseCost: 420,
    sellingPrice: 590,
    stockQuantity: 10,
    wattage: 140
  },
  {
    sku: 'GPU-RTX-4080-12GB',
    name: 'NVIDIA GeForce RTX 4080 12GB GDDR6X Mobile',
    category: 'Graphics Card',
    brand: 'NVIDIA',
    specifications: { VRAM: '12GB GDDR6X', TGP: '175W', RayTracing: 'Gen 3', DLSS: 'DLSS 3.5' },
    baseCost: 750,
    sellingPrice: 1050,
    stockQuantity: 5,
    wattage: 175
  },

  // Displays
  {
    sku: 'DISP-15.6-FHD-144HZ',
    name: '15.6" Full HD (1920x1080) 144Hz IPS Anti-Glare',
    category: 'Display',
    brand: 'LG Display',
    specifications: { Size: '15.6 inch', Resolution: '1920x1080', RefreshRate: '144Hz', ColorGamut: '100% sRGB' },
    baseCost: 70,
    sellingPrice: 120,
    stockQuantity: 25,
    wattage: 10
  },
  {
    sku: 'DISP-16.0-QHD-240HZ',
    name: '16.0" QHD+ (2560x1600) 240Hz 500-nits HDR400',
    category: 'Display',
    brand: 'BOE',
    specifications: { Size: '16.0 inch', Resolution: '2560x1600', RefreshRate: '240Hz', Brightness: '500 nits' },
    baseCost: 140,
    sellingPrice: 220,
    stockQuantity: 14,
    wattage: 15
  },

  // Battery
  {
    sku: 'BAT-99WH-4CELL',
    name: '99.9Whr 4-Cell Smart Lithium-Polymer Battery',
    category: 'Battery',
    brand: 'OmniPower',
    specifications: { Capacity: '99.9 Whr', Cells: '4-Cell', FastCharge: '80% in 30 mins' },
    baseCost: 55,
    sellingPrice: 95,
    stockQuantity: 30,
    wattage: 0
  },

  // Keyboard
  {
    sku: 'KB-RGB-MECHANICAL',
    name: 'Per-Key RGB Mechanical Gaming Keyboard (Cherry MX)',
    category: 'Keyboard',
    brand: 'SteelSeries',
    specifications: { SwitchType: 'Low Profile Mechanical', Backlight: 'Per-Key RGB', NKeyRollover: 'Full Anti-Ghosting' },
    baseCost: 40,
    sellingPrice: 70,
    stockQuantity: 35,
    wattage: 3
  },

  // Operating System
  {
    sku: 'OS-WIN11-PRO',
    name: 'Microsoft Windows 11 Pro 64-bit License',
    category: 'Operating System',
    brand: 'Microsoft',
    specifications: { Edition: 'Windows 11 Pro', LicenseType: 'OEM Digital Key', BitVersion: '64-bit' },
    baseCost: 60,
    sellingPrice: 110,
    stockQuantity: 100,
    wattage: 0
  }
];

module.exports = { initialComponents };
