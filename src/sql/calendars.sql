-- Queries for calendars

-- sl_calendar_team rows with team="REMOVED" are for calendars that are being
-- requested, but no longer exist. We then serve a calendar with weekly
-- reminders to unsubscribe. Once these requests stop the row can safely be
-- deleted.

-- Find teams in sl_calendar_team that have not been accessed since the log
-- table was cleared. These rows can be safely deleted.
SELECT alias FROM sl_calendar_team t
WHERE t.team = 'REMOVED'
AND NOT EXISTS (SELECT * FROM sl_calendar_log l WHERE l.team = t.alias);

-- Delete rows as above
DELETE t FROM sl_calendar_team t
WHERE t.team = 'REMOVED'
AND NOT EXISTS (SELECT * FROM sl_calendar_log l WHERE l.team = t.alias);

-- Get log info for all removed teams and their log information. Calendars with
-- a last access date a while ago can be deleted.
SELECT * FROM sl_calendar_team t
LEFT JOIN  sl_calendar_log l
ON l.team = t.alias
WHERE t.team = 'REMOVED';

-- Delete removed teams from sl_calendar_team that have not been accessed for
-- 2 months
DELETE t FROM sl_calendar_team t
WHERE t.team = 'REMOVED'
AND (NOT EXISTS (SELECT * FROM sl_calendar_log l WHERE l.team = t.alias)
	OR EXISTS (SELECT * FROM sl_calendar_log l WHERE l.team = t.alias
		AND last_access < DATE_SUB(NOW(), INTERVAL 2 MONTH))
);


--- You can safely empty the table with
TRUNCATE TABLE sl_calendar_log;

SELECT * FROM sl_calendar_team WHERE team="REMOVED";
