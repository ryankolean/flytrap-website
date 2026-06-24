// Path B publisher. Pure string helpers live in lib/specials.js + lib/github.js
// (pushed alongside this file by clasp); their functions are global in GAS.

var REPO = 'ryankolean/flytrap-specials-test'; // DRY-RUN target; flip to flytrap-website after verifying
var BRANCH = 'main';
var API = 'https://api.github.com';

function props_() { return PropertiesService.getScriptProperties(); }
function ghToken_() { return props_().getProperty('GH_TOKEN'); }
function passcode_() { return props_().getProperty('FORM_PASSCODE'); }

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Form')
    .setTitle('Fly Trap — Submit Specials')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

// Called from Form.html via google.script.run. `payload` is:
// { passcode, weekOf, specials:[{name,desc,veg,price,imageDataUrl}, ...] }
function publishSpecials(payload) {
  if (!payload || payload.passcode !== passcode_()) {
    throw new Error('Wrong passcode.');
  }
  var s = payload.specials || [];
  for (var i = 0; i < s.length; i++) {
    if (!s[i].name || !s[i].desc || !s[i].imageDataUrl) {
      throw new Error('Special ' + (i + 1) + ' is missing a name, description, or photo.');
    }
  }

  var week = isoWeek_();
  var photos = s.map(function (x, i) { return 'assets/specials/week-' + week + '-' + (i + 1) + '.jpg'; });
  var specials = s.map(function (x, i) {
    return { name: x.name, desc: x.desc, veg: !!x.veg, price: x.price || '', photo: photos[i] };
  });

  var current = gh_('GET', '/repos/' + REPO + '/contents/data.js?ref=' + BRANCH);
  var dataJs = Utilities.newBlob(Utilities.base64Decode(current.content)).getDataAsString();
  var block = buildSpecialsBlock({ weekOf: payload.weekOf, specials: specials });
  var newDataJs = spliceSpecials(dataJs, block);

  var dataBlob = gh_('POST', '/repos/' + REPO + '/git/blobs',
    { content: Utilities.base64Encode(Utilities.newBlob(newDataJs).getBytes()), encoding: 'base64' });
  var files = [{ path: 'data.js', sha: dataBlob.sha }];
  for (var j = 0; j < s.length; j++) {
    var imgBlob = gh_('POST', '/repos/' + REPO + '/git/blobs',
      { content: dataUrlToBase64_(s[j].imageDataUrl), encoding: 'base64' });
    files.push({ path: photos[j], sha: imgBlob.sha });
  }

  var ref = gh_('GET', '/repos/' + REPO + '/git/ref/heads/' + BRANCH);
  var baseSha = ref.object.sha;
  var baseCommit = gh_('GET', '/repos/' + REPO + '/git/commits/' + baseSha);
  var tree = gh_('POST', '/repos/' + REPO + '/git/trees',
    { base_tree: baseCommit.tree.sha, tree: buildTreeEntries(files) });
  var commit = gh_('POST', '/repos/' + REPO + '/git/commits',
    { message: 'feat(specials): publish ' + payload.weekOf + ' via direct submit', tree: tree.sha, parents: [baseSha] });
  gh_('PATCH', '/repos/' + REPO + '/git/refs/heads/' + BRANCH, { sha: commit.sha });

  return { ok: true, weekOf: payload.weekOf, count: s.length };
}

function isoWeek_() {
  return Utilities.formatDate(new Date(), 'America/Detroit', 'yyyy-MM-dd');
}

function dataUrlToBase64_(dataUrl) {
  var comma = dataUrl.indexOf(',');
  return dataUrl.slice(comma + 1);
}

function gh_(method, path, body) {
  var opts = {
    method: method,
    muteHttpExceptions: true,
    headers: { Authorization: 'token ' + ghToken_(), Accept: 'application/vnd.github+json' },
    contentType: 'application/json',
  };
  if (body) opts.payload = JSON.stringify(body);
  var res = UrlFetchApp.fetch(API + path, opts);
  var code = res.getResponseCode();
  if (code >= 300) throw new Error('GitHub ' + method + ' ' + path + ' -> ' + code + ': ' + res.getContentText());
  return JSON.parse(res.getContentText());
}
