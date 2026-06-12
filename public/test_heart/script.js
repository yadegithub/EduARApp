const query = new URLSearchParams(window.location.search);
const currentTheme = query.get("theme") === "light" ? "light" : "dark";
const languageParam = query.get("lang");
const currentLanguage = languageParam === "ar" ? "ar" : languageParam === "fr" ? "fr" : "en";
const HEART_MODEL_PATH = "assets/human_heart.glb";
const DEFAULT_HEART_ROTATION = {
    x: 0,
    y: Math.PI,
    z: 0
};
const MARKER_LOST_GRACE_FRAMES = 20;
const TRACKING_LERP_ALPHA = 0.16;
const TRACKING_SCALE_LERP_ALPHA = 0.08;
const CONFIRM_FRAMES = 1;
const MIN_QR_AREA_RATIO = 0.004;
const MIN_QR_EDGE = 34;
const MAX_QR_EDGE_RATIO = 2.8;
const MAX_CENTER_JUMP_RATIO = 0.12;
const QR_SCAN_INTERVAL_MS = 80;
const QR_SEARCH_INTERVAL_MS = 120;
const QUIZ_DURATION_SECONDS = 60;
const MAX_RENDER_PIXEL_RATIO = 1;
const CAMERA_IDEAL_WIDTH = 960;
const CAMERA_IDEAL_HEIGHT = 540;
const CAMERA_IDEAL_FRAME_RATE = 24;
const CAMERA_MAX_FRAME_RATE = 30;
const SHOW_DEBUG_CAMERA_CANVAS = false;
const LABEL_SCALE_MIN = 0.9;
const LABEL_SCALE_MAX = 1.2;
const LABEL_SCALE_RESPONSE = 0.35;
const TRACKING_POSITION_DEADZONE = 0.012;
const TRACKING_SCALE_DEADZONE = 0.01;
const TRACKING_ROTATION_DEADZONE_RAD = 0.018;
const TRACKED_SCALE_MIN_RATIO = 0.92;
const TRACKED_SCALE_MAX_RATIO = 1.08;
const QR_CORNER_SMOOTHING_ALPHA = 0.28;

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
    listenBtn: document.getElementById("listen-btn"),
    modelTitle: document.getElementById("model-title-pill"),
    overviewTitle: document.getElementById("overview-title"),
    overviewText: document.getElementById("overview-text"),
    partInfo: document.getElementById("part-info"),
    partName: document.getElementById("part-name"),
    quizCloseBtn: document.getElementById("quiz-close"),
    quizFeedback: document.getElementById("quiz-feedback"),
    quizModal: document.getElementById("quiz-modal"),
    quizNextBtn: document.getElementById("quiz-next"),
    quizOptions: document.getElementById("quiz-options"),
    quizProgress: document.getElementById("quiz-progress"),
    quizQuestion: document.getElementById("quiz-question"),
    quizTimer: document.getElementById("quiz-timer"),
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

