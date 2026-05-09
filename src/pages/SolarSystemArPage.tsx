import { Capacitor } from "@capacitor/core";
import { IonContent, IonIcon, IonPage } from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import { useEffect, useMemo, useRef } from "react";
import "./HeartArPage.css";

type SolarSystemArPageProps = {
  experienceTitle: string;
  language: string;
  onBack: () => void;
  theme: string;
};

const SolarSystemArPage: React.FC<SolarSystemArPageProps> = ({
  experienceTitle,
  language,
  onBack,
  theme,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const isNativePlatform = Capacitor.isNativePlatform();
  const resolvedLanguage = language === "ar" ? "ar" : "en";
  const searchParams = useMemo(
    () =>
      new URLSearchParams({
        lang: resolvedLanguage,
        theme: theme === "light" ? "light" : "dark",
        scanner: isNativePlatform ? "mlkit" : "opencv",
      }),
    [isNativePlatform, resolvedLanguage, theme],
  );

  const copy =
    resolvedLanguage === "ar"
      ? {
          back: "\u0627\u0644\u0639\u0648\u062f\u0629",
        }
      : {
          back: "Go back",
        };

  useEffect(() => {
    if (!isNativePlatform) {
      return;
    }

    let isCancelled = false;
    let stopRequested = false;
    let removeBarcodeListener: (() => Promise<void>) | undefined;
    let removeScanErrorListener: (() => Promise<void>) | undefined;

    const postToViewer = (payload: Record<string, unknown>) => {
      iframeRef.current?.contentWindow?.postMessage(
        payload,
        window.location.origin,
      );
    };

    const cleanupScanner = async () => {
      try {
        if (removeBarcodeListener) {
          await removeBarcodeListener();
        }
        if (removeScanErrorListener) {
          await removeScanErrorListener();
        }

        const pluginModule = await import("@capacitor-mlkit/barcode-scanning");
        await pluginModule.BarcodeScanner.removeAllListeners().catch(
          () => undefined,
        );
        await pluginModule.BarcodeScanner.stopScan().catch(() => undefined);
      } catch {
        // Ignore cleanup errors during unmount.
      } finally {
        postToViewer({ type: "solar-mlkit-stop" });
      }
    };

    const startMlKitScanner = async () => {
      const pluginModule = await import("@capacitor-mlkit/barcode-scanning");
      const {
        BarcodeScanner,
        BarcodeFormat,
        LensFacing,
        Resolution,
      } = pluginModule;

      const { supported } = await BarcodeScanner.isSupported();
      if (!supported || isCancelled) {
        postToViewer({
          type: "solar-mlkit-status",
          status: "error",
          message: "ML Kit barcode scanning is not supported on this device.",
        });
        return;
      }

      const permissionStatus = await BarcodeScanner.checkPermissions();
      const hasCameraPermission =
        permissionStatus.camera === "granted" ||
        permissionStatus.camera === "limited";

      if (!hasCameraPermission) {
        const requestedPermission = await BarcodeScanner.requestPermissions();
        const grantedAfterRequest =
          requestedPermission.camera === "granted" ||
          requestedPermission.camera === "limited";

        if (!grantedAfterRequest || isCancelled) {
          postToViewer({
            type: "solar-mlkit-status",
            status: "error",
            message: "Camera permission is required for ML Kit scanning.",
          });
          return;
        }
      }

      const barcodeListener = await BarcodeScanner.addListener(
        "barcodesScanned",
        ({ barcodes }) => {
          if (isCancelled || stopRequested) {
            return;
          }

          postToViewer({
            type: "solar-mlkit-barcodes",
            barcodes,
            viewport: {
              width: window.innerWidth,
              height: window.innerHeight,
            },
          });
        },
      );
      removeBarcodeListener = () => barcodeListener.remove();

      const scanErrorListener = await BarcodeScanner.addListener(
        "scanError",
        ({ message }) => {
          if (isCancelled || stopRequested) {
            return;
          }

          postToViewer({
            type: "solar-mlkit-status",
            status: "error",
            message,
          });
        },
      );
      removeScanErrorListener = () => scanErrorListener.remove();

      postToViewer({
        type: "solar-mlkit-status",
        status: "loading",
        message: "Starting ML Kit QR scanner...",
      });

      await BarcodeScanner.startScan({
        formats: [BarcodeFormat.QrCode],
        lensFacing: LensFacing.Back,
        resolution: Resolution["1280x720"],
      });

      if (isCancelled || stopRequested) {
        await cleanupScanner();
        return;
      }

      postToViewer({
        type: "solar-mlkit-status",
        status: "ready",
        message: "ML Kit QR scanner is active.",
      });
    };

    void startMlKitScanner().catch((error: unknown) => {
      const message =
        error instanceof Error ? error.message : "Failed to start ML Kit scanner.";
      postToViewer({
        type: "solar-mlkit-status",
        status: "error",
        message,
      });
    });

    return () => {
      isCancelled = true;
      stopRequested = true;
      void cleanupScanner();
    };
  }, [isNativePlatform]);

  return (
    <IonPage>
      <IonContent
        fullscreen
        scrollY={false}
        className={`heart-ar-content${
          isNativePlatform ? " heart-ar-content--transparent" : ""
        }`}
      >
        <div
          className={`heart-ar-shell${
            isNativePlatform ? " heart-ar-shell--transparent" : ""
          }`}
          dir={resolvedLanguage === "ar" ? "rtl" : "ltr"}
        >
          <iframe
            ref={iframeRef}
            className={`heart-ar-frame${
              isNativePlatform ? " heart-ar-frame--transparent" : ""
            }`}
            title={experienceTitle}
            src={`/test_solar/indexx.html?${searchParams.toString()}`}
            allow="camera; microphone; autoplay; fullscreen"
            allowFullScreen
          />

          <div className="heart-ar-overlay">
            <div className="heart-ar-topbar">
              <button
                type="button"
                className="icon-button icon-button--dark"
                aria-label={copy.back}
                onClick={onBack}
              >
                <IonIcon icon={arrowBack} />
              </button>

              <div className="heart-ar-title-pill">{experienceTitle}</div>

              <span className="heart-ar-topbar__spacer" aria-hidden="true" />
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SolarSystemArPage;
