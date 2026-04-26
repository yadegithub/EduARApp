const query = new URLSearchParams(window.location.search);
const currentTheme = query.get("theme") === "light" ? "light" : "dark";
const currentLanguage = query.get("lang") === "ar" ? "ar" : "en";

document.documentElement.dataset.theme = currentTheme;
document.documentElement.lang = currentLanguage;
document.documentElement.dir = currentLanguage === "ar" ? "rtl" : "ltr";

const MODEL_PATH = "assets/solar_system.glb";
const DEFAULT_ROTATION = { x: 0, y: 0, z: 0 };
const LOST_GRACE_FRAMES = 1;
const TRACK_ALPHA = 0.58;
const CONFIRM_FRAMES = 1;
const MIN_QR_AREA_RATIO = 0.012;
const MIN_QR_EDGE = 70;
const MAX_QR_EDGE_RATIO = 2.3;
const MAX_CENTER_JUMP_RATIO = 0.12;
const GLTF_EXTENSION_PATTERN = /\.(gltf|glb)$/i;
const DIRECT_LABEL_LIFT_SCALE = 0.72;
const DIRECT_ORBIT_TUBE_RADIUS = 0.012;
const DIRECT_ORBIT_OPACITY = 0.46;
const DIRECT_ORBIT_COLOR = 0xffc46d;
const SOLAR_PANEL_SIZE = 0.94;
const SOLAR_PANEL_DEPTH = 0.018;
const SOLAR_CENTER = { x: -0.18, y: -0.04, z: 0.042 };
const ORBIT_VERTICAL_SCALE = 0.52;
const ASTEROID_BELT_INNER_RADIUS = 0.275;
const ASTEROID_BELT_OUTER_RADIUS = 0.33;
const STARFIELD_DEPTH = -0.001;
const PLANET_FLOAT_DEPTH = 0.01;
const VIDEO_PLANE_FILL = 0.98;
const DIRECT_BACKDROP_SIZE = 2.2;
const DIRECT_BACKDROP_OFFSET_Z = -0.55;
const DECORATION_KEYWORDS = [
  "orbit",
  "orbits",
  "orbita",
  "path",
  "curve",
  "spline",
  "trail",
  "trajectory",
  "guide",
  "helper",
  "wire",
  "line",
  "ellipse",
];

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
  sideMenu: document.getElementById("side-menu"),
  status: document.getElementById("status"),
  video: document.getElementById("videoInput"),
};

const solarBodies = [
  {
    id: "sun",
    label: "Sun",
    title: "SUN",
    info: "The Sun is the star at the center of the solar system and provides light and heat to every planet.",
    hint: "It holds most of the solar system's mass.",
    aliases: ["sun", "sol", "plsun"],
    orbit: { radius: 0, size: 0.108, speed: 0, spinSpeed: 0.12, phase: 0, labelLift: 0.165 },
  },
  {
    id: "mercury",
    label: "Mercury",
    title: "MERCURY",
    info: "Mercury is the smallest planet and the closest one to the Sun.",
    hint: "It moves around the Sun very quickly.",
    aliases: ["mercury", "mercurio"],
    orbit: { radius: 0.084, size: 0.012, speed: 1.55, spinSpeed: 0.85, phase: 0.34, labelLift: 0.045 },
  },
  {
    id: "venus",
    label: "Venus",
    title: "VENUS",
    info: "Venus is similar in size to Earth but has a thick atmosphere that traps heat.",
    hint: "It is often the brightest planet in the sky.",
    aliases: ["venus"],
    orbit: { radius: 0.128, size: 0.018, speed: 1.12, spinSpeed: 0.62, phase: 1.52, labelLift: 0.05 },
  },
  {
    id: "earth",
    label: "Earth",
    title: "EARTH",
    info: "Earth is our home planet and the only known world with abundant liquid water on its surface.",
    hint: "It completes one orbit around the Sun every year.",
    aliases: ["earth", "tierra"],
    orbit: { radius: 0.176, size: 0.02, speed: 0.88, spinSpeed: 0.94, phase: 2.42, labelLift: 0.056 },
  },
  {
    id: "mars",
    label: "Mars",
    title: "MARS",
    info: "Mars is called the red planet because iron-rich dust gives its surface a reddish color.",
    hint: "Scientists study Mars for signs of past water.",
    aliases: ["mars", "marte"],
    orbit: { radius: 0.234, size: 0.016, speed: 0.72, spinSpeed: 0.78, phase: 0.92, labelLift: 0.052 },
  },
  {
    id: "jupiter",
    label: "Jupiter",
    title: "JUPITER",
    info: "Jupiter is the largest planet in the solar system and is famous for its Great Red Spot storm.",
    hint: "It is a gas giant with many moons.",
    aliases: ["jupiter"],
    orbit: { radius: 0.348, size: 0.044, speed: 0.38, spinSpeed: 0.68, phase: 1.16, labelLift: 0.088 },
  },
  {
    id: "saturn",
    label: "Saturn",
    title: "SATURN",
    info: "Saturn is a gas giant surrounded by wide bright rings made of ice and rock.",
    hint: "Its ring system is the most recognizable in the solar system.",
    aliases: ["saturn", "saturno"],
    orbit: {
      radius: 0.448,
      size: 0.038,
      speed: 0.28,
      spinSpeed: 0.6,
      phase: 2.66,
      labelLift: 0.084,
      ringInner: 0.056,
      ringOuter: 0.084,
      ringTilt: { x: 1.14, y: 0.18, z: 0.22 },
    },
  },
  {
    id: "uranus",
    label: "Uranus",
    title: "URANUS",
    info: "Uranus is an ice giant that rotates at a very strong tilt.",
    hint: "It almost looks like it rolls around the Sun.",
    aliases: ["uranus"],
    orbit: { radius: 0.544, size: 0.028, speed: 0.2, spinSpeed: 0.42, phase: 0.52, labelLift: 0.07 },
  },
  {
    id: "neptune",
    label: "Neptune",
    title: "NEPTUNE",
    info: "Neptune is the farthest major planet from the Sun and is known for powerful winds.",
    hint: "It is a deep-blue ice giant.",
    aliases: ["neptune", "neptuno"],
    orbit: { radius: 0.632, size: 0.027, speed: 0.16, spinSpeed: 0.4, phase: 1.92, labelLift: 0.068 },
  },
].map((body, index) => ({
  ...body,
  number: index + 1,
  layout: {
    position: [body.orbit.radius, 0, 0],
    size: Math.max(body.orbit.size * 3.2, 0.08),
    labelLift: body.orbit.labelLift,
  },
}));

const BODY_FALLBACK_COLORS = {
  sun: 0xffb347,
  mercury: 0xb8a89d,
  venus: 0xe3c98f,
  earth: 0x4e8dff,
  mars: 0xc96b45,
  jupiter: 0xd8b08b,
  saturn: 0xd9c27d,
  uranus: 0x79d7df,
  neptune: 0x537dff,
};

const DIRECT_PLANET_SCALE_FACTORS = {
  sun: 1.14,
  mercury: 1.38,
  venus: 1.34,
  earth: 1.34,
  mars: 1.36,
  jupiter: 1.24,
  saturn: 1.22,
  uranus: 1.3,
  neptune: 1.3,
};

