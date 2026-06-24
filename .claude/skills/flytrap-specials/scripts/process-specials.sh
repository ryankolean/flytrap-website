#!/usr/bin/env bash
# process-specials.sh — deterministic half of the weekly Fly Trap specials pull.
#
# Takes the two raw carousel images you downloaded from the Instagram post,
# runs the safety guards, crops + upscales each to 1080x1080, and writes them
# into assets/specials/ with this week's filenames. Prints the sha256s for the
# commit message.
#
# Usage:
#   scripts/process-specials.sh <savory_src> <sweet_src> [week_iso=YYYY-MM-DD]
#
#   savory_src  raw download for carousel slide 1 (special 1 / -savory slot)
#   sweet_src   raw download for carousel slide 2 (special 2 / -sweet slot)
#   week_iso    optional; defaults to today (date +%F). Drives the filenames.
#
# Run from the repo root (~/flytrap-website). Exits non-zero on any guard fail.
set -euo pipefail

die() { echo "FAIL: $*" >&2; exit 1; }

SAVORY_SRC="${1:?need savory source path}"
SWEET_SRC="${2:?need sweet source path}"
WEEK="${3:-$(date +%F)}"

[[ "$WEEK" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}$ ]] || die "week_iso must be YYYY-MM-DD, got '$WEEK'"
[ -f "$SAVORY_SRC" ] || die "savory source not found: $SAVORY_SRC"
[ -f "$SWEET_SRC" ]  || die "sweet source not found: $SWEET_SRC"

ASSETS="assets/specials"
[ -d "$ASSETS" ] || die "run from repo root — $ASSETS missing"

# --- Guard 1: real photos, not Instagram thumbnails ------------------------
# The embed data store's display_resources array is NOT sorted by size; its
# LAST element is the 150x150 thumb. Pulling that ships a blurry 7KB image.
# Any real slide is >= 800px wide. This check is the mechanical backstop.
for pair in "savory:$SAVORY_SRC" "sweet:$SWEET_SRC"; do
  slot="${pair%%:*}"; src="${pair#*:}"
  w=$(sips -g pixelWidth "$src" 2>/dev/null | awk '/pixelWidth/{print $2}')
  [ -n "${w:-}" ] || die "$slot: not a readable image: $src"
  [ "$w" -ge 800 ] || die "$slot source is only ${w}px wide — you pulled a thumbnail, not the full slide. Re-fetch using display_url / max-area (see SKILL.md)."
done

# --- Guard 2: the two slides must differ -----------------------------------
cmp -s "$SAVORY_SRC" "$SWEET_SRC" && die "savory and sweet sources are identical — both slots got the same image."

# --- Write + process (center-crop square, upscale to 1080^2) ---------------
DST_SAV="$ASSETS/week-$WEEK-savory.jpg"
DST_SWT="$ASSETS/week-$WEEK-sweet.jpg"
cp "$SAVORY_SRC" "$DST_SAV"
cp "$SWEET_SRC"  "$DST_SWT"
for f in "$DST_SAV" "$DST_SWT"; do
  w=$(sips -g pixelWidth "$f" | awk '/pixelWidth/{print $2}')
  sips --cropToHeightWidth "$w" "$w" "$f" >/dev/null   # center square
  sips -z 1080 1080 "$f" >/dev/null                    # upscale to 1080x1080
done

sha() { shasum -a 256 "$1" | awk '{print $1}'; }
NEW_SAV=$(sha "$DST_SAV"); NEW_SWT=$(sha "$DST_SWT")

# --- Guard 3: not a re-post of last week's images --------------------------
# Same pipeline is deterministic, so an identical source slide -> identical
# final hash. Compare against the most recent OTHER week on disk.
prev() {
  ls -1 "$ASSETS"/week-*-"$1".jpg 2>/dev/null \
    | grep -v "week-$WEEK-$1.jpg" | sort | tail -1
}
PREV_SAV=$(prev savory || true); PREV_SWT=$(prev sweet || true)
if [ -n "${PREV_SAV:-}" ] && [ "$(sha "$PREV_SAV")" = "$NEW_SAV" ]; then
  die "savory matches previous week ($PREV_SAV) — wrong-slide / stale image. Re-check the carousel."
fi
if [ -n "${PREV_SWT:-}" ] && [ "$(sha "$PREV_SWT")" = "$NEW_SWT" ]; then
  die "sweet matches previous week ($PREV_SWT) — wrong-slide / stale image. Re-check the carousel."
fi

# --- Report ----------------------------------------------------------------
dims() { sips -g pixelWidth -g pixelHeight "$1" | awk '/pixelWidth/{w=$2}/pixelHeight/{h=$2}END{print w"x"h}'; }
echo "OK — specials processed for week $WEEK"
echo "  $DST_SAV  ($(dims "$DST_SAV"))  sha256=$NEW_SAV"
echo "  $DST_SWT  ($(dims "$DST_SWT"))  sha256=$NEW_SWT"
echo ""
echo "data.js photo paths:"
echo "  special-1 -> $DST_SAV"
echo "  special-2 -> $DST_SWT"
echo ""
echo "commit trailer: sha256: savory=$NEW_SAV sweet=$NEW_SWT"
