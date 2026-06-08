const query = new URLSearchParams(window.location.search);
const currentTheme = query.get("theme") === "light" ? "light" : "dark";
const currentLanguage = query.get("lang") === "ar" ? "ar" : "en";
const isEmbeddedApp = query.get("embed") === "app";
const HEART_MODEL_PATH = "assets/human_heart.glb";
const QUIZ_DELAY_SECONDS = 30;
const DEFAULT_HEART_ROTATION = {
    x: 0,
    y: Math.PI,
    z: 0
};
const MARKER_LOST_GRACE_FRAMES = 20;
const TRACKING_LERP_ALPHA = 0.18;
const TRACKING_SCALE_LERP_ALPHA = 0.12;
const CONFIRM_FRAMES = 2;
const MIN_QR_AREA_RATIO = 0.008;
const MIN_QR_EDGE = 48;
const MAX_QR_EDGE_RATIO = 2.3;
const MAX_CENTER_JUMP_RATIO = 0.12;
const QR_SCAN_INTERVAL_MS = 80;
const QR_SEARCH_INTERVAL_MS = 120;
const MAX_RENDER_PIXEL_RATIO = 1;
const CAMERA_IDEAL_WIDTH = 960;
const CAMERA_IDEAL_HEIGHT = 540;
const CAMERA_IDEAL_FRAME_RATE = 24;
const CAMERA_MAX_FRAME_RATE = 30;
const SHOW_DEBUG_CAMERA_CANVAS = false;
const LABEL_SCALE_MIN = 0.9;
const LABEL_SCALE_MAX = 1.2;
const LABEL_SCALE_RESPONSE = 0.35;

document.documentElement.dataset.theme = currentTheme;
document.documentElement.lang = currentLanguage;
document.documentElement.dir = currentLanguage === "ar" ? "rtl" : "ltr";
document.documentElement.dataset.embed = isEmbeddedApp ? "app" : "standalone";

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
    listenBtn: document.getElementById("listen-btn"),
    modelTitle: document.getElementById("model-title-pill"),
    overviewTitle: document.getElementById("overview-title"),
    overviewText: document.getElementById("overview-text"),
    partInfo: document.getElementById("part-info"),
    partName: document.getElementById("part-name"),
    quizActionBtn: document.getElementById("quiz-action-btn"),
    quizEyebrow: document.getElementById("quiz-eyebrow"),
    quizIntro: document.getElementById("quiz-intro"),
    quizLayer: document.getElementById("quiz-layer"),
    quizList: document.getElementById("quiz-list"),
    quizPill: document.getElementById("quiz-pill"),
    quizPillIcon: document.getElementById("quiz-pill-icon"),
    quizPillText: document.getElementById("quiz-pill-text"),
    quizSummary: document.getElementById("quiz-summary"),
    quizTitle: document.getElementById("quiz-title"),
    rotateBtn: document.getElementById("btn-rotate"),
    rotateLabel: document.getElementById("rotate-label"),
    scaleBtn: document.getElementById("btn-scale"),
    scaleLabel: document.getElementById("scale-label"),
    soundBtn: document.getElementById("btn-sound"),
    soundLabel: document.getElementById("sound-label"),
    status: document.getElementById("status"),
    video: document.getElementById("videoInput")
};

const anatomyParts = [
    {
        id: "aorta",
        label: "Aorta",
        title: "AORTA",
        info: "The aorta carries oxygen-rich blood from the left ventricle to the rest of the body.",
        hint: "This is the main artery leaving the heart.",
        position: [0.1, 0.72, 0.15]
    },
    {
        id: "pulmonary-artery",
        label: "Pulmonary Artery",
        title: "PULMONARY ARTERY",
        info: "The pulmonary artery moves oxygen-poor blood from the heart to the lungs.",
        hint: "It begins pulmonary circulation.",
        position: [0.25, 0.45, 0.2]
    },
    {
        id: "left-atrium",
        label: "Left Atrium",
        title: "LEFT ATRIUM",
        info: "The left atrium receives oxygen-rich blood returning from the lungs.",
        hint: "It passes fresh blood into the left ventricle.",
        position: [0.35, 0.05, 0.3]
    },
    {
        id: "left-ventricle",
        label: "Left Ventricle",
        title: "LEFT VENTRICLE",
        info: "The left ventricle pumps oxygen-rich blood out through the aorta.",
        hint: "This chamber has the thickest wall.",
        position: [0.25, -0.4, 0.4]
    },
    {
        id: "right-atrium",
        label: "Right Atrium",
        title: "RIGHT ATRIUM",
        info: "The right atrium receives oxygen-poor blood coming back from the body.",
        hint: "It sends blood down into the right ventricle.",
        position: [-0.4, 0.05, 0.25]
    },
    {
        id: "right-ventricle",
        label: "Right Ventricle",
        title: "RIGHT VENTRICLE",
        info: "The right ventricle pumps oxygen-poor blood toward the lungs.",
        hint: "It starts the trip to the lungs for oxygen.",
        position: [-0.35, -0.45, 0.35]
    }
].map((part, index) => ({
    ...part,
    number: index + 1
}));

const heartPartCopy = {
    aorta: {
        label: "الشريان الأبهر",
        title: "الشريان الأبهر",
        info: "ينقل الشريان الأبهر الدم الغني بالأكسجين من البطين الأيسر إلى باقي الجسم.",
        hint: "هذا هو الشريان الرئيسي الخارج من القلب."
    },
    "pulmonary-artery": {
        label: "الشريان الرئوي",
        title: "الشريان الرئوي",
        info: "ينقل الشريان الرئوي الدم الفقير بالأكسجين من القلب إلى الرئتين.",
        hint: "يبدأ هنا مسار الدورة الدموية الرئوية."
    },
    "left-atrium": {
        label: "الأذين الأيسر",
        title: "الأذين الأيسر",
        info: "يستقبل الأذين الأيسر الدم الغني بالأكسجين العائد من الرئتين.",
        hint: "يمرر الدم المؤكسج إلى البطين الأيسر."
    },
    "left-ventricle": {
        label: "البطين الأيسر",
        title: "البطين الأيسر",
        info: "يضخ البطين الأيسر الدم الغني بالأكسجين إلى خارج القلب عبر الشريان الأبهر.",
        hint: "هذه الحجرة لها الجدار الأكثر سماكة."
    },
    "right-atrium": {
        label: "الأذين الأيمن",
        title: "الأذين الأيمن",
        info: "يستقبل الأذين الأيمن الدم الفقير بالأكسجين العائد من الجسم.",
        hint: "يرسل الدم إلى الأسفل نحو البطين الأيمن."
    },
    "right-ventricle": {
        label: "البطين الأيمن",
        title: "البطين الأيمن",
        info: "يضخ البطين الأيمن الدم الفقير بالأكسجين نحو الرئتين.",
        hint: "يبدأ رحلة الدم نحو الرئتين للحصول على الأكسجين."
    }
};

if (currentLanguage === "ar") {
    anatomyParts.forEach((part) => {
        const localizedPart = heartPartCopy[part.id];
        if (!localizedPart) {
            return;
        }

        part.label = localizedPart.label;
        part.title = localizedPart.title;
        part.info = localizedPart.info;
        part.hint = localizedPart.hint;
    });
}

