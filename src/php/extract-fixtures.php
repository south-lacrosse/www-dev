<?php
/**
 * Extract data into standard fixtures format from:
 * 	1. xlsx spreadsheet, with various sheets in one of 2 formats:
 * 	   a. regular fixtures with columns:
 *        division, week, date, home, away, notes (optional), venue (optional)
 *        Must have a title row, but this is ignored
 *     b. 3-way game days. Sheets should have a date, then rows below with 3
 *        teams, then can be repeated across and down
 *     c. 3-way game days v2, columns Date,Game Day,Venue,Teams
 *
 *     IMPORTANT: make sure dates column is formatted as a date otherwise the
 *     date parsing won't work correctly
 *
 *  2. Flags from tab separated file
 *     Generate in WordPress Admin->SEMLA->Flags Fixtures Formulas, and copy
 *     to flags.tsv. These will then get added in the correct order into the
 *     fixtures list.
 *
 *     Note: you may also be able to load existing fixtures using this method,
 *     see the flags() function for details.
 *
 * All settings which may need to be changed for each season are found at the
 * top of this script.
 *
 * Run with
 *
 *    php extract-fixtures.php > work\out.txt
 *
 * Then copy/paste relevant parts into the Fixtures sheet, the top section goes
 * on the Fixtures tab, and the bottom to the Divisions tab
 *
 * In Sheets: right click->Paste Special->Paste Values Only (or Ctrl-Shift-v)
 */
use Semla\Data_Access\SimpleXLSX;

// hard code files, no point in doing it via arguments
$fixtures_file = 'work/fixtures.xlsx';
$midlands_file = 'work/midlands.xlsx';
$flags_file = 'work/flags.tsv';

// arguments for fixtures xlsx sheets
$fixtures_sheets = [0,2]; // sheets with regular fixtures
// 3-way setup, array of sheet no, start row, possible columns, division name
// Note: rows and cols start at 0
$three_way_sheets = [ [1,10,[1,5,9],'Div 3'] ]; // sheets with 3-way
$fixtures_args = [
	'division_col' => 0, 'week_col' => 1, 'date_col' => 2,
	'home_col' => 3, 'away_col' => 4, 'notes_col' => 5
];

$midlands_args = [
	'date_col' => 0, 'week_col' => 1, 'venue_col' => 2, 'teams_col' => 3,
	'div_name' => 'Local Midlands'
];

$times = [
	'Bristol Bombers' => '13:00:00',
	'Buckhurst Hill' => '13:00:00',
	'Cheltenham' => '12:00:00',
	'Cheltenham A' => '12:00:00',
	'Hampstead' => '12:30:00',
	'Hampstead 2' => '12:30:00',
	'Hillcroft 1' => '10:00:00',
	'Hillcroft 2' => '10:00:00',
	'Oxford City' => '13:00:00',
	'Reading Wildcats' => '16:00:00',
];
// Divisions keyed on names used in spreadsheet, sort is sort order (must be
// string), no_time to ignore $times above (default false)

// swap_home_away defaults false, for 3-way game days allows away team to be
// swapped for home if the venue is the away team
$divisions = [
	'Prem' => [ 'div' => 'SEMLA Premier Division', 'sort' => '000' ],
	'Div 1' => [ 'div' => 'SEMLA Division 1', 'sort' => '001' ],
	'Div 2' => [ 'div' => 'SEMLA Division 2', 'sort' => '002' ],
	'Div 3' => [ 'div' => 'SEMLA Division 3', 'no_time' => true, 'swap_home_away' => true, 'sort' => '003' ],
	'SE Div 1' => [ 'div' => 'Local South East 1', 'sort' => '004' ],
	'SE Div 2' => [ 'div' => 'Local South East 2', 'sort' => '005' ],
	'SE Div 3' => [ 'div' => 'Local South East 3', 'sort' => '006' ],
	'SW' => [ 'div' => 'Local South West', 'sort' => '007' ],
	'Local Midlands' => [ 'div' => 'Local Midlands', 'swap_home_away' => true, 'sort' => '100' ],
	'Friendly' => [ 'div' => 'Friendly', 'sort' => '999' ],
];
// $fixtures = [];
$fixtures = [
	'2026-03-08101A' => "Midlands Final Four SF\t\t08/03/2026\t\t\t\tv",
	'2026-03-08101B' => "Midlands Final Four SF\t\t08/03/2026\t\t\t\tv",
	'2026-03-22101' => "Midlands Final Four F\t\t22/03/2026\t\t\t\tv",
];


