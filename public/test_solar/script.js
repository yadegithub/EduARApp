let src;
let cap;
let qrDetector;
let qrPoints;
let imagePoints;
let camMatrix;
let distCoeffs;
let rvec;
let tvec;
let rotMatr;
let objectPoints;
let renderer;
let labelRenderer;
let scene;
let camera;
let arGroup;
let modelHolder;
let sourceSolarModel;
let animationMixer;
let activeStream;
let labels = [];
let currentMode = null;
let labelsVisible = true;
let isDragging = false;
let prevPos = { x: 0, y: 0 };
let arScale = 2.75;
let animationFrameId = 0;
let isArInitialized = false;
let isSessionStarting = false;
let focusedPartIndex = -1;
let lostMarkerFrames = 0;
let hasTrackingPose = false;
let hasLiveMarkerDetection = false;
let detectionStreak = 0;
let lastDetectionCenter = null;
let previousFrameTime = 0;
let lastQrScanTime = 0;
let pendingOpenCvConfig = null;
let isOpenCvReadyListenerAttached = false;
let latestMlKitBarcode = null;
let lastMlKitDetectionAt = 0;
let trackingFrameWidth = window.innerWidth;
let trackingFrameHeight = window.innerHeight;

const trackedMatrix = new THREE.Matrix4();
const trackedPosition = new THREE.Vector3();
const trackedQuaternion = new THREE.Quaternion();
const trackedScale = new THREE.Vector3();
const wasmTestStats = {
  bootStartedAt: window.__solarWasmBootAt ?? performance.now(),
  runtimeReadyAt: 0,
  arStartedAt: 0,
  qrSamples: 0,
  qrTotalMs: 0,
};
const query = new URLSearchParams(window.location.search);
const isMlKitScannerMode = query.get("scanner") === "mlkit";
const ML_KIT_DETECTION_TIMEOUT_MS = 260;
document.documentElement.dataset.scanner = isMlKitScannerMode
  ? "mlkit"
  : "opencv";

function setStatus(message) {
  if (!UI.status || UI.status.textContent === message) {
    return;
  }
  UI.status.textContent = message;
}

function getSelectedBody() {
  return focusedPartIndex >= 0 ? solarBodies[focusedPartIndex] : null;
}

function updateInfoCard() {
  if (!UI.cardTag || !UI.partName || !UI.partInfo || !UI.cardHint) {
    return;
  }

  const selectedBody = getSelectedBody();
  if (!selectedBody) {
    UI.card.classList.remove("info-card--visible");
    UI.card.classList.remove("info-card--selected");
    return;
  }

  UI.cardTag.textContent = copy.focusTag;
  UI.partName.textContent = selectedBody.title;
  UI.partInfo.textContent = selectedBody.info;
  UI.cardHint.textContent = selectedBody.hint;
  UI.card.classList.add("info-card--visible");
  UI.card.classList.add("info-card--selected");
}

function syncLabels() {
  const shouldShowLabels =
    labelsVisible && Boolean(arGroup?.visible) && hasLiveMarkerDetection;

  labels.forEach((entry) => {
    const isActive = entry.index === focusedPartIndex;
    entry.label.element.style.opacity = shouldShowLabels ? "1" : "0";
    entry.label.element.style.visibility = shouldShowLabels
      ? "visible"
      : "hidden";
    entry.label.element.style.pointerEvents = shouldShowLabels
      ? "auto"
      : "none";
    entry.label.element.classList.toggle("hotspot-label--active", isActive);
    entry.label.element.setAttribute("aria-pressed", String(isActive));
  });
}

function positionInfoCard() {
  if (!UI.card) {
    return;
  }

  const selectedEntry = focusedPartIndex >= 0 ? labels[focusedPartIndex] : null;
  if (!selectedEntry || !arGroup?.visible) {
    UI.card.classList.remove("info-card--floating");
    UI.card.style.left = "50%";
    UI.card.style.top = "";
    UI.card.style.right = "";
    UI.card.style.bottom = "18px";
    UI.card.style.transform = "translateX(-50%)";
    return;
  }

  const markerRect = selectedEntry.label.element.getBoundingClientRect();
  const cardWidth = UI.card.offsetWidth || 300;
  const cardHeight = UI.card.offsetHeight || 170;
  let left = markerRect.right + 18;
  if (left + cardWidth > window.innerWidth - 16) {
    left = markerRect.left - cardWidth - 18;
  }
  let top = markerRect.top + markerRect.height / 2 - cardHeight / 2;
  left = Math.max(16, Math.min(window.innerWidth - cardWidth - 16, left));
  top = Math.max(16, Math.min(window.innerHeight - cardHeight - 16, top));
  UI.card.classList.add("info-card--floating");
  UI.card.style.left = `${left}px`;
  UI.card.style.top = `${top}px`;
  UI.card.style.right = "auto";
  UI.card.style.bottom = "auto";
  UI.card.style.transform = "none";
}

