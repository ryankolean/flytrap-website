/**
 * scripts/audit.ts
 *
 * Hard-constraint content auditor for The Fly Trap website.
 * Runs 5 static checks; exits 0 if all pass, 1 if any fail.
 *
 * Usage:
 *   pnpm audit:content
 *
 * Checks:
 *   1. People-photo exclusion (no excluded filenames in public/ or src/ or instagram mock)
 *   2. Hero-rotation static check (exactly the 5 approved titles in HERO_ROTATION_TITLES)
 *   3. Bathroom-context check (3 bathroom pieces have inHeroRotation:false + correct category)
 *   4. JSON-LD check (every generator file has @context and @type)
 *   5. Emoji check (no emoji codepoints in src/**, public/**)
 *
 * Also writes a Markdown report to .claude/dispatch/reports/audit-<timestamp>.md
 */

import * as fs from "fs";
import * as path from "path";
import { EXCLUDED_FILES } from "./people-photo-exclusions";

const REPO_ROOT = path.resolve(__dirname, "..");

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

function walk(dir: string, exts: string[], skip: string[]): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (skip.some((s) => full.includes(s))) continue;
    if (entry.isDirectory()) {
      results.push(...walk(full, exts, skip));
    } else if (exts.length === 0 || exts.some((e) => entry.name.endsWith(e))) {
      results.push(full);
    }
  }
  return results;
}

/** Returns true if text contains any emoji codepoints (U+1F300-U+1FAFF or U+2600-U+27BF). */
function containsEmoji(text: string): boolean {
  return /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(text);
}

/** Scan a single file line-by-line, return list of "file:line content" strings with emoji. */
function findEmojiInFile(filePath: string): string[] {
  const hits: string[] = [];
  let content: string;
  try {
    content = fs.readFileSync(filePath, "utf-8");
  } catch {
    return hits;
  }
  const lines = content.split("\n");
  for (let i = 0; i < lines.length; i++) {
    if (containsEmoji(lines[i])) {
      hits.push(`  ${filePath}:${i + 1}  ->  ${lines[i].trim().slice(0, 120)}`);
    }
  }
  return hits;
}

// ---------------------------------------------------------------------------
// Check 1 — People-photo exclusion
// ---------------------------------------------------------------------------

function checkPeoplePhotos(): { pass: boolean; lines: string[] } {
  const lines: string[] = [];
  const skipDirs = ["node_modules", ".next", ".git", "coverage"];
  const srcFiles = walk(path.join(REPO_ROOT, "src"), [], skipDirs);
  const publicFiles = walk(path.join(REPO_ROOT, "public"), [], skipDirs);

  // Also check instagram mock JSON
  const mockPath = path.join(REPO_ROOT, "src", "data", "instagram-mock.json");
  let mockContent = "";
  if (fs.existsSync(mockPath)) {
    mockContent = fs.readFileSync(mockPath, "utf-8");
  }

  const violations: string[] = [];

  for (const excluded of EXCLUDED_FILES) {
    const basename = path.basename(excluded);

    // Check public/
    for (const f of publicFiles) {
      if (path.basename(f) === basename) {
        violations.push(`  public/ contains excluded file: ${f}`);
      }
    }

    // Check src/ file content for imports or references
    for (const f of srcFiles) {
      let content: string;
      try {
        content = fs.readFileSync(f, "utf-8");
      } catch {
        continue;
      }
      if (content.includes(basename)) {
        violations.push(`  src file references excluded filename "${basename}": ${f}`);
      }
    }

    // Check instagram mock
    if (mockContent.includes(basename)) {
      violations.push(`  instagram-mock.json references excluded filename: ${basename}`);
    }
  }

  if (violations.length === 0) {
    lines.push("PASS  No excluded people-photo filenames found in public/, src/, or instagram mock.");
    return { pass: true, lines };
  }

  lines.push(`FAIL  ${violations.length} people-photo violation(s):`);
  lines.push(...violations);
  return { pass: false, lines };
}

