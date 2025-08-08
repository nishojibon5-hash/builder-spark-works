package com.loanbondhu.app;

import android.annotation.SuppressLint;
import android.app.DownloadManager;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.os.Environment;
import android.view.View;
import android.webkit.ConsoleMessage;
import android.webkit.DownloadListener;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ProgressBar;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

public class MainActivity extends AppCompatActivity {

    private WebView webView;
    private ProgressBar progressBar;
    private SwipeRefreshLayout swipeRefreshLayout;
    private ValueCallback<Uri[]> uploadMessage;
    private static final int REQUEST_SELECT_FILE = 100;
    private static final String APP_URL = "http://localhost:5173"; // Development URL
    private static final String PRODUCTION_URL = "https://your-domain.com"; // Production URL

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        initializeViews();
        setupWebView();
        setupSwipeRefresh();
        
        // Load the loan application
        webView.loadUrl(getAppUrl());
    }

    private void initializeViews() {
        webView = findViewById(R.id.webview);
        progressBar = findViewById(R.id.progressBar);
        swipeRefreshLayout = findViewById(R.id.swipeRefreshLayout);
    }

    @SuppressLint("SetJavaScriptEnabled")
    private void setupWebView() {
        WebSettings webSettings = webView.getSettings();
        
        // Enable JavaScript
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setDatabaseEnabled(true);
        webSettings.setAppCacheEnabled(true);
        
        // Enable file access
        webSettings.setAllowFileAccess(true);
        webSettings.setAllowContentAccess(true);
        webSettings.setAllowFileAccessFromFileURLs(true);
        webSettings.setAllowUniversalAccessFromFileURLs(true);
        
        // Responsive design
        webSettings.setLoadWithOverviewMode(true);
        webSettings.setUseWideViewPort(true);
        webSettings.setSupportZoom(true);
        webSettings.setBuiltInZoomControls(true);
        webSettings.setDisplayZoomControls(false);
        
        // Cache settings
        webSettings.setCacheMode(WebSettings.LOAD_DEFAULT);
        webSettings.setAppCachePath(getApplicationContext().getCacheDir().getAbsolutePath());
        
        // User agent
        webSettings.setUserAgentString(webSettings.getUserAgentString() + " LoanBondhuApp/1.0");

        // Add JavaScript interface for native functionality
        webView.addJavascriptInterface(new WebAppInterface(this), "Android");

        // WebViewClient
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                // Handle admin panel navigation
                if (url.contains("/admin")) {
                    Intent adminIntent = new Intent(MainActivity.this, AdminActivity.class);
                    adminIntent.putExtra("url", url);
                    startActivity(adminIntent);
                    return true;
                }
                
                // Handle external links
                if (url.startsWith("tel:") || url.startsWith("mailto:") || url.startsWith("sms:")) {
                    Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                    startActivity(intent);
                    return true;
                }
                
                // Load internal links in WebView
                view.loadUrl(url);
                return true;
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                progressBar.setVisibility(View.GONE);
                swipeRefreshLayout.setRefreshing(false);
                
                // Inject custom CSS for better mobile experience
                injectMobileOptimizations();
            }

            @Override
            public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
                super.onReceivedError(view, errorCode, description, failingUrl);
                // Show offline page or retry option
                showErrorPage();
            }
        });

        // WebChromeClient for file uploads and progress
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                progressBar.setProgress(newProgress);
                if (newProgress == 100) {
                    progressBar.setVisibility(View.GONE);
                } else {
                    progressBar.setVisibility(View.VISIBLE);
                }
            }

            @Override
            public boolean onShowFileChooser(WebView webView, ValueCallback<Uri[]> filePathCallback,
                                           FileChooserParams fileChooserParams) {
                uploadMessage = filePathCallback;
                Intent intent = fileChooserParams.createIntent();
                try {
                    startActivityForResult(intent, REQUEST_SELECT_FILE);
                } catch (Exception e) {
                    uploadMessage = null;
                    Toast.makeText(MainActivity.this, "Cannot open file chooser", Toast.LENGTH_LONG).show();
                    return false;
                }
                return true;
            }

            @Override
            public boolean onConsoleMessage(ConsoleMessage consoleMessage) {
                // Log JavaScript console messages for debugging
                return true;
            }
        });

        // Download listener for APK downloads
        webView.setDownloadListener(new DownloadListener() {
            @Override
            public void onDownloadStart(String url, String userAgent, String contentDisposition,
                                      String mimetype, long contentLength) {
                downloadFile(url, contentDisposition, mimetype);
            }
        });
    }

    private void setupSwipeRefresh() {
        swipeRefreshLayout.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener() {
            @Override
            public void onRefresh() {
                webView.reload();
            }
        });
        
        swipeRefreshLayout.setColorSchemeResources(
                android.R.color.holo_blue_bright,
                android.R.color.holo_green_light,
                android.R.color.holo_orange_light,
                android.R.color.holo_red_light);
    }

    private String getAppUrl() {
        // Use localhost for development, production URL for release
        if (BuildConfig.DEBUG) {
            return APP_URL;
        } else {
            return PRODUCTION_URL;
        }
    }

    private void injectMobileOptimizations() {
        String javascript = "javascript:(function() {" +
                "var meta = document.createElement('meta');" +
                "meta.name = 'viewport';" +
                "meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';" +
                "var head = document.getElementsByTagName('head')[0];" +
                "head.appendChild(meta);" +
                "})()";
        webView.evaluateJavascript(javascript, null);
    }

    private void showErrorPage() {
        String errorHtml = "<html><body style='text-align:center; padding:50px; font-family:Arial;'>" +
                "<h2>Connection Error</h2>" +
                "<p>Please check your internet connection and try again.</p>" +
                "<button onclick='window.location.reload()' style='padding:10px 20px; font-size:16px;'>Retry</button>" +
                "</body></html>";
        webView.loadData(errorHtml, "text/html", "UTF-8");
    }

    private void downloadFile(String url, String contentDisposition, String mimetype) {
        DownloadManager.Request request = new DownloadManager.Request(Uri.parse(url));
        request.setMimeType(mimetype);
        
        String filename = "LoanBondhu.apk";
        if (contentDisposition != null && contentDisposition.contains("filename=")) {
            filename = contentDisposition.substring(contentDisposition.indexOf("filename=") + 9);
            filename = filename.replace("\"", "");
        }
        
        request.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, filename);
        request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);
        request.setTitle("Downloading " + filename);
        
        DownloadManager dm = (DownloadManager) getSystemService(DOWNLOAD_SERVICE);
        dm.enqueue(request);
        
        Toast.makeText(this, "Download started: " + filename, Toast.LENGTH_LONG).show();
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (uploadMessage == null) return;
        
        if (requestCode == REQUEST_SELECT_FILE) {
            uploadMessage.onReceiveValue(WebChromeClient.FileChooserParams.parseResult(resultCode, data));
            uploadMessage = null;
        }
    }

    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        webView.onResume();
    }

    @Override
    protected void onPause() {
        super.onPause();
        webView.onPause();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (webView != null) {
            webView.destroy();
        }
    }

    // JavaScript interface for native functionality
    public class WebAppInterface {
        Context mContext;

        WebAppInterface(Context c) {
            mContext = c;
        }

        @JavascriptInterface
        public void showToast(String toast) {
            Toast.makeText(mContext, toast, Toast.LENGTH_SHORT).show();
        }

        @JavascriptInterface
        public void openAdmin(String phone) {
            if ("01650074073".equals(phone)) {
                Intent adminIntent = new Intent(MainActivity.this, AdminActivity.class);
                startActivity(adminIntent);
            } else {
                Toast.makeText(mContext, "Access denied. Invalid admin phone number.", Toast.LENGTH_LONG).show();
            }
        }

        @JavascriptInterface
        public String getDeviceInfo() {
            return android.os.Build.MODEL + " (" + android.os.Build.VERSION.RELEASE + ")";
        }
    }
}