function setFocusedPart(index) {
  focusedPartIndex = Math.max(-1, Math.min(solarBodies.length - 1, index));
  updateInfoCard();
  syncLabels();
  positionInfoCard();
}

function showViewerUi() {
  if (UI.sideMenu) {
    UI.sideMenu.style.display = "";
  }

  if (UI.card) {
    UI.card.style.display = "";
  }
}

function applyCopy() {
  UI.appEyebrow.textContent = copy.appEyebrow;
  UI.appTitle.textContent = copy.appTitle;
  UI.rotateLabel.textContent = copy.rotate;
  UI.scaleLabel.textContent = copy.scale;
  UI.labelsLabel.textContent = copy.labels;
  updateInfoCard();
  positionInfoCard();
  setStatus(copy.statusStarting);
}

function getTrackingFrameWidth() {
  return isMlKitScannerMode
    ? Math.max(1, Math.round(trackingFrameWidth || window.innerWidth || 1))
    : Math.max(1, UI.video.videoWidth || UI.video.width || 1);
}

function getTrackingFrameHeight() {
  return isMlKitScannerMode
    ? Math.max(1, Math.round(trackingFrameHeight || window.innerHeight || 1))
    : Math.max(1, UI.video.videoHeight || UI.video.height || 1);
}

function updateTrackingViewport(width, height) {
  trackingFrameWidth = Math.max(1, Math.round(width || window.innerWidth || 1));
  trackingFrameHeight = Math.max(
    1,
    Math.round(height || window.innerHeight || 1),
  );

  if (UI.canvasOutput) {
    UI.canvasOutput.width = trackingFrameWidth;
    UI.canvasOutput.height = trackingFrameHeight;
  }
  if (UI.canvasThree) {
    UI.canvasThree.width = trackingFrameWidth;
    UI.canvasThree.height = trackingFrameHeight;
  }
}

function updateCameraCalibration() {
  if (!hasOpenCvRuntime() || !camera) {
    return;
  }

  const frameWidth = getTrackingFrameWidth();
  const frameHeight = getTrackingFrameHeight();
  const focalLength = Math.max(frameWidth, frameHeight);

  if (camMatrix && typeof camMatrix.delete === "function") {
    camMatrix.delete();
  }

  camMatrix = cv.matFromArray(3, 3, cv.CV_64FC1, [
    focalLength,
    0,
    frameWidth / 2,
    0,
    focalLength,
    frameHeight / 2,
    0,
    0,
    1,
  ]);

  const depthNear = 0.1;
  const depthFar = 1000;
  camera.projectionMatrix.set(
    (2 * focalLength) / frameWidth,
    0,
    0,
    0,
    0,
    (2 * focalLength) / frameHeight,
    0,
    0,
    0,
    0,
    -(depthFar + depthNear) / (depthFar - depthNear),
    (-2 * depthFar * depthNear) / (depthFar - depthNear),
    0,
    0,
    -1,
    0,
  );
}

function hasOpenCvRuntime() {
  return typeof cv !== "undefined" && typeof cv.Mat === "function";
}

function logWasmTestSummary(label, details) {
  console.info(`[Solar WASM Test] ${label}`, details);
}

function attachOpenCvReadyListener() {
  if (isOpenCvReadyListenerAttached) {
    return;
  }

  isOpenCvReadyListenerAttached = true;
  window.addEventListener("solar-opencv-ready", handleOpenCvRuntimeReady);
}

function handleOpenCvRuntimeReady() {
  wasmTestStats.runtimeReadyAt =
    window.__solarOpenCvRuntimeReadyAt ?? performance.now();

  logWasmTestSummary("OpenCV runtime ready", {
    startupMs: Math.round(
      wasmTestStats.runtimeReadyAt - wasmTestStats.bootStartedAt,
    ),
    mode: "direct-runtime-event",
  });

  if (
    pendingOpenCvConfig &&
    activeStream &&
    !isArInitialized &&
    hasOpenCvRuntime()
  ) {
    startArExperience(pendingOpenCvConfig);
  }
}

