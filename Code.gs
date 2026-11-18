var ANSWER = "Blue";

function doGet() {
  return HtmlService.createHtmlOutputFromFile("index")
    .setTitle("Which cell fails first?")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function saveTrials(trials) {
  if (!Array.isArray(trials) || trials.length !== 2) {
    throw new Error("expected two trials");
  }
  var seen = {};
  var hits = 0;
  var row = [new Date()];
  for (var i = 0; i < 2; i++) {
    var t = trials[i] || {};
    if (seen[t.chart] || (t.chart !== "overlay" && t.chart !== "multiples")) {
      throw new Error("bad chart");
    }
    if (["Red", "Blue", "Green", "Orange"].indexOf(t.choice) < 0) {
      throw new Error("bad choice");
    }
    var ms = Number(t.ms);
    if (!isFinite(ms) || ms < 0 || ms > 600000) {
      throw new Error("bad time");
    }
    seen[t.chart] = true;
    if (t.choice === ANSWER) hits++;
    row.push(t.chart, t.choice, Math.round(ms));
  }
  sheet_().appendRow(row);
  return hits;
}

function sheet_() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty("SHEET_ID");
  var ss;
  if (id) {
    ss = SpreadsheetApp.openById(id);
  } else {
    ss = SpreadsheetApp.create("CS6630 chart quiz responses");
    props.setProperty("SHEET_ID", ss.getId());
    ss.getSheets()[0].appendRow([
      "submitted_at", "chart_1", "choice_1", "ms_1", "chart_2", "choice_2", "ms_2"
    ]);
  }
  return ss.getSheets()[0];
}
