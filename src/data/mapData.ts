/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Kalutan ed Dalan 2027 - Mapandan, Pangasinan
 * Comprehensive GIS & Layout Data parsed from official CAD blueprint:
 * /public/assets/aistudio/Kalutan-ed-Dalan-2027-Layout-Merged__1__57ec3954.pdf
 */

export interface GrillInfo {
  number: number;
  row: 'top' | 'bottom'; // Top (North) = 1-222, Bottom (South) = 223-414
  sectorId: 1 | 2 | 3;
  stage: string;
  nearestPolice: string;
  nearestMedical: string;
  nearestClaiming: string;
  landmarkNear: string;
  xPercent: number; // 0 to 100% on the map canvas
  yPercent: number; // 0 to 100% on the map canvas
  slotX: number; // Exact CAD pixel coordinate
  slotY: number; // Exact CAD pixel coordinate
  slotW: number; // Exact CAD width in pixels (~40px)
  slotH: number; // Exact CAD height in pixels (~85px)
}

export interface SectorInfo {
  id: 1 | 2 | 3;
  name: string;
  title: string;
  tagline: string;
  stageName: string;
  startX: number;
  endX: number;
  color: string;
  grillsTop: string;
  grillsBottom: string;
  description: string;
  keyLandmarks: string[];
}

export interface POI {
  id: string;
  name: string;
  category: 'stage' | 'police' | 'medical' | 'claiming' | 'government' | 'landmark' | 'commercial' | 'amenity' | 'crossing';
  xPercent: number;
  yPercent: number;
  sectorId: 1 | 2 | 3;
  description: string;
  details?: string;
  iconType?: string;
}

export interface GrillBlock {
  id: string;
  row: 'top' | 'bottom';
  sectorId: 1 | 2 | 3;
  startNum: number;
  endNum: number;
  count: number;
  startX: number;
  endX: number;
  yPercent: number;
  label: string;
  opposingBlockId?: string;
}

export const SECTORS: SectorInfo[] = [
  {
    id: 3,
    name: 'Sector 3 (West)',
    title: 'Town Center & West Entrance',
    tagline: 'Mapandan Town Center, McDo & Parking Area',
    stageName: 'Stage 3',
    startX: 0,
    endX: 33.5,
    color: '#3b82f6', // Blue
    grillsTop: 'Grills 176 – 222 (47 tables)',
    grillsBottom: 'Grills 386 – 414 (29 tables)',
    description: 'Western festival entry with dedicated vehicular parking access, fast food anchors, motorcycle retail strip, and Stage 3 acoustics.',
    keyLandmarks: [
      'Mapandan Town Center',
      'Festival Parking Entrance',
      'McDonald\'s & Alfamart',
      'Southstar Drug & Brent Gas',
      'Medical Response Team West',
      'West Claiming Station',
      'Police Stations 10, 11, 12'
    ]
  },
  {
    id: 2,
    name: 'Sector 2 (Central)',
    title: 'Public Market & Commercial Strip',
    tagline: 'Mapandan Public Market & Heart of Kalutan',
    stageName: 'Stage 2',
    startX: 33.5,
    endX: 68.0,
    color: '#f59e0b', // Amber / Gold
    grillsTop: 'Grills 49 – 175 (127 tables)',
    grillsBottom: 'Grills 271 – 385 (115 tables)',
    description: 'The longest central grilling corridor directly adjacent to Mapandan Public Market, local food vendors, 7-Eleven, and Producers Bank.',
    keyLandmarks: [
      'Mapandan Public Market',
      'Stage 2 (Market Crossing)',
      'Central Claiming Station',
      'Central Medical Response Team',
      '7-Eleven & Producers Bank',
      'St. Joseph Drugstore & Meditek',
      'Police Stations 4, 5, 6, 7, 8, 9'
    ]
  },
  {
    id: 1,
    name: 'Sector 1 (East)',
    title: 'Civic Center & Grand Stage',
    tagline: 'Municipal Hall, People\'s Park & Grand Stage 1',
    stageName: 'Stage 1',
    startX: 68.0,
    endX: 100,
    color: '#10b981', // Emerald
    grillsTop: 'Grills 1 – 48 (48 tables)',
    grillsBottom: 'Grills 223 – 270 (48 tables)',
    description: 'The eastern civic plaza with the Grand Opening Stage 1, Municipal Hall, Mapandan People\'s Park, Municipal Police HQ, and Island Payong-Payong.',
    keyLandmarks: [
      'Grand Stage 1 & Island Payong-Payong',
      'Mapandan Municipal Hall',
      'Mapandan Central School',
      'Mapandan Police Station HQ',
      'Mapandan People\'s Park & Auditorium',
      'Negosyo Center & LED Display',
      'Police Stations 1, 2, 3'
    ]
  }
];