function waitForOpenCvRuntime(config) {
  pendingOpenCvConfig = config;
  attachOpenCvReadyListener();

  if ((!activeStream && !isMlKitScannerMode) || isArInitialized) {
    return;
  }

  if (hasOpenCvRuntime() || window.__solarOpenCvRuntimeReady) {
    handleOpenCvRuntimeReady();
    return;
  }

  setStatus("Loading OpenCV WebAssembly...");
}

function startArExperience(config) {
  if ((!activeStream && !isMlKitScannerMode) || isArInitialized || !hasOpenCvRuntime()) {
    return;
  }

  isArInitialized = true;
  wasmTestStats.arStartedAt = performance.now();
  initThree(config);
  initCV();
  setupControls();
  animationFrameId = window.requestAnimationFrame(processFrame);

  logWasmTestSummary("AR session initialized", {
    afterRuntimeMs:
      wasmTestStats.runtimeReadyAt > 0
        ? Math.round(wasmTestStats.arStartedAt - wasmTestStats.runtimeReadyAt)
        : 0,
  });
}

function recordQrDetectionSample(durationMs) {
  wasmTestStats.qrSamples += 1;
  wasmTestStats.qrTotalMs += durationMs;

  if (wasmTestStats.qrSamples % 30 === 0) {
    logWasmTestSummary("Average QR detection time", {
      samples: wasmTestStats.qrSamples,
      averageMs:
        Math.round((wasmTestStats.qrTotalMs / wasmTestStats.qrSamples) * 100) /
        100,
    });
  }
}

async function loadConfig() {
  if (isSessionStarting || activeStream) {
    return;
  }
  isSessionStarting = true;
  let config = defaultConfig;
  try {
    const response = await fetch("./data.json");
    if (response.ok) {
      config = await response.json();
    }
  } catch (error) {
    config = defaultConfig;
  }
  showViewerUi();
  applyCopy();
  try {
    if (isMlKitScannerMode) {
      document.documentElement.dataset.scanner = "mlkit";
      await startMlKitSession(config);
      return;
    }
    await startCamera(config);
  } finally {
    isSessionStarting = false;
  }
}

async function startMlKitSession(config) {
  updateTrackingViewport(window.innerWidth, window.innerHeight);
  fitToScreen();
  waitForOpenCvRuntime(config ?? defaultConfig);
  setStatus("Starting ML Kit QR scanner...");
}

async function startCamera(config) {
  if (activeStream) {
    return;
  }
  setStatus(copy.statusStarting);
  try {
    activeStream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "environment",
        width: { ideal: CAMERA_IDEAL_WIDTH },
        height: { ideal: CAMERA_IDEAL_HEIGHT },
        frameRate: {
          ideal: CAMERA_IDEAL_FRAME_RATE,
          max: CAMERA_MAX_FRAME_RATE,
        },
      },
    });
    await new Promise((resolve) => {
      const handleLoadedMetadata = () => {
        UI.video.removeEventListener("loadedmetadata", handleLoadedMetadata);
        resolve();
      };
      UI.video.addEventListener("loadedmetadata", handleLoadedMetadata);
      UI.video.srcObject = activeStream;
    });
    await UI.video.play().catch(() => undefined);
    const width = UI.video.videoWidth;
    const height = UI.video.videoHeight;
    [UI.video, UI.canvasOutput, UI.canvasThree].forEach((element) => {
      element.width = width;
      element.height = height;
    });
    fitToScreen();
    waitForOpenCvRuntime(config ?? defaultConfig);
  } catch (error) {
    setStatus(copy.statusCameraError);
  }
}

