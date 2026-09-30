/**
 * Chhaya Distributors - Vaccine & Injection Catalog Data Store
 * Handles persistent storage (localStorage) and CRUD operations for vaccines,
 * injections, discount rules, and customer orders.
 */

const STORAGE_KEYS = {
    VACCINES: 'chhaya_vaccines_db_v2',
    ORDERS: 'chhaya_orders_db_v2'
};

// Built-in assets gallery for quick selection in Control Panel
const ASSET_GALLERY = [
    { name: 'Mounjaro (Tirzepatide)', path: 'assets/Mounjaro.jpg' },
    { name: 'Beyfortus (Nirsevimab)', path: 'assets/beyfortus.jpg' },
    { name: 'Gardasil 9 (HPV 9-valent)', path: 'assets/gardasil9.jpg' },
    { name: 'Shingrix (Herpes Zoster)', path: 'assets/shingrix.jpg' },
    { name: 'Prevenar 20 (Pneumococcal)', path: 'assets/prevenar20.jpg' },
    { name: 'Prevenar 13 (Pneumococcal)', path: 'assets/prevenar13.jpg' },
    { name: 'Influvac Tetra (Quadrivalent Flu)', path: 'assets/influvacTetra.jpg' },
    { name: 'Fluarix Tetra (Influenza)', path: 'assets/fluarixTetra.jpg' },
    { name: 'Vaxiflu 4 (Influenza)', path: 'assets/vaxiflu4.jpg' },
    { name: 'Boostrix (Tdap)', path: 'assets/boostrix.jpg' },
    { name: 'Adacel (Tdap)', path: 'assets/adacel.jpg' },
    { name: 'Cervavac (HPV Quadrivalent)', path: 'assets/cervavac.jpg' },
    { name: 'Anti-D 300mcg (Rho(D) Immune Globulin)', path: 'assets/antid.jpg' },
    { name: 'Berab (Rabies Vaccine)', path: 'assets/berab.jpg' },
    { name: 'Bett Plus (Tetanus & Diphtheria)', path: 'assets/bettPlus.jpg' },
    { name: 'Nexipox (Varicella / Chickenpox)', path: 'assets/nexipox.jpg' },
    { name: 'Biovac A (Hepatitis A)', path: 'assets/biovacA.jpg' },
    { name: 'Havsheild (Hepatitis A)', path: 'assets/havsheild.jpg' },
    { name: 'Jenvac (Japanese Encephalitis)', path: 'assets/jenvac.jpg' },
    { name: 'Menveo (Meningococcal ACWY)', path: 'assets/menveo.jpg' },
    { name: 'Pneumoguard 13', path: 'assets/pneumogaurd13.jpg' },
    { name: 'Pneurevax 14', path: 'assets/pneurevax14.jpg' },
    { name: 'Typhibev (Typhoid Conjugate)', path: 'assets/typhibev.jpg' },
    { name: 'Zyvac TCV (Typhoid)', path: 'assets/zyvacTCV.jpg' },
    { name: 'Zyvac MMR (Measles, Mumps, Rubella)', path: 'assets/zyvacMMR.jpg' },
    { name: 'Hucog 5000 HP (hCG Injection)', path: 'assets/hucog5000HP.jpg' },
    { name: 'Coe-FSH HP 75 IU', path: 'assets/coeFSHhp75.jpg' },
    { name: 'Coe-FSH HP 150 IU', path: 'assets/coeFSHhp150.jpg' },
    { name: 'Lonopin 40mg (Enoxaparin Sodium)', path: 'assets/lonopin40mg.jpg' },
    { name: 'Luprodex 3.75mg (Leuprolide Acetate)', path: 'assets/luprodex3.75mg.jpg' },
    { name: 'AlbuRel (Human Albumin 20%)', path: 'assets/albuRel.jpg' },
    { name: 'Repoitin 4000 IU (Erythropoietin)', path: 'assets/repoitin4000.jpg' },
    { name: 'Yurpeak Injection', path: 'assets/yurpeak.jpg' }
];

