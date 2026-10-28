/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Download, ExternalLink, FileText, Printer } from 'lucide-react';

interface LayoutPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LayoutPdfModal: React.FC<LayoutPdfModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const pdfUrl = '/assets/aistudio/Kalutan-ed-Dalan-2027-Layout-Merged__1__57ec3954.pdf';

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-6xl h-[90vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center border border-red-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                Official CAD Layout Blueprint (PDF)
              </h3>
              <p className="text-xs text-slate-400">
                Kalutan-ed-Dalan-2027-Layout-Merged__1__57ec3954.pdf · Municipal Engineering Office
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a 
              href={pdfUrl} 
              download="Kalutan-ed-Dalan-2027-Official-Layout.pdf"
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download PDF</span>
            </a>
            <a 
              href={pdfUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Open in Tab</span>
            </a>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PDF Viewer Frame with Image Fallback */}
        <div className="flex-1 bg-slate-950 p-2 overflow-auto flex items-center justify-center">
          <object 
            data={pdfUrl} 
            type="application/pdf"
            className="w-full h-full rounded-lg border border-slate-800"
          >
            {/* Fallback if browser inline PDF plugin is disabled */}
            <div className="text-center p-8 max-w-lg space-y-4">
              <FileText className="w-16 h-16 text-amber-500 mx-auto opacity-80" />
              <h4 className="text-base font-bold text-white">Blueprint Document Preview</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Your browser may not support embedded PDF rendering directly. You can view the high-resolution converted architectural schematic or open the original document in a new window.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <a 
                  href={pdfUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold shadow-lg hover:bg-amber-400"
                >
                  Open PDF Document
                </a>
              </div>
            </div>
          </object>
        </div>
      </div>
    </div>
  );
};
