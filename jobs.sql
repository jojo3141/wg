-- phpMyAdmin SQL Dump
-- version 4.7.1
-- https://www.phpmyadmin.net/
--
-- Host: sql7.freesqldatabase.com
-- Erstellungszeit: 27. Okt 2024 um 17:56
-- Server-Version: 5.5.62-0ubuntu0.14.04.1
-- PHP-Version: 7.0.33-0ubuntu0.16.04.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `sql7739902`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `jobs`
--

CREATE TABLE `jobs` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `weeks` int(11) NOT NULL,
  `person` text,
  `last_done` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Daten für Tabelle `jobs`
--

INSERT INTO `jobs` (`id`, `title`, `description`, `weeks`, `person`, `last_done`) VALUES
(1, 'Wäsche', 'Lappen, Abtrocknungstuch ect. austauschen und waschen', 2, 'Franek', '2024-10-27 17:47:29'),
(2, 'Boden saugen und feucht putzen', '', 1, 'Franek', '2024-10-27 17:47:19'),
(3, 'Bad putzen', 'beide WCs und Lavabos putzen und Spiegel und Boden', 1, 'Yaiza', '2024-10-10 20:06:11'),
(4, 'Müll', 'Müll leeren, Glas & Alu entsorgen, Kompost leeren', 1, 'Yaiza', '2024-10-27 17:28:18'),
(5, 'Kochen', '', 1, 'Yaiza', '2024-10-27 17:25:23'),
(6, 'Küche putzen', 'Schränke aufräumen', 2, 'Yaiza', '2024-10-27 17:25:21'),
(7, 'Ofen putzen', '', 4, 'Franek', '2024-10-27 17:23:52'),
(8, 'Kühlschrank', '', 4, 'Noella', '2024-10-27 17:38:26');

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
