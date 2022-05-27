-- Move dividers up 1 row in history tables
-- This makes dividers be AFTER the row, and not before

-- This code was saved in case we want to do the reverse, which would 
-- also require changes to the current fixtures import to handle the
-- change, as well as styles.css.

DROP TABLE IF EXISTS backup_hist_table;
CREATE TABLE backup_hist_table LIKE slh_table;
INSERT INTO backup_hist_table SELECT * FROM slh_table;

UPDATE slh_table
SET divider = 0;

UPDATE slh_table ht
INNER JOIN backup_hist_table bt
ON ht.year = bt.year AND ht.comp_id = bt.comp_id AND ht.position = bt.position - 1 -- +1 to move down
SET ht.divider = 1
WHERE bt.divider = 1;