const heartPartCopyAr = {
    aorta: {
        label: "Ø§Ù„Ø´Ø±ÙŠØ§Ù† Ø§Ù„Ø£Ø¨Ù‡Ø±",
        title: "Ø§Ù„Ø´Ø±ÙŠØ§Ù† Ø§Ù„Ø£Ø¨Ù‡Ø±",
        info: "ÙŠÙ†Ù‚Ù„ Ø§Ù„Ø´Ø±ÙŠØ§Ù† Ø§Ù„Ø£Ø¨Ù‡Ø± Ø§Ù„Ø¯Ù… Ø§Ù„ØºÙ†ÙŠ Ø¨Ø§Ù„Ø£ÙƒØ³Ø¬ÙŠÙ† Ù…Ù† Ø§Ù„Ø¨Ø·ÙŠÙ† Ø§Ù„Ø£ÙŠØ³Ø± Ø¥Ù„Ù‰ Ø¨Ø§Ù‚ÙŠ Ø§Ù„Ø¬Ø³Ù….",
        hint: "Ù‡Ø°Ø§ Ù‡Ùˆ Ø§Ù„Ø´Ø±ÙŠØ§Ù† Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠ Ø§Ù„Ø®Ø§Ø±Ø¬ Ù…Ù† Ø§Ù„Ù‚Ù„Ø¨."
    },
    "pulmonary-artery": {
        label: "Ø§Ù„Ø´Ø±ÙŠØ§Ù† Ø§Ù„Ø±Ø¦ÙˆÙŠ",
        title: "Ø§Ù„Ø´Ø±ÙŠØ§Ù† Ø§Ù„Ø±Ø¦ÙˆÙŠ",
        info: "ÙŠÙ†Ù‚Ù„ Ø§Ù„Ø´Ø±ÙŠØ§Ù† Ø§Ù„Ø±Ø¦ÙˆÙŠ Ø§Ù„Ø¯Ù… Ø§Ù„ÙÙ‚ÙŠØ± Ø¨Ø§Ù„Ø£ÙƒØ³Ø¬ÙŠÙ† Ù…Ù† Ø§Ù„Ù‚Ù„Ø¨ Ø¥Ù„Ù‰ Ø§Ù„Ø±Ø¦ØªÙŠÙ†.",
        hint: "ÙŠØ¨Ø¯Ø£ Ù‡Ù†Ø§ Ù…Ø³Ø§Ø± Ø§Ù„Ø¯ÙˆØ±Ø© Ø§Ù„Ø¯Ù…ÙˆÙŠØ© Ø§Ù„Ø±Ø¦ÙˆÙŠØ©."
    },
    "left-atrium": {
        label: "Ø§Ù„Ø£Ø°ÙŠÙ† Ø§Ù„Ø£ÙŠØ³Ø±",
        title: "Ø§Ù„Ø£Ø°ÙŠÙ† Ø§Ù„Ø£ÙŠØ³Ø±",
        info: "ÙŠØ³ØªÙ‚Ø¨Ù„ Ø§Ù„Ø£Ø°ÙŠÙ† Ø§Ù„Ø£ÙŠØ³Ø± Ø§Ù„Ø¯Ù… Ø§Ù„ØºÙ†ÙŠ Ø¨Ø§Ù„Ø£ÙƒØ³Ø¬ÙŠÙ† Ø§Ù„Ø¹Ø§Ø¦Ø¯ Ù…Ù† Ø§Ù„Ø±Ø¦ØªÙŠÙ†.",
        hint: "ÙŠÙ…Ø±Ø± Ø§Ù„Ø¯Ù… Ø§Ù„Ù…Ø¤ÙƒØ³Ø¬ Ø¥Ù„Ù‰ Ø§Ù„Ø¨Ø·ÙŠÙ† Ø§Ù„Ø£ÙŠØ³Ø±."
    },
    "left-ventricle": {
        label: "Ø§Ù„Ø¨Ø·ÙŠÙ† Ø§Ù„Ø£ÙŠØ³Ø±",
        title: "Ø§Ù„Ø¨Ø·ÙŠÙ† Ø§Ù„Ø£ÙŠØ³Ø±",
        info: "ÙŠØ¶Ø® Ø§Ù„Ø¨Ø·ÙŠÙ† Ø§Ù„Ø£ÙŠØ³Ø± Ø§Ù„Ø¯Ù… Ø§Ù„ØºÙ†ÙŠ Ø¨Ø§Ù„Ø£ÙƒØ³Ø¬ÙŠÙ† Ø¥Ù„Ù‰ Ø®Ø§Ø±Ø¬ Ø§Ù„Ù‚Ù„Ø¨ Ø¹Ø¨Ø± Ø§Ù„Ø´Ø±ÙŠØ§Ù† Ø§Ù„Ø£Ø¨Ù‡Ø±.",
        hint: "Ù‡Ø°Ù‡ Ø§Ù„Ø­Ø¬Ø±Ø© Ù„Ù‡Ø§ Ø§Ù„Ø¬Ø¯Ø§Ø± Ø§Ù„Ø£ÙƒØ«Ø± Ø³Ù…Ø§ÙƒØ©."
    },
    "right-atrium": {
        label: "Ø§Ù„Ø£Ø°ÙŠÙ† Ø§Ù„Ø£ÙŠÙ…Ù†",
        title: "Ø§Ù„Ø£Ø°ÙŠÙ† Ø§Ù„Ø£ÙŠÙ…Ù†",
        info: "ÙŠØ³ØªÙ‚Ø¨Ù„ Ø§Ù„Ø£Ø°ÙŠÙ† Ø§Ù„Ø£ÙŠÙ…Ù† Ø§Ù„Ø¯Ù… Ø§Ù„ÙÙ‚ÙŠØ± Ø¨Ø§Ù„Ø£ÙƒØ³Ø¬ÙŠÙ† Ø§Ù„Ø¹Ø§Ø¦Ø¯ Ù…Ù† Ø§Ù„Ø¬Ø³Ù….",
        hint: "ÙŠØ±Ø³Ù„ Ø§Ù„Ø¯Ù… Ø¥Ù„Ù‰ Ø§Ù„Ø£Ø³ÙÙ„ Ù†Ø­Ùˆ Ø§Ù„Ø¨Ø·ÙŠÙ† Ø§Ù„Ø£ÙŠÙ…Ù†."
    },
    "right-ventricle": {
        label: "Ø§Ù„Ø¨Ø·ÙŠÙ† Ø§Ù„Ø£ÙŠÙ…Ù†",
        title: "Ø§Ù„Ø¨Ø·ÙŠÙ† Ø§Ù„Ø£ÙŠÙ…Ù†",
        info: "ÙŠØ¶Ø® Ø§Ù„Ø¨Ø·ÙŠÙ† Ø§Ù„Ø£ÙŠÙ…Ù† Ø§Ù„Ø¯Ù… Ø§Ù„ÙÙ‚ÙŠØ± Ø¨Ø§Ù„Ø£ÙƒØ³Ø¬ÙŠÙ† Ù†Ø­Ùˆ Ø§Ù„Ø±Ø¦ØªÙŠÙ†.",
        hint: "ÙŠØ¨Ø¯Ø£ Ø±Ø­Ù„Ø© Ø§Ù„Ø¯Ù… Ù†Ø­Ùˆ Ø§Ù„Ø±Ø¦ØªÙŠÙ† Ù„Ù„Ø­ØµÙˆÙ„ Ø¹Ù„Ù‰ Ø§Ù„Ø£ÙƒØ³Ø¬ÙŠÙ†."
    }
};

