// Pure helper: builds the git tree entry array for a Git Data API commit.
function buildTreeEntries(files) {
  return (files || []).map(function (f) {
    return { path: f.path, mode: '100644', type: 'blob', sha: f.sha };
  });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { buildTreeEntries: buildTreeEntries };
}
