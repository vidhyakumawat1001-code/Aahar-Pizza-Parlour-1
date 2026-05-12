import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import multer from "multer";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // Multer setup for local file uploads
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  });

  const upload = multer({ storage });

  // Paths to JSON files
  const MENU_PATH = path.join(process.cwd(), 'menuData.json');
  const GALLERY_PATH = path.join(process.cwd(), 'galleryData.json');
  const REVIEWS_PATH = path.join(process.cwd(), 'reviewsData.json');

  // Helper to read/write JSON
  const readData = (filePath: string) => {
    try {
      if (!fs.existsSync(filePath)) return [];
      const data = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : (parsed.items || parsed.images || parsed.reviews || []);
    } catch (e) {
      return [];
    }
  };

  const writeData = (filePath: string, data: any) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  };

  // API Routes
  app.get("/api/menu", (req, res) => {
    res.json(readData(MENU_PATH));
  });

  app.post("/api/menu", (req, res) => {
    let items = readData(MENU_PATH);
    const newItem = req.body;
    if (newItem.id) {
      items = items.map((item: any) => item.id === newItem.id ? newItem : item);
    } else {
      newItem.id = Date.now().toString();
      items.push(newItem);
    }
    writeData(MENU_PATH, items);
    res.json(newItem);
  });

  app.delete("/api/menu/:id", (req, res) => {
    const items = readData(MENU_PATH).filter((item: any) => item.id !== req.params.id);
    writeData(MENU_PATH, items);
    res.json({ success: true });
  });

  app.get("/api/gallery", (req, res) => {
    res.json(readData(GALLERY_PATH));
  });

  app.post("/api/gallery", (req, res) => {
    let images = readData(GALLERY_PATH);
    const newImg = req.body;
    newImg.id = Date.now().toString();
    images.push(newImg);
    writeData(GALLERY_PATH, images);
    res.json(newImg);
  });

  app.delete("/api/gallery/:id", (req, res) => {
    const images = readData(GALLERY_PATH).filter((img: any) => img.id !== req.params.id);
    writeData(GALLERY_PATH, images);
    res.json({ success: true });
  });

  app.get("/api/reviews", (req, res) => {
    res.json(readData(REVIEWS_PATH));
  });

  app.post("/api/reviews", (req, res) => {
    let reviews = readData(REVIEWS_PATH);
    const newReview = req.body;
    newReview.id = Date.now().toString();
    newReview.timestamp = new Date().toISOString();
    reviews.push(newReview);
    writeData(REVIEWS_PATH, reviews);
    res.json(newReview);
  });

  // Photo Upload Endpoint
  app.post("/api/upload", upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    // Return the relative URL from the public folder
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Basic static serving for production
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
