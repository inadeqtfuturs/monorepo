import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const RSS_URL = 'https://letterboxd.com/autorhizomatic/rss/';

const MONTH_NAMES = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december',
];

interface Film {
  title: string;
  year: string;
  url: string;
  watchedDate: string;
}

function getContentDir(): string {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  return join(__dirname, '..', '..', 'content', 'changelog');
}

function parseFilmsFromRSS(xml: string): Film[] {
  const films: Film[] = [];
  const itemMatches = xml.matchAll(/<item>([\s\S]*?)<\/item>/g);

  for (const match of itemMatches) {
    const item = match[1];
    if (!item) continue;

    const linkMatch = item.match(/<link>(.*?)<\/link>/);
    const titleMatch = item.match(
      /<letterboxd:filmTitle>(.*?)<\/letterboxd:filmTitle>/,
    );
    const yearMatch = item.match(
      /<letterboxd:filmYear>(.*?)<\/letterboxd:filmYear>/,
    );
    const watchedDateMatch = item.match(
      /<letterboxd:watchedDate>(.*?)<\/letterboxd:watchedDate>/,
    );

    if (
      linkMatch?.[1] &&
      titleMatch?.[1] &&
      yearMatch?.[1] &&
      watchedDateMatch?.[1]
    ) {
      films.push({
        title: decodeHTMLEntities(titleMatch[1]),
        year: yearMatch[1],
        url: linkMatch[1],
        watchedDate: watchedDateMatch[1],
      });
    }
  }

  return films;
}

function decodeHTMLEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'");
}

function filterFilmsByMonth(
  films: Film[],
  year: number,
  month: number,
): Film[] {
  const yearStr = year.toString();
  const monthStr = (month + 1).toString().padStart(2, '0');
  const prefix = `${yearStr}-${monthStr}`;

  return films.filter((film) => film.watchedDate.startsWith(prefix));
}

function formatFilmEntry(film: Film): string {
  const title = film.title.toLowerCase();
  return `- [*${title}*](${film.url}) (${film.year})`;
}

function generateMarkdown(year: number, month: number, films: Film[]): string {
  const monthName = MONTH_NAMES[month];
  const filmEntries = films.map(formatFilmEntry).join('\n');

  return `---
title: ${year} - ${monthName}
---

### read

### watched

${filmEntries}

### listened

### worked on

`;
}

async function main() {
  const arg = process.argv[2];

  if (!arg || !/^\d{6}$/.test(arg)) {
    console.error('usage: tsx generateChangelog.ts <YYYYMM>');
    console.error('example: tsx generateChangelog.ts 202602');
    process.exit(1);
  }

  const year = Number.parseInt(arg.slice(0, 4), 10);
  const month = Number.parseInt(arg.slice(4, 6), 10) - 1; // Convert 1-based to 0-based

  if (month < 0 || month > 11) {
    console.error('invalid month: must be 01-12');
    process.exit(1);
  }

  const filename = `${arg}.md`;
  const contentDir = getContentDir();
  const filepath = join(contentDir, filename);

  if (existsSync(filepath)) {
    console.log('file exists');
    process.exit(0);
  }

  const response = await fetch(RSS_URL);
  if (!response.ok) {
    console.error(`failed to fetch RSS: ${response.status}`);
    process.exit(1);
  }

  const xml = await response.text();
  const allFilms = parseFilmsFromRSS(xml);
  const monthFilms = filterFilmsByMonth(allFilms, year, month);

  const markdown = generateMarkdown(year, month, monthFilms);

  if (!existsSync(contentDir)) {
    mkdirSync(contentDir, { recursive: true });
  }

  writeFileSync(filepath, markdown);
  console.log(`created ${filename}`);
}

main();
