import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ConciergeBell, CheckCircle, Clock, UserCheck, Receipt, RefreshCw, UserPlus, Calendar, MapPin, Search, Plus, X, Bed, Users } from 'lucide-react';

export default function FrontDeskDashboard() {
    const { user, showToast } = useAuth();
    const [activeTab, setActiveTab] = useState('operations'); // 'operations' | 'billing' | 'services' | 'housekeeping' | 'guests'

    const [bookings, setBookings] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [staff, setStaff] = useState([]);
    const [branches, setBranches] = useState([]);
    const [categories, setCategories] = useState([]);
    const [guests, setGuests] = useState([]);
    const [guestSearchQuery, setGuestSearchQuery] = useState('');
    const [guestStatusFilter, setGuestStatusFilter] = useState('ALL');
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [housekeepingAssigning, setHousekeepingAssigning] = useState({});

    // Walk-in Guest Modal
    const [showWalkInModal, setShowWalkInModal] = useState(false);
    const [walkInName, setWalkInName] = useState('');
    const [walkInEmail, setWalkInEmail] = useState('');
    const [walkInPhone, setWalkInPhone] = useState('');
    const [walkInAadhaar, setWalkInAadhaar] = useState('');
    const [walkInRoomId, setWalkInRoomId] = useState('');
    const getLocalDate = (offsetDays = 0) => {
        const d = new Date();
        d.setDate(d.getDate() + offsetDays);
        return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    };

    const [walkInCheckIn, setWalkInCheckIn] = useState(() => getLocalDate(0));
    const [walkInCheckOut, setWalkInCheckOut] = useState(() => getLocalDate(1));
    const [submittingWalkIn, setSubmittingWalkIn] = useState(false);

    // Aadhar Verification check-in modal
    const [checkInConfirmBooking, setCheckInConfirmBooking] = useState(null);
    const [aadharVerified, setAadharVerified] = useState(false);

    // Final Bill Modal
    const [selectedBillBooking, setSelectedBillBooking] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [bookingsData, roomsData, metaData, staffData, guestsData] = await Promise.all([
                api.getAllBookings(),
                api.getRooms(),
                api.getRoomMeta(),
                api.getStaff().catch(() => []),
                api.getGuests().catch(() => [])
            ]);

            setBookings(bookingsData || []);
            setRooms(roomsData || []);
            setStaff(staffData || []);
            setGuests(guestsData || []);
            setBranches(metaData.branches || []);
            setCategories(metaData.roomCategories || []);

            const availRoom = (roomsData || []).find(r => r.status === 'Available');
            if (availRoom) {
                setWalkInRoomId(availRoom.id);
            }
        } catch (err) {
            showToast('Failed to load front desk data', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateBookingStatus = async (bookingId, status) => {
        try {
            await api.updateBookingStatus(bookingId, status);
            showToast(`Reservation ${bookingId} updated to ${status}`, 'success');
            loadData();
        } catch (err) {
            showToast(err.message, 'error');
        }
    };

    const handleCompleteService = async (bookingId, serviceId) => {
        try {
            await api.updateServiceStatus(bookingId, serviceId, 'Completed');
            showToast('Service order fulfilled', 'success');
            loadData();
        } catch (err) {
            showToast(err.message, 'error');
        }
    };

    const handleGenerateFinalBill = async (bookingId) => {
        try {
            const res = await api.generateFinalBill(bookingId, 'Paid');
            showToast(`Final Bill generated (${res.finalBill.fbid}) - Total: ₹${res.finalBill.fbillamt ? res.finalBill.fbillamt.toLocaleString() : 0}`, 'success');
            loadData();
        } catch (err) {
            showToast(err.message, 'error');
        }
    };

    const handleWalkInRegistration = async (e) => {
        e.preventDefault();
        if (!walkInRoomId) {
            showToast('Please select an available room for walk-in guest', 'error');
            return;
        }

        setSubmittingWalkIn(true);
        try {
            await api.createBooking({
                roomId: walkInRoomId,
                guestName: walkInName,
                guestEmail: walkInEmail,
                guestPhone: walkInPhone,
                aadharNumber: walkInAadhaar,
                checkInDate: walkInCheckIn,
                checkOutDate: walkInCheckOut,
                status: 'CheckedIn',
                specialRequests: 'Walk-in guest registration at Front Desk'
            });

            showToast(`Walk-in guest ${walkInName} registered and checked-in!`, 'success');
            setShowWalkInModal(false);
            setWalkInName('');
            setWalkInEmail('');
            setWalkInPhone('');
            setWalkInAadhaar('');
            loadData();
        } catch (err) {
            showToast(err.message || 'Failed to process walk-in registration', 'error');
        } finally {
            setSubmittingWalkIn(false);
        }
    };

    const filteredBookings = bookings.filter(b =>
        !searchQuery ||
        b.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.roomNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const pendingServiceOrders = bookings.flatMap(b =>
        (b.serviceRequests || [])
            .filter(s => s.status === 'Pending')
            .map(s => ({ ...s, bookingId: b.id, guestName: b.guestName, roomNumber: b.roomNumber }))
    );

    return (
        <div style={{ padding: '2rem' }}>
            {/* Header Title */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h2 className="font-serif" style={{ fontSize: '2rem', color: '#0f2e1e', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ConciergeBell style={{ width: '28px', height: '28px', color: '#16a34a' }} />
                        Front Desk Reception & Concierge
                    </h2>
                    <p style={{ color: '#4b5563', fontSize: '0.9rem' }}>
                        Manage daily guest arrivals, room check-in/out, service request dispatch, and final billing generation.
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => setShowWalkInModal(true)} className="btn btn-emerald" style={{ padding: '8px 16px' }}>
                        <UserPlus style={{ width: '16px', height: '16px' }} /> Walk-in Registration
                    </button>

                    <button onClick={loadData} className="btn btn-outline" style={{ padding: '8px 14px' }}>
                        <RefreshCw style={{ width: '15px', height: '15px' }} /> Refresh
                    </button>
                </div>
            </div>

            {/* Front Desk Nav Tabs */}
            <div style={{
                display: 'flex',
                gap: '12px',
                borderBottom: '1px solid #e5e7eb',
                paddingBottom: '12px',
                marginBottom: '1.5rem'
            }}>
                <button
                    onClick={() => setActiveTab('operations')}
                    className={`btn ${activeTab === 'operations' ? 'btn-primary' : 'btn-outline'}`}
                >
                    <UserCheck style={{ width: '16px', height: '16px' }} />
                    Arrivals & Check-In/Out ({bookings.length})
                </button>
                <button
                    onClick={() => setActiveTab('billing')}
                    className={`btn ${activeTab === 'billing' ? 'btn-primary' : 'btn-outline'}`}
                >
                    <Receipt style={{ width: '16px', height: '16px' }} />
                    Final Bills ({bookings.filter(b => b.finalBill).length})
                </button>
                <button
                    onClick={() => setActiveTab('services')}
                    className={`btn ${activeTab === 'services' ? 'btn-primary' : 'btn-outline'}`}
                >
                    <ConciergeBell style={{ width: '16px', height: '16px' }} />
                    Service Requests ({pendingServiceOrders.length} Pending)
                </button>
                <button
                    onClick={() => setActiveTab('housekeeping')}
                    className={`btn ${activeTab === 'housekeeping' ? 'btn-primary' : 'btn-outline'}`}
                >
                    <Bed style={{ width: '16px', height: '16px' }} />
                    Housekeeping ({rooms.filter(r => r.status === 'Dirty').length} Dirty)
                </button>
                <button
                    onClick={() => setActiveTab('guests')}
                    className={`btn ${activeTab === 'guests' ? 'btn-primary' : 'btn-outline'}`}
                >
                    <Users style={{ width: '16px', height: '16px' }} />
                    Guests Directory ({guests.length})
                </button>
            </div>

            {/* TAB 1: ARRIVALS & CHECK-IN/OUT */}
            {activeTab === 'operations' && (
                <div>
                    {/* Search Bar */}
                    <div style={{ marginBottom: '1.2rem', display: 'flex', gap: '10px' }}>
                        <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
                            <Search style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', width: '15px', height: '15px', color: '#9ca3af' }} />
                            <input
                                type="text"
                                placeholder="Search by guest name, booking ID, or room number..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="input-field"
                                style={{ paddingLeft: '34px' }}
                            />
                        </div>
                    </div>

                    <div className="glass-panel" style={{ borderRadius: '10px', overflow: 'hidden', backgroundColor: '#ffffff' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb', color: '#4b5563', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                                    <th style={{ padding: '12px 16px' }}>Booking ID</th>
                                    <th style={{ padding: '12px 16px' }}>Guest Name</th>
                                    <th style={{ padding: '12px 16px' }}>Suite & Location</th>
                                    <th style={{ padding: '12px 16px' }}>Stay Dates</th>
                                    <th style={{ padding: '12px 16px' }}>Status</th>
                                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBookings.map(b => (
                                    <tr key={b.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                        <td style={{ padding: '12px 16px', fontWeight: 700, color: '#0f2e1e' }}>{b.id}</td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <div style={{ fontWeight: 600, color: '#111827' }}>{b.guestName}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{b.guestEmail}</div>
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <div style={{ fontWeight: 600, color: '#0f2e1e' }}>Room {b.roomNumber} ({b.roomCategory})</div>
                                            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{b.branchName}</div>
                                        </td>
                                        <td style={{ padding: '12px 16px', fontSize: '0.85rem', color: '#4b5563' }}>
                                            {b.checkInDate} &rarr; {b.checkOutDate}
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <span className={`badge badge-${b.status.toLowerCase()}`}>{b.status}</span>
                                        </td>
                                        <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                                            <div style={{ display: 'inline-flex', gap: '6px' }}>
                                                {b.status === 'Cancelled' ? (
                                                    <span style={{ fontWeight: 'bold', color: 'red', fontSize: '0.85rem' }}>Cancelled</span>
                                                ) : b.status !== 'CheckedIn' && b.status !== 'CheckedOut' && (
                                                    <button
                                                        onClick={() => {
                                                            setCheckInConfirmBooking(b);
                                                            setAadharVerified(false);
                                                        }}
                                                        className="btn btn-emerald"
                                                        style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                                                    >
                                                        Check In
                                                    </button>
                                                )}
                                                {b.status === 'CheckedIn' && (
                                                    <button
                                                        onClick={async () => {
                                                            try {
                                                                const updateRes = await api.updateBookingStatus(b.id, 'CheckedOut');
                                                                showToast(`Guest checked out successfully!`, 'success');
                                                                
                                                                let billObj = updateRes.finalBill;
                                                                if (!billObj) {
                                                                    const billRes = await api.generateFinalBill(b.id, 'Paid').catch(() => null);
                                                                    billObj = billRes ? billRes.finalBill : null;
                                                                }

                                                                const freshBooking = {
                                                                    ...b,
                                                                    status: 'CheckedOut',
                                                                    finalBill: billObj
                                                                };

                                                                setSelectedBillBooking(freshBooking);
                                                                setActiveTab('billing');
                                                                loadData();
                                                            } catch (err) {
                                                                showToast(err.message, 'error');
                                                            }
                                                        }}
                                                        className="btn btn-primary"
                                                        style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                                                    >
                                                        Check Out → Bill
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* TAB 2: BILLING - FINALIZED BILLS ONLY */}
            {activeTab === 'billing' && (() => {
                const finalizedBookings = bookings.filter(b => b.finalBill);
                return (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 className="font-serif" style={{ fontSize: '1.4rem', color: '#0f2e1e', margin: 0 }}>Finalized Bills</h3>
                            <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>{finalizedBookings.length} bill{finalizedBookings.length !== 1 ? 's' : ''} generated</span>
                        </div>
                        {finalizedBookings.length === 0 ? (
                            <div className="glass-panel" style={{ padding: '50px', textAlign: 'center', color: '#6b7280', borderRadius: '10px', backgroundColor: '#ffffff' }}>
                                <Receipt style={{ width: '40px', height: '40px', color: '#d1d5db', marginBottom: '12px' }} />
                                <p style={{ margin: 0, fontWeight: 600 }}>No finalized bills yet.</p>
                                <p style={{ margin: '4px 0 0', fontSize: '0.85rem' }}>Bills are generated automatically when a guest checks out, or manually from the Arrivals tab.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.2rem' }}>
                                {finalizedBookings.map(b => {
                                    const servicesTotal = (b.serviceRequests || []).reduce((sum, s) => sum + (s.cost || 0), 0);
                                    return (
                                        <div key={b.id} className="glass-panel" style={{ padding: '1.2rem', borderRadius: '10px', backgroundColor: '#ffffff', border: '1px solid #dcfce7' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                                <div>
                                                    <span style={{ fontWeight: 700, color: '#0f2e1e', fontSize: '1rem' }}>{b.finalBill.fbid}</span>
                                                    <div style={{ fontSize: '0.72rem', color: '#6b7280', marginTop: '1px' }}>Booking: {b.id}</div>
                                                </div>
                                                <span style={{ fontSize: '0.72rem', backgroundColor: '#f0fdf4', color: '#15803d', padding: '3px 8px', borderRadius: '20px', fontWeight: 700 }}>✓ {b.finalBill.fbpsts}</span>
                                            </div>

                                            <h4 style={{ fontSize: '1.05rem', color: '#111827', fontWeight: 600, marginBottom: '2px' }}>{b.guestName}</h4>
                                            <p style={{ color: '#4b5563', fontSize: '0.8rem', marginBottom: '1rem' }}>Room {b.roomNumber} ({b.roomCategory})</p>

                                            <div style={{ backgroundColor: '#f9fafb', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '10px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4b5563' }}>
                                                    <span>Room Tariff:</span>
                                                    <span style={{ fontWeight: 600 }}>₹{(b.finalBill.roomAmount || b.totalAmount || 0).toLocaleString()}</span>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4b5563' }}>
                                                    <span>Services &amp; Dining:</span>
                                                    <span style={{ fontWeight: 600 }}>₹{(b.finalBill.servicesAmount || servicesTotal).toLocaleString()}</span>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4b5563' }}>
                                                    <span>Advance Deposit Paid:</span>
                                                    <span style={{ fontWeight: 600, color: '#16a34a' }}>- ₹{(b.finalBill.advanceDepositPaid || 0).toLocaleString()}</span>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#0f2e1e', fontWeight: 700, fontSize: '0.9rem', paddingTop: '4px', borderTop: '1px solid #e5e7eb' }}>
                                                    <span>Balance Due at Checkout:</span>
                                                    <span>₹{(b.finalBill.fbillamt || 0).toLocaleString()}</span>
                                                </div>
                                            </div>

                                            <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>
                                                Generated: {new Date(b.finalBill.generatedAt).toLocaleString()}
                                            </div>

                                            <button
                                                onClick={() => setSelectedBillBooking(b)}
                                                className="btn btn-outline"
                                                style={{ width: '100%', marginTop: '12px', padding: '6px', fontSize: '0.8rem' }}
                                            >
                                                <Receipt style={{ width: '14px', height: '14px' }} /> View Printed Bill
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );
            })()}

            {/* TAB 3: SERVICE REQUEST QUEUE */}
            {activeTab === 'services' && (
                <div>
                    <h3 className="font-serif" style={{ fontSize: '1.4rem', color: '#0f2e1e', marginBottom: '1rem' }}>
                        In-Room Guest Service Orders Queue
                    </h3>

                    {pendingServiceOrders.length === 0 ? (
                        <div className="glass-panel" style={{ padding: '50px', textAlign: 'center', color: '#4b5563', borderRadius: '10px' }}>
                            No pending guest service orders in the queue.
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                            {pendingServiceOrders.map((order, idx) => (
                                <div key={idx} className="glass-panel" style={{ padding: '1.2rem', borderRadius: '10px', backgroundColor: '#ffffff' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase' }}>
                                            Room {order.roomNumber} &bull; {order.type}
                                        </span>
                                        <span className="badge badge-dirty">Pending</span>
                                    </div>

                                    <h4 style={{ fontSize: '1rem', color: '#111827', fontWeight: 600, marginBottom: '2px' }}>{order.guestName || 'Guest User'}</h4>
                                    <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '6px' }}>
                                        Requested at: {order.requestedAt || 'Just now'}
                                    </div>
                                    <p style={{ color: '#4b5563', fontSize: '0.85rem', marginBottom: '1rem', fontStyle: 'italic' }}>
                                        "{order.details}"
                                    </p>

                                    <button
                                        onClick={() => handleCompleteService(order.bookingId, order.id)}
                                        className="btn btn-emerald"
                                        style={{ width: '100%', padding: '8px', fontSize: '0.8rem' }}
                                    >
                                        <CheckCircle style={{ width: '15px', height: '15px' }} /> Fulfill & Complete Order
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* TAB 4: HOUSEKEEPING — DIRTY ROOMS + STAFF ASSIGNMENT */}
            {activeTab === 'housekeeping' && (() => {
                const dirtyRooms = rooms.filter(r => r.status === 'Dirty');
                const housekeepers = staff.filter(s => s.role && s.role.toLowerCase().includes('house'));
                return (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                            <div>
                                <h3 className="font-serif" style={{ fontSize: '1.4rem', color: '#0f2e1e', margin: 0 }}>Housekeeping — Room Cleaning Queue</h3>
                                <p style={{ color: '#6b7280', fontSize: '0.85rem', margin: '4px 0 0' }}>Rooms marked Dirty after checkout. Assign staff to clean and restore each room.</p>
                            </div>
                            <span style={{ backgroundColor: dirtyRooms.length > 0 ? '#fef3c7' : '#f0fdf4', color: dirtyRooms.length > 0 ? '#b45309' : '#15803d', padding: '6px 14px', borderRadius: '20px', fontWeight: 700, fontSize: '0.85rem' }}>
                                {dirtyRooms.length} room{dirtyRooms.length !== 1 ? 's' : ''} need cleaning
                            </span>
                        </div>

                        {dirtyRooms.length === 0 ? (
                            <div className="glass-panel" style={{ padding: '50px', textAlign: 'center', color: '#6b7280', borderRadius: '10px', backgroundColor: '#ffffff' }}>
                                <Bed style={{ width: '40px', height: '40px', color: '#d1d5db', marginBottom: '12px' }} />
                                <p style={{ margin: 0, fontWeight: 600, color: '#15803d' }}>All rooms are clean!</p>
                                <p style={{ margin: '4px 0 0', fontSize: '0.85rem' }}>No rooms currently require housekeeping attention.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '1rem' }}>
                                {dirtyRooms.map(room => {
                                    const assignedStaff = staff.find(s => s.assignedRoom === room.roomNumber);
                                    return (
                                        <div key={room.id} className="glass-panel" style={{ padding: '1.2rem', borderRadius: '10px', backgroundColor: '#ffffff', borderLeft: '4px solid #f59e0b' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                                <h4 style={{ fontSize: '1.1rem', color: '#0f2e1e', fontWeight: 700, margin: 0 }}>Room {room.roomNumber}</h4>
                                                <span style={{ backgroundColor: '#fef3c7', color: '#b45309', padding: '3px 8px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700 }}>🧹 Dirty</span>
                                            </div>
                                            <p style={{ color: '#16a34a', fontSize: '0.82rem', fontWeight: 600, margin: '0 0 2px' }}>{room.category}</p>
                                            <p style={{ color: '#6b7280', fontSize: '0.78rem', margin: '0 0 1rem' }}>{room.branchName || 'LUXESTAY Branch'}</p>

                                            <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '10px' }}>
                                                <label style={{ fontSize: '0.72rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                                                    Assign Housekeeper:
                                                </label>
                                                {housekeepers.length === 0 ? (
                                                    <p style={{ fontSize: '0.8rem', color: '#9ca3af', fontStyle: 'italic' }}>No housekeepers available</p>
                                                ) : (
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '150px', overflowY: 'auto' }}>
                                                        {housekeepers.map(s => (
                                                            <label key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', cursor: 'pointer', padding: '4px', borderRadius: '4px', backgroundColor: assignedStaff?.id === s.id ? '#f0fdf4' : 'transparent', border: assignedStaff?.id === s.id ? '1px solid #bbf7d0' : '1px solid transparent' }}>
                                                                <input
                                                                    type="radio"
                                                                    name={`housekeeper-${room.id}`}
                                                                    value={s.id}
                                                                    checked={assignedStaff?.id === s.id}
                                                                    onChange={async () => {
                                                                        const selectedId = s.id;
                                                                        if (assignedStaff && assignedStaff.id !== selectedId) {
                                                                            await api.assignStaffRoom(assignedStaff.id, '').catch(() => { });
                                                                        }
                                                                        if (selectedId) {
                                                                            await api.assignStaffRoom(selectedId, room.roomNumber).catch(() => { });
                                                                            await api.updateRoomStatus(room.id, 'Available').catch(() => { });
                                                                        }
                                                                        showToast(`Room ${room.roomNumber} assigned to ${s.name} and marked clean`, 'success');
                                                                        loadData();
                                                                    }}
                                                                    style={{ accentColor: '#16a34a', width: '16px', height: '16px', cursor: 'pointer', margin: 0 }}
                                                                />
                                                                <span style={{ color: '#111827', fontWeight: assignedStaff?.id === s.id ? 600 : 400 }}>
                                                                    {s.name} <span style={{ color: '#6b7280', fontSize: '0.75rem', fontWeight: 400 }}>({s.role})</span>
                                                                </span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                )}

                                                {assignedStaff && (
                                                    <div style={{ marginTop: '8px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '6px 10px', borderRadius: '6px', fontSize: '0.78rem', color: '#15803d', fontWeight: 600 }}>
                                                        ✓ Assigned to {assignedStaff.name}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );
            })()}

            {/* TAB 5: GUESTS DIRECTORY */}
            {activeTab === 'guests' && (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <h3 className="font-serif" style={{ fontSize: '1.5rem', color: '#0f2e1e', margin: 0 }}>Guests Directory</h3>
                            <p style={{ fontSize: '0.85rem', color: '#4b5563', margin: '4px 0 0' }}>Comprehensive database of registered hotel guests and active staying members.</p>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                            <input
                                type="text"
                                placeholder="Search guests by name, email, phone, or Aadhaar..."
                                value={guestSearchQuery}
                                onChange={(e) => setGuestSearchQuery(e.target.value)}
                                className="input-field"
                                style={{ width: '280px', margin: 0, padding: '8px 12px', fontSize: '0.85rem' }}
                            />
                            
                            <select
                                value={guestStatusFilter}
                                onChange={(e) => setGuestStatusFilter(e.target.value)}
                                className="input-field"
                                style={{ width: '180px', margin: 0, padding: '8px 12px', fontSize: '0.85rem' }}
                            >
                                <option value="ALL">All Guests</option>
                                <option value="CURRENT">Current Guests Only</option>
                            </select>
                        </div>
                    </div>

                    {(() => {
                        const filteredGuests = guests.filter(g => {
                            const q = guestSearchQuery.toLowerCase();
                            const matchesSearch = g.name.toLowerCase().includes(q) ||
                                                 g.email.toLowerCase().includes(q) ||
                                                 (g.phone && g.phone.includes(q)) ||
                                                 (g.aadhar && g.aadhar.includes(q));
                            
                            const matchesStatus = guestStatusFilter === 'ALL' || 
                                                 (guestStatusFilter === 'CURRENT' && (g.status === 'CheckedIn' || g.status === 'Confirmed'));
                            
                            return matchesSearch && matchesStatus;
                        });

                        if (filteredGuests.length === 0) {
                            return (
                                <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', backgroundColor: '#ffffff', borderRadius: '12px' }}>
                                    <p style={{ color: '#6b7280', fontSize: '1rem' }}>No guests match the search and filter criteria.</p>
                                </div>
                            );
                        }

                        return (
                            <div className="glass-panel" style={{ padding: '1.2rem', backgroundColor: '#ffffff', borderRadius: '12px' }}>
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                                        <thead>
                                            <tr style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb', color: '#374151', textAlign: 'left' }}>
                                                <th style={{ padding: '12px 10px' }}>Guest Details</th>
                                                <th style={{ padding: '12px 10px' }}>Contact</th>
                                                <th style={{ padding: '12px 10px' }}>Aadhaar ID</th>
                                                <th style={{ padding: '12px 10px' }}>Stay Status</th>
                                                <th style={{ padding: '12px 10px' }}>Active Reservation</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredGuests.map(g => (
                                                <tr key={g.email} style={{ borderBottom: '1px solid #e5e7eb', verticalAlign: 'middle' }}>
                                                    <td style={{ padding: '12px 10px' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0f2e1e', fontWeight: 700 }}>
                                                                {g.name.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <div style={{ fontWeight: 600, color: '#111827' }}>{g.name}</div>
                                                                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>ID: {g.id}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: '12px 10px' }}>
                                                        <div style={{ color: '#111827' }}>{g.email}</div>
                                                        <div style={{ color: '#6b7280', fontSize: '0.78rem' }}>{g.phone}</div>
                                                    </td>
                                                    <td style={{ padding: '12px 10px' }}>
                                                        <span style={{ fontFamily: 'monospace', fontWeight: 700, color: g.aadhar !== 'Not Provided' ? '#15803d' : '#9ca3af', backgroundColor: g.aadhar !== 'Not Provided' ? '#f0fdf4' : '#f3f4f6', padding: '3px 8px', borderRadius: '4px' }}>
                                                            {g.aadhar}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '12px 10px' }}>
                                                        <span className={`badge badge-${g.status.toLowerCase()}`}>{g.status}</span>
                                                    </td>
                                                    <td style={{ padding: '12px 10px' }}>
                                                        {g.activeBookings && g.activeBookings.length > 0 ? (
                                                            g.activeBookings.map(b => (
                                                                <div key={b.bookingId} style={{ fontSize: '0.78rem', color: '#15803d', fontWeight: 600 }}>
                                                                    Room {b.roomNumber} ({b.checkInDate} to {b.checkOutDate})
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <span style={{ color: '#9ca3af', fontSize: '0.78rem' }}>No active stay</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        );
                    })()}
                </div>
            )}

            {/* WALK-IN GUEST REGISTRATION MODAL */}
            {showWalkInModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '440px', padding: '2rem', backgroundColor: '#ffffff', borderRadius: '12px', position: 'relative' }}>
                        <button onClick={() => setShowWalkInModal(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer' }}>
                            <X style={{ width: '18px', height: '18px' }} />
                        </button>

                        <h3 className="font-serif" style={{ fontSize: '1.4rem', color: '#0f2e1e', marginBottom: '1rem' }}>
                            Walk-In Guest Registration
                        </h3>

                        <form onSubmit={handleWalkInRegistration} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                            <div>
                                <label style={{ fontSize: '0.8rem', color: '#0f2e1e', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Guest Full Name</label>
                                <input type="text" required placeholder="Marcus Vance" value={walkInName} onChange={(e) => setWalkInName(e.target.value)} className="input-field" />
                            </div>

                            <div>
                                <label style={{ fontSize: '0.8rem', color: '#0f2e1e', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Email Address</label>
                                <input type="email" required placeholder="marcus@example.com" value={walkInEmail} onChange={(e) => setWalkInEmail(e.target.value)} className="input-field" />
                            </div>

                            <div>
                                <label style={{ fontSize: '0.8rem', color: '#0f2e1e', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Phone Number</label>
                                <input type="tel" placeholder="+91 98765-43210" value={walkInPhone} onChange={(e) => setWalkInPhone(e.target.value)} className="input-field" />
                            </div>

                            <div>
                                <label style={{ fontSize: '0.8rem', color: '#0f2e1e', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Aadhaar Card Number (12 digits)</label>
                                <input type="text" placeholder="2847 5930 1847" value={walkInAadhaar} onChange={(e) => setWalkInAadhaar(e.target.value)} className="input-field" />
                            </div>

                            <div>
                                <label style={{ fontSize: '0.8rem', color: '#0f2e1e', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Select Available Suite</label>
                                <select value={walkInRoomId} onChange={(e) => setWalkInRoomId(e.target.value)} className="input-field">
                                    {rooms.filter(r => r.status === 'Available').map(r => (
                                        <option key={r.id} value={r.id}>Room {r.roomNumber} - {r.category} (₹{r.pricePerNight ? r.pricePerNight.toLocaleString() : 0}/night) - {r.branchName || ''}</option>
                                    ))}
                                </select>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                <div>
                                    <label style={{ fontSize: '0.75rem', color: '#0f2e1e', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Check-In</label>
                                    <input type="date" required value={walkInCheckIn} onChange={(e) => setWalkInCheckIn(e.target.value)} className="input-field" />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.75rem', color: '#0f2e1e', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Check-Out</label>
                                    <input type="date" required value={walkInCheckOut} onChange={(e) => setWalkInCheckOut(e.target.value)} className="input-field" />
                                </div>
                            </div>

                            <button type="submit" disabled={submittingWalkIn} className="btn btn-emerald" style={{ width: '100%', padding: '10px', borderRadius: '8px', marginTop: '4px' }}>
                                {submittingWalkIn ? 'Processing...' : 'Complete Walk-in Check-In'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* AADHAR VERIFICATION CONFIRMATION MODAL */}
            {checkInConfirmBooking && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '420px', padding: '2rem', backgroundColor: '#ffffff', borderRadius: '14px', position: 'relative', boxShadow: '0 20px 60px rgba(15,46,30,0.25)' }}>
                        <button
                            onClick={() => setCheckInConfirmBooking(null)}
                            style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer' }}
                        >
                            <X style={{ width: '18px', height: '18px' }} />
                        </button>

                        {/* Header */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.2rem' }}>
                            <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#f0fdf4', border: '2px solid #16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <UserCheck style={{ width: '20px', height: '20px', color: '#16a34a' }} />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#0f2e1e', fontFamily: '"Playfair Display", serif', fontWeight: 600 }}>Aadhar Verification Required</h3>
                                <p style={{ margin: 0, fontSize: '0.78rem', color: '#6b7280' }}>Confirm identity before check-in</p>
                            </div>
                        </div>

                        {/* Guest Summary */}
                        <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '12px 14px', marginBottom: '1.2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                <span style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: 600 }}>Booking ID</span>
                                <span style={{ fontSize: '0.82rem', color: '#0f2e1e', fontWeight: 700 }}>{checkInConfirmBooking.id}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                <span style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: 600 }}>Guest</span>
                                <span style={{ fontSize: '0.85rem', color: '#111827', fontWeight: 600 }}>{checkInConfirmBooking.guestName}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                <span style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: 600 }}>Aadhar ID</span>
                                <span style={{ fontSize: '0.85rem', color: '#16a34a', fontWeight: 700, letterSpacing: '0.05em' }}>{checkInConfirmBooking.guestAadhar || 'Not Provided'}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: 600 }}>Room</span>
                                <span style={{ fontSize: '0.82rem', color: '#0f2e1e' }}>Room {checkInConfirmBooking.roomNumber} — {checkInConfirmBooking.roomCategory}</span>
                            </div>
                        </div>

                        {/* Aadhar Verification Checkbox */}
                        <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px', padding: '14px 16px', marginBottom: '1.4rem', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                            <input
                                type="checkbox"
                                id="aadhar-verify-cb"
                                checked={aadharVerified}
                                onChange={(e) => setAadharVerified(e.target.checked)}
                                style={{ marginTop: '2px', width: '17px', height: '17px', cursor: 'pointer', flexShrink: 0, accentColor: '#16a34a' }}
                            />
                            <label htmlFor="aadhar-verify-cb" style={{ fontSize: '0.85rem', color: '#92400e', lineHeight: '1.5', cursor: 'pointer', fontWeight: 500 }}>
                                I confirm that the guest's <strong>Aadhar card has been physically inspected and verified</strong> at the front desk counter.
                            </label>
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                onClick={() => setCheckInConfirmBooking(null)}
                                className="btn btn-outline"
                                style={{ flex: 1, padding: '9px' }}
                            >
                                Cancel
                            </button>
                            <button
                                disabled={!aadharVerified}
                                onClick={async () => {
                                    await handleUpdateBookingStatus(checkInConfirmBooking.id, 'CheckedIn');
                                    setCheckInConfirmBooking(null);
                                }}
                                className="btn btn-emerald"
                                style={{ flex: 2, padding: '9px', opacity: aadharVerified ? 1 : 0.45, cursor: aadharVerified ? 'pointer' : 'not-allowed' }}
                            >
                                <UserCheck style={{ width: '15px', height: '15px' }} />
                                Proceed with Check-In
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* FINAL BILL MODAL */}
            {selectedBillBooking && selectedBillBooking.finalBill && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div className="animate-fade-in" style={{ width: '100%', maxWidth: '550px', backgroundColor: '#f9f9f7', borderRadius: '12px', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
                        {/* Top Bar */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #e5e7eb' }}>
                            <h3 style={{ margin: 0, fontSize: '1.2rem', fontFamily: '"Playfair Display", serif', color: '#111827' }}>Payment & Booking Receipt</h3>
                            <button onClick={() => setSelectedBillBooking(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4b5563' }}>
                                <X style={{ width: '20px', height: '20px' }} />
                            </button>
                        </div>

                        <div id="print-bill-area" style={{ padding: '24px', maxHeight: '75vh', overflowY: 'auto' }}>
                            <div style={{ border: '1px solid #111827', borderRadius: '8px', padding: '2rem', backgroundColor: '#f9f9f7' }}>
                                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', marginBottom: '10px' }}>
                                        <img src="/logo.png" alt="Luxestay Logo" style={{ height: '100px', objectFit: 'contain' }} />
                                        <h2 style={{ margin: 0, fontSize: '2rem', color: '#111827', fontFamily: '"Playfair Display", serif', letterSpacing: '1px', fontWeight: 700 }}>LUXESTAY RESORT</h2>
                                    </div>
                                    <p style={{ margin: '4px 0 12px', fontSize: '0.75rem', color: '#4b5563', textTransform: 'uppercase', letterSpacing: '1px' }}>Transaction Invoice & Voucher</p>
                                    <span style={{ backgroundColor: '#dcfce7', color: '#14532d', padding: '4px 12px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>
                                        Paid & Confirmed
                                    </span>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem', fontSize: '0.85rem', color: '#111827' }}>
                                    <div>
                                        <div style={{ color: '#6b7280', marginBottom: '2px' }}>Invoice Ref:</div>
                                        <div style={{ fontWeight: 600, marginBottom: '12px' }}>{selectedBillBooking.finalBill.fbid}</div>

                                        <div style={{ color: '#6b7280', marginBottom: '2px' }}>Guest Name:</div>
                                        <div style={{ fontWeight: 600 }}>{selectedBillBooking.guestName}</div>
                                    </div>
                                    <div>
                                        <div style={{ color: '#6b7280', marginBottom: '2px' }}>Date Settled:</div>
                                        <div style={{ fontWeight: 600, marginBottom: '12px' }}>{new Date(selectedBillBooking.finalBill.generatedAt).toISOString().split('T')[0]}</div>

                                        <div style={{ color: '#6b7280', marginBottom: '2px' }}>Hotel Branch:</div>
                                        <div style={{ fontWeight: 600 }}>{selectedBillBooking.branchName || 'Luxestay Resort, Main Branch'}</div>
                                    </div>
                                </div>

                                <div style={{ marginBottom: '2rem', fontSize: '0.85rem', color: '#111827' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <div>{selectedBillBooking.roomCategory} (Room {selectedBillBooking.roomNumber})</div>
                                        <div style={{ fontWeight: 500 }}>₹{(selectedBillBooking.finalBill.roomAmount || selectedBillBooking.totalAmount || 0).toLocaleString()}</div>
                                    </div>

                                    {(selectedBillBooking.serviceRequests || []).map((srv, idx) => (
                                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', paddingLeft: '12px', color: '#374151' }}>
                                            <div>↳ Service: {srv.type} ({srv.details})</div>
                                            <div>₹{(srv.cost || 0).toLocaleString()}</div>
                                        </div>
                                    ))}

                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#374151' }}>
                                        <div>Advance Deposit Paid</div>
                                        <div>-₹{(selectedBillBooking.finalBill.advanceDepositPaid || 0).toLocaleString()}</div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem', marginBottom: '2rem' }}>
                                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827' }}>Grand Total Net:</div>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#111827' }}>₹{(selectedBillBooking.finalBill.fbillamt || 0).toLocaleString()}</div>
                                </div>

                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ display: 'inline-block', letterSpacing: '4px', fontSize: '1.2rem', color: '#9ca3af', marginBottom: '8px', border: '1px solid #e5e7eb', padding: '4px 16px', borderRadius: '4px', backgroundColor: '#f3f4f6' }}>
                                        ||| | || ||| | ||| || ||| | || |||
                                    </div>
                                    <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>
                                        Please present this QR / Voucher code during Front Desk Check-in.
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ padding: '0 24px 24px', display: 'flex', gap: '10px' }}>
                            <button
                                onClick={() => {
                                    const printContent = document.getElementById('print-bill-area').innerHTML;
                                    const originalContent = document.body.innerHTML;
                                    document.body.innerHTML = printContent;
                                    window.print();
                                    document.body.innerHTML = originalContent;
                                    window.location.reload();
                                }}
                                className="btn btn-primary"
                                style={{ flex: 1, padding: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', backgroundColor: '#111827', color: '#ffffff', border: 'none', borderRadius: '6px' }}
                            >
                                <Receipt style={{ width: '16px', height: '16px' }} /> Print Invoice
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
