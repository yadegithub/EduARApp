package io.ionic.starter;

import android.content.Context;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.speech.tts.TextToSpeech;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;
import java.util.Locale;

public class MainActivity extends BridgeActivity {
    private NativeTtsBridge nativeTtsBridge;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        WebView webView = getBridge() != null ? getBridge().getWebView() : null;
        if (webView == null) {
            return;
        }

        WebSettings settings = webView.getSettings();
        settings.setTextZoom(100);
        webView.setBackgroundColor(Color.WHITE);
        nativeTtsBridge = new NativeTtsBridge(this);
        webView.addJavascriptInterface(nativeTtsBridge, "EduARTTS");

        if (isProbablyEmulator()) {
            // Some emulator GPU pipelines render Capacitor's WebView as a black surface.
            webView.setLayerType(View.LAYER_TYPE_SOFTWARE, null);
        }
    }

    @Override
    public void onDestroy() {
        if (nativeTtsBridge != null) {
            nativeTtsBridge.shutdown();
            nativeTtsBridge = null;
        }
        super.onDestroy();
    }

    private boolean isProbablyEmulator() {
        return Build.FINGERPRINT.startsWith("generic")
            || Build.FINGERPRINT.contains("emulator")
            || Build.MODEL.contains("Emulator")
            || Build.MODEL.contains("sdk")
            || Build.MANUFACTURER.contains("Genymotion")
            || Build.HARDWARE.contains("ranchu")
            || Build.PRODUCT.contains("sdk");
    }

    private static final class NativeTtsBridge implements TextToSpeech.OnInitListener {
        private final MainActivity activity;
        private final Context appContext;
        private TextToSpeech textToSpeech;
        private boolean isInitialized = false;
        private String pendingText;
        private String pendingLanguageTag;

        NativeTtsBridge(MainActivity activity) {
            this.activity = activity;
            this.appContext = activity.getApplicationContext();
            ensureInitialized();
        }

        private void ensureInitialized() {
            if (textToSpeech == null) {
                textToSpeech = new TextToSpeech(appContext, this);
            }
        }

        @Override
        public void onInit(int status) {
            isInitialized = status == TextToSpeech.SUCCESS;
            if (!isInitialized || textToSpeech == null) {
                return;
            }

            textToSpeech.setSpeechRate(1.0f);
            flushPendingSpeech();
        }

        @JavascriptInterface
        public boolean isSupported() {
            return true;
        }

        @JavascriptInterface
        public void speak(final String text, final String languageTag) {
            if (text == null || text.trim().isEmpty()) {
                return;
            }

            activity.runOnUiThread(() -> {
                ensureInitialized();
                if (!isInitialized || textToSpeech == null) {
                    pendingText = text;
                    pendingLanguageTag = languageTag;
                    return;
                }

                speakInternal(text, languageTag);
            });
        }

        @JavascriptInterface
        public void stop() {
            activity.runOnUiThread(() -> {
                pendingText = null;
                pendingLanguageTag = null;
                if (textToSpeech != null) {
                    textToSpeech.stop();
                }
            });
        }

        private void flushPendingSpeech() {
            if (pendingText == null || pendingText.trim().isEmpty()) {
                return;
            }

            final String text = pendingText;
            final String languageTag = pendingLanguageTag;
            pendingText = null;
            pendingLanguageTag = null;
            speakInternal(text, languageTag);
        }

        private void speakInternal(String text, String languageTag) {
            if (textToSpeech == null) {
                return;
            }

            Locale requestedLocale = resolveLocale(languageTag);
            int languageResult = TextToSpeech.LANG_AVAILABLE;

            if (requestedLocale != null) {
                languageResult = textToSpeech.setLanguage(requestedLocale);
                if (languageResult == TextToSpeech.LANG_MISSING_DATA
                    || languageResult == TextToSpeech.LANG_NOT_SUPPORTED) {
                    Locale languageOnlyLocale = new Locale(requestedLocale.getLanguage());
                    languageResult = textToSpeech.setLanguage(languageOnlyLocale);
                }
            }

            if (requestedLocale == null
                || languageResult == TextToSpeech.LANG_MISSING_DATA
                || languageResult == TextToSpeech.LANG_NOT_SUPPORTED) {
                textToSpeech.setLanguage(Locale.getDefault());
            }

            textToSpeech.speak(text, TextToSpeech.QUEUE_FLUSH, null, "EduARTTS");
        }

        private Locale resolveLocale(String languageTag) {
            if (languageTag == null || languageTag.trim().isEmpty()) {
                return null;
            }

            Locale locale = Locale.forLanguageTag(languageTag);
            if (locale == null || locale.getLanguage() == null || locale.getLanguage().isEmpty()) {
                return null;
            }

            return locale;
        }

        void shutdown() {
            activity.runOnUiThread(() -> {
                pendingText = null;
                pendingLanguageTag = null;
                isInitialized = false;
                if (textToSpeech != null) {
                    textToSpeech.stop();
                    textToSpeech.shutdown();
                    textToSpeech = null;
                }
            });
        }
    }
}