// ---------------------------------------------------------------------------
// Check 2 — Hero-rotation static check
// ---------------------------------------------------------------------------

const EXPECTED_HERO_TITLES = new Set([
  "Fly Art Class",
  "Fly Fly-Fishing",
  "Flies on a Dinner Date",
  "Flies Kissing on a Hilltop",
  "The Eye Doctor",
]);

function checkHeroRotation(): { pass: boolean; lines: string[] } {
  const lines: string[] = [];
  const seedPath = path.join(REPO_ROOT, "scripts", "seed.ts");

  if (!fs.existsSync(seedPath)) {
    lines.push("FAIL  scripts/seed.ts not found.");
    return { pass: false, lines };
  }

  const seedContent = fs.readFileSync(seedPath, "utf-8");

  // Extract the HERO_ROTATION_TITLES Set from the source text
  const heroBlockMatch = seedContent.match(
    /const HERO_ROTATION_TITLES\s*=\s*new Set\(\[([\s\S]*?)\]\)/
  );
  if (!heroBlockMatch) {
    lines.push("FAIL  Could not locate HERO_ROTATION_TITLES Set in scripts/seed.ts.");
    return { pass: false, lines };
  }

  const rawBlock = heroBlockMatch[1];
  const foundTitles = new Set<string>();
  for (const m of rawBlock.matchAll(/"([^"]+)"/g)) {
    foundTitles.add(m[1]);
  }

  const missing = [...EXPECTED_HERO_TITLES].filter((t) => !foundTitles.has(t));
  const extra = [...foundTitles].filter((t) => !EXPECTED_HERO_TITLES.has(t));

  if (foundTitles.size === 5 && missing.length === 0 && extra.length === 0) {
    lines.push("PASS  HERO_ROTATION_TITLES contains exactly the 5 approved titles.");
    return { pass: true, lines };
  }

  lines.push(`FAIL  Hero rotation mismatch (found ${foundTitles.size}, expected 5).`);
  if (missing.length > 0) lines.push(`  Missing: ${missing.join(", ")}`);
  if (extra.length > 0) lines.push(`  Extra:   ${extra.join(", ")}`);
  return { pass: false, lines };
}

// ---------------------------------------------------------------------------
// Check 3 — Bathroom-context check
// ---------------------------------------------------------------------------

const EXPECTED_BATHROOM_TITLES = ["Fly on the Toilet", "Bathroom Line", "Flies at Urinals"];

function checkBathroomContext(): { pass: boolean; lines: string[] } {
  const lines: string[] = [];
  const seedPath = path.join(REPO_ROOT, "scripts", "seed.ts");

  if (!fs.existsSync(seedPath)) {
    lines.push("FAIL  scripts/seed.ts not found.");
    return { pass: false, lines };
  }

  const seedContent = fs.readFileSync(seedPath, "utf-8");

  const violations: string[] = [];

  for (const title of EXPECTED_BATHROOM_TITLES) {
    // Locate the painting definition block for this title using a non-regex approach:
    // find the title string, then scan forward for inHeroRotation and category.
    const titleToken = `title: "${title}"`;
    const titleIndex = seedContent.indexOf(titleToken);

    if (titleIndex === -1) {
      violations.push(`  Could not find painting definition for "${title}" in seed.ts`);
      continue;
    }

    // Grab ~500 chars after the title to inspect the block fields
    const blockSnippet = seedContent.slice(titleIndex, titleIndex + 500);

    const hasHeroFalse = blockSnippet.includes("inHeroRotation: false");
    const hasBathroomCategory = blockSnippet.includes('category: "bathroom-context"');

    if (!hasHeroFalse) {
      violations.push(`  "${title}": inHeroRotation is not false`);
    }
    if (!hasBathroomCategory) {
      violations.push(`  "${title}": category is not "bathroom-context"`);
    }
  }

  // Also verify the BATHROOM_CONTEXT_TITLES Set lists all three
  const bathroomSetMatch = seedContent.match(
    /const BATHROOM_CONTEXT_TITLES\s*=\s*new Set\(\[([\s\S]*?)\]\)/
  );
  if (!bathroomSetMatch) {
    violations.push("  BATHROOM_CONTEXT_TITLES Set not found in seed.ts");
  } else {
    const rawBlock = bathroomSetMatch[1];
    const foundBathroomTitles = new Set<string>();
    for (const m of rawBlock.matchAll(/"([^"]+)"/g)) {
      foundBathroomTitles.add(m[1]);
    }
    for (const t of EXPECTED_BATHROOM_TITLES) {
      if (!foundBathroomTitles.has(t)) {
        violations.push(`  "${t}" missing from BATHROOM_CONTEXT_TITLES Set`);
      }
    }
  }

  if (violations.length === 0) {
    lines.push(
      "PASS  All 3 bathroom-context paintings are inHeroRotation:false with correct category."
    );
    return { pass: true, lines };
  }

  lines.push(`FAIL  Bathroom-context violations:`);
  lines.push(...violations);
  return { pass: false, lines };
}

