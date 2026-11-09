(() => {
  "use strict";
  const C = window.CONFIG;
  const $ = (id) => document.getElementById(id);
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const norm = (s) =>
    s.toLowerCase().trim().replace(/ł/g, "l").normalize("NFD").replace(/[̀-ͯ]/g, "");
  const vibrate = (p) => { try { navigator.vibrate && navigator.vibrate(p); } catch (_) {} };

  document.title = C.pageTitle;

  // ---------------- screens & progress ----------------
  const ORDER = ["intro", "login", "quiz", "game", "scratch", "question", "finale"];
  const progress = $("progress");
  ORDER.forEach(() => progress.appendChild(document.createElement("span")));

  function show(name) {
    document.querySelectorAll(".screen").forEach((s) =>
      s.classList.toggle("active", s.dataset.screen === name)
    );
    const idx = ORDER.indexOf(name);
    [...progress.children].forEach((dot, i) => {
      dot.className = i < idx ? "done" : i === idx ? "current" : "";
    });
    const init = INIT[name];
    if (init) init();
  }

  function shake(el) {
    el.classList.remove("shake");
    void el.offsetWidth;
    el.classList.add("shake");
  }

  function setMsg(el, text, ok) {
    el.textContent = text;
    el.className = "msg " + (ok ? "ok" : "err");
  }

  // ---------------- background hearts ----------------
  (function bgHearts() {
    const box = $("bg-hearts");
    const glyphs = ["💜", "🤍", "💗", "✨"];
    for (let i = 0; i < 14; i++) {
      const h = document.createElement("span");
      h.className = "bg-heart";
      h.textContent = glyphs[i % glyphs.length];
      h.style.left = Math.random() * 100 + "%";
      h.style.fontSize = 14 + Math.random() * 22 + "px";
      h.style.animationDuration = 12 + Math.random() * 14 + "s";
      h.style.animationDelay = -Math.random() * 20 + "s";
      box.appendChild(h);
    }
  })();

  // ---------------- 1. intro ----------------
  async function initIntro() {
    const out = $("terminal-text");
    const cursor = '<span class="cursor">&nbsp;</span>';
    let text = "";
    for (const line of C.introLines) {
      for (const ch of line) {
        text += ch;
        out.innerHTML = escapeHtml(text) + cursor;
        await sleep(28);
      }
      text += "\n";
      await sleep(350);
    }
    $("intro-btn").classList.remove("hidden");
  }
  $("intro-btn").addEventListener("click", () => show("login"));

  function escapeHtml(s) {
    return s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
  }

  // ---------------- 2. login ----------------
  let loginFails = 0;
  $("login-title").textContent = C.login.title;
  $("login-subtitle").textContent = C.login.subtitle;
  $("login-label").textContent = C.login.label;

  $("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const input = $("login-input");
    const msg = $("login-msg");
    const ok = C.login.answers.map(norm).includes(norm(input.value));
    if (ok) {
      input.blur();
      setMsg(msg, C.login.successMsg, true);
      vibrate(60);
      await sleep(1300);
      show("quiz");
    } else {
      const hints = C.login.hints;
      setMsg(msg, hints[Math.min(loginFails, hints.length - 1)], false);
      loginFails++;
      shake(input);
      vibrate([40, 40, 40]);
      input.select();
    }
  });

  // ---------------- 3. quiz ----------------
  let qIndex = 0;

  function initQuiz() {
    renderQuestion();
  }

  function renderQuestion() {
    const q = C.quiz[qIndex];
    const body = $("quiz-body");
    const msg = $("quiz-msg");
    $("quiz-counter").textContent = `Pytanie ${qIndex + 1} / ${C.quiz.length}`;
    $("quiz-question").textContent = q.question;
    msg.textContent = "";
    msg.className = "msg";
    $("quiz-next").classList.add("hidden");
    body.innerHTML = "";

    if (q.type === "choice") {
      q.options.forEach((opt, i) => {
        const b = document.createElement("button");
        b.className = "option";
        b.textContent = opt;
        b.addEventListener("click", () => {
          if (q.correct === "all" || q.correct === i) {
            body.querySelectorAll(".option").forEach((o, j) => {
              o.disabled = true;
              if (q.correct === "all" || j === i) o.classList.add("right");
            });
            answered(q);
          } else {
            b.classList.add("wrong");
            shake(b);
            vibrate([40, 40, 40]);
            setMsg(msg, q.wrongMsg, false);
          }
        });
        body.appendChild(b);
      });
    } else {
      const form = document.createElement("form");
      form.autocomplete = "off";
      form.innerHTML =
        '<input type="text" autocapitalize="off" autocorrect="off" spellcheck="false">' +
        '<button class="btn" type="submit">Sprawdź</button>';
      const input = form.querySelector("input");
      input.placeholder = q.placeholder || "";
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (q.answers.map(norm).includes(norm(input.value))) {
          input.disabled = true;
          form.querySelector("button").classList.add("hidden");
          input.blur();
          answered(q);
        } else {
          shake(input);
          vibrate([40, 40, 40]);
          setMsg(msg, q.wrongMsg, false);
          input.select();
        }
      });
      body.appendChild(form);
    }
  }

  function answered(q) {
    setMsg($("quiz-msg"), q.rightMsg, true);
    vibrate(60);
    const next = $("quiz-next");
    next.textContent = qIndex === C.quiz.length - 1 ? "Dalej 💜" : "Dalej →";
    next.classList.remove("hidden");
  }

  $("quiz-next").addEventListener("click", () => {
    qIndex++;
    if (qIndex < C.quiz.length) renderQuestion();
    else show("game");
  });

  // ---------------- 4. game ----------------
  $("game-title").textContent = C.game.title;
  $("game-subtitle").textContent = C.game.subtitle;
  let caught = 0;
  let spawnTimer = null;

  function initGame() {
    caught = 0;
    updateMeter();
    const area = $("game-area");
    area.innerHTML = "";
    spawnTimer = setInterval(() => spawnHeart(area), 650);
    spawnHeart(area);
  }

  function spawnHeart(area) {
    const h = document.createElement("span");
    h.className = "float-heart";
    h.textContent = ["💜", "💗", "💖", "🤍"][Math.floor(Math.random() * 4)];
    const w = area.clientWidth;
    h.style.left = Math.random() * Math.max(0, w - 70) + "px";
    const dur = 3.2 + Math.random() * 2;
    h.style.animationDuration = dur + "s";
    h.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      catchHeart(h, area);
    }, { once: true });
    h.addEventListener("animationend", () => h.remove());
    area.appendChild(h);
  }

  function catchHeart(h, area) {
    const hr = h.getBoundingClientRect();
    const ar = area.getBoundingClientRect();
    h.remove();
    const pop = document.createElement("span");
    pop.className = "pop";
    pop.textContent = "+💜";
    pop.style.left = hr.left - ar.left + hr.width / 2 + "px";
    pop.style.top = hr.top - ar.top + "px";
    pop.addEventListener("animationend", () => pop.remove());
    area.appendChild(pop);
    vibrate(25);
    caught++;
    updateMeter();
    if (caught >= C.game.heartsToWin) finishGame(area);
  }

  function updateMeter() {
    const pct = Math.min(100, Math.round((caught / C.game.heartsToWin) * 100));
    $("meter-fill").style.width = pct + "%";
    $("meter-label").textContent = pct + "%";
  }

  async function finishGame(area) {
    clearInterval(spawnTimer);
    area.querySelectorAll(".float-heart").forEach((h) => (h.style.pointerEvents = "none"));
    const label = $("meter-label");
    for (const t of ["100%", "150%", "300%", "999%", "∞ 💜"]) {
      label.textContent = t;
      await sleep(280);
    }
    $("game-subtitle").textContent = C.game.doneMsg;
    vibrate([80, 60, 80]);
    $("game-next").classList.remove("hidden");
  }
  $("game-next").addEventListener("click", () => show("scratch"));

  // ---------------- 5. scratch ----------------
  $("scratch-title").textContent = C.scratch.title;
  $("scratch-subtitle").textContent = C.scratch.subtitle;
  $("scratch-secret").textContent = C.scratch.secret;
  let scratchReady = false;

  function initScratch() {
    if (scratchReady) return;
    scratchReady = true;
    const canvas = $("scratch-canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const g = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    g.addColorStop(0, "#8a6ad8");
    g.addColorStop(1, "#b69cf5");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, rect.width, rect.height);
    ctx.fillStyle = "rgba(255,255,255,.25)";
    for (let i = 0; i < 40; i++) {
      ctx.font = 12 + Math.random() * 14 + "px serif";
      ctx.fillText("♥", Math.random() * rect.width, Math.random() * rect.height);
    }
    ctx.fillStyle = "#fff";
    ctx.font = "700 22px Quicksand, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(C.scratch.coverText, rect.width / 2, rect.height / 2);

    ctx.globalCompositeOperation = "destination-out";
    ctx.lineWidth = 44;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    let drawing = false;
    let last = null;
    let moves = 0;
    let done = false;
    const pos = (e) => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };

    canvas.addEventListener("pointerdown", (e) => {
      drawing = true;
      last = pos(e);
      canvas.setPointerCapture(e.pointerId);
      ctx.beginPath();
      ctx.arc(last.x, last.y, 22, 0, Math.PI * 2);
      ctx.fill();
    });
    canvas.addEventListener("pointermove", (e) => {
      if (done) return;
      const p = pos(e);
      if (!drawing) {
        if (!e.buttons) return; // przeciąganie zaczęte tuż obok zdrapki
        drawing = true;
        last = p;
      }
      ctx.beginPath();
      ctx.moveTo(last.x, last.y);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      last = p;
      if (++moves % 12 === 0) checkCleared();
    });
    const stop = () => { drawing = false; checkCleared(); };
    canvas.addEventListener("pointerup", stop);
    canvas.addEventListener("pointercancel", stop);

    function checkCleared() {
      if (done) return;
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let clear = 0;
      const step = 16; // co 4. piksel
      for (let i = 3; i < data.length; i += step) if (data[i] === 0) clear++;
      if (clear / (data.length / step) > 0.5) {
        done = true;
        canvas.style.opacity = "0";
        canvas.style.pointerEvents = "none";
        vibrate([60, 40, 120]);
        $("scratch-next").classList.remove("hidden");
      }
    }
  }
  $("scratch-next").addEventListener("click", () => show("question"));

  // ---------------- 6. question ----------------
  const yesBtn = $("q-yes");
  const noBtn = $("q-no");
  const zone = $("q-zone");
  let noTries = 0;
  $("q-text").textContent = C.question.text;
  yesBtn.textContent = C.question.yes;
  noBtn.textContent = C.question.noTexts[0];

  function dodge(e) {
    e.preventDefault();
    noTries++;
    const texts = C.question.noTexts;
    if (noTries >= texts.length) {
      noBtn.textContent = C.question.yes;
      noBtn.className = "btn runaway";
      noBtn.removeEventListener("pointerdown", dodge);
      noBtn.addEventListener("click", sayYes);
      return;
    }
    noBtn.textContent = texts[noTries];
    noBtn.classList.add("runaway");
    const zr = zone.getBoundingClientRect();
    const bw = noBtn.offsetWidth;
    const bh = noBtn.offsetHeight;
    noBtn.style.left = Math.random() * Math.max(0, zr.width - bw) + "px";
    noBtn.style.top = Math.random() * Math.max(0, zr.height - bh) + "px";
    yesBtn.style.transform = `scale(${1 + noTries * 0.12})`;
    vibrate(20);
  }
  noBtn.addEventListener("pointerdown", dodge);
  noBtn.addEventListener("click", (e) => e.preventDefault());
  yesBtn.addEventListener("click", sayYes);

  function sayYes() {
    show("finale");
  }

  // ---------------- 7. finale ----------------
  async function initFinale() {
    $("finale-headline").textContent = C.finale.headline;
    $("finale-signature").textContent = C.finale.signature;
    $("replay").textContent = C.finale.replay;
    const letter = $("finale-letter");
    letter.innerHTML = "";
    const ps = C.finale.letter.map((t) => {
      const p = document.createElement("p");
      p.textContent = t;
      letter.appendChild(p);
      return p;
    });

    confetti(70);
    vibrate([120, 80, 120, 80, 400]);

    await sleep(900);
    const n = $("notification");
    n.querySelector(".notif-title").textContent = C.finale.notificationTitle;
    n.querySelector(".notif-text").textContent = C.finale.notificationText;
    n.classList.add("show");
    setTimeout(() => n.classList.remove("show"), 4500);

    for (const p of ps) {
      await sleep(1100);
      p.classList.add("show");
    }
    await sleep(900);
    $("finale-signature").classList.add("show");
    confetti(40);
  }

  function confetti(count) {
    const glyphs = ["💜", "💜", "🤍", "🪻", "✨"];
    for (let i = 0; i < count; i++) {
      const c = document.createElement("span");
      c.className = "confetti";
      c.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
      c.style.left = Math.random() * 100 + "vw";
      c.style.fontSize = 14 + Math.random() * 18 + "px";
      c.style.animationDuration = 2.5 + Math.random() * 3 + "s";
      c.style.animationDelay = Math.random() * 1.5 + "s";
      c.style.setProperty("--rot", (Math.random() * 720 - 360) + "deg");
      c.addEventListener("animationend", () => c.remove());
      document.body.appendChild(c);
    }
  }

  $("replay").addEventListener("click", () => location.reload());

  // ---------------- start ----------------
  const INIT = {
    intro: initIntro,
    quiz: initQuiz,
    game: initGame,
    scratch: initScratch,
    finale: initFinale,
  };
  show("intro");
})();
