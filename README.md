# Furnish – Web-Based Interactive Room Visualization System

**HCI Coursework Project**

A full-stack web application for designing and visualizing rooms in real-time with 2D/3D room designer, customizable furniture, and wall/floor textures.

---

## 1. Project Overview

Furnish is an interactive room visualization system that allows users to design and customize their living spaces in real-time. Users can place furniture, change wall and floor textures, and view their designs in both 2D and 3D perspectives. The system includes user authentication, saved room designs, and a responsive web interface.

### 1.1 Aims & Objectives

- Provide an intuitive web-based tool for interior design visualization
- Enable real-time 2D and 3D room editing with drag-and-drop furniture placement
- Support multiple furniture types, textures, and room configurations
- Allow users to save and retrieve their room designs
- Deliver an accessible, responsive user experience

---

## 2. Features

| Feature | Description |
|---------|-------------|
| **2D Room Designer** | Top-down view with grid-based furniture placement |
| **3D Room Designer** | Interactive 3D view powered by Three.js / React Three Fiber |
| **Furniture Library** | Beds, chairs, cupboards, lamps, sofas, tables, TVs, wardrobes, office desks |
| **Textures** | Floor (plain, wood, marble) and wall (plain, brick, wallpaper) options |
| **User Authentication** | Email/password login and optional Google/Facebook OAuth (Firebase) |
| **Saved Rooms** | Store and retrieve room designs in the database |
| **Contact Form** | Users can send messages; admins can manage them |
| **Responsive UI** | Landing page, About, Contact, Login, Signup, and protected designer pages |

---

## 3. Technology Stack

### 3.1 Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.x | UI framework |
| Vite | 7.x | Build tool & dev server |
| React Router | 7.x | Client-side routing |
| React Three Fiber | 9.x | 3D rendering (Three.js) |
| @react-three/drei | 10.x | 3D helpers (controls, loaders) |
| Three.js | 0.182 | 3D graphics engine |
| Tailwind CSS | 4.x | Utility-first styling |
| Motion (Framer Motion) | 12.x | Animations |
| MUI (Material UI) | 7.x | UI components |
| Lucide React | 0.542 | Icons |
| Firebase | 11.x | Optional OAuth (Google, Facebook) |

### 3.2 Backend

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express | Web server & API |
| MongoDB / Mongoose | Database & ODM |
| JWT (jsonwebtoken) | Authentication tokens |
| bcryptjs | Password hashing |
| Multer | File uploads (3D models, images) |

---

## 4. Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React + Vite)                  │
│  Landing │ Login │ Signup │ Room Designer │ Saved Rooms      │
└───────────────────────────┬─────────────────────────────────┘
                             │ HTTP / REST API
┌───────────────────────────▼─────────────────────────────────┐
│                   Backend (Express + Node.js)                │
│  /api/auth │ /api/rooms │ /api/furniture │ /api/contact      │
└───────────────────────────┬─────────────────────────────────┘
                             │
┌───────────────────────────▼─────────────────────────────────┐
│                      MongoDB Database                        │
│  Users │ RoomDesigns │ Furniture │ ContactMessages           │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. Setup & Installation

### 5.1 Prerequisites

- Node.js 18+ and npm
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### 5.2 Quick Start (Recommended)

```bash
cd server
npm install
npm run start:full
```

Opens at **http://localhost:5001** (builds frontend and serves full stack)

### 5.3 Frontend (Development)

```bash
cd HCI-Coursework-Project
npm install
npm run dev
```

Runs at **http://localhost:5173**

### 5.4 Backend (API Only)

```bash
cd server
npm install
```

**Database setup (choose one):**

- **MongoDB Atlas:** Create a cluster, get connection string, set in `server/.env`:
  ```
  MONGODB_URI=mongodb+srv://USER:PASS@cluster.xxxxx.mongodb.net/roomdesigner?retryWrites=true&w=majority
  ```
- **Local MongoDB:** Install and start MongoDB; default `mongodb://127.0.0.1:27017/roomdesigner` is used.

**Start the server:**

```bash
npm run start:full   # Full stack (frontend + backend)
# or
npm start           # API only (for use with frontend dev server)
```

### 5.5 Demo Credentials

| Email | Password |
|-------|----------|
| admin@example.com | 123456 |
| admin@gmail.com | 12345678 |
| test@gmail.com | 20030805 |

---

## 6. Project Structure

```
HCI-Coursework-Project/
├── HCI-Coursework-Project/          # Frontend
│   ├── src/
│   │   ├── assets/
│   │   │   ├── models/              # 3D furniture (.glb)
│   │   │   └── textures/            # Floor & wall textures
│   │   ├── components/
│   │   ├── pages/
│   │   ├── utils/
│   │   └── lib/
│   ├── public/
│   └── package.json
│
├── server/                          # Backend
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── uploads/                     # User-uploaded assets
│   └── server.js
│
└── README.md                        # This file
```

