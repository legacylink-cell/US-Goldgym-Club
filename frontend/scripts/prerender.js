/**
 * Post-build prerender.
 *
 * Phase 1 - head: writes a real HTML file per public route with that route's title,
 * description, og/twitter tags, canonical and JSON-LD already in the markup.
 * Phase 2 - body: boots the built bundle inside jsdom against a local static server and
 * bakes the rendered #root markup into each file, so crawlers that do not execute
 * JavaScript (Bing, GPTBot, ClaudeBot, PerplexityBot) get the real page copy.
 *
 * The output <html> carries class="react-snap"; index.js removes it on mount so the
 * prerender-only CSS overrides (see index.css) never affect real visitors' animations.
 */
const fs = require("fs");
const http = require("http");
const path = require("path");
const esbuild = require("esbuild");
const { JSDOM, ResourceLoader, VirtualConsole } = require("jsdom");

const FRONTEND = path.resolve(__dirname, "..");
const BUILD = path.join(FRONTEND, "build");
const TMP = path.join(FRONTEND, "node_modules", ".cache", "prerender-meta.cjs");
const ROUTE_TIMEOUT_MS = 7000;

const escapeAttr = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const escapeText = (s) => String(s).replace(/</g, "&lt;").replace(/>/g, "&gt;");

const fileFor = (route) =>
  route === "/" ? path.join(BUILD, "index.html") : path.join(BUILD, route.replace(/^\//, ""), "index.html");

// ---------------------------------------------------------------- phase 1: head

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
  const ogTitle = escapeAttr(meta.title);

  let out = html;
  out = replaceTag(out, /<title>[\s\S]*?<\/title>/, `<title>${title}</title>`);
  out = replaceTag(out, /<meta name="description" content="[^"]*"\s*\/?>/, `<meta name="description" content="${desc}"/>`);
  out = replaceTag(out, /<meta property="og:title" content="[^"]*"\s*\/?>/, `<meta property="og:title" content="${ogTitle}"/>`);
  out = replaceTag(out, /<meta property="og:description" content="[^"]*"\s*\/?>/, `<meta property="og:description" content="${desc}"/>`);
  out = replaceTag(out, /<meta property="og:url" content="[^"]*"\s*\/?>/, `<meta property="og:url" content="${url}"/>`);
  out = replaceTag(out, /<meta name="twitter:title" content="[^"]*"\s*\/?>/, `<meta name="twitter:title" content="${ogTitle}"/>`);
  out = replaceTag(out, /<meta name="twitter:description" content="[^"]*"\s*\/?>/, `<meta name="twitter:description" content="${desc}"/>`);
  out = replaceTag(out, /<link rel="canonical" href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${url}"/>`);

  const schemaTag = `<script type="application/ld+json" id="page-schema">${JSON.stringify(schema).replace(
    /</g,
    "\\u003c"
  )}</script>`;
  return out.replace("</head>", `${schemaTag}</head>`);
};

// ------------------------------------------------- local static server for jsdom

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
};

const startServer = () =>
  new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const urlPath = decodeURIComponent(req.url.split("?")[0]);
      let filePath = path.join(BUILD, urlPath);
      if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, "index.html");
      }
      if (!fs.existsSync(filePath)) {
        // API calls and unknown paths: answer fast so the render never waits on them.
        if (urlPath.startsWith("/api/")) {
          res.writeHead(503, { "Content-Type": "application/json" });
          res.end("{}");
          return;
        }
        filePath = path.join(BUILD, "index.html");
      }
      res.writeHead(200, { "Content-Type": MIME[path.extname(filePath)] || "application/octet-stream" });
      fs.createReadStream(filePath).pipe(res);
    });
    server.listen(0, "127.0.0.1", () => resolve(server));
  });

// ---------------------------------------------------------------- phase 2: body

// jsdom has no IntersectionObserver, so framer-motion's whileInView reveals would never
// fire. Report every observed element as fully in view immediately.
const BEFORE_PARSE = `
(function () {
  function IO(cb) { this._cb = cb; }
  IO.prototype.observe = function (el) {
    this._cb([{ isIntersecting: true, intersectionRatio: 1, target: el, time: 0,
      boundingClientRect: { top: 0, left: 0, bottom: 0, right: 0, width: 0, height: 0 },
      intersectionRect: { top: 0, left: 0, bottom: 0, right: 0, width: 0, height: 0 },
      rootBounds: null }], this);
  };
  IO.prototype.unobserve = function () {};
  IO.prototype.disconnect = function () {};
  IO.prototype.takeRecords = function () { return []; };
  window.IntersectionObserver = IO;
  window.IntersectionObserverEntry = function () {};

  if (!window.ResizeObserver) {
    window.ResizeObserver = function () {};
    window.ResizeObserver.prototype.observe = function () {};
    window.ResizeObserver.prototype.unobserve = function () {};
    window.ResizeObserver.prototype.disconnect = function () {};
  }
  if (!window.Element.prototype.animate) {
    window.Element.prototype.animate = function () {
      return { finished: Promise.resolve(), cancel: function () {}, play: function () {},
        pause: function () {}, commitStyles: function () {}, playState: "finished", currentTime: 0 };
    };
  }
  if (!window.scrollTo) window.scrollTo = function () {};
})();
`;