// Defined Grill Blocks as marked in the blueprint
export const GRILL_BLOCKS: GrillBlock[] = [
  // SECTOR 1 (East) - Top Row (Rightmost)
  { id: 't-1-11', row: 'top', sectorId: 1, startNum: 1, endNum: 11, count: 11, startX: 83.5, endX: 86.8, yPercent: 47.8, label: '1 - 11', opposingBlockId: 'b-223-233' },
  { id: 't-12-22', row: 'top', sectorId: 1, startNum: 12, endNum: 22, count: 11, startX: 80.0, endX: 83.3, yPercent: 47.8, label: '12 - 22', opposingBlockId: 'b-234-244' },
  { id: 't-23-33', row: 'top', sectorId: 1, startNum: 23, endNum: 33, count: 11, startX: 76.5, endX: 79.8, yPercent: 47.8, label: '23 - 33', opposingBlockId: 'b-245-255' },
  { id: 't-34-43', row: 'top', sectorId: 1, startNum: 34, endNum: 43, count: 10, startX: 72.8, endX: 76.2, yPercent: 47.8, label: '34 - 43', opposingBlockId: 'b-256-265' },
  { id: 't-44-48', row: 'top', sectorId: 1, startNum: 44, endNum: 48, count: 5, startX: 68.8, endX: 72.5, yPercent: 47.8, label: '44 - 48', opposingBlockId: 'b-266-270' },

  // SECTOR 1 (East) - Bottom Row (Rightmost)
  { id: 'b-223-233', row: 'bottom', sectorId: 1, startNum: 223, endNum: 233, count: 11, startX: 83.5, endX: 86.8, yPercent: 53.6, label: '223 - 233', opposingBlockId: 't-1-11' },
  { id: 'b-234-244', row: 'bottom', sectorId: 1, startNum: 234, endNum: 244, count: 11, startX: 80.0, endX: 83.3, yPercent: 53.6, label: '234 - 244', opposingBlockId: 't-12-22' },
  { id: 'b-245-255', row: 'bottom', sectorId: 1, startNum: 245, endNum: 255, count: 11, startX: 76.5, endX: 79.8, yPercent: 53.6, label: '245 - 255', opposingBlockId: 't-23-33' },
  { id: 'b-256-265', row: 'bottom', sectorId: 1, startNum: 256, endNum: 265, count: 10, startX: 72.8, endX: 76.2, yPercent: 53.6, label: '256 - 265', opposingBlockId: 't-34-43' },
  { id: 'b-266-270', row: 'bottom', sectorId: 1, startNum: 266, endNum: 270, count: 5, startX: 68.8, endX: 72.5, yPercent: 53.6, label: '266 - 270', opposingBlockId: 't-44-48' },

  // SECTOR 2 (Central) - Top Row
  { id: 't-49-59', row: 'top', sectorId: 2, startNum: 49, endNum: 59, count: 11, startX: 64.5, endX: 68.2, yPercent: 47.8, label: '49 - 59', opposingBlockId: 'b-271-307' },
  { id: 't-60-82', row: 'top', sectorId: 2, startNum: 60, endNum: 82, count: 23, startX: 58.0, endX: 64.2, yPercent: 47.8, label: '60 - 82', opposingBlockId: 'b-271-307' },
  { id: 't-83-93', row: 'top', sectorId: 2, startNum: 83, endNum: 93, count: 11, startX: 54.5, endX: 57.8, yPercent: 47.8, label: '83 - 93', opposingBlockId: 'b-271-307' },
  { id: 't-94-116', row: 'top', sectorId: 2, startNum: 94, endNum: 116, count: 23, startX: 47.5, endX: 54.0, yPercent: 47.8, label: '94 - 116', opposingBlockId: 'b-308-332' },
  { id: 't-117-119', row: 'top', sectorId: 2, startNum: 117, endNum: 119, count: 3, startX: 46.2, endX: 47.3, yPercent: 47.8, label: '117 - 119', opposingBlockId: 'b-333' },
  { id: 't-120-130', row: 'top', sectorId: 2, startNum: 120, endNum: 130, count: 11, startX: 42.5, endX: 46.0, yPercent: 47.8, label: '120 - 130', opposingBlockId: 'b-334-370' },
  { id: 't-131-141', row: 'top', sectorId: 2, startNum: 131, endNum: 141, count: 11, startX: 39.0, endX: 42.3, yPercent: 47.8, label: '131 - 141', opposingBlockId: 'b-334-370' },
  { id: 't-142-152', row: 'top', sectorId: 2, startNum: 142, endNum: 152, count: 11, startX: 35.5, endX: 38.8, yPercent: 47.8, label: '142 - 152', opposingBlockId: 'b-334-370' },
  { id: 't-153-175', row: 'top', sectorId: 2, startNum: 153, endNum: 175, count: 23, startX: 33.8, endX: 35.2, yPercent: 47.8, label: '153 - 175', opposingBlockId: 'b-371-385' },

  // SECTOR 2 (Central) - Bottom Row
  { id: 'b-271-307', row: 'bottom', sectorId: 2, startNum: 271, endNum: 307, count: 37, startX: 55.0, endX: 68.2, yPercent: 53.6, label: '271 - 307', opposingBlockId: 't-49-59' },
  { id: 'b-308-332', row: 'bottom', sectorId: 2, startNum: 308, endNum: 332, count: 25, startX: 47.5, endX: 54.5, yPercent: 53.6, label: '308 - 332', opposingBlockId: 't-94-116' },
  { id: 'b-333', row: 'bottom', sectorId: 2, startNum: 333, endNum: 333, count: 1, startX: 46.2, endX: 47.3, yPercent: 53.6, label: '333', opposingBlockId: 't-117-119' },
  { id: 'b-334-370', row: 'bottom', sectorId: 2, startNum: 334, endNum: 370, count: 37, startX: 37.0, endX: 46.0, yPercent: 53.6, label: '334 - 370', opposingBlockId: 't-120-130' },
  { id: 'b-371-385', row: 'bottom', sectorId: 2, startNum: 371, endNum: 385, count: 15, startX: 33.8, endX: 36.8, yPercent: 53.6, label: '371 - 385', opposingBlockId: 't-153-175' },

  // SECTOR 3 (West) - Top Row
  { id: 't-176-178', row: 'top', sectorId: 3, startNum: 176, endNum: 178, count: 3, startX: 31.8, endX: 33.2, yPercent: 47.8, label: '176 - 178', opposingBlockId: 'b-386-395' },
  { id: 't-179-189', row: 'top', sectorId: 3, startNum: 179, endNum: 189, count: 11, startX: 28.5, endX: 31.6, yPercent: 47.8, label: '179 - 189', opposingBlockId: 'b-386-395' },
  { id: 't-190-193', row: 'top', sectorId: 3, startNum: 190, endNum: 193, count: 4, startX: 26.8, endX: 28.3, yPercent: 47.8, label: '190 - 193', opposingBlockId: 'b-396' },
  { id: 't-194-200', row: 'top', sectorId: 3, startNum: 194, endNum: 200, count: 7, startX: 24.2, endX: 26.6, yPercent: 47.8, label: '194 - 200', opposingBlockId: 'b-397-406' },
  { id: 't-201-204', row: 'top', sectorId: 3, startNum: 201, endNum: 204, count: 4, startX: 22.5, endX: 24.0, yPercent: 47.8, label: '201 - 204', opposingBlockId: 'b-397-406' },
  { id: 't-205-211', row: 'top', sectorId: 3, startNum: 205, endNum: 211, count: 7, startX: 19.8, endX: 22.3, yPercent: 47.8, label: '205 - 211', opposingBlockId: 'b-407' },
  { id: 't-212-215', row: 'top', sectorId: 3, startNum: 212, endNum: 215, count: 4, startX: 18.0, endX: 19.6, yPercent: 47.8, label: '212 - 215', opposingBlockId: 'b-408-414' },
  { id: 't-216-219', row: 'top', sectorId: 3, startNum: 216, endNum: 219, count: 4, startX: 16.3, endX: 17.8, yPercent: 47.8, label: '216 - 219', opposingBlockId: 'b-408-414' },
  { id: 't-220-222', row: 'top', sectorId: 3, startNum: 220, endNum: 222, count: 3, startX: 14.5, endX: 16.1, yPercent: 47.8, label: '220 - 222', opposingBlockId: 'b-408-414' },

  // SECTOR 3 (West) - Bottom Row
  { id: 'b-386-395', row: 'bottom', sectorId: 3, startNum: 386, endNum: 395, count: 10, startX: 28.5, endX: 33.2, yPercent: 53.6, label: '386 - 395', opposingBlockId: 't-176-178' },
  { id: 'b-396', row: 'bottom', sectorId: 3, startNum: 396, endNum: 396, count: 1, startX: 26.8, endX: 28.3, yPercent: 53.6, label: '396', opposingBlockId: 't-190-193' },
  { id: 'b-397-406', row: 'bottom', sectorId: 3, startNum: 397, endNum: 406, count: 10, startX: 22.5, endX: 26.6, yPercent: 53.6, label: '397 - 406', opposingBlockId: 't-194-200' },
  { id: 'b-407', row: 'bottom', sectorId: 3, startNum: 407, endNum: 407, count: 1, startX: 19.8, endX: 22.3, yPercent: 53.6, label: '407', opposingBlockId: 't-205-211' },
  { id: 'b-408-414', row: 'bottom', sectorId: 3, startNum: 408, endNum: 414, count: 7, startX: 14.5, endX: 19.6, yPercent: 53.6, label: '408 - 414', opposingBlockId: 't-212-215' },
];