const quizQuestionsEn = [
    {
        id: "left-ventricle",
        prompt: "Which chamber pumps oxygen-rich blood to the rest of the body?",
        options: [
            { id: "a", label: "Left ventricle", isCorrect: true },
            { id: "b", label: "Right atrium", isCorrect: false },
            { id: "c", label: "Right ventricle", isCorrect: false }
        ]
    },
    {
        id: "aorta",
        prompt: "What is the name of the main vessel that carries blood away from the heart?",
        options: [
            { id: "a", label: "Vena cava", isCorrect: false },
            { id: "b", label: "Aorta", isCorrect: true },
            { id: "c", label: "Pulmonary artery", isCorrect: false }
        ]
    },
    {
        id: "right-side",
        prompt: "What does the right side of the heart mainly do?",
        options: [
            { id: "a", label: "Sends oxygen-poor blood to the lungs", isCorrect: true },
            { id: "b", label: "Sends blood straight to the brain", isCorrect: false },
            { id: "c", label: "Controls the heart rhythm directly", isCorrect: false }
        ]
    }
];

const quizQuestionsAr = [
    {
        id: "left-ventricle",
        prompt:
            "\u0623\u064a \u062d\u062c\u0631\u0629 \u0641\u064a \u0627\u0644\u0642\u0644\u0628 \u062a\u0636\u062e \u0627\u0644\u062f\u0645 \u0627\u0644\u063a\u0646\u064a \u0628\u0627\u0644\u0623\u0643\u0633\u062c\u064a\u0646 \u0625\u0644\u0649 \u0633\u0627\u0626\u0631 \u0627\u0644\u062c\u0633\u0645\u061f",
        options: [
            { id: "a", label: "\u0627\u0644\u0628\u0637\u064a\u0646 \u0627\u0644\u0623\u064a\u0633\u0631", isCorrect: true },
            { id: "b", label: "\u0627\u0644\u0623\u0630\u064a\u0646 \u0627\u0644\u0623\u064a\u0645\u0646", isCorrect: false },
            { id: "c", label: "\u0627\u0644\u0628\u0637\u064a\u0646 \u0627\u0644\u0623\u064a\u0645\u0646", isCorrect: false }
        ]
    },
    {
        id: "aorta",
        prompt:
            "\u0645\u0627 \u0627\u0633\u0645 \u0627\u0644\u0648\u0639\u0627\u0621 \u0627\u0644\u062f\u0645\u0648\u064a \u0627\u0644\u0631\u0626\u064a\u0633\u064a \u0627\u0644\u0630\u064a \u064a\u062d\u0645\u0644 \u0627\u0644\u062f\u0645 \u0628\u0639\u064a\u062f\u0627\u064b \u0639\u0646 \u0627\u0644\u0642\u0644\u0628\u061f",
        options: [
            { id: "a", label: "\u0627\u0644\u0648\u0631\u064a\u062f \u0627\u0644\u0623\u062c\u0648\u0641", isCorrect: false },
            { id: "b", label: "\u0627\u0644\u0623\u0628\u0647\u0631", isCorrect: true },
            { id: "c", label: "\u0627\u0644\u0634\u0631\u064a\u0627\u0646 \u0627\u0644\u0631\u0626\u0648\u064a", isCorrect: false }
        ]
    },
    {
        id: "right-side",
        prompt:
            "\u0645\u0627 \u0627\u0644\u0648\u0638\u064a\u0641\u0629 \u0627\u0644\u0631\u0626\u064a\u0633\u064a\u0629 \u0644\u0644\u062c\u0627\u0646\u0628 \u0627\u0644\u0623\u064a\u0645\u0646 \u0645\u0646 \u0627\u0644\u0642\u0644\u0628\u061f",
        options: [
            {
                id: "a",
                label: "\u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u062f\u0645 \u0627\u0644\u0641\u0642\u064a\u0631 \u0628\u0627\u0644\u0623\u0643\u0633\u062c\u064a\u0646 \u0625\u0644\u0649 \u0627\u0644\u0631\u0626\u062a\u064a\u0646",
                isCorrect: true
            },
            {
                id: "b",
                label: "\u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u062f\u0645 \u0625\u0644\u0649 \u0627\u0644\u062f\u0645\u0627\u063a \u0645\u0628\u0627\u0634\u0631\u0629",
                isCorrect: false
            },
            {
                id: "c",
                label: "\u0627\u0644\u062a\u062d\u0643\u0645 \u0641\u064a \u0636\u0631\u0628\u0627\u062a \u0627\u0644\u0642\u0644\u0628",
                isCorrect: false
            }
        ]
    }
];

const copyEn = {
    appEyebrow: "EduAR live scan",
    appTitle: "HUMAN HEART",
    rotate: "Rotate",
    scale: "Scale",
    sound: "Audio",
    labels: "Numbers On/Off",
    statusStarting: "Starting camera...",
    statusLoading: "Loading heart model...",
    statusReady: "Camera ready",
    statusTracking: "Heart placed",
    statusHoldSteady: "Hold steady while locking QR...",
    statusSearching: "Searching for QR code...",
    statusCameraError: "Camera access was denied.",
    statusModelError: "The heart model could not be loaded.",
    focusTag: "Selected part",
    modelTitle: "CARDIOVASCULAR SYSTEM",
    continueAr: "Continue AR",
    overviewTitle: "Human Heart",
    overviewText: "An interactive anatomy model that shows the chambers, vessels and blood flow pathways.",
    quizActive: "Heart quiz ready",
    quizComplete: "Heart quiz completed",
    quizEyebrow: "Quick check",
    quizIntro: "Thirty seconds have passed. Answer a short questionnaire about the human heart.",
    quizNote: "Answer every question before submitting the quiz.",
    quizResult: "You scored {score} out of {total}.",
    quizTimer: "Quiz in",
    quizTitle: "Human Heart Questionnaire",
    submitQuiz: "Submit answers",
    overview: {
        tag: "Open-heart view",
        title: "OPEN HEART",
        info: "Tap a numbered marker to read the definition of each structure inside the heart.",
        hint: "Rotate the model until the cutaway side faces you, or use Scale to zoom closer."
    }
};

