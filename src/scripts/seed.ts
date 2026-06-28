import bcrypt from 'bcrypt';
import db from '../config/database';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const daysAgo = (n: number, h = 10, m = 0) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(h, m, 0, 0);
  return d;
};

const daysFromNow = (n: number, h = 10, m = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  d.setHours(h, m, 0, 0);
  return d;
};

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function seed() {
  console.log('🌱 Starting seed...\n');

  // ── Truncate in reverse dependency order (including users) ──────────────
  console.log('🗑  Clearing existing data...');
  await db('appointments').del();
  await db('servicePrices').del();
  await db('services').del();
  await db('usedInventory').del();
  await db('inventory').del();
  await db('subcategories').del();
  await db('categories').del();
  await db('employees').del();
  await db('workstations').del();
  await db('barbershops').del();
  await db('users').del();

  // ── Create users ──────────────────────────────────────────────────────────
  console.log('\n👤 Seeding users...');
  const hashedPassword = await bcrypt.hash('password123', 10);
  const [user1, user2] = await db('users')
    .insert([
      { email: 'admin@barber.com',  password: hashedPassword },
      { email: 'admin@barber2.com', password: hashedPassword },
    ])
    .returning('*');
  console.log(`  ✓ ${user1.email}`);
  console.log(`  ✓ ${user2.email}`);

  // ── 1. Barbershops ────────────────────────────────────────────────────────
  console.log('\n💈 Seeding barbershops...');
  const [shop1, shop2, shop3] = await db('barbershops')
    .insert([
      // User 1
      { name: 'Barber King Warszawa',      address: 'ul. Marszałkowska 100, 00-026 Warszawa', phoneNumber: '+48221234567', ownerId: user1.id },
      { name: 'The Classic Barber Kraków', address: 'ul. Floriańska 25, 31-019 Kraków',       phoneNumber: '+48127654321', ownerId: user1.id },
      // User 2
      { name: 'Prestige Barber Łódź',      address: 'ul. Piotrkowska 88, 90-001 Łódź',        phoneNumber: '+48427890123', ownerId: user2.id },
    ])
    .returning('*');

  [shop1, shop2, shop3].forEach((s) => console.log(`  ✓ ${s.name}`));

  // ── 2. Categories ─────────────────────────────────────────────────────────
  console.log('\n📁 Seeding categories...');
  const categoryRows = await db('categories')
    .insert([
      // User 1 – shop1
      { name: 'Narzędzia',             photo: null, barbershopId: shop1.id, ownerId: user1.id },
      { name: 'Nożyczki',              photo: null, barbershopId: shop1.id, ownerId: user1.id },
      { name: 'Maszynki i trymmery',   photo: null, barbershopId: shop1.id, ownerId: user1.id },
      { name: 'Grzebienie i szczotki', photo: null, barbershopId: shop1.id, ownerId: user1.id },
      // User 1 – shop2
      { name: 'Produkty',              photo: null, barbershopId: shop2.id, ownerId: user1.id },
      { name: 'Szampony i odżywki',    photo: null, barbershopId: shop2.id, ownerId: user1.id },
      { name: 'Pomady i wosk',         photo: null, barbershopId: shop2.id, ownerId: user1.id },
      { name: 'Farby i dekoloryzatory',photo: null, barbershopId: shop2.id, ownerId: user1.id },
      { name: 'Akcesoria',             photo: null, barbershopId: shop1.id, ownerId: user1.id },
      { name: 'Ręczniki i peleryny',   photo: null, barbershopId: shop1.id, ownerId: user1.id },
      // User 2 – shop3
      { name: 'Sprzęt',                photo: null, barbershopId: shop3.id, ownerId: user2.id },
      { name: 'Maszynki',              photo: null, barbershopId: shop3.id, ownerId: user2.id },
      { name: 'Kosmetyki',             photo: null, barbershopId: shop3.id, ownerId: user2.id },
      { name: 'Stylizacja',            photo: null, barbershopId: shop3.id, ownerId: user2.id },
    ])
    .returning('*');

  const cat = Object.fromEntries(categoryRows.map((c: any) => [c.name, c]));
  console.log(`  ✓ ${categoryRows.length} kategorii`);

  // ── 3. Subcategories ──────────────────────────────────────────────────────
  console.log('\n🔗 Seeding subcategories...');
  await db('subcategories').insert([
    // User 1
    { categoryId: cat['Narzędzia'].id,  subcategoryId: cat['Nożyczki'].id },
    { categoryId: cat['Narzędzia'].id,  subcategoryId: cat['Maszynki i trymmery'].id },
    { categoryId: cat['Narzędzia'].id,  subcategoryId: cat['Grzebienie i szczotki'].id },
    { categoryId: cat['Produkty'].id,   subcategoryId: cat['Szampony i odżywki'].id },
    { categoryId: cat['Produkty'].id,   subcategoryId: cat['Pomady i wosk'].id },
    { categoryId: cat['Produkty'].id,   subcategoryId: cat['Farby i dekoloryzatory'].id },
    { categoryId: cat['Akcesoria'].id,  subcategoryId: cat['Ręczniki i peleryny'].id },
    // User 2
    { categoryId: cat['Sprzęt'].id,     subcategoryId: cat['Maszynki'].id },
    { categoryId: cat['Kosmetyki'].id,  subcategoryId: cat['Stylizacja'].id },
  ]);
  console.log('  ✓ 9 powiązań');

  // ── 4. Inventory ──────────────────────────────────────────────────────────
  console.log('\n📦 Seeding inventory...');
  await db('inventory').insert([
    // User 1 – shop1
    { name: 'Nożyczki Kiepe 6.5"',             description: 'Profesjonalne nożyczki fryzjerskie ze stali nierdzewnej', price: 189.00, photo: null, count: 5,  categoryId: cat['Nożyczki'].id,             barbershopId: shop1.id, ownerId: user1.id },
    { name: 'Nożyczki degażówki Jaguar 5.5"',  description: 'Nożyczki do teksturyzowania i degażowania',               price: 249.00, photo: null, count: 3,  categoryId: cat['Nożyczki'].id,             barbershopId: shop1.id, ownerId: user1.id },
    { name: 'Maszynka Wahl Magic Clip Cordless',description: 'Bezprzewodowa maszynka do strzyżenia z silnikiem V9000', price: 620.00, photo: null, count: 4,  categoryId: cat['Maszynki i trymmery'].id,  barbershopId: shop1.id, ownerId: user1.id },
    { name: 'Trymer Andis T-Outliner',          description: 'Precyzyjny trymer do konturowania i wykańczania',         price: 350.00, photo: null, count: 6,  categoryId: cat['Maszynki i trymmery'].id,  barbershopId: shop1.id, ownerId: user1.id },
    { name: 'Grzebień karbonowy Kent 8"',       description: 'Antystatyczny grzebień do rozczesywania',                price: 35.00,  photo: null, count: 20, categoryId: cat['Grzebienie i szczotki'].id, barbershopId: shop1.id, ownerId: user1.id },
    { name: 'Szczotka Denman D3 7-rzędowa',     description: 'Klasyczna szczotka fryzjerska do stylizacji',            price: 65.00,  photo: null, count: 10, categoryId: cat['Grzebienie i szczotki'].id, barbershopId: shop1.id, ownerId: user1.id },
    // User 1 – shop2
    { name: 'Szampon American Crew Daily 1000ml',description: 'Szampon do codziennego użytku dla mężczyzn',            price: 79.00,  photo: null, count: 15, categoryId: cat['Szampony i odżywki'].id,   barbershopId: shop2.id, ownerId: user1.id },
    { name: 'Odżywka Redken For Men 300ml',     description: 'Odżywka wzmacniająca do włosów krótkich',                price: 54.00,  photo: null, count: 12, categoryId: cat['Szampony i odżywki'].id,   barbershopId: shop2.id, ownerId: user1.id },
    { name: 'Pomada Layrite Original 297g',     description: 'Mocna pomada na bazie wody z połyskiem',                 price: 89.00,  photo: null, count: 18, categoryId: cat['Pomady i wosk'].id,        barbershopId: shop2.id, ownerId: user1.id },
    { name: 'Wosk Suavecito Firme Hold 113g',   description: 'Mocno trzymający wosk do włosów',                        price: 75.00,  photo: null, count: 22, categoryId: cat['Pomady i wosk'].id,        barbershopId: shop2.id, ownerId: user1.id },
    { name: 'Farba Wella Koleston Perfect 60ml', description: 'Farba trwała do włosów z technologią ME+',             price: 28.00,  photo: null, count: 50, categoryId: cat['Farby i dekoloryzatory'].id, barbershopId: shop2.id, ownerId: user1.id },
    { name: 'Utleniacz Wella 9% 1000ml',        description: 'Woda utleniona do mieszania z farbami',                 price: 42.00,  photo: null, count: 8,  categoryId: cat['Farby i dekoloryzatory'].id, barbershopId: shop2.id, ownerId: user1.id },
    { name: 'Peleryna fryzjerska nylonowa',     description: 'Wodoodporna peleryna dla klienta, czarna',               price: 25.00,  photo: null, count: 30, categoryId: cat['Ręczniki i peleryny'].id,  barbershopId: shop1.id, ownerId: user1.id },
    { name: 'Ręcznik fryzjerski 50x90cm',       description: 'Bawełniany ręcznik fryzjerski, szary',                  price: 18.00,  photo: null, count: 40, categoryId: cat['Ręczniki i peleryny'].id,  barbershopId: shop1.id, ownerId: user1.id },
    // User 2 – shop3
    { name: 'Maszynka Babyliss FX870',          description: 'Profesjonalna maszynka bezprzewodowa z silnikiem 45W',   price: 580.00, photo: null, count: 3,  categoryId: cat['Maszynki'].id,             barbershopId: shop3.id, ownerId: user2.id },
    { name: 'Maszynka Gamma+ Absolute Hitter',  description: 'Lekka maszynka bezprzewodowa do fadingu',               price: 450.00, photo: null, count: 2,  categoryId: cat['Maszynki'].id,             barbershopId: shop3.id, ownerId: user2.id },
    { name: 'Żel do stylizacji Got2b 150ml',    description: 'Mocno trzymający żel do włosów dla mężczyzn',           price: 22.00,  photo: null, count: 25, categoryId: cat['Stylizacja'].id,           barbershopId: shop3.id, ownerId: user2.id },
    { name: 'Krem do stylizacji Baxter 60ml',   description: 'Lekki krem modelujący z matowym wykończeniem',          price: 68.00,  photo: null, count: 14, categoryId: cat['Stylizacja'].id,           barbershopId: shop3.id, ownerId: user2.id },
    { name: 'Spray do golenia Taylor of Bond',  description: 'Nawilżający spray przed goleniem',                       price: 95.00,  photo: null, count: 9,  categoryId: cat['Kosmetyki'].id,            barbershopId: shop3.id, ownerId: user2.id },
    { name: 'Balsam po goleniu Proraso 100ml',  description: 'Kojący balsam z eukaliptusem i mentolem',               price: 38.00,  photo: null, count: 20, categoryId: cat['Kosmetyki'].id,            barbershopId: shop3.id, ownerId: user2.id },
  ]);
  console.log('  ✓ 20 produktów');

  // ── 5. UsedInventory ──────────────────────────────────────────────────────
  console.log('\n🗂  Seeding usedInventory...');
  const inventoryRows = await db('inventory').select('*');
  const inv = Object.fromEntries(inventoryRows.map((i: any) => [i.name, i]));

  await db('usedInventory').insert([
    // User 1
    { inventoryId: inv['Nożyczki Kiepe 6.5"'].id,              count: 1, useType: 'USED',  comment: 'Zużyte podczas szkolenia', usedAt: daysAgo(10) },
    { inventoryId: inv['Maszynka Wahl Magic Clip Cordless'].id, count: 1, useType: 'SOLD',  comment: 'Sprzedane klientowi',      usedAt: daysAgo(8)  },
    { inventoryId: inv['Szampon American Crew Daily 1000ml'].id,count: 2, useType: 'USED',  comment: null,                       usedAt: daysAgo(7)  },
    { inventoryId: inv['Pomada Layrite Original 297g'].id,      count: 3, useType: 'SOLD',  comment: 'Promocja weekendowa',      usedAt: daysAgo(5)  },
    { inventoryId: inv['Farba Wella Koleston Perfect 60ml'].id, count: 5, useType: 'USED',  comment: 'Koloryzacja — 5 klientów', usedAt: daysAgo(4)  },
    { inventoryId: inv['Ręcznik fryzjerski 50x90cm'].id,        count: 4, useType: 'OTHER', comment: 'Zniszczone w praniu',      usedAt: daysAgo(3)  },
    { inventoryId: inv['Wosk Suavecito Firme Hold 113g'].id,    count: 2, useType: 'SOLD',  comment: null,                       usedAt: daysAgo(2)  },
    { inventoryId: inv['Odżywka Redken For Men 300ml'].id,      count: 1, useType: 'USED',  comment: null,                       usedAt: daysAgo(1)  },
    // User 2
    { inventoryId: inv['Żel do stylizacji Got2b 150ml'].id,     count: 4, useType: 'SOLD',  comment: 'Sprzedane po zabiegu',     usedAt: daysAgo(6)  },
    { inventoryId: inv['Balsam po goleniu Proraso 100ml'].id,   count: 3, useType: 'USED',  comment: null,                       usedAt: daysAgo(3)  },
    { inventoryId: inv['Spray do golenia Taylor of Bond'].id,   count: 1, useType: 'USED',  comment: 'Użyte na pokazie',         usedAt: daysAgo(1)  },
  ]);
  console.log('  ✓ 11 wpisów');

  // ── 7. Workstations ───────────────────────────────────────────────────────
  console.log('\n🪑 Seeding workstations...');
  const workstations = await db('workstations')
    .insert([
      // User 1
      { name: 'Stanowisko 1', barbershopId: shop1.id, ownerId: user1.id },
      { name: 'Stanowisko 2', barbershopId: shop1.id, ownerId: user1.id },
      { name: 'Stanowisko 3', barbershopId: shop1.id, ownerId: user1.id },
      { name: 'Stanowisko 1', barbershopId: shop2.id, ownerId: user1.id },
      { name: 'Stanowisko 2', barbershopId: shop2.id, ownerId: user1.id },
      // User 2
      { name: 'Stanowisko A', barbershopId: shop3.id, ownerId: user2.id },
      { name: 'Stanowisko B', barbershopId: shop3.id, ownerId: user2.id },
    ])
    .returning('*');

  const [ws1a, ws1b, ws1c, ws2a, ws2b, ws3a, ws3b] = workstations;
  console.log(`  ✓ ${workstations.length} stanowisk`);

  // ── 8. Employees ──────────────────────────────────────────────────────────
  console.log('\n👨‍💼 Seeding employees...');
  const employees = await db('employees')
    .insert([
      // User 1
      { name: 'Marek',     surname: 'Kowalski',    email: 'marek.kowalski@barberking.pl',          phoneNumber: '+48501111222', barbershopId: shop1.id, ownerId: user1.id },
      { name: 'Anna',      surname: 'Nowak',       email: 'anna.nowak@barberking.pl',              phoneNumber: '+48502333444', barbershopId: shop1.id, ownerId: user1.id },
      { name: 'Piotr',     surname: 'Wiśniewski',  email: 'piotr.wisniewski@barberking.pl',        phoneNumber: '+48503555666', barbershopId: shop1.id, ownerId: user1.id },
      { name: 'Tomasz',    surname: 'Wójcik',      email: 'tomasz.wojcik@classicbarber.pl',        phoneNumber: '+48504777888', barbershopId: shop2.id, ownerId: user1.id },
      { name: 'Katarzyna', surname: 'Zielińska',   email: 'katarzyna.zielinska@classicbarber.pl',  phoneNumber: '+48505999000', barbershopId: shop2.id, ownerId: user1.id },
      // User 2
      { name: 'Damian',    surname: 'Rutkowski',   email: 'damian.rutkowski@prestigebarber.pl',    phoneNumber: '+48506100200', barbershopId: shop3.id, ownerId: user2.id },
      { name: 'Natalia',   surname: 'Krawczyk',    email: 'natalia.krawczyk@prestigebarber.pl',    phoneNumber: '+48507300400', barbershopId: shop3.id, ownerId: user2.id },
    ])
    .returning('*');

  const [emp1, emp2, emp3, emp4, emp5, emp6, emp7] = employees;
  console.log(`  ✓ ${employees.length} pracowników`);

  // ── 9. Services ───────────────────────────────────────────────────────────
  console.log('\n✂️  Seeding services...');
  const services = await db('services')
    .insert([
      // User 1 – shop1
      { name: 'Strzyżenie klasyczne', barbershopId: shop1.id, ownerId: user1.id, serviceTime: 30 },
      { name: 'Strzyżenie + broda',   barbershopId: shop1.id, ownerId: user1.id, serviceTime: 60 },
      { name: 'Pielęgnacja brody',    barbershopId: shop1.id, ownerId: user1.id, serviceTime: 30 },
      { name: 'Koloryzacja',          barbershopId: shop1.id, ownerId: user1.id, serviceTime: 90 },
      { name: 'Mycie i modelowanie',  barbershopId: shop1.id, ownerId: user1.id, serviceTime: 45 },
      // User 1 – shop2
      { name: 'Strzyżenie klasyczne', barbershopId: shop2.id, ownerId: user1.id, serviceTime: 30 },
      { name: 'Fade & Taper',         barbershopId: shop2.id, ownerId: user1.id, serviceTime: 45 },
      { name: 'Pielęgnacja brody',    barbershopId: shop2.id, ownerId: user1.id, serviceTime: 30 },
      { name: 'Hot towel shave',      barbershopId: shop2.id, ownerId: user1.id, serviceTime: 45 },
      { name: 'Koloryzacja',          barbershopId: shop2.id, ownerId: user1.id, serviceTime: 90 },
      // User 2 – shop3
      { name: 'Strzyżenie premium',   barbershopId: shop3.id, ownerId: user2.id, serviceTime: 40 },
      { name: 'Strzyżenie + beard',   barbershopId: shop3.id, ownerId: user2.id, serviceTime: 60 },
      { name: 'Golenie brzytwą',      barbershopId: shop3.id, ownerId: user2.id, serviceTime: 45 },
      { name: 'Detailing',            barbershopId: shop3.id, ownerId: user2.id, serviceTime: 20 },
    ])
    .returning('*');

  const [svc1, svc2, svc3, svc4, svc5, svc6, svc7, svc8, svc9, svc10, svc11, svc12, svc13, svc14] = services;
  console.log(`  ✓ ${services.length} usług`);

  // ── 10. ServicePrices ─────────────────────────────────────────────────────
  console.log('\n💰 Seeding service prices...');
  await db('servicePrices').insert([
    // User 1 – shop1 – Marek
    { price:  70.00, currency: 'PLN', serviceId: svc1.id,  barbershopId: shop1.id, employeeId: emp1.id },
    { price: 120.00, currency: 'PLN', serviceId: svc2.id,  barbershopId: shop1.id, employeeId: emp1.id },
    { price:  60.00, currency: 'PLN', serviceId: svc3.id,  barbershopId: shop1.id, employeeId: emp1.id },
    { price: 200.00, currency: 'PLN', serviceId: svc4.id,  barbershopId: shop1.id, employeeId: emp1.id },
    { price:  90.00, currency: 'PLN', serviceId: svc5.id,  barbershopId: shop1.id, employeeId: emp1.id },
    // User 1 – shop1 – Anna
    { price:  55.00, currency: 'PLN', serviceId: svc1.id,  barbershopId: shop1.id, employeeId: emp2.id },
    { price: 100.00, currency: 'PLN', serviceId: svc2.id,  barbershopId: shop1.id, employeeId: emp2.id },
    { price:  50.00, currency: 'PLN', serviceId: svc3.id,  barbershopId: shop1.id, employeeId: emp2.id },
    { price: 170.00, currency: 'PLN', serviceId: svc4.id,  barbershopId: shop1.id, employeeId: emp2.id },
    { price:  75.00, currency: 'PLN', serviceId: svc5.id,  barbershopId: shop1.id, employeeId: emp2.id },
    // User 1 – shop1 – Piotr
    { price:  60.00, currency: 'PLN', serviceId: svc1.id,  barbershopId: shop1.id, employeeId: emp3.id },
    { price: 110.00, currency: 'PLN', serviceId: svc2.id,  barbershopId: shop1.id, employeeId: emp3.id },
    { price:  55.00, currency: 'PLN', serviceId: svc3.id,  barbershopId: shop1.id, employeeId: emp3.id },
    { price: 185.00, currency: 'PLN', serviceId: svc4.id,  barbershopId: shop1.id, employeeId: emp3.id },
    { price:  80.00, currency: 'PLN', serviceId: svc5.id,  barbershopId: shop1.id, employeeId: emp3.id },
    // User 1 – shop2 – Tomasz
    { price:  65.00, currency: 'PLN', serviceId: svc6.id,  barbershopId: shop2.id, employeeId: emp4.id },
    { price:  85.00, currency: 'PLN', serviceId: svc7.id,  barbershopId: shop2.id, employeeId: emp4.id },
    { price:  55.00, currency: 'PLN', serviceId: svc8.id,  barbershopId: shop2.id, employeeId: emp4.id },
    { price: 100.00, currency: 'PLN', serviceId: svc9.id,  barbershopId: shop2.id, employeeId: emp4.id },
    { price: 190.00, currency: 'PLN', serviceId: svc10.id, barbershopId: shop2.id, employeeId: emp4.id },
    // User 1 – shop2 – Katarzyna
    { price:  60.00, currency: 'PLN', serviceId: svc6.id,  barbershopId: shop2.id, employeeId: emp5.id },
    { price:  80.00, currency: 'PLN', serviceId: svc7.id,  barbershopId: shop2.id, employeeId: emp5.id },
    { price:  50.00, currency: 'PLN', serviceId: svc8.id,  barbershopId: shop2.id, employeeId: emp5.id },
    { price:  95.00, currency: 'PLN', serviceId: svc9.id,  barbershopId: shop2.id, employeeId: emp5.id },
    { price: 175.00, currency: 'PLN', serviceId: svc10.id, barbershopId: shop2.id, employeeId: emp5.id },
    // User 2 – shop3 – Damian
    { price:  90.00, currency: 'PLN', serviceId: svc11.id, barbershopId: shop3.id, employeeId: emp6.id },
    { price: 140.00, currency: 'PLN', serviceId: svc12.id, barbershopId: shop3.id, employeeId: emp6.id },
    { price:  80.00, currency: 'PLN', serviceId: svc13.id, barbershopId: shop3.id, employeeId: emp6.id },
    { price:  40.00, currency: 'PLN', serviceId: svc14.id, barbershopId: shop3.id, employeeId: emp6.id },
    // User 2 – shop3 – Natalia
    { price:  85.00, currency: 'PLN', serviceId: svc11.id, barbershopId: shop3.id, employeeId: emp7.id },
    { price: 130.00, currency: 'PLN', serviceId: svc12.id, barbershopId: shop3.id, employeeId: emp7.id },
    { price:  75.00, currency: 'PLN', serviceId: svc13.id, barbershopId: shop3.id, employeeId: emp7.id },
    { price:  35.00, currency: 'PLN', serviceId: svc14.id, barbershopId: shop3.id, employeeId: emp7.id },
  ]);
  console.log('  ✓ 33 cenniki');

  // ── 11. Appointments ──────────────────────────────────────────────────────
  console.log('\n📅 Seeding appointments...');

  const u1 = { ownerId: user1.id, initialNotificationSent: true as const, reminderNotificationSent: true as const };
  const u2 = { ownerId: user2.id, initialNotificationSent: true as const, reminderNotificationSent: true as const };

  const appts = [
    // ---- User 1 / Shop 1 – przeszłe (completed) ----
    { clientName: 'Jan Kowalski',        clientEmail: 'jan.kowalski@gmail.com', clientPhoneNumber: '+48600111222', startTime: daysAgo(14, 9, 0),    status: 'completed', serviceId: svc1.id,  employeeId: emp1.id, workstationId: ws1a.id, ...u1 },
    { clientName: 'Łukasz Malinowski',   clientEmail: null,                     clientPhoneNumber: '+48601222333', startTime: daysAgo(14, 10, 30),  status: 'completed', serviceId: svc2.id,  employeeId: emp2.id, workstationId: ws1b.id, ...u1 },
    { clientName: 'Michał Zając',        clientEmail: 'michal@example.com',     clientPhoneNumber: '+48602333444', startTime: daysAgo(13, 11, 0),   status: 'completed', serviceId: svc3.id,  employeeId: emp3.id, workstationId: ws1c.id, ...u1 },
    { clientName: 'Tomasz Jabłoński',    clientEmail: null,                     clientPhoneNumber: '+48603444555', startTime: daysAgo(12, 14, 0),   status: 'completed', serviceId: svc1.id,  employeeId: emp1.id, workstationId: ws1a.id, ...u1 },
    { clientName: 'Adam Krawczyk',       clientEmail: 'adam.k@wp.pl',           clientPhoneNumber: '+48604555666', startTime: daysAgo(10, 9, 30),   status: 'completed', serviceId: svc5.id,  employeeId: emp2.id, workstationId: ws1b.id, ...u1 },
    { clientName: 'Bartosz Wróbel',      clientEmail: null,                     clientPhoneNumber: '+48605666777', startTime: daysAgo(10, 11, 0),   status: 'completed', serviceId: svc4.id,  employeeId: emp1.id, workstationId: ws1a.id, ...u1 },
    { clientName: 'Kamil Lewandowski',   clientEmail: 'kamil.l@onet.pl',        clientPhoneNumber: '+48606777888', startTime: daysAgo(7, 10, 0),    status: 'completed', serviceId: svc2.id,  employeeId: emp3.id, workstationId: ws1c.id, ...u1 },
    { clientName: 'Paweł Szymański',     clientEmail: null,                     clientPhoneNumber: '+48607888999', startTime: daysAgo(7, 12, 30),   status: 'completed', serviceId: svc1.id,  employeeId: emp2.id, workstationId: ws1b.id, ...u1 },
    { clientName: 'Rafał Dąbrowski',     clientEmail: 'rafal@gmail.com',        clientPhoneNumber: '+48608999000', startTime: daysAgo(5, 15, 0),    status: 'completed', serviceId: svc3.id,  employeeId: emp1.id, workstationId: ws1a.id, ...u1 },
    { clientName: 'Sławomir Pawlak',     clientEmail: null,                     clientPhoneNumber: '+48609000111', startTime: daysAgo(3, 9, 0),     status: 'completed', serviceId: svc5.id,  employeeId: emp3.id, workstationId: ws1c.id, ...u1 },
    // ---- User 1 / Shop 1 – anulowane ----
    { clientName: 'Grzegorz Nowicki',    clientEmail: null,                     clientPhoneNumber: '+48610111222', startTime: daysAgo(8, 13, 0),    status: 'cancelled', serviceId: svc1.id,  employeeId: emp1.id, workstationId: ws1a.id, ...u1 },
    { clientName: 'Krzysztof Bąk',       clientEmail: 'krz@wp.pl',             clientPhoneNumber: '+48611222333', startTime: daysAgo(4, 11, 0),    status: 'cancelled', serviceId: svc2.id,  employeeId: emp2.id, workstationId: ws1b.id, ...u1 },
    // ---- User 1 / Shop 1 – przyszłe (scheduled) ----
    { clientName: 'Robert Czajka',       clientEmail: 'robert@gmail.com',       clientPhoneNumber: '+48612333444', startTime: daysFromNow(0, 9, 0),  status: 'scheduled', serviceId: svc1.id,  employeeId: emp1.id, workstationId: ws1a.id, ...u1 },
    { clientName: 'Marcin Kowalczyk',    clientEmail: null,                     clientPhoneNumber: '+48613444555', startTime: daysFromNow(0, 10, 30),status: 'scheduled', serviceId: svc2.id,  employeeId: emp2.id, workstationId: ws1b.id, ...u1 },
    { clientName: 'Jakub Wiśniak',       clientEmail: 'jakub@example.com',      clientPhoneNumber: '+48614555666', startTime: daysFromNow(0, 13, 0), status: 'scheduled', serviceId: svc3.id,  employeeId: emp3.id, workstationId: ws1c.id, ...u1 },
    { clientName: 'Damian Lis',          clientEmail: null,                     clientPhoneNumber: '+48615666777', startTime: daysFromNow(1, 9, 30), status: 'scheduled', serviceId: svc4.id,  employeeId: emp1.id, workstationId: ws1a.id, ...u1 },
    { clientName: 'Sebastian Wierzbicki',clientEmail: 'seb@gmail.com',          clientPhoneNumber: '+48616777888', startTime: daysFromNow(1, 11, 0), status: 'scheduled', serviceId: svc5.id,  employeeId: emp2.id, workstationId: ws1b.id, ...u1 },
    { clientName: 'Mateusz Kaźmierczak', clientEmail: null,                     clientPhoneNumber: '+48617888999', startTime: daysFromNow(2, 14, 0), status: 'scheduled', serviceId: svc1.id,  employeeId: emp3.id, workstationId: ws1c.id, ...u1 },
    { clientName: 'Andrzej Grabowski',   clientEmail: 'andrzej@onet.pl',        clientPhoneNumber: '+48618999000', startTime: daysFromNow(3, 9, 0),  status: 'scheduled', serviceId: svc2.id,  employeeId: emp1.id, workstationId: ws1a.id, ...u1 },
    { clientName: 'Dariusz Kaczmarek',   clientEmail: null,                     clientPhoneNumber: '+48619000111', startTime: daysFromNow(5, 10, 0), status: 'scheduled', serviceId: svc3.id,  employeeId: emp2.id, workstationId: ws1b.id, ...u1 },
    // ---- User 1 / Shop 2 – przeszłe (completed) ----
    { clientName: 'Wojciech Adamczyk',   clientEmail: 'wojtek@gmail.com',       clientPhoneNumber: '+48620111222', startTime: daysAgo(12, 10, 0),   status: 'completed', serviceId: svc6.id,  employeeId: emp4.id, workstationId: ws2a.id, ...u1 },
    { clientName: 'Zbigniew Piotrowska', clientEmail: null,                     clientPhoneNumber: '+48621222333', startTime: daysAgo(11, 11, 30),  status: 'completed', serviceId: svc7.id,  employeeId: emp5.id, workstationId: ws2b.id, ...u1 },
    { clientName: 'Henryk Michalak',     clientEmail: 'henryk@wp.pl',           clientPhoneNumber: '+48622333444', startTime: daysAgo(9, 13, 0),    status: 'completed', serviceId: svc9.id,  employeeId: emp4.id, workstationId: ws2a.id, ...u1 },
    { clientName: 'Tadeusz Nowak',       clientEmail: null,                     clientPhoneNumber: '+48623444555', startTime: daysAgo(6, 9, 0),     status: 'completed', serviceId: svc8.id,  employeeId: emp5.id, workstationId: ws2b.id, ...u1 },
    { clientName: 'Józef Walczak',       clientEmail: 'jozef@example.com',      clientPhoneNumber: '+48624555666', startTime: daysAgo(4, 14, 30),   status: 'completed', serviceId: svc10.id, employeeId: emp4.id, workstationId: ws2a.id, ...u1 },
    // ---- User 1 / Shop 2 – przyszłe (scheduled) ----
    { clientName: 'Stanisław Kubiak',    clientEmail: null,                     clientPhoneNumber: '+48625666777', startTime: daysFromNow(0, 11, 0), status: 'scheduled', serviceId: svc6.id,  employeeId: emp4.id, workstationId: ws2a.id, ...u1 },
    { clientName: 'Edward Mazurek',      clientEmail: 'edward@gmail.com',       clientPhoneNumber: '+48626777888', startTime: daysFromNow(1, 13, 0), status: 'scheduled', serviceId: svc7.id,  employeeId: emp5.id, workstationId: ws2b.id, ...u1 },
    { clientName: 'Ryszard Ostrowski',   clientEmail: null,                     clientPhoneNumber: '+48627888999', startTime: daysFromNow(2, 9, 30), status: 'scheduled', serviceId: svc9.id,  employeeId: emp4.id, workstationId: ws2a.id, ...u1 },
    { clientName: 'Leszek Zakrzewski',   clientEmail: 'leszek@onet.pl',         clientPhoneNumber: '+48628999000', startTime: daysFromNow(4, 15, 0), status: 'scheduled', serviceId: svc8.id,  employeeId: emp5.id, workstationId: ws2b.id, ...u1 },
    // ---- User 2 / Shop 3 – przeszłe (completed) ----
    { clientName: 'Konrad Bielski',     clientEmail: 'konrad@gmail.com',       clientPhoneNumber: '+48630100200', startTime: daysAgo(13, 10, 0),    status: 'completed', serviceId: svc11.id, employeeId: emp6.id, workstationId: ws3a.id, ...u2 },
    { clientName: 'Miłosz Krajewski',   clientEmail: null,                     clientPhoneNumber: '+48631200300', startTime: daysAgo(11, 11, 0),    status: 'completed', serviceId: svc12.id, employeeId: emp7.id, workstationId: ws3b.id, ...u2 },
    { clientName: 'Artur Dziedzic',     clientEmail: 'artur@wp.pl',            clientPhoneNumber: '+48632300400', startTime: daysAgo(9, 14, 0),     status: 'completed', serviceId: svc13.id, employeeId: emp6.id, workstationId: ws3a.id, ...u2 },
    { clientName: 'Karol Stawicki',     clientEmail: null,                     clientPhoneNumber: '+48633400500', startTime: daysAgo(7, 9, 30),     status: 'completed', serviceId: svc14.id, employeeId: emp7.id, workstationId: ws3b.id, ...u2 },
    { clientName: 'Filip Marczak',      clientEmail: 'filip.m@onet.pl',        clientPhoneNumber: '+48634500600', startTime: daysAgo(5, 12, 0),     status: 'completed', serviceId: svc11.id, employeeId: emp6.id, workstationId: ws3a.id, ...u2 },
    { clientName: 'Igor Czajkowski',    clientEmail: null,                     clientPhoneNumber: '+48635600700', startTime: daysAgo(3, 15, 0),     status: 'completed', serviceId: svc12.id, employeeId: emp7.id, workstationId: ws3b.id, ...u2 },
    // ---- User 2 / Shop 3 – anulowane ----
    { clientName: 'Łukasz Sobieski',    clientEmail: 'lukasz.s@gmail.com',     clientPhoneNumber: '+48636700800', startTime: daysAgo(6, 13, 0),     status: 'cancelled', serviceId: svc11.id, employeeId: emp6.id, workstationId: ws3a.id, ...u2 },
    // ---- User 2 / Shop 3 – przyszłe (scheduled) ----
    { clientName: 'Dawid Kowalczuk',    clientEmail: null,                     clientPhoneNumber: '+48637800900', startTime: daysFromNow(0, 10, 0),  status: 'scheduled', serviceId: svc11.id, employeeId: emp6.id, workstationId: ws3a.id, ...u2 },
    { clientName: 'Norbert Ryba',       clientEmail: 'norbert@gmail.com',      clientPhoneNumber: '+48638900000', startTime: daysFromNow(1, 12, 0),  status: 'scheduled', serviceId: svc13.id, employeeId: emp7.id, workstationId: ws3b.id, ...u2 },
    { clientName: 'Przemek Sasin',      clientEmail: null,                     clientPhoneNumber: '+48639000100', startTime: daysFromNow(2, 14, 30), status: 'scheduled', serviceId: svc12.id, employeeId: emp6.id, workstationId: ws3a.id, ...u2 },
    { clientName: 'Radek Piórkowski',   clientEmail: 'radek@onet.pl',          clientPhoneNumber: '+48640100200', startTime: daysFromNow(4, 9, 0),   status: 'scheduled', serviceId: svc14.id, employeeId: emp7.id, workstationId: ws3b.id, ...u2 },
  ];

  await db('appointments').insert(appts);
  console.log(`  ✓ ${appts.length} wizyt`);

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log('\n✅ Seed completed!\n');
  console.log('Summary:');
  console.log(`  Users:          2  (${user1.email}, ${user2.email})`);
  console.log(`  Barbershops:    3  (2 × user1, 1 × user2)`);
  console.log(`  Categories:     ${categoryRows.length}  (10 × user1, 4 × user2)`);
  console.log(`  Inventory:      20  (14 × user1, 6 × user2)`);
  console.log(`  UsedInventory:  11  (8 × user1, 3 × user2)`);
  console.log(`  Workstations:   ${workstations.length}  (5 × user1, 2 × user2)`);
  console.log(`  Employees:      ${employees.length}  (5 × user1, 2 × user2)`);
  console.log(`  Services:       ${services.length}  (10 × user1, 4 × user2)`);
  console.log(`  ServicePrices:  33  (25 × user1, 8 × user2)`);
  console.log(`  Appointments:   ${appts.length}  (28 × user1, 11 × user2)`);

  await db.destroy();
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  db.destroy();
  process.exit(1);
});
