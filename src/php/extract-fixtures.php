<?php
/**
 * Extract data into standard fixtures format from:
 * 	1. xlsx spreadsheet, for columns see fixtures() function
 *  2. midlands from CSV (text extracted from PDF and commas added to separate fields)
 *  3. flags from tab separated (generate in WordPress Admin->SEMLA->Flags Fixtures Formulas)
 *
 * Run with
 *
 * php extract-fixtures.php excel-file.xlsx midlands.csv flags.tsv > out.txt
 *
 * Then copy/paste relevant part - top bit goes to Divisions tab
 *
 * In Sheets: right click->Paste Special->Paste Values Only (or Ctrl-Shift-v)
 */
use Semla\Data_Access\SimpleXLSX;

if (count($argv) !== 4) {
	die("Usage: php $argv[0] excel-file.xlsx midlands.csv flags.tsv");
}

$npmrc = parse_ini_file(dirname(__DIR__, 2) . '/.npmrc');
if (!$npmrc) {
	die('Cannot open .npmrc file');
}
require $npmrc['www'] . '/wp-content/plugins/semla/core/Data_Access/SimpleXLSX.php';

$xlsx = SimpleXLSX::parseFile($argv[1]);
if (!$xlsx) {
	die('Error parsing xlsx file: '. SimpleXLSX::parseError());
}

competitions($xlsx);
echo "\n------\n";
// $fixtures = [];
$fixtures = [
	'2024-03-03101A' => "Midlands Final Four SF\t\t03/03/2024\t\t\t\tv",
	'2024-03-03101B' => "Midlands Final Four SF\t\t03/03/2024\t\t\t\tv",
	'2024-03-24101' => "Midlands Final Four F\t\t03/03/2024\t\t\t\tv",
];
fixtures($xlsx, $fixtures);
csv($argv[2], $fixtures);
flags($argv[3], $fixtures);
ksort($fixtures);
echo implode("\n",$fixtures);
echo "\n--- Completed";
exit(0);

function competitions($xlsx) {
	$rows = $xlsx->rows(0);
	for ($col = 32; $col < 40; $col++) {
		echo "\n" . $rows[4][$col];
		for ($row = 6; $row < 34; $row++) {
			if ($rows[$row][$col] === 'Yes') {
				echo "\t" . team($rows[$row][0]);
			}
		}
	}
}

function fixtures($xlsx, &$fixtures) {
	$rows = $xlsx->rows(1);
	$DIVISION = 1;
	$WEEK = 2;
	$DATE = 3;
	$HOME = 4;
	$AWAY = 5;
	for ($row = count($rows) - 1; $row > 0; $row--) {
		if ($rows[$row][$DIVISION] === ''
		|| str_starts_with($rows[$row][$HOME], 'BYE WEEK')
		|| str_starts_with($rows[$row][$AWAY], 'BYE WEEK')
		) {
			continue;
		}
		$division = division($rows[$row][$DIVISION]);
		$date = substr($rows[$row][$DATE],0,10);
		if ($date === '2023-04-06') $date = '2024-04-06';
		$ymd = explode('-',$date);
		$home = team($rows[$row][$HOME]);
		$away = team($rows[$row][$AWAY]);
		$week = team($rows[$row][$WEEK]);
		$sort = $date . $division['sort'] . $home . $away;
		$fixtures[$sort] = "{$division['div']}\t$week\t$ymd[2]/$ymd[1]/$ymd[0]\t\t$home\t\tv\t\t$away";
	}
}

