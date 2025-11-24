const nameInput = document.getElementById('nameInput');
const fontSelect = document.getElementById('fontSelect');
const thicknessRange = document.getElementById('thicknessRange');
const downloadPngBtn = document.getElementById('downloadPngBtn');
const canvas = document.getElementById('signatureCanvas');
const ctx = canvas.getContext('2d');

function drawSignature() {
  const dpr = Math.max(1, Math.min(3, window.devicePixelRatio || 1));
  const baseWidth = 1200;
  const baseHeight = 400;

  canvas.width = baseWidth * dpr;
  canvas.height = baseHeight * dpr;
  canvas.style.width = baseWidth + 'px';
  canvas.style.height = baseHeight + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  // Clear with transparent background
  ctx.clearRect(0, 0, baseWidth, baseHeight);

  const text = (nameInput.value || 'Ouabas Hakima').trim();
  const fontFamily = fontSelect.value;
  const strokeWidth = Number(thicknessRange.value);

  // Compute dynamic font size to fit width with padding
  const maxWidth = baseWidth - 120;
  let fontSize = 180; // start large, then adjust
  ctx.font = `${fontSize}px ${fontFamily}`;
  let metrics = ctx.measureText(text);

  // Scale down until it fits
  while (metrics.width > maxWidth && fontSize > 24) {
    fontSize -= 2;
    ctx.font = `${fontSize}px ${fontFamily}`;
    metrics = ctx.measureText(text);
  }

  // Center positioning
  const x = (baseWidth - metrics.width) / 2;
  const y = baseHeight / 2 + fontSize / 3; // optical baseline

  // Stylized stroke + fill for calligraphic look
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.strokeStyle = 'rgba(255,255,255,0.92)';
  ctx.fillStyle = 'rgba(255,255,255,1)';
  ctx.lineWidth = strokeWidth;

  // Slight tilt for signature effect
  ctx.save();
  const tilt = -4 * Math.PI / 180; // -4 degrees
  ctx.translate(baseWidth / 2, baseHeight / 2);
  ctx.rotate(tilt);
  ctx.translate(-baseWidth / 2, -baseHeight / 2);

  ctx.font = `${fontSize}px ${fontFamily}`;
  ctx.strokeText(text, x, y);
  ctx.fillText(text, x, y);
  ctx.restore();
}

function downloadPNG() {
  // Ensure freshly rendered
  drawSignature();
  const dataUrl = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = 'signature-ouabas-hakima.png';
  document.body.appendChild(a);
  a.click();
  a.remove();
}

// Re-render on input changes (with a tiny debounce)
let raf;
function scheduleDraw() {
  if (raf) cancelAnimationFrame(raf);
  raf = requestAnimationFrame(drawSignature);
}

nameInput.addEventListener('input', scheduleDraw);
fontSelect.addEventListener('change', scheduleDraw);
thicknessRange.addEventListener('input', scheduleDraw);
downloadPngBtn.addEventListener('click', downloadPNG);

// Initial render after fonts load
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(drawSignature);
} else {
  window.addEventListener('load', drawSignature);
}