const renderBody = async (origin, route) => {
  const virtualConsole = new VirtualConsole(); // swallow app console noise
  const loader = new (class extends ResourceLoader {
    fetch(url, options) {
      // Only load our own bundle/css. Third-party (fonts, analytics, CDN images) is skipped.
      if (!url.startsWith(origin)) return null;
      return super.fetch(url, options);
    }
  })();

  const dom = await JSDOM.fromURL(`${origin}${route}`, {
    runScripts: "dangerously",
    resources: loader,
    pretendToBeVisual: true,
    virtualConsole,
    beforeParse(window) {
      window.eval(BEFORE_PARSE);
    },
  });

  const { window } = dom;
  const deadline = Date.now() + ROUTE_TIMEOUT_MS;
  let previous = "";
  let stable = 0;

  try {
    while (Date.now() < deadline) {
      await new Promise((r) => window.setTimeout(r, 250));
      const root = window.document.getElementById("root");
      const html = root ? root.innerHTML : "";
      // Settled once the markup stops changing and actually contains content.
      if (html.length > 500 && html === previous) {
        stable += 1;
        if (stable >= 3) break;
      } else {
        stable = 0;
      }
      previous = html;
    }

    const root = window.document.getElementById("root");
    const markup = root ? root.innerHTML : "";
    const h1s = (markup.match(/<h1/g) || []).length;
    return { markup, h1s };
  } finally {
    window.close();
  }
};

const injectBody = (html, markup) => {
  const withBody = html.replace(
    /(<div id="root">)[\s\S]*?(<\/div>)/,
    () => `<div id="root">${markup}</div>`
  );
  return withBody.replace(
    /<html([^>]*)>/,
    (match, attrs) =>
      /class="/.test(attrs)
        ? `<html${attrs.replace(/class="([^"]*)"/, 'class="$1 react-snap"')}>`
        : `<html${attrs} class="react-snap">`
  );
};

// ---------------------------------------------------------------------- pipeline

(async () => {
  const indexPath = path.join(BUILD, "index.html");
  if (!fs.existsSync(indexPath)) {
    console.error("[prerender] build/index.html not found - run the build first.");
    process.exit(1);
  }

  const { PAGE_META, buildPageSchema } = await loadMeta();
  const template = fs.readFileSync(indexPath, "utf8");
  const routes = Object.keys(PAGE_META);

  for (const route of routes) {
    const html = renderHead(template, route, PAGE_META[route], buildPageSchema(route));
    const target = fileFor(route);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, html);
  }
  console.log(`[prerender] head written for ${routes.length} routes`);

  const server = await startServer();
  const { port } = server.address();
  const origin = `http://127.0.0.1:${port}`;
  const empty = [];

  for (const route of routes) {
    const started = Date.now();
    try {
      const { markup, h1s } = await renderBody(origin, route);
      if (!markup || markup.length < 500) {
        empty.push(route);
        console.warn(`[prerender] ${route} produced no markup - keeping head-only file`);
        continue;
      }
      const target = fileFor(route);
      fs.writeFileSync(target, injectBody(fs.readFileSync(target, "utf8"), markup));
      console.log(
        `[prerender] ${route} body ${(markup.length / 1024).toFixed(0)}KB, ${h1s} h1, ${
          Date.now() - started
        }ms`
      );
    } catch (err) {
      empty.push(route);
      console.warn(`[prerender] ${route} failed (${err.message}) - keeping head-only file`);
    }
  }

  server.close();

  // Verify: unique titles, and real copy in the shell.
  const titles = new Set();
  const noBody = [];
  for (const route of routes) {
    const html = fs.readFileSync(fileFor(route), "utf8");
    titles.add((html.match(/<title>([\s\S]*?)<\/title>/) || [])[1]);
    if (/<div id="root"><\/div>/.test(html)) noBody.push(route);
  }
  if (titles.size !== routes.length) {
    console.error(`[prerender] FAILED: ${titles.size} unique titles for ${routes.length} routes`);
    process.exit(1);
  }
  console.log(
    `[prerender] done - ${routes.length - noBody.length}/${routes.length} routes with body copy` +
      (noBody.length ? `, empty: ${noBody.join(", ")}` : "")
  );
  if (empty.length === routes.length) {
    console.error("[prerender] FAILED: no route rendered any body markup");
    process.exit(1);
  }
})();
