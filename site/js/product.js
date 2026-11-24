/* Страница товара */
(function () {
  var U = window.FHU;
  var PRODUCTS = window.PRODUCTS;
  var app = document.getElementById("app");
  var id = new URLSearchParams(location.search).get("id");
  var p = PRODUCTS.filter(function (x) { return x.id === id; })[0];

  if (!p) {
    app.innerHTML = '<div class="empty" style="margin:32px 0"><h3>Товар не найден</h3><p>Возможно, ссылка устарела. Посмотрите весь каталог.</p><a class="btn btn-dark" href="./#catalog">В каталог</a></div>';
    return;
  }

  document.title = p.title + ": FH Parts";
  var meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute("content", p.short + " Контрактные запчасти из Дубая, доставка в РФ и КЗ.");

  var catName = U.categoryName(p.category);
  var models = (p.models && p.models.length) ? p.models.join(", ") : "Уточняйте по VIN";

  var thumbs = "";
  if (p.images.length > 1) {
    thumbs = '<div class="thumbs">' + p.images.map(function (src, i) {
      return '<button class="thumb' + (i === 0 ? " active" : "") + '" type="button" data-i="' + i + '" aria-label="Фото ' + (i + 1) + '"><img src="' + src + '" alt="" loading="lazy"></button>';
    }).join("") + '</div>';
  }

  var videoHtml = "";
  if (p.video) {
    videoHtml = '<div class="block"><h2>Видео товара</h2><div class="video-box"><video controls playsinline preload="metadata" poster="' + p.images[0] + '"><source src="' + p.video + '" type="video/mp4"></video></div></div>';
  }

  var lot = (p.lot && p.lot.length) ? '<div class="block"><h2>Что входит</h2><ul class="list">' + p.lot.map(function (t) {
    return '<li>' + U.icon("check") + '<span>' + U.esc(t) + '</span></li>';
  }).join("") + '</ul></div>' : "";

  app.innerHTML =
    '<nav class="crumbs" aria-label="Навигация">' +
      '<a href="./">' + U.icon("back") + 'Каталог</a><span>/</span>' +
      '<a href="./?cat=' + p.category + '#catalog">' + U.esc(catName) + '</a>' +
    '</nav>' +
    '<article class="product">' +
      '<div class="gallery">' +
        '<div class="main-img" id="mainImg"><img id="mainPhoto" src="' + p.images[0] + '" alt="' + U.esc(p.title) + '" width="900" height="900"></div>' +
        thumbs +
      '</div>' +
      '<div class="info">' +
        '<div class="tagline"><span class="pill red">' + U.esc(catName) + '</span><span class="pill">Артикул ' + U.skuOf(p) + '</span><span class="pill">Б/у, контрактная</span></div>' +
        '<h1>' + U.esc(p.title) + '</h1>' +
        '<p class="short">' + U.esc(p.short) + '</p>' +
        '<div class="price-note">' + U.icon("ship") + '<div><b>Цена договорная</b><span>Уточните цену и доставку в Россию или Казахстан в WhatsApp</span></div></div>' +
        '<div class="block"><h2>Описание</h2><p>' + U.esc(p.description) + '</p></div>' +
        lot +
        '<div class="block"><h2>Характеристики</h2><dl class="specs">' +
          '<dt>Категория</dt><dd>' + U.esc(catName) + '</dd>' +
          '<dt>Подходит для</dt><dd>' + U.esc(models) + '</dd>' +
          '<dt>Артикул</dt><dd>' + U.skuOf(p) + '</dd>' +
          '<dt>Склад</dt><dd>Дубай, ОАЭ</dd>' +
        '</dl></div>' +
        videoHtml +
        '<div class="actions">' +
          '<a class="btn btn-wa btn-block" id="waBtn"></a>' +
          '<p style="margin:0;color:var(--muted);font-size:13px;text-align:center">Название и артикул товара подставятся в сообщение автоматически</p>' +
        '</div>' +
      '</div>' +
    '</article>' +
    '<section class="related" id="related"></section>';

  /* Кнопки WhatsApp */
  var text = U.messageFor(p);
  var label = U.WA_ICON + 'Написать в WhatsApp';
  var wa = document.getElementById("waBtn");
  wa.innerHTML = label;
  U.bindWhatsApp(wa, text);

  var sticky = document.getElementById("stickyBar");
  var sw = document.getElementById("stickyWa");
  sw.innerHTML = label;
  U.bindWhatsApp(sw, text);
  sticky.hidden = false;

  /* Галерея */
  var cur = 0;
  var mainPhoto = document.getElementById("mainPhoto");
  function show(i) {
    cur = (i + p.images.length) % p.images.length;
    mainPhoto.src = p.images[cur];
    document.querySelectorAll(".thumb").forEach(function (t, k) { t.classList.toggle("active", k === cur); });
  }
  document.querySelectorAll(".thumb").forEach(function (t) {
    t.addEventListener("click", function () { show(parseInt(t.dataset.i, 10)); });
  });

  /* Лайтбокс */
  var lb = document.getElementById("lb"), lbImg = document.getElementById("lbImg"), lbCount = document.getElementById("lbCount");
  document.getElementById("lbClose").innerHTML = U.icon("close");
  document.getElementById("lbPrev").innerHTML = U.icon("arrow");
  document.getElementById("lbNext").innerHTML = U.icon("arrow");
  var many = p.images.length > 1;
  document.getElementById("lbPrev").style.display = many ? "" : "none";
  document.getElementById("lbNext").style.display = many ? "" : "none";

  function lbShow(i) {
    cur = (i + p.images.length) % p.images.length;
    lbImg.src = p.images[cur];
    lbImg.alt = p.title;
    lbCount.textContent = many ? (cur + 1) + " / " + p.images.length : "";
    show(cur);
  }
  function lbOpen() { lbShow(cur); lb.classList.add("open"); document.body.style.overflow = "hidden"; }
  function lbClose() { lb.classList.remove("open"); document.body.style.overflow = ""; }
  document.getElementById("mainImg").addEventListener("click", lbOpen);
  document.getElementById("lbClose").addEventListener("click", lbClose);
  document.getElementById("lbPrev").addEventListener("click", function () { lbShow(cur - 1); });
  document.getElementById("lbNext").addEventListener("click", function () { lbShow(cur + 1); });
  lb.addEventListener("click", function (e) { if (e.target === lb) lbClose(); });
  document.addEventListener("keydown", function (e) {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") lbClose();
    if (e.key === "ArrowLeft") lbShow(cur - 1);
    if (e.key === "ArrowRight") lbShow(cur + 1);
  });
  // свайп в лайтбоксе
  var sx = null;
  lb.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", function (e) {
    if (sx === null || !many) return;
    var dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 50) lbShow(cur + (dx < 0 ? 1 : -1));
    sx = null;
  });

  /* Похожие товары */
  var rel = PRODUCTS.filter(function (x) { return x !== p && x.category === p.category; });
  var rest = PRODUCTS.filter(function (x) { return x !== p && x.category !== p.category; });
  rel = rel.concat(rest).slice(0, 4);
  document.getElementById("related").innerHTML = '<h2>Смотрите также</h2><div class="grid">' + rel.map(function (r) {
    return '<a class="card" href="' + U.productUrl(r) + '"><div class="card-img"><img src="' + r.images[0] + '" alt="' + U.esc(r.title) + '" loading="lazy" width="900" height="900"><span class="tag">' + U.esc(U.categoryName(r.category)) + '</span></div>' +
      '<div class="card-body"><h3>' + U.esc(r.title) + '</h3><span class="card-cta">Узнать цену ' + U.icon("arrow") + '</span></div></a>';
  }).join("") + '</div>';
})();
