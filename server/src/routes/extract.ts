/**
 * POST /api/extract
 *
 * Accepts a citizenship certificate image (JPEG/PNG/WEBP, max 10 MB),
 * sends it to Gemini for OCR, and returns structured extraction data.
 *
 * Security:
 * - Image is held in memory only during the API call
 * - No image data is logged or persisted
 * - No PII is written to console
 */

import { Router, Request, Response } from "express";
import multer from "multer";
import { extractCitizenship } from "../ai/extractCitizenship.js";
import type { ExtractResponse } from "../types/extraction.js";

const router = Router();

// Configure multer — store in memory, limit to 10 MB
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, PNG, and WEBP images are accepted"));
    }
  },
});

router.post(
  "/extract",
  upload.single("citizenship"),
  async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        const response: ExtractResponse = {
          success: false,
          error: "No image file provided. Upload a citizenship certificate image.",
        };
        res.status(400).json(response);
        return;
      }

      // Log only non-PII metadata
      console.log(
        `[extract] Processing image: ${req.file.originalname} (${(req.file.size / 1024).toFixed(1)} KB, ${req.file.mimetype})`
      );

      const result = await extractCitizenship(
        req.file.buffer,
        req.file.mimetype
      );

      // Warn if confidence is very low
      if (result.confidence <= 0.3) {
        console.log(
          `[extract] Low confidence extraction (${result.confidence.toFixed(2)}) — image may be blurry or not a citizenship certificate`
        );
      }

      const response: ExtractResponse = {
        success: true,
        data: result,
      };

      res.json(response);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred during extraction";

      console.error(`[extract] Error: ${message}`);

      const response: ExtractResponse = {
        success: false,
        error: message,
      };

      res.status(500).json(response);
    }
  }
);

export default router;