const heartPartCopyFr = {
    aorta: {
        label: "Aorte",
        title: "AORTE",
        info: "L'aorte transporte le sang riche en oxygene du ventricule gauche vers le reste du corps.",
        hint: "C'est l'artere principale qui sort du coeur."
    },
    "pulmonary-artery": {
        label: "Artere pulmonaire",
        title: "ARTERE PULMONAIRE",
        info: "L'artere pulmonaire transporte le sang pauvre en oxygene du coeur vers les poumons.",
        hint: "Elle lance la circulation pulmonaire."
    },
    "left-atrium": {
        label: "Oreillette gauche",
        title: "OREILLETTE GAUCHE",
        info: "L'oreillette gauche recoit le sang riche en oxygene qui revient des poumons.",
        hint: "Elle envoie le sang frais vers le ventricule gauche."
    },
    "left-ventricle": {
        label: "Ventricule gauche",
        title: "VENTRICULE GAUCHE",
        info: "Le ventricule gauche propulse le sang riche en oxygene vers l'aorte.",
        hint: "Cette cavite a la paroi la plus epaisse."
    },
    "right-atrium": {
        label: "Oreillette droite",
        title: "OREILLETTE DROITE",
        info: "L'oreillette droite recoit le sang pauvre en oxygene qui revient du corps.",
        hint: "Elle envoie le sang vers le ventricule droit."
    },
    "right-ventricle": {
        label: "Ventricule droit",
        title: "VENTRICULE DROIT",
        info: "Le ventricule droit envoie le sang pauvre en oxygene vers les poumons.",
        hint: "Il commence le trajet vers les poumons."
    }
};

const localizedHeartPartCopy =
    currentLanguage === "ar"
        ? heartPartCopyAr
        : currentLanguage === "fr"
          ? heartPartCopyFr
          : null;

