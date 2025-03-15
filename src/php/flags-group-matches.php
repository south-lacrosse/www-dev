<?php
/**
 * Quick fudge to create fixtures rows with all the correct flags group matches,
 * with teams taken from the Divisions sheet so that they can be easily changed
 *
 * run with something like "php flags-group-matches.php > work\groups.tsv",
 * and then copy the file and paste into the Google Sheet with Ctrl-v
 *
 * IMPORTANT: assumes 3 teams per group!
 */

 $date = '22/03/2025';

// groups is Division sheet row no. => [competition,location]
$groups = [
	11 => ['Senior Flags A', 'Bromley'],
	12 => ['Senior Flags B', 'Hillcroft 1'],
	13 => ['Intermediate Flags A', 'Walcountians'],
	14 => ['Intermediate Flags B', 'Bristol Bombers'],
	15 => ['Intermediate Flags C', 'Cheltenham'],
	16 => ['Minor Flags A', 'Buckhurst Hill'],
	17 => ['Minor Flags B', 'Bath'],
	18 => ['Minor Flags C', 'Leicester City 1'],
];

// columns on Division sheet are G,H,I
$matches = [['G', 'H'],['H', 'I'],['G', 'I']];

// Assumes columns are Competition, Week, Date, Time, Home, Home Goals, v, Away Goals, Away, X, Notes, Venue

foreach ($groups as $row => $group) {
	foreach ($matches as $match) {
		echo "$group[0]\t\t$date\t\t=Divisions!\$$match[0]\$$row\t\tv\t\t=Divisions!\$$match[1]\$$row\t\t\t$group[1]\n";
	}
}