-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th6 19, 2023 lúc 04:17 PM
-- Phiên bản máy phục vụ: 10.4.27-MariaDB
-- Phiên bản PHP: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `qlrcp`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `ghe`
--

CREATE TABLE `ghe` (
  `idghe` int(11) NOT NULL,
  `tenghe` varchar(255) NOT NULL,
  `idphong` int(11) NOT NULL,
  `giaghe` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `ghe`
--

INSERT INTO `ghe` (`idghe`, `tenghe`, `idphong`, `giaghe`) VALUES
(1, 'A1', 1, 20000),
(2, 'A2', 1, 20000),
(3, 'A3', 1, 20000),
(4, 'B1', 1, 2000),
(5, 'B4', 2, 20000),
(6, 'B4', 5, 20000),
(7, 'B7', 5, 20000);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `khachhang`
--

CREATE TABLE `khachhang` (
  `idkh` int(11) NOT NULL,
  `tenkh` varchar(255) NOT NULL,
  `gioitinh` varchar(255) NOT NULL,
  `ngaysinh` date NOT NULL,
  `diachi` varchar(255) NOT NULL,
  `sodienthoai` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `khachhang`
--

INSERT INTO `khachhang` (`idkh`, `tenkh`, `gioitinh`, `ngaysinh`, `diachi`, `sodienthoai`) VALUES
(1, 'Lê Minh Tùng', 'Nam', '2003-06-06', 'Hà Nội', '4214242124'),
(2, 'Bùi Văn Trường', 'Nam', '2002-04-25', 'Hà Nội', '0362685821'),
(3, 'truong', 'Nam', '2001-01-01', 'Hà Nội', '12312312'),
(4, 'Bùi Văn Trường', 'Nam', '2002-04-25', 'Hà Nội', '0362685821'),
(5, 'Bùi Văn Trường', 'Nam', '2002-04-25', 'Hà Nội', '0362685821'),
(6, 'Bùi Văn Trường', 'Nam', '2002-02-22', 'Hà Nội', '0362685821'),
(7, 'Bùi Văn Trường', 'Nam', '2002-04-25', 'Hà Nội', '0362685821');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `lichchieu`
--

CREATE TABLE `lichchieu` (
  `idlichchieu` int(11) NOT NULL,
  `idphong` int(11) NOT NULL,
  `idphim` int(11) NOT NULL,
  `ngaychieu` date NOT NULL,
  `giochieu` time NOT NULL,
  `gioketthuc` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `lichchieu`
--

INSERT INTO `lichchieu` (`idlichchieu`, `idphong`, `idphim`, `ngaychieu`, `giochieu`, `gioketthuc`) VALUES
(1, 1, 1, '2023-06-30', '14:00:00', '16:00:00'),
(2, 2, 2, '2023-06-29', '14:00:00', '16:00:00');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `phim`
--

CREATE TABLE `phim` (
  `idphim` int(11) NOT NULL,
  `tenphim` varchar(255) NOT NULL,
  `theloai` varchar(255) NOT NULL,
  `noidung` text NOT NULL,
  `daodien` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `phim`
--

INSERT INTO `phim` (`idphim`, `tenphim`, `theloai`, `noidung`, `daodien`, `image`) VALUES
(1, 'fast and furious', 'Hành động', 'Dom Toretto và gia đình của anh ấy bị trở thành mục tiêu của người con trai đầy thù hận của ông trùm ma túy Hernan Reyes', 'Louis Leterrier', 'fast.jpg'),
(2, 'Transformer', 'Hành động', 'Bộ phim dựa trên sự kiện Beast Wars trong loạt phim hoạt hình', 'Steven Caple Jr', 'transformer.jpg'),
(5, 'Vệ binh giải ngân hà 3', 'Hành động', 'Hành trình giải cứu chú mèo Rocket của nhóm vệ binh khỏi gã khoa học điên', 'James Gunn', '2.png'),
(6, 'Lật mặt 6 tấm vé định mệnh', 'Hài, Hành Động, Hồi hộp, Tâm Lý', 'Kể về 6 người bạn thân có được tấm vé số định mệnh', 'Lý Hải', '1.png'),
(7, 'CHEBI: GẤU TAI TO ĐÁNG YÊU', 'Hoạt hình', 'Chú gấu Chebi – một sinh vật nhỏ, màu nâu, có đôi tai khổng lồ và đôi mắt to với sở thích ăn cam.', 'Dmitriy Dyachenko', '3.png'),
(9, 'test', 'test', 'test', 'test', '4.png');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `phong`
--

CREATE TABLE `phong` (
  `idphong` int(11) NOT NULL,
  `tenphong` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `phong`
--

INSERT INTO `phong` (`idphong`, `tenphong`) VALUES
(1, 'Phòng 1'),
(2, 'Phòng 2'),
(5, 'phòng 3');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `photo`
--

CREATE TABLE `photo` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `filename` varchar(255) NOT NULL,
  `views` double NOT NULL,
  `isPublished` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `quanly`
--

CREATE TABLE `quanly` (
  `idql` int(11) NOT NULL,
  `tenql` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `quanly`
--

INSERT INTO `quanly` (`idql`, `tenql`) VALUES
(1, 'Bùi Văn Trường');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user`
--

CREATE TABLE `user` (
  `idtk` int(11) NOT NULL,
  `idql` int(11) DEFAULT NULL,
  `idkh` int(11) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `user`
--

INSERT INTO `user` (`idtk`, `idql`, `idkh`, `email`, `password`) VALUES
(1, 1, NULL, 'qla@gmail.com', '$2a$10$HnmPPIyyF4UplV8MDuGRCuvhwBOoq26s980GtH4HmUHVNljHgDU6y'),
(2, NULL, 1, 'kha@gmail.com', '$2a$10$5GNEXY7CUg1R9ZW4BhSp.Oa6wv/llMfqjfuyZmqEmVVxXTB1l5lD6'),
(3, NULL, 2, 'buitruongar13@gmail.com', '$2a$10$NVQHt/niGVrU9.YzCOqahujl6nqkS.mWG4WrQ.N8KgUEuhhbrpeoS'),
(4, NULL, 3, 'buitruongfarm@gmail.com', '$2a$10$y8o1JIOSrxIkJNsv/2JBK.BBAyfQv/v6N5mUQ2DHk9SQiFmNyDO1O'),
(8, NULL, 7, '2051063856@e.tlu.edu.vn', '$2a$10$9cMuC7pqK0LSoZMo63PWQ.dhqWBETJxAvCKGOQWxMNOJCxMUFlJ/a');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `ve`
--

CREATE TABLE `ve` (
  `idve` int(11) NOT NULL,
  `idghe` int(11) NOT NULL,
  `idkh` int(11) NOT NULL,
  `ngaymua` date NOT NULL DEFAULT curdate()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `ve`
--

INSERT INTO `ve` (`idve`, `idghe`, `idkh`, `ngaymua`) VALUES
(1, 1, 1, '2023-06-18'),
(4, 4, 1, '2023-06-18'),
(5, 3, 1, '2023-06-18'),
(6, 2, 2, '2023-06-19'),
(7, 5, 2, '2023-06-19'),
(8, 7, 2, '2023-06-19');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `ghe`
--
ALTER TABLE `ghe`
  ADD PRIMARY KEY (`idghe`),
  ADD KEY `FK_e9d3aaa8be4c7359c1a617de66a` (`idphong`);

--
-- Chỉ mục cho bảng `khachhang`
--
ALTER TABLE `khachhang`
  ADD PRIMARY KEY (`idkh`);

--
-- Chỉ mục cho bảng `lichchieu`
--
ALTER TABLE `lichchieu`
  ADD PRIMARY KEY (`idlichchieu`),
  ADD UNIQUE KEY `REL_233bd311b63f8953c3469ea5f3` (`idphong`),
  ADD KEY `FK_3024ab9f33f717bf452ecee27b7` (`idphim`);

--
-- Chỉ mục cho bảng `phim`
--
ALTER TABLE `phim`
  ADD PRIMARY KEY (`idphim`);

--
-- Chỉ mục cho bảng `phong`
--
ALTER TABLE `phong`
  ADD PRIMARY KEY (`idphong`);

--
-- Chỉ mục cho bảng `photo`
--
ALTER TABLE `photo`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `quanly`
--
ALTER TABLE `quanly`
  ADD PRIMARY KEY (`idql`);

--
-- Chỉ mục cho bảng `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`idtk`),
  ADD UNIQUE KEY `IDX_e12875dfb3b1d92d7d7c5377e2` (`email`),
  ADD UNIQUE KEY `REL_59376853c893a0beb0fa3ac1a6` (`idql`),
  ADD UNIQUE KEY `REL_3384a085cd19308f618bdc760b` (`idkh`);

--
-- Chỉ mục cho bảng `ve`
--
ALTER TABLE `ve`
  ADD PRIMARY KEY (`idve`),
  ADD UNIQUE KEY `REL_7e414a79c4d834382f39bc12c0` (`idghe`),
  ADD KEY `FK_343349a9e6e76b35103abc6470a` (`idkh`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `ghe`
--
ALTER TABLE `ghe`
  MODIFY `idghe` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT cho bảng `khachhang`
--
ALTER TABLE `khachhang`
  MODIFY `idkh` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT cho bảng `lichchieu`
--
ALTER TABLE `lichchieu`
  MODIFY `idlichchieu` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `phim`
--
ALTER TABLE `phim`
  MODIFY `idphim` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT cho bảng `phong`
--
ALTER TABLE `phong`
  MODIFY `idphong` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `photo`
--
ALTER TABLE `photo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `quanly`
--
ALTER TABLE `quanly`
  MODIFY `idql` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `user`
--
ALTER TABLE `user`
  MODIFY `idtk` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT cho bảng `ve`
--
ALTER TABLE `ve`
  MODIFY `idve` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `ghe`
--
ALTER TABLE `ghe`
  ADD CONSTRAINT `FK_e9d3aaa8be4c7359c1a617de66a` FOREIGN KEY (`idphong`) REFERENCES `phong` (`idphong`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `lichchieu`
--
ALTER TABLE `lichchieu`
  ADD CONSTRAINT `FK_233bd311b63f8953c3469ea5f36` FOREIGN KEY (`idphong`) REFERENCES `phong` (`idphong`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_3024ab9f33f717bf452ecee27b7` FOREIGN KEY (`idphim`) REFERENCES `phim` (`idphim`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `FK_3384a085cd19308f618bdc760b3` FOREIGN KEY (`idkh`) REFERENCES `khachhang` (`idkh`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_59376853c893a0beb0fa3ac1a63` FOREIGN KEY (`idql`) REFERENCES `quanly` (`idql`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `ve`
--
ALTER TABLE `ve`
  ADD CONSTRAINT `FK_343349a9e6e76b35103abc6470a` FOREIGN KEY (`idkh`) REFERENCES `khachhang` (`idkh`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_7e414a79c4d834382f39bc12c05` FOREIGN KEY (`idghe`) REFERENCES `ghe` (`idghe`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
