/**
 * Zustand enrollment store — holds extracted data, draft,
 * and UI state for the entire enrollment flow.
 */

import { create } from "zustand";
import type { ExtractionResult } from "../types/extraction";

interface EnrollmentState {
  /** Raw extraction result from OCR */
  extractedData: ExtractionResult | null;

  /** Working draft pre-filled from extraction, editable by user */
  draft: ExtractionResult | null;

  /** Extraction UI state */
  isExtracting: boolean;
  extractionError: string | null;

  /** The uploaded image as a data URL for preview */
  imagePreview: string | null;

  /** Timestamp when user reviewed extraction (Phase 3) */
  reviewedAt: string | null;

  /** Actions */
  setExtractedData: (data: ExtractionResult) => void;
  setIsExtracting: (value: boolean) => void;
  setExtractionError: (error: string | null) => void;
  setImagePreview: (url: string | null) => void;
  updateDraftField: <K extends keyof ExtractionResult>(
    field: K,
    value: ExtractionResult[K]
  ) => void;
  resetStore: () => void;
}

const initialState = {
  extractedData: null,
  draft: null,
  isExtracting: false,
  extractionError: null,
  imagePreview: null,
  reviewedAt: null,
};

export const useEnrollmentStore = create<EnrollmentState>((set) => ({
  ...initialState,

  setExtractedData: (data) =>
    set({
      extractedData: data,
      draft: { ...data }, // Deep copy for independent editing
      extractionError: null,
    }),

  setIsExtracting: (value) =>
    set({ isExtracting: value }),

  setExtractionError: (error) =>
    set({ extractionError: error, isExtracting: false }),

  setImagePreview: (url) =>
    set({ imagePreview: url }),

  updateDraftField: (field, value) =>
    set((state) => {
      if (!state.draft) return state;
      return {
        draft: { ...state.draft, [field]: value },
      };
    }),

  resetStore: () => set(initialState),
}));
