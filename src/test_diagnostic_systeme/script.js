window.AR_VIEWER_BOOTSTRAP = {
    defaultModelPath: "assets/digestive_system.glb",
    defaultTitle: "DIGESTIVE SYSTEM",
    defaultStatusLoading: "Loading digestive system model...",
    defaultStatusTracking: "Digestive system placed",
    defaultFocusTag: "Digestive structure",
    defaultOverview: {
        tag: "Digestive anatomy",
        title: "DIGESTIVE SYSTEM",
        info: "Inspect the full digestive system in AR and tap the numbered labels to read the role of each main structure.",
        hint: "Use Rotate, Scale and Labels to inspect the whole system more clearly."
    },
    defaultConfig: {
        assets: {
            models: {
                primary: {
                    name: "Digestive System",
                    path: "assets/digestive_system.glb",
                    scale: { x: 0.78, y: 0.78, z: 0.78 },
                    position: { x: 0.0, y: 0.0, z: 0.0 },
                    rotation: { x: 0.0, y: Math.PI, z: 0.0 },
                    autoCenter: true
                }
            }
        },
        settings: {
            arScale: 2.35,
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
