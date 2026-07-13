(function () {
  "use strict";

  var STORAGE_KEY = "secplus_ai_demo_v1";
  var DEFAULT_MODEL = "claude-haiku-4-5";

  var state = {
    apiKey: "",
    model: DEFAULT_MODEL,
    current: null,
    selected: -1
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

  function renderQuestion(q) {
    state.current = q;
    state.selected = -1;

    els.qMeta.textContent = q.domain || "Custom question";
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
          o.classList.remove("selected", "correct");
        });
        row.classList.add("selected");
        row.querySelector("input").checked = true;
      });
    });

    els.resultBox.hidden = true;
    setStatus("");
  }

  function renderPills() {
    els.questionPills.innerHTML = SAMPLE_QUESTIONS.map(function (q, i) {
      return '<button class="pill" type="button" data-q="' + i + '">Q' + (i + 1) + "</button>";
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
  }

  function checkAnswer() {
    if (!state.current) return;
    if (state.selected < 0) {
      setStatus("Select an answer first.", "error");
      return;
    }

    var correct = state.selected === state.current.ans;
    Array.prototype.forEach.call(els.qOptions.querySelectorAll(".option"), function (row, i) {
      row.classList.toggle("correct", i === state.current.ans);
    });

    setStatus(correct ? "Correct." : "Not quite — see the correct option highlighted.", correct ? "ok" : "error");
  }

  function revealBuiltIn() {
    if (!state.current || state.current.exp == null) {
      setStatus("No built-in explanation for this custom question.", "error");
      return;
    }
    showResult(
      "Built-in explanation",
      "<p>" + esc(state.current.exp) + "</p>"
    );
    setStatus("Showing built-in explanation (works without AI).", "ok");
  }

  function friendlyAiError(err) {
    var m = err && err.message ? err.message : String(err || "unknown error");
    if (/401|invalid.*key|authentication/i.test(m)) return "Invalid API key — check console.anthropic.com";
    if (/rate.?limit|429|overloaded|529/i.test(m)) return "Anthropic is rate-limiting — wait and retry";
    if (/credit|billing|insufficient/i.test(m)) return "Anthropic account may be out of credits";
    return m;
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

  function explainWithAi() {
    if (!state.current) return;
    if (!state.apiKey) {
      setStatus("Add your Anthropic API key first (free at console.anthropic.com).", "error");
      return;
    }

    var btn = els.explainBtn;
    btn.disabled = true;
    setStatus("Asking Claude…");

    var q = state.current;
    var selectedText = state.selected >= 0 ? q.opts[state.selected] : "(no answer selected)";
    var correctText = q.opts[q.ans];

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
      "Do not mention that you are an AI. Unofficial study aid — not affiliated with CompTIA.";

    callClaude(system, prompt)
      .then(function (text) {
        var html = text
          .split("\n")
          .map(function (line) { return line.trim(); })
          .filter(Boolean)
          .map(function (line) {
            if (/^[-*•]/.test(line)) return "<li>" + esc(line.replace(/^[-*•]\s*/, "")) + "</li>";
            return "<p>" + esc(line) + "</p>";
          })
          .join("");

        if (html.indexOf("<li>") >= 0) {
          html = "<ul>" + html.replace(/<p><li>/g, "<li>").replace(/<\/li><\/p>/g, "</li>") + "</ul>";
        }

        showResult("AI explanation", html);
        setStatus("AI explanation ready.", "ok");
      })
      .catch(function (err) {
        setStatus(friendlyAiError(err), "error");
      })
      .finally(function () {
        btn.disabled = false;
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
      domain: "Custom question",
      stem: stem,
      opts: opts,
      ans: 0,
      exp: null
    });

    setStatus("Custom question loaded. AI can still explain — built-in answer not set.", "ok");
  }

  function bind() {
    els.saveKeyBtn.addEventListener("click", function () {
      state.apiKey = els.apiKey.value.trim();
      state.model = els.apiModel.value.trim() || DEFAULT_MODEL;
      saveSettings();
      setStatus("API settings saved locally.", "ok");
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
      checkBtn: $("checkBtn"),
      explainBtn: $("explainBtn"),
      revealBtn: $("revealBtn"),
      loadCustomBtn: $("loadCustomBtn")
    };

    loadSettings();
    els.apiKey.value = state.apiKey;
    els.apiModel.value = state.model || DEFAULT_MODEL;

    renderPills();
    if (SAMPLE_QUESTIONS.length) {
      var first = els.questionPills.querySelector(".pill");
      if (first) {
        first.classList.add("active");
        renderQuestion(SAMPLE_QUESTIONS[0]);
      }
    }

    bind();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
