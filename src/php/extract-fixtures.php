<?php
/**
 * Extract data from xlsx spreadsheet into standard fixtures format
 *
 * In sheets: paste CSV data, thenData > Split text to columns
 */
use Semla\Data_Access\SimpleXLSX;

if (count($argv) !== 2) {
	die("Usage: php $argv[0] excel-file.xlsx");
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
fixtures($xlsx);
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

function fixtures($xlsx) {
	$rows = $xlsx->rows(1);
	$DIVISION = 1;
	$WEEK = 2;
	$DATE = 3;
	$HOME = 4;
	$AWAY = 5;
	$fixtures = [];
	for ($row = count($rows) - 1; $row > 0; $row--) {
		if ($rows[$row][$DIVISION] === ''
		|| $rows[$row][$HOME] === 'BYE WEEK'
		|| $rows[$row][$AWAY] === 'BYE WEEK'
		) {
			continue;
		}
		$division = division($rows[$row][$DIVISION]);
		$date = substr($rows[$row][$DATE],0,10);
		$ymd = explode('-',$date);
		$home = team($rows[$row][$HOME]);
		$away = team($rows[$row][$AWAY]);
		$week = team($rows[$row][$WEEK]);
		$sort = $date . $division['sort'] . $home . $away;
		$fixtures[$sort] = "{$division['div']},$week,$ymd[2]/$ymd[1]/$ymd[0],,$home,,v,,$away";
	}
	ksort($fixtures);
	echo implode("\n",$fixtures);
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
	];
	return $teams[$team] ?? $team;
}
function division($division) {
	$divisions = [
		'Premier' => [ 'div' => 'SEMLA Premier Division', 'sort' => 0 ],
		'Div 1' => [ 'div' => 'SEMLA Division 1', 'sort' => 1 ],
		'Div 2' => [ 'div' => 'SEMLA Division 2', 'sort' => 2 ],
		'Div 3' => [ 'div' => 'SEMLA Division 3', 'sort' => 3 ],
		'SE1' => [ 'div' => 'Local South East 1', 'sort' => 4 ],
		'SE2' => [ 'div' => 'Local South East 2', 'sort' => 5 ],
		'SE3' => [ 'div' => 'Local South East 3', 'sort' => 6 ],
		'South West' => [ 'div' => 'Local South West', 'sort' => 7 ],
	];
	if (!$divisions[$division]) {
		die("Unknown division $division");
	}
	return $divisions[$division];
}