const copy = {
  appEyebrow: "AR Learn live scan",
  appTitle: "SOLAR SYSTEM",
  rotate: "Rotate",
  scale: "Scale",
  labels: "Numbers On/Off",
  statusStarting: "Starting camera...",
  statusLoading: "Loading solar model...",
  statusReady: "Camera ready",
  statusTracking: "Solar system locked",
  statusSearching: "Point the camera at the QR code",
  statusHoldSteady: "Hold the QR steady for a moment...",
  statusCameraError: "Camera access was denied.",
  statusModelError: "The solar model could not be loaded.",
  focusTag: "Selected body",
};

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
let modelHolder;
let sourceSolarModel;
let animationMixer;
let solarSceneRoot;
let solarPanelRoot;
let solarOrbitEntries = [];
let solarSpinEntries = [];
let solarPulseEntries = [];
let solarAsteroidBelt;
let solarStarField;
let solarElapsedTime = 0;
let solarVideoElement;
let solarVideoTexture;
let solarVideoMesh;
let solarVideoResumeHandler;
let activeStream;
let labels = [];
let currentMode = null;
let labelsVisible = true;
let isVideoExperience = false;
let isDragging = false;
let prevPos = { x: 0, y: 0 };
let arScale = 2.75;
let animationFrameId = 0;
let openCvCheckTimerId = 0;
let isArInitialized = false;
let isSessionStarting = false;
let focusedPartIndex = -1;
let lostMarkerFrames = 0;
let hasTrackingPose = false;
let detectionStreak = 0;
let lastDetectionCenter = null;
let previousFrameTime = 0;

const trackedMatrix = new THREE.Matrix4();
const trackedPosition = new THREE.Vector3();
const trackedQuaternion = new THREE.Quaternion();
const trackedScale = new THREE.Vector3();

const defaultConfig = {
  assets: {
    models: {
      solar: {
        path: MODEL_PATH,
        renderMode: "direct",
        targetSize: 1.75,
        enhanceDirectModel: false,
        animationClipName: "solar system",
        animationTimeScale: 1,
        showBackdrop: true,
        showStarField: true,
        backdropSize: DIRECT_BACKDROP_SIZE,
        backdropOffsetZ: DIRECT_BACKDROP_OFFSET_Z,
        panelSize: SOLAR_PANEL_SIZE,
        videoPath: "assets/solar-system.mp4",
        videoFillScale: VIDEO_PLANE_FILL,
        videoStartTime: 0.8,
        showBackdrop: false,
        position: { x: 0.5, y: 0.5, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
      },
    },
  },
  settings: {
    arScale: 1.75,
  },
};

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
  if (isVideoExperience) {
    UI.card?.classList.remove("info-card--visible");
    UI.card?.classList.remove("info-card--selected");
    return;
  }

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
  labels.forEach((entry) => {
    const isActive = entry.index === focusedPartIndex;
    entry.label.element.style.opacity = labelsVisible ? "1" : "0";
    entry.label.element.classList.toggle("hotspot-label--active", isActive);
    entry.label.element.setAttribute("aria-pressed", String(isActive));
  });
}