const copyAr = {
    appEyebrow: "\u0645\u0633\u062d \u0645\u0628\u0627\u0634\u0631",
    appTitle: "\u0642\u0644\u0628 \u0627\u0644\u0625\u0646\u0633\u0627\u0646",
    rotate: "\u062a\u062f\u0648\u064a\u0631",
    scale: "\u062a\u062d\u062c\u064a\u0645",
    sound: "\u0635\u0648\u062a",
    labels: "\u0627\u0644\u0623\u0631\u0642\u0627\u0645 \u062a\u0634\u063a\u064a\u0644/\u0625\u064a\u0642\u0627\u0641",
    statusStarting: "\u062c\u0627\u0631 \u062a\u0634\u063a\u064a\u0644 \u0627\u0644\u0643\u0627\u0645\u064a\u0631\u0627...",
    statusLoading: "\u062c\u0627\u0631 \u062a\u062d\u0645\u064a\u0644 \u0646\u0645\u0648\u0630\u062c \u0627\u0644\u0642\u0644\u0628...",
    statusReady: "\u0627\u0644\u0643\u0627\u0645\u064a\u0631\u0627 \u062c\u0627\u0647\u0632\u0629",
    statusTracking: "\u062a\u0645 \u0648\u0636\u0639 \u0627\u0644\u0642\u0644\u0628",
    statusHoldSteady: "\u062b\u0628\u0651\u062a \u0627\u0644\u062c\u0647\u0627\u0632 \u0623\u062b\u0646\u0627\u0621 \u0627\u0644\u062a\u0642\u0627\u0637 \u0631\u0645\u0632 QR...",
    statusSearching: "\u062c\u0627\u0631 \u0627\u0644\u0628\u062d\u062b \u0639\u0646 \u0631\u0645\u0632 QR...",
    statusCameraError: "\u062a\u0645 \u0631\u0641\u0636 \u0627\u0644\u0648\u0635\u0648\u0644 \u0625\u0644\u0649 \u0627\u0644\u0643\u0627\u0645\u064a\u0631\u0627.",
    statusModelError: "\u062a\u0639\u0630\u0631 \u062a\u062d\u0645\u064a\u0644 \u0646\u0645\u0648\u0630\u062c \u0627\u0644\u0642\u0644\u0628.",
    focusTag: "\u0627\u0644\u062c\u0632\u0621 \u0627\u0644\u0645\u062d\u062f\u062f",
    modelTitle: "\u0627\u0644\u062c\u0647\u0627\u0632 \u0627\u0644\u0642\u0644\u0628\u064a \u0627\u0644\u0648\u0639\u0627\u0626\u064a",
    continueAr: "\u0645\u062a\u0627\u0628\u0639\u0629 \u0627\u0644\u0639\u0631\u0636",
    overviewTitle: "\u0642\u0644\u0628 \u0627\u0644\u0625\u0646\u0633\u0627\u0646",
    overviewText: "\u0646\u0645\u0648\u0630\u062c \u062a\u0634\u0631\u064a\u062d\u064a \u062a\u0641\u0627\u0639\u0644\u064a \u064a\u0648\u0636\u062d \u062d\u062c\u0631\u0627\u062a \u0627\u0644\u0642\u0644\u0628 \u0648\u0627\u0644\u0623\u0648\u0639\u064a\u0629 \u0648\u0645\u0633\u0627\u0631\u0627\u062a \u062a\u062f\u0641\u0642 \u0627\u0644\u062f\u0645.",
    quizActive: "\u0627\u062e\u062a\u0628\u0627\u0631 \u0627\u0644\u0642\u0644\u0628 \u062c\u0627\u0647\u0632",
    quizComplete: "\u062a\u0645 \u0625\u0643\u0645\u0627\u0644 \u0627\u062e\u062a\u0628\u0627\u0631 \u0627\u0644\u0642\u0644\u0628",
    quizEyebrow: "\u062a\u0642\u064a\u064a\u0645 \u0633\u0631\u064a\u0639",
    quizIntro: "\u0628\u0639\u062f \u0645\u0631\u0648\u0631 \u062b\u0644\u0627\u062b\u064a\u0646 \u062b\u0627\u0646\u064a\u0629\u060c \u062d\u0627\u0646 \u0627\u0644\u0648\u0642\u062a \u0644\u0644\u0625\u062c\u0627\u0628\u0629 \u0639\u0646 \u0623\u0633\u0626\u0644\u0629 \u0633\u0631\u064a\u0639\u0629 \u062d\u0648\u0644 \u0627\u0644\u0642\u0644\u0628.",
    quizNote: "\u0623\u062c\u0628 \u0639\u0646 \u062c\u0645\u064a\u0639 \u0627\u0644\u0623\u0633\u0626\u0644\u0629 \u0642\u0628\u0644 \u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0627\u062e\u062a\u0628\u0627\u0631.",
    quizResult: "\u0623\u062d\u0631\u0632\u062a {score} \u0645\u0646 {total}.",
    quizTimer: "\u0627\u0644\u0627\u062e\u062a\u0628\u0627\u0631 \u0628\u0639\u062f",
    quizTitle: "\u0627\u0633\u062a\u0628\u064a\u0627\u0646 \u0627\u0644\u0642\u0644\u0628 \u0627\u0644\u0628\u0634\u0631\u064a",
    submitQuiz: "\u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0625\u062c\u0627\u0628\u0627\u062a",
    overview: {
        tag: "\u0639\u0631\u0636 \u0627\u0644\u0642\u0644\u0628 \u0627\u0644\u0645\u0641\u062a\u0648\u062d",
        title: "\u0627\u0644\u0642\u0644\u0628 \u0627\u0644\u0645\u0641\u062a\u0648\u062d",
        info: "\u0627\u0636\u063a\u0637 \u0639\u0644\u0649 \u0639\u0644\u0627\u0645\u0629 \u0645\u0631\u0642\u0645\u0629 \u0644\u0642\u0631\u0627\u0621\u0629 \u062a\u0639\u0631\u064a\u0641 \u0643\u0644 \u0628\u0646\u064a\u0629 \u062f\u0627\u062e\u0644 \u0627\u0644\u0642\u0644\u0628.",
        hint: "\u062f\u0648\u0651\u0631 \u0627\u0644\u0646\u0645\u0648\u0630\u062c \u062d\u062a\u0649 \u062a\u0638\u0647\u0631 \u062c\u0647\u0629 \u0627\u0644\u0645\u0642\u0637\u0639\u060c \u0623\u0648 \u0627\u0633\u062a\u062e\u062f\u0645 \u0627\u0644\u062a\u062d\u062c\u064a\u0645 \u0644\u0644\u0627\u0642\u062a\u0631\u0627\u0628 \u0623\u0643\u062b\u0631."
    }
};

const copy = currentLanguage === "ar" ? copyAr : copyEn;

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
let arScale = 2.4;
let baseHeartModelScale = 0.8;
let animationFrameId = 0;
let isArInitialized = false;
let isSessionStarting = false;
let focusedPartIndex = -1;
let lostMarkerFrames = 0;
let hasTrackingPose = false;
let hasLiveMarkerDetection = false;
let detectionStreak = 0;
let lastDetectionCenter = null;
let lastQrScanTime = 0;
let lastScanResult = {
    markerFound: false,
    shouldHoldSteady: false
};
let markerLostGraceFrames = MARKER_LOST_GRACE_FRAMES;
let trackingLerpAlpha = TRACKING_LERP_ALPHA;
let trackingScaleLerpAlpha = TRACKING_SCALE_LERP_ALPHA;
let confirmFrames = CONFIRM_FRAMES;
let qrScanIntervalMs = QR_SCAN_INTERVAL_MS;
let qrSearchIntervalMs = QR_SEARCH_INTERVAL_MS;
let positionDeadzone = 0;
let scaleDeadzone = 0;
let rotationDeadzoneRad = 0;
let fastFollowDistance = 0;
let fastFollowAlpha = TRACKING_LERP_ALPHA;
let focalLength = 0;
let qrScannerReady = false;
let qrScanInFlight = false;
let scanContext;
let availableSpeechVoices = [];
let preloadedModelPath = "";
let preloadedModelPromise;
let isModelMounted = false;
let quizTimerId = 0;
let quizTimeLeft = QUIZ_DELAY_SECONDS;
let isQuizVisible = false;
let isQuizCompleted = false;
let quizScore = null;
let quizAnswers = {};

