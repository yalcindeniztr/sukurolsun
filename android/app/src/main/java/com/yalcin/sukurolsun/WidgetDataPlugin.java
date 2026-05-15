package com.yalcin.sukurolsun;

import android.content.Context;
import android.content.SharedPreferences;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "WidgetData")
public class WidgetDataPlugin extends Plugin {
    static final String PREFS_NAME = "sukur_widget_data";

    @PluginMethod
    public void update(PluginCall call) {
        Context context = getContext();
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);

        prefs.edit()
            .putString("dateText", call.getString("dateText", ""))
            .putString("nextPrayer", call.getString("nextPrayer", "Ezan vakti"))
            .putString("nextPrayerTime", call.getString("nextPrayerTime", "--:--"))
            .putString("verseText", call.getString("verseText", "Sukrederseniz, andolsun ki size nimetimi artiririm."))
            .putString("verseSource", call.getString("verseSource", "Ibrahim Suresi, 7"))
            .apply();

        ShukurWidgetProvider.updateAllWidgets(context);
        call.resolve(new JSObject().put("updated", true));
    }
}