function positionInfoCard() {
  if (isVideoExperience) {
    return;
  }

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

function applyViewerMode(renderMode) {
  isVideoExperience = renderMode === "video";

  if (UI.sideMenu) {
    UI.sideMenu.style.display = isVideoExperience ? "none" : "";
  }

  if (UI.card) {
    UI.card.style.display = isVideoExperience ? "none" : "";
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

const normalizeText = (value) =>
  (value ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "");

function scoreCandidate(candidate, alias) {
  if (candidate === alias) return 100;
  if (candidate.endsWith(alias)) return 82;
  if (candidate.startsWith(alias)) return 72;
  if (candidate.includes(alias)) return 56;
  return 0;
}

function getObjectTerms(object3D) {
  const terms = [];
  if (object3D.name) {
    terms.push(object3D.name);
  }
  const materials = Array.isArray(object3D.material)
    ? object3D.material
    : object3D.material
      ? [object3D.material]
      : [];
  materials.forEach((material) => {
    if (material?.name) {
      terms.push(material.name);
    }
  });
  return terms.map(normalizeText).filter(Boolean);
}

function matchesAliases(object3D, aliases) {
  const normalizedAliases = aliases.map(normalizeText);
  const terms = getObjectTerms(object3D);
  return terms.some((term) =>
    normalizedAliases.some((alias) => scoreCandidate(term, alias) > 0),
  );
}

function findNode(root, aliases) {
  let bestMatch = null;
  root.traverse((object3D) => {
    const terms = getObjectTerms(object3D);
    if (!terms.length) {
      return;
    }
    let bestScore = 0;
    aliases.forEach((alias) => {
      const normalizedAlias = normalizeText(alias);
      terms.forEach((term) => {
        bestScore = Math.max(bestScore, scoreCandidate(term, normalizedAlias));
      });
    });
    if (bestScore && (!bestMatch || bestScore > bestMatch.score)) {
      bestMatch = { object: object3D, score: bestScore };
    }
  });
  return bestMatch?.object ?? null;
}

function findRenderableNode(root, aliases) {
  let bestMatch = null;
  root.traverse((object3D) => {
    if (!object3D?.geometry) {
      return;
    }
    const terms = getObjectTerms(object3D);
    if (!terms.length) {
      return;
    }
    let bestScore = 0;
    aliases.forEach((alias) => {
      const normalizedAlias = normalizeText(alias);
      terms.forEach((term) => {
        bestScore = Math.max(bestScore, scoreCandidate(term, normalizedAlias));
      });
    });
    if (bestScore && (!bestMatch || bestScore > bestMatch.score)) {
      bestMatch = { object: object3D, score: bestScore };
    }
  });
  return bestMatch?.object ?? null;
}

function getObjectLocalCenter(root, object3D) {
  root.updateMatrixWorld(true);
  object3D.updateMatrixWorld(true);
  const bounds = new THREE.Box3().setFromObject(object3D);
  return root.worldToLocal(bounds.getCenter(new THREE.Vector3()));
}

function shouldHideDecorativeObject(object3D) {
  if (!object3D || object3D === sourceSolarModel) {
    return false;
  }
  if (object3D.isLine || object3D.isLineSegments || object3D.isPoints) {
    return true;
  }
  const normalizedName = normalizeText(object3D.name);
  if (!normalizedName) {
    return false;
  }
  const looksDecorative = DECORATION_KEYWORDS.some((keyword) =>
    normalizedName.includes(keyword),
  );
  return (
    looksDecorative &&
    !solarBodies.some((body) => matchesAliases(object3D, body.aliases))
  );
}

function getRenderableBounds(root) {
  root.updateMatrixWorld(true);
  const bounds = new THREE.Box3();
  let hasBounds = false;
  root.traverse((object3D) => {
    if (
      !object3D.visible ||
      (!object3D.isMesh && !object3D.isSkinnedMesh) ||
      !object3D.geometry
    ) {
      return;
    }
    const objectBounds = new THREE.Box3().setFromObject(object3D);
    if (objectBounds.isEmpty()) {
      return;
    }
    if (!hasBounds) {
      bounds.copy(objectBounds);
      hasBounds = true;
    } else {
      bounds.union(objectBounds);
    }
  });
  if (!hasBounds) {
    bounds.setFromObject(root);
  }
  return bounds;
}

function centerObjectAtOrigin(root) {
  root.updateMatrixWorld(true);
  const bounds = getRenderableBounds(root);
  const center = bounds.getCenter(new THREE.Vector3());
  root.position.sub(center);
  root.updateMatrixWorld(true);
}

function scaleObjectToSize(root, targetSize) {
  root.updateMatrixWorld(true);
  const bounds = getRenderableBounds(root);
  const size = bounds.getSize(new THREE.Vector3());
  const maxDimension = Math.max(size.x, size.y, size.z) || 1;
  root.scale.multiplyScalar(targetSize / maxDimension);
  root.updateMatrixWorld(true);
}

function getNamedNodeBounds(root) {
  const bounds = new THREE.Box3();
  let hasBounds = false;
  const points = [];
  const baseNode = findNode(root, ["base"]);

  if (baseNode) {
    points.push(baseNode.getWorldPosition(new THREE.Vector3()));
    if (baseNode.children?.[0]) {
      points.push(baseNode.children[0].getWorldPosition(new THREE.Vector3()));
    }
  }

  solarBodies.forEach((body) => {
    const sourceNode = findNode(root, body.aliases);
    if (!sourceNode) {
      return;
    }

    points.push(sourceNode.getWorldPosition(new THREE.Vector3()));
    if (sourceNode.children?.[0]) {
      points.push(sourceNode.children[0].getWorldPosition(new THREE.Vector3()));
    }
  });

  points.forEach((point) => {
    if (!hasBounds) {
      bounds.min.copy(point);
      bounds.max.copy(point);
      hasBounds = true;
      return;
    }

    bounds.expandByPoint(point);
  });

  return hasBounds ? bounds : null;
}

function normalizeNamedNodeModel(root, targetSize) {
  root.updateMatrixWorld(true);
  const bounds = getNamedNodeBounds(root);

  if (!bounds) {
    normalizeModel(root, targetSize);
    return;
  }

  const size = bounds.getSize(new THREE.Vector3());
  const maxDimension = Math.max(size.x, size.y, size.z) || 1;
  root.scale.multiplyScalar(targetSize / maxDimension);
  root.updateMatrixWorld(true);

  const centeredBounds = getNamedNodeBounds(root);
  if (!centeredBounds) {
    return;
  }

  const center = centeredBounds.getCenter(new THREE.Vector3());
  root.position.sub(center);
  root.updateMatrixWorld(true);
}

function cloneWithUniqueMaterials(source) {
  const clone = source.clone(true);
  clone.traverse((object3D) => {
    if (!object3D.material) {
      return;
    }
    if (Array.isArray(object3D.material)) {
      object3D.material = object3D.material.map((material) =>
        material?.clone ? material.clone() : material,
      );
    } else if (object3D.material.clone) {
      object3D.material = object3D.material.clone();
    }
  });
  return clone;
}

function tunePlanetAppearance(root, bodyId) {
  const fallbackColor = BODY_FALLBACK_COLORS[bodyId] ?? 0xd8dde8;
  root.traverse((object3D) => {
    if (!object3D.material) {
      return;
    }
    const materials = Array.isArray(object3D.material)
      ? object3D.material
      : [object3D.material];
    materials.forEach((material) => {
      material.transparent = true;
      material.opacity = 1;
      material.depthWrite = true;
      const hasLoadedMap = Boolean(material.map?.image);
      if (!hasLoadedMap && "color" in material) {
        material.color = new THREE.Color(fallbackColor);
      }
      if ("emissive" in material) {
        material.emissive = new THREE.Color(bodyId === "sun" ? 0xff9838 : 0x101318);
        material.emissiveIntensity = bodyId === "sun" ? 0.75 : 0.08;
      }
      if ("roughness" in material) {
        material.roughness = bodyId === "sun" ? 0.95 : 0.82;
      }
      if ("metalness" in material) {
        material.metalness = 0.02;
      }
      if ("shininess" in material) {
        material.shininess = bodyId === "sun" ? 38 : 18;
      }
      if ("specular" in material) {
        material.specular = new THREE.Color(0x2b3440);
      }
      if (bodyId === "sun" && "emissive" in material) {
        material.emissive = new THREE.Color(0xffa642);
        material.emissiveIntensity = 0.65;
      }
      material.needsUpdate = true;
    });
  });
}

function addBodyLabel(body, index, labelAnchor) {
  const button = document.createElement("button");
  button.className = "hotspot-label";
  button.type = "button";
  button.textContent = String(body.number);
  button.setAttribute("aria-label", body.label);
  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    setFocusedPart(focusedPartIndex === index ? -1 : index);
  });
  const label = new THREE.CSS2DObject(button);
  labelAnchor.add(label);
  labels.push({ id: body.id, index, label });
}

function applySunOrangeAppearance(root) {
  root.traverse((object3D) => {
    if (!object3D.material) {
      return;
    }

    const materials = Array.isArray(object3D.material)
      ? object3D.material
      : [object3D.material];

    materials.forEach((material) => {
      material.transparent = true;
      material.opacity = 1;
      material.depthWrite = true;

      if ("color" in material) {
        material.color = new THREE.Color(0xff932f);
      }

      if ("emissive" in material) {
        material.emissive = new THREE.Color(0xff8a1f);
        material.emissiveIntensity = 0.72;
      }

      if ("roughness" in material) {
        material.roughness = 0.88;
      }

      if ("metalness" in material) {
        material.metalness = 0.01;
      }

      if ("shininess" in material) {
        material.shininess = 44;
      }

      material.needsUpdate = true;
    });
  });
}

function scaleDirectPlanetNodes(root) {
  solarBodies.forEach((body) => {
    const sourceNode = findNode(root, body.aliases);
    if (!sourceNode) {
      return;
    }

    sourceNode.scale.multiplyScalar(DIRECT_PLANET_SCALE_FACTORS[body.id] ?? 1.22);
    if (body.id === "sun") {
      applySunOrangeAppearance(sourceNode);
      return;
    }

    tunePlanetAppearance(sourceNode, body.id);
  });
  root.updateMatrixWorld(true);
}

function createDirectOrbitMesh(center, radius, bodyIndex) {
  const segments = 96;
  const points = [];
  for (let index = 0; index <= segments; index += 1) {
    const angle = (index / segments) * Math.PI * 2;
    points.push(
      new THREE.Vector3(
        center.x + Math.cos(angle) * radius,
        center.y,
        center.z + Math.sin(angle) * radius,
      ),
    );
  }

  const curve = new THREE.CatmullRomCurve3(points, true);
  const mesh = new THREE.Mesh(
    new THREE.TubeGeometry(curve, 180, DIRECT_ORBIT_TUBE_RADIUS, 12, true),
    new THREE.MeshBasicMaterial({
      color: DIRECT_ORBIT_COLOR,
      transparent: true,
      opacity: Math.max(0.22, DIRECT_ORBIT_OPACITY - bodyIndex * 0.028),
      depthWrite: false,
    }),
  );
  mesh.renderOrder = -1;
  return mesh;
}

function addDirectOrbitOverlays(root) {
  const sunNode = findNode(root, solarBodies[0].aliases);
  if (!sunNode) {
    return;
  }

  root.updateMatrixWorld(true);
  const sunPosition = root.worldToLocal(sunNode.getWorldPosition(new THREE.Vector3()));
  const orbitGroup = new THREE.Group();
  orbitGroup.name = "direct-orbit-overlays";

  solarBodies.slice(1).forEach((body, index) => {
    const sourceNode = findNode(root, body.aliases);
    if (!sourceNode) {
      return;
    }

    const planetPosition = root.worldToLocal(
      sourceNode.getWorldPosition(new THREE.Vector3()),
    );
    const radius = Math.hypot(
      planetPosition.x - sunPosition.x,
      planetPosition.z - sunPosition.z,
    );

    if (radius < 0.05) {
      return;
    }

    orbitGroup.add(createDirectOrbitMesh(sunPosition, radius, index));
  });

  root.add(orbitGroup);
  root.updateMatrixWorld(true);
}

function createSeededRandom(seed) {
  let state = seed >>> 0 || 1;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

function getStringSeed(value) {
  return Array.from(value).reduce(
    (seed, character) => (seed * 31 + character.charCodeAt(0)) >>> 0,
    7,
  );
}

function createCanvasTexture(width, height, painter) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  painter(context, width, height);
  const texture = new THREE.CanvasTexture(canvas);
  texture.encoding = THREE.sRGBEncoding;
  texture.needsUpdate = true;
  return texture;
}

function createGlowTexture(innerColor, outerColor) {
  return createCanvasTexture(256, 256, (context, width, height) => {
    const gradient = context.createRadialGradient(
      width / 2,
      height / 2,
      width * 0.04,
      width / 2,
      height / 2,
      width * 0.48,
    );
    gradient.addColorStop(0, innerColor);
    gradient.addColorStop(0.38, outerColor);
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);
  });
}

