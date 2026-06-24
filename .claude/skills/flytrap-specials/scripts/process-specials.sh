#!/usr/bin/env bash
# process-specials.sh — deterministic half of the Fly Trap specials pull.
#
# Takes the raw images you downloaded from the Instagram post (ONE per special,
# in caption / carousel order), runs the safety guards, center-crops + upscales
# each to 1080x1080, and writes them to assets/specials/ as week-<date>-<N>.jpg.
# Prints the sha256s for the commit message.
#
# Handles ANY number of specials — 1 (single-image post), 2, or 3+.
#
# Usage:
#   scripts/process-specials.sh <week_iso> <img1> [img2] [img3] ...
#     week_iso  YYYY-MM-DD (drives the filenames)
#     imgN      raw download for special N, in caption order (at least one)
#
# Run from the repo root (~/flytrap-website). Exits non-zero on any guard fail.
set -euo pipefail
die() { echo "FAIL: $*" >&2; exit 1; }

WEEK="${1:?need week_iso (YYYY-MM-DD) as first arg}"; shift || true
[[ "$WEEK" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}$ ]] || die "week_iso must be YYYY-MM-DD, got '$WEEK'"
[ "$#" -ge 1 ] || die "need at least one image"

ASSETS="assets/specials"
[ -d "$ASSETS" ] || die "run from repo root — $ASSETS missing"

sha() { shasum -a 256 "$1" | awk '{print $1}'; }

# --- Guard 1: each is a real photo (>=800px wide), not an IG thumbnail -------
i=0
for src in "$@"; do
  i=$((i+1))
  [ -f "$src" ] || die "special $i source not found: $src"
  w=$(sips -g pixelWidth "$src" 2>/dev/null | awk '/pixelWidth/{print $2}')
  [ -n "${w:-}" ] || die "special $i: not a readable image: $src"
  [ "$w" -ge 800 ] || die "special $i source is only ${w}px wide — you pulled a thumbnail, not the full image. Re-fetch full-res."
done

# --- Guard 2: no two sources identical (same image in two slots) ------------
a_i=0
for a in "$@"; do
  a_i=$((a_i+1)); b_i=0
  for b in "$@"; do
    b_i=$((b_i+1))
    [ "$b_i" -le "$a_i" ] && continue
    cmp -s "$a" "$b" && die "special $a_i and special $b_i are the same image."
  done
done

# --- Write + process (center-crop square, upscale to 1080^2) ----------------
declare -a OUT_PATHS OUT_SHAS
i=0
for src in "$@"; do
  i=$((i+1))
  dst="$ASSETS/week-$WEEK-$i.jpg"
  cp "$src" "$dst"
  w=$(sips -g pixelWidth "$dst"  | awk '/pixelWidth/{print $2}')
  h=$(sips -g pixelHeight "$dst" | awk '/pixelHeight/{print $2}')
  side=$(( w < h ? w : h ))
  sips -c "$side" "$side" "$dst" >/dev/null   # center square (sips -c HEIGHT WIDTH)
  sips -z 1080 1080 "$dst" >/dev/null          # upscale to 1080x1080
  s=$(sha "$dst")
  OUT_PATHS+=("$dst"); OUT_SHAS+=("$s")

  # Guard 3: not a re-post of an image from a DIFFERENT week (stale/wrong photo).
  while IFS= read -r prev; do
    [ -z "$prev" ] && continue
    [ "$prev" = "$dst" ] && continue
    [ "$(sha "$prev")" = "$s" ] && die "special $i matches an existing image ($prev) — stale or wrong photo. Re-check the post."
  done < <(ls -1 "$ASSETS"/week-*.jpg 2>/dev/null | grep -v "/week-$WEEK-" || true)
done

# --- Report -----------------------------------------------------------------
dims() { sips -g pixelWidth -g pixelHeight "$1" | awk '/pixelWidth/{w=$2}/pixelHeight/{h=$2}END{print w"x"h}'; }
echo "OK — ${#OUT_PATHS[@]} special image(s) processed for week $WEEK"
trailer="sha256:"
for j in "${!OUT_PATHS[@]}"; do
  echo "  special-$((j+1)) -> ${OUT_PATHS[$j]}  ($(dims "${OUT_PATHS[$j]}"))  sha256=${OUT_SHAS[$j]}"
  trailer="$trailer s$((j+1))=${OUT_SHAS[$j]}"
done
echo ""
echo "commit trailer: $trailer"
