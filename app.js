(function () {
  "use strict";

  var viewHome = document.getElementById("view-home");
  var viewDeity = document.getElementById("view-deity");
  var viewReading = document.getElementById("view-reading");
  var grid = document.getElementById("shrine-grid");

  var deityPortrait = document.getElementById("deity-portrait");
  var deityName = document.getElementById("deity-name");
  var deitySubtitle = document.getElementById("deity-subtitle");
  var contentCardList = document.getElementById("content-card-list");
  var btnBackDeity = document.getElementById("btn-back-deity");

  var readingHeaderTitle = document.getElementById("reading-header-title");
  var readingTitle = document.getElementById("reading-title");
  var readingSubtitle = document.getElementById("reading-subtitle");
  var readingContentEl = document.getElementById("reading-content");
  var readingEnd = document.getElementById("reading-end");
  var readingEndText = document.getElementById("reading-end-text");
  var btnBackReading = document.getElementById("btn-back-reading");

  var bottomNav = document.getElementById("bottom-nav");
  var navHome = document.getElementById("nav-home");
  var navReading = document.getElementById("nav-reading");
  var navPanchangam = document.getElementById("nav-panchangam");
  var navAudio = document.getElementById("nav-audio");
  var navShare = document.getElementById("nav-share");

  var moreMenu = document.getElementById("more-menu");
  var moreMenuBackdrop = document.getElementById("more-menu-backdrop");
  var btnMenu = document.getElementById("btn-menu");

  var prevTabBtn = document.getElementById("prev-tab");
  var nextTabBtn = document.getElementById("next-tab");

  var DEFAULT_THEME_COLOR = "#7C1D1D";
  var DEFAULT_DEITY_SOFT = "#F4E1E1";

  function symbolSvg(name) {
    return '<svg viewBox="0 0 100 100"><use href="#icon-' + name + '"></use></svg>';
  }

  function portraitHtml(d) {
    return '<div class="portrait-fallback">' + symbolSvg(d.symbol) + '</div>';
  }

  function setThemeColor(d) {
    document.documentElement.style.setProperty("--deity-color", d ? d.color : DEFAULT_THEME_COLOR);
    document.documentElement.style.setProperty("--deity-soft", d ? d.colorSoft : DEFAULT_DEITY_SOFT);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", d ? d.color : DEFAULT_THEME_COLOR);
  }

  // ---------------- HOME ----------------

  function renderGrid() {
    var frag = document.createDocumentFragment();
    DEITY_ORDER.forEach(function (id) {
      var d = DEITIES[id];
      var card = document.createElement("button");
      card.type = "button";
      card.className = "shrine-card";
      card.setAttribute("role", "listitem");
      card.style.setProperty("--card-color", d.color);
      card.style.setProperty("--card-soft", d.colorSoft);
      card.setAttribute("aria-label", d.telugu);
      card.dataset.search = (d.telugu + " " + d.english).toLowerCase();
      card.innerHTML =
        '<div class="shrine-card__portrait">' + portraitHtml(d) + '</div>' +
        '<p class="shrine-card__telugu">' + d.telugu + '</p>' +
        '<p class="shrine-card__english">' + d.english + '</p>';
      card.addEventListener("click", function () { openDeityDetail(id); });
      frag.appendChild(card);
    });
    grid.appendChild(frag);
  }

  function wireSearch() {
    var input = document.getElementById("search-input");
    var empty = document.getElementById("search-empty");
    if (!input) return;
    input.addEventListener("input", function () {
      var q = input.value.trim().toLowerCase();
      var cards = grid.querySelectorAll(".shrine-card");
      var visibleCount = 0;
      cards.forEach(function (card) {
        var match = !q || card.dataset.search.indexOf(q) !== -1;
        card.hidden = !match;
        if (match) visibleCount++;
      });
      empty.hidden = visibleCount !== 0;
    });
  }

  // ---------------- DEITY DETAIL (vertical content cards) ----------------

  // Every deity's content is a list of "tabs" (label + names/verses). Deities
  // without an explicit tabs array (navagraha, adityahrudayam) are treated as
  // a single implicit tab so the same card list works for every deity.
  function contentList(d) {
    return d.tabs || [{ label: d.telugu, type: d.type, names: d.names, verses: d.verses }];
  }

  // Icon is chosen generically from the tab's shape/label — never from the
  // deity id — so this works the same for every deity.
  function tabIcon(tab) {
    if (tab.type === "text") return "📜";
    if (tab.names) return "🪔";
    var label = tab.label || "";
    if (label.indexOf("తాళం") !== -1 || label.indexOf("పాట") !== -1 ||
        label.indexOf("హారతి") !== -1 || label.indexOf("వరాసనం") !== -1) return "🎵";
    return "📖";
  }

  function tabMeta(tab) {
    if (tab.names) return tab.names.length + " నామాలు";
    if (tab.verses) return tab.verses.length + " శ్లోకాలు";
    return "";
  }

  function renderContentCards(d, id) {
    contentCardList.innerHTML = "";
    var frag = document.createDocumentFragment();
    contentList(d).forEach(function (tab, i) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "content-card";
      btn.setAttribute("role", "listitem");
      btn.setAttribute("aria-label", tab.label);
      btn.innerHTML =
        '<span class="content-card__icon" aria-hidden="true">' + tabIcon(tab) + '</span>' +
        '<span class="content-card__body">' +
          '<p class="content-card__label">' + tab.label + '</p>' +
          '<p class="content-card__meta">' + tabMeta(tab) + '</p>' +
        '</span>' +
        '<span class="content-card__chevron" aria-hidden="true">›</span>';
      btn.addEventListener("click", function () { openReading(id, i); });
      frag.appendChild(btn);
    });
    contentCardList.appendChild(frag);
  }

  function showDeityDetail(id) {
    var d = DEITIES[id];
    if (!d) { showHome(); return; }

    setThemeColor(d);
    deityPortrait.innerHTML = portraitHtml(d);
    deityName.textContent = d.telugu;
    deitySubtitle.textContent = d.english;
    renderContentCards(d, id);

    viewHome.hidden = true;
    viewDeity.hidden = false;
    viewReading.hidden = true;
    bottomNav.hidden = false;
    updateNavActive("deity");
    window.scrollTo(0, 0);
  }

  // ---------------- READING SCREEN ----------------

  function renderReadingContent(d, content) {
    readingContentEl.innerHTML = "";
    readingContentEl.className = "reading-content";

    if (content.type === "text") {
      readingContentEl.classList.add("is-text");
      var paragraphs = content.paragraphs || (content.text ? content.text.split(/\n{2,}/) : []);
      var fragT = document.createDocumentFragment();
      paragraphs.forEach(function (p) {
        if (!p) return;
        var el = document.createElement("p");
        el.className = "reading-paragraph";
        el.textContent = p;
        fragT.appendChild(el);
      });
      readingContentEl.appendChild(fragT);
      readingEnd.hidden = true;
    } else if (content.type === "verses") {
      readingContentEl.classList.add("is-verses");
      var fragV = document.createDocumentFragment();
      content.verses.forEach(function (v) {
        var div = document.createElement("div");
        div.className = "reading-verse";
        var html = "";
        var label = v.label || v.title;
        if (label) html += '<p class="reading-verse__label">' + label + '</p>';
        html += '<p class="reading-verse__text">' + v.lines.join("<br>") + '</p>';
        div.innerHTML = html;
        fragV.appendChild(div);
      });
      readingContentEl.appendChild(fragV);
      if (d.endText) {
        readingEndText.textContent = "॥ " + d.endText + " ॥";
        readingEnd.hidden = false;
      } else {
        readingEnd.hidden = true;
      }
    } else {
      readingContentEl.classList.add("is-names");
      var fragN = document.createDocumentFragment();
      content.names.forEach(function (name, i) {
        var div = document.createElement("div");
        div.className = "reading-item";
        div.innerHTML =
          '<span class="reading-item__num">' + (i + 1) + '</span>' +
          '<span class="reading-item__text">' + name + '</span>';
        fragN.appendChild(div);
      });
      readingContentEl.appendChild(fragN);
      readingEndText.textContent = "॥ ఇతి " + d.telugu + " అష్టోత్తరశతనామావళిః సమాప్తా ॥";
      readingEnd.hidden = false;
    }
  }

  var currentReadingId = null;
  var currentReadingTabIndex = 0;

  function showReading(id, tabIndex) {
    var d = DEITIES[id];
    if (!d) { showHome(); return; }
    var list = contentList(d);
    var content = list[tabIndex];
    if (!content) { showDeityDetail(id); return; }

    currentReadingId = id;
    currentReadingTabIndex = tabIndex;

    setThemeColor(d);
    var label = content.label || d.telugu;
    readingHeaderTitle.textContent = label;
    readingTitle.textContent = label;
    readingSubtitle.textContent = d.telugu;
    renderReadingContent(d, content);

    prevTabBtn.disabled = tabIndex <= 0;
    nextTabBtn.disabled = tabIndex >= list.length - 1;

    viewHome.hidden = true;
    viewDeity.hidden = true;
    viewReading.hidden = false;
    bottomNav.hidden = true;
    window.scrollTo(0, 0);
  }

  function goToAdjacentTab(delta) {
    if (!currentReadingId) return;
    var list = contentList(DEITIES[currentReadingId]);
    var newIndex = currentReadingTabIndex + delta;
    if (newIndex < 0 || newIndex >= list.length) return;
    openReading(currentReadingId, newIndex);
  }

  // ---------------- HOME ----------------

  function showHome() {
    setThemeColor(null);
    viewHome.hidden = false;
    viewDeity.hidden = true;
    viewReading.hidden = true;
    bottomNav.hidden = false;
    updateNavActive("home");
    window.scrollTo(0, 0);
  }

  // ---------------- navigation / history ----------------

  function openDeityDetail(id) {
    showDeityDetail(id);
    history.pushState({ v: "deity", id: id }, "", "#" + id);
  }

  function openReading(id, tabIndex) {
    showReading(id, tabIndex);
    history.pushState({ v: "reading", id: id, tab: tabIndex }, "", "#" + id + "/" + tabIndex);
  }

  function goHome() {
    showHome();
    history.pushState({ v: "home" }, "", location.pathname);
  }

  btnBackDeity.addEventListener("click", function () { history.back(); });
  btnBackReading.addEventListener("click", function () { history.back(); });

  window.addEventListener("popstate", function (e) {
    var state = e.state || { v: "home" };
    if (state.v === "reading") showReading(state.id, state.tab);
    else if (state.v === "deity") showDeityDetail(state.id);
    else showHome();
  });

  // ---------------- bottom navigation ----------------

  function updateNavActive(view) {
    var items = bottomNav.querySelectorAll(".bottom-nav__item");
    items.forEach(function (b) { b.classList.remove("is-active"); });
    if (view === "home") navHome.classList.add("is-active");
    else if (view === "deity" || view === "reading") navReading.classList.add("is-active");
  }

  navHome.addEventListener("click", goHome);

  var toastTimer = null;
  function showToast(message) {
    var el = document.getElementById("toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "toast";
      el.className = "toast";
      document.body.appendChild(el);
    }
    el.textContent = message;
    el.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove("is-visible"); }, 2000);
  }

  // "పఠనం" / "ఆడియో" don't have a dedicated section yet — show a coming-soon
  // notice rather than faking functionality.
  navReading.addEventListener("click", function () { showToast("త్వరలో అందుబాటులోకి వస్తుంది"); });
  navAudio.addEventListener("click", function () { showToast("త్వరలో అందుబాటులోకి వస్తుంది"); });

  navPanchangam.addEventListener("click", function () {
    goHome();
    var panchangamEl = document.getElementById("panchangam");
    if (panchangamEl && !panchangamEl.hidden) {
      panchangamEl.scrollIntoView({ block: "start" });
    }
  });

  function openMoreMenu() { moreMenu.hidden = false; }
  function closeMoreMenu() { moreMenu.hidden = true; }

  btnMenu.addEventListener("click", openMoreMenu);
  moreMenuBackdrop.addEventListener("click", closeMoreMenu);
  document.querySelectorAll(".more-menu__item").forEach(function (b) {
    b.addEventListener("click", closeMoreMenu);
  });

  navShare.addEventListener("click", function () {
    var shareData = { title: document.title, text: document.title, url: location.href };
    if (navigator.share) {
      navigator.share(shareData).catch(function () {});
      return;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareData.url).then(function () {
        showToast("లింక్ కాపీ చేయబడింది");
      }).catch(function () {});
    }
  });

  // ---------------- reading screen: move to prev/next item in the list ----------------

  prevTabBtn.addEventListener("click", function () { goToAdjacentTab(-1); });
  nextTabBtn.addEventListener("click", function () { goToAdjacentTab(1); });

  // ---------------- round header clock (shown on every screen) ----------------

  var CLOCK_FACE_SVG =
    '<svg viewBox="0 0 36 36" width="26" height="26" aria-hidden="true">' +
      '<circle cx="18" cy="18" r="16" fill="var(--surface)" stroke="currentColor" stroke-width="1.5"/>' +
      '<line x1="18" y1="4" x2="18" y2="7" stroke="currentColor" stroke-width="1.2"/>' +
      '<line x1="18" y1="32" x2="18" y2="29" stroke="currentColor" stroke-width="1.2"/>' +
      '<line x1="4" y1="18" x2="7" y2="18" stroke="currentColor" stroke-width="1.2"/>' +
      '<line x1="32" y1="18" x2="29" y2="18" stroke="currentColor" stroke-width="1.2"/>' +
      '<line class="clock-hand clock-hand--hour" x1="18" y1="18" x2="18" y2="10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
      '<line class="clock-hand clock-hand--minute" x1="18" y1="18" x2="18" y2="6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' +
      '<line class="clock-hand clock-hand--second" x1="18" y1="18" x2="18" y2="5" stroke="var(--maroon)" stroke-width="1" stroke-linecap="round"/>' +
      '<circle cx="18" cy="18" r="1.6" fill="var(--maroon)"/>' +
    '</svg>';

  document.querySelectorAll(".header-clock").forEach(function (el) { el.innerHTML = CLOCK_FACE_SVG; });

  function tickHeaderClock() {
    var now = new Date();
    var h = now.getHours() % 12, m = now.getMinutes(), s = now.getSeconds();
    var hourDeg = (h + m / 60) * 30;
    var minDeg = (m + s / 60) * 6;
    var secDeg = s * 6;
    document.querySelectorAll(".clock-hand--hour").forEach(function (el) { el.setAttribute("transform", "rotate(" + hourDeg + " 18 18)"); });
    document.querySelectorAll(".clock-hand--minute").forEach(function (el) { el.setAttribute("transform", "rotate(" + minDeg + " 18 18)"); });
    document.querySelectorAll(".clock-hand--second").forEach(function (el) { el.setAttribute("transform", "rotate(" + secDeg + " 18 18)"); });
  }

  tickHeaderClock();
  setInterval(tickHeaderClock, 1000);

  // ---------------- boot ----------------

  renderGrid();
  wireSearch();

  history.replaceState({ v: "home" }, "", location.pathname);
  showHome();

  // Deep-link on load, e.g. index.html#ganesha or index.html#ganesha/2
  if (location.hash) {
    var parts = location.hash.slice(1).split("/");
    var initialId = parts[0];
    if (DEITIES[initialId]) {
      showDeityDetail(initialId);
      history.pushState({ v: "deity", id: initialId }, "", "#" + initialId);
      if (parts[1] !== undefined) {
        var tabIndex = parseInt(parts[1], 10);
        if (!isNaN(tabIndex) && contentList(DEITIES[initialId])[tabIndex]) {
          showReading(initialId, tabIndex);
          history.pushState({ v: "reading", id: initialId, tab: tabIndex }, "", "#" + initialId + "/" + tabIndex);
        }
      }
    }
  }

  // Register service worker for offline use
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("service-worker.js").catch(function () {
        /* offline install still works from cache on repeat visits */
      });
    });
  }
})();
