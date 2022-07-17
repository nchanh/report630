console.log(`Code có gì cao siêu đâu mà xem -,-`);

// init
const BASE_DATE = "2022-01-01";
let reports = [];

// constructor
this.getBackgroudLS();
this.getLocalStorage();
if (reports.length > 0) {
  this.printDataReports();
}
this.changeNaneButtonSave();
this.getCurrentTime();

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
}

function cancelReport() {
  this.resetForm();
  this.changeNaneButtonSave();
}

function updateReport(id) {
  const indexReport = reports.findIndex((r) => r.id === id);
  const report = reports[indexReport];
  this.setFormReport(
    report.id,
    report.content,
    report.note,
    report.timeStart,
    report.timeEnd,
    report.hours
  );
  this.changeNaneButtonSave(false);
}

function deleteReport(id) {
  if (window.confirm("Yes or no?")) {
    const indexReport = reports.findIndex((r) => r.id === id);
    reports.splice(indexReport, 1);
    this.setLocalStorage(reports);
    this.printDataReports();
  }
}

function getDataInForm() {
  return {
    id: document.getElementById("report-id").value,
    content: document.getElementById("report-content").value,
    note: (note = document.getElementById("report-note").value),
    timeStart: document.getElementById("report-time-start").value,
    timeEnd: document.getElementById("report-time-end").value,
    hours: document.getElementById("report-hours").value,
    fullTimeVN: "-",
    fullTimeJP: "-",
    countMinutes: "-",
    countHours: "-",
    countHoursMinutes: "-",
  };
}

function calculatorReport(report) {
  const hourInput = document.getElementById("report-hours").value;

  if ((report.timeStart !== "" || report.timeEnd !== "") && !hourInput) {
    report.fullTimeVN =
      this.changeTimeJPToVN(report.timeStart) +
      " - " +
      this.changeTimeJPToVN(report.timeEnd) +
      " VN";

    report.fullTimeJP = `${report.timeStart} - ${report.timeEnd} JP`;
  }

  if (hourInput) {
    report.countHours = hourInput + "h";
    report.countHoursMinutes = "";
  } else if (report.timeStart !== "" && report.timeEnd !== "") {
    let beetweenStart = new Date(`${BASE_DATE} 14:00:00`);
    let beetweenEnd = new Date(`${BASE_DATE} 15:00:00`);
    let dateStart = new Date(`${BASE_DATE} ${report.timeStart}`);
    let dateEnd = new Date(`${BASE_DATE} ${report.timeEnd}`);
    let diffMinutes = parseInt((dateEnd - dateStart) / (1000 * 60), 10);

    if (
      (dateStart < beetweenStart && dateEnd > beetweenStart) ||
      (dateStart < beetweenEnd && dateEnd > beetweenEnd)
    ) {
      diffMinutes -= 60;
    }

    report.countMinutes = diffMinutes + "m";
    report.countHours = Math.round((diffMinutes / 60) * 100) / 100 + "h";

    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    report.countHoursMinutes =
      (diffMinutes % 60 === 0 || hours === 0 ? "-" : hours + "h") +
      (diffMinutes % 60 === 0 || hours === 0 ? "" : minutes + "m");
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
    report.id = this.makeId();
    reports.push(report);
  } else {
    const indexReport = reports.findIndex((r) => r.id === report.id);
    reports[indexReport] = report;
  }

  this.setLocalStorage(reports);
  this.resetForm();
  this.printDataReports();
}

function setFormReport(
  id = "",
  content = "",
  note = "",
  timeStart = "",
  timeEnd = "",
  hours = ""
) {
  document.getElementById("report-id").value = id;
  document.getElementById("report-content").value = content;
  document.getElementById("report-note").value = note;
  document.getElementById("report-time-start").value = timeStart;
  document.getElementById("report-time-end").value = timeEnd;
  document.getElementById("report-hours").value = hours;
}

