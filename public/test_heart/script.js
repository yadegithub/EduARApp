const query = new URLSearchParams(window.location.search);
const currentTheme = query.get("theme") === "light" ? "light" : "dark";
const currentLanguage = query.get("lang") === "ar" ? "ar" : "en";
const HEART_MODEL_PATH = "assets/human_heart.glb";

document.documentElement.dataset.theme = currentTheme;
document.documentElement.lang = currentLanguage;
document.documentElement.dir = currentLanguage === "ar" ? "rtl" : "ltr";

const UI = {
    appEyebrow: document.getElementById("app-eyebrow"),
    appTitle: document.getElementById("app-title"),
    canvasOutput: document.getElementById("canvasOutput"),
    canvasThree: document.getElementById("canvasThree"),
    card: document.getElementById("info-card"),
    cardHint: document.getElementById("card-hint"),
    cardTag: document.getElementById("card-tag"),
    labelToggle: document.getElementById("label-toggle"),
    labelsLabel: document.getElementById("labels-label"),
    partInfo: document.getElementById("part-info"),
    partName: document.getElementById("part-name"),
    rotateBtn: document.getElementById("btn-rotate"),
    rotateLabel: document.getElementById("rotate-label"),
    scaleBtn: document.getElementById("btn-scale"),
    scaleLabel: document.getElementById("scale-label"),
    soundBtn: document.getElementById("btn-sound"),
    soundLabel: document.getElementById("sound-label"),
    status: document.getElementById("status"),
    video: document.getElementById("videoInput")
};

