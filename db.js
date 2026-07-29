// Database Core for Hotel Room Management System (HMS)
// Uses localStorage for persistency

(function () {
    const STORAGE_KEY = 'hotel_hms_db_v1';

    // Mock initial data
    const SEED_DATA = {
        branches: [
            { id: 'BR-001', name: 'Emerald Vista Resort', city: 'New York', phone: '+1 212-555-0190', email: 'emerald.ny@grandresort.com' },
            { id: 'BR-002', name: 'Forest Oasis Retreat', city: 'London', phone: '+44 20-7946-0958', email: 'forest.ldn@grandresort.com' },
            { id: 'BR-003', name: 'Alpine Crest Lodge', city: 'Paris', phone: '+33 1-4227-7890', email: 'alpine.par@grandresort.com' }
        ],
        roomCategories: [
            { id: 'CAT-STD', name: 'Standard Room', price: 120, description: 'Cozy and budget-friendly with essential comforts.', amenities: ['WiFi', 'Breakfast', 'TV'] },
            { id: 'CAT-DLX', name: 'Deluxe Room', price: 200, description: 'Spacious and elegant with premium bedding and a street view.', amenities: ['WiFi', 'AC', 'Breakfast', 'Mini Bar', 'TV'] },
            { id: 'CAT-SUI', name: 'Luxury Suite', price: 380, description: 'High-end suite featuring separate living area and personal balcony.', amenities: ['WiFi', 'AC', 'Breakfast', 'Pool Access', 'Mini Bar', 'Jaccuzi', 'Coffee Maker'] },
            { id: 'CAT-EXE', name: 'Executive Penthouse', price: 650, description: 'Breathtaking top-floor view, lounge access, and round-the-clock service.', amenities: ['WiFi', 'AC', 'Breakfast', 'Pool Access', 'Gym Access', 'Mini Bar', 'Kitchenette', 'Butler Service'] }
        ],
        rooms: [
            // Branch 1 - New York
            { id: 'RM-101', roomNumber: '101', branchId: 'BR-001', category: 'Standard Room', pricePerNight: 120, amenities: ['WiFi', 'Breakfast', 'TV'], status: 'Available', popularity: 4.2 },
            { id: 'RM-102', roomNumber: '102', branchId: 'BR-001', category: 'Deluxe Room', pricePerNight: 200, amenities: ['WiFi', 'AC', 'Breakfast', 'TV'], status: 'Occupied', popularity: 4.5 },
            { id: 'RM-103', roomNumber: '103', branchId: 'BR-001', category: 'Luxury Suite', pricePerNight: 380, amenities: ['WiFi', 'AC', 'Breakfast', 'Pool Access', 'Mini Bar'], status: 'Dirty', popularity: 4.8 },
            { id: 'RM-104', roomNumber: '104', branchId: 'BR-001', category: 'Executive Penthouse', pricePerNight: 650, amenities: ['WiFi', 'AC', 'Breakfast', 'Pool Access', 'Gym Access', 'Mini Bar'], status: 'Available', popularity: 4.9 },
            
            // Branch 2 - London
            { id: 'RM-201', roomNumber: '201', branchId: 'BR-002', category: 'Standard Room', pricePerNight: 110, amenities: ['WiFi', 'TV'], status: 'Available', popularity: 4.0 },
            { id: 'RM-202', roomNumber: '202', branchId: 'BR-002', category: 'Deluxe Room', pricePerNight: 190, amenities: ['WiFi', 'AC', 'Breakfast', 'TV'], status: 'Available', popularity: 4.4 },
            { id: 'RM-203', roomNumber: '203', branchId: 'BR-002', category: 'Luxury Suite', pricePerNight: 350, amenities: ['WiFi', 'AC', 'Breakfast', 'Pool Access', 'Mini Bar'], status: 'Occupied', popularity: 4.7 },
            
            // Branch 3 - Paris
            { id: 'RM-301', roomNumber: '301', branchId: 'BR-003', category: 'Standard Room', pricePerNight: 130, amenities: ['WiFi', 'Breakfast', 'TV'], status: 'Dirty', popularity: 4.3 },
            { id: 'RM-302', roomNumber: '302', branchId: 'BR-003', category: 'Deluxe Room', pricePerNight: 210, amenities: ['WiFi', 'AC', 'Breakfast', 'TV'], status: 'Available', popularity: 4.6 },
            { id: 'RM-303', roomNumber: '303', branchId: 'BR-003', category: 'Executive Penthouse', pricePerNight: 680, amenities: ['WiFi', 'AC', 'Breakfast', 'Pool Access', 'Gym Access', 'Butler Service'], status: 'Available', popularity: 5.0 }
        ],
        staff: [
            { id: 'ST-001', name: 'Edward Miller', role: 'Front Desk Representative', phone: '+1 555-481-2290', email: 'edward@grandresort.com', branchId: 'BR-001', status: 'Active' },
            { id: 'ST-002', name: 'Sophia Watson', role: 'Housekeeping Specialist', phone: '+1 555-901-4412', email: 'sophia.w@grandresort.com', branchId: 'BR-001', status: 'Active' },
            { id: 'ST-003', name: 'Jean Pierre', role: 'General Manager', phone: '+33 6-7711-2233', email: 'jean@grandresort.com', branchId: 'BR-003', status: 'Active' },
            { id: 'ST-004', name: 'Amelia Smith', role: 'Housekeeping Specialist', phone: '+44 7700-900077', email: 'amelia.s@grandresort.com', branchId: 'BR-002', status: 'Active' },
            { id: 'ST-005', name: 'Marcus Sterling', role: 'Front Desk Representative', phone: '+44 7700-900112', email: 'marcus@grandresort.com', branchId: 'BR-002', status: 'Active' }
        ],
        bookings: [
            {
                id: 'BK-1001',
                userId: 'USR-001',
                guestName: 'Jane Doe',
                guestEmail: 'jane.doe@example.com',
                guestPhone: '+1 234-567-8901',
                branchId: 'BR-001',
                roomId: 'RM-102',
                roomCategory: 'Deluxe Room',
                checkInDate: '2026-07-15',
                checkOutDate: '2026-07-20',
                totalAmount: 1000,
                status: 'CheckedIn',
                createdDate: '2026-07-10',
                specialRequests: 'High floor, extra feather pillows.',
                serviceRequests: [
                    { id: 'SR-001', type: 'Laundry', details: 'Express suit dry cleaning', cost: 35, status: 'Completed' },
                    { id: 'SR-002', type: 'Room Service', details: 'Late-night vegetarian pasta + sparkling water', cost: 45, status: 'Pending' }
                ],
                rating: null
            },
            {
                id: 'BK-1003',
                userId: 'USR-002',
                guestName: 'David Vance',
                guestEmail: 'david.vance@yahoo.com',
                guestPhone: '+44 7911-123456',
                branchId: 'BR-002',
                roomId: 'RM-202',
                roomCategory: 'Deluxe Room',
                checkInDate: '2026-07-10',
                checkOutDate: '2026-07-14',
                totalAmount: 760,
                status: 'CheckedOut',
                createdDate: '2026-07-01',
                specialRequests: '',
                serviceRequests: [
                    { id: 'SR-003', type: 'Spa', details: 'Swedish full body massage', cost: 90, status: 'Completed' }
                ],
                rating: { score: 5, comment: 'Exquisite service! The room view of London was serene and staff went above and beyond.' }
            },
            {
                id: 'BK-1004',
                userId: 'USR-001',
                guestName: 'Jane Doe',
                guestEmail: 'jane.doe@example.com',
                guestPhone: '+1 234-567-8901',
                branchId: 'BR-001',
                roomId: 'RM-104',
                roomCategory: 'Executive Penthouse',
                checkInDate: '2026-07-22',
                checkOutDate: '2026-07-25',
                totalAmount: 1950,
                status: 'Pending',
                createdDate: '2026-07-15',
                specialRequests: 'Butler check-in arrangement',
                serviceRequests: [],
                rating: null
            }
        ],
        housekeeping: [
            { id: 'HK-001', roomId: 'RM-103', staffId: 'ST-002', status: 'Assigned', assignedAt: '2026-07-16T10:00:00.000Z', completedAt: null },
            { id: 'HK-002', roomId: 'RM-301', staffId: 'ST-004', status: 'Assigned', assignedAt: '2026-07-16T11:15:00.000Z', completedAt: null }
        ],
        currentUser: {
            id: 'USR-001',
            name: 'Jane Doe',
            email: 'jane.doe@example.com',
            phone: '+1 234-567-8901',
            address: '142 W 57th St, New York, NY 10019'
        }
    };

    // Load data from LocalStorage or seed if not present
    function loadDB() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            saveDB(SEED_DATA);
            return SEED_DATA;
        }
        try {
            return JSON.parse(stored);
        } catch (e) {
            console.error('Failed to parse database, re-seeding.', e);
            saveDB(SEED_DATA);
            return SEED_DATA;
        }
    }

    // Save data to LocalStorage
    function saveDB(data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    // Initialize database instance
    const db = loadDB();

    // Export public API
    window.HotelDB = {
        // Reset DB to initial seeds
        reset: function() {
            saveDB(SEED_DATA);
            location.reload();
        },

        // --- BRANCHES ---
        getBranches: function() {
            return db.branches;
        },
        addBranch: function(branch) {
            branch.id = 'BR-' + String(db.branches.length + 1).padStart(3, '0');
            db.branches.push(branch);
            saveDB(db);
            return branch;
        },
        deleteBranch: function(id) {
            db.branches = db.branches.filter(b => b.id !== id);
            saveDB(db);
        },

        // --- ROOM CATEGORIES ---
        getRoomCategories: function() {
            return db.roomCategories;
        },

        // --- ROOMS ---
        getRooms: function() {
            return db.rooms;
        },
        addRoom: function(room) {
            room.id = 'RM-' + Math.floor(Math.random() * 10000);
            db.rooms.push(room);
            saveDB(db);
            return room;
        },
        updateRoom: function(id, updatedFields) {
            const index = db.rooms.findIndex(r => r.id === id);
            if (index !== -1) {
                db.rooms[index] = { ...db.rooms[index], ...updatedFields };
                saveDB(db);
                return db.rooms[index];
            }
            return null;
        },
        deleteRoom: function(id) {
            db.rooms = db.rooms.filter(r => r.id !== id);
            saveDB(db);
        },

        // --- STAFF ---
        getStaff: function() {
            return db.staff;
        },
        addStaff: function(member) {
            member.id = 'ST-' + String(db.staff.length + 1).padStart(3, '0');
            db.staff.push(member);
            saveDB(db);
            return member;
        },
        deleteStaff: function(id) {
            db.staff = db.staff.filter(s => s.id !== id);
            saveDB(db);
        },

        // --- BOOKINGS ---
        getBookings: function() {
            return db.bookings;
        },
        addBooking: function(booking) {
            booking.id = 'BK-' + Math.floor(1000 + Math.random() * 9000);
            booking.createdDate = new Date().toISOString().split('T')[0];
            booking.status = booking.status || 'Pending';
            booking.serviceRequests = booking.serviceRequests || [];
            booking.rating = null;
            db.bookings.push(booking);
            saveDB(db);
            return booking;
        },
        updateBooking: function(id, updatedFields) {
            const index = db.bookings.findIndex(b => b.id === id);
            if (index !== -1) {
                db.bookings[index] = { ...db.bookings[index], ...updatedFields };
                saveDB(db);
                return db.bookings[index];
            }
            return null;
        },
        deleteBooking: function(id) {
            db.bookings = db.bookings.filter(b => b.id !== id);
            saveDB(db);
        },

        // --- HOUSEKEEPING ---
        getHousekeeping: function() {
            return db.housekeeping;
        },
        assignHousekeeper: function(roomId, staffId) {
            // Cancel existing assignments for this room if any, to avoid duplicate active ones
            db.housekeeping = db.housekeeping.filter(h => !(h.roomId === roomId && h.status === 'Assigned'));
            
            const hkId = 'HK-' + String(db.housekeeping.length + 1).padStart(3, '0');
            const newAssignment = {
                id: hkId,
                roomId: roomId,
                staffId: staffId,
                status: 'Assigned',
                assignedAt: new Date().toISOString(),
                completedAt: null
            };
            db.housekeeping.push(newAssignment);
            // Update room status
            const room = db.rooms.find(r => r.id === roomId);
            if (room) room.status = 'Dirty';
            saveDB(db);
            return newAssignment;
        },
        completeHousekeeping: function(assignmentId) {
            const assignment = db.housekeeping.find(h => h.id === assignmentId);
            if (assignment) {
                assignment.status = 'Completed';
                assignment.completedAt = new Date().toISOString();
                // Find room and mark clean (Available)
                const room = db.rooms.find(r => r.id === assignment.roomId);
                if (room) room.status = 'Available';
                saveDB(db);
                return assignment;
            }
            return null;
        },

        generateFinalBill: function(bookingId, paymentStatus = 'Paid') {
            const booking = db.bookings.find(b => b.id === bookingId);
            if (!booking) return null;

            const servicesTotal = (booking.serviceRequests || []).reduce((sum, s) => sum + (s.cost || 0), 0);
            const roomAmount = booking.totalAmount || 0;
            const advanceDepositPaid = booking.advanceDeposit || Math.round(roomAmount * 0.20);
            const finalBillAmount = Math.max(0, (roomAmount + servicesTotal) - advanceDepositPaid);

            const finalBill = {
                fbid: 'FBIL-' + Date.now().toString().slice(-6),
                fbillamt: finalBillAmount,
                fbpsts: paymentStatus,
                roomAmount,
                advanceDepositPaid,
                servicesAmount: servicesTotal,
                generatedAt: new Date().toISOString()
            };

            booking.finalBill = finalBill;
            saveDB(db);
            return finalBill;
        },

        // --- USER / SESSION ---
        getCurrentUser: function() {
            return db.currentUser;
        },
        updateCurrentUser: function(userData) {
            db.currentUser = { ...db.currentUser, ...userData };
            saveDB(db);
            return db.currentUser;
        }
    };
})();
