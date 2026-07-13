(function () {
  "use strict";

  var STORAGE_KEY = "secplus_ai_demo_v1";
  var TUTORIAL_KEY = "secplus_ai_demo_tutorial_seen";
  var DEFAULT_MODEL = "claude-haiku-4-5";

  var PAGE_TITLES = {
    practice: "Practice",
    api: "API Setup",
    custom: "Custom Question"
  };

  var state = {
    apiKey: "",
    model: DEFAULT_MODEL,
    current: null,
    selected: -1,
    page: "practice"
  };

  var els = {};

  function $(id) {
    return document.getElementById(id);
  }

  function loadSettings() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      var saved = JSON.parse(raw);
      if (saved.apiKey) state.apiKey = saved.apiKey;
      if (saved.model) state.model = saved.model;
    } catch (e) { /* ignore */ }
  }

  function saveSettings() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      apiKey: state.apiKey,
      model: state.model
    }));
    updateKeyStatus();
  }

  function updateKeyStatus() {
    var ready = !!state.apiKey;
    var text = ready ? "AI ready" : "No API key saved";

    if (els.sidebarStatus) {
      els.sidebarStatus.classList.toggle("ready", ready);
    }
    if (els.keyStatusText) {
      els.keyStatusText.textContent = text;
    }
    if (els.mobileStatus) {
      els.mobileStatus.textContent = ready ? "AI ready · SecPlus AI Demo" : "No API key · SecPlus AI Demo";
    }
    if (els.explainBtn) {
      els.explainBtn.title = ready
        ? "Get a Claude explanation for this question"
        : "Add your Anthropic API key in API Setup first";
    }
  }

  function setStatus(msg, type) {
    els.status.textContent = msg || "";
    els.status.className = "status" + (type ? " " + type : "");
  }

  function esc(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function setActiveNav(pageId) {
    document.querySelectorAll(".nav-item[data-page], .tab-item[data-page]").forEach(function (btn) {
      btn.classList.toggle("active", btn.getAttribute("data-page") === pageId);
    });
  }

  function showPage(pageId, updateHash) {
    if (!PAGE_TITLES[pageId]) pageId = "practice";
    state.page = pageId;

    document.querySelectorAll(".page-view").forEach(function (view) {
      var isActive = view.getAttribute("data-page") === pageId;
      view.classList.toggle("active", isActive);
      view.hidden = !isActive;
    });

    setActiveNav(pageId);

    if (els.mobilePageTitle) {
      els.mobilePageTitle.textContent = PAGE_TITLES[pageId];
    }

    if (updateHash !== false) {
      history.replaceState(null, "", "#" + pageId);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function initNav() {
    document.querySelectorAll(".nav-item[data-page], .tab-item[data-page]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        showPage(btn.getAttribute("data-page"));
      });
    });

    var hash = (location.hash || "#practice").replace("#", "");
    showPage(PAGE_TITLES[hash] ? hash : "practice", false);
  }

  function renderQuestion(q) {
    state.current = q;
    state.selected = -1;

    els.qMeta.textContent = q.domain || "Custom";
    els.qStem.textContent = q.stem;
    els.qOptions.innerHTML = q.opts.map(function (opt, i) {
      return (
        '<label class="option" data-idx="' + i + '">' +
          '<input type="radio" name="answer" value="' + i + '" />' +
          '<span>' + esc(opt) + "</span>" +
        "</label>"
      );
    }).join("");

    Array.prototype.forEach.call(els.qOptions.querySelectorAll(".option"), function (row) {
      row.addEventListener("click", function () {
        var idx = Number(row.getAttribute("data-idx"));
        state.selected = idx;
        Array.prototype.forEach.call(els.qOptions.querySelectorAll(".option"), function (o) {
          o.classList.remove("selected", "correct", "wrong");
        });
        row.classList.add("selected");
        row.querySelector("input").checked = true;
        els.resultBox.hidden = true;
        setStatus("");
      });
    });

    els.resultBox.hidden = true;
    setStatus("");
  }

  function renderPills() {
    els.questionPills.innerHTML = SAMPLE_QUESTIONS.map(function (q, i) {
      var short = q.domain.split(" ")[0];
      return '<button class="pill" type="button" data-q="' + i + '" title="' + esc(q.domain) + '">Q' + (i + 1) + " · " + esc(short) + "</button>";
    }).join("");

    Array.prototype.forEach.call(els.questionPills.querySelectorAll(".pill"), function (pill) {
      pill.addEventListener("click", function () {
        Array.prototype.forEach.call(els.questionPills.querySelectorAll(".pill"), function (p) {
          p.classList.remove("active");
        });
        pill.classList.add("active");
        renderQuestion(SAMPLE_QUESTIONS[Number(pill.getAttribute("data-q"))]);
      });
    });
  }

  function showResult(title, html) {
    els.resultTitle.textContent = title;
    els.resultBody.innerHTML = html;
    els.resultBox.hidden = false;
    els.resultBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function checkAnswer() {
    if (!state.current) return;
    if (state.selected < 0) {
      setStatus("Select an answer first.", "error");
      return;
    }

    var correct = state.selected === state.current.ans;
    Array.prototype.forEach.call(els.qOptions.querySelectorAll(".option"), function (row, i) {
      row.classList.remove("correct", "wrong");
      if (i === state.current.ans) row.classList.add("correct");
      else if (i === state.selected) row.classList.add("wrong");
    });

    setStatus(
      correct ? "Correct — nice work." : "Not quite — the correct answer is highlighted in green.",
      correct ? "ok" : "error"
    );
  }

  function revealBuiltIn() {
    if (!state.current || state.current.exp == null) {
      setStatus("No built-in explanation for custom questions — try Explain with AI.", "error");
      return;
    }
    showResult("Built-in Explanation", "<p>" + esc(state.current.exp) + "</p>");
    setStatus("Showing built-in explanation (works without AI).", "ok");
  }

  function friendlyAiError(err) {
    var m = err && err.message ? err.message : String(err || "unknown error");
    if (/401|invalid.*key|authentication/i.test(m)) return "Invalid API key — open API Setup and double-check your key.";
    if (/rate.?limit|429|overloaded|529/i.test(m)) return "Anthropic is busy — wait a moment and try again.";
    if (/credit|billing|insufficient/i.test(m)) return "Your Anthropic account may be out of credits.";
    return m;
  }

  function formatAiResponse(text) {
    var lines = text.split("\n").map(function (l) { return l.trim(); }).filter(Boolean);
    var html = "";
    var inList = false;

    lines.forEach(function (line) {
      if (/^[-*•]/.test(line)) {
        if (!inList) { html += "<ul>"; inList = true; }
        html += "<li>" + esc(line.replace(/^[-*•]\s*/, "")) + "</li>";
      } else {
        if (inList) { html += "</ul>"; inList = false; }
        html += "<p>" + esc(line) + "</p>";
      }
    });
    if (inList) html += "</ul>";
    return html || "<p>" + esc(text) + "</p>";
  }

  function callClaude(system, userContent) {
    return fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": state.apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true"
      },
      body: JSON.stringify({
        model: state.model || DEFAULT_MODEL,
        max_tokens: 900,
        system: system,
        messages: [{ role: "user", content: userContent }]
      })
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data && data.content && data.content[0] && data.content[0].text) {
          return data.content[0].text;
        }
        throw new Error(data && data.error ? data.error.message : "No response from Claude");
      });
  }

  function setExplainLoading(on) {
    els.explainBtn.disabled = on;
    els.explainSpinner.hidden = !on;
    els.explainBtn.querySelector(".btn-label").textContent = on ? "Thinking…" : "Explain with AI";
  }

  function explainWithAi() {
    if (!state.current) return;
    if (!state.apiKey) {
      setStatus("Add your API key in API Setup first.", "error");
      showPage("api");
      if (els.apiTutorial) els.apiTutorial.open = true;
      return;
    }

    setExplainLoading(true);
    setStatus("Asking Claude…");

    var q = state.current;
    var selectedText = state.selected >= 0 ? q.opts[state.selected] : "(no answer selected)";
    var correctText = typeof q.ans === "number" && q.opts[q.ans] ? q.opts[q.ans] : "(not set for custom)";

    var prompt =
      "Question: " + q.stem + "\n\n" +
      "Options:\n" + q.opts.map(function (o, i) { return (i + 1) + ". " + o; }).join("\n") + "\n\n" +
      "Learner selected: " + selectedText + "\n" +
      "Correct answer: " + correctText + "\n\n" +
      "Explain clearly for a Security+ (SY0-701) student. Include:\n" +
      "1) Why the correct answer is right\n" +
      "2) Why each wrong option is wrong (briefly)\n" +
      "3) One memory tip\n" +
      "Keep it under 220 words. Use short paragraphs or bullets.";

    var system =
      "You are a concise CompTIA Security+ tutor. Be accurate, practical, and exam-focused. " +
      "Unofficial study aid — not affiliated with CompTIA.";

    callClaude(system, prompt)
      .then(function (text) {
        showResult("AI Explanation", formatAiResponse(text));
        setStatus("AI explanation ready.", "ok");
      })
      .catch(function (err) {
        setStatus(friendlyAiError(err), "error");
      })
      .finally(function () {
        setExplainLoading(false);
      });
  }

  function loadCustomQuestion() {
    var stem = els.customStem.value.trim();
    var opts = els.customOpts.value
      .split("\n")
      .map(function (s) { return s.trim(); })
      .filter(Boolean);

    if (!stem || opts.length < 2) {
      setStatus("Add a question and at least two answer choices.", "error");
      return;
    }

    Array.prototype.forEach.call(els.questionPills.querySelectorAll(".pill"), function (p) {
      p.classList.remove("active");
    });

    renderQuestion({
      id: "custom",
      domain: "Custom Question",
      stem: stem,
      opts: opts,
      ans: -1,
      exp: null
    });

    showPage("practice");
    setStatus("Custom question loaded — select an answer, then try Explain with AI.", "ok");
  }

  function bind() {
    els.saveKeyBtn.addEventListener("click", function () {
      state.apiKey = els.apiKey.value.trim();
      state.model = els.apiModel.value.trim() || DEFAULT_MODEL;
      if (!state.apiKey) {
        setStatus("Paste your API key before saving.", "error");
        return;
      }
      saveSettings();
      setStatus("API key saved on this device.", "ok");
    });

    els.clearKeyBtn.addEventListener("click", function () {
      state.apiKey = "";
      els.apiKey.value = "";
      saveSettings();
      setStatus("API key cleared.", "ok");
    });

    els.toggleKeyBtn.addEventListener("click", function () {
      var show = els.apiKey.type === "password";
      els.apiKey.type = show ? "text" : "password";
      els.toggleKeyBtn.textContent = show ? "Hide" : "Show";
      els.toggleKeyBtn.setAttribute("aria-label", show ? "Hide API key" : "Show API key");
    });

    els.apiTutorial.addEventListener("toggle", function () {
      if (els.apiTutorial.open) localStorage.setItem(TUTORIAL_KEY, "1");
    });

    els.checkBtn.addEventListener("click", checkAnswer);
    els.revealBtn.addEventListener("click", revealBuiltIn);
    els.explainBtn.addEventListener("click", explainWithAi);
    els.loadCustomBtn.addEventListener("click", loadCustomQuestion);
  }

  function init() {
    els = {
      apiKey: $("apiKey"),
      apiModel: $("apiModel"),
      customStem: $("customStem"),
      customOpts: $("customOpts"),
      questionPills: $("questionPills"),
      qMeta: $("qMeta"),
      qStem: $("qStem"),
      qOptions: $("qOptions"),
      status: $("status"),
      resultBox: $("resultBox"),
      resultTitle: $("resultTitle"),
      resultBody: $("resultBody"),
      saveKeyBtn: $("saveKeyBtn"),
      clearKeyBtn: $("clearKeyBtn"),
      toggleKeyBtn: $("toggleKeyBtn"),
      checkBtn: $("checkBtn"),
      explainBtn: $("explainBtn"),
      explainSpinner: $("explainSpinner"),
      revealBtn: $("revealBtn"),
      loadCustomBtn: $("loadCustomBtn"),
      apiTutorial: $("apiTutorial"),
      sidebarStatus: $("sidebarStatus"),
      keyStatusText: $("keyStatusText"),
      mobilePageTitle: $("mobilePageTitle"),
      mobileStatus: $("mobileStatus")
    };

    loadSettings();
    els.apiKey.value = state.apiKey;
    els.apiModel.value = state.model || DEFAULT_MODEL;
    updateKeyStatus();

    if (!state.apiKey && !localStorage.getItem(TUTORIAL_KEY) && els.apiTutorial) {
      els.apiTutorial.open = true;
    }

    renderPills();
    if (SAMPLE_QUESTIONS.length) {
      var first = els.questionPills.querySelector(".pill");
      if (first) {
        first.classList.add("active");
        renderQuestion(SAMPLE_QUESTIONS[0]);
      }
    }

    initNav();
    bind();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