$npmrc = parse_ini_file(dirname(__DIR__, 2) . '/.npmrc');
if (!$npmrc) {
	die('Cannot open .npmrc file');
}
require $npmrc['www'] . '/wp-content/plugins/semla/core/Data_Access/SimpleXLSX.php';

$xlsx = load_xlsx($fixtures_file);
foreach ($fixtures_sheets as $sheet) {
	fixtures($xlsx->rows($sheet), $fixtures_args);
}
foreach ($three_way_sheets as list($sheet, $start_row, $columns, $div_name)) {
	fixtures_three_way($xlsx->rows($sheet), $start_row, $columns, $div_name);
}
$xlsx = load_xlsx($midlands_file);
fixtures_three_way_midlands($xlsx->rows(0), $midlands_args);
flags($flags_file, $fixtures);
ksort($fixtures);
echo implode("\n",$fixtures);
echo "\n---";
unset($divisions['Friendly']);
foreach ($divisions as $division) {
	if (key_exists('teams', $division) && is_array($division['teams'])) {
		ksort($division['teams']);
		echo "\n{$division['div']}\t" . implode("\t",array_keys($division['teams']));
	}
}
exit(0);

function load_xlsx($file) {
	$xlsx = SimpleXLSX::parseFile($file)
		or die('Error parsing xlsx file: '. SimpleXLSX::parseError());
	return $xlsx;
}

function fixtures($rows, $args) {
	global $fixtures, $divisions, $times;
	extract($args);

	$row_count = count($rows);
	// skip title row
	for ($row = 1; $row < $row_count; $row++) {
		if ($rows[$row][$division_col] === ''
		|| ! $rows[$row][$home_col]
		|| ! $rows[$row][$away_col]
		|| str_starts_with($rows[$row][$home_col], 'BYE')
		|| str_starts_with($rows[$row][$away_col], 'BYE')
		) {
			continue;
		}
		$div_name = $rows[$row][$division_col];
		if (str_starts_with(strtolower($div_name), 'flags')) continue; // ignore flags
		$div_name = trim(str_replace('Draft ','',$div_name));
		if (!$divisions[$div_name]) {
			die("Unknown division $div_name");
		}

		$division = $divisions[$div_name];
		$no_time = $division['no_time'] ?? false;
		$swap_home_away = $division['swap_home_away'] ?? false;

		// SimpleXLSX formats dates as yyyy-mm-dd hh:mm:ss. We don't change
		// the default format as we need to sort by ymd, so we just format
		// the date into d/m/Y for the csv output
		$date = substr($rows[$row][$date_col],0,10);
		if (!str_contains($date,'-')) die("Invalid date: is it in date format? $date row=$row");
		$ymd = explode('-',$date);
		$home = team($rows[$row][$home_col]);
		$away = team($rows[$row][$away_col]);
		$week = team($rows[$row][$week_col]);
		if (str_starts_with($week, 'W')) {
			$week = substr($week, 1);
		}
		$time = $no_time ? '' : $times[$home] ?? '';

		$notes_venue = isset($notes_col) ? trim($rows[$row][$notes_col]) : '';
		if ($notes_venue) {
			$notes_venue = "\t\t$notes_venue";
		}

		$venue = isset($venue_col) ? trim($rows[$row][$venue_col]) : '';
		if ($venue) {
			if ($swap_home_away) {
				// swap home and away if venue is away and home is not same club
				if ($away === $venue && !is_same_club($home,$away)) {
					$old_home = $home;
					$home = $away;
					$away = $old_home;
				}
			}
			if (!is_same_club($venue,$home)) {
				if (!$notes_venue) $notes_venue .= "\t\t";
				$notes_venue .= "\t$venue";
			}
		}

		$sort = $date . $division['sort'] . $home . $away;
		$fixtures[$sort] = "{$division['div']}\t$week\t$ymd[2]/$ymd[1]/$ymd[0]\t$time\t$home\t\tv\t\t$away$notes_venue";

		$divisions[$div_name]['teams'][$home] = 1;
		$divisions[$div_name]['teams'][$away] = 1;
	}
}

