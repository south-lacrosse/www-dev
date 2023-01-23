-- -----------------------------------------------------
-- Useful queries
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Historical results in format for Fixtures Sheet, CSV format
-- -----------------------------------------------------
SELECT CONCAT(
	CASE WHEN c.type = 'cup' THEN CONCAT(c.name, ' ', SUBSTRING_INDEX(r.competition, ' ', -1))
		ELSE c.name END,',',
	r.match_date,',,',r.home,',',
	CASE WHEN r.result = 'R - R' THEN 'R'
        WHEN r.result = 'Void' THEN 'V'
        ELSE COALESCE(r.home_goals,'') END,',',
	CASE WHEN r.home_points IS NULL THEN  'v'
     when r.result = '10 - 0' or r.result = '0 - 10' THEN 'C'
     ELSE 'v' END,',',
	CASE WHEN r.result = 'R - R' THEN 'R'
        WHEN r.result = 'Void' THEN 'V'
        ELSE COALESCE(r.away_goals,'') END,',',
	r.away,',',
    CASE WHEN r.points_multi > 1 THEN r.points_multi ELSE '' END
    ) AS txt
FROM slh_result r, sl_competition c
WHERE r.year = 2003 AND	 c.id = r.comp_id
ORDER BY r.match_date, r.id;

-- -----------------------------------------------------
-- Alternative to the above query, but will display columns
-- -----------------------------------------------------

SELECT CASE WHEN c.type = 'cup' THEN CONCAT(c.name, ' ', SUBSTRING_INDEX(r.competition, ' ', -1))
	ELSE c.name END AS name,
	r.match_date,'' AS time,r.home,
	CASE WHEN r.result = 'R - R' THEN 'R'
        WHEN r.result = 'Void' THEN 'V'
        ELSE COALESCE(r.home_goals,'') END AS home_goals,
	CASE WHEN r.home_points IS NULL THEN  'v'
     when r.result = '10 - 0' or r.result = '0 - 10' THEN 'C'
     ELSE 'v' END AS v,
	CASE WHEN r.result = 'R - R' THEN 'R'
        WHEN r.result = 'Void' THEN 'V'
        ELSE COALESCE(r.away_goals,'') END  AS away_goals,
	r.away,
    CASE WHEN r.points_multi > 1 THEN r.points_multi ELSE '' END AS multi
FROM slh_result r, sl_competition c
WHERE r.year = 2003 AND	 c.id = r.comp_id
ORDER BY r.match_date, r.id;

-- -----------------------------------------------------
-- Historical results division info Fixtures sheet
-- -----------------------------------------------------
SELECT competition, group_concat(team) from (
	select competition, home as team
	from slh_result where year = 2003 and comp_id < 13
	union
	select competition, away as team
	from slh_result where year = 2003 and comp_id < 13
) AS a group by competition;


-- -----------------------------------------------------
-- Historical results Teams for Fixtures sheet
-- -----------------------------------------------------
SELECT a.team, a.team as club, lower(replace(a.team,' ','-')) AS club_page,
	'' AS pitch,
	COALESCE(tm.minimal,"") AS minimal, COALESCE(ta.abbrev,"") AS abbrev
FROM (
	select distinct home as team
	from slh_result where year = 2003
	order by team) AS a
LEFT JOIN sl_team_minimal AS tm
	ON tm.team = a.team
LEFT JOIN sl_team_abbrev AS ta
	ON ta.team = a.team
;

-- -----------------------------------------------------
-- Create tables from fixtures using SQL only
-- Note: this doesn't do form, or adjust promotion/relegation
-- for tied teams
-- -----------------------------------------------------
SELECT comp_id, team, won, drawn, lost, goals_for, goals_against,
    points - points_deducted as points,
    goal_average, points_deducted
