import express from 'express';
import { getDB } from '../db.js';
import { verifyToken, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

function normalizeAmenity(str) {
    return (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

// Get Metadata (Branches, Categories)
router.get('/meta', async (req, res) => {
    try {
        const db = getDB();
        
        // Property (Branches)
        const [properties] = await db.query('SELECT pid as id, pname as name, pcity as city, paddress as address, pphone as phone, pemail as email FROM Property');
        
        // Room Categories - get distinct categories from Rooms
        const [categories] = await db.query('SELECT DISTINCT rcatg as name FROM Rooms');
        
        res.json({
            branches: properties || [],
            roomCategories: categories.map(c => ({ id: c.name, name: c.name })) || []
        });
    } catch (err) {
        console.error('Room meta error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Get List of Rooms (Filtered)
router.get('/', async (req, res) => {
    try {
        const db = getDB();
        const { branchId, category, status, search, checkIn, checkOut, amenities } = req.query;

        let queryParams = [];
        let query = `
            SELECT 
                r.rid as id,
                r.rnumber as roomNumber,
                r.rcost as pricePerNight,
                r.rcatg as category,
                r.rsts as status,
                r.pid as branchId,
                r.ramenities as amenities,
                r.rimage as image,
                r.rbedroom_image as bedroomImage,
                r.rbathroom_image as bathroomImage,
                r.rview_image as viewImage,
                p.pname as branchName,
                p.pcity as branchCity
            FROM Rooms r
            LEFT JOIN Property p ON r.pid = p.pid
            WHERE 1=1
        `;

        if (checkIn && checkOut && checkIn !== 'undefined' && checkOut !== 'undefined') {
            query += `
                AND NOT EXISTS (
                    SELECT 1 FROM Booking b 
                    WHERE b.rid = r.rid 
                    AND b.bsts IN ('Confirmed', 'CheckedIn')
                    AND b.cindt < ? 
                    AND b.coutdt > ?
                )
            `;
            queryParams.push(checkOut, checkIn);
        }
        
        const [rooms] = await db.query(query, queryParams);
        
        let result = rooms.map(room => {
            let parsedAmenities = ['WiFi', 'TV'];
            try {
                if (room.amenities) {
                    parsedAmenities = typeof room.amenities === 'string' ? JSON.parse(room.amenities) : room.amenities;
                }
            } catch(e) {
                parsedAmenities = (room.amenities || '').split(',').map(s => s.trim()).filter(Boolean);
            }
            
            let finalStatus = room.status;
            if (checkIn && checkOut && checkIn !== 'undefined' && checkOut !== 'undefined') {
                if (finalStatus !== 'Maintenance') {
                    finalStatus = 'Available';
                }
            }

            const DEFAULT_IMAGES = {
                'Standard Garden Room': {
                    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1000&q=80',
                    bedroomImage: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
                    bathroomImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
                    viewImage: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80'
                },
                'Executive Heritage Deluxe': {
                    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80',
                    bedroomImage: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80',
                    bathroomImage: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=800&q=80',
                    viewImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
                },
                'Royal Maharajah Suite': {
                    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1000&q=80',
                    bedroomImage: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80',
                    bathroomImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
                    viewImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'
                },
                'Presidential Villa & Pool': {
                    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1000&q=80',
                    bedroomImage: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
                    bathroomImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
                    viewImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80'
                }
            };
            const defSet = DEFAULT_IMAGES[room.category] || DEFAULT_IMAGES['Standard Garden Room'];
            const mainImg = room.image || defSet.image;

            return {
                ...room,
                status: finalStatus,
                roomNumber: room.roomNumber || room.id,
                branchId: room.branchId || 'BR-001',
                branchName: room.branchName || 'Unknown Branch',
                branchCity: room.branchCity || '',
                amenities: parsedAmenities,
                image: mainImg,
                bedroomImage: room.bedroomImage || defSet.bedroomImage || mainImg,
                bathroomImage: room.bathroomImage || defSet.bathroomImage || mainImg,
                viewImage: room.viewImage || defSet.viewImage || mainImg
            };
        });

        if (branchId && branchId !== 'ALL' && branchId !== 'undefined' && branchId !== 'null') {
            const bLower = branchId.toLowerCase();
            result = result.filter(r =>
                (r.branchId || '').toLowerCase() === bLower ||
                (r.branchName || '').toLowerCase().includes(bLower) ||
                (r.branchCity || '').toLowerCase().includes(bLower)
            );
        }

        if (category && category !== 'ALL' && category !== 'undefined' && category !== 'null') {
            const cLower = category.toLowerCase();
            result = result.filter(r => (r.category || '').toLowerCase().includes(cLower));
        }

        if (status && status !== 'ALL' && status !== 'undefined' && status !== 'null') {
            result = result.filter(r => (r.status || '').toLowerCase() === status.toLowerCase());
        }

        if (amenities && amenities !== 'undefined' && amenities !== 'null' && amenities.trim() !== '') {
            const reqAmList = (Array.isArray(amenities) ? amenities : amenities.split(','))
                .map(s => s.trim())
                .filter(Boolean);

            if (reqAmList.length > 0) {
                result = result.filter(r => {
                    const roomAmNorm = (r.amenities || []).map(normalizeAmenity);
                    return reqAmList.every(reqAm => {
                        const normReq = normalizeAmenity(reqAm);
                        return roomAmNorm.some(ram => ram.includes(normReq) || normReq.includes(ram));
                    });
                });
            }
        }

        const rawQ = (search || req.query.query || req.query.q || '').trim();
        if (rawQ && rawQ !== 'undefined' && rawQ !== 'null') {
            const q = rawQ.toLowerCase();
            result = result.filter(r => 
                (r.branchName || '').toLowerCase().includes(q) ||
                (r.branchCity || '').toLowerCase().includes(q) ||
                (r.category || '').toLowerCase().includes(q) ||
                (r.roomNumber || '').toLowerCase().includes(q) ||
                (r.id || '').toLowerCase().includes(q)
            );
        }
        
        res.json(result);
    } catch (err) {
        console.error('Room search error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Admin: Add New Room
router.post('/', verifyToken, requireRole('admin'), async (req, res) => {
    const { roomNumber, branchId, category, pricePerNight, amenities, status = 'Available' } = req.body;

    if (!roomNumber || !branchId || !category || !pricePerNight) {
        return res.status(400).json({ error: 'Room number, branch, category, and price per night are required.' });
    }

    try {
        const db = getDB();
        const rid = 'RM-' + Date.now();
        const amStr = JSON.stringify(Array.isArray(amenities) ? amenities : ['WiFi', 'TV', 'Air Conditioning']);
        
        await db.query(
            'INSERT INTO Rooms (rid, rnumber, pid, flno, rcost, rcatg, rcapc, rsts, ramenities) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [rid, roomNumber, branchId, parseInt(roomNumber.charAt(0)) || 1, Number(pricePerNight), category, 2, status, amStr]
        );

        const newRoom = {
            id: rid,
            roomNumber,
            branchId,
            category,
            pricePerNight: Number(pricePerNight),
            amenities: Array.isArray(amenities) ? amenities : ['WiFi', 'TV', 'Air Conditioning'],
            status,
            popularity: 4.5
        };

        res.status(201).json({ message: 'Room created successfully', room: newRoom });
    } catch (err) {
        console.error('Add room error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Admin / FrontDesk: Update Room Status
router.patch('/:id/status', verifyToken, requireRole(['admin', 'frontdesk']), async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Available', 'Occupied', 'Dirty', 'Maintenance'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid room status value.' });
    }

    try {
        const db = getDB();
        const [result] = await db.query('UPDATE Rooms SET rsts = ? WHERE rid = ?', [status, id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Room not found.' });
        }

        res.json({ message: 'Room status updated', room: { id, status } });
    } catch (err) {
        console.error('Update room status error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

export default router;
