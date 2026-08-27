import { copyFile, cp, mkdir, rm } from "node:fs/promises";
import { join } from "node:path";

const projectRoot = process.cwd();
const openNextDir = join(projectRoot, ".open-next");
const distDir = join(projectRoot, "dist");
const serverDir = join(distDir, "server");

await rm(distDir, { force: true, recursive: true });
await mkdir(serverDir, { recursive: true });
await copyFile(join(openNextDir, "worker.js"), join(serverDir, "index.js"));
await cp(join(openNextDir, "cloudflare"), join(serverDir, "cloudflare"), {
  recursive: true,
});
await cp(join(openNextDir, "middleware"), join(serverDir, "middleware"), {
  recursive: true,
});
await cp(join(openNextDir, "assets"), join(distDir, "assets"), {
  recursive: true,
});
