<?php
/**
 * Quick fudge to create fixtures rows with all the correct flags group matches,
 * with teams taken from the Divisions sheet so that they can be easily changed
 *
 * Run with something like "php flags-group-matches.php > work\groups.tsv", and
 * then copy the file and paste into the Google Sheet with Ctrl+V (or
 * Ctrl+Shift+V)
 *
 * IMPORTANT: assumes 3 teams per group!
 */

 $date = '14/03/2026';

// groups is Division sheet row no. => [competition,location]
$groups = [
	11 => ['Senior Flags A', ''],
	12 => ['Senior Flags B', ''],
	13 => ['Intermediate Flags A', ''],
	14 => ['Intermediate Flags B', ''],
	15 => ['Intermediate Flags C', ''],
	16 => ['Minor Flags A', 'Leicester City 1'],
	17 => ['Minor Flags B', 'Bath'],
];

// columns on Division sheet are G,H,I
$matches = [['G', 'H'],['H', 'I'],['G', 'I']];

// Assumes columns are Competition, Week, Date, Time, Home, Home Goals, v, Away Goals, Away, X, Notes, Venue

foreach ($groups as $row => $group) {
	foreach ($matches as $match) {
		echo "$group[0]\t\t$date\t\t=Divisions!\$$match[0]\$$row\t\tv\t\t=Divisions!\$$match[1]\$$row\t\t\t$group[1]\n";
	}
}