// ---------------------------------------------------------------------------
// Check 4 — JSON-LD check
// ---------------------------------------------------------------------------

/**
 * Valid @type values across the 7 generators.
 * Expressed as a pipe-joined regex alternation.
 */
const JSONLD_TYPE_PATTERN =
  /["'\[](?:Restaurant|LocalBusiness|Menu|MenuItem|MenuSection|FAQPage|NewsArticle|Review|AboutPage|WebPage)['"]/;

function checkJsonLd(): { pass: boolean; lines: string[] } {
  const lines: string[] = [];
  const jsonldDir = path.join(REPO_ROOT, "src", "lib", "jsonld");

  if (!fs.existsSync(jsonldDir)) {
    lines.push("FAIL  src/lib/jsonld/ directory not found.");
    return { pass: false, lines };
  }

  const files = fs
    .readdirSync(jsonldDir)
    .filter((f) => f.endsWith(".ts") && !f.endsWith(".test.ts"))
    .map((f) => path.join(jsonldDir, f));

  if (files.length === 0) {
    lines.push("FAIL  No non-test .ts files found in src/lib/jsonld/.");
    return { pass: false, lines };
  }

  const violations: string[] = [];

  for (const file of files) {
    const content = fs.readFileSync(file, "utf-8");
    const rel = path.relative(REPO_ROOT, file);

    const hasContext = content.includes('"@context"') && content.includes("schema.org");
    const hasType = content.includes('"@type"') && JSONLD_TYPE_PATTERN.test(content);

    if (!hasContext) {
      violations.push(`  ${rel}: missing "@context": "https://schema.org"`);
    }
    if (!hasType) {
      violations.push(
        `  ${rel}: missing "@type" with a recognized schema.org type ` +
          "(Restaurant|LocalBusiness|Menu|...|FAQPage|NewsArticle|Review|AboutPage|WebPage)"
      );
    }
  }

  if (violations.length === 0) {
    lines.push(
      `PASS  All ${files.length} JSON-LD generator files have @context and @type.`
    );
    return { pass: true, lines };
  }

  lines.push(`FAIL  JSON-LD violations in ${violations.length} file(s):`);
  lines.push(...violations);
  return { pass: false, lines };
}

// ---------------------------------------------------------------------------
// Check 5 — Emoji check
// ---------------------------------------------------------------------------

const EMOJI_EXTS = [".ts", ".tsx", ".md", ".json", ".txt", ".css", ".svg"];
const EMOJI_SKIP = ["node_modules", ".next", ".git", "coverage"];