if (localizedHeartPartCopy) {
    anatomyParts.forEach((part) => {
        const localizedPart = localizedHeartPartCopy[part.id];
        if (!localizedPart) {
            return;
        }

        part.label = localizedPart.label;
        part.title = localizedPart.title;
        part.info = localizedPart.info;
        part.hint = localizedPart.hint;
    });
}

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
    overviewTitle: "Human Heart",
    overviewText: "An interactive anatomy model that shows the chambers, vessels and blood flow pathways.",
    overview: {
        tag: "Open-heart view",
        title: "OPEN HEART",
        info: "Tap a numbered marker to read the definition of each structure inside the heart.",
        hint: "Rotate the model until the cutaway side faces you, or use Scale to zoom closer."
    }
};

const copyAr = {
    appEyebrow: "Ù…Ø³Ø­ Ù…Ø¨Ø§Ø´Ø±",
    appTitle: "Ù‚Ù„Ø¨ Ø§Ù„Ø¥Ù†Ø³Ø§Ù†",
    rotate: "ØªØ¯ÙˆÙŠØ±",
    scale: "ØªØ­Ø¬ÙŠÙ…",
    sound: "ØµÙˆØª",
    labels: "Ø§Ù„Ø£Ø±Ù‚Ø§Ù… ØªØ´ØºÙŠÙ„/Ø¥ÙŠÙ‚Ø§Ù",
    statusStarting: "Ø¬Ø§Ø± ØªØ´ØºÙŠÙ„ Ø§Ù„ÙƒØ§Ù…ÙŠØ±Ø§...",
    statusLoading: "Ø¬Ø§Ø± ØªØ­Ù…ÙŠÙ„ Ù†Ù…ÙˆØ°Ø¬ Ø§Ù„Ù‚Ù„Ø¨...",
    statusReady: "Ø§Ù„ÙƒØ§Ù…ÙŠØ±Ø§ Ø¬Ø§Ù‡Ø²Ø©",
    statusTracking: "ØªÙ… ÙˆØ¶Ø¹ Ø§Ù„Ù‚Ù„Ø¨",
    statusHoldSteady: "Ø«Ø¨Ù‘Øª Ø§Ù„Ø¬Ù‡Ø§Ø² Ø£Ø«Ù†Ø§Ø¡ Ø§Ù„ØªÙ‚Ø§Ø· Ø±Ù…Ø² QR...",
    statusSearching: "Ø¬Ø§Ø± Ø§Ù„Ø¨Ø­Ø« Ø¹Ù† Ø±Ù…Ø² QR...",
    statusCameraError: "ØªÙ… Ø±ÙØ¶ Ø§Ù„ÙˆØµÙˆÙ„ Ø¥Ù„Ù‰ Ø§Ù„ÙƒØ§Ù…ÙŠØ±Ø§.",
    statusModelError: "ØªØ¹Ø°Ø± ØªØ­Ù…ÙŠÙ„ Ù†Ù…ÙˆØ°Ø¬ Ø§Ù„Ù‚Ù„Ø¨.",
    focusTag: "Ø§Ù„Ø¬Ø²Ø¡ Ø§Ù„Ù…Ø­Ø¯Ø¯",
    modelTitle: "Ø§Ù„Ø¬Ù‡Ø§Ø² Ø§Ù„Ù‚Ù„Ø¨ÙŠ Ø§Ù„ÙˆØ¹Ø§Ø¦ÙŠ",
    overviewTitle: "Ù‚Ù„Ø¨ Ø§Ù„Ø¥Ù†Ø³Ø§Ù†",
    overviewText: "Ù†Ù…ÙˆØ°Ø¬ ØªØ´Ø±ÙŠØ­ÙŠ ØªÙØ§Ø¹Ù„ÙŠ ÙŠÙˆØ¶Ø­ Ø­Ø¬Ø±Ø§Øª Ø§Ù„Ù‚Ù„Ø¨ ÙˆØ§Ù„Ø£ÙˆØ¹ÙŠØ© ÙˆÙ…Ø³Ø§Ø±Ø§Øª ØªØ¯ÙÙ‚ Ø§Ù„Ø¯Ù….",
    overview: {
        tag: "Ø¹Ø±Ø¶ Ø§Ù„Ù‚Ù„Ø¨ Ø§Ù„Ù…ÙØªÙˆØ­",
        title: "Ø§Ù„Ù‚Ù„Ø¨ Ø§Ù„Ù…ÙØªÙˆØ­",
        info: "Ø§Ø¶ØºØ· Ø¹Ù„Ù‰ Ø¹Ù„Ø§Ù…Ø© Ù…Ø±Ù‚Ù…Ø© Ù„Ù‚Ø±Ø§Ø¡Ø© ØªØ¹Ø±ÙŠÙ ÙƒÙ„ Ø¨Ù†ÙŠØ© Ø¯Ø§Ø®Ù„ Ø§Ù„Ù‚Ù„Ø¨.",
        hint: "Ø¯ÙˆÙ‘Ø± Ø§Ù„Ù†Ù…ÙˆØ°Ø¬ Ø­ØªÙ‰ ØªØ¸Ù‡Ø± Ø¬Ù‡Ø© Ø§Ù„Ù…Ù‚Ø·Ø¹ØŒ Ø£Ùˆ Ø§Ø³ØªØ®Ø¯Ù… Ø§Ù„ØªØ­Ø¬ÙŠÙ… Ù„Ù„Ø§Ù‚ØªØ±Ø§Ø¨ Ø£ÙƒØ«Ø±."
    }
};