function csv($file, &$fixtures) {
	/**
	 * File format looks like (extract from PDF and add commas)
	 * Gameday 1 – Sunday 8th October 2023
	 * Gameday 1a (Nuneaton 1), Gameday 1b (Sheffield Tanger), Gameday 1c (Leicester)
	 * Nuneaton 1 Vs (League) Stoke, Sheffield Tanger Vs (League) Derby, Leicester Vs (League) Warwick
 	 */
	$handle = fopen($file, "r");
	if ($handle === FALSE) {
		die("cannot open CSV file $file");
	}
	$phase = '';
	$seperator = ' – ';
	$seperator_len = strlen($seperator);
	while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
		$num = count($data);
		if ($num === 1) {
			if (($pos = strpos($data[0], $seperator)) === FALSE) {
				die("Missing '$seperator' in gameday line: $data[0]");
			}
			$timestamp = strtotime(substr($data[0], $pos + $seperator_len));
			$date = date('d/m/Y', $timestamp);
			$sort_date = date('Y-m-d', $timestamp);
			$phase = 'venues';
			continue;
		}
		if ($phase === 'venues') {
			$venues = [];
			foreach ($data as $venue) {
				$venues[] = team(str_inside_brackets($venue));
			}
			$phase = 'games';
			continue;
		}
		if (empty($date) || empty($venues)) die("No date/venues");
		foreach ($data as $location => $game) {
			if (! preg_match('/^ *(.*) Vs \(([^)]*)\) (.*)$/', $game, $match)) {
				die("Invalid game format: $game");
			}
			if ($match[2] === 'League') {
				$seq = '100';
				$div = 'Local Midlands';
			} else {
				$seq = '999';
				$div = 'Friendly';
			}
			$home = team($match[1]);
			$away = team($match[3]);
			$venue = $venues[$location];
			// swap home and away if venue is away and home is not same club
			if ($away === $venue && substr($away,0,-1) !== substr($home,0,-1)) {
				$old_home = $home;
				$home = $away;
				$away = $old_home;
			}
			if (substr($venue,0,-1) === substr($home,0,-1)) {
				$venue = '';
			} else {
				$venue = "\t\t\t$venue";
			}
			$sort = $sort_date . $seq . $home . $away;
			$fixtures[$sort] = "$div\t\t$date\t\t$home\t\tv\t\t$away$venue";
		}
	}
	fclose($handle);
}

function flags($file, &$fixtures) {
	$lines = file($file);

	$seq = 0;
	foreach ($lines as $line) {
		$line = trim($line);
		if ($line === '') continue;
		$split = explode("\t",$line);
		$comp = array_shift($split);
		$dmy = explode('/',$split[0]);
		$seq++;
		$sort = "$dmy[2]-$dmy[1]-$dmy[0]200" . str_pad($seq, 3, "0", STR_PAD_LEFT);
		$fixtures[$sort] = "$comp\t\t" . implode("\t", $split);
	}
}

function team($team) {
	$teams = [
		'Blues' => 'Walcountian Blues',
		'Bristol' => 'Bristol Bombers',
		'Camden' => 'Camden Capybaras',
		'Camden 2' => 'Camden Capybaras 2',
		'Camden 3' => 'Camden Capybaras 3',
		'Cardiff' => 'Cardiff Harlequins',
		'Guildford' => 'Guildford Gators',
		'Hillcroft' => 'Hillcroft 1',
		'Imperial' => 'Imperial College',
		'Milton Keynes' => 'Milton Keynes Minotaurs',
		'Reading' => 'Reading Wildcats',
		'Welwyn' => 'Welwyn Warriors',
		// Midlands
		'Derby' => 'Derby Hurricanes',
		'Leicester' => 'Leicester City',
		'Loughborough' => 'Loughborough Lions',
		'NTU' => 'Nottingham Trent Uni',
		'Stoke' => 'City of Stoke',
		'Warwick' => 'Warwick Uni',
	];
	return $teams[$team] ?? $team;
}

function division($division) {
	$divisions = [
		'Premier' => [ 'div' => 'SEMLA Premier Division', 'sort' => '000' ],
		'Div 1' => [ 'div' => 'SEMLA Division 1', 'sort' => '001' ],
		'Div 2' => [ 'div' => 'SEMLA Division 2', 'sort' => '002' ],
		'Div 3' => [ 'div' => 'SEMLA Division 3', 'sort' => '003' ],
		'SE1' => [ 'div' => 'Local South East 1', 'sort' => '004' ],
		'SE2' => [ 'div' => 'Local South East 2', 'sort' => '005' ],
		'SE3' => [ 'div' => 'Local South East 3', 'sort' => '006' ],
		'South West' => [ 'div' => 'Local South West', 'sort' => '007' ],
	];
	if (!$divisions[$division]) {
		die("Unknown division $division");
	}
	return $divisions[$division];
}

function str_inside_brackets($str) {
	$start = strpos($str, '(');
	$end = strpos($str, ')', $start + 1);
	$length = $end - $start;
	return substr($str, $start + 1, $length - 1);
}