const trackedMatrix = new THREE.Matrix4();
const trackedPosition = new THREE.Vector3();
const trackedQuaternion = new THREE.Quaternion();
const trackedScale = new THREE.Vector3();

const defaultConfig = {
    assets: {
        models: {
            heart: {
                path: HEART_MODEL_PATH,
                position: { x: 0.0, y: 0.0, z: 0.0 },
                scale: { x: 0.8, y: 0.8, z: 0.8 },
                rotation: DEFAULT_HEART_ROTATION
            }
        },
        audio: "/test_shared/assets/heartbeat.mp3"
    },
    settings: {
        arScale: 2.4,
        tracking: {
            markerLostGraceFrames: MARKER_LOST_GRACE_FRAMES,
            trackingLerpAlpha: TRACKING_LERP_ALPHA,
            trackingScaleLerpAlpha: 0.22,
            confirmFrames: CONFIRM_FRAMES,
            qrScanIntervalMs: QR_SCAN_INTERVAL_MS,
            qrSearchIntervalMs: QR_SEARCH_INTERVAL_MS,
            positionDeadzone: 0.01,
            scaleDeadzone: 0.012,
            rotationDeadzoneRad: 0.02,
            fastFollowDistance: 0.08,
            fastFollowAlpha: 0.68
        }
    }
};

function startModelPreload(config) {
    const modelConfig = config?.assets?.models?.heart ?? defaultConfig.assets.models.heart;
    const modelPath = modelConfig.path ?? HEART_MODEL_PATH;

    if (preloadedModelPromise && preloadedModelPath === modelPath) {
        return preloadedModelPromise;
    }

    preloadedModelPath = modelPath;
    preloadedModelPromise = new Promise((resolve, reject) => {
        const loader = new THREE.GLTFLoader();
        loader.load(modelPath, resolve, undefined, reject);
    });

    return preloadedModelPromise;
}

function setStatus(message) {
    if (!UI.status || UI.status.textContent === message) {
        return;
    }

    UI.status.textContent = message;
}

function getQuizQuestions() {
    return currentLanguage === "ar" ? quizQuestionsAr : quizQuestionsEn;
}

function formatQuizTime(seconds) {
    const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
    const remainingSeconds = String(seconds % 60).padStart(2, "0");
    return `${minutes}:${remainingSeconds}`;
}

function hasAnsweredEveryQuizQuestion() {
    return getQuizQuestions().every((question) => Boolean(quizAnswers[question.id]));
}

function getQuizSummaryText() {
    if (quizScore === null) {
        return copy.quizNote;
    }

    return copy.quizResult
        .replace("{score}", String(quizScore))
        .replace("{total}", String(getQuizQuestions().length));
}

function syncQuizPill() {
    if (!UI.quizPill || !UI.quizPillText || !UI.quizPillIcon) {
        return;
    }

    UI.quizPill.classList.toggle("quiz-pill--done", isQuizCompleted);
    UI.quizPillIcon.textContent = isQuizCompleted ? "✓" : "⏱";
    UI.quizPillText.textContent = isQuizCompleted
        ? copy.quizComplete
        : isQuizVisible
            ? copy.quizActive
            : `${copy.quizTimer} ${formatQuizTime(quizTimeLeft)}`;
}

function syncQuizLayer() {
    if (!UI.quizLayer) {
        return;
    }

    UI.quizLayer.classList.toggle("quiz-layer--visible", isQuizVisible);
    UI.quizLayer.setAttribute("aria-hidden", String(!isQuizVisible));
    document.body.classList.toggle("quiz-open", isQuizVisible);
}

function handleQuizAnswerChange(questionId, optionId) {
    quizAnswers = {
        ...quizAnswers,
        [questionId]: optionId
    };
    renderQuiz();
}

function submitQuiz() {
    if (!hasAnsweredEveryQuizQuestion()) {
        return;
    }

    quizScore = getQuizQuestions().reduce((score, question) => {
        const selectedOption = question.options.find(
            (option) => option.id === quizAnswers[question.id]
        );

        return selectedOption?.isCorrect ? score + 1 : score;
    }, 0);
    renderQuiz();
}

function openQuiz() {
    isQuizVisible = true;
    setFocusedPart(-1);
    if (quizTimerId) {
        window.clearInterval(quizTimerId);
        quizTimerId = 0;
    }
    renderQuiz();
}

function closeQuiz() {
    isQuizVisible = false;
    isQuizCompleted = true;
    renderQuiz();
}

function handleQuizAction() {
    if (quizScore === null) {
        submitQuiz();
        return;
    }

    closeQuiz();
}

function renderQuiz() {
    if (
        !UI.quizList ||
        !UI.quizSummary ||
        !UI.quizActionBtn ||
        !UI.quizEyebrow ||
        !UI.quizIntro ||
        !UI.quizTitle
    ) {
        return;
    }

    UI.quizEyebrow.textContent = copy.quizEyebrow;
    UI.quizTitle.textContent = copy.quizTitle;
    UI.quizIntro.textContent = copy.quizIntro;
    UI.quizList.textContent = "";

    getQuizQuestions().forEach((question, index) => {
        const questionSection = document.createElement("section");
        questionSection.className = "quiz-question";

        const questionTitle = document.createElement("strong");
        questionTitle.textContent = `${index + 1}. ${question.prompt}`;
        questionSection.appendChild(questionTitle);

        const optionsWrap = document.createElement("div");
        optionsWrap.className = "quiz-options";

        question.options.forEach((option) => {
            const isSelected = quizAnswers[question.id] === option.id;
            const optionLabel = document.createElement("label");
            optionLabel.className = [
                "quiz-option",
                isSelected ? "quiz-option--selected" : "",
                quizScore !== null && option.isCorrect ? "quiz-option--correct" : "",
                quizScore !== null && isSelected && !option.isCorrect
                    ? "quiz-option--wrong"
                    : ""
            ]
                .filter(Boolean)
                .join(" ");

            const input = document.createElement("input");
            input.type = "radio";
            input.name = question.id;
            input.value = option.id;
            input.checked = isSelected;
            input.disabled = quizScore !== null;
            input.addEventListener("change", () => {
                handleQuizAnswerChange(question.id, option.id);
            });

            const optionText = document.createElement("span");
            optionText.textContent = option.label;

            optionLabel.appendChild(input);
            optionLabel.appendChild(optionText);
            optionsWrap.appendChild(optionLabel);
        });

        questionSection.appendChild(optionsWrap);
        UI.quizList.appendChild(questionSection);
    });

    UI.quizSummary.textContent = getQuizSummaryText();
    UI.quizSummary.classList.toggle("quiz-summary--scored", quizScore !== null);
    UI.quizActionBtn.textContent =
        quizScore === null ? copy.submitQuiz : copy.continueAr;
    UI.quizActionBtn.disabled =
        quizScore === null && !hasAnsweredEveryQuizQuestion();

    syncQuizPill();
    syncQuizLayer();
}

