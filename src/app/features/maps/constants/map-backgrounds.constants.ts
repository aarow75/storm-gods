import { TerrainType } from '@maps/models/wilderness-map.model';

export interface MapBackground {
  id: string;
  label: string;
  imagePath: string;
  width: number;
  height: number;
  scale?: number;
  scaleUnit?: 'miles' | 'kilometers';
  terrainOverlay?: Record<string, TerrainType>;
}

// Preferred Gloranthan map scale is 30, but #2 scale matches up right with the map (27.69 to be more precise)
export const MAP_BACKGROUNDS: MapBackground[] = [
  {
    id: '2',
    label: 'Dragon Pass (CHA4033)',
    imagePath: '/maps/Map-of-Glorantha.jpg',
    width: 34,
    height: 24,
    scale: 10,
    scaleUnit: 'miles',
  },
  {
    id: '5',
    label: 'South Peloria (CHA4029)',
    imagePath: '/maps/Tarsh.jpg',
    width: 34,
    height: 24,
    scale: 8,
    scaleUnit: 'miles',
  },
  {
    id: '3',
    label: 'Dragon Pass Master Map (CHA4037)',
    imagePath: '/maps/Dragon-Pass-Master-Map.png',
    width: 35,
    height: 40,
    scale: 5,
    scaleUnit: 'miles',
  },
  {
    id: '1',
    label: 'Grasslands of Prax (Nomad Gods 1977)',
    imagePath: '/maps/MAIN_MAP-1690x2048.png',
    width: 33,
    height: 41,
    scale: 5,
    scaleUnit: 'miles',
  },
  {
    id: '4',
    label: 'Dragon Pass Board Game (1983)',
    imagePath: '/maps/Dragon-Pass-board.png',
    width: 31,
    height: 44,
    scale: 30,
    scaleUnit: 'miles',
  },
];

export function getMapBackgroundById(id: string): MapBackground | undefined {
  return MAP_BACKGROUNDS.find((bg) => bg.id === id);
}
