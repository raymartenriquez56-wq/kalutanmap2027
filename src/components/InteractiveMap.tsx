/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  Layers, 
  Eye, 
  EyeOff, 
  MapPin, 
  Flame, 
  ShieldAlert, 
  Plus, 
  Package, 
  Compass, 
  Navigation2, 
  Sparkles,
  Info
} from 'lucide-react';
import { 
  SECTORS, 
  GRILL_BLOCKS, 
  INDIVIDUAL_SLOTS,
  IndividualSlot,
  POI_LIST, 
  POI, 
  GrillInfo, 
  ALL_GRILLS 
} from '../data/mapData';

interface InteractiveMapProps {
  selectedGrill: GrillInfo | null;
  onSelectGrill: (grill: GrillInfo | null) => void;
  selectedPoi: POI | null;
  onSelectPoi: (poi: POI | null) => void;
  savedGrillNum: number | null;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  selectedGrill,
  onSelectGrill,
  selectedPoi,
  onSelectPoi,
  savedGrillNum
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Transform states (pan & zoom)
  const [scale, setScale] = useState<number>(1);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Layer visibility controls
  const [showBlueprint, setShowBlueprint] = useState<boolean>(true);
  const [blueprintOpacity, setBlueprintOpacity] = useState<number>(0.85);
  const [showSectors, setShowSectors] = useState<boolean>(true);
  const [showGrillNumbers, setShowGrillNumbers] = useState<boolean>(true);
  const [showPois, setShowPois] = useState<boolean>(true);
  const [showLayerMenu, setShowLayerMenu] = useState<boolean>(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');

  // Hover state for tooltip
  const [hoveredSlot, setHoveredSlot] = useState<IndividualSlot | null>(null);
  const [hoveredPoi, setHoveredPoi] = useState<POI | null>(null);

  // Native map aspect ratio: 13217 x 2339 (aspect ratio ~ 5.65)
  const MAP_WIDTH = 13217;
  const MAP_HEIGHT = 2339;

  // Center & Reset Map
  const resetMap = useCallback(() => {
    if (!containerRef.current) return;
    const { clientWidth, clientHeight } = containerRef.current;
    
    // Fit map width into viewport with some margin
    const initialScale = Math.max(0.2, Math.min(clientWidth / MAP_WIDTH, clientHeight / MAP_HEIGHT) * 1.05);
    const initialX = (clientWidth - MAP_WIDTH * initialScale) / 2;
    const initialY = (clientHeight - MAP_HEIGHT * initialScale) / 2;

    setScale(initialScale);
    setPosition({ x: initialX, y: initialY });
  }, [MAP_WIDTH, MAP_HEIGHT]);

  // Initial fit on load and on window resize
  useEffect(() => {
    resetMap();
    const handleResize = () => resetMap();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [resetMap]);

  // Pan and Zoom to a specific coordinate percentage
  const flyTo = useCallback((xPercent: number, yPercent: number, targetScaleMultiplier: number = 3.2) => {
    if (!containerRef.current) return;
    const { clientWidth, clientHeight } = containerRef.current;

    // Calculate absolute map coordinates
    const targetMapX = (xPercent / 100) * MAP_WIDTH;
    const targetMapY = (yPercent / 100) * MAP_HEIGHT;

    // Determine target scale
    const baseScale = Math.min(clientWidth / MAP_WIDTH, clientHeight / MAP_HEIGHT);
    const newScale = Math.max(0.6, baseScale * targetScaleMultiplier);

    // Center target coordinates
    const newX = clientWidth / 2 - targetMapX * newScale;
    const newY = clientHeight / 2 - targetMapY * newScale;

    setScale(newScale);
    setPosition({ x: newX, y: newY });
  }, [MAP_WIDTH, MAP_HEIGHT]);

  // Handle selected grill change from parent
  useEffect(() => {
    if (selectedGrill) {
      flyTo(selectedGrill.xPercent, selectedGrill.yPercent, 3.8);
    }
  }, [selectedGrill, flyTo]);

  // Handle selected POI change from parent
  useEffect(() => {
    if (selectedPoi) {
      flyTo(selectedPoi.xPercent, selectedPoi.yPercent, 3.2);
    }
  }, [selectedPoi, flyTo]);

  // Zoom In / Out Handlers
  const handleZoom = (delta: number) => {
    if (!containerRef.current) return;
    const { clientWidth, clientHeight } = containerRef.current;
    const newScale = Math.min(Math.max(scale * (delta > 0 ? 1.35 : 0.74), 0.15), 5.5);

    // Zoom centered at viewport center
    const centerX = clientWidth / 2;
    const centerY = clientHeight / 2;

    const newX = centerX - (centerX - position.x) * (newScale / scale);
    const newY = centerY - (centerY - position.y) * (newScale / scale);

    setScale(newScale);
    setPosition({ x: newX, y: newY });
  };

  // Wheel Zoom centered at cursor
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.87;
    const newScale = Math.min(Math.max(scale * zoomFactor, 0.15), 5.5);

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const newX = mouseX - (mouseX - position.x) * (newScale / scale);
    const newY = mouseY - (mouseY - position.y) * (newScale / scale);

    setScale(newScale);
    setPosition({ x: newX, y: newY });
  };

  // Mouse Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click drags
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch Handlers for Mobile (single finger drag & pinch zoom)
  const touchState = useRef<{ lastDist: number | null; startPos: { x: number; y: number } }>({
    lastDist: null,
    startPos: { x: 0, y: 0 }
  });

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      touchState.current.startPos = {
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y
      };
      touchState.current.lastDist = null;
    } else if (e.touches.length === 2) {
      setIsDragging(false);
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchState.current.lastDist = dist;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging) {
      setPosition({
        x: e.touches[0].clientX - touchState.current.startPos.x,
        y: e.touches[0].clientY - touchState.current.startPos.y
      });
    } else if (e.touches.length === 2 && touchState.current.lastDist) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const zoomFactor = dist / touchState.current.lastDist;
      touchState.current.lastDist = dist;

      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left;
      const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top;