function initThree(config) {
  if (UI.video) {
    UI.video.style.display = isMlKitScannerMode ? "none" : "block";
    UI.video.style.zIndex = "0";
    UI.video.style.objectFit = "cover";
  }
  if (UI.canvasOutput) {
    UI.canvasOutput.style.display = SHOW_DEBUG_CAMERA_CANVAS ? "block" : "none";
    UI.canvasOutput.style.zIndex = "1";
  }
  if (UI.canvasThree) {
    UI.canvasThree.style.zIndex = SHOW_DEBUG_CAMERA_CANVAS ? "2" : "1";
  }

  renderer = new THREE.WebGLRenderer({
    canvas: UI.canvasThree,
    alpha: true,
    antialias: true,
  });
  const frameWidth = getTrackingFrameWidth();
  const frameHeight = getTrackingFrameHeight();
  renderer.setSize(frameWidth, frameHeight, false);
  renderer.setPixelRatio(
    Math.min(window.devicePixelRatio || 1, MAX_RENDER_PIXEL_RATIO),
  );

  labelRenderer = new THREE.CSS2DRenderer();
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
  labelRenderer.domElement.style.position = "absolute";
  labelRenderer.domElement.style.top = "0";
  labelRenderer.domElement.style.left = "0";
  labelRenderer.domElement.style.pointerEvents = "none";
  labelRenderer.domElement.style.zIndex = "25";
  document.body.appendChild(labelRenderer.domElement);

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    45,
    frameWidth / frameHeight,
    0.1,
    1000,
  );

  arGroup = new THREE.Group();
  arGroup.visible = false;
  arGroup.matrixAutoUpdate = true;
  scene.add(arGroup);

  modelHolder = new THREE.Group();
  arGroup.add(modelHolder);

  scene.add(new THREE.AmbientLight(0xffffff, 1.15));

  const keyLight = new THREE.PointLight(0xffffff, 0.9);
  keyLight.position.set(5, 6, 7);
  scene.add(keyLight);

  const warmLight = new THREE.PointLight(0xffc56c, 0.7);
  warmLight.position.set(-5, 3, 4);
  scene.add(warmLight);

  const modelConfig =
    config.assets?.models?.solar ?? defaultConfig.assets.models.solar;
  const modelPath = modelConfig.path ?? MODEL_PATH;
  const loader = new THREE.GLTFLoader();
  const enhanceDirectModel =
    modelConfig.enhanceDirectModel ?? defaultConfig.assets.models.solar.enhanceDirectModel;
  const modelPosition =
    modelConfig.position ?? defaultConfig.assets.models.solar.position;
  const modelRotation =
    modelConfig.rotation ?? defaultConfig.assets.models.solar.rotation;

  arScale = config.settings?.arScale ?? defaultConfig.settings.arScale;

  setStatus(copy.statusLoading);

  modelHolder.position.set(
    modelPosition.x ?? 0.44,
    modelPosition.y ?? 0.36,
    modelPosition.z ?? 0.03,
  );
  modelHolder.rotation.set(
    modelRotation.x ?? DEFAULT_ROTATION.x,
    modelRotation.y ?? DEFAULT_ROTATION.y,
    modelRotation.z ?? DEFAULT_ROTATION.z,
  );

  loader.load(
    modelPath,
    (loadedAsset) => {
      sourceSolarModel = loadedAsset.scene;
      renderDirectSolarModel(sourceSolarModel, modelConfig, {
        enhanceModel: enhanceDirectModel,
        animations: loadedAsset.animations ?? [],
      });

      setupInteraction();
      updateInfoCard();
      syncLabels();
      positionInfoCard();
      setStatus(copy.statusReady);
    },
    undefined,
    () => {
      setStatus(copy.statusModelError);
    },
  );
}

function setupControls() {
  const syncModeButtons = () => {
    UI.rotateBtn.classList.toggle("active", currentMode === "rotate");
    UI.scaleBtn.classList.toggle("active", currentMode === "scale");
    UI.rotateBtn.setAttribute("aria-pressed", String(currentMode === "rotate"));
    UI.scaleBtn.setAttribute("aria-pressed", String(currentMode === "scale"));
  };

  const setMode = (mode) => {
    currentMode = currentMode === mode ? null : mode;
    isDragging = false;
    syncModeButtons();
  };

  UI.rotateBtn.onclick = () => setMode("rotate");
  UI.scaleBtn.onclick = () => setMode("scale");
  UI.labelToggle.onchange = (event) => {
    labelsVisible = event.target.checked;
    syncLabels();
    positionInfoCard();
  };

  syncModeButtons();
  syncLabels();
}

function setupInteraction() {
  const start = (event) => {
    if (!modelHolder || !currentMode) {
      return;
    }
    isDragging = true;
    const point = event.touches?.[0] ?? event;
    prevPos = { x: point.clientX, y: point.clientY };
    if (event.cancelable) {
      event.preventDefault();
    }
  };

  const move = (event) => {
    if (!isDragging || !modelHolder || !currentMode) {
      return;
    }
    const point = event.touches?.[0] ?? event;
    const deltaX = point.clientX - prevPos.x;
    const deltaY = point.clientY - prevPos.y;
    if (currentMode === "rotate") {
      modelHolder.rotation.y += deltaX * 0.01;
      modelHolder.rotation.x += deltaY * 0.006;
    } else if (currentMode === "scale") {
      const factor = Math.max(0.78, Math.min(1.28, 1 - deltaY * 0.004));
      modelHolder.scale.multiplyScalar(factor);
    }
    prevPos = { x: point.clientX, y: point.clientY };
    if (event.cancelable) {
      event.preventDefault();
    }
  };

  UI.canvasThree.addEventListener("mousedown", start);
  UI.canvasThree.addEventListener("touchstart", start, { passive: false });
  window.addEventListener("mousemove", move);
  window.addEventListener("touchmove", move, { passive: false });
  window.addEventListener("mouseup", () => {
    isDragging = false;
  });
  window.addEventListener("touchend", () => {
    isDragging = false;
  });
  UI.canvasThree.addEventListener("click", () => {
    if (!isDragging) {
      setFocusedPart(-1);
    }
  });
}

