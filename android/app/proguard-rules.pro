# ProGuard & R8 Optimization Rules for Şükür Olsun App

# Preserve stack trace line numbers for crash reporting while obfuscating class/method names
-keepattributes SourceFile,LineNumberTable,Signature,*Annotation*,InnerClasses,EnclosingMethod

# Keep Capacitor Bridge & Plugins for R8 Full Mode
-keep public class com.getcapacitor.** { *; }
-keep public class * extends com.getcapacitor.Plugin { *; }
-keepclasseswithmembers class * {
    @com.getcapacitor.PluginMethod <methods>;
    @com.getcapacitor.annotation.CapacitorPlugin <methods>;
}

# Keep Custom App Classes, Plugins & Widget Providers
-keep class com.yalcin.sukurolsun.** { *; }

# Keep Google AdMob & Play Services
-keep class com.google.android.gms.ads.** { *; }
-keep class com.google.ads.** { *; }
-keep class com.google.android.gms.common.** { *; }

# AndroidX & WebView Keep Rules
-keepclassmembers class * extends android.webkit.WebChromeClient {
    public void openFileChooser(...);
}
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# R8 Optimization Pass Settings
-optimizationpasses 5
-repackageclasses ''
-allowaccessmodification