      const newScale = Math.min(Math.max(scale * zoomFactor, 0.15), 5.5);
      const newX = midX - (midX - position.x) * (newScale / scale);
      const newY = midY - (midY - position.y) * (newScale / scale);

      setScale(newScale);
      setPosition({ x: newX, y: newY });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    touchState.current.lastDist = null;
  };

  // Toggle Fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  // Quick Sector Jump
  const jumpToSector = (sectorId: 1 | 2 | 3) => {
    const sec = SECTORS.find(s => s.id === sectorId);
    if (!sec) return;
    const midX = (sec.startX + sec.endX) / 2;
    flyTo(midX, 50, 2.2);
  };

  // POI filtered list
  const filteredPois = POI_LIST.filter(poi => {
    if (activeCategoryFilter === 'all') return true;
    if (activeCategoryFilter === 'stage') return poi.category === 'stage';
    if (activeCategoryFilter === 'police') return poi.category === 'police';
    if (activeCategoryFilter === 'emergency') return poi.category === 'medical' || poi.category === 'claiming';
    if (activeCategoryFilter === 'landmark') return poi.category === 'government' || poi.category === 'landmark' || poi.category === 'commercial';
    return true;
  });

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-slate-950 select-none cursor-grab active:cursor-grabbing"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      role="region"
      aria-label="Interactive map canvas"
    >
      {/* MAP CANVAS VIEWPORT */}
      <div 
        className="absolute origin-top-left transition-transform duration-75 will-change-transform"
        style={{
          width: `${MAP_WIDTH}px`,
          height: `${MAP_HEIGHT}px`,
          transform: `translate3d(${position.x}px, ${position.y}px, 0px) scale(${scale})`
        }}
      >
        {/* Layer 1: Base Architectural CAD Map Image from PDF */}
        {showBlueprint && (
          <img 
            src="/map_layout_highres.png" 
            alt="Kalutan ed Dalan 2027 Architectural CAD Map" 
            className="absolute inset-0 w-full h-full object-cover pointer-events-none filter contrast-125"
            style={{ opacity: blueprintOpacity }}
            loading="eager"
            referrerPolicy="no-referrer"
          />
        )}

        {/* Layer 2: Vector Overlay SVG (Zoning, Grills, Road, POIs, Radar Markers) */}
        <svg 
          viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
          className="absolute inset-0 w-full h-full pointer-events-auto"
        >
          {/* DEFINITIONS & FILTERS */}
          <defs>
            <linearGradient id="sec3-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.16" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.08" />
            </linearGradient>
            <linearGradient id="sec2-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.16" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.08" />
            </linearGradient>
            <linearGradient id="sec1-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.16" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.08" />
            </linearGradient>

            {/* Pattern for Pedestrian Crossings */}
            <pattern id="crosswalk" width="40" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(90)">
              <rect width="20" height="20" fill="rgba(255, 255, 255, 0.4)" />
              <rect x="20" width="20" height="20" fill="transparent" />
            </pattern>

            {/* Glow Filter for Highlights */}
            <filter id="radar-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="16" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* SECTOR ZONE BANDS */}
          {showSectors && (
            <g id="sectors-layer" className="transition-opacity duration-300">
              {/* Sector 3 (West) */}
              <rect 
                x="0" 
                y="0" 
                width={MAP_WIDTH * 0.335} 
                height={MAP_HEIGHT} 
                fill="url(#sec3-gradient)" 
                stroke="#3b82f6" 
                strokeWidth="4"
                strokeDasharray="16, 12"
                opacity="0.6"
              />
              <text 
                x={MAP_WIDTH * 0.167} 
                y="180" 
                textAnchor="middle" 
                fill="#60a5fa" 
                fontSize="64" 
                fontWeight="800" 
                letterSpacing="4"
                className="select-none uppercase drop-shadow"
              >
                Sector 3 • Town Center & Parking (Stage 3)
              </text>

              {/* Sector 2 (Central) */}
              <rect 
                x={MAP_WIDTH * 0.335} 
                y="0" 
                width={MAP_WIDTH * 0.345} 
                height={MAP_HEIGHT} 
                fill="url(#sec2-gradient)" 
                stroke="#f59e0b" 
                strokeWidth="4"
                strokeDasharray="16, 12"
                opacity="0.6"
              />
              <text 
                x={MAP_WIDTH * 0.507} 
                y="180" 
                textAnchor="middle" 
                fill="#fbbf24" 
                fontSize="64" 
                fontWeight="800" 
                letterSpacing="4"
                className="select-none uppercase drop-shadow"
              >
                Sector 2 • Mapandan Public Market (Stage 2)
              </text>

              {/* Sector 1 (East) */}
              <rect 
                x={MAP_WIDTH * 0.680} 
                y="0" 
                width={MAP_WIDTH * 0.320} 
                height={MAP_HEIGHT} 
                fill="url(#sec1-gradient)" 
                stroke="#10b981" 
                strokeWidth="4"
                strokeDasharray="16, 12"
                opacity="0.6"
              />
              <text 
                x={MAP_WIDTH * 0.840} 
                y="180" 
                textAnchor="middle" 
                fill="#34d399" 
                fontSize="64" 
                fontWeight="800" 
                letterSpacing="4"
                className="select-none uppercase drop-shadow"
              >
                Sector 1 • Municipal Hall & Civic Plaza (Stage 1)
              </text>
            </g>
          )}

          {/* PEDESTRIAN CROSSING ROAD STRIPES */}
          <g id="crossings-layer">
            {/* Crossing 1 */}
            <rect x={MAP_WIDTH * 0.341} y={MAP_HEIGHT * 0.44} width="110" height={MAP_HEIGHT * 0.12} fill="url(#crosswalk)" opacity="0.65" />
            {/* Crossing 2 */}
            <rect x={MAP_WIDTH * 0.536} y={MAP_HEIGHT * 0.44} width="110" height={MAP_HEIGHT * 0.12} fill="url(#crosswalk)" opacity="0.65" />
            {/* Crossing 3 */}
            <rect x={MAP_WIDTH * 0.662} y={MAP_HEIGHT * 0.44} width="110" height={MAP_HEIGHT * 0.12} fill="url(#crosswalk)" opacity="0.65" />
            {/* Crossing 4 */}
            <rect x={MAP_WIDTH * 0.776} y={MAP_HEIGHT * 0.44} width="110" height={MAP_HEIGHT * 0.12} fill="url(#crosswalk)" opacity="0.65" />
          </g>

          {/* INDIVIDUAL GRILL SLOTS (ALL 414 PHYSICAL TABLES) */}
          <g id="individual-grill-slots-layer">
            {INDIVIDUAL_SLOTS.map(slot => {
              const isSelected = selectedGrill?.number === slot.number;
              const isSaved = savedGrillNum === slot.number;
              const isHovered = hoveredSlot?.number === slot.number;

              // Base theme color according to sector
              const sectorColor = slot.sectorId === 1 ? '#10b981' : slot.sectorId === 2 ? '#f59e0b' : '#3b82f6';
              const sectorBg = slot.sectorId === 1 
                ? 'rgba(16, 185, 129, 0.22)' 
                : slot.sectorId === 2 
                ? 'rgba(245, 158, 11, 0.22)' 
                : 'rgba(59, 130, 246, 0.22)';

              const fill = isSelected 
                ? 'rgba(239, 68, 68, 0.75)' 
                : isSaved 
                ? 'rgba(234, 179, 8, 0.70)' 
                : isHovered 
                ? 'rgba(255, 255, 255, 0.55)' 
                : sectorBg;

              const stroke = isSelected 
                ? '#ffffff' 
                : isSaved 
                ? '#fde047' 
                : isHovered 
                ? '#ffffff' 
                : sectorColor;

              const strokeWidth = isSelected ? 3.5 : isSaved ? 3 : isHovered ? 2.5 : 1.2;

              const centerX = slot.slotX + slot.slotW / 2;
              const centerY = slot.slotY + slot.slotH / 2;

              return (
                <g 
                  key={slot.number}
                  className="cursor-pointer transition-colors"
                  onMouseEnter={() => setHoveredSlot(slot)}
                  onMouseLeave={() => setHoveredSlot(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    const grill = ALL_GRILLS.get(slot.number);
                    if (grill) onSelectGrill(grill);
                  }}
                >
                  {/* Slot Rectangle Outline */}
                  <rect 
                    x={slot.slotX} 
                    y={slot.slotY} 
                    width={slot.slotW} 
                    height={slot.slotH}
                    rx="3.5"
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                  />

                  {/* Individual Table Slot Number (Vertical orientation inside the 40x85 table slot) */}
                  {showGrillNumbers && (
                    <text 
                      x={centerX} 
                      y={centerY} 
                      textAnchor="middle" 
                      dominantBaseline="central"
                      transform={`rotate(-90 ${centerX} ${centerY})`}
                      fill={isSelected ? '#ffffff' : isSaved ? '#0f172a' : isHovered ? '#0f172a' : '#f8fafc'} 
                      fontSize={slot.number > 99 ? '15' : '16'} 
                      fontWeight={isSelected || isSaved ? '900' : '700'}
                      fontFamily="JetBrains Mono, monospace"
                      pointerEvents="none"
                      className="select-none drop-shadow-sm"
                    >
                      #{slot.number}
                    </text>
                  )}

                  {/* Slot Hover Floating Tooltip */}
                  {isHovered && (
                    <g 
                      transform={`translate(${centerX}, ${slot.row === 'top' ? slot.slotY - 32 : slot.slotY + slot.slotH + 32})`} 
                      pointerEvents="none"
                      filter="url(#radar-glow)"
                    >
                      <rect 
                        x="-70" 
                        y="-18" 
                        width="140" 
                        height="36" 
                        rx="6" 
                        fill="#0f172a" 
                        stroke="#ffffff" 
                        strokeWidth="2" 
                      />
                      <text 
                        x="0" 
                        y="5" 
                        textAnchor="middle" 
                        fill="#ffffff" 
                        fontSize="15" 
                        fontWeight="800"
                        fontFamily="JetBrains Mono, monospace"
                      >
                        Grill Slot #{slot.number}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </g>

          {/* ACTIVE SELECTED GRILL RADAR PULSE */}
          {selectedGrill && (
            <g 
              id="selected-grill-marker"
              transform={`translate(${selectedGrill.slotX + selectedGrill.slotW / 2}, ${selectedGrill.slotY + selectedGrill.slotH / 2})`}
              filter="url(#radar-glow)"
              pointerEvents="none"
            >
              {/* Pulsing concentric rings */}
              <circle r="90" fill="none" stroke="#ef4444" strokeWidth="4" opacity="0.3" className="animate-ping" />
              <circle r="60" fill="rgba(239, 68, 68, 0.25)" stroke="#ef4444" strokeWidth="5" />
              <circle r="20" fill="#ef4444" stroke="#ffffff" strokeWidth="4" />
              
              {/* Pin Callout Badge */}
              <g transform="translate(0, -95)">
                <rect 
                  x="-130" 
                  y="-42" 
                  width="260" 
                  height="48" 
                  rx="8" 
                  fill="#0f172a" 
                  stroke="#ef4444" 
                  strokeWidth="3" 
                />
                <text 
                  x="0" 
                  y="-11" 
                  textAnchor="middle" 
                  fill="#ffffff" 
                  fontSize="24" 
                  fontWeight="800"
                  fontFamily="JetBrains Mono, monospace"
                >
                  ★ GRILL SLOT #{selectedGrill.number}
                </text>
              </g>
            </g>
          )}

          {/* SAVED USER GRILL MARKER (If different from active selected) */}
          {savedGrillNum && (!selectedGrill || selectedGrill.number !== savedGrillNum) && ALL_GRILLS.get(savedGrillNum) && (
            <g 
              id="saved-grill-marker"
              transform={`translate(${ALL_GRILLS.get(savedGrillNum)!.slotX + ALL_GRILLS.get(savedGrillNum)!.slotW / 2}, ${ALL_GRILLS.get(savedGrillNum)!.slotY + ALL_GRILLS.get(savedGrillNum)!.slotH / 2})`}
              className="cursor-pointer"
              onClick={() => onSelectGrill(ALL_GRILLS.get(savedGrillNum)!)}
            >
              <circle r="45" fill="rgba(245, 158, 11, 0.3)" stroke="#f59e0b" strokeWidth="4" />
              <circle r="18" fill="#f59e0b" stroke="#ffffff" strokeWidth="3" />
              <g transform="translate(0, -65)" pointerEvents="none">
                <rect x="-105" y="-36" width="210" height="40" rx="6" fill="#1e1b4b" stroke="#f59e0b" strokeWidth="2.5" />
                <text x="0" y="-11" textAnchor="middle" fill="#fbbf24" fontSize="19" fontWeight="800">
                  MY SLOT #{savedGrillNum}
                </text>
              </g>
            </g>
          )}

          {/* POI PINS & MARKERS */}
          {showPois && (
            <g id="poi-layer">
              {filteredPois.map(poi => {
                const px = (poi.xPercent / 100) * MAP_WIDTH;
                const py = (poi.yPercent / 100) * MAP_HEIGHT;
                const isSelected = selectedPoi?.id === poi.id;
                const isHovered = hoveredPoi?.id === poi.id;

                // Color by Category
                let badgeBg = '#1e293b';
                let strokeColor = '#94a3b8';
                let iconSymbol = '📍';

                if (poi.category === 'stage') {
                  badgeBg = '#dc2626';
                  strokeColor = '#f87171';
                  iconSymbol = '🔥';
                } else if (poi.category === 'police') {
                  badgeBg = '#1d4ed8';
                  strokeColor = '#60a5fa';
                  iconSymbol = '🛡️';
                } else if (poi.category === 'medical') {
                  badgeBg = '#b91c1c';
                  strokeColor = '#fca5a5';
                  iconSymbol = '🚑';
                } else if (poi.category === 'claiming') {
                  badgeBg = '#b45309';
                  strokeColor = '#fcd34d';
                  iconSymbol = '📦';
                } else if (poi.category === 'government') {
                  badgeBg = '#047857';
                  strokeColor = '#6ee7b7';
                  iconSymbol = '🏛️';
                } else if (poi.category === 'commercial') {
                  badgeBg = '#475569';
                  strokeColor = '#cbd5e1';
                  iconSymbol = '🏬';
                } else if (poi.category === 'crossing') {
                  badgeBg = '#334155';
                  strokeColor = '#94a3b8';
                  iconSymbol = '🚶';
                }

                return (
                  <g 
                    key={poi.id}
                    transform={`translate(${px}, ${py})`}
                    className="cursor-pointer transition-transform"
                    onMouseEnter={() => setHoveredPoi(poi)}
                    onMouseLeave={() => setHoveredPoi(null)}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectPoi(poi);
                    }}
                  >
                    {/* Pulsing ring if selected */}
                    {isSelected && (
                      <circle r="70" fill="none" stroke={strokeColor} strokeWidth="5" className="animate-ping" opacity="0.4" />
                    )}

                    {/* Pin Head */}
                    <circle 
                      r={isSelected ? '38' : isHovered ? '32' : '26'} 
                      fill={badgeBg} 
                      stroke={isSelected ? '#ffffff' : strokeColor} 
                      strokeWidth={isSelected ? '5' : '3.5'} 
                      className="shadow-xl"
                    />

                    {/* Emoji Icon inside circle */}
                    <text 
                      x="0" 
                      y={isSelected ? '10' : '8'} 
                      textAnchor="middle" 
                      fontSize={isSelected ? '28' : '20'}
                      pointerEvents="none"
                    >
                      {iconSymbol}
                    </text>

                    {/* Label Tag on Hover or Select or Important POIs */}
                    {(isSelected || isHovered || poi.category === 'stage' || poi.category === 'government') && (
                      <g transform="translate(0, -48)" pointerEvents="none">
                        <rect 
                          x={-Math.max(poi.name.length * 8.5, 90)} 
                          y="-38" 
                          width={Math.max(poi.name.length * 17, 180)} 
                          height="44" 
                          rx="6" 
                          fill="rgba(15, 23, 42, 0.95)" 
                          stroke={strokeColor} 
                          strokeWidth="2" 
                        />
                        <text 
                          x="0" 
                          y="-10" 
                          textAnchor="middle" 
                          fill="#ffffff" 
                          fontSize="21" 
                          fontWeight="700"
                        >
                          {poi.name}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </g>
          )}
        </svg>
      </div>

      {/* TOP LEFT QUICK HUD: MAP STATS & COMPASS */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 pointer-events-none">
        <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-lg border border-slate-700/80 shadow-lg pointer-events-auto">
          <Compass className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-semibold text-slate-200">Main Arterial: East–West Corridor</span>
          <span className="text-slate-500 text-xs">·</span>
          <span className="text-xs font-mono text-slate-400">1.2 km Length · 414 Grills</span>
        </div>

        {/* Category Quick Filter Chips */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 backdrop-blur-md rounded-lg border border-slate-700/80 shadow-lg pointer-events-auto overflow-x-auto max-w-[85vw] sm:max-w-none">
          <button 
            onClick={() => setActiveCategoryFilter('all')} 
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
              activeCategoryFilter === 'all' ? 'bg-amber-500 text-slate-950 font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            All Points
          </button>
          <button 
            onClick={() => setActiveCategoryFilter('stage')} 
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap flex items-center gap-1 ${
              activeCategoryFilter === 'stage' ? 'bg-rose-500 text-white font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Flame className="w-3 h-3" />
            3 Stages
          </button>
          <button 
            onClick={() => setActiveCategoryFilter('police')} 
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap flex items-center gap-1 ${
              activeCategoryFilter === 'police' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ShieldAlert className="w-3 h-3" />
            12 Police Posts
          </button>
          <button 
            onClick={() => setActiveCategoryFilter('emergency')} 
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap flex items-center gap-1 ${
              activeCategoryFilter === 'emergency' ? 'bg-amber-600 text-white font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Package className="w-3 h-3" />
            Medical & Kits
          </button>
          <button 
            onClick={() => setActiveCategoryFilter('landmark')} 
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
              activeCategoryFilter === 'landmark' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            Landmarks
          </button>
        </div>
      </div>

      {/* TOP RIGHT CONTROLS: ZOOM, FULLSCREEN, LAYERS */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        {/* Layer Controls Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowLayerMenu(!showLayerMenu)}
            className="flex items-center gap-2 px-3 py-2 bg-slate-900/90 hover:bg-slate-800 backdrop-blur-md rounded-lg border border-slate-700/80 text-xs font-medium text-slate-200 shadow-lg transition-colors"
            title="Layer Settings"
          >
            <Layers className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Layers</span>
          </button>

          {showLayerMenu && (
            <div className="absolute right-0 mt-2 w-64 p-3 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-30 flex flex-col gap-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="font-semibold text-slate-200">Map Overlays</span>
                <button onClick={() => setShowLayerMenu(false)} className="text-slate-400 hover:text-white text-xs">✕</button>
              </div>

              {/* Blueprint Scan Toggle & Opacity */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">CAD Blueprint Scan</span>
                  <button 
                    onClick={() => setShowBlueprint(!showBlueprint)}
                    className="text-amber-400 hover:text-amber-300"
                  >
                    {showBlueprint ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 text-slate-500" />}
                  </button>
                </div>
                {showBlueprint && (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400">Opacity:</span>
                    <input 
                      type="range" 
                      min="0.2" 
                      max="1" 
                      step="0.05"
                      value={blueprintOpacity}
                      onChange={(e) => setBlueprintOpacity(parseFloat(e.target.value))}
                      className="w-full accent-amber-500 h-1 bg-slate-700 rounded"
                    />
                    <span className="text-[10px] font-mono text-slate-400 w-8">{Math.round(blueprintOpacity * 100)}%</span>
                  </div>
                )}
              </div>

              {/* Sector Zones Toggle */}
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-slate-300">Sector Color Zones</span>
                <input 
                  type="checkbox" 
                  checked={showSectors} 
                  onChange={(e) => setShowSectors(e.target.checked)} 
                  className="rounded border-slate-700 text-amber-500 focus:ring-0 bg-slate-800"
                />
              </label>

              {/* Grill Numbers Toggle */}
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-slate-300">Grill Table Numbers</span>
                <input 
                  type="checkbox" 
                  checked={showGrillNumbers} 
                  onChange={(e) => setShowGrillNumbers(e.target.checked)} 
                  className="rounded border-slate-700 text-amber-500 focus:ring-0 bg-slate-800"
                />
              </label>

              {/* POI Pins Toggle */}
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-slate-300">Points of Interest</span>
                <input 
                  type="checkbox" 
                  checked={showPois} 
                  onChange={(e) => setShowPois(e.target.checked)} 
                  className="rounded border-slate-700 text-amber-500 focus:ring-0 bg-slate-800"
                />
              </label>
            </div>
          )}
        </div>

        {/* Zoom Controls Bar */}
        <div className="flex items-center bg-slate-900/90 backdrop-blur-md rounded-lg border border-slate-700/80 shadow-lg divide-x divide-slate-800">
          <button 
            onClick={() => handleZoom(1)} 
            className="p-2 hover:bg-slate-800 text-slate-200 hover:text-white transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleZoom(-1)} 
            className="p-2 hover:bg-slate-800 text-slate-200 hover:text-white transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button 
            onClick={resetMap} 
            className="p-2 hover:bg-slate-800 text-slate-200 hover:text-white transition-colors"
            title="Reset Fit"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button 
            onClick={toggleFullscreen} 
            className="p-2 hover:bg-slate-800 text-slate-200 hover:text-white transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* BOTTOM LEFT: QUICK JUMP TO SECTORS */}
      <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2">
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 backdrop-blur-md rounded-lg border border-slate-700/80 shadow-lg">
          <span className="text-[11px] font-semibold text-slate-400 px-2 uppercase tracking-wider hidden sm:inline">Jump To:</span>
          
          <button 
            onClick={() => jumpToSector(3)}
            className="px-2.5 py-1.5 text-xs font-semibold rounded bg-blue-950/80 hover:bg-blue-900 text-blue-300 border border-blue-700/60 transition-colors flex items-center gap-1"
          >
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            Stage 3 (West)
          </button>

          <button 
            onClick={() => jumpToSector(2)}
            className="px-2.5 py-1.5 text-xs font-semibold rounded bg-amber-950/80 hover:bg-amber-900 text-amber-300 border border-amber-700/60 transition-colors flex items-center gap-1"
          >
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            Stage 2 (Market)
          </button>

          <button 
            onClick={() => jumpToSector(1)}
            className="px-2.5 py-1.5 text-xs font-semibold rounded bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/60 transition-colors flex items-center gap-1"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Stage 1 (Civic)
          </button>
        </div>
      </div>

      {/* BOTTOM RIGHT: MINIMAP HUD */}
      <div className="absolute bottom-4 right-4 z-20 hidden md:block">
        <div className="relative w-64 h-24 bg-slate-900/90 backdrop-blur-md rounded-lg border border-slate-700/80 p-1.5 shadow-xl">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center justify-between">
            <span>Street Overview</span>
            <span className="font-mono text-amber-400 text-[9px]">{Math.round(scale * 100)}% Zoom</span>
          </div>

          {/* Miniature Street Strip Preview */}
          <div 
            className="relative w-full h-14 bg-slate-950 rounded border border-slate-800 overflow-hidden cursor-crosshair"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickXRatio = (e.clientX - rect.left) / rect.width;
              const clickYRatio = (e.clientY - rect.top) / rect.height;
              flyTo(clickXRatio * 100, clickYRatio * 100, scale);
            }}
          >
            {/* Sector indicator bars */}
            <div className="absolute left-0 top-0 bottom-0 w-[33.5%] bg-blue-500/15 border-r border-blue-500/30 flex items-center justify-center">
              <span className="text-[8px] font-mono font-bold text-blue-300">SEC 3</span>
            </div>
            <div className="absolute left-[33.5%] top-0 bottom-0 w-[34.5%] bg-amber-500/15 border-r border-amber-500/30 flex items-center justify-center">
              <span className="text-[8px] font-mono font-bold text-amber-300">SEC 2</span>
            </div>
            <div className="absolute left-[68%] top-0 bottom-0 w-[32%] bg-emerald-500/15 flex items-center justify-center">
              <span className="text-[8px] font-mono font-bold text-emerald-300">SEC 1</span>
            </div>

            {/* Red Camera Viewport Rectangle */}
            {containerRef.current && (
              <div 
                className="absolute border-2 border-red-500 bg-red-500/20 pointer-events-none transition-all duration-75"
                style={{
                  left: `${Math.max(0, Math.min(100, (-position.x / (MAP_WIDTH * scale)) * 100))}%`,
                  top: `${Math.max(0, Math.min(100, (-position.y / (MAP_HEIGHT * scale)) * 100))}%`,
                  width: `${Math.min(100, (containerRef.current.clientWidth / (MAP_WIDTH * scale)) * 100)}%`,
                  height: `${Math.min(100, (containerRef.current.clientHeight / (MAP_HEIGHT * scale)) * 100)}%`
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
