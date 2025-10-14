package com.example.cs_360project3;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

public class DatabaseHelper extends SQLiteOpenHelper {
    private static final String DB_NAME = "inventory.db";
    private static final int DB_VERSION = 1;

    public DatabaseHelper(Context context) {
        super(context, DB_NAME, null, DB_VERSION);
    }

    @Override
    public void onCreate(SQLiteDatabase db) {
        db.execSQL("CREATE TABLE users (" +
                "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                "username TEXT UNIQUE, " +
                "password TEXT, " +
                "phone_number TEXT)");

        db.execSQL("CREATE TABLE inventory (" +
                "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                "name TEXT, " +
                "quantity INTEGER, " +
                "user_id INTEGER)");
    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {

        db.execSQL("DROP TABLE IF EXISTS users");
        db.execSQL("DROP TABLE IF EXISTS inventory");
        onCreate(db);
    }


    public boolean registerUser(String username, String password, String phoneNumber) {
        SQLiteDatabase db = this.getWritableDatabase();

        // Trim input
        username = username.trim().toLowerCase();

        // Check if user exists
        Cursor cursor = db.rawQuery("SELECT * FROM users WHERE username = ?", new String[]{username});
        if (cursor.moveToFirst()) {
            cursor.close();
            return false;
        }
        cursor.close();

        // Insert new user
        ContentValues values = new ContentValues();
        values.put("username", username);
        values.put("password", password);
        values.put("phone_number", phoneNumber);

        long result = db.insert("users", null, values);
        return result != -1;
    }

    public Cursor loginUser(String username, String password) {
        SQLiteDatabase db = this.getReadableDatabase();
        return db.rawQuery(
                "SELECT * FROM users WHERE username = ? AND password = ?",
                new String[]{username.trim().toLowerCase(), password}
        );
    }
    public int getUserId(String username) {
        SQLiteDatabase db = this.getReadableDatabase();
        Cursor cursor = db.rawQuery("SELECT id FROM users WHERE username = ?", new String[]{username});
        if (cursor.moveToFirst()) {
            int id = cursor.getInt(0);
            cursor.close();
            return id;
        }
        cursor.close();
        return -1;
    }
    public boolean addItem(String name, int quantity, int userId) {
        SQLiteDatabase db = this.getWritableDatabase();
        Cursor cursor = db.rawQuery(
                "SELECT quantity FROM inventory WHERE name = ? AND user_id = ?",
                new String[]{name, String.valueOf(userId)}
        );

        boolean result;
        if (cursor.moveToFirst()) {
            // Overwrite the quantity
            ContentValues values = new ContentValues();
            values.put("quantity", quantity);
            int rows = db.update("inventory", values, "name = ? AND user_id = ?", new String[]{name, String.valueOf(userId)});
            result = rows > 0;
        } else {
            // Insert new item
            ContentValues values = new ContentValues();
            values.put("name", name);
            values.put("quantity", quantity);
            values.put("user_id", userId);
            long insertResult = db.insert("inventory", null, values);
            result = insertResult != -1;
        }

        cursor.close();
        return result;
    }
    public Cursor getItems(int userId) {
        SQLiteDatabase db = this.getReadableDatabase();
        return db.rawQuery("SELECT * FROM inventory WHERE user_id = ?", new String[]{String.valueOf(userId)});
    }

    public Cursor getItemByNameAndUser(String name, int userId) {
        SQLiteDatabase db = this.getReadableDatabase();
        return db.rawQuery(
                "SELECT * FROM inventory WHERE name = ? AND user_id = ? LIMIT 1",
                new String[]{name, String.valueOf(userId)}
        );
    }
    public boolean updateItemById(int itemId, String newName, int newQuantity) {
        SQLiteDatabase db = this.getWritableDatabase();
        ContentValues values = new ContentValues();
        values.put("name", newName);
        values.put("quantity", newQuantity);

        int rows = db.update("inventory", values, "id = ?", new String[]{String.valueOf(itemId)});
        return rows > 0;
    }

    public boolean deleteItemById(int itemId) {
        SQLiteDatabase db = this.getWritableDatabase();
        int rows = db.delete("inventory", "id = ?", new String[]{String.valueOf(itemId)});
        return rows > 0;
    }


}
