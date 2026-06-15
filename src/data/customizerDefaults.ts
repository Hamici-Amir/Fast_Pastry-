export interface CustomizerSize { key: string; label: string; detail: string; servings: string; surcharge: number }
export interface CustomizerFlavor { key: string; label: string; desc: string; surcharge: number }
export interface FrostingColor { key: string; name: string; hex: string; label: string }
export interface Topping { key: string; label: string; surcharge: number; emoji: string; desc: string }
export interface Topper { key: string; label: string; emoji: string; surcharge: number }

export const DEFAULT_SIZES: CustomizerSize[] = [
  { key: 'single', label: '1 Tier', detail: 'Petite 6"', servings: 'Serves 4 - 6', surcharge: 0 },
  { key: 'double', label: '2 Tiers', detail: 'Signature 8" + 6"', servings: 'Serves 8 - 12', surcharge: 35.00 },
  { key: 'triple', label: '3 Tiers', detail: 'Grand 10" + 8" + 6"', servings: 'Serves 15 - 20', surcharge: 70.00 },
];

export const DEFAULT_FLAVORS: CustomizerFlavor[] = [
  { key: 'chocolate', label: 'Cacao Royale', desc: '70% Valrhona Dark Ganache, Praline Crunch', surcharge: 0 },
  { key: 'raspberry', label: "L'Amour Rose", desc: 'Raspberry Rosewater, White Chocolate Mousse', surcharge: 5.00 },
  { key: 'pistachio', label: 'Matcha Bliss', desc: 'Ceremonial Matcha Mousse, Pistachio Cremeux', surcharge: 8.00 },
  { key: 'caramel', label: 'Golden Salted', desc: 'Fleur-de-Sel Caramel, Roasted Pecan Ganache', surcharge: 3.00 },
];

export const DEFAULT_FROSTING_COLORS: FrostingColor[] = [
  { key: 'cream', name: 'Chantilly White', hex: '#FFFDF9', label: 'Delicate Vanilla' },
  { key: 'rose', name: 'Rosy Ispahan', hex: '#FCE1DC', label: 'Floral Rose' },
  { key: 'blush', name: 'Petal Blush', hex: '#FFF0ED', label: 'Soft Peach Rose' },
  { key: 'champagne', name: 'Veuve Champagne', hex: '#F7EFE3', label: 'Rich Vintage Gold' },
  { key: 'pistachio', name: 'Uji Pistachio', hex: '#EAF0DF', label: 'Earthy Matcha' },
  { key: 'emerald', name: 'Jardin Matcha', hex: '#D8E5D3', label: 'Organic Garden Sage' },
  { key: 'honey', name: 'Golden Honey', hex: '#F2DEC2', label: 'Salted Caramel' },
  { key: 'cacao', name: 'Velvet Noir', hex: '#4A2F2B', label: 'Rich Dark Cacao' },
  { key: 'luxeGold', name: 'Imperial Gold', hex: '#E8C39E', label: 'Glowing Edible Gold' },
  { key: 'lavender', name: 'Stardust Lavender', hex: '#E8DFFF', label: 'Floral Lavender' },
];

export const DEFAULT_TOPPINGS: Topping[] = [
  { key: 'macarons', label: 'Parisian Macarons', surcharge: 12.00, emoji: '🧁', desc: 'Crispy pastel almond shells' },
  { key: 'berries', label: 'Wild Berries & Fruits', surcharge: 10.00, emoji: '🍓', desc: 'Fresh raspberries & blueberries' },
  { key: 'orchids', label: 'Edible Baby Orchids', surcharge: 15.00, emoji: '🌸', desc: 'Elegant hand-picked blossoms' },
  { key: 'goldLeaf', label: '24k Gold Leaf Flakes', surcharge: 20.00, emoji: '✨', desc: 'Shimmering metallic premium flakes' },
];

export const DEFAULT_TOPPERS: Topper[] = [
  { key: 'none', label: 'No Topper', emoji: '❌', surcharge: 0 },
  { key: 'birthday', label: 'Gold "HBD" Topper', emoji: '👑', surcharge: 8.00 },
  { key: 'anniversary', label: 'Crown Anniversary', emoji: '💍', surcharge: 10.00 },
  { key: 'celebrate', label: 'Sparkly "Cheers"', emoji: '✨', surcharge: 8.00 },
];