function initCV() {
  const frameWidth = getTrackingFrameWidth();
  const frameHeight = getTrackingFrameHeight();

  if (!isMlKitScannerMode) {
    src = new cv.Mat(frameHeight, frameWidth, cv.CV_8UC4);
    cap = new cv.VideoCapture(UI.video);
    qrDetector = new cv.QRCodeDetector();
  }

  qrPoints = new cv.Mat();
  imagePoints = new cv.Mat(4, 1, cv.CV_32FC2);
  distCoeffs = new cv.Mat.zeros(5, 1, cv.CV_64FC1);
  objectPoints = cv.matFromArray(4, 3, cv.CV_64FC1, [
    0, 0, 0,
    1, 0, 0,
    1, 1, 0,
    0, 1, 0,
  ]);
  rvec = new cv.Mat();
  tvec = new cv.Mat();
  rotMatr = new cv.Mat(3, 3, cv.CV_64FC1);
  updateCameraCalibration();
}

function getQrScanInterval() {
  return hasTrackingPose || detectionStreak > 0
    ? QR_SCAN_INTERVAL_MS
    : QR_SEARCH_INTERVAL_MS;
}

function updateImagePoints(points) {
  const source = points.data32F;
  const target = imagePoints.data32F;
  for (let index = 0; index < 8; index += 1) {
    target[index] = source[index];
  }
}

function updateImagePointsFromCorners(corners) {
  if (!corners || corners.length < 4) {
    return;
  }

  const target = imagePoints.data32F;
  for (let index = 0; index < 4; index += 1) {
    target[index * 2] = corners[index].x;
    target[index * 2 + 1] = corners[index].y;
  }
}

function getDetectedCorners(points) {
  if (!points?.data32F || points.data32F.length < 8) {
    return null;
  }
  return [
    { x: points.data32F[0], y: points.data32F[1] },
    { x: points.data32F[2], y: points.data32F[3] },
    { x: points.data32F[4], y: points.data32F[5] },
    { x: points.data32F[6], y: points.data32F[7] },
  ];
}

function getQrMetricsFromCorners(corners) {
  if (!corners || corners.length < 4) {
    return null;
  }

  const edgeLengths = corners.map((corner, index) => {
    const nextCorner = corners[(index + 1) % corners.length];
    return Math.hypot(nextCorner.x - corner.x, nextCorner.y - corner.y);
  });

  const area = Math.abs(
    corners.reduce((sum, corner, index) => {
      const nextCorner = corners[(index + 1) % corners.length];
      return sum + corner.x * nextCorner.y - nextCorner.x * corner.y;
    }, 0) / 2,
  );

  const center = corners.reduce(
    (accumulator, corner) => ({
      x: accumulator.x + corner.x / corners.length,
      y: accumulator.y + corner.y / corners.length,
    }),
    { x: 0, y: 0 },
  );

  return {
    area,
    center,
    maxEdge: Math.max(...edgeLengths),
    minEdge: Math.min(...edgeLengths),
  };
}

function getQrMetrics(points) {
  const corners = getDetectedCorners(points);
  if (!corners) {
    return null;
  }

  const edgeLengths = corners.map((corner, index) => {
    const nextCorner = corners[(index + 1) % corners.length];
    return Math.hypot(nextCorner.x - corner.x, nextCorner.y - corner.y);
  });

  const area = Math.abs(
    corners.reduce((sum, corner, index) => {
      const nextCorner = corners[(index + 1) % corners.length];
      return sum + corner.x * nextCorner.y - nextCorner.x * corner.y;
    }, 0) / 2,
  );

  const center = corners.reduce(
    (accumulator, corner) => ({
      x: accumulator.x + corner.x / corners.length,
      y: accumulator.y + corner.y / corners.length,
    }),
    { x: 0, y: 0 },
  );

  return {
    area,
    center,
    maxEdge: Math.max(...edgeLengths),
    minEdge: Math.min(...edgeLengths),
  };
}

