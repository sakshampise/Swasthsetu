// Realistic demo data for 10 health centres in Pune district.
// In live mode this module is replaced by Supabase/Firestore queries (see lib/supabase.ts).
export type Centre = { id: string; name: string; type: "PHC" | "CHC"; area: string; beds: number; occupied: number; opd: number; emergency: number; docTotal: number; docPresent: number; att: number; testsOk: number; testsTotal: number; seed: number };
export type Med = { id: number; centre: string; name: string; cat: string; stock: number; use: number; thr: number; exp: string };

export const CENTRES = [
  { id: "wakad", name: "PHC Wakad", type: "PHC", area: "Mulshi", beds: 30, occupied: 26, opd: 212, emergency: 18, docTotal: 6, docPresent: 4, att: 71, testsOk: 8, testsTotal: 12, seed: 3 },
  { id: "aundh", name: "PHC Aundh", type: "PHC", area: "Haveli", beds: 30, occupied: 14, opd: 128, emergency: 6, docTotal: 6, docPresent: 6, att: 94, testsOk: 11, testsTotal: 12, seed: 7 },
  { id: "hadapsar", name: "PHC Hadapsar", type: "PHC", area: "Haveli", beds: 24, occupied: 17, opd: 156, emergency: 9, docTotal: 5, docPresent: 3, att: 58, testsOk: 7, testsTotal: 12, seed: 11 },
  { id: "kothrud", name: "PHC Kothrud", type: "PHC", area: "Haveli", beds: 24, occupied: 12, opd: 118, emergency: 5, docTotal: 5, docPresent: 5, att: 91, testsOk: 10, testsTotal: 12, seed: 13 },
  { id: "hinjewadi", name: "PHC Hinjewadi", type: "PHC", area: "Mulshi", beds: 20, occupied: 11, opd: 141, emergency: 7, docTotal: 4, docPresent: 4, att: 88, testsOk: 9, testsTotal: 12, seed: 17 },
  { id: "baner", name: "CHC Baner", type: "CHC", area: "Haveli", beds: 60, occupied: 54, opd: 296, emergency: 24, docTotal: 12, docPresent: 10, att: 84, testsOk: 16, testsTotal: 20, seed: 19 },
  { id: "pimpri", name: "CHC Pimpri", type: "CHC", area: "PCMC", beds: 80, occupied: 61, opd: 342, emergency: 29, docTotal: 14, docPresent: 12, att: 87, testsOk: 18, testsTotal: 20, seed: 23 },
  { id: "chinchwad", name: "CHC Chinchwad", type: "CHC", area: "PCMC", beds: 70, occupied: 44, opd: 288, emergency: 19, docTotal: 13, docPresent: 12, att: 90, testsOk: 17, testsTotal: 20, seed: 29 },
  { id: "shivajinagar", name: "CHC Shivajinagar", type: "CHC", area: "Pune City", beds: 90, occupied: 68, opd: 384, emergency: 33, docTotal: 16, docPresent: 13, att: 82, testsOk: 15, testsTotal: 20, seed: 31 },
  { id: "swargate", name: "CHC Swargate", type: "CHC", area: "Pune City", beds: 75, occupied: 49, opd: 301, emergency: 21, docTotal: 14, docPresent: 12, att: 86, testsOk: 19, testsTotal: 20, seed: 37 },
];

export const MEDS0 = [
  { id: 1, centre: "wakad", name: "Paracetamol 500mg", cat: "Analgesic", stock: 240, use: 85, thr: 500, exp: "2026-11-10" },
  { id: 2, centre: "wakad", name: "ORS Sachets", cat: "Rehydration", stock: 60, use: 32, thr: 200, exp: "2027-02-01" },
  { id: 3, centre: "wakad", name: "Amoxicillin 250mg", cat: "Antibiotic", stock: 410, use: 34, thr: 300, exp: "2026-09-18" },
  { id: 4, centre: "wakad", name: "Iron-Folic Acid", cat: "Supplement", stock: 950, use: 40, thr: 400, exp: "2027-05-30" },
  { id: 5, centre: "wakad", name: "Metformin 500mg", cat: "Antidiabetic", stock: 180, use: 26, thr: 250, exp: "2026-08-22" },
  { id: 6, centre: "aundh", name: "Paracetamol 500mg", cat: "Analgesic", stock: 2600, use: 60, thr: 500, exp: "2027-01-15" },
  { id: 7, centre: "aundh", name: "ORS Sachets", cat: "Rehydration", stock: 900, use: 18, thr: 200, exp: "2027-03-12" },
  { id: 8, centre: "aundh", name: "Amlodipine 5mg", cat: "Antihypertensive", stock: 720, use: 22, thr: 250, exp: "2026-12-04" },
  { id: 9, centre: "hadapsar", name: "Zinc Tablets", cat: "Supplement", stock: 96, use: 24, thr: 150, exp: "2026-08-09" },
  { id: 10, centre: "hadapsar", name: "Cetirizine 10mg", cat: "Antihistamine", stock: 340, use: 21, thr: 200, exp: "2026-10-25" },
  { id: 11, centre: "baner", name: "Insulin (10ml)", cat: "Antidiabetic", stock: 44, use: 9, thr: 60, exp: "2026-08-30" },
  { id: 12, centre: "baner", name: "IV Fluids NS 500ml", cat: "IV", stock: 130, use: 38, thr: 220, exp: "2027-06-19" },
  { id: 13, centre: "pimpri", name: "Rabies Vaccine", cat: "Vaccine", stock: 58, use: 6, thr: 40, exp: "2026-09-05" },
  { id: 14, centre: "pimpri", name: "IV Fluids NS 500ml", cat: "IV", stock: 640, use: 42, thr: 220, exp: "2027-04-11" },
  { id: 15, centre: "shivajinagar", name: "Amoxicillin 250mg", cat: "Antibiotic", stock: 210, use: 48, thr: 300, exp: "2026-08-14" },
  { id: 16, centre: "swargate", name: "Paracetamol 500mg", cat: "Analgesic", stock: 1900, use: 74, thr: 500, exp: "2027-02-27" },
  { id: 17, centre: "kothrud", name: "ORS Sachets", cat: "Rehydration", stock: 480, use: 15, thr: 200, exp: "2027-01-08" },
  { id: 18, centre: "hinjewadi", name: "Metformin 500mg", cat: "Antidiabetic", stock: 610, use: 19, thr: 250, exp: "2026-12-20" },
  { id: 19, centre: "chinchwad", name: "Insulin (10ml)", cat: "Antidiabetic", stock: 150, use: 8, thr: 60, exp: "2027-03-03" },
  { id: 20, centre: "shivajinagar", name: "ORS Sachets", cat: "Rehydration", stock: 150, use: 41, thr: 250, exp: "2026-12-31" },
];

