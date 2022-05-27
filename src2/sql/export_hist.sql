-- -----------------------------------------------------
-- Useful queries to export history
-- I just run these in MySql Workbench and export as csv
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Team summary
-- -----------------------------------------------------
SELECT team,
   	SUM(won) AS won, SUM(drawn) AS drawn, SUM(lost) AS lost,
	SUM(goals_for) AS goals_for, SUM(goals_against) AS goals_against,
    SUM(points) as points, SUM(points_deducted) as points_deducted,
	SUM(flags_won) AS flags_won, SUM(flags_lost) AS flags_lost,
	SUM(flags_goals_for) AS flags_goals_for, SUM(flags_goals_against) AS flags_goals_against
FROM (
        SELECT team,
         	SUM(won) AS won, SUM(drawn) AS drawn, SUM(lost) AS lost,
         	SUM(goals_for) AS goals_for, SUM(goals_against) as goals_against,
         	SUM(points) as points, SUM(points_deducted) as points_deducted,
			0 AS flags_won, 0 AS flags_lost,
			0 AS flags_goals_for, 0 AS flags_goals_against
		FROM slh_table
        WHERE comp_id <> 75 -- ??? This should be the Junior Lacrosse competition
    	GROUP BY team

	UNION ALL

		SELECT team1 AS team,
            0 AS won, 0 AS drawn, 0 AS lost,
            0 AS goals_for, 0 as goals_against,
            0 as points, 0 as points_deducted,
			SUM(CASE WHEN team1_goals > team2_goals THEN 1 ELSE 0 END) AS flags_won,
			SUM(CASE WHEN team1_goals < team2_goals THEN 1 ELSE 0 END) AS flags_lost,
			SUM(team1_goals) AS flags_goals_for,
			SUM(team2_goals) AS flags_goals_against
		FROM slh_cup_draw
		WHERE team1_goals IS NOT NULL
		 AND team1 NOT LIKE '%W/D%' AND team2 NOT LIKE '%W/D%'
		GROUP BY team1

	UNION ALL

		SELECT team2 AS team,
            0 AS won, 0 AS drawn, 0 AS lost,
            0 AS goals_for, 0 as goals_against,
            0 as points, 0 as points_deducted,
			SUM(CASE WHEN team1_goals < team2_goals THEN 1 ELSE 0 END) AS flags_won,
			SUM(CASE WHEN team1_goals > team2_goals THEN 1 ELSE 0 END) AS flags_lost,
			SUM(team2_goals) AS flags_goals_for,
			SUM(team1_goals) AS flags_goals_against
		FROM slh_cup_draw
		WHERE team1_goals IS NOT NULL
		 AND team1 NOT LIKE '%W/D%' AND team2 NOT LIKE '%W/D%'
		GROUP BY team2

) AS x
GROUP BY team
ORDER BY team;

-- -----------------------------------------------------
-- League tables
-- -----------------------------------------------------
SELECT `year`, `name`, `position`, `team`, `played`, `won`, `drawn`, `lost`,
 `goals_for`, `goals_against`, `points_deducted`, `points`
FROM `slh_table` as ht, sl_competition as c
WHERE c.id = ht.comp_id
AND c.name <> 'Junior Lacrosse'
ORDER BY year, ht.comp_id, position;

-- -----------------------------------------------------
-- Flags wins/loses
-- -----------------------------------------------------
SELECT `year`, `name`, `team`, `won`, `lost`, `goals_for`, `goals_against`
FROM slh_cup_wins AS hcw, sl_competition as c
WHERE c.id = hcw.comp_id;

SELECT year, name, team,
	SUM(won) AS won,
	SUM(lost) AS lost,
	SUM(goals_for) AS goals_for,
	SUM(goals_against) AS goals_against
FROM (
		SELECT year, comp_id, team1 AS team,
			SUM(CASE WHEN team1_goals > team2_goals THEN 1 ELSE 0 END) AS won,
			SUM(CASE WHEN team1_goals < team2_goals THEN 1 ELSE 0 END) AS lost,
			SUM(team1_goals) AS goals_for,
			SUM(team2_goals) AS goals_against
		FROM slh_cup_draw
		WHERE team1_goals IS NOT NULL
		 AND team1 NOT LIKE '%W/D%' AND team2 NOT LIKE '%W/D%'
		GROUP BY year, comp_id, team1

	UNION ALL

		SELECT year, comp_id, team2 AS team,
			SUM(CASE WHEN team1_goals < team2_goals THEN 1 ELSE 0 END) AS won,
			SUM(CASE WHEN team1_goals > team2_goals THEN 1 ELSE 0 END) AS lost,
			SUM(team2_goals) AS goals_for,
			SUM(team1_goals) AS goals_against
		FROM slh_cup_draw
		WHERE team1_goals IS NOT NULL
		 AND team1 NOT LIKE '%W/D%' AND team2 NOT LIKE '%W/D%'
		GROUP BY year, comp_id, team2

) AS t1, sl_competition AS c
WHERE c.id = t1.comp_id
GROUP BY year, name, team
ORDER BY year, comp_id, team;