const copyFr = {
    appEyebrow: "Scan EduAR en direct",
    appTitle: "COEUR HUMAIN",
    rotate: "Rotation",
    scale: "Echelle",
    sound: "Audio",
    labels: "Numeros On/Off",
    statusStarting: "Demarrage de la camera...",
    statusLoading: "Chargement du modele du coeur...",
    statusReady: "Camera prete",
    statusTracking: "Coeur place",
    statusHoldSteady: "Gardez le QR stable pendant le verrouillage...",
    statusSearching: "Recherche du QR code...",
    statusCameraError: "L'acces a la camera a ete refuse.",
    statusModelError: "Le modele du coeur n'a pas pu etre charge.",
    focusTag: "Partie selectionnee",
    modelTitle: "SYSTEME CARDIOVASCULAIRE",
    overviewTitle: "Coeur humain",
    overviewText: "Un modele anatomique interactif qui montre les cavites, les vaisseaux et la circulation du sang.",
    overview: {
        tag: "Vue interne du coeur",
        title: "COEUR OUVERT",
        info: "Touchez un numero pour lire la definition de chaque structure du coeur.",
        hint: "Tournez le modele jusqu'a voir la coupe ou utilisez Echelle pour zoomer."
    }
};

const copy =
    currentLanguage === "ar" ? copyAr : currentLanguage === "fr" ? copyFr : copyEn;

const quizCopyEn = {
    timerPrefix: "Quiz in",
    timerReady: "Quiz ready",
    title: "Heart quiz",
    progress: "Question",
    of: "of",
    next: "Next",
    finish: "Finish",
    closeLabel: "Close quiz",
    correct: "Correct.",
    incorrect: "Not quite. The correct answer is",
    questions: [
        {
            question: "Which vessel carries oxygen-rich blood from the heart to the body?",
            options: ["Aorta", "Pulmonary artery", "Right atrium"],
            answer: 0
        },
        {
            question: "Which chamber pumps oxygen-rich blood out through the aorta?",
            options: ["Left ventricle", "Right ventricle", "Left atrium"],
            answer: 0
        },
        {
            question: "Where does the pulmonary artery send blood?",
            options: ["To the lungs", "To the stomach", "To the brain"],
            answer: 0
        }
    ]
};

const quizCopyAr = {
    timerPrefix: "الاختبار بعد",
    timerReady: "الاختبار جاهز",
    title: "اختبار القلب",
    progress: "السؤال",
    of: "من",
    next: "التالي",
    finish: "إنهاء",
    closeLabel: "إغلاق الاختبار",
    correct: "إجابة صحيحة.",
    incorrect: "ليست صحيحة. الإجابة الصحيحة هي",
    questions: [
        {
            question: "أي وعاء ينقل الدم الغني بالأكسجين من القلب إلى الجسم؟",
            options: ["الشريان الأبهر", "الشريان الرئوي", "الأذين الأيمن"],
            answer: 0
        },
        {
            question: "أي حجرة تضخ الدم الغني بالأكسجين عبر الشريان الأبهر؟",
            options: ["البطين الأيسر", "البطين الأيمن", "الأذين الأيسر"],
            answer: 0
        },
        {
            question: "إلى أين يرسل الشريان الرئوي الدم؟",
            options: ["إلى الرئتين", "إلى المعدة", "إلى الدماغ"],
            answer: 0
        }
    ]
};