const copy = {
    en: {
        appEyebrow: "AR Learn live scan",
        appTitle: "HUMAN HEART",
        rotate: "Rotate",
        scale: "Scale",
        sound: "Audio",
        labels: "Labels On/Off",
        statusStarting: "Starting camera...",
        statusLoading: "Loading heart model...",
        statusReady: "Camera ready • scan your printed QR code",
        statusTracking: "QR detected • heart placed",
        statusSearching: "Searching for QR code...",
        statusCameraError: "Camera access was denied.",
        statusModelError: "The heart model could not be loaded.",
        cardTag: "Live anatomy",
        partName: "AORTA",
        partInfo:
            "The aorta carries oxygen-rich blood from the left ventricle to the rest of the body.",
        cardHint:
            "Use rotate, scale, sound and labels while the model is active.",
        labelsData: [
            { name: "Aorta", position: [0.1, 0.72, 0.15] },
            { name: "Pulmonary Artery", position: [0.25, 0.45, 0.2] },
            { name: "Left Atrium", position: [0.35, 0.05, 0.3] },
            { name: "Left Ventricle", position: [0.25, -0.4, 0.4] },
            { name: "Right Atrium", position: [-0.4, 0.05, 0.25] },
            { name: "Right Ventricle", position: [-0.35, -0.45, 0.35] }
        ]
    },
    ar: {
        appEyebrow: "Ù…Ø³Ø­ Ø­ÙŠ Ù…Ù† AR Learn",
        appTitle: "Ù‚Ù„Ø¨ Ø§Ù„Ø¥Ù†Ø³Ø§Ù†",
        rotate: "ØªØ¯ÙˆÙŠØ±",
        scale: "ØªØ­Ø¬ÙŠÙ…",
        sound: "Ø§Ù„ØµÙˆØª",
        labels: "Ø¥Ø¸Ù‡Ø§Ø± ÙˆØ¥Ø®ÙØ§Ø¡ Ø§Ù„ØªØ³Ù…ÙŠØ§Øª",
        statusStarting: "Ø¬Ø§Ø±Ù ØªØ´ØºÙŠÙ„ Ø§Ù„ÙƒØ§Ù…ÙŠØ±Ø§...",
        statusLoading: "Ø¬Ø§Ø±Ù ØªØ­Ù…ÙŠÙ„ Ù†Ù…ÙˆØ°Ø¬ Ø§Ù„Ù‚Ù„Ø¨...",
        statusReady: "Ø§Ù„ÙƒØ§Ù…ÙŠØ±Ø§ Ø¬Ø§Ù‡Ø²Ø© â€¢ Ø§Ù…Ø³Ø­ Ø±Ù…Ø² QR Ø§Ù„Ù…Ø·Ø¨ÙˆØ¹",
        statusTracking: "ØªÙ… Ø§ÙƒØªØ´Ø§Ù Ø§Ù„Ø±Ù…Ø² â€¢ ØªÙ… Ø¹Ø±Ø¶ Ø§Ù„Ù‚Ù„Ø¨",
        statusSearching: "Ø¬Ø§Ø±Ù Ø§Ù„Ø¨Ø­Ø« Ø¹Ù† Ø±Ù…Ø² QR...",
        statusCameraError: "ØªÙ… Ø±ÙØ¶ Ø§Ù„ÙˆØµÙˆÙ„ Ø¥Ù„Ù‰ Ø§Ù„ÙƒØ§Ù…ÙŠØ±Ø§.",
        statusModelError: "ØªØ¹Ø°Ø± ØªØ­Ù…ÙŠÙ„ Ù†Ù…ÙˆØ°Ø¬ Ø§Ù„Ù‚Ù„Ø¨.",
        cardTag: "ØªØ´Ø±ÙŠØ­ Ø­ÙŠ",
        partName: "Ø§Ù„Ø´Ø±ÙŠØ§Ù† Ø§Ù„Ø£Ø¨Ù‡Ø±",
        partInfo:
            "ÙŠÙ†Ù‚Ù„ Ø§Ù„Ø´Ø±ÙŠØ§Ù† Ø§Ù„Ø£Ø¨Ù‡Ø± Ø§Ù„Ø¯Ù… Ø§Ù„ØºÙ†ÙŠ Ø¨Ø§Ù„Ø£ÙƒØ³Ø¬ÙŠÙ† Ù…Ù† Ø§Ù„Ø¨Ø·ÙŠÙ† Ø§Ù„Ø£ÙŠØ³Ø± Ø¥Ù„Ù‰ Ø¨Ø§Ù‚ÙŠ Ø£Ù†Ø­Ø§Ø¡ Ø§Ù„Ø¬Ø³Ù….",
        cardHint:
            "Ø§Ø³ØªØ®Ø¯Ù… Ø§Ù„ØªØ¯ÙˆÙŠØ± ÙˆØ§Ù„ØªØ­Ø¬ÙŠÙ… ÙˆØ§Ù„ØµÙˆØª ÙˆØ§Ù„ØªØ³Ù…ÙŠØ§Øª Ø£Ø«Ù†Ø§Ø¡ Ø¹Ø±Ø¶ Ø§Ù„Ù†Ù…ÙˆØ°Ø¬.",
        labelsData: [
            { name: "Ø§Ù„Ø£Ø¨Ù‡Ø±", position: [0.1, 0.72, 0.15] },
            { name: "Ø§Ù„Ø´Ø±ÙŠØ§Ù† Ø§Ù„Ø±Ø¦ÙˆÙŠ", position: [0.25, 0.45, 0.2] },
            { name: "Ø§Ù„Ø£Ø°ÙŠÙ† Ø§Ù„Ø£ÙŠØ³Ø±", position: [0.35, 0.05, 0.3] },
            { name: "Ø§Ù„Ø¨Ø·ÙŠÙ† Ø§Ù„Ø£ÙŠØ³Ø±", position: [0.25, -0.4, 0.4] },
            { name: "Ø§Ù„Ø£Ø°ÙŠÙ† Ø§Ù„Ø£ÙŠÙ…Ù†", position: [-0.4, 0.05, 0.25] },
            { name: "Ø§Ù„Ø¨Ø·ÙŠÙ† Ø§Ù„Ø£ÙŠÙ…Ù†", position: [-0.35, -0.45, 0.35] }
        ]
    }
}[currentLanguage];

let src;
let cap;
let qrDetector;
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
let heartModel;
let heartSound;
let activeStream;
let anatomyLabels = [];
let currentMode = null;
let labelsVisible = true;
let isSoundPlaying = false;
let isDragging = false;
let prevPos = { x: 0, y: 0 };
let arScale = 3.0;
let animationFrameId = 0;
let openCvCheckTimerId = 0;
let isArInitialized = false;
let isSessionStarting = false;

const defaultConfig = {
    assets: {
        models: {
            heart: {
                path: HEART_MODEL_PATH,
                position: { x: 0.5, y: 0.55, z: 0.0 },
                scale: { x: 1.15, y: 1.15, z: 1.15 }
            }
        },
        audio: "assets/heartbeat.mp3"
    },
    settings: {
        arScale: 3.0
    }
};

