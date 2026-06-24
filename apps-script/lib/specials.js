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
  var lines = specials.slice(0, 2).map(function (s, i) {
    var parts = [
      'id: "special-' + (i + 1) + '"',
      'name: "' + jsStr(s.name) + '"',
      'desc: "' + jsStr(s.desc) + '"',
      'veg: ' + (s.veg ? 'true' : 'false'),
      'photo: "' + jsStr(s.photo) + '"',
    ];
    if (s.price) parts.push('price: "' + jsStr(s.price) + '"');
    return '    { ' + parts.join(', ') + ' },';
  });
  return [
    '  /* SPECIALS:START */',
    '  sourcePost: "",',
    '  weekOf: "' + jsStr(weekOf) + '",',
    '  specials: [',
  ].concat(lines).concat([
    '  ],',
    '  /* SPECIALS:END */',
  ]).join('\n');
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

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { buildSpecialsBlock: buildSpecialsBlock, spliceSpecials: spliceSpecials };
}