function paintHorizontalBands(context, width, height, palette, random, options = {}) {
  const {
    minBand = height * 0.04,
    maxBand = height * 0.16,
    opacity = 0.82,
    blur = 0,
  } = options;
  let y = 0;
  context.save();
  context.filter = blur ? `blur(${blur}px)` : "none";
  while (y < height) {
    const bandHeight = minBand + random() * (maxBand - minBand);
    context.globalAlpha = opacity * (0.72 + random() * 0.28);
    context.fillStyle = palette[Math.floor(random() * palette.length)];
    context.fillRect(0, y, width, bandHeight);
    y += bandHeight * (0.72 + random() * 0.5);
  }
  context.restore();
  context.globalAlpha = 1;
}

function paintSoftSpots(context, width, height, colors, random, count, radiusRange) {
  for (let index = 0; index < count; index += 1) {
    const radius =
      radiusRange[0] + random() * (radiusRange[1] - radiusRange[0]);
    const x = random() * width;
    const y = random() * height;
    const gradient = context.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, colors[Math.floor(random() * colors.length)]);
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    context.globalAlpha = 0.16 + random() * 0.32;
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
  }
  context.globalAlpha = 1;
}

function createPlanetTexture(bodyId) {
  return createCanvasTexture(512, 256, (context, width, height) => {
    const random = createSeededRandom(getStringSeed(bodyId));
    context.fillStyle = "#0b0f18";
    context.fillRect(0, 0, width, height);

    switch (bodyId) {
      case "sun": {
        const gradient = context.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, "#fff3ad");
        gradient.addColorStop(0.28, "#ffc24d");
        gradient.addColorStop(0.65, "#ff7e25");
        gradient.addColorStop(1, "#a13b0c");
        context.fillStyle = gradient;
        context.fillRect(0, 0, width, height);
        paintHorizontalBands(
          context,
          width,
          height,
          ["#ffd35f", "#ff9a2c", "#f46416", "#fff1a6"],
          random,
          { minBand: 12, maxBand: 42, opacity: 0.42, blur: 2 },
        );
        paintSoftSpots(
          context,
          width,
          height,
          ["rgba(255,255,255,0.8)", "rgba(255,205,116,0.85)", "rgba(255,130,54,0.8)"],
          random,
          24,
          [18, 60],
        );
        break;
      }
      case "mercury": {
        context.fillStyle = "#a79a90";
        context.fillRect(0, 0, width, height);
        paintSoftSpots(
          context,
          width,
          height,
          ["rgba(92,86,82,0.55)", "rgba(209,198,187,0.45)"],
          random,
          52,
          [8, 32],
        );
        break;
      }
      case "venus": {
        const gradient = context.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, "#f5dfaa");
        gradient.addColorStop(0.55, "#d7b97c");
        gradient.addColorStop(1, "#ac8652");
        context.fillStyle = gradient;
        context.fillRect(0, 0, width, height);
        paintHorizontalBands(
          context,
          width,
          height,
          ["#f7ecc8", "#dcc692", "#c7a46d", "#fff7de"],
          random,
          { minBand: 16, maxBand: 50, opacity: 0.44, blur: 6 },
        );
        break;
      }
      case "earth": {
        context.fillStyle = "#2d6bf5";
        context.fillRect(0, 0, width, height);
        for (let index = 0; index < 16; index += 1) {
          context.fillStyle =
            index % 2 === 0 ? "rgba(47, 167, 90, 0.92)" : "rgba(105, 211, 122, 0.8)";
          context.beginPath();
          context.ellipse(
            random() * width,
            random() * height,
            24 + random() * 60,
            10 + random() * 28,
            random() * Math.PI,
            0,
            Math.PI * 2,
          );
          context.fill();
        }
        paintHorizontalBands(
          context,
          width,
          height,
          ["rgba(255,255,255,0.55)", "rgba(215,238,255,0.36)"],
          random,
          { minBand: 8, maxBand: 24, opacity: 0.38, blur: 5 },
        );
        break;
      }
      case "mars": {
        const gradient = context.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, "#d78c56");
        gradient.addColorStop(0.45, "#bb673c");
        gradient.addColorStop(1, "#7c301a");
        context.fillStyle = gradient;
        context.fillRect(0, 0, width, height);
        paintSoftSpots(
          context,
          width,
          height,
          ["rgba(110,39,19,0.48)", "rgba(241,169,120,0.3)"],
          random,
          22,
          [10, 34],
        );
        break;
      }
      case "jupiter": {
        const gradient = context.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, "#edd9b9");
        gradient.addColorStop(0.45, "#d0ac87");
        gradient.addColorStop(1, "#8f5f42");
        context.fillStyle = gradient;
        context.fillRect(0, 0, width, height);
        paintHorizontalBands(
          context,
          width,
          height,
          ["#f8ebd5", "#c89f79", "#a86849", "#f1d5b7", "#d28f63"],
          random,
          { minBand: 12, maxBand: 34, opacity: 0.66, blur: 3 },
        );
        context.fillStyle = "rgba(181, 81, 51, 0.72)";
        context.beginPath();
        context.ellipse(width * 0.66, height * 0.6, 34, 18, -0.22, 0, Math.PI * 2);
        context.fill();
        break;
      }
      case "saturn": {
        const gradient = context.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, "#f2e2a8");
        gradient.addColorStop(0.5, "#cfbd82");
        gradient.addColorStop(1, "#8e7346");
        context.fillStyle = gradient;
        context.fillRect(0, 0, width, height);
        paintHorizontalBands(
          context,
          width,
          height,
          ["#f7efcf", "#d7bf8a", "#b28c61", "#a0764d"],
          random,
          { minBand: 10, maxBand: 28, opacity: 0.5, blur: 2 },
        );
        break;
      }
      case "uranus": {
        const gradient = context.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, "#baf3f5");
        gradient.addColorStop(0.6, "#82d9e6");
        gradient.addColorStop(1, "#4ba7b7");
        context.fillStyle = gradient;
        context.fillRect(0, 0, width, height);
        paintHorizontalBands(
          context,
          width,
          height,
          ["rgba(255,255,255,0.35)", "rgba(116,220,230,0.22)"],
          random,
          { minBand: 8, maxBand: 24, opacity: 0.22, blur: 2 },
        );
        break;
      }
      case "neptune": {
        const gradient = context.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, "#75a1ff");
        gradient.addColorStop(0.55, "#3767db");
        gradient.addColorStop(1, "#18328d");
        context.fillStyle = gradient;
        context.fillRect(0, 0, width, height);
        paintHorizontalBands(
          context,
          width,
          height,
          ["rgba(255,255,255,0.34)", "rgba(88,139,255,0.22)"],
          random,
          { minBand: 8, maxBand: 24, opacity: 0.24, blur: 3 },
        );
        break;
      }
      default:
        context.fillStyle = "#d8dde8";
        context.fillRect(0, 0, width, height);
    }
  });
}

