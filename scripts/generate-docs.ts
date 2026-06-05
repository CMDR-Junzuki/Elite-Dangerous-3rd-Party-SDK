import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { join, relative } from "node:path";

const ROOT_DIR = join(import.meta.dirname, "..");
const PACKAGES_DIR = join(ROOT_DIR, "core", "packages");
const DOCS_DIR = join(ROOT_DIR, "docs");

interface DocEntry {
  package: string;
  file: string;
  exports: string[];
  description: string;
}

function extractDocs(filePath: string, pkgName: string): DocEntry[] {
  const content = readFileSync(filePath, "utf-8");
  const lines = content.split("\n");
  const entries: DocEntry[] = [];
  let currentComment: string[] = [];
  const _currentExport: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("/**")) {
      currentComment = [];
    } else if (trimmed.startsWith("*/") && currentComment.length > 0) {
      // end of comment block
    } else if (trimmed.startsWith("*")) {
      const text = trimmed.replace(/^\*\s?/, "");
      currentComment.push(text);
    } else if (trimmed.startsWith("export")) {
      const name = trimmed.match(
        /export\s+(?:function|const|class|interface|type)\s+(\w+)/,
      )?.[1];
      if (name) {
        entries.push({
          package: pkgName,
          file: relative(ROOT_DIR, filePath),
          exports: [name],
          description: currentComment.join(" ").trim(),
        });
      }
    }
  }

  return entries;
}

function generateDocs() {
  if (!existsSync(DOCS_DIR)) mkdirSync(DOCS_DIR, { recursive: true });

  const packages = readdirSync(PACKAGES_DIR);
  const allDocs: DocEntry[] = [];

  for (const pkg of packages) {
    const srcDir = join(PACKAGES_DIR, pkg, "src");
    if (!existsSync(srcDir)) continue;

    const files = readdirSync(srcDir).filter((f) => f.endsWith(".ts"));
    for (const file of files) {
      const entries = extractDocs(join(srcDir, file), pkg);
      allDocs.push(...entries);
    }
  }

  let md = "# Elite Dangerous SDK API Reference\n\n";
  const byPackage = new Map<string, DocEntry[]>();
  for (const entry of allDocs) {
    const list = byPackage.get(entry.package) ?? [];
    list.push(entry);
    byPackage.set(entry.package, list);
  }

  for (const [pkg, entries] of byPackage) {
    md += `## @elite-dangerous-sdk/${pkg}\n\n`;
    for (const entry of entries) {
      md += `### ${entry.exports.join(", ")}\n\n`;
      md += `File: \`${entry.file}\`\n\n`;
      if (entry.description) md += `${entry.description}\n\n`;
    }
  }

  writeFileSync(join(DOCS_DIR, "API.md"), md, "utf-8");
  console.log(
    `Generated docs/API.md with ${allDocs.length} entries across ${byPackage.size} packages`,
  );
}

generateDocs();
