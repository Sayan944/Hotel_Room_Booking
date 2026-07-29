import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

let pool = null;

export function getPool() {
    if (!pool) {
        pool = mysql.createPool({
            host: process.env.DB_HOST || '127.0.0.1',
            port: Number(process.env.DB_PORT) || 3306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'hotel_management',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
    }
    return pool;
}

const MOCK = {
    guests: [
        { gid: 'USR-101', gname: 'Jane Doe', email: 'jane.doe@example.com', phn: '+91 98123-45678', gaadhar: '284759301847', gpass: '$2b$10$e7K5.4c1J.E8y4kE8G8s1.6U2x6v2w8.Y.5v2v8v2', role: 'guest', regdt: '2026-06-15' },
        { gid: 'USR-102', gname: 'Vikramaditya Singhania', email: 'vikram.singhania@example.com', phn: '+91 98765-44321', gaadhar: '543298761234', gpass: '$2b$10$e7K5.4c1J.E8y4kE8G8s1.6U2x6v2w8.Y.5v2v8v2', role: 'guest', regdt: '2026-07-01' },
        { gid: 'USR-103', gname: 'Ananya Iyer', email: 'ananya.iyer@example.com', phn: '+91 99887-11223', gaadhar: '987654321019', gpass: '$2b$10$e7K5.4c1J.E8y4kE8G8s1.6U2x6v2w8.Y.5v2v8v2', role: 'guest', regdt: '2026-07-10' },
        { gid: 'USR-104', gname: 'Rajesh Sharma', email: 'rajesh.sharma@example.com', phn: '+91 97112-33445', gaadhar: '456789123456', gpass: '$2b$10$e7K5.4c1J.E8y4kE8G8s1.6U2x6v2w8.Y.5v2v8v2', role: 'guest', regdt: '2026-07-02' },
        { gid: 'USR-105', gname: 'Kabir Mehta', email: 'kabir.mehta@example.com', phn: '+91 98234-56789', gaadhar: '789012345678', gpass: '$2b$10$e7K5.4c1J.E8y4kE8G8s1.6U2x6v2w8.Y.5v2v8v2', role: 'guest', regdt: '2026-07-15' },
        { gid: 'USR-106', gname: 'Dr. Meera Reddy', email: 'meera.reddy@example.com', phn: '+91 94455-66778', gaadhar: '345678901234', gpass: '$2b$10$e7K5.4c1J.E8y4kE8G8s1.6U2x6v2w8.Y.5v2v8v2', role: 'guest', regdt: '2026-07-18' },
        { gid: 'USR-107', gname: 'Devendra Deshmukh', email: 'devendra.d@example.com', phn: '+91 98990-11223', gaadhar: '654321098765', gpass: '$2b$10$e7K5.4c1J.E8y4kE8G8s1.6U2x6v2w8.Y.5v2v8v2', role: 'guest', regdt: '2026-07-20' },
        { gid: 'USR-108', gname: 'Sonia Kapoor', email: 'sonia.kapoor@example.com', phn: '+91 97654-32109', gaadhar: '890123456789', gpass: '$2b$10$e7K5.4c1J.E8y4kE8G8s1.6U2x6v2w8.Y.5v2v8v2', role: 'guest', regdt: '2026-07-22' },
        { gid: 'USR-109', gname: 'Siddharth Malhotra', email: 'siddharth.m@example.com', phn: '+91 98111-22334', gaadhar: '123498765012', gpass: '$2b$10$e7K5.4c1J.E8y4kE8G8s1.6U2x6v2w8.Y.5v2v8v2', role: 'guest', regdt: '2026-07-24' }
    ],
    staffs: [
        { stid: 'ST-ADMIN', stname: 'System Administrator', email: 'admin@grandresort.com', phn: '+91 98765-43210', pid: 'BR-001', stsal: 75000, stjoindt: '2026-01-01', strole: 'admin', spass: '$2b$10$e7K5.4c1J.E8y4kE8G8s1.6U2x6v2w8.Y.5v2v8v2', status: 'Active' },
        { stid: 'ST-STAFF1', stname: 'Front Desk Manager', email: 'frontdesk@grandresort.com', phn: '+91 98765-11223', pid: 'BR-001', stsal: 50000, stjoindt: '2026-01-01', strole: 'frontdesk', spass: '$2b$10$e7K5.4c1J.E8y4kE8G8s1.6U2x6v2w8.Y.5v2v8v2', status: 'Active' },
        { stid: 'ST-1001', stname: 'Ramesh Kumar', email: 'ramesh@verdantsprings.in', phn: '+91 98123-45678', pid: 'BR-001', stsal: 45000, stjoindt: '2025-03-15', strole: 'Front Desk Supervisor', spass: '', status: 'Active' },
        { stid: 'ST-1002', stname: 'Priya Sharma', email: 'priya@verdantsprings.in', phn: '+91 98765-11223', pid: 'BR-001', stsal: 38000, stjoindt: '2025-05-10', strole: 'Housekeeping Lead', spass: '', status: 'Active' },
        { stid: 'ST-1003', stname: 'Anand Varma', email: 'anand@verdantsprings.in', phn: '+91 99887-33445', pid: 'BR-002', stsal: 52000, stjoindt: '2024-11-20', strole: 'Assistant General Manager', spass: '', status: 'Active' }
    ],
    properties: [
        { pid: 'BR-001', pname: 'Verdant Springs Resort & Spa, North Goa', paddress: '124 Calangute Beach Road, North Goa', pcity: 'Goa', pphone: '+91 832-2456789', pemail: 'goa@verdantsprings.in' },
        { pid: 'BR-002', pname: 'Verdant Springs Palace, Udaipur', paddress: '88 Lake Palace Road, Lake Pichola', pcity: 'Udaipur', pphone: '+91 294-2567890', pemail: 'udaipur@verdantsprings.in' },
        { pid: 'BR-003', pname: 'Verdant Springs Tea Estate & Retreat, Munnar', paddress: '45 Tea Garden Estate Road, Munnar Hills', pcity: 'Munnar', pphone: '+91 486-2345678', pemail: 'munnar@verdantsprings.in' }
    ],
    rooms: [
        // --- BRANCH 1: Goa Palolem Beachfront Resort & Spa (BR-001) ---
        { rid: 'RM-101', rnumber: '101', pid: 'BR-001', flno: 1, rcost: 3499, rcatg: 'Standard Garden Room', rcapc: 2, rsts: 'Available', ramenities: '["WiFi", "Free Chai & Breakfast", "Smart TV", "Air Conditioning"]', rimage: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1000&q=80', rbedroom_image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80', rbathroom_image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80', rview_image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80' },
        { rid: 'RM-102', rnumber: '102', pid: 'BR-001', flno: 1, rcost: 5999, rcatg: 'Executive Heritage Deluxe', rcapc: 2, rsts: 'Occupied', ramenities: '["WiFi", "AC", "Breakfast", "Mini Bar", "Smart TV", "Balcony View"]', rimage: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80', rbedroom_image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80', rbathroom_image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=800&q=80', rview_image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' },
        { rid: 'RM-103', rnumber: '103', pid: 'BR-001', flno: 1, rcost: 11499, rcatg: 'Royal Maharajah Suite', rcapc: 3, rsts: 'Available', ramenities: '["WiFi", "AC", "Free Breakfast", "Pool Access", "Mini Bar", "Jacuzzi", "Coffee Maker"]', rimage: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1000&q=80', rbedroom_image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80', rbathroom_image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', rview_image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80' },
        { rid: 'RM-104', rnumber: '104', pid: 'BR-001', flno: 1, rcost: 3499, rcatg: 'Standard Garden Room', rcapc: 2, rsts: 'Dirty', ramenities: '["WiFi", "Free Breakfast", "AC"]', rimage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80', rbedroom_image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80', rbathroom_image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80', rview_image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' },
        { rid: 'RM-201', rnumber: '201', pid: 'BR-001', flno: 2, rcost: 5999, rcatg: 'Executive Heritage Deluxe', rcapc: 2, rsts: 'Occupied', ramenities: '["WiFi", "AC", "Breakfast", "Sea View"]', rimage: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1000&q=80', rbedroom_image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80', rbathroom_image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80', rview_image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80' },
        { rid: 'RM-202', rnumber: '202', pid: 'BR-001', flno: 2, rcost: 11499, rcatg: 'Royal Maharajah Suite', rcapc: 3, rsts: 'Available', ramenities: '["WiFi", "AC", "Breakfast", "Jacuzzi", "Private Lounge"]', rimage: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=80', rbedroom_image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80', rbathroom_image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=800&q=80', rview_image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80' },
        { rid: 'RM-301', rnumber: '301', pid: 'BR-001', flno: 3, rcost: 18999, rcatg: 'Presidential Villa & Pool', rcapc: 4, rsts: 'Available', ramenities: '["WiFi", "AC", "Royal Breakfast", "Private Plunge Pool", "Gym Access", "Kitchenette", "Private Butler"]', rimage: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1000&q=80', rbedroom_image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80', rbathroom_image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', rview_image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80' },

        // --- BRANCH 2: Udaipur Royal Lake Palace (BR-002) ---
        { rid: 'RM-401', rnumber: '101', pid: 'BR-002', flno: 1, rcost: 6499, rcatg: 'Executive Heritage Deluxe', rcapc: 2, rsts: 'Occupied', ramenities: '["WiFi", "AC", "Lake View Balcony", "Smart TV"]', rimage: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80', rbedroom_image: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80', rbathroom_image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80', rview_image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80' },
        { rid: 'RM-402', rnumber: '102', pid: 'BR-002', flno: 1, rcost: 12999, rcatg: 'Royal Maharajah Suite', rcapc: 3, rsts: 'Available', ramenities: '["WiFi", "AC", "Palace Dining", "Jacuzzi", "Lake Pichola View"]', rimage: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1000&q=80', rbedroom_image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80', rbathroom_image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=800&q=80', rview_image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80' },
        { rid: 'RM-403', rnumber: '201', pid: 'BR-002', flno: 2, rcost: 3999, rcatg: 'Standard Garden Room', rcapc: 2, rsts: 'Maintenance', ramenities: '["WiFi", "Free Breakfast", "Courtyard View"]', rimage: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1000&q=80', rbedroom_image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80', rbathroom_image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80', rview_image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80' },
        { rid: 'RM-404', rnumber: '202', pid: 'BR-002', flno: 2, rcost: 6499, rcatg: 'Executive Heritage Deluxe', rcapc: 2, rsts: 'Available', ramenities: '["WiFi", "AC", "Breakfast", "Jharokha Balcony"]', rimage: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1000&q=80', rbedroom_image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80', rbathroom_image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', rview_image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80' },
        { rid: 'RM-405', rnumber: '301', pid: 'BR-002', flno: 3, rcost: 12999, rcatg: 'Royal Maharajah Suite', rcapc: 3, rsts: 'Available', ramenities: '["WiFi", "AC", "Butler Service", "Private Jacuzzi"]', rimage: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80', rbedroom_image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80', rbathroom_image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=800&q=80', rview_image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80' },
        { rid: 'RM-406', rnumber: '401', pid: 'BR-002', flno: 4, rcost: 21999, rcatg: 'Presidential Villa & Pool', rcapc: 4, rsts: 'Available', ramenities: '["WiFi", "AC", "Private Infinity Pool", "Royal Butler", "Helipad Access"]', rimage: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80', rbedroom_image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80', rbathroom_image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', rview_image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80' },

        // --- BRANCH 3: Munnar Tea Hills Retreat (BR-003) ---
        { rid: 'RM-501', rnumber: '101', pid: 'BR-003', flno: 1, rcost: 3699, rcatg: 'Standard Garden Room', rcapc: 2, rsts: 'Available', ramenities: '["WiFi", "Tea Garden View", "Organic Chai"]', rimage: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1000&q=80', rbedroom_image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80', rbathroom_image: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80', rview_image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80' },
        { rid: 'RM-502', rnumber: '102', pid: 'BR-003', flno: 1, rcost: 5799, rcatg: 'Executive Heritage Deluxe', rcapc: 2, rsts: 'Occupied', ramenities: '["WiFi", "AC", "Mist Valley Balcony", "Fireplace"]', rimage: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1000&q=80', rbedroom_image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80', rbathroom_image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=800&q=80', rview_image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80' },
        { rid: 'RM-503', rnumber: '201', pid: 'BR-003', flno: 2, rcost: 3699, rcatg: 'Standard Garden Room', rcapc: 2, rsts: 'Available', ramenities: '["WiFi", "Breakfast", "Mountain View"]', rimage: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1000&q=80', rbedroom_image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80', rbathroom_image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80', rview_image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80' },
        { rid: 'RM-504', rnumber: '202', pid: 'BR-003', flno: 2, rcost: 11999, rcatg: 'Royal Maharajah Suite', rcapc: 3, rsts: 'Available', ramenities: '["WiFi", "AC", "Private Plantation Lounge", "Jacuzzi"]', rimage: 'https://images.unsplash.com/photo-1590490359683-658d3d23f972?auto=format&fit=crop&w=1000&q=80', rbedroom_image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80', rbathroom_image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80', rview_image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80' },
        { rid: 'RM-505', rnumber: '301', pid: 'BR-003', flno: 3, rcost: 17999, rcatg: 'Presidential Villa & Pool', rcapc: 4, rsts: 'Available', ramenities: '["WiFi", "AC", "Private Heated Pool", "Estate Butler"]', rimage: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1000&q=80', rbedroom_image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80', rbathroom_image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', rview_image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80' },
        { rid: 'RM-506', rnumber: '302', pid: 'BR-003', flno: 3, rcost: 5799, rcatg: 'Executive Heritage Deluxe', rcapc: 2, rsts: 'Available', ramenities: '["WiFi", "AC", "Tea Plantation Balcony"]', rimage: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1000&q=80', rbedroom_image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80', rbathroom_image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=800&q=80', rview_image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80' }
    ],
    bookings: [
        // Currently Staying (CheckedIn) Guests
        { bid: 'BK-1001', gid: 'USR-101', rid: 'RM-102', pid: 'BR-001', bdt: '2026-07-10', cindt: '2026-07-14', coutdt: '2026-07-31', bamt: 101983.00, bdeposit: 20396.00, bremaining: 81587.00, bpymtsts: '20% Deposit Paid', bsts: 'CheckedIn', bspecial: 'Late check-in requested', brating: null, bfeedback: null, bfeedbackdt: null },
        { bid: 'BK-1002', gid: 'USR-103', rid: 'RM-502', pid: 'BR-003', bdt: '2026-07-18', cindt: '2026-07-20', coutdt: '2026-07-30', bamt: 57990.00, bdeposit: 11598.00, bremaining: 46392.00, bpymtsts: '20% Deposit Paid', bsts: 'CheckedIn', bspecial: 'Honeymoon arrangement with flower decoration', brating: null, bfeedback: null, bfeedbackdt: null },
        { bid: 'BK-1005', gid: 'USR-105', rid: 'RM-201', pid: 'BR-001', bdt: '2026-07-20', cindt: '2026-07-25', coutdt: '2026-07-30', bamt: 29995.00, bdeposit: 5999.00, bremaining: 23996.00, bpymtsts: '20% Deposit Paid', bsts: 'CheckedIn', bspecial: 'Sea view balcony, extra pillows requested', brating: null, bfeedback: null, bfeedbackdt: null },
        { bid: 'BK-1006', gid: 'USR-106', rid: 'RM-401', pid: 'BR-002', bdt: '2026-07-22', cindt: '2026-07-26', coutdt: '2026-07-31', bamt: 32495.00, bdeposit: 6499.00, bremaining: 25996.00, bpymtsts: '20% Deposit Paid', bsts: 'CheckedIn', bspecial: 'Late night arrival, quiet room requested', brating: null, bfeedback: null, bfeedbackdt: null },

        // Upcoming (Confirmed) Reservations
        { bid: 'BK-1003', gid: 'USR-102', rid: 'RM-402', pid: 'BR-002', bdt: '2026-07-22', cindt: '2026-07-28', coutdt: '2026-08-02', bamt: 64995.00, bdeposit: 12999.00, bremaining: 51996.00, bpymtsts: '20% Deposit Paid', bsts: 'Confirmed', bspecial: 'Airport transfer required', brating: null, bfeedback: null, bfeedbackdt: null },
        { bid: 'BK-1007', gid: 'USR-107', rid: 'RM-504', pid: 'BR-003', bdt: '2026-07-24', cindt: '2026-07-29', coutdt: '2026-08-03', bamt: 59995.00, bdeposit: 11999.00, bremaining: 47996.00, bpymtsts: '20% Deposit Paid', bsts: 'Confirmed', bspecial: 'Tea plantation tour booking & fireplace setup', brating: null, bfeedback: null, bfeedbackdt: null },
        { bid: 'BK-1008', gid: 'USR-108', rid: 'RM-301', pid: 'BR-001', bdt: '2026-07-25', cindt: '2026-08-01', coutdt: '2026-08-06', bamt: 94995.00, bdeposit: 18999.00, bremaining: 75996.00, bpymtsts: '20% Deposit Paid', bsts: 'Confirmed', bspecial: 'Private plunge pool heating & luxury champagne welcome basket', brating: null, bfeedback: null, bfeedbackdt: null },
        { bid: 'BK-1009', gid: 'USR-109', rid: 'RM-405', pid: 'BR-002', bdt: '2026-07-26', cindt: '2026-08-05', coutdt: '2026-08-10', bamt: 64995.00, bdeposit: 12999.00, bremaining: 51996.00, bpymtsts: '20% Deposit Paid', bsts: 'Confirmed', bspecial: 'Lake Pichola boat ride reservation', brating: null, bfeedback: null, bfeedbackdt: null },

        // Past CheckedOut Stay
        { bid: 'BK-1004', gid: 'USR-104', rid: 'RM-101', pid: 'BR-001', bdt: '2026-07-01', cindt: '2026-07-05', coutdt: '2026-07-10', bamt: 17495.00, bdeposit: 3499.00, bremaining: 0.00, bpymtsts: 'Paid in Full', bsts: 'CheckedOut', bspecial: 'Quiet floor preferred', brating: 5, bfeedback: 'Outstanding hospitality and ocean view! Highly recommended.', bfeedbackdt: '2026-07-10' }
    ],
    services: [
        { sid: 'SRV-101', bid: 'BK-1001', sname: 'Ayurvedic Head & Shoulder Massage', sdescp: 'Relaxing spa session for guest in room 102', scost: 1800.00, sstatus: 'Pending', sreqat: '2026-07-15 10:30' },
        { sid: 'SRV-102', bid: 'BK-1001', sname: 'Organic Green Tea & Herbal Snacks', sdescp: 'In-room breakfast & tea tray', scost: 450.00, sstatus: 'Completed', sreqat: '2026-07-14 16:00' },
        { sid: 'SRV-103', bid: 'BK-1002', sname: 'Thermal Hydrotherapy Spa', sdescp: 'Munnar retreat wellness hydrotherapy treatment', scost: 2500.00, sstatus: 'Pending', sreqat: '2026-07-21 14:00' },
        { sid: 'SRV-104', bid: 'BK-1005', sname: 'Sunset Cocktail & Seafood Platter', sdescp: 'Beachside dining platter for room 201', scost: 1450.00, sstatus: 'Completed', sreqat: '2026-07-26 19:00' },
        { sid: 'SRV-105', bid: 'BK-1005', sname: 'Deep Tissue Body Massage', sdescp: 'Goa beach resort spa package', scost: 2200.00, sstatus: 'Pending', sreqat: '2026-07-27 11:00' },
        { sid: 'SRV-106', bid: 'BK-1006', sname: 'Royal Rajasthani Thali for Dinner', sdescp: 'In-room royal palace dinner', scost: 1200.00, sstatus: 'Completed', sreqat: '2026-07-26 21:00' }
    ],
    finalBills: [
        { fbid: 'FB-1004', bid: 'BK-1004', fbillamt: 17495.00, fbpsts: 'Paid', fbroomamt: 17495.00, fbdeposit: 3499.00, fbservicesamt: 0.00, fbgeneratedat: '2026-07-10 11:30:00' }
    ]
};

function executeInMemQuery(sql, params = []) {
    const cleanSql = sql.trim().replace(/\s+/g, ' ');

    // 1. SELECT Staffs WHERE email / stid
    if (/SELECT.*FROM Staffs/i.test(cleanSql)) {
        let results = MOCK.staffs.map(s => {
            const prop = MOCK.properties.find(p => p.pid === s.pid) || {};
            return {
                id: s.stid,
                name: s.stname,
                email: s.email,
                phone: s.phn || '+91 98765-43210',
                role: s.strole,
                salary: s.stsal,
                branchId: s.pid,
                branchName: prop.pname || 'Verdant Springs Resort & Spa, North Goa',
                joinedDate: s.stjoindt,
                passwordHash: s.spass,
                status: s.status,
                cnt: MOCK.staffs.length
            };
        });

        if (params.length > 0) {
            const pVal = params[0];
            results = results.filter(s => s.email.toLowerCase() === String(pVal).toLowerCase() || s.id === pVal);
            if (params.length > 1) {
                const pVal2 = params[1];
                results = MOCK.staffs.filter(s => s.email.toLowerCase() === String(pVal).toLowerCase() || s.id === pVal || s.email.toLowerCase() === String(pVal2).toLowerCase() || s.id === pVal2);
            }
        }
        return [results];
    }

    // 2. SELECT Guests WHERE email / gid
    if (/SELECT.*FROM Guests/i.test(cleanSql)) {
        let results = MOCK.guests.map(g => ({
            id: g.gid,
            gid: g.gid,
            name: g.gname,
            gname: g.gname,
            email: g.email,
            phone: g.phn,
            phn: g.phn,
            aadhar: g.gaadhar || 'Not Provided',
            gaadhar: g.gaadhar || 'Not Provided',
            passwordHash: g.gpass,
            role: g.role || 'guest',
            regdt: g.regdt
        }));

        if (params.length > 0) {
            const pVal = params[0];
            results = results.filter(g => g.email.toLowerCase() === String(pVal).toLowerCase() || g.id === pVal || g.gid === pVal);
            if (params.length > 1) {
                const pVal2 = params[1];
                results = MOCK.guests.filter(g => g.email.toLowerCase() === String(pVal).toLowerCase() || g.id === pVal || g.email.toLowerCase() === String(pVal2).toLowerCase() || g.id === pVal2);
            }
        }
        return [results];
    }

    // 3. INSERT Guests
    if (/INSERT INTO Guests/i.test(cleanSql)) {
        const newGuest = {
            gid: params[0],
            gname: params[1],
            email: params[2],
            phn: params[3],
            gaadhar: params[4],
            gpass: params[5] || 'guest123',
            role: params[6] || 'guest',
            regdt: params[7] || new Date().toISOString().slice(0, 10)
        };
        MOCK.guests.push(newGuest);
        return [{ affectedRows: 1 }];
    }

    // 4. INSERT Staffs
    if (/INSERT INTO Staffs/i.test(cleanSql)) {
        const newStaff = {
            stid: params[0],
            stname: params[1],
            email: params[2],
            phn: params[3],
            pid: params[4] || 'BR-001',
            stsal: params[5] || 50000,
            stjoindt: params[6] || new Date().toISOString().slice(0, 10),
            strole: params[7],
            spass: params[8],
            status: params[9] || 'Active'
        };
        MOCK.staffs.push(newStaff);
        return [{ affectedRows: 1 }];
    }

    // 5. SELECT Property
    if (/SELECT.*FROM Property/i.test(cleanSql)) {
        const results = MOCK.properties.map(p => ({
            id: p.pid,
            pid: p.pid,
            name: p.pname,
            pname: p.pname,
            city: p.pcity,
            pcity: p.pcity,
            phone: p.pphone,
            email: p.pemail
        }));
        return [results];
    }

    // 6. SELECT Rooms
    if (/SELECT.*FROM Rooms/i.test(cleanSql)) {
        if (/DISTINCT.*rcatg/i.test(cleanSql)) {
            const uniqueCats = Array.from(new Set(MOCK.rooms.map(r => r.rcatg)));
            const catRows = uniqueCats.map(c => ({ id: c, name: c, rcatg: c }));
            return [catRows];
        }
        let results = MOCK.rooms.map(r => {
            const prop = MOCK.properties.find(p => p.pid === r.pid) || {};
            return {
                id: r.rid,
                rid: r.rid,
                pricePerNight: r.rcost,
                rcost: r.rcost,
                category: r.rcatg,
                rcatg: r.rcatg,
                roomNumber: r.rnumber,
                rnumber: r.rnumber,
                branchId: r.pid,
                pid: r.pid,
                branchName: prop.pname || 'Verdant Springs Resort & Spa, North Goa',
                branchCity: prop.pcity || 'Goa',
                rsts: r.rsts,
                status: r.rsts,
                ramenities: r.ramenities,
                amenities: r.ramenities,
                image: r.rimage,
                bedroomImage: r.rbedroom_image,
                bathroomImage: r.rbathroom_image,
                viewImage: r.rview_image
            };
        });
        if (params.length > 0) {
            results = results.filter(r => r.id === params[0] || r.rid === params[0]);
        }
        return [results];
    }

    // 7. UPDATE Rooms
    if (/UPDATE Rooms SET rsts = \? WHERE rid = \?/i.test(cleanSql)) {
        const [st, rid] = params;
        const rm = MOCK.rooms.find(r => r.rid === rid);
        if (rm) rm.rsts = st;
        return [{ affectedRows: 1 }];
    }

    // 8. UPDATE Guests
    if (/UPDATE Guests SET gaadhar = \?/i.test(cleanSql)) {
        const [aadh, gid] = params;
        const g = MOCK.guests.find(u => u.gid === gid);
        if (g) g.gaadhar = aadh;
        return [{ affectedRows: 1 }];
    }

    // 9. SELECT Booking
    if (/SELECT.*FROM Booking/i.test(cleanSql)) {
        let list = MOCK.bookings.map(b => {
            const guest = MOCK.guests.find(g => g.gid === b.gid) || {};
            const room = MOCK.rooms.find(r => r.rid === b.rid) || {};
            const prop = MOCK.properties.find(p => p.pid === b.pid) || {};
            const bill = MOCK.finalBills.find(fb => fb.bid === b.bid) || null;

            return {
                id: b.bid,
                bid: b.bid,
                userId: b.gid,
                gid: b.gid,
                guestName: guest.gname || 'Guest User',
                guestEmail: guest.email || '',
                guestPhone: guest.phn || '',
                guestAadhar: guest.gaadhar || 'Not Provided',
                roomId: b.rid,
                rid: b.rid,
                roomCategory: room.rcatg || 'Room',
                roomNumber: room.rnumber || '101',
                branchName: prop.pname || 'Verdant Springs Resort & Spa, North Goa',
                branchCity: prop.pcity || 'Goa',
                checkInDate: b.cindt,
                checkOutDate: b.coutdt,
                totalAmount: b.bamt,
                bamt: b.bamt,
                advanceDeposit: b.bdeposit,
                bdeposit: b.bdeposit,
                remainingBalance: b.bremaining,
                paymentStatus: b.bpymtsts,
                status: b.bsts,
                bsts: b.bsts,
                createdDate: b.bdt,
                finalBillId: bill ? bill.fbid : null,
                finalBillAmount: bill ? bill.fbillamt : null,
                finalBillStatus: bill ? bill.fbpsts : null,
                finalBillRoomAmount: bill ? bill.fbroomamt : null,
                finalBillDeposit: bill ? bill.fbdeposit : null,
                finalBillServicesAmount: bill ? bill.fbservicesamt : null,
                finalBillGeneratedAt: bill ? bill.fbgeneratedat : null,
                brating: b.brating,
                rating: b.brating,
                bfeedback: b.bfeedback,
                feedback: b.bfeedback,
                comments: b.bfeedback || '',
                date: b.bfeedbackdt || b.bdt || new Date().toISOString().slice(0, 10)
            };
        });

        if (/WHERE.*bsts IN/i.test(cleanSql)) {
            list = list.filter(b => b.bsts === 'Confirmed' || b.bsts === 'CheckedIn' || b.status === 'Confirmed' || b.status === 'CheckedIn');
        } else if (/WHERE.*bsts = \?/i.test(cleanSql)) {
            const targetStatus = params[0];
            const maxCheckIn = params[1];
            list = list.filter(b => b.bsts === targetStatus && (!maxCheckIn || b.cindt < maxCheckIn));
        } else if (/WHERE.*bid = \? AND gid = \?/i.test(cleanSql)) {
            const [targetBid, targetGid] = params;
            list = list.filter(b => (b.id === targetBid || b.bid === targetBid) && (b.userId === targetGid || b.gid === targetGid));
        } else if (/WHERE.*gid = \?/i.test(cleanSql)) {
            list = list.filter(b => b.userId === params[0] || b.gid === params[0]);
        } else if (/WHERE.*bid = \?/i.test(cleanSql)) {
            list = list.filter(b => b.id === params[0] || b.bid === params[0]);
        } else if (/WHERE.*brating IS NOT NULL/i.test(cleanSql)) {
            list = list.filter(b => b.rating !== null && b.rating !== undefined);
        }
        return [list];
    }

    // 10. INSERT Booking
    if (/INSERT INTO Booking/i.test(cleanSql)) {
        const newB = {
            bid: params[0],
            gid: params[1],
            rid: params[2],
            pid: params[3],
            bdt: params[4],
            cindt: params[5],
            coutdt: params[6],
            bamt: params[7],
            bdeposit: params[8],
            bremaining: params[9],
            bpymtsts: params[10],
            bsts: params[11],
            bspecial: params[12]
        };
        MOCK.bookings.push(newB);
        return [{ affectedRows: 1 }];
    }

    // 11. UPDATE Booking
    if (/UPDATE Booking SET brating/i.test(cleanSql)) {
        const [rating, comments, date, bid] = params;
        const b = MOCK.bookings.find(x => x.bid === bid);
        if (b) {
            b.brating = Number(rating);
            b.bfeedback = comments;
            b.bfeedbackdt = date;
        }
        return [{ affectedRows: 1 }];
    }

    if (/UPDATE Booking SET bsts = \? WHERE bid = \?/i.test(cleanSql)) {
        const [st, bid] = params;
        const b = MOCK.bookings.find(x => x.bid === bid);
        if (b) b.bsts = st;
        return [{ affectedRows: 1 }];
    }

    // 12. SELECT Service / INSERT Service
    if (/SELECT.*FROM Service/i.test(cleanSql)) {
        if (/SUM\(scost\)/i.test(cleanSql)) {
            const bid = params[0];
            const servs = MOCK.services.filter(s => s.bid === bid);
            const total = servs.reduce((sum, s) => sum + (s.scost || 0), 0);
            return [[{ total, 'SUM(scost)': total }]];
        }
        const bid = params[0];
        const servs = MOCK.services.filter(s => s.bid === bid).map(s => ({
            id: s.sid,
            type: s.sname,
            details: s.sdescp,
            cost: s.scost,
            status: s.sstatus,
            requestedAt: s.sreqat || 'Just now'
        }));
        return [servs];
    }

    if (/INSERT INTO Service/i.test(cleanSql)) {
        MOCK.services.push({
            sid: params[0],
            bid: params[1],
            sname: params[2],
            sdescp: params[3],
            scost: params[4],
            sstatus: params[5],
            sreqat: params[6]
        });
        return [{ affectedRows: 1 }];
    }

    // 13. Final_Bill
    if (/SELECT.*FROM Final_Bill/i.test(cleanSql)) {
        const bid = params[0];
        const res = MOCK.finalBills.filter(fb => fb.bid === bid);
        return [res];
    }

    if (/INSERT INTO Final_Bill/i.test(cleanSql)) {
        const existing = MOCK.finalBills.find(fb => fb.bid === params[1]);
        if (existing) {
            existing.fbillamt = params[2];
            existing.fbpsts = params[3];
        } else {
            MOCK.finalBills.push({
                fbid: params[0],
                bid: params[1],
                fbillamt: params[2],
                fbpsts: params[3],
                fbroomamt: params[4],
                fbdeposit: params[5],
                fbservicesamt: params[6],
                fbgeneratedat: params[7]
            });
        }
        return [{ affectedRows: 1 }];
    }

    if (/UPDATE Final_Bill/i.test(cleanSql)) {
        const [amt, st, bid] = params;
        const fb = MOCK.finalBills.find(x => x.bid === bid);
        if (fb) {
            fb.fbillamt = amt;
            fb.fbpsts = st;
        }
        return [{ affectedRows: 1 }];
    }

    // Default fallback empty array
    return [[]];
}

export function getDB() {
    const p = getPool();
    const originalQuery = p.query.bind(p);
    
    p.query = async (sql, params = []) => {
        try {
            return await originalQuery(sql, params);
        } catch (err) {
            if (err.code === 'ECONNREFUSED' || err.code === 'ER_ACCESS_DENIED_ERROR' || err.code === 'ENOTFOUND') {
                return executeInMemQuery(sql, params);
            }
            throw err;
        }
    };
    return p;
}

export async function getDBAsync() {
    const p = getDB();
    const [branchesRows] = await p.query('SELECT * FROM Property');
    const [guestsRows] = await p.query('SELECT * FROM Guests');
    const [roomsRows] = await p.query('SELECT * FROM Rooms');
    const [staffRows] = await p.query('SELECT * FROM Staffs');
    const [bookingsRows] = await p.query('SELECT * FROM Booking');

    return {
        users: guestsRows,
        branches: branchesRows,
        rooms: roomsRows,
        staff: staffRows,
        bookings: bookingsRows
    };
}

let inMemCache = null;

export async function initDBCache() {
    try {
        inMemCache = await getDBAsync();
    } catch(e) {
        console.error('Database connection notice:', e.message);
    }
}

export function saveDB(data) {
    inMemCache = data;
}

initDBCache();
