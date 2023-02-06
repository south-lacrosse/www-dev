-- -----------------------------------------------------
-- Extra tables for historical tables/flags/results
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Table hist_cup_year
-- -----------------------------------------------------
DROP TABLE IF EXISTS `slh_cup_year`;
CREATE TABLE IF NOT EXISTS `slh_cup_year` (
  `group_id` SMALLINT NOT NULL,
  `year` SMALLINT NOT NULL,
  `max_rounds` TINYINT unsigned NOT NULL,
  PRIMARY KEY (`group_id`,`year`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
INSERT INTO `slh_cup_year`
SELECT c.group_id, a.year, MAX(a.max_rounds)
  FROM
  (SELECT cd.year, cd.comp_id, MAX(cd.round) AS max_rounds
    FROM slh_cup_draw AS cd
    GROUP BY cd.year, cd.comp_id) AS a
    , sl_competition c
  WHERE c.id = a.comp_id
  GROUP BY c.group_id, a.year
  ORDER BY c.group_id, a.year;

-- -----------------------------------------------------
-- Table hist_league_year
-- -----------------------------------------------------
DROP TABLE IF EXISTS `slh_league_year`;
CREATE TABLE IF NOT EXISTS `slh_league_year` (
  `league_id` SMALLINT NOT NULL,
  `year` SMALLINT NOT NULL,
  PRIMARY KEY (`league_id`,`year`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
INSERT INTO `slh_league_year` (`league_id`, `year`)
  SELECT DISTINCT c.group_id, t.year
  FROM (SELECT DISTINCT comp_id, year FROM slh_table) AS t,
    sl_competition AS c
  WHERE c.id = t.comp_id
  ORDER BY c.group_id, t.year;
  
-- -----------------------------------------------------
-- Table hist_competition_result
-- -----------------------------------------------------
-- DROP TABLE IF EXISTS `slh_competition_result`;
-- CREATE TABLE IF NOT EXISTS `slh_competition_result` (
--   `year` SMALLINT NOT NULL,
--   `comp_id` INT NOT NULL,
--   `result_id` INT NOT NULL,
--   PRIMARY KEY (`year`, `comp_id`, `result_id`),
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
-- INSERT INTO `slh_competition_fixture` (`year`, `comp_id`, `result_id`)
--   SELECT * FROM
--     (SELECT year,comp_id AS cid, id FROM slh_result
--       WHERE comp_id <> 0
--     UNION ALL
--     SELECT year, comp_id2 AS cid, id FROM slh_result
--       WHERE comp_id2 <> 0
--     ORDER BY year,cid,id) a;