// Initial seed catalog
const DEFAULT_VACCINES = [
    {
        id: 'beyfortus',
        name: 'Beyfortus (Nirsevimab)',
        genericName: 'Nirsevimab-alip 50mg/100mg Injection',
        category: 'Pediatric & Infant',
        manufacturer: 'Sanofi / AstraZeneca',
        mrp: 34000,
        discountPercent: 10,
        discountPrice: 34200,
        inStock: true,
        stockCount: 15,
        coldChain: '2°C to 8°C (Refrigerate, Do Not Freeze)',
        dosageForm: 'Single-dose Pre-filled Syringe',
        image: 'assets/beyfortus.jpg',
        badge: 'Special Cold Chain',
        featured: true,
        description: 'Monoclonal antibody indicated for the prevention of Respiratory Syncytial Virus (RSV) lower respiratory tract disease in newborns and infants.',
        indications: 'RSV Protection in Neonates and High-Risk Infants'
    },
    {
        id: 'shingrix',
        name: 'Shingrix',
        genericName: 'Zoster Vaccine Recombinant, Adjuvanted',
        category: 'Adult Vaccines',
        manufacturer: 'GlaxoSmithKline (GSK)',
        mrp: 8900,
        discountPercent: 15,
        discountPrice: 8925,
        inStock: true,
        stockCount: 28,
        coldChain: '2°C to 8°C (Protect from light)',
        dosageForm: '2-dose series (0.5 mL IM)',
        image: 'assets/shingrix.jpg',
        badge: 'Top Seller',
        featured: true,
        description: 'Non-live recombinant subunit vaccine for the prevention of herpes zoster (shingles) and post-herpetic neuralgia in adults aged 50 years and older.',
        indications: 'Shingles & Post-Herpetic Neuralgia Prevention in Adults 50+'
    },
    {
        id: 'gardasil-9',
        name: 'Gardasil 9',
        genericName: 'Human Papillomavirus 9-valent Vaccine',
        category: 'Adult Vaccines',
        manufacturer: 'MSD (Merck Sharp & Dohme)',
        mrp: 9050,
        discountPercent: 17,
        discountPrice: 9000,
        inStock: true,
        stockCount: 35,
        coldChain: '2°C to 8°C (Guaranteed Cold Chain)',
        dosageForm: '0.5 mL Pre-filled Syringe',
        image: 'assets/gardasil9.jpg',
        badge: 'High Demand',
        featured: true,
        description: 'Protects against 9 HPV types (6, 11, 16, 18, 31, 33, 45, 52, 58) causing cervical, vulvar, vaginal, and anal cancers as well as genital warts.',
        indications: 'Cervical Cancer & HPV Protection (Males & Females 9-45 yrs)'
    },
    {
        id: 'mounjaro',
        name: 'Mounjaro (Tirzepatide)',
        genericName: 'Tirzepatide Solution for Injection',
        category: 'Critical & Hormones',
        manufacturer: 'Eli Lilly',
        mrp: 4000,
        discountPercent: 12,
        discountPrice: 3960,
        inStock: true,
        stockCount: 20,
        coldChain: '2°C to 8°C (Cold Chain Required)',
        dosageForm: 'Single-Dose Pre-filled Pen',
        image: 'assets/Mounjaro.jpg',
        badge: 'Latest Stock',
        featured: true,
        description: 'Dual GIP and GLP-1 receptor agonist for glycemic control and medical weight management under specialist supervision.',
        indications: 'Type 2 Diabetes & Weight Management'
    },
    {
        id: 'prevenar-20',
        name: 'Prevenar 20',
        genericName: '20-valent Pneumococcal Conjugate Vaccine',
        category: 'Adult Vaccines',
        manufacturer: 'Pfizer',
        mrp: 4700,
        discountPercent: 13,
        discountPrice: 4698,
        inStock: true,
        stockCount: 40,
        coldChain: '2°C to 8°C',
        dosageForm: '0.5 mL Suspension Pre-filled Syringe',
        image: 'assets/prevenar20.jpg',
        badge: 'Advanced Coverage',
        featured: true,
        description: 'Next-generation 20-valent pneumococcal conjugate vaccine providing broadest protection against invasive pneumococcal disease and pneumonia.',
        indications: 'Pneumonia & Invasive Pneumococcal Disease Prevention'
    },
    {
        id: 'prevenar-13',
        name: 'Prevenar 13',
        genericName: '13-valent Pneumococcal Conjugate Vaccine',
        category: 'Pediatric & Infant',
        manufacturer: 'Pfizer',
        mrp: 3800,
        discountPercent: 16,
        discountPrice: 3192,
        inStock: true,
        stockCount: 50,
        coldChain: '2°C to 8°C',
        dosageForm: '0.5 mL Pre-filled Syringe',
        image: 'assets/prevenar13.jpg',
        badge: 'Trusted Pediatric',
        featured: false,
        description: 'Protects infants, young children, and older adults against 13 serotypes of Streptococcus pneumoniae.',
        indications: 'Pediatric Pneumonia, Meningitis, Bacteremia'
    },
    {
        id: 'influvac-tetra',
        name: 'Influvac Tetra',
        genericName: 'Quadrivalent Inactivated Influenza Vaccine',
        category: 'Flu & Respiratory',
        manufacturer: 'Abbott Healthcare',
        mrp: 1250,
        discountPercent: 20,
        discountPrice: 1000,
        inStock: true,
        stockCount: 80,
        coldChain: '2°C to 8°C (Do Not Freeze)',
        dosageForm: '0.5 mL Pre-filled Syringe',
        image: 'assets/influvacTetra.jpg',
        badge: 'Season Special',
        featured: true,
        description: 'Annual quadrivalent influenza vaccine containing two Influenza A and two Influenza B strains recommended by WHO.',
        indications: 'Seasonal Influenza Prevention (6 months & above)'
    },
    {
        id: 'fluarix-tetra',
        name: 'Fluarix Tetra',
        genericName: 'Quadrivalent Influenza Vaccine (Split Virion)',
        category: 'Flu & Respiratory',
        manufacturer: 'GlaxoSmithKline (GSK)',
        mrp: 1300,
        discountPercent: 18,
        discountPrice: 1066,
        inStock: true,
        stockCount: 65,
        coldChain: '2°C to 8°C',
        dosageForm: '0.5 mL Pre-filled Syringe',
        image: 'assets/fluarixTetra.jpg',
        badge: 'WHO Recommended',
        featured: false,
        description: 'High-purity quadrivalent split virion inactivated seasonal flu vaccine for active immunization against influenza virus.',
        indications: 'Annual Seasonal Flu Protection'
    },
    {
        id: 'vaxiflu-4',
        name: 'Vaxiflu-4',
        genericName: 'Quadrivalent Inactivated Influenza Vaccine',
        category: 'Flu & Respiratory',
        manufacturer: 'Zydus Cadila',
        mrp: 1100,
        discountPercent: 15,
        discountPrice: 935,
        inStock: true,
        stockCount: 45,
        coldChain: '2°C to 8°C',
        dosageForm: '0.5 mL Pre-filled Syringe',
        image: 'assets/vaxiflu4.jpg',
        badge: 'Best Value',
        featured: false,
        description: 'Quadrivalent seasonal influenza vaccine formulated according to current WHO epidemiological guidelines.',
        indications: 'Flu Prophylaxis for Children and Adults'
    },
    {
        id: 'boostrix',
        name: 'Boostrix (Tdap)',
        genericName: 'Tetanus Toxoid, Reduced Diphtheria Toxoid, Acellular Pertussis',
        category: 'Adult Vaccines',
        manufacturer: 'GlaxoSmithKline (GSK)',
        mrp: 1280,
        discountPercent: 12,
        discountPrice: 1276,
        inStock: true,
        stockCount: 60,
        coldChain: '2°C to 8°C',
        dosageForm: '0.5 mL Pre-filled Syringe',
        image: 'assets/boostrix.jpg',
        badge: 'Pregnancy Safe',
        featured: true,
        description: 'Tdap booster vaccine for active booster immunization against tetanus, diphtheria, and pertussis (whooping cough), essential in pregnancy (27-36 weeks).',
        indications: 'Tdap Booster, Maternal Immunization, Whooping Cough Protection'
    },
    {
        id: 'adacel',
        name: 'Adacel (Tdap)',
        genericName: 'Tetanus, Diphtheria & Acellular Pertussis Vaccine',
        category: 'Adult Vaccines',
        manufacturer: 'Sanofi Pasteur',
        mrp: 1460,
        discountPercent: 12,
        discountPrice: 1280,
        inStock: true,
        stockCount: 55,
        coldChain: '2°C to 8°C',
        dosageForm: '0.5 mL Pre-filled Syringe',
        image: 'assets/adacel.jpg',
        badge: 'Certified Cold Chain',
        featured: false,
        description: 'Tdap booster vaccine for adolescents, adults, and expecting mothers to protect against tetanus, diphtheria, and whooping cough.',
        indications: 'Adult & Maternal Tdap Vaccination'
    },
    {
        id: 'cervavac',
        name: 'Cervavac',
        genericName: 'Quadrivalent Human Papillomavirus Vaccine (Types 6, 11, 16, 18)',
        category: 'Adult Vaccines',
        manufacturer: 'Serum Institute of India (SII)',
        mrp: 1445,
        discountPercent: 12,
        discountPrice: 1445,
        inStock: true,
        stockCount: 70,
        coldChain: '2°C to 8°C',
        dosageForm: '0.5 mL Vial',
        image: 'assets/cervavac.jpg',
        badge: 'Make In India',
        featured: true,
        description: 'Indigenously developed quadrivalent HPV vaccine for cervical cancer prevention, offering high efficacy at an accessible price.',
        indications: 'Cervical Cancer & Genital Warts Prevention for Girls & Women'
    },
    {
        id: 'antid-300',
        name: 'Anti-D 300 mcg',
        genericName: 'Anti-Rho(D) Immune Globulin (Human)',
        category: 'Critical & Hormones',
        manufacturer: 'Bharat Serums & Vaccines',
        mrp: 3850,
        discountPercent: 12,
        discountPrice: 3388,
        inStock: true,
        stockCount: 30,
        coldChain: '2°C to 8°C',
        dosageForm: '300 mcg (1500 IU) Pre-filled Syringe / Vial',
        image: 'assets/antid.jpg',
        badge: 'Emergency Supply',
        featured: true,
        description: 'Human anti-D immunoglobulin for prevention of Rh-isoimmunization in Rh-negative mothers during pregnancy and post-delivery.',
        indications: 'Rh Incompatibility & Hemolytic Disease of Newborn Prophylaxis'
    },
    {
        id: 'berab',
        name: 'Berab (Rabies Vaccine)',
        genericName: 'Purified Chick Embryo Cell Rabies Vaccine (PCECV)',
        category: 'Emergency & Rabies',
        manufacturer: 'Bharat Biotech',
        mrp: 350,
        discountPercent: 18,
        discountPrice: 285,
        inStock: true,
        stockCount: 120,
        coldChain: '2°C to 8°C',
        dosageForm: '1 Dose Vial with Diluent (2.5 IU/dose)',
        image: 'assets/berab.jpg',
        badge: '24hr Dispatch',
        featured: false,
        description: 'Purified chick embryo cell rabies vaccine for pre-exposure and post-exposure prophylaxis against rabies virus infection following animal bites.',
        indications: 'Rabies Post-Exposure & Pre-Exposure Prophylaxis'
    },
    {
        id: 'bett-plus',
        name: 'Bett Plus',
        genericName: 'Tetanus and Adult Diphtheria Vaccine (Td)',
        category: 'Emergency & Rabies',
        manufacturer: 'Biological E. Limited',
        mrp: 26,
        discountPercent: 19,
        discountPrice: 21,
        inStock: true,
        stockCount: 300,
        coldChain: '2°C to 8°C',
        dosageForm: '0.5 mL Ampoule / Vial',
        image: 'assets/bettPlus.jpg',
        badge: 'Essential',
        featured: false,
        description: 'Tetanus and adult Diphtheria (Td) toxoid vaccine for wound management and booster immunization.',
        indications: 'Tetanus & Diphtheria Wound Care & Routine Boosters'
    },
    {
        id: 'nexipox',
        name: 'Nexipox (Chickenpox)',
        genericName: 'Live Attenuated Varicella Vaccine (Oka Strain)',
        category: 'Pediatric & Infant',
        manufacturer: 'Biological E. / Biken',
        mrp: 2050,
        discountPercent: 15,
        discountPrice: 1742,
        inStock: true,
        stockCount: 25,
        coldChain: '2°C to 8°C (Protect from light)',
        dosageForm: '1 Dose Lyophilized Vial with Sterile Water',
        image: 'assets/nexipox.jpg',
        badge: 'High Efficacy',
        featured: false,
        description: 'Live attenuated varicella-zoster virus vaccine (Oka strain) for the active prevention of chickenpox in children and susceptible adults.',
        indications: 'Chickenpox (Varicella) Immunization'
    },
    {
        id: 'biovac-a',
        name: 'Biovac A',
        genericName: 'Live Attenuated Hepatitis A Vaccine (H2 Strain)',
        category: 'Travel & Specialty',
        manufacturer: 'Wockhardt',
        mrp: 1600,
        discountPercent: 15,
        discountPrice: 1360,
        inStock: true,
        stockCount: 35,
        coldChain: '2°C to 8°C',
        dosageForm: 'Single Dose Vial + Diluent',
        image: 'assets/biovacA.jpg',
        badge: 'Single Dose',
        featured: false,
        description: 'Single-dose live attenuated Hepatitis A vaccine providing long-term immunity against Hepatitis A virus infection.',
        indications: 'Hepatitis A Prevention in Children & Travelers'
    },
    {
        id: 'havsheild',
        name: 'Havsheild',
        genericName: 'Inactivated Hepatitis A Vaccine (Adsorbed)',
        category: 'Travel & Specialty',
        manufacturer: 'Cadila Healthcare',
        mrp: 1400,
        discountPercent: 14,
        discountPrice: 1204,
        inStock: true,
        stockCount: 30,
        coldChain: '2°C to 8°C',
        dosageForm: '0.5 mL / 1.0 mL Pre-filled Syringe',
        image: 'assets/havsheild.jpg',
        badge: 'Proven Safety',
        featured: false,
        description: 'Highly purified inactivated Hepatitis A vaccine for pediatric and adult protection against acute hepatitis A infection.',
        indications: 'Hepatitis A Immunization'
    },
    {
        id: 'jenvac',
        name: 'Jenvac',
        genericName: 'Inactivated Japanese Encephalitis Vaccine',
        category: 'Travel & Specialty',
        manufacturer: 'Bharat Biotech / ICMR',
        mrp: 1150,
        discountPercent: 13,
        discountPrice: 1000,
        inStock: true,
        stockCount: 20,
        coldChain: '2°C to 8°C',
        dosageForm: 'Single Dose 0.5 mL PFS / Vial',
        image: 'assets/jenvac.jpg',
        badge: 'ICMR Certified',
        featured: false,
        description: 'First indigenously manufactured Vero cell-derived inactivated Japanese Encephalitis vaccine offering broad neutralizing antibodies.',
        indications: 'Japanese Encephalitis Prophylaxis for Endemic Regions & Travelers'
    },
    {
        id: 'menveo',
        name: 'Menveo (Meningococcal)',
        genericName: 'Meningococcal (Groups A, C, Y, and W-135) Oligosaccharide CRM197',
        category: 'Travel & Specialty',
        manufacturer: 'GlaxoSmithKline (GSK)',
        mrp: 4900,
        discountPercent: 12,
        discountPrice: 4312,
        inStock: true,
        stockCount: 18,
        coldChain: '2°C to 8°C',
        dosageForm: '2-vial kit (Lyophilized MenA + Liquid MenCWY)',
        image: 'assets/menveo.jpg',
        badge: 'Hajj / Travel Essential',
        featured: false,
        description: 'Quadrivalent meningococcal conjugate vaccine mandatory for Hajj/Umrah pilgrims and travelers to high-risk meningococcal regions.',
        indications: 'Meningococcal Disease ACWY Prevention (Pilgrims & Students Abroad)'
    },
    {
        id: 'typhibev',
        name: 'Typhibev (TCV)',
        genericName: 'Typhoid Vi Polysaccharide Conjugate Vaccine (TCV)',
        category: 'Pediatric & Infant',
        manufacturer: 'Biological E. Limited',
        mrp: 1950,
        discountPercent: 15,
        discountPrice: 1657,
        inStock: true,
        stockCount: 45,
        coldChain: '2°C to 8°C',
        dosageForm: '0.5 mL Pre-filled Syringe / Vial',
        image: 'assets/typhibev.jpg',
        badge: 'Long-lasting',
        featured: false,
        description: 'Conjugate typhoid vaccine eliciting robust T-dependent immune response, suitable for infants from 6 months of age onwards.',
        indications: 'Typhoid Fever Prevention for Children & Adults'
    },
    {
        id: 'zyvac-mmr',
        name: 'Zyvac MMR',
        genericName: 'Measles, Mumps and Rubella Vaccine (Live Attenuated)',
        category: 'Pediatric & Infant',
        manufacturer: 'Zydus Lifesciences',
        mrp: 650,
        discountPercent: 15,
        discountPrice: 552,
        inStock: true,
        stockCount: 40,
        coldChain: '2°C to 8°C (Protect from light)',
        dosageForm: '1 Dose Vial with Sterile Diluent',
        image: 'assets/zyvacMMR.jpg',
        badge: 'Core Pediatric',
        featured: false,
        description: 'Live freeze-dried vaccine against Measles, Mumps, and Rubella viruses as per national immunization guidelines.',
        indications: 'MMR Childhood & Adolescent Immunization'
    },
    {
        id: 'hucog-5000-hp',
        name: 'Hucog 5000 HP',
        genericName: 'Highly Purified Human Chorionic Gonadotropin (hCG) 5000 IU',
        category: 'Fertility & Injections',
        manufacturer: 'Bharat Serums & Vaccines',
        mrp: 280,
        discountPercent: 21,
        discountPrice: 220,
        inStock: true,
        stockCount: 60,
        coldChain: '2°C to 8°C',
        dosageForm: 'Lyophilized Vial with Sodium Chloride Solvent',
        image: 'assets/hucog5000HP.jpg',
        badge: 'Fertility Special',
        featured: true,
        description: 'Highly purified human chorionic gonadotrophin (hCG) for ovulation induction, luteal phase support in assisted reproduction, and hypogonadism.',
        indications: 'Infertility Treatment, Ovulation Induction & Luteal Support'
    },
    {
        id: 'coe-fsh-hp-150',
        name: 'Coe-FSH HP 150 IU',
        genericName: 'Highly Purified Urofollitropin (FSH) 150 IU',
        category: 'Fertility & Injections',
        manufacturer: 'Bharat Serums & Vaccines',
        mrp: 1450,
        discountPercent: 15,
        discountPrice: 1232,
        inStock: true,
        stockCount: 25,
        coldChain: '2°C to 8°C',
        dosageForm: '1 Vial Lyophilized Powder + Diluent',
        image: 'assets/coeFSHhp150.jpg',
        badge: 'ART Grade',
        featured: false,
        description: 'Highly purified human follicle-stimulating hormone (FSH) indicated for controlled ovarian stimulation in IVF and assisted reproductive technologies.',
        indications: 'Assisted Reproductive Technology (ART) & Ovulation Stimulation'
    },
    {
        id: 'coe-fsh-hp-75',
        name: 'Coe-FSH HP 75 IU',
        genericName: 'Highly Purified Urofollitropin (FSH) 75 IU',
        category: 'Fertility & Injections',
        manufacturer: 'Bharat Serums & Vaccines',
        mrp: 850,
        discountPercent: 15,
        discountPrice: 722,
        inStock: true,
        stockCount: 30,
        coldChain: '2°C to 8°C',
        dosageForm: '1 Vial Lyophilized Powder + Diluent',
        image: 'assets/coeFSHhp75.jpg',
        badge: 'ART Grade',
        featured: false,
        description: 'Purified urinary follicle-stimulating hormone (FSH) for ovarian follicular development in anovulatory and infertile patients.',
        indications: 'Follicular Stimulation in Fertility Protocols'
    },
    {
        id: 'lonopin-40mg',
        name: 'Lonopin 40mg',
        genericName: 'Enoxaparin Sodium Injection IP 40mg / 0.4 mL',
        category: 'Critical & Hormones',
        manufacturer: 'Bharat Serums & Vaccines',
        mrp: 520,
        discountPercent: 15,
        discountPrice: 442,
        inStock: true,
        stockCount: 50,
        coldChain: 'Store below 25°C (Do Not Freeze)',
        dosageForm: '0.4 mL Pre-filled Syringe with Safety Device',
        image: 'assets/lonopin40mg.jpg',
        badge: 'Fast Dispatch',
        featured: false,
        description: 'Low molecular weight heparin (LMWH) indicated for prophylaxis and treatment of deep vein thrombosis (DVT), pulmonary embolism, and acute coronary syndrome.',
        indications: 'DVT Prophylaxis, Anticoagulation in High-Risk Pregnancy & Surgery'
    },
    {
        id: 'luprodex-375',
        name: 'Luprodex 3.75 mg',
        genericName: 'Leuprolide Acetate for Depot Suspension 3.75 mg',
        category: 'Fertility & Injections',
        manufacturer: 'Bharat Serums & Vaccines',
        mrp: 4100,
        discountPercent: 14,
        discountPrice: 3526,
        inStock: true,
        stockCount: 15,
        coldChain: 'Store below 25°C (Protect from light)',
        dosageForm: 'Depot Vial with Prefilled Syringe Diluent',
        image: 'assets/luprodex3.75mg.jpg',
        badge: 'Specialty Care',
        featured: false,
        description: 'GnRH agonist depot suspension for management of endometriosis, uterine fibroids, prostate cancer, and precocious puberty.',
        indications: 'Endometriosis, Uterine Fibroids, IVF Downregulation'
    },
    {
        id: 'alburel-20',
        name: 'AlbuRel 20%',
        genericName: 'Human Albumin Solution 20% (100 mL)',
        category: 'Critical & Hormones',
        manufacturer: 'Reliance Life Sciences',
        mrp: 4800,
        discountPercent: 12,
        discountPrice: 4224,
        inStock: true,
        stockCount: 12,
        coldChain: '2°C to 25°C (Do Not Freeze)',
        dosageForm: '100 mL Glass Bottle IV Infusion',
        image: 'assets/albuRel.jpg',
        badge: 'Critical Care',
        featured: true,
        description: 'Sterile, non-pyrogenic solution of human albumin 20% for restoration and maintenance of circulating blood volume in shock, burns, and hypoproteinemia.',
        indications: 'Hypovolemia, Severe Hypoalbuminemia, Liver Cirrhosis / Ascites'
    },
    {
        id: 'repoitin-4000',
        name: 'Repoitin 4000 IU',
        genericName: 'Recombinant Human Erythropoietin (rHuEPO) 4000 IU',
        category: 'Critical & Hormones',
        manufacturer: 'Serum Institute of India (SII)',
        mrp: 1100,
        discountPercent: 15,
        discountPrice: 935,
        inStock: true,
        stockCount: 30,
        coldChain: '2°C to 8°C (Do Not Freeze)',
        dosageForm: 'Pre-filled Syringe / Vial',
        image: 'assets/repoitin4000.jpg',
        badge: 'Dialysis & Renal',
        featured: false,
        description: 'Recombinant human erythropoietin for treatment of anemia associated with chronic kidney disease (CKD) and chemotherapy.',
        indications: 'Renal Anemia, Chemotherapy-Induced Anemia'
    },
    {
        id: 'yurpeak',
        name: 'Yurpeak Injection',
        genericName: 'Pegfilgrastim Injection 6mg / 0.6 mL',
        category: 'Critical & Hormones',
        manufacturer: 'Biocon Biologics',
        mrp: 12800,
        discountPercent: 14,
        discountPrice: 11008,
        inStock: true,
        stockCount: 8,
        coldChain: '2°C to 8°C',
        dosageForm: 'Single Dose Pre-filled Syringe',
        image: 'assets/yurpeak.jpg',
        badge: 'Oncology Care',
        featured: false,
        description: 'Long-acting granulocyte colony-stimulating factor (G-CSF) to decrease incidence of infection/febrile neutropenia in chemotherapy patients.',
        indications: 'Febrile Neutropenia Prevention in Chemotherapy'
    }
];

