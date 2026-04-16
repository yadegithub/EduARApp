package io.ionic.starter;

import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.webkit.WebSettings;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

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

        if (isProbablyEmulator()) {
            // Some emulator GPU pipelines render Capacitor's WebView as a black surface.
            webView.setLayerType(View.LAYER_TYPE_SOFTWARE, null);
        }
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
}
