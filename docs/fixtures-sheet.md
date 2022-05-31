# Fixtures Sheet Instructions

See also [Fixtures Sheet Format](fixtures-sheet-format.md).

* **Once the fixtures are published never delete a row**. Games must have a score, be conceded, rearranged/postponed, cancelled, abandoned, or void. This avoids all confusion.
* Enter flags scores on the Flags sheet only. It is set up so that scores get copied from the Flags to the Fixtures sheet, so that saves you entering it twice, and minimises mistakes.

    Also make sure you copy the winning team to the next round on the Flags sheet. This will also automatically copy the team into the next round on the Fixtures sheet. You might want to check if you need a different date/time on the Fixtures sheet if you know the home team usually has a different start time.
* For conceded matches enter the score as 10-0 to the winner, and replace the "v" with "C", or "C24" if the game was conceded within 24 hours (a 1 point penalty).
* If teams switch venues then:

    If they have swapped home and away fixtures then both games are rearranged, so for both fixtures copy the row down and reverse the teams, mark the originals as "R v R", and put "Switch H/A" in the Notes column. That way the home/away fixture dates are correct on the website fixtures grid. Also make sure you change the Venue column if needed (or just make it blank).

    If the fixture is just being played at the opposition's venue (i.e. for unavailable home pitch), and the reverse fixture isn't being swapped too, then just change the Venue column. That way the fixture still counts as the original home/away game on the fixtures grid page.
* If you otherwise rearrange a game:

    If you know the new date then then copy the row to the new fixture date (making sure you change the Date) and add "Rearranged from {old date}" in the Notes column, then mark the old fixture as "R v R" and add "Rearranged to {new date}" in the Notes column.

    For flags matches it is especially important to copy before adding "R v R" as the goals columns will have formulas to copy the result from the Flags sheet, so if you delete those before copying then the result won't be copied to the rearranged match from the Flags sheet. DO NOT enter R-R as the result on the Flags sheet, as that will get copied into the Fixtures sheet for the new game date - so then both fixtures will be marked as "R v R"!

    If you don't know the new date then add "Rearranged to TBC" in the Notes column, as this means you can always search for TBC to find any outstanding rearrangements.

    Then for flags games you want to keep the formulas that copy goals form the Flags sheet (as noted above) so copy the row down, delete the "v" in the v/C/C24 column (which means the row will be ignored on the website) and add suitable Notes to the copy, e.g. "when rearranged put v back in + new date". That way when the game is rearranged you can move this row to the new date, making sure to add the new date and put the "v" back.

    For non-flags games just mark the fixture as "R v R".
* If rather than rearranging a game teams decide to play the reverse fixture for double points then enter "R v R" on the rearranged fixture, and add "Double points on {new date}"  to the Notes column. For the double points game enter "Double points from {from date}" in the Notes column. This should automatically put 2 in the X column, but check just to make sure.
* If a team doubles up a league and flags match then don't combine on one row - put the 2 fixtures down, as they are different competitions. The same goes for matches in different leagues, as the results need to be fed into the tables for each league. Also make sure the X column is empty otherwise the results count double!
* If a league match is void mark it as "V v V", and if a friendly is cancelled mark it as "C v C".

    Note: void matches are not rearranged, and count as zero points for both teams.

    If a team defaults a flags match then it should be marked as 1-0 on the Flags sheet, and the winners moved to the next round. There is generally no reason to mark it void.
* If a match is abandoned (i.e. it started but was unable to be completed) then mark it as "A v A". Abandoned matches may or may not be rearranged.

## Examples

