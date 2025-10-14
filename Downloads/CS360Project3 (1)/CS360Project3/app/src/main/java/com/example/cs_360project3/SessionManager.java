package com.example.cs_360project3;

import android.content.Context;
public class SessionManager {

    public static int getUserId(Context context) {
        return context.getSharedPreferences("login_session", Context.MODE_PRIVATE).getInt("user_id", -1);
    }
    public static String getPhone(Context context) {
        return context.getSharedPreferences("login_session", Context.MODE_PRIVATE).getString("phone", "");
    }
}
