package com.example.cs_360project3;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.telephony.SmsManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;


public class EditItemActivity extends AppCompatActivity {
    EditText itemNameInput, itemQuantityInput;
    Button updateButton, deleteButton;
    DatabaseHelper db;
    int userId, itemId;
    String originalName;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_edit_item);

        db = new DatabaseHelper(this);
        userId = SessionManager.getUserId(this);

        itemNameInput = findViewById(R.id.editItemName);
        itemQuantityInput = findViewById(R.id.editQuantity);
        updateButton = findViewById(R.id.update);
        deleteButton = findViewById(R.id.delete);

        // Get passed data
        Intent intent = getIntent();
        itemId = intent.getIntExtra("item_id", -1);
        originalName = intent.getStringExtra("item_name");
        int quantity = intent.getIntExtra("item_quantity", 0);

        itemNameInput.setText(originalName);
        itemQuantityInput.setText(String.valueOf(quantity));

        updateButton.setOnClickListener(v -> {
            String newName = itemNameInput.getText().toString().trim();
            int newQty = Integer.parseInt(itemQuantityInput.getText().toString().trim());

            boolean updated = db.updateItemById(itemId, newName, newQty);
            if (updated) {
                Toast.makeText(this, "Item updated", Toast.LENGTH_SHORT).show();
                if (newQty == 0) {
                    sendZeroQuantitySMS(newName);
                }
                finish();
            } else {
                Toast.makeText(this, "Failed to update item", Toast.LENGTH_SHORT).show();
            }
        });

        deleteButton.setOnClickListener(v -> {
            boolean deleted = db.deleteItemById(itemId);
            if (deleted) {
                Toast.makeText(this, "Item deleted", Toast.LENGTH_SHORT).show();
                finish();
            } else {
                Toast.makeText(this, "Failed to delete item", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void sendZeroQuantitySMS(String itemName) {
        String phoneNumber = SessionManager.getPhone(this);

        if (ContextCompat.checkSelfPermission(this, Manifest.permission.SEND_SMS)
                != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.SEND_SMS}, 1001);
            return;
        }

        SmsManager smsManager = getSystemService(SmsManager.class);
        smsManager.sendTextMessage(phoneNumber, null,
                "Item \"" + itemName + "\" has reached zero quantity.",
                null, null);

        Toast.makeText(this, "SMS sent for zero quantity", Toast.LENGTH_SHORT).show();
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == 1001) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                Toast.makeText(this, "SMS permission granted", Toast.LENGTH_SHORT).show();
            } else {
                Toast.makeText(this, "SMS permission denied. Will continue without SMS.", Toast.LENGTH_SHORT).show();
            }
        }
    }
}