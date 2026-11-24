/* Ключевые слова для поиска: синонимы деталей, псевдонимы моделей, раскладка.
   Чтобы добавить синоним, впишите слово в подходящую строку (через пробел) или добавьте новую. */
(function () {
  /* Псевдонимы моделей: добавляются к каждому товару с этой моделью */
  var MODEL_ALIASES = {
    "Lexus LX 570": "лх570 лх 570 lx570 lx 570 лексус lexus лх",
    "Lexus LX 470": "лх470 лх 470 lx470 lx 470 лексус lexus лх",
    "Lexus GX 460": "гх460 гх 460 gx460 gx 460 лексус lexus гх",
    "Lexus GX 470": "гх470 гх 470 gx470 gx 470 лексус lexus гх",
    "Land Cruiser 300": "лк300 лк 300 lc300 lc 300 ленд лэнд крузер крузак тлк land cruiser 300",
    "Land Cruiser 200": "лк200 лк 200 lc200 lc 200 ленд лэнд крузер крузак тлк land cruiser 200",
    "Land Cruiser 100": "лк100 лк 100 lc100 lc 100 ленд лэнд крузер крузак тлк land cruiser 100",
    "Prado 250": "прадо 250 prado250 лк250 lc250 lc 250 прада тойота toyota land cruiser prado",
    "Prado 150": "прадо 150 prado150 лк150 lc150 lc 150 прада тойота toyota land cruiser prado",
    "Prado 120": "прадо 120 prado120 лк120 lc120 lc 120 прада тойота toyota land cruiser prado"
  };

  /* Группы синонимов: любое слово из группы находит все остальные */
  var GROUPS = [
    "фара фары оптика headlight headlamp",
    "фонарь фонари стоп стопы",
    "дверь двери door",
    "капот hood",
    "бампер бамперы bumper",
    "ноускат ноускаты морда nosecut",
    "руль рулевое рулевой steering",
    "печка климат кондиционер климатический отопитель",
    "коробка кпп акпп трансмиссия gearbox transmission",
    "глушитель выхлоп выхлопная muffler",
    "бак топливный бензобак fuel tank",
    "диффузор вентилятор кожух крыльчатка охлаждение",
    "шрус привод полуось cv axle граната",
    "стойка амортизатор подвеска пружина struts shock",
    "масло масла oil расходники жидкость",
    "антенна антенны antenna",
    "ручка ручки handle",
    "радиатор телевизор",
    "зеркало зеркала mirror",
    "консоль торпеда консоли",
    "багажник пятая liftgate",
    "двигатель мотор engine",
    "крыло крылья fender",
    "салон интерьер interior"
  ].map(function (g) { return g.split(" "); });

  /* Раскладка: английская → русская (на случай набора не в той раскладке) */
  var EN = "qwertyuiop[]asdfghjkl;'zxcvbnm,.`";
  var RU = "йцукенгшщзхъфывапролджэячсмитьбюё";
  function fixLayout(s) {
    return s.split("").map(function (c) { var i = EN.indexOf(c); return i === -1 ? c : RU[i]; }).join("");
  }

  /* Грубая основа слова: «фары», «фара», «фару» → «фар» */
  function stem(w) {
    w = w.toLowerCase().replace(/ё/g, "е");
    if (/\d/.test(w)) return w;
    if (w.length >= 7) return w.slice(0, -2);
    if (w.length >= 4 && /[аяыиеоуюьй]$/.test(w)) return w.slice(0, -1);
    return w;
  }

  var byStem = {};
  GROUPS.forEach(function (g, gi) {
    g.forEach(function (w) { (byStem[stem(w)] = byStem[stem(w)] || []).push(gi); });
  });

  /* Для токена запроса вернуть список вариантов, любой из которых считается совпадением */
  function expand(token) {
    var out = [token, stem(token)];
    var fixed = fixLayout(token);
    if (fixed !== token) out.push(fixed);
    out.slice().forEach(function (t) {
      (byStem[stem(t)] || []).forEach(function (gi) {
        GROUPS[gi].forEach(function (w) { out.push(w, stem(w)); });
      });
    });
    return out.filter(function (x, i) { return x && out.indexOf(x) === i; });
  }

  window.SEARCH_TERMS = {
    expand: expand,
    stem: stem,
    modelAliases: function (models) {
      return (models || []).map(function (m) { return MODEL_ALIASES[m] || ""; }).join(" ");
    }
  };
})();
