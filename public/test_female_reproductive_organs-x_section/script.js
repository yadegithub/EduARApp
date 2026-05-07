window.AR_VIEWER_BOOTSTRAP = {
    defaultModelPath: "assets/female_reproductive_organs.glb",
    defaultTitle: "FEMALE REPRODUCTIVE SYSTEM",
    defaultStatusLoading: "Loading reproductive system model...",
    defaultStatusTracking: "Reproductive system placed",
    defaultFocusTag: "Reproductive structure",
    defaultOverview: {
        tag: "Reproductive anatomy",
        title: "FEMALE REPRODUCTIVE SYSTEM",
        info: "Inspect the main organs of the female reproductive system in AR and tap each note to read its role.",
        hint: "Use Rotate, Scale and Labels to inspect the model more clearly."
    },
    defaultConfig: {
        assets: {
            models: {
                primary: {
                    name: "Female Reproductive System",
                    path: "assets/female_reproductive_organs.glb",
                    scale: { x: 0.3, y: 0.3, z: 0.3 },
                    position: { x: 0.0, y: 0.0, z: 0.0 },
                    rotation: { x: 0.0, y: Math.PI, z: 0.0 },
                    autoCenter: true
                }
            }
        },
        settings: {
            arScale: 2.6,
            tracking: {
                markerLostGraceFrames: 6,
                trackingLerpAlpha: 0.24,
                trackingScaleLerpAlpha: 0.18,
                confirmFrames: 2,
                qrScanIntervalMs: 28,
                qrSearchIntervalMs: 48
            }
        }
    }
};
