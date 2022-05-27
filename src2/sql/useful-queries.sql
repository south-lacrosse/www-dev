-- -----------------------------------------------------
-- Useful queries - kept in case they are useful
-- -----------------------------------------------------

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