// Data Store Class
class VaccineDataStore {
    constructor() {
        this.init();
    }

    init() {
        const stored = localStorage.getItem(STORAGE_KEYS.VACCINES);
        if (!stored) {
            this.setVaccines(DEFAULT_VACCINES);
        }
    }

    getAllVaccines() {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.VACCINES);
            return data ? JSON.parse(data) : DEFAULT_VACCINES;
        } catch (e) {
            console.error('Error reading vaccines from storage:', e);
            return DEFAULT_VACCINES;
        }
    }

    setVaccines(vaccines) {
        try {
            localStorage.setItem(STORAGE_KEYS.VACCINES, JSON.stringify(vaccines));
            return true;
        } catch (e) {
            console.error('Error writing vaccines to storage:', e);
            return false;
        }
    }

    getVaccineById(id) {
        const list = this.getAllVaccines();
        return list.find(item => item.id === id) || null;
    }

    addVaccine(vaccineData) {
        const list = this.getAllVaccines();
        const id = vaccineData.id || this.generateSlug(vaccineData.name);
        
        // Check duplicate id
        const existingIdx = list.findIndex(v => v.id === id);
        const newItem = {
            ...vaccineData,
            id: existingIdx >= 0 ? `${id}-${Date.now()}` : id,
            createdAt: new Date().toISOString()
        };
        
        list.unshift(newItem);
        this.setVaccines(list);
        return newItem;
    }

    updateVaccine(id, updatedFields) {
        const list = this.getAllVaccines();
        const index = list.findIndex(v => v.id === id);
        if (index === -1) return null;

        list[index] = {
            ...list[index],
            ...updatedFields,
            updatedAt: new Date().toISOString()
        };
        this.setVaccines(list);
        return list[index];
    }

    deleteVaccine(id) {
        const list = this.getAllVaccines();
        const filtered = list.filter(v => v.id !== id);
        this.setVaccines(filtered);
        return filtered.length !== list.length;
    }

    resetToDefaults() {
        this.setVaccines(DEFAULT_VACCINES);
        return DEFAULT_VACCINES;
    }

    // Orders Management
    getAllOrders() {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    }

    saveOrder(order) {
        const orders = this.getAllOrders();
        const newOrder = {
            id: 'ORD-' + Date.now().toString(36).toUpperCase(),
            timestamp: new Date().toISOString(),
            status: 'Pending',
            ...order
        };
        orders.unshift(newOrder);
        try {
            localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
        } catch (e) {
            console.error('Failed to save order to localStorage', e);
        }
        return newOrder;
    }

    updateOrderStatus(orderId, status) {
        const orders = this.getAllOrders();
        const order = orders.find(o => o.id === orderId);
        if (order) {
            order.status = status;
            localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
            return true;
        }
        return false;
    }

    deleteOrder(orderId) {
        const orders = this.getAllOrders();
        const filtered = orders.filter(o => o.id !== orderId);
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(filtered));
        return true;
    }

    // Import / Export JSON
    exportCatalogJSON() {
        return JSON.stringify({
            exportedAt: new Date().toISOString(),
            version: '1.0',
            catalog: this.getAllVaccines(),
            orders: this.getAllOrders()
        }, null, 2);
    }

    importCatalogJSON(jsonString) {
        try {
            const parsed = JSON.parse(jsonString);
            if (parsed.catalog && Array.isArray(parsed.catalog)) {
                this.setVaccines(parsed.catalog);
                if (parsed.orders && Array.isArray(parsed.orders)) {
                    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(parsed.orders));
                }
                return { success: true, count: parsed.catalog.length };
            } else if (Array.isArray(parsed)) {
                this.setVaccines(parsed);
                return { success: true, count: parsed.length };
            }
            return { success: false, error: 'Invalid JSON format. Expected catalog array.' };
        } catch (e) {
            return { success: false, error: e.message };
        }
    }

    generateSlug(text) {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-');
    }
}

// Instantiate global store
window.VaccineStore = new VaccineDataStore();
window.ASSET_GALLERY = ASSET_GALLERY;
