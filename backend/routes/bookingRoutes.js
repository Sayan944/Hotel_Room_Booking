import express from 'express';
import { getDB } from '../db.js';
import { verifyToken, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

const verhoeffD = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
    [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
    [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
    [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
    [5, 9, 8, 7, 6, 0, 1, 2, 3, 4],
    [6, 5, 9, 8, 7, 1, 0, 3, 2, 4],
    [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
    [8, 7, 6, 5, 9, 3, 2, 1, 4, 0],
    [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
];
const verhoeffP = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
    [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
    [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
    [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
    [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
    [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
    [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
];

function validateAadhaar(aadhaarStr) {
    if (!aadhaarStr) return false;
    const clean = String(aadhaarStr).replace(/[\s-]/g, '');
    return /^\d{12}$/.test(clean);
}

function getTodayString() {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

async function autoExpirePastCheckIns(db) {
    const todayStr = getTodayString();
    try {
        const [expiredBookings] = await db.query(
            'SELECT bid, rid FROM Booking WHERE bsts = ? AND DATE_FORMAT(coutdt, "%Y-%m-%d") <= ?',
            ['Confirmed', todayStr]
        );
        for (let b of expiredBookings) {
            await db.query('UPDATE Booking SET bsts = ? WHERE bid = ?', ['Expired', b.bid]);
            await db.query('UPDATE Rooms SET rsts = ? WHERE rid = ?', ['Available', b.rid]);
        }
    } catch(e) {
        console.error('Auto expire check-in error:', e.message);
    }
}

// Guest: Get My Bookings
router.get('/my', verifyToken, requireRole('guest'), async (req, res) => {
    try {
        const db = getDB();
        await autoExpirePastCheckIns(db);
        const [bookings] = await db.query(`
            SELECT 
                b.bid as id,
                b.gid as userId,
                g.gname as guestName,
                g.email as guestEmail,
                g.phn as guestPhone,
                g.gaadhar as guestAadhar,
                b.rid as roomId,
                r.rcatg as roomCategory,
                r.rnumber as roomNumber,
                p.pname as branchName,
                p.pcity as branchCity,
                DATE_FORMAT(b.cindt, "%Y-%m-%d") as checkInDate,
                DATE_FORMAT(b.coutdt, "%Y-%m-%d") as checkOutDate,
                b.bamt as totalAmount,
                b.bdeposit as advanceDeposit,
                b.bremaining as remainingBalance,
                b.bpymtsts as paymentStatus,
                b.bsts as status,
                DATE_FORMAT(b.bdt, "%Y-%m-%d") as createdDate,
                fb.fbid as finalBillId,
                fb.fbillamt as finalBillAmount,
                fb.fbpsts as finalBillStatus,
                fb.fbroomamt as finalBillRoomAmount,
                fb.fbdeposit as finalBillDeposit,
                fb.fbservicesamt as finalBillServicesAmount,
                fb.fbgeneratedat as finalBillGeneratedAt,
                b.brating as rating,
                b.bfeedback as feedback
            FROM Booking b
            LEFT JOIN Guests g ON b.gid = g.gid
            JOIN Rooms r ON b.rid = r.rid
            LEFT JOIN Property p ON b.pid = p.pid
            LEFT JOIN Final_Bill fb ON b.bid = fb.bid
            WHERE b.gid = ?
            ORDER BY b.cindt DESC
        `, [req.user.id]);
        
        for (let booking of bookings) {
            const [services] = await db.query('SELECT sid as id, sname as type, sdescp as details, scost as cost, sstatus as status, sreqat as requestedAt FROM Service WHERE bid = ?', [booking.id]);
            booking.serviceRequests = services;

            if (booking.finalBillId) {
                booking.finalBill = {
                    fbid: booking.finalBillId,
                    fbillamt: booking.finalBillAmount,
                    fbpsts: booking.finalBillStatus,
                    roomAmount: booking.finalBillRoomAmount,
                    advanceDepositPaid: booking.finalBillDeposit,
                    servicesAmount: booking.finalBillServicesAmount,
                    generatedAt: booking.finalBillGeneratedAt
                };
            } else {
                booking.finalBill = null;
            }
        }

        res.json(bookings);
    } catch (err) {
        console.error('Get my bookings error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Guest / Staff: Create Reservation or Walk-In Registration
router.post('/', verifyToken, requireRole('guest', 'frontdesk', 'admin'), async (req, res) => {
    const { roomId, checkInDate, checkOutDate, specialRequests, aadharNumber, guestName, guestEmail, guestPhone, status } = req.body;

    if (!roomId || !checkInDate || !checkOutDate) {
        return res.status(400).json({ error: 'Room selection and check-in/out dates are required.' });
    }

    const isStaff = req.user.role === 'frontdesk' || req.user.role === 'admin';

    if (!isStaff && (!aadharNumber || !validateAadhaar(aadharNumber))) {
        return res.status(400).json({ error: 'Please enter a valid 12-digit Aadhaar card number.' });
    }

    const todayStr = getTodayString();
    if (!isStaff && checkInDate < todayStr) {
        return res.status(400).json({ error: 'Check-in date cannot be earlier than the current date.' });
    }

    if (checkOutDate <= checkInDate) {
        return res.status(400).json({ error: 'Check-out date must be after check-in date.' });
    }

    try {
        const db = getDB();

        let targetGuestId = req.user.id;
        let targetGuestName = req.user.name;
        let targetGuestEmail = req.user.email;
        let cleanedAadhar = aadharNumber ? String(aadharNumber).replace(/\s/g, '') : null;

        if (isStaff && (guestEmail || guestName)) {
            // Find existing guest or create guest profile
            const [existingGuests] = await db.query('SELECT gid, gname, email, gaadhar FROM Guests WHERE email = ?', [guestEmail || 'walkin@luxestay.in']);
            if (existingGuests.length > 0) {
                targetGuestId = existingGuests[0].gid;
                targetGuestName = existingGuests[0].gname;
                targetGuestEmail = existingGuests[0].email;
                if (!cleanedAadhar) cleanedAadhar = existingGuests[0].gaadhar;
            } else {
                const newGid = 'USR-' + Date.now().toString().slice(-6);
                targetGuestId = newGid;
                targetGuestName = guestName || 'Walk-In Guest';
                targetGuestEmail = guestEmail || `walkin.${Date.now()}@luxestay.in`;
                await db.query(
                    'INSERT INTO Guests (gid, gname, email, phn, gaadhar, gpass, role, regdt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                    [newGid, targetGuestName, targetGuestEmail, guestPhone || '+91 98765-43210', cleanedAadhar, 'walkin123', 'guest', todayStr]
                );
            }
        }

        const [rooms] = await db.query('SELECT rid as id, rcost as pricePerNight, rcatg as category, rnumber as roomNumber, pid as branchId FROM Rooms WHERE rid = ?', [roomId]);
        
        if (rooms.length === 0) {
            return res.status(404).json({ error: 'Selected room does not exist.' });
        }
        const room = rooms[0];

        const start = new Date(checkInDate);
        const end = new Date(checkOutDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
        const totalAmount = diffDays * room.pricePerNight;
        const advanceDeposit = Math.round(totalAmount * 0.20);
        const remainingBalance = totalAmount - advanceDeposit;
        
        const bid = 'BK-' + Date.now().toString().slice(-6);
        const createdDate = todayStr;
        const initialStatus = isStaff ? (status || 'CheckedIn') : 'Confirmed';

        await db.query(
            'INSERT INTO Booking (bid, gid, rid, pid, bdt, cindt, coutdt, bamt, bdeposit, bremaining, bpymtsts, bsts, bspecial) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [bid, targetGuestId, roomId, room.branchId || 'BR-001', createdDate, checkInDate, checkOutDate, totalAmount, advanceDeposit, remainingBalance, '20% Deposit Paid', initialStatus, specialRequests || 'Walk-in registration at Front Desk']
        );

        if (cleanedAadhar) {
            try {
                await db.query('UPDATE Guests SET gaadhar = ? WHERE gid = ?', [cleanedAadhar, targetGuestId]);
            } catch(e) {}
        }

        await db.query('UPDATE Rooms SET rsts = ? WHERE rid = ?', ['Occupied', roomId]);

        const newBooking = {
            id: bid,
            userId: targetGuestId,
            guestName: targetGuestName,
            guestEmail: targetGuestEmail,
            guestAadhar: cleanedAadhar || 'Recorded at Desk',
            branchId: room.branchId,
            roomId: room.id,
            roomCategory: room.category,
            roomNumber: room.roomNumber,
            checkInDate,
            checkOutDate,
            totalAmount,
            advanceDeposit,
            remainingBalance,
            paymentStatus: '20% Deposit Paid',
            status: initialStatus,
            createdDate,
            specialRequests: specialRequests || 'Walk-in registration at Front Desk',
            serviceRequests: []
        };

        res.status(201).json({ message: 'Walk-in guest registered and checked-in successfully!', booking: newBooking });
    } catch (err) {
        console.error('Create booking error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Guest: Request Service / Housekeeping for Stay
router.post('/:id/services', verifyToken, requireRole('guest'), async (req, res) => {
    const { id } = req.params;
    const { type, details, cost } = req.body;

    if (!type || !details) {
        return res.status(400).json({ error: 'Service type and details are required.' });
    }

    const SERVICE_PRICES = {
        'Room Service': 450,
        'Gourmet Indian Dining': 450,
        'Housekeeping': 0,
        'Laundry': 350,
        'Towel Refresh': 0,
        'Spa': 1800
    };
    const finalCost = (cost !== undefined && cost !== null && cost !== '') ? Number(cost) : (SERVICE_PRICES[type] || 0);

    try {
        const db = getDB();
        let [bookings] = await db.query('SELECT bid, bsts FROM Booking WHERE bid = ? AND gid = ?', [id, req.user.id]);
        if (bookings.length === 0) {
            const [bFallback] = await db.query('SELECT b.bid, b.bsts FROM Booking b JOIN Guests g ON b.gid = g.gid WHERE b.bid = ? AND (b.gid = ? OR LOWER(g.email) = LOWER(?))', [id, req.user.id, req.user.email || '']);
            if (bFallback.length > 0) {
                bookings = bFallback;
            } else {
                const [bByBid] = await db.query('SELECT bid, bsts FROM Booking WHERE bid = ?', [id]);
                if (bByBid.length > 0) bookings = bByBid;
            }
        }
        
        if (bookings.length === 0) {
            return res.status(404).json({ error: 'No active booking found under guest.' });
        }

        if (bookings[0].bsts === 'Cancelled' || bookings[0].bsts === 'CheckedOut') {
            return res.status(400).json({ error: 'Cannot request service for a cancelled or checked-out booking.' });
        }

        const sid = 'SR-' + Date.now().toString().slice(-5);
        const reqTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        await db.query(
            'INSERT INTO Service (sid, bid, sname, sdescp, scost, sstatus, sreqat) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [sid, id, type, details, finalCost, 'Pending', reqTime]
        );

        const newService = {
            id: sid,
            type,
            details,
            cost: finalCost,
            status: 'Pending',
            requestedAt: reqTime
        };

        res.status(201).json({ message: 'Service request submitted to front desk.', service: newService });
    } catch (err) {
        console.error('Create service request error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Admin / FrontDesk: Get All Bookings
router.get('/', verifyToken, requireRole(['admin', 'frontdesk']), async (req, res) => {
    try {
        const db = getDB();
        await autoExpirePastCheckIns(db);
        const [allBookings] = await db.query(`
            SELECT 
                b.bid as id,
                b.gid as userId,
                g.gname as guestName,
                g.email as guestEmail,
                g.phn as guestPhone,
                g.gaadhar as guestAadhar,
                b.rid as roomId,
                r.rcatg as roomCategory,
                r.rnumber as roomNumber,
                p.pname as branchName,
                DATE_FORMAT(b.cindt, "%Y-%m-%d") as checkInDate,
                DATE_FORMAT(b.coutdt, "%Y-%m-%d") as checkOutDate,
                b.bamt as totalAmount,
                b.bdeposit as advanceDeposit,
                b.bremaining as remainingBalance,
                b.bpymtsts as paymentStatus,
                b.bsts as status,
                DATE_FORMAT(b.bdt, "%Y-%m-%d") as createdDate,
                fb.fbid as finalBillId,
                fb.fbillamt as finalBillAmount,
                fb.fbpsts as finalBillStatus,
                fb.fbroomamt as finalBillRoomAmount,
                fb.fbdeposit as finalBillDeposit,
                fb.fbservicesamt as finalBillServicesAmount,
                fb.fbgeneratedat as finalBillGeneratedAt
            FROM Booking b
            LEFT JOIN Guests g ON b.gid = g.gid
            JOIN Rooms r ON b.rid = r.rid
            LEFT JOIN Property p ON b.pid = p.pid
            LEFT JOIN Final_Bill fb ON b.bid = fb.bid
            ORDER BY b.cindt ASC
        `);
        
        for (let booking of allBookings) {
            const [services] = await db.query('SELECT sid as id, sname as type, sdescp as details, scost as cost, sstatus as status, sreqat as requestedAt FROM Service WHERE bid = ?', [booking.id]);
            booking.serviceRequests = services;

            if (booking.finalBillId) {
                booking.finalBill = {
                    fbid: booking.finalBillId,
                    fbillamt: booking.finalBillAmount,
                    fbpsts: booking.finalBillStatus,
                    roomAmount: booking.finalBillRoomAmount,
                    advanceDepositPaid: booking.finalBillDeposit,
                    servicesAmount: booking.finalBillServicesAmount,
                    generatedAt: booking.finalBillGeneratedAt
                };
            } else {
                booking.finalBill = null;
            }
        }

        res.json(allBookings);
    } catch (err) {
        console.error('Get all bookings error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Admin / FrontDesk: Update Booking Status (Check In / Out / Cancel)
router.patch('/:id/status', verifyToken, requireRole(['admin', 'frontdesk']), async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const db = getDB();
        const [bookings] = await db.query(`
            SELECT b.bid, b.rid, b.gid, g.gname as guestName, g.email as guestEmail, g.gaadhar as guestAadhar, DATE_FORMAT(b.cindt, "%Y-%m-%d") as checkInDate, DATE_FORMAT(b.coutdt, "%Y-%m-%d") as checkOutDate, b.bamt, b.bdeposit 
            FROM Booking b
            LEFT JOIN Guests g ON b.gid = g.gid
            WHERE b.bid = ?
        `, [id]);
        
        if (bookings.length === 0) {
            return res.status(404).json({ error: 'Booking not found.' });
        }
        
        const booking = bookings[0];
        const todayStr = getTodayString();

        if (status === 'CheckedIn') {
            if (todayStr < booking.checkInDate) {
                return res.status(400).json({ error: `Check-in is permitted starting on ${booking.checkInDate}. Today is ${todayStr}.` });
            }
            if (todayStr >= booking.checkOutDate) {
                await db.query('UPDATE Booking SET bsts = ? WHERE bid = ?', ['Expired', id]);
                await db.query('UPDATE Rooms SET rsts = ? WHERE rid = ?', ['Available', booking.rid]);
                return res.status(400).json({ error: `Cannot check in: Stay period ending on ${booking.checkOutDate} has already passed. This reservation has expired.` });
            }
        }

        await db.query('UPDATE Booking SET bsts = ? WHERE bid = ?', [status, id]);

        let finalBillData = null;

        if (status === 'CheckedIn') {
            await db.query('UPDATE Rooms SET rsts = ? WHERE rid = ?', ['Occupied', booking.rid]);
        } else if (status === 'CheckedOut') {
            await db.query('UPDATE Rooms SET rsts = ? WHERE rid = ?', ['Dirty', booking.rid]);
            
            // Auto generate final bill on checkout
            const [services] = await db.query('SELECT SUM(scost) as total FROM Service WHERE bid = ?', [id]);
            const servicesTotal = Number(services[0].total) || 0;
            const roomAmount = Number(booking.bamt) || 0;
            const advanceDepositPaid = Number(booking.bdeposit) || Math.round(roomAmount * 0.20);
            const finalBillAmount = Math.max(0, (roomAmount + servicesTotal) - advanceDepositPaid);
            const fbid = 'FBIL-' + Date.now().toString().slice(-6);
            const generatedAt = new Date().toISOString();

            await db.query(
                'INSERT INTO Final_Bill (fbid, bid, fbillamt, fbpsts, fbroomamt, fbdeposit, fbservicesamt, fbgeneratedat) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE fbillamt=?, fbpsts=?',
                [fbid, id, finalBillAmount, 'Paid', roomAmount, advanceDepositPaid, servicesTotal, generatedAt, finalBillAmount, 'Paid']
            );

            finalBillData = {
                fbid,
                fbillamt: finalBillAmount,
                fbpsts: 'Paid',
                roomAmount,
                advanceDepositPaid,
                servicesAmount: servicesTotal,
                generatedAt
            };
        } else if (status === 'Cancelled') {
            await db.query('UPDATE Rooms SET rsts = ? WHERE rid = ?', ['Available', booking.rid]);
        }

        const updatedBooking = {
            ...booking,
            id,
            status,
            finalBill: finalBillData
        };

        res.json({ message: 'Booking status updated', booking: updatedBooking, finalBill: finalBillData });
    } catch (err) {
        console.error('Update booking status error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Admin / FrontDesk: Complete Service Request
router.patch('/:bookingId/services/:serviceId', verifyToken, requireRole(['admin', 'frontdesk']), async (req, res) => {
    const { bookingId, serviceId } = req.params;
    const { status = 'Completed' } = req.body;

    try {
        const db = getDB();
        const [result] = await db.query('UPDATE Service SET sstatus = ? WHERE sid = ? AND bid = ?', [status, serviceId, bookingId]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Service request not found for this booking.' });
        }

        res.json({ message: 'Service status updated', service: { id: serviceId, status } });
    } catch (err) {
        console.error('Complete service request error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Guest / Staff: Cancel Reservation
router.post('/:id/cancel', verifyToken, requireRole(['guest', 'admin', 'frontdesk']), async (req, res) => {
    const { id } = req.params;
    
    try {
        const db = getDB();
        const [bookings] = await db.query(`
            SELECT b.bid, b.gid, b.bsts, b.rid, g.email as guestEmail 
            FROM Booking b 
            LEFT JOIN Guests g ON b.gid = g.gid 
            WHERE b.bid = ?
        `, [id]);
        
        if (bookings.length === 0) {
            return res.status(404).json({ error: 'Booking reservation not found.' });
        }
        
        const booking = bookings[0];

        const isAuthorized = req.user.role === 'admin' || 
                             req.user.role === 'frontdesk' || 
                             booking.gid === req.user.id || 
                             (booking.guestEmail && req.user.email && booking.guestEmail.toLowerCase() === req.user.email.toLowerCase());

        if (!isAuthorized) {
            return res.status(403).json({ error: 'Not authorized to cancel this reservation.' });
        }

        if (booking.bsts === 'CheckedOut' || booking.bsts === 'Cancelled') {
            return res.status(400).json({ error: 'Reservation cannot be cancelled at this stage.' });
        }

        await db.query('UPDATE Booking SET bsts = ? WHERE bid = ?', ['Cancelled', id]);
        await db.query('UPDATE Rooms SET rsts = ? WHERE rid = ?', ['Available', booking.rid]);

        res.json({ message: 'Reservation cancelled successfully and room freed.', booking: { id } });
    } catch (err) {
        console.error('Cancel booking error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// FrontDesk / Admin: Generate Final Bill
router.post('/:id/final-bill', verifyToken, requireRole(['admin', 'frontdesk']), async (req, res) => {
    const { id } = req.params;
    const { paymentStatus = 'Paid' } = req.body;

    try {
        const db = getDB();
        const [bookings] = await db.query('SELECT bamt, bdeposit FROM Booking WHERE bid = ?', [id]);
        
        if (bookings.length === 0) {
            return res.status(404).json({ error: 'Booking not found.' });
        }
        
        const roomAmount = Number(bookings[0].bamt) || 0;
        
        const [services] = await db.query('SELECT SUM(scost) as total FROM Service WHERE bid = ?', [id]);
        const servicesTotal = Number(services[0].total) || 0;
        
        const advanceDepositPaid = Number(bookings[0].bdeposit) || Math.round(roomAmount * 0.20);
        const finalBillAmount = Math.max(0, (roomAmount + servicesTotal) - advanceDepositPaid);

        const fbid = 'FBIL-' + Date.now().toString().slice(-6);

        const [existing] = await db.query('SELECT fbid FROM Final_Bill WHERE bid = ?', [id]);
        
        const generatedAt = new Date().toISOString();

        if (existing.length > 0) {
            await db.query('UPDATE Final_Bill SET fbillamt = ?, fbpsts = ? WHERE bid = ?', [finalBillAmount, paymentStatus, id]);
        } else {
            await db.query('INSERT INTO Final_Bill (fbid, bid, fbillamt, fbpsts, fbroomamt, fbdeposit, fbservicesamt, fbgeneratedat) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [fbid, id, finalBillAmount, paymentStatus, roomAmount, advanceDepositPaid, servicesTotal, generatedAt]);
        }

        const finalBillData = {
            fbid: existing.length > 0 ? existing[0].fbid : fbid,
            fbillamt: finalBillAmount,
            fbpsts: paymentStatus,
            roomAmount,
            advanceDepositPaid,
            servicesAmount: servicesTotal,
            generatedAt
        };

        res.json({ message: 'Final bill generated successfully', finalBill: finalBillData });
    } catch (err) {
        console.error('Generate final bill error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Guest: Submit Rating & Feedback
router.post('/:id/rating', verifyToken, requireRole('guest'), async (req, res) => {
    const { id } = req.params;
    const { rating, comments } = req.body;

    if (!rating) return res.status(400).json({ error: 'Rating is required' });

    try {
        const db = getDB();
        const [bookings] = await db.query('SELECT bsts FROM Booking WHERE bid = ?', [id]);
        if (bookings.length > 0 && bookings[0].bsts === 'Cancelled') {
            return res.status(400).json({ error: 'Cannot submit a rating for a cancelled booking.' });
        }
        await db.query('UPDATE Booking SET brating = ?, bfeedback = ?, bfeedbackdt = ? WHERE bid = ?', [Number(rating), comments || '', getTodayString(), id]);
        res.json({ message: 'Rating submitted successfully' });
    } catch (err) {
        console.error('Submit rating error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

export default router;
