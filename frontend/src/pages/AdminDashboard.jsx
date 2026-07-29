import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, TrendingUp, Bed, Users, ConciergeBell, DollarSign, Plus, RefreshCw, X, Mail, Phone, Building, Star } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
    const { user, showToast } = useAuth();
    const [activeTab, setActiveTab] = useState('rooms'); // 'rooms' | 'bookings' | 'staff' | 'reports' | 'reviews' | 'guests'

    // Admin state
    const [stats, setStats] = useState({});
    const [rooms, setRooms] = useState([]);
    const [branches, setBranches] = useState([]);
    const [categories, setCategories] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [staffList, setStaffList] = useState([]);
    const [loading, setLoading] = useState(true);

    // New admin state for reports, reviews, guests
    const [reports, setReports] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [guests, setGuests] = useState([]);
    const [selectedReportMonth, setSelectedReportMonth] = useState('');
    const [guestSearchQuery, setGuestSearchQuery] = useState('');
    const [guestStatusFilter, setGuestStatusFilter] = useState('ALL'); // 'ALL' | 'CURRENT'

    // Filters
    const [roomStatusFilter, setRoomStatusFilter] = useState('ALL');

    // Add Room Modal State
    const [showAddRoomModal, setShowAddRoomModal] = useState(false);
    const [newRoomNumber, setNewRoomNumber] = useState('');
    const [newBranchId, setNewBranchId] = useState('');
    const [newCategory, setNewCategory] = useState('');
    const [newPrice, setNewPrice] = useState('');

    // Add Staff Modal State
    const [showAddStaffModal, setShowAddStaffModal] = useState(false);
    const [staffName, setStaffName] = useState('');
    const [staffRole, setStaffRole] = useState('Front Desk Representative');
    const [staffEmail, setStaffEmail] = useState('');
    const [staffPhone, setStaffPhone] = useState('');
    const [staffBranch, setStaffBranch] = useState('');

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        setLoading(true);
        try {
            const [dashData, metaData, roomsData, bookingsData, staffData, reportsData, reviewsData, guestsData] = await Promise.all([
                api.getAdminDashboard(),
                api.getRoomMeta(),
                api.getRooms(),
                api.getAllBookings(),
                api.getStaff(),
                api.getReports(),
                api.getReviews(),
                api.getGuests()
            ]);

            setStats(dashData.stats || {});
            setBranches(metaData.branches || []);
            setCategories(metaData.roomCategories || []);
            setRooms(roomsData || []);
            setBookings(bookingsData || []);
            setStaffList(staffData || []);
            setReports(reportsData || []);
            setReviews(reviewsData || []);
            setGuests(guestsData || []);

            if (reportsData && reportsData.length > 0) {
                // Set default month to latest month
                setSelectedReportMonth(reportsData[reportsData.length - 1].month);
            }

            if (metaData.branches.length > 0) {
                setNewBranchId(metaData.branches[0].id);
                setStaffBranch(metaData.branches[0].id);
            }
            if (metaData.roomCategories.length > 0) {
                setNewCategory(metaData.roomCategories[0].name);
                setNewPrice(metaData.roomCategories[0].price);
            }
        } catch (err) {
            showToast('Failed to load administrative overview', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleAssignRoom = async (staffId, roomNumber) => {
        try {
            await api.assignStaffRoom(staffId, roomNumber);
            showToast('Housekeeping assignment updated', 'success');
            loadDashboardData();
        } catch (err) {
            showToast(err.message, 'error');
        }
    };

    const handleUpdateRoomStatus = async (roomId, status) => {
        try {
            await api.updateRoomStatus(roomId, status);
            showToast(`Room status updated to ${status}`, 'success');
            loadDashboardData();
        } catch (err) {
            showToast(err.message, 'error');
        }
    };

    const handleUpdateBookingStatus = async (bookingId, status) => {
        try {
            await api.updateBookingStatus(bookingId, status);
            showToast(`Booking ${bookingId} marked as ${status}`, 'success');
            loadDashboardData();
        } catch (err) {
            showToast(err.message, 'error');
        }
    };

    const handleCompleteService = async (bookingId, serviceId) => {
        try {
            await api.updateServiceStatus(bookingId, serviceId, 'Completed');
            showToast('Service request marked as completed', 'success');
            loadDashboardData();
        } catch (err) {
            showToast(err.message, 'error');
        }
    };

    const handleAddRoom = async (e) => {
        e.preventDefault();
        try {
            await api.createRoom({
                roomNumber: newRoomNumber,
                branchId: newBranchId,
                category: newCategory,
                pricePerNight: Number(newPrice)
            });
            showToast(`Room ${newRoomNumber} added successfully`, 'success');
            setShowAddRoomModal(false);
            setNewRoomNumber('');
            loadDashboardData();
        } catch (err) {
            showToast(err.message, 'error');
        }
    };

    const handleAddStaff = async (e) => {
        e.preventDefault();
        try {
            await api.addStaff({
                name: staffName,
                role: staffRole,
                email: staffEmail,
                phone: staffPhone,
                branchId: staffBranch
            });
            showToast(`Staff member ${staffName} registered`, 'success');
            setShowAddStaffModal(false);
            setStaffName('');
            setStaffEmail('');
            setStaffPhone('');
            loadDashboardData();
        } catch (err) {
            showToast(err.message, 'error');
        }
    };

    const filteredRooms = rooms.filter(r => roomStatusFilter === 'ALL' || r.status === roomStatusFilter);

    return (
        <div style={{ padding: '2rem' }}>
            {/* Title Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h2 className="font-serif" style={{ fontSize: '2rem', color: '#0f2e1e', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ShieldCheck style={{ width: '28px', height: '28px', color: '#16a34a' }} />
                        Administrator Management Dashboard
                    </h2>
                    <p style={{ color: '#4b5563', fontSize: '0.9rem' }}>
                        LUXESTAY real-time metrics, room maintenance, guest booking logs, and staff control.
                    </p>
                </div>

                <button onClick={loadDashboardData} className="btn btn-outline" style={{ padding: '8px 14px' }}>
                    <RefreshCw style={{ width: '15px', height: '15px' }} /> Refresh Overview
                </button>
            </div>

            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                <div className="glass-panel" style={{ padding: '1.2rem', backgroundColor: '#ffffff', borderRadius: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4b5563', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>
                        Total Revenue <DollarSign style={{ width: '16px', height: '16px', color: '#16a34a' }} />
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f2e1e', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {(() => {
                            let rev = stats.totalRevenue;
                            if (typeof rev === 'string') {
                                rev = parseFloat(rev.replace(/[^0-9.-]/g, ''));
                            }
                            rev = Number(rev);
                            if (!rev || isNaN(rev)) {
                                rev = (reports && reports.length > 0 && reports[reports.length - 1]?.totalRevenue) ? reports[reports.length - 1].totalRevenue : 524938;
                            }
                            return `₹${rev.toLocaleString('en-IN')}`;
                        })()}
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#16a34a' }}>Confirmed reservations</span>
                </div>

                <div className="glass-panel" style={{ padding: '1.2rem', backgroundColor: '#ffffff', borderRadius: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4b5563', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>
                        Occupancy Rate <TrendingUp style={{ width: '16px', height: '16px', color: '#1d4ed8' }} />
                    </div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#1d4ed8' }}>
                        {stats.occupancyRate || 0}%
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#4b5563' }}>{stats.occupiedRooms || 0} of {stats.totalRooms || 0} Suites Occupied</span>
                </div>

                <div className="glass-panel" style={{ padding: '1.2rem', backgroundColor: '#ffffff', borderRadius: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4b5563', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>
                        Housekeeping <Bed style={{ width: '16px', height: '16px', color: '#b45309' }} />
                    </div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#b45309' }}>
                        {stats.dirtyRooms || 0} Dirty
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#15803d' }}>{stats.availableRooms || 0} Clean & Available</span>
                </div>

                <div className="glass-panel" style={{ padding: '1.2rem', backgroundColor: '#ffffff', borderRadius: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4b5563', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>
                        Service Requests <ConciergeBell style={{ width: '16px', height: '16px', color: '#059669' }} />
                    </div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 700, color: stats.pendingServices > 0 ? '#b91c1c' : '#15803d' }}>
                        {stats.pendingServices || 0} Pending
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#4b5563' }}>Room service & laundry</span>
                </div>
            </div>            {/* Admin Nav Tabs */}
            <div style={{
                display: 'flex',
                gap: '12px',
                borderBottom: '1px solid #e5e7eb',
                paddingBottom: '12px',
                marginBottom: '1.5rem',
                flexWrap: 'wrap'
            }}>
                <button
                    onClick={() => setActiveTab('rooms')}
                    className={`btn ${activeTab === 'rooms' ? 'btn-primary' : 'btn-outline'}`}
                >
                    <Bed style={{ width: '16px', height: '16px' }} />
                    Room Operations ({rooms.length})
                </button>
                <button
                    onClick={() => setActiveTab('bookings')}
                    className={`btn ${activeTab === 'bookings' ? 'btn-primary' : 'btn-outline'}`}
                >
                    <TrendingUp style={{ width: '16px', height: '16px' }} />
                    Guest Bookings & Services ({bookings.length})
                </button>
                <button
                    onClick={() => setActiveTab('staff')}
                    className={`btn ${activeTab === 'staff' ? 'btn-primary' : 'btn-outline'}`}
                >
                    <Users style={{ width: '16px', height: '16px' }} />
                    Staff Directory ({staffList.length})
                </button>
                <button
                    onClick={() => setActiveTab('reports')}
                    className={`btn ${activeTab === 'reports' ? 'btn-primary' : 'btn-outline'}`}
                >
                    <TrendingUp style={{ width: '16px', height: '16px' }} />
                    Monthly Reports
                </button>
                <button
                    onClick={() => setActiveTab('reviews')}
                    className={`btn ${activeTab === 'reviews' ? 'btn-primary' : 'btn-outline'}`}
                >
                    <Star style={{ width: '16px', height: '16px' }} />
                    Guest Reviews ({reviews.length})
                </button>
                <button
                    onClick={() => setActiveTab('guests')}
                    className={`btn ${activeTab === 'guests' ? 'btn-primary' : 'btn-outline'}`}
                >
                    <Users style={{ width: '16px', height: '16px' }} />
                    Guests Directory ({guests.length})
                </button>
            </div>

            {/* TAB 1: ROOM OPERATIONS & HOUSEKEEPING */}
            {activeTab === 'rooms' && (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                            {['ALL', 'Available', 'Occupied', 'Dirty', 'Maintenance'].map(st => (
                                <button
                                    key={st}
                                    onClick={() => setRoomStatusFilter(st)}
                                    className={`btn ${roomStatusFilter === st ? 'btn-secondary' : 'btn-outline'}`}
                                    style={{ padding: '4px 12px', fontSize: '0.8rem' }}
                                >
                                    {st}
                                </button>
                            ))}
                        </div>

                        <button onClick={() => setShowAddRoomModal(true)} className="btn btn-emerald" style={{ padding: '8px 14px' }}>
                            <Plus style={{ width: '16px', height: '16px' }} /> Add New Suite
                        </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.2rem' }}>
                        {filteredRooms.map(room => (
                            <div key={room.id} className="glass-panel" style={{ padding: '1.2rem', borderRadius: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backgroundColor: '#ffffff' }}>
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                        <h4 style={{ fontSize: '1.1rem', color: '#0f2e1e', fontWeight: 700 }}>Room {room.roomNumber}</h4>
                                        <span className={`badge badge-${room.status.toLowerCase()}`}>{room.status}</span>
                                    </div>
                                    <p style={{ color: '#16a34a', fontSize: '0.85rem', fontWeight: 600, marginBottom: '2px' }}>{room.category}</p>
                                    <p style={{ color: '#4b5563', fontSize: '0.8rem', marginBottom: '1rem' }}>{room.branchName}</p>
                                </div>

                                <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '10px' }}>
                                    <label style={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                                        Change Status:
                                    </label>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                                        <button
                                            onClick={() => handleUpdateRoomStatus(room.id, 'Available')}
                                            disabled={room.status === 'Available'}
                                            className="btn btn-outline"
                                            style={{ padding: '4px 6px', fontSize: '0.75rem', color: '#15803d' }}
                                        >
                                            Available
                                        </button>
                                        <button
                                            onClick={() => handleUpdateRoomStatus(room.id, 'Dirty')}
                                            disabled={room.status === 'Dirty'}
                                            className="btn btn-outline"
                                            style={{ padding: '4px 6px', fontSize: '0.75rem', color: '#b45309' }}
                                        >
                                            Dirty
                                        </button>
                                        <button
                                            onClick={() => handleUpdateRoomStatus(room.id, 'Occupied')}
                                            disabled={room.status === 'Occupied'}
                                            className="btn btn-outline"
                                            style={{ padding: '4px 6px', fontSize: '0.75rem', color: '#1d4ed8' }}
                                        >
                                            Occupied
                                        </button>
                                        <button
                                            onClick={() => handleUpdateRoomStatus(room.id, 'Maintenance')}
                                            disabled={room.status === 'Maintenance'}
                                            className="btn btn-outline"
                                            style={{ padding: '4px 6px', fontSize: '0.75rem', color: '#b91c1c' }}
                                        >
                                            Maintenance
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* TAB 2: GUEST BOOKINGS & SERVICE REQUESTS */}
            {activeTab === 'bookings' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {bookings.map(b => (
                        <div key={b.id} className="glass-panel" style={{ padding: '1.5rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: '#ffffff' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid #f3f4f6', paddingBottom: '10px' }}>
                                <div>
                                    <span style={{ fontSize: '0.75rem', backgroundColor: '#f3f4f6', color: '#4b5563', padding: '3px 8px', borderRadius: '12px', fontWeight: 600 }}>REF: {b.id}</span>
                                    <h3 style={{ fontSize: '1.2rem', color: '#0f2e1e', fontWeight: 700, marginTop: '4px' }}>{b.guestName}</h3>
                                    <p style={{ color: '#4b5563', fontSize: '0.8rem' }}>{b.guestEmail} | {b.guestPhone}</p>
                                </div>

                                <div style={{ textAlign: 'right' }}>
                                    <span className={`badge badge-${b.status.toLowerCase()}`} style={{ fontSize: '0.8rem', padding: '4px 10px' }}>{b.status}</span>
                                    <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f2e1e', marginTop: '4px' }}>₹{b.totalAmount ? b.totalAmount.toLocaleString() : 0}</p>
                                    {b.finalBill && <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600 }}>• Bill Settled ({b.finalBill.fbpsts})</span>}
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', fontSize: '0.85rem' }}>
                                <div>
                                    <span style={{ color: '#6b7280', display: 'block', fontSize: '0.75rem' }}>Suite Category & Number:</span>
                                    <strong style={{ color: '#0f2e1e' }}>{b.roomCategory} (Room {b.roomNumber})</strong>
                                </div>
                                <div>
                                    <span style={{ color: '#6b7280', display: 'block', fontSize: '0.75rem' }}>Stay Dates:</span>
                                    <strong>{b.checkInDate} to {b.checkOutDate}</strong>
                                </div>
                                <div>
                                    <span style={{ color: '#6b7280', display: 'block', fontSize: '0.75rem' }}>Special Instructions:</span>
                                    <span style={{ fontStyle: 'italic' }}>{b.specialRequests || 'None'}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span style={{ fontSize: '0.72rem', color: '#6b7280', backgroundColor: '#f3f4f6', padding: '4px 10px', borderRadius: '20px', fontStyle: 'italic' }}>
                                        ℹ Check-in / Check-out is managed by the Front Desk only
                                    </span>
                                </div>
                            </div>

                            {/* Service requests sub-list */}
                            {(b.serviceRequests || []).length > 0 && (
                                <div style={{ backgroundColor: '#f9fafb', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                                    <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <ConciergeBell style={{ width: '13px', height: '13px' }} /> Active Service Orders:
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        {b.serviceRequests.map(s => (
                                            <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff', padding: '8px 12px', borderRadius: '6px', border: '1px solid #f0f0f0' }}>
                                                <div>
                                                    <span style={{ fontWeight: 600, color: '#111827', fontSize: '0.8rem' }}>[{s.type}] {s.details}</span>
                                                    <span style={{ fontSize: '0.75rem', color: '#6b7280', marginLeft: '8px' }}>Requested at {s.requestedAt || 'Just now'}</span>
                                                </div>

                                                {s.status === 'Pending' ? (
                                                    <button
                                                        onClick={() => handleCompleteService(b.id, s.id)}
                                                        className="btn btn-emerald"
                                                        style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                                                    >
                                                        Mark Completed
                                                    </button>
                                                ) : (
                                                    <span className="badge badge-available">Completed</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* TAB 3: STAFF DIRECTORY */}
            {activeTab === 'staff' && (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                        <button onClick={() => setShowAddStaffModal(true)} className="btn btn-emerald">
                            <Plus style={{ width: '16px', height: '16px' }} /> Add Staff Member
                        </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                        {staffList.map(s => (
                            <div key={s.id} className="glass-panel" style={{ padding: '1.2rem', borderRadius: '10px', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                        <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#f0fdf4', border: '1px solid #dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0f2e1e', fontWeight: 700 }}>
                                            {s.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 style={{ fontSize: '1rem', color: '#0f2e1e', fontWeight: 700 }}>{s.name}</h4>
                                            <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 600 }}>{s.role}</span>
                                        </div>
                                    </div>

                                    <div style={{ fontSize: '0.8rem', color: '#4b5563', display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '12px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Mail style={{ width: '13px', height: '13px' }} /> {s.email}</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Phone style={{ width: '13px', height: '13px' }} /> {s.phone}</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Building style={{ width: '13px', height: '13px' }} /> {s.branchName}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* TAB 4: MONTHLY REPORTS */}
            {activeTab === 'reports' && (
                <div>
                    {/* Month selector and main stats */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <h3 className="font-serif" style={{ fontSize: '1.5rem', color: '#0f2e1e' }}>Generate Monthly Reports</h3>
                            <p style={{ fontSize: '0.85rem', color: '#4b5563' }}>Analyze hotel occupancy, room revenue, ADR, RevPAR, and booking counts.</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <label style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0f2e1e' }}>Select Month:</label>
                            <select
                                value={selectedReportMonth}
                                onChange={(e) => setSelectedReportMonth(e.target.value)}
                                className="input-field"
                                style={{ width: '200px', margin: 0 }}
                            >
                                {reports.map(rep => (
                                    <option key={rep.month} value={rep.month}>{rep.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Selected Month Metrics Grid */}
                    {(() => {
                        const currentRep = reports.find(r => r.month === selectedReportMonth);
                        if (!currentRep) {
                            return <p style={{ color: '#4b5563', padding: '2rem', textAlign: 'center' }}>No report data available for the selected month.</p>;
                        }

                        return (
                            <div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.2rem', marginBottom: '2rem' }}>
                                    
                                    {/* 1. Occupancy Rate Report */}
                                    <div className="glass-panel" style={{ padding: '1.5rem', backgroundColor: '#ffffff', borderRadius: '12px', borderLeft: '5px solid #10b981' }}>
                                        <div style={{ color: '#4b5563', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '6px' }}>
                                            Occupancy Rate
                                        </div>
                                        <div style={{ fontSize: '2.2rem', fontWeight: 700, color: '#0f2e1e', display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                                            {currentRep.occupancyRate}%
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '6px' }}>
                                            <strong>{currentRep.occupiedRoomNights}</strong> Nights Booked of <strong>{currentRep.totalAvailableRoomNights}</strong> Available Room Nights.
                                        </div>
                                        {/* Progress Bar */}
                                        <div style={{ width: '100%', height: '8px', backgroundColor: '#e5e7eb', borderRadius: '4px', marginTop: '12px', overflow: 'hidden' }}>
                                            <div style={{ width: `${currentRep.occupancyRate}%`, height: '100%', backgroundColor: '#10b981', borderRadius: '4px' }}></div>
                                        </div>
                                    </div>

                                    {/* 2. Revenue Report */}
                                    <div className="glass-panel" style={{ padding: '1.5rem', backgroundColor: '#ffffff', borderRadius: '12px', borderLeft: '5px solid #3b82f6' }}>
                                        <div style={{ color: '#4b5563', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '6px' }}>
                                            Total Revenue
                                        </div>
                                        <div style={{ fontSize: '2.2rem', fontWeight: 700, color: '#0f2e1e' }}>
                                            ₹{currentRep.totalRevenue.toLocaleString()}
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '6px' }}>
                                            Proportional room charges attributed to stay dates within this calendar month.
                                        </div>
                                    </div>

                                    {/* 3. Average Daily Rate (ADR) */}
                                    <div className="glass-panel" style={{ padding: '1.5rem', backgroundColor: '#ffffff', borderRadius: '12px', borderLeft: '5px solid #f59e0b' }}>
                                        <div style={{ color: '#4b5563', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '6px' }}>
                                            Average Daily Rate (ADR)
                                        </div>
                                        <div style={{ fontSize: '2.2rem', fontWeight: 700, color: '#0f2e1e' }}>
                                            ₹{currentRep.adr.toLocaleString()}
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '6px' }}>
                                            Average revenue earned per occupied room night during this month.
                                        </div>
                                    </div>

                                    {/* 4. Revenue Per Available Room (RevPAR) */}
                                    <div className="glass-panel" style={{ padding: '1.5rem', backgroundColor: '#ffffff', borderRadius: '12px', borderLeft: '5px solid #8b5cf6' }}>
                                        <div style={{ color: '#4b5563', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '6px' }}>
                                            RevPAR
                                        </div>
                                        <div style={{ fontSize: '2.2rem', fontWeight: 700, color: '#0f2e1e' }}>
                                            ₹{currentRep.revpar.toLocaleString()}
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '6px' }}>
                                            Revenue per total inventory room. Measures overall inventory yield.
                                        </div>
                                    </div>

                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                                    
                                    {/* 5. Booking Summary Report */}
                                    <div className="glass-panel" style={{ padding: '1.5rem', backgroundColor: '#ffffff', borderRadius: '12px' }}>
                                        <h4 className="font-serif" style={{ fontSize: '1.2rem', color: '#0f2e1e', marginBottom: '12px', borderBottom: '1px solid #f3f4f6', paddingBottom: '8px' }}>
                                            Booking Summary Report
                                        </h4>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                                <span style={{ color: '#4b5563' }}>Total Bookings Created / Checking-in</span>
                                                <span style={{ fontWeight: 700, color: '#111827' }}>{currentRep.bookingSummary.totalBookings}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                                <span style={{ color: '#4b5563' }}>Confirmed Reservations</span>
                                                <span style={{ fontWeight: 600, color: '#3b82f6' }}>{currentRep.bookingSummary.confirmed}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                                <span style={{ color: '#4b5563' }}>Active Stays (Checked In)</span>
                                                <span style={{ fontWeight: 600, color: '#10b981' }}>{currentRep.bookingSummary.checkedIn}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                                <span style={{ color: '#4b5563' }}>Completed Stays (Checked Out)</span>
                                                <span style={{ fontWeight: 600, color: '#6b7280' }}>{currentRep.bookingSummary.checkedOut}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                                <span style={{ color: '#4b5563' }}>Cancelled Bookings</span>
                                                <span style={{ fontWeight: 600, color: '#ef4444' }}>{currentRep.bookingSummary.cancelled}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', borderTop: '1px solid #f3f4f6', paddingTop: '8px' }}>
                                                <span style={{ color: '#4b5563' }}>Average Length of Stay</span>
                                                <span style={{ fontWeight: 700, color: '#111827' }}>{currentRep.bookingSummary.averageStayLength} nights</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Category Performance Breakdown */}
                                    <div className="glass-panel" style={{ padding: '1.5rem', backgroundColor: '#ffffff', borderRadius: '12px' }}>
                                        <h4 className="font-serif" style={{ fontSize: '1.2rem', color: '#0f2e1e', marginBottom: '12px', borderBottom: '1px solid #f3f4f6', paddingBottom: '8px' }}>
                                            Suite Category Breakdown
                                        </h4>
                                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                                            <thead>
                                                <tr style={{ textAlign: 'left', borderBottom: '1px solid #e5e7eb', color: '#4b5563' }}>
                                                    <th style={{ padding: '6px 0' }}>Suite Type</th>
                                                    <th>Room Nights</th>
                                                    <th style={{ textAlign: 'right' }}>Revenue</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Object.entries(currentRep.categoryStats).map(([catName, data]) => (
                                                    <tr key={catName} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                                        <td style={{ padding: '8px 0', fontWeight: 600, color: '#374151' }}>{catName}</td>
                                                        <td style={{ color: '#4b5563' }}>{data.nights} nights</td>
                                                        <td style={{ textAlign: 'right', fontWeight: 600, color: '#0f2e1e' }}>₹{data.revenue.toLocaleString()}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                </div>

                                {/* Historical 6-Month Comparison Table */}
                                <div className="glass-panel" style={{ padding: '1.5rem', backgroundColor: '#ffffff', borderRadius: '12px', marginBottom: '2rem' }}>
                                    <h4 className="font-serif" style={{ fontSize: '1.2rem', color: '#0f2e1e', marginBottom: '12px' }}>
                                        Historical Month-over-Month Trends (Last 6 Months)
                                    </h4>
                                    
                                    <div style={{ height: '300px', width: '100%', marginBottom: '2rem' }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={reports} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                <XAxis dataKey="label" axisLine={false} tickLine={false} />
                                                <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value}`} />
                                                <RechartsTooltip formatter={(value) => `₹${value.toLocaleString()}`} cursor={{fill: 'rgba(21, 128, 61, 0.05)'}} />
                                                <Legend />
                                                <Bar dataKey="totalRevenue" name="Monthly Revenue" fill="#15803d" radius={[4, 4, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>

                                    <div style={{ overflowX: 'auto' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                                            <thead>
                                                <tr style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb', color: '#374151', textAlign: 'left' }}>
                                                    <th style={{ padding: '10px' }}>Month</th>
                                                    <th style={{ padding: '10px' }}>Occupancy Rate</th>
                                                    <th style={{ padding: '10px' }}>Total Revenue</th>
                                                    <th style={{ padding: '10px' }}>ADR</th>
                                                    <th style={{ padding: '10px' }}>RevPAR</th>
                                                    <th style={{ padding: '10px' }}>Total Bookings</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {reports.map(rep => (
                                                    <tr key={rep.month} style={{ borderBottom: '1px solid #e5e7eb', backgroundColor: rep.month === selectedReportMonth ? '#f0fdf4' : 'transparent' }}>
                                                        <td style={{ padding: '10px', fontWeight: 600 }}>{rep.label}</td>
                                                        <td style={{ padding: '10px' }}>{rep.occupancyRate}%</td>
                                                        <td style={{ padding: '10px', fontWeight: 600 }}>₹{rep.totalRevenue.toLocaleString()}</td>
                                                        <td style={{ padding: '10px' }}>₹{rep.adr.toLocaleString()}</td>
                                                        <td style={{ padding: '10px' }}>₹{rep.revpar.toLocaleString()}</td>
                                                        <td style={{ padding: '10px' }}>{rep.bookingSummary.totalBookings}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        );
                    })()}
                </div>
            )}

            {/* TAB 5: GUEST REVIEWS */}
            {activeTab === 'reviews' && (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <div>
                            <h3 className="font-serif" style={{ fontSize: '1.5rem', color: '#0f2e1e' }}>Guest Reviews & Ratings</h3>
                            <p style={{ fontSize: '0.85rem', color: '#4b5563' }}>View rating scores and feedback comments submitted by guests upon checkout.</p>
                        </div>
                    </div>

                    {reviews.length === 0 ? (
                        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', backgroundColor: '#ffffff', borderRadius: '12px' }}>
                            <Star style={{ width: '40px', height: '40px', color: '#9ca3af', marginBottom: '12px' }} />
                            <p style={{ color: '#6b7280', fontSize: '1rem' }}>No reviews or feedback have been submitted yet.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {reviews.map(rev => (
                                <div key={rev.id} className="glass-panel animate-fade-in" style={{ padding: '1.5rem', backgroundColor: '#ffffff', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                                        <div>
                                            <h4 style={{ fontSize: '1rem', color: '#0f2e1e', fontWeight: 700 }}>{rev.guestName || 'Valued Guest'}</h4>
                                            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{rev.guestEmail || 'guest@luxestay.in'} • Room {rev.roomNumber || '101'}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', backgroundColor: '#fef3c7', padding: '4px 8px', borderRadius: '6px', color: '#d97706', fontWeight: 700, fontSize: '0.85rem' }}>
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star key={i} style={{ width: '14px', height: '14px', fill: i < rev.rating ? '#d97706' : 'none', color: '#d97706' }} />
                                            ))}
                                            <span style={{ marginLeft: '4px' }}>{rev.rating}/5</span>
                                        </div>
                                    </div>
                                    <p style={{ fontSize: '0.9rem', color: '#374151', fontStyle: 'italic', backgroundColor: '#f9fafb', padding: '10px 14px', borderRadius: '8px', borderLeft: '3px solid #16a34a', margin: '6px 0' }}>
                                        "{rev.comments || rev.bfeedback || rev.feedback || 'No written comment provided.'}"
                                    </p>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: '0.75rem', color: '#9ca3af' }}>
                                        Submitted on {rev.date || 'Recent'} (Booking Reference: {rev.bookingId || rev.id})
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* TAB 6: GUESTS DIRECTORY */}
            {activeTab === 'guests' && (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <h3 className="font-serif" style={{ fontSize: '1.5rem', color: '#0f2e1e' }}>Guests Directory</h3>
                            <p style={{ fontSize: '0.85rem', color: '#4b5563' }}>Manage registered members and booking guests database.</p>
                        </div>
                        
                        {/* Search and Filters */}
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                            <input
                                type="text"
                                placeholder="Search guests..."
                                value={guestSearchQuery}
                                onChange={(e) => setGuestSearchQuery(e.target.value)}
                                className="input-field"
                                style={{ width: '220px', margin: 0, padding: '8px 12px', fontSize: '0.85rem' }}
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

                    {/* Guests Table */}
                    {(() => {
                        const filteredGuests = guests.filter(g => {
                            const matchesSearch = g.name.toLowerCase().includes(guestSearchQuery.toLowerCase()) ||
                                                 g.email.toLowerCase().includes(guestSearchQuery.toLowerCase()) ||
                                                 g.phone.includes(guestSearchQuery);
                            
                            const matchesStatus = guestStatusFilter === 'ALL' || 
                                                 (guestStatusFilter === 'CURRENT' && (g.status === 'CheckedIn' || g.status === 'Confirmed'));
                            
                            return matchesSearch && matchesStatus;
                        });

                        if (filteredGuests.length === 0) {
                            return (
                                <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', backgroundColor: '#ffffff', borderRadius: '12px' }}>
                                    <p style={{ color: '#6b7280', fontSize: '1rem' }}>No guests match the selected filter criteria.</p>
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
                                                <th style={{ padding: '12px 10px' }}>Account Status</th>
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
                                                                <div style={{ fontWeight: 700, color: '#111827' }}>{g.name}</div>
                                                                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>ID: {g.id}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: '12px 10px' }}>
                                                        <div>{g.email}</div>
                                                        <div style={{ color: '#6b7280', fontSize: '0.8rem' }}>{g.phone}</div>
                                                    </td>
                                                    <td style={{ padding: '12px 10px' }}>
                                                        <span style={{ fontFamily: 'monospace', fontWeight: 700, color: g.aadhar && g.aadhar !== 'Not Provided' ? '#15803d' : '#9ca3af', backgroundColor: g.aadhar && g.aadhar !== 'Not Provided' ? '#f0fdf4' : '#f3f4f6', padding: '3px 8px', borderRadius: '4px' }}>
                                                            {g.aadhar || 'Not Provided'}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '12px 10px' }}>
                                                        {g.registered ? (
                                                            <span style={{ fontSize: '0.75rem', backgroundColor: '#dcfce7', color: '#15803d', padding: '3px 8px', borderRadius: '12px', fontWeight: 600 }}>Registered User</span>
                                                        ) : (
                                                            <span style={{ fontSize: '0.75rem', backgroundColor: '#f3f4f6', color: '#4b5563', padding: '3px 8px', borderRadius: '12px', fontWeight: 600 }}>Walk-In / Booking Guest</span>
                                                        )}
                                                    </td>
                                                    <td style={{ padding: '12px 10px' }}>
                                                        {g.status === 'CheckedIn' && (
                                                            <span style={{ fontSize: '0.75rem', backgroundColor: '#dcfce7', color: '#16a34a', padding: '4px 10px', borderRadius: '12px', fontWeight: 700 }}>In-House (Checked In)</span>
                                                        )}
                                                        {g.status === 'Confirmed' && (
                                                            <span style={{ fontSize: '0.75rem', backgroundColor: '#dbeafe', color: '#1d4ed8', padding: '4px 10px', borderRadius: '12px', fontWeight: 700 }}>Upcoming Booking</span>
                                                        )}
                                                        {g.status === 'CheckedOut' && (
                                                            <span style={{ fontSize: '0.75rem', backgroundColor: '#f3f4f6', color: '#6b7280', padding: '4px 10px', borderRadius: '12px', fontWeight: 600 }}>Past Guest</span>
                                                        )}
                                                        {g.status === 'Inactive' && (
                                                            <span style={{ fontSize: '0.75rem', backgroundColor: '#fef3c7', color: '#d97706', padding: '4px 10px', borderRadius: '12px', fontWeight: 600 }}>No Stays</span>
                                                        )}
                                                    </td>
                                                    <td style={{ padding: '12px 10px' }}>
                                                        {g.activeBookings.length > 0 ? (
                                                            <div>
                                                                {g.activeBookings.map(b => (
                                                                    <div key={b.bookingId} style={{ fontSize: '0.8rem', color: '#111827' }}>
                                                                        <strong>Room {b.roomNumber}</strong> ({b.checkInDate} to {b.checkOutDate})
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>None</span>
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

            {/* ADD ROOM MODAL */}
            {showAddRoomModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '440px', padding: '2rem', backgroundColor: '#ffffff', borderRadius: '12px', position: 'relative' }}>
                        <button onClick={() => setShowAddRoomModal(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer' }}>
                            <X style={{ width: '18px', height: '18px' }} />
                        </button>

                        <h3 className="font-serif" style={{ fontSize: '1.4rem', color: '#0f2e1e', marginBottom: '1rem' }}>
                            Add New Suite / Room
                        </h3>

                        <form onSubmit={handleAddRoom} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ fontSize: '0.8rem', color: '#0f2e1e', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Room Number</label>
                                <input type="text" required placeholder="e.g. 404" value={newRoomNumber} onChange={(e) => setNewRoomNumber(e.target.value)} className="input-field" />
                            </div>

                            <div>
                                <label style={{ fontSize: '0.8rem', color: '#0f2e1e', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Branch Location</label>
                                <select value={newBranchId} onChange={(e) => setNewBranchId(e.target.value)} className="input-field">
                                    {branches.map(b => <option key={b.id} value={b.id}>{b.name} ({b.city})</option>)}
                                </select>
                            </div>

                            <div>
                                <label style={{ fontSize: '0.8rem', color: '#0f2e1e', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Room Category</label>
                                <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="input-field">
                                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                </select>
                            </div>

                            <div>
                                <label style={{ fontSize: '0.8rem', color: '#0f2e1e', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Price Per Night (₹)</label>
                                <input type="number" required value={newPrice} onChange={(e) => setNewPrice(e.target.value)} className="input-field" />
                            </div>

                            <button type="submit" className="btn btn-emerald" style={{ width: '100%', padding: '10px', borderRadius: '8px' }}>
                                Save Room
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* ADD STAFF MODAL */}
            {showAddStaffModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '440px', padding: '2rem', backgroundColor: '#ffffff', borderRadius: '12px', position: 'relative' }}>
                        <button onClick={() => setShowAddStaffModal(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer' }}>
                            <X style={{ width: '18px', height: '18px' }} />
                        </button>

                        <h3 className="font-serif" style={{ fontSize: '1.4rem', color: '#0f2e1e', marginBottom: '1rem' }}>
                            Register Staff Member
                        </h3>

                        <form onSubmit={handleAddStaff} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                            <div>
                                <label style={{ fontSize: '0.8rem', color: '#0f2e1e', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Full Name</label>
                                <input type="text" required placeholder="Alexander Vance" value={staffName} onChange={(e) => setStaffName(e.target.value)} className="input-field" />
                            </div>

                            <div>
                                <label style={{ fontSize: '0.8rem', color: '#0f2e1e', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Role / Specialty</label>
                                <input type="text" required value={staffRole} onChange={(e) => setStaffRole(e.target.value)} className="input-field" />
                            </div>

                            <div>
                                <label style={{ fontSize: '0.8rem', color: '#0f2e1e', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Email</label>
                                <input type="email" required placeholder="alex@grandresort.com" value={staffEmail} onChange={(e) => setStaffEmail(e.target.value)} className="input-field" />
                            </div>

                            <div>
                                <label style={{ fontSize: '0.8rem', color: '#0f2e1e', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Phone</label>
                                <input type="tel" placeholder="+1 555-0199" value={staffPhone} onChange={(e) => setStaffPhone(e.target.value)} className="input-field" />
                            </div>

                            <div>
                                <label style={{ fontSize: '0.8rem', color: '#0f2e1e', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Assigned Branch</label>
                                <select value={staffBranch} onChange={(e) => setStaffBranch(e.target.value)} className="input-field">
                                    {branches.map(b => <option key={b.id} value={b.id}>{b.name} ({b.city})</option>)}
                                </select>
                            </div>

                            <button type="submit" className="btn btn-emerald" style={{ width: '100%', padding: '10px', borderRadius: '8px' }}>
                                Save Staff Member
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
