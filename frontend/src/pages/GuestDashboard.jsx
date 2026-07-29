import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Search, MapPin, ConciergeBell, Bed, Star, Calendar, X, CheckCircle2, ChevronLeft, ChevronRight, ChevronDown, FileText } from 'lucide-react';

export default function GuestDashboard() {
    const { user, showToast } = useAuth();
    const [activeTab, setActiveTab] = useState('home'); // 'home' | 'accommodations' | 'my-bookings'
    const [selectedBillBooking, setSelectedBillBooking] = useState(null);

    // Slideshow state
    const slideshowImages = [
        {
            title: 'Goa Palolem Beachfront Resort',
            tag: 'South Goa, India',
            subtitle: 'Palm-fringed private beaches, ocean plunge villas & serene sunset lounges.',
            img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=80'
        },
        {
            title: 'Udaipur Royal Lake Palace',
            tag: 'Pichola Lake, Udaipur',
            subtitle: 'Majestic palatial heritage architecture with panoramic lake & mountain vistas.',
            img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80'
        },
        {
            title: 'Munnar Tea Hills Retreat',
            tag: 'Munnar Hills, Kerala',
            subtitle: 'Nestled amidst mist-covered emerald tea plantations & natural thermal springs.',
            img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=80'
        },
        {
            title: 'Emerald Rooftop Plunge Pool',
            tag: 'Luxury Wellness',
            subtitle: 'Heated mineral hydrotherapy pools overlooking lush forest canopy skylines.',
            img: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1600&q=80'
        },
        {
            title: 'Botanical Ayurvedic Sanctuary',
            tag: 'Holistic Spa Care',
            subtitle: 'Herb-infused steam saunas, organic therapy baths & peaceful garden patios.',
            img: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1600&q=80'
        }
    ];
    const [currentSlide, setCurrentSlide] = useState(0);

    // Auto-advance slideshow every 4.5 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slideshowImages.length);
        }, 4500);
        return () => clearInterval(timer);
    }, [slideshowImages.length]);

    // Data states & Fallbacks
    const fallbackBranches = [
        { id: 'BR-001', name: 'Goa Palolem Beachfront Resort', city: 'Goa' },
        { id: 'BR-002', name: 'Udaipur Royal Lake Palace', city: 'Udaipur' },
        { id: 'BR-003', name: 'Munnar Tea Hills Retreat', city: 'Munnar' }
    ];

    const fallbackCategories = [
        { id: 'CAT-STD', name: 'Standard Garden Room' },
        { id: 'CAT-DLX', name: 'Executive Heritage Deluxe' },
        { id: 'CAT-SUI', name: 'Royal Maharajah Suite' },
        { id: 'CAT-EXE', name: 'Presidential Villa & Pool' }
    ];

    const fallbackRooms = [
        {
            id: 'RM-101',
            roomNumber: '101',
            branchId: 'BR-001',
            category: 'Standard Garden Room',
            pricePerNight: 3499,
            amenities: ['WiFi', 'Free Chai & Breakfast', 'Smart TV'],
            status: 'Available',
            branchName: 'Goa Palolem Beachfront Resort',
            branchCity: 'Goa',
            image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
            bedroomImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
            bathroomImage: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80',
            viewImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80'
        },
        {
            id: 'RM-102',
            roomNumber: '102',
            branchId: 'BR-001',
            category: 'Executive Heritage Deluxe',
            pricePerNight: 5999,
            amenities: ['WiFi', 'AC', 'Breakfast', 'Mini Bar'],
            status: 'Available',
            branchName: 'Goa Palolem Beachfront Resort',
            branchCity: 'Goa',
            image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
            bedroomImage: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
            bathroomImage: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1200&q=80',
            viewImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'
        },
        {
            id: 'RM-104',
            roomNumber: '104',
            branchId: 'BR-001',
            category: 'Presidential Villa & Pool',
            pricePerNight: 18999,
            amenities: ['WiFi', 'AC', 'Private Plunge Pool', 'Butler Service'],
            status: 'Available',
            branchName: 'Goa Palolem Beachfront Resort',
            branchCity: 'Goa',
            image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
            bedroomImage: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
            bathroomImage: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
            viewImage: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80'
        },
        {
            id: 'RM-201',
            roomNumber: '201',
            branchId: 'BR-002',
            category: 'Standard Garden Room',
            pricePerNight: 3299,
            amenities: ['WiFi', 'Smart TV'],
            status: 'Available',
            branchName: 'Udaipur Royal Lake Palace',
            branchCity: 'Udaipur',
            image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
            bedroomImage: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
            bathroomImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
            viewImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80'
        },
        {
            id: 'RM-202',
            roomNumber: '202',
            branchId: 'BR-002',
            category: 'Executive Heritage Deluxe',
            pricePerNight: 5799,
            amenities: ['WiFi', 'AC', 'Lake View Balcony'],
            status: 'Available',
            branchName: 'Udaipur Royal Lake Palace',
            branchCity: 'Udaipur',
            image: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80',
            bedroomImage: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80',
            bathroomImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
            viewImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80'
        },
        {
            id: 'RM-301',
            roomNumber: '301',
            branchId: 'BR-003',
            category: 'Standard Garden Room',
            pricePerNight: 3699,
            amenities: ['WiFi', 'Tea Garden View'],
            status: 'Available',
            branchName: 'Munnar Tea Hills Retreat',
            branchCity: 'Munnar',
            image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80',
            bedroomImage: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80',
            bathroomImage: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80',
            viewImage: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1200&q=80'
        }
    ];

    const [branches, setBranches] = useState(fallbackBranches);
    const [categories, setCategories] = useState(fallbackCategories);
    const [rooms, setRooms] = useState(fallbackRooms);
    const [myBookings, setMyBookings] = useState([]);
    const [loading, setLoading] = useState(false);

    const displayBranches = branches && branches.length > 0 ? branches : fallbackBranches;
    const displayCategories = categories && categories.length > 0 ? categories : fallbackCategories;
    const displayRooms = rooms && rooms.length > 0 ? rooms : fallbackRooms;

    // Interactive Multi-View Room Photography State
    const [roomPhotoAngles, setRoomPhotoAngles] = useState({}); // { [roomId]: 'bedroom' | 'bathroom' | 'view' }
    const [selectedGalleryRoom, setSelectedGalleryRoom] = useState(null);
    const [galleryActiveTab, setGalleryActiveTab] = useState('bedroom');

    const getActiveRoomPhoto = (room) => {
        if (!room) return 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1000&q=80';
        const angle = roomPhotoAngles[room.id] || 'bedroom';
        const FALLBACK = 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1000&q=80';
        if (angle === 'bathroom') return room.bathroomImage || room.image || FALLBACK;
        if (angle === 'view') return room.viewImage || room.image || FALLBACK;
        return room.bedroomImage || room.image || FALLBACK;
    };

    // Filters
    const [selectedBranch, setSelectedBranch] = useState('ALL');
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCheckIn, setFilterCheckIn] = useState('');
    const [filterCheckOut, setFilterCheckOut] = useState('');
    const [filterAmenities, setFilterAmenities] = useState([]);

    // Booking Modal state
    const [selectedRoom, setSelectedRoom] = useState(null);
    const getLocalDate = (offsetDays = 0) => {
        const d = new Date();
        d.setDate(d.getDate() + offsetDays);
        return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    };

    const [checkInDate, setCheckInDate] = useState(() => getLocalDate(0));
    const [checkOutDate, setCheckOutDate] = useState(() => getLocalDate(1));
    const [specialRequests, setSpecialRequests] = useState('');
    const [aadharNumber, setAadharNumber] = useState('');
    const [submittingBooking, setSubmittingBooking] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    // Service Request Modal state
    const [selectedBookingForService, setSelectedBookingForService] = useState(null);
    const [serviceType, setServiceType] = useState('Room Service');
    const [serviceDetails, setServiceDetails] = useState('');
    const [submittingService, setSubmittingService] = useState(false);

    // Feedback Modal state
    const [selectedBookingForFeedback, setSelectedBookingForFeedback] = useState(null);
    const [feedbackRating, setFeedbackRating] = useState(5);
    const [feedbackComments, setFeedbackComments] = useState('');
    const [submittingFeedback, setSubmittingFeedback] = useState(false);

    useEffect(() => {
        setAgreedToTerms(false);
        setAadharNumber('');
    }, [selectedRoom]);

    useEffect(() => {
        loadData();
        fetchMyBookings();
    }, [selectedBranch, selectedCategory, searchQuery, filterCheckIn, filterCheckOut, filterAmenities]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [bRes, cRes, rRes] = await Promise.all([
                api.getBranches().catch(() => fallbackBranches),
                api.getCategories().catch(() => fallbackCategories),
                api.getRooms({
                    branchId: selectedBranch !== 'ALL' ? selectedBranch : undefined,
                    category: selectedCategory !== 'ALL' ? selectedCategory : undefined,
                    query: searchQuery || undefined,
                    checkIn: filterCheckIn || undefined,
                    checkOut: filterCheckOut || undefined,
                    amenities: filterAmenities.length > 0 ? filterAmenities.join(',') : undefined
                })
            ]);
            setBranches(bRes && bRes.length > 0 ? bRes : fallbackBranches);
            setCategories(cRes && cRes.length > 0 ? cRes : fallbackCategories);
            setRooms(rRes || []);
        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchMyBookings = async () => {
        try {
            const data = await api.getMyBookings();
            setMyBookings(data);
        } catch (err) {
            // Handled
        }
    };

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

    const handleConfirmBooking = async (e) => {
        e.preventDefault();
        if (!selectedRoom || !checkInDate || !checkOutDate) return;
        if (!agreedToTerms) {
            showToast('You must agree to the Terms and Conditions and Cancellation Policy to proceed.', 'error');
            return;
        }
        const cleanedAadhar = aadharNumber.replace(/\s/g, '');
        if (!validateAadhaar(cleanedAadhar)) {
            showToast('Please enter a valid 12-digit Aadhaar card number.', 'error');
            return;
        }

        setSubmittingBooking(true);
        try {
            await api.createBooking({
                roomId: selectedRoom.id,
                checkInDate,
                checkOutDate,
                specialRequests,
                aadharNumber: cleanedAadhar
            });
            showToast('Room reservation confirmed successfully!', 'success');
            setSelectedRoom(null);
            fetchMyBookings();
            loadData();
            setActiveTab('my-bookings');
        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            setSubmittingBooking(false);
        }
    };

    const handleRequestService = async (e) => {
        e.preventDefault();
        if (!selectedBookingForService || !serviceDetails) return;

        setSubmittingService(true);
        try {
            await api.requestService(selectedBookingForService.id, {
                type: serviceType,
                details: serviceDetails
            });
            showToast('Service order submitted to Front Desk dispatch queue', 'success');
            setSelectedBookingForService(null);
            setServiceDetails('');
            fetchMyBookings();
        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            setSubmittingService(false);
        }
    };

    const handleSubmitFeedback = async (e) => {
        e.preventDefault();
        if (!selectedBookingForFeedback) return;

        setSubmittingFeedback(true);
        try {
            await api.submitFeedback(selectedBookingForFeedback.id, {
                rating: feedbackRating,
                comments: feedbackComments
            });
            showToast('Thank you for rating your stay!', 'success');
            setSelectedBookingForFeedback(null);
            setFeedbackComments('');
            fetchMyBookings();
        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            setSubmittingFeedback(false);
        }
    };

    const handleCancelBooking = async (bookingId) => {
        if (!window.confirm('Are you sure you want to cancel this reservation? The assigned room will be made available for other guests.')) return;
        try {
            await api.cancelBooking(bookingId);
            showToast('Reservation cancelled successfully and room freed.', 'success');
            fetchMyBookings();
            loadData();
        } catch (err) {
            showToast(err.message, 'error');
        }
    };

    const calculateTotal = (pricePerNight) => {
        if (!checkInDate || !checkOutDate) return pricePerNight;
        const d1 = new Date(checkInDate);
        const d2 = new Date(checkOutDate);
        const diff = Math.max(1, Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24)));
        return diff * pricePerNight;
    };

    const getRoomGradient = (idx) => {
        const gradients = [
            'linear-gradient(135deg, #0f2e1e 0%, #16a34a 100%)',
            'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
            'linear-gradient(135deg, #7c2d12 0%, #d97706 100%)',
            'linear-gradient(135deg, #374151 0%, #4b5563 100%)'
        ];
        return gradients[idx % gradients.length];
    };

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slideshowImages.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slideshowImages.length) % slideshowImages.length);

    return (
        <div>
            {/* PROPERTY SLIDESHOW HERO BANNER */}
            <div style={{
                background: `linear-gradient(rgba(15, 46, 30, 0.78), rgba(15, 46, 30, 0.88)), url("${slideshowImages[currentSlide].img}")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                color: '#ffffff',
                padding: '4.5rem 3rem',
                textAlign: 'center',
                borderRadius: '16px',
                margin: '1.5rem 2rem 0 2rem',
                position: 'relative',
                boxShadow: '0 15px 30px -5px rgba(15, 46, 30, 0.25)',
                transition: 'background 0.8s ease-in-out',
                minHeight: '340px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {/* Left Arrow Button */}
                <button
                    onClick={prevSlide}
                    style={{
                        position: 'absolute',
                        left: '20px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        border: 'none',
                        color: '#ffffff',
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        backdropFilter: 'blur(4px)',
                        transition: 'all 0.2s',
                        zIndex: 5
                    }}
                >
                    <ChevronLeft style={{ width: '24px', height: '24px' }} />
                </button>

                {/* Right Arrow Button */}
                <button
                    onClick={nextSlide}
                    style={{
                        position: 'absolute',
                        right: '20px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        border: 'none',
                        color: '#ffffff',
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        backdropFilter: 'blur(4px)',
                        transition: 'all 0.2s',
                        zIndex: 5
                    }}
                >
                    <ChevronRight style={{ width: '24px', height: '24px' }} />
                </button>

                <div style={{ maxWidth: '820px', margin: '0 auto', position: 'relative', zIndex: 3 }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#86efac', letterSpacing: '0.15em', display: 'block', marginBottom: '8px' }}>
                        🌿 {slideshowImages[currentSlide].tag}
                    </span>
                    <h1 className="font-serif animate-fade-in" key={currentSlide} style={{ fontSize: '2.9rem', color: '#ffffff', marginBottom: '0.8rem', fontWeight: 700 }}>
                        {slideshowImages[currentSlide].title}
                    </h1>
                    <p style={{ fontSize: '1.15rem', opacity: 0.95, marginBottom: '1.8rem', fontWeight: 300, color: '#f0fdf4', lineHeight: 1.4 }}>
                        {slideshowImages[currentSlide].subtitle}
                    </p>
                    <div style={{ display: 'inline-flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px' }}>
                        <button
                            onClick={() => setActiveTab('home')}
                            style={{
                                backgroundColor: activeTab === 'home' ? '#ffffff' : 'rgba(255,255,255,0.18)',
                                color: activeTab === 'home' ? '#0f2e1e' : '#ffffff',
                                padding: '10px 24px',
                                borderRadius: '30px',
                                border: 'none',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.25s'
                            }}
                        >
                            Resort Overview
                        </button>
                        <button
                            onClick={() => setActiveTab('accommodations')}
                            style={{
                                backgroundColor: activeTab === 'accommodations' ? '#ffffff' : 'rgba(255,255,255,0.18)',
                                color: activeTab === 'accommodations' ? '#0f2e1e' : '#ffffff',
                                padding: '10px 24px',
                                borderRadius: '30px',
                                border: 'none',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.25s'
                            }}
                        >
                            Book Accommodations & Suites
                        </button>
                        <button
                            onClick={() => setActiveTab('my-bookings')}
                            style={{
                                backgroundColor: activeTab === 'my-bookings' ? '#ffffff' : 'rgba(255,255,255,0.18)',
                                color: activeTab === 'my-bookings' ? '#0f2e1e' : '#ffffff',
                                padding: '10px 24px',
                                borderRadius: '30px',
                                border: 'none',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.25s'
                            }}
                        >
                            My Reservations ({myBookings.length})
                        </button>
                    </div>
                </div>

                {/* Slideshow Dot Indicators */}
                <div style={{ position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px', zIndex: 5 }}>
                    {slideshowImages.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentSlide(idx)}
                            style={{
                                width: idx === currentSlide ? '24px' : '10px',
                                height: '10px',
                                borderRadius: '10px',
                                backgroundColor: idx === currentSlide ? '#86efac' : 'rgba(255,255,255,0.4)',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.3s'
                            }}
                        />
                    ))}
                </div>
            </div>

            <div style={{ padding: '0 2rem 3rem 2rem' }}>
                {/* TAB 1: HOME RESORT OVERVIEW & PHOTO SHOWCASE */}
                {activeTab === 'home' && (
                    <div style={{ marginTop: '2.5rem' }}>
                        {/* FEATURE HIGHLIGHTS BADGES */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1rem', marginBottom: '3.5rem' }}>
                            {[
                                { title: '100% Eco Sanctuary', desc: 'Zero plastic, solar energy & organic tea garden estates', icon: '🌿' },
                                { title: 'Royal Indian Dining', desc: 'Farm-to-table organic menus & authentic Thali dishes', icon: '🍽️' },
                                { title: 'Ayurvedic Spa & Pools', desc: 'Heated mineral plunge pools & botanical oil hydrotherapy', icon: '🧖' },
                                { title: '24/7 Butler Service', desc: 'Personal royal concierge for seamless stays & excursions', icon: '🛎️' }
                            ].map((h, i) => (
                                <div key={i} className="glass-panel" style={{ padding: '1.4rem', borderRadius: '14px', backgroundColor: '#ffffff', border: '1px solid #dcfce7', display: 'flex', gap: '12px', alignItems: 'center' }}>
                                    <span style={{ fontSize: '2rem' }}>{h.icon}</span>
                                    <div>
                                        <h4 style={{ color: '#0f2e1e', fontSize: '1rem', fontWeight: 700, marginBottom: '2px' }}>{h.title}</h4>
                                        <p style={{ color: '#4b5563', fontSize: '0.8rem', lineHeight: '1.3' }}>{h.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* STAY WITH US PHOTO SHOWCASE GALLERY SECTION */}
                        <div style={{ marginBottom: '4rem' }}>
                            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#16a34a', letterSpacing: '0.1em' }}>
                                    Exclusive Experience
                                </span>
                                <h2 className="font-serif" style={{ fontSize: '2.5rem', color: '#0f2e1e', marginTop: '4px', marginBottom: '8px' }}>
                                    Stay With Us — Pure Botanical Luxury
                                </h2>
                                <p style={{ color: '#4b5563', fontSize: '1rem', maxWidth: '650px', margin: '0 auto' }}>
                                    Immerse yourself in award-winning eco-resort sanctuaries designed with organic natural materials, heated thermal mineral pools, and Michelin-inspired farm-to-table dining.
                                </p>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                                {[
                                    {
                                        title: 'Emerald Rooftop Infinity Pool',
                                        subtitle: 'Heated mineral waters overlooking lush canopy skylines',
                                        tag: 'Wellness & Leisure',
                                        img: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80'
                                    },
                                    {
                                        title: 'Thermal Hydrotherapy Spa',
                                        subtitle: 'Holistic botanical aromatherapy and herbal steam saunas',
                                        tag: 'Holistic Spa',
                                        img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80'
                                    },
                                    {
                                        title: 'Executive Balcony Penthouse',
                                        subtitle: 'Spacious lounge with floor-to-ceiling panoramic views',
                                        tag: 'Suite Accommodation',
                                        img: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80'
                                    },
                                    {
                                        title: 'Michelin Organic Dining',
                                        subtitle: 'Artisanal farm-to-table menus crafted by world-class chefs',
                                        tag: 'Culinary Delight',
                                        img: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80'
                                    },
                                    {
                                        title: 'Presidential Ocean View Suite',
                                        subtitle: 'Private plunge pool, hand-carved teak furniture & butler',
                                        tag: 'Ultra Luxury',
                                        img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'
                                    },
                                    {
                                        title: 'Zen Botanical Garden Villa',
                                        subtitle: 'Secluded bamboo sanctuaries nestled in private gardens',
                                        tag: 'Private Haven',
                                        img: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'
                                    }
                                ].map((item, idx) => (
                                    <div key={idx} className="glass-panel glass-card-hover" style={{ borderRadius: '16px', overflow: 'hidden', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                        <div style={{ position: 'relative', height: '230px', overflow: 'hidden', background: '#0f2e1e' }}>
                                            <img
                                                src={item.img}
                                                alt={item.title}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                className="gallery-photo"
                                            />
                                            <span style={{
                                                position: 'absolute',
                                                top: '12px',
                                                left: '12px',
                                                backgroundColor: 'rgba(15, 46, 30, 0.85)',
                                                color: '#ffffff',
                                                padding: '4px 12px',
                                                borderRadius: '20px',
                                                fontSize: '0.7rem',
                                                fontWeight: 600,
                                                textTransform: 'uppercase',
                                                backdropFilter: 'blur(4px)'
                                            }}>
                                                {item.tag}
                                            </span>
                                        </div>

                                        <div style={{ padding: '1.3rem' }}>
                                            <h3 className="font-serif" style={{ fontSize: '1.3rem', color: '#0f2e1e', marginBottom: '4px' }}>
                                                {item.title}
                                            </h3>
                                            <p style={{ color: '#4b5563', fontSize: '0.85rem', lineHeight: '1.4' }}>
                                                {item.subtitle}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* FEATURED SUITES PREVIEW GRID */}
                        <div style={{ backgroundColor: '#f0fdf4', padding: '3rem 2rem', borderRadius: '20px', border: '1px solid #dcfce7', marginBottom: '4rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                                <div>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#16a34a', letterSpacing: '0.1em' }}>Curated Selections</span>
                                    <h2 className="font-serif" style={{ fontSize: '2.2rem', color: '#0f2e1e', marginTop: '4px' }}>Featured Luxury Accommodations</h2>
                                </div>
                                <button
                                    onClick={() => setActiveTab('accommodations')}
                                    className="btn btn-primary"
                                    style={{ padding: '10px 24px', borderRadius: '30px' }}
                                >
                                    View All Suites & Reserve &rarr;
                                </button>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                                {displayRooms.slice(0, 3).map((room, idx) => (
                                    <div key={room.id} className="glass-panel" style={{ borderRadius: '14px', overflow: 'hidden', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                        <div style={{ height: '180px', position: 'relative', overflow: 'hidden' }}>
                                            <img src={room.image} alt={room.category} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            <span style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: '#0f2e1e', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                                                ₹{room.pricePerNight.toLocaleString()} / night
                                            </span>
                                        </div>
                                        <div style={{ padding: '1.2rem' }}>
                                            <h3 className="font-serif" style={{ fontSize: '1.2rem', color: '#0f2e1e', marginBottom: '4px' }}>{room.category}</h3>
                                            <p style={{ color: '#4b5563', fontSize: '0.8rem', marginBottom: '1rem' }}>{room.branchName} ({room.branchCity})</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* GUEST REVIEWS SHOWCASE */}
                        <div style={{ textAlign: 'center', maxWidth: '850px', margin: '0 auto 2rem auto' }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#16a34a', letterSpacing: '0.1em' }}>Guest Stories</span>
                            <h2 className="font-serif" style={{ fontSize: '2.2rem', color: '#0f2e1e', marginTop: '4px', marginBottom: '2rem' }}>What Travelers Say About Staying With Us</h2>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                                {[
                                    { name: 'Dr. Ananya Roy', text: 'The Munnar tea garden retreat was pure bliss. Waking up to misty hills and fresh chai was unforgettable.', stars: 5, stay: 'Munnar Tea Hills Retreat' },
                                    { name: 'Rajesh & Simran', text: 'Royal Maharajah Suite in Udaipur exceeded all expectations. The lake view and butler service were 5-star perfection.', stars: 5, stay: 'Udaipur Royal Lake Palace' },
                                    { name: 'Kavita Menon', text: 'Peaceful, botanical green atmosphere and fantastic Ayurvedic spa treatments. Will return every summer!', stars: 5, stay: 'Goa Palolem Resort' }
                                ].map((rev, i) => (
                                    <div key={i} className="glass-panel" style={{ padding: '1.5rem', borderRadius: '14px', backgroundColor: '#ffffff', textAlign: 'left', border: '1px solid #e5e7eb' }}>
                                        <div style={{ color: '#f59e0b', fontSize: '0.9rem', marginBottom: '8px' }}>
                                            {'★'.repeat(rev.stars)}
                                        </div>
                                        <p style={{ color: '#374151', fontSize: '0.85rem', fontStyle: 'italic', marginBottom: '12px', lineHeight: '1.4' }}>
                                            "{rev.text}"
                                        </p>
                                        <div style={{ fontWeight: 700, color: '#0f2e1e', fontSize: '0.85rem' }}>{rev.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{rev.stay}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 2: ACCOMMODATIONS & ROOM SEARCH */}
                {activeTab === 'accommodations' && (
                    <div style={{ marginTop: '2rem' }}>
                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#16a34a', letterSpacing: '0.1em' }}>All Suites & Sanctuaries</span>
                            <h2 className="font-serif" style={{ fontSize: '2.4rem', color: '#0f2e1e', marginTop: '4px' }}>Reserve Your Luxury Accommodation</h2>
                            <p style={{ color: '#4b5563', fontSize: '0.95rem' }}>Select dates and location to check live suite availability & instantly confirm your stay.</p>
                        </div>

                        {/* SEARCH BAR WIDGET */}
                        <div style={{
                            backgroundColor: '#ffffff',
                            border: '1px solid #bbf7d0',
                            padding: '1.4rem 1.8rem',
                            borderRadius: '16px',
                            boxShadow: '0 10px 25px -5px rgba(15, 46, 30, 0.08)',
                            maxWidth: '1150px',
                            margin: '0 auto 3rem auto',
                            position: 'relative',
                            zIndex: 10,
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                            gap: '1.2rem',
                            alignItems: 'end'
                        }}>
                            <div>
                                <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#0f2e1e', display: 'block', marginBottom: '6px' }}>
                                    Destination Location
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <select
                                        value={selectedBranch}
                                        onChange={(e) => setSelectedBranch(e.target.value)}
                                        className="input-field"
                                        style={{ appearance: 'none', paddingRight: '32px', cursor: 'pointer', backgroundColor: '#ffffff', borderColor: '#16a34a', color: '#0f2e1e', fontWeight: 600 }}
                                    >
                                        <option value="ALL">All Locations</option>
                                        {displayBranches.map(b => (
                                            <option key={b.id} value={b.id}>{b.name} ({b.city})</option>
                                        ))}
                                    </select>
                                    <ChevronDown style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#16a34a', pointerEvents: 'none' }} />
                                </div>
                            </div>

                            <div>
                                <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#0f2e1e', display: 'block', marginBottom: '6px' }}>
                                    Suite Category
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="input-field"
                                        style={{ appearance: 'none', paddingRight: '32px', cursor: 'pointer', backgroundColor: '#ffffff', borderColor: '#16a34a', color: '#0f2e1e', fontWeight: 600 }}
                                    >
                                        <option value="ALL">All Suite Categories</option>
                                        {displayCategories.map(c => (
                                            <option key={c.id} value={c.name}>{c.name}</option>
                                        ))}
                                    </select>
                                    <ChevronDown style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#16a34a', pointerEvents: 'none' }} />
                                </div>
                            </div>

                            <div>
                                <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#0f2e1e', display: 'block', marginBottom: '6px' }}>
                                    Search Suite / Room
                                </label>
                                <div style={{ position: 'relative', display: 'flex', gap: '8px' }}>
                                    <div style={{ position: 'relative', flex: 1 }}>
                                        <Search style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', width: '15px', height: '15px', color: '#16a34a' }} />
                                        <input
                                            type="text"
                                            placeholder="Search Goa, 101..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="input-field"
                                            style={{ paddingLeft: '34px', borderColor: '#16a34a', fontWeight: 500, width: '100%' }}
                                        />
                                    </div>
                                    <button
                                        onClick={() => {
                                            setSelectedBranch('ALL');
                                            setSelectedCategory('ALL');
                                            setSearchQuery('');
                                            setFilterCheckIn('');
                                            setFilterCheckOut('');
                                            setFilterAmenities([]);
                                            // The state updates are async, so we trigger loadData manually if needed, or useEffect handles branch/category/search.
                                            // To ensure dates/amenities reset immediately:
                                            setTimeout(loadData, 50);
                                        }}
                                        style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', padding: '0 12px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
                                    >
                                        Clear All
                                    </button>
                                    <button
                                        onClick={loadData}
                                        style={{ backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '8px', padding: '0 16px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px' }}
                                    >
                                        <Search size={16} /> Search
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Extra Date & Amenities Filters */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginTop: '1rem', marginBottom: filterAmenities.length > 0 ? '0' : '2.5rem' }}>
                            <div>
                                <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#0f2e1e', display: 'block', marginBottom: '6px' }}>
                                    Availability Start
                                </label>
                                <input
                                    type="date"
                                    value={filterCheckIn}
                                    onChange={(e) => setFilterCheckIn(e.target.value)}
                                    className="input-field"
                                    style={{ borderColor: '#16a34a', fontWeight: 500 }}
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#0f2e1e', display: 'block', marginBottom: '6px' }}>
                                    Availability End
                                </label>
                                <input
                                    type="date"
                                    value={filterCheckOut}
                                    onChange={(e) => setFilterCheckOut(e.target.value)}
                                    className="input-field"
                                    style={{ borderColor: '#16a34a', fontWeight: 500 }}
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#0f2e1e', display: 'block', marginBottom: '6px' }}>
                                    Amenities
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <select
                                        value={filterAmenities.length > 0 ? filterAmenities[0] : ''}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (val && !filterAmenities.includes(val)) {
                                                setFilterAmenities([...filterAmenities, val]);
                                            }
                                        }}
                                        className="input-field"
                                        style={{ appearance: 'none', paddingRight: '32px', cursor: 'pointer', backgroundColor: '#ffffff', borderColor: '#16a34a', color: '#0f2e1e', fontWeight: 600 }}
                                    >
                                        <option value="">Select Amenities to Add...</option>
                                        <option value="WiFi">WiFi</option>
                                        <option value="TV">TV</option>
                                        <option value="Mini-bar">Mini-bar</option>
                                        <option value="Jacuzzi">Jacuzzi</option>
                                        <option value="Balcony">Balcony</option>
                                    </select>
                                    <ChevronDown style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#16a34a', pointerEvents: 'none' }} />
                                </div>
                            </div>
                        </div>

                        {filterAmenities.length > 0 && (
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '1rem', marginBottom: '2.5rem' }}>
                                {filterAmenities.map(am => (
                                    <span key={am} style={{ padding: '4px 12px', backgroundColor: '#16a34a', color: 'white', borderRadius: '20px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        {am}
                                        <X 
                                            size={14} 
                                            style={{ cursor: 'pointer' }} 
                                            onClick={() => setFilterAmenities(filterAmenities.filter(a => a !== am))} 
                                        />
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* ROOM CARDS GRID */}
                        {rooms.length === 0 && !loading && (
                            <div style={{ backgroundColor: '#f0fdf4', padding: '12px 20px', borderRadius: '10px', border: '1px solid #bbf7d0', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                                <span style={{ fontSize: '0.85rem', color: '#166534', fontWeight: 600 }}>
                                    Showing all available resort suites across Goa, Udaipur & Munnar.
                                </span>
                                <button
                                    onClick={() => {
                                        setSelectedBranch('ALL');
                                        setSelectedCategory('ALL');
                                        setSearchQuery('');
                                    }}
                                    style={{ background: 'none', border: 'none', color: '#15803d', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem', textDecoration: 'underline' }}
                                >
                                    Reset Filters
                                </button>
                            </div>
                        )}

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                            {displayRooms.map((room, idx) => (
                                    <div key={room.id} className="glass-panel glass-card-hover" style={{ borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                        <div>
                                            {/* Pure Photography Multi-Perspective Card (Zero Text Clutter) */}
                                            <div
                                                onClick={() => {
                                                    setSelectedGalleryRoom(room);
                                                    setGalleryActiveTab(roomPhotoAngles[room.id] || 'bedroom');
                                                }}
                                                onMouseMove={(e) => {
                                                    const rect = e.currentTarget.getBoundingClientRect();
                                                    const x = e.clientX - rect.left;
                                                    const ratio = x / rect.width;
                                                    if (ratio < 0.33) {
                                                        setRoomPhotoAngles(prev => ({ ...prev, [room.id]: 'bedroom' }));
                                                    } else if (ratio < 0.66) {
                                                        setRoomPhotoAngles(prev => ({ ...prev, [room.id]: 'bathroom' }));
                                                    } else {
                                                        setRoomPhotoAngles(prev => ({ ...prev, [room.id]: 'view' }));
                                                    }
                                                }}
                                                style={{
                                                    height: '240px',
                                                    position: 'relative',
                                                    overflow: 'hidden',
                                                    cursor: 'pointer',
                                                    background: getRoomGradient(idx)
                                                }}
                                            >
                                                <img
                                                    src={getActiveRoomPhoto(room)}
                                                    alt={room.category}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease, opacity 0.3s ease' }}
                                                    className="gallery-photo"
                                                />

                                                {/* Status Badge */}
                                                <span className={`badge badge-${room.status.toLowerCase()}`} style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 2, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                                                    {room.status}
                                                </span>

                                                {/* Sleek Minimal Image Pagination Dots (No Text Labels) */}
                                                <div style={{ position: 'absolute', bottom: '12px', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: '6px', zIndex: 10 }} onClick={(e) => e.stopPropagation()}>
                                                    {['bedroom', 'bathroom', 'view'].map((angleKey) => (
                                                        <button
                                                            key={angleKey}
                                                            onMouseEnter={() => setRoomPhotoAngles(prev => ({ ...prev, [room.id]: angleKey }))}
                                                            onClick={() => setRoomPhotoAngles(prev => ({ ...prev, [room.id]: angleKey }))}
                                                            style={{
                                                                width: (roomPhotoAngles[room.id] || 'bedroom') === angleKey ? '24px' : '8px',
                                                                height: '8px',
                                                                borderRadius: '4px',
                                                                border: 'none',
                                                                backgroundColor: (roomPhotoAngles[room.id] || 'bedroom') === angleKey ? '#ffffff' : 'rgba(255,255,255,0.45)',
                                                                boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                                                                cursor: 'pointer',
                                                                transition: 'all 0.3s ease'
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                            </div>

                                            <div style={{ padding: '1.2rem' }}>
                                                <h3 className="font-serif" style={{ fontSize: '1.3rem', color: '#0f2e1e', marginBottom: '4px' }}>
                                                    {room.category}
                                                </h3>
                                                <p style={{ color: '#4b5563', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '12px' }}>
                                                    <MapPin style={{ width: '14px', height: '14px', color: '#16a34a' }} />
                                                    {room.branchName} ({room.branchCity})
                                                </p>

                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '16px' }}>
                                                    {room.amenities.map((a, i) => (
                                                        <span key={i} style={{ fontSize: '0.75rem', padding: '2px 8px', backgroundColor: '#f0fdf4', color: '#15803d', borderRadius: '4px', border: '1px solid #dcfce7' }}>
                                                            {a}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{ borderTop: '1px solid #e5e7eb', padding: '1rem 1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fafafa' }}>
                                            <div>
                                                <span style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0f2e1e' }}>₹{room.pricePerNight.toLocaleString()}</span>
                                                <span style={{ color: '#6b7280', fontSize: '0.8rem' }}> / night</span>
                                            </div>

                                            {room.status === 'Available' ? (
                                                <button
                                                    onClick={() => setSelectedRoom(room)}
                                                    className="btn btn-primary"
                                                    style={{ padding: '6px 14px', fontSize: '0.85rem' }}
                                                >
                                                    Reserve Suite
                                                </button>
                                            ) : (
                                                <button disabled className="btn btn-outline" style={{ opacity: 0.6, cursor: 'not-allowed', padding: '6px 14px', fontSize: '0.85rem' }}>
                                                    Occupied
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                        {/* STAY WITH US PHOTO SHOWCASE GALLERY SECTION */}
                        <div style={{ marginTop: '4rem' }}>
                            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#16a34a', letterSpacing: '0.1em' }}>
                                    Exclusive Experience
                                </span>
                                <h2 className="font-serif" style={{ fontSize: '2.4rem', color: '#0f2e1e', marginTop: '4px', marginBottom: '8px' }}>
                                    Stay With Us — Pure Botanical Luxury
                                </h2>
                                <p style={{ color: '#4b5563', fontSize: '1rem', maxWidth: '650px', margin: '0 auto' }}>
                                    Immerse yourself in award-winning eco-resort sanctuaries designed with organic natural materials, heated thermal mineral pools, and Michelin-inspired farm-to-table dining.
                                </p>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                                {[
                                    {
                                        title: 'Emerald Rooftop Infinity Pool',
                                        subtitle: 'Heated mineral waters overlooking lush canopy skylines',
                                        tag: 'Wellness & Leisure',
                                        img: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
                                        fallbackGradient: 'linear-gradient(135deg, #047857 0%, #064e3b 100%)'
                                    },
                                    {
                                        title: 'Thermal Hydrotherapy Spa',
                                        subtitle: 'Holistic botanical aromatherapy and herbal steam saunas',
                                        tag: 'Holistic Spa',
                                        img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
                                        fallbackGradient: 'linear-gradient(135deg, #0f2e1e 0%, #1e3a2b 100%)'
                                    },
                                    {
                                        title: 'Executive Balcony Penthouse',
                                        subtitle: 'Spacious lounge with floor-to-ceiling panoramic views',
                                        tag: 'Suite Accommodation',
                                        img: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
                                        fallbackGradient: 'linear-gradient(135deg, #334155 0%, #0f172a 100%)'
                                    },
                                    {
                                        title: 'Michelin Organic Dining',
                                        subtitle: 'Artisanal farm-to-table menus crafted by world-class chefs',
                                        tag: 'Culinary Delight',
                                        img: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80',
                                        fallbackGradient: 'linear-gradient(135deg, #b45309 0%, #78350f 100%)'
                                    },
                                    {
                                        title: 'Presidential Ocean View Suite',
                                        subtitle: 'Private plunge pool, hand-carved teak furniture & butler',
                                        tag: 'Ultra Luxury',
                                        img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
                                        fallbackGradient: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
                                    },
                                    {
                                        title: 'Zen Botanical Garden Villa',
                                        subtitle: 'Secluded bamboo sanctuaries nestled in private gardens',
                                        tag: 'Private Haven',
                                        img: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
                                        fallbackGradient: 'linear-gradient(135deg, #065f46 0%, #064e3b 100%)'
                                    }
                                ].map((item, idx) => (
                                    <div key={idx} className="glass-panel glass-card-hover" style={{ borderRadius: '14px', overflow: 'hidden', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                        <div style={{ position: 'relative', height: '220px', overflow: 'hidden', background: item.fallbackGradient }}>
                                            <img
                                                src={item.img}
                                                alt={item.title}
                                                onError={(e) => { e.target.style.display = 'none'; }}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                                                className="gallery-photo"
                                            />
                                            <span style={{
                                                position: 'absolute',
                                                top: '12px',
                                                left: '12px',
                                                backgroundColor: 'rgba(15, 46, 30, 0.85)',
                                                color: '#ffffff',
                                                padding: '4px 10px',
                                                borderRadius: '20px',
                                                fontSize: '0.7rem',
                                                fontWeight: 600,
                                                textTransform: 'uppercase',
                                                backdropFilter: 'blur(4px)'
                                            }}>
                                                {item.tag}
                                            </span>
                                        </div>

                                        <div style={{ padding: '1.2rem' }}>
                                            <h3 className="font-serif" style={{ fontSize: '1.25rem', color: '#0f2e1e', marginBottom: '4px' }}>
                                                {item.title}
                                            </h3>
                                            <p style={{ color: '#4b5563', fontSize: '0.85rem', lineHeight: '1.4' }}>
                                                {item.subtitle}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 2: MY RESERVATIONS */}
                {activeTab === 'my-bookings' && (
                    <div style={{ marginTop: '2rem' }}>
                        <h2 className="font-serif" style={{ fontSize: '1.8rem', color: '#0f2e1e', marginBottom: '1.2rem' }}>
                            Your Reservation History & Stays
                        </h2>

                        {myBookings.length === 0 ? (
                            <div className="glass-panel" style={{ padding: '50px', textAlign: 'center', color: '#4b5563', borderRadius: '12px' }}>
                                You currently have no reservations logged.
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {myBookings.map(b => (
                                    <div key={b.id} className="glass-panel" style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: '1.5fr 1.2fr 1fr 170px', gap: '1.5rem', alignItems: 'center', borderRadius: '12px', backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                                <span style={{ color: '#059669', fontWeight: 700, fontSize: '0.85rem' }}>{b.id}</span>
                                                <span className={`badge badge-${b.status.toLowerCase()}`}>{b.status}</span>
                                            </div>
                                            <h3 className="font-serif" style={{ fontSize: '1.2rem', color: '#0f2e1e', marginBottom: '2px' }}>
                                                {b.roomCategory}
                                            </h3>
                                            <p style={{ color: '#4b5563', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <MapPin style={{ width: '13px', height: '13px', color: '#16a34a' }} /> {b.branchName}
                                            </p>
                                        </div>

                                        <div>
                                            <div style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: 600 }}>Stay Dates & Payment</div>
                                            <div style={{ fontSize: '0.85rem', color: '#111827', fontWeight: 600, marginTop: '2px' }}>
                                                {b.checkInDate} &rarr; {b.checkOutDate}
                                            </div>
                                            <div style={{ fontSize: '0.78rem', color: '#15803d', marginTop: '2px', fontWeight: 700 }}>
                                                Deposit Paid (20%): ₹{(b.advanceDeposit || Math.round((b.totalAmount || 0) * 0.20)).toLocaleString()}
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: '#b45309', marginTop: '1px', fontWeight: 600 }}>
                                                Due at Checkout: ₹{(b.remainingBalance || ((b.totalAmount || 0) - (b.advanceDeposit || Math.round((b.totalAmount || 0) * 0.20)))).toLocaleString()}
                                            </div>
                                        </div>

                                        <div>
                                            <div style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: 600 }}>Guest Feedback</div>
                                            {b.status === 'Cancelled' ? (
                                                <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '2px' }}>
                                                    Not Applicable
                                                </div>
                                            ) : b.rating ? (
                                                <div style={{ marginTop: '2px' }}>
                                                    <div style={{ color: '#b45309', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <Star style={{ width: '13px', height: '13px', fill: '#f59e0b', color: '#f59e0b' }} />
                                                        {b.rating} / 5 Rating
                                                    </div>
                                                    {(b.feedback || b.feedbackComments) && (
                                                        <div style={{ fontSize: '0.75rem', color: '#4b5563', fontStyle: 'italic', maxWidth: '160px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                                            "{b.feedback || b.feedbackComments}"
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '2px' }}>
                                                    Unrated
                                                </div>
                                            )}
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '170px', minWidth: '170px', justifySelf: 'end' }}>
                                            {b.status !== 'Cancelled' && b.status !== 'CheckedOut' && (
                                                <button
                                                    onClick={() => setSelectedBookingForService(b)}
                                                    className="btn btn-secondary"
                                                    style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                                                >
                                                    <ConciergeBell style={{ width: '14px', height: '14px' }} />
                                                    Request Service
                                                </button>
                                            )}

                                            {b.status !== 'Cancelled' && (
                                                <button
                                                    onClick={() => {
                                                        setSelectedBookingForFeedback(b);
                                                        setFeedbackRating(b.rating || 5);
                                                        setFeedbackComments(b.feedback || b.feedbackComments || '');
                                                    }}
                                                    className="btn btn-primary"
                                                    style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                                                >
                                                    <Star style={{ width: '14px', height: '14px' }} />
                                                    {b.rating ? 'Edit Rating' : 'Rate Stay'}
                                                </button>
                                            )}

                                            {b.finalBill && (
                                                <button
                                                    onClick={() => setSelectedBillBooking(b)}
                                                    className="btn btn-emerald"
                                                    style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                                                >
                                                    <FileText style={{ width: '14px', height: '14px' }} />
                                                    View Final Bill
                                                </button>
                                            )}

                                            {b.status !== 'Cancelled' && b.status !== 'CheckedOut' && (
                                                <button
                                                    onClick={() => handleCancelBooking(b.id)}
                                                    className="btn btn-outline"
                                                    style={{ fontSize: '0.8rem', padding: '6px 12px', borderColor: '#ef4444', color: '#dc2626' }}
                                                >
                                                    <X style={{ width: '14px', height: '14px' }} />
                                                    Cancel Reservation
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* BOOKING MODAL */}
            {selectedRoom && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '480px', padding: '2rem', backgroundColor: '#ffffff', borderRadius: '16px', position: 'relative' }}>
                        <button onClick={() => setSelectedRoom(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer' }}>
                            <X style={{ width: '18px', height: '18px' }} />
                        </button>

                        <h3 className="font-serif" style={{ fontSize: '1.5rem', color: '#0f2e1e', marginBottom: '2px' }}>
                            Reserve Suite
                        </h3>
                        <p style={{ color: '#16a34a', fontSize: '0.85rem', marginBottom: '1.2rem', fontWeight: 600 }}>
                            {selectedRoom.category} &bull; ₹{selectedRoom.pricePerNight.toLocaleString()} / night
                        </p>

                        <form onSubmit={handleConfirmBooking} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ fontSize: '0.8rem', color: '#0f2e1e', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Check-In Date</label>
                                <input type="date" required value={checkInDate} onChange={(e) => setCheckInDate(e.target.value)} className="input-field" />
                            </div>

                            <div>
                                <label style={{ fontSize: '0.8rem', color: '#0f2e1e', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Check-Out Date</label>
                                <input type="date" required value={checkOutDate} onChange={(e) => setCheckOutDate(e.target.value)} className="input-field" />
                            </div>

                            <div>
                                <label style={{ fontSize: '0.8rem', color: '#0f2e1e', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Special Requests</label>
                                <textarea rows={2} placeholder="High floor, Kesar Thandai, extra towels..." value={specialRequests} onChange={(e) => setSpecialRequests(e.target.value)} className="input-field" />
                            </div>

                            <div>
                                <label style={{ fontSize: '0.8rem', color: '#0f2e1e', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                                    Aadhar Card Number <span style={{ color: '#dc2626' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    maxLength={14}
                                    placeholder="Enter 12-digit Aadhar number"
                                    value={aadharNumber}
                                    onChange={(e) => {
                                        // Allow digits and spaces only
                                        const val = e.target.value.replace(/[^\d ]/g, '');
                                        setAadharNumber(val);
                                    }}
                                    className="input-field"
                                    style={{
                                        letterSpacing: '0.1em',
                                        fontFamily: 'monospace',
                                        borderColor: aadharNumber.replace(/\s/g,'').length > 0 && aadharNumber.replace(/\s/g,'').length < 12 ? '#ef4444' : '#16a34a'
                                    }}
                                />
                                <p style={{ fontSize: '0.72rem', color: '#6b7280', marginTop: '3px', margin: '3px 0 0 0' }}>
                                    Your Aadhar number is securely stored and used only for identity verification.
                                </p>
                            </div>

                            {/* PARTIAL DEPOSIT PAYMENT BREAKDOWN */}
                            <div style={{ backgroundColor: '#f0fdf4', padding: '14px 16px', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem', color: '#4b5563' }}>
                                    <span>Total Suite Tariff ({calculateTotal(selectedRoom.pricePerNight) / selectedRoom.pricePerNight} nights):</span>
                                    <span style={{ fontWeight: 600, color: '#0f2e1e' }}>₹{calculateTotal(selectedRoom.pricePerNight).toLocaleString()}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.9rem', color: '#166534', fontWeight: 700 }}>
                                    <span>Pay Today (20% Deposit):</span>
                                    <span style={{ fontSize: '1.25rem', color: '#15803d' }}>
                                        ₹{Math.round(calculateTotal(selectedRoom.pricePerNight) * 0.20).toLocaleString()}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#b45309', fontWeight: 600, borderTop: '1px dashed #cbd5e1', paddingTop: '6px' }}>
                                    <span>Remaining Balance Due at Check-Out:</span>
                                    <span>₹{(calculateTotal(selectedRoom.pricePerNight) - Math.round(calculateTotal(selectedRoom.pricePerNight) * 0.20)).toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Terms and conditions policy checkout check */}
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginTop: '6px' }}>
                                <input
                                    type="checkbox"
                                    id="agree-checkbox"
                                    checked={agreedToTerms}
                                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                                    style={{ marginTop: '3px', width: '16px', height: '16px', cursor: 'pointer', flexShrink: 0 }}
                                />
                                <label htmlFor="agree-checkbox" style={{ fontSize: '0.8rem', color: '#4b5563', lineHeight: '1.4', cursor: 'pointer', userSelect: 'none' }}>
                                    I agree to the{' '}
                                    <a
                                        href="/Guest_policy.html"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        style={{ color: '#16a34a', fontWeight: 600, textDecoration: 'underline' }}
                                    >
                                        Terms &amp; Conditions
                                    </a>{' '}and{' '}
                                    <a
                                        href="/cancellation-policy.html"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        style={{ color: '#16a34a', fontWeight: 600, textDecoration: 'underline' }}
                                    >
                                        Cancellation Policy
                                    </a>{' '}of LUXESTAY.
                                </label>
                            </div>

                            <button type="submit" disabled={submittingBooking || !agreedToTerms} className="btn btn-primary" style={{ padding: '12px', width: '100%', borderRadius: '8px', fontWeight: 700, opacity: agreedToTerms ? 1 : 0.6, cursor: agreedToTerms ? 'pointer' : 'not-allowed' }}>
                                {submittingBooking ? 'Processing Reservation...' : `Pay 20% Deposit (₹${Math.round(calculateTotal(selectedRoom.pricePerNight) * 0.20).toLocaleString()}) & Confirm Stay`}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* SERVICE REQUEST MODAL */}
            {selectedBookingForService && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '460px', padding: '2rem', backgroundColor: '#ffffff', borderRadius: '14px', position: 'relative' }}>
                        <button onClick={() => setSelectedBookingForService(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer' }}>
                            <X style={{ width: '18px', height: '18px' }} />
                        </button>

                        <h3 className="font-serif" style={{ fontSize: '1.4rem', color: '#0f2e1e', marginBottom: '2px' }}>
                            Request Room Service
                        </h3>
                        <p style={{ color: '#4b5563', fontSize: '0.85rem', marginBottom: '1.2rem' }}>
                            Booking {selectedBookingForService.id}
                        </p>

                        <form onSubmit={handleRequestService} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ fontSize: '0.8rem', color: '#0f2e1e', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Service Category</label>
                                <select value={serviceType} onChange={(e) => setServiceType(e.target.value)} className="input-field">
                                    <option value="Room Service">Gourmet Indian Dining (Thali, Naan, Biryani)</option>
                                    <option value="Housekeeping">Housekeeping & Floral Jasmine Refresh</option>
                                    <option value="Laundry">Express Kurta, Saree & Suit Dry Cleaning</option>
                                    <option value="Towel Refresh">Extra Organic Cotton Towels & Pillows</option>
                                    <option value="Spa">Kerala Ayurvedic Massage & Therapy</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ fontSize: '0.8rem', color: '#0f2e1e', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Order Details</label>
                                <textarea required rows={3} placeholder="Describe items or specific requests..." value={serviceDetails} onChange={(e) => setServiceDetails(e.target.value)} className="input-field" />
                            </div>

                            <button type="submit" disabled={submittingService} className="btn btn-emerald" style={{ padding: '10px', width: '100%', borderRadius: '8px' }}>
                                {submittingService ? 'Sending...' : 'Send Request'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* RATING & FEEDBACK MODAL */}
            {selectedBookingForFeedback && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '460px', padding: '2rem', backgroundColor: '#ffffff', borderRadius: '14px', position: 'relative' }}>
                        <button onClick={() => setSelectedBookingForFeedback(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer' }}>
                            <X style={{ width: '18px', height: '18px' }} />
                        </button>

                        <h3 className="font-serif" style={{ fontSize: '1.4rem', color: '#0f2e1e', marginBottom: '2px' }}>
                            Rate Stay Experience
                        </h3>
                        <p style={{ color: '#059669', fontSize: '0.85rem', marginBottom: '1.2rem', fontWeight: 600 }}>
                            Booking {selectedBookingForFeedback.id}
                        </p>

                        <form onSubmit={handleSubmitFeedback} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                            <div>
                                <label style={{ fontSize: '0.8rem', color: '#0f2e1e', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                                    Star Rating
                                </label>
                                <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                                    {[1, 2, 3, 4, 5].map((starVal) => (
                                        <button
                                            key={starVal}
                                            type="button"
                                            onClick={() => setFeedbackRating(starVal)}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}
                                        >
                                            <Star style={{
                                                width: '28px',
                                                height: '28px',
                                                color: starVal <= feedbackRating ? '#f59e0b' : '#d1d5db',
                                                fill: starVal <= feedbackRating ? '#f59e0b' : 'transparent'
                                            }} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label style={{ fontSize: '0.8rem', color: '#0f2e1e', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                                    Comments & Feedback
                                </label>
                                <textarea rows={4} placeholder="Describe room comfort, cleanliness, or hospitality..." value={feedbackComments} onChange={(e) => setFeedbackComments(e.target.value)} className="input-field" />
                            </div>

                            <button type="submit" disabled={submittingFeedback} className="btn btn-primary" style={{ padding: '10px', width: '100%', borderRadius: '8px' }}>
                                {submittingFeedback ? 'Submitting...' : 'Submit Feedback'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* FULL-SCREEN MULTI-ANGLE GALLERY LIGHTBOX MODAL */}
            {selectedGalleryRoom && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(5, 18, 12, 0.94)', backdropFilter: 'blur(10px)', zIndex: 2000, display: 'flex', flexDirection: 'column', padding: '24px', overflowY: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <div>
                            <h2 className="font-serif" style={{ fontSize: '1.8rem', color: '#ffffff', marginBottom: '2px' }}>
                                {selectedGalleryRoom.category}
                            </h2>
                            <p style={{ color: '#86efac', fontSize: '0.85rem' }}>
                                {selectedGalleryRoom.branchName} &bull; ₹{selectedGalleryRoom.pricePerNight?.toLocaleString()} / night
                            </p>
                        </div>

                        <button onClick={() => setSelectedGalleryRoom(null)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#ffffff', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                            <X style={{ width: '22px', height: '22px' }} />
                        </button>
                    </div>

                    {/* Picture Thumbnail Gallery Triggers (Zero Text Labels) */}
                    <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', marginBottom: '20px' }}>
                        {[
                            { key: 'bedroom', img: selectedGalleryRoom.bedroomImage || selectedGalleryRoom.image },
                            { key: 'bathroom', img: selectedGalleryRoom.bathroomImage || selectedGalleryRoom.image },
                            { key: 'view', img: selectedGalleryRoom.viewImage || selectedGalleryRoom.image }
                        ].map((thumb) => (
                            <button
                                key={thumb.key}
                                onClick={() => setGalleryActiveTab(thumb.key)}
                                style={{
                                    width: '80px',
                                    height: '54px',
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    border: galleryActiveTab === thumb.key ? '2px solid #22c55e' : '2px solid transparent',
                                    opacity: galleryActiveTab === thumb.key ? 1 : 0.6,
                                    cursor: 'pointer',
                                    padding: 0,
                                    background: 'none',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <img src={thumb.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </button>
                        ))}
                    </div>

                    {/* Active High-Res Photo Display */}
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', minHeight: '360px', maxHeight: '560px', overflow: 'hidden', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.2)' }}>
                        <img
                            src={
                                galleryActiveTab === 'bathroom' ? (selectedGalleryRoom.bathroomImage || selectedGalleryRoom.image) :
                                galleryActiveTab === 'view' ? (selectedGalleryRoom.viewImage || selectedGalleryRoom.image) :
                                (selectedGalleryRoom.bedroomImage || selectedGalleryRoom.image)
                            }
                            alt={selectedGalleryRoom.category}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px' }}
                        />
                    </div>

                    {/* Modal Bottom Action Controls */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', flexWrap: 'wrap', gap: '12px' }}>
                        <div style={{ color: '#cbd5e1', fontSize: '0.85rem' }}>
                            Showing {galleryActiveTab.toUpperCase()} perspective.
                        </div>

                        <button
                            onClick={() => {
                                const targetRoom = selectedGalleryRoom;
                                setSelectedGalleryRoom(null);
                                setSelectedRoom(targetRoom);
                            }}
                            className="btn btn-primary"
                            style={{ padding: '12px 28px', borderRadius: '30px', fontSize: '1rem', fontWeight: 700 }}
                        >
                            Reserve Suite Now
                        </button>
                    </div>
                </div>
            )}

            {/* GUEST FINAL BILL RECEIPT MODAL */}
            {selectedBillBooking && selectedBillBooking.finalBill && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '440px', padding: '2rem', backgroundColor: '#ffffff', borderRadius: '16px', position: 'relative' }}>
                        <button onClick={() => setSelectedBillBooking(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer' }}>
                            <X style={{ width: '18px', height: '18px' }} />
                        </button>

                        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#16a34a', textTransform: 'uppercase', letterSpacing: '0.1em' }}>LUXESTAY Official Invoice</span>
                            <h3 className="font-serif" style={{ fontSize: '1.6rem', color: '#0f2e1e', margin: '4px 0 2px' }}>Final Settlement Bill</h3>
                            <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: 0 }}>Receipt #{selectedBillBooking.finalBill.fbid}</p>
                        </div>

                        <div style={{ backgroundColor: '#f9fafb', borderRadius: '10px', padding: '16px', border: '1px solid #e5e7eb', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ color: '#4b5563' }}>Guest Name</span>
                                <span style={{ fontWeight: 600, color: '#111827' }}>{selectedBillBooking.guestName}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ color: '#4b5563' }}>Room & Dates</span>
                                <span style={{ fontWeight: 600, color: '#111827' }}>Room {selectedBillBooking.roomNumber} ({selectedBillBooking.checkInDate} to {selectedBillBooking.checkOutDate})</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ color: '#4b5563' }}>Room Charges</span>
                                <span style={{ fontWeight: 600, color: '#111827' }}>₹{(selectedBillBooking.finalBill.roomAmount || selectedBillBooking.totalAmount || 0).toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ color: '#4b5563' }}>In-Room Services</span>
                                <span style={{ fontWeight: 600, color: '#111827' }}>+ ₹{(selectedBillBooking.finalBill.servicesAmount || 0).toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ color: '#16a34a' }}>Advance Deposit (20%)</span>
                                <span style={{ fontWeight: 600, color: '#16a34a' }}>- ₹{(selectedBillBooking.finalBill.advanceDepositPaid || 0).toLocaleString()}</span>
                            </div>
                            <div style={{ borderTop: '2px dashed #d1d5db', paddingTop: '10px', marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: 700, color: '#0f2e1e', fontSize: '0.95rem' }}>Final Amount Paid</span>
                                <span style={{ fontWeight: 800, color: '#0f2e1e', fontSize: '1.25rem' }}>₹{(selectedBillBooking.finalBill.fbillamt || 0).toLocaleString()}</span>
                            </div>
                        </div>

                        <button onClick={() => setSelectedBillBooking(null)} className="btn btn-primary" style={{ width: '100%', padding: '10px' }}>
                            Close Receipt
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
