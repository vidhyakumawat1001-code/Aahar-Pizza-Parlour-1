# Aahar Pizza Parlour - Admin Instructions

Welcome to your new Pizza Parlour management system! This app is designed to be warm, appetizing, and easy to use.

## 1. Manual Menu Management
You can manage your menu in two ways:
- **Admin Dashboard (Recommended):** Log in as an admin and use the "Menu Management" section to add, edit, or delete items. This updates the live database instantly.
- **Bulk Update (Advanced):** You can refer to the `menuData.json` file in the root directory for the structured format. If you need to seed the database with many items at once, you can provide this JSON to the developer.

## 2. Linking Local Images
To use images from your device or local folders:
1. **Upload via Admin Panel:** Go to the Gallery or Menu management sections in the Admin Dashboard.
2. **Click "Upload Image":** Select the file from your computer or phone.
3. **Automatic Hosting:** The app will automatically upload the file to Firebase Cloud Storage and generate a permanent link for you. You don't need to worry about hosting!

## 3. Design Palette
The app uses a custom "Warm & Appetizing" palette:
- **Deep Red (#8B0000):** Used for primary actions and branding.
- **Mustard Yellow (#E1AD01):** Used for accents and highlights.
- **Cream (#FFFDF5):** Used for backgrounds to create a cozy atmosphere.

## 4. Interactivity
- **Menu Hover:** Hover over any pizza card to see a subtle lift and color change.
- **Gallery Lightbox:** Click any photo in the gallery to open it in a full-screen "zoom" view.

