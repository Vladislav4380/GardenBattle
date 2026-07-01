export interface GardenSeedlingCatalogItem {
  id: string;
  name: string;
  description: string;
  image: string;
  width: number;
  height: number;
  scale: number;
  growthSeconds: number;
}

export const GARDEN_SEEDLINGS: GardenSeedlingCatalogItem[] = [
  {
    id: 'bed-3',
    name: 'Грядка 3',
    description: 'Саженец для размещения на огороде.',
    image: '/assets/garden/terrain/3.png',
    width: 182,
    height: 139,
    scale: 0.48,
    growthSeconds: 60
  },
  {
    id: 'bed-4',
    name: 'Грядка 4',
    description: 'Саженец для размещения на огороде.',
    image: '/assets/garden/terrain/4.png',
    width: 192,
    height: 149,
    scale: 0.48,
    growthSeconds: 120
  },
  {
    id: 'bed-5',
    name: 'Грядка 5',
    description: 'Саженец для размещения на огороде.',
    image: '/assets/garden/terrain/5.png',
    width: 172,
    height: 151,
    scale: 0.48,
    growthSeconds: 180
  }
];
