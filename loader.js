// loader.js — fully CDN-based split data loader
const DATA_PARTS = [
  "https://cdn.jsdelivr.net/gh/KaiFireblade10/undertale-web@main/data.part1",
  "https://cdn.jsdelivr.net/gh/KaiFireblade10/undertale-web@main/data.part2",
  "https://cdn.jsdelivr.net/gh/KaiFireblade10/undertale-web@main/data.part3",
  "https://cdn.jsdelivr.net/gh/KaiFireblade10/undertale-web@main/data.part4"
];

(async () => {
  // Fetch all parts from jsDelivr
  const chunks = [];
  for (const partUrl of DATA_PARTS) {
    const res = await fetch(partUrl);
    if (!res.ok) throw new Error("Failed to load " + partUrl);
    chunks.push(new Uint8Array(await res.arrayBuffer()));
  }

  // Merge parts into a single data.win buffer
  let totalLength = 0;
  for (const chunk of chunks) totalLength += chunk.length;

  const dataWin = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    dataWin.set(chunk, offset);
    offset += chunk.length;
  }

  // Inject data.win into Emscripten FS before engine starts
  Module = Module || {};
  Module.preRun = Module.preRun || [];
  Module.preRun.push(() => {
    FS.createDataFile("/", "data.win", dataWin, true, true);
  });
})();