function startQuizCountdown() {
    if (quizTimerId) {
        window.clearInterval(quizTimerId);
        quizTimerId = 0;
    }

    syncQuizPill();

    quizTimerId = window.setInterval(() => {
        if (isQuizVisible || isQuizCompleted) {
            window.clearInterval(quizTimerId);
            quizTimerId = 0;
            return;
        }

        quizTimeLeft = Math.max(0, quizTimeLeft - 1);
        if (quizTimeLeft === 0) {
            openQuiz();
            return;
        }

        syncQuizPill();
    }, 1000);
}

function resetQuizState() {
    if (quizTimerId) {
        window.clearInterval(quizTimerId);
        quizTimerId = 0;
    }

    quizTimeLeft = QUIZ_DELAY_SECONDS;
    isQuizVisible = false;
    isQuizCompleted = false;
    quizScore = null;
    quizAnswers = {};
    renderQuiz();
    startQuizCountdown();
}

function applyTrackingSettings(config) {
    const runtimeTracking = config?.settings?.tracking ?? defaultConfig.settings.tracking;

    markerLostGraceFrames = Math.max(
        0,
        Number(runtimeTracking.markerLostGraceFrames ?? MARKER_LOST_GRACE_FRAMES)
    );
    trackingLerpAlpha = Math.min(
        1,
        Math.max(
            0.01,
            Number(runtimeTracking.trackingLerpAlpha ?? TRACKING_LERP_ALPHA)
        )
    );
    trackingScaleLerpAlpha = Math.min(
        1,
        Math.max(
            0.01,
            Number(
                runtimeTracking.trackingScaleLerpAlpha ??
                    TRACKING_SCALE_LERP_ALPHA
            )
        )
    );
    confirmFrames = Math.max(
        1,
        Number(runtimeTracking.confirmFrames ?? CONFIRM_FRAMES)
    );
    qrScanIntervalMs = Math.max(
        10,
        Number(runtimeTracking.qrScanIntervalMs ?? QR_SCAN_INTERVAL_MS)
    );
    qrSearchIntervalMs = Math.max(
        10,
        Number(runtimeTracking.qrSearchIntervalMs ?? QR_SEARCH_INTERVAL_MS)
    );
    positionDeadzone = Math.max(
        0,
        Number(runtimeTracking.positionDeadzone ?? 0)
    );
    scaleDeadzone = Math.max(0, Number(runtimeTracking.scaleDeadzone ?? 0));
    rotationDeadzoneRad = Math.max(
        0,
        Number(runtimeTracking.rotationDeadzoneRad ?? 0)
    );
    fastFollowDistance = Math.max(
        0,
        Number(runtimeTracking.fastFollowDistance ?? 0)
    );
    fastFollowAlpha = Math.min(
        1,
        Math.max(
            trackingLerpAlpha,
            Number(runtimeTracking.fastFollowAlpha ?? trackingLerpAlpha)
        )
    );
}

function getSelectedPart() {
    return focusedPartIndex >= 0 ? anatomyParts[focusedPartIndex] : null;
}

function loadSpeechVoices() {
    if (!("speechSynthesis" in window)) {
        availableSpeechVoices = [];
        return availableSpeechVoices;
    }

    availableSpeechVoices = window.speechSynthesis.getVoices() ?? [];
    return availableSpeechVoices;
}

function getPreferredSpeechLocales() {
    if (currentLanguage === "ar") {
        return ["ar-SA", "ar-EG", "ar"];
    }

    return ["en-US", "en-GB", "en"];
}

function hasNativeTtsSupport() {
    return Boolean(window.EduARTTS && typeof window.EduARTTS.speak === "function");
}

function canUseSpeechPlayback() {
    return hasNativeTtsSupport() || ("speechSynthesis" in window);
}

function stopSpeechPlayback() {
    if (hasNativeTtsSupport()) {
        try {
            window.EduARTTS.stop();
        } catch (error) {
            console.warn("Failed to stop native TTS.", error);
        }
    }

    if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
    }
}

function updateInfoCard() {
    if (!UI.cardTag || !UI.partName || !UI.partInfo || !UI.cardHint || !UI.listenBtn) {
        return;
    }

    const selectedPart = getSelectedPart();

    if (!selectedPart) {
        stopSpeechPlayback();
        UI.card.classList.remove("info-card--visible");
        UI.card.classList.remove("info-card--selected");
        UI.listenBtn.disabled = true;
        return;
    }

    UI.cardTag.textContent = copy.focusTag;
    UI.partName.textContent = selectedPart.title;
    UI.partInfo.textContent = selectedPart.info;
    UI.cardHint.textContent = selectedPart.hint;
    UI.listenBtn.disabled = !canUseSpeechPlayback();
    UI.card.classList.add("info-card--visible");
    UI.card.classList.add("info-card--selected");
}

function speakSelectedPartInfo() {
    const selectedPart = getSelectedPart();
    if (!selectedPart) {
        return;
    }

    const preferredLocales = getPreferredSpeechLocales();
    if (hasNativeTtsSupport()) {
        try {
            window.EduARTTS.speak(selectedPart.info, preferredLocales[0] ?? "en-US");
            return;
        } catch (error) {
            console.warn("Native TTS failed, falling back to Web Speech.", error);
        }
    }

    if (!("speechSynthesis" in window)) {
        return;
    }

    const synthesis = window.speechSynthesis;
    const voices = loadSpeechVoices();
    const utterance = new SpeechSynthesisUtterance(selectedPart.info);
    const matchingVoice = preferredLocales
        .map((locale) =>
            voices.find((voice) => voice.lang?.toLowerCase().startsWith(locale.toLowerCase()))
        )
        .find(Boolean)
        ?? voices.find((voice) => {
            const normalizedLang = voice.lang?.toLowerCase();
            if (!normalizedLang) {
                return false;
            }

            return preferredLocales.some((locale) => {
                const normalizedLocale = locale.toLowerCase();
                return normalizedLang.startsWith(normalizedLocale)
                    || normalizedLang.includes(normalizedLocale.split("-")[0]);
            });
        })
        ?? voices.find((voice) => voice.default)
        ?? voices[0];

    utterance.lang = preferredLocales[0] ?? "en-US";
    if (matchingVoice) {
        utterance.voice = matchingVoice;
    }
    utterance.rate = 1;
    synthesis.cancel();
    synthesis.speak(utterance);
    window.setTimeout(() => synthesis.resume(), 0);
}

