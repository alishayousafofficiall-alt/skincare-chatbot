<?php include 'include/header.php'; ?>
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SKINTELLECT — Real AI Skin Analysis</title>
  <link
    href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap"
    rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box }
    :root {
      --bg: #F7F5F0; --bg2: #FFFFFF; --bg3: #EBE6DB;
      --border: #E0D5C4; --border2: #D1C4AF;
      --g1: #C5A059; --g2: #A6823D; --g3: #8B6B33;
      --g-dim: rgba(197, 160, 89, 0.08); --g-dim2: rgba(197, 160, 89, 0.15);
      --txt: #2C2420; --txt2: #5E5045; --txt3: #9C8E82;
      --warn: #B8860B; --danger: #C45C5C; --info: #7A9BB3;
      --font-head: 'Syne', sans-serif; --font-body: 'Instrument Sans', sans-serif;
    }
    body { font-family: var(--font-body); background: var(--bg); color: var(--txt); min-height: 100vh; overflow-x: hidden }
    body::before {
      content: ''; position: fixed; inset: 0;
      background: radial-gradient(ellipse 80% 50% at 10% -10%, rgba(197,160,89,.08) 0%, transparent 60%),
        radial-gradient(ellipse 60% 40% at 90% 110%, rgba(166,130,61,.05) 0%, transparent 55%);
      pointer-events: none; z-index: 0
    }
    ::-webkit-scrollbar { width: 6px }
    ::-webkit-scrollbar-track { background: var(--bg) }
    ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 4px }

    .view { display: none; animation: fadeIn .4s ease }
    .view.active { display: block }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(12px) } to { opacity: 1; transform: translateY(0) } }

    main { position: relative; z-index: 1; max-width: 1200px; margin: 0 auto; padding: 32px 20px 80px }

    #upload-view { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 80vh; text-align: center }

    .hero-tag {
      display: inline-flex; align-items: center; gap: 6px;
      background: rgba(197,160,89,0.1); border: 1px solid rgba(197,160,89,.3); color: var(--g2);
      font-size: .72rem; font-weight: 600; letter-spacing: .1em; text-transform: uppercase;
      padding: 5px 12px; border-radius: 100px; margin-bottom: 20px
    }
    h1 { font-family: var(--font-head); font-size: clamp(2.2rem, 5vw, 3.6rem); font-weight: 800; line-height: 1.1; letter-spacing: -.02em; margin-bottom: 14px; color: var(--txt) }
    h1 span { color: var(--g1) }
    .hero-sub { color: var(--txt2); font-size: 1rem; max-width: 560px; line-height: 1.6; margin-bottom: 36px }

    .capture-tabs { display: flex; gap: 8px; margin-bottom: 20px; background: var(--bg2); border: 1px solid var(--border); border-radius: 100px; padding: 4px }
    .capture-tab { padding: 9px 22px; border-radius: 100px; font-size: .82rem; font-weight: 600; cursor: pointer; color: var(--txt2); transition: .25s }
    .capture-tab.active { background: var(--g1); color: #fff }

    .capture-panel { width: 100%; max-width: 480px }

    .upload-zone {
      width: 100%; border: 1.5px dashed var(--border2); border-radius: 20px; padding: 44px 30px;
      cursor: pointer; transition: all .35s; background: var(--bg2)
    }
    .upload-zone:hover, .upload-zone.drag { border-color: var(--g1); background: rgba(197,160,89,.05); transform: scale(1.005) }
    .upload-icon-wrap {
      width: 64px; height: 64px; border-radius: 14px; background: var(--g-dim);
      display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;
      border: 1px solid rgba(197,160,89,.3)
    }
    .upload-icon-wrap i { font-size: 1.6rem; color: var(--g1) }
    .upload-title { font-family: var(--font-head); font-weight: 700; font-size: 1.1rem; margin-bottom: 4px }
    .upload-sub { color: var(--txt2); font-size: .85rem; margin-bottom: 18px }

    .btn-primary {
      display: inline-flex; align-items: center; gap: 8px;
      background: linear-gradient(135deg, var(--g1), var(--g2)); color: #fff;
      font-family: var(--font-head); font-weight: 700; font-size: .9rem;
      padding: 11px 24px; border-radius: 10px; border: none; cursor: pointer;
      transition: all .3s; letter-spacing: .03em
    }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(197,160,89,.3) }
    .btn-primary:disabled { opacity: .5; cursor: not-allowed; transform: none }

    .upload-hint { color: var(--txt3); font-size: .75rem; margin-top: 12px }

    .camera-box { position: relative; width: 100%; border-radius: 20px; overflow: hidden; background: #000; border: 1px solid var(--border) }
    .camera-box video { width: 100%; display: block; max-height: 420px; object-fit: cover; transform: scaleX(-1) }
    .camera-controls { display: flex; justify-content: center; gap: 12px; margin-top: 16px }
    .cam-btn-shutter {
      width: 62px; height: 62px; border-radius: 50%; background: var(--g1); border: 4px solid #fff;
      box-shadow: 0 0 0 2px var(--g1); cursor: pointer; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 1.1rem; transition: .2s
    }
    .cam-btn-shutter:hover { transform: scale(1.06) }
    .cam-status { text-align: center; font-size: .8rem; color: var(--txt3); margin-top: 10px }

    .trust-row { display: flex; gap: 20px; margin-top: 24px; color: var(--txt3); font-size: .78rem; flex-wrap: wrap; justify-content: center }
    .trust-row span { display: flex; align-items: center; gap: 5px }
    .trust-row i { color: var(--g2); font-size: .7rem }

    #scan-view { max-width: 560px; margin: 0 auto; text-align: center }
    #scan-view img { width: 100%; max-height: 50vh; object-fit: contain; border-radius: 18px; border: 1px solid var(--border); margin-bottom: 24px }
    .ai-spinner { width: 44px; height: 44px; border: 3px solid rgba(197,160,89,.2); border-top-color: var(--g1); border-radius: 50%; animation: spin .8s linear infinite; margin: 0 auto 16px }
    @keyframes spin { to { transform: rotate(360deg) } }
    #scan-status { font-family: var(--font-head); font-size: 1.1rem; font-weight: 700; margin-bottom: 6px }
    #scan-sub { color: var(--txt2); font-size: .875rem }

    .score-bar {
      display: flex; align-items: center; gap: 24px; background: var(--bg2); border: 1px solid var(--border);
      border-radius: 18px; padding: 22px 28px; margin-bottom: 24px; flex-wrap: wrap;
      box-shadow: 0 4px 20px rgba(0,0,0,0.03);
    }
    .score-ring-wrap { position: relative; flex-shrink: 0 }
    .score-ring-wrap svg { transform: rotate(-90deg) }
    #score-ring { transition: stroke-dashoffset 1.5s cubic-bezier(.25,.46,.45,.94) }
    .score-center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center }
    #score-num { font-family: var(--font-head); font-size: 2rem; font-weight: 800; color: var(--g1) }
    .score-lbl { font-size: .62rem; text-transform: uppercase; letter-spacing: .1em; color: var(--txt3) }
    .score-info { flex: 1; min-width: 200px }
    .score-info h2 { font-family: var(--font-head); font-size: 1.3rem; font-weight: 700; margin-bottom: 6px }
    .badge-row { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 10px }
    .badge { background: var(--g-dim); border: 1px solid rgba(197,160,89,.2); color: var(--g2); font-size: .72rem; font-weight: 600; padding: 3px 10px; border-radius: 100px }
    .badge.info { background: rgba(122,155,179,.1); border-color: rgba(122,155,179,.2); color: #67869B }
    #score-summary { color: var(--txt2); font-size: .875rem; line-height: 1.65; max-width: 600px }
    .btn-ghost {
      background: transparent; border: 1px solid var(--border2); color: var(--txt2);
      font-family: var(--font-head); font-weight: 600; font-size: .8rem; padding: 9px 16px; border-radius: 9px;
      cursor: pointer; transition: all .3s; display: flex; align-items: center; gap: 6px; margin-left: auto; flex-shrink: 0
    }
    .btn-ghost:hover { border-color: var(--g1); color: var(--g1); background: var(--g-dim) }

    .res-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px }
    @media(max-width:900px) { .res-grid { grid-template-columns: 1fr } }

    .img-wrap { border-radius: 14px; overflow: hidden; border: 1px solid var(--border); background: var(--bg2) }
    .img-wrap img { width: 100%; max-height: 480px; object-fit: cover; display: block }

    .panel-title { font-family: var(--font-head); font-size: .72rem; font-weight: 700; text-transform: uppercase; letter-spacing: .12em; color: var(--txt3); margin-bottom: 14px; display: flex; align-items: center; gap: 6px }
    .panel-title i { color: var(--g1) }

    .metric-card { background: var(--bg2); border: 1px solid var(--border); border-radius: 12px; padding: 12px 14px; margin-bottom: 8px }
    .mc-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 7px }
    .mc-label { display: flex; align-items: center; gap: 7px; font-size: .82rem; font-weight: 500 }
    .mc-val { font-family: var(--font-head); font-weight: 700; font-size: .82rem }
    .mc-bar { width: 100%; height: 3px; background: var(--border); border-radius: 2px; overflow: hidden; margin-bottom: 5px }
    .mc-fill { height: 100%; border-radius: 2px; width: 0; transition: width 1s ease }

    .concern-rank { grid-column: 1/-1; background: var(--bg2); border: 1px solid var(--border); border-radius: 14px; padding: 18px 20px }
    .cr-list { display: flex; flex-direction: column; gap: 10px }
    .cr-item { display: flex; align-items: center; gap: 10px; font-size: .85rem; color: var(--txt2) }
    .cr-item i { color: var(--g1); width: 18px }

    .routine-section { grid-column: 1/-1 }
    .routine-phase { margin-bottom: 22px }
    .routine-phase-title { font-family: var(--font-head); font-size: .95rem; font-weight: 700; margin-bottom: 12px; display: flex; align-items: center; gap: 8px }
    .routine-phase-title .phase-time { font-size: .7rem; color: var(--txt3); font-weight: 400; font-family: var(--font-body) }
    .routine-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 14px }
    .prod-card { background: var(--bg2); border: 1px solid var(--border); border-radius: 14px; padding: 14px; display: flex; gap: 14px; transition: all .3s; position: relative }
    .prod-card:hover { border-color: var(--border2); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,.05) }
    .prod-thumb { width: 60px; height: 60px; border-radius: 10px; overflow: hidden; flex-shrink: 0; background: var(--bg3); display: flex; align-items: center; justify-content: center }
    .prod-thumb img { width: 100%; height: 100%; object-fit: cover }
    .prod-body { flex: 1; min-width: 0 }
    .prod-body .prod-brand { font-size: .68rem; font-weight: 600; margin-bottom: 2px; color: var(--g2); text-transform: uppercase; letter-spacing: .04em }
    .prod-body h4 { font-size: .84rem; font-weight: 600; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis }
    .prod-body .prod-desc { font-size: .7rem; color: var(--txt2); line-height: 1.4; margin-bottom: 6px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden }
    .prod-body .prod-meta { display: flex; justify-content: space-between; align-items: center; gap: 8px }
    .prod-body .prod-price { font-size: .8rem; color: var(--txt); font-family: var(--font-head); font-weight: 700 }
    .btn-buy { background: var(--g1); color: #fff; font-size: .68rem; font-weight: 700; padding: 6px 12px; border-radius: 100px; text-decoration: none; white-space: nowrap; transition: .2s }
    .btn-buy:hover { background: var(--g2) }

    .report-box { background: var(--bg2); border: 1px solid var(--border); border-radius: 14px; padding: 20px; grid-column: 1/-1 }
    #report-text { font-size: .9rem; line-height: 1.8; color: var(--txt2); white-space: pre-wrap }

    #toasts { position: fixed; top: 72px; right: 16px; z-index: 999; display: flex; flex-direction: column; gap: 8px; pointer-events: none; max-width: 340px }
    .t-card { display: flex; align-items: center; gap: 10px; padding: 11px 16px; border-radius: 11px; font-size: .82rem; border: 1px solid; backdrop-filter: blur(12px); pointer-events: auto; animation: tIn .35s ease }
    .t-card.error { background: rgba(255,240,240,.95); border-color: rgba(196,92,92,.3); color: #C45C5C }
    .t-card.info { background: rgba(255,255,255,.95); border-color: var(--border2); color: var(--txt) }
    @keyframes tIn { from { transform: translateX(110%); opacity: 0 } to { transform: translateX(0); opacity: 1 } }

    @media(max-width:600px) {
      main { padding: 20px 14px 40px }
      .routine-grid { grid-template-columns: 1fr }
      .score-bar { gap: 14px }
    }
  </style>
</head>

<body>
  <main>
    <div id="upload-view" class="view active">
      <div class="hero-tag"><i class="fa-solid fa-wand-magic-sparkles"></i> Real AI Vision Analysis</div>
      <h1>Skin Analysis,<br><span>Powered by Real AI</span></h1>
      <p class="hero-sub">Camera se live photo lein ya upload karein — face, hand, arm, kuch bhi. AI genuinely dekh kar batata hai, aur hamari asal store se products suggest karta hai.</p>

      <div class="capture-tabs">
        <div class="capture-tab active" data-mode="camera" onclick="switchMode('camera')"><i class="fa-solid fa-camera"></i> Camera</div>
        <div class="capture-tab" data-mode="upload" onclick="switchMode('upload')"><i class="fa-solid fa-folder-open"></i> Upload</div>
      </div>

      <div class="capture-panel">
        <div id="camera-panel">
          <div class="camera-box">
            <video id="cam-video" autoplay playsinline muted></video>
          </div>
          <div class="camera-controls">
            <div class="cam-btn-shutter" id="shutter-btn" onclick="capturePhoto()"><i class="fa-solid fa-camera"></i></div>
          </div>
          <div class="cam-status" id="cam-status">Camera shuru ho rahi hai...</div>
        </div>

        <div id="upload-panel" style="display:none">
          <div id="upload-zone" class="upload-zone" onclick="document.getElementById('file-in').click()" role="button" tabindex="0">
            <input type="file" id="file-in" accept="image/*" style="display:none">
            <div class="upload-icon-wrap"><i class="fa-solid fa-folder-open"></i></div>
            <div class="upload-title">Upload Photo</div>
            <div class="upload-sub">Face, hand, arm — koi bhi skin area</div>
            <button class="btn-primary" onclick="event.stopPropagation();document.getElementById('file-in').click()"><i class="fa-solid fa-folder-open"></i> Browse Files</button>
            <div class="upload-hint">JPG, PNG, WebP · Max 15MB</div>
          </div>
        </div>
      </div>

      <div class="trust-row">
        <span><i class="fa-solid fa-brain"></i> Real AI vision model</span>
        <span><i class="fa-solid fa-eye"></i> Genuinely observes photo</span>
        <span><i class="fa-solid fa-store"></i> Real store products</span>
      </div>
    </div>

    <div id="scan-view" class="view">
      <img id="scan-img" src="" alt="Analyzing">
      <div class="ai-spinner"></div>
      <div id="scan-status">AI dekh rahi hai...</div>
      <div id="scan-sub">Yeh 5-15 second le sakta hai</div>
    </div>

    <div id="result-view" class="view">
      <div class="score-bar">
        <div class="score-ring-wrap">
          <svg width="110" height="110" viewBox="0 0 110 110">
            <circle cx="55" cy="55" r="46" fill="none" stroke="var(--border2)" stroke-width="7" />
            <circle id="score-ring" cx="55" cy="55" r="46" fill="none" stroke="var(--g1)" stroke-width="7" stroke-linecap="round" stroke-dasharray="289.03" stroke-dashoffset="289.03" />
          </svg>
          <div class="score-center"><span id="score-num">0</span><span class="score-lbl">Score</span></div>
        </div>
        <div class="score-info">
          <div class="badge-row" id="badge-row"></div>
          <h2 id="score-title">—</h2>
          <p id="score-summary"></p>
        </div>
        <button class="btn-ghost" onclick="resetAll()"><i class="fa-solid fa-rotate-right"></i> New Scan</button>
      </div>
      <div class="res-grid">
        <div>
          <div class="img-wrap"><img id="res-img" src="" alt="Result"></div>
        </div>
        <div>
          <div class="panel-title"><i class="fa-solid fa-chart-bar"></i> AI-Detected Concerns</div>
          <div id="metrics-list"></div>
        </div>
        <div class="concern-rank">
          <div class="panel-title"><i class="fa-solid fa-ranking-star"></i> Top Concerns (AI)</div>
          <div class="cr-list" id="cr-list"></div>
        </div>
        <div class="routine-section">
          <div class="panel-title"><i class="fa-solid fa-prescription-bottle"></i> Recommended From Our Store</div>
          <div class="routine-grid" id="routine-grid"></div>
        </div>
        <div class="report-box">
          <div class="panel-title"><i class="fa-solid fa-file-medical"></i> AI Summary</div>
          <div id="report-text"></div>
        </div>
      </div>
    </div>
  </main>
  <div id="toasts"></div>

  <script>
    const ANALYZE_API_URL = "https://skincare-chatbot-bay.vercel.app/api/analyze-skin";
    const PRODUCTS_API_URL = "get-skin-products.php"; // same-server PHP endpoint
    let stream = null, capturedImage = null, STORE_PRODUCTS = [];

    /* ── LOAD REAL STORE PRODUCTS ON PAGE LOAD ── */
    async function loadStoreProducts() {
      try {
        const res = await fetch(PRODUCTS_API_URL);
        const data = await res.json();
        if (data.success && Array.isArray(data.products)) {
          STORE_PRODUCTS = data.products;
        }
      } catch (e) {
        console.error('Products load failed', e);
      }
    }
    loadStoreProducts();

    /* ── MODE SWITCH ── */
    function switchMode(mode) {
      document.querySelectorAll('.capture-tab').forEach(t => t.classList.toggle('active', t.dataset.mode === mode));
      document.getElementById('camera-panel').style.display = mode === 'camera' ? '' : 'none';
      document.getElementById('upload-panel').style.display = mode === 'upload' ? '' : 'none';
      if (mode === 'camera') startCamera(); else stopCamera();
    }

    /* ── CAMERA ── */
    async function startCamera() {
      const video = document.getElementById('cam-video');
      const status = document.getElementById('cam-status');
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 960 } }, audio: false });
        video.srcObject = stream;
        status.textContent = 'Photo lene ke liye button dabayein';
      } catch (err) {
        status.textContent = 'Camera access nahi mila — browser permission check karein, ya Upload tab use karein';
        toast('Camera permission chahiye ya use HTTPS site', 'error');
      }
    }
    function stopCamera() {
      if (stream) { stream.getTracks().forEach(t => t.stop()); stream = null; }
    }
    function capturePhoto() {
      const video = document.getElementById('cam-video');
      if (!video.videoWidth) { toast('Camera abhi ready nahi hai', 'error'); return; }
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth; canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.translate(canvas.width, 0); ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      capturedImage = canvas.toDataURL('image/jpeg', 0.9);
      stopCamera();
      startScan(capturedImage);
    }

    /* ── FILE UPLOAD ── */
    const fileIn = document.getElementById('file-in'), zone = document.getElementById('upload-zone');
    fileIn.addEventListener('change', e => { if (e.target.files[0]) loadFile(e.target.files[0]); });
    zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag'); });
    zone.addEventListener('dragleave', () => zone.classList.remove('drag'));
    zone.addEventListener('drop', e => { e.preventDefault(); zone.classList.remove('drag'); if (e.dataTransfer.files[0]) loadFile(e.dataTransfer.files[0]); });
    function loadFile(f) {
      if (!f.type.startsWith('image/')) { toast('Select an image', 'error'); return; }
      if (f.size > 15 * 1024 * 1024) { toast('Max 15MB', 'error'); return; }
      const r = new FileReader();
      r.onload = e => { capturedImage = e.target.result; startScan(capturedImage); };
      r.readAsDataURL(f);
    }

    startCamera();

    /* ═══════════════════════════════════════════════════════════
       REAL PRODUCT MATCHING — keyword-based affinity against
       actual database products (name + description + category).
    ═══════════════════════════════════════════════════════════ */
    const CONCERN_KEYWORDS = {
      acne: ['acne', 'tea tree', 'blemish', 'detox'],
      pores: ['pore', 'detox', 'charcoal', 'clay', 'blackhead', 'minimiz'],
      hydrationDeficit: ['hydrat', 'moistur', 'nourish', 'repair', 'silk', 'shea', 'butter', 'oil'],
      redness: ['sooth', 'calm', 'sensitive', 'aloe', 'chamomile', 'gentle'],
      uvSunDamage: ['spf', 'sun', 'uv'],
      darkSpots: ['dark spot', 'brighten', 'vitamin c', 'pigment', 'corrector', 'glow'],
      unevenTone: ['brighten', 'glow', 'vitamin c', 'niacinamide', 'even', 'tone'],
      textureRoughness: ['exfoliat', 'scrub', 'peel', 'smooth', 'aha', 'glycolic', 'charcoal', 'detox'],
      fineLines: ['collagen', 'anti-aging', 'retinol', 'peptide', 'firm', 'wrinkle', 'youth', 'lift', 'repair'],
      underEyeCircles: ['eye', 'dark circle', 'puffiness', 'under eye']
    };

    function textOf(p) {
      return `${p.name} ${p.description || ''} ${p.category_name || ''}`.toLowerCase();
    }
    function concernAffinity(p, concernKey) {
      const words = CONCERN_KEYWORDS[concernKey] || [];
      const t = textOf(p);
      let hits = 0;
      words.forEach(w => { if (t.includes(w)) hits++; });
      return Math.min(1, hits / 2); // 2+ keyword hits = full affinity
    }
    function roleOf(p) {
      const cat = (p.category_name || '').toLowerCase();
      if (cat.includes('cleanser') || cat.includes('face wash')) return { role: 'cleanser', time: 'both' };
      if (cat.includes('toner')) return { role: 'toner', time: 'both' };
      if (cat.includes('moisturizer') || cat.includes('cream')) return { role: 'moisturizer', time: 'both' };
      if (cat.includes('sunscreen')) return { role: 'spf', time: 'am' };
      if (cat.includes('serum') || cat.includes('treatment')) {
        const t = textOf(p);
        return { role: 'serum', time: (t.includes('vitamin c') || t.includes('brighten')) ? 'am' : 'pm' };
      }
      if (cat.includes('mask') || cat.includes('exfoliator')) return { role: 'mask', time: 'pm' };
      if (cat.includes('eye') || cat.includes('lip')) return { role: 'eye', time: 'both' };
      if (cat.includes('body')) return { role: 'body', time: 'both' };
      if (cat.includes('special') || cat.includes('kit')) return { role: 'kit', time: 'both' };
      if (cat.includes('hair')) return { role: 'hair', time: null }; // excluded from skin routine
      return { role: 'other', time: 'both' };
    }

    function scoreStoreProducts(concerns, bodyPartDetected) {
      const sev = {}; for (const [k, v] of Object.entries(concerns)) sev[k] = Math.max(0, Math.min(1, v / 100));
      const isBody = bodyPartDetected && bodyPartDetected !== 'face';

      const scored = STORE_PRODUCTS
        .map(p => {
          const roleInfo = roleOf(p);
          if (roleInfo.role === 'hair') return null; // never suggest hair products for skin scan
          if (roleInfo.role === 'body' && !isBody) return null; // skip body products for face scans
          if (roleInfo.role !== 'body' && isBody) {
            // for body/hand scans, deprioritize face-only categories unless generic (cleanser/moisturizer)
            if (!['cleanser', 'moisturizer', 'other'].includes(roleInfo.role)) return null;
          }
          let cs = 0, matched = 0;
          for (const k of Object.keys(sev)) {
            const aff = concernAffinity(p, k);
            if (aff > 0) { cs += sev[k] * aff; matched++; }
          }
          const baseline = { cleanser: 0.5, moisturizer: 0.5, toner: 0.35, spf: 0.6, serum: 0.3, mask: 0.25, eye: 0.2, kit: 0.3, body: 0.4, other: 0.2 }[roleInfo.role] || 0.2;
          const finalScore = cs + baseline;
          return { ...p, ...roleInfo, finalScore };
        })
        .filter(Boolean);

      const byRole = {};
      scored.forEach(p => { if (!byRole[p.role]) byRole[p.role] = []; byRole[p.role].push(p); });
      Object.values(byRole).forEach(list => list.sort((a, b) => b.finalScore - a.finalScore));

      const am = [], pm = [];
      function pick(role, count) {
        const list = byRole[role]; if (!list) return;
        list.slice(0, count).forEach(p => { if (p.time === 'am') am.push(p); else if (p.time === 'pm') pm.push(p); else { am.push(p); pm.push(p); } });
      }
      pick('cleanser', 1);
      pick('moisturizer', 1);
      pick('spf', 1);
      pick('toner', 1);
      if (sev.pores > .25 || sev.acne > .25 || sev.textureRoughness > .3 || sev.darkSpots > .25 || sev.unevenTone > .25 || sev.fineLines > .25) pick('serum', 2);
      if (sev.underEyeCircles > .25) pick('eye', 1);
      if (sev.textureRoughness > .3 || sev.pores > .35) pick('mask', 1);
      if (isBody) pick('body', 2);

      // dedupe by id, keep first occurrence per list
      function dedupe(list) { const seen = new Set(); return list.filter(p => { if (seen.has(p.id)) return false; seen.add(p.id); return true; }); }
      return { am: dedupe(am), pm: dedupe(pm) };
    }

    /* ── SEND TO REAL AI ── */
    async function startScan(imageDataUrl) {
      showView('scan-view');
      document.getElementById('scan-img').src = imageDataUrl;
      document.getElementById('scan-status').textContent = 'AI dekh rahi hai...';
      document.getElementById('scan-sub').textContent = 'Real vision model tasveer analyze kar raha hai';

      try {
        const response = await fetch(ANALYZE_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: imageDataUrl })
        });
        const data = await response.json();
        if (!response.ok || !data.analysis) {
          throw new Error(data.error || 'Analysis failed');
        }
        showResults(data.analysis, imageDataUrl);
      } catch (err) {
        console.error(err);
        toast('AI analysis mein masla hua, dobara try karein', 'error');
        showView('upload-view');
      }
    }

    const CONCERN_LABELS = {
      acne: { label: 'Acne', icon: 'fa-fire' },
      pores: { label: 'Pore Visibility', icon: 'fa-circle-dot' },
      hydrationDeficit: { label: 'Dehydration', icon: 'fa-droplet' },
      redness: { label: 'Redness', icon: 'fa-triangle-exclamation' },
      uvSunDamage: { label: 'UV/Sun Damage', icon: 'fa-sun' },
      darkSpots: { label: 'Dark Spots', icon: 'fa-circle-half-stroke' },
      unevenTone: { label: 'Uneven Tone', icon: 'fa-palette' },
      textureRoughness: { label: 'Texture', icon: 'fa-mountain' },
      fineLines: { label: 'Fine Lines', icon: 'fa-grip-lines' },
      underEyeCircles: { label: 'Under-Eye Circles', icon: 'fa-eye' }
    };

    function showResults(a, imgSrc) {
      showView('result-view');
      document.getElementById('res-img').src = imgSrc;

      const score = a.overallScore || 50;
      const circ = 289.03, off = circ - (circ * score / 100), col = score >= 75 ? 'var(--g1)' : score >= 50 ? 'var(--warn)' : 'var(--danger)';
      const ring = document.getElementById('score-ring'); ring.style.stroke = col; ring.style.strokeDashoffset = circ;
      requestAnimationFrame(() => { ring.style.strokeDashoffset = off; });
      animNum('score-num', score, 1200);
      document.getElementById('score-title').textContent = score >= 85 ? 'Excellent' : score >= 70 ? 'Very Good' : score >= 55 ? 'Good' : score >= 40 ? 'Moderate' : 'Needs Attention';

      const br = document.getElementById('badge-row'); br.innerHTML = '';
      const partIcons = { face: 'fa-face-smile', hand: 'fa-hand', arm: 'fa-hand-fist', leg: 'fa-shoe-prints', neck: 'fa-user', 'other-body': 'fa-person', unclear: 'fa-question' };
      br.innerHTML += `<span class="badge"><i class="fa-solid ${partIcons[a.bodyPartDetected] || 'fa-person'}" style="margin-right:3px"></i>${a.bodyPartDetected}</span>`;
      if (a.estimatedAgeRange) br.innerHTML += `<span class="badge">~${a.estimatedAgeRange} yrs</span>`;
      br.innerHTML += `<span class="badge">${a.skinType} skin</span><span class="badge info">${a.undertone} tone</span>`;
      if (a.imageQuality && a.imageQuality !== 'good') br.innerHTML += `<span class="badge info"><i class="fa-solid fa-circle-info"></i> ${a.imageQuality}</span>`;

      document.getElementById('score-summary').textContent = a.summary || '';

      renderMetrics(a.concerns);
      renderConcernRank(a.topConcerns || []);
      const matched = scoreStoreProducts(a.concerns, a.bodyPartDetected);
      renderRoutine(matched);
      document.getElementById('report-text').textContent = a.summary;
    }

    function renderMetrics(concerns) {
      const list = document.getElementById('metrics-list'); list.innerHTML = '';
      Object.entries(concerns).forEach(([k, val], i) => {
        const def = CONCERN_LABELS[k]; if (!def) return;
        if (val === 0 && (k === 'underEyeCircles')) return;
        const d = 100 - val;
        const col = d >= 70 ? 'var(--g1)' : d >= 45 ? 'var(--warn)' : 'var(--danger)';
        const el = document.createElement('div'); el.className = 'metric-card';
        el.innerHTML = `<div class="mc-top"><div class="mc-label"><i class="fa-solid ${def.icon}" style="color:${col}"></i>${def.label}</div><div class="mc-val" style="color:${col}">${val}%</div></div><div class="mc-bar"><div class="mc-fill" id="mf-${k}" style="background:${col};width:0"></div></div>`;
        list.appendChild(el);
        setTimeout(() => { const f = document.getElementById('mf-' + k); if (f) f.style.width = val + '%'; }, 100 + i * 60);
      });
    }

    function renderConcernRank(topConcerns) {
      const list = document.getElementById('cr-list'); list.innerHTML = '';
      if (!topConcerns.length) { list.innerHTML = '<div style="font-size:.85rem;color:var(--g2)">AI ko koi major concern nazar nahi aaya.</div>'; return; }
      topConcerns.forEach((c, i) => {
        const el = document.createElement('div'); el.className = 'cr-item';
        el.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> <strong>#${i + 1}</strong> ${c}`;
        list.appendChild(el);
      });
    }

    function renderRoutine(matched) {
      const grid = document.getElementById('routine-grid'); grid.innerHTML = '';
      if (!STORE_PRODUCTS.length) {
        grid.innerHTML = '<div style="grid-column:1/-1;font-size:.85rem;color:var(--txt3)">Products load nahi ho sake — page refresh karke dobara try karein.</div>';
        return;
      }
      function rp(title, icon, color, products) {
        if (!products.length) return '';
        let h = `<div class="routine-phase"><div class="routine-phase-title"><i class="fa-solid ${icon}" style="color:${color}"></i> ${title} <span class="phase-time">${products.length} products</span></div>`;
        products.forEach(p => {
          const img = p.image ? `images/${p.image}` : '';
          h += `<div class="prod-card">
            <div class="prod-thumb">${img ? `<img src="${img}" alt="${p.name}">` : '<i class="fa-solid fa-flask" style="color:var(--g1)"></i>'}</div>
            <div class="prod-body">
              <div class="prod-brand">${p.brand_name || p.category_name || 'GlowHaven'}</div>
              <h4>${p.name}</h4>
              <div class="prod-desc">${p.description || ''}</div>
              <div class="prod-meta">
                <span class="prod-price">Rs. ${Number(p.price).toLocaleString()}</span>
                <a href="product_details.php?id=${p.id}" class="btn-buy">Buy Now</a>
              </div>
            </div>
          </div>`;
        });
        h += '</div>'; return h;
      }
      grid.innerHTML = rp('Morning Routine', 'fa-sun', 'var(--warn)', matched.am) + rp('Evening Routine', 'fa-moon', 'var(--info)', matched.pm);
    }

    function showView(id) { document.querySelectorAll('.view').forEach(v => v.classList.remove('active')); document.getElementById(id).classList.add('active'); window.scrollTo({ top: 0, behavior: 'smooth' }); }
    function animNum(id, target, dur) { const el = document.getElementById(id), start = performance.now(); function tick(now) { const p = Math.min((now - start) / dur, 1), e = 1 - Math.pow(1 - p, 3); el.textContent = Math.round(e * target); if (p < 1) requestAnimationFrame(tick); } requestAnimationFrame(tick); }
    function resetAll() { capturedImage = null; fileIn.value = ''; showView('upload-view'); switchMode('camera'); }
    function toast(msg, type = 'info') {
      const c = document.getElementById('toasts'), t = document.createElement('div');
      const icons = { info: 'fa-circle-info', error: 'fa-circle-xmark' };
      t.className = `t-card ${type}`; t.innerHTML = `<i class="fa-solid ${icons[type] || icons.info}"></i><span>${msg}</span>`;
      c.appendChild(t); setTimeout(() => t.remove(), 4000);
    }
  </script>
</body>

</html>
<?php include 'include/footer.php'; ?>