function createBackdropTexture() {
  return createCanvasTexture(1024, 1024, (context, width, height) => {
    context.fillStyle = "#010205";
    context.fillRect(0, 0, width, height);

    const solarGlow = context.createRadialGradient(
      width * 0.44,
      height * 0.5,
      width * 0.04,
      width * 0.44,
      height * 0.5,
      width * 0.22,
    );
    solarGlow.addColorStop(0, "rgba(255, 176, 79, 0.16)");
    solarGlow.addColorStop(0.32, "rgba(255, 120, 38, 0.07)");
    solarGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
    context.fillStyle = solarGlow;
    context.fillRect(0, 0, width, height);

    const rimVignette = context.createRadialGradient(
      width * 0.5,
      height * 0.5,
      width * 0.28,
      width * 0.5,
      height * 0.5,
      width * 0.66,
    );
    rimVignette.addColorStop(0, "rgba(0, 0, 0, 0)");
    rimVignette.addColorStop(1, "rgba(0, 0, 0, 0.72)");
    context.fillStyle = rimVignette;
    context.fillRect(0, 0, width, height);

    const coldGlow = context.createRadialGradient(
      width * 0.78,
      height * 0.26,
      width * 0.02,
      width * 0.78,
      height * 0.26,
      width * 0.22,
    );
    coldGlow.addColorStop(0, "rgba(90, 112, 255, 0.08)");
    coldGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
    context.fillStyle = coldGlow;
    context.fillRect(0, 0, width, height);

    const random = createSeededRandom(101);
    for (let index = 0; index < 260; index += 1) {
      const x = random() * width;
      const y = random() * height;
      const radius = 0.6 + random() * 2.8;
      const alpha = 0.2 + random() * 0.56;
      context.fillStyle =
        random() > 0.9
          ? `rgba(255, 214, 126, ${alpha})`
          : `rgba(255, 255, 255, ${alpha})`;
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fill();
    }
  });
}

function createSolarBackdrop(panelSize, options = {}) {
  const {
    showBorder = true,
    opacity = 0.98,
  } = options;
  const panel = new THREE.Group();
  const background = new THREE.Mesh(
    new THREE.PlaneGeometry(panelSize, panelSize),
    new THREE.MeshBasicMaterial({
      map: createBackdropTexture(),
      transparent: true,
      opacity,
      side: THREE.DoubleSide,
    }),
  );
  background.position.z = -SOLAR_PANEL_DEPTH;
  panel.add(background);

  if (showBorder) {
    const border = new THREE.LineLoop(
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-panelSize / 2, -panelSize / 2, -SOLAR_PANEL_DEPTH + 0.0005),
        new THREE.Vector3(panelSize / 2, -panelSize / 2, -SOLAR_PANEL_DEPTH + 0.0005),
        new THREE.Vector3(panelSize / 2, panelSize / 2, -SOLAR_PANEL_DEPTH + 0.0005),
        new THREE.Vector3(-panelSize / 2, panelSize / 2, -SOLAR_PANEL_DEPTH + 0.0005),
      ]),
      new THREE.LineBasicMaterial({
        color: 0x2f416b,
        transparent: true,
        opacity: 0.42,
      }),
    );
    panel.add(border);
  }

  return panel;
}

function getVideoPlaneSize(panelSize, aspectRatio) {
  const maxWidth = panelSize * 0.92;
  const maxHeight = panelSize * 0.92;
  let width = maxWidth;
  let height = width / Math.max(aspectRatio, 0.1);

  if (height > maxHeight) {
    height = maxHeight;
    width = height * Math.max(aspectRatio, 0.1);
  }

  return { width, height };
}

function updateVideoPlaneGeometry(panelSize) {
  if (!solarVideoMesh || !solarVideoElement?.videoWidth || !solarVideoElement?.videoHeight) {
    return;
  }

  const { width, height } = getVideoPlaneSize(
    panelSize,
    solarVideoElement.videoWidth / solarVideoElement.videoHeight,
  );

  solarVideoMesh.geometry.dispose();
  solarVideoMesh.geometry = new THREE.PlaneGeometry(width, height);
}

function buildVideoSolarScene(modelConfig) {
  const panelSize = modelConfig.panelSize ?? SOLAR_PANEL_SIZE;
  const videoPath = modelConfig.videoPath ?? defaultConfig.assets.models.solar.videoPath;
  const videoFillScale =
    modelConfig.videoFillScale ?? defaultConfig.assets.models.solar.videoFillScale;
  const videoStartTime =
    modelConfig.videoStartTime ?? defaultConfig.assets.models.solar.videoStartTime ?? 0;
  const showBackdrop =
    modelConfig.showBackdrop ?? defaultConfig.assets.models.solar.showBackdrop ?? false;

  if (showBackdrop) {
    solarPanelRoot = createSolarBackdrop(panelSize);
    modelHolder.add(solarPanelRoot);
  }

  if (!videoPath) {
    buildSyntheticSolarScene(modelConfig);
    return Promise.resolve(false);
  }

  return new Promise((resolve) => {
    solarVideoElement = document.createElement("video");
    solarVideoElement.src = videoPath;
    solarVideoElement.loop = true;
    solarVideoElement.muted = true;
    solarVideoElement.autoplay = true;
    solarVideoElement.playsInline = true;
    solarVideoElement.preload = "auto";
    solarVideoElement.setAttribute("playsinline", "true");
    solarVideoElement.setAttribute("webkit-playsinline", "true");
    solarVideoElement.style.display = "none";
    document.body.appendChild(solarVideoElement);

    const cleanupListeners = () => {
      solarVideoElement?.removeEventListener("loadeddata", handleLoadedData);
      solarVideoElement?.removeEventListener("error", handleError);
    };

    const handleLoadedData = async () => {
      cleanupListeners();
      solarVideoTexture = new THREE.VideoTexture(solarVideoElement);
      solarVideoTexture.encoding = THREE.sRGBEncoding;
      solarVideoTexture.minFilter = THREE.LinearFilter;
      solarVideoTexture.magFilter = THREE.LinearFilter;
      solarVideoTexture.generateMipmaps = false;
      solarVideoTexture.wrapS = THREE.ClampToEdgeWrapping;
      solarVideoTexture.wrapT = THREE.ClampToEdgeWrapping;
      solarVideoTexture.center.set(0.5, 0.5);

      const videoAspectRatio =
        solarVideoElement.videoWidth / Math.max(solarVideoElement.videoHeight, 1);

      if (videoAspectRatio > 1) {
        solarVideoTexture.repeat.set(1 / videoAspectRatio, 1);
        solarVideoTexture.offset.set((1 - solarVideoTexture.repeat.x) / 2, 0);
      } else {
        solarVideoTexture.repeat.set(1, videoAspectRatio);
        solarVideoTexture.offset.set(0, (1 - solarVideoTexture.repeat.y) / 2);
      }

      solarVideoMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(panelSize * videoFillScale, panelSize * videoFillScale),
        new THREE.MeshBasicMaterial({
          map: solarVideoTexture,
          toneMapped: false,
          side: THREE.DoubleSide,
        }),
      );
      solarVideoMesh.position.z = 0.006;
      modelHolder.add(solarVideoMesh);

      if (videoStartTime > 0 && Number.isFinite(solarVideoElement.duration)) {
        try {
          solarVideoElement.currentTime = Math.min(
            videoStartTime,
            Math.max(solarVideoElement.duration - 0.15, 0),
          );
        } catch (error) {
          // Some browsers restrict seeking until more media is buffered.
        }
      }

      try {
        await solarVideoElement.play();
      } catch (error) {
        // Autoplay can be blocked on some devices; texture still updates after user interaction.
      }

      solarVideoResumeHandler = () => {
        solarVideoElement?.play().then(() => {
          if (solarVideoResumeHandler) {
            window.removeEventListener("pointerdown", solarVideoResumeHandler, true);
            solarVideoResumeHandler = undefined;
          }
        }).catch(() => undefined);
      };
      window.addEventListener("pointerdown", solarVideoResumeHandler, true);

      resolve(true);
    };

    const handleError = () => {
      cleanupListeners();
      if (solarVideoElement?.parentNode) {
        solarVideoElement.parentNode.removeChild(solarVideoElement);
      }
      solarVideoElement = undefined;
      buildSyntheticSolarScene(modelConfig);
      resolve(false);
    };

    solarVideoElement.addEventListener("loadeddata", handleLoadedData);
    solarVideoElement.addEventListener("error", handleError);
    solarVideoElement.load();
  });
}

