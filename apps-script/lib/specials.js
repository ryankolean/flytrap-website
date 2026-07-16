// Pure helpers shared by Apps Script (clasp-pushed) and the local test runner.
// No GAS or Node APIs — string in, string out. The module.exports block is
// guarded so it is a no-op in Apps Script (where `module` is undefined) and
// active in Node (CommonJS), which the .mjs tests import via ESM/CJS interop.

function jsStr(s) {
  return String(s == null ? '' : s)
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n');
}

function buildSpecialsBlock(input) {
  var weekOf = input.weekOf;
  var specials = input.specials || [];
  var lines = specials.map(function (s, i) {
    var parts = [
      'id: "special-' + (i + 1) + '"',
      'name: "' + jsStr(s.name) + '"',
      'desc: "' + jsStr(s.desc) + '"',
      'veg: ' + (s.veg ? 'true' : 'false'),
      'photo: "' + jsStr(s.photo) + '"',
    ];
    // Strip a leading "$" — Sections.jsx renders `${s.price}`, so a stored
    // "$15.95" would show as "$$15.95".
    var price = String(s.price == null ? '' : s.price).trim().replace(/^\$+/, '').trim();
    if (price) parts.push('price: "' + jsStr(price) + '"');
    return '    { ' + parts.join(', ') + ' },';
  });
  var head = [
    '  /* SPECIALS:START */',
    '  sourcePost: "",',
    '  weekOf: "' + jsStr(weekOf) + '",',
  ];
  var body = lines.length
    ? ['  specials: ['].concat(lines).concat(['  ],'])
    : ['  specials: [],'];
  return head.concat(body).concat(['  /* SPECIALS:END */']).join('\n');
}

function spliceSpecials(dataJsText, newBlock) {
  var start = dataJsText.indexOf('/* SPECIALS:START */');
  var endMark = '/* SPECIALS:END */';
  var endIdx = dataJsText.indexOf(endMark);
  if (start < 0 || endIdx < 0) {
    throw new Error('data.js is missing SPECIALS markers');
  }
  var lineStart = dataJsText.lastIndexOf('\n', start) + 1;
  var end = endIdx + endMark.length;
  return dataJsText.slice(0, lineStart) + newBlock + dataJsText.slice(end);
}

// "$5" / 5 / "6.0" -> "5.00" / "5.00" / "6.00". Blank/non-numeric -> "".
function fmtMoney(v) {
  if (v == null || v === '') return '';
  var n = Number(String(v).replace(/^\$+/, '').trim());
  return isFinite(n) ? n.toFixed(2) : '';
}

// Update the hand-maintained soupSpecial object in data.js with Toast-sourced
// cup/bowl prices. name + flavor stay hand-curated: they are preserved unless a
// value is explicitly passed in `soup`. cup/bowl are money-formatted; an empty
// one is dropped so the object never carries an empty price. Only the
// soupSpecial object is touched — muffinSpecial and the rest of data.js are
// left byte-for-byte. Throws if soupSpecial is absent (structural invariant).
function updateSoupSpecial(dataJsText, soup) {
  soup = soup || {};
  var m = /soupSpecial:\s*\{[^}]*\}/.exec(dataJsText);
  if (!m) throw new Error('data.js is missing the soupSpecial object');
  var cur = m[0];
  var pick = function (key) {
    var mm = new RegExp(key + ':\\s*"((?:[^"\\\\]|\\\\.)*)"').exec(cur);
    return mm ? mm[1] : '';
  };
  var name = soup.name != null ? String(soup.name) : pick('name');
  var flavor = soup.flavor != null ? String(soup.flavor) : pick('flavor');
  var cup = fmtMoney(soup.cup != null ? soup.cup : pick('cup'));
  var bowl = fmtMoney(soup.bowl != null ? soup.bowl : pick('bowl'));
  var parts = ['name: "' + jsStr(name) + '"', 'flavor: "' + jsStr(flavor) + '"'];
  if (cup) parts.push('cup: "' + jsStr(cup) + '"');
  if (bowl) parts.push('bowl: "' + jsStr(bowl) + '"');
  var rebuilt = 'soupSpecial: { ' + parts.join(', ') + ' }';
  return dataJsText.slice(0, m.index) + rebuilt + dataJsText.slice(m.index + cur.length);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    buildSpecialsBlock: buildSpecialsBlock,
    spliceSpecials: spliceSpecials,
    updateSoupSpecial: updateSoupSpecial,
  };
}