export const DOCTORS0 = [
  { id: 1, centre: "wakad", name: "Dr. A. Kulkarni", role: "MO In-charge", shift: "9:00–17:00", status: "present", att: 92, irregular: false },
  { id: 2, centre: "wakad", name: "Dr. S. Pawar", role: "Medical Officer", shift: "9:00–17:00", status: "absent", att: 54, irregular: true },
  { id: 3, centre: "wakad", name: "Dr. R. Shaikh", role: "AYUSH MO", shift: "13:00–21:00", status: "present", att: 88, irregular: false },
  { id: 4, centre: "wakad", name: "N. Jadhav", role: "Staff Nurse", shift: "9:00–17:00", status: "present", att: 95, irregular: false },
  { id: 5, centre: "wakad", name: "P. More", role: "Pharmacist", shift: "9:00–17:00", status: "leave", att: 81, irregular: false },
  { id: 6, centre: "wakad", name: "Dr. V. Deshmukh", role: "Medical Officer", shift: "13:00–21:00", status: "present", att: 76, irregular: false },
  { id: 7, centre: "hadapsar", name: "Dr. M. Gaikwad", role: "MO In-charge", shift: "9:00–17:00", status: "absent", att: 49, irregular: true },
  { id: 8, centre: "hadapsar", name: "Dr. T. Bhosale", role: "Medical Officer", shift: "9:00–17:00", status: "present", att: 63, irregular: true },
  { id: 9, centre: "baner", name: "Dr. K. Iyer", role: "Surgeon", shift: "9:00–17:00", status: "present", att: 90, irregular: false },
  { id: 10, centre: "baner", name: "Dr. F. Khan", role: "Gynaecologist", shift: "13:00–21:00", status: "present", att: 86, irregular: false },
];

export const TESTS0 = [
  { id: 1, centre: "wakad", name: "CBC (Haemogram)", machine: "OK", reagent: 62, avail: true, last: "2 d" },
  { id: 2, centre: "wakad", name: "Blood Glucose", machine: "OK", reagent: 78, avail: true, last: "1 d" },
  { id: 3, centre: "wakad", name: "Malaria RDT", machine: "—", reagent: 8, avail: false, last: "6 d" },
  { id: 4, centre: "wakad", name: "Urine Routine", machine: "OK", reagent: 55, avail: true, last: "3 d" },
  { id: 5, centre: "wakad", name: "X-Ray", machine: "Down since 04 Jul", reagent: 0, avail: false, last: "12 d" },
  { id: 6, centre: "wakad", name: "Dengue NS1", machine: "OK", reagent: 34, avail: true, last: "2 d" },
  { id: 7, centre: "baner", name: "ECG", machine: "OK", reagent: 100, avail: true, last: "1 d" },
  { id: 8, centre: "baner", name: "Ultrasound", machine: "Service due", reagent: 100, avail: true, last: "5 d" },
  { id: 9, centre: "hadapsar", name: "HbA1c", machine: "Down", reagent: 12, avail: false, last: "9 d" },
  { id: 10, centre: "shivajinagar", name: "Widal (Typhoid)", machine: "OK", reagent: 18, avail: false, last: "4 d" },
];

export const DEMO_USERS = [
  { role: "admin", name: "Dr. Meera Joshi", email: "admin@swasthsetu.in", pass: "admin123", centre: null },
  { role: "manager", name: "Rahul Patil", email: "manager.wakad@swasthsetu.in", pass: "phc123", centre: "wakad" },
  { role: "doctor", name: "Dr. A. Kulkarni", email: "doctor@swasthsetu.in", pass: "doc123", centre: "wakad" },
];

