import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions, 
  TextInput, 
  Platform,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Sparkles, 
  Check, 
  ShoppingBag, 
  Award, 
  Clock, 
  Plus, 
  Minus, 
  Info, 
  Heart,
  Type,
  Upload,
  Layers,
  Palette,
  ChefHat,
  Sticker,
  X,
  Compass,
  Gift
} from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming,
  FadeInDown,
  Layout
} from 'react-native-reanimated';
import { theme } from '../../src/theme';
import { GlassBox } from '../../src/components/ui/GlassBox';
import { Button } from '../../src/components/ui/Button';
import { AppHeader } from '../../src/components/common/AppHeader';

const { width, height } = Dimensions.get('window');

// Premium Configurator Preset Options
// Premium Configurator Preset Options
const SIZES = [
  { key: 'single', label: '1 Tier', detail: 'Petite 6"', servings: 'Serves 4 - 6', surcharge: 0 },
  { key: 'double', label: '2 Tiers', detail: 'Signature 8" + 6"', servings: 'Serves 8 - 12', surcharge: 35.00 },
  { key: 'triple', label: '3 Tiers', detail: 'Grand 10" + 8" + 6"', servings: 'Serves 15 - 20', surcharge: 70.00 }
];

const FLAVORS = [
  { key: 'chocolate', label: 'Cacao Royale', desc: '70% Valrhona Dark Ganache, Praline Crunch', surcharge: 0 },
  { key: 'raspberry', label: 'L\'Amour Rose', desc: 'Raspberry Rosewater, White Chocolate Mousse', surcharge: 5.00 },
  { key: 'pistachio', label: 'Matcha Bliss', desc: 'Ceremonial Matcha Mousse, Pistachio Cremeux', surcharge: 8.00 },
  { key: 'caramel', label: 'Golden Salted', desc: 'Fleur-de-Sel Caramel, Roasted Pecan Ganache', surcharge: 3.00 }
];

const FROSTING_COLORS = [
  { key: 'cream', name: 'Chantilly White', hex: '#FFFDF9', rim: '#F9F4E7', label: 'Delicate Vanilla' },
  { key: 'rose', name: 'Rosy Ispahan', hex: '#FCE1DC', rim: '#F4CECA', label: 'Floral Rose' },
  { key: 'blush', name: 'Petal Blush', hex: '#FFF0ED', rim: '#FCDED9', label: 'Soft Peach Rose' },
  { key: 'champagne', name: 'Veuve Champagne', hex: '#F7EFE3', rim: '#EFE3D3', label: 'Rich Vintage Gold' },
  { key: 'pistachio', name: 'Uji Pistachio', hex: '#EAF0DF', rim: '#DAE5CC', label: 'Earthy Matcha' },
  { key: 'emerald', name: 'Jardin Matcha', hex: '#D8E5D3', rim: '#C8D7C2', label: 'Organic Garden Sage' },
  { key: 'honey', name: 'Golden Honey', hex: '#F2DEC2', rim: '#E6CCA9', label: 'Salted Caramel' },
  { key: 'cacao', name: 'Velvet Noir', hex: '#4A2F2B', rim: '#3A211D', label: 'Rich Dark Cacao' },
  { key: 'luxeGold', name: 'Imperial Gold', hex: '#E8C39E', rim: '#D4A373', label: 'Glowing Edible Gold' },
  { key: 'lavender', name: 'Stardust Lavender', hex: '#E8DFFF', rim: '#DCD0F7', label: 'Floral Lavender' }
];

const DESIGNER_THEMES = [
  {
    key: 'goldOpulence',
    title: 'Imperial Gold Opulence ⚜️',
    desc: '3 Tiers, Spatula Finish, Gold Shells Rim, Macarons, Gold Topper',
    size: 'triple',
    flavor: 'chocolate',
    color: 'luxeGold',
    finish: 'rustic',
    piping: 'goldShells',
    toppings: ['macarons', 'goldLeaf'],
    topper: 'celebrate',
    sugarPrint: false,
    price: 168.00,
    gradient: ['#F7EFE3', '#E8C39E']
  },
  {
    key: 'lavenderDreams',
    title: 'Stardust Lavender Dreams 🌌',
    desc: '2 Tiers, Mirror Glaze, Pearls Rim, Berries, Macarons, Crown Topper',
    size: 'double',
    flavor: 'raspberry',
    color: 'lavender',
    finish: 'mirror',
    piping: 'pearls',
    toppings: ['macarons', 'berries'],
    topper: 'birthday',
    sugarPrint: false,
    price: 117.00,
    gradient: ['#E8DFFF', '#DCD0F7']
  },
  {
    key: 'velvetNoir',
    title: 'Midnight Velvet Royale 🥀',
    desc: '2 Tiers, Velvet Noir, Matte Finish, Gold Rim, Flowers, Royal Print',
    size: 'double',
    flavor: 'chocolate',
    color: 'cacao',
    finish: 'velvet',
    piping: 'goldShells',
    toppings: ['orchids', 'goldLeaf'],
    topper: 'none',
    sugarPrint: true,
    sugarPrintUri: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=300', // Royal Gold
    price: 133.00,
    gradient: ['#4A2F2B', '#2C1B18']
  },
  {
    key: 'blushPetal',
    title: 'Blush Petal Serenity 🌸',
    desc: '1 Tier, Matte Finish, Minimal Rim, Orchids, Gold Sparks',
    size: 'single',
    flavor: 'caramel',
    color: 'blush',
    finish: 'velvet',
    piping: 'minimal',
    toppings: ['orchids', 'goldLeaf'],
    topper: 'none',
    sugarPrint: false,
    price: 95.00,
    gradient: ['#FFF0ED', '#FCE1DC']
  }
];


const TOPPINGS = [
  { key: 'macarons', label: 'Parisian Macarons', surcharge: 12.00, emoji: '🧁', desc: 'Crispy pastel almond shells' },
  { key: 'berries', label: 'Wild Berries & Fruits', surcharge: 10.00, emoji: '🍓', desc: 'Fresh raspberries & blueberries' },
  { key: 'orchids', label: 'Edible Baby Orchids', surcharge: 15.00, emoji: '🌸', desc: 'Elegant hand-picked blossoms' },
  { key: 'goldLeaf', label: '24k Gold Leaf Flakes', surcharge: 20.00, emoji: '✨', desc: 'Shimmering metallic premium flakes' }
];

const TOPPERS = [
  { key: 'none', label: 'No Topper', emoji: '❌', surcharge: 0 },
  { key: 'birthday', label: 'Gold "HBD" Topper', emoji: '👑', surcharge: 8.00 },
  { key: 'anniversary', label: 'Crown Anniversary', emoji: '💍', surcharge: 10.00 },
  { key: 'celebrate', label: 'Sparkly "Cheers"', emoji: '✨', surcharge: 8.00 }
];

