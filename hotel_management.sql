-- Hotel Room Management System Database Schema 

-- 1. Property (Branch) Table
CREATE TABLE property (
  `pid` varchar(50) PRIMARY KEY,
  `pname` varchar(255) NOT NULL,
  `paddress` varchar(255) NOT NULL,
  `pcity` varchar(100) NOT NULL,
  `pphone` varchar(50) DEFAULT NULL,
  `pemail` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 2. Guests Table
CREATE TABLE `guests` (
  `gid` varchar(50) PRIMARY KEY,
  `gname` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phn` varchar(50) NOT NULL,
  `gaadhar` varchar(20) DEFAULT NULL,
  `gpass` varchar(255) NOT NULL,
  `role` varchar(50) DEFAULT 'guest',
  `regdt` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 3. Rooms Table
CREATE TABLE `rooms` (
  `rid` varchar(50) PRIMARY KEY,
  `rnumber` varchar(20) NOT NULL,
  `pid` varchar(50) NOT NULL,
  `flno` int(11) DEFAULT 1,
  `rcost` decimal(10,2) NOT NULL,
  `rcatg` varchar(100) NOT NULL,
  `rcapc` int(11) DEFAULT 2,
  `rsts` varchar(50) DEFAULT 'Available',
  `ramenities` text DEFAULT NULL,
  `rimage` text DEFAULT NULL,
  `rbedroom_image` text DEFAULT NULL,
  `rbathroom_image` text DEFAULT NULL,
  `rview_image` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 4. Amenities Table
CREATE TABLE `amenities` (
  `amid` varchar(50) PRIMARY KEY,
  `amname` varchar(100) NOT NULL,
  `amicon` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 5. Staffs Table
CREATE TABLE `staffs` (
  `stid` varchar(50) PRIMARY KEY,
  `stname` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phn` varchar(50) DEFAULT '+91 98765-43210',
  `pid` varchar(50) NOT NULL,
  `stsal` decimal(10,2) DEFAULT 45000.00,
  `stjoindt` date DEFAULT NULL,
  `strole` varchar(100) NOT NULL,
  `spass` varchar(255) DEFAULT '',
  `status` varchar(50) DEFAULT 'Active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- 6. Booking Table
CREATE TABLE `booking` (
  `bid` varchar(50) PRIMARY KEY,
  `gid` varchar(50) NOT NULL,
  `rid` varchar(50) NOT NULL,
  `pid` varchar(50) NOT NULL,
  `bdt` date DEFAULT NULL,
  `cindt` date NOT NULL,
  `coutdt` date NOT NULL,
  `bamt` decimal(10,2) NOT NULL,
  `bdeposit` decimal(10,2) NOT NULL,
  `bremaining` decimal(10,2) NOT NULL,
  `bpymtsts` varchar(100) DEFAULT '20% Deposit Paid',
  `bsts` varchar(50) DEFAULT 'Confirmed',
  `bspecial` text DEFAULT NULL,
  `brating` int(11) DEFAULT NULL,
  `bfeedback` text DEFAULT NULL,
  `bfeedbackdt` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 7. Service Table
CREATE TABLE `service` (
  `sid` varchar(50) PRIMARY KEY,
  `bid` varchar(50) NOT NULL,
  `sname` varchar(100) NOT NULL,
  `sdescp` text DEFAULT NULL,
  `scost` decimal(10,2) DEFAULT 0.00,
  `sstatus` varchar(50) DEFAULT 'Pending',
  `sreqat` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- 8. Final Bill Table
CREATE TABLE `final_bill` (
  `fbid` varchar(50) PRIMARY KEY,
  `bid` varchar(50) NOT NULL,
  `fbillamt` decimal(10,2) NOT NULL,
  `fbpsts` varchar(50) DEFAULT 'Paid',
  `fbroomamt` decimal(10,2) NOT NULL,
  `fbdeposit` decimal(10,2) NOT NULL,
  `fbservicesamt` decimal(10,2) DEFAULT 0.00,
  `fbgeneratedat` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table `booking`
INSERT INTO `booking` (`bid`, `gid`, `rid`, `pid`, `bdt`, `cindt`, `coutdt`, `bamt`, `bdeposit`, `bremaining`, `bpymtsts`, `bsts`, `bspecial`, `brating`, `bfeedback`, `bfeedbackdt`) VALUES
('BK-048748', 'USR-048568', 'RM-102', 'BR-001', '2026-07-28', '2026-07-30', '2026-08-08', 53991.00, 10798.00, 43193.00, '20% Deposit Paid', 'CheckedOut', 'Walk-in guest registration at Front Desk', NULL, NULL, NULL),
('BK-1001', 'USR-101', 'RM-102', 'BR-001', '2026-07-10', '2026-07-14', '2026-07-31', 101983.00, 20396.00, 81587.00, '20% Deposit Paid', 'Cancelled', 'Late check-in requested', NULL, NULL, NULL),
('BK-1002', 'USR-103', 'RM-502', 'BR-003', '2026-07-18', '2026-07-20', '2026-07-30', 57990.00, 11598.00, 46392.00, '20% Deposit Paid', 'CheckedOut', 'Honeymoon arrangement with flower decoration', NULL, NULL, NULL),
('BK-1003', 'USR-102', 'RM-402', 'BR-002', '2026-07-22', '2026-07-28', '2026-08-02', 64995.00, 12999.00, 51996.00, '20% Deposit Paid', 'Expired', 'Airport transfer required', NULL, NULL, NULL),
('BK-1004', 'USR-104', 'RM-101', 'BR-001', '2026-07-01', '2026-07-05', '2026-07-10', 17495.00, 3499.00, 0.00, 'Paid in Full', 'CheckedOut', 'Quiet floor preferred', 5, 'Outstanding hospitality and ocean view! Highly recommended.', '2026-07-10'),
('BK-1005', 'USR-105', 'RM-201', 'BR-001', '2026-07-20', '2026-07-25', '2026-07-30', 29995.00, 5999.00, 23996.00, '20% Deposit Paid', 'CheckedOut', 'Sea view balcony, extra pillows requested', NULL, NULL, NULL),
('BK-1006', 'USR-106', 'RM-401', 'BR-002', '2026-07-22', '2026-07-26', '2026-07-31', 32495.00, 6499.00, 25996.00, '20% Deposit Paid', 'CheckedOut', 'Late night arrival, quiet room requested', NULL, NULL, NULL),
('BK-1007', 'USR-107', 'RM-504', 'BR-003', '2026-07-24', '2026-07-29', '2026-08-03', 59995.00, 11999.00, 47996.00, '20% Deposit Paid', 'CheckedOut', 'Tea plantation tour booking & fireplace setup', NULL, NULL, NULL),
('BK-1008', 'USR-108', 'RM-301', 'BR-001', '2026-07-25', '2026-08-01', '2026-08-06', 94995.00, 18999.00, 75996.00, '20% Deposit Paid', 'Confirmed', 'Private plunge pool heating & luxury champagne welcome basket', NULL, NULL, NULL),
('BK-1009', 'USR-109', 'RM-405', 'BR-002', '2026-07-26', '2026-08-05', '2026-08-10', 64995.00, 12999.00, 51996.00, '20% Deposit Paid', 'Confirmed', 'Lake Pichola boat ride reservation', NULL, NULL, NULL),
('BK-126800', 'USR-1785301083744', 'RM-301', 'BR-001', '2026-07-29', '2026-07-29', '2026-08-08', 189990.00, 37998.00, 151992.00, '20% Deposit Paid', 'CheckedIn', 'Walk-in registration at Front Desk', NULL, NULL, NULL),
('BK-137385', 'USR-1785301083744', 'RM-406', 'BR-002', '2026-07-29', '2026-07-29', '2026-08-08', 219990.00, 43998.00, 175992.00, '20% Deposit Paid', 'CheckedOut', 'Walk-in registration at Front Desk', 5, 'Excellent Service! Enjoyed a nice time', '2026-07-29'),
('BK-183736', 'USR-101', 'RM-101', 'BR-001', '2026-07-28', '2026-07-28', '2026-07-29', 3499.00, 700.00, 2799.00, '20% Deposit Paid', 'CheckedOut', 'Walk-in registration at Front Desk', NULL, NULL, NULL),
('BK-381718', 'USR-101', 'RM-101', 'BR-001', '2026-07-28', '2026-07-29', '2026-08-05', 24493.00, 4899.00, 19594.00, '20% Deposit Paid', 'CheckedOut', 'Walk-in registration at Front Desk', 5, 'good , excellent service, highly satisfied, will visit again soon !!', '2026-07-28'),
('BK-592715', 'USR-1785256643450', 'RM-402', 'BR-002', '2026-07-28', '2026-07-30', '2026-08-09', 129990.00, 25998.00, 103992.00, '20% Deposit Paid', 'Confirmed', 'high floor', 5, NULL, '2026-07-28'),
('BK-605398', 'USR-101', 'RM-102', 'BR-001', '2026-07-28', '2026-07-30', '2026-08-05', 35994.00, 7199.00, 28795.00, '20% Deposit Paid', 'Confirmed', 'Walk-in registration at Front Desk', 5, 'wonderful', '2026-07-28'),
('BK-716652', 'USR-1785256643450', 'RM-103', 'BR-001', '2026-07-28', '2026-07-30', '2026-08-08', 103491.00, 20698.00, 82793.00, '20% Deposit Paid', 'Confirmed', 'Kesar thandai, momo', 5, 'good A++ outstanding ', '2026-07-28'),
('BK-798043', 'USR-101', 'RM-301', 'BR-001', '2026-07-28', '2026-07-28', '2026-07-29', 18999.00, 3800.00, 15199.00, '20% Deposit Paid', 'Expired', 'Walk-in registration at Front Desk', NULL, NULL, NULL);

-- Dumping data for table `final_bill`
INSERT INTO `final_bill` (`fbid`, `bid`, `fbillamt`, `fbpsts`, `fbroomamt`, `fbdeposit`, `fbservicesamt`, `fbgeneratedat`) VALUES
('FB-1004', 'BK-1004', 17495.00, 'Paid', 17495.00, 3499.00, 0.00, '2026-07-10 11:30:00'),
('FBIL-060649', 'BK-048748', 43193.00, 'Paid', 53991.00, 10798.00, 0.00, '2026-07-28 16:44:20'),
('FBIL-234412', 'BK-137385', 175992.00, 'Paid', 219990.00, 43998.00, 0.00, '2026-07-29 05:00:34'),
('FBIL-940820', 'BK-1007', 47996.00, 'Paid', 59995.00, 11999.00, 0.00, '2026-07-29 04:55:40');

-- Dumping data for table `guests`
INSERT INTO `guests` (`gid`, `gname`, `email`, `phn`, `gaadhar`, `gpass`, `role`, `regdt`) VALUES
('USR-048568', 'Mitali Joy', 'mmjj@gmail.com', '888899998888', '887766767889', 'walkin123', 'guest', '2026-07-28'),
('USR-101', 'Jane Doe', 'jane.doe@example.com', '+91 98123-45678', '545454545454', '$2b$10$e7K5.4c1J.E8y4kE8G8s1.6U2x6v2w8.Y.5v2v8v2', 'guest', '2026-06-15'),
('USR-102', 'Vikramaditya Singhania', 'vikram.singhania@example.com', '+91 98765-44321', '543298761234', '$2b$10$e7K5.4c1J.E8y4kE8G8s1.6U2x6v2w8.Y.5v2v8v2', 'guest', '2026-07-01'),
('USR-103', 'Ananya Iyer', 'ananya.iyer@example.com', '+91 99887-11223', '987654321019', '$2b$10$e7K5.4c1J.E8y4kE8G8s1.6U2x6v2w8.Y.5v2v8v2', 'guest', '2026-07-10'),
('USR-104', 'Rajesh Sharma', 'rajesh.sharma@example.com', '+91 97112-33445', '456789123456', '$2b$10$e7K5.4c1J.E8y4kE8G8s1.6U2x6v2w8.Y.5v2v8v2', 'guest', '2026-07-02'),
('USR-105', 'Kabir Mehta', 'kabir.mehta@example.com', '+91 98234-56789', '789012345678', '$2b$10$e7K5.4c1J.E8y4kE8G8s1.6U2x6v2w8.Y.5v2v8v2', 'guest', '2026-07-15'),
('USR-106', 'Dr. Meera Reddy', 'meera.reddy@example.com', '+91 94455-66778', '345678901234', '$2b$10$e7K5.4c1J.E8y4kE8G8s1.6U2x6v2w8.Y.5v2v8v2', 'guest', '2026-07-18'),
('USR-107', 'Devendra Deshmukh', 'devendra.d@example.com', '+91 98990-11223', '654321098765', '$2b$10$e7K5.4c1J.E8y4kE8G8s1.6U2x6v2w8.Y.5v2v8v2', 'guest', '2026-07-20'),
('USR-108', 'Sonia Kapoor', 'sonia.kapoor@example.com', '+91 97654-32109', '890123456789', '$2b$10$e7K5.4c1J.E8y4kE8G8s1.6U2x6v2w8.Y.5v2v8v2', 'guest', '2026-07-22'),
('USR-109', 'Siddharth Malhotra', 'siddharth.m@example.com', '+91 98111-22334', '123498765012', '$2b$10$e7K5.4c1J.E8y4kE8G8s1.6U2x6v2w8.Y.5v2v8v2', 'guest', '2026-07-24'),
('USR-1785256643450', 'SAYAN Halder', 'sayanh091103@gmail.com', '+91 9432501157', '343421214545', '$2a$10$PIUZ5B9dq2qsuPGE8HeoAOPjl7RBRXHPOStvKK8Puph6UVP/vCe3K', 'guest', '2026-07-28'),
('USR-1785301083744', 'Sayantan Roy', 'syntan12@gmail.com', '4545454545', '987656787666', '$2a$10$/UzDcY.3r75BmNLbT9/1iulGzwlh/WBqNz9ldQkMAewqBWSeknn8W', 'guest', '2026-07-29');

-- Dumping data for table `property`
INSERT INTO `property` (`pid`, `pname`, `paddress`, `pcity`, `pphone`, `pemail`) VALUES
('BR-001', 'Verdant Springs Resort & Spa, North Goa', '124 Calangute Beach Road, North Goa', 'Goa', '+91 832-2456789', 'goa@verdantsprings.in'),
('BR-002', 'Verdant Springs Palace, Udaipur', '88 Lake Palace Road, Lake Pichola', 'Udaipur', '+91 294-2567890', 'udaipur@verdantsprings.in'),
('BR-003', 'Verdant Springs Tea Estate & Retreat, Munnar', '45 Tea Garden Estate Road, Munnar Hills', 'Munnar', '+91 486-2345678', 'munnar@verdantsprings.in');

-- Dumping data for table `rooms`
INSERT INTO `rooms` (`rid`, `rnumber`, `pid`, `flno`, `rcost`, `rcatg`, `rcapc`, `rsts`, `ramenities`, `rimage`, `rbedroom_image`, `rbathroom_image`, `rview_image`) VALUES
('RM-101', '101', 'BR-001', 1, 3499.00, 'Standard Garden Room', 2, 'Dirty', '[\"WiFi\", \"Free Chai & Breakfast\", \"Smart TV\", \"Air Conditioning\"]', 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1000&q=80', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80'),
('RM-102', '102', 'BR-001', 1, 5999.00, 'Executive Heritage Deluxe', 2, 'Dirty', '[\"WiFi\", \"AC\", \"Breakfast\", \"Mini Bar\", \"Smart TV\", \"Balcony View\"]', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80', 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'),
('RM-103', '103', 'BR-001', 1, 11499.00, 'Royal Maharajah Suite', 3, 'Occupied', '[\"WiFi\", \"AC\", \"Free Breakfast\", \"Pool Access\", \"Mini Bar\", \"Jacuzzi\", \"Coffee Maker\"]', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1000&q=80', 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'),
('RM-104', '104', 'BR-001', 1, 3499.00, 'Standard Garden Room', 2, 'Dirty', '[\"WiFi\", \"Free Breakfast\", \"AC\"]', 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80', 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'),
('RM-201', '201', 'BR-001', 2, 5999.00, 'Executive Heritage Deluxe', 2, 'Dirty', '[\"WiFi\", \"AC\", \"Breakfast\", \"Sea View\"]', 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1000&q=80', 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80'),
('RM-202', '202', 'BR-001', 2, 11499.00, 'Royal Maharajah Suite', 3, 'Dirty', '[\"WiFi\", \"AC\", \"Breakfast\", \"Jacuzzi\", \"Private Lounge\"]', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=80', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'),
('RM-301', '301', 'BR-001', 3, 18999.00, 'Presidential Villa & Pool', 4, 'Occupied', '[\"WiFi\", \"AC\", \"Royal Breakfast\", \"Private Plunge Pool\", \"Gym Access\", \"Kitchenette\", \"Private Butler\"]', 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1000&q=80', 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80'),
('RM-401', '101', 'BR-002', 1, 6499.00, 'Executive Heritage Deluxe', 2, 'Dirty', '[\"WiFi\", \"AC\", \"Lake View Balcony\", \"Smart TV\"]', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80', 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80'),
('RM-402', '102', 'BR-002', 1, 12999.00, 'Royal Maharajah Suite', 3, 'Available', '[\"WiFi\", \"AC\", \"Palace Dining\", \"Jacuzzi\", \"Lake Pichola View\"]', 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1000&q=80', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80'),
('RM-403', '201', 'BR-002', 2, 3999.00, 'Standard Garden Room', 2, 'Maintenance', '[\"WiFi\", \"Free Breakfast\", \"Courtyard View\"]', 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1000&q=80', 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80'),
('RM-404', '202', 'BR-002', 2, 6499.00, 'Executive Heritage Deluxe', 2, 'Available', '[\"WiFi\", \"AC\", \"Breakfast\", \"Jharokha Balcony\"]', 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1000&q=80', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80'),
('RM-405', '301', 'BR-002', 3, 12999.00, 'Royal Maharajah Suite', 3, 'Available', '[\"WiFi\", \"AC\", \"Butler Service\", \"Private Jacuzzi\"]', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80', 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'),
('RM-406', '401', 'BR-002', 4, 21999.00, 'Presidential Villa & Pool', 4, 'Dirty', '[\"WiFi\", \"AC\", \"Private Infinity Pool\", \"Royal Butler\", \"Helipad Access\"]', 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80', 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80'),
('RM-501', '101', 'BR-003', 1, 3699.00, 'Standard Garden Room', 2, 'Dirty', '[\"WiFi\", \"Tea Garden View\", \"Organic Chai\"]', 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1000&q=80', 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80'),
('RM-502', '102', 'BR-003', 1, 5799.00, 'Executive Heritage Deluxe', 2, 'Available', '[\"WiFi\", \"AC\", \"Mist Valley Balcony\", \"Fireplace\"]', 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1000&q=80', 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80'),
('RM-503', '201', 'BR-003', 2, 3699.00, 'Standard Garden Room', 2, 'Available', '[\"WiFi\", \"Breakfast\", \"Mountain View\"]', 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1000&q=80', 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80'),
('RM-504', '202', 'BR-003', 2, 11999.00, 'Royal Maharajah Suite', 3, 'Dirty', '[\"WiFi\", \"AC\", \"Private Plantation Lounge\", \"Jacuzzi\"]', 'https://images.unsplash.com/photo-1590490359683-658d3d23f972?auto=format&fit=crop&w=1000&q=80', 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'),
('RM-505', '301', 'BR-003', 3, 17999.00, 'Presidential Villa & Pool', 4, 'Occupied', '[\"WiFi\", \"AC\", \"Private Heated Pool\", \"Estate Butler\"]', 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1000&q=80', 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80'),
('RM-506', '302', 'BR-003', 3, 5799.00, 'Executive Heritage Deluxe', 2, 'Dirty', '[\"WiFi\", \"AC\", \"Tea Plantation Balcony\"]', 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1000&q=80', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80');

-- Dumping data for table `service`
INSERT INTO `service` (`sid`, `bid`, `sname`, `sdescp`, `scost`, `sstatus`, `sreqat`) VALUES
('SR-06777', 'BK-592715', 'Room Service', 'gggg', 0.00, 'Completed', '12:03 am'),
('SR-09333', 'BK-183736', 'Room Service', 'send pls', 0.00, 'Completed', '09:51 pm'),
('SR-31088', 'BK-716652', 'Spa', 'pls', 0.00, 'Completed', '10:08 pm'),
('SR-40081', 'BK-381718', 'Laundry', 'pls bring as early as possible', 0.00, 'Completed', '10:05 pm'),
('SR-87578', 'BK-716652', 'Housekeeping', 'kk', 0.00, 'Completed', '10:24 pm'),
('SRV-101', 'BK-1001', 'Ayurvedic Head & Shoulder Massage', 'Relaxing spa session for guest in room 102', 1800.00, 'Completed', '2026-07-15 10:30'),
('SRV-102', 'BK-1001', 'Organic Green Tea & Herbal Snacks', 'In-room breakfast & tea tray', 450.00, 'Completed', '2026-07-14 16:00'),
('SRV-103', 'BK-1002', 'Thermal Hydrotherapy Spa', 'Munnar retreat wellness hydrotherapy treatment', 2500.00, 'Pending', '2026-07-21 14:00'),
('SRV-104', 'BK-1005', 'Sunset Cocktail & Seafood Platter', 'Beachside dining platter for room 201', 1450.00, 'Completed', '2026-07-26 19:00'),
('SRV-105', 'BK-1005', 'Deep Tissue Body Massage', 'Goa beach resort spa package', 2200.00, 'Completed', '2026-07-27 11:00'),
('SRV-106', 'BK-1006', 'Royal Rajasthani Thali for Dinner', 'In-room royal palace dinner', 1200.00, 'Completed', '2026-07-26 21:00');

-- Dumping data for table `staffs`
INSERT INTO `staffs` (`stid`, `stname`, `email`, `phn`, `pid`, `stsal`, `stjoindt`, `strole`, `spass`, `status`) VALUES
('ST-1001', 'Ramesh Kumar', 'ramesh@verdantsprings.in', '+91 98123-45678', 'BR-001', 45000.00, '2025-03-15', 'Front Desk Supervisor', '', 'Active'),
('ST-1002', 'Priya Sharma', 'priya@verdantsprings.in', '+91 98765-11223', 'BR-001', 38000.00, '2025-05-10', 'Housekeeping Lead', '', 'Active'),
('ST-1003', 'Anand Varma', 'anand@verdantsprings.in', '+91 99887-33445', 'BR-002', 52000.00, '2024-11-20', 'Assistant General Manager', '', 'Active'),
('ST-7269', 'kabir Roy', 'kkop@gmail.com', '8877667788', 'BR-002', 45000.00, '2026-07-28', 'Front Desk Representative', '', 'Active'),
('ST-ADMIN', 'System Administrator', 'admin@grandresort.com', '+91 98765-43210', 'BR-001', 75000.00, '2026-01-01', 'admin', '$2b$10$e7K5.4c1J.E8y4kE8G8s1.6U2x6v2w8.Y.5v2v8v2', 'Active'),
('ST-STAFF1', 'Front Desk Manager', 'frontdesk@grandresort.com', '+91 98765-11223', 'BR-001', 50000.00, '2026-01-01', 'frontdesk', '$2b$10$e7K5.4c1J.E8y4kE8G8s1.6U2x6v2w8.Y.5v2v8v2', 'Active');


-- Indexes for dumped tables

-- Indexes for table `booking`
ALTER TABLE `booking`
  ADD KEY `gid` (`gid`),
  ADD KEY `rid` (`rid`),
  ADD KEY `pid` (`pid`);

-- Indexes for table `final_bill`
ALTER TABLE `final_bill`
  ADD KEY `bid` (`bid`);

-- Indexes for table `guests`
ALTER TABLE `guests`
  ADD UNIQUE KEY `email` (`email`);

-- Indexes for table `rooms`
ALTER TABLE `rooms`
  ADD KEY `pid` (`pid`);

-- Indexes for table `service`
--
ALTER TABLE `service`
  ADD KEY `bid` (`bid`);

-- Indexes for table `staffs`
ALTER TABLE `staffs`
  ADD KEY `pid` (`pid`);


-- Constraints for dumped tables

-- Constraints for table `booking`
ALTER TABLE `booking`
  ADD CONSTRAINT `booking_ibfk_1` FOREIGN KEY (`gid`) REFERENCES `guests` (`gid`) ON DELETE CASCADE,
  ADD CONSTRAINT `booking_ibfk_2` FOREIGN KEY (`rid`) REFERENCES `rooms` (`rid`) ON DELETE CASCADE,
  ADD CONSTRAINT `booking_ibfk_3` FOREIGN KEY (`pid`) REFERENCES `property` (`pid`) ON DELETE CASCADE;

-- Constraints for table `final_bill`
ALTER TABLE `final_bill`
  ADD CONSTRAINT `final_bill_ibfk_1` FOREIGN KEY (`bid`) REFERENCES `booking` (`bid`) ON DELETE CASCADE;

-- Constraints for table `rooms`
ALTER TABLE `rooms`
  ADD CONSTRAINT `rooms_ibfk_1` FOREIGN KEY (`pid`) REFERENCES `property` (`pid`) ON DELETE CASCADE;

-- Constraints for table `service`
ALTER TABLE `service`
  ADD CONSTRAINT `service_ibfk_1` FOREIGN KEY (`bid`) REFERENCES `booking` (`bid`) ON DELETE CASCADE;

-- Constraints for table `staffs`
ALTER TABLE `staffs`
  ADD CONSTRAINT `staffs_ibfk_1` FOREIGN KEY (`pid`) REFERENCES `property` (`pid`) ON DELETE CASCADE;

COMMIT;

