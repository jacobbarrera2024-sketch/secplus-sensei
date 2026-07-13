(function () {
  "use strict";

  var SAMPLE_CSV =
    "Month,Client,Project Type,Hours,Revenue,Expenses\n" +
    "Jan 2026,Rivera Consulting,Web build,12,1200,50\n" +
    "Feb 2026,Acme Co,Landing page,8,800,30\n" +
    "Mar 2026,Green Labs,API integration,16,2400,120\n" +
    "Apr 2026,Local Cafe,Menu site,6,600,25\n" +
    "May 2026,Rivera Consulting,Maintenance,4,400,15\n" +
    "Jun 2026,Startup XYZ,MVP dashboard,20,3500,200\n" +
    "Jul 2026,Freelance Hub,Consulting,10,1500,80\n";

  var state = {
    headers: [],
    types: [],
    rows: [],
    sortCol: -1,
    sortAsc: true,
    fileName: ""
  };

  var els = {};

  function $(id) {
    return document.getElementById(id);
  }

  function setStatus(msg, type) {
    if (!els.status) return;
    els.status.textContent = msg || "";
    els.status.className = "status" + (type ? " " + type : "");
  }

  function esc(text) {
    return String(text == null ? "" : text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function parseCSV(text) {
    var rows = [];
    var row = [];
    var cell = "";
    var inQuotes = false;

    for (var i = 0; i < text.length; i++) {
      var c = text[i];
      var next = text[i + 1];

      if (inQuotes) {
        if (c === '"' && next === '"') {
          cell += '"';
          i++;
        } else if (c === '"') {
          inQuotes = false;
        } else {
          cell += c;
        }
      } else if (c === '"') {
        inQuotes = true;
      } else if (c === ",") {
        row.push(cell);
        cell = "";
      } else if (c === "\n" || (c === "\r" && next === "\n")) {
        row.push(cell);
        if (row.length > 1 || (row[0] && row[0].trim())) rows.push(row);
        row = [];
        cell = "";
        if (c === "\r") i++;
      } else if (c !== "\r") {
        cell += c;
      }
    }

    if (cell.length || row.length) {
      row.push(cell);
      rows.push(row);
    }

    return rows.map(function (r) {
      return r.map(function (c) { return String(c).trim(); });
    });
  }

  function detectTypes(headers, dataRows) {
    return headers.map(function (_, colIdx) {
      var nums = 0;
      var total = 0;
      dataRows.forEach(function (row) {
        var v = row[colIdx];
        if (v === "" || v == null) return;
        total++;
        var n = parseFloat(String(v).replace(/[$,]/g, ""));
        if (!isNaN(n) && isFinite(n)) nums++;
      });
      return total > 0 && nums / total >= 0.75 ? "number" : "text";
    });
  }

  function parseNumber(val) {
    var n = parseFloat(String(val).replace(/[$,]/g, ""));
    return isNaN(n) ? 0 : n;
  }

  function loadData(headers, dataRows, fileName) {
    if (!headers.length || !dataRows.length) {
      setStatus("CSV needs a header row and at least one data row.", "error");
      return;
    }

    var width = headers.length;
    dataRows = dataRows.filter(function (row) {
      return row.some(function (c) { return c; });
    }).map(function (row) {
      while (row.length < width) row.push("");
      return row.slice(0, width);
    });

    state.headers = headers;
    state.rows = dataRows;
    state.types = detectTypes(headers, dataRows);
    state.sortCol = -1;
    state.sortAsc = true;
    state.fileName = fileName || "data.csv";

    els.dashboard.hidden = false;
    renderAll();
    setStatus("Loaded " + dataRows.length + " rows from " + state.fileName + ".", "ok");
  }

  function processText(text, fileName) {
    var parsed = parseCSV(text);
    if (!parsed.length) {
      setStatus("Could not parse CSV — check the file format.", "error");
      return;
    }
    loadData(parsed[0], parsed.slice(1), fileName);
  }

  function getSortedRows() {
    var rows = state.rows.slice();
    if (state.sortCol < 0) return rows;

    var col = state.sortCol;
    var isNum = state.types[col] === "number";
    rows.sort(function (a, b) {
      var av = a[col] || "";
      var bv = b[col] || "";
      var cmp;
      if (isNum) {
        cmp = parseNumber(av) - parseNumber(bv);
      } else {
        cmp = String(av).localeCompare(String(bv), undefined, { sensitivity: "base" });
      }
      return state.sortAsc ? cmp : -cmp;
    });
    return rows;
  }

  function renderStats() {
    var numCols = state.types.filter(function (t) { return t === "number"; }).length;
    els.statsRow.innerHTML =
      '<div class="stat-card"><span class="val">' + state.rows.length + '</span><span class="lbl">Rows</span></div>' +
      '<div class="stat-card"><span class="val">' + state.headers.length + '</span><span class="lbl">Columns</span></div>' +
      '<div class="stat-card"><span class="val">' + numCols + '</span><span class="lbl">Numeric</span></div>';
  }

  function firstTextCol() {
    for (var i = 0; i < state.types.length; i++) {
      if (state.types[i] === "text") return i;
    }
    return 0;
  }

  function numericCols() {
    var out = [];
    state.types.forEach(function (t, i) {
      if (t === "number") out.push(i);
    });
    return out;
  }

  function renderCharts() {
    var labelCol = firstTextCol();
    var nums = numericCols();
    els.charts.innerHTML = "";

    if (!nums.length) {
      els.charts.innerHTML = '<div class="chart-card"><h3>No numeric columns</h3><p>Add columns with numbers to see charts.</p></div>';
      return;
    }

    nums.slice(0, 2).forEach(function (numCol) {
      var headerName = state.headers[numCol];
      var items = state.rows.map(function (row, i) {
        return {
          label: row[labelCol] || ("Row " + (i + 1)),
          value: parseNumber(row[numCol])
        };
      });
      items.sort(function (a, b) { return b.value - a.value; });
      items = items.slice(0, 8);

      var max = Math.max.apply(null, items.map(function (x) { return x.value; }).concat([1]));

      var bars = items.map(function (item) {
        var h = Math.round((item.value / max) * 100);
        return (
          '<div class="bar-col">' +
            '<span class="bar-value">' + esc(formatNum(item.value, headerName)) + '</span>' +
            '<div class="bar" style="height:' + h + '%" title="' + esc(item.label) + ': ' + esc(formatNum(item.value, headerName)) + '"></div>' +
            '<span class="bar-label">' + esc(truncate(item.label, 10)) + '</span>' +
          '</div>'
        );
      }).join("");

      var card = document.createElement("div");
      card.className = "chart-card";
      card.innerHTML =
        '<h3>' + esc(state.headers[numCol]) + '</h3>' +
        '<p>Top ' + items.length + ' by ' + esc(state.headers[labelCol]) + '</p>' +
        '<div class="bar-chart">' + bars + '</div>';
      els.charts.appendChild(card);
    });
  }

  function formatNum(n, header) {
    var money = /revenue|expense|price|cost|amount|total|pay|fee|income|sales/i.test(header || "");
    var formatted = Math.abs(n) >= 1000 ? n.toLocaleString() : (n % 1 ? n.toFixed(2) : String(n));
    return money ? "$" + formatted : formatted;
  }

  function truncate(s, n) {
    s = String(s);
    return s.length > n ? s.slice(0, n - 1) + "…" : s;
  }

  function renderTable() {
    var rows = getSortedRows();
    var displayRows = rows.slice(0, 200);

    els.tableHead.innerHTML = "<tr>" + state.headers.map(function (h, i) {
      var sorted = state.sortCol === i;
      var arrow = sorted ? (state.sortAsc ? "▲" : "▼") : "↕";
      return '<th data-col="' + i + '" class="' + (sorted ? "sorted" : "") + '">' + esc(h) + '<span class="sort-arrow">' + arrow + "</span></th>";
    }).join("") + "</tr>";

    els.tableBody.innerHTML = displayRows.map(function (row) {
      return "<tr>" + row.map(function (cell, i) {
        var cls = state.types[i] === "number" ? "num" : "";
        return '<td class="' + cls + '">' + esc(cell) + "</td>";
      }).join("") + "</tr>";
    }).join("");

    var meta = "Showing " + displayRows.length + " of " + rows.length + " rows";
    if (rows.length > 200) meta += " (first 200)";
    if (state.sortCol >= 0) meta += " · sorted by " + state.headers[state.sortCol];
    els.tableMeta.textContent = meta;

    Array.prototype.forEach.call(els.tableHead.querySelectorAll("th"), function (th) {
      th.addEventListener("click", function () {
        var col = Number(th.getAttribute("data-col"));
        if (state.sortCol === col) state.sortAsc = !state.sortAsc;
        else { state.sortCol = col; state.sortAsc = true; }
        renderTable();
      });
    });
  }

  function renderAll() {
    renderStats();
    renderCharts();
    renderTable();
  }

  function clearAll() {
    state.headers = [];
    state.rows = [];
    state.types = [];
    state.sortCol = -1;
    state.fileName = "";
    els.dashboard.hidden = true;
    els.charts.innerHTML = "";
    els.tableHead.innerHTML = "";
    els.tableBody.innerHTML = "";
    els.statsRow.innerHTML = "";
    els.fileInput.value = "";
    setStatus("Cleared.", "ok");
  }

  function readFile(file) {
    if (!file) return;
    if (!/\.csv$/i.test(file.name) && file.type && file.type !== "text/csv") {
      setStatus("Please upload a .csv file.", "error");
      return;
    }
    var reader = new FileReader();
    reader.onload = function () {
      processText(String(reader.result || ""), file.name);
    };
    reader.onerror = function () {
      setStatus("Could not read file.", "error");
    };
    reader.readAsText(file);
  }

  function bind() {
    els.browseBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      els.fileInput.click();
    });

    els.dropzone.addEventListener("click", function () {
      els.fileInput.click();
    });

    els.fileInput.addEventListener("change", function () {
      if (els.fileInput.files[0]) readFile(els.fileInput.files[0]);
    });

    ["dragenter", "dragover"].forEach(function (ev) {
      els.dropzone.addEventListener(ev, function (e) {
        e.preventDefault();
        e.stopPropagation();
        els.dropzone.classList.add("dragover");
      });
    });

    ["dragleave", "drop"].forEach(function (ev) {
      els.dropzone.addEventListener(ev, function (e) {
        e.preventDefault();
        e.stopPropagation();
        els.dropzone.classList.remove("dragover");
      });
    });

    els.dropzone.addEventListener("drop", function (e) {
      var file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
      if (file) readFile(file);
    });

    els.sampleBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      processText(SAMPLE_CSV, "freelance-income-sample.csv");
    });

    els.clearBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      clearAll();
    });
  }

  function init() {
    els = {
      dropzone: $("dropzone"),
      fileInput: $("fileInput"),
      browseBtn: $("browseBtn"),
      sampleBtn: $("sampleBtn"),
      clearBtn: $("clearBtn"),
      status: $("status"),
      dashboard: $("dashboard"),
      statsRow: $("statsRow"),
      charts: $("charts"),
      tableHead: $("tableHead"),
      tableBody: $("tableBody"),
      tableMeta: $("tableMeta"),
      dataTable: $("dataTable")
    };
    bind();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