---

## 7. Additional Resources & Credits

All external assets used in this project are listed below with full attribution. This section satisfies the requirement to credit all additional resources (art, 3D models, textures, images, sound FX, etc.).

### 7.1 Images (Photography)

**Source:** [Unsplash](https://unsplash.com)  
**License:** [Unsplash License](https://unsplash.com/license) – Free for commercial and non-commercial use.

| Use | Description | Attribution |
|-----|-------------|-------------|
| Hero, Login, Signup | Modern luxury living room | [Unsplash](https://unsplash.com) – images.unsplash.com |
| Hero, Login, Signup | Scandinavian minimalist bedroom | [Unsplash](https://unsplash.com) |
| Hero, Login, Signup | Elegant dining room | [Unsplash](https://unsplash.com) |
| Hero, Login, Signup | Contemporary home office desk | [Unsplash](https://unsplash.com) |
| Hero, Login, Signup | Cozy velvet sofa living space | [Unsplash](https://unsplash.com) |
| Gallery, About, ForgotPassword | Luxury furniture showroom interior | [Unsplash](https://unsplash.com) |

All hero and gallery images are loaded from `images.unsplash.com`. Credit is provided here for transparency; Unsplash License does not require attribution but it is given for academic integrity.

### 7.2 3D Models (Furniture)

**Location:** `HCI-Coursework-Project/src/assets/models/`

| Asset | File | Category | Notes |
|-------|------|----------|-------|
| Bed | bed.glb | Furniture | 3D model for room designer |
| Chair | chair.glb | Furniture | 3D model |
| Cupboard (Classic) | cupboard1.glb | Furniture | 3D model |
| Cupboard (Modern) | cupboard2.glb | Furniture | 3D model |
| Lamp | lamp.glb | Furniture | 3D model |
| Office Desk | office_desk.glb | Furniture | 3D model |
| Sofa | sofa.glb | Furniture | 3D model |
| Table | table.glb | Furniture | 3D model |
| TV | tv.glb | Furniture | 3D model |
| Wardrobe | wardrobe.glb | Furniture | 3D model |

**Attribution:** 3D models in `src/assets/models/` are used for the room designer. If sourced from external sites (e.g. Sketchfab, Poly Pizza, Free3D), the original creator and license should be credited here. User-uploaded models are stored in `server/uploads/` and are provided by application users.

### 7.3 Textures (Floor & Walls)

**Location:** `HCI-Coursework-Project/src/assets/textures/`

| Type | Files | Use |
|------|-------|-----|
| Floor | floor_plain.jpg, floor_wood.jpg, floor_marble.jpg | Room floor textures |
| Walls | wall_plain.jpg, wall_brick.jpg, wall_pattern.jpg | Room wall textures |

**Attribution:** Floor and wall textures are used for room customization. If sourced from external texture libraries (e.g. Poly Haven, Textures.com), the original source and license should be credited here.

### 7.4 Icons

| Resource | Source | License | Use |
|----------|--------|---------|-----|
| Lucide React | [lucide.dev](https://lucide.dev) | MIT | UI icons (ArrowRight, Sparkles, Layout, Users, Mail, MapPin, Phone, Eye, EyeOff, etc.) |

### 7.5 Fonts

| Font | Source | License |
|------|--------|---------|
| Inter | [Google Fonts](https://fonts.google.com/specimen/Inter) | SIL Open Font License 1.1 |

### 7.6 Sound Effects & Audio

*No sound effects or audio assets are currently used in this project.*

### 7.7 Libraries & Frameworks (Summary)

| Package | License |
|---------|---------|
| React, Vite, React Router | MIT |
| React Three Fiber, @react-three/drei, Three.js | MIT |
| Tailwind CSS, Motion, MUI, Lucide React | MIT |
| Express, Mongoose, bcryptjs, jsonwebtoken | MIT |
| Firebase | Apache 2.0 |

---

## 8. API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/health | Server & database status |
| POST | /api/auth/login | User login |
| POST | /api/auth/signup | User registration |
| POST | /api/auth/social | OAuth (Google/Facebook) |
| GET | /api/auth/me | Current user (protected) |
| POST | /api/rooms/save | Save room design |
| GET | /api/rooms/all | List saved rooms |
| GET | /api/furniture/all | List furniture items |
| POST | /api/furniture/add | Add furniture (admin) |
| POST | /api/contact | Submit contact message |
| GET | /api/contact | List messages (admin) |

---

## 9. License & Disclaimer

This project is developed for **educational purposes** as part of HCI (Human–Computer Interaction) coursework. External assets retain their respective licenses as noted in Section 7. No commercial use of third-party assets is implied beyond their stated licenses.

---

## 10. References

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [Three.js](https://threejs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [MongoDB](https://www.mongodb.com/)
- [Express](https://expressjs.com/)