const quizCopyFr = {
    timerPrefix: "Quiz dans",
    timerReady: "Quiz pret",
    title: "Quiz du coeur",
    progress: "Question",
    of: "sur",
    next: "Suivant",
    finish: "Terminer",
    closeLabel: "Fermer le quiz",
    correct: "Correct.",
    incorrect: "Pas tout a fait. La bonne reponse est",
    questions: [
        {
            question: "Quel vaisseau transporte le sang riche en oxygene du coeur vers le corps ?",
            options: ["Aorte", "Artere pulmonaire", "Oreillette droite"],
            answer: 0
        },
        {
            question: "Quelle cavite propulse le sang riche en oxygene dans l'aorte ?",
            options: ["Ventricule gauche", "Ventricule droit", "Oreillette gauche"],
            answer: 0
        },
        {
            question: "Ou l'artere pulmonaire envoie-t-elle le sang ?",
            options: ["Vers les poumons", "Vers l'estomac", "Vers le cerveau"],
            answer: 0
        }
    ]
};

const quizCopy =
    currentLanguage === "ar"
        ? quizCopyAr
        : currentLanguage === "fr"
          ? quizCopyFr
          : quizCopyEn;

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
let smoothedQrCorners = null;
let quizCountdownIntervalId = 0;
let quizDeadline = 0;
let quizControlsReady = false;
let quizHasOpened = false;
let activeQuizQuestionIndex = 0;
let quizAnswered = false;

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
                scale: { x: 0.72, y: 0.72, z: 0.72 },
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
            trackingScaleLerpAlpha: TRACKING_SCALE_LERP_ALPHA,
            confirmFrames: CONFIRM_FRAMES,
            qrScanIntervalMs: QR_SCAN_INTERVAL_MS,
            qrSearchIntervalMs: QR_SEARCH_INTERVAL_MS,
            positionDeadzone: TRACKING_POSITION_DEADZONE,
            scaleDeadzone: TRACKING_SCALE_DEADZONE,
            rotationDeadzoneRad: TRACKING_ROTATION_DEADZONE_RAD,
            fastFollowDistance: 0,
            fastFollowAlpha: TRACKING_LERP_ALPHA
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

