package com.example.cs_360project3;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.os.Bundle;
import android.telephony.SmsManager;

import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import java.util.ArrayList;

public class MainActivity extends AppCompatActivity {
    DatabaseHelper db;
    ListView listView;
    int userId;
    ArrayList<String> itemList;
    ArrayAdapter<String> adapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_inventory);

        // Initialize views
        listView = findViewById(R.id.listView);
        EditText itemNameInput = findViewById(R.id.itemName);
        EditText itemQuantityInput = findViewById(R.id.itemQuantity);
        Button addItemButton = findViewById(R.id.addItem);

        // Initialize database and adapter
        db = new DatabaseHelper(this);
        itemList = new ArrayList<>();
        adapter = new ArrayAdapter<>(this, android.R.layout.simple_list_item_1, itemList);
        listView.setAdapter(adapter);

        // Get user ID from session
        String username = getIntent().getStringExtra("username");
        userId = db.getUserId(username);


        // Load existing items
        loadItems();

        // Add item button click listener
        addItemButton.setOnClickListener(v -> {
            String name = itemNameInput.getText().toString().trim();
            String quantityStr = itemQuantityInput.getText().toString().trim();

            if (name.isEmpty() || quantityStr.isEmpty()) {
                Toast.makeText(this, "Enter both item and quantity", Toast.LENGTH_SHORT).show();
                return;
            }

            try {
                int quantity = Integer.parseInt(quantityStr);
                boolean added = db.addItem(name, quantity, userId);

                if (added) {
                    Toast.makeText(this, "Item added!", Toast.LENGTH_SHORT).show();
                    //Clear the input fields after success
                    itemNameInput.setText("");
                    itemQuantityInput.setText("");
                    if (quantity == 0) {
                        checkAndSendSMS("Item \"" + name + "\" has reached zero quantity.");
                    }
                    loadItems();
                } else {
                    Toast.makeText(this, "Failed to add item", Toast.LENGTH_SHORT).show();
                }
            } catch (NumberFormatException e) {
                Toast.makeText(this, "Quantity must be a number", Toast.LENGTH_SHORT).show();
            }
        });

        // Edit item on list item click
        listView.setOnItemClickListener((parent, view, position, id) -> {
            String item = itemList.get(position);

            if (!item.contains(" - Qty: ")) return;

            String[] parts = item.split(" - Qty: ");
            if (parts.length < 2) return;

            String name = parts[0];
            int quantity = Integer.parseInt(parts[1]);

            Cursor cursor = db.getItemByNameAndUser(name, userId);
            if (cursor != null && cursor.moveToFirst()) {
                int itemId = cursor.getInt(cursor.getColumnIndexOrThrow("id"));

                Intent intent = new Intent(MainActivity.this, EditItemActivity.class);
                intent.putExtra("item_id", itemId);
                intent.putExtra("item_name", name);
                intent.putExtra("item_quantity", quantity);
                startActivity(intent);
                cursor.close(); // closing the cursor
            }
        });
    }
    @Override
    protected void onResume() {
        super.onResume();
        loadItems(); //Refresh list after returning from edit screen
    }
    private void loadItems() {
        if (db == null || userId == -1) return;

        itemList.clear();
        Cursor cursor = db.getItems(userId); // Get all items for the user

        if (cursor != null && cursor.moveToFirst()) {
            do {
                int id = cursor.getInt(cursor.getColumnIndexOrThrow("id"));
                String name = cursor.getString(cursor.getColumnIndexOrThrow("name"));
                int quantity = cursor.getInt(cursor.getColumnIndexOrThrow("quantity"));
                itemList.add(name + " - Qty: " + quantity);
            } while (cursor.moveToNext());

            cursor.close();
        }

        adapter.notifyDataSetChanged();
    }

    private void checkAndSendSMS(String message) {
        String phoneNumber = SessionManager.getPhone(this);

        if (ContextCompat.checkSelfPermission(this, Manifest.permission.SEND_SMS)
                != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.SEND_SMS}, 1001);
        } else {
            SmsManager smsManager = this.getSystemService(SmsManager.class);
            smsManager.sendTextMessage(phoneNumber, null, message, null, null);
            Toast.makeText(this, "SMS sent", Toast.LENGTH_SHORT).show();
        }
    }
}