<table>
    <thead>
        <tr>
            <th>Competition</th><th>Date</th><th>Time</th><th>Home</th>
            <th align="center">HG</th><th align="center">v</th>
            <th align="center">AG</th><th>Away</th><th>X</th>
            <th>Notes</th><th>Venue</th>
        </tr>
    </thead>
    <tbody>
        <tr><th colspan="11" align="left">Normal result</th></tr>
        <tr><td>SEMLA Premier Division</td><td>22/09/2018</td><td>2:30 pm</td><td>Hampstead</td><td align="center">21</td><td align="center">v</td><td align="center">3</td><td>Reading</td><td><td><td></td></tr>
        <tr><th colspan="11" align="left">Rearranged by clubs (don't forget to add a fixture on the rearranged date if known, and put it in the right order)</th></tr>
        <tr><td>SEMLA Premier Division</td><td>22/09/2018</td><td>2:30 pm</td><td>Hampstead</td><td align="center">R</td><td align="center">v</td><td align="center">R</td><td>Reading</td><td></td><td>To 5/1</td><td></td></tr>
        <tr><td colspan="11">...</td></tr>
        <tr><td>SEMLA Premier Division</td><td>05/01/2019</td><td>2:30 pm</td><td>Hampstead</td><td></td><td align="center">v</td><td></td><td>Reading</td><td></td><td>From 22/9</td><td></td></tr>
        <tr><th colspan="11" align="left">Rearranged to double header - make sure the reverse fixture has a 2 in the X column</th></tr>
        <tr><td>SEMLA Premier Division</td><td>22/09/2018</td><td>2:30 pm</td><td>Hampstead</td><td align="center">R</td><td align="center">v</td><td align="center">R</td><td>Reading</td><td></td><td>Rearranged to 5/1 double header</td><td></td></tr>
        <tr><td colspan="11">...</td></tr>
        <tr><td>SEMLA Premier Division</td><td>05/01/2019</td><td></td><td>Reading</td><td></td><td align="center">v</td><td></td><td>Hampstead</td><td align="center">2</td><td>Rearranged from 22/9, double header</td><td></td></tr>
        <tr><th colspan="11" align="left">Rearranged to double header - different league. Add a new reverse fixture for the other league, and (MAKE SURE X column is empty.</th></tr>
        <tr><td>SEMLA Division 2</td><td>22/09/2018</td><td></td><td>Spencer 3</td><td align="center">R</td><td align="center">v</td><td align="center">R</td><td>Hillcroft B</td><td></td><td>Double header from 17/11</td><td></td></tr>
        <tr><td colspan="11">...</td></tr>
        <tr><td>SEMLA Division 2</td><td>17/11/2018</td><td></td><td>Spencer 3</td><td></td><td align="center">v</td><td></td><td>Hillcroft B</td><td></td><td>Double header with Local League</td><td></td></tr>
        <tr><td>London Local Division 2</td><td>17/11/2018</td><td></td><td>Spencer 3</td><td></td><td align="center">v</td><td></td><td>Hillcroft B</td><td></td><td>Double header with Regional League</td><td></td></tr>
        <tr><th colspan="11" align="left">Swap home & away teams - add rearranged row for each fixture</th></tr>
        <tr><td>SEMLA Premier Division</td><td>22/09/2018</td><td>2:30 pm</td><td>Hampstead</td><td align="center">R</td><td align="center">v</td><td align="center">R</td><td>Reading</td><td></td><td>Switch H/A</td><td></td></tr>
        <tr><td>SEMLA Premier Division</td><td>22/09/2018</td><td></td><td>Reading</td><td></td><td align="center">v</td><td></td><td>Hampstead</td><td></td><td>Switch H/A</td><td></td></tr>
        <tr><td colspan="11">...</td></tr>
        <tr><td>SEMLA Premier Division</td><td>05/01/2019</td><td></td><td>Reading</td><td align="center">R</td><td align="center">v</td><td align="center">R</td><td>Hampstead</td><td></td><td>Switch H/A</td><td></td></tr>
        <tr><td>SEMLA Premier Division</td><td>05/01/2019</td><td>2:30 pm</td><td>Hampstead</td><td></td><td align="center">v</td><td></td><td>Reading</td><td></td><td>Switch H/A</td><td></td></tr>
        <tr><th colspan="11" align="left">Venue swapped, so Venue column changed - but reverse game stays the same</th></tr>
        <tr><td>SEMLA Premier Division</td><td>22/09/2018</td><td>2:30 pm</td><td>Hampstead</td><td align="center">10</td><td align="center">v</td><td align="center">7</td><td>Reading</td><td></td><td></td><td></td></tr>
        <tr><td colspan="11">...</td></tr>
        <tr><td>SEMLA Premier Division</td><td>22/09/2018</td><td></td><td>Reading</td><td></td><td align="center">v</td><td></td><td>Hampstead</td><td></td><td>Played at Hampstead</td><td>Hampstead</td></tr>
        <tr><th colspan="11" align="left">Postponed (e.g. rearranged because of weather etc)</th></tr>
        <tr><td>SEMLA Premier Division</td><td>22/09/2018</td><td>2:30 pm</td><td>Hampstead</td><td align="center">R</td><td align="center">v</td><td align="center">R</td><td>Reading</td><td></td><td>Postponed - waterlogged pitch, date TBD</td><td></td></tr>
        <tr><th colspan="11" align="left">Conceded, put 10-0 to winning team</th></tr>
        <tr><td>SEMLA Premier Division</td><td>22/09/2018</td><td>2:30 pm</td><td>Hampstead</td><td align="center">10</td><td align="center">C</td><td align="center">0</td><td>Reading</td><td></td><td></td><td></td></tr>
        <tr><th colspan="11" align="left">Conceded within 24 hours</th></tr>
        <tr><td>SEMLA Premier Division</td><td>22/09/2018</td><td>2:30 pm</td><td>Hampstead</td><td align="center">10</td><td>C24</td><td align="center">0</td><td>Reading</td><td></td><td></td><td></td></tr>
        <tr><th colspan="11" align="left">Abandoned - the match started, and was halted. The game may or may not be rearranged to a new date</th></tr>
        <tr><td>SEMLA Premier Division</td><td>22/09/2018</td><td>2:30 pm</td><td>Hampstead</td><td align="center">A</td><td align="center">v</td><td align="center">A</td><td>Reading</td><td></td><td>Abandoned, rearranged to 18/1</td><td></td></tr>
        <tr><td colspan="11">...</td></tr>
        <tr><td>SEMLA Premier Division</td><td>05/01/2019</td><td>2:30 pm</td><td>Hampstead</td><td></td><td align="center">v</td><td></td><td>Reading</td><td></td><td>Rearranged from 22/9</td><td></td></tr>
    </tbody>
</table>
