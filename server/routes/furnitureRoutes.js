const express = require("express");
const router = express.Router();
const multer = require("multer");
const Furniture = require("../models/Furniture");

/* =================================
   MULTER STORAGE
================================= */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

/* =================================
   ADD FURNITURE
================================= */

router.post(
  "/add",
  upload.fields([
    { name: "model", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  async (req, res) => {
    try {

      const sizeArray = req.body.size
        ? req.body.size.split(",").map(Number)
        : [1, 1, 1];

      const modelPath = req.files?.model
        ? `/uploads/${req.files["model"][0].filename}`
        : "";

      const imagePath = req.files?.image
        ? `/uploads/${req.files["image"][0].filename}`
        : "";

      const furniture = new Furniture({
        category: req.body.category,
        name: req.body.name,
        size: sizeArray,
        color: req.body.color,
        model: modelPath,
        image: imagePath,
      });

      await furniture.save();

      res.json({
        success: true,
        message: "Furniture added",
        furniture,
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Add furniture failed" });
    }
  }
);


/* =================================
   GET ALL FURNITURE
================================= */

router.get("/all", async (req, res) => {
  try {

    const data = await Furniture.find();
    res.json(data);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Fetch failed" });
  }
});


/* =================================
   UPDATE FURNITURE
================================= */

router.put(
  "/update/:id",
  upload.fields([
    { name: "model", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  async (req, res) => {
    try {

      const updateData = {
        category: req.body.category,
        name: req.body.name,
        color: req.body.color,
      };

      if (req.body.size) {
        updateData.size = req.body.size.split(",").map(Number);
      }

      if (req.files?.model) {
        updateData.model = `/uploads/${req.files["model"][0].filename}`;
      }

      if (req.files?.image) {
        updateData.image = `/uploads/${req.files["image"][0].filename}`;
      }

      const updated = await Furniture.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );

      res.json({
        message: "Furniture updated",
        updated,
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Update failed" });
    }
  }
);


/* =================================
   DELETE FURNITURE
================================= */

router.delete("/delete/:id", async (req, res) => {
  try {

    await Furniture.findByIdAndDelete(req.params.id);

    res.json({ message: "Furniture deleted" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Delete failed" });
  }
});


module.exports = router;