import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const dataDir = path.resolve(rootDir, 'data');
const dbFile = path.resolve(dataDir, 'connecta-db.json');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const KANO_ARTISANS = [
  {
    id: 'artisan_kano_solar_01',
    fullName: 'Engr. Rabiu Haruna',
    firstName: 'Rabiu',
    lastName: 'Haruna',
    email: 'rabiu.haruna@myconnecta.ng',
    phone: '+2348039876541',
    whatsapp: '+2348039876541',
    role: 'provider',
    activeRole: 'provider',
    accountStatus: 'active',
    country: 'Nigeria',
    city: 'Kano',
    currency: 'NGN',
    avatarUrl: '/images/services/nigerian_electrician_ibrahim.jpg',
    businessName: 'Haruna Clean Energy & Solar Hub',
    headline: 'Master Solar PV Engineer & LiFePO4 Inverter Specialist',
    trade: 'Solar & Inverter',
    category: 'Solar & Inverter',
    primaryCategory: 'cat_solar',
    bio: 'Over 11 years engineering solar backup and off-grid power solutions for homes and commercial facilities across Kano. Certified installer for Felicity, Growatt, and Deye hybrid inverters.',
    skills: ['Solar PV Array Sizing', 'LiFePO4 Lithium Batteries', 'Hybrid Inverters', 'Automatic Transfer Switches', 'Fault Isolation'],
    hourlyRateMinor: 1800000, // ₦18,000 / hr
    workshopAddress: '14 Bompai Road, Nassarawa GRA, Kano',
    neighborhood: 'Nassarawa (GRA / Bompai)',
    ninNumber: 'NIN-90823411234',
    experienceYears: 11,
    rating: 4.97,
    reviewCount: 88,
    completedJobs: 126,
    badges: ['NIN Verified', 'Trade Guild Master', 'Escrow Safeguarded'],
    createdAt: '2025-01-10T08:00:00.000Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'artisan_kano_solar_02',
    fullName: 'Malam Usman Bello',
    firstName: 'Usman',
    lastName: 'Bello',
    email: 'usman.bello@myconnecta.ng',
    phone: '+2348021112233',
    whatsapp: '+2348021112233',
    role: 'provider',
    activeRole: 'provider',
    accountStatus: 'active',
    country: 'Nigeria',
    city: 'Kano',
    currency: 'NGN',
    avatarUrl: '/images/services/solar_technician_wiring.jpg',
    businessName: 'Arewa Solar Power & Inverter Services',
    headline: 'Certified Inverter Technician & Battery Diagnostics Lead',
    trade: 'Solar & Inverter',
    category: 'Solar & Inverter',
    primaryCategory: 'cat_solar',
    bio: 'Specialist in deep-cycle tubular and lithium battery testing, inverter motherboard repair, and rooftop solar racking across Tarauni and Gyadi-Gyadi.',
    skills: ['Tubular Battery Testing', 'Hybrid Inverters', 'Solar Water Heaters', 'Charge Controllers', 'DC Breakers'],
    hourlyRateMinor: 1500000, // ₦15,000 / hr
    workshopAddress: 'Plot 8 Maiduguri Road, Near Gyadi-Gyadi Flyover, Tarauni, Kano',
    neighborhood: 'Tarauni (Gyadi-Gyadi / Maiduguri Rd)',
    ninNumber: 'NIN-77612093845',
    experienceYears: 8,
    rating: 4.92,
    reviewCount: 54,
    completedJobs: 79,
    badges: ['NIN Verified', '100% Escrow Safeguard'],
    createdAt: '2025-02-05T09:30:00.000Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'artisan_kano_gen_01',
    fullName: 'Malam Kabir Danladi',
    firstName: 'Kabir',
    lastName: 'Danladi',
    email: 'kabir.danladi@myconnecta.ng',
    phone: '+2348065554433',
    whatsapp: '+2348065554433',
    role: 'provider',
    activeRole: 'provider',
    accountStatus: 'active',
    country: 'Nigeria',
    city: 'Kano',
    currency: 'NGN',
    avatarUrl: '/images/services/generator_repair_kano.jpg',
    businessName: 'Danladi Precision Gen Mechanics & Rewinding',
    headline: 'Master Heavy Industrial & Diesel Generator Specialist',
    trade: 'Generator Repair',
    category: 'Generator Repair',
    primaryCategory: 'cat_generator',
    bio: '15 years specializing in Perkins, Mikano, Lister, and Cummins diesel power plants. Complete engine overhaul, fuel injector calibration, and alternator rotor/stator rewinding.',
    skills: ['Mikano Diesel Maintenance', 'Lister Engine Overhaul', 'Stator Coil Rewinding', 'Fuel Injection Pump', 'AVR Replacement'],
    hourlyRateMinor: 1200000, // ₦12,000 / hr
    workshopAddress: 'Shop 22, France Road, Sabon Gari / Fagge, Kano',
    neighborhood: 'Fagge (Sabon Gari / Fagge)',
    ninNumber: 'NIN-55421908321',
    experienceYears: 15,
    rating: 4.95,
    reviewCount: 110,
    completedJobs: 175,
    badges: ['NIN Verified', 'Trade Guild Master', 'Diesel Specialist'],
    createdAt: '2025-01-12T11:00:00.000Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'artisan_kano_gen_02',
    fullName: 'Sani Shehu',
    firstName: 'Sani',
    lastName: 'Shehu',
    email: 'sani.shehu@myconnecta.ng',
    phone: '+2348107778899',
    whatsapp: '+2348107778899',
    role: 'provider',
    activeRole: 'provider',
    accountStatus: 'active',
    country: 'Nigeria',
    city: 'Kano',
    currency: 'NGN',
    avatarUrl: '/images/services/generator_technician.jpg',
    businessName: 'Shehu Power Gen Tech',
    headline: 'Residential Generator Mechanic & Carburetor Specialist',
    trade: 'Generator Repair',
    category: 'Generator Repair',
    primaryCategory: 'cat_generator',
    bio: 'Fast-response residential generator mechanic covering Kano Municipal and Gwale. Tiger, Lutian, Sumec Firman, and Elepaq generator servicing, valve setting, and oil leaks.',
    skills: ['Tiger/Lutian Petrol Gens', 'Carburetor Cleaning', 'Valve Grinding', 'Oil Seal Replacement', 'Starter Motors'],
    hourlyRateMinor: 1000000, // ₦10,000 / hr
    workshopAddress: 'Near Kofar Na\'isa Roundabout, Kano Municipal',
    neighborhood: 'Kano Municipal (Kofar Na\'isa / Shahuchi)',
    ninNumber: 'NIN-33219087612',
    experienceYears: 9,
    rating: 4.88,
    reviewCount: 62,
    completedJobs: 95,
    badges: ['NIN Verified', 'Escrow Insured'],
    createdAt: '2025-02-14T10:00:00.000Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'artisan_kano_ac_01',
    fullName: 'Aisha Bello Suleiman',
    firstName: 'Aisha',
    lastName: 'Suleiman',
    email: 'aisha.suleiman@myconnecta.ng',
    phone: '+2348098761234',
    whatsapp: '+2348098761234',
    role: 'provider',
    activeRole: 'provider',
    accountStatus: 'active',
    country: 'Nigeria',
    city: 'Kano',
    currency: 'NGN',
    avatarUrl: '/images/services/nigerian_specialist_salamah.jpg',
    businessName: 'Sahara ColdTech & HVAC Refrigeration',
    headline: 'Certified Inverter AC Technician & Refrigeration Lead',
    trade: 'AC & Cooling',
    category: 'AC & Cooling',
    primaryCategory: 'cat_ac',
    bio: 'Expert installation and servicing of inverter split air conditioners, industrial chillers, commercial walk-in cold storage, R32 / R410A refrigerant recovery, and copper coil leak soldering.',
    skills: ['Inverter Split ACs', 'R32 Gas Charging', 'Compressor Rebuilding', 'Central VRF Systems', 'Cold Room Maintenance'],
    hourlyRateMinor: 1400000, // ₦14,000 / hr
    workshopAddress: 'Bompai Industrial Area, Nassarawa, Kano',
    neighborhood: 'Nassarawa (GRA / Bompai)',
    ninNumber: 'NIN-11290384756',
    experienceYears: 8,
    rating: 4.94,
    reviewCount: 57,
    completedJobs: 82,
    badges: ['HVAC Association Certified', 'Identity Verified', '100% Escrow Backed'],
    createdAt: '2025-02-18T14:00:00.000Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'artisan_kano_ac_02',
    fullName: 'Mustapha Tukur',
    firstName: 'Mustapha',
    lastName: 'Tukur',
    email: 'mustapha.tukur@myconnecta.ng',
    phone: '+2348134445566',
    whatsapp: '+2348134445566',
    role: 'provider',
    activeRole: 'provider',
    accountStatus: 'active',
    country: 'Nigeria',
    city: 'Kano',
    currency: 'NGN',
    avatarUrl: '/images/services/ac_technician_kano.jpg',
    businessName: 'Tukur Air Conditioning Engineering',
    headline: 'Residential & Office AC Maintenance Specialist',
    trade: 'AC & Cooling',
    category: 'AC & Cooling',
    primaryCategory: 'cat_ac',
    bio: 'Dedicated AC maintenance technician specializing in split unit cleaning, capacitor replacement, PCB inverter boards, and pipe insulation across Gwale and BUK Old/New Campuses.',
    skills: ['Standing AC Units', 'Copper Pipe Flaring', 'Gas Leak Detection', 'Capacitor Replacement', 'PCB Control Board'],
    hourlyRateMinor: 1200000, // ₦12,000 / hr
    workshopAddress: 'Kabuga Housing Estate, BUK Road, Gwale, Kano',
    neighborhood: 'Gwale (Kabuga / BUK Rd)',
    ninNumber: 'NIN-88901234567',
    experienceYears: 7,
    rating: 4.90,
    reviewCount: 43,
    completedJobs: 67,
    badges: ['NIN Verified', 'Escrow Insured'],
    createdAt: '2025-03-02T13:00:00.000Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'artisan_kano_elec_01',
    fullName: 'Engr. Salisu Aliyu',
    firstName: 'Salisu',
    lastName: 'Aliyu',
    email: 'salisu.aliyu@myconnecta.ng',
    phone: '+2348053332211',
    whatsapp: '+2348053332211',
    role: 'provider',
    activeRole: 'provider',
    accountStatus: 'active',
    country: 'Nigeria',
    city: 'Kano',
    currency: 'NGN',
    avatarUrl: '/images/services/nigerian_electrician_ibrahim.jpg',
    businessName: 'Northern Spark Industrial Electrics',
    headline: 'Master Electrician & Distribution Board Engineer',
    trade: 'Electrical Wiring',
    category: 'Electrical Wiring',
    primaryCategory: 'cat_electrical',
    bio: 'Certified electrical contractor handling 3-phase industrial and domestic electrical installations, distribution boards, surge protection devices (SPD), earthing systems, and cable conduit wiring.',
    skills: ['Distribution Boards', 'Three-Phase Balancing', 'Earth Rod Testing', 'Conduit Pipe Installation', 'Short Circuit Tracing'],
    hourlyRateMinor: 1500000, // ₦15,000 / hr
    workshopAddress: 'Gwammaja Layout, Dala, Kano',
    neighborhood: 'Dala (Dawanau / Gwammaja)',
    ninNumber: 'NIN-44567890123',
    experienceYears: 13,
    rating: 4.96,
    reviewCount: 76,
    completedJobs: 118,
    badges: ['COREN Endorsed', 'Identity Verified', 'Trade Guild Certified'],
    createdAt: '2025-01-25T08:00:00.000Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'artisan_kano_elec_02',
    fullName: 'Abubakar Garba',
    firstName: 'Abubakar',
    lastName: 'Garba',
    email: 'abubakar.garba@myconnecta.ng',
    phone: '+2348182223344',
    whatsapp: '+2348182223344',
    role: 'provider',
    activeRole: 'provider',
    accountStatus: 'active',
    country: 'Nigeria',
    city: 'Kano',
    currency: 'NGN',
    avatarUrl: '/images/services/electrician_kano.jpg',
    businessName: 'Garba Home Wiring & Lighting',
    headline: 'Certified Domestic Electrician & Lighting Installer',
    trade: 'Electrical Wiring',
    category: 'Electrical Wiring',
    primaryCategory: 'cat_electrical',
    bio: 'Prompt domestic electrician serving Tarauni and Nassarawa. Fault isolation, socket and breaker replacement, inverter line segregation, and smart switch installation.',
    skills: ['Prepaid Meter Bypass Rectification', 'LED Architectural Lighting', 'Socket Replacement', 'Inverter Line Separation', 'Earthing'],
    hourlyRateMinor: 1100000, // ₦11,000 / hr
    workshopAddress: 'Maiduguri Road, Tarauni, Kano',
    neighborhood: 'Tarauni (Gyadi-Gyadi / Maiduguri Rd)',
    ninNumber: 'NIN-66789012345',
    experienceYears: 6,
    rating: 4.89,
    reviewCount: 51,
    completedJobs: 74,
    badges: ['NIN Verified', 'Escrow Insured'],
    createdAt: '2025-02-11T12:00:00.000Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'artisan_kano_plumb_01',
    fullName: 'Engr. Mustapha Balarabe',
    firstName: 'Mustapha',
    lastName: 'Balarabe',
    email: 'mustapha.balarabe@myconnecta.ng',
    phone: '+2348029876543',
    whatsapp: '+2348029876543',
    role: 'provider',
    activeRole: 'provider',
    accountStatus: 'active',
    country: 'Nigeria',
    city: 'Kano',
    currency: 'NGN',
    avatarUrl: '/images/services/nigerian_plumber_jonah.jpg',
    businessName: 'Arewa Pipe & High-Pressure Borehole Engineering',
    headline: 'Certified Master Plumber & Submersible Borehole Expert',
    trade: 'Plumbing & Water',
    category: 'Plumbing & Water',
    primaryCategory: 'cat_plumbing',
    bio: 'Professional residential and commercial plumbing, borehole submersible pump installations, overhead tank scaffolding, automated water level float switches, and PPR hot-melt fusion.',
    skills: ['PPR & HDPE Fusion', 'Submersible Borehole Pumps', 'Overhead Tank Staging', 'Pressure Booster Pumps', 'Drainage Unclogging'],
    hourlyRateMinor: 1200000, // ₦12,000 / hr
    workshopAddress: 'Plot 4B Zoo Road Industrial Layout, Kano Municipal',
    neighborhood: 'Kano Municipal (Kofar Na\'isa / Shahuchi)',
    ninNumber: 'NIN-99012345678',
    experienceYears: 12,
    rating: 4.91,
    reviewCount: 68,
    completedJobs: 89,
    badges: ['NIN Verified', 'Master Trade Guild', 'Water Engineering Fellow'],
    createdAt: '2025-02-10T10:00:00.000Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'artisan_kano_plumb_02',
    fullName: 'Ibrahim Jibril',
    firstName: 'Ibrahim',
    lastName: 'Jibril',
    email: 'ibrahim.jibril@myconnecta.ng',
    phone: '+2348036667788',
    whatsapp: '+2348036667788',
    role: 'provider',
    activeRole: 'provider',
    accountStatus: 'active',
    country: 'Nigeria',
    city: 'Kano',
    currency: 'NGN',
    avatarUrl: '/images/services/plumber_kano.jpg',
    businessName: 'Jibril Sanitary & Water Systems',
    headline: 'Residential Water Supply & Drainage Technician',
    trade: 'Plumbing & Water',
    category: 'Plumbing & Water',
    primaryCategory: 'cat_plumbing',
    bio: 'Emergency leak repair, bathroom sanitaryware installation, soakaway drainage unclogging, and automatic float switch wiring for water tanks across Fagge, Sabon Gari, and Dala.',
    skills: ['Float Switch Automation', 'Bathroom Sanware Fitting', 'Pex Piping', 'Underground Pipe Burst Repair', 'Drainage Unclogging'],
    hourlyRateMinor: 1000000, // ₦10,000 / hr
    workshopAddress: 'Sabon Gari Market Road, Fagge, Kano',
    neighborhood: 'Fagge (Sabon Gari / Fagge)',
    ninNumber: 'NIN-22345678901',
    experienceYears: 7,
    rating: 4.87,
    reviewCount: 39,
    completedJobs: 58,
    badges: ['NIN Verified', 'Escrow Insured'],
    createdAt: '2025-03-05T09:00:00.000Z',
    updatedAt: new Date().toISOString()
  }
];

