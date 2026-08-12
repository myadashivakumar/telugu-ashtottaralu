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
  var detailTabs = document.getElementById("detail-tabs");
  var detailEnd = document.getElementById("detail-end");
  var detailEndText = document.getElementById("detail-end-text");
  var btnBack = document.getElementById("btn-back");

  function symbolSvg(name) {
    return '<svg viewBox="0 0 100 100"><use href="#icon-' + name + '"></use></svg>';
  }

  function portraitHtml(d, size) {
    if (d.image) {
      return '<img src="' + d.image + '" alt="" loading="lazy" width="' + size + '" height="' + size + '">';
    }
    return '<div class="portrait-fallback">' + symbolSvg(d.symbol) + '</div>';
  }

  // The first tab (or the deity itself, if it has no tabs) is what a
  // grid card badge / aria-label should describe.
  function primaryContent(d) {
    return d.tabs ? d.tabs[0] : d;
  }

  function countBadge(d) {
    var content = primaryContent(d);
    if (content.type === "verses") {
      return content.verses.length + " శ్లోకాలు";
    }
    return content.names.length + " నామాలు";
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
      card.setAttribute("aria-label", d.telugu);
      card.innerHTML =
        '<div class="shrine-card__portrait">' + portraitHtml(d, 200) + '</div>' +
        '<p class="shrine-card__telugu">' + d.telugu + '</p>' +
        '<p class="shrine-card__english">' + d.english + '</p>' +
        '<span class="shrine-card__count">' + countBadge(d) + '</span>';
      card.addEventListener("click", function () { openDeity(id); });
      frag.appendChild(card);
    });
    grid.appendChild(frag);
  }

  function renderNames(names) {
    nameList.className = "name-list";
    nameList.innerHTML = "";
    var frag = document.createDocumentFragment();
    names.forEach(function (name, i) {
      var li = document.createElement("li");
      li.innerHTML =
        '<span class="name-list__num">' + toTeluguNumeral(i + 1) + '</span>' +
        '<span class="name-list__text">' + name + '</span>';
      frag.appendChild(li);
    });
    nameList.appendChild(frag);
  }

  function renderVerses(verses) {
    nameList.className = "name-list verse-list";
    nameList.innerHTML = "";
    var frag = document.createDocumentFragment();
    verses.forEach(function (v) {
      var li = document.createElement("li");
      li.className = "verse-item";
      var html = "";
      if (v.label) html += '<p class="verse-item__label">' + v.label + '</p>';
      html += '<p class="verse-item__text">' + v.lines.join("<br>") + '</p>';
      li.innerHTML = html;
      frag.appendChild(li);
    });
    nameList.appendChild(frag);
  }

  // Renders whichever tab/content is active and updates the title,
  // subtitle and closing colophon to match its shape (names vs verses).
  function renderActive(d, content, tabLabel) {
    if (content.type === "verses") {
      renderVerses(content.verses);
      detailTitle.textContent = d.tabs ? (d.telugu + " " + tabLabel) : d.telugu;
      detailSubtitle.textContent = d.english + " · " + content.verses.length + " Verses";
      if (d.endText) {
        detailEndText.textContent = "॥ " + d.endText + " ॥";
        detailEnd.hidden = false;
      } else {
        detailEnd.hidden = true;
      }
    } else {
      renderNames(content.names);
      detailTitle.textContent = d.telugu + (d.tabs ? " " + tabLabel : " అష్టోత్తర శతనామావళి");
      detailSubtitle.textContent = d.english + " Ashtottara Shatanamavali · " + content.names.length + " Names";
      detailEndText.textContent = "॥ ఇతి " + d.telugu + " అష్టోత్తరశతనామావళిః సమాప్తా ॥";
      detailEnd.hidden = false;
    }
  }

  function openDeity(id) {
    var d = DEITIES[id];
    if (!d) return;

    document.documentElement.style.setProperty("--deity-color", d.color);
    document.documentElement.style.setProperty("--deity-soft", d.colorSoft);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", d.color);

    detailSymbol.innerHTML = portraitHtml(d, 300);

    if (d.tabs) {
      detailTabs.hidden = false;
      detailTabs.innerHTML = "";
      d.tabs.forEach(function (tab, i) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "detail-tabs__btn" + (i === 0 ? " is-active" : "");
        btn.textContent = tab.label;
        btn.addEventListener("click", function () {
          var siblings = detailTabs.querySelectorAll(".detail-tabs__btn");
          for (var j = 0; j < siblings.length; j++) siblings[j].classList.remove("is-active");
          btn.classList.add("is-active");
          renderActive(d, tab, tab.label);
          nameList.scrollIntoView({ block: "start" });
        });
        detailTabs.appendChild(btn);
      });
      renderActive(d, d.tabs[0], d.tabs[0].label);
    } else {
      detailTabs.hidden = true;
      detailTabs.innerHTML = "";
      renderActive(d, d, null);
    }

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
    if (meta) meta.setAttribute("content", "#221A12");
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