function resetForm() {
  this.setFormReport();
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

function resetDataReports() {
  if (window.confirm("Yes or no?")) {
    reports = [];
    this.setLocalStorage(reports);
    this.printDataReports();
  }
}

function printDataReports() {
  let printReports = document.getElementById("print-reports");
  if (printReports) {
    printReports.innerHTML = "";    
  }

  reports.forEach((report, i) => {
    printReports.innerHTML += `<tr>
          <td scope="row" class="text-center">${i + 1}</td>
          <td class="table-content" id="table-content-${
            report.id
          }" onclick="copyText('${report.content}', 'table-content-${
      report.id
    }')">${report.content}</td>
          <td class="table-note" id="table-note-${
            report.id
          }" onclick="copyText('${report.note}', 'table-note-${report.id}')">${
      report.note
    }</td>
          <td class="text-center">
            <span id="table-fullTimeVN-${report.id}" onclick="copyText('${
      report.fullTimeVN
    }', 'table-fullTimeVN-${report.id}')">${report.fullTimeVN}</span> <br/>
            <span id="table-fullTimeJP-${report.id}" onclick="copyText('${
      report.fullTimeJP
    }', 'table-fullTimeJP-${report.id}')">${report.fullTimeJP}</span>
          </td>
          <td class="text-center" id="table-countMinutes-${
            report.id
          }" onclick="copyText('${report.countMinutes}', 'table-countMinutes-${
      report.id
    }')">${report.countMinutes}</td>
          <td class="text-center">
            <span id="table-countHours-${report.id}" onclick="copyText('${
      report.countHours
    }', 'table-countHours-${report.id}')">${report.countHours}</span> <br/>
            <span id="table-countHoursMinutes-${
              report.id
            }" onclick="copyText('${
      report.countHoursMinutes
    }', 'table-countHoursMinutes-${report.id}')">${
      report.countHoursMinutes
    }</span>
          </td>
          <td class="text-center table-btn">
            <span class="table-btn-update" onclick="updateReport('${
              report.id
            }')">E</span>
            <span class="table-btn-delete" onclick="deleteReport('${
              report.id
            }')">D</span>
            <span class="table-btn-copy" onclick="copyReport('${
              report.id
            }')">C</span>
          </td>
        </tr>`;
  });

  this.changeNaneButtonSave();
  this.countSumDay();
}

function makeId() {
  return (Math.random() + 1).toString(36).substring(5);
}

function changeNaneButtonSave(isSave = true) {
  document.getElementById("text-btn-save").textContent = isSave
    ? "Save"
    : "Update";
}

function getCurrentTime() {
  const today = new Date();
  let hours = today.getHours();
  let minutes = today.getMinutes();
  let seconds = today.getSeconds();
  minutes = checkTime(minutes);
  seconds = checkTime(seconds);

  document.getElementById(
    "clock-24-hours"
  ).innerHTML = `${hours}:${minutes}:${seconds}`;
}

function checkTime(time) {
  return time < 10 ? "0" + time : time;
}

function changeInputTimeStart() {
  let timeStart = document.getElementById("report-time-start").type;
  if (timeStart === "time") {
    document.getElementById("report-time-start").type = "text";
  } else {
    document.getElementById("report-time-start").type = "time";
  }
}

function changeInputTimeEnd() {
  let timeStart = document.getElementById("report-time-end").type;
  if (timeStart === "time") {
    document.getElementById("report-time-end").type = "text";
  } else {
    document.getElementById("report-time-end").type = "time";
  }
}

function copyText(text, id) {
  navigator.clipboard.writeText(text);

  document.getElementById(id).classList.add("table-active-text");
  setTimeout(function () {
    document.getElementById(id).classList.remove("table-active-text");
  }, 1000);
}

function copyReport(id) {
  const indexReport = reports.findIndex((r) => r.id === id);
  const report = reports[indexReport];

  let time = report.countHoursMinutes;

  if (report.countHoursMinutes === "-") {
    time = report.countHours;
  }

  let countHours = report.countHours.replace("h", "");
  if (Math.floor(countHours) < 1) {
    time = report.countMinutes;
  }

  navigator.clipboard.writeText(
    `${report.content}\t${time}\t${report.note}`
  );
}

function countSumDay() {
  const dataReports = reports;
  let sumMinuteDay = 0;
  let sumHourDay = 0;

  if (dataReports.length !== 0) {
    console.log(dataReports);
    dataReports.forEach((report) => {
      const reportHours = report.hours;
      if (reportHours) {
        sumMinuteDay += parseInt(reportHours) * 60;
      } else {
        sumMinuteDay +=
        report.countMinutes !== "-" ? +report.countMinutes.replace("m", "") : 0;
      }
    });

    sumHourDay = Math.round((sumMinuteDay / 60) * 100) / 100;
  }

  document.getElementById("sum-minute-day").innerHTML = sumMinuteDay;
  document.getElementById("sum-hour-day").innerHTML = sumHourDay;
}
function setBackgroudLS(numberBg) {
  localStorage.setItem("bg", JSON.stringify(numberBg));
  this.showBackground(numberBg);
}

function getBackgroudLS() {
  let numberBg = JSON.parse(localStorage.getItem("bg"));
  if (numberBg) {
    document.getElementById("btnradio" + numberBg).checked = true;
  } else {
    numberBg = 1;
  }

  this.showBackground(numberBg);
}

function showBackground(numberBg) {
  let classBackground = "none";
  let colorBackground = "black";

  document.getElementById("bg-moon").style.display = 'none';

  switch (numberBg) {
    case 2:
      classBackground = "wrapper";
      colorBackground = "white";
      break;

    case 3:
      classBackground = "background-container";
      colorBackground = "white";
      document.getElementById("bg-moon").style.display = 'block'
      break;

    default:
      break;
  }

  document.getElementById("bg-body").className = classBackground;

  const textColors = document.getElementsByClassName("text-color");
	for(let i = 0; i < textColors.length; i++){
		textColors[i].style.color = colorBackground;
	}
}