function syncLabels() {
    const shouldShowLabels =
        labelsVisible && Boolean(arGroup?.visible) && (hasLiveMarkerDetection || hasTrackingPose);

    anatomyLabels.forEach((entry) => {
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

function updateLabelScale() {
    anatomyLabels.forEach((entry) => {
        entry.label.element.style.transform = "scale(1)";
    });
}

function positionInfoCard() {
    if (!UI.card) {
        return;
    }

    const selectedEntry =
        focusedPartIndex >= 0 ? anatomyLabels[focusedPartIndex] : null;

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
    focusedPartIndex = Math.max(-1, Math.min(anatomyParts.length - 1, index));
    updateInfoCard();
    syncLabels();
    positionInfoCard();
}

function applyCopy() {
    UI.appEyebrow.textContent = copy.appEyebrow;
    UI.appTitle.textContent = copy.appTitle;
    UI.rotateLabel.textContent = copy.rotate;
    UI.scaleLabel.textContent = copy.scale;
    UI.soundLabel.textContent = copy.sound;
    UI.labelsLabel.textContent = copy.labels;
    UI.listenBtn.textContent = currentLanguage === "ar" ? "استمع" : "Listen";
    if (UI.modelTitle) {
        UI.modelTitle.textContent = copy.modelTitle;
    }
    if (UI.overviewTitle) {
        UI.overviewTitle.textContent = copy.overviewTitle;
    }
    if (UI.overviewText) {
        UI.overviewText.textContent = copy.overviewText;
    }
    document.title = `EduAR - ${copy.appTitle}`;
    updateInfoCard();
    positionInfoCard();
    setStatus(copy.statusStarting);
    renderQuiz();
}

async function loadConfig() {
    if (isSessionStarting || activeStream) {
        return;
    }

    isSessionStarting = true;
    applyCopy();
    if (UI.quizActionBtn) {
        UI.quizActionBtn.onclick = handleQuizAction;
    }
    resetQuizState();
    let config = defaultConfig;

    try {
        const response = await fetch("./data.json");
        if (response.ok) {
            config = await response.json();
        }
    } catch (error) {
        config = defaultConfig;
    }

    applyTrackingSettings(config ?? defaultConfig);
    startModelPreload(config ?? defaultConfig);

    try {
        await startCamera(config);
    } finally {
        isSessionStarting = false;
    }
}

if ("speechSynthesis" in window) {
    loadSpeechVoices();
    window.speechSynthesis.onvoiceschanged = loadSpeechVoices;
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
                width: { ideal: CAMERA_IDEAL_WIDTH },
                height: { ideal: CAMERA_IDEAL_HEIGHT },
                frameRate: {
                    ideal: CAMERA_IDEAL_FRAME_RATE,
                    max: CAMERA_MAX_FRAME_RATE
                }
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
        document.body.classList.add("camera-ready");
        await initQrScanner();
        isArInitialized = true;
        initThree(config ?? defaultConfig);
        initTrackingProjection();
        setupControls();
        animationFrameId = window.requestAnimationFrame(processFrame);
    } catch (error) {
        setStatus(copy.statusCameraError);
    }
}

async function initQrScanner() {
    if (qrScannerReady) {
        return;
    }

    if (!window.ZXingWASM?.readBarcodes) {
        throw new Error("zxing-wasm reader was not loaded.");
    }

    scanContext =
        UI.canvasOutput?.getContext("2d", { willReadFrequently: true }) ??
        undefined;

    if (!scanContext) {
        throw new Error("A 2D scan context could not be created.");
    }

    await window.ZXingWASM.prepareZXingModule({ fireImmediately: true });
    qrScannerReady = true;
}

function initTrackingProjection() {
    focalLength = Math.max(UI.video.width, UI.video.height);

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

function initThree(config) {
    if (UI.video) {
        UI.video.style.display = "block";
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
        antialias: false,
        powerPreference: "high-performance"
    });
    renderer.setSize(UI.video.width, UI.video.height, false);
    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio || 1, MAX_RENDER_PIXEL_RATIO)
    );

    labelRenderer = new THREE.CSS2DRenderer();
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.domElement.style.position = "absolute";
    labelRenderer.domElement.style.top = "0";
    labelRenderer.domElement.style.left = "0";
    labelRenderer.domElement.style.pointerEvents = "none";
    labelRenderer.domElement.dir = "ltr";
    labelRenderer.domElement.style.direction = "ltr";
    labelRenderer.domElement.style.zIndex = "25";
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
    arGroup.matrixAutoUpdate = true;
    scene.add(arGroup);

    scene.add(new THREE.AmbientLight(0xffffff, 1.3));

    const keyLight = new THREE.PointLight(0xffffff, 0.95);
    keyLight.position.set(4, 5, 6);
    scene.add(keyLight);

    const accentLight = new THREE.PointLight(0x29d5ff, 0.9);
    accentLight.position.set(-4, 3, 4);
    scene.add(accentLight);

    arScale = config.settings?.arScale ?? defaultConfig.settings.arScale;
    heartSound = new Audio(config.assets?.audio ?? defaultConfig.assets.audio);
    heartSound.loop = true;

    setStatus(copy.statusLoading);
    mountHeartModel(config);
}

function mountHeartModel(config) {
    const modelConfig = config?.assets?.models?.heart ?? defaultConfig.assets.models.heart;
    const modelPosition = modelConfig.position ?? defaultConfig.assets.models.heart.position;
    const modelScale = modelConfig.scale ?? defaultConfig.assets.models.heart.scale;
    const modelRotation =
        modelConfig.rotation ?? defaultConfig.assets.models.heart.rotation;

    startModelPreload(config)
        .then((gltf) => {
            if (!arGroup || isModelMounted) {
                return;
            }

            heartModel = gltf.scene;

            if (heartModel.parent) {
                heartModel.parent.remove(heartModel);
            }

            heartModel.traverse((node) => {
                if (!node?.isMesh) {
                    return;
                }

                node.castShadow = false;
                node.receiveShadow = false;
            });

            heartModel.position.set(
                modelPosition.x ?? 0,
                modelPosition.y ?? 0,
                modelPosition.z ?? 0
            );
            heartModel.scale.set(
                modelScale.x ?? 0.8,
                modelScale.y ?? 0.8,
                modelScale.z ?? 0.8
            );
            baseHeartModelScale = heartModel.scale.x || 0.8;
            heartModel.rotation.set(
                modelRotation.x ?? DEFAULT_HEART_ROTATION.x,
                modelRotation.y ?? DEFAULT_HEART_ROTATION.y,
                modelRotation.z ?? DEFAULT_HEART_ROTATION.z
            );
            arGroup.add(heartModel);

            anatomyLabels = [];
            anatomyParts.forEach((part, index) => {
                addAnatomyLabel(part, index);
            });

            isModelMounted = true;
            setupInteraction();
            updateInfoCard();
            syncLabels();
            updateLabelScale();
            positionInfoCard();
            setStatus(hasLiveMarkerDetection ? copy.statusTracking : copy.statusReady);
        })
        .catch(() => {
            setStatus(copy.statusModelError);
        });
}

function addAnatomyLabel(part, index) {
    if (!heartModel) {
        return;
    }

    const labelAnchor = new THREE.Group();
    labelAnchor.position.set(part.position[0], part.position[1], part.position[2]);
    heartModel.add(labelAnchor);

    const button = document.createElement("button");
    button.className = "hotspot-label";
    button.dir = "ltr";
    button.style.direction = "ltr";
    button.type = "button";
    button.textContent = String(part.number);
    button.setAttribute("aria-label", part.label);
    button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        setFocusedPart(focusedPartIndex === index ? -1 : index);
    });

    const label = new THREE.CSS2DObject(button);
    label.position.set(0, 0, 0);
    labelAnchor.add(label);
    anatomyLabels.push({ id: part.id, index, label });
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
    UI.listenBtn.onclick = speakSelectedPartInfo;
    UI.labelToggle.onchange = (event) => {
        labelsVisible = event.target.checked;
        syncLabels();
        positionInfoCard();
    };

    syncModeButtons();
    syncSoundButton();
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
            updateLabelScale();
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