function applyCopy() {
    UI.appEyebrow.textContent = copy.appEyebrow;
    UI.appTitle.textContent = copy.appTitle;
    UI.rotateLabel.textContent = copy.rotate;
    UI.scaleLabel.textContent = copy.scale;
    UI.soundLabel.textContent = copy.sound;
    UI.labelsLabel.textContent = copy.labels;
    UI.cardTag.textContent = copy.cardTag;
    UI.partName.textContent = copy.partName;
    UI.partInfo.textContent = copy.partInfo;
    UI.cardHint.textContent = copy.cardHint;
    setStatus(copy.statusStarting);
}

function setStatus(message) {
    if (UI.status.textContent === message) {
        return;
    }

    UI.status.textContent = message;
}

async function loadConfig() {
    if (isSessionStarting || activeStream) {
        return;
    }

    isSessionStarting = true;
    applyCopy();
    let config = defaultConfig;

    try {
        const response = await fetch("./data.json");
        if (response.ok) {
            config = await response.json();
        }
    } catch (error) {
        config = defaultConfig;
    }

    try {
        await startCamera(config);
    } finally {
        isSessionStarting = false;
    }
}

async function startCamera(config) {
    if (activeStream) {
        return;
    }

    setStatus(copy.statusStarting);

    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: "environment",
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }
        });
        activeStream = stream;

        await new Promise((resolve) => {
            const handleLoadedMetadata = () => {
                UI.video.removeEventListener("loadedmetadata", handleLoadedMetadata);
                resolve();
            };

            UI.video.addEventListener("loadedmetadata", handleLoadedMetadata);
            UI.video.srcObject = stream;
        });

        await UI.video.play().catch(() => undefined);

        const width = UI.video.videoWidth;
        const height = UI.video.videoHeight;

        [UI.video, UI.canvasOutput, UI.canvasThree].forEach((element) => {
            element.width = width;
            element.height = height;
        });

        fitToScreen();
        checkOpenCV(config ?? defaultConfig);
    } catch (error) {
        setStatus(copy.statusCameraError);
    }
}

function checkOpenCV(config) {
    if (!activeStream || isArInitialized) {
        return;
    }

    if (typeof cv !== "undefined" && cv.Mat) {
        isArInitialized = true;
        initThree(config);
        initCV(config);
        setupControls();
        animationFrameId = window.requestAnimationFrame(processFrame);
        return;
    }

    openCvCheckTimerId = window.setTimeout(() => checkOpenCV(config), 120);
}

function initThree(config) {
    renderer = new THREE.WebGLRenderer({
        canvas: UI.canvasThree,
        alpha: true,
        antialias: true
    });
    renderer.setSize(UI.video.width, UI.video.height, false);
    renderer.setPixelRatio(window.devicePixelRatio || 1);

    labelRenderer = new THREE.CSS2DRenderer();
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.domElement.style.position = "absolute";
    labelRenderer.domElement.style.top = "0";
    labelRenderer.domElement.style.left = "0";
    labelRenderer.domElement.style.pointerEvents = "none";
    document.body.appendChild(labelRenderer.domElement);

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
        45,
        UI.video.width / UI.video.height,
        0.1,
        1000
    );

    arGroup = new THREE.Group();
    arGroup.visible = false;
    arGroup.matrixAutoUpdate = false;
    scene.add(arGroup);

    scene.add(new THREE.AmbientLight(0xffffff, 1.3));

    const keyLight = new THREE.PointLight(0xffffff, 0.95);
    keyLight.position.set(4, 5, 6);
    scene.add(keyLight);

    const accentLight = new THREE.PointLight(0x29d5ff, 0.9);
    accentLight.position.set(-4, 3, 4);
    scene.add(accentLight);

    const loader = new THREE.GLTFLoader();
    const modelConfig = config.assets?.models?.heart ?? defaultConfig.assets.models.heart;
    const modelPath = modelConfig.path ?? HEART_MODEL_PATH;
    const modelPosition = modelConfig.position ?? defaultConfig.assets.models.heart.position;
    const modelScale = modelConfig.scale ?? defaultConfig.assets.models.heart.scale;

    arScale = config.settings?.arScale ?? defaultConfig.settings.arScale;
    heartSound = new Audio(config.assets?.audio ?? defaultConfig.assets.audio);
    heartSound.loop = true;

    setStatus(copy.statusLoading);

    loader.load(
        modelPath,
        (gltf) => {
            heartModel = gltf.scene;
            heartModel.position.set(
                modelPosition.x ?? 0.5,
                modelPosition.y ?? 0.55,
                modelPosition.z ?? 0
            );
            heartModel.scale.set(
                modelScale.x ?? 1.15,
                modelScale.y ?? 1.15,
                modelScale.z ?? 1.15
            );
            heartModel.rotation.y = Math.PI;
            arGroup.add(heartModel);

            copy.labelsData.forEach((labelData) => {
                addAnatomyLabel(labelData.name, ...labelData.position);
            });

            setupInteraction();
            setStatus(copy.statusReady);
        },
        undefined,
        () => {
            setStatus(copy.statusModelError);
        }
    );
}