// Build initial database structure
let existingDb = {
  profiles: [],
  wallets: [],
  wallet_transactions: [],
  service_requests: [],
  bookings: [],
  whatsapp_sessions: [],
  squads: [],
  community_posts: [],
  disputes: [],
  email_dispatches: []
};

if (fs.existsSync(dbFile)) {
  try {
    const raw = fs.readFileSync(dbFile, 'utf8');
    const parsed = JSON.parse(raw);
    existingDb = { ...existingDb, ...parsed };
  } catch (e) {
    console.warn('Could not parse existing DB, using template:', e.message);
  }
}

// Ensure artisans are present in profiles
for (const artisan of KANO_ARTISANS) {
  const existingIdx = existingDb.profiles.findIndex(p => p.id === artisan.id || p.phone === artisan.phone);
  if (existingIdx >= 0) {
    existingDb.profiles[existingIdx] = { ...existingDb.profiles[existingIdx], ...artisan };
  } else {
    existingDb.profiles.push(artisan);
  }

  // Ensure wallet exists
  const walletIdx = existingDb.wallets.findIndex(w => w.userId === artisan.id);
  if (walletIdx < 0) {
    existingDb.wallets.push({
      id: `wal_${artisan.id}`,
      userId: artisan.id,
      balanceMinor: 25000000, // ₦250,000 available
      escrowBalanceMinor: 0,
      sparksBalance: 50,
      currency: 'NGN',
      updatedAt: new Date().toISOString()
    });
  }
}

// Ensure whatsapp_sessions array is initialized
if (!Array.isArray(existingDb.whatsapp_sessions)) {
  existingDb.whatsapp_sessions = [];
}

fs.writeFileSync(dbFile, JSON.stringify(existingDb, null, 2), 'utf8');
console.log(`Successfully generated and seeded ${KANO_ARTISANS.length} Kano artisans in ${dbFile}`);
