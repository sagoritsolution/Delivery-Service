# Khulna Food Express (খুলনা ফুড এক্সপ্রেস)

**খুলনার যেকোনো রেস্টুরেন্টের খাবার, এখন আপনার বাসায়!**  
A modern, mobile-first food delivery and custom restaurant pickup platform for Khulna, Bangladesh.

## 1. Project Overview & Business Model
- **Any Restaurant Delivery:** Customers can order from standard restaurant menus or submit custom food requests for restaurants that are NOT listed on Foodpanda or Foodi.
- **7-Stage Order Tracking:**
  1. Order Request Received
  2. Confirming With Restaurant
  3. Order Confirmed
  4. Food Being Prepared
  5. Rider Collecting Food
  6. Out for Delivery
  7. Delivered
- **Local Khulna Context:** Zones include Shibbari Mor, Sonadanga, Khalishpur, Daulatpur, Boyra, Gollamari, Nirala, Rupsha, and Chuknagar Highway.
- **Primary Language:** Bengali (Bangla) with English toggle.
- **Currency:** Bangladeshi Taka (BDT / ৳).

## 2. Setup & Run Instructions
```bash
# Install dependencies
npm install

# Start local development server (runs on port 3000)
npm run dev

# Build for production
npm run build
```

## 3. Environment Variables
- `APP_URL`: The URL where this applet is hosted.
- `GEMINI_API_KEY`: Optional Gemini AI key if intelligent recommendations or receipt OCR are used.

## 4. Key Features Completed
- Mobile-first responsive UI with warm food color palette and Hind Siliguri font.
- Dedicated "Order From Any Restaurant" (যেকোনো রেস্টুরেন্ট থেকে খাবার অর্ডার) flow with budget, photo, and verification notice.
- Single-restaurant cart policy with graceful conflict modal.
- Zone-based dynamic delivery fee calculator.
- Promo codes (`KHULNA50`, `CHUIZHAL`).
- Checkout with Cash on Delivery, bKash, and Nagad options.
- 7-step simulated live order tracker with rider details and direct WhatsApp/call options.
- Customer account dashboard with saved Khulna delivery addresses and 1-click reorder.
- Super Admin Dashboard with Order management, Price confirmation, Restaurant CRUD, Rider management, Delivery fee logic settings, and Sales/Profit reports.
- Embedded user workflow illustration (`/assets/aistudio/image_eb64535e.png`).
