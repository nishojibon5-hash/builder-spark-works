package com.loanbondhu.app;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.os.Bundle;
import android.view.MenuItem;
import android.view.View;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ProgressBar;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

public class AdminActivity extends AppCompatActivity {

    private WebView adminWebView;
    private ProgressBar progressBar;
    private SwipeRefreshLayout swipeRefreshLayout;
    private static final String ADMIN_URL = "http://localhost:5173/admin/login"; // Development URL
    private static final String PRODUCTION_ADMIN_URL = "https://your-domain.com/admin/login"; // Production URL

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_admin);

        initializeViews();
        setupToolbar();
        setupWebView();
        setupSwipeRefresh();
        
        // Get URL from intent or use default admin URL
        String url = getIntent().getStringExtra("url");
        if (url == null) {
            url = getAdminUrl();
        }
        
        adminWebView.loadUrl(url);
    }

    private void initializeViews() {
        adminWebView = findViewById(R.id.admin_webview);
        progressBar = findViewById(R.id.admin_progressBar);
        swipeRefreshLayout = findViewById(R.id.admin_swipeRefreshLayout);
    }

    private void setupToolbar() {
        Toolbar toolbar = findViewById(R.id.admin_toolbar);
        setSupportActionBar(toolbar);
        
        if (getSupportActionBar() != null) {
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
            getSupportActionBar().setDisplayShowHomeEnabled(true);
            getSupportActionBar().setTitle("Admin Panel");
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    private void setupWebView() {
        WebSettings webSettings = adminWebView.getSettings();
        
        // Enable JavaScript
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setDatabaseEnabled(true);
        webSettings.setAppCacheEnabled(true);
        
        // Enable file access
        webSettings.setAllowFileAccess(true);
        webSettings.setAllowContentAccess(true);
        
        // Responsive design
        webSettings.setLoadWithOverviewMode(true);
        webSettings.setUseWideViewPort(true);
        webSettings.setSupportZoom(true);
        webSettings.setBuiltInZoomControls(true);
        webSettings.setDisplayZoomControls(false);
        
        // Cache settings
        webSettings.setCacheMode(WebSettings.LOAD_DEFAULT);
        
        // User agent for admin panel
        webSettings.setUserAgentString(webSettings.getUserAgentString() + " LoanBondhuAdmin/1.0");

        // WebViewClient for admin panel
        adminWebView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                // Keep all admin navigation within this activity
                if (url.contains("/admin") || url.contains("localhost") || url.contains("your-domain.com")) {
                    view.loadUrl(url);
                    return true;
                }
                
                // Handle logout - return to main activity
                if (url.contains("logout") || url.equals("/")) {
                    finish();
                    return true;
                }
                
                return false;
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                progressBar.setVisibility(View.GONE);
                swipeRefreshLayout.setRefreshing(false);
                
                // Inject admin-specific optimizations
                injectAdminOptimizations();
                
                // Update toolbar title based on current page
                updateToolbarTitle(url);
            }

            @Override
            public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
                super.onReceivedError(view, errorCode, description, failingUrl);
                showAdminErrorPage();
            }
        });
    }

    private void setupSwipeRefresh() {
        swipeRefreshLayout.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener() {
            @Override
            public void onRefresh() {
                adminWebView.reload();
            }
        });
        
        swipeRefreshLayout.setColorSchemeResources(
                android.R.color.holo_blue_bright,
                android.R.color.holo_green_light,
                android.R.color.holo_orange_light,
                android.R.color.holo_red_light);
    }

    private String getAdminUrl() {
        if (BuildConfig.DEBUG) {
            return ADMIN_URL;
        } else {
            return PRODUCTION_ADMIN_URL;
        }
    }

    private void injectAdminOptimizations() {
        String javascript = "javascript:(function() {" +
                "var meta = document.createElement('meta');" +
                "meta.name = 'viewport';" +
                "meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';" +
                "var head = document.getElementsByTagName('head')[0];" +
                "head.appendChild(meta);" +
                "document.body.style.webkitUserSelect = 'none';" +
                "document.body.style.webkitTouchCallout = 'none';" +
                "})()";
        adminWebView.evaluateJavascript(javascript, null);
    }

    private void updateToolbarTitle(String url) {
        if (getSupportActionBar() != null) {
            if (url.contains("/dashboard")) {
                getSupportActionBar().setTitle("Admin Dashboard");
            } else if (url.contains("/users")) {
                getSupportActionBar().setTitle("User Management");
            } else if (url.contains("/loans")) {
                getSupportActionBar().setTitle("Loan Management");
            } else if (url.contains("/reports")) {
                getSupportActionBar().setTitle("Reports");
            } else if (url.contains("/settings")) {
                getSupportActionBar().setTitle("Settings");
            } else {
                getSupportActionBar().setTitle("Admin Panel");
            }
        }
    }

    private void showAdminErrorPage() {
        String errorHtml = "<html><body style='text-align:center; padding:50px; font-family:Arial;'>" +
                "<h2>Admin Panel Error</h2>" +
                "<p>Unable to load admin panel. Please check your connection.</p>" +
                "<button onclick='window.location.reload()' style='padding:10px 20px; font-size:16px; margin:10px;'>Retry</button>" +
                "<button onclick='window.history.back()' style='padding:10px 20px; font-size:16px; margin:10px;'>Go Back</button>" +
                "</body></html>";
        adminWebView.loadData(errorHtml, "text/html", "UTF-8");
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        if (item.getItemId() == android.R.id.home) {
            onBackPressed();
            return true;
        }
        return super.onOptionsItemSelected(item);
    }

    @Override
    public void onBackPressed() {
        if (adminWebView.canGoBack()) {
            adminWebView.goBack();
        } else {
            // Return to main activity
            finish();
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        adminWebView.onResume();
    }

    @Override
    protected void onPause() {
        super.onPause();
        adminWebView.onPause();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (adminWebView != null) {
            adminWebView.destroy();
        }
    }
}