function isReliableDetection(metrics) {
  if (!metrics) {
    return false;
  }
  const frameArea = UI.video.width * UI.video.height;
  if (metrics.area < frameArea * MIN_QR_AREA_RATIO) {
    return false;
  }
  if (metrics.minEdge < MIN_QR_EDGE) {
    return false;
  }
  if (metrics.maxEdge / Math.max(metrics.minEdge, 1) > MAX_QR_EDGE_RATIO) {
    return false;
  }
  return true;
}

function updateDetectionConfidence(metrics) {
  if (!isReliableDetection(metrics)) {
    detectionStreak = 0;
    lastDetectionCenter = null;
    return false;
  }

  if (lastDetectionCenter) {
    const maxJump =
      Math.min(UI.video.width, UI.video.height) * MAX_CENTER_JUMP_RATIO;
    const currentJump = Math.hypot(
      metrics.center.x - lastDetectionCenter.x,
      metrics.center.y - lastDetectionCenter.y,
    );
    detectionStreak = currentJump <= maxJump ? detectionStreak + 1 : 1;
  } else {
    detectionStreak = 1;
  }

  lastDetectionCenter = metrics.center;
  return detectionStreak >= CONFIRM_FRAMES;
}

function resetDetectionConfidence() {
  detectionStreak = 0;
  lastDetectionCenter = null;
}

function applyTrackedPose() {
  cv.Rodrigues(rvec, rotMatr);
  const rotation = rotMatr.data64F;
  const translation = tvec.data64F;

  trackedMatrix.set(
    rotation[0] * arScale,
    rotation[1] * arScale,
    rotation[2] * arScale,
    translation[0],
    -rotation[3] * arScale,
    -rotation[4] * arScale,
    -rotation[5] * arScale,
    -translation[1],
    -rotation[6] * arScale,
    -rotation[7] * arScale,
    -rotation[8] * arScale,
    -translation[2],
    0,
    0,
    0,
    1,
  );

  trackedMatrix.decompose(
    trackedPosition,
    trackedQuaternion,
    trackedScale,
  );

  if (!hasTrackingPose) {
    arGroup.position.copy(trackedPosition);
    arGroup.quaternion.copy(trackedQuaternion);
    arGroup.scale.copy(trackedScale);
    hasTrackingPose = true;
  } else {
    arGroup.position.lerp(trackedPosition, TRACK_ALPHA);
    arGroup.quaternion.slerp(trackedQuaternion, TRACK_ALPHA);
    arGroup.scale.lerp(trackedScale, TRACK_ALPHA);
  }

  arGroup.visible = true;
  lostMarkerFrames = 0;
}

function runQrDetection() {
  const qrDetectionStartedAt = performance.now();
  let markerFound = false;
  let shouldHoldSteady = false;
  let liveMarkerDetected = false;

  if (qrDetector.detect(src, qrPoints)) {
    const metrics = getQrMetrics(qrPoints);
    const confirmedDetection = updateDetectionConfidence(metrics);
    shouldHoldSteady = Boolean(metrics);

    if (confirmedDetection) {
      updateImagePoints(qrPoints);

      if (
        cv.solvePnP(objectPoints, imagePoints, camMatrix, distCoeffs, rvec, tvec)
      ) {
        applyTrackedPose();
        markerFound = true;
        liveMarkerDetected = true;
      }
    }
  } else {
    resetDetectionConfidence();
  }

  if (!markerFound) {
    if (hasTrackingPose && lostMarkerFrames < LOST_GRACE_FRAMES) {
      lostMarkerFrames += 1;
      arGroup.visible = true;
      markerFound = true;
    } else {
      arGroup.visible = false;
      hasTrackingPose = false;
      lostMarkerFrames = 0;
    }
  }

  hasLiveMarkerDetection = liveMarkerDetected;
  recordQrDetectionSample(performance.now() - qrDetectionStartedAt);

  return { markerFound, shouldHoldSteady };
}

