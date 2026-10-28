/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Bookmark, 
  Trash2, 
  Compass, 
  Flame, 
  User, 
  Users, 
  Package, 
  ShieldAlert, 
  Sparkles, 
  QrCode, 
  Check, 
  Printer 
} from 'lucide-react';
import { ALL_GRILLS, SECTORS, GrillInfo } from '../data/mapData';

interface MyGrillDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedGrillNum: number | null;
  onSelectGrillNum: (num: number) => void;
  onClearSavedGrill: () => void;
  onFocusGrill: (grill: GrillInfo) => void;
}

export const MyGrillDrawer: React.FC<MyGrillDrawerProps> = ({
  isOpen,
  onClose,
  savedGrillNum,
  onSelectGrillNum,
  onClearSavedGrill,
  onFocusGrill
}) => {
  const [participantName, setParticipantName] = useState<string>('');
  const [groupName, setGroupName] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [inputGrillNum, setInputGrillNum] = useState<string>('');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Load from localStorage
  useEffect(() => {
    const savedName = localStorage.getItem('kalutan_participant_name') || '';
    const savedGroup = localStorage.getItem('kalutan_group_name') || '';
    const savedNotes = localStorage.getItem('kalutan_notes') || '';
    setParticipantName(savedName);
    setGroupName(savedGroup);
    setNotes(savedNotes);
  }, []);

  const saveDetails = () => {
    localStorage.setItem('kalutan_participant_name', participantName);
    localStorage.setItem('kalutan_group_name', groupName);
    localStorage.setItem('kalutan_notes', notes);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleAssignGrill = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(inputGrillNum, 10);
    if (!isNaN(num) && num >= 1 && num <= 414) {
      onSelectGrillNum(num);
      setInputGrillNum('');
    }
  };

  if (!isOpen) return null;

  const currentGrill = savedGrillNum ? ALL_GRILLS.get(savedGrillNum) : null;
  const sector = currentGrill ? SECTORS.find(s => s.id === currentGrill.sectorId) : null;

  return (
    <div 
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col text-slate-100 shadow-2xl animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Bookmark className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">My Festival Pass</h3>
              <p className="text-xs text-slate-400">Kalutan ed Dalan 2027 Table Registration</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {currentGrill ? (
            <>
              {/* Official Digital Participant Badge Card */}
              <div 
                className="relative rounded-2xl p-5 border shadow-xl overflow-hidden text-slate-100"
                style={{
                  background: 'linear-gradient(145deg, #1e1b4b 0%, #0f172a 100%)',
                  borderColor: sector?.color || '#f59e0b'
                }}
              >
                {/* Top Badge Info */}
                <div className="flex items-center justify-between mb-4">
                  <div className="text-[10px] uppercase font-bold tracking-widest text-amber-400 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5" />
                    Official Participant Pass
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
                    2027 EVENT
                  </span>
                </div>

                {/* Big Grill Number Display */}
                <div className="flex items-center justify-between py-2 border-y border-slate-800/80 my-2">
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Reserved Table</span>
                    <span className="text-4xl font-black font-mono tracking-tight text-white">
                      #{currentGrill.number}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400 block font-medium">Corridor Row</span>
                    <span className="text-sm font-bold text-amber-300">
                      {currentGrill.row === 'top' ? 'North Row (1–222)' : 'South Row (223–414)'}
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">{currentGrill.stage}</span>
                  </div>
                </div>

                {/* Participant Details */}
                <div className="pt-2 space-y-1 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Participant:</span>
                    <span className="font-semibold text-slate-200">{participantName || 'Guest Participant'}</span>
                  </div>
                  {groupName && (
                    <div className="flex justify-between text-slate-400">
                      <span>Group/Barangay:</span>
                      <span className="font-semibold text-slate-200">{groupName}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-400">
                    <span>Claiming Tent:</span>
                    <span className="font-semibold text-amber-400">{currentGrill.nearestClaiming}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Patrol Station:</span>
                    <span className="font-semibold text-blue-400">{currentGrill.nearestPolice}</span>
                  </div>
                </div>

                {/* Simulated Barcode / QR token */}
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-mono text-[10px] tracking-widest text-slate-500">MAPANDAN-KD27-T{currentGrill.number.toString().padStart(3, '0')}</span>
                  <div className="flex items-center gap-1 text-amber-400">
                    <QrCode className="w-4 h-4" />
                    <span>Verified</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    onFocusGrill(currentGrill);
                    onClose();
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 shadow transition-colors"
                >
                  <Compass className="w-4 h-4" />
                  <span>Locate On Map</span>
                </button>

                <button 
                  onClick={onClearSavedGrill}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 border border-slate-700 transition-colors"
                  title="Remove saved grill"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Editable Profile Fields */}
              <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Customize Pass Information
                </span>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Your Name</label>
                  <input 
                    type="text" 
                    value={participantName}
                    onChange={(e) => setParticipantName(e.target.value)}
                    placeholder="e.g. Maria Santos"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Group / Organization / Barangay</label>
                  <input 
                    type="text" 
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="e.g. Barangay Poblacion / Santos Family"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Personal Notes / Items to Bring</label>
                  <textarea 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Bringing extra calamansi, cooler with ice, folding chairs..."
                    rows={2}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 resize-none"
                  />
                </div>

                <button 
                  onClick={saveDetails}
                  className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Sparkles className="w-3.5 h-3.5 text-amber-400" />}
                  <span>{isCopied ? 'Saved to Browser!' : 'Save Information'}</span>
                </button>
              </div>
            </>
          ) : (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/20">
                <Bookmark className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white">No Assigned Table Saved Yet</h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                  Enter your ticket table number (1 to 414) below to generate your official festival card and fast map shortcut.
                </p>
              </div>

              <form onSubmit={handleAssignGrill} className="max-w-xs mx-auto space-y-2 pt-2">
                <div className="flex gap-2">
                  <input 
                    type="number"
                    min="1"
                    max="414"
                    value={inputGrillNum}
                    onChange={(e) => setInputGrillNum(e.target.value)}
                    placeholder="Enter table # (1-414)"
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                  />
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition-colors"
                  >
                    Set Table
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
