/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  X, 
  Flame, 
  Clock, 
  ShieldCheck, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle,
  PhoneCall
} from 'lucide-react';
import { FESTIVAL_RULES } from '../data/mapData';

interface FestivalGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FestivalGuideModal: React.FC<FestivalGuideModalProps> = ({
  isOpen,
  onClose
}) => {
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
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Flame className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Kalutan ed Dalan 2027 Official Guide
              </h3>
              <p className="text-xs text-slate-400">
                Mapandan, Pangasinan · Schedule, Rules & Safety Guidelines
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
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Timeline / Itinerary */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              Event Schedule of Activities
            </h4>

            <div className="space-y-2 border-l-2 border-amber-500/40 pl-4 ml-2">
              <div className="relative">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 absolute -left-[21px] top-1.5 ring-4 ring-slate-900" />
                <span className="text-xs font-bold text-amber-300 font-mono">1:00 PM – 4:00 PM</span>
                <p className="text-xs font-semibold text-slate-200">Kit Claiming & Table Setup</p>
                <p className="text-[11px] text-slate-400">
                  Claim Bangus and charcoal kits at designated Claiming Stations (East, Central, West). Set up grills and picnic areas.
                </p>
              </div>

              <div className="relative pt-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 absolute -left-[21px] top-3.5 ring-4 ring-slate-900" />
                <span className="text-xs font-bold text-amber-300 font-mono">4:30 PM</span>
                <p className="text-xs font-semibold text-slate-200">Opening Ceremony & Street Dancing</p>
                <p className="text-[11px] text-slate-400">
                  Grand Stage 1 (Municipal Hall) opening program with local officials and cultural performers.
                </p>
              </div>

              <div className="relative pt-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 absolute -left-[21px] top-3.5 ring-4 ring-slate-900" />
                <span className="text-xs font-bold text-red-400 font-mono">5:00 PM SHARP</span>
                <p className="text-xs font-semibold text-slate-200">Simultaneous Lighting of 414 Grills</p>
                <p className="text-[11px] text-slate-400">
                  Signal horn will blast across all 3 Stages. Fire marshals and team leaders ignite coals along the 1.2-kilometer corridor!
                </p>
              </div>

              <div className="relative pt-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 absolute -left-[21px] top-3.5 ring-4 ring-slate-900" />
                <span className="text-xs font-bold text-amber-300 font-mono">6:00 PM – 11:00 PM</span>
                <p className="text-xs font-semibold text-slate-200">Street Feast & Live Concerts</p>
                <p className="text-[11px] text-slate-400">
                  Continuous live bands on Stage 1, Stage 2, and Stage 3 with fireworks finale at 10:30 PM.
                </p>
              </div>
            </div>
          </div>

          {/* Festival Rules & Regulations */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Guidelines & Safety Protocols
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {FESTIVAL_RULES.map((rule, idx) => (
                <div key={idx} className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs">
                  <h5 className="font-bold text-slate-200 mb-1">{rule.title}</h5>
                  <p className="text-slate-400 text-[11px] leading-relaxed">{rule.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Hotline Numbers */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-2">
            <div className="flex items-center gap-2 text-rose-400 font-bold">
              <PhoneCall className="w-4 h-4" />
              <span>Mapandan Emergency Hotline Numbers</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-300 text-[11px]">
              <div>
                <span className="text-slate-400 block">Mapandan PNP:</span>
                <span className="font-mono font-semibold text-slate-100">(075) 523-2222 / 911</span>
              </div>
              <div>
                <span className="text-slate-400 block">BFP Fire Station:</span>
                <span className="font-mono font-semibold text-slate-100">(075) 523-2111</span>
              </div>
              <div>
                <span className="text-slate-400 block">RHU Emergency Team:</span>
                <span className="font-mono font-semibold text-slate-100">(075) 523-2333</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors"
          >
            Got it, Back to Map
          </button>
        </div>
      </div>
    </div>
  );
};
