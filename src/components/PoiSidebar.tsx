/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Flame, 
  ShieldAlert, 
  Package, 
  Building2, 
  ShoppingBag, 
  Search, 
  ChevronRight, 
  Compass,
  FileText
} from 'lucide-react';
import { POI_LIST, POI, SECTORS, GRILL_BLOCKS, LANDMARKS_BESIDE_SLOTS, LandmarkBesideSlot } from '../data/mapData';

interface PoiSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPoi: (poi: POI) => void;
  onOpenGrillFinder: () => void;
  onSelectLandmark?: (landmark: LandmarkBesideSlot) => void;
  landmarks?: LandmarkBesideSlot[];
}

export const PoiSidebar: React.FC<PoiSidebarProps> = ({
  isOpen,
  onClose,
  onSelectPoi,
  onOpenGrillFinder,
  onSelectLandmark,
  landmarks
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'beside' | 'stages' | 'police' | 'emergency' | 'landmarks'>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  if (!isOpen) return null;

  const effectiveLandmarks = landmarks || LANDMARKS_BESIDE_SLOTS;

  const filteredPois = POI_LIST.filter(poi => {
    if (searchTerm.trim()) {
      const match = poi.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                    poi.description.toLowerCase().includes(searchTerm.toLowerCase());
      if (!match) return false;
    }

    if (activeTab === 'stages') return poi.category === 'stage';
    if (activeTab === 'police') return poi.category === 'police';
    if (activeTab === 'emergency') return poi.category === 'medical' || poi.category === 'claiming';
    if (activeTab === 'landmarks') return poi.category === 'government' || poi.category === 'commercial' || poi.category === 'landmark' || poi.category === 'amenity';
    return true;
  });

  const filteredBesideSlots = effectiveLandmarks.filter(lm => {
    if (searchTerm.trim()) {
      const match = lm.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                    lm.adjacentGrills.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    lm.description.toLowerCase().includes(searchTerm.toLowerCase());
      if (!match) return false;
    }
    return true;
  });

  return (
    <div 
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col text-slate-100 shadow-2xl animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-amber-500" />
              Festival Directory
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Official checkpoints, stages, emergency posts & landmarks
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Grill Finder Banner */}
        <div className="p-4 bg-amber-500/10 border-b border-amber-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Flame className="w-5 h-5 text-amber-400" />
            <div>
              <span className="text-xs font-bold text-amber-300 block">Looking for your Grill?</span>
              <span className="text-[11px] text-slate-400">Jump directly to Grill 1 to 414</span>
            </div>
          </div>
          <button
            onClick={() => {
              onClose();
              onOpenGrillFinder();
            }}
            className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors"
          >
            Find Grill
          </button>
        </div>

        {/* Search & Tabs */}
        <div className="p-4 border-b border-slate-800 space-y-3 bg-slate-900/60">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input 
              type="text"
              placeholder="Search points of interest, police posts, landmarks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setActiveTab('beside')}
              className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${
                activeTab === 'beside' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white bg-slate-950'
              }`}
            >
              <span>Beside Slots</span>
              <span className="text-[10px] opacity-80">({LANDMARKS_BESIDE_SLOTS.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeTab === 'all' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400 hover:text-white bg-slate-950'
              }`}
            >
              Major POIs ({POI_LIST.length})
            </button>
            <button
              onClick={() => setActiveTab('stages')}
              className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeTab === 'stages' ? 'bg-rose-600 text-white font-bold' : 'text-slate-400 hover:text-white bg-slate-950'
              }`}
            >
              Stages (3)
            </button>
            <button
              onClick={() => setActiveTab('police')}
              className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeTab === 'police' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white bg-slate-950'
              }`}
            >
              Police (13)
            </button>
            <button
              onClick={() => setActiveTab('emergency')}
              className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeTab === 'emergency' ? 'bg-amber-600 text-white font-bold' : 'text-slate-400 hover:text-white bg-slate-950'
              }`}
            >
              Kits & First Aid (6)
            </button>
            <button
              onClick={() => setActiveTab('landmarks')}
              className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeTab === 'landmarks' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white bg-slate-950'
              }`}
            >
              Civic
            </button>
          </div>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {activeTab === 'beside' ? (
            filteredBesideSlots.map(lm => (
              <div 
                key={lm.id}
                onClick={() => {
                  if (onSelectLandmark) {
                    onSelectLandmark(lm);
                  }
                  onClose();
                }}
                className="p-3 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-800/80 hover:border-amber-500/50 cursor-pointer transition-all flex items-start justify-between gap-3 group"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {lm.side === 'north' ? 'North Curb' : lm.side === 'south' ? 'South Curb' : 'Center'}
                    </span>
                    <span className="text-[11px] font-mono text-amber-400 font-semibold">
                      {lm.adjacentGrills}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-200 group-hover:text-amber-400 transition-colors">
                    {lm.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                    {lm.description}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-amber-400 transition-colors shrink-0 mt-2" />
              </div>
            ))
          ) : (
            filteredPois.map(poi => {
            let catColor = '#3b82f6';
            if (poi.category === 'stage') catColor = '#ef4444';
            if (poi.category === 'police') catColor = '#3b82f6';
            if (poi.category === 'medical') catColor = '#dc2626';
            if (poi.category === 'claiming') catColor = '#f59e0b';
            if (poi.category === 'government') catColor = '#10b981';
            if (poi.category === 'commercial') catColor = '#a855f7';

            return (
              <div 
                key={poi.id}
                onClick={() => {
                  onSelectPoi(poi);
                  onClose();
                }}
                className="p-3 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-800/80 hover:border-slate-700 cursor-pointer transition-all flex items-start justify-between gap-3 group"
              >
                <div className="flex items-start gap-3">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-xs"
                    style={{ backgroundColor: `${catColor}25`, color: catColor }}
                  >
                    {poi.category === 'stage' ? '🔥' : 
                     poi.category === 'police' ? '🛡️' : 
                     poi.category === 'medical' ? '🚑' : 
                     poi.category === 'claiming' ? '📦' : 
                     poi.category === 'government' ? '🏛️' : '🏬'}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200 group-hover:text-amber-400 transition-colors">
                      {poi.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                      {poi.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-500">
                      <span>Sector {poi.sectorId}</span>
                      <span>·</span>
                      <span className="capitalize">{poi.category}</span>
                    </div>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-amber-400 transition-colors shrink-0 mt-2" />
              </div>
            );
          })
          )}
        </div>
      </div>
    </div>
  );
};
