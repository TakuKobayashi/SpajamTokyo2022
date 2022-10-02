package net.taptappun.taku.kobayashi.spajamtokyo2022

import android.app.Activity
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.webkit.WebView

class MainActivity : Activity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        val webview = findViewById<WebView>(R.id.app_webview)
        webview.getSettings().setJavaScriptEnabled(true)
        webview.loadUrl("https://wondrous-eclair-9b7b3f.netlify.app/")
    }
}