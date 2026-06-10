// Hyperion Elite Systems — Lead Capture + Email Notification
//
// DEPLOY (one-time, in browser, while logged in as jrarkell@gmail.com):
//   1. Go to https://sheets.new — create a blank Google Sheet, name it
//      "Hyperion Leads" (or whatever).
//   2. Extensions → Apps Script. Replace the default Code.gs contents
//      with this file. Save (Ctrl+S). Name the project "Hyperion Lead Capture".
//   3. Click Deploy → New deployment → gear icon → Web app.
//      - Description: anything
//      - Execute as: Me (jrarkell@gmail.com)
//      - Who has access: Anyone
//      Click Deploy. Authorize when prompted (Mail + Sheets scopes).
//      Copy the resulting "/exec" URL. That URL goes in the frontend.
//
// Optional Script Properties (Project Settings → Script Properties):
//   NOTIFY_EMAIL — destination inbox. Defaults below if unset.

var SHEET_NAME = "Hyperion Leads";
var NOTIFY_EMAIL_DEFAULT = "jrarkell@gmail.com";

function doPost(e) {
  var data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (parseErr) {
    return jsonOut({ ok: false, error: "invalid_json" });
  }

  // Try to log to Sheet — best-effort, non-fatal if unbound.
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (ss) {
      var sheet = ss.getSheetByName(SHEET_NAME);
      if (!sheet) {
        sheet = ss.insertSheet(SHEET_NAME);
        sheet.appendRow([
          "Submitted At", "Name", "Email", "Phone",
          "ZIP", "Preferred Time", "Water Test Requested"
        ]);
        sheet.setFrozenRows(1);
      }
      sheet.appendRow([
        new Date().toISOString(),
        data.name || "",
        data.email || "",
        data.phone || "",
        data.zipCode || "",
        data.time || "",
        data.waterTest ? "Yes" : "No"
      ]);
    }
  } catch (sheetErr) {
    Logger.log("Sheet append failed (continuing to email): " + sheetErr.toString());
  }

  // Email the lead — this is the critical path.
  var notifyEmail =
    PropertiesService.getScriptProperties().getProperty("NOTIFY_EMAIL") ||
    NOTIFY_EMAIL_DEFAULT;

  try {
    MailApp.sendEmail(
      notifyEmail,
      "New Hyperion Lead: " + (data.name || "(no name)"),
      "New lead submitted from the Hyperion Elite Systems site.\n\n" +
      "Name:           " + (data.name || "(blank)") + "\n" +
      "Email:          " + (data.email || "(blank)") + "\n" +
      "Phone:          " + (data.phone || "(blank)") + "\n" +
      "ZIP:            " + (data.zipCode || "(blank)") + "\n" +
      "Preferred Time: " + (data.time || "(blank)") + "\n" +
      "Water Test:     " + (data.waterTest ? "Yes — also wants free in-home test" : "No") + "\n\n" +
      "Submitted: " + new Date().toISOString() + "\n"
    );
  } catch (mailErr) {
    Logger.log("Email send failed: " + mailErr.toString());
    return jsonOut({ ok: false, error: "email_failed" });
  }

  return jsonOut({ ok: true });
}

// Browser-pingable health check.
function doGet() {
  return jsonOut({ status: "alive", target: SHEET_NAME });
}

function jsonOut(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
