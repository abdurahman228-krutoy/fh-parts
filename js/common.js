/* Общие функции: иконки, поиск, WhatsApp */
(function () {
  var ICONS = {
    car: '<path d="M3 14l1.6-4.6A2 2 0 0 1 6.5 8h11a2 2 0 0 1 1.9 1.4L21 14M3 14v4h2m-2-4h18m0 0v4h-2M7 18h10"/><circle cx="7.5" cy="14.5" r=".8"/><circle cx="16.5" cy="14.5" r=".8"/>',
    door: '<path d="M5 20V9l4-4h8a2 2 0 0 1 2 2v13H5z"/><path d="M9 5v5h10M14 14h3"/>',
    light: '<path d="M4 8c0-1 1-2 3-2h6c4 0 7 3 7 6s-3 6-7 6H7c-2 0-3-1-3-2V8z"/><path d="M8 10l6 1M8 14l6-1"/>',
    wheel: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2.2"/><path d="M3.5 10.5c3 .3 5.3.8 6.5 1.5M20.5 10.5c-3 .3-5.3.8-6.5 1.5M12 14.2V20"/>',
    climate: '<path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4"/>',
    engine: '<path d="M4 9h3l1-2h6l1 2h2v3h2v4h-2v2H7l-1-2H4V9z"/>',
    spring: '<path d="M7 4h10M7 8h10M7 12h10M7 16h10M12 16v5M9 4v16"/>',
    oil: '<path d="M7 3h6l1 3h3l2 3v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V9l2-2V3z"/><path d="M12 11c-1.5 2-2 3-2 4a2 2 0 0 0 4 0c0-1-.5-2-2-4z"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    back: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    play: '<path d="M8 5l11 7-11 7V5z"/>',
    check: '<path d="M5 12l4 4 10-10"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    pin: '<path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    ship: '<path d="M3 17l2 3h14l2-3M5 17V11l7-3 7 3v6M12 8V3"/>'
  };

  function icon(name, cls) {
    return '<svg class="ic ' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[name] || '') + '</svg>';
  }

  var WA_ICON = '<svg class="ic" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>';

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* Нормализация для поиска: регистр, ё→е, убираем дефисы/точки */
  function norm(s) {
    return String(s || "").toLowerCase().replace(/ё/g, "е").replace(/[-–—_.,/()]/g, " ").replace(/\s+/g, " ").trim();
  }

  function categoryName(id) {
    var c = (window.CATEGORIES || []).filter(function (x) { return x.id === id; })[0];
    return c ? c.name : "";
  }

  function skuOf(p) {
    var i = window.PRODUCTS.indexOf(p);
    return "FH-" + String(i + 1).padStart(3, "0");
  }

  function productUrl(p) {
    return "product.html?id=" + encodeURIComponent(p.id);
  }

  function absUrl(rel) {
    try { return new URL(rel, location.href).href; } catch (e) { return rel; }
  }

  /* Текст сообщения для WhatsApp с данными товара */
  function messageFor(p) {
    var lines = ["Здравствуйте! Интересует запчасть с сайта FH Parts.", ""];
    lines.push("Товар: " + p.title);
    lines.push("Артикул: " + skuOf(p));
    lines.push("Категория: " + categoryName(p.category));
    if (p.models && p.models.length) lines.push("Модели: " + p.models.join(", "));
    if (location.protocol !== "file:") lines.push("Ссылка: " + absUrl(productUrl(p)));
    lines.push("");
    lines.push("Подскажите наличие, цену и сроки доставки. Мой город: ");
    return lines.join("\n");
  }

  function messageGeneric(query) {
    var t = "Здравствуйте! Ищу запчасть";
    if (query) t += ": " + query;
    return t + ".\nПодскажите, есть ли в наличии и какая цена?";
  }

  function waLink(text) {
    var n = (window.FH.whatsappNumber || "").replace(/\D/g, "");
    if (n) return "https://wa.me/" + n + "?text=" + encodeURIComponent(text);
    return window.FH.groupUrl;
  }

  function toast(msg) {
    var t = document.getElementById("toast");
    if (!t) {
      t = document.createElement("div");
      t.id = "toast";
      t.setAttribute("role", "status");
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { t.classList.remove("show"); }, 4200);
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (res, rej) {
      try {
        var ta = document.createElement("textarea");
        ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
        document.body.appendChild(ta); ta.select();
        document.execCommand("copy"); document.body.removeChild(ta); res();
      } catch (e) { rej(e); }
    });
  }

  /* Привязать ссылку-кнопку к WhatsApp с заданным текстом */
  function bindWhatsApp(el, text) {
    el.href = waLink(text);
    el.target = "_blank";
    el.rel = "noopener";
    if (!(window.FH.whatsappNumber || "").replace(/\D/g, "")) {
      el.addEventListener("click", function () {
        copyText(text).then(function () {
          toast("Текст заявки скопирован. Вставьте его в чат группы.");
        }, function () {});
      });
    }
  }

  window.FHU = {
    icon: icon, WA_ICON: WA_ICON, esc: esc, norm: norm,
    categoryName: categoryName, skuOf: skuOf, productUrl: productUrl,
    messageFor: messageFor, messageGeneric: messageGeneric,
    bindWhatsApp: bindWhatsApp, toast: toast
  };

  /* Кнопка WhatsApp в шапке */
  document.addEventListener("DOMContentLoaded", function () {
    var el = document.getElementById("headWa");
    if (el) {
      el.innerHTML = WA_ICON + '<span class="label">Написать в WhatsApp</span>';
      bindWhatsApp(el, "Здравствуйте! Хочу уточнить по запчастям FH Parts.");
    }
    document.querySelectorAll("[data-wa-generic]").forEach(function (a) {
      a.innerHTML = WA_ICON + 'Написать в WhatsApp';
      bindWhatsApp(a,"Здравствуйте! Хочу уточнить по запчастям FH Parts.");
    });
    var menu = document.getElementById("menu"), ov = document.getElementById("menuOverlay"), bg = document.getElementById("burger");
    if (menu && bg) {
      var setMenu = function (open) {
        menu.classList.toggle("open", open);
        ov.hidden = !open;
        menu.setAttribute("aria-hidden", open ? "false" : "true");
        bg.setAttribute("aria-expanded", open ? "true" : "false");
        document.body.style.overflow = open ? "hidden" : "";
      };
      bg.addEventListener("click", function () { setMenu(true); });
      document.getElementById("menuClose").addEventListener("click", function () { setMenu(false); });
      ov.addEventListener("click", function () { setMenu(false); });
      menu.querySelectorAll(".menu-nav a").forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
      document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
    }
    var y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();
  });
})();
