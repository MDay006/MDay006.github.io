package com.example.cs_360project3;

import android.content.Intent;
import android.database.Cursor;
import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

public class LoginActivity extends AppCompatActivity {
    EditText username, password;
    Button login, register;
    DatabaseHelper db;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        db = new DatabaseHelper(this);

        username = findViewById(R.id.username);
        password = findViewById(R.id.password);
        login = findViewById(R.id.login);
        register = findViewById(R.id.register);

        login.setOnClickListener(v -> {
            String user = username.getText().toString().trim();
            String pass = password.getText().toString().trim();

            try {
                Cursor cursor = db.loginUser(user, pass);
                if (cursor != null && cursor.moveToFirst()) {
                    Toast.makeText(this, "Login successful!", Toast.LENGTH_SHORT).show();
                    Intent intent = new Intent(LoginActivity.this, MainActivity.class);
                    intent.putExtra("username", user); // MUST pass the username
                    startActivity(intent);
                } else {
                    Toast.makeText(this, "Invalid username or password", Toast.LENGTH_SHORT).show();
                }
                if (cursor != null) cursor.close();
            } catch (Exception e) {
                Toast.makeText(this, "Login failed: " + e.getMessage(), Toast.LENGTH_LONG).show();
            }
    });

        register.setOnClickListener(v -> startActivity(new Intent(this, RegisterActivity.class)));
    }
}
