<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Undertale Web</title>
  <style>
    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: black;
    }
    #game-canvas { display: block; width: 100%; height: 100%; }
  </style>
</head>
<body>

<canvas id="game-canvas"></canvas>

<script>
(async () => {
  const DATA_PARTS = [
    "https://cdn.jsdelivr.net/gh/KaiFireblade10/undertale-web@main/data.part1",
    "https://cdn.jsdelivr.net/gh/KaiFireblade10/undertale-web@main/data.part2",
    "https://cdn.jsdelivr.net/gh/KaiFireblade10/undertale-web@main/data.part3",
    "https://cdn.jsdelivr.net/gh/KaiFireblade10/undertale-web@main/data.part4"
  ];

  // Fetch all parts
  const buffers = await Promise.all(DATA_PARTS.map(url => fetch(url).then(r => r.arrayBuffer())));
  const totalLength = buffers.reduce((sum, buf) => sum + buf.byteLength, 0);
  const dataWin = new Uint8Array(totalLength);
  let offset = 0;
  for (const buf of buffers) {
    dataWin.set(new Uint8Array(buf), offset);
    offset += buf.byteLength;
  }

  // Create Module before runner.js
  window.Module = {
    preRun: [() => {
      FS.createDataFile("/", "data.win", dataWin, true, true);
    }],
    canvas: document.getElementById("game-canvas")
  };

  // Load runner.js dynamically AFTER data.win is ready
  const script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/gh/KaiFireblade10/undertale-web@main/runner.js";
  document.body.appendChild(script);
})();
</script>

</body>
</html>