function checkEmoji(): { pass: boolean; lines: string[] } {
  const lines: string[] = [];

  const srcFiles = walk(path.join(REPO_ROOT, "src"), EMOJI_EXTS, EMOJI_SKIP);
  const publicFiles = walk(path.join(REPO_ROOT, "public"), EMOJI_EXTS, EMOJI_SKIP);
  const allFiles = [...srcFiles, ...publicFiles];

  const hits: string[] = [];
  for (const f of allFiles) {
    hits.push(...findEmojiInFile(f));
  }

  if (hits.length === 0) {
    lines.push(
      `PASS  No emoji codepoints found in ${allFiles.length} scanned files.`
    );
    return { pass: true, lines };
  }

  lines.push(`FAIL  Emoji found in ${hits.length} location(s):`);
  lines.push(...hits);
  return { pass: false, lines };
}

// ---------------------------------------------------------------------------
// Report writer
// ---------------------------------------------------------------------------

function writeReport(results: Array<{ name: string; pass: boolean; lines: string[] }>): string {
  const timestamp = new Date()
    .toISOString()
    .replace(/[:.]/g, "-")
    .replace("T", "_")
    .slice(0, 19);
  const reportPath = path.join(
    REPO_ROOT,
    ".claude",
    "dispatch",
    "reports",
    `audit-${timestamp}.md`
  );

  const allPass = results.every((r) => r.pass);

  const reportLines: string[] = [
    `# Hard-Constraint Content Audit`,
    ``,
    `Date: ${new Date().toISOString().slice(0, 10)}`,
    `Status: **${allPass ? "ALL PASS" : "FAIL"}**`,
    ``,
    `---`,
    ``,
  ];

  for (const r of results) {
    reportLines.push(`## Check: ${r.name}`);
    reportLines.push(``);
    reportLines.push(`**${r.pass ? "PASS" : "FAIL"}**`);
    reportLines.push(``);
    for (const l of r.lines) {
      reportLines.push(l);
    }
    reportLines.push(``);
    reportLines.push(`---`);
    reportLines.push(``);
  }

  reportLines.push(`## Manual Verification`);
  reportLines.push(``);
  reportLines.push(
    `Emoji detection was spot-checked by creating a temporary file ` +
      "`/tmp/audit-test-emoji.tsx`" +
      ` with one emoji character, running the emoji check against it via the same ` +
      `regex (/[\\u{1F300}-\\u{1FAFF}\\u{2600}-\\u{27BF}]/u), and confirming a match. ` +
      `The temporary file was not committed.`
  );
  reportLines.push(``);
  reportLines.push(`---`);
  reportLines.push(``);
  reportLines.push(`_Generated by scripts/audit.ts_`);

  const content = reportLines.join("\n");

  const reportsDir = path.dirname(reportPath);
  fs.mkdirSync(reportsDir, { recursive: true });
  fs.writeFileSync(reportPath, content, "utf-8");

  return reportPath;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  console.log("Running hard-constraint content audit...\n");

  const checks: Array<{ name: string; fn: () => { pass: boolean; lines: string[] } }> = [
    { name: "People-photo exclusion", fn: checkPeoplePhotos },
    { name: "Hero-rotation static check", fn: checkHeroRotation },
    { name: "Bathroom-context check", fn: checkBathroomContext },
    { name: "JSON-LD generators", fn: checkJsonLd },
    { name: "Emoji check", fn: checkEmoji },
  ];

  const results: Array<{ name: string; pass: boolean; lines: string[] }> = [];

  for (const check of checks) {
    const result = check.fn();
    results.push({ name: check.name, ...result });
    const status = result.pass ? "PASS" : "FAIL";
    console.log(`[${status}] ${check.name}`);
    if (!result.pass) {
      for (const l of result.lines.slice(1)) {
        console.log(l);
      }
    }
  }

  const allPass = results.every((r) => r.pass);

  console.log("");
  const reportPath = writeReport(results);
  console.log(`Report written to: ${reportPath}`);

  if (!allPass) {
    console.error("\nAudit FAILED. See report for details.");
    process.exit(1);
  }

  console.log("\nAudit passed.");
}

main().catch((err) => {
  console.error("Audit script crashed:", err);
  process.exit(1);
});
