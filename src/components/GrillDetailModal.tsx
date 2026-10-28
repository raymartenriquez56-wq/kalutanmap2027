/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { 
  X, 
  MapPin, 
  ShieldAlert, 
  Package, 
  Flame, 
  Bookmark, 
  BookmarkCheck, 
  ExternalLink, 
  Compass, 
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Store
} from 'lucide-react';
import { GrillInfo, SECTORS, LANDMARKS_BESIDE_SLOTS } from '../data/mapData';

interface GrillDetailModalProps {
  grill: GrillInfo | null;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (grillNum: number) => void;
  onFocusMap: () => void;
}

export const GrillDetailModal: React.FC<GrillDetailModalProps> = ({
  grill,
  onClose,
  isSaved,
  onToggleSave,
  onFocusMap
}) => {
  if (!grill) return null;

  const sector = SECTORS.find(s => s.id === grill.sectorId);

  // Find the exact landmark directly beside this grill slot
  const besideLandmark = useMemo(() => {
    if (!grill) return null;
    const side = grill.row === 'top' ? 'north' : 'south';
    const candidates = LANDMARKS_BESIDE_SLOTS.filter(lm => lm.side === side || lm.side === 'road');
    let best = candidates[0];
    let bestDist = Infinity;
    const grillCenterX = grill.slotX + grill.slotW / 2;
    candidates.forEach(lm => {
      const lmCenterX = lm.x + lm.w / 2;
      const dist = Math.abs(lmCenterX - grillCenterX);
      if (dist < bestDist) {
        bestDist = dist;
        best = lm;
      }
    });
    return best;
  }, [grill]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div 
          className="relative px-6 py-5 flex items-center justify-between border-b border-slate-800"
          style={{
            background: `linear-gradient(135deg, ${sector?.color || '#3b82f6'}22 0%, rgba(15, 23, 42, 0.95) 100%)`
          }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center font-mono text-2xl font-black text-white shadow-lg"
              style={{ backgroundColor: sector?.color || '#3b82f6' }}
            >
              #{grill.number}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">Grill Table #{grill.number}</h3>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                  {grill.row === 'top' ? 'North Row (1–222)' : 'South Row (223–414)'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {sector?.name} · {sector?.title}
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Quick Spatial Specs */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Assigned Sector
              </span>
              <div className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: sector?.color }} />
                {sector?.name}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">{sector?.tagline}</p>
            </div>

            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Entertainment Stage
              </span>
              <div className="text-sm font-semibold text-amber-300 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-400" />
                {grill.stage}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Live acoustics & performances</p>
            </div>
          </div>

          {/* Key Surrounding Checkpoints */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Surrounding Checkpoints
            </h4>

            {/* Landmark Directly Beside This Slot */}
            {besideLandmark && (
              <div className="flex items-start gap-3 p-3.5 bg-amber-500/10 rounded-xl border border-amber-500/30 shadow-sm">
                <Store className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                      Landmark Directly Beside This Slot ({grill.row === 'top' ? 'North Curb' : 'South Curb'})
                    </span>
                    <span className="text-[10px] font-mono font-bold text-amber-300">
                      {besideLandmark.adjacentGrills}
                    </span>
                  </div>
                  <h5 className="text-sm font-bold text-white mt-0.5">{besideLandmark.name}</h5>
                  <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">{besideLandmark.description}</p>
                </div>
              </div>
            )}

            {/* General Nearby Area */}
            <div className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs text-slate-400 block">General Area Checkpoint</span>
                <span className="text-sm font-semibold text-slate-200">{grill.landmarkNear}</span>
              </div>
            </div>

            {/* Police Post */}
            <div className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
              <ShieldAlert className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs text-slate-400 block">Assigned Security & Patrol Post</span>
                <span className="text-sm font-semibold text-slate-200">{grill.nearestPolice}</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">Equipped with emergency water bucket & first responder radio</span>
              </div>
            </div>

            {/* Claiming Station */}
            <div className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
              <Package className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs text-slate-400 block">Designated Kit Claiming Station</span>
                <span className="text-sm font-semibold text-slate-200">{grill.nearestClaiming}</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">Claim your 5 fresh Bangus, charcoal bag, match & tongs</span>
              </div>
            </div>
          </div>

          {/* Claiming Checklist */}
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs space-y-2">
            <div className="flex items-center gap-1.5 font-semibold text-amber-300">
              <CheckCircle2 className="w-4 h-4" />
              <span>Participant Kit Inclusions</span>
            </div>
            <ul className="text-slate-300 space-y-1 pl-5 list-disc">
              <li>5 Large Fresh Dagupan/Mapandan Milkfish (Bangus)</li>
              <li>1 Pack Hardwood Charcoal (Uling) & Firestarter</li>
              <li>Standard Portable Iron Grill Table + Tongs</li>
              <li>Official Kalutan ed Dalan 2027 Commemorative Apron</li>
            </ul>
          </div>

          {/* Safety Notice */}
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
            <span>
              Simultaneous lighting begins promptly at 5:00 PM. Please maintain the 2-meter emergency lane free from chairs and coolers.
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between gap-3">
          <button 
            onClick={() => onToggleSave(grill.number)}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl border transition-colors ${
              isSaved 
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30' 
                : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
            }`}
          >
            {isSaved ? (
              <>
                <BookmarkCheck className="w-4 h-4 text-amber-400" />
                <span>My Assigned Grill</span>
              </>
            ) : (
              <>
                <Bookmark className="w-4 h-4" />
                <span>Save As My Grill</span>
              </>
            )}
          </button>

          <button 
            onClick={() => {
              onFocusMap();
              onClose();
            }}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md transition-colors"
          >
            <Compass className="w-4 h-4" />
            <span>Center on Map</span>
          </button>
        </div>
      </div>
    </div>
  );
};
