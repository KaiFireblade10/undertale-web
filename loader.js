// loader.js — minimal split data loader (flat folder)

const DATA_PARTS = [
  "data.part1",
  "data.part2",
  "data.part3",
  "data.part4"
];

(async () => {
  // Fetch parts
  const chunks = [];
  for (const part of DATA_PARTS) {
    const res = await fetch(part);
    if (!res.ok) throw new Error("Failed to load " + part);
    chunks.push(new Uint8Array(await res.arrayBuffer()));
  }

  // Merge parts
  let total = 0;
  for (const c of chunks) total += c.length;

  const dataWin = new Uint8Array(total);
  let offset = 0;
  for (const c of chunks) {
    dataWin.set(c, offset);
    offset += c.length;
  }

  // Inject before engine starts
  Module = Module || {};
  Module.preRun = Module.preRun || [];
  Module.preRun.push(() => {
    FS.createDataFile("/", "data.win", dataWin, true, true);
  });
})();