function createStarField(panelSize, options = {}) {
  const {
    count = 150,
    size = 0.006,
    opacity = 0.95,
  } = options;
  const random = createSeededRandom(207);
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  for (let index = 0; index < count; index += 1) {
    const offset = index * 3;
    positions[offset] = (random() - 0.5) * panelSize * 0.96;
    positions[offset + 1] = (random() - 0.5) * panelSize * 0.96;
    positions[offset + 2] = STARFIELD_DEPTH + random() * 0.004;
    const warm = random() > 0.87;
    colors[offset] = warm ? 1 : 0.8 + random() * 0.2;
    colors[offset + 1] = warm ? 0.78 + random() * 0.15 : 0.84 + random() * 0.16;
    colors[offset + 2] = warm ? 0.42 + random() * 0.12 : 1;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  return new THREE.Points(
    geometry,
    new THREE.PointsMaterial({
      size,
      vertexColors: true,
      transparent: true,
      opacity,
      depthWrite: false,
    }),
  );
}

function createPlanetMesh(body) {
  const geometry = new THREE.SphereGeometry(body.orbit.size, 36, 36);
  const material =
    body.id === "sun"
      ? new THREE.MeshBasicMaterial({ map: createPlanetTexture(body.id) })
      : new THREE.MeshStandardMaterial({
          map: createPlanetTexture(body.id),
          color: BODY_FALLBACK_COLORS[body.id],
          roughness: 0.9,
          metalness: 0.02,
          emissive: new THREE.Color(body.id === "earth" ? 0x07111f : 0x090d14),
          emissiveIntensity: body.id === "earth" ? 0.16 : 0.08,
        });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.z = body.id === "sun" ? 0.015 : PLANET_FLOAT_DEPTH;
  return mesh;
}

function createOrbitLine(radius, opacity = 0.28) {
  const curve = new THREE.EllipseCurve(
    0,
    0,
    radius,
    radius * ORBIT_VERTICAL_SCALE,
    0,
    Math.PI * 2,
    false,
    0,
  );
  const points = curve
    .getPoints(160)
    .map((point) => new THREE.Vector3(point.x, point.y, 0));
  return new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints(points),
    new THREE.LineBasicMaterial({
      color: 0xff7f33,
      transparent: true,
      opacity,
    }),
  );
}

function createSaturnRing(body) {
  if (!body.orbit.ringInner || !body.orbit.ringOuter) {
    return null;
  }
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(body.orbit.ringInner, body.orbit.ringOuter, 72),
    new THREE.MeshBasicMaterial({
      color: 0xe8d4a0,
      transparent: true,
      opacity: 0.72,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
  );
  const tilt = body.orbit.ringTilt ?? { x: Math.PI / 2, y: 0, z: 0 };
  ring.rotation.set(tilt.x ?? 0, tilt.y ?? 0, tilt.z ?? 0);
  return ring;
}

function createAsteroidBelt() {
  const group = new THREE.Group();
  const random = createSeededRandom(409);
  const sharedGeometry = new THREE.IcosahedronGeometry(0.0038, 0);
  const sharedMaterial = new THREE.MeshStandardMaterial({
    color: 0xc28752,
    roughness: 1,
    metalness: 0.01,
  });

  for (let index = 0; index < 150; index += 1) {
    const rock = new THREE.Mesh(sharedGeometry, sharedMaterial);
    const angle = random() * Math.PI * 2;
    const radius =
      ASTEROID_BELT_INNER_RADIUS +
      random() * (ASTEROID_BELT_OUTER_RADIUS - ASTEROID_BELT_INNER_RADIUS);
    rock.position.set(
      Math.cos(angle) * radius,
      Math.sin(angle) * radius * ORBIT_VERTICAL_SCALE,
      (random() - 0.5) * 0.018,
    );
    const scale = 0.58 + random() * 1.9;
    rock.scale.setScalar(scale);
    rock.rotation.set(random() * Math.PI, random() * Math.PI, random() * Math.PI);
    group.add(rock);
  }

  return group;
}

function buildSyntheticSolarScene(modelConfig) {
  const panelSize = modelConfig.panelSize ?? SOLAR_PANEL_SIZE;
  solarElapsedTime = 0;
  solarOrbitEntries = [];
  solarSpinEntries = [];
  solarPulseEntries = [];

  solarPanelRoot = createSolarBackdrop(panelSize);
  modelHolder.add(solarPanelRoot);

  solarStarField = createStarField(panelSize);
  modelHolder.add(solarStarField);

  solarSceneRoot = new THREE.Group();
  modelHolder.add(solarSceneRoot);

  const solarCore = new THREE.Group();
  solarCore.position.set(SOLAR_CENTER.x, SOLAR_CENTER.y, SOLAR_CENTER.z);
  solarSceneRoot.add(solarCore);

  const sunBody = solarBodies[0];
  const sunMesh = createPlanetMesh(sunBody);
  solarCore.add(sunMesh);

  const innerGlow = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: createGlowTexture("rgba(255, 247, 180, 0.95)", "rgba(255, 155, 46, 0.38)"),
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  );
  innerGlow.scale.set(0.34, 0.34, 1);
  innerGlow.position.z = 0.004;
  solarCore.add(innerGlow);

  const outerGlow = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: createGlowTexture("rgba(255, 183, 94, 0.48)", "rgba(255, 120, 34, 0.1)"),
      transparent: true,
      opacity: 0.66,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  );
  outerGlow.scale.set(0.56, 0.56, 1);
  outerGlow.position.z = 0.002;
  solarCore.add(outerGlow);

  const sunLight = new THREE.PointLight(0xffb25a, 1.8, 4.5, 2);
  sunLight.position.set(0, 0, 0.06);
  solarCore.add(sunLight);

  const sunLabelAnchor = new THREE.Group();
  sunLabelAnchor.position.set(0, sunBody.orbit.labelLift, 0.05);
  sunMesh.add(sunLabelAnchor);
  addBodyLabel(sunBody, 0, sunLabelAnchor);

  solarPulseEntries.push({
    type: "scale",
    object: innerGlow,
    baseX: 0.34,
    baseY: 0.34,
    amplitude: 0.08,
    speed: 2.2,
    phase: 0,
  });
  solarPulseEntries.push({
    type: "scale",
    object: outerGlow,
    baseX: 0.56,
    baseY: 0.56,
    amplitude: 0.12,
    speed: 1.3,
    phase: 0.8,
  });
  solarPulseEntries.push({
    type: "light",
    object: sunLight,
    baseIntensity: 1.8,
    amplitude: 0.16,
    speed: 1.75,
    phase: 0.32,
  });

  solarAsteroidBelt = createAsteroidBelt();
  solarCore.add(solarAsteroidBelt);

  solarBodies.slice(1).forEach((body, index) => {
    const orbitOpacity = Math.max(0.12, 0.3 - index * 0.02);
    solarCore.add(createOrbitLine(body.orbit.radius, orbitOpacity));

    const planetAnchor = new THREE.Group();
    solarCore.add(planetAnchor);

    const planetMesh = createPlanetMesh(body);
    planetAnchor.add(planetMesh);

    const saturnRing = body.id === "saturn" ? createSaturnRing(body) : null;
    if (saturnRing) {
      planetAnchor.add(saturnRing);
    }

    const labelAnchor = new THREE.Group();
    labelAnchor.position.set(0, body.orbit.labelLift, 0.03);
    planetAnchor.add(labelAnchor);
    addBodyLabel(body, index + 1, labelAnchor);

    planetAnchor.position.set(
      Math.cos(body.orbit.phase) * body.orbit.radius,
      Math.sin(body.orbit.phase) * body.orbit.radius * ORBIT_VERTICAL_SCALE,
      PLANET_FLOAT_DEPTH + Math.sin(body.orbit.phase * 2.1) * 0.012,
    );

    solarOrbitEntries.push({ body, anchor: planetAnchor });
    solarSpinEntries.push({ body, mesh: planetMesh, ring: saturnRing });
  });
}

