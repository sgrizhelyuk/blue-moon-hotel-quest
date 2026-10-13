/* The Blue Moon Hotel Mystery — prototype engine */
(function () {
  "use strict";

  var CLUES = window.CLUES;
  var SCENES = window.STORY.scenes;
  var SUSPECTS = window.SUSPECTS;
  var SAVE_KEY = "bmh_save_v1";

  var $ = function (id) { return document.getElementById(id); };
  var els = {
    title: $("titleScreen"), game: $("gameScreen"), end: $("endScreen"),
    btnStart: $("btnStart"), btnContinue: $("btnContinue"), btnAbout: $("btnAbout"),
    about: $("aboutModal"), btnAboutClose: $("btnAboutClose"),
    bg: $("bg"), sprites: $("sprites"), hotspots: $("hotspots"),
    chapterLabel: $("chapterLabel"), chapterCard: $("chapterCard"),
    dialogue: $("dialogue"), nameplate: $("nameplate"), lineText: $("lineText"),
    lineRu: $("lineRu"), btnNext: $("btnNext"),
    choices: $("choices"),
    topbar: $("topbar"),
    btnHome: $("btnHome"), btnNotebook: $("btnNotebook"),
    btnWatsonTop: $("btnWatsonTop"), btnLang: $("btnLang"),
    watsonPopup: $("watsonPopup"), watsonText: $("watsonText"), watsonClose: $("watsonClose"),
    notebook: $("notebookPanel"), notebookBody: $("notebookBody"), notebookClose: $("notebookClose"),
    taskPanel: $("taskPanel"), taskTitle: $("taskTitle"), taskBody: $("taskBody"), taskHint: $("taskHint"),
    toast: $("toast"),
    endBadges: $("endBadges"), btnRestart: $("btnRestart"), btnEndTitle: $("btnEndTitle")
  };

  var state = {
    scene: 0, pos: 0,
    clues: [],
    wrongChoices: 0, wrongTasks: 0,
    lang: "en",
    hint: "",
    typeTimer: null,
    typing: false,
    dialogCtx: null
  };

  /* ---------------- persistence ---------------- */

  function save() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({
        scene: state.scene, pos: state.pos, clues: state.clues,
        wrongChoices: state.wrongChoices, wrongTasks: state.wrongTasks, lang: state.lang
      }));
    } catch (e) { /* ignore */ }
  }
  function loadSave() {
    try { return JSON.parse(localStorage.getItem(SAVE_KEY)); } catch (e) { return null; }
  }
  function clearSave() { try { localStorage.removeItem(SAVE_KEY); } catch (e) { } }

  function resetState() {
    state.scene = 0; state.pos = 0; state.clues = [];
    state.wrongChoices = 0; state.wrongTasks = 0;
    state.hint = ""; state.typing = false;
    if (state.typeTimer) { clearInterval(state.typeTimer); state.typeTimer = null; }
  }

  /* ---------------- screens ---------------- */

  function showScreen(name) {
    els.title.hidden = name !== "title";
    els.game.hidden = name !== "game";
    els.end.hidden = name !== "end";
  }

  function initTitle() {
    var sv = loadSave();
    els.btnContinue.hidden = !sv;
    els.btnStart.onclick = function () {
      clearSave(); resetState(); save(); startGame();
    };
    els.btnContinue.onclick = function () {
      var s = loadSave();
      if (s) {
        resetState();
        state.scene = s.scene || 0; state.pos = s.pos || 0;
        state.clues = s.clues || [];
        state.wrongChoices = s.wrongChoices || 0;
        state.wrongTasks = s.wrongTasks || 0;
        state.lang = s.lang || "en";
        startGame();
      }
    };
    els.btnAbout.onclick = function () { els.about.hidden = false; };
    els.btnAboutClose.onclick = function () { els.about.hidden = true; };
  }

  /* ---------------- game flow ---------------- */

  function startGame() {
    showScreen("game");
    updateLangLabel();
    renderScene();
  }

  function renderScene() {
    var sc = SCENES[state.scene];
    if (!sc) { endGame(); return; }
    els.bg.src = sc.bg;
    els.chapterLabel.textContent = sc.chapter + " · " + sc.title;
    clearHotspots();
    els.sprites.innerHTML = "";
    sc.cast = sc.cast || {};
    Object.keys(sc.cast).forEach(function (name) {
      var c = sc.cast[name];
      setSprite(name, c);
    });
    chapterCard(sc.chapter + " — " + sc.title);
    els.taskPanel.hidden = true;
    els.choices.innerHTML = "";
    renderItem();
  }

  function chapterCard(text) {
    els.chapterCard.textContent = text;
    els.chapterCard.classList.add("show");
    setTimeout(function () { els.chapterCard.classList.remove("show"); }, 1800);
  }

  function setSprite(name, c) {
    var img = document.createElement("img");
    img.className = "sprite sprite-" + (c.side || "right");
    img.src = c.img;
    img.alt = name;
    els.sprites.appendChild(img);
  }

  function clearSprites() { els.sprites.innerHTML = ""; }

  function renderItem() {
    var sc = SCENES[state.scene];
    if (!sc || state.pos >= sc.items.length) { nextScene(); return; }
    var item = sc.items[state.pos];
    state.dialogCtx = item;

    if (item.bg) { els.bg.src = item.bg; state.pos++; renderItem(); return; }
    if (item.clearChars) { clearSprites(); delete sc.cast.Alex; delete sc.cast.Emma; delete sc.cast.Tim; state.pos++; renderItem(); return; }
    if (item.cast) {
      Object.keys(item.cast).forEach(function (n) {
        sc.cast[n] = item.cast[n];
        setSprite(n, item.cast[n]);
      });
    }
    if (item.note) { addClue(item.note.clue, true); state.pos++; renderItem(); return; }
    if (item.vocab) { showVocab(item.vocab); return; }
    if (item.prompt && item.opts) { renderChoice(item); return; }
    if (item.clues) { startClueMode(item.clues); return; }
    if (item.task) { startTask(item.task); return; }
    if (item.end) { endGame(); return; }
    renderDialogue(item);
  }

  function renderDialogue(item) {
    els.choices.innerHTML = "";
    els.dialogue.hidden = false;
    var sc = SCENES[state.scene];
    if (item.sp && sc.cast && sc.cast[item.sp]) {
      /* sprite already present; ensure it is visible */
    }
    els.nameplate.hidden = !item.sp;
    els.nameplate.textContent = item.sp || "";
    els.lineText.className = item.sp ? "line" : "line narration";
    els.lineRu.hidden = !(item.ru && state.lang === "both");
    els.lineRu.textContent = item.ru || "";
    state.hint = item.hint || sc.objective || "";
    typeText(item.t || "");
  }

  function typeText(text) {
    if (state.typeTimer) { clearInterval(state.typeTimer); state.typeTimer = null; }
    state.typing = true;
    els.btnNext.hidden = true;
    var i = 0;
    els.lineText.textContent = "";
    state.typeTimer = setInterval(function () {
      i += 2;
      els.lineText.textContent = text.slice(0, i);
      if (i >= text.length) {
        clearInterval(state.typeTimer);
        state.typeTimer = null;
        state.typing = false;
        els.btnNext.hidden = false;
      }
    }, 18);
  }

  function advance() {
    state.pos++;
    save();
    renderItem();
  }

  function nextScene() {
    state.scene++;
    state.pos = 0;
    save();
    if (state.scene >= SCENES.length) { endGame(); return; }
    renderScene();
  }

  /* ---------------- choices ---------------- */

  function renderChoice(item) {
    renderDialogue({ sp: item.prompt.sp, t: item.prompt.t, ru: item.prompt.ru, hint: item.prompt.hint });
    els.btnNext.hidden = true;
    els.choices.innerHTML = "";
    item.opts.forEach(function (opt) {
      var b = document.createElement("button");
      b.className = "choice-btn";
      b.innerHTML = '<span class="choice-en"></span><span class="choice-ru"></span>';
      b.querySelector(".choice-en").textContent = opt.t;
      if (opt.ru && state.lang === "both") { b.querySelector(".choice-ru").textContent = opt.ru; }
      b.onclick = function () {
        if (opt.ok) {
          if (opt.fb) { toast(opt.fb, "good"); }
          advance();
        } else {
          state.wrongChoices++;
          save();
          openWatson(opt.fb || "Think about politeness and grammar. Try again!");
        }
      };
      els.choices.appendChild(b);
    });
  }

  /* ---------------- tasks ---------------- */

  function startTask(task) {
    els.taskPanel.hidden = false;
    els.taskTitle.textContent = task.title || "Task";
    els.taskHint.textContent = task.ru || "";
    els.taskBody.innerHTML = "";

    if (task.kind === "tf") renderTF(task);
    else if (task.kind === "quiz") renderQuiz(task);
    else if (task.kind === "multi") renderMulti(task);
    else if (task.kind === "order") renderOrder(task);
  }

  function taskDone(msg) {
    els.taskPanel.hidden = true;
    toast(msg || "Correct! Well done.", "good");
    advance();
  }

  function renderTF(task) {
    var answered = 0;
    task.stmts.forEach(function (st) {
      var row = document.createElement("div");
      row.className = "tf-row";
      var p = document.createElement("p");
      p.textContent = st.t;
      if (st.ru) {
        var r = document.createElement("span");
        r.className = "ru";
        r.textContent = st.ru;
        p.appendChild(r);
      }
      row.appendChild(p);
      var wrap = document.createElement("div");
      wrap.className = "tf-btns";
      [["True", true], ["False", false]].forEach(function (pair) {
        var b = document.createElement("button");
        b.textContent = pair[0];
        b.className = "mini-btn";
        b.onclick = function () {
          if (row.dataset.done) { return; }
          row.dataset.done = "1";
          if (pair[1] === st.a) {
            b.classList.add("ok");
          } else {
            b.classList.add("bad");
            state.wrongTasks++;
            save();
            openWatson("Not quite. Read the scene once more — the answer is in the dialogue.");
          }
          answered++;
          if (answered === task.stmts.length) {
            setTimeout(function () { taskDone(); }, 400);
          }
        };
        wrap.appendChild(b);
      });
      row.appendChild(wrap);
      els.taskBody.appendChild(row);
    });
  }

  function renderQuiz(task) {
    var q = document.createElement("p");
    q.className = "task-q";
    q.textContent = task.q;
    if (task.ru) {
      var r = document.createElement("span");
      r.className = "ru";
      r.textContent = task.ru;
      q.appendChild(r);
    }
    els.taskBody.appendChild(q);
    task.opts.forEach(function (opt, i) {
      var b = document.createElement("button");
      b.className = "mini-btn wide";
      b.textContent = opt;
      b.onclick = function () {
        if (i === task.a) {
          b.classList.add("ok");
          taskDone("Correct!");
        } else {
          b.classList.add("bad");
          state.wrongTasks++;
          save();
          openWatson(task.why || "Try again. Read the options carefully.");
        }
      };
      els.taskBody.appendChild(b);
    });
  }

  function renderMulti(task) {
    var picked = [];
    task.opts.forEach(function (opt, i) {
      var b = document.createElement("button");
      b.className = "mini-btn wide";
      b.textContent = opt;
      b.onclick = function () {
        if (b.classList.contains("picked")) {
          b.classList.remove("picked");
          picked = picked.filter(function (x) { return x !== i; });
        } else {
          b.classList.add("picked");
          picked.push(i);
        }
      };
      els.taskBody.appendChild(b);
    });
    var check = document.createElement("button");
    check.className = "mini-btn wide check";
    check.textContent = "Check";
    check.onclick = function () {
      var ok = picked.length === task.a.length && task.a.every(function (x) { return picked.indexOf(x) !== -1; });
      if (ok) { taskDone("Strong evidence!"); }
      else {
        state.wrongTasks++;
        save();
        openWatson(task.why || "Pick exactly three clues that prove guilt.");
      }
    };
    els.taskBody.appendChild(check);
  }

  function renderOrder(task) {
    var correct = task.answer.indexOf("|") !== -1
      ? task.answer.split("|").map(function (s) { return s.trim(); })
      : task.answer.split(/\s+/);
    var shuffled = task.words.slice().sort(function () { return Math.random() - 0.5; });
    var built = [];

    var builtBox = document.createElement("div");
    builtBox.className = "order-built";
    var poolBox = document.createElement("div");
    poolBox.className = "order-pool";

    function redraw() {
      builtBox.innerHTML = "";
      built.forEach(function (w, i) {
        var c = document.createElement("button");
        c.className = "chip built";
        c.textContent = w;
        c.onclick = function () { built.splice(i, 1); redraw(); };
        builtBox.appendChild(c);
      });
      poolBox.innerHTML = "";
      shuffled.forEach(function (w, i) {
        if (built.indexOf(w) !== -1 && task.answer.indexOf("|") === -1) { return; }
        var c = document.createElement("button");
        c.className = "chip";
        c.textContent = w;
        c.onclick = function () {
          built.push(w);
          if (task.answer.indexOf("|") === -1) { shuffled.splice(shuffled.indexOf(w), 1); }
          redraw();
        };
        poolBox.appendChild(c);
      });
    }
    redraw();

    var check = document.createElement("button");
    check.className = "mini-btn wide check";
    check.textContent = "Check";
    check.onclick = function () {
      var ok = built.length === correct.length;
      if (ok) {
        for (var i = 0; i < correct.length; i++) {
          if (built[i].toLowerCase().replace(/\s+/g, " ") !== correct[i].toLowerCase().replace(/\s+/g, " ")) { ok = false; break; }
        }
      }
      if (ok) { taskDone("Perfect order!"); }
      else {
        state.wrongTasks++;
        save();
        openWatson("Not yet. Think about the correct order — you can click a word to remove it.");
      }
    };

    els.taskBody.appendChild(builtBox);
    els.taskBody.appendChild(poolBox);
    els.taskBody.appendChild(check);
  }

  /* ---------------- vocabulary ---------------- */

  function showVocab(v) {
    els.taskPanel.hidden = false;
    els.taskTitle.textContent = "Mini-dictionary";
    els.taskHint.textContent = "New words from this scene";
    els.taskBody.innerHTML = "";
    var list = document.createElement("div");
    list.className = "vocab-list";
    v.words.forEach(function (pair) {
      var row = document.createElement("div");
      row.className = "vocab-row";
      row.innerHTML = '<span class="vocab-en"></span><span class="vocab-ru"></span>';
      row.querySelector(".vocab-en").textContent = pair[0];
      row.querySelector(".vocab-ru").textContent = pair[1];
      list.appendChild(row);
    });
    els.taskBody.appendChild(list);
    var cont = document.createElement("button");
    cont.className = "mini-btn wide check";
    cont.textContent = "Continue";
    cont.onclick = function () { els.taskPanel.hidden = true; advance(); };
    els.taskBody.appendChild(cont);
  }

  /* ---------------- clue scenes ---------------- */

  function clearHotspots() { els.hotspots.innerHTML = ""; }

  function startClueMode(cfg) {
    els.dialogue.hidden = true;
    els.choices.innerHTML = "";
    els.hotspots.innerHTML = "";
    var found = 0;
    var total = cfg.hotspots.length;
    var doneTimers = [];

    function place(x, y, w, h, cls, handler) {
      var d = document.createElement("div");
      d.className = "hotspot " + (cls || "");
      d.style.left = (x * 100) + "%";
      d.style.top = (y * 100) + "%";
      d.style.width = (w * 100) + "%";
      d.style.height = (h * 100) + "%";
      d.onclick = handler;
      els.hotspots.appendChild(d);
      return d;
    }

    cfg.hotspots.forEach(function (hs) {
      var clue = CLUES[hs.id];
      var d = place(hs.x, hs.y, hs.w, hs.h, "clue", function () {
        if (d.dataset.found) { return; }
        d.dataset.found = "1";
        d.classList.add("found");
        addClue(hs.id, false);
        if (clue && clue.img) {
          var ic = document.createElement("img");
          ic.className = "found-icon";
          ic.src = clue.img;
          d.appendChild(ic);
        }
        found++;
        if (found === total) {
          doneTimers.push(setTimeout(function () {
            els.dialogue.hidden = false;
            els.nameplate.hidden = true;
            els.lineRu.hidden = true;
            els.lineText.className = "line narration";
            els.lineText.textContent = "You found everything. Time to continue.";
            els.btnNext.hidden = false;
            els.hotspots.innerHTML = "";
          }, 900));
        }
      });
    });

    (cfg.duds || []).forEach(function (dud) {
      place(dud.x, dud.y, dud.w, dud.h, "dud", function () {
        toast(dud.msg, "info");
      });
    });
  }

  /* ---------------- notebook & clues ---------------- */

  function addClue(id, silent) {
    var c = CLUES[id];
    if (!c) { return; }
    if (state.clues.indexOf(id) === -1) { state.clues.push(id); save(); }
    if (!silent) { toast("Clue added: " + c.name, "good"); }
    else { toast("Notebook updated: " + c.name, "info"); }
  }

  function openNotebook() {
    var body = els.notebookBody;
    body.innerHTML = "";
    var h1 = document.createElement("h3");
    h1.textContent = "Clues (" + state.clues.length + "/" + Object.keys(CLUES).length + ")";
    body.appendChild(h1);
    if (state.clues.length === 0) {
      var non = document.createElement("p");
      non.textContent = "No clues yet. Explore the lobby!";
      body.appendChild(non);
    }
    state.clues.forEach(function (id) {
      var c = CLUES[id];
      var row = document.createElement("div");
      row.className = "clue-row";
      if (c.img) {
        var im = document.createElement("img");
        im.src = c.img;
        row.appendChild(im);
      }
      var tx = document.createElement("div");
      tx.innerHTML = "<b>" + c.name + "</b> <span class='ru'>" + c.ru + "</span><br><small>" + (c.note || "") + "</small>";
      row.appendChild(tx);
      body.appendChild(row);
    });
    var h2 = document.createElement("h3");
    h2.textContent = "Suspects";
    body.appendChild(h2);
    SUSPECTS.forEach(function (s) {
      var row = document.createElement("div");
      row.className = "clue-row";
      var im = document.createElement("img");
      im.src = s.img;
      row.appendChild(im);
      var tx = document.createElement("div");
      tx.innerHTML = "<b>" + s.name + "</b> <span class='ru'>" + s.ru + "</span><br><small>" + s.note + "</small>";
      row.appendChild(tx);
      body.appendChild(row);
    });
    els.notebook.hidden = false;
  }

  /* ---------------- Watson ---------------- */

  function openWatson(text) {
    els.watsonText.textContent = text;
    els.watsonPopup.hidden = false;
  }

  /* ---------------- toast ---------------- */

  var toastTimer = null;
  function toast(msg, kind) {
    els.toast.textContent = msg;
    els.toast.className = "toast " + (kind || "");
    els.toast.hidden = false;
    if (toastTimer) { clearTimeout(toastTimer); }
    toastTimer = setTimeout(function () { els.toast.hidden = true; }, 2600);
  }

  /* ---------------- language ---------------- */

  function updateLangLabel() {
    els.btnLang.title = state.lang === "both" ? "Show English only" : "Show Russian translation";
    els.btnLang.classList.toggle("on", state.lang === "both");
  }

  function toggleLang() {
    state.lang = state.lang === "both" ? "en" : "both";
    save();
    updateLangLabel();
    var item = state.dialogCtx;
    els.lineRu.hidden = !(item && item.ru && state.lang === "both");
    els.lineRu.textContent = (item && item.ru && state.lang === "both") ? item.ru : "";
    var sc = SCENES[state.scene];
    var cur = sc && sc.items[state.pos];
    if (cur && cur.opts) {
      var btns = els.choices.querySelectorAll(".choice-ru");
      cur.opts.forEach(function (opt, i) {
        if (btns[i]) { btns[i].textContent = state.lang === "both" ? (opt.ru || "") : ""; }
      });
    }
  }

  /* ---------------- end screen ---------------- */

  function endGame() {
    clearSave();
    var allClues = state.clues.length === Object.keys(CLUES).length;
    var badges = [
      { img: "assets/UI_badge_case_closed.png", name: "Case Closed", ru: "Дело закрыто", got: true },
      { img: "assets/UI_magnifier_cursor.png", name: "Sharp Eye", ru: "Острый глаз", got: allClues },
      { img: "assets/UI_owl_hint.png", name: "Polite Detective", ru: "Вежливый детектив", got: state.wrongChoices === 0 },
      { img: "assets/UI_logo_emblem.png", name: "Grammar Master", ru: "Грамматика без ошибок", got: state.wrongTasks === 0 }
    ];
    els.endBadges.innerHTML = "";
    badges.forEach(function (b) {
      var d = document.createElement("div");
      d.className = "badge " + (b.got ? "got" : "missed");
      var im = document.createElement("img");
      im.src = b.img;
      im.alt = b.name;
      d.appendChild(im);
      var t = document.createElement("div");
      t.innerHTML = "<b>" + b.name + "</b><br><span class='ru'>" + b.ru + "</span><br><small>" + (b.got ? "Earned" : "Not earned this time") + "</small>";
      d.appendChild(t);
      els.endBadges.appendChild(d);
    });
    showScreen("end");
  }

  /* ---------------- wire up ---------------- */

  function wire() {
    els.btnNext.onclick = function () {
      if (state.typing) {
        if (state.typeTimer) { clearInterval(state.typeTimer); state.typeTimer = null; }
        state.typing = false;
        els.lineText.textContent = (state.dialogCtx && state.dialogCtx.t) || "";
        els.btnNext.hidden = false;
        return;
      }
      els.btnNext.hidden = true;
      advance();
    };
    els.btnHome.onclick = function () {
      save();
      if (state.typeTimer) { clearInterval(state.typeTimer); state.typeTimer = null; }
      els.taskPanel.hidden = true;
      els.notebook.hidden = true;
      els.watsonPopup.hidden = true;
      clearHotspots();
      showScreen("title");
      initTitle();
    };
    els.btnNotebook.onclick = openNotebook;
    els.notebookClose.onclick = function () { els.notebook.hidden = true; };
    els.btnWatsonTop.onclick = function () {
      openWatson(state.hint || "Read the dialogue and choose the best answer.");
    };
    els.watsonClose.onclick = function () { els.watsonPopup.hidden = true; };
    els.btnLang.onclick = toggleLang;
    els.btnRestart.onclick = function () { resetState(); clearSave(); startGame(); };
    els.btnEndTitle.onclick = function () { clearHotspots(); showScreen("title"); initTitle(); };
  }

  document.addEventListener("DOMContentLoaded", function () {
    wire();
    initTitle();
    showScreen("title");
  });
})();
