// @ts-nocheck
import { defineConfig } from "vite";
import { sveltekit } from "@sveltejs/kit/vite";
import process from "node:process";
import fs from "node:fs";
import path from "node:path";
import { exec } from "node:child_process";

const host = process.env.TAURI_DEV_HOST;

function ideServerPlugin() {
  return {
    name: "ide-server-plugin",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url, `http://${req.headers.host}`);
        if (!url.pathname.startsWith("/api/")) {
          return next();
        }

        res.setHeader("Content-Type", "application/json");

        const getJsonBody = async () => {
          return new Promise((resolve) => {
            let body = "";
            req.on("data", (chunk) => (body += chunk));
            req.on("end", () => {
              try {
                resolve(body ? JSON.parse(body) : {});
              } catch {
                resolve({});
              }
            });
          });
        };

        try {
          if (url.pathname === "/api/workspace") {
            res.end(JSON.stringify({ path: process.cwd() }));
            return;
          }

          if (url.pathname === "/api/list") {
            const dirPath = url.searchParams.get("path") || process.cwd();
            const entries = fs.readdirSync(dirPath, { withFileTypes: true });
            const files = entries
              .filter((e) => !['.git', 'node_modules', 'target', '.DS_Store'].includes(e.name))
              .map((e) => {
                const fullPath = path.join(dirPath, e.name);
                let size = 0;
                try {
                  if (!e.isDirectory()) size = fs.statSync(fullPath).size;
                } catch {}
                return {
                  name: e.name,
                  path: fullPath,
                  is_dir: e.isDirectory(),
                  size,
                };
              })
              .sort((a, b) => {
                if (a.is_dir && !b.is_dir) return -1;
                if (!a.is_dir && b.is_dir) return 1;
                return a.name.localeCompare(b.name);
              });
            res.end(JSON.stringify(files));
            return;
          }

          if (url.pathname === "/api/read") {
            const filePath = url.searchParams.get("path");
            if (!filePath || !fs.existsSync(filePath)) {
              res.statusCode = 404;
              res.end(JSON.stringify({ error: "File not found" }));
              return;
            }
            const content = fs.readFileSync(filePath, "utf-8");
            res.end(JSON.stringify({ content }));
            return;
          }

          if (url.pathname === "/api/write" && req.method === "POST") {
            const body = await getJsonBody();
            const { path: filePath, content } = body;
            fs.mkdirSync(path.dirname(filePath), { recursive: true });
            fs.writeFileSync(filePath, content, "utf-8");
            res.end(JSON.stringify({ success: true }));
            return;
          }

          if (url.pathname === "/api/create" && req.method === "POST") {
            const body = await getJsonBody();
            const { path: targetPath, is_dir } = body;
            if (is_dir) {
              fs.mkdirSync(targetPath, { recursive: true });
            } else {
              fs.mkdirSync(path.dirname(targetPath), { recursive: true });
              fs.writeFileSync(targetPath, "", "utf-8");
            }
            res.end(JSON.stringify({ success: true }));
            return;
          }

          if (url.pathname === "/api/delete" && req.method === "POST") {
            const body = await getJsonBody();
            const { path: targetPath } = body;
            if (fs.existsSync(targetPath)) {
              fs.rmSync(targetPath, { recursive: true, force: true });
            }
            res.end(JSON.stringify({ success: true }));
            return;
          }

          if (url.pathname === "/api/search") {
            const query = (url.searchParams.get("q") || "").toLowerCase();
            const root = url.searchParams.get("root") || process.cwd();
            const results = [];

            function walk(dir) {
              if (results.length >= 200) return;
              try {
                const list = fs.readdirSync(dir, { withFileTypes: true });
                for (const item of list) {
                  if (['.git', 'node_modules', 'target', '.svelte-kit', 'build'].includes(item.name)) continue;
                  const itemPath = path.join(dir, item.name);
                  if (item.isDirectory()) {
                    walk(itemPath);
                  } else {
                    try {
                      const text = fs.readFileSync(itemPath, "utf-8");
                      const lines = text.split("\n");
                      lines.forEach((line, index) => {
                        if (line.toLowerCase().includes(query) && results.length < 200) {
                          results.push({
                            file_path: itemPath,
                            line_number: index + 1,
                            line_content: line.trim(),
                          });
                        }
                      });
                    } catch {}
                  }
                }
              } catch {}
            }

            if (query) walk(root);
            res.end(JSON.stringify(results));
            return;
          }

          if (url.pathname === "/api/exec" && req.method === "POST") {
            const body = await getJsonBody();
            const { command, cwd } = body;
            exec(command, { cwd: cwd || process.cwd(), timeout: 15000 }, (error, stdout, stderr) => {
              res.end(
                JSON.stringify({
                  success: !error,
                  exit_code: error ? error.code : 0,
                  stdout: stdout || "",
                  stderr: stderr || (error ? error.message : ""),
                })
              );
            });
            return;
          }

          res.statusCode = 404;
          res.end(JSON.stringify({ error: "Endpoint not found" }));
        } catch (err) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: String(err) }));
        }
      });
    },
  };
}

export default defineConfig(() => ({
  plugins: [ideServerPlugin(), sveltekit()],
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    host: host || "127.0.0.1",
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      ignored: ["**/src-tauri/**"],
    },
  },
}));
