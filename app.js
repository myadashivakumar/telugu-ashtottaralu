(function () {
  "use strict";

  var teluguDigits = ["౦", "౧", "౨", "౩", "౪", "౫", "౬", "౭", "౮", "౯"];

  function toTeluguNumeral(n) {
    return String(n).split("").map(function (d) {
      return teluguDigits[Number(d)];
    }).join("");
  }

  var homeView = document.getElementById("view-home");
  var detailView = document.getElementById("view-detail");
  var grid = document.getElementById("shrine-grid");
  var nameList = document.getElementById("name-list");
  var detailTitle = document.getElementById("detail-title");
  var detailSubtitle = document.getElementById("detail-subtitle");
  var detailSymbol = document.getElementById("detail-symbol");
  var detailEndText = document.getElementById("detail-end-text");
  var btnBack = document.getElementById("btn-back");

  function symbolSvg(name) {
    return '<svg viewBox="0 0 100 100"><use href="#icon-' + name + '"></use></svg>';
  }

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
      card.setAttribute("aria-label", d.telugu + " అష్టోత్తర శతనామావళి");
      card.innerHTML =
        '<div class="shrine-card__symbol">' + symbolSvg(d.symbol) + '</div>' +
        '<p class="shrine-card__telugu">' + d.telugu + '</p>' +
        '<p class="shrine-card__english">' + d.english + '</p>' +
        '<span class="shrine-card__count">108 నామాలు</span>';
      card.addEventListener("click", function () { openDeity(id); });
      frag.appendChild(card);
    });
    grid.appendChild(frag);
  }

  function openDeity(id) {
    var d = DEITIES[id];
    if (!d) return;

    document.documentElement.style.setProperty("--deity-color", d.color);
    document.documentElement.style.setProperty("--deity-soft", d.colorSoft);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", d.color);

    detailSymbol.innerHTML = symbolSvg(d.symbol);
    detailTitle.textContent = d.telugu + " అష్టోత్తర శతనామావళి";
    detailSubtitle.textContent = d.english + " Ashtottara Shatanamavali \u00B7 108 Names";
    detailEndText.textContent = "\u0965 ఇతి " + d.telugu + " అష్టోత్తరశతనామావళిః సమాప్తా \u0965";

    nameList.innerHTML = "";
    var frag = document.createDocumentFragment();
    d.names.forEach(function (name, i) {
      var li = document.createElement("li");
      li.innerHTML =
        '<span class="name-list__num">' + toTeluguNumeral(i + 1) + '</span>' +
        '<span class="name-list__text">' + name + '</span>';
      frag.appendChild(li);
    });
    nameList.appendChild(frag);

    homeView.hidden = true;
    detailView.hidden = false;
    detailView.scrollTop = 0;
    window.scrollTo(0, 0);
    history.pushState({ deity: id }, "", "#" + id);
  }

  function goHome() {
    detailView.hidden = true;
    homeView.hidden = false;
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", "#4A1420");
    window.scrollTo(0, 0);
    if (location.hash) history.pushState({}, "", location.pathname);
  }

  btnBack.addEventListener("click", goHome);

  window.addEventListener("popstate", function (e) {
    if (e.state && e.state.deity) {
      openDeity(e.state.deity);
    } else {
      goHome();
    }
  });

  renderGrid();

  // Deep-link on load, e.g. index.html#ganesha
  var initialId = location.hash ? location.hash.slice(1) : null;
  if (initialId && DEITIES[initialId]) {
    openDeity(initialId);
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
