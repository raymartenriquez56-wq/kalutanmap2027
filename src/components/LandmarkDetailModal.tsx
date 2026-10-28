/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  X, 
  MapPin, 
  Compass, 
  Building2, 
  ShoppingBag, 
  Store, 
  ShieldAlert, 
  Package, 
  Flame,
  ArrowRight
} from 'lucide-react';
import { LandmarkBesideSlot } from '../data/landmarksBesideSlots';

interface LandmarkDetailModalProps {
  landmark: LandmarkBesideSlot | null;
  onClose: () => void;
  onSelectAdjacentGrills: (landmark: LandmarkBesideSlot) => void;
}

export const LandmarkDetailModal: React.FC<LandmarkDetailModalProps> = ({
  landmark,
  onClose,
  onSelectAdjacentGrills
}) => {
  if (!landmark) return null;

  let themeColor = '#6366f1';
  let Icon = Store;
  let categoryLabel = 'Establishment';

  if (landmark.category === 'government') {
    themeColor = '#10b981';
    Icon = Building2;
    categoryLabel = 'Civic & Government';
  } else if (landmark.category === 'police') {
    themeColor = '#3b82f6';
    Icon = ShieldAlert;
    categoryLabel = 'Police & Security';
  } else if (landmark.category === 'medical') {
    themeColor = '#ef4444';
    Icon = ShieldAlert;
    categoryLabel = 'Medical & First Aid';
  } else if (landmark.category === 'claiming') {
    themeColor = '#f59e0b';
    Icon = Package;
    categoryLabel = 'Kit Claiming Station';
  } else if (landmark.category === 'market') {
    themeColor = '#ea580c';
    Icon = ShoppingBag;
    categoryLabel = 'Public Market Hub';
  } else if (landmark.category === 'stage') {
    themeColor = '#dc2626';
    Icon = Flame;
    categoryLabel = 'Festival Stage';
  } else if (landmark.category === 'park') {
    themeColor = '#059669';
    Icon = MapPin;
    categoryLabel = 'Public Plaza & Park';
  } else if (landmark.category === 'residence') {
    themeColor = '#64748b';
    Icon = Building2;
    categoryLabel = 'Residential Lot';
  }

  const sideLabel = landmark.side === 'north' 
    ? 'North Side (Above Top Row)' 
    : landmark.side === 'south' 
    ? 'South Side (Below Bottom Row)' 
    : 'Center Street Arterial';

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          className="relative px-6 py-5 flex items-center justify-between border-b border-slate-800"
          style={{
            background: `linear-gradient(135deg, ${themeColor}22 0%, rgba(15, 23, 42, 0.95) 100%)`
          }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-11 h-11 rounded-xl flex items-center justify-center shadow-lg text-white"
              style={{ backgroundColor: themeColor }}
            >
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <span 
                className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                style={{ 
                  backgroundColor: `${themeColor}25`,
                  color: themeColor,
                  border: `1px solid ${themeColor}40`
                }}
              >
                {categoryLabel}
              </span>
              <h3 className="text-base font-bold text-white mt-1 leading-snug">{landmark.name}</h3>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-4">
          {/* Spatial Side Strip */}
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">
                Corridor Position
              </span>
              <span className="text-slate-200 font-semibold">{sideLabel}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-semibold text-amber-400 tracking-wider block">
                Adjacent Grill Tables
              </span>
              <span className="text-amber-300 font-mono font-bold">{landmark.adjacentGrills}</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Landmark Description
            </span>
            <p className="text-xs text-slate-200 leading-relaxed bg-slate-800/40 p-3 rounded-xl border border-slate-700/40">
              {landmark.description}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-end gap-2">
          <button 
            onClick={() => {
              onSelectAdjacentGrills(landmark);
              onClose();
            }}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md transition-colors"
          >
            <span>View Adjacent Grill Slots</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
