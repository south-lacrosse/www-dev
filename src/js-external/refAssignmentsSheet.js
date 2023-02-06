/**
 * Code used in Google Sheet "SEMLA Referee Assignments"
 *
 * Ensure this is also stored in the Git repository, as I don't know how
 *  Google keeps track of these things, and I don't want to lose it!
 */
function onOpen() {
  SpreadsheetApp.getActive().addMenu('Fixtures', [
    {name: 'Remove empty rows/columns on current sheet', functionName: 'removeCurrent'},
    {name: 'Remove empty rows/columns on all sheets', functionName: 'removeAll'}
  ]);
}

function removeCurrent() {
  removeEmptyRowsColumns(SpreadsheetApp.getActiveSheet());
}

function removeAll() {
  var ss = SpreadsheetApp.getActive();
  var allsheets = ss.getSheets();
  for (var s in allsheets) {
    removeEmptyRowsColumns(allsheets[s]);
  }
}

function removeEmptyRowsColumns(sheet) {
  var lastRow = sheet.getLastRow();
  var maxRow = sheet.getMaxRows();
  if (lastRow < maxRow) {
    sheet.deleteRows(lastRow+1, maxRow-lastRow);
  }
  var lastCol = sheet.getLastColumn();
  var maxCol = sheet.getMaxColumns();
  if (lastCol < maxCol) {
    sheet.deleteColumns(lastCol+1, maxCol-lastCol);
  }
}