function updateSyntheticSolarScene(deltaSeconds) {
  if (!solarSceneRoot || deltaSeconds <= 0) {
    return;
  }

  solarElapsedTime += deltaSeconds;

  solarOrbitEntries.forEach((entry) => {
    const angle = solarElapsedTime * entry.body.orbit.speed + entry.body.orbit.phase;
    entry.anchor.position.set(
      Math.cos(angle) * entry.body.orbit.radius,
      Math.sin(angle) * entry.body.orbit.radius * ORBIT_VERTICAL_SCALE,
      PLANET_FLOAT_DEPTH + Math.sin(angle * 2.1) * 0.012,
    );
  });

  solarSpinEntries.forEach((entry) => {
    entry.mesh.rotation.y += deltaSeconds * entry.body.orbit.spinSpeed;
    if (entry.ring) {
      entry.ring.rotation.z += deltaSeconds * 0.18;
    }
  });

  if (solarAsteroidBelt) {
    solarAsteroidBelt.rotation.z += deltaSeconds * 0.06;
  }

  if (solarStarField) {
    solarStarField.rotation.z -= deltaSeconds * 0.01;
  }

  solarPulseEntries.forEach((entry) => {
    const wave = 1 + Math.sin(solarElapsedTime * entry.speed + entry.phase) * entry.amplitude;
    if (entry.type === "scale") {
      entry.object.scale.set(entry.baseX * wave, entry.baseY * wave, 1);
      return;
    }
    entry.object.intensity = entry.baseIntensity * wave;
  });
}

function attachLabelsToNamedNodes(root) {
  solarBodies.forEach((body, index) => {
    const labelAnchor = new THREE.Group();
    const sourceNode = findNode(root, body.aliases);

    if (sourceNode) {
      labelAnchor.position.set(0, body.layout.labelLift * DIRECT_LABEL_LIFT_SCALE, 0);
      sourceNode.add(labelAnchor);
    } else {
      labelAnchor.position.set(...body.layout.position);
      root.add(labelAnchor);
    }

    addBodyLabel(body, index, labelAnchor);
  });
}

function getDirectBackdropAnchor(root) {
  const sunNode =
    findRenderableNode(root, solarBodies[0].aliases) ??
    findNode(root, solarBodies[0].aliases);
  if (!sunNode) {
    return new THREE.Vector3(0, 0, 0);
  }

  return getObjectLocalCenter(root, sunNode);
}

function renderDirectSolarModel(root, modelConfig, options = {}) {
  const {
    enhanceModel = true,
    animations = [],
  } = options;

  const showBackdrop =
    modelConfig.showBackdrop ??
    defaultConfig.assets.models.solar.showBackdrop ??
    false;
  const showStarField =
    modelConfig.showStarField ??
    defaultConfig.assets.models.solar.showStarField ??
    false;
  const backdropSize =
    modelConfig.backdropSize ??
    defaultConfig.assets.models.solar.backdropSize ??
    DIRECT_BACKDROP_SIZE;
  const backdropOffsetZ =
    modelConfig.backdropOffsetZ ??
    defaultConfig.assets.models.solar.backdropOffsetZ ??
    DIRECT_BACKDROP_OFFSET_Z;

  if (enhanceModel) {
    root.traverse((object3D) => {
      if (shouldHideDecorativeObject(object3D)) {
        object3D.visible = false;
      }
    });
    scaleDirectPlanetNodes(root);
    addDirectOrbitOverlays(root);
  }

  normalizeModel(
    root,
    modelConfig.targetSize ?? defaultConfig.assets.models.solar.targetSize,
  );

  const backdropAnchor = getDirectBackdropAnchor(root);
  root.position.sub(backdropAnchor);
  root.updateMatrixWorld(true);

  if (showBackdrop) {
    solarPanelRoot = createSolarBackdrop(backdropSize, {
      showBorder: false,
      opacity: 1,
    });
    solarPanelRoot.position.set(0, 0, backdropOffsetZ);
    modelHolder.add(solarPanelRoot);
  }

  if (showStarField) {
    solarStarField = createStarField(backdropSize, {
      count: 280,
      size: 0.008,
      opacity: 0.92,
    });
    solarStarField.position.set(0, 0, backdropOffsetZ + 0.02);
    modelHolder.add(solarStarField);
  }

  attachLabelsToNamedNodes(root);
  modelHolder.add(root);

  if (animations.length && modelConfig.animationClipName) {
    const clip =
      THREE.AnimationClip.findByName(animations, modelConfig.animationClipName) ??
      animations[0];

    if (clip) {
      animationMixer = new THREE.AnimationMixer(root);
      const action = animationMixer.clipAction(clip);
      action.timeScale = modelConfig.animationTimeScale ?? 1;
      action.play();
    }
  }
}

function buildCompactSolarModel(sourceRoot) {
  const compactGroup = new THREE.Group();
  solarBodies.forEach((body, index) => {
    const sourceNode = findNode(sourceRoot, body.aliases);
    const anchor = new THREE.Group();
    anchor.position.set(...body.layout.position);
    compactGroup.add(anchor);
    if (sourceNode) {
      const clone = cloneWithUniqueMaterials(sourceNode);
      centerObjectAtOrigin(clone);
      scaleObjectToSize(clone, body.layout.size);
      tunePlanetAppearance(clone, body.id);
      if (body.id === "saturn") {
        clone.rotation.set(0.32, 0.45, -0.18);
      }
      anchor.add(clone);
    }
    const labelAnchor = new THREE.Group();
    labelAnchor.position.set(0, body.layout.labelLift, 0);
    anchor.add(labelAnchor);
    addBodyLabel(body, index, labelAnchor);
  });
  compactGroup.updateMatrixWorld(true);
  return compactGroup;
}