function formatQuizTime(totalSeconds) {
    const safeSeconds = Math.max(0, Math.ceil(totalSeconds));
    const minutes = Math.floor(safeSeconds / 60);
    const seconds = String(safeSeconds % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
}

function updateQuizTimerText(remainingSeconds = QUIZ_DURATION_SECONDS) {
    if (!UI.quizTimer) {
        return;
    }

    UI.quizTimer.textContent =
        remainingSeconds > 0
            ? `${quizCopy.timerPrefix} ${formatQuizTime(remainingSeconds)}`
            : quizCopy.timerReady;
}

function renderQuizQuestion() {
    if (
        !UI.quizTitle ||
        !UI.quizQuestion ||
        !UI.quizOptions ||
        !UI.quizFeedback ||
        !UI.quizProgress ||
        !UI.quizNextBtn
    ) {
        return;
    }

    const question = quizCopy.questions[activeQuizQuestionIndex];
    if (!question) {
        return;
    }

    quizAnswered = false;
    UI.quizTitle.textContent = quizCopy.title;
    UI.quizQuestion.textContent = question.question;
    UI.quizProgress.textContent = `${quizCopy.progress} ${
        activeQuizQuestionIndex + 1
    } ${quizCopy.of} ${quizCopy.questions.length}`;
    UI.quizFeedback.textContent = "";
    UI.quizNextBtn.textContent =
        activeQuizQuestionIndex === quizCopy.questions.length - 1
            ? quizCopy.finish
            : quizCopy.next;
    UI.quizNextBtn.disabled = true;

    UI.quizOptions.replaceChildren();
    question.options.forEach((option, index) => {
        const button = document.createElement("button");
        button.className = "quiz-option";
        button.type = "button";
        button.textContent = option;
        button.addEventListener("click", () => handleQuizAnswer(index));
        UI.quizOptions.appendChild(button);
    });
}

function handleQuizAnswer(selectedIndex) {
    if (quizAnswered) {
        return;
    }

    const question = quizCopy.questions[activeQuizQuestionIndex];
    if (!question || !UI.quizOptions || !UI.quizFeedback || !UI.quizNextBtn) {
        return;
    }

    quizAnswered = true;
    const buttons = Array.from(UI.quizOptions.querySelectorAll(".quiz-option"));
    buttons.forEach((button, index) => {
        button.disabled = true;
        if (index === question.answer) {
            button.classList.add("quiz-option--correct");
        } else if (index === selectedIndex) {
            button.classList.add("quiz-option--wrong");
        }
    });

    UI.quizFeedback.textContent =
        selectedIndex === question.answer
            ? quizCopy.correct
            : `${quizCopy.incorrect} ${question.options[question.answer]}.`;
    UI.quizNextBtn.disabled = false;
}

function openQuizModal() {
    if (!UI.quizModal) {
        return;
    }

    quizHasOpened = true;
    activeQuizQuestionIndex = 0;
    updateQuizTimerText(0);
    renderQuizQuestion();
    UI.quizModal.hidden = false;
}

function closeQuizModal() {
    if (!UI.quizModal) {
        return;
    }

    UI.quizModal.hidden = true;
}

function handleQuizNext() {
    if (!quizAnswered) {
        return;
    }

    if (activeQuizQuestionIndex >= quizCopy.questions.length - 1) {
        closeQuizModal();
        return;
    }

    activeQuizQuestionIndex += 1;
    renderQuizQuestion();
}

function setupQuizControls() {
    if (quizControlsReady) {
        updateQuizTimerText();
        return;
    }

    if (UI.quizCloseBtn) {
        UI.quizCloseBtn.setAttribute("aria-label", quizCopy.closeLabel);
        UI.quizCloseBtn.addEventListener("click", closeQuizModal);
    }

    if (UI.quizNextBtn) {
        UI.quizNextBtn.addEventListener("click", handleQuizNext);
    }

    renderQuizQuestion();
    updateQuizTimerText();
    quizControlsReady = true;
}

function startQuizCountdown() {
    setupQuizControls();

    if (!UI.quizTimer || quizCountdownIntervalId || quizHasOpened) {
        return;
    }

    quizDeadline = Date.now() + QUIZ_DURATION_SECONDS * 1000;
    updateQuizTimerText(QUIZ_DURATION_SECONDS);
    quizCountdownIntervalId = window.setInterval(() => {
        const remainingSeconds = Math.max(
            0,
            Math.ceil((quizDeadline - Date.now()) / 1000)
        );
        updateQuizTimerText(remainingSeconds);

        if (remainingSeconds > 0) {
            return;
        }

        window.clearInterval(quizCountdownIntervalId);
        quizCountdownIntervalId = 0;
        openQuizModal();
    }, 250);
}

function stopQuizCountdown() {
    if (!quizCountdownIntervalId) {
        return;
    }

    window.clearInterval(quizCountdownIntervalId);
    quizCountdownIntervalId = 0;
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

    if (currentLanguage === "fr") {
        return ["fr-FR", "fr-CA", "fr"];
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
    if (!UI.cardTag || !UI.partName || !UI.partInfo || !UI.cardHint) {
        return;
    }

    const selectedPart = getSelectedPart();

    if (!selectedPart) {
        stopSpeechPlayback();
        UI.card.classList.remove("info-card--visible");
        UI.card.classList.remove("info-card--selected");
        if (UI.listenBtn) {
            UI.listenBtn.disabled = true;
        }
        return;
    }

    UI.cardTag.textContent = copy.focusTag;
    UI.partName.textContent = selectedPart.title;
    UI.partInfo.textContent = selectedPart.info;
    UI.cardHint.textContent = selectedPart.hint;
    if (UI.listenBtn) {
        UI.listenBtn.disabled = !canUseSpeechPlayback();
    }
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
    if (UI.listenBtn) {
        UI.listenBtn.textContent =
            currentLanguage === "ar"
                ? "استمع"
                : currentLanguage === "fr"
                  ? "Ecouter"
                  : "Listen";
    }
    setupQuizControls();
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
            heartModel.updateMatrixWorld(true);
            const heartBounds = new THREE.Box3().setFromObject(heartModel);
            const heartCenter = heartBounds.getCenter(new THREE.Vector3());
            heartModel.position.set(
                (modelPosition.x ?? 0) - heartCenter.x,
                (modelPosition.y ?? 0) - heartCenter.y,
                (modelPosition.z ?? 0) - heartCenter.z
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
    if (UI.listenBtn) {
        UI.listenBtn.onclick = speakSelectedPartInfo;
    }
    UI.labelToggle.onchange = (event) => {
        labelsVisible = event.target.checked;
        syncLabels();
        positionInfoCard();
    };

    syncModeButtons();
    syncSoundButton();
    syncLabels();
    startQuizCountdown();
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

function smoothQrCorners(corners) {
    if (!Array.isArray(corners) || corners.length !== 4) {
        return null;
    }

    if (
        !smoothedQrCorners ||
        !hasTrackingPose ||
        lostMarkerFrames > 0 ||
        !hasLiveMarkerDetection
    ) {
        smoothedQrCorners = corners.map((point) => ({
            x: point.x,
            y: point.y
        }));
        return smoothedQrCorners;
    }

    smoothedQrCorners = corners.map((point, index) => {
        const previousPoint = smoothedQrCorners[index] ?? point;
        return {
            x:
                previousPoint.x +
                (point.x - previousPoint.x) * QR_CORNER_SMOOTHING_ALPHA,
            y:
                previousPoint.y +
                (point.y - previousPoint.y) * QR_CORNER_SMOOTHING_ALPHA
        };
    });

    return smoothedQrCorners;
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
        { x: -0.5, y: -0.5 },
        { x: 0.5, y: -0.5 },
        { x: 0.5, y: 0.5 },
        { x: -0.5, y: 0.5 }
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
        arScale * TRACKED_SCALE_MIN_RATIO,
        Math.min(
            arScale * TRACKED_SCALE_MAX_RATIO,
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
            tryHarder: !hasTrackingPose,
            tryInvert: !hasTrackingPose,
            tryRotate: !hasTrackingPose
        });

        const detectedBarcode = results.find((result) => result?.position);

        if (detectedBarcode) {
            const corners = getDetectedCorners(detectedBarcode.position);
            const metrics = getQrMetrics(corners);
            const confirmedDetection = updateDetectionConfidence(metrics);
            shouldHoldSteady = Boolean(metrics);

            if (confirmedDetection && corners) {
                const stableCorners = smoothQrCorners(corners);
                const isReacquiring =
                    !hasTrackingPose || lostMarkerFrames > 0 || !hasLiveMarkerDetection;

                if (stableCorners && updateTrackedPoseFromCorners(stableCorners)) {
                    applyTrackedPose(isReacquiring);
                    hasTrackingPose = true;
                    arGroup.visible = true;
                    markerFound = true;
                    liveMarkerDetected = true;
                    lostMarkerFrames = 0;
                }
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
                hasLiveMarkerDetection = false;
                lostMarkerFrames = 0;
                smoothedQrCorners = null;
                resetDetectionConfidence();
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
    stopQuizCountdown();
    closeQuizModal();

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
    smoothedQrCorners = null;
    qrScannerReady = false;
    qrScanInFlight = false;
    scanContext = undefined;
    focalLength = 0;
    positionDeadzone = 0;
    scaleDeadzone = 0;
    rotationDeadzoneRad = 0;
    fastFollowDistance = 0;
    fastFollowAlpha = TRACKING_LERP_ALPHA;
    preloadedModelPath = "";
    preloadedModelPromise = undefined;
    isModelMounted = false;
    quizDeadline = 0;
    quizHasOpened = false;
    activeQuizQuestionIndex = 0;
    quizAnswered = false;
    updateQuizTimerText();

    if (renderer) {
        renderer.dispose();
    }

    if (labelRenderer?.domElement?.parentNode) {
        labelRenderer.domElement.parentNode.removeChild(labelRenderer.domElement);
    }

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