function addAnatomyLabel(name, x, y, z) {
    if (!heartModel) {
        return;
    }

    const labelAnchor = new THREE.Group();
    labelAnchor.position.set(x, y, z);
    heartModel.add(labelAnchor);

    const div = document.createElement("div");
    div.className = "label-anatomie";
    div.textContent = name;

    const label = new THREE.CSS2DObject(div);
    label.position.set(0, 0, 0);
    labelAnchor.add(label);
    label.element.style.opacity = labelsVisible ? "1" : "0";
    anatomyLabels.push(label);
}

function setupControls() {
    const syncModeButtons = () => {
        UI.rotateBtn.classList.toggle("active", currentMode === "rotate");
        UI.scaleBtn.classList.toggle("active", currentMode === "scale");
        UI.rotateBtn.setAttribute("aria-pressed", String(currentMode === "rotate"));
        UI.scaleBtn.setAttribute("aria-pressed", String(currentMode === "scale"));
    };

    const syncSoundButton = () => {
        UI.soundBtn.classList.toggle("active", isSoundPlaying);
        UI.soundBtn.setAttribute("aria-pressed", String(isSoundPlaying));
    };

    const syncLabels = () => {
        anatomyLabels.forEach((label) => {
            label.element.style.opacity = labelsVisible ? "1" : "0";
        });
    };

    const setMode = (mode) => {
        currentMode = currentMode === mode ? null : mode;
        isDragging = false;
        syncModeButtons();
    };

    const toggleSound = () => {
        if (!heartSound) {
            return;
        }

        if (isSoundPlaying) {
            isSoundPlaying = false;
            syncSoundButton();
            heartSound.pause();
            heartSound.currentTime = 0;
            return;
        }

        heartSound.play().then(() => {
            isSoundPlaying = true;
            syncSoundButton();
        }).catch(() => {
            isSoundPlaying = false;
            syncSoundButton();
        });
    };

    UI.rotateBtn.onclick = () => setMode("rotate");
    UI.scaleBtn.onclick = () => setMode("scale");
    UI.soundBtn.onclick = toggleSound;
    syncModeButtons();
    syncSoundButton();
    UI.labelToggle.onchange = (event) => {
        labelsVisible = event.target.checked;
        syncLabels();
    };
    syncLabels();
}

