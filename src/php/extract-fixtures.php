<?php
/**
 * Extract data from xlsx spreadsheet into standard fixtures format, and
 * midlands from CSV
 *
 * In Sheets: paste CSV data, then Data > Split text to columns
 */
use Semla\Data_Access\SimpleXLSX;

if (count($argv) !== 3) {
	die("Usage: php $argv[0] excel-file.xlsx midlands.csv");
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
	'2024-03-03101A' => "Midlands Final Four SF,,03/03/2024,,,,v",
	'2024-03-03101B' => "Midlands Final Four SF,,03/03/2024,,,,v",
	'2024-03-24101' => "Midlands Final Four F,,03/03/2024,,,,v",
];
fixtures($xlsx, $fixtures);
csv($argv[2], $fixtures);
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
				echo ',' . team($rows[$row][0]);
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
		|| $rows[$row][$HOME] === 'BYE WEEK'
		|| $rows[$row][$AWAY] === 'BYE WEEK'
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
		$fixtures[$sort] = "{$division['div']},$week,$ymd[2]/$ymd[1]/$ymd[0],,$home,,v,,$away";
	}
}

function csv($file, &$fixtures) {
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
			$sort = $sort_date . $seq . $home . $away;
			$fixtures[$sort] = "$div,,$date,,$home,,v,,$away,,,{$venues[$location]}";
		}
	}
	fclose($handle);
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