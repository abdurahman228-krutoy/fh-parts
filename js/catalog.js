/* Главная страница: категории, поиск, фильтры, сетка товаров */
(function () {
  var U = window.FHU;
  var PRODUCTS = window.PRODUCTS, CATEGORIES = window.CATEGORIES, MODELS = window.MODELS;

  var state = { q: "", cat: "", model: "" };

  var $ = function (id) { return document.getElementById(id); };
  var grid = $("grid"), empty = $("empty"), resultText = $("resultText"), resetBtn = $("reset");
  var qInput = $("q"), heroQ = $("heroQ");

  /* Индекс для поиска */
  PRODUCTS.forEach(function (p) {
    p._hay = U.norm([p.title, p.short, p.description, p.keywords, U.categoryName(p.category), (p.models || []).join(" "), (p.lot || []).join(" ")].join(" "));
    p._hayCompact = p._hay.replace(/ /g, "");
  });

  function matches(p) {
    if (state.cat && p.category !== state.cat) return false;
    if (state.model && (p.models || []).indexOf(state.model) === -1) return false;
    var q = U.norm(state.q);
    if (!q) return true;
    return q.split(" ").every(function (t) {
      return p._hay.indexOf(t) !== -1 || p._hayCompact.indexOf(t) !== -1;
    });
  }

  function countByCat(id) {
    return PRODUCTS.filter(function (p) { return p.category === id; }).length;
  }

  function plural(n, a, b, c) {
    var m = n % 100, d = n % 10;
    if (m > 10 && m < 20) return c;
    if (d === 1) return a;
    if (d > 1 && d < 5) return b;
    return c;
  }

  /* ---- Отрисовка статических частей ---- */
  function renderCats() {
    $("cats").innerHTML = CATEGORIES.map(function (c) {
      var n = countByCat(c.id);
      return '<button class="cat" type="button" data-cat="' + c.id + '">' + U.icon(c.icon) +
        '<b>' + U.esc(c.name) + '</b><small>' + n + ' ' + plural(n, "позиция", "позиции", "позиций") + '</small></button>';
    }).join("");
  }

  function renderChips() {
    var cc = '<button class="chip" type="button" data-cat="">Все</button>' + CATEGORIES.map(function (c) {
      return '<button class="chip" type="button" data-cat="' + c.id + '">' + U.esc(c.name) + '</button>';
    }).join("");
    $("catChips").innerHTML = cc;

    var mc = '<span class="chip-label">Модель</span><button class="chip" type="button" data-model="">Все</button>' + MODELS.map(function (m) {
      return '<button class="chip" type="button" data-model="' + U.esc(m) + '">' + U.esc(m) + '</button>';
    }).join("");
    $("modelChips").innerHTML = mc;

    $("quick").innerHTML = ["Land Cruiser 200", "Lexus LX 570", "Prado 150", "Lexus LX 470", "Prado 250"].map(function (m) {
      return '<button type="button" data-quick-model="' + U.esc(m) + '">' + U.esc(m) + '</button>';
    }).join("");
  }

  function cardHtml(p) {
    var extra = "";
    if (p.video) extra = '<span class="badge-video">' + U.icon("play") + 'Видео</span>';
    var count = p.images.length > 1 ? '<span class="badge-count">' + p.images.length + ' фото</span>' : "";
    var models = (p.models && p.models.length) ? p.models.join(" · ") : p.short;
    return '<a class="card" href="' + U.productUrl(p) + '">' +
      '<div class="card-img"><img src="' + p.images[0] + '" alt="' + U.esc(p.title) + '" loading="lazy" width="900" height="900">' +
      '<span class="tag">' + U.esc(U.categoryName(p.category)) + '</span>' + count + extra + '</div>' +
      '<div class="card-body"><h3>' + U.esc(p.title) + '</h3><p class="models">' + U.esc(models) + '</p>' +
      '<span class="card-cta">Узнать цену ' + U.icon("arrow") + '</span></div></a>';
  }

  /* ---- Обновление списка ---- */
  function update(push) {
    var list = PRODUCTS.filter(matches);
    grid.innerHTML = list.map(cardHtml).join("");

    var n = list.length;
    resultText.textContent = "Найдено: " + n + " " + plural(n, "товар", "товара", "товаров");

    var filtered = state.q || state.cat || state.model;
    resetBtn.hidden = !filtered;

    // активные состояния
    document.querySelectorAll("#catChips .chip").forEach(function (b) { b.classList.toggle("active", b.dataset.cat === state.cat); });
    document.querySelectorAll("#modelChips .chip").forEach(function (b) { b.classList.toggle("active", b.dataset.model === state.model); });
    document.querySelectorAll("#cats .cat").forEach(function (b) { b.classList.toggle("active", b.dataset.cat === state.cat); });

    if (qInput.value !== state.q) qInput.value = state.q;
    if (heroQ.value !== state.q) heroQ.value = state.q;

    if (n === 0) {
      empty.hidden = false;
      var q = [state.q, state.model].filter(Boolean).join(", ");
      empty.innerHTML = '<h3>Ничего не нашли</h3><p>Возможно, нужная деталь есть на разборе, но ещё не добавлена на сайт. Напишите нам, найдём и пришлём фото.</p>' +
        '<a class="btn btn-wa" id="emptyWa" href="#">' + U.WA_ICON + 'Написать в WhatsApp</a>';
      U.bindWhatsApp($("emptyWa"), U.messageGeneric(q));
    } else {
      empty.hidden = true;
    }

    if (push !== false) {
      var p = new URLSearchParams();
      if (state.q) p.set("q", state.q);
      if (state.cat) p.set("cat", state.cat);
      if (state.model) p.set("model", state.model);
      var qs = p.toString();
      try { history.replaceState(null, "", qs ? "?" + qs + location.hash : location.pathname + location.hash); } catch (e) {}
    }
  }

  function scrollToCatalog() {
    var el = $("catalog");
    var top = el.getBoundingClientRect().top + window.pageYOffset - 70;
    window.scrollTo({ top: top, behavior: "smooth" });
  }

  /* ---- События ---- */
  var timer;
  qInput.addEventListener("input", function () {
    state.q = qInput.value;
    clearTimeout(timer);
    timer = setTimeout(update, 120);
  });

  $("heroSearch").addEventListener("submit", function (e) {
    e.preventDefault();
    state.q = heroQ.value;
    update();
    scrollToCatalog();
    heroQ.blur();
  });

  document.addEventListener("click", function (e) {
    var t = e.target.closest("button");
    if (!t) return;
    if (t.classList.contains("cat")) {
      state.cat = state.cat === t.dataset.cat ? "" : t.dataset.cat;
      update(); scrollToCatalog();
    } else if (t.closest("#catChips") && t.dataset.cat !== undefined) {
      state.cat = t.dataset.cat; update();
    } else if (t.closest("#modelChips") && t.dataset.model !== undefined) {
      state.model = t.dataset.model; update();
    } else if (t.dataset.quickModel) {
      state.model = t.dataset.quickModel; update(); scrollToCatalog();
    } else if (t === resetBtn) {
      state.q = ""; state.cat = ""; state.model = ""; update();
    }
  });

  /* ---- Старт ---- */
  $("statCount").textContent = PRODUCTS.length;
  $("heroSearchIcon").innerHTML = U.icon("search");
  $("catSearchIcon").innerHTML = U.icon("search");
  renderCats();
  renderChips();

  var cta = $("ctaWa");
  cta.innerHTML = U.WA_ICON + 'Написать в WhatsApp';
  U.bindWhatsApp(cta, "Здравствуйте! Хочу уточнить по запчастям FH Parts.");

  var params = new URLSearchParams(location.search);
  state.q = params.get("q") || "";
  state.cat = params.get("cat") || "";
  state.model = params.get("model") || "";
  update(false);
})();
