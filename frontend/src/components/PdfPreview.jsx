import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import {
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Loader2
} from 'lucide-react';

// Configure worker locally for bundle-safe, offline-ready operation
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.js?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export default function PdfPreview({ fileUrl }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [pdf, setPdf] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(1.0);
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [error, setError] = useState(null);

  // Fetch PDF document when URL changes
  useEffect(() => {
    if (!fileUrl) return;

    setLoading(true);
    setError(null);
    setPageNumber(1);

    console.log("PDF URL:", fileUrl);
    const loadingTask = pdfjsLib.getDocument({
      url: fileUrl,
      withCredentials: false
    });
    loadingTask.promise
      .then((pdfDoc) => {
        console.log("PDF Loaded Successfully");
        setPdf(pdfDoc);
        setNumPages(pdfDoc.numPages);
        setLoading(false);
      })
      .catch((err) => {
        console.error("========== PDF ERROR ==========");
        console.error(err);
        console.error("name:", err.name);
        console.error("message:", err.message);
        console.error("stack:", err.stack);

        setError(err.message);
        setLoading(false);
      });

    return () => {
      // Don't destroy the worker during normal component updates.
    };
  }, [fileUrl]);

  // Render current page to canvas when PDF, pageNumber, or scale changes
  useEffect(() => {
    if (!pdf) return;

    let renderTask = null;

    const renderPage = async () => {
      try {
        const page = await pdf.getPage(pageNumber);
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        const viewport = page.getViewport({ scale });

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        renderTask = page.render(renderContext);
        await renderTask.promise;
      } catch (err) {
        if (err.name !== 'RenderingCancelledException') {
          console.error('Error rendering PDF page:', err);
        }
      }
    };

    renderPage();

    return () => {
      if (renderTask?.cancel) {
        try {
          renderTask.cancel();
        } catch { }
      }
    };
  }, [pdf, pageNumber, scale]);

  // Handle page change
  const changePage = (offset) => {
    setPageNumber((prevPageNumber) => {
      const newPage = prevPageNumber + offset;
      return Math.min(Math.max(newPage, 1), numPages);
    });
  };

  // Zoom controls
  const zoom = (factor) => {
    setScale((prevScale) => {
      const newScale = prevScale + factor;
      return Math.min(Math.max(newScale, 0.5), 3.0);
    });
  };

  // Fullscreen controls
  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch((err) => {
        console.error('Error enabling fullscreen:', err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  // Monitor fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`flex flex-col items-center justify-between border border-brand-border/60 bg-[#06090f] rounded-2xl overflow-hidden transition-all duration-300 ${isFullscreen ? 'w-screen h-screen p-6 fixed inset-0 z-50 bg-[#03060a]' : 'w-full min-h-[450px]'
        }`}
    >
      {/* Control bar */}
      <div className="w-full flex items-center justify-between gap-4 p-3 border-b border-brand-border/50 bg-[#090d16]/90 backdrop-blur-md">
        <div className="flex items-center gap-1">
          <button
            onClick={() => changePage(-1)}
            disabled={pageNumber <= 1 || loading}
            className="p-1.5 hover:bg-white/10 rounded-lg text-slate-300 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-all"
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-[10px] font-bold text-white px-2">
            Page {pageNumber} of {numPages || '?'}
          </span>

          <button
            onClick={() => changePage(1)}
            disabled={pageNumber >= numPages || loading}
            className="p-1.5 hover:bg-white/10 rounded-lg text-slate-300 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-all"
            title="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => zoom(-0.2)}
            disabled={scale <= 0.6 || loading}
            className="p-1.5 hover:bg-white/10 rounded-lg text-slate-300 disabled:opacity-30 cursor-pointer transition-all"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <span className="text-[10px] font-bold text-white px-1.5">
            {Math.round(scale * 100)}%
          </span>

          <button
            onClick={() => zoom(0.2)}
            disabled={scale >= 2.8 || loading}
            className="p-1.5 hover:bg-white/10 rounded-lg text-slate-300 disabled:opacity-30 cursor-pointer transition-all"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <span className="w-[1px] h-4 bg-brand-border/50 mx-1" />

          <button
            onClick={toggleFullscreen}
            disabled={loading}
            className="p-1.5 hover:bg-white/10 rounded-lg text-slate-300 cursor-pointer transition-all"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Preview"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Render area */}
      <div className={`w-full flex-1 flex items-center justify-center p-4 overflow-auto ${isFullscreen ? 'max-h-[calc(100vh-80px)]' : 'max-h-[500px]'}`}>
        {loading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Loading PDF Viewer...</p>
          </div>
        ) : error ? (
          <div className="text-center p-6 border border-brand-error/20 bg-brand-error/5 rounded-xl max-w-sm">
            <p className="text-xs text-brand-error font-semibold">{error}</p>
          </div>
        ) : (
          <div className="shadow-2xl border border-brand-border bg-white rounded overflow-hidden">
            <canvas ref={canvasRef} />
          </div>
        )}
      </div>
    </div>
  );
}