function setupInteraction() {
    const start = (event) => {
        if (!heartModel || !currentMode) {
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
        if (!isDragging || !heartModel || !currentMode) {
            return;
        }

        const point = event.touches?.[0] ?? event;
        const deltaX = point.clientX - prevPos.x;
        const deltaY = point.clientY - prevPos.y;

        if (currentMode === "rotate") {
            heartModel.rotation.y += deltaX * 0.01;
            heartModel.rotation.x += deltaY * 0.01;
        } else if (currentMode === "scale") {
            const factor = Math.max(0.65, Math.min(1.45, 1 - deltaY * 0.005));
            heartModel.scale.multiplyScalar(factor);
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
}

function initCV(config) {
    src = new cv.Mat(UI.video.height, UI.video.width, cv.CV_8UC4);
    cap = new cv.VideoCapture(UI.video);
    qrDetector = new cv.QRCodeDetector();

    const focalLength = Math.max(UI.video.width, UI.video.height);
    camMatrix = cv.matFromArray(3, 3, cv.CV_64FC1, [
        focalLength,
        0,
        UI.video.width / 2,
        0,
        focalLength,
        UI.video.height / 2,
        0,
        0,
        1
    ]);
    distCoeffs = new cv.Mat.zeros(5, 1, cv.CV_64FC1);
    objectPoints = cv.matFromArray(4, 3, cv.CV_64FC1, [
        0, 0, 0,
        1, 0, 0,
        1, 1, 0,
        0, 1, 0
    ]);
    rvec = new cv.Mat();
    tvec = new cv.Mat();
    rotMatr = new cv.Mat(3, 3, cv.CV_64FC1);

    const depthNear = 0.1;
    const depthFar = 1000;
    camera.projectionMatrix.set(
        (2 * focalLength) / UI.video.width,
        0,
        0,
        0,
        0,
        (2 * focalLength) / UI.video.height,
        0,
        0,
        0,
        0,
        -(depthFar + depthNear) / (depthFar - depthNear),
        (-2 * depthFar * depthNear) / (depthFar - depthNear),
        0,
        0,
        -1,
        0
    );
}

function processFrame() {
    if (!activeStream || !cap || !src || !renderer || !labelRenderer) {
        return;
    }

    cap.read(src);
    cv.imshow("canvasOutput", src);

    const points = new cv.Mat();
    let markerFound = false;

    if (qrDetector.detect(src, points)) {
        const imagePoints = cv.matFromArray(4, 1, cv.CV_32FC2, [
            points.data32F[0], points.data32F[1],
            points.data32F[2], points.data32F[3],
            points.data32F[4], points.data32F[5],
            points.data32F[6], points.data32F[7]
        ]);

        if (cv.solvePnP(objectPoints, imagePoints, camMatrix, distCoeffs, rvec, tvec)) {
            cv.Rodrigues(rvec, rotMatr);
            const rotation = rotMatr.data64F;
            const translation = tvec.data64F;
            const matrix = new THREE.Matrix4();

            matrix.set(
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
                1
            );

            arGroup.matrix.copy(matrix);
            arGroup.visible = true;
            markerFound = true;
        }

        imagePoints.delete();
    }

    if (!markerFound) {
        arGroup.visible = false;
    }

    setStatus(markerFound ? copy.statusTracking : copy.statusSearching);
    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);

    points.delete();
    animationFrameId = window.requestAnimationFrame(processFrame);
}

function fitToScreen() {
    const scale = Math.max(
        window.innerWidth / UI.video.videoWidth,
        window.innerHeight / UI.video.videoHeight
    );
    const width = UI.video.videoWidth * scale;
    const height = UI.video.videoHeight * scale;

    [UI.canvasOutput, UI.canvasThree].forEach((canvas) => {
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        canvas.style.left = "50%";
        canvas.style.top = "50%";
        canvas.style.transform = "translate(-50%, -50%)";
    });

    if (labelRenderer) {
        labelRenderer.setSize(window.innerWidth, window.innerHeight);
    }
}

function cleanup() {
    if (openCvCheckTimerId) {
        window.clearTimeout(openCvCheckTimerId);
        openCvCheckTimerId = 0;
    }

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

    if (heartSound) {
        heartSound.pause();
        heartSound.currentTime = 0;
    }

    isSoundPlaying = false;
    isDragging = false;
    isArInitialized = false;

    if (renderer) {
        renderer.dispose();
    }

    if (labelRenderer?.domElement?.parentNode) {
        labelRenderer.domElement.parentNode.removeChild(labelRenderer.domElement);
    }

    [src, camMatrix, distCoeffs, objectPoints, rvec, tvec, rotMatr].forEach((mat) => {
        if (mat && typeof mat.delete === "function") {
            mat.delete();
        }
    });

    if (qrDetector && typeof qrDetector.delete === "function") {
        qrDetector.delete();
    }

    anatomyLabels = [];
    src = undefined;
    cap = undefined;
    qrDetector = undefined;
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
    heartModel = undefined;
    heartSound = undefined;
}

window.addEventListener("resize", fitToScreen);
window.addEventListener("pagehide", cleanup);
window.addEventListener("beforeunload", cleanup);

loadConfig();
