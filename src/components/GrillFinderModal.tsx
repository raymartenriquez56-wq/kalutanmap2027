/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  X, 
  Search, 
  Flame, 
  Filter, 
  Bookmark, 
  MapPin, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { ALL_GRILLS, GRILL_BLOCKS, SECTORS, GrillInfo } from '../data/mapData';

interface GrillFinderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectGrill: (grill: GrillInfo) => void;
  savedGrillNum: number | null;
}

export const GrillFinderModal: React.FC<GrillFinderModalProps> = ({
  isOpen,
  onClose,
  onSelectGrill,
  savedGrillNum
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSectorFilter, setSelectedSectorFilter] = useState<'all' | '1' | '2' | '3'>('all');
  const [selectedRow, setSelectedRow] = useState<'all' | 'top' | 'bottom'>('all');

  const allGrillList = useMemo(() => Array.from(ALL_GRILLS.values()), []);

  const filteredGrills = useMemo(() => {
    return allGrillList.filter(grill => {
      // Search query can be a number e.g. "45" or "grill 45" or landmark name e.g. "market"
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().replace(/^(grill|table|#)\s*/i, '').trim();
        const matchesNum = grill.number.toString().includes(query);
        const matchesLandmark = grill.landmarkNear.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPolice = grill.nearestPolice.toLowerCase().includes(searchQuery.toLowerCase());
        if (!matchesNum && !matchesLandmark && !matchesPolice) return false;
      }

      // Sector Filter
      if (selectedSectorFilter !== 'all' && grill.sectorId.toString() !== selectedSectorFilter) {
        return false;
      }

      // Row Filter
      if (selectedRow !== 'all' && grill.row !== selectedRow) {
        return false;
      }

      return true;
    });
  }, [allGrillList, searchQuery, selectedSectorFilter, selectedRow]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-500" />
              Grill Table Locator (Grills 1 – 414)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Locate any participant barbecue grill along the 1.2-kilometer festival strip
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filters */}
        <div className="p-4 border-b border-slate-800 space-y-3 bg-slate-900/60">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input 
              type="text"
              placeholder="Search grill number (e.g., 42, 215, 380) or landmark (Market, McDo)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
              autoFocus
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200"
              >
                Clear
              </button>
            )}
          </div>

          {/* Filter Bars */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Sector Tabs */}
            <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800">
              <button 
                onClick={() => setSelectedSectorFilter('all')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  selectedSectorFilter === 'all' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All Sectors
              </button>
              <button 
                onClick={() => setSelectedSectorFilter('3')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  selectedSectorFilter === '3' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Sec 3 (West)
              </button>
              <button 
                onClick={() => setSelectedSectorFilter('2')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  selectedSectorFilter === '2' ? 'bg-amber-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Sec 2 (Central)
              </button>
              <button 
                onClick={() => setSelectedSectorFilter('1')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  selectedSectorFilter === '1' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Sec 1 (East)
              </button>
            </div>

            {/* Row Tabs */}
            <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800">
              <button 
                onClick={() => setSelectedRow('all')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  selectedRow === 'all' ? 'bg-slate-700 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Both Rows
              </button>
              <button 
                onClick={() => setSelectedRow('top')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  selectedRow === 'top' ? 'bg-slate-700 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                North (1–222)
              </button>
              <button 
                onClick={() => setSelectedRow('bottom')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  selectedRow === 'bottom' ? 'bg-slate-700 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                South (223–414)
              </button>
            </div>

            {/* My Saved Grill Quick Button */}
            {savedGrillNum && (
              <button 
                onClick={() => {
                  const saved = ALL_GRILLS.get(savedGrillNum);
                  if (saved) {
                    onSelectGrill(saved);
                    onClose();
                  }
                }}
                className="ml-auto px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Bookmark className="w-3.5 h-3.5 text-amber-400" />
                <span>Jump to My Grill #{savedGrillNum}</span>
              </button>
            )}
          </div>
        </div>

        {/* Grill Grid / List Results */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="text-xs text-slate-400 mb-2 flex items-center justify-between">
            <span>Showing {filteredGrills.length} grill tables</span>
            <span className="text-[11px] text-slate-500">Click any table to inspect on map</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {filteredGrills.map(grill => {
              const isSaved = savedGrillNum === grill.number;
              const sectorColor = grill.sectorId === 1 ? '#10b981' : grill.sectorId === 2 ? '#f59e0b' : '#3b82f6';

              return (
                <div 
                  key={grill.number}
                  onClick={() => {
                    onSelectGrill(grill);
                    onClose();
                  }}
                  className={`p-2.5 rounded-xl border bg-slate-950/70 hover:bg-slate-800/80 cursor-pointer transition-all flex flex-col justify-between group ${
                    isSaved ? 'border-amber-500/80 ring-1 ring-amber-500/40' : 'border-slate-800 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span 
                      className="px-2 py-0.5 rounded font-mono font-bold text-xs"
                      style={{ 
                        backgroundColor: `${sectorColor}20`,
                        color: sectorColor,
                        border: `1px solid ${sectorColor}50`
                      }}
                    >
                      #{grill.number}
                    </span>
                    {isSaved ? (
                      <span className="text-[10px] text-amber-400 font-semibold flex items-center gap-0.5">
                        <Bookmark className="w-3 h-3 fill-amber-400" />
                        Mine
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500 font-mono">
                        {grill.row === 'top' ? 'N' : 'S'}
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-300 font-medium truncate mb-1">
                    {grill.landmarkNear}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-900">
                    <span className="truncate">{grill.stage}</span>
                    <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-amber-400 transition-colors" />
                  </div>
                </div>
              );
            })}
          </div>

          {filteredGrills.length === 0 && (
            <div className="py-12 text-center text-slate-500 text-xs">
              No grill tables found matching your search. Try a number between 1 and 414.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
