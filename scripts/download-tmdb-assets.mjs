import fs from "node:fs/promises";
import path from "node:path";

const DATA_FILE = process.env.DATA_FILE || "src/services/data.json";
const IMAGE_ROOT = process.env.IMAGE_ROOT || "images";
const API_KEY = process.env.TMDB_API_KEY;

if (!API_KEY) throw new Error("Missing TMDB_API_KEY environment variable.");

const data = JSON.parse(await fs.readFile(DATA_FILE, "utf8"));
if (!Array.isArray(data)) throw new Error(`${DATA_FILE} must contain a JSON array.`);

function slugify(value) {
  return value.replace(/:/g, "").replace(/[^A-Za-z0-9]+/g, "") || "Title";
}

async function search(item) {
  const kind = item.mediaType === "series" ? "tv" : "movie";
  const url = new URL(`https://api.themoviedb.org/3/search/${kind}`);
  url.searchParams.set("api_key", API_KEY);
  url.searchParams.set("query", item.title);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`TMDB HTTP ${response.status} for ${item.title}`);
  const json = await response.json();
  return json.results?.[0] ?? null;
}

async function saveImage(imagePath, destination) {
  if (!imagePath) return false;
  const response = await fetch(`https://image.tmdb.org/t/p/original${imagePath}`);
  if (!response.ok) return false;
  await fs.mkdir(path.dirname(destination), { recursive: true });
  await fs.writeFile(destination, Buffer.from(await response.arrayBuffer()));
  return true;
}

let count = 0;
for (const item of data) {
  const slug = slugify(item.title);
  const folder = path.join(IMAGE_ROOT, slug);
  console.log(`Searching ${item.title}...`);
  try {
    const result = await search(item);
    if (!result) {
      console.warn(`No match: ${item.title}`);
      continue;
    }

    const poster = await saveImage(result.poster_path, path.join(folder, `${slug}Poster.jpg`));
    const backdrop = await saveImage(result.backdrop_path, path.join(folder, `${slug}Backdrop.jpg`));

    item.poster_url = poster ? `${folder}/${slug}Poster.jpg`.replaceAll("\\\\", "/") : "";
    item.backdrop_url = backdrop ? `${folder}/${slug}Backdrop.jpg`.replaceAll("\\\\", "/") : "";

    if (result.overview) item.summary = result.overview;
    if (typeof result.vote_average === "number") {
      item.rating = { score: Number(result.vote_average.toFixed(1)), vote_count: result.vote_count ?? 0 };
    }
    const date = result.release_date || result.first_air_date;
    if (date) {
      const d = new Date(`${date}T00:00:00Z`);
      item.releaseDate = d.toLocaleDateString("en-US", {
        month: "long", day: "numeric", year: "numeric", timeZone: "UTC"
      });
    }
    count += Number(poster) + Number(backdrop);
    console.log(`  TMDB ${result.id}: poster=${poster}, backdrop=${backdrop}`);
  } catch (err) {
    console.error(`Failed ${item.title}: ${err.message}`);
  }
}
await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2) + "\n", "utf8");
console.log(`Done. Downloaded ${count} images.`);