function runMlKitDetection(timestamp) {
  const qrDetectionStartedAt = performance.now();
  let markerFound = false;
  let shouldHoldSteady = false;
  let liveMarkerDetected = false;
  const mlKitCorners = latestMlKitBarcode?.cornerPoints;
  const hasFreshDetection =
    Array.isArray(mlKitCorners) &&
    mlKitCorners.length >= 4 &&
    timestamp - lastMlKitDetectionAt <= ML_KIT_DETECTION_TIMEOUT_MS;

  if (hasFreshDetection) {
    const metrics = getQrMetricsFromCorners(mlKitCorners);
    const confirmedDetection = updateDetectionConfidence(metrics);
    shouldHoldSteady = Boolean(metrics);

    if (confirmedDetection) {
      updateImagePointsFromCorners(mlKitCorners);

      if (
        cv.solvePnP(objectPoints, imagePoints, camMatrix, distCoeffs, rvec, tvec)
      ) {
        applyTrackedPose();
        markerFound = true;
        liveMarkerDetected = true;
      }
    }
  } else {
    resetDetectionConfidence();
  }

  if (!markerFound) {
    if (hasTrackingPose && lostMarkerFrames < LOST_GRACE_FRAMES) {
      lostMarkerFrames += 1;
      arGroup.visible = true;
      markerFound = true;
    } else {
      arGroup.visible = false;
      hasTrackingPose = false;
      lostMarkerFrames = 0;
    }
  }

  hasLiveMarkerDetection = liveMarkerDetected;
  recordQrDetectionSample(performance.now() - qrDetectionStartedAt);

  return { markerFound, shouldHoldSteady };
}

function handleMlKitBarcodeMessage(data) {
  if (!data) {
    return;
  }

  if (data.viewport?.width && data.viewport?.height) {
    const nextWidth = Math.round(data.viewport.width);
    const nextHeight = Math.round(data.viewport.height);
    const viewportChanged =
      nextWidth !== trackingFrameWidth || nextHeight !== trackingFrameHeight;

    if (viewportChanged) {
      updateTrackingViewport(nextWidth, nextHeight);
      updateCameraCalibration();
      fitToScreen();
    }
  }

  const qrBarcode = (data.barcodes || []).find((barcode) => {
    const rawFormat = String(barcode.format || "").toLowerCase();
    const rawValueType = String(barcode.valueType || "").toLowerCase();
    return rawFormat.includes("qr") || rawValueType.includes("qr");
  });

  if (!qrBarcode?.cornerPoints || qrBarcode.cornerPoints.length < 4) {
    return;
  }

  latestMlKitBarcode = {
    ...qrBarcode,
    cornerPoints: qrBarcode.cornerPoints.map(([x, y]) => ({ x, y })),
  };
  lastMlKitDetectionAt = performance.now();
}

function handleMlKitStatusMessage(data) {
  if (!data?.message) {
    return;
  }

  setStatus(data.message);
}

function handleMlKitStopMessage() {
  latestMlKitBarcode = null;
  lastMlKitDetectionAt = 0;
  hasLiveMarkerDetection = false;
  arGroup.visible = false;
  hasTrackingPose = false;
  resetDetectionConfidence();
  setFocusedPart(-1);
  setStatus(copy.statusSearching);
}

function handleParentMessage(event) {
  if (!isMlKitScannerMode || event.origin !== window.location.origin) {
    return;
  }

  const data = event.data;
  if (!data?.type || typeof data.type !== "string") {
    return;
  }

  if (data.type === "solar-mlkit-barcodes") {
    handleMlKitBarcodeMessage(data);
  } else if (data.type === "solar-mlkit-status") {
    handleMlKitStatusMessage(data);
  } else if (data.type === "solar-mlkit-stop") {
    handleMlKitStopMessage();
  }
}

function processFrame(timestamp) {
  if (
    (!activeStream && !isMlKitScannerMode) ||
    (!isMlKitScannerMode && (!cap || !src)) ||
    !renderer ||
    !labelRenderer
  ) {
    return;
  }

  const deltaSeconds = previousFrameTime
    ? Math.min((timestamp - previousFrameTime) / 1000, 0.05)
    : 0;
  previousFrameTime = timestamp;

  if (animationMixer && deltaSeconds > 0) {
    animationMixer.update(deltaSeconds);
  }

  if (!isMlKitScannerMode) {
    cap.read(src);
    if (SHOW_DEBUG_CAMERA_CANVAS) {
      cv.imshow("canvasOutput", src);
    }
  }

  let markerFound = arGroup.visible;
  let shouldHoldSteady = detectionStreak > 0 && !hasTrackingPose;

  if (isMlKitScannerMode) {
    ({ markerFound, shouldHoldSteady } = runMlKitDetection(timestamp));
  } else if (!lastQrScanTime || timestamp - lastQrScanTime >= getQrScanInterval()) {
    lastQrScanTime = timestamp;
    ({ markerFound, shouldHoldSteady } = runQrDetection());
  }

  if (markerFound) {
    setStatus(copy.statusTracking);
  } else if (shouldHoldSteady && detectionStreak > 0) {
    setStatus(copy.statusHoldSteady);
  } else {
    setStatus(copy.statusSearching);
  }

  if (!hasLiveMarkerDetection && focusedPartIndex !== -1) {
    setFocusedPart(-1);
  } else {
    syncLabels();
  }

  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
  positionInfoCard();

  animationFrameId = window.requestAnimationFrame(processFrame);
}

