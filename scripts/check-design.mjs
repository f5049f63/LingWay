// Проверка правил дизайн-системы (docs/DESIGN.md). Запуск: npm run check:design
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const root = "client/src";
const spacingAllowed = new Set([
  "0",
  "0.5",
  "1",
  "2",
  "3",
  "4",
  "6",
  "8",
  "10",
  "12",
  "16",
  "20",
  "24",
]);
const banned = ["революци", "суперсил", "эффективно и легко", "безупречн", "мирового класса"];

const rules = [
  { name: "произвольный размер шрифта", re: /\btext-\[[^\]]+\]/g, level: "error" },
  { name: "курсив", re: /\bitalic\b|font-style:\s*italic/g, level: "error" },
  { name: "слишком жирный шрифт", re: /\bfont-(black|extrabold|heavy)\b/g, level: "error" },
  { name: "градиент в фоне", re: /\bbg-(gradient|linear|radial|conic)[\w-]*/g, level: "error" },
  {
    name: "запрещённый шрифт",
    re: /\b(Inter|Roboto|Arial|Open Sans|Helvetica)\b/g,
    level: "error",
    only: /\.(tsx|css)$/,
    skip: /index\.css$/,
  },
  { name: "рамка с одной стороны у карточки", re: /\bborder-[lr]\b/g, level: "error" },
  { name: "Material Icons", re: /material[- ]?(icons|symbols)/gi, level: "error" },
  { name: "дефис внутри русского слова", re: /[а-яё]-[а-яё]/gi, level: "error", only: /\.tsx$/ },
  { name: "восклицательный знак в тексте", re: /[а-яё]!/gi, level: "error", only: /\.tsx$/ },
];

const spacingRe =
  /(?<![\w-])-?(p[trblxy]?|m[trblxy]?|gap(?:-[xy])?|space-[xy])-(\d+(?:\.\d+)?)(?![\w.])/g;

function walk(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

let errors = 0;
for (const file of walk(root)) {
  if (!/\.(tsx|ts|css)$/.test(file)) continue;
  const text = readFileSync(file, "utf8");
  const lines = text.split("\n");
  lines.forEach((line, i) => {
    for (const r of rules) {
      if (r.only && !r.only.test(file)) continue;
      if (r.skip && r.skip.test(file)) continue;
      r.re.lastIndex = 0;
      if (r.re.test(line)) {
        console.log(`${file}:${i + 1}  ${r.name}`);
        errors++;
      }
    }
    for (const w of banned) {
      if (line.toLowerCase().includes(w)) {
        console.log(`${file}:${i + 1}  запрещённое слово «${w}»`);
        errors++;
      }
    }
    if (file.endsWith(".tsx")) {
      for (const m of line.matchAll(spacingRe)) {
        if (!spacingAllowed.has(m[2])) {
          console.log(`${file}:${i + 1}  отступ вне шкалы: ${m[0]}`);
          errors++;
        }
      }
    }
  });
}
console.log(errors === 0 ? "Дизайн: нарушений нет" : `Дизайн: нарушений ${errors}`);
process.exit(errors === 0 ? 0 : 1);
