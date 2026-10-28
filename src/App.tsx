/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Search, 
  Bookmark, 
  FileText, 
  BookOpen, 
  MapPin, 
  ShieldAlert, 
  Sparkles,
  Layers,
  ChevronRight,
  Printer,
  Move,
  Sliders
} from 'lucide-react';
import { InteractiveMap } from './components/InteractiveMap';
import { GrillDetailModal } from './components/GrillDetailModal';
import { GrillFinderModal } from './components/GrillFinderModal';
import { PoiDetailModal } from './components/PoiDetailModal';
import { PoiSidebar } from './components/PoiSidebar';
import { LayoutPdfModal } from './components/LayoutPdfModal';
import { MyGrillDrawer } from './components/MyGrillDrawer';
import { FestivalGuideModal } from './components/FestivalGuideModal';
import { LandmarkDetailModal } from './components/LandmarkDetailModal';
import { LandmarkShapeEditorDrawer } from './components/LandmarkShapeEditorDrawer';
import { ALL_GRILLS, GrillInfo, POI, LandmarkBesideSlot, LANDMARKS_BESIDE_SLOTS } from './data/mapData';

export default function App() {
  // Selected Map Entities
  const [selectedGrill, setSelectedGrill] = useState<GrillInfo | null>(null);
  const [selectedPoi, setSelectedPoi] = useState<POI | null>(null);
  const [selectedLandmark, setSelectedLandmark] = useState<LandmarkBesideSlot | null>(null);

  // Customizable / Adjustable Landmark Shapes
  const [landmarks, setLandmarks] = useState<LandmarkBesideSlot[]>(() => {
    try {
      const saved = localStorage.getItem('mapandan_landmarks_custom');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return LANDMARKS_BESIDE_SLOTS;
  });

  const [isShapeEditOpen, setIsShapeEditOpen] = useState<boolean>(false);
  const [activeEditLandmarkId, setActiveEditLandmarkId] = useState<string | null>(null);

  const handleUpdateLandmark = (updated: LandmarkBesideSlot) => {
    setLandmarks(prev => {
      const next = prev.map(lm => lm.id === updated.id ? updated : lm);
      localStorage.setItem('mapandan_landmarks_custom', JSON.stringify(next));
      return next;
    });
    if (selectedLandmark?.id === updated.id) {
      setSelectedLandmark(updated);
    }
  };

  const handleResetLandmark = (id: string) => {
    const orig = LANDMARKS_BESIDE_SLOTS.find(lm => lm.id === id);
    if (orig) {
      handleUpdateLandmark(orig);
    }
  };

  const handleResetAllLandmarks = () => {
    setLandmarks(LANDMARKS_BESIDE_SLOTS);
    localStorage.removeItem('mapandan_landmarks_custom');
    if (selectedLandmark) {
      const orig = LANDMARKS_BESIDE_SLOTS.find(lm => lm.id === selectedLandmark.id);
      if (orig) setSelectedLandmark(orig);
    }
  };

  // Saved Grill in LocalStorage
  const [savedGrillNum, setSavedGrillNum] = useState<number | null>(() => {
    const saved = localStorage.getItem('kalutan_saved_grill');
    return saved ? parseInt(saved, 10) : null;
  });

  // Modal / Drawer visibility states
  const [isFinderOpen, setIsFinderOpen] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false);
  const [isMyGrillDrawerOpen, setIsMyGrillDrawerOpen] = useState<boolean>(false);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);

  // Quick search query for the top search bar
  const [quickSearchInput, setQuickSearchInput] = useState<string>('');

  // Save / Toggle Saved Grill
  const handleToggleSaveGrill = (num: number) => {
    if (savedGrillNum === num) {
      setSavedGrillNum(null);
      localStorage.removeItem('kalutan_saved_grill');
    } else {
      setSavedGrillNum(num);
      localStorage.setItem('kalutan_saved_grill', num.toString());
    }
  };

  const handleClearSavedGrill = () => {
    setSavedGrillNum(null);
    localStorage.removeItem('kalutan_saved_grill');
  };

  // Quick search submit
  const handleQuickSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = quickSearchInput.trim();
    if (!query) return;

    // Check if it's a number
    const num = parseInt(query.replace(/^(grill|table|#)\s*/i, ''), 10);
    if (!isNaN(num) && ALL_GRILLS.has(num)) {
      const grill = ALL_GRILLS.get(num)!;
      setSelectedGrill(grill);
      setQuickSearchInput('');
      return;
    }

    // Otherwise open finder modal with this search query
    setIsFinderOpen(true);
  };

  return (
    <div className="relative w-screen h-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* SECTION 2: TOP BAR CONTRACT */}
      {/* [Brand title, one line] — [4–5 nav links, 1–2 word labels, single-line] — [1 primary action] */}
      <header className="flex items-center justify-between gap-8 px-6 py-3.5 bg-slate-900/95 border-b border-slate-800 z-30 shrink-0">
        {/* Zone 1: Single text element wordmark */}
        <a 
          href="/" 
          className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 flex items-center gap-2 hover:text-amber-400 transition-colors"
        >
          <Flame className="w-5 h-5 text-amber-500 fill-amber-500/20" />
          <span>Kalutan ed Dalan 2027</span>
        </a>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button 
            onClick={() => setIsFinderOpen(true)} 
            className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 text-left"
          >
            Grill Directory
          </button>
          <button 
            onClick={() => setIsSidebarOpen(true)} 
            className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 text-left"
          >
            Map Directory
          </button>
          <button 
            onClick={() => setIsGuideOpen(true)} 
            className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 text-left"
          >
            Festival Guidelines
          </button>
          <button 
            onClick={() => setIsPdfModalOpen(true)} 
            className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 text-left"
          >
            CAD Blueprint
          </button>
          <button 
            onClick={() => setIsShapeEditOpen(prev => !prev)} 
            className={`transition-colors whitespace-nowrap shrink-0 text-left flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${
              isShapeEditOpen ? 'bg-sky-500/20 text-sky-400 font-bold border border-sky-500/40' : 'hover:text-amber-400'
            }`}
            title="Adjust, move, or reshape landmark shapes directly on the map"
          >
            <Move className="w-3.5 h-3.5" />
            <span>Adjust Shapes</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Quick Grill Number Search Bar */}
          <form onSubmit={handleQuickSearchSubmit} className="hidden sm:flex items-center relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
            <input 
              type="text"
              placeholder="Jump to Grill # (1-414)..."
              value={quickSearchInput}
              onChange={(e) => setQuickSearchInput(e.target.value)}
              className="w-48 bg-slate-950 border border-slate-700/80 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </form>

          {/* Primary Action Button */}
          <button 
            onClick={() => {
              if (savedGrillNum) {
                setIsMyGrillDrawerOpen(true);
              } else {
                setIsFinderOpen(true);
              }
            }}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-md flex items-center gap-1.5"
          >
            {savedGrillNum ? (
              <>
                <Bookmark className="w-3.5 h-3.5 fill-slate-950" />
                <span>My Table #{savedGrillNum}</span>
              </>
            ) : (
              <>
                <Search className="w-3.5 h-3.5" />
                <span>Find My Grill</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* SECONDARY INFO STRIP: CONTEXT & METRICS */}
      <div className="px-6 py-2 bg-slate-900/60 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-400 shrink-0 overflow-x-auto">
        <div className="flex items-center gap-2 whitespace-nowrap">
          <span className="font-semibold text-slate-300">Mapandan, Pangasinan</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>Town Fiesta Grilling Festival</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="font-mono text-amber-400">414 Grill Tables</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>1.2 km Main Arterial Street</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>Simultaneous Lighting: 5:00 PM</span>
        </div>

        <div className="hidden md:flex items-center gap-3 whitespace-nowrap text-[11px]">
          <button 
            onClick={() => setIsPdfModalOpen(true)}
            className="text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>View Original PDF</span>
          </button>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <button 
            onClick={() => setIsGuideOpen(true)}
            className="text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Claiming Guidelines</span>
          </button>
        </div>
      </div>

      {/* MAIN INTERACTIVE MAP CANVAS CONTAINER */}
      <main className="relative flex-1 w-full h-full overflow-hidden">
        <InteractiveMap 
          selectedGrill={selectedGrill}
          onSelectGrill={(grill) => setSelectedGrill(grill)}
          selectedPoi={selectedPoi}
          onSelectPoi={(poi) => setSelectedPoi(poi)}
          savedGrillNum={savedGrillNum}
          selectedLandmark={selectedLandmark}
          onSelectLandmark={(landmark) => {
            setSelectedLandmark(landmark);
            if (landmark) setActiveEditLandmarkId(landmark.id);
          }}
          landmarks={landmarks}
          onUpdateLandmark={handleUpdateLandmark}
          isShapeEditMode={isShapeEditOpen}
          onToggleShapeEditMode={() => setIsShapeEditOpen(prev => !prev)}
          activeEditLandmarkId={activeEditLandmarkId}
          onSelectEditLandmarkId={(id) => {
            setActiveEditLandmarkId(id);
            const lm = landmarks.find(l => l.id === id);
            if (lm) setSelectedLandmark(lm);
          }}
        />
      </main>

      {/* MODALS & DRAWERS */}
      {/* 1. Grill Details Modal */}
      <GrillDetailModal 
        grill={selectedGrill}
        onClose={() => setSelectedGrill(null)}
        isSaved={selectedGrill ? savedGrillNum === selectedGrill.number : false}
        onToggleSave={handleToggleSaveGrill}
        onFocusMap={() => {
          // Keep selected to keep focus
        }}
      />

      {/* 2. Grill Finder Search Modal */}
      <GrillFinderModal 
        isOpen={isFinderOpen}
        onClose={() => setIsFinderOpen(false)}
        onSelectGrill={(grill) => {
          setSelectedGrill(grill);
          setSelectedPoi(null);
        }}
        savedGrillNum={savedGrillNum}
      />

      {/* 3. POI Details Modal */}
      <PoiDetailModal 
        poi={selectedPoi}
        onClose={() => setSelectedPoi(null)}
        onFocusMap={() => {
          // Keep selected to keep focus
        }}
      />

      {/* 4. POI & Landmarks Directory Drawer */}
      <PoiSidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onSelectPoi={(poi) => {
          setSelectedPoi(poi);
          setSelectedGrill(null);
        }}
        onOpenGrillFinder={() => setIsFinderOpen(true)}
        onSelectLandmark={(lm) => {
          setSelectedLandmark(lm);
          setActiveEditLandmarkId(lm.id);
          setSelectedGrill(null);
        }}
        landmarks={landmarks}
      />

      {/* 5. Original CAD PDF Layout Modal */}
      <LayoutPdfModal 
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
      />

      {/* 6. My Participant Pass Drawer */}
      <MyGrillDrawer 
        isOpen={isMyGrillDrawerOpen}
        onClose={() => setIsMyGrillDrawerOpen(false)}
        savedGrillNum={savedGrillNum}
        onSelectGrillNum={(num) => {
          setSavedGrillNum(num);
          localStorage.setItem('kalutan_saved_grill', num.toString());
          const grill = ALL_GRILLS.get(num);
          if (grill) setSelectedGrill(grill);
        }}
        onClearSavedGrill={handleClearSavedGrill}
        onFocusGrill={(grill) => {
          setSelectedGrill(grill);
        }}
      />

      {/* 7. Festival Guide Modal */}
      <FestivalGuideModal 
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* 8. Landmark Beside Slots Detail Modal */}
      <LandmarkDetailModal 
        landmark={selectedLandmark}
        onClose={() => setSelectedLandmark(null)}
        onSelectAdjacentGrills={(lm) => {
          // Extract first number in adjacentGrills string (e.g. "Grills 392 – 404")
          const match = lm.adjacentGrills.match(/\d+/);
          if (match) {
            const num = parseInt(match[0], 10);
            const grill = ALL_GRILLS.get(num);
            if (grill) {
              setSelectedGrill(grill);
            }
          }
        }}
      />

      {/* 9. Landmark Shape & Position Interactive Editor Drawer */}
      <LandmarkShapeEditorDrawer 
        isOpen={isShapeEditOpen}
        onClose={() => setIsShapeEditOpen(false)}
        landmarks={landmarks}
        selectedLandmarkId={activeEditLandmarkId || selectedLandmark?.id || null}
        onSelectLandmarkId={(id) => {
          setActiveEditLandmarkId(id);
          const lm = landmarks.find(l => l.id === id);
          if (lm) setSelectedLandmark(lm);
        }}
        onUpdateLandmark={handleUpdateLandmark}
        onResetLandmark={handleResetLandmark}
        onResetAll={handleResetAllLandmarks}
        onFocusLandmark={(lm) => {
          setSelectedLandmark(lm);
          setActiveEditLandmarkId(lm.id);
        }}
      />
    </div>
  );
}
