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

// Read a double-quoted string field out of an object-literal snippet.
function pickField(objText, key) {
  var mm = new RegExp(key + ':\\s*"((?:[^"\\\\]|\\\\.)*)"').exec(objText);
  return mm ? mm[1] : '';
}

// Rewrite one hand-maintained EXTRAS object (soupSpecial / muffinSpecial) in
// data.js, merging Toast-sourced `fields` over the existing values. `keys` lists
// the object's fields in output order and tags each as text or money; a field not
// in `fields` is preserved from the current object, and an empty money field is
// dropped so the object never carries an empty price. Only the matched object is
// touched. Throws if it is absent (structural invariant).
function updateExtra(dataJsText, objKey, keys, fields) {
  fields = fields || {};
  var m = new RegExp(objKey + ':\\s*\\{[^}]*\\}').exec(dataJsText);
  if (!m) throw new Error('data.js is missing the ' + objKey + ' object');
  var cur = m[0];
  var parts = [];
  keys.forEach(function (k) {
    var raw = fields[k.name] != null ? fields[k.name] : pickField(cur, k.name);
    var val = k.money ? fmtMoney(raw) : String(raw == null ? '' : raw);
    if (k.money && !val) return; // drop empty prices
    parts.push(k.name + ': "' + jsStr(val) + '"');
  });
  var rebuilt = objKey + ': { ' + parts.join(', ') + ' }';
  return dataJsText.slice(0, m.index) + rebuilt + dataJsText.slice(m.index + cur.length);
}

// soupSpecial: name + flavor preserved unless passed; cup/bowl money-formatted.
function updateSoupSpecial(dataJsText, soup) {
  return updateExtra(dataJsText, 'soupSpecial', [
    { name: 'name' }, { name: 'flavor' }, { name: 'cup', money: true }, { name: 'bowl', money: true },
  ], soup);
}

// muffinSpecial: name (site label) + flavor preserved unless passed; price money-
// formatted and dropped when empty.
function updateMuffinSpecial(dataJsText, muffin) {
  return updateExtra(dataJsText, 'muffinSpecial', [
    { name: 'name' }, { name: 'flavor' }, { name: 'price', money: true },
  ], muffin);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    buildSpecialsBlock: buildSpecialsBlock,
    spliceSpecials: spliceSpecials,
    updateSoupSpecial: updateSoupSpecial,
    updateMuffinSpecial: updateMuffinSpecial,
  };
}