function getQrScanInterval() {
    return hasTrackingPose || detectionStreak > 0
        ? qrScanIntervalMs
        : qrSearchIntervalMs;
}

function getDetectedCorners(source) {
    if (!source) {
        return null;
    }

    if (Array.isArray(source) && source.length >= 4) {
        const corners = source
            .slice(0, 4)
            .map((point) => ({
                x: Number(point.x),
                y: Number(point.y)
            }))
            .filter((point) => Number.isFinite(point.x) && Number.isFinite(point.y));

        return corners.length === 4 ? corners : null;
    }

    const position = source.position ?? source;
    const orderedCorners = [
        position.topLeft,
        position.topRight,
        position.bottomRight,
        position.bottomLeft
    ];

    if (orderedCorners.some((point) => !point)) {
        return null;
    }

    const corners = orderedCorners
        .map((point) => ({
            x: Number(point.x),
            y: Number(point.y)
        }))
        .filter((point) => Number.isFinite(point.x) && Number.isFinite(point.y));

    return corners.length === 4 ? corners : null;
}

function getQrMetrics(corners) {
    if (!corners?.length) {
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
        }, 0) / 2
    );

    const center = corners.reduce(
        (accumulator, corner) => ({
            x: accumulator.x + corner.x / corners.length,
            y: accumulator.y + corner.y / corners.length
        }),
        { x: 0, y: 0 }
    );

    return {
        area,
        center,
        maxEdge: Math.max(...edgeLengths),
        minEdge: Math.min(...edgeLengths)
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
            metrics.center.y - lastDetectionCenter.y
        );
        detectionStreak = currentJump <= maxJump ? detectionStreak + 1 : 1;
    } else {
        detectionStreak = 1;
    }

    lastDetectionCenter = metrics.center;
    return detectionStreak >= confirmFrames;
}

function resetDetectionConfidence() {
    detectionStreak = 0;
    lastDetectionCenter = null;
}

function solveLinearSystem(matrix, vector) {
    const size = vector.length;
    const augmented = matrix.map((row, rowIndex) => [...row, vector[rowIndex]]);

    for (let pivotIndex = 0; pivotIndex < size; pivotIndex += 1) {
        let bestRowIndex = pivotIndex;
        let bestValue = Math.abs(augmented[pivotIndex][pivotIndex]);

        for (let rowIndex = pivotIndex + 1; rowIndex < size; rowIndex += 1) {
            const candidateValue = Math.abs(augmented[rowIndex][pivotIndex]);
            if (candidateValue > bestValue) {
                bestValue = candidateValue;
                bestRowIndex = rowIndex;
            }
        }

        if (bestValue < 1e-8) {
            return null;
        }

        if (bestRowIndex !== pivotIndex) {
            [augmented[pivotIndex], augmented[bestRowIndex]] = [
                augmented[bestRowIndex],
                augmented[pivotIndex]
            ];
        }

        const pivot = augmented[pivotIndex][pivotIndex];
        for (let columnIndex = pivotIndex; columnIndex <= size; columnIndex += 1) {
            augmented[pivotIndex][columnIndex] /= pivot;
        }

        for (let rowIndex = 0; rowIndex < size; rowIndex += 1) {
            if (rowIndex === pivotIndex) {
                continue;
            }

            const factor = augmented[rowIndex][pivotIndex];
            if (!factor) {
                continue;
            }

            for (
                let columnIndex = pivotIndex;
                columnIndex <= size;
                columnIndex += 1
            ) {
                augmented[rowIndex][columnIndex] -=
                    factor * augmented[pivotIndex][columnIndex];
            }
        }
    }

    return augmented.map((row) => row[size]);
}

function computeHomography(corners) {
    if (!corners || corners.length !== 4) {
        return null;
    }

    const sourceCorners = [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 1, y: 1 },
        { x: 0, y: 1 }
    ];

    const matrix = [];
    const vector = [];

    sourceCorners.forEach((sourcePoint, index) => {
        const targetPoint = corners[index];
        const { x, y } = sourcePoint;
        const u = targetPoint.x;
        const v = targetPoint.y;

        matrix.push([x, y, 1, 0, 0, 0, -u * x, -u * y]);
        vector.push(u);
        matrix.push([0, 0, 0, x, y, 1, -v * x, -v * y]);
        vector.push(v);
    });

    const solution = solveLinearSystem(matrix, vector);
    if (!solution) {
        return null;
    }

    return [
        [solution[0], solution[1], solution[2]],
        [solution[3], solution[4], solution[5]],
        [solution[6], solution[7], 1]
    ];
}

function vectorLength3(vector) {
    return Math.hypot(vector[0], vector[1], vector[2]);
}

function dot3(left, right) {
    return left[0] * right[0] + left[1] * right[1] + left[2] * right[2];
}

function scaleVector3(vector, scalar) {
    return [vector[0] * scalar, vector[1] * scalar, vector[2] * scalar];
}

function subtractVector3(left, right) {
    return [
        left[0] - right[0],
        left[1] - right[1],
        left[2] - right[2]
    ];
}

function cross3(left, right) {
    return [
        left[1] * right[2] - left[2] * right[1],
        left[2] * right[0] - left[0] * right[2],
        left[0] * right[1] - left[1] * right[0]
    ];
}

function normalizeVector3(vector) {
    const length = vectorLength3(vector);
    if (length < 1e-8) {
        return null;
    }

    return scaleVector3(vector, 1 / length);
}