import { INDIVIDUAL_SLOTS, IndividualSlot } from './individualSlots';
import { LANDMARKS_BESIDE_SLOTS, LandmarkBesideSlot } from './landmarksBesideSlots';

export { INDIVIDUAL_SLOTS, LANDMARKS_BESIDE_SLOTS };
export type { IndividualSlot, LandmarkBesideSlot };

// Helper to generate full lookup table of individual grills 1 through 414
export function generateGrillDatabase(): Map<number, GrillInfo> {
  const map = new Map<number, GrillInfo>();

  INDIVIDUAL_SLOTS.forEach(slot => {
    const num = slot.number;
    let stage = 'Stage 1';
    let nearestPolice = 'Station 1 Police';
    let nearestMedical = 'Medical Post East';
    let nearestClaiming = 'Claiming Station East';
    let landmarkNear = 'Municipal Hall & Park';

    if (slot.sectorId === 1) {
      stage = 'Stage 1 (Civic Plaza)';
      if (num <= 22 || (num >= 223 && num <= 244)) {
        nearestPolice = 'Station 1 Police / Municipal Police HQ';
        landmarkNear = 'Front of Central School & Municipal Hall';
      } else if (num <= 33 || (num >= 245 && num <= 255)) {
        nearestPolice = 'Station 2 Police';
        landmarkNear = 'Near Auditorium & People\'s Park';
      } else {
        nearestPolice = 'Station 3 Police';
        landmarkNear = 'Near Dental Clinic & Sison Residence';
      }
      nearestMedical = 'East Medical Post (Stage 1)';
      nearestClaiming = 'East Claiming Tent (Municipal Hall)';
    } else if (slot.sectorId === 2) {
      stage = 'Stage 2 (Public Market)';
      if (num <= 70 || (num >= 271 && num <= 290)) {
        nearestPolice = 'Station 4 Police';
        landmarkNear = 'Front of 7/Eleven & Producers Bank';
      } else if (num <= 100 || (num >= 291 && num <= 315)) {
        nearestPolice = 'Station 5 & 6 Police';
        landmarkNear = 'Front of Meditek & Paint Center';
      } else if (num <= 130 || (num >= 316 && num <= 345)) {
        nearestPolice = 'Station 7 Police';
        landmarkNear = 'Mapandan Public Market Entrance';
      } else {
        nearestPolice = 'Station 8 & 9 Police';
        landmarkNear = 'Near Tambaoan Bldg & MUA Hardware';
      }
      nearestMedical = 'Central Medical Response Team (Market)';
      nearestClaiming = 'Central Claiming Station (Market Plaza)';
    } else {
      stage = 'Stage 3 (Town Center)';
      if (num <= 195 || (num >= 386 && num <= 396)) {
        nearestPolice = 'Station 10 Police';
        landmarkNear = 'Near Macky Lechon & City of Fog';
      } else if (num <= 210 || (num >= 397 && num <= 407)) {
        nearestPolice = 'Station 11 Police';
        landmarkNear = 'Near Alfamart & McDo';
      } else {
        nearestPolice = 'Station 12 Police';
        landmarkNear = 'Mapandan Town Center & Parking Access';
      }
      nearestMedical = 'West Medical Response (Town Center)';
      nearestClaiming = 'West Claiming Station (Town Center)';
    }

    map.set(num, {
      number: num,
      row: slot.row,
      sectorId: slot.sectorId,
      stage,
      nearestPolice,
      nearestMedical,
      nearestClaiming,
      landmarkNear,
      xPercent: slot.xPercent,
      yPercent: slot.yPercent,
      slotX: slot.slotX,
      slotY: slot.slotY,
      slotW: slot.slotW,
      slotH: slot.slotH
    });
  });

  return map;
}

