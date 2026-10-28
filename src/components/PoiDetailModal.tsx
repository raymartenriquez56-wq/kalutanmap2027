/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  X, 
  MapPin, 
  Compass, 
  Flame, 
  ShieldAlert, 
  Package, 
  Building2, 
  ShoppingBag, 
  Navigation,
  Info
} from 'lucide-react';
import { POI, SECTORS } from '../data/mapData';

interface PoiDetailModalProps {
  poi: POI | null;
  onClose: () => void;
  onFocusMap: () => void;
}

export const PoiDetailModal: React.FC<PoiDetailModalProps> = ({
  poi,
  onClose,
  onFocusMap
}) => {
  if (!poi) return null;

  const sector = SECTORS.find(s => s.id === poi.sectorId);

  let categoryBadge = 'Landmark';
  let categoryColor = '#3b82f6';
  let CategoryIcon = MapPin;

  if (poi.category === 'stage') {
    categoryBadge = 'Festival Stage';
    categoryColor = '#ef4444';
    CategoryIcon = Flame;
  } else if (poi.category === 'police') {
    categoryBadge = 'Police Patrol Post';
    categoryColor = '#3b82f6';
    CategoryIcon = ShieldAlert;
  } else if (poi.category === 'medical') {
    categoryBadge = 'Medical & First Aid';
    categoryColor = '#dc2626';
    CategoryIcon = ShieldAlert;
  } else if (poi.category === 'claiming') {
    categoryBadge = 'Grill Kit Claiming';
    categoryColor = '#f59e0b';
    CategoryIcon = Package;
  } else if (poi.category === 'government') {
    categoryBadge = 'Civic & Government';
    categoryColor = '#10b981';
    CategoryIcon = Building2;
  } else if (poi.category === 'commercial') {
    categoryBadge = 'Commercial Anchor';
    categoryColor = '#8b5cf6';
    CategoryIcon = ShoppingBag;
  }

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
            background: `linear-gradient(135deg, ${categoryColor}22 0%, rgba(15, 23, 42, 0.95) 100%)`
          }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-11 h-11 rounded-xl flex items-center justify-center shadow-lg text-white"
              style={{ backgroundColor: categoryColor }}
            >
              <CategoryIcon className="w-6 h-6" />
            </div>
            <div>
              <span 
                className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                style={{ 
                  backgroundColor: `${categoryColor}25`,
                  color: categoryColor,
                  border: `1px solid ${categoryColor}40`
                }}
              >
                {categoryBadge}
              </span>
              <h3 className="text-base font-bold text-white mt-1 leading-snug">{poi.name}</h3>
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
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs">
            <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block mb-1">
              Sector Location
            </span>
            <div className="text-slate-200 font-semibold flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: sector?.color }} />
              {sector?.name} · {sector?.title}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Description & Details
            </span>
            <p className="text-xs text-slate-200 leading-relaxed bg-slate-800/40 p-3 rounded-xl border border-slate-700/40">
              {poi.description}
            </p>
          </div>

          {poi.details && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs space-y-1">
              <span className="font-semibold text-amber-300 block">Notice & Instructions:</span>
              <p className="text-slate-300 leading-relaxed">{poi.details}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-end">
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
