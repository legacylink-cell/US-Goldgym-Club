/**
 * Post-build prerender: writes a real HTML file per public route with that route's
 * title, description, og/twitter tags, canonical and JSON-LD already in the markup,
 * so crawlers that do not execute JavaScript (Bing, GPTBot, ClaudeBot, PerplexityBot)
 * see the correct head. The SPA still takes over on load and rewrites the same tags.
 */
const fs = require("fs");
const path = require("path");
const esbuild = require("esbuild");

const FRONTEND = path.resolve(__dirname, "..");
const BUILD = path.join(FRONTEND, "build");
const TMP = path.join(FRONTEND, "node_modules", ".cache", "prerender-meta.cjs");

const escapeAttr = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const escapeText = (s) => String(s).replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Bundle the app's meta + schema modules (they use the "@/" webpack alias and ESM) into CJS
// so this Node script can reuse them as the single source of truth.
const loadMeta = async () => {
  await esbuild.build({
    stdin: {
      contents: `export { PAGE_META } from "@/lib/pageMeta";
export { buildPageSchema } from "@/lib/pageSchema";`,
      resolveDir: FRONTEND,
      loader: "js",
    },
    bundle: true,
    platform: "node",
    format: "cjs",
    outfile: TMP,
    alias: { "@": path.join(FRONTEND, "src") },
    logLevel: "silent",
  });
  return require(TMP);
};

const replaceTag = (html, pattern, replacement) =>
  pattern.test(html) ? html.replace(pattern, replacement) : html;

const renderHead = (html, route, meta, schema) => {
  const url = `https://usgoldgymclub.com${route === "/" ? "/" : route}`;
  const title = escapeText(meta.title);
  const desc = escapeAttr(meta.description);

  let out = html;
  out = replaceTag(out, /<title>[\s\S]*?<\/title>/, `<title>${title}</title>`);
  out = replaceTag(
    out,
    /<meta name="description" content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${desc}"/>`
  );
  out = replaceTag(
    out,
    /<meta property="og:title" content="[^"]*"\s*\/?>/,
    `<meta property="og:title" content="${escapeAttr(meta.title)}"/>`
  );
  out = replaceTag(
    out,
    /<meta property="og:description" content="[^"]*"\s*\/?>/,
    `<meta property="og:description" content="${desc}"/>`
  );
  out = replaceTag(
    out,
    /<meta property="og:url" content="[^"]*"\s*\/?>/,
    `<meta property="og:url" content="${url}"/>`
  );
  out = replaceTag(
    out,
    /<meta name="twitter:title" content="[^"]*"\s*\/?>/,
    `<meta name="twitter:title" content="${escapeAttr(meta.title)}"/>`
  );
  out = replaceTag(
    out,
    /<meta name="twitter:description" content="[^"]*"\s*\/?>/,
    `<meta name="twitter:description" content="${desc}"/>`
  );
  out = replaceTag(
    out,
    /<link rel="canonical" href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${url}"/>`
  );

  const schemaTag = `<script type="application/ld+json" id="page-schema">${JSON.stringify(
    schema
  ).replace(/</g, "\\u003c")}</script>`;
  return out.replace("</head>", `${schemaTag}</head>`);
};

(async () => {
  const indexPath = path.join(BUILD, "index.html");
  if (!fs.existsSync(indexPath)) {
    console.error("[prerender] build/index.html not found - run the build first.");
    process.exit(1);
  }

  const { PAGE_META, buildPageSchema } = await loadMeta();
  const template = fs.readFileSync(indexPath, "utf8");
  const routes = Object.keys(PAGE_META);
  let written = 0;

  for (const route of routes) {
    const html = renderHead(template, route, PAGE_META[route], buildPageSchema(route));
    const target =
      route === "/" ? indexPath : path.join(BUILD, route.replace(/^\//, ""), "index.html");
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, html);
    written += 1;
    console.log(`[prerender] ${route} -> ${path.relative(BUILD, target)}`);
  }

  // Sanity check: every emitted file must carry its own title.
  const titles = new Set(
    routes.map((route) => {
      const file =
        route === "/" ? indexPath : path.join(BUILD, route.replace(/^\//, ""), "index.html");
      return (fs.readFileSync(file, "utf8").match(/<title>([\s\S]*?)<\/title>/) || [])[1];
    })
  );
  if (titles.size !== routes.length) {
    console.error(`[prerender] FAILED: ${titles.size} unique titles for ${routes.length} routes`);
    process.exit(1);
  }
  console.log(`[prerender] ${written} routes written, ${titles.size} unique titles.`);
})();
