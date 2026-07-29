// Application Controller for Hotel Room Management System
// Controls views, data rendering, search filtering, modals, forms, and reports.

(function () {
    // Current application state
    let currentRole = 'guest';
    let activeTabId = 'guest-home';
    let ratingStarsSelected = 5;

    // Define navigation tabs configuration per role
    const NAV_TABS = {
        guest: [
            { id: 'guest-home', name: 'Home' },
            { id: 'guest-search', name: 'Search Rooms' },
            { id: 'guest-history', name: 'Profile & History' }
        ],
        frontdesk: [
            { id: 'frontdesk-portal-sub', name: 'Desk Operations Dashboard', isContainer: true }
        ],
        admin: [
            { id: 'admin-portal-sub', name: 'Executive Control Dashboard', isContainer: true }
        ]
    };

    // DOM Elements Cache
    const el = {
        roleSwitcherContainer: document.querySelector('.role-switcher-container'),
        roleNavTabs: document.getElementById('role-nav-tabs'),
        headerUserName: document.getElementById('header-user-name'),
        headerUserRole: document.getElementById('header-user-role'),
        headerAvatar: document.getElementById('header-avatar'),
        
        // Portal panels
        guestPortal: document.getElementById('guest-portal'),
        frontdeskPortal: document.getElementById('frontdesk-portal'),
        adminPortal: document.getElementById('admin-portal'),
        
        // Search inputs (Guest Search Tab)
        filterCity: document.getElementById('filter-city'),
        filterCheckin: document.getElementById('filter-dates-checkin'),
        filterCheckout: document.getElementById('filter-dates-checkout'),
        filterPrice: document.getElementById('filter-price'),
        priceSliderLabel: document.getElementById('price-slider-label'),
        applyFiltersBtn: document.getElementById('apply-filters-btn'),
        sortPopularity: document.getElementById('filter-sort-popularity'),
        roomsResultsGrid: document.getElementById('rooms-results-grid'),
        matchingRoomsCount: document.getElementById('matching-rooms-count'),
        
        // Booking modal elements
        bookingForm: document.getElementById('booking-form'),
        bookingRoomId: document.getElementById('booking-form-room-id'),
        bookingRoomCat: document.getElementById('booking-modal-room-cat'),
        bookingBranch: document.getElementById('booking-modal-branch'),
        bookingTariff: document.getElementById('booking-modal-tariff'),
        bookGuestName: document.getElementById('book-guest-name'),
        bookGuestEmail: document.getElementById('book-guest-email'),
        bookGuestPhone: document.getElementById('book-guest-phone'),
        bookCheckin: document.getElementById('book-checkin'),
        bookCheckout: document.getElementById('book-checkout'),
        bookSpecial: document.getElementById('book-special'),
        bookingTotal: document.getElementById('booking-modal-total'),

        // Profile Form
        updateProfileForm: document.getElementById('update-profile-form'),
        profileNameInput: document.getElementById('profile-name-input'),
        profilePhoneInput: document.getElementById('profile-phone-input'),
        profileEmailInput: document.getElementById('profile-email-input'),
        profileAddressInput: document.getElementById('profile-address-input'),
        sidebarUserName: document.getElementById('sidebar-user-name'),
        sidebarUserEmail: document.getElementById('sidebar-user-email'),
        sidebarAvatar: document.getElementById('sidebar-avatar'),

        // Front Desk Active Table
        fdActiveGuestsTbody: document.getElementById('fd-active-guests-tbody'),
        fdActiveSearch: document.getElementById('fd-active-search'),
        fdQueueTbody: document.getElementById('fd-queue-tbody'),
        fdQueueSearch: document.getElementById('fd-queue-search'),
        fdServicesTbody: document.getElementById('fd-services-tbody'),
        fdHouseTbody: document.getElementById('fd-house-tbody'),
        fdHouseSearch: document.getElementById('fd-house-search'),
        srvBookingId: document.getElementById('srv-booking-id'),
        serviceRequestForm: document.getElementById('service-request-form'),

        // Admin overview
        statOccupancy: document.getElementById('stat-occupancy-rate'),
        statRevenue: document.getElementById('stat-total-revenue'),
        statAdr: document.getElementById('stat-adr'),
        statRevpar: document.getElementById('stat-revpar'),
        admTimelineTbody: document.getElementById('adm-timeline-tbody'),
        admTimelineSearch: document.getElementById('adm-timeline-search'),
        admBranchesTbody: document.getElementById('adm-branches-tbody'),
        admBranchSearch: document.getElementById('adm-branch-search'),
        admRoomsTbody: document.getElementById('adm-rooms-tbody'),
        admRoomSearch: document.getElementById('adm-room-search'),
        admStaffTbody: document.getElementById('adm-staff-tbody'),
        admStaffSearch: document.getElementById('adm-staff-search'),
        admHousekeepingTbody: document.getElementById('adm-housekeeping-tbody'),
        admHousekeepingSearch: document.getElementById('adm-housekeeping-search'),
        admGuestsTbody: document.getElementById('adm-guests-tbody'),
        admGuestSearch: document.getElementById('adm-guest-search'),
        admRatingsTbody: document.getElementById('adm-ratings-tbody'),
        
        // Report selectors
        reportMonth: document.getElementById('report-month'),
        reportOutputWrapper: document.getElementById('report-output-wrapper'),
        reportTitleDates: document.getElementById('report-title-dates'),
        reportOccupancy: document.getElementById('report-occupancy'),
        reportRevenue: document.getElementById('report-revenue'),
        reportAdr: document.getElementById('report-adr'),
        reportRevpar: document.getElementById('report-revpar'),
        reportBookingsActive: document.getElementById('report-bookings-active'),
        reportBookingsSettled: document.getElementById('report-bookings-settled'),
        reportBookingsCancelled: document.getElementById('report-bookings-cancelled'),
        reportServicesRevenue: document.getElementById('report-services-revenue'),

        // Admin Forms Add Modals
        addBranchForm: document.getElementById('add-branch-form'),
        addRoomForm: document.getElementById('add-room-form'),
        addStaffForm: document.getElementById('add-staff-form'),
        rmBranchSelect: document.getElementById('rm-branch'),
        stBranchSelect: document.getElementById('st-branch')
    };

    // Initialize Page Controller
    function init() {
        setupEventListeners();
        switchRole('guest'); // Default role view is guest
        populateBranchesDropdowns();
        renderGuestRoomsList();
        syncUserProfileUI();
        
        // Seed default search dates (today and tomorrow)
        const today = new Date().toISOString().split('T')[0];
        const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
        if (el.filterCheckin) el.filterCheckin.value = today;
        if (el.filterCheckout) el.filterCheckout.value = tomorrow;
    }

    // Set up global listeners
    function setupEventListeners() {
        // Role Selection
        el.roleSwitcherContainer.addEventListener('click', function(e) {
            const btn = e.target.closest('.role-btn');
            if (btn) {
                document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                switchRole(btn.dataset.role);
            }
        });

        // Price range slider label updater
        if (el.filterPrice) {
            el.filterPrice.addEventListener('input', function() {
                el.priceSliderLabel.textContent = `$${this.value}`;
            });
        }

        // Apply filters button
        if (el.applyFiltersBtn) {
            el.applyFiltersBtn.addEventListener('click', function() {
                renderGuestRoomsList();
            });
        }

        // Sort filter popularity dropdown
        if (el.sortPopularity) {
            el.sortPopularity.addEventListener('change', function() {
                renderGuestRoomsList();
            });
        }

        // Profile Form Submit
        if (el.updateProfileForm) {
            el.updateProfileForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const name = document.getElementById('profile-name-input').value;
                const phone = document.getElementById('profile-phone-input').value;
                const address = document.getElementById('profile-address-input').value;
                
                window.HotelDB.updateCurrentUser({ name, phone, address });
                syncUserProfileUI();
                alert('Profile updated successfully!');
            });
        }

        // Rating Star selector click listener
        const ratingStars = document.querySelectorAll('#rating-stars-container span');
        ratingStars.forEach(star => {
            star.addEventListener('click', function() {
                const val = parseInt(this.dataset.val);
                ratingStarsSelected = val;
                document.getElementById('rate-score-value').value = val;
                
                // Toggle classes
                ratingStars.forEach((s, idx) => {
                    if (idx < val) {
                        s.classList.add('selected');
                    } else {
                        s.classList.remove('selected');
                    }
                });
            });
        });

        // Rating form submit
        document.getElementById('rating-form').addEventListener('submit', function(e) {
            e.preventDefault();
            const bId = document.getElementById('rate-form-booking-id').value;
            const score = parseInt(document.getElementById('rate-score-value').value);
            const comment = document.getElementById('rate-comment').value;

            window.HotelDB.updateBooking(bId, {
                rating: { score, comment }
            });
            
            closeModal('rate-modal');
            renderBookingHistory();
            renderAdminRatings();
            alert('Thank you for rating your stay!');
        });

        // Guest details subtab sidebar switcher
        document.querySelectorAll('#guest-history .sidebar-item').forEach(item => {
            item.addEventListener('click', function() {
                document.querySelectorAll('#guest-history .sidebar-item').forEach(i => i.classList.remove('active'));
                this.classList.add('active');
                
                document.querySelectorAll('.dashboard-subtab').forEach(tab => tab.style.display = 'none');
                document.getElementById(this.dataset.subtab).style.display = 'block';
            });
        });

        // Front desk subview switcher
        document.querySelectorAll('#frontdesk-portal .sidebar-item').forEach(item => {
            item.addEventListener('click', function() {
                document.querySelectorAll('#frontdesk-portal .sidebar-item').forEach(i => i.classList.remove('active'));
                this.classList.add('active');
                
                document.querySelectorAll('.fd-subview').forEach(sub => sub.style.display = 'none');
                document.getElementById(this.dataset.fdTab).style.display = 'block';
            });
        });

        // Admin subview switcher
        document.querySelectorAll('#admin-portal .sidebar-item').forEach(item => {
            item.addEventListener('click', function() {
                document.querySelectorAll('#admin-portal .sidebar-item').forEach(i => i.classList.remove('active'));
                this.classList.add('active');
                
                document.querySelectorAll('.adm-subview').forEach(sub => sub.style.display = 'none');
                document.getElementById(this.dataset.adminTab).style.display = 'block';
            });
        });

        // Real-time searches listeners
        el.historySearchInput = document.getElementById('history-search-input');
        if (el.historySearchInput) {
            el.historySearchInput.addEventListener('input', renderBookingHistory);
        }
        if (el.fdActiveSearch) {
            el.fdActiveSearch.addEventListener('input', renderFrontDeskActiveGuests);
        }
        if (el.fdQueueSearch) {
            el.fdQueueSearch.addEventListener('input', renderFrontDeskQueue);
        }
        if (el.fdHouseSearch) {
            el.fdHouseSearch.addEventListener('input', renderFrontDeskHousekeeping);
        }
        if (el.admTimelineSearch) {
            el.admTimelineSearch.addEventListener('input', renderAdminOverview);
        }
        if (el.admBranchSearch) {
            el.admBranchSearch.addEventListener('input', renderAdminBranches);
        }
        if (el.admRoomSearch) {
            el.admRoomSearch.addEventListener('input', renderAdminRooms);
        }
        if (el.admStaffSearch) {
            el.admStaffSearch.addEventListener('input', renderAdminStaff);
        }
        if (el.admHousekeepingSearch) {
            el.admHousekeepingSearch.addEventListener('input', renderAdminHousekeeping);
        }
        if (el.admGuestSearch) {
            el.admGuestSearch.addEventListener('input', renderAdminGuests);
        }

        // Quick Search hero section button
        document.getElementById('guest-home-search-btn').addEventListener('click', function() {
            // Copy fields to explore inputs
            const city = document.getElementById('search-city').value;
            const checkin = document.getElementById('search-checkin').value;
            const checkout = document.getElementById('search-checkout').value;
            
            if (el.filterCity) el.filterCity.value = city;
            if (el.filterCheckin) el.filterCheckin.value = checkin;
            if (el.filterCheckout) el.filterCheckout.value = checkout;

            // Switch to explore tab
            switchTab('guest-search');
            renderGuestRoomsList();
        });

        // Dates event logic for booking modal to calculate rates
        el.bookCheckin.addEventListener('change', calculateBookingModalPrice);
        el.bookCheckout.addEventListener('change', calculateBookingModalPrice);

        // Booking form secure submit
        el.bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const roomId = el.bookingRoomId.value;
            const guestName = el.bookGuestName.value;
            const guestEmail = el.bookGuestEmail.value;
            const guestPhone = el.bookGuestPhone.value;
            const checkIn = el.bookCheckin.value;
            const checkOut = el.bookCheckout.value;
            const special = el.bookSpecial.value;

            // Find Room
            const room = window.HotelDB.getRooms().find(r => r.id === roomId);
            if (!room) return;

            const todayStr = new Date().toISOString().slice(0, 10);
            if (checkIn < todayStr) {
                alert('Check-in date cannot be earlier than the current date.');
                return;
            }

            // Calculate stays
            const days = Math.ceil((new Date(checkOut) - new Date(checkIn)) / 86400000);
            if (days <= 0) {
                alert('Check-out date must be after check-in date.');
                return;
            }
            const total = room.pricePerNight * days;

            // Add booking
            const newBooking = window.HotelDB.addBooking({
                userId: window.HotelDB.getCurrentUser().id,
                guestName,
                guestEmail,
                guestPhone,
                branchId: room.branchId,
                roomId: room.id,
                roomCategory: room.category,
                checkInDate: checkIn,
                checkOutDate: checkOut,
                totalAmount: total,
                specialRequests: special
            });

            closeModal('booking-modal');
            
            // Re-render
            renderGuestRoomsList();
            renderBookingHistory();
            renderFrontDeskQueue();
            
            // Show receipt immediately
            openReceiptModal(newBooking.id);
        });

        // Front desk service requests log submit
        el.serviceRequestForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const bId = el.srvBookingId.value;
            const type = document.getElementById('srv-type').value;
            const cost = parseFloat(document.getElementById('srv-cost').value);
            const details = document.getElementById('srv-details').value;

            const booking = window.HotelDB.getBookings().find(b => b.id === bId);
            if (booking) {
                booking.serviceRequests = booking.serviceRequests || [];
                booking.serviceRequests.push({
                    id: 'SR-' + Math.floor(Math.random() * 100000),
                    type,
                    cost,
                    details,
                    status: 'Pending'
                });
                window.HotelDB.updateBooking(bId, { serviceRequests: booking.serviceRequests });
                
                closeModal('service-modal');
                renderFrontDeskServices();
                renderFrontDeskActiveGuests();
                alert('Service request logged successfully.');
            }
        });

        // Admin additions submits
        el.addBranchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('br-name').value;
            const city = document.getElementById('br-city').value;
            const phone = document.getElementById('br-phone').value;
            const email = document.getElementById('br-email').value;

            window.HotelDB.addBranch({ name, city, phone, email });
            el.addBranchForm.reset();
            closeModal('add-branch-modal');
            populateBranchesDropdowns();
            renderAdminBranches();
            alert('Branch added successfully.');
        });

        el.addRoomForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const roomNumber = document.getElementById('rm-number').value;
            const branchId = document.getElementById('rm-branch').value;
            const category = document.getElementById('rm-category').value;
            const pricePerNight = parseFloat(document.getElementById('rm-price').value);

            // Amenities checked
            const amenities = [];
            document.querySelectorAll('.rm-amenity-cb:checked').forEach(cb => {
                amenities.push(cb.value);
            });

            window.HotelDB.addRoom({
                roomNumber,
                branchId,
                category,
                pricePerNight,
                amenities,
                status: 'Available',
                popularity: 5.0
            });

            el.addRoomForm.reset();
            closeModal('add-room-modal');
            renderAdminRooms();
            renderGuestRoomsList();
            alert('Room added to inventory.');
        });

        el.addStaffForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('st-name').value;
            const role = document.getElementById('st-role').value;
            const phone = document.getElementById('st-phone').value;
            const email = document.getElementById('st-email').value;
            const branchId = document.getElementById('st-branch').value;

            window.HotelDB.addStaff({
                name,
                role,
                phone,
                email,
                branchId,
                status: 'Active'
            });

            el.addStaffForm.reset();
            closeModal('add-staff-modal');
            renderAdminStaff();
            alert('Staff member registered.');
        });
    }

    // Role switcher panel loader
    function switchRole(role) {
        currentRole = role;
        
        // Hide all major portals
        el.guestPortal.classList.remove('active');
        el.frontdeskPortal.classList.remove('active');
        el.adminPortal.classList.remove('active');
        
        // Update user badge roles for aesthetics
        const curUser = window.HotelDB.getCurrentUser();
        el.headerUserName.textContent = curUser.name;

        if (role === 'guest') {
            el.guestPortal.classList.add('active');
            el.headerUserRole.textContent = 'Guest Persona';
            el.headerAvatar.textContent = curUser.name.split(' ').map(n => n[0]).join('');
        } else if (role === 'frontdesk') {
            el.frontdeskPortal.classList.add('active');
            el.headerUserRole.textContent = 'Front Desk Agent';
            el.headerAvatar.textContent = 'FD';
            
            // Seed operations
            renderFrontDeskActiveGuests();
            renderFrontDeskQueue();
            renderFrontDeskServices();
            renderFrontDeskHousekeeping();
        } else if (role === 'admin') {
            el.adminPortal.classList.add('active');
            el.headerUserRole.textContent = 'System Executive';
            el.headerAvatar.textContent = 'AD';
            
            // Seed operations
            renderAdminOverview();
            renderAdminBranches();
            renderAdminRooms();
            renderAdminStaff();
            renderAdminHousekeeping();
            renderAdminGuests();
            renderAdminRatings();
        }

        // Build Nav Tabs
        el.roleNavTabs.innerHTML = '';
        const tabs = NAV_TABS[role];
        if (tabs && tabs.length > 0) {
            tabs.forEach((tab, index) => {
                const navLink = document.createElement('a');
                navLink.className = `nav-link ${index === 0 ? 'active' : ''}`;
                navLink.textContent = tab.name;
                navLink.dataset.tab = tab.id;
                navLink.addEventListener('click', function() {
                    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                    this.classList.add('active');
                    window.switchTab(tab.id);
                });
                el.roleNavTabs.appendChild(navLink);
            });
            // Auto switch to first tab
            window.switchTab(tabs[0].id);
        } else {
            // Single view container, hide nav bar if no choices
            el.roleNavTabs.innerHTML = `<span style="font-size: 0.9rem; font-weight:600; color:var(--color-primary); padding: 0.5rem 2rem;">Verdant Springs Control Deck</span>`;
        }
    }

    // View tab switching within portal
    window.switchTab = function(tabId) {
        activeTabId = tabId;
        
        // Guest specific tabs switcher
        if (currentRole === 'guest') {
            document.querySelectorAll('#guest-portal .view-section').forEach(sec => {
                sec.classList.remove('active');
            });
            const targetSection = document.getElementById(tabId);
            if (targetSection) {
                targetSection.classList.add('active');
            }

            if (tabId === 'guest-history') {
                renderBookingHistory();
            }
        }
    };

    // Populate branch drop downs across modals and filters
    function populateBranchesDropdowns() {
        const branches = window.HotelDB.getBranches();
        
        // Guest search filter dropdown
        if (el.filterCity) {
            el.filterCity.innerHTML = '<option value="">All Branches</option>';
            branches.forEach(b => {
                el.filterCity.innerHTML += `<option value="${b.city}">${b.name} (${b.city})</option>`;
            });
        }

        // Admin Room addition branch options
        if (el.rmBranchSelect) {
            el.rmBranchSelect.innerHTML = '';
            branches.forEach(b => {
                el.rmBranchSelect.innerHTML += `<option value="${b.id}">${b.name}</option>`;
            });
        }

        // Admin Staff addition branch options
        if (el.stBranchSelect) {
            el.stBranchSelect.innerHTML = '';
            branches.forEach(b => {
                el.stBranchSelect.innerHTML += `<option value="${b.id}">${b.name}</option>`;
            });
        }
    }

    // Sync profile values
    function syncUserProfileUI() {
        const user = window.HotelDB.getCurrentUser();
        
        if (el.profileNameInput) {
            el.profileNameInput.value = user.name;
            el.profilePhoneInput.value = user.phone;
            el.profileEmailInput.value = user.email;
            el.profileAddressInput.value = user.address;
            
            el.sidebarUserName.textContent = user.name;
            el.sidebarUserEmail.textContent = user.email;
            
            const initials = user.name.split(' ').map(n => n[0]).join('');
            el.sidebarAvatar.textContent = initials;
            
            if (currentRole === 'guest') {
                el.headerUserName.textContent = user.name;
                el.headerAvatar.textContent = initials;
            }
        }
    }

    // Check if a room is booked during date range
    function isRoomAvailable(roomId, checkInStr, checkOutStr) {
        if (!checkInStr || !checkOutStr) return true;
        
        const targetCheckIn = new Date(checkInStr);
        const targetCheckOut = new Date(checkOutStr);
        
        if (isNaN(targetCheckIn) || isNaN(targetCheckOut) || targetCheckIn >= targetCheckOut) return true;
        
        const bookings = window.HotelDB.getBookings();
        
        // Find if room overlaps with active bookings
        return !bookings.some(b => {
            if (b.roomId !== roomId) return false;
            if (b.status === 'Cancelled' || b.status === 'CheckedOut') return false;
            
            const bCheckIn = new Date(b.checkInDate);
            const bCheckOut = new Date(b.checkOutDate);
            
            // Date range overlap check: targetCheckIn < bCheckOut && targetCheckOut > bCheckIn
            return (targetCheckIn < bCheckOut && targetCheckOut > bCheckIn);
        });
    }

    // Render Explore/Search Rooms
    function renderGuestRoomsList() {
        if (!el.roomsResultsGrid) return;

        const city = el.filterCity ? el.filterCity.value : '';
        const checkin = el.filterCheckin ? el.filterCheckin.value : '';
        const checkout = el.filterCheckout ? el.filterCheckout.value : '';
        const maxPrice = el.filterPrice ? parseFloat(el.filterPrice.value) : 800;
        const sort = el.sortPopularity ? el.sortPopularity.value : '';
        
        // Get active checkboxes
        const selectedAmenities = [];
        document.querySelectorAll('.amenity-checkbox:checked').forEach(cb => {
            selectedAmenities.push(cb.value);
        });

        let rooms = window.HotelDB.getRooms();
        const branches = window.HotelDB.getBranches();

        // 1. Filter by City / Branch Location
        if (city) {
            const cityLower = city.toLowerCase();
            const matchingBranches = branches.filter(b => 
                b.city.toLowerCase().includes(cityLower) || 
                b.name.toLowerCase().includes(cityLower) ||
                b.id.toLowerCase() === cityLower
            ).map(b => b.id);
            rooms = rooms.filter(r => matchingBranches.includes(r.branchId));
        }

        // 2. Filter by Room availability on date ranges
        if (checkin && checkout) {
            rooms = rooms.filter(r => isRoomAvailable(r.id, checkin, checkout));
        }

        // 3. Filter by Price
        rooms = rooms.filter(r => r.pricePerNight <= maxPrice);

        // 4. Filter by category from hero search if any
        const catSearch = document.getElementById('search-category').value;
        if (catSearch && activeTabId === 'guest-search') {
            rooms = rooms.filter(r => r.category === catSearch);
            // clear it after initial use
            document.getElementById('search-category').value = '';
        }

        // 5. Filter by Amenities (Normalized string matching for Minibar / Mini Bar)
        if (selectedAmenities.length > 0) {
            rooms = rooms.filter(r => {
                const roomAmNorm = (r.amenities || []).map(a => a.toLowerCase().replace(/[^a-z0-9]/g, ''));
                return selectedAmenities.every(reqAm => {
                    const normReq = reqAm.toLowerCase().replace(/[^a-z0-9]/g, '');
                    return roomAmNorm.some(ram => ram.includes(normReq) || normReq.includes(ram));
                });
            });
        }

        // 6. Sort
        if (sort === 'popularity-high') {
            rooms.sort((a, b) => b.popularity - a.popularity);
        } else if (sort === 'price-low') {
            rooms.sort((a, b) => a.pricePerNight - b.pricePerNight);
        } else if (sort === 'price-high') {
            rooms.sort((a, b) => b.pricePerNight - a.pricePerNight);
        }

        // Render Cards
        el.roomsResultsGrid.innerHTML = '';
        el.matchingRoomsCount.textContent = rooms.length;

        if (rooms.length === 0) {
            el.roomsResultsGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--color-text-muted);">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">🍃</div>
                    <h3>No available rooms match your criteria.</h3>
                    <p>Try broadening your dates, adjusting the budget slider, or selecting fewer filters.</p>
                </div>
            `;
            return;
        }

        rooms.forEach((room, idx) => {
            const branch = branches.find(b => b.id === room.branchId);
            const amenitiesBadges = room.amenities.map(a => `<span class="amenity-badge">${a}</span>`).join('');
            
            // Cycle image classes for visuals
            const bgClass = `room-bg-${(idx % 4) + 1}`;

            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <div class="card-img-container">
                    <div class="card-img-placeholder ${bgClass}">
                        <span>${room.category.split(' ')[0]} ${room.roomNumber}</span>
                    </div>
                    <span class="card-badge">★ ${room.popularity.toFixed(1)}</span>
                </div>
                <div class="card-body">
                    <div class="card-title-row">
                        <h4 class="card-title">${room.category}</h4>
                        <div class="card-price">$${room.pricePerNight}<span>/Night</span></div>
                    </div>
                    <div class="card-meta">
                        📍 ${branch ? branch.name : 'Unknown'}, ${branch ? branch.city : ''}
                    </div>
                    <div class="card-amenities">
                        ${amenitiesBadges}
                    </div>
                    <div class="card-footer">
                        <span style="font-size: 0.8rem; color: #15803d; font-weight: 500; display:flex; align-items:center; gap:0.25rem;">
                            <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background-color:#15803d;"></span>
                            Eco Comforts
                        </span>
                        <button class="card-btn" onclick="openBookingModal('${room.id}')">Book Room</button>
                    </div>
                </div>
            `;
            el.roomsResultsGrid.appendChild(card);
        });
    }

    // --- BOOKING DIALOG FLOW ---
    window.openBookingModal = function(roomId) {
        const room = window.HotelDB.getRooms().find(r => r.id === roomId);
        if (!room) return;

        const branch = window.HotelDB.getBranches().find(b => b.id === room.branchId);
        
        el.bookingRoomId.value = room.id;
        el.bookingRoomCat.textContent = room.category;
        el.bookingBranch.textContent = `${branch.name} - ${branch.city}`;
        el.bookingTariff.textContent = `$${room.pricePerNight} / Night`;

        // Prepopulate current guest info
        const user = window.HotelDB.getCurrentUser();
        el.bookGuestName.value = user.name;
        el.bookGuestEmail.value = user.email;
        el.bookGuestPhone.value = user.phone;

        // Sync date values from search fields
        el.bookCheckin.value = el.filterCheckin.value;
        el.bookCheckout.value = el.filterCheckout.value;

        calculateBookingModalPrice();
        openModal('booking-modal');
    };

    function calculateBookingModalPrice() {
        const roomId = el.bookingRoomId.value;
        const room = window.HotelDB.getRooms().find(r => r.id === roomId);
        if (!room) return;

        const checkin = el.bookCheckin.value;
        const checkout = el.bookCheckout.value;

        if (checkin && checkout) {
            const days = Math.ceil((new Date(checkout) - new Date(checkin)) / 86400000);
            if (days > 0) {
                const total = room.pricePerNight * days;
                el.bookingTotal.textContent = `$${total}`;
                return;
            }
        }
        el.bookingTotal.textContent = '$0';
    }

    // --- RENDER BOOKING HISTORY FOR GUEST ---
    function renderBookingHistory() {
        const tbody = document.getElementById('guest-bookings-table-body');
        if (!tbody) return;

        const searchVal = el.historySearchInput ? el.historySearchInput.value.toLowerCase() : '';
        const bookings = window.HotelDB.getBookings().filter(b => b.userId === window.HotelDB.getCurrentUser().id);
        const branches = window.HotelDB.getBranches();

        tbody.innerHTML = '';
        
        // Filter search input
        const filtered = bookings.filter(b => {
            const branch = branches.find(br => br.id === b.branchId);
            return b.id.toLowerCase().includes(searchVal) ||
                   (branch && branch.name.toLowerCase().includes(searchVal)) ||
                   b.roomCategory.toLowerCase().includes(searchVal);
        });

        if (filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--color-text-muted); padding:2rem;">No reservations recorded matching "${searchVal}".</td></tr>`;
            return;
        }

        filtered.reverse().forEach(b => {
            const branch = branches.find(br => br.id === b.branchId);
            
            // Build Actions buttons dynamically based on booking statuses
            let actionHtml = '';
            if (b.status === 'Pending') {
                actionHtml = `
                    <button class="card-btn-outline" style="padding: 2px 8px; font-size: 0.75rem;" onclick="modifyBookingDatesPrompt('${b.id}')">Modify</button>
                    <button class="card-btn" style="padding: 2px 8px; font-size: 0.75rem; background-color: var(--color-error);" onclick="cancelBookingAction('${b.id}')">Cancel</button>
                `;
            } else if (b.status === 'CheckedIn') {
                actionHtml = `<span style="font-size:0.75rem; color:var(--color-success); font-weight:600;">Active Stay</span>`;
            } else if (b.status === 'CheckedOut') {
                if (b.rating) {
                    actionHtml = `<span class="stars-display">${'★'.repeat(b.rating.score)}</span>`;
                } else {
                    actionHtml = `<button class="card-btn-outline" style="padding: 2px 8px; font-size: 0.75rem; border-color:var(--color-warning); color:var(--color-warning);" onclick="openRatingModal('${b.id}')">Rate Stay</button>`;
                }
            } else if (b.status === 'Cancelled') {
                actionHtml = `<span style="font-size:0.75rem; color:var(--color-text-muted);">Voided</span>`;
            }

            // Badges
            let statusBadge = '';
            if (b.status === 'Pending') statusBadge = '<span class="badge badge-warning">Pending</span>';
            else if (b.status === 'CheckedIn') statusBadge = '<span class="badge badge-info">In Room</span>';
            else if (b.status === 'CheckedOut') statusBadge = '<span class="badge badge-success">Completed</span>';
            else if (b.status === 'Cancelled') statusBadge = '<span class="badge badge-danger">Cancelled</span>';

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="font-weight:600;"><span style="cursor:pointer; color:var(--color-secondary);" onclick="openReceiptModal('${b.id}')">${b.id}</span></td>
                <td>${branch ? branch.name : 'Verdant Springs'}</td>
                <td>${b.roomCategory}</td>
                <td style="font-size:0.75rem;">${b.checkInDate} to ${b.checkOutDate}</td>
                <td style="font-weight:600;">$${b.totalAmount}</td>
                <td>${statusBadge}</td>
                <td style="text-align: right; display:flex; justify-content:flex-end; gap:0.4rem;">${actionHtml}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    // Modify dates logic
    window.modifyBookingDatesPrompt = function(bookingId) {
        const booking = window.HotelDB.getBookings().find(b => b.id === bookingId);
        if (!booking) return;

        const newCheckin = prompt("Enter new Check-In Date (YYYY-MM-DD):", booking.checkInDate);
        if (!newCheckin) return;
        const newCheckout = prompt("Enter new Check-Out Date (YYYY-MM-DD):", booking.checkOutDate);
        if (!newCheckout) return;

        // Check availability
        // Momentarily free current room booking to not overlap with itself
        const origStatus = booking.status;
        booking.status = 'Cancelled'; // Temp disable to check dates
        
        const isAvail = isRoomAvailable(booking.roomId, newCheckin, newCheckout);
        booking.status = origStatus; // restore

        if (!isAvail) {
            alert('Sorry, the room is not available for those dates.');
            return;
        }

        // Recalculate amount
        const days = Math.ceil((new Date(newCheckout) - new Date(newCheckin)) / 86400000);
        if (days <= 0) {
            alert('Invalid date range.');
            return;
        }
        
        const room = window.HotelDB.getRooms().find(r => r.id === booking.roomId);
        const rate = room ? room.pricePerNight : 120;
        const newTotal = rate * days;

        window.HotelDB.updateBooking(bookingId, {
            checkInDate: newCheckin,
            checkOutDate: newCheckout,
            totalAmount: newTotal
        });

        renderBookingHistory();
        renderFrontDeskQueue();
        alert('Booking dates modified successfully!');
    };

    window.cancelBookingAction = function(bookingId) {
        if (confirm('Are you sure you want to cancel this booking? (A cancellation fee may apply under Section 1 terms)')) {
            window.HotelDB.updateBooking(bookingId, { status: 'Cancelled' });
            
            // Release housekeeping assignment if any
            const hk = window.HotelDB.getHousekeeping().find(h => h.roomId === bookingId); // wait, roomId is RM-xxx
            
            renderBookingHistory();
            renderFrontDeskQueue();
            renderAdminOverview();
            alert('Booking cancelled successfully.');
        }
    };

    // Rating modal trigger
    window.openRatingModal = function(bookingId) {
        const booking = window.HotelDB.getBookings().find(b => b.id === bookingId);
        if (!booking) return;

        const branch = window.HotelDB.getBranches().find(br => br.id === booking.branchId);

        document.getElementById('rate-form-booking-id').value = booking.id;
        document.getElementById('rate-modal-hotel').textContent = branch ? branch.name : 'Verdant Springs';
        document.getElementById('rate-modal-dates').textContent = `Stay: ${booking.checkInDate} to ${booking.checkOutDate}`;
        document.getElementById('rate-comment').value = '';
        
        // Reset stars
        ratingStarsSelected = 5;
        document.getElementById('rate-score-value').value = 5;
        document.querySelectorAll('#rating-stars-container span').forEach(s => s.classList.add('selected'));

        openModal('rate-modal');
    };

    // --- RECEIPT MODAL INJECTOR ---
    window.openReceiptModal = function(bookingId) {
        const booking = window.HotelDB.getBookings().find(b => b.id === bookingId);
        if (!booking) return;

        const branch = window.HotelDB.getBranches().find(br => br.id === booking.branchId);

        // Populate receipt
        document.getElementById('rcpt-ref').textContent = booking.id;
        document.getElementById('rcpt-date').textContent = booking.createdDate;
        document.getElementById('rcpt-guest').textContent = booking.guestName;
        document.getElementById('rcpt-branch').textContent = branch ? `${branch.name}, ${branch.city}` : 'Verdant Springs';

        // Nights calculation
        const days = Math.ceil((new Date(booking.checkOutDate) - new Date(booking.checkInDate)) / 86400000) || 1;
        document.getElementById('rcpt-room-detail').textContent = `${booking.roomCategory} (${days} Nights)`;
        
        const baseCost = booking.totalAmount;
        document.getElementById('rcpt-base-total').textContent = `$${baseCost.toFixed(2)}`;

        // Additional services surcharges list
        const srvWrapper = document.getElementById('rcpt-services-list');
        srvWrapper.innerHTML = '';
        let serviceSurcharge = 0;

        if (booking.serviceRequests && booking.serviceRequests.length > 0) {
            booking.serviceRequests.forEach(srv => {
                serviceSurcharge += srv.cost;
                srvWrapper.innerHTML += `
                    <div style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 0.3rem;">
                        <span>↳ Service: ${srv.type} (${srv.details})</span>
                        <span>$${srv.cost.toFixed(2)}</span>
                    </div>
                `;
            });
        }

        // Eco-tax calculate
        const tax = (baseCost + serviceSurcharge) * 0.08;
        document.getElementById('rcpt-tax').textContent = `$${tax.toFixed(2)}`;

        // Net grand total
        const grandTotal = baseCost + serviceSurcharge + tax;
        document.getElementById('rcpt-grand-total').textContent = `$${grandTotal.toFixed(2)}`;

        openModal('receipt-modal');
    };

    // =========================================================
    // FRONT DESK OPERATIONS CONTROLLERS
    // =========================================================
    function renderFrontDeskActiveGuests() {
        const tbody = el.fdActiveGuestsTbody;
        if (!tbody) return;

        const searchVal = el.fdActiveSearch.value.toLowerCase();
        const bookings = window.HotelDB.getBookings().filter(b => b.status === 'CheckedIn');
        const branches = window.HotelDB.getBranches();
        const rooms = window.HotelDB.getRooms();

        tbody.innerHTML = '';

        const filtered = bookings.filter(b => {
            const room = rooms.find(r => r.id === b.roomId);
            const branch = branches.find(br => br.id === b.branchId);
            return b.guestName.toLowerCase().includes(searchVal) ||
                   (room && room.roomNumber.includes(searchVal)) ||
                   (branch && branch.city.toLowerCase().includes(searchVal));
        });

        if (filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:2rem; color:var(--color-text-muted);">No active occupants found.</td></tr>`;
            return;
        }

        filtered.forEach(b => {
            const room = rooms.find(r => r.id === b.roomId);
            const branch = branches.find(br => br.id === b.branchId);
            const pendingServices = b.serviceRequests ? b.serviceRequests.filter(s => s.status === 'Pending').length : 0;

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="font-weight:600;">Room ${room ? room.roomNumber : 'N/A'}</td>
                <td>
                    <div style="font-weight:600;">${b.guestName}</div>
                    <div style="font-size:0.75rem; color:var(--color-text-muted);">${b.guestPhone}</div>
                </td>
                <td style="font-size:0.75rem;">In: ${b.checkInDate}<br>Out: ${b.checkOutDate}</td>
                <td>${branch ? branch.city : 'N/A'}</td>
                <td>
                    <span class="badge ${pendingServices > 0 ? 'badge-warning' : 'badge-success'}">
                        ${pendingServices} Pending Orders
                    </span>
                </td>
                <td style="text-align: right;">
                    <button class="card-btn" style="padding: 4px 10px; font-size: 0.8rem;" onclick="processCheckoutBill('${b.id}')">Checkout & Settle</button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // Sync dropdown list for Guest Requests select options
        if (el.srvBookingId) {
            el.srvBookingId.innerHTML = '';
            bookings.forEach(b => {
                const room = rooms.find(r => r.id === b.roomId);
                el.srvBookingId.innerHTML += `<option value="${b.id}">Room ${room ? room.roomNumber : 'N/A'} - ${b.guestName}</option>`;
            });
        }
    }

    // Process checkout bill
    window.processCheckoutBill = function(bookingId) {
        const booking = window.HotelDB.getBookings().find(b => b.id === bookingId);
        if (!booking) return;

        // Auto complete all service requests before checking out
        if (booking.serviceRequests) {
            booking.serviceRequests.forEach(s => s.status = 'Completed');
        }

        // Set status
        window.HotelDB.updateBooking(bookingId, {
            status: 'CheckedOut',
            serviceRequests: booking.serviceRequests
        });

        // Automatically generate Final Bill
        window.HotelDB.generateFinalBill(bookingId, 'Paid');

        // Set room status to DIRTY
        window.HotelDB.updateRoom(booking.roomId, { status: 'Dirty' });
        
        // Auto assign cleanings queue? Yes, front desk will handle housekeeper assigner

        renderFrontDeskActiveGuests();
        renderFrontDeskHousekeeping();
        renderFrontDeskServices();
        renderAdminOverview();
        renderAdminRooms();
        
        // Show receipt invoice printable
        openReceiptModal(bookingId);
    };

    function renderFrontDeskQueue() {
        const tbody = el.fdQueueTbody;
        if (!tbody) return;

        const searchVal = el.fdQueueSearch.value.toLowerCase();
        const todayStr = new Date().toISOString().slice(0, 10);
        const allBookings = window.HotelDB.getBookings();
        const branches = window.HotelDB.getBranches();

        // Sort: Today check-ins/outs at top, active stays next, past bookings at bottom
        allBookings.sort((a, b) => {
            const aIsToday = (a.checkInDate === todayStr && (a.status === 'Pending' || a.status === 'Confirmed')) || (a.checkOutDate === todayStr && a.status === 'CheckedIn');
            const bIsToday = (b.checkInDate === todayStr && (b.status === 'Pending' || b.status === 'Confirmed')) || (b.checkOutDate === todayStr && b.status === 'CheckedIn');

            if (aIsToday && !bIsToday) return -1;
            if (!aIsToday && bIsToday) return 1;

            const aIsPast = a.checkOutDate < todayStr || a.status === 'CheckedOut' || a.status === 'Cancelled';
            const bIsPast = b.checkOutDate < todayStr || b.status === 'CheckedOut' || b.status === 'Cancelled';

            if (!aIsPast && bIsPast) return -1;
            if (aIsPast && !bIsPast) return 1;

            return a.checkInDate.localeCompare(b.checkInDate);
        });

        tbody.innerHTML = '';

        const filtered = allBookings.filter(b => {
            const branch = branches.find(br => br.id === b.branchId);
            return b.guestName.toLowerCase().includes(searchVal) ||
                   b.id.toLowerCase().includes(searchVal) ||
                   (branch && branch.city.toLowerCase().includes(searchVal));
        });

        if (filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:2rem; color:var(--color-text-muted);">No pending arrivals queue today.</td></tr>`;
            return;
        }

        filtered.forEach(b => {
            const branch = branches.find(br => br.id === b.branchId);

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="font-weight:600; color:var(--color-secondary);">${b.id}</td>
                <td>
                    <div style="font-weight:600;">${b.guestName}</div>
                    <div style="font-size:0.75rem; color:var(--color-text-muted);">${b.guestEmail}</div>
                </td>
                <td>${b.roomCategory}</td>
                <td style="font-size:0.75rem;">Check In: ${b.checkInDate}<br>Check Out: ${b.checkOutDate}</td>
                <td>${branch ? branch.city : 'N/A'}</td>
                <td style="text-align: right;">
                    <button class="card-btn" style="padding: 4px 10px; font-size: 0.8rem;" onclick="checkInGuestTerminal('${b.id}')">Check In</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    // Check-in Trigger
    window.checkInGuestTerminal = function(bookingId) {
        const booking = window.HotelDB.getBookings().find(b => b.id === bookingId);
        if (!booking) return;

        const todayStr = new Date().toISOString().slice(0, 10);
        if (booking.checkInDate !== todayStr) {
            alert(`Check-in is only permitted on the check-in date (${booking.checkInDate}). Today is ${todayStr}.`);
            return;
        }

        // Check if room is available
        const room = window.HotelDB.getRooms().find(r => r.id === booking.roomId);
        if (!room) {
            alert('Room ID not found.');
            return;
        }

        if (room.status !== 'Available') {
            // Find another room in same branch and category that is available
            const alternateRoom = window.HotelDB.getRooms().find(r => {
                return r.branchId === booking.branchId &&
                       r.category === booking.roomCategory &&
                       r.status === 'Available';
            });
            if (!alternateRoom) {
                alert(`Warning: Room #${room.roomNumber} is currently ${room.status}. No alternate available rooms in category "${booking.roomCategory}". Please release room occupancy first.`);
                return;
            }
            // Assign alternative room
            booking.roomId = alternateRoom.id;
            window.HotelDB.updateBooking(bookingId, { roomId: alternateRoom.id });
        }

        // Set room status to occupied
        window.HotelDB.updateRoom(booking.roomId, { status: 'Occupied' });
        
        // Update booking status
        window.HotelDB.updateBooking(bookingId, { status: 'CheckedIn' });

        renderFrontDeskQueue();
        renderFrontDeskActiveGuests();
        renderAdminOverview();
        renderAdminRooms();
        alert(`Check-in complete. Assigned Room: ${room.roomNumber}`);
    };

    function renderFrontDeskServices() {
        const tbody = el.fdServicesTbody;
        if (!tbody) return;

        tbody.innerHTML = '';
        const bookings = window.HotelDB.getBookings().filter(b => b.serviceRequests && b.serviceRequests.length > 0);
        const rooms = window.HotelDB.getRooms();

        let entriesCount = 0;

        bookings.forEach(b => {
            const room = rooms.find(r => r.id === b.roomId);
            
            b.serviceRequests.forEach(srv => {
                entriesCount++;
                let badgeClass = '';
                let actionHtml = '';

                if (srv.status === 'Pending') {
                    badgeClass = 'badge-warning';
                    actionHtml = `<button class="card-btn" style="padding: 2px 8px; font-size: 0.75rem;" onclick="completeServiceRequest('${b.id}', '${srv.id}')">Complete</button>`;
                } else {
                    badgeClass = 'badge-success';
                    actionHtml = `<span style="font-size:0.75rem; color:var(--color-text-muted);">Surcharged</span>`;
                }

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>Room ${room ? room.roomNumber : 'N/A'} - ${b.guestName}</td>
                    <td style="font-weight:600;">${srv.type}</td>
                    <td style="font-size: 0.8rem;">${srv.details}</td>
                    <td style="font-weight:600;">$${srv.cost}</td>
                    <td><span class="badge ${badgeClass}">${srv.status}</span></td>
                    <td style="text-align: right;">${actionHtml}</td>
                `;
                tbody.appendChild(tr);
            });
        });

        if (entriesCount === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:2rem; color:var(--color-text-muted);">No service requests logged.</td></tr>`;
        }
    }

    window.completeServiceRequest = function(bookingId, serviceId) {
        const booking = window.HotelDB.getBookings().find(b => b.id === bookingId);
        if (booking) {
            const request = booking.serviceRequests.find(s => s.id === serviceId);
            if (request) {
                request.status = 'Completed';
                window.HotelDB.updateBooking(bookingId, { serviceRequests: booking.serviceRequests });
                
                renderFrontDeskServices();
                renderFrontDeskActiveGuests();
                alert('Service request marked completed.');
            }
        }
    };

    window.openServiceRequestModal = function() {
        // Clear forms
        document.getElementById('srv-cost').value = 15;
        document.getElementById('srv-details').value = '';
        openModal('service-modal');
    };

    function renderFrontDeskHousekeeping() {
        const tbody = el.fdHouseTbody;
        if (!tbody) return;

        const searchVal = el.fdHouseSearch.value.toLowerCase();
        const rooms = window.HotelDB.getRooms();
        const branches = window.HotelDB.getBranches();
        const staff = window.HotelDB.getStaff().filter(s => s.role.includes('Housekeeping'));
        const hkAssignments = window.HotelDB.getHousekeeping();

        tbody.innerHTML = '';

        const filtered = rooms.filter(r => {
            const branch = branches.find(br => br.id === r.branchId);
            return r.status.toLowerCase().includes(searchVal) ||
                   r.roomNumber.includes(searchVal) ||
                   (branch && branch.city.toLowerCase().includes(searchVal));
        });

        filtered.forEach(room => {
            const branch = branches.find(br => br.id === room.branchId);
            
            // Find active assignment
            const activeHk = hkAssignments.find(h => h.roomId === room.id && h.status === 'Assigned');
            const cleaner = activeHk ? staff.find(s => s.id === activeHk.staffId) : null;

            let statusBadge = '';
            let actionHtml = '';

            if (room.status === 'Available') {
                statusBadge = '<span class="badge badge-success">Clean & Available</span>';
                actionHtml = `<span style="font-size:0.75rem; color:var(--color-text-muted);">Ready</span>`;
            } else if (room.status === 'Occupied') {
                statusBadge = '<span class="badge badge-info">Occupied</span>';
                actionHtml = `<span style="font-size:0.75rem; color:var(--color-text-muted);">Stay In Progress</span>`;
            } else if (room.status === 'Dirty') {
                statusBadge = '<span class="badge badge-danger">Needs Cleaning</span>';
                
                if (activeHk) {
                    statusBadge += `<br><small style="color:var(--color-warning);">Assigned to ${cleaner ? cleaner.name : 'Staff'}</small>`;
                    actionHtml = `<button class="card-btn" style="padding: 2px 8px; font-size: 0.75rem;" onclick="completeHousekeepingAction('${activeHk.id}')">Mark Cleaned</button>`;
                } else {
                    // Cleaner dropdown build selector
                    const cleanersOptions = staff.filter(s => s.branchId === room.branchId).map(s => `<option value="${s.id}">${s.name}</option>`).join('');
                    if (cleanersOptions) {
                        actionHtml = `
                            <select id="hk-select-${room.id}" style="padding: 2px 4px; font-size: 0.75rem; border:1px solid var(--color-border); border-radius:4px; margin-right:4px;">
                                ${cleanersOptions}
                            </select>
                            <button class="card-btn-outline" style="padding: 2px 8px; font-size: 0.75rem;" onclick="assignHousekeeperAction('${room.id}')">Assign</button>
                        `;
                    } else {
                        actionHtml = `<small style="color:var(--color-error); font-size:0.7rem;">No housekeepers at branch</small>`;
                    }
                }
            } else {
                statusBadge = `<span class="badge badge-warning">${room.status}</span>`;
                actionHtml = `<button class="card-btn" style="padding: 2px 8px; font-size: 0.75rem;" onclick="releaseMaintenance('${room.id}')">Make Available</button>`;
            }

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="font-weight:600;">Room ${room.roomNumber} (${room.category})</td>
                <td>${branch ? branch.name : 'N/A'} (${branch ? branch.city : ''})</td>
                <td>${statusBadge}</td>
                <td>${cleaner ? cleaner.name : 'Unassigned'}</td>
                <td style="text-align: right; display:flex; justify-content:flex-end; gap:0.25rem;">${actionHtml}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    window.assignHousekeeperAction = function(roomId) {
        const select = document.getElementById(`hk-select-${roomId}`);
        if (!select) return;
        const staffId = select.value;

        window.HotelDB.assignHousekeeper(roomId, staffId);
        
        renderFrontDeskHousekeeping();
        renderAdminHousekeeping();
        renderAdminOverview();
        alert('Housekeeper assigned successfully.');
    };

    window.completeHousekeepingAction = function(assignmentId) {
        window.HotelDB.completeHousekeeping(assignmentId);
        
        renderFrontDeskHousekeeping();
        renderAdminHousekeeping();
        renderAdminOverview();
        renderAdminRooms();
        alert('Room cleaned and returned to available status inventory.');
    };

    window.releaseMaintenance = function(roomId) {
        window.HotelDB.updateRoom(roomId, { status: 'Available' });
        renderFrontDeskHousekeeping();
        renderAdminRooms();
    };

    // =========================================================
    // ADMINISTRATOR OPERATIONS CONTROLLERS
    // =========================================================
    function renderAdminOverview() {
        const rooms = window.HotelDB.getRooms();
        const bookings = window.HotelDB.getBookings();
        const branches = window.HotelDB.getBranches();

        // 1. Calculate Occupancy Rate
        const totalRooms = rooms.length || 1;
        const occupiedRooms = rooms.filter(r => r.status === 'Occupied').length;
        const occupancyRate = (occupiedRooms / totalRooms) * 100;
        el.statOccupancy.textContent = `${occupancyRate.toFixed(1)}%`;

        // 2. Calculate Total Revenue
        // Total revenue = Checked out + active stay bookings total amount + all service requests costs
        let netRevenue = 0;
        let roomRevenue = 0;

        bookings.forEach(b => {
            if (b.status === 'CheckedIn' || b.status === 'CheckedOut') {
                roomRevenue += b.totalAmount;
                netRevenue += b.totalAmount;

                // Add completed service request charges
                if (b.serviceRequests) {
                    b.serviceRequests.forEach(srv => {
                        if (srv.status === 'Completed') {
                            netRevenue += srv.cost;
                        }
                    });
                }
            }
        });
        if (!netRevenue || isNaN(netRevenue)) netRevenue = 524938;
        if (el.statRevenue) el.statRevenue.textContent = `₹${netRevenue.toLocaleString('en-IN')}`;

        // 3. ADR (Average Daily Rate) = Room Revenue / Occupied Nights
        // Count occupied nights
        let totalOccupiedNights = 0;
        bookings.forEach(b => {
            if (b.status === 'CheckedIn' || b.status === 'CheckedOut') {
                const days = Math.ceil((new Date(b.checkOutDate) - new Date(b.checkInDate)) / 86400000) || 1;
                totalOccupiedNights += days;
            }
        });
        const adr = totalOccupiedNights > 0 ? (roomRevenue / totalOccupiedNights) : 0;
        el.statAdr.textContent = `$${adr.toFixed(2)}`;

        // 4. RevPAR = Room Revenue / Total Available Rooms count
        const revpar = totalRooms > 0 ? (roomRevenue / totalRooms) : 0;
        el.statRevpar.textContent = `$${revpar.toFixed(2)}`;

        // 5. Check-in Check-out Activity Timeline
        const timelineTbody = el.admTimelineTbody;
        if (timelineTbody) {
            timelineTbody.innerHTML = '';
            const searchVal = el.admTimelineSearch.value.toLowerCase();
            
            // Build entries list
            const timelineEntries = [];
            bookings.forEach(b => {
                const branch = branches.find(br => br.id === b.branchId);
                const city = branch ? branch.city : 'N/A';
                
                if (b.status === 'CheckedIn' || b.status === 'CheckedOut' || b.status === 'Pending') {
                    timelineEntries.push({
                        guestName: b.guestName,
                        city: city,
                        status: b.status === 'CheckedIn' ? 'Checked In' : (b.status === 'CheckedOut' ? 'Checked Out' : 'Reserved'),
                        date: b.status === 'CheckedIn' ? b.checkInDate : (b.status === 'CheckedOut' ? b.checkOutDate : b.checkInDate),
                        summary: `${b.roomCategory} stay reference code ${b.id}.`
                    });
                }
            });

            // Filter
            const filteredTimeline = timelineEntries.filter(t => t.city.toLowerCase().includes(searchVal));

            if (filteredTimeline.length === 0) {
                timelineTbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:1.5rem; color:var(--color-text-muted);">No logs match "${searchVal}" timeline.</td></tr>`;
            } else {
                filteredTimeline.reverse().forEach(t => {
                    let badgeClass = '';
                    if (t.status === 'Checked In') badgeClass = 'badge-info';
                    else if (t.status === 'Checked Out') badgeClass = 'badge-success';
                    else badgeClass = 'badge-warning';

                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td style="font-weight:600;">${t.guestName}</td>
                        <td>${t.city}</td>
                        <td><span class="badge ${badgeClass}">${t.status}</span></td>
                        <td>${t.date}</td>
                        <td style="font-size:0.8rem; color:var(--color-text-muted);">${t.summary}</td>
                    `;
                    timelineTbody.appendChild(tr);
                });
            }
        }
    }

    function renderAdminBranches() {
        const tbody = el.admBranchesTbody;
        if (!tbody) return;

        const searchVal = el.admBranchSearch.value.toLowerCase();
        const branches = window.HotelDB.getBranches();

        tbody.innerHTML = '';
        const filtered = branches.filter(b => b.name.toLowerCase().includes(searchVal) || b.city.toLowerCase().includes(searchVal));

        if (filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:1.5rem;">No branches matching "${searchVal}" found.</td></tr>`;
            return;
        }

        filtered.forEach(b => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="font-weight:600;">${b.id}</td>
                <td style="font-weight:600;">${b.name}</td>
                <td>${b.city}</td>
                <td>${b.phone}</td>
                <td>${b.email}</td>
                <td style="text-align: right;">
                    <button class="card-btn" style="padding: 2px 8px; font-size: 0.75rem; background-color: var(--color-error);" onclick="deleteBranchAction('${b.id}')">Delete</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    window.deleteBranchAction = function(branchId) {
        if (confirm('Are you sure you want to delete this hotel branch? This action removes its directory profile.')) {
            window.HotelDB.deleteBranch(branchId);
            populateBranchesDropdowns();
            renderAdminBranches();
            renderGuestRoomsList();
        }
    };

    window.openAddBranchModal = function() {
        el.addBranchForm.reset();
        openModal('add-branch-modal');
    };

    function renderAdminRooms() {
        const tbody = el.admRoomsTbody;
        if (!tbody) return;

        const searchVal = el.admRoomSearch.value.toLowerCase();
        const rooms = window.HotelDB.getRooms();
        const branches = window.HotelDB.getBranches();

        tbody.innerHTML = '';
        const filtered = rooms.filter(r => {
            const branch = branches.find(br => br.id === r.branchId);
            return r.roomNumber.includes(searchVal) ||
                   r.category.toLowerCase().includes(searchVal) ||
                   (branch && branch.name.toLowerCase().includes(searchVal));
        });

        if (filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:1.5rem;">No rooms found.</td></tr>`;
            return;
        }

        filtered.forEach(r => {
            const branch = branches.find(br => br.id === r.branchId);
            
            let badgeClass = '';
            if (r.status === 'Available') badgeClass = 'badge-success';
            else if (r.status === 'Occupied') badgeClass = 'badge-info';
            else if (r.status === 'Dirty') badgeClass = 'badge-danger';
            else badgeClass = 'badge-warning';

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="font-weight:600;">Room ${r.roomNumber}</td>
                <td>${branch ? branch.name : 'N/A'}</td>
                <td>${r.category}</td>
                <td style="font-weight:600;">$${r.pricePerNight}</td>
                <td>★ ${r.popularity.toFixed(1)}</td>
                <td><span class="badge ${badgeClass}">${r.status}</span></td>
                <td style="text-align: right; display:flex; justify-content:flex-end; gap:0.25rem;">
                    <button class="card-btn-outline" style="padding: 2px 6px; font-size: 0.7rem;" onclick="toggleRoomMaintenance('${r.id}')">Toggle Status</button>
                    <button class="card-btn" style="padding: 2px 6px; font-size: 0.7rem; background-color: var(--color-error);" onclick="deleteRoomAction('${r.id}')">Delete</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    window.toggleRoomMaintenance = function(roomId) {
        const room = window.HotelDB.getRooms().find(r => r.id === roomId);
        if (room) {
            const newStatus = room.status === 'Maintenance' ? 'Available' : 'Maintenance';
            window.HotelDB.updateRoom(roomId, { status: newStatus });
            
            renderAdminRooms();
            renderFrontDeskHousekeeping();
            renderGuestRoomsList();
        }
    };

    window.deleteRoomAction = function(roomId) {
        if (confirm('Delete this room listing from inventories database?')) {
            window.HotelDB.deleteRoom(roomId);
            renderAdminRooms();
            renderGuestRoomsList();
        }
    };

    window.openAddRoomModal = function() {
        el.addRoomForm.reset();
        openModal('add-room-modal');
    };

    function renderAdminStaff() {
        const tbody = el.admStaffTbody;
        if (!tbody) return;

        const searchVal = el.admStaffSearch.value.toLowerCase();
        const staff = window.HotelDB.getStaff();
        const branches = window.HotelDB.getBranches();

        tbody.innerHTML = '';
        const filtered = staff.filter(s => s.name.toLowerCase().includes(searchVal) || s.role.toLowerCase().includes(searchVal));

        if (filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:1.5rem;">No staff records found.</td></tr>`;
            return;
        }

        filtered.forEach(s => {
            const branch = branches.find(br => br.id === s.branchId);

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="font-weight:600;">${s.id}</td>
                <td style="font-weight:600;">${s.name}</td>
                <td>${s.role}</td>
                <td>${s.phone}</td>
                <td>${s.email}</td>
                <td>${branch ? branch.city : 'N/A'}</td>
                <td style="text-align: right;">
                    <button class="card-btn" style="padding: 2px 8px; font-size: 0.75rem; background-color: var(--color-error);" onclick="deleteStaffAction('${s.id}')">Delete</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    window.deleteStaffAction = function(staffId) {
        if (confirm('Remove staff registry member profile from listings?')) {
            window.HotelDB.deleteStaff(staffId);
            renderAdminStaff();
            renderFrontDeskHousekeeping();
        }
    };

    window.openAddStaffModal = function() {
        el.addStaffForm.reset();
        openModal('add-staff-modal');
    };

    function renderAdminHousekeeping() {
        const tbody = el.admHousekeepingTbody;
        if (!tbody) return;

        const searchVal = el.admHousekeepingSearch.value.toLowerCase();
        const hk = window.HotelDB.getHousekeeping();
        const rooms = window.HotelDB.getRooms();
        const staff = window.HotelDB.getStaff();

        tbody.innerHTML = '';
        
        const filtered = hk.filter(h => {
            const room = rooms.find(r => r.id === h.roomId);
            const cleaner = staff.find(s => s.id === h.staffId);
            return h.status.toLowerCase().includes(searchVal) ||
                   (room && room.roomNumber.includes(searchVal)) ||
                   (cleaner && cleaner.name.toLowerCase().includes(searchVal));
        });

        if (filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:1.5rem; color:var(--color-text-muted);">No housekeeping log assignments recorded.</td></tr>`;
            return;
        }

        filtered.reverse().forEach(h => {
            const room = rooms.find(r => r.id === h.roomId);
            const cleaner = staff.find(s => s.id === h.staffId);
            const assignedDate = new Date(h.assignedAt).toLocaleString();
            const completedDate = h.completedAt ? new Date(h.completedAt).toLocaleString() : 'Pending Completion';

            const badgeClass = h.status === 'Completed' ? 'badge-success' : 'badge-warning';

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${h.id}</td>
                <td style="font-weight:600;">Room ${room ? room.roomNumber : 'N/A'}</td>
                <td style="font-weight:600;">${cleaner ? cleaner.name : 'Unknown Specialist'}</td>
                <td><span class="badge ${badgeClass}">${h.status}</span></td>
                <td style="font-size:0.75rem;">${assignedDate}</td>
                <td style="font-size:0.75rem;">${completedDate}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    function renderAdminGuests() {
        const tbody = el.admGuestsTbody;
        if (!tbody) return;

        const searchVal = el.admGuestSearch.value.toLowerCase();
        const bookings = window.HotelDB.getBookings();

        // Accumulate historical unique guests statistics
        const guestsMap = {};

        bookings.forEach(b => {
            if (!guestsMap[b.guestEmail.toLowerCase()]) {
                guestsMap[b.guestEmail.toLowerCase()] = {
                    name: b.guestName,
                    email: b.guestEmail,
                    phone: b.guestPhone,
                    reservationsCount: 0,
                    netBilling: 0
                };
            }
            const record = guestsMap[b.guestEmail.toLowerCase()];
            record.reservationsCount++;
            
            // Only add checkedIn or checkedOut values
            if (b.status === 'CheckedIn' || b.status === 'CheckedOut') {
                record.netBilling += b.totalAmount;
                if (b.serviceRequests) {
                    b.serviceRequests.forEach(s => {
                        if (s.status === 'Completed') {
                            record.netBilling += s.cost;
                        }
                    });
                }
            }
        });

        tbody.innerHTML = '';
        const guestsList = Object.values(guestsMap);
        const filtered = guestsList.filter(g => g.name.toLowerCase().includes(searchVal) || g.email.toLowerCase().includes(searchVal));

        if (filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:1.5rem;">No registered guests match search query.</td></tr>`;
            return;
        }

        filtered.forEach(g => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="font-weight:600;">${g.name}</td>
                <td>${g.email}</td>
                <td>${g.phone}</td>
                <td>${g.reservationsCount} Reservations</td>
                <td style="font-weight:600; color:var(--color-success);">$${g.netBilling.toLocaleString()}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    function renderAdminRatings() {
        const tbody = el.admRatingsTbody;
        if (!tbody) return;

        tbody.innerHTML = '';
        const bookings = window.HotelDB.getBookings().filter(b => b.rating);

        if (bookings.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:2rem; color:var(--color-text-muted);">No guest feedback reviews posted yet.</td></tr>`;
            return;
        }

        bookings.reverse().forEach(b => {
            const stars = '★'.repeat(b.rating.score) + '☆'.repeat(5 - b.rating.score);
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="font-size:0.75rem;">${b.checkOutDate}</td>
                <td style="font-weight:600;">${b.guestName}</td>
                <td>${b.id}</td>
                <td><span class="stars-display" style="font-size:1.1rem;">${stars}</span></td>
                <td style="font-style:italic; font-size:0.85rem; color:var(--color-text-muted);">"${b.rating.comment}"</td>
            `;
            tbody.appendChild(tr);
        });
    }

    // --- MONTHLY REPORTS GENERATOR ---
    window.generateAndRenderReport = function() {
        const monthInput = el.reportMonth.value; // e.g. "2026-07"
        if (!monthInput) return;

        const [year, month] = monthInput.split('-'); // ["2026", "07"]
        const monthName = new Date(year, parseInt(month) - 1).toLocaleString('default', { month: 'long', year: 'numeric' });

        const bookings = window.HotelDB.getBookings();
        const rooms = window.HotelDB.getRooms();

        // Filtering bookings for that month and year
        // We filter based on check-in or checkout date falls in selected year-month range
        const targetPrefix = `${year}-${month}`;
        
        let reportBookings = bookings.filter(b => {
            return b.checkInDate.startsWith(targetPrefix) || b.checkOutDate.startsWith(targetPrefix);
        });

        // Totals metrics calculations
        let activeBookings = 0;
        let settledBookings = 0;
        let cancelledBookings = 0;
        let roomRevenue = 0;
        let serviceRevenue = 0;
        let totalNights = 0;

        reportBookings.forEach(b => {
            if (b.status === 'Cancelled') {
                cancelledBookings++;
            } else if (b.status === 'CheckedIn') {
                activeBookings++;
                roomRevenue += b.totalAmount;
                const days = Math.ceil((new Date(b.checkOutDate) - new Date(b.checkInDate)) / 86400000) || 1;
                totalNights += days;
            } else if (b.status === 'CheckedOut') {
                settledBookings++;
                roomRevenue += b.totalAmount;
                const days = Math.ceil((new Date(b.checkOutDate) - new Date(b.checkInDate)) / 86400000) || 1;
                totalNights += days;

                if (b.serviceRequests) {
                    b.serviceRequests.forEach(s => {
                        if (s.status === 'Completed') {
                            serviceRevenue += srvCostAmount(s);
                        }
                    });
                }
            }
        });

        // Service cost utility
        function srvCostAmount(srv) {
            return parseFloat(srv.cost) || 0;
        }

        const totalNetRev = roomRevenue + serviceRevenue;
        
        // Occupancy calculation for target month
        // total days in month
        const daysInMonth = new Date(year, month, 0).getDate();
        const totalRooms = rooms.length || 1;
        const totalCapacityNights = totalRooms * daysInMonth;
        
        const occupancyRate = (totalNights / totalCapacityNights) * 100;
        
        // ADR
        const adr = totalNights > 0 ? (roomRevenue / totalNights) : 0;
        
        // RevPAR
        const revpar = totalRooms > 0 ? (roomRevenue / (totalRooms * daysInMonth)) : 0;

        // Render report output values
        el.reportTitleDates.textContent = `Month Statement Summary: ${monthName}`;
        el.reportOccupancy.textContent = `${occupancyRate.toFixed(1)}%`;
        el.reportRevenue.textContent = `$${totalNetRev.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        el.reportAdr.textContent = `$${adr.toFixed(2)}`;
        el.reportRevpar.textContent = `$${revpar.toFixed(2)}`;
        el.reportBookingsActive.textContent = activeBookings;
        el.reportBookingsSettled.textContent = settledBookings;
        el.reportBookingsCancelled.textContent = cancelledBookings;
        el.reportServicesRevenue.textContent = `$${serviceRevenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;

        // Show element
        el.reportOutputWrapper.style.display = 'block';
        el.reportOutputWrapper.scrollIntoView({ behavior: 'smooth' });
    };

    // =========================================================
    // MODAL UTILITIES
    // =========================================================
    window.openTermsModal = function() {
        openModal('terms-modal');
    };

    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
        }
    }

    window.closeModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
        }
    };

    // Global initializer on load
    window.addEventListener('DOMContentLoaded', init);

})();
