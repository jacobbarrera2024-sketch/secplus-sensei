(function () {
  "use strict";

  var STORAGE_KEY = "quick_quote_draft_v1";

  var state = {
    docType: "invoice",
    number: "",
    date: "",
    dueDate: "",
    business: { name: "", email: "", phone: "", address: "" },
    client: { name: "", company: "", email: "", address: "" },
    lines: [{ desc: "", qty: 1, rate: 0 }],
    taxRate: 0,
    notes: "",
    theme: "classic"
  };

  var els = {};

  function $(id) {
    return document.getElementById(id);
  }

  function todayISO() {
    var d = new Date();
    return d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate());
  }

  function addDaysISO(days) {
    var d = new Date();
    d.setDate(d.getDate() + days);
    return d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate());
  }

  function pad2(n) {
    return n < 10 ? "0" + n : String(n);
  }

  function fmtDate(iso) {
    if (!iso) return "—";
    var parts = iso.split("-");
    if (parts.length !== 3) return iso;
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var m = Number(parts[1]) - 1;
    if (m < 0 || m > 11) return iso;
    return months[m] + " " + Number(parts[2]) + ", " + parts[0];
  }

  function setPreviewLine(el, text) {
    if (!el) return;
    var val = text ? String(text).trim() : "";
    el.textContent = val;
    el.hidden = !val;
  }

  function fmtMoney(n) {
    return "$" + (Number(n) || 0).toFixed(2);
  }

  function esc(text) {
    return String(text || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function setStatus(msg, type) {
    if (!els.status) return;
    els.status.textContent = msg || "";
    els.status.className = "status" + (type ? " " + type : "");
  }

  function lineAmount(line) {
    return (Number(line.qty) || 0) * (Number(line.rate) || 0);
  }

  function calcSubtotal() {
    return state.lines.reduce(function (sum, line) {
      return sum + lineAmount(line);
    }, 0);
  }

  function calcTax(sub) {
    return sub * ((Number(state.taxRate) || 0) / 100);
  }

  function readForm() {
    state.docType = els.docType.value;
    state.number = els.docNumber.value.trim();
    state.date = els.docDate.value;
    state.dueDate = els.dueDate.value;
    state.business.name = els.bizName.value.trim();
    state.business.email = els.bizEmail.value.trim();
    state.business.phone = els.bizPhone.value.trim();
    state.business.address = els.bizAddress.value.trim();
    state.client.name = els.clientName.value.trim();
    state.client.company = els.clientCompany.value.trim();
    state.client.email = els.clientEmail.value.trim();
    state.client.address = els.clientAddress.value.trim();
    state.taxRate = Number(els.taxRate.value) || 0;
    state.notes = els.notes.value.trim();
    state.theme = els.theme.value;

    state.lines = [];
    Array.prototype.forEach.call(els.lineBody.querySelectorAll("tr"), function (row) {
      state.lines.push({
        desc: row.querySelector(".line-desc").value.trim(),
        qty: Number(row.querySelector(".line-qty").value) || 0,
        rate: Number(row.querySelector(".line-rate").value) || 0
      });
    });
    if (!state.lines.length) state.lines.push({ desc: "", qty: 1, rate: 0 });
  }

  function writeForm() {
    els.docType.value = state.docType;
    els.docNumber.value = state.number;
    els.docDate.value = state.date;
    els.dueDate.value = state.dueDate;
    els.bizName.value = state.business.name;
    els.bizEmail.value = state.business.email;
    els.bizPhone.value = state.business.phone;
    els.bizAddress.value = state.business.address;
    els.clientName.value = state.client.name;
    els.clientCompany.value = state.client.company;
    els.clientEmail.value = state.client.email;
    els.clientAddress.value = state.clientAddress;
    els.taxRate.value = state.taxRate;
    els.notes.value = state.notes;
    els.theme.value = state.theme;
    renderLineRows();
  }

  function renderLineRows() {
    els.lineBody.innerHTML = state.lines.map(function (line, i) {
      return (
        "<tr data-i=\"" + i + "\">" +
          "<td><input class=\"line-desc\" type=\"text\" value=\"" + esc(line.desc) + "\" placeholder=\"Service or product\" /></td>" +
          "<td class=\"col-qty\"><input class=\"line-qty\" type=\"number\" min=\"0\" step=\"1\" value=\"" + line.qty + "\" /></td>" +
          "<td class=\"col-rate\"><input class=\"line-rate\" type=\"number\" min=\"0\" step=\"0.01\" value=\"" + line.rate + "\" /></td>" +
          "<td class=\"col-del\"><button class=\"line-del\" type=\"button\" aria-label=\"Remove line\" title=\"Remove\">×</button></td>" +
        "</tr>"
      );
    }).join("");

    bindLineEvents();
    renderPreview();
  }

  function bindLineEvents() {
    Array.prototype.forEach.call(els.lineBody.querySelectorAll("input"), function (input) {
      input.addEventListener("input", function () {
        readForm();
        renderPreview();
      });
    });

    Array.prototype.forEach.call(els.lineBody.querySelectorAll(".line-del"), function (btn) {
      btn.addEventListener("click", function () {
        readForm();
        var i = Number(btn.closest("tr").getAttribute("data-i"));
        if (state.lines.length <= 1) {
          state.lines = [{ desc: "", qty: 1, rate: 0 }];
        } else {
          state.lines.splice(i, 1);
        }
        renderLineRows();
      });
    });
  }

  function renderPreview() {
    var sub = calcSubtotal();
    var tax = calcTax(sub);
    var total = sub + tax;
    var isQuote = state.docType === "quote";

    els.docPreview.className = "doc-preview theme-" + state.theme;
    els.pvTitle.textContent = isQuote ? "QUOTE" : "INVOICE";
    els.pvNumber.textContent = state.number || (isQuote ? "QTE-001" : "INV-001");
    els.pvDate.textContent = fmtDate(state.date);
    els.pvDue.textContent = fmtDate(state.dueDate);
    els.pvDueLabel.textContent = isQuote ? "Valid until" : "Due";
    if (els.pvClientHeading) {
      els.pvClientHeading.textContent = isQuote ? "Prepared for" : "Bill to";
    }

    els.pvBizName.textContent = state.business.name || "Your name";
    setPreviewLine(els.pvBizEmail, state.business.email);
    setPreviewLine(els.pvBizPhone, state.business.phone);
    setPreviewLine(els.pvBizAddress, state.business.address);

    els.pvClientName.textContent = state.client.name || "Client name";
    setPreviewLine(els.pvClientCompany, state.client.company);
    setPreviewLine(els.pvClientEmail, state.client.email);
    setPreviewLine(els.pvClientAddress, state.client.address);

    els.pvLines.innerHTML = state.lines.map(function (line) {
      if (!line.desc && !line.rate) return "";
      return (
        "<tr>" +
          "<td>" + esc(line.desc || "—") + "</td>" +
          "<td>" + esc(line.qty) + "</td>" +
          "<td>" + fmtMoney(line.rate) + "</td>" +
          "<td>" + fmtMoney(lineAmount(line)) + "</td>" +
        "</tr>"
      );
    }).join("") || "<tr><td colspan=\"4\">Add line items to see them here.</td></tr>";

    els.pvSubtotal.textContent = fmtMoney(sub);
    els.pvTax.textContent = fmtMoney(tax) + (state.taxRate ? " (" + state.taxRate + "%)" : "");
    var taxRow = els.pvTax && els.pvTax.closest(".total-row");
    if (taxRow) taxRow.hidden = !state.taxRate;
    els.pvTotal.textContent = fmtMoney(total);
    els.pvNotes.textContent = state.notes;
    els.pvNotes.hidden = !state.notes;
  }

  function saveDraft() {
    readForm();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      setStatus("Draft saved on this device.", "ok");
    } catch (e) {
      setStatus("Could not save — storage may be full.", "error");
    }
  }

  function loadDraft() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return false;
      var saved = JSON.parse(raw);
      if (!saved || typeof saved !== "object") return false;

      if (saved.docType === "invoice" || saved.docType === "quote") state.docType = saved.docType;
      if (typeof saved.number === "string") state.number = saved.number;
      if (typeof saved.date === "string") state.date = saved.date;
      if (typeof saved.dueDate === "string") state.dueDate = saved.dueDate;
      if (typeof saved.taxRate === "number") state.taxRate = saved.taxRate;
      if (typeof saved.notes === "string") state.notes = saved.notes;
      if (saved.theme === "classic" || saved.theme === "slate" || saved.theme === "mint") state.theme = saved.theme;

      if (saved.business && typeof saved.business === "object") {
        state.business = {
          name: saved.business.name || "",
          email: saved.business.email || "",
          phone: saved.business.phone || "",
          address: saved.business.address || ""
        };
      }
      if (saved.client && typeof saved.client === "object") {
        state.client = {
          name: saved.client.name || "",
          company: saved.client.company || "",
          email: saved.client.email || "",
          address: saved.client.address || ""
        };
      }
      if (Array.isArray(saved.lines) && saved.lines.length) {
        state.lines = saved.lines.map(function (line) {
          return {
            desc: line.desc || "",
            qty: Number(line.qty) || 0,
            rate: Number(line.rate) || 0
          };
        });
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  function loadSample() {
    state = {
      docType: "invoice",
      number: "INV-2026-014",
      date: todayISO(),
      dueDate: addDaysISO(14),
      business: {
        name: "Jacob Barrera",
        email: "jacobbarrera.jb@gmail.com",
        phone: "",
        address: "Freelance developer"
      },
      client: {
        name: "Alex Rivera",
        company: "Rivera Consulting",
        email: "alex@riveraconsulting.example",
        address: "Austin, TX"
      },
      lines: [
        { desc: "Landing page design & build", qty: 1, rate: 450 },
        { desc: "Contact form + email integration", qty: 1, rate: 125 },
        { desc: "Revisions (2 rounds included)", qty: 2, rate: 50 }
      ],
      taxRate: 0,
      notes: "Payment due within 14 days via bank transfer or PayPal.\nThank you for your business!",
      theme: "mint"
    };
    writeForm();
    renderPreview();
    setStatus("Sample invoice loaded.", "ok");
  }

  function newDocument() {
    state = {
      docType: "invoice",
      number: "",
      date: todayISO(),
      dueDate: addDaysISO(14),
      business: state.business,
      client: { name: "", company: "", email: "", address: "" },
      lines: [{ desc: "", qty: 1, rate: 0 }],
      taxRate: 0,
      notes: "",
      theme: state.theme
    };
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) { /* ignore */ }
    writeForm();
    renderPreview();
    setStatus("New document started.", "ok");
  }

  function showPanel(name) {
    var isPreview = name === "preview";
    els.panelEdit.classList.toggle("hidden-mobile", isPreview);
    els.panelPreview.classList.toggle("active", isPreview);
    document.querySelectorAll(".tab").forEach(function (tab) {
      tab.classList.toggle("active", tab.getAttribute("data-panel") === name);
    });
    if (isPreview) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function bind() {
    [
      "docType", "docNumber", "docDate", "dueDate",
      "bizName", "bizEmail", "bizPhone", "bizAddress",
      "clientName", "clientCompany", "clientEmail", "clientAddress",
      "taxRate", "notes", "theme"
    ].forEach(function (id) {
      $(id).addEventListener("input", function () {
        readForm();
        renderPreview();
      });
      $(id).addEventListener("change", function () {
        readForm();
        renderPreview();
      });
    });

    els.addLineBtn.addEventListener("click", function () {
      readForm();
      state.lines.push({ desc: "", qty: 1, rate: 0 });
      renderLineRows();
    });

    els.saveBtn.addEventListener("click", saveDraft);
    els.sampleBtn.addEventListener("click", loadSample);
    els.newBtn.addEventListener("click", newDocument);
    els.printBtn.addEventListener("click", function () {
      readForm();
      renderPreview();
      if (window.matchMedia("(max-width: 900px)").matches) {
        showPanel("preview");
        setTimeout(function () { window.print(); }, 350);
      } else {
        window.print();
      }
    });

    document.querySelectorAll(".tab").forEach(function (tab) {
      tab.addEventListener("click", function () {
        showPanel(tab.getAttribute("data-panel"));
      });
    });
  }

  function init() {
    els = {
      docType: $("docType"),
      docNumber: $("docNumber"),
      docDate: $("docDate"),
      dueDate: $("dueDate"),
      bizName: $("bizName"),
      bizEmail: $("bizEmail"),
      bizPhone: $("bizPhone"),
      bizAddress: $("bizAddress"),
      clientName: $("clientName"),
      clientCompany: $("clientCompany"),
      clientEmail: $("clientEmail"),
      clientAddress: $("clientAddress"),
      taxRate: $("taxRate"),
      notes: $("notes"),
      theme: $("theme"),
      lineBody: $("lineBody"),
      addLineBtn: $("addLineBtn"),
      saveBtn: $("saveBtn"),
      sampleBtn: $("sampleBtn"),
      newBtn: $("newBtn"),
      printBtn: $("printBtn"),
      status: $("status"),
      docPreview: $("docPreview"),
      pvTitle: $("pvTitle"),
      pvNumber: $("pvNumber"),
      pvDate: $("pvDate"),
      pvDue: $("pvDue"),
      pvDueLabel: $("pvDueLabel"),
      pvBizName: $("pvBizName"),
      pvBizEmail: $("pvBizEmail"),
      pvBizPhone: $("pvBizPhone"),
      pvBizAddress: $("pvBizAddress"),
      pvClientHeading: $("pvClientHeading"),
      pvClientName: $("pvClientName"),
      pvClientCompany: $("pvClientCompany"),
      pvClientEmail: $("pvClientEmail"),
      pvClientAddress: $("pvClientAddress"),
      pvLines: $("pvLines"),
      pvSubtotal: $("pvSubtotal"),
      pvTax: $("pvTax"),
      pvTotal: $("pvTotal"),
      pvNotes: $("pvNotes"),
      panelEdit: $("panelEdit"),
      panelPreview: $("panelPreview")
    };

    if (!loadDraft()) {
      state.date = todayISO();
      state.dueDate = addDaysISO(14);
    }

    writeForm();
    renderPreview();
    bind();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