export const ALL_GRILLS: Map<number, GrillInfo> = generateGrillDatabase();

export const POI_LIST: POI[] = [
  // --- STAGES ---
  {
    id: 'stage-1',
    name: 'Stage 1 (Grand Stage)',
    category: 'stage',
    xPercent: 88.5,
    yPercent: 49.0,
    sectorId: 1,
    description: 'Grand Opening Stage, Opening Ceremonies, VIP Lounge, Island Payong-Payong.',
    details: 'Opening ceremony starts 4:00 PM. Live Bangus festival orchestra and civic program.'
  },
  {
    id: 'stage-2',
    name: 'Stage 2 (Public Market)',
    category: 'stage',
    xPercent: 36.5,
    yPercent: 42.5,
    sectorId: 2,
    description: 'Central Festival Stage, street dancing presentations & indie bands.',
    details: 'Continuous entertainment throughout grilling hours with Pangasinan local artists.'
  },
  {
    id: 'stage-3',
    name: 'Stage 3 (Town Center)',
    category: 'stage',
    xPercent: 13.5,
    yPercent: 47.0,
    sectorId: 3,
    description: 'West Festival Stage, youth performances & modern acoustic sets.',
    details: 'Conveniently situated right by Mapandan Town Center and parking entrance.'
  },

  // --- GOVERNMENT & CIVIC ---
  {
    id: 'municipal-hall',
    name: 'Mapandan Municipal Hall',
    category: 'government',
    xPercent: 78.5,
    yPercent: 31.0,
    sectorId: 1,
    description: 'Official seat of Municipal Government of Mapandan, Pangasinan.',
    details: 'Administrative command center, Mayor\'s desk & festival coordination secretariat.'
  },
  {
    id: 'police-hq',
    name: 'Mapandan Police Station HQ',
    category: 'police',
    xPercent: 80.2,
    yPercent: 33.5,
    sectorId: 1,
    description: 'Main Police Station Headquarters & Central Dispatch.',
    details: 'Emergency Hotline: (075) 523-2222 / 911 dispatch.'
  },
  {
    id: 'central-school',
    name: 'Mapandan Central School',
    category: 'government',
    xPercent: 89.0,
    yPercent: 34.0,
    sectorId: 1,
    description: 'Mapandan Central Elementary School campus boundary.',
    details: 'Designated staging zone for street dancing contingents and performers.'
  },
  {
    id: 'peoples-park',
    name: 'Mapandan People\'s Park',
    category: 'landmark',
    xPercent: 82.5,
    yPercent: 70.0,
    sectorId: 1,
    description: 'Town plaza, public open space, playground, and Flag Pole.',
    details: 'Family rest area, shaded benches, and civic gathering.'
  },
  {
    id: 'auditorium',
    name: 'Municipal Auditorium',
    category: 'landmark',
    xPercent: 76.5,
    yPercent: 68.0,
    sectorId: 1,
    description: 'Covered gymnasium & municipal auditorium.',
    details: 'Indoor holding area and emergency weather shelter.'
  },
  {
    id: 'negosyo-center',
    name: 'Negosyo Center & ATM',
    category: 'amenity',
    xPercent: 80.8,
    yPercent: 68.5,
    sectorId: 1,
    description: 'DTI Negosyo Center, Automated Teller Machine, Aircon Waiting Shed.',
    details: 'Cash withdrawal services and passenger drop-off shed.'
  },
  {
    id: 'market',
    name: 'Mapandan Public Market',
    category: 'commercial',
    xPercent: 42.0,
    yPercent: 32.0,
    sectorId: 2,
    description: 'Town Central Market, fresh produce, seafood & local delicacies.',
    details: 'Fresh condiments, chili, calamansi, tomatoes and drinks available.'
  },
  {
    id: 'town-center',
    name: 'Mapandan Town Center',
    category: 'commercial',
    xPercent: 12.0,
    yPercent: 33.0,
    sectorId: 3,
    description: 'Mapandan Town Center commercial complex & supermarket.',
    details: 'Air-conditioned retail center, pharmacy, and parking access.'
  },

  // --- POLICE STATIONS (Stations 1 to 12) ---
  { id: 'pol-1', name: 'Station 1 Police Post', category: 'police', xPercent: 76.2, yPercent: 57.5, sectorId: 1, description: 'Patrol Post Sector 1 East (Grills 1-22 & 223-244).' },
  { id: 'pol-2', name: 'Station 2 Police Post', category: 'police', xPercent: 73.0, yPercent: 57.5, sectorId: 1, description: 'Patrol Post Sector 1 Central (Grills 23-43 & 245-265).' },
  { id: 'pol-3', name: 'Station 3 Police Post', category: 'police', xPercent: 69.0, yPercent: 44.5, sectorId: 1, description: 'Patrol Post Sector 1 West boundary (Grills 44-48 & 266-270).' },
  { id: 'pol-4', name: 'Station 4 Police Post', category: 'police', xPercent: 57.2, yPercent: 44.5, sectorId: 2, description: 'Patrol Post Sector 2 East (Front of Producers Bank & 7-Eleven).' },
  { id: 'pol-5', name: 'Station 5 Police Post', category: 'police', xPercent: 49.5, yPercent: 44.5, sectorId: 2, description: 'Patrol Post Sector 2 Mid-East (Front of Paint Center).' },
  { id: 'pol-6', name: 'Station 6 Police Post', category: 'police', xPercent: 47.0, yPercent: 44.5, sectorId: 2, description: 'Patrol Post Sector 2 Market West (Front of Penuliar Store).' },
  { id: 'pol-7', name: 'Station 7 Police Post', category: 'police', xPercent: 35.0, yPercent: 44.5, sectorId: 2, description: 'Patrol Post Sector 2 Stage 2 Crossing.' },
  { id: 'pol-8', name: 'Station 8 Police Post', category: 'police', xPercent: 30.5, yPercent: 44.5, sectorId: 2, description: 'Patrol Post Sector 2 West (Front of Tambaoan Bldg).' },
  { id: 'pol-9', name: 'Station 9 Police Post', category: 'police', xPercent: 27.5, yPercent: 44.5, sectorId: 2, description: 'Patrol Post Sector 2 / 3 boundary (Front of O\'Save).' },
  { id: 'pol-10', name: 'Station 10 Police Post', category: 'police', xPercent: 22.8, yPercent: 44.5, sectorId: 3, description: 'Patrol Post Sector 3 East (Front of Perez Residence).' },
  { id: 'pol-11', name: 'Station 11 Police Post', category: 'police', xPercent: 18.2, yPercent: 44.5, sectorId: 3, description: 'Patrol Post Sector 3 Mid (Front of Cuizon / Alfamart).' },
  { id: 'pol-12', name: 'Station 12 Police Post', category: 'police', xPercent: 5.8, yPercent: 56.5, sectorId: 3, description: 'Patrol Post Sector 3 West Entrance & Parking perimeter.' },

  // --- MEDICAL & CLAIMING STATIONS ---
  {
    id: 'med-east',
    name: 'East Medical Response Post',
    category: 'medical',
    xPercent: 86.0,
    yPercent: 44.0,
    sectorId: 1,
    description: 'RHU First Aid station, paramedic team, ambulance standby.',
    details: 'Trained EMTs on site with burn ointments, hydration salts, and oxygen.'
  },
  {
    id: 'claim-east',
    name: 'East Claiming Station (Stage 1)',
    category: 'claiming',
    xPercent: 84.0,
    yPercent: 44.0,
    sectorId: 1,
    description: 'Grill Kit & Bangus distribution for Grills 1 to 48 and 223 to 270.',
    details: 'Present ticket stub / confirmation SMS. Includes 5 fresh bangus, charcoal pack, and tongs.'
  },
  {
    id: 'med-central',
    name: 'Central Medical Response Team',
    category: 'medical',
    xPercent: 41.5,
    yPercent: 57.5,
    sectorId: 2,
    description: 'MDRRMO Central First Aid & mobile medic triage.',
    details: 'Equipped for heat exhaustion, smoke irritation, and minor cuts/burns.'
  },
  {
    id: 'claim-central',
    name: 'Central Claiming Station (Market)',
    category: 'claiming',
    xPercent: 43.5,
    yPercent: 57.5,
    sectorId: 2,
    description: 'Grill Kit & Bangus distribution for Grills 49 to 175 and 271 to 385.',
    details: 'Serving the central corridor. Fast-track claiming lanes for bulk ticket holders.'
  },
  {
    id: 'med-west',
    name: 'West Medical Response Team',
    category: 'medical',
    xPercent: 17.5,
    yPercent: 57.5,
    sectorId: 3,
    description: 'West First Aid Post & standby emergency transport.',
    details: 'Located adjacent to Town Center crossing and parking access road.'
  },
  {
    id: 'claim-west',
    name: 'West Claiming Station (Town Center)',
    category: 'claiming',
    xPercent: 19.5,
    yPercent: 57.5,
    sectorId: 3,
    description: 'Grill Kit & Bangus distribution for Grills 176 to 222 and 386 to 414.',
    details: 'Pickup station for western sector participants and drive-in arrivals.'
  },

  // --- PARKING & TRANSIT ---
  {
    id: 'parking-west',
    name: 'West Parking Area Entrance ("To Parking")',
    category: 'amenity',
    xPercent: 11.5,
    yPercent: 49.5,
    sectorId: 3,
    description: 'Official festival parking access for 4-wheel and 2-wheel vehicles.',
    details: 'Follow traffic marshals. Parking fee: Standard municipal rate.'
  },

  // --- COMMERCIAL ANCHORS ---
  {
    id: 'mcdonalds',
    name: 'McDonald\'s Mapandan',
    category: 'commercial',
    xPercent: 19.5,
    yPercent: 68.0,
    sectorId: 3,
    description: 'Fast food restaurant, cold drinks, desserts, air-conditioned seating.',
  },
  {
    id: 'alfamart',
    name: 'Alfamart',
    category: 'commercial',
    xPercent: 17.5,
    yPercent: 67.0,
    sectorId: 3,
    description: 'Convenience store, ice, bottled beverages, paper towels.',
  },
  {
    id: 'seven-eleven',
    name: '7-Eleven Mapandan',
    category: 'commercial',
    xPercent: 55.5,
    yPercent: 34.0,
    sectorId: 2,
    description: '24-hour convenience store, refreshments, ice cubes, snacks.',
  },
  {
    id: 'producers-bank',
    name: 'Producers Bank',
    category: 'commercial',
    xPercent: 56.5,
    yPercent: 67.0,
    sectorId: 2,
    description: 'Commercial bank branch with automated ATM machine.',
  },
  {
    id: 'st-joseph',
    name: 'St. Joseph Drugstore',
    category: 'commercial',
    xPercent: 63.5,
    yPercent: 67.0,
    sectorId: 2,
    description: 'Pharmacy, burn creams, face masks, electrolyte drinks.',
  },
  {
    id: 'southstar-drug',
    name: 'Southstar Drug',
    category: 'commercial',
    xPercent: 12.5,
    yPercent: 43.5,
    sectorId: 3,
    description: 'Retail pharmacy & health essentials.',
  }
];

export const FESTIVAL_RULES = [
  {
    title: 'Kit Claiming & Identification',
    desc: 'Each registered participant must present their confirmation SMS or paper stub at their designated Claiming Station (East, Central, or West according to your Grill Number).'
  },
  {
    title: 'Simultaneous Lighting Ceremony',
    desc: 'Official lighting of all 414 charcoal grills occurs simultaneously at 5:00 PM upon the signal blast from Grand Stage 1.'
  },
  {
    title: 'Fire Safety & Fire Marshals',
    desc: 'Water buckets and sand are pre-positioned at each of the 12 Police Stations along the street. BFP fire marshals actively patrol the central lane.'
  },
  {
    title: 'Clean As You Go (CLAYGO)',
    desc: 'Biodegradable ash disposal metal drums are situated every 15 grill tables. Please segregate plastic trash and fish innards.'
  },
  {
    title: 'Road Closure & Emergency Lanes',
    desc: 'The entire 1.2-kilometer festival strip is strictly pedestrianized. A 2-meter emergency center lane must remain free of chairs and obstacles at all times.'
  }
];
