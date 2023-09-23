-- Date/club/team where clubs have > 1 team at home
SELECT DISTINCT a.match_date, a_t.club, a.home
FROM slc_fixture a, slc_fixture b, slc_team a_t, slc_team b_t
WHERE a.match_date = b.match_date
AND a.competition <> 'L-Mid' AND a.competition <> 'Friendly'
AND a.home <> b.home
AND a_t.name = a.home
AND b_t.name = b.home
AND a_t.club = b_t.club
ORDER BY a.match_date, a_t.club, a.home;

-- Find fixtures where 2 teams are at home for the same date. Useful for clubs
-- that are ground sharing and we need to adjust times.

SELECT a.match_date, a.home, a.away, a.competition, b.home, b.away, b.competition
FROM slc_fixture a, slc_fixture b
WHERE a.match_date = b.match_date
AND a.home = 'Hampstead'
AND b.home = 'Purley Raptors';