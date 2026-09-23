const PDFJS_VERSION = '3.11.174';
const PDFJS_BASE = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}`;
// Subresource Integrity hashes for the exact files at PDFJS_VERSION above (computed from
// the actual CDN response, not copied from a listing) — the WebView refuses to execute
// either script if cdnjs ever serves something that doesn't match, e.g. a compromised CDN
// or a MITM'd response, rather than silently running whatever arrived.
const PDFJS_MIN_JS_INTEGRITY =
  'sha384-/1qUCSGwTur9vjf/z9lmu/eCUYbpOTgSjmpbMQZ1/CtX2v/WcAIKqRv+U1DUCG6e';
const PDFJS_WORKER_MIN_JS_INTEGRITY =
  'sha384-SnzOobpRMLXZ52iJvZm/C0fYw0OQemTXzTjIsdsfMcrCtCEe9qgzxTd3RSklO5x2';

// Android's WebView can't render PDFs natively, so the PDF is drawn page by page onto
// canvases with pdf.js. Loading the worker as a plain <script> makes pdf.js run it on the
// main thread, which avoids the cross-origin Worker restriction.
export function buildPdfViewerHtml(base64Pdf: string): string {
  return `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=5, user-scalable=yes" />
<style>
  body { margin: 0; background: #e5e5e5; }
  canvas { display: block; width: 100%; margin: 0 auto 8px; background: #fff; }
  #status { font: 14px sans-serif; text-align: center; padding: 24px; color: #555; }
</style>
<script src="${PDFJS_BASE}/pdf.min.js" integrity="${PDFJS_MIN_JS_INTEGRITY}" crossorigin="anonymous"></script>
<script src="${PDFJS_BASE}/pdf.worker.min.js" integrity="${PDFJS_WORKER_MIN_JS_INTEGRITY}" crossorigin="anonymous"></script>
</head>
<body>
<div id="status">Loading report…</div>
<script>
  (async function () {
    var status = document.getElementById('status');
    try {
      pdfjsLib.GlobalWorkerOptions.workerSrc = '${PDFJS_BASE}/pdf.worker.min.js';
      var bin = atob('${base64Pdf}');
      var bytes = new Uint8Array(bin.length);
      for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      var pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
      status.remove();
      var scale = (window.devicePixelRatio || 1) * 1.5;
      for (var n = 1; n <= pdf.numPages; n++) {
        var page = await pdf.getPage(n);
        var viewport = page.getViewport({ scale: scale * (window.innerWidth / page.getViewport({ scale: 1 }).width) });
        var canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        document.body.appendChild(canvas);
        await page.render({ canvasContext: canvas.getContext('2d'), viewport: viewport }).promise;
      }
    } catch (e) {
      status.textContent = 'Could not display the report. Use the share button to open it.';
    }
  })();
</script>
</body>
</html>`;
}