function fitToScreen() {
  if (isMlKitScannerMode) {
    const width = Math.max(1, window.innerWidth);
    const height = Math.max(1, window.innerHeight);
    updateTrackingViewport(width, height);

    [UI.canvasOutput, UI.canvasThree].forEach((layer) => {
      if (!layer) {
        return;
      }
      layer.style.width = `${width}px`;
      layer.style.height = `${height}px`;
      layer.style.left = "0";
      layer.style.top = "0";
      layer.style.transform = "none";
    });

    if (UI.video) {
      UI.video.style.width = `${width}px`;
      UI.video.style.height = `${height}px`;
      UI.video.style.left = "0";
      UI.video.style.top = "0";
      UI.video.style.transform = "none";
    }

    if (renderer) {
      renderer.setSize(width, height, false);
    }
    if (camera) {
      camera.aspect = width / height;
      updateCameraCalibration();
      camera.updateProjectionMatrix();
    }
    if (labelRenderer) {
      labelRenderer.setSize(width, height);
    }

    positionInfoCard();
    return;
  }

  const scale = Math.max(
    window.innerWidth / UI.video.videoWidth,
    window.innerHeight / UI.video.videoHeight,
  );
  const width = UI.video.videoWidth * scale;
  const height = UI.video.videoHeight * scale;

  [UI.video, UI.canvasOutput, UI.canvasThree].forEach((layer) => {
    if (!layer) {
      return;
    }
    layer.style.width = `${width}px`;
    layer.style.height = `${height}px`;
    layer.style.left = "50%";
    layer.style.top = "50%";
    layer.style.transform = "translate(-50%, -50%)";
  });

  if (labelRenderer) {
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
  }

  positionInfoCard();
}

function cleanup() {
  window.removeEventListener("message", handleParentMessage);
  if (animationFrameId) {
    window.cancelAnimationFrame(animationFrameId);
    animationFrameId = 0;
  }
  if (activeStream) {
    activeStream.getTracks().forEach((track) => track.stop());
    activeStream = undefined;
  }
  if (UI.video.srcObject) {
    UI.video.pause();
    UI.video.srcObject = null;
  }

  isDragging = false;
  isArInitialized = false;
  focusedPartIndex = -1;
  lostMarkerFrames = 0;
  hasTrackingPose = false;
  hasLiveMarkerDetection = false;
  resetDetectionConfidence();
  previousFrameTime = 0;
  lastQrScanTime = 0;
  latestMlKitBarcode = null;
  lastMlKitDetectionAt = 0;
  pendingOpenCvConfig = null;

  if (renderer) {
    renderer.dispose();
  }
  if (labelRenderer?.domElement?.parentNode) {
    labelRenderer.domElement.parentNode.removeChild(labelRenderer.domElement);
  }
  [src, qrPoints, imagePoints, camMatrix, distCoeffs, objectPoints, rvec, tvec, rotMatr].forEach(
    (mat) => {
      if (mat && typeof mat.delete === "function") {
        mat.delete();
      }
    },
  );
  if (qrDetector && typeof qrDetector.delete === "function") {
    qrDetector.delete();
  }

  labels = [];
  showViewerUi();
  src = undefined;
  cap = undefined;
  qrDetector = undefined;
  qrPoints = undefined;
  imagePoints = undefined;
  camMatrix = undefined;
  distCoeffs = undefined;
  rvec = undefined;
  tvec = undefined;
  rotMatr = undefined;
  objectPoints = undefined;
  renderer = undefined;
  labelRenderer = undefined;
  scene = undefined;
  camera = undefined;
  arGroup = undefined;
  modelHolder = undefined;
  sourceSolarModel = undefined;
  animationMixer = undefined;
}

window.addEventListener("resize", fitToScreen);
window.addEventListener("pagehide", cleanup);
window.addEventListener("beforeunload", cleanup);
window.addEventListener("message", handleParentMessage);

loadConfig();
