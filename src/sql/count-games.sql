-- Count the number of games for each team in a league, will list home/away/total
-- Useful to run at the start of a season to make sure everything is OK

-- By default creates a tsv file (won't overwrite). To run normally comment out
-- the lines below "INTO OUTFILE"

SELECT name, team, home_games, away_games, home_games + away_games AS total_games FROM (
SELECT team, name,
(SELECT count(*) FROM slc_fixture f
	WHERE f.comp_id = t.comp_id AND f.home = t.team
	AND (f.home_points IS NOT NULL OR f.result = '' OR f.result = 'Void')) AS home_games,
(SELECT count(*) FROM slc_fixture f
	WHERE f.comp_id = t.comp_id AND f.away = t.team
	AND (f.home_points IS NOT NULL OR f.result = '' OR f.result = 'Void')) AS away_games
FROM slc_table t, sl_competition c
WHERE c.id = t.comp_id) as a
ORDER BY name, team
INTO OUTFILE '~/games.tsv'
-- INTO OUTFILE '~/games.csv'  -- next 3 lines for .csv
-- FIELDS TERMINATED BY ','
-- OPTIONALLY ENCLOSED BY '"'
LINES TERMINATED BY '\n'
--  LINES TERMINATED BY '\r\n' -- for windows
;