/**
 * Format is:
 *
 * date
 * home team, team 2, team 3
 * ...
 * may be repeated across or down
 *
 * @param int $start_row row to start looking, index starts at 0
 * @param [] $columns array of columns to check, index starts at 0. Will be
 *  where date is, then teams are on the row down on this and the next 2 columns
 * @param string $div_name division name to use
 */
function fixtures_three_way($rows, $start_row, $columns, $div_name) {
	global $fixtures, $divisions;

	$division = $divisions[$div_name];
	$swap_home_away = $division['swap_home_away'] ?? false;
	$row_count = count($rows);
	$week = 0;
	$row = $start_row;
	$first_col = $columns[0];
	while ($row < $row_count) {
		if (! $rows[$row][$first_col]) { // ignore empty line
			$row++;
			continue;
		}
		$new_row = $row;
		foreach ($columns as $col) {
			if (! $rows[$row][$col]) continue;
			// SimpleXLSX formats dates as yyyy-mm-dd hh:mm:ss. We don't change
			// the default format as we need to sort by ymd, so we just format
			// the date into d/m/Y for the csv output
			$date = substr($rows[$row][$col],0,10);
			if (!str_contains($date,'-')) die("Invalid date: is it in date format? $date row=$row col=$col");
			$ymd = explode('-',$date);
			$week++;
			for ($team_row = $row + 1; $team_row < $row_count && $rows[$team_row][$col]; $team_row++) {
				if ($team_row > $new_row) $new_row = $team_row;
				$teams = [];
				// in teams row, will be home team & 2 other teams
				foreach ([$col,$col+1,$col+2] as $team_col) {
					$team = team($rows[$team_row][$team_col]);
					$divisions[$div_name]['teams'][$team] = 1;
					$teams[] = $team;
				}
				// now create the matches
				foreach ([[0,1], [1,2], [0,2]] as $match) {
					$home_index = $match[0];
					$home = $teams[$home_index];
					$away = $teams[$match[1]];

					// don't need venue if home team is the host, or the home team is in
					// the same club
					if ($home_index === 0 || is_same_club($teams[0], $home)) {
						$venue = '';
					} else {
						// 2 vs 3 game, and we know 2 is not same club
						if ($swap_home_away && is_same_club($teams[0], $away)) {
							$old_home = $home;
							$home = $away;
							$away = $old_home;
							$venue = '';
						} else {
							$venue = "\t\t\t" . $teams[0];
						}
					}

					$sort = $date . $division['sort'] . $home . $away;
					$fixtures[$sort] = "{$division['div']}\t$week\t$ymd[2]/$ymd[1]/$ymd[0]\t\t$home\t\tv\t\t$away$venue";
				}
			}
		}
		$row = $new_row + 1;
	}
}

/**
 * Format is:
 *
 * Date,Game Day,Venue,Teams
 * ...
 * stops soon as there's a blank row
 *
 * @param [] $rows rows from sheet
 * @param [] args
 */