FROM (SELECT cid AS comp_id, team
 , SUM(won) AS won
 , SUM(drawn) AS drawn
 , SUM(lost) AS lost
 , SUM(g_for) AS goals_for
 , SUM(g_against) AS goals_against
 , SUM(points) AS points
 , CASE
	WHEN SUM(g_against) > 0 THEN SUM(g_for) / SUM(g_against)
    ELSE 0
    END AS goal_average
 , IFNULL( (SELECT SUM(penalty) FROM slc_deduction d
		WHERE d.comp_id = t.cid AND d.team = t.team), 0) AS points_deducted
FROM
(SELECT comp_id AS cid
			,home AS team
			,SUM(home_goals * points_multi) AS g_for
			,SUM(away_goals * points_multi) AS g_against
			,SUM(home_points * points_multi) AS points
            ,SUM(CASE
                WHEN home_goals IS NOT NULL AND home_goals > away_goals THEN points_multi
                ELSE 0
			END) AS won
            ,SUM(CASE
                WHEN home_goals IS NOT NULL AND home_goals = away_goals THEN points_multi
                ELSE 0
			END) AS drawn
            ,SUM(CASE
                WHEN home_goals IS NOT NULL AND home_goals < away_goals THEN points_multi
                ELSE 0
			END) AS lost
		FROM slc_fixture
        WHERE home_points IS NOT NULL
		GROUP BY comp_id, team
 UNION ALL
		SELECT comp_id AS cid
			,away AS team
			,SUM(away_goals * points_multi) AS g_for
			,SUM(home_goals * points_multi) AS g_against
			,SUM(away_points * points_multi) AS points
            ,SUM(CASE
                WHEN home_goals IS NOT NULL AND home_goals < away_goals THEN points_multi
                ELSE 0
			END) AS won
            ,SUM(CASE
                WHEN home_goals IS NOT NULL AND home_goals = away_goals THEN points_multi
                ELSE 0
			END) AS drawn
            ,SUM(CASE
                WHEN home_goals IS NOT NULL AND home_goals > away_goals THEN points_multi
                ELSE 0
			END) AS lost
		FROM slc_fixture
        WHERE away_points IS NOT NULL
		GROUP BY comp_id, team
	) t GROUP BY cid, team
 ) a

ORDER BY comp_id, points DESC, goal_average DESC, team;

-- -----------------------------------------------------
-- Create tables from historic results using SQL only
-- Same as above, except uses results tables. Note:
-- won't include deducted points
-- -----------------------------------------------------
SELECT comp_id, team, won, drawn, lost, goals_for, goals_against,
    points,
    goal_average
FROM (SELECT cid AS comp_id, team
 , SUM(won) AS won
 , SUM(drawn) AS drawn
 , SUM(lost) AS lost
 , SUM(g_for) AS goals_for
 , SUM(g_against) AS goals_against
 , SUM(points) AS points
 , CASE
	WHEN SUM(g_against) > 0 THEN SUM(g_for) / SUM(g_against)
    ELSE 0
    END AS goal_average
 FROM
(SELECT comp_id AS cid
			,home AS team
			,SUM(home_goals * points_multi) AS g_for
			,SUM(away_goals * points_multi) AS g_against
			,SUM(home_points * points_multi) AS points
            ,SUM(CASE
                WHEN home_goals IS NOT NULL AND home_goals > away_goals THEN points_multi
                ELSE 0
			END) AS won
            ,SUM(CASE
                WHEN home_goals IS NOT NULL AND home_goals = away_goals THEN points_multi
                ELSE 0
			END) AS drawn
            ,SUM(CASE
                WHEN home_goals IS NOT NULL AND home_goals < away_goals THEN points_multi
                ELSE 0
			END) AS lost
		FROM slh_result
        WHERE home_points IS NOT NULL AND comp_id = 25 AND year=2015
		GROUP BY comp_id, team
 UNION ALL
		SELECT comp_id AS cid
			,away AS team
			,SUM(away_goals * points_multi) AS g_for
			,SUM(home_goals * points_multi) AS g_against
			,SUM(away_points * points_multi) AS points
            ,SUM(CASE
                WHEN home_goals IS NOT NULL AND home_goals < away_goals THEN points_multi
                ELSE 0
			END) AS won
            ,SUM(CASE
                WHEN home_goals IS NOT NULL AND home_goals = away_goals THEN points_multi
                ELSE 0
			END) AS drawn
            ,SUM(CASE
                WHEN home_goals IS NOT NULL AND home_goals > away_goals THEN points_multi
                ELSE 0
			END) AS lost
		FROM slh_result
        WHERE away_points IS NOT NULL AND comp_id = 25 AND year=2015
		GROUP BY comp_id, team
	) t GROUP BY cid, team
 ) a

ORDER BY comp_id, points DESC, goal_average DESC, team;
