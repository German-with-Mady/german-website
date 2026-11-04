/* Learn Deutsch With Mady — tap any [data-say] element to hear it in German */
(function () {
  var synth = window.speechSynthesis;
  var voices = [];
  var current = null;
  var timer = null;

  function loadVoices() {
    if (synth) voices = synth.getVoices() || [];
  }
  if (synth) {
    loadVoices();
    if (typeof synth.onvoiceschanged !== "undefined") synth.onvoiceschanged = loadVoices;
  }

  function germanVoice() {
    for (var i = 0; i < voices.length; i++) {
      if (voices[i].lang === "de-DE") return voices[i];
    }
    for (var j = 0; j < voices.length; j++) {
      if (voices[j].lang && voices[j].lang.toLowerCase().indexOf("de") === 0) return voices[j];
    }
    return null;
  }

  function stopState() {
    if (current) current.classList.remove("is-speaking");
    current = null;
    clearTimeout(timer);
  }

  function toast(msg) {
    var t = document.createElement("div");
    t.className = "toast";
    t.setAttribute("role", "status");
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 3200);
  }

  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-say]");
    if (!el) return;

    if (!synth) {
      toast("This browser can't play audio. Try Chrome or Safari.");
      return;
    }

    synth.cancel();
    stopState();

    var u = new SpeechSynthesisUtterance(el.getAttribute("data-say"));
    u.lang = "de-DE";
    u.rate = parseFloat(el.getAttribute("data-rate")) || 0.7;
    var v = germanVoice();
    if (v) u.voice = v;

    current = el;
    el.classList.add("is-speaking");

    var done = function () { if (current === el) stopState(); };
    u.onend = done;
    u.onerror = done;
    timer = setTimeout(done, 6000);   // safety: never leave a tile stuck

    synth.speak(u);
  });
})();
