window.AR_VIEWER_BOOTSTRAP = {
    defaultModelPath: "assets/human_anatomy_skin.glb",
    defaultTitle: "HUMAN SKIN",
    defaultStatusLoading: "Loading human skin model...",
    defaultStatusTracking: "Human skin placed",
    defaultFocusTag: "Skin structure",
    defaultOverview: {
        tag: "Skin anatomy",
        title: "HUMAN SKIN",
        info: "Inspect the layers of the skin in AR and tap the numbered labels to understand each protective and sensory structure.",
        hint: "Use Rotate, Scale and Labels to inspect the skin more clearly."
    },
    defaultConfig: {
        assets: {
            models: {
                primary: {
                    name: "Human Skin",
                    path: "assets/human_anatomy_skin.glb",
                    scale: { x: 0.46, y: 0.46, z: 0.46 },
                    position: { x: 0.0, y: 0.0, z: 0.0 },
                    rotation: { x: 0.0, y: Math.PI, z: 0.0 },
                    autoCenter: true
                }
            }
        },
        settings: {
            arScale: 2.6,
            tracking: {
                markerLostGraceFrames: 3,
                trackingLerpAlpha: 0.28,
                trackingScaleLerpAlpha: 0.22,
                confirmFrames: 2,
                qrScanIntervalMs: 20,
                qrSearchIntervalMs: 36,
                positionDeadzone: 0.01,
                scaleDeadzone: 0.012,
                rotationDeadzoneRad: 0.02,
                fastFollowDistance: 0.08,
                fastFollowAlpha: 0.68
            }
        }
    }
};
