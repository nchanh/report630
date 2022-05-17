console.log(`Code có gì cao siêu đâu mà xem -,-`);

// init
const BASE_DATE = "2022-01-01";
let reports = [];

// constructor
this.getLocalStorage();

// functions
function saveReport() {
  let report = this.getDataInForm();

  if (
    report.id === "" &&
    report.content === "" &&
    report.note === "" &&
    report.timeStart === "" &&
    report.timeEnd === ""
  ) {
    return;
  }

  this.updateOrSaveReport(report);
  console.log(reports);
}

function cancelReport() {}

function updateReport() {}

function deleteReport() {}

function getDataInForm() {
  return {
    id: document.getElementById("report-id").value,
    content: document.getElementById("report-content").value,
    note: (note = document.getElementById("report-note").value),
    timeStart: document.getElementById("report-time-start").value,
    timeEnd: document.getElementById("report-time-end").value,
    fullTimeVN: "-",
    fullTimeJP: "-",
    countMinutes: "-",
    countHours: "-",
  };
}

function calculatorReport(report) {
  if (report.timeStart !== "" || report.timeEnd !== "") {
    report.fullTimeVN =
      this.changeTimeJPToVN(report.timeStart) +
      " - " +
      this.changeTimeJPToVN(report.timeEnd);

    report.fullTimeJP = `${report.timeStart} - ${report.timeEnd}`;
  }

  if (report.timeStart !== "" && report.timeEnd !== "") {
    let beetweenStart = new Date(`${BASE_DATE} 14:00:00`);
    let beetweenEnd = new Date(`${BASE_DATE} 15:00:00`);
    let dateStart = new Date(`${BASE_DATE} ${report.timeStart}`);
    let dateEnd = new Date(`${BASE_DATE} ${report.timeEnd}`);
    let diffMinutes = parseInt((dateEnd - dateStart) / (1000 * 60), 10);

    if (
      (dateStart <= beetweenStart && dateEnd >= beetweenStart) ||
      (dateStart <= beetweenEnd && dateEnd >= beetweenEnd)
    ) {
      diffMinutes -= 60;
    }

    report.countMinutes = diffMinutes;
    report.countHours = Math.round((diffMinutes / 60) * 100) / 100;
  }

  return report;
}

function changeTimeJPToVN(time = "20:00") {
  if (time !== "") {
    let getDate = new Date(`${BASE_DATE} ${time}`);
    let hours = getDate.getHours() - 2;
    hours = hours < 10 ? "0" + hours : hours;
    let minutes = getDate.getMinutes();
    minutes = minutes < 10 ? "0" + minutes : minutes;

    return `${hours}:${minutes}`;
  }

  return "";
}

function updateOrSaveReport(report) {
  report = this.calculatorReport(report);

  if (report.id === "" || reports.length === 0) {
    report.id = reports.length + 1;
    reports.push(report);
  } else {
    const indexReport = reports.findIndex((r) => r.id === report.id);
    console.log(indexReport);
    reports[indexReport] = report;
  }

  this.setLocalStorage(reports);
}

function resetForm() {
  document.getElementById("report-id").value = "";
  document.getElementById("report-content").value = "";
  document.getElementById("report-note").value = "";
  document.getElementById("report-time-start").value = "";
  document.getElementById("report-time-end").value = "";
}

function setLocalStorage(data) {
  localStorage.setItem("data-reports", JSON.stringify(data));
}

function getLocalStorage() {
  let dataReports = JSON.parse(localStorage.getItem("data-reports"));
  if (dataReports) {
    reports = dataReports;
  }
}