const SUGAR_PRINTS = [
  { id: 'print1', title: 'Elegant Royal Gold', uri: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=300' },
  { id: 'print2', title: 'Romantic Rose Vignette', uri: 'https://images.unsplash.com/photo-1516685018646-549198525c1b?q=80&w=300' },
  { id: 'print3', title: 'Luxury Marble Abstract', uri: 'https://images.unsplash.com/photo-1533038590840-1cde6b66b730?q=80&w=300' }
];

export default function CustomizerScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Core Customization State
  const [selectedSize, setSelectedSize] = useState<'single' | 'double' | 'triple'>('single');
  const [selectedFlavor, setSelectedFlavor] = useState<'chocolate' | 'raspberry' | 'pistachio' | 'caramel'>('chocolate');
  const [selectedColor, setSelectedColor] = useState<string>('cream');
  const [activeToppings, setActiveToppings] = useState<string[]>([]);
  const [selectedTopper, setSelectedTopper] = useState<'none' | 'birthday' | 'anniversary' | 'celebrate'>('none');
  const [calligraphyText, setCalligraphyText] = useState('');

  // Advanced Interactive Engine States
  const [perspective, setPerspective] = useState<'front' | 'top'>('front');
  const [frostingFinish, setFrostingFinish] = useState<'mirror' | 'velvet' | 'rustic'>('mirror');
  const [pipingStyle, setPipingStyle] = useState<'pearls' | 'goldShells' | 'minimal'>('pearls');
  const [giftingMode, setGiftingMode] = useState(false);
  const [giftCardMessage, setGiftCardMessage] = useState('');
  
  // New States for Backdrop Switcher & Gifting Stationery Card Styles
  const [backdropStyle, setBackdropStyle] = useState<'chantilly' | 'sunrise' | 'midnight'>('sunrise');
  const [giftingStationery, setGiftingStationery] = useState<'classic' | 'midnight' | 'botanical'>('classic');

  // Edible Sugar Print Simulation States
  const [sugarPrintUploaded, setSugarPrintUploaded] = useState(false);
  const [selectedSugarPrint, setSelectedSugarPrint] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showPresetsModal, setShowPresetsModal] = useState(false);

  // Active configurations panel tab
  const [activeTab, setActiveTab] = useState<'tier' | 'color' | 'toppings' | 'toppers' | 'print'>('tier');
  const [orderingInProgress, setOrderingInProgress] = useState(false);

  // Dynamic Ambient Backdrop Styling Engine
  const getAmbientStyles = () => {
    switch (backdropStyle) {
      case 'chantilly':
        return {
          wrapperBg: '#FFF5F0',
          radialBg: 'rgba(255, 235, 226, 0.65)',
          textColor: '#2C1B18',
          subtextColor: '#D4A373',
          headerBg: 'rgba(255, 245, 240, 0.75)',
        };
      case 'midnight':
        return {
          wrapperBg: '#1C100E',
          radialBg: 'rgba(212, 163, 115, 0.12)',
          textColor: '#FFF8F2',
          subtextColor: '#E8C39E',
          headerBg: 'rgba(28, 16, 14, 0.75)',
        };
      case 'sunrise':
      default:
        return {
          wrapperBg: '#FFF0EA',
          radialBg: 'rgba(255, 227, 209, 0.8)',
          textColor: '#2C1B18',
          subtextColor: '#D4A373',
          headerBg: 'rgba(255, 248, 242, 0.7)',
        };
    }
  };

  const ambient = getAmbientStyles();

  // Quick apply designer curated themes
  const handleApplyTheme = (themeItem: typeof DESIGNER_THEMES[0]) => {
    setSelectedSize(themeItem.size as any);
    setSelectedFlavor(themeItem.flavor as any);
    setSelectedColor(themeItem.color);
    setFrostingFinish(themeItem.finish as any);
    setPipingStyle(themeItem.piping as any);
    setActiveToppings(themeItem.toppings);
    setSelectedTopper(themeItem.topper as any);
    if (themeItem.sugarPrint && themeItem.sugarPrintUri) {
      setSelectedSugarPrint(themeItem.sugarPrintUri);
      setSugarPrintUploaded(true);
    } else {
      setSugarPrintUploaded(false);
      setSelectedSugarPrint(null);
    }
    
    // Switch ambient lighting backdrops automatically to match theme
    if (themeItem.key === 'velvetNoir') {
      setBackdropStyle('midnight');
    } else if (themeItem.key === 'goldOpulence') {
      setBackdropStyle('sunrise');
    } else if (themeItem.key === 'blushPetal') {
      setBackdropStyle('chantilly');
    }
    
    Alert.alert(
      "Designer Curation Loaded",
      `The gourmet "${themeItem.title}" theme has been fully assembled in the studio.`,
      [{ text: "Magnifique!" }]
    );
  };

  // Render gift card stationery visually
  const getStationeryCardLayout = () => {
    let cardBg = '#FAF8F5';
    let borderColor = 'rgba(212, 163, 115, 0.5)';
    let textCol = '#2C1B18';
    let label = 'Classic Gold Foil';
    let extraDecorative = null;

    if (giftingStationery === 'midnight') {
      cardBg = '#1E1210';
      borderColor = '#D4A373';
      textCol = '#F7EFE3';
      label = 'Midnight Velvet';
    } else if (giftingStationery === 'botanical') {
      cardBg = '#FAF5F5';
      borderColor = 'rgba(224, 109, 109, 0.3)';
      textCol = '#4A2F2B';
      label = 'Parisian Botanical';
      extraDecorative = (
        <View style={styles.botanicalFlowerDecoration}>
          <Text style={{ fontSize: 16 }}>🌸</Text>
        </View>
      );
    }

    return (
      <View style={[styles.stationeryCardBody, { backgroundColor: cardBg, borderColor: borderColor }]}>
        {extraDecorative}
        <View style={styles.stationeryCardInner}>
          <Text style={[styles.stationeryCardLabel, { color: textCol }]}>{label}</Text>
          <View style={styles.stationeryCardDivider} />
          {giftCardMessage.trim() ? (
            <Text style={[styles.stationeryCardMessage, { color: textCol }]} numberOfLines={3}>
              "{giftCardMessage}"
            </Text>
          ) : (
            <Text style={[styles.stationeryCardMessagePlaceholder, { color: 'rgba(140, 122, 119, 0.45)' }]}>
              Your custom greeting will be hand-written here...
            </Text>
          )}
        </View>
      </View>
    );
  };


  // Reanimated Spring Values for Tiers (Scaling & Translation transitions)
  const middleTierScale = useSharedValue(0);
  const topTierScale = useSharedValue(0);

  useEffect(() => {
    middleTierScale.value = withSpring(selectedSize !== 'single' ? 1 : 0, { damping: 14, stiffness: 100 });
    topTierScale.value = withSpring(selectedSize === 'triple' ? 1 : 0, { damping: 14, stiffness: 100 });
  }, [selectedSize]);

  // Animated styles mapping
  const animStyleMiddle = useAnimatedStyle(() => ({
    opacity: middleTierScale.value,
    transform: [
      { scale: middleTierScale.value },
      { translateY: (1 - middleTierScale.value) * 15 }
    ]
  }));

  const animStyleTop = useAnimatedStyle(() => ({
    opacity: topTierScale.value,
    transform: [
      { scale: topTierScale.value },
      { translateY: (1 - topTierScale.value) * 12 }
    ]
  }));

  // Toggle Toppings Selection
  const handleToppingToggle = (key: string) => {
    setActiveToppings(prev => 
      prev.includes(key) ? prev.filter(item => item !== key) : [...prev, key]
    );
  };

  // Upload custom prints simulation
  const handleTriggerPresetSelection = () => {
    setShowPresetsModal(true);
  };

  const handleSelectPreset = (uri: string) => {
    setIsUploading(true);
    setShowPresetsModal(false);
    setTimeout(() => {
      setSelectedSugarPrint(uri);
      setSugarPrintUploaded(true);
      setIsUploading(false);
    }, 1200);
  };

  const handleRemoveSugarPrint = () => {
    setSugarPrintUploaded(false);
    setSelectedSugarPrint(null);
  };

  // Price Calculation including surcharges
  const computePrice = () => {
    let base = 60.00;
    
    // Sizing
    const sizeObj = SIZES.find(s => s.key === selectedSize);
    if (sizeObj) base += sizeObj.surcharge;

    // Flavor
    const flavorObj = FLAVORS.find(f => f.key === selectedFlavor);
    if (flavorObj) base += flavorObj.surcharge;

    // Toppings
    activeToppings.forEach(toppingKey => {
      const topObj = TOPPINGS.find(t => t.key === toppingKey);
      if (topObj) base += topObj.surcharge;
    });

    // Topper
    const topperObj = TOPPERS.find(t => t.key === selectedTopper);
    if (topperObj) base += topperObj.surcharge;

    // Sugar Print
    if (sugarPrintUploaded) base += 18.00;

    // Luxury Gift Cloche dome surcharges
    if (giftingMode) base += 10.00;

    return base;
  };

  // Submit Order Creation
  const handleOrderSubmit = () => {
    setOrderingInProgress(true);
    setTimeout(() => {
      setOrderingInProgress(false);
      Alert.alert(
        "Chef's Approval",
        "Your gourmet design has been sent to our Parisian kitchen. Curators are beginning preparation!",
        [
          { text: "View Boutique", onPress: () => router.push('/catalogue' as any) }
        ]
      );
    }, 2000);
  };

  // Resolve Active Color Scheme
  const activeColor = FROSTING_COLORS.find(c => c.key === selectedColor) || FROSTING_COLORS[0];

  // Render Dynamic Icing Piping Border Styles
  const renderPiping = (colorHex: string, style: 'pearls' | 'goldShells' | 'minimal', tierWidth: number) => {
    const pipingColor = style === 'pearls' ? colorHex : '#D4A373';
    
    if (style === 'minimal') {
      return (
        <View style={[styles.pipingMinimalLine, { backgroundColor: pipingColor }]} />
      );
    }
    
    // Spacing dots dynamically by tier diameter width
    const dotCount = Math.floor(tierWidth / 11);
    const dots = Array.from({ length: dotCount });
    
    return (
      <View style={styles.pipingDotsContainer}>
        {dots.map((_, i) => (
          <View 
            key={i} 
            style={[
              styles.pipingPearlDot, 
              { 
                backgroundColor: pipingColor,
                borderColor: style === 'goldShells' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.05)',
                borderWidth: 0.5
              },
              style === 'goldShells' && styles.goldShellGlow
            ]} 
          />
        ))}
      </View>
    );
  };

  // Render Top-Down Concentric Piping Circle Borders
  const renderTopDownPiping = (colorHex: string, style: 'pearls' | 'goldShells' | 'minimal', diameter: number) => {
    const pipingColor = style === 'pearls' ? colorHex : '#D4A373';
    
    if (style === 'minimal') {
      return (
        <View 
          style={[
            styles.topDownPipingMinimal, 
            { 
              width: diameter - 4, 
              height: diameter - 4, 
              borderRadius: (diameter - 4) / 2, 
              borderColor: pipingColor 
            }
          ]} 
        />
      );
    }
    
    return (
      <View 
        style={[
          styles.topDownPipingDotted, 
          { 
            width: diameter - 6, 
            height: diameter - 6, 
            borderRadius: (diameter - 6) / 2, 
            borderColor: pipingColor,
            borderStyle: style === 'pearls' ? 'dotted' : 'dashed',
            borderWidth: style === 'pearls' ? 3 : 2,
          }
        ]} 
      />
    );
  };

  // Render Symmetrical Radial Toppings on Top View
  const renderTopDownToppings = () => {
    return (
      <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
        {/* 1. Parisian Macarons (Symmetric 3 Points) */}
        {activeToppings.includes('macarons') && (
          <>
            <View style={[styles.topDownMacaron, { top: 12, left: 92, backgroundColor: '#FADADD' }]} />
            <View style={[styles.topDownMacaron, { bottom: 32, left: 36, backgroundColor: '#E2ECC8' }]} />
            <View style={[styles.topDownMacaron, { bottom: 32, right: 36, backgroundColor: '#FFF2CC' }]} />
          </>
        )}

        {/* 2. Wild Berries (4 Rim Points) */}
        {activeToppings.includes('berries') && (
          <>
            <View style={[styles.topDownBerry, { top: 38, left: 48, backgroundColor: '#800020' }]} />
            <View style={[styles.topDownBerry, { top: 38, right: 48, backgroundColor: '#E06D6D' }]} />
            <View style={[styles.topDownBerry, { bottom: 12, left: 94, backgroundColor: '#800020' }]} />
            <View style={[styles.topDownBerry, { top: 94, left: 12, backgroundColor: '#E06D6D' }]} />
          </>
        )}

        {/* 3. Edible Orchids (2 Flank Points) */}
        {activeToppings.includes('orchids') && (
          <>
            <View style={[styles.topDownFlower, { top: 88, left: 16 }]} />
            <View style={[styles.topDownFlower, { top: 88, right: 16 }]} />
          </>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Universal Modern Header */}
      <AppHeader 
        title="Design Studio"
        subtitle="Haute Pâtisserie"
        rightContent={
          <View className="w-11 h-11 items-center justify-center rounded-2xl bg-white/80 border border-[#D4A373]/20 shadow-sm mr-3">
            <ChefHat size={20} color="#D4A373" />
          </View>
        }
      />

      {/* Live Customizer Split Layout */}
      {/* Top Section: Interactive Preview Canvas */}
      <View style={[styles.previewCanvasWrapper, { backgroundColor: ambient.wrapperBg }]}>
        {/* Soft bakery-glowing background */}
        <View style={[styles.canvasBackgroundRadial, { backgroundColor: ambient.radialBg }]} />
        
        {/* Studio Elements: Pedestal & bokeh */}
        <View style={styles.studioPedestalContainer}>
          <LinearGradient
            colors={['rgba(212, 163, 115, 0.4)', 'rgba(44, 27, 24, 0.1)']}
            style={styles.studioPedestal}
          />
        </View>

        {/* Perspective Switcher Floating Button */}
        <TouchableOpacity 
          style={styles.perspectiveToggleBtn}
          onPress={() => setPerspective(prev => prev === 'front' ? 'top' : 'front')}
        >
          <GlassBox intensity={90} style={styles.perspectiveInnerGlass}>
            <Compass size={13} color="#D4A373" style={{ marginRight: 6 }} />
            <Text style={styles.perspectiveToggleText}>{perspective === 'front' ? 'Top View' : 'Front View'}</Text>
          </GlassBox>
        </TouchableOpacity>

        {/* Animated Price Pill */}
        <Animated.View 
          entering={FadeInDown.delay(400)}
          style={styles.animatedPricePillContainer}
        >
          <GlassBox intensity={95} style={styles.pricePillGlass}>
             <View className="mr-2 w-5 h-5 items-center justify-center rounded-full bg-gold/20">
                <ShoppingBag size={10} color="#D4A373" />
             </View>
             <Text style={styles.pricePillLabel}>Estimated Subtotal:</Text>
             <Text style={styles.pricePillValue}>${computePrice().toFixed(2)}</Text>
          </GlassBox>
        </Animated.View>

        {/* Backdrop Switcher Floating Button */}
        <TouchableOpacity 
          style={styles.backdropToggleBtn}
          onPress={() => {
            const nextMode = backdropStyle === 'sunrise' ? 'midnight' : backdropStyle === 'midnight' ? 'chantilly' : 'sunrise';
            setBackdropStyle(nextMode);
          }}
        >
          <GlassBox intensity={90} style={styles.perspectiveInnerGlass}>
            <Sparkles size={12} color="#D4A373" style={{ marginRight: 6 }} />
            <Text style={styles.perspectiveToggleText}>
              {backdropStyle.charAt(0).toUpperCase() + backdropStyle.slice(1)} Studio
            </Text>
          </GlassBox>
        </TouchableOpacity>

        {/* Absolute Decorative Gold Sparks Overlay (Gold Leaf) */}
        {activeToppings.includes('goldLeaf') && (
          <View style={styles.goldLeafEmitterOverlay} pointerEvents="none">
            <Sparkles size={18} color="#D4A373" style={{ position: 'absolute', top: 50, left: 60, opacity: 0.8 }} />
            <Sparkles size={14} color="#D4A373" style={{ position: 'absolute', top: 90, right: 70, opacity: 0.6 }} />
            <Sparkles size={16} color="#D4A373" style={{ position: 'absolute', bottom: 80, left: 90, opacity: 0.7 }} />
            <Sparkles size={15} color="#D4A373" style={{ position: 'absolute', bottom: 120, right: 80, opacity: 0.8 }} />
            <Sparkles size={12} color="#D4A373" style={{ position: 'absolute', top: 140, left: 110, opacity: 0.5 }} />
          </View>
        )}

        {perspective === 'top' ? (
          /* ==================== PERSPECTIVE: TOP VIEW ==================== */
          <View style={styles.topDownPlatter}>
            {/* Outermost Bottom Tier Circle */}
            <View style={[styles.topDownCircleOuter, { backgroundColor: activeColor.hex }]}>
              {/* Finishes Overlay */}
              {frostingFinish === 'rustic' && <View style={styles.topDownRusticCircleOuter} pointerEvents="none" />}
              {frostingFinish === 'mirror' && <View style={styles.topDownMirrorCircleOuter} pointerEvents="none" />}
              {frostingFinish === 'velvet' && <View style={styles.finishVelvetOverlay} pointerEvents="none" />}
              
              {/* Piping Rim Border */}
              {renderTopDownPiping(activeColor.rim, pipingStyle, 200)}

              {/* Middle Tier Circle */}
              {selectedSize !== 'single' ? (
                <View style={[styles.topDownCircleMiddle, { backgroundColor: activeColor.hex }]}>
                  {frostingFinish === 'rustic' && <View style={styles.topDownRusticCircleMiddle} pointerEvents="none" />}
                  {frostingFinish === 'mirror' && <View style={styles.topDownMirrorCircleMiddle} pointerEvents="none" />}
                  {frostingFinish === 'velvet' && <View style={styles.finishVelvetOverlay} pointerEvents="none" />}
                  
                  {renderTopDownPiping(activeColor.rim, pipingStyle, 150)}

                  {/* Inner Circle: Top Tier */}
                  {selectedSize === 'triple' ? (
                    <View style={[styles.topDownCircleInner, { backgroundColor: activeColor.hex }]}>
                      {frostingFinish === 'rustic' && <View style={styles.topDownRusticCircleInner} pointerEvents="none" />}
                      {frostingFinish === 'mirror' && <View style={styles.topDownMirrorCircleInner} pointerEvents="none" />}
                      {frostingFinish === 'velvet' && <View style={styles.finishVelvetOverlay} pointerEvents="none" />}
                      
                      {renderTopDownPiping(activeColor.rim, pipingStyle, 100)}

                      {/* Inscription Text Centered in Inner Circle */}
                      {calligraphyText.length > 0 ? (
                        <View style={styles.topDownCalligraphyWrapper}>
                          <Text style={styles.topDownCalligraphyText} numberOfLines={2}>
                            {calligraphyText}
                          </Text>
                        </View>
                      ) : (
                        <ChefHat size={18} color="#D4A373" />
                      )}
                    </View>
                  ) : (
                    /* If double tier, calligraphy sits in the center of Middle Tier */
                    <View style={styles.topDownCalligraphyWrapper}>
                      {calligraphyText.length > 0 ? (
                        <Text style={styles.topDownCalligraphyText} numberOfLines={2}>
                          {calligraphyText}
                        </Text>
                      ) : (
                        <ChefHat size={18} color="#D4A373" />
                      )}
                    </View>
                  )}
                </View>
              ) : (
                /* If single tier, calligraphy sits in the center of Bottom Tier */
                <View style={styles.topDownCalligraphyWrapper}>
                  {calligraphyText.length > 0 ? (
                    <Text style={styles.topDownCalligraphyText} numberOfLines={2}>
                      {calligraphyText}
                    </Text>
                  ) : (
                    <ChefHat size={18} color="#D4A373" />
                  )}
                </View>
              )}

              {/* Symmetric radial toppings layout */}
              {renderTopDownToppings()}
            </View>
          </View>
        ) : (
          /* ==================== PERSPECTIVE: FRONT VIEW ==================== */
          <View style={styles.cakeStandContainer}>
            
            {/* 1. Floating Celebration Topper Stick */}
            {selectedTopper !== 'none' && (
              <View style={styles.topperStickWrapper}>
                <View style={styles.topperMetalRod} />
                <GlassBox intensity={60} style={styles.topperCardLabel}>
                  <Text style={styles.topperBadgeText}>
                    {selectedTopper === 'birthday' ? '👑 HBD' : selectedTopper === 'anniversary' ? '💍 Sweet Anniversary' : '✨ Cheers!'}
                  </Text>
                </GlassBox>
              </View>
            )}

            {/* 2. Top Tier Layer (Visible in Triple Tiers) */}
            <Animated.View style={[styles.cakeTierTop, animStyleTop]}>
              <View style={[styles.tierBasePlate, { backgroundColor: activeColor.hex }]}>
                {/* Frosting Finishes */}
                {frostingFinish === 'mirror' && <View style={styles.tierGlossSheen} />}
                {frostingFinish === 'velvet' && <View style={styles.finishVelvetOverlay} />}
                {frostingFinish === 'rustic' && (
                  <View style={styles.finishRusticOverlay} pointerEvents="none">
                    <View style={styles.rusticStreak1} />
                    <View style={styles.rusticStreak3} />
                  </View>
                )}
                
                {/* Piped Icing rim decoration */}
                {renderPiping(activeColor.rim, pipingStyle, 90)}
                
                {/* Small Berry on top tier rim */}
                {activeToppings.includes('berries') && (
                  <View style={[styles.microBerry, { top: 4, left: 12, backgroundColor: '#E06D6D' }]} />
                )}
              </View>
            </Animated.View>

            {/* 3. Middle Tier Layer (Visible in Double & Triple Tiers) */}
            <Animated.View style={[styles.cakeTierMiddle, animStyleMiddle]}>
              <View style={[styles.tierBasePlate, { backgroundColor: activeColor.hex }]}>
                {/* Frosting Finishes */}
                {frostingFinish === 'mirror' && <View style={styles.tierGlossSheen} />}
                {frostingFinish === 'velvet' && <View style={styles.finishVelvetOverlay} />}
                {frostingFinish === 'rustic' && (
                  <View style={styles.finishRusticOverlay} pointerEvents="none">
                    <View style={styles.rusticStreak1} />
                    <View style={styles.rusticStreak2} />
                    <View style={styles.rusticStreak3} />
                  </View>
                )}

                {/* Piping Rim Border */}
                {renderPiping(activeColor.rim, pipingStyle, 140)}

                {/* Macarons sitting on middle tier shelf */}
                {activeToppings.includes('macarons') && selectedSize !== 'single' && (
                  <>
                    <View style={[styles.microMacaron, { bottom: 4, left: 6, backgroundColor: '#FADADD' }]} />
                    <View style={[styles.microMacaron, { bottom: 4, right: 6, backgroundColor: '#E2ECC8' }]} />
                  </>
                )}
                {/* Edible Orchids on middle tier */}
                {activeToppings.includes('orchids') && selectedSize !== 'single' && (
                  <View style={[styles.microFlower, { bottom: 12, left: 24 }]} />
                )}
              </View>
            </Animated.View>

            {/* 4. Bottom Tier Layer (Always visible) */}
            <View style={styles.cakeTierBottom}>
              <View style={[styles.tierBasePlate, { backgroundColor: activeColor.hex, height: 62 }]}>
                {/* Frosting Finishes */}
                {frostingFinish === 'mirror' && <View style={styles.tierGlossSheen} />}
                {frostingFinish === 'velvet' && <View style={styles.finishVelvetOverlay} />}
                {frostingFinish === 'rustic' && (
                  <View style={styles.finishRusticOverlay} pointerEvents="none">
                    <View style={styles.rusticStreak1} />
                    <View style={styles.rusticStreak2} />
                    <View style={styles.rusticStreak3} />
                  </View>
                )}

                {/* Piping Rim Border */}
                {renderPiping(activeColor.rim, pipingStyle, 190)}

                {/* Edible Sugar Print Sheet on center of bottom tier */}
                {sugarPrintUploaded && selectedSugarPrint && (
                  <View style={styles.canvasSugarPrintWrapper}>
                    <Image 
                      source={{ uri: selectedSugarPrint }} 
                      style={styles.canvasSugarPrintImg} 
                      contentFit="cover"
                    />
                    <View style={styles.sugarPrintGlassGlaze} />
                  </View>
                )}

                {/* Custom Calligraphy Text Overlay on bottom tier face */}
                {calligraphyText.length > 0 && (
                  <View style={styles.calligraphyOverlayWrapper}>
                    <Text style={styles.calligraphyOverlayCursiveText} numberOfLines={1}>
                      {calligraphyText}
                    </Text>
                  </View>
                )}

                {/* Toppings sitting on bottom tier shelf */}
                {activeToppings.includes('macarons') && (
                  <>
                    <View style={[styles.microMacaron, { bottom: 5, left: 10, backgroundColor: '#E2ECC8' }]} />
                    <View style={[styles.microMacaron, { bottom: 5, right: 10, backgroundColor: '#FFF2CC' }]} />
                  </>
                )}
                {activeToppings.includes('berries') && (
                  <>
                    <View style={[styles.microBerry, { bottom: 6, left: 30, backgroundColor: '#800020' }]} />
                    <View style={[styles.microBerry, { bottom: 6, right: 30, backgroundColor: '#E06D6D' }]} />
                  </>
                )}
                {activeToppings.includes('orchids') && (
                  <View style={[styles.microFlower, { bottom: 16, right: 24 }]} />
                )}
              </View>
            </View>

            {/* 5. Luxury Gifting Glass Dome Cloche (Fitted right over cake & pedestal) */}
            {giftingMode && (
              <View style={styles.glassDomeWrapper} pointerEvents="none">
                {/* Golden Handle Ring & Base */}
                <View style={styles.glassDomeHandleRing} />
                <View style={styles.glassDomeHandleBase} />
                {/* Dome Glass Cylinder */}
                <View style={styles.glassDomeBody}>
                  <View style={styles.glassDomeReflection} />
                  <Sparkles size={12} color="#D4A373" style={{ position: 'absolute', top: 25, left: '46%', opacity: 0.65 }} />
                </View>
              </View>
            )}

            {/* 6. Solid Luxury Pedestal/Cake Stand */}
            <View style={styles.pedestalPlateOuter}>
              <View style={styles.pedestalTopPlank} />
              <View style={styles.pedestalStemRod} />
              <View style={styles.pedestalBaseDisk} />
            </View>

          </View>
        )}
      </View>

      {/* Bottom Section: Configurations Tab deck & controls */}
      <View style={styles.configWorkspaceDeck}>
        <GlassBox intensity={95} style={styles.workspaceInnerGlass}>
          
          {/* Horizontal Slider Tab Bar */}
          <View style={styles.workspaceTabBarWrap}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabBarScrollStyle}>
              {[
                { id: 'tier', label: 'Tiers & Flavor', icon: Layers },
                { id: 'color', label: 'Frosting Hues', icon: Palette },
                { id: 'toppings', label: 'Toppings', icon: ChefHat },
                { id: 'toppers', label: 'Celebration Toppers', icon: Sticker },
                { id: 'print', label: 'Prints & Writing', icon: Type }
              ].map(tab => {
                const TabIcon = tab.icon;
                const isCurrent = activeTab === tab.id;
                return (
                  <TouchableOpacity 
                    key={tab.id}
                    onPress={() => setActiveTab(tab.id as any)}
                    style={styles.tabTouchButton}
                  >
                    <GlassBox 
                      intensity={isCurrent ? 75 : 15} 
                      style={[
                        styles.tabInnerGlass,
                        isCurrent && { borderColor: theme.colors.secondary, backgroundColor: 'rgba(255, 255, 255, 0.7)' }
                      ]}
                    >
                      <TabIcon size={14} color={isCurrent ? theme.colors.secondary : theme.colors.textMuted} style={{ marginRight: 6 }} />
                      <Text style={[styles.tabLabelText, isCurrent && { fontFamily: 'Poppins-SemiBold', color: theme.colors.text }]}>
                        {tab.label}
                      </Text>
                    </GlassBox>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Workspace scrollable inputs deck */}
          <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollDeckPanel}>
            
            {/* TAB 1: TIERS & FLAVOR */}
            {activeTab === 'tier' && (
              <View style={styles.deckContentBlock}>
                {/* Signature Designer Themes Carousel */}
                <Text style={styles.deckSectionTitle}>Signature Designer Themes</Text>
                <Text style={styles.deckSectionIntroText}>
                  Choose a bespoke pre-configured composition designed by our Parisian head pastry chefs:
                </Text>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false} 
                  contentContainerStyle={styles.themesScrollContainer}
                  style={{ marginBottom: 16 }}
                >
                  {DESIGNER_THEMES.map((themeItem) => (
                    <TouchableOpacity
                      key={themeItem.key}
                      onPress={() => handleApplyTheme(themeItem)}
                      style={styles.themeCardTouch}
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={themeItem.gradient as any}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.themeCardGradient}
                      >
                        <View style={styles.themeCardOverlay}>
                          <Sparkles size={14} color="#FFFFFF" style={{ marginBottom: 4 }} />
                          <Text style={styles.themeCardTitle} numberOfLines={1}>
                            {themeItem.title}
                          </Text>
                          <Text style={styles.themeCardDesc} numberOfLines={2}>
                            {themeItem.desc}
                          </Text>
                          <Text style={styles.themeCardPrice}>
                            Chef's Pick • ${themeItem.price.toFixed(2)}
                          </Text>
                        </View>
                      </LinearGradient>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {/* Size Selector */}
                <Text style={styles.deckSectionTitle}>Sculpture Tiers Size</Text>
                <View style={styles.sizingOptionsRow}>
                  {SIZES.map((size, index) => {
                    const isSelected = selectedSize === size.key;
                    return (
                      <Animated.View 
                        key={size.key} 
                        entering={FadeInDown.duration(400).delay(index * 100)}
                        style={styles.sizingCardTouch}
                      >
                        <TouchableOpacity 
                          onPress={() => setSelectedSize(size.key as any)}
                          activeOpacity={0.9}
                        >
                          <GlassBox 
                            intensity={isSelected ? 65 : 20} 
                            style={[
                              styles.sizingCardGlass,
                              isSelected && { borderColor: theme.colors.secondary }
                            ]}
                          >
                            <Text style={[styles.sizingCardLabel, isSelected && { fontFamily: 'Poppins-Medium', color: theme.colors.text }]}>
                              {size.label}
                            </Text>
                            <Text style={styles.sizingCardDetail}>{size.detail}</Text>
                            <Text style={styles.sizingCardServings}>{size.servings}</Text>
                            <Text style={styles.sizingCardSurcharge}>
                              {size.surcharge === 0 ? 'Included' : `+$${size.surcharge.toFixed(2)}`}
                            </Text>
                          </GlassBox>
                        </TouchableOpacity>
                      </Animated.View>
                    );
                  })}
                </View>

                {/* Flavor Profiles */}
                <Text style={styles.deckSectionTitle}>Gourmet Flavor Profile</Text>
                <View style={styles.flavorListColumn}>
                  {FLAVORS.map((flavor, index) => {
                    const isSelected = selectedFlavor === flavor.key;
                    return (
                      <Animated.View 
                        key={flavor.key}
                        entering={FadeInDown.duration(400).delay(index * 80)}
                      >
                        <TouchableOpacity 
                          style={styles.flavorRowTouch}
                          onPress={() => setSelectedFlavor(flavor.key as any)}
                        >
                          <GlassBox 
                            intensity={isSelected ? 50 : 15} 
                            style={[
                              styles.flavorRowGlass,
                              isSelected && { borderColor: theme.colors.secondary }
                            ]}
                          >
                            <View style={[styles.customRadioBtn, isSelected && styles.customRadioBtnActive]}>
                              {isSelected && <View style={styles.radioDotInner} />}
                            </View>
                            
                            <View style={{ flex: 1, marginLeft: 12 }}>
                              <Text style={[styles.flavorRowLabel, isSelected && { fontFamily: 'Poppins-Medium', color: theme.colors.text }]}>
                                {flavor.label}
                              </Text>
                              <Text style={styles.flavorRowDesc}>{flavor.desc}</Text>
                            </View>
                            
                            <Text style={styles.flavorRowSurcharge}>
                              {flavor.surcharge === 0 ? 'Included' : `+$${flavor.surcharge.toFixed(2)}`}
                            </Text>
                          </GlassBox>
                        </TouchableOpacity>
                      </Animated.View>
                    );
                  })}
                </View>

                {/* Frosting Finishes */}
                <Text style={[styles.deckSectionTitle, { marginTop: 24 }]}>Frosting Texture Finish</Text>
                <View style={styles.finishOptionsRow}>
                  {[
                    { key: 'mirror', label: 'Mirror Glaze', desc: 'High gloss sheen', surcharge: 0 },
                    { key: 'velvet', label: 'Matte Velvet', desc: 'Powdery flat velvet', surcharge: 0 },
                    { key: 'rustic', label: 'Spatula Rustic', desc: 'Elegant spatula ridges', surcharge: 0 }
                  ].map(finish => {
                    const isSelected = frostingFinish === finish.key;
                    return (
                      <TouchableOpacity 
                        key={finish.key}
                        style={styles.finishCardTouch}
                        onPress={() => setFrostingFinish(finish.key as any)}
                      >
                        <GlassBox 
                          intensity={isSelected ? 65 : 20} 
                          style={[
                            styles.finishCardGlass,
                            isSelected && { borderColor: theme.colors.secondary }
                          ]}
                        >
                          <Text style={[styles.finishCardLabel, isSelected && { fontFamily: 'Poppins-Medium', color: theme.colors.text }]}>
                            {finish.label}
                          </Text>
                          <Text style={styles.finishCardDesc}>{finish.desc}</Text>
                        </GlassBox>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Piped Rim Borders */}
                <Text style={[styles.deckSectionTitle, { marginTop: 24 }]}>Piped Rim Borders</Text>
                <View style={styles.pipingOptionsRow}>
                  {[
                    { key: 'pearls', label: 'White Pearls', desc: 'Spaced royal icing beads' },
                    { key: 'goldShells', label: 'Gold Shells', desc: 'Metallic gold scallops' },
                    { key: 'minimal', label: 'Modern Minimal', desc: 'Contemporary crisp line' }
                  ].map(style => {
                    const isSelected = pipingStyle === style.key;
                    return (
                      <TouchableOpacity 
                        key={style.key}
                        style={styles.pipingCardTouch}
                        onPress={() => setPipingStyle(style.key as any)}
                      >
                        <GlassBox 
                          intensity={isSelected ? 65 : 20} 
                          style={[
                            styles.pipingCardGlass,
                            isSelected && { borderColor: theme.colors.secondary }
                          ]}
                        >
                          <Text style={[styles.pipingCardLabel, isSelected && { fontFamily: 'Poppins-Medium', color: theme.colors.text }]}>
                            {style.label}
                          </Text>
                          <Text style={styles.pipingCardDesc}>{style.desc}</Text>
                        </GlassBox>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            {/* TAB 2: FROSTING HUES */}
            {activeTab === 'color' && (
              <View style={styles.deckContentBlock}>
                <Text style={styles.deckSectionTitle}>Artisanal Frosting Hue</Text>
                <Text style={styles.deckSectionIntroText}>
                  Choose a signature color made with natural fruit extractions and gourmet pastes:
                </Text>
                
                <View style={styles.colorPickerListColumn}>
                  {FROSTING_COLORS.map((color, index) => {
                    const isSelected = selectedColor === color.key;
                    return (
                      <Animated.View 
                        key={color.key}
                        entering={FadeInDown.duration(400).delay(index * 60)}
                      >
                        <TouchableOpacity 
                          style={styles.colorRowTouch}
                          onPress={() => setSelectedColor(color.key as any)}
                        >
                          <GlassBox 
                            intensity={isSelected ? 55 : 20} 
                            style={[
                              styles.colorRowGlass,
                              isSelected && { borderColor: theme.colors.secondary }
                            ]}
                          >
                            {/* Round color ball */}
                            <View style={[styles.colorCircularBall, { backgroundColor: color.hex, borderColor: 'rgba(44, 27, 24, 0.15)', borderWidth: 1 }]}>
                              {isSelected && <Check size={14} color={color.key === 'cream' || color.key === 'lavender' ? '#D4A373' : '#FFFFFF'} strokeWidth={3} />}
                            </View>
                            
                            <View style={{ flex: 1, marginLeft: 16 }}>
                              <Text style={[styles.colorRowName, isSelected && { fontFamily: 'Poppins-SemiBold', color: theme.colors.text }]}>
                                {color.name}
                              </Text>
                              <Text style={styles.colorRowLabelSub}>{color.label}</Text>
                            </View>
                            
                            <Text style={styles.colorRowSurcharge}>Included</Text>
                          </GlassBox>
                        </TouchableOpacity>
                      </Animated.View>
                    );
                  })}
                </View>
              </View>
            )}

            {/* TAB 3: TOPPINGS */}
            {activeTab === 'toppings' && (
              <View style={styles.deckContentBlock}>
                <Text style={styles.deckSectionTitle}>Luxury Raw Toppings</Text>
                <Text style={styles.deckSectionIntroText}>
                  Elevate your creation with high-end Parisian textures (select multiple):
                </Text>

                <View style={styles.toppingsGridRow}>
                  {TOPPINGS.map(topping => {
                    const isSelected = activeToppings.includes(topping.key);
                    return (
                      <TouchableOpacity 
                        key={topping.key}
                        style={styles.toppingCardTouch}
                        onPress={() => handleToppingToggle(topping.key)}
                      >
                        <GlassBox 
                          intensity={isSelected ? 65 : 20} 
                          style={[
                            styles.toppingCardGlass,
                            isSelected && { borderColor: theme.colors.secondary }
                          ]}
                        >
                          <Text style={styles.toppingEmojiIcon}>{topping.emoji}</Text>
                          <Text style={[styles.toppingLabelText, isSelected && { fontFamily: 'Poppins-SemiBold', color: theme.colors.text }]}>
                            {topping.label}
                          </Text>
                          <Text style={styles.toppingDescSub}>{topping.desc}</Text>
                          
                          <View style={styles.toppingBottomPriceRow}>
                            <Text style={styles.toppingPriceText}>+${topping.surcharge.toFixed(2)}</Text>
                            <View style={[styles.toppingCheckBox, isSelected && styles.toppingCheckBoxActive]}>
                              {isSelected && <Check size={10} color="#FFFFFF" strokeWidth={3} />}
                            </View>
                          </View>
                        </GlassBox>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            {/* TAB 4: CELEBRATION TOPPERS */}
            {activeTab === 'toppers' && (
              <View style={styles.deckContentBlock}>
                <Text style={styles.deckSectionTitle}>Bespoke Celebration Toppers</Text>
                <Text style={styles.deckSectionIntroText}>
                  A luxurious laser-cut golden stick plaque placed on the crest of the cake:
                </Text>

                <View style={styles.topperListColumn}>
                  {TOPPERS.map(topper => {
                    const isSelected = selectedTopper === topper.key;
                    return (
                      <TouchableOpacity 
                        key={topper.key}
                        style={styles.topperRowTouch}
                        onPress={() => setSelectedTopper(topper.key as any)}
                      >
                        <GlassBox 
                          intensity={isSelected ? 50 : 20} 
                          style={[
                            styles.topperRowGlass,
                            isSelected && { borderColor: theme.colors.secondary }
                          ]}
                        >
                          <Text style={styles.topperEmoji}>{topper.emoji}</Text>
                          
                          <View style={{ flex: 1, marginLeft: 16 }}>
                            <Text style={[styles.topperLabelTitle, isSelected && { fontFamily: 'Poppins-SemiBold', color: theme.colors.text }]}>
                              {topper.label}
                            </Text>
                          </View>
                          
                          <Text style={styles.topperSurchargeText}>
                            {topper.surcharge === 0 ? 'Included' : `+$${topper.surcharge.toFixed(2)}`}
                          </Text>
                        </GlassBox>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            {/* TAB 5: PRINTS & WRITING */}
            {activeTab === 'print' && (
              <View style={styles.deckContentBlock}>
                {/* 1. Sugar Prints */}
                <Text style={styles.deckSectionTitle}>Edible Sugar Photo Print</Text>
                <Text style={styles.deckSectionIntroText}>
                  Project your own luxury pattern or photo on the front icing face (+$18.00):
                </Text>

                {sugarPrintUploaded && selectedSugarPrint ? (
                  <GlassBox intensity={40} style={styles.sugarUploadedSuccessCard}>
                    <Image source={{ uri: selectedSugarPrint }} style={styles.uploadedMiniPreview} contentFit="cover" />
                    <View style={{ flex: 1, marginLeft: 14 }}>
                      <Text style={styles.uploadedSuccessTitle}>Edible Image Loaded</Text>
                      <Text style={styles.uploadedSuccessSub}>Positioned centered on bottom tier rim.</Text>
                    </View>
                    <TouchableOpacity onPress={handleRemoveSugarPrint} style={styles.removeUploadBtn}>
                      <X size={18} color="#E06D6D" />
                    </TouchableOpacity>
                  </GlassBox>
                ) : (
                  <TouchableOpacity onPress={handleTriggerPresetSelection} style={styles.uploadDashedTouch}>
                    <Upload size={22} color={theme.colors.secondary} strokeWidth={1.8} />
                    <Text style={styles.uploadMainText}>Upload Edible Art Print</Text>
                    <Text style={styles.uploadSubText}>PNG, JPG format. Custom surcharges apply.</Text>
                  </TouchableOpacity>
                )}

                {/* 2. Calligraphy Inscription */}
                <Text style={[styles.deckSectionTitle, { marginTop: 26 }]}>Gold-Leaf Hand Calligraphy</Text>
                <Text style={styles.deckSectionIntroText}>
                  Provide custom script words. Our pastry chefs will hand-pipe them in gold cacao:
                </Text>

                <GlassBox intensity={30} style={styles.calligraphyInputWrapper}>
                  <Type size={18} color={theme.colors.secondary} style={{ marginRight: 12 }} />
                  <TextInput 
                    placeholder="E.g. Love Always, HBD Pierre..."
                    placeholderTextColor="rgba(140, 122, 119, 0.45)"
                    value={calligraphyText}
                    onChangeText={setCalligraphyText}
                    maxLength={30}
                    style={styles.calligraphyInputField}
                  />
                </GlassBox>
                <Text style={styles.inscriptionTipText}>Max 30 characters. Inscription is fully included.</Text>

                {/* 3. Luxury Gifting cloche presentation */}
                <Text style={[styles.deckSectionTitle, { marginTop: 26 }]}>Bespoke Gifting Presentation</Text>
                <Text style={styles.deckSectionIntroText}>
                  Enclose your cake inside a luxury hand-blown glass cloche wrapped in gold-leaf satin ribbons (+$10.00):
                </Text>

                <TouchableOpacity 
                  style={styles.giftingToggleTouch}
                  onPress={() => setGiftingMode(prev => !prev)}
                >
                  <GlassBox 
                    intensity={giftingMode ? 65 : 20} 
                    style={[
                      styles.giftingCardGlass,
                      giftingMode && { borderColor: theme.colors.secondary }
                    ]}
                  >
                    <View style={styles.giftingHeaderRow}>
                      <Gift size={20} color={giftingMode ? theme.colors.secondary : '#8C7A77'} style={{ marginRight: 10 }} />
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.giftingLabelText, giftingMode && { fontFamily: 'Poppins-SemiBold', color: theme.colors.text }]}>
                          Luxury Gifting Glass Dome Package
                        </Text>
                        <Text style={styles.giftingCardSub}>Includes satin ribbons & gold lettering card</Text>
                      </View>
                      <View style={[styles.toppingCheckBox, giftingMode && styles.toppingCheckBoxActive]}>
                        {giftingMode && <Check size={10} color="#FFFFFF" strokeWidth={3} />}
                      </View>
                    </View>
                  </GlassBox>
                </TouchableOpacity>

                {giftingMode && (
                  <View style={{ marginTop: 16 }}>
                    <Text style={styles.deckSectionIntroText}>
                      Enter a hand-written calligraphy greeting message for the gourmet gift card:
                    </Text>
                    <GlassBox intensity={30} style={styles.calligraphyInputWrapper}>
                      <Gift size={18} color={theme.colors.secondary} style={{ marginRight: 12 }} />
                      <TextInput 
                        placeholder="E.g. Happy Anniversary, My Love! - Jean"
                        placeholderTextColor="rgba(140, 122, 119, 0.45)"
                        value={giftCardMessage}
                        onChangeText={setGiftCardMessage}
                        maxLength={60}
                        style={styles.calligraphyInputField}
                      />
                    </GlassBox>

                    {/* Stationery Card Selector */}
                    <Text style={[styles.deckSectionTitle, { marginTop: 20 }]}>Select Stationery Style</Text>
                    <View style={styles.stationeryOptionsRow}>
                      {[
                        { key: 'classic', label: 'Classic Foil', desc: 'Chantilly gold lettering' },
                        { key: 'midnight', label: 'Midnight Velvet', desc: 'Edible gold on obsidian' },
                        { key: 'botanical', label: 'Parisian Rose', desc: 'Watercolored bloom outline' }
                      ].map(styleOpt => {
                        const isSelected = giftingStationery === styleOpt.key;
                        return (
                          <TouchableOpacity 
                            key={styleOpt.key}
                            style={styles.stationeryCardTouch}
                            onPress={() => setGiftingStationery(styleOpt.key as any)}
                          >
                            <GlassBox 
                              intensity={isSelected ? 65 : 20} 
                              style={[
                                styles.stationeryCardGlass,
                                isSelected && { borderColor: theme.colors.secondary }
                              ]}
                            >
                              <Text style={[styles.stationeryLabel, isSelected && { fontFamily: 'Poppins-SemiBold', color: theme.colors.text }]}>
                                {styleOpt.label}
                              </Text>
                              <Text style={styles.stationeryDesc}>{styleOpt.desc}</Text>
                            </GlassBox>
                          </TouchableOpacity>
                        );
                      })}
                    </View>

                    {/* Live Stationery Preview */}
                    <Text style={[styles.stationeryPreviewLabel, { marginTop: 20 }]}>Live Calligraphy Preview</Text>
                    {getStationeryCardLayout()}
                  </View>
                )}
              </View>
            )}

          </ScrollView>

          {/* Bottom Execution Deck */}
          <View style={styles.pricingExecutionDeck}>
            <View style={styles.deliveryBadgeRow}>
              <Clock size={12} color="#D4A373" style={{ marginRight: 6 }} />
              <Text style={styles.deliveryBadgeText}>
                Craftsmanship Delivery: <Text style={{ fontFamily: 'Poppins-SemiBold' }}>Tomorrow 4 PM</Text> (Order by 2 PM)
              </Text>
            </View>

            <View style={styles.executionBtnRow}>
              <View style={styles.pricingLabelsBlock}>
                <Text style={styles.totalPriceLabel}>Custom Total</Text>
                <Text style={styles.computedPriceValue}>${computePrice().toFixed(2)}</Text>
              </View>

              <Button 
                title={orderingInProgress ? "Designing..." : "Add custom creation"}
                leftIcon={<ShoppingBag size={18} color="#FFFFFF" strokeWidth={2} />}
                loading={orderingInProgress}
                onPress={handleOrderSubmit}
                style={styles.solidExecutionBtn}
              />
            </View>
          </View>

        </GlassBox>
      </View>

      {/* Preset Sugar Prints Modal Dialog */}
      {showPresetsModal && (
        <View style={styles.modalFullOverlay}>
          <TouchableOpacity 
            style={styles.modalOverlayClickDismiss} 
            activeOpacity={1}
            onPress={() => setShowPresetsModal(false)}
          />
          <View style={styles.presetSelectorDialog}>
            <GlassBox intensity={98} style={styles.presetDialogInnerGlass}>
              <View style={styles.presetHeaderRow}>
                <Text style={styles.presetTitleText}>Select Luxury Print</Text>
                <TouchableOpacity onPress={() => setShowPresetsModal(false)} style={styles.presetCloseBtn}>
                  <X size={20} color={theme.colors.text} />
                </TouchableOpacity>
              </View>
              
              <Text style={styles.presetIntroSub}>Select a premium curated graphic art preset to edible-print on the icing:</Text>

              <View style={styles.presetsOptionsGrid}>
                {SUGAR_PRINTS.map(print => (
                  <TouchableOpacity 
                    key={print.id} 
                    style={styles.presetCardTouch}
                    onPress={() => handleSelectPreset(print.uri)}
                  >
                    <Image source={{ uri: print.uri }} style={styles.presetCardImg} contentFit="cover" />
                    <Text style={styles.presetCardLabelText} numberOfLines={1}>{print.title}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </GlassBox>
          </View>
        </View>
      )}

      {/* Activity Upload Loader */}
      {isUploading && (
        <View style={styles.activityLoaderOverlay}>
          <GlassBox intensity={85} style={styles.loaderGlassBox}>
            <ActivityIndicator size="large" color={theme.colors.secondary} />
            <Text style={styles.loaderLabelText}>Gilding edible print sheets...</Text>
          </GlassBox>
        </View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F2',
  },
  previewCanvasWrapper: {
    width: '100%',
    height: height * 0.45,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  studioPedestalContainer: {
    position: 'absolute',
    bottom: -20,
    width: '100%',
    height: 100,
    alignItems: 'center',
  },
  studioPedestal: {
    width: width * 0.7,
    height: 60,
    borderRadius: 100,
    transform: [{ scaleX: 1.5 }],
    opacity: 0.6,
  },
  animatedPricePillContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 20,
  },
  pricePillGlass: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(212, 163, 115, 0.3)',
  },
  pricePillLabel: {
    fontFamily: 'Cairo-Bold',
    fontSize: 10,
    color: '#8C7A77',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginRight: 6,
  },
  pricePillValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 15,
    color: '#2C1B18',
  },
  canvasBackgroundRadial: {
    position: 'absolute',
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: (width * 0.8) / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    opacity: 0.8,
  },
  goldLeafEmitterOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
  },
  cakeStandContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%',
    height: 240,
  },
  topperStickWrapper: {
    alignItems: 'center',
    position: 'absolute',
    bottom: 185,
    zIndex: 5,
  },
  topperMetalRod: {
    width: 2,
    height: 36,
    backgroundColor: '#D4A373',
  },
  topperCardLabel: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderColor: 'rgba(212, 163, 115, 0.4)',
    borderWidth: 1.2,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 0,
    marginTop: -42,
  },
  topperBadgeText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 10,
    color: '#D4A373',
  },
  cakeTierTop: {
    position: 'absolute',
    bottom: 145,
    width: 90,
    height: 44,
    zIndex: 4,
  },
  cakeTierMiddle: {
    position: 'absolute',
    bottom: 95,
    width: 140,
    height: 54,
    zIndex: 3,
  },
  cakeTierBottom: {
    position: 'absolute',
    bottom: 40,
    width: 190,
    height: 62,
    zIndex: 2,
  },
  tierBasePlate: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    shadowColor: '#2C1B18',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 5,
    overflow: 'hidden',
  },
  tierGlossSheen: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '38%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  tierRimPiping: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: 5,
  },
  canvasSugarPrintWrapper: {
    position: 'absolute',
    width: 52,
    height: 38,
    borderRadius: 6,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    alignSelf: 'center',
    bottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  canvasSugarPrintImg: {
    width: '100%',
    height: '100%',
  },
  sugarPrintGlassGlaze: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  calligraphyOverlayWrapper: {
    position: 'absolute',
    top: 14,
    width: '100%',
    alignItems: 'center',
  },
  calligraphyOverlayCursiveText: {
    fontFamily: 'Cairo-Bold',
    fontSize: 10,
    color: '#D4A373',
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    letterSpacing: 0.5,
  },
  microMacaron: {
    position: 'absolute',
    width: 14,
    height: 10,
    borderRadius: 5,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    borderWidth: 0.5,
  },
  microBerry: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  microFlower: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FCE1DC',
    borderColor: '#E06D6D',
    borderWidth: 1,
  },
  pedestalPlateOuter: {
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    zIndex: 1,
  },
  pedestalTopPlank: {
    width: 220,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#D4A373',
    shadowColor: '#2C1B18',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  pedestalStemRod: {
    width: 24,
    height: 24,
    backgroundColor: '#C59567',
  },
  pedestalBaseDisk: {
    width: 110,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D4A373',
  },
  configWorkspaceDeck: {
    flex: 1,
    marginTop: -25,
  },
  workspaceInnerGlass: {
    flex: 1,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderWidth: 0,
    paddingHorizontal: 0,
    paddingTop: 18,
    paddingBottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  workspaceTabBarWrap: {
    height: 52,
    marginBottom: 8,
  },
  tabBarScrollStyle: {
    paddingHorizontal: 24,
    gap: 8,
    alignItems: 'center',
  },
  tabTouchButton: {
    borderRadius: 18,
    overflow: 'hidden',
  },
  tabInnerGlass: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
    borderColor: 'rgba(232, 211, 194, 0.3)',
    borderWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    padding: 0,
  },
  tabLabelText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#8C7A77',
  },
  scrollDeckPanel: {
    flex: 1,
    paddingHorizontal: 28,
  },
  deckContentBlock: {
    paddingBottom: 240,
  },
  deckSectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 15,
    color: '#2C1B18',
    marginTop: 18,
    marginBottom: 10,
  },
  deckSectionIntroText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: '#8C7A77',
    lineHeight: 18,
    marginBottom: 14,
  },
  sizingOptionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  sizingCardTouch: {
    flex: 1,
    borderRadius: 18,
    overflow: 'hidden',
  },
  sizingCardGlass: {
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderColor: 'rgba(232, 211, 194, 0.45)',
    borderWidth: 1.2,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    alignItems: 'center',
  },
  sizingCardLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
    color: '#8C7A77',
  },
  sizingCardDetail: {
    fontFamily: 'Cairo-Bold',
    fontSize: 8,
    color: '#8C7A77',
    opacity: 0.8,
    marginTop: 2,
  },
  sizingCardServings: {
    fontFamily: 'Poppins-Regular',
    fontSize: 9,
    color: '#8C7A77',
    marginTop: 4,
  },
  sizingCardSurcharge: {
    fontFamily: 'Cairo-Bold',
    fontSize: 10,
    color: '#D4A373',
    marginTop: 8,
  },
  flavorListColumn: {
    gap: 8,
  },
  flavorRowTouch: {
    borderRadius: 18,
    overflow: 'hidden',
  },
  flavorRowGlass: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    padding: 14,
    borderColor: 'rgba(232, 211, 194, 0.4)',
    borderWidth: 1.2,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
  },
  customRadioBtn: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: 'rgba(212, 163, 115, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  customRadioBtnActive: {
    borderColor: '#D4A373',
  },
  radioDotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D4A373',
  },
  flavorRowLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
    color: '#8C7A77',
  },
  flavorRowDesc: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: '#8C7A77',
    opacity: 0.8,
    marginTop: 1,
  },
  flavorRowSurcharge: {
    fontFamily: 'Cairo-Bold',
    fontSize: 11,
    color: '#D4A373',
  },
  colorPickerListColumn: {
    gap: 8,
  },
  colorRowTouch: {
    borderRadius: 18,
    overflow: 'hidden',
  },
  colorRowGlass: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    padding: 12,
    borderColor: 'rgba(232, 211, 194, 0.4)',
    borderWidth: 1.2,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
  },
  colorCircularBall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorRowName: {
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
    color: '#8C7A77',
  },
  colorRowLabelSub: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: '#8C7A77',
    opacity: 0.8,
  },
  colorRowSurcharge: {
    fontFamily: 'Cairo-Bold',
    fontSize: 10,
    color: '#D4A373',
  },
  toppingsGridRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  toppingCardTouch: {
    width: (width - 64) / 2,
    borderRadius: 20,
    overflow: 'hidden',
  },
  toppingCardGlass: {
    borderRadius: 20,
    padding: 14,
    borderColor: 'rgba(232, 211, 194, 0.4)',
    borderWidth: 1.2,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  toppingEmojiIcon: {
    fontSize: 22,
    marginBottom: 4,
  },
  toppingLabelText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#8C7A77',
  },
  toppingDescSub: {
    fontFamily: 'Poppins-Regular',
    fontSize: 10,
    color: '#8C7A77',
    opacity: 0.7,
    marginTop: 2,
    height: 28,
  },
  toppingBottomPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  toppingPriceText: {
    fontFamily: 'Cairo-Bold',
    fontSize: 11,
    color: '#D4A373',
  },
  toppingCheckBox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1.2,
    borderColor: 'rgba(212, 163, 115, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toppingCheckBoxActive: {
    borderColor: '#D4A373',
    backgroundColor: '#D4A373',
  },
  topperListColumn: {
    gap: 8,
  },
  topperRowTouch: {
    borderRadius: 18,
    overflow: 'hidden',
  },
  topperRowGlass: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    padding: 12,
    borderColor: 'rgba(232, 211, 194, 0.4)',
    borderWidth: 1.2,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
  },
  topperEmoji: {
    fontSize: 20,
  },
  topperLabelTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
    color: '#8C7A77',
  },
  topperSurchargeText: {
    fontFamily: 'Cairo-Bold',
    fontSize: 11,
    color: '#D4A373',
  },
  sugarUploadedSuccessCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    borderColor: 'rgba(212, 163, 115, 0.3)',
    borderWidth: 1.2,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    padding: 12,
  },
  uploadedMiniPreview: {
    width: 44,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  uploadedSuccessTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 13,
    color: '#2C1B18',
  },
  uploadedSuccessSub: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: '#8C7A77',
  },
  removeUploadBtn: {
    padding: 8,
  },
  uploadDashedTouch: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: 'rgba(212, 163, 115, 0.45)',
    borderRadius: 18,
    paddingVertical: 20,
    backgroundColor: 'rgba(212, 163, 115, 0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadMainText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
    color: '#2C1B18',
    marginTop: 6,
  },
  uploadSubText: {
    fontFamily: 'Cairo-Medium',
    fontSize: 9,
    color: '#8C7A77',
    opacity: 0.8,
    marginTop: 1,
  },
  calligraphyInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderColor: 'rgba(232, 211, 194, 0.45)',
    borderWidth: 1.2,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    paddingHorizontal: 16,
    height: 52,
    padding: 0,
  },
  calligraphyInputField: {
    flex: 1,
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: '#2C1B18',
    height: '100%',
    padding: 0,
  },
  inscriptionTipText: {
    fontFamily: 'Cairo-Medium',
    fontSize: 9,
    color: '#8C7A77',
    opacity: 0.8,
    marginTop: 6,
  },
  pricingExecutionDeck: {
    position: 'absolute',
    bottom: 112,
    left: 20,
    right: 20,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(232, 211, 194, 0.4)',
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 14,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 10,
  },
  deliveryBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'center',
  },
  deliveryBadgeText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: '#D4A373',
  },
  executionBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  pricingLabelsBlock: {
    flexDirection: 'column',
  },
  totalPriceLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 11,
    color: '#8C7A77',
  },
  computedPriceValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 22,
    color: '#D4A373',
  },
  solidExecutionBtn: {
    flex: 1,
    height: 48,
  },
  modalFullOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(61, 44, 41, 0.45)',
    justifyContent: 'flex-end',
    zIndex: 99,
  },
  modalOverlayClickDismiss: {
    ...StyleSheet.absoluteFillObject,
  },
  presetSelectorDialog: {
    width: '100%',
    maxHeight: height * 0.6,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: 'hidden',
  },
  presetDialogInnerGlass: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderWidth: 0,
    paddingHorizontal: 28,
    paddingTop: 24,
    paddingBottom: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
  },
  presetHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(232, 211, 194, 0.3)',
  },
  presetTitleText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#2C1B18',
  },
  presetCloseBtn: {
    padding: 6,
  },
  presetIntroSub: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#8C7A77',
    marginTop: 14,
    marginBottom: 16,
    lineHeight: 18,
  },
  presetsOptionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  presetCardTouch: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: 'rgba(212, 163, 115, 0.05)',
    padding: 10,
    alignItems: 'center',
    borderColor: 'rgba(232, 211, 194, 0.3)',
    borderWidth: 1,
  },
  presetCardImg: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 10,
  },
  presetCardLabelText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 11,
    color: '#2C1B18',
    marginTop: 8,
  },
  activityLoaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(61, 44, 41, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  loaderGlassBox: {
    padding: 24,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    width: 220,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  loaderLabelText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#8C7A77',
    marginTop: 14,
    textAlign: 'center',
  },

  // Floating Perspective Action Button
  perspectiveToggleBtn: {
    position: 'absolute',
    top: 80,
    right: 20,
    zIndex: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  perspectiveInnerGlass: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderColor: 'rgba(212, 163, 115, 0.4)',
    borderWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    padding: 0,
  },
  perspectiveToggleText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 11,
    color: '#D4A373',
  },

  // Frosting Finishes (Tiers & Flavor Deck)
  finishOptionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  pipingOptionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  finishCardTouch: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  finishCardGlass: {
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderColor: 'rgba(232, 211, 194, 0.45)',
    borderWidth: 1.2,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    alignItems: 'center',
  },
  finishCardLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#8C7A77',
    textAlign: 'center',
  },
  finishCardDesc: {
    fontFamily: 'Poppins-Regular',
    fontSize: 9,
    color: '#8C7A77',
    opacity: 0.7,
    marginTop: 2,
    textAlign: 'center',
  },

  // Rim Piping Borders
  pipingCardTouch: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  pipingCardGlass: {
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderColor: 'rgba(232, 211, 194, 0.45)',
    borderWidth: 1.2,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    alignItems: 'center',
  },
  pipingCardLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#8C7A77',
    textAlign: 'center',
  },
  pipingCardDesc: {
    fontFamily: 'Poppins-Regular',
    fontSize: 9,
    color: '#8C7A77',
    opacity: 0.7,
    marginTop: 2,
    textAlign: 'center',
  },

  // Dynamic Spatula Rustic Finish (Front View)
  finishRusticOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-around',
    paddingVertical: 6,
  },
  rusticStreak1: {
    height: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    width: '80%',
    marginLeft: '5%',
    borderRadius: 1,
  },
  rusticStreak2: {
    height: 1.5,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    width: '90%',
    marginLeft: '8%',
    borderRadius: 1,
  },
  rusticStreak3: {
    height: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    width: '75%',
    marginLeft: '3%',
    borderRadius: 1,
  },

  // Velvet Matte Shadow flat layer
  finishVelvetOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },

  // Dynamic Piping Dots/Glow
  pipingMinimalLine: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: 2,
  },
  pipingDotsContainer: {
    position: 'absolute',
    bottom: 1,
    left: 0,
    width: '100%',
    height: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  pipingPearlDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  goldShellGlow: {
    shadowColor: '#D4A373',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.6,
    shadowRadius: 2,
    elevation: 1,
  },

  // Luxury Glass Cloche Dome
  glassDomeWrapper: {
    position: 'absolute',
    bottom: 20,
    width: 228,
    height: 210,
    alignItems: 'center',
    zIndex: 6,
  },
  glassDomeHandleRing: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#D4A373',
    backgroundColor: 'transparent',
    marginBottom: -2,
  },
  glassDomeHandleBase: {
    width: 24,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D4A373',
  },
  glassDomeBody: {
    width: '100%',
    flex: 1,
    borderTopLeftRadius: 114,
    borderTopRightRadius: 114,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderWidth: 2,
    borderColor: 'rgba(212, 163, 115, 0.4)',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    overflow: 'hidden',
  },
  glassDomeReflection: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '35%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderTopRightRadius: 114,
    transform: [{ skewX: '-15deg' }],
  },

  // Gifting Cards Styles
  giftingToggleTouch: {
    borderRadius: 18,
    overflow: 'hidden',
  },
  giftingCardGlass: {
    borderRadius: 18,
    padding: 14,
    borderColor: 'rgba(232, 211, 194, 0.4)',
    borderWidth: 1.2,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  giftingHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  giftingLabelText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
    color: '#8C7A77',
  },
  giftingCardSub: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: '#8C7A77',
    opacity: 0.8,
    marginTop: 1,
  },

  // Top Down Flat Lay Perspective Platter
  topDownPlatter: {
    width: 220,
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    zIndex: 3,
  },
  topDownCircleOuter: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2C1B18',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    overflow: 'hidden',
    position: 'relative',
  },
  topDownCircleMiddle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2C1B18',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    overflow: 'hidden',
    position: 'relative',
  },
  topDownCircleInner: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2C1B18',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
    position: 'relative',
  },
  topDownRusticCircleOuter: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 100,
    margin: 8,
  },
  topDownRusticCircleMiddle: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 75,
    margin: 6,
  },
  topDownRusticCircleInner: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 50,
    margin: 4,
  },
  topDownMirrorCircleOuter: {
    position: 'absolute',
    top: -30,
    left: -30,
    width: 100,
    height: 260,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    transform: [{ skewX: '-30deg' }],
  },
  topDownMirrorCircleMiddle: {
    position: 'absolute',
    top: -20,
    left: -20,
    width: 70,
    height: 190,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    transform: [{ skewX: '-30deg' }],
  },
  topDownMirrorCircleInner: {
    position: 'absolute',
    top: -15,
    left: -15,
    width: 50,
    height: 130,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    transform: [{ skewX: '-30deg' }],
  },
  topDownPipingMinimal: {
    position: 'absolute',
    borderWidth: 1.5,
  },
  topDownPipingDotted: {
    position: 'absolute',
  },
  topDownCalligraphyWrapper: {
    width: '85%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topDownCalligraphyText: {
    fontFamily: 'Cairo-Bold',
    fontSize: 11,
    color: '#D4A373',
    textAlign: 'center',
    lineHeight: 14,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 1,
  },
  topDownMacaron: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    borderWidth: 0.5,
  },
  topDownBerry: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  topDownFlower: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FCE1DC',
    borderColor: '#E06D6D',
    borderWidth: 1,
  },
  backdropToggleBtn: {
    position: 'absolute',
    top: 80,
    left: 20,
    zIndex: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  themesScrollContainer: {
    paddingRight: 28,
    gap: 12,
  },
  themeCardTouch: {
    width: 200,
    height: 120,
    borderRadius: 18,
    overflow: 'hidden',
  },
  themeCardGradient: {
    flex: 1,
  },
  themeCardOverlay: {
    flex: 1,
    padding: 12,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  themeCardTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 12,
    color: '#FFFFFF',
    marginBottom: 2,
  },
  themeCardDesc: {
    fontFamily: 'Poppins-Regular',
    fontSize: 9,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 12,
  },
  themeCardPrice: {
    fontFamily: 'Cairo-Bold',
    fontSize: 9,
    color: '#D4A373',
    marginTop: 4,
  },
  stationeryOptionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  stationeryCardTouch: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  stationeryCardGlass: {
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderColor: 'rgba(232, 211, 194, 0.45)',
    borderWidth: 1.2,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    alignItems: 'center',
    height: 70,
    justifyContent: 'center',
  },
  stationeryLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 11,
    color: '#8C7A77',
    textAlign: 'center',
  },
  stationeryDesc: {
    fontFamily: 'Poppins-Regular',
    fontSize: 8,
    color: '#8C7A77',
    opacity: 0.7,
    marginTop: 2,
    textAlign: 'center',
  },
  stationeryPreviewLabel: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: '#2C1B18',
    marginBottom: 8,
  },
  stationeryCardBody: {
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 16,
    minHeight: 130,
    justifyContent: 'center',
    shadowColor: '#2C1B18',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    position: 'relative',
    overflow: 'hidden',
  },
  stationeryCardInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  stationeryCardLabel: {
    fontFamily: 'Cairo-Bold',
    fontSize: 10,
    letterSpacing: 1.5,
    opacity: 0.75,
    textTransform: 'uppercase',
  },
  stationeryCardDivider: {
    width: 30,
    height: 1,
    backgroundColor: 'rgba(212, 163, 115, 0.4)',
    marginVertical: 10,
  },
  stationeryCardMessage: {
    fontFamily: 'Cairo-Bold',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
    fontStyle: 'italic',
  },
  stationeryCardMessagePlaceholder: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
    fontStyle: 'italic',
  },
  botanicalFlowerDecoration: {
    position: 'absolute',
    top: 6,
    right: 8,
  }
});