function updateTrackedPoseFromCorners(corners) {
    const homography = computeHomography(corners);
    if (!homography || !focalLength) {
        return false;
    }

    const principalX = UI.video.width / 2;
    const principalY = UI.video.height / 2;

    const toCameraVector = (column) => [
        (column[0] - principalX * column[2]) / focalLength,
        (column[1] - principalY * column[2]) / focalLength,
        column[2]
    ];

    const column1 = [homography[0][0], homography[1][0], homography[2][0]];
    const column2 = [homography[0][1], homography[1][1], homography[2][1]];
    const column3 = [homography[0][2], homography[1][2], homography[2][2]];

    const basis1 = toCameraVector(column1);
    const basis2 = toCameraVector(column2);
    const translationVector = toCameraVector(column3);

    const averageBasisLength =
        (vectorLength3(basis1) + vectorLength3(basis2)) * 0.5;
    if (!averageBasisLength) {
        return false;
    }

    let rotation1 = normalizeVector3(scaleVector3(basis1, 1 / averageBasisLength));
    if (!rotation1) {
        return false;
    }

    const rawRotation2 = scaleVector3(basis2, 1 / averageBasisLength);
    const rotation2Projected = subtractVector3(
        rawRotation2,
        scaleVector3(rotation1, dot3(rawRotation2, rotation1))
    );
    let rotation2 = normalizeVector3(rotation2Projected);
    if (!rotation2) {
        return false;
    }

    let rotation3 = normalizeVector3(cross3(rotation1, rotation2));
    if (!rotation3) {
        return false;
    }

    let translation = scaleVector3(translationVector, 1 / averageBasisLength);
    if (translation[2] < 0) {
        rotation1 = scaleVector3(rotation1, -1);
        rotation2 = scaleVector3(rotation2, -1);
        translation = scaleVector3(translation, -1);
        rotation3 = normalizeVector3(cross3(rotation1, rotation2));
        if (!rotation3) {
            return false;
        }
    }

    trackedMatrix.set(
        rotation1[0] * arScale,
        rotation1[1] * arScale,
        rotation1[2] * arScale,
        translation[0],
        -rotation2[0] * arScale,
        -rotation2[1] * arScale,
        -rotation2[2] * arScale,
        -translation[1],
        -rotation3[0] * arScale,
        -rotation3[1] * arScale,
        -rotation3[2] * arScale,
        -translation[2],
        0,
        0,
        0,
        1
    );

    trackedMatrix.decompose(
        trackedPosition,
        trackedQuaternion,
        trackedScale
    );

    const uniformTrackedScale = Math.max(
        arScale * 0.84,
        Math.min(
            arScale * 1.16,
            (trackedScale.x + trackedScale.y + trackedScale.z) / 3
        )
    );
    trackedScale.setScalar(uniformTrackedScale);

    return Number.isFinite(trackedPosition.x) && Number.isFinite(trackedScale.x);
}

function applyTrackedPose(immediate = false) {
    if (!arGroup) {
        return;
    }

    if (immediate || !hasTrackingPose) {
        arGroup.position.copy(trackedPosition);
        arGroup.quaternion.copy(trackedQuaternion);
        arGroup.scale.copy(trackedScale);
        return;
    }

    const positionDistance = arGroup.position.distanceTo(trackedPosition);
    const rotationDistance = arGroup.quaternion.angleTo(trackedQuaternion);
    const scaleDistance = Math.abs(arGroup.scale.x - trackedScale.x);
    const followAlpha =
        fastFollowDistance > 0 && positionDistance > fastFollowDistance
            ? fastFollowAlpha
            : trackingLerpAlpha;

    if (positionDistance > positionDeadzone) {
        arGroup.position.lerp(trackedPosition, followAlpha);
    }

    if (rotationDistance > rotationDeadzoneRad) {
        arGroup.quaternion.slerp(trackedQuaternion, followAlpha);
    }

    if (scaleDistance > scaleDeadzone) {
        arGroup.scale.lerp(trackedScale, trackingScaleLerpAlpha);
    }
}

async function runQrDetection() {
    if (!qrScannerReady || qrScanInFlight || !scanContext) {
        return;
    }

    qrScanInFlight = true;
    let markerFound = false;
    let shouldHoldSteady = false;
    let liveMarkerDetected = false;
    try {
        scanContext.drawImage(
            UI.video,
            0,
            0,
            UI.canvasOutput.width,
            UI.canvasOutput.height
        );

        const frame = scanContext.getImageData(
            0,
            0,
            UI.canvasOutput.width,
            UI.canvasOutput.height
        );

        const results = await window.ZXingWASM.readBarcodes(frame, {
            formats: ["QRCode"],
            maxNumberOfSymbols: 1,
            tryDownscale: true,
            tryHarder: true,
            tryInvert: true,
            tryRotate: true
        });

        const detectedBarcode = results.find((result) => result?.position);

        if (detectedBarcode) {
            const corners = getDetectedCorners(detectedBarcode.position);
            const metrics = getQrMetrics(corners);
            const confirmedDetection = updateDetectionConfidence(metrics);
            shouldHoldSteady = Boolean(metrics);

            if (confirmedDetection && corners && updateTrackedPoseFromCorners(corners)) {
                applyTrackedPose(!hasTrackingPose);
                hasTrackingPose = true;
                arGroup.visible = true;
                markerFound = true;
                liveMarkerDetected = true;
                lostMarkerFrames = 0;
            }
        } else {
            resetDetectionConfidence();
        }

        if (!markerFound) {
            if (hasTrackingPose && lostMarkerFrames < markerLostGraceFrames) {
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
        lastScanResult = { markerFound, shouldHoldSteady };
    } catch (error) {
        console.error("Heart QR scan failed.", error);
    } finally {
        qrScanInFlight = false;
    }
}

function processFrame(timestamp) {
    if (!activeStream || !renderer || !labelRenderer) {
        return;
    }

    if (!lastQrScanTime || timestamp - lastQrScanTime >= getQrScanInterval()) {
        lastQrScanTime = timestamp;
        void runQrDetection();
    }

    const { markerFound, shouldHoldSteady } = lastScanResult;

    if (markerFound) {
        setStatus(copy.statusTracking);
    } else if (shouldHoldSteady && detectionStreak > 0) {
        setStatus(copy.statusHoldSteady);
    } else {
        setStatus(copy.statusSearching);
    }

    if (!arGroup?.visible && !hasLiveMarkerDetection && !hasTrackingPose && focusedPartIndex !== -1) {
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
    const scale = Math.max(
        window.innerWidth / UI.video.videoWidth,
        window.innerHeight / UI.video.videoHeight
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
    if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
        animationFrameId = 0;
    }

    if (quizTimerId) {
        window.clearInterval(quizTimerId);
        quizTimerId = 0;
    }

    if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
        activeStream = undefined;
    }

    if (UI.video.srcObject) {
        UI.video.pause();
        UI.video.srcObject = null;
    }
    document.body.classList.remove("camera-ready");

    if (heartSound) {
        heartSound.pause();
        heartSound.currentTime = 0;
    }

    stopSpeechPlayback();

    isSoundPlaying = false;
    isDragging = false;
    isArInitialized = false;
    focusedPartIndex = -1;
    lostMarkerFrames = 0;
    hasTrackingPose = false;
    hasLiveMarkerDetection = false;
    resetDetectionConfidence();
    lastQrScanTime = 0;
    lastScanResult = {
        markerFound: false,
        shouldHoldSteady: false
    };
    qrScannerReady = false;
    qrScanInFlight = false;
    scanContext = undefined;
    focalLength = 0;
    quizTimeLeft = QUIZ_DELAY_SECONDS;
    isQuizVisible = false;
    isQuizCompleted = false;
    quizScore = null;
    quizAnswers = {};
    positionDeadzone = 0;
    scaleDeadzone = 0;
    rotationDeadzoneRad = 0;
    fastFollowDistance = 0;
    fastFollowAlpha = TRACKING_LERP_ALPHA;
    preloadedModelPath = "";
    preloadedModelPromise = undefined;
    isModelMounted = false;

    if (renderer) {
        renderer.dispose();
    }

    if (labelRenderer?.domElement?.parentNode) {
        labelRenderer.domElement.parentNode.removeChild(labelRenderer.domElement);
    }

    document.body.classList.remove("quiz-open");
    anatomyLabels = [];
    baseHeartModelScale = 0.8;
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

