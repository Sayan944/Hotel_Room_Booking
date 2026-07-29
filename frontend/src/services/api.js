const API_BASE_URL = 'http://localhost:5000/api';

async function request(endpoint, options = {}) {
    const token = localStorage.getItem('hms_token');

    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {})
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Server request failed');
    }

    return data;
}

export const api = {
    // Auth
    login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
    register: (userData) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
    getProfile: () => request('/auth/me'),

    // Rooms
    getRoomMeta: () => request('/rooms/meta'),
    getBranches: async () => {
        const meta = await request('/rooms/meta');
        return meta.branches || [];
    },
    getCategories: async () => {
        const meta = await request('/rooms/meta');
        return meta.roomCategories || [];
    },
    getRooms: (queryParams = {}) => {
        const cleaned = {};
        Object.keys(queryParams).forEach(key => {
            const val = queryParams[key];
            if (val !== undefined && val !== null && val !== '' && val !== 'ALL') {
                cleaned[key] = val;
            }
        });
        const query = new URLSearchParams(cleaned).toString();
        return request(`/rooms${query ? `?${query}` : ''}`);
    },
    createRoom: (roomData) => request('/rooms', { method: 'POST', body: JSON.stringify(roomData) }),
    updateRoomStatus: (roomId, status) => request(`/rooms/${roomId}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),

    // Bookings
    getMyBookings: () => request('/bookings/my'),
    createBooking: (bookingData) => request('/bookings', { method: 'POST', body: JSON.stringify(bookingData) }),
    cancelBooking: (bookingId) => request(`/bookings/${bookingId}/cancel`, { method: 'POST' }),
    requestService: (bookingId, serviceData) => request(`/bookings/${bookingId}/services`, { method: 'POST', body: JSON.stringify(serviceData) }),
    submitFeedback: (bookingId, feedbackData) => request(`/bookings/${bookingId}/rating`, { method: 'POST', body: JSON.stringify(feedbackData) }),
    
    // Admin & FrontDesk Bookings
    getAllBookings: () => request('/bookings'),
    updateBookingStatus: (bookingId, status) => request(`/bookings/${bookingId}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    updateServiceStatus: (bookingId, serviceId, status = 'Completed') => request(`/bookings/${bookingId}/services/${serviceId}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    generateFinalBill: (bookingId, paymentStatus = 'Paid') => request(`/bookings/${bookingId}/final-bill`, { method: 'POST', body: JSON.stringify({ paymentStatus }) }),

    // Admin Dashboard & Staff
    getAdminDashboard: () => request('/admin/dashboard'),
    getStaff: () => request('/admin/staff'),
    addStaff: (staffData) => request('/admin/staff', { method: 'POST', body: JSON.stringify(staffData) }),
    getReports: () => request('/admin/reports'),
    getReviews: () => request('/admin/reviews'),
    getGuests: () => request('/admin/guests'),
    assignStaffRoom: (staffId, roomNumber) => request(`/admin/staff/${staffId}/assign-room`, { method: 'PATCH', body: JSON.stringify({ roomNumber }) })
};