function fixtures_three_way_midlands($rows, $args) {
	global $fixtures, $divisions;

	extract($args);
	$division = $divisions[$div_name];
	$swap_home_away = $division['swap_home_away'] ?? false;

	$row_count = count($rows);
	for ($row = 1; $row < $row_count; $row++) {
		if (! $rows[$row][$date_col]
		|| $rows[$row][$venue_col] === 'TBC') {
			continue;
		}

		$timestamp = strtotime($rows[$row][$date_col]);
		$date = date('Y-m-d', $timestamp);
		$ymd = explode('-',$date);

		$week = filter_var($rows[$row][$week_col], FILTER_SANITIZE_NUMBER_INT);
		$venue = team($rows[$row][$venue_col]);

		$teams = [];
		foreach (explode(',', $rows[$row][$teams_col]) as $team) {
			$team = team($team);
			$divisions[$div_name]['teams'][$team] = 1;
			$teams[] = $team;
		}

		// now create the matches
		foreach ([[0,1], [1,2], [0,2]] as $match) {
			$home = $teams[$match[0]];
			$away = $teams[$match[1]];

			// don't need venue if home team is the host, or the home team is in
			// the same club
			if ($home === $venue || is_same_club($venue, $home)) {
				$match_venue = '';
			} else {
				// 2 vs 3 game, and we know 2 is not same club
				if ($swap_home_away && is_same_club($venue, $away)) {
					$old_home = $home;
					$home = $away;
					$away = $old_home;
					$match_venue = '';
				} else {
					$match_venue = "\t\t\t" . $venue;
				}
			}

			$sort = $date . $division['sort'] . $home . $away;
			$fixtures[$sort] = "{$division['div']}\t$week\t$ymd[2]/$ymd[1]/$ymd[0]\t\t$home\t\tv\t\t$away$match_venue";
		}
	}
}

/**
 * Extract flags matches generated in WordPress Admin->SEMLA->Flags Fixtures
 * Formulas
 *
 * Will also work for fixtures copied from an existing Fixtures Sheet, e.g. if
 * the fixtures have been extracted to the Fixtures Sheet and changes made to
 * that before the Midlands fixtures have been extracted, then you can copy the
 * fixtures from the sheet to a tsv file and load the using this method, though
 * the sort order may not be right so that may have to be checked.
 *
 * Note: if you copy flags matches then you will be missing the formulas. To
 * copy formulas first show them using View->Show->Formulae (or Ctrl + `), and
 * don't forget to change that back once you're done.
 */
function flags($file) {
	global $fixtures;
	$lines = file($file);

	$seq = 0;
	foreach ($lines as $line) {
		$line = trim($line);
		if ($line === '') continue;
		$split = explode("\t",$line);
		$comp = array_shift($split);
		$week = array_shift($split);
		$dmy = explode('/',$split[0]);
		$seq++;
		$sort = "$dmy[2]-$dmy[1]-$dmy[0]200" . str_pad($seq, 3, "0", STR_PAD_LEFT);
		$fixtures[$sort] = "$comp\t$week\t" . implode("\t", $split);
	}
}

function team($team) {
	$team = str_replace(' (H)','',trim($team));
	$teams = [
		'Bristol' => 'Bristol Bombers',
		'Cambridge' => 'Cambridge City',
		'Camden' => 'Camden Capybaras',
		'Camden 2' => 'Camden Capybaras 2',
		'Camden 3' => 'Camden Capybaras 3',
		'Canterbury' => 'Canterbury City',
		'Cardiff' => 'Cardiff Harlequins',
		'Guildford' => 'Guildford Gators',
		'Hillcroft' => 'Hillcroft 1',
		'Imperial' => 'Imperial College',
		'Milton Keynes' => 'Milton Keynes Minotaurs',
		'Raptors' => 'Purley Raptors',
		'Raptors 2' => 'Purley Raptors 2',
		'Reading' => 'Reading Wildcats',
		'Welwyn' => 'Welwyn Warriors',
		'Welwyn 2' => 'Welwyn 2/MK',
		'Welwyn 2 / MK' => 'Welwyn 2/MK',
		// Midlands
		'Derby' => 'Derby Hurricanes',
		'Leicester 1' => 'Leicester City 1',
		'Leicester 2' => 'Leicester City 2',
		'Loughborough' => 'Loughborough Lions',
		'NTU' => 'Nottingham Trent Uni',
		'Stoke 1' => 'City of Stoke 1',
		'Stoke 2' => 'City of Stoke 2',
		'Tanger' => 'Sheffield Tanger',
		'Warwick' => 'Warwick Uni',
		'UoN' => 'Nottingham Uni',
	];
	return $teams[$team] ?? $team;
}

/**
 * Check if teams belong to the same club. We just remove any trailing single
 * character so it handles Hitchin A and Hitchin, or Spencer 2 and Spencer 3.
 */
function is_same_club($team1, $team2) {
	return preg_replace('/ .$/', '', $team1) === preg_replace('/ .$/', '', $team2);
}