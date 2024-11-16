-- just count total Midlands games as they currently do tournaments without a specific home/away

select team,
(select count(*) from slc_fixture f where f.comp_id = 42 and (f.home = t.team OR f.away = t.team)
	AND (f.home_points IS NOT NULL OR f.result = '' OR f.result = 'Void')) AS games
from slc_table t where comp_id = 42
order by team;
