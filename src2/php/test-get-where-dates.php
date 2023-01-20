<?php

/**
 * Quick test for get_where_dates() in Fixtures_Results_Gateway
 */
$tz = new \DateTimeZone('Europe/London');
$one_day = new \DateInterval('P1D');
$interval = \DateInterval::createFromDateString('1 day');

test_dates( ['2021-10-30','2021-10-31','2021-11-06','2021-11-13', '2021-11-15'], 'f.');
test_dates( ['2022-04-23','2022-04-30','2022-05-02'] );
test_dates( ['2022-04-23','2022-04-30'] );

echo "\nsingle 2022-04-23" . get_where_dates(['2022-04-23'], new \DateTime('now', $tz));
echo "\nempty " . get_where_dates([], new \DateTime('now', $tz));

function test_dates($dates, $prefix='') {
    global $tz, $one_day, $interval;

    $begin = new \DateTime($dates[0], $tz);
    $begin->sub($one_day);
    $end = new \DateTime($dates[count($dates) -1], $tz);
    $end->add($one_day);

    $period = new \DatePeriod($begin, $interval, $end);

    echo "\ntesting dates " . implode(', ', $dates);
    foreach ($period as $dt) {
        echo "\n" .  $dt->format("Y-m-d") . ' ' .get_where_dates($dates, $dt, $prefix);
    }
}

/**
 * Return sql for where clause for default fixtures, i.e. when the user hasn't
 * selected a date/team etc. We return 2 dates around the current date (so if today
 * is a match date then we get 3 dates), minimum 2 dates so if it's before the
 * season we get the first 2 dates.
 */
function get_where_dates($dates,$today_datetime,$prefix='') {
//    $today_datetime = new \DateTime('now', new \DateTimeZone('Europe/London'));
    $today = $today_datetime->format('Y-m-d');

    $count = count($dates);
    if ($count <= 1) return '';
    if ($count === 2 || $today < $dates[1]) {
        $compare_date = $dates[0];
        $compare_date2 = $dates[1];
    } else {
        $before_last = $count - 2;
        if ($today >= $dates[$before_last]) {
            $compare_date = $today === $dates[$before_last] ?
                            $dates[$before_last - 1] : $dates[$before_last];
            $compare_date2 = $dates[$before_last+1];
        } else {
            // start at 1 because it may be equal to today
            $compare_date2 = $dates[0];
            for ($i = 1; $i < $count; $i++ ) {
                $compare_date = $compare_date2;
                $compare_date2 = $dates[$i];
                // if today is a match day then return 2 weeks around
                if ($compare_date2 === $today) {
                    if ($i < $count) {
                        $compare_date2 = $dates[$i+1];
                        break;
                    }
                    break;
                }
                if ($compare_date2 > $today) {
                    break;
                }
            }
        }
    }
    return "WHERE {$prefix}match_date BETWEEN '$compare_date' AND '$compare_date2'";
}
