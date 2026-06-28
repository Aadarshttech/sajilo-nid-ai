import { useCallback } from "react";
import DropZone from "../components/DropZone";
import JsonViewer from "../components/JsonViewer";
import { useEnrollmentStore } from "../store/enrollmentStore";
import type { ExtractResponse } from "../types/extraction";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";

export default function UploadPage() {
  const {
    extractedData,
    isExtracting,
    extractionError,
    imagePreview,
    setExtractedData,
    setIsExtracting,
    setExtractionError,
    setImagePreview,
    resetStore,
  } = useEnrollmentStore();

  const handleFileSelected = useCallback(
    async (file: File) => {
      // Show image preview
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);

      // Start extraction
      setIsExtracting(true);
      setExtractionError(null);

      try {
        const formData = new FormData();
        formData.append("citizenship", file);

        const response = await fetch(`${API_BASE}/api/extract`, {
          method: "POST",
          body: formData,
        });

        const result: ExtractResponse = await response.json();

        if (!response.ok || !result.success || !result.data) {
          throw new Error(
            result.error || "Failed to extract data from the image"
          );
        }

        setExtractedData(result.data);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred. Please try again.";
        setExtractionError(message);
      }
    },
    [setExtractedData, setIsExtracting, setExtractionError, setImagePreview]
  );

  const handleRetry = useCallback(() => {
    resetStore();
  }, [resetStore]);

  return (
    <div className="upload-page">
      {/* Hero Header */}
      <header className="upload-header">
        <div className="upload-header__flag">🇳🇵</div>
        <h1 className="upload-header__title">
          <span className="upload-header__title--np">स्मार्ट दर्ता</span>
          <span className="upload-header__title--en">Smart NID Nepal</span>
        </h1>
        <p className="upload-header__subtitle">
          AI-Powered National ID Pre-Enrollment
        </p>
        <p className="upload-header__description">
          Upload your citizenship certificate — AI will read it and fill out the
          entire NID enrollment form for you.
        </p>
      </header>

      <main className="upload-main">
        {/* Step indicator */}
        <div className="step-indicator">
          <div className={`step ${!extractedData ? "step--active" : "step--done"}`}>
            <span className="step__number">1</span>
            <span className="step__label">Upload</span>
          </div>
          <div className="step__connector" />
          <div className={`step ${extractedData ? "step--active" : ""}`}>
            <span className="step__number">2</span>
            <span className="step__label">Review</span>
          </div>
          <div className="step__connector" />
          <div className="step">
            <span className="step__number">3</span>
            <span className="step__label">Fill Form</span>
          </div>
        </div>

        {/* Upload Section */}
        {!extractedData && !isExtracting && (
          <div className="upload-section fade-in">
            <DropZone
              onFileSelected={handleFileSelected}
              disabled={isExtracting}
            />
          </div>
        )}

        {/* Loading State */}
        {isExtracting && (
          <div className="loading-section fade-in">
            {imagePreview && (
              <div className="loading-preview">
                <img
                  src={imagePreview}
                  alt="Uploaded citizenship certificate"
                  className="loading-preview__image"
                />
                <div className="loading-preview__overlay">
                  <div className="scan-line" />
                </div>
              </div>
            )}
            <div className="loading-status">
              <div className="loading-spinner" />
              <p className="loading-status__text">
                📄 Reading your citizenship certificate…
              </p>
              <p className="loading-status__subtext">
                नागरिकता प्रमाणपत्र पढ्दै…
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {extractionError && !isExtracting && (
          <div className="error-section fade-in">
            <div className="error-card">
              <div className="error-card__icon">⚠️</div>
              <h3 className="error-card__title">Extraction Failed</h3>
              <p className="error-card__message">{extractionError}</p>
              <button onClick={handleRetry} className="btn btn--primary">
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        {extractedData && !isExtracting && (
          <div className="results-section fade-in">
            <div className="results-layout">
              {/* Image preview */}
              {imagePreview && (
                <div className="results-image">
                  <h3 className="results-image__title">Uploaded Document</h3>
                  <img
                    src={imagePreview}
                    alt="Citizenship certificate"
                    className="results-image__img"
                  />
                </div>
              )}

              {/* Extracted data */}
              <div className="results-data">
                <div className="results-data__header">
                  <h3>Extracted Data</h3>
                  <button onClick={handleRetry} className="btn btn--outline btn--sm">
                    ↻ Re-upload
                  </button>
                </div>
                <JsonViewer data={extractedData} />
              </div>
            </div>

            {/* Continue button (placeholder for Phase 2) */}
            <div className="results-actions">
              <button className="btn btn--primary btn--lg" disabled>
                Continue to Enrollment Form →
              </button>
              <p className="results-actions__hint">
                Form filling will be available in Phase 2
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="upload-footer">
        <p>
          Smart NID Nepal is a prototype. No real data is submitted to DoNIDCR.
        </p>
        <p>
          Your image is processed securely and never stored.
        </p>
      </footer>
    </div>
  );
}