function normalizeModel(root, targetSize) {
  root.updateMatrixWorld(true);
  const bounds = getRenderableBounds(root);
  const size = bounds.getSize(new THREE.Vector3());
  const factor = targetSize / (Math.max(size.x, size.y, size.z) || 1);
  root.scale.multiplyScalar(factor);
  root.updateMatrixWorld(true);
  const centeredBounds = getRenderableBounds(root);
  const center = centeredBounds.getCenter(new THREE.Vector3());
  root.position.sub(center);
  root.updateMatrixWorld(true);
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
  const renderMode =
    config.assets?.models?.solar?.renderMode ??
    defaultConfig.assets.models.solar.renderMode;
  applyViewerMode(renderMode);
  applyCopy();
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
    activeStream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "environment",
        width: { ideal: 1280 },
        height: { ideal: 720 },
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
    initCV();
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
    antialias: true,
  });
  renderer.setSize(UI.video.width, UI.video.height, false);
  renderer.setPixelRatio(window.devicePixelRatio || 1);

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
    UI.video.width / UI.video.height,
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
  const renderMode = modelConfig.renderMode ?? "synthetic";
  applyViewerMode(renderMode);
  const modelPath = modelConfig.path ?? MODEL_PATH;
  const isGltfModel = GLTF_EXTENSION_PATTERN.test(modelPath);
  const shouldRenderDirect = modelConfig.renderMode === "direct" || isGltfModel;
  const enhanceDirectModel =
    modelConfig.enhanceDirectModel ?? !isGltfModel;
  const loader = isGltfModel ? new THREE.GLTFLoader() : new THREE.FBXLoader();
  const modelPosition =
    modelConfig.position ?? defaultConfig.assets.models.solar.position;
  const modelRotation =
    modelConfig.rotation ?? defaultConfig.assets.models.solar.rotation;

  arScale = config.settings?.arScale ?? defaultConfig.settings.arScale;

  setStatus(copy.statusLoading);

  if (renderMode === "video") {
    modelHolder.position.set(
      modelPosition.x ?? 0.5,
      modelPosition.y ?? 0.5,
      modelPosition.z ?? 0.02,
    );
    modelHolder.rotation.set(
      modelRotation.x ?? 0,
      modelRotation.y ?? 0,
      modelRotation.z ?? 0,
    );
    buildVideoSolarScene(modelConfig).then(() => {
      setupInteraction();
      updateInfoCard();
      syncLabels();
      positionInfoCard();
      setStatus(copy.statusReady);
    });
    return;
  }

  if (renderMode === "synthetic") {
    modelHolder.position.set(
      modelPosition.x ?? 0.5,
      modelPosition.y ?? 0.5,
      modelPosition.z ?? 0.02,
    );
    modelHolder.rotation.set(
      modelRotation.x ?? 0,
      modelRotation.y ?? 0,
      modelRotation.z ?? 0,
    );
    buildSyntheticSolarScene(modelConfig);
    setupInteraction();
    updateInfoCard();
    syncLabels();
    positionInfoCard();
    setStatus(copy.statusReady);
    return;
  }

  modelHolder.position.set(
    modelPosition.x ?? 0.5,
    modelPosition.y ?? 0.34,
    modelPosition.z ?? 0,
  );
  modelHolder.rotation.set(
    modelRotation.x ?? DEFAULT_ROTATION.x,
    modelRotation.y ?? DEFAULT_ROTATION.y,
    modelRotation.z ?? DEFAULT_ROTATION.z,
  );

  loader.load(
    modelPath,
    (loadedAsset) => {
      sourceSolarModel = isGltfModel ? loadedAsset.scene : loadedAsset;

      if (shouldRenderDirect) {
        if (!isGltfModel) {
          sourceSolarModel.traverse((object3D) => {
            if (!object3D.material) {
              return;
            }

            const materials = Array.isArray(object3D.material)
              ? object3D.material
              : [object3D.material];

            materials.forEach((material) => {
              material.transparent = true;
              material.opacity = 1;
              material.depthWrite = true;
              material.needsUpdate = true;
            });
          });
        }

        renderDirectSolarModel(sourceSolarModel, modelConfig, {
          enhanceModel: enhanceDirectModel,
          animations: isGltfModel ? loadedAsset.animations ?? [] : [],
        });
      } else if (isGltfModel) {
        normalizeNamedNodeModel(
          sourceSolarModel,
          modelConfig.targetSize ?? defaultConfig.assets.models.solar.targetSize,
        );
        attachLabelsToNamedNodes(sourceSolarModel);
        modelHolder.add(sourceSolarModel);

        if (modelConfig.animationClipName && loadedAsset.animations?.length) {
          const clip =
            THREE.AnimationClip.findByName(
              loadedAsset.animations,
              modelConfig.animationClipName,
            ) ?? loadedAsset.animations[0];
          animationMixer = new THREE.AnimationMixer(sourceSolarModel);
          const action = animationMixer.clipAction(clip);
          action.timeScale = modelConfig.animationTimeScale ?? 1;
          action.play();
        }
      } else {
        sourceSolarModel.traverse((object3D) => {
          if (shouldHideDecorativeObject(object3D)) {
            object3D.visible = false;
          }
        });

        const compactModel = buildCompactSolarModel(sourceSolarModel);
        normalizeModel(
          compactModel,
          modelConfig.targetSize ?? defaultConfig.assets.models.solar.targetSize,
        );
        modelHolder.add(compactModel);
      }

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
    1,
  ]);
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
    0,
  );
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

function processFrame(timestamp) {
  if (!activeStream || !cap || !src || !renderer || !labelRenderer) {
    return;
  }

  const deltaSeconds = previousFrameTime
    ? Math.min((timestamp - previousFrameTime) / 1000, 0.05)
    : 0;
  previousFrameTime = timestamp;

  updateSyntheticSolarScene(deltaSeconds);

  if (animationMixer && deltaSeconds > 0) {
    animationMixer.update(deltaSeconds);
  }

  cap.read(src);
  cv.imshow("canvasOutput", src);

  const points = new cv.Mat();
  let markerFound = false;
  let shouldHoldSteady = false;

  if (qrDetector.detect(src, points)) {
    const metrics = getQrMetrics(points);
    const confirmedDetection = updateDetectionConfidence(metrics);
    shouldHoldSteady = Boolean(metrics);

    if (confirmedDetection) {
      const imagePoints = cv.matFromArray(4, 1, cv.CV_32FC2, [
        points.data32F[0], points.data32F[1],
        points.data32F[2], points.data32F[3],
        points.data32F[4], points.data32F[5],
        points.data32F[6], points.data32F[7],
      ]);

      if (
        cv.solvePnP(objectPoints, imagePoints, camMatrix, distCoeffs, rvec, tvec)
      ) {
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
        markerFound = true;
        lostMarkerFrames = 0;
      }

      imagePoints.delete();
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

  if (markerFound) {
    setStatus(copy.statusTracking);
  } else if (shouldHoldSteady && detectionStreak > 0) {
    setStatus(copy.statusHoldSteady);
  } else {
    setStatus(copy.statusSearching);
  }

  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
  positionInfoCard();

  points.delete();
  animationFrameId = window.requestAnimationFrame(processFrame);
}

function fitToScreen() {
  const scale = Math.max(
    window.innerWidth / UI.video.videoWidth,
    window.innerHeight / UI.video.videoHeight,
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

  positionInfoCard();
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

  isDragging = false;
  isArInitialized = false;
  focusedPartIndex = -1;
  lostMarkerFrames = 0;
  hasTrackingPose = false;
  resetDetectionConfidence();
  previousFrameTime = 0;

  if (renderer) {
    renderer.dispose();
  }
  if (labelRenderer?.domElement?.parentNode) {
    labelRenderer.domElement.parentNode.removeChild(labelRenderer.domElement);
  }
  if (solarVideoResumeHandler) {
    window.removeEventListener("pointerdown", solarVideoResumeHandler, true);
    solarVideoResumeHandler = undefined;
  }
  if (solarVideoElement) {
    solarVideoElement.pause();
    solarVideoElement.removeAttribute("src");
    solarVideoElement.load();
    if (solarVideoElement.parentNode) {
      solarVideoElement.parentNode.removeChild(solarVideoElement);
    }
  }
  if (solarVideoTexture) {
    solarVideoTexture.dispose();
  }
  if (solarVideoMesh?.geometry) {
    solarVideoMesh.geometry.dispose();
  }
  if (solarVideoMesh?.material) {
    solarVideoMesh.material.dispose();
  }

  [src, camMatrix, distCoeffs, objectPoints, rvec, tvec, rotMatr].forEach(
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
  applyViewerMode(defaultConfig.assets.models.solar.renderMode);
  solarSceneRoot = undefined;
  solarPanelRoot = undefined;
  solarOrbitEntries = [];
  solarSpinEntries = [];
  solarPulseEntries = [];
  solarAsteroidBelt = undefined;
  solarStarField = undefined;
  solarElapsedTime = 0;
  solarVideoElement = undefined;
  solarVideoTexture = undefined;
  solarVideoMesh = undefined;
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
  modelHolder = undefined;
  sourceSolarModel = undefined;
  animationMixer = undefined;
}

window.addEventListener("resize", fitToScreen);
window.addEventListener("pagehide", cleanup);
window.addEventListener("beforeunload", cleanup);

loadConfig();
