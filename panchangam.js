(function () {
  "use strict";

  if (typeof SunCalc === "undefined") return;

  var DEFAULT_LAT = 17.3850; // Hyderabad — used when location isn't available
  var DEFAULT_LON = 78.4867;

  var TELUGU_WEEKDAY = ["ఆదివారం", "సోమవారం", "మంగళవారం", "బుధవారం", "గురువారం", "శుక్రవారం", "శనివారం"];
  var TELUGU_MONTH = ["జనవరి", "ఫిబ్రవరి", "మార్చి", "ఏప్రిల్", "మే", "జూన్", "జూలై", "ఆగస్టు", "సెప్టెంబర్", "అక్టోబర్", "నవంబర్", "డిసెంబర్"];

  // Day-of-week (Sun=0..Sat=6) -> which of the 8 daylight parts (1-8, counted
  // from sunrise) is Rahukalam. Cross-checked against multiple panchangam
  // references; this is the standard method.
  var RAHU_PART = [8, 2, 7, 5, 6, 4, 3];

  function pad2(n) { return n < 10 ? "0" + n : "" + n; }

  function formatTime(date, withSeconds) {
    if (!date || isNaN(date.getTime())) return "—";
    var h = date.getHours(), m = date.getMinutes(), s = date.getSeconds();
    var ampm = h >= 12 ? "PM" : "AM";
    var h12 = h % 12;
    if (h12 === 0) h12 = 12;
    return h12 + ":" + pad2(m) + (withSeconds ? ":" + pad2(s) : "") + " " + ampm;
  }

  function daylightPart(sunrise, sunset, partIndex) {
    var totalMs = sunset.getTime() - sunrise.getTime();
    var partMs = totalMs / 8;
    var start = new Date(sunrise.getTime() + (partIndex - 1) * partMs);
    var end = new Date(sunrise.getTime() + partIndex * partMs);
    return [start, end];
  }

  var clockTimer = null;

  function tickClock() {
    var el = document.getElementById("panchangam-clock");
    if (!el) { clearInterval(clockTimer); clockTimer = null; return; }
    el.textContent = formatTime(new Date(), true);
  }

  function render(lat, lon, note) {
    var el = document.getElementById("panchangam");
    if (!el) return;

    var now = new Date();
    var times = SunCalc.getTimes(now, lat, lon);
    var dow = now.getDay();
    var rahu = daylightPart(times.sunrise, times.sunset, RAHU_PART[dow]);
    var dateStr = now.getDate() + " " + TELUGU_MONTH[now.getMonth()] + " " + now.getFullYear();

    el.innerHTML =
      '<div class="panchangam__head">' +
        '<span class="panchangam__date">' + dateStr + '</span>' +
        '<span class="panchangam__day">' + TELUGU_WEEKDAY[dow] + '</span>' +
      '</div>' +
      '<div class="panchangam__grid">' +
        '<div class="panchangam__item"><span class="panchangam__label">ప్రస్తుత సమయం</span><span class="panchangam__value" id="panchangam-clock">' + formatTime(now, true) + '</span></div>' +
        '<div class="panchangam__item"><span class="panchangam__label">సూర్యోదయం</span><span class="panchangam__value">' + formatTime(times.sunrise) + '</span></div>' +
        '<div class="panchangam__item"><span class="panchangam__label">సూర్యాస్తమయం</span><span class="panchangam__value">' + formatTime(times.sunset) + '</span></div>' +
        '<div class="panchangam__item"><span class="panchangam__label">రాహుకాలం</span><span class="panchangam__value">' + formatTime(rahu[0]) + ' – ' + formatTime(rahu[1]) + '</span></div>' +
      '</div>' +
      (note ? '<p class="panchangam__note">' + note + '</p>' : '');
    el.hidden = false;

    if (clockTimer) clearInterval(clockTimer);
    clockTimer = setInterval(tickClock, 1000);
  }

  function init() {
    if (!navigator.geolocation) {
      render(DEFAULT_LAT, DEFAULT_LON, "మీ బ్రౌజర్‌లో లొకేషన్ లేదు కాబట్టి హైదరాబాద్ కోసం చూపబడింది");
      return;
    }
    var settled = false;
    // Safety net only, for browsers that never call either geolocation
    // callback — kept well above the 8s option below so a real in-flight
    // fix (which routinely takes a few seconds longer than 4s on a cold
    // network-based lookup) always gets the chance to win first.
    var fallbackTimer = setTimeout(function () {
      if (settled) return;
      settled = true;
      render(DEFAULT_LAT, DEFAULT_LON, "హైదరాబాద్ కోసం చూపబడింది");
    }, 12000);

    navigator.geolocation.getCurrentPosition(
      function (pos) {
        if (settled) return;
        settled = true;
        clearTimeout(fallbackTimer);
        render(pos.coords.latitude, pos.coords.longitude, null);
      },
      function () {
        if (settled) return;
        settled = true;
        clearTimeout(fallbackTimer);
        render(DEFAULT_LAT, DEFAULT_LON, "లొకేషన్ అనుమతి లేదు కాబట్టి హైదరాబాద్ కోసం చూపబడింది");
      },
      { timeout: 8000, maximumAge: 600000 }
    );
  }

  init();
})();
