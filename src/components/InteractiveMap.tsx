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
  Info,
  Move,
  Scaling,
  Sliders,
  Check
} from 'lucide-react';
import { 
  SECTORS, 
  GRILL_BLOCKS, 
  INDIVIDUAL_SLOTS,
  IndividualSlot,
  LANDMARKS_BESIDE_SLOTS,
  LandmarkBesideSlot,
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
  selectedLandmark?: LandmarkBesideSlot | null;
  onSelectLandmark?: (landmark: LandmarkBesideSlot | null) => void;
  landmarks?: LandmarkBesideSlot[];
  onUpdateLandmark?: (landmark: LandmarkBesideSlot) => void;
  isShapeEditMode?: boolean;
  onToggleShapeEditMode?: () => void;
  activeEditLandmarkId?: string | null;
  onSelectEditLandmarkId?: (id: string | null) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  selectedGrill,
  onSelectGrill,
  selectedPoi,
  onSelectPoi,
  savedGrillNum,
  selectedLandmark,
  onSelectLandmark,
  landmarks,
  onUpdateLandmark,
  isShapeEditMode = false,
  onToggleShapeEditMode,
  activeEditLandmarkId = null,
  onSelectEditLandmarkId
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Active Drag State for Landmark Reshaping & Moving
  const [activeDrag, setActiveDrag] = useState<{
    mode: 'move' | 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w';
    startClientX: number;
    startClientY: number;
    initialLm: LandmarkBesideSlot;
  } | null>(null);

  const effectiveLandmarks = landmarks || LANDMARKS_BESIDE_SLOTS;

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
  const [showLandmarks, setShowLandmarks] = useState<boolean>(true);
  const [showGrillNumbers, setShowGrillNumbers] = useState<boolean>(true);
  const [showLayerMenu, setShowLayerMenu] = useState<boolean>(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');

  // Hover state for tooltip
  const [hoveredSlot, setHoveredSlot] = useState<IndividualSlot | null>(null);

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
    if (e.button !== 0 || activeDrag) return; // Only left click drags, ignore if dragging landmark
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || activeDrag) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Window Pointer listeners for landmark resizing & moving
  useEffect(() => {
    if (!activeDrag) return;

    const handlePointerMove = (e: PointerEvent) => {
      const deltaX = (e.clientX - activeDrag.startClientX) / scale;
      const deltaY = (e.clientY - activeDrag.startClientY) / scale;
      const init = activeDrag.initialLm;
      let newX = init.x;
      let newY = init.y;
      let newW = init.w;
      let newH = init.h;

      if (activeDrag.mode === 'move') {
        newX = Math.round(init.x + deltaX);
        newY = Math.round(init.y + deltaY);
      } else {
        if (activeDrag.mode.includes('e')) {
          newW = Math.max(25, Math.round(init.w + deltaX));
        } else if (activeDrag.mode.includes('w')) {
          const targetW = Math.max(25, Math.round(init.w - deltaX));
          const targetX = Math.round(init.x + (init.w - targetW));
          newX = targetX;
          newW = targetW;
        }

        if (activeDrag.mode.includes('s')) {
          newH = Math.max(15, Math.round(init.h + deltaY));
        } else if (activeDrag.mode.includes('n')) {
          const targetH = Math.max(15, Math.round(init.h - deltaY));
          const targetY = Math.round(init.y + (init.h - targetH));
          newY = targetY;
          newH = targetH;
        }
      }

      onUpdateLandmark?.({
        ...init,
        x: Math.max(0, newX),
        y: Math.max(0, newY),
        w: newW,
        h: newH
      });
    };

    const handlePointerUp = () => {
      setActiveDrag(null);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [activeDrag, scale, onUpdateLandmark]);

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

          {/* LANDMARKS BESIDE SLOTS (OFFICIAL ESTABLISHMENTS, LOTS & CIVIC BUILDINGS) */}
          {showLandmarks && (
            <g id="landmarks-beside-slots-layer">
              {effectiveLandmarks.map(lm => {
                const isSelected = selectedLandmark?.id === lm.id;
                const isEditing = isShapeEditMode && (activeEditLandmarkId === lm.id || selectedLandmark?.id === lm.id);

                let strokeColor = 'rgba(148, 163, 184, 0.45)';
                let fillColor = 'rgba(30, 41, 59, 0.40)';
                let textColor = '#e2e8f0';

                if (lm.category === 'government') {
                  strokeColor = 'rgba(16, 185, 129, 0.7)';
                  fillColor = isSelected ? 'rgba(16, 185, 129, 0.38)' : 'rgba(16, 185, 129, 0.16)';
                  textColor = '#6ee7b7';
                } else if (lm.category === 'police') {
                  strokeColor = 'rgba(59, 130, 246, 0.8)';
                  fillColor = isSelected ? 'rgba(59, 130, 246, 0.45)' : 'rgba(59, 130, 246, 0.22)';
                  textColor = '#93c5fd';
                } else if (lm.category === 'medical') {
                  strokeColor = 'rgba(239, 68, 68, 0.8)';
                  fillColor = isSelected ? 'rgba(239, 68, 68, 0.45)' : 'rgba(239, 68, 68, 0.22)';
                  textColor = '#fca5a5';
                } else if (lm.category === 'claiming') {
                  strokeColor = 'rgba(245, 158, 11, 0.8)';
                  fillColor = isSelected ? 'rgba(245, 158, 11, 0.45)' : 'rgba(245, 158, 11, 0.22)';
                  textColor = '#fde68a';
                } else if (lm.category === 'market') {
                  strokeColor = 'rgba(234, 88, 12, 0.85)';
                  fillColor = isSelected ? 'rgba(234, 88, 12, 0.38)' : 'rgba(234, 88, 12, 0.18)';
                  textColor = '#fdba74';
                } else if (lm.category === 'stage') {
                  strokeColor = 'rgba(220, 38, 38, 0.9)';
                  fillColor = isSelected ? 'rgba(220, 38, 38, 0.5)' : 'rgba(220, 38, 38, 0.28)';
                  textColor = '#fecaca';
                } else if (lm.category === 'park') {
                  strokeColor = 'rgba(5, 150, 105, 0.7)';
                  fillColor = isSelected ? 'rgba(5, 150, 105, 0.35)' : 'rgba(5, 150, 105, 0.18)';
                  textColor = '#a7f3d0';
                } else if (lm.category === 'commercial') {
                  strokeColor = 'rgba(99, 102, 241, 0.65)';
                  fillColor = isSelected ? 'rgba(99, 102, 241, 0.35)' : 'rgba(99, 102, 241, 0.14)';
                  textColor = '#c7d2fe';
                }

                if (isSelected || isEditing) {
                  strokeColor = isEditing ? '#38bdf8' : '#ffffff';
                }

                // Filter responsiveness if a quick category filter is active
                let matchesCategory = true;
                if (activeCategoryFilter === 'stage') {
                  matchesCategory = lm.category === 'stage';
                } else if (activeCategoryFilter === 'police') {
                  matchesCategory = lm.category === 'police';
                } else if (activeCategoryFilter === 'emergency') {
                  matchesCategory = lm.category === 'medical' || lm.category === 'claiming';
                } else if (activeCategoryFilter === 'landmark') {
                  matchesCategory = lm.category === 'government' || lm.category === 'park' || lm.category === 'commercial';
                }

                const opacity = matchesCategory ? 1 : 0.22;
                const centerX = lm.x + lm.w / 2;
                const centerY = lm.y + lm.h / 2;

                return (
                  <g 
                    key={lm.id}
                    className="cursor-pointer transition-opacity duration-200"
                    opacity={opacity}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onSelectEditLandmarkId) {
                        onSelectEditLandmarkId(lm.id);
                      }
                      if (onSelectLandmark) {
                        onSelectLandmark(lm);
                      }
                      if (!isShapeEditMode) {
                        flyTo((centerX / MAP_WIDTH) * 100, (centerY / MAP_HEIGHT) * 100, 3.0);
                      }
                    }}
                  >
                    {/* Footprint Box */}
                    <rect 
                      x={lm.x} 
                      y={lm.y} 
                      width={lm.w} 
                      height={lm.h} 
                      rx="6"
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth={isEditing ? 3.5 : isSelected ? 3.5 : 1.2}
                      onPointerDown={(e) => {
                        if (isShapeEditMode && isEditing) {
                          e.stopPropagation();
                          e.preventDefault();
                          setActiveDrag({
                            mode: 'move',
                            startClientX: e.clientX,
                            startClientY: e.clientY,
                            initialLm: { ...lm }
                          });
                        }
                      }}
                      className={isEditing ? 'cursor-move' : undefined}
                    />

                    {/* Landmark Name Label */}
                    <text 
                      x={centerX} 
                      y={lm.h > 180 ? lm.y + 45 : centerY} 
                      textAnchor="middle" 
                      dominantBaseline="central"
                      fill={textColor} 
                      fontSize={lm.w > 400 ? '22' : lm.w > 180 ? '16' : '13'} 
                      fontWeight="800"
                      letterSpacing="0.5"
                      pointerEvents="none"
                      className="select-none drop-shadow"
                    >
                      {lm.name}
                    </text>

                    {/* Adjacent Grills Indicator underneath name (if height allows) */}
                    {lm.h > 180 && (
                      <text 
                        x={centerX} 
                        y={lm.y + 75} 
                        textAnchor="middle" 
                        fill="#cbd5e1" 
                        fontSize="12.5" 
                        fontWeight="600"
                        fontFamily="JetBrains Mono, monospace"
                        pointerEvents="none"
                        opacity="0.9"
                      >
                        {lm.adjacentGrills}
                      </text>
                    )}

                    {/* SHAPE RESHAPING & MOVING HANDLES (WHEN EDIT MODE IS ACTIVE) */}
                    {isEditing && (
                      <g id={`edit-gizmo-${lm.id}`}>
                        {/* Cyan Bounding dashed outline */}
                        <rect 
                          x={lm.x} 
                          y={lm.y} 
                          width={lm.w} 
                          height={lm.h} 
                          rx="6"
                          fill="rgba(56, 189, 248, 0.14)"
                          stroke="#38bdf8" 
                          strokeWidth="3.5" 
                          strokeDasharray="10, 6"
                          pointerEvents="none"
                        />

                        {/* Top floating dimension pill */}
                        <g transform={`translate(${centerX}, ${lm.y - 36})`} pointerEvents="none">
                          <rect 
                            x="-150" 
                            y="-18" 
                            width="300" 
                            height="36" 
                            rx="6" 
                            fill="#0f172a" 
                            stroke="#38bdf8" 
                            strokeWidth="2" 
                          />
                          <text 
                            x="0" 
                            y="5" 
                            textAnchor="middle" 
                            fill="#38bdf8" 
                            fontSize="14" 
                            fontWeight="800" 
                            fontFamily="JetBrains Mono, monospace"
                          >
                            W: {lm.w} × H: {lm.h} | X: {lm.x}, Y: {lm.y}
                          </text>
                        </g>

                        {/* Corner Resize Handles */}
                        {/* NW */}
                        <rect 
                          x={lm.x - 14} 
                          y={lm.y - 14} 
                          width="28" 
                          height="28" 
                          rx="5" 
                          fill="#0284c7" 
                          stroke="#ffffff" 
                          strokeWidth="2.5" 
                          className="cursor-nwse-resize"
                          onPointerDown={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setActiveDrag({ mode: 'nw', startClientX: e.clientX, startClientY: e.clientY, initialLm: { ...lm } });
                          }}
                        />
                        {/* NE */}
                        <rect 
                          x={lm.x + lm.w - 14} 
                          y={lm.y - 14} 
                          width="28" 
                          height="28" 
                          rx="5" 
                          fill="#0284c7" 
                          stroke="#ffffff" 
                          strokeWidth="2.5" 
                          className="cursor-nesw-resize"
                          onPointerDown={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setActiveDrag({ mode: 'ne', startClientX: e.clientX, startClientY: e.clientY, initialLm: { ...lm } });
                          }}
                        />
                        {/* SE */}
                        <rect 
                          x={lm.x + lm.w - 14} 
                          y={lm.y + lm.h - 14} 
                          width="28" 
                          height="28" 
                          rx="5" 
                          fill="#0284c7" 
                          stroke="#ffffff" 
                          strokeWidth="2.5" 
                          className="cursor-nwse-resize"
                          onPointerDown={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setActiveDrag({ mode: 'se', startClientX: e.clientX, startClientY: e.clientY, initialLm: { ...lm } });
                          }}
                        />
                        {/* SW */}
                        <rect 
                          x={lm.x - 14} 
                          y={lm.y + lm.h - 14} 
                          width="28" 
                          height="28" 
                          rx="5" 
                          fill="#0284c7" 
                          stroke="#ffffff" 
                          strokeWidth="2.5" 
                          className="cursor-nesw-resize"
                          onPointerDown={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setActiveDrag({ mode: 'sw', startClientX: e.clientX, startClientY: e.clientY, initialLm: { ...lm } });
                          }}
                        />

                        {/* Edge Resize Handles */}
                        {/* N */}
                        <rect 
                          x={centerX - 12} 
                          y={lm.y - 12} 
                          width="24" 
                          height="24" 
                          rx="4" 
                          fill="#0284c7" 
                          stroke="#ffffff" 
                          strokeWidth="2" 
                          className="cursor-ns-resize"
                          onPointerDown={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setActiveDrag({ mode: 'n', startClientX: e.clientX, startClientY: e.clientY, initialLm: { ...lm } });
                          }}
                        />
                        {/* S */}
                        <rect 
                          x={centerX - 12} 
                          y={lm.y + lm.h - 12} 
                          width="24" 
                          height="24" 
                          rx="4" 
                          fill="#0284c7" 
                          stroke="#ffffff" 
                          strokeWidth="2" 
                          className="cursor-ns-resize"
                          onPointerDown={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setActiveDrag({ mode: 's', startClientX: e.clientX, startClientY: e.clientY, initialLm: { ...lm } });
                          }}
                        />
                        {/* W */}
                        <rect 
                          x={lm.x - 12} 
                          y={centerY - 12} 
                          width="24" 
                          height="24" 
                          rx="4" 
                          fill="#0284c7" 
                          stroke="#ffffff" 
                          strokeWidth="2" 
                          className="cursor-ew-resize"
                          onPointerDown={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setActiveDrag({ mode: 'w', startClientX: e.clientX, startClientY: e.clientY, initialLm: { ...lm } });
                          }}
                        />
                        {/* E */}
                        <rect 
                          x={lm.x + lm.w - 12} 
                          y={centerY - 12} 
                          width="24" 
                          height="24" 
                          rx="4" 
                          fill="#0284c7" 
                          stroke="#ffffff" 
                          strokeWidth="2" 
                          className="cursor-ew-resize"
                          onPointerDown={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setActiveDrag({ mode: 'e', startClientX: e.clientX, startClientY: e.clientY, initialLm: { ...lm } });
                          }}
                        />

                        {/* Central Drag & Move Pill Handle */}
                        <g 
                          transform={`translate(${centerX}, ${centerY})`}
                          className="cursor-move"
                          onPointerDown={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setActiveDrag({ mode: 'move', startClientX: e.clientX, startClientY: e.clientY, initialLm: { ...lm } });
                          }}
                        >
                          <circle r="22" fill="#0284c7" stroke="#ffffff" strokeWidth="2.5" />
                          <circle r="8" fill="#ffffff" />
                        </g>
                      </g>
                    )}
                  </g>
                );
              })}
            </g>
          )}

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

          {/* ACTIVE SELECTED POI HIGHLIGHT (CLEAN RECTANGULAR CALLOUT, ZERO CIRCULAR ICONS) */}
          {selectedPoi && (
            <g 
              id="selected-poi-marker"
              transform={`translate(${(selectedPoi.xPercent / 100) * MAP_WIDTH}, ${(selectedPoi.yPercent / 100) * MAP_HEIGHT})`}
              pointerEvents="none"
              filter="url(#radar-glow)"
            >
              <rect 
                x={-Math.max(selectedPoi.name.length * 9, 110)} 
                y="-32" 
                width={Math.max(selectedPoi.name.length * 18, 220)} 
                height="56" 
                rx="8" 
                fill="#0f172a" 
                stroke="#38bdf8" 
                strokeWidth="3.5" 
              />
              <text 
                x="0" 
                y="4" 
                textAnchor="middle" 
                fill="#ffffff" 
                fontSize="22" 
                fontWeight="800"
                fontFamily="JetBrains Mono, monospace"
              >
                ★ {selectedPoi.name}
              </text>
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

      {/* ACTIVE SHAPE EDIT MODE BANNER */}
      {isShapeEditMode && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5 px-4 py-2 bg-slate-900/95 border border-sky-500/80 shadow-2xl rounded-full text-xs text-sky-200 backdrop-blur-md animate-in fade-in slide-in-from-top-2">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-ping" />
          <span className="font-bold text-white">Landmark Reshaping Mode</span>
          <span className="text-slate-400 hidden md:inline">· Drag shape to move, or drag blue handles to resize</span>
          {onToggleShapeEditMode && (
            <button 
              onClick={onToggleShapeEditMode}
              className="ml-2 px-2.5 py-0.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-full text-[11px] transition-colors"
            >
              Done
            </button>
          )}
        </div>
      )}

      {/* TOP RIGHT CONTROLS: ZOOM, FULLSCREEN, LAYERS */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        {/* Landmark Shape Adjustment Toggle */}
        {onToggleShapeEditMode && (
          <button
            onClick={onToggleShapeEditMode}
            className={`flex items-center gap-1.5 px-3 py-2 backdrop-blur-md rounded-lg border text-xs font-semibold shadow-lg transition-all ${
              isShapeEditMode 
                ? 'bg-sky-500 text-slate-950 border-sky-400 ring-2 ring-sky-400/40' 
                : 'bg-slate-900/90 hover:bg-slate-800 text-slate-200 border-slate-700/80 hover:text-white'
            }`}
            title="Adjust Landmark Shapes & Coordinates"
          >
            <Move className="w-4 h-4" />
            <span className="hidden sm:inline">{isShapeEditMode ? 'Adjusting Shapes' : 'Adjust Shapes'}</span>
          </button>
        )}

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

              {/* Landmarks Beside Slots Toggle */}
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-slate-300">Landmarks Beside Slots</span>
                <input 
                  type="checkbox" 
                  checked={showLandmarks} 
                  onChange={(e) => setShowLandmarks(e.target.checked)} 
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
