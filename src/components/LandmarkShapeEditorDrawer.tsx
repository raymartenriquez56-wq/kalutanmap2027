/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Move, 
  Scaling, 
  RotateCcw, 
  Copy, 
  Check, 
  Download, 
  X, 
  Search, 
  ChevronRight, 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight,
  Maximize2,
  Sparkles,
  Info,
  Sliders,
  Compass
} from 'lucide-react';
import { LandmarkBesideSlot } from '../data/landmarksBesideSlots';
import { LANDMARKS_BESIDE_SLOTS as DEFAULT_LANDMARKS } from '../data/landmarksBesideSlots';

interface LandmarkShapeEditorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  landmarks: LandmarkBesideSlot[];
  selectedLandmarkId: string | null;
  onSelectLandmarkId: (id: string | null) => void;
  onUpdateLandmark: (updated: LandmarkBesideSlot) => void;
  onResetLandmark: (id: string) => void;
  onResetAll: () => void;
  onFocusLandmark: (lm: LandmarkBesideSlot) => void;
}

export const LandmarkShapeEditorDrawer: React.FC<LandmarkShapeEditorDrawerProps> = ({
  isOpen,
  onClose,
  landmarks,
  selectedLandmarkId,
  onSelectLandmarkId,
  onUpdateLandmark,
  onResetLandmark,
  onResetAll,
  onFocusLandmark
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [copiedItem, setCopiedItem] = useState<boolean>(false);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);
  const [stepSize, setStepSize] = useState<number>(10);

  if (!isOpen) return null;

  const activeLandmark = landmarks.find(lm => lm.id === selectedLandmarkId) || null;

  // Filtered landmarks for quick selection dropdown
  const filteredList = landmarks.filter(lm => 
    lm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lm.adjacentGrills.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lm.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNudge = (dx: number, dy: number) => {
    if (!activeLandmark) return;
    onUpdateLandmark({
      ...activeLandmark,
      x: Math.round(Math.max(0, activeLandmark.x + dx)),
      y: Math.round(Math.max(0, activeLandmark.y + dy))
    });
  };

  const handleResize = (dw: number, dh: number) => {
    if (!activeLandmark) return;
    onUpdateLandmark({
      ...activeLandmark,
      w: Math.round(Math.max(20, activeLandmark.w + dw)),
      h: Math.round(Math.max(15, activeLandmark.h + dh))
    });
  };

  const handleSetProp = (prop: 'x' | 'y' | 'w' | 'h', val: number) => {
    if (!activeLandmark) return;
    onUpdateLandmark({
      ...activeLandmark,
      [prop]: Math.round(Math.max(prop === 'w' || prop === 'h' ? 15 : 0, val))
    });
  };

  const handleCopySingle = () => {
    if (!activeLandmark) return;
    navigator.clipboard.writeText(JSON.stringify(activeLandmark, null, 2));
    setCopiedItem(true);
    setTimeout(() => setCopiedItem(false), 2000);
  };

  const handleCopyAll = () => {
    navigator.clipboard.writeText(JSON.stringify(landmarks, null, 2));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleDownloadJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(landmarks, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'mapandan_custom_landmarks.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <aside 
      className="fixed top-14 right-0 bottom-0 w-full sm:w-[420px] bg-slate-900/98 backdrop-blur-xl border-l border-slate-700/80 shadow-2xl z-40 flex flex-col text-slate-100 animate-in slide-in-from-right duration-200"
      aria-label="Landmark Shape Editor"
    >
      {/* HEADER */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between gap-3 bg-slate-950/60 shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
              <span>Landmark Shape Editor</span>
            </h2>
            <p className="text-[11px] text-slate-400">Move, resize & align landmark shapes</p>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          title="Close Editor"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* BODY SCROLLABLE */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* INTERACTIVE INSTRUCTIONS BANNER */}
        <div className="p-3 bg-sky-950/40 border border-sky-800/60 rounded-xl text-xs space-y-1.5">
          <div className="flex items-center gap-1.5 font-semibold text-sky-300">
            <Sparkles className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span>Interactive Canvas Controls</span>
          </div>
          <p className="text-[11px] text-sky-200/80 leading-relaxed">
            • <strong className="text-white">Click & Drag Body:</strong> Moves the shape anywhere on the map.<br />
            • <strong className="text-white">Drag Blue Handles:</strong> Corner and edge handles reshape width and height.<br />
            • <strong className="text-white">Nudge & Coordinate Inputs:</strong> Use the precision panel below for exact values.
          </p>
        </div>

        {/* LANDMARK SELECTOR */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Select Landmark ({landmarks.length} Total)
          </label>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
            <input 
              type="text"
              placeholder="Search landmark name or grills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          {/* Quick Dropdown select list */}
          <div className="max-h-36 overflow-y-auto bg-slate-950/80 border border-slate-800 rounded-lg divide-y divide-slate-900 text-xs">
            {filteredList.slice(0, 20).map(lm => {
              const isSelected = activeLandmark?.id === lm.id;
              return (
                <button
                  key={lm.id}
                  onClick={() => {
                    onSelectLandmarkId(lm.id);
                    onFocusLandmark(lm);
                  }}
                  className={`w-full text-left px-3 py-1.5 flex items-center justify-between transition-colors ${
                    isSelected ? 'bg-amber-500/20 text-amber-300 font-semibold' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="truncate pr-2">{lm.name}</span>
                  <span className="text-[10px] font-mono text-slate-500 shrink-0">
                    {lm.side === 'north' ? 'North' : 'South'}
                  </span>
                </button>
              );
            })}
            {filteredList.length === 0 && (
              <div className="p-3 text-center text-xs text-slate-500">No landmarks match search</div>
            )}
          </div>
        </div>

        {/* ACTIVE LANDMARK CONTROLS */}
        {activeLandmark ? (
          <div className="space-y-4 pt-2 border-t border-slate-800">
            {/* Active Landmark Info Card */}
            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white truncate max-w-[240px]">
                  {activeLandmark.name}
                </span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700">
                  {activeLandmark.side} curb
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                {activeLandmark.adjacentGrills}
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => onFocusLandmark(activeLandmark)}
                  className="text-[11px] text-sky-400 hover:text-sky-300 underline font-medium flex items-center gap-1"
                >
                  <Compass className="w-3 h-3" /> Focus on Map
                </button>
                <span className="text-slate-600">·</span>
                <button
                  onClick={() => onResetLandmark(activeLandmark.id)}
                  className="text-[11px] text-rose-400 hover:text-rose-300 underline font-medium flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Reset Shape
                </button>
              </div>
            </div>

            {/* STEP SIZE SELECTOR */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Step Nudge Size:</span>
              <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800">
                {[1, 5, 10, 50].map(s => (
                  <button
                    key={s}
                    onClick={() => setStepSize(s)}
                    className={`px-2 py-0.5 text-[10px] font-mono rounded ${
                      stepSize === s ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {s}px
                  </button>
                ))}
              </div>
            </div>

            {/* POSITION CONTROLS (X & Y) */}
            <div className="p-3 bg-slate-950/50 border border-slate-800/80 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Move className="w-3.5 h-3.5 text-amber-400" />
                  Position (X, Y)
                </span>
              </div>

              {/* Numeric Inputs */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">X (Horizontal)</label>
                  <div className="flex items-center gap-1">
                    <input 
                      type="number"
                      value={activeLandmark.x}
                      onChange={(e) => handleSetProp('x', parseInt(e.target.value, 10) || 0)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 font-mono text-xs text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Y (Vertical)</label>
                  <div className="flex items-center gap-1">
                    <input 
                      type="number"
                      value={activeLandmark.y}
                      onChange={(e) => handleSetProp('y', parseInt(e.target.value, 10) || 0)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 font-mono text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Nudge Directional Pad */}
              <div className="flex items-center justify-center pt-1">
                <div className="grid grid-cols-3 gap-1 w-32">
                  <div />
                  <button
                    onClick={() => handleNudge(0, -stepSize)}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 active:bg-amber-500 active:text-slate-950 rounded flex items-center justify-center text-slate-200 transition-colors"
                    title={`Nudge Up (-${stepSize}px)`}
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <div />
                  <button
                    onClick={() => handleNudge(-stepSize, 0)}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 active:bg-amber-500 active:text-slate-950 rounded flex items-center justify-center text-slate-200 transition-colors"
                    title={`Nudge Left (-${stepSize}px)`}
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <div className="p-1.5 bg-slate-950 border border-slate-800 rounded flex items-center justify-center text-[10px] font-mono text-slate-400">
                    ±{stepSize}
                  </div>
                  <button
                    onClick={() => handleNudge(stepSize, 0)}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 active:bg-amber-500 active:text-slate-950 rounded flex items-center justify-center text-slate-200 transition-colors"
                    title={`Nudge Right (+${stepSize}px)`}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <div />
                  <button
                    onClick={() => handleNudge(0, stepSize)}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 active:bg-amber-500 active:text-slate-950 rounded flex items-center justify-center text-slate-200 transition-colors"
                    title={`Nudge Down (+${stepSize}px)`}
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <div />
                </div>
              </div>
            </div>

            {/* DIMENSIONS CONTROLS (WIDTH & HEIGHT) */}
            <div className="p-3 bg-slate-950/50 border border-slate-800/80 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Scaling className="w-3.5 h-3.5 text-sky-400" />
                  Dimensions (Width × Height)
                </span>
              </div>

              {/* Numeric Inputs */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Width (W)</label>
                  <input 
                    type="number"
                    value={activeLandmark.w}
                    onChange={(e) => handleSetProp('w', parseInt(e.target.value, 10) || 20)}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 font-mono text-xs text-white"
                  />
                  <div className="flex items-center gap-1 mt-1">
                    <button 
                      onClick={() => handleResize(-stepSize, 0)} 
                      className="flex-1 py-0.5 bg-slate-800 hover:bg-slate-700 text-[10px] rounded"
                    >
                      -{stepSize}
                    </button>
                    <button 
                      onClick={() => handleResize(stepSize, 0)} 
                      className="flex-1 py-0.5 bg-slate-800 hover:bg-slate-700 text-[10px] rounded"
                    >
                      +{stepSize}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Height (H)</label>
                  <input 
                    type="number"
                    value={activeLandmark.h}
                    onChange={(e) => handleSetProp('h', parseInt(e.target.value, 10) || 15)}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 font-mono text-xs text-white"
                  />
                  <div className="flex items-center gap-1 mt-1">
                    <button 
                      onClick={() => handleResize(0, -stepSize)} 
                      className="flex-1 py-0.5 bg-slate-800 hover:bg-slate-700 text-[10px] rounded"
                    >
                      -{stepSize}
                    </button>
                    <button 
                      onClick={() => handleResize(0, stepSize)} 
                      className="flex-1 py-0.5 bg-slate-800 hover:bg-slate-700 text-[10px] rounded"
                    >
                      +{stepSize}
                    </button>
                  </div>
                </div>
              </div>

              {/* CURB ALIGNMENT PRESETS */}
              <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Quick Curb Presets
                </span>
                <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                  <button
                    onClick={() => {
                      onUpdateLandmark({
                        ...activeLandmark,
                        side: 'north',
                        y: activeLandmark.x < 1900 ? 620 : 950,
                        h: activeLandmark.x < 1900 ? 370 : 240
                      });
                    }}
                    className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-center transition-colors font-medium"
                  >
                    Align to North Curb
                  </button>
                  <button
                    onClick={() => {
                      onUpdateLandmark({
                        ...activeLandmark,
                        side: 'south',
                        y: 1450,
                        h: 62
                      });
                    }}
                    className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-center transition-colors font-medium"
                  >
                    Align to South Curb
                  </button>
                </div>
              </div>
            </div>

            {/* SINGLE LANDMARK EXPORT */}
            <div className="pt-2">
              <button
                onClick={handleCopySingle}
                className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                {copiedItem ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedItem ? 'Coordinates Copied!' : 'Copy Current Landmark JSON'}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400 space-y-2 border border-dashed border-slate-800 rounded-xl">
            <Move className="w-8 h-8 mx-auto text-slate-600 animate-pulse" />
            <p className="text-xs font-semibold text-slate-300">No Landmark Selected</p>
            <p className="text-[11px] text-slate-500">
              Click any establishment on the map or pick one from the list above to move or reshape it.
            </p>
          </div>
        )}

        {/* BULK ACTIONS / EXPORT */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
            Save & Export Configuration
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={handleCopyAll}
              className="py-2 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-colors shadow-md"
            >
              {copiedAll ? <Check className="w-3.5 h-3.5 text-slate-950" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedAll ? 'All Copied!' : 'Copy All JSON'}</span>
            </button>
            <button
              onClick={handleDownloadJSON}
              className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>
          </div>

          <button
            onClick={() => {
              if (window.confirm('Reset all landmark shapes and positions back to default CAD coordinates?')) {
                onResetAll();
              }
            }}
            className="w-full py-1.5 text-slate-400 hover:text-rose-400 text-xs flex items-center justify-center gap-1 transition-colors pt-2"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All Landmarks to Defaults</span>
          </button>
        </div>
      </div>

      {/* FOOTER */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400 shrink-0">
        <span className="text-[11px]">Auto-saved to LocalStorage</span>
        <button
          onClick={onClose}
          className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium text-xs transition-colors"
        >
          Done Adjusting
        </button>
      </div>
    </aside>
  );
};
