import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions, 
  FlatList,
  Modal,
  TextInput,
  Platform,
  ActivityIndicator,
  Pressable
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { 
  ChevronLeft, 
  Heart, 
  Star, 
  Clock, 
  Sparkles, 
  ShoppingBag, 
  Sliders, 
  Check, 
  Plus, 
  Minus,
  MessageSquare,
  Award,
  X
} from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming,
  Easing
} from 'react-native-reanimated';
import { AppHeader } from '../components/common/AppHeader';
import { theme } from '../theme';
import { GlassBox } from '../components/ui/GlassBox';
import { Button } from '../components/ui/Button';

const { width, height } = Dimensions.get('window');

// Extended Cake Details Interface
interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

interface Ingredient {
  name: string;
  emoji: string;
  origin: string;
}

interface CakeDetailItem {
  id: string;
  title: string;
  category: string;
  price: number;
  rating: number;
  reviewsCount: number;
  images: string[];
  description: string;
  prepTime: string;
  flavorProfile: string;
  ingredients: Ingredient[];
  reviews: Review[];
}

const CAKE_DATABASE: Record<string, CakeDetailItem> = {
  '1': {
    id: '1',
    title: "L'Amour Rose",
    category: "Signature Haute",
    price: 120.00,
    rating: 4.9,
    reviewsCount: 148,
    images: [
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1516685018646-549198525c1b?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1535254973040-607b474cb50d?q=80&w=600&auto=format&fit=crop"
    ],
    description: "An artistic masterpiece crafted for the sensory romantic. Creamy white chocolate mousse meets organic Ispahan raspberry gel inserts and a delicate damask rosewater-infused biscuit sponge. Glazed in a velvety pastel pink coating and embellished with edible 24-karat gold leaf flakes.",
    prepTime: "24 Hours Custom Craftsmanship",
    flavorProfile: "Floral, Tart Berry, Velvet Sweet",
    ingredients: [
      { name: "Damask Rose", emoji: "🌹", origin: "Ispahan" },
      { name: "Valrhona White Choc", emoji: "🍫", origin: "France" },
      { name: "Organic Raspberries", emoji: "🍓", origin: "Brittany" },
      { name: "Almond Biscuit", emoji: "🌾", origin: "Provence" }
    ],
    reviews: [
      { id: '1a', author: "Amélie Laurent", rating: 5, comment: "An absolute dream. The rose ganache is incredibly subtle and never overpowering. Worth every dollar.", date: "2 days ago" },
      { id: '1b', author: "Julian V.", rating: 5, comment: "I ordered this for our anniversary. The presentation was jaw-dropping, and it tasted even better than it looked.", date: "1 week ago" }
    ]
  },
  '2': {
    id: '2',
    title: "Le Chocolat Royale",
    category: "Signature Haute",
    price: 95.00,
    rating: 4.8,
    reviewsCount: 92,
    images: [
      "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1557089706-68d02dbda277?q=80&w=600&auto=format&fit=crop"
    ],
    description: "The ultimate dark chocolate tribute. Multi-layered 70% Single-Origin Valrhona chocolate cremeux sits between moist, espresso-moistened cocoa sponge, topped with gourmet salted hazelnut praline chips and shiny, rich dark glaze.",
    prepTime: "18 Hours Custom Craftsmanship",
    flavorProfile: "Intense Cacao, Salted Roast, Bitter Sweet",
    ingredients: [
      { name: "70% Valrhona Dark", emoji: "🍫", origin: "Madagascar" },
      { name: "Arabica Espresso", emoji: "☕", origin: "Ethiopia" },
      { name: "Piedmont Hazelnuts", emoji: "🌰", origin: "Italy" },
      { name: "Fleur de Sel", emoji: "🧂", origin: "Guérande" }
    ],
    reviews: [
      { id: '2a', author: "Jean-Pierre", rating: 5, comment: "The espresso infusion is perfectly balanced. A masterpiece of chocolate textures.", date: "3 days ago" },
      { id: '2b', author: "Sophie K.", rating: 4, comment: "Incredibly decadent and rich. Best dark chocolate cake in Paris.", date: "2 weeks ago" }
    ]
  },
  '3': {
    id: '3',
    title: "Pistachio Matcha Bliss",
    category: "Gourmet Creation",
    price: 110.00,
    rating: 4.7,
    reviewsCount: 76,
    images: [
      "https://images.unsplash.com/photo-1535141192574-5d4897c13636?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1562280963-8a5475740a10?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600&auto=format&fit=crop"
    ],
    description: "An elegant East-meets-West synthesis. Premium Uji ceremonial-grade matcha whipped mousse paired with a Sicilian pistachio biscuit sponge. Finished with velvety white chocolate velvet spray and edible cornflower petals.",
    prepTime: "30 Hours Custom Craftsmanship",
    flavorProfile: "Earthy, Nutty Cream, Roasted Tea",
    ingredients: [
      { name: "Uji Matcha", emoji: "🍵", origin: "Kyoto, Japan" },
      { name: "Sicilian Pistachios", emoji: "🌰", origin: "Sicily, Italy" },
      { name: "Whipped Mascarpone", emoji: "🥛", origin: "Lombardy" },
      { name: "Cornflower Petals", emoji: "🌸", origin: "Bavaria" }
    ],
    reviews: [
      { id: '3a', author: "Kenji S.", rating: 5, comment: "Genuine matcha bitterness perfectly balanced by sweet pistachio cream. Magnificent.", date: "5 days ago" },
      { id: '3b', author: "Claire D.", rating: 4.8, comment: "Light, fresh, and not too sweet. The pistachio sponge is remarkably fluffy.", date: "1 month ago" }
    ]
  },
  '4': {
    id: '4',
    title: "Golden Salted Caramel",
    category: "Signature Haute",
    price: 85.00,
    rating: 4.9,
    reviewsCount: 210,
    images: [
      "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519869325930-281384150729?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=600&auto=format&fit=crop"
    ],
    description: "A rich, moist brown sugar sponge cake layered with sea salt fleur-de-sel caramel ganache and caramelized crunch pecan pieces, wrapped in an elegant dark chocolate drip and finished with shimmering gold leaf flakes.",
    prepTime: "16 Hours Custom Craftsmanship",
    flavorProfile: "Caramelized, Salted Nut, Deep Cream",
    ingredients: [
      { name: "Fleur de Sel", emoji: "🧂", origin: "Guérande, France" },
      { name: "Pecan Halves", emoji: "🥜", origin: "Texas, USA" },
      { name: "Brown Sugar", emoji: "🍬", origin: "Demerara" },
      { name: "Whipped Double Cream", emoji: "🥛", origin: "Normandy" }
    ],
    reviews: [
      { id: '4a', author: "Marcus Aurelius", rating: 5, comment: "The caramel drip is a work of art. Salty and sweet elements are balanced to perfection.", date: "Yesterday" }
    ]
  }
};

export const CakeDetailsScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  // Resolve Cake Data (fallback to ID 1 if not found)
  const cakeId = (typeof id === 'string' ? id : '1') || '1';
  const cake = CAKE_DATABASE[cakeId] || CAKE_DATABASE['1'];

  // State Variables
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [isFav, setIsFav] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  
  // Customization Form State
  const [selectedTiers, setSelectedTiers] = useState<'single' | 'double' | 'triple'>('single');
  const [selectedFrosting, setSelectedFrosting] = useState<'default' | 'vanilla' | 'matcha'>('default');
  const [addGoldLeaf, setAddGoldLeaf] = useState(true);
  const [customCalligraphy, setCustomCalligraphy] = useState('');

  // Reanimated Spring Value
  const favScale = useSharedValue(1);

  const handleFavoritePress = () => {
    setIsFav(!isFav);
    favScale.value = withSpring(1.5, { damping: 5, stiffness: 180 }, () => {
      favScale.value = withSpring(1);
    });
  };

  const animStyleFav = useAnimatedStyle(() => ({
    transform: [{ scale: favScale.value }]
  }));

  const handleAddToCart = () => {
    setAddingToCart(true);
    setTimeout(() => {
      setAddingToCart(false);
      router.back();
    }, 1800);
  };

  const handleSaveCustomization = () => {
    setIsCustomizing(false);
  };

  // Price Calculation including tier changes
  const computedPrice = () => {
    let base = cake.price;
    if (selectedTiers === 'double') base += 45.00;
    if (selectedTiers === 'triple') base += 90.00;
    if (addGoldLeaf) base += 15.00;
    return base * quantity;
  };

  return (
    <View style={styles.container}>
      {/* Scrollable details wrapper */}
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContentStyle}
      >
        
        {/* Top Header Carousel Section */}
        <View style={styles.carouselContainer}>
          <FlatList 
            data={cake.images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
              setCurrentImgIndex(newIndex);
            }}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <Image 
                source={{ uri: item }} 
                style={styles.carouselImage} 
                contentFit="cover"
              />
            )}
          />

          {/* Dynamic Stretching Indicators */}
          <View style={styles.indicatorsWrapper}>
            {cake.images.map((_, index) => {
              const active = index === currentImgIndex;
              return (
                <View 
                  key={index} 
                  style={[
                    styles.indicatorDot, 
                    active && styles.indicatorDotActive,
                    active && { width: 22 }
                  ]} 
                />
              );
            })}
          </View>
        </View>

        {/* Sensory Detail Card Overlay */}
        <View style={styles.detailsCardBody}>
          
          {/* Headline Title */}
          <View style={styles.headlineRow}>
            <Text style={styles.categoryLabelText}>{cake.category.toUpperCase()}</Text>
            <View style={styles.titlePriceBlock}>
              <Text style={styles.cakeTitleText}>{cake.title}</Text>
              <Text style={styles.cakePriceText}>${cake.price.toFixed(2)}</Text>
            </View>
            
            {/* Core Ratings Row */}
            <View style={styles.metaBadgeRow}>
              <View style={styles.ratingBadgePlate}>
                <Star size={12} color="#D4A373" fill="#D4A373" style={{ marginRight: 4 }} />
                <Text style={styles.ratingBadgeVal}>{cake.rating}</Text>
                <Text style={styles.ratingCountText}>({cake.reviewsCount} reviews)</Text>
              </View>
              
              <View style={styles.metaDividerDot} />
              
              <View style={styles.prepHourBadge}>
                <Clock size={12} color="#8C7A77" style={{ marginRight: 4 }} />
                <Text style={styles.prepBadgeLabel}>{cake.prepTime.split(' ')[0] + ' ' + cake.prepTime.split(' ')[1]}</Text>
              </View>
            </View>
          </View>

          {/* Sensory Narrative */}
          <View style={styles.gourmetDescriptionBox}>
            <Text style={styles.detailSectionHeading}>Gourmet Profile</Text>
            <Text style={styles.descriptionNarrativeText}>{cake.description}</Text>
            
            {/* Flavor Profile Highlight */}
            <GlassBox intensity={20} style={styles.sensoryProfileBadge}>
              <Sparkles size={16} color="#D4A373" style={{ marginRight: 8 }} />
              <Text style={styles.sensoryProfileLabel}>Profile: <Text style={{ fontFamily: 'Poppins-SemiBold', color: '#2C1B18' }}>{cake.flavorProfile}</Text></Text>
            </GlassBox>
          </View>

          {/* Craftsmanship Time Section */}
          <View style={styles.craftsmanshipBox}>
            <View style={styles.craftsmanshipBanner}>
              <Award size={18} color="#D4A373" style={{ marginRight: 10 }} />
              <Text style={styles.craftsmanshipBannerText}>
                Handcrafted to order. Craftsmanship takes {cake.prepTime.toLowerCase()}.
              </Text>
            </View>
          </View>

          {/* Organic Raw Ingredients */}
          <View style={styles.ingredientsContainerBlock}>
            <Text style={styles.detailSectionHeading}>Luxury Raw Ingredients</Text>
            <View style={styles.ingredientsGridContainer}>
              {cake.ingredients.map((ingredient, i) => (
                <View key={i} style={styles.ingredientCardCell}>
                  <GlassBox intensity={25} style={styles.ingredientGlassCard}>
                    <Text style={styles.ingredientEmoji}>{ingredient.emoji}</Text>
                    <Text style={styles.ingredientTitle}>{ingredient.name}</Text>
                    <Text style={styles.ingredientOriginLabel}>{ingredient.origin}</Text>
                  </GlassBox>
                </View>
              ))}
            </View>
          </View>

          {/* Emotional Customer Reviews */}
          <View style={styles.testimonialsBlock}>
            <Text style={styles.detailSectionHeading}>Client Affection</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.reviewsScrollContent}
            >
              {cake.reviews.map(review => (
                <GlassBox key={review.id} intensity={30} style={styles.testimonialGlassCard}>
                  <View style={styles.testimonialStarsRow}>
                    {[...Array(5)].map((_, starIndex) => (
                      <Star 
                        key={starIndex} 
                        size={12} 
                        color={starIndex < Math.floor(review.rating) ? '#D4A373' : 'rgba(212,163,115,0.2)'} 
                        fill={starIndex < Math.floor(review.rating) ? '#D4A373' : 'transparent'} 
                        style={{ marginRight: 2 }}
                      />
                    ))}
                  </View>
                  <Text style={styles.testimonialCommentText} numberOfLines={3}>
                    "{review.comment}"
                  </Text>
                  <View style={styles.testimonialAuthorRow}>
                    <Text style={styles.testimonialAuthorName}>{review.author}</Text>
                    <Text style={styles.testimonialDateLabel}>{review.date}</Text>
                  </View>
                </GlassBox>
              ))}
            </ScrollView>
          </View>

        </View>
      </ScrollView>

      {/* Universal Modern Header - Floating & Transparent */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100 }}>
        <AppHeader 
          transparent
          noBorder
          showBack
          onBackPress={() => router.back()}
          rightContent={
            <TouchableOpacity 
              onPress={handleFavoritePress} 
              className="w-11 h-11 items-center justify-center rounded-2xl bg-white/40 border border-white/20 shadow-sm"
            >
              <Animated.View style={animStyleFav}>
                <Heart 
                  size={20} 
                  color={isFav ? '#E06D6D' : theme.colors.text} 
                  fill={isFav ? '#E06D6D' : 'transparent'} 
                  strokeWidth={2}
                />
              </Animated.View>
            </TouchableOpacity>
          }
        />
      </View>

      {/* Sticky Bottom Actions Bar */}
      <View style={[styles.stickyBottomBar, { paddingBottom: Math.max(insets.bottom, 15) }]}>
        <View style={styles.bottomRowContainer}>
          {/* Quantity Incrementor */}
          <View style={styles.quantityPickerWrapper}>
            <TouchableOpacity 
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
              style={styles.quantityMathBtn}
            >
              <Minus size={14} color={theme.colors.text} strokeWidth={2.2} />
            </TouchableOpacity>
            
            <Text style={styles.quantityValueLabel}>{quantity}</Text>
            
            <TouchableOpacity 
              onPress={() => setQuantity(quantity + 1)}
              style={styles.quantityMathBtn}
            >
              <Plus size={14} color={theme.colors.text} strokeWidth={2.2} />
            </TouchableOpacity>
          </View>

          {/* Action CTAs */}
          <View style={styles.btnCTAsWrapper}>
            {/* Customize CTA */}
            <TouchableOpacity 
              onPress={() => setIsCustomizing(true)}
              style={styles.customizeTouchBtn}
            >
              <GlassBox intensity={40} style={styles.customizeBtnGlass}>
                <Sliders size={18} color={theme.colors.secondary} strokeWidth={2} />
              </GlassBox>
            </TouchableOpacity>

            {/* Direct Add to Cart */}
            <Button 
              title={addingToCart ? "Curating..." : `Add - $${computedPrice().toFixed(2)}`}
              leftIcon={<ShoppingBag size={18} color="#FFFFFF" strokeWidth={1.8} />}
              loading={addingToCart}
              onPress={handleAddToCart}
              style={styles.addCartSolidBtn}
            />
          </View>
        </View>
      </View>

      {/* Luxury Customization Bottom Modal */}
      <Modal
        visible={isCustomizing}
        transparent
        animationType="slide"
        onRequestClose={() => setIsCustomizing(false)}
      >
        <Pressable 
          style={styles.modalBackdropOverlay} 
          onPress={() => setIsCustomizing(false)}
        >
          <Pressable style={styles.customizerSheetCard} pointerEvents="auto">
            <GlassBox intensity={98} style={styles.customizerModalInnerGlass}>
              <View style={styles.customizerModalHeader}>
                <View style={styles.modalHeaderAccentBar} />
                <Text style={styles.customizerTitle}>Custom Design Studio</Text>
                <TouchableOpacity onPress={() => setIsCustomizing(false)} style={styles.customizerCloseBtn}>
                  <X size={20} color={theme.colors.text} />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, marginTop: 15 }}>
                {/* Tiers Option */}
                <Text style={styles.customizerSectionHeader}>Sculpture Tiers</Text>
                <View style={styles.customizerSelectorRow}>
                  {[
                    { key: 'single', label: '1 Tier', surcharge: 'Included' },
                    { key: 'double', label: '2 Tiers', surcharge: '+$45.00' },
                    { key: 'triple', label: '3 Tiers', surcharge: '+$90.00' }
                  ].map(tier => {
                    const isSelected = selectedTiers === tier.key;
                    return (
                      <TouchableOpacity 
                        key={tier.key}
                        style={styles.customizerSelectionTouch}
                        onPress={() => setSelectedTiers(tier.key as any)}
                      >
                        <GlassBox 
                          intensity={isSelected ? 65 : 20} 
                          style={[
                            styles.customizerSelectionGlass,
                            isSelected && { borderColor: theme.colors.secondary }
                          ]}
                        >
                          <Text style={[styles.customOptionMainLabel, isSelected && { color: theme.colors.text, fontFamily: 'Poppins-SemiBold' }]}>
                            {tier.label}
                          </Text>
                          <Text style={styles.customOptionSubLabel}>{tier.surcharge}</Text>
                        </GlassBox>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Frosting Option */}
                <Text style={styles.customizerSectionHeader}>Artisanal Whipped Frosting</Text>
                <View style={styles.customizerSelectorRow}>
                  {[
                    { key: 'default', label: 'Signature', surcharge: 'Included' },
                    { key: 'vanilla', label: 'Chantilly', surcharge: 'Included' },
                    { key: 'matcha', label: 'Matcha Foam', surcharge: 'Included' }
                  ].map(frosting => {
                    const isSelected = selectedFrosting === frosting.key;
                    return (
                      <TouchableOpacity 
                        key={frosting.key}
                        style={styles.customizerSelectionTouch}
                        onPress={() => setSelectedFrosting(frosting.key as any)}
                      >
                        <GlassBox 
                          intensity={isSelected ? 65 : 20} 
                          style={[
                            styles.customizerSelectionGlass,
                            isSelected && { borderColor: theme.colors.secondary }
                          ]}
                        >
                          <Text style={[styles.customOptionMainLabel, isSelected && { color: theme.colors.text, fontFamily: 'Poppins-SemiBold' }]}>
                            {frosting.label}
                          </Text>
                          <Text style={styles.customOptionSubLabel}>{frosting.surcharge}</Text>
                        </GlassBox>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Extras Option */}
                <Text style={styles.customizerSectionHeader}>Embellishments</Text>
                <TouchableOpacity 
                  onPress={() => setAddGoldLeaf(!addGoldLeaf)}
                  style={styles.checkBoxRowItem}
                >
                  <View style={[styles.customCheckBox, addGoldLeaf && styles.customCheckBoxActive]}>
                    {addGoldLeaf && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
                  </View>
                  <View>
                    <Text style={[styles.checkBoxMainText, addGoldLeaf && { fontFamily: 'Poppins-Medium', color: theme.colors.text }]}>
                      Embellish with 24k Edible Gold Leaf
                    </Text>
                    <Text style={styles.checkBoxSubText}>+$15.00 surcharge. Adds visual luxury shimmer.</Text>
                  </View>
                </TouchableOpacity>

                {/* Signature Calligraphy */}
                <Text style={styles.customizerSectionHeader}>Hand-Piped Gold Calligraphy</Text>
                <GlassBox intensity={30} style={styles.studiosInputWrapper}>
                  <TextInput 
                    placeholder="E.g. HBD Chantal, With Love..."
                    placeholderTextColor="rgba(140, 122, 119, 0.4)"
                    value={customCalligraphy}
                    onChangeText={setCustomCalligraphy}
                    maxLength={30}
                    style={styles.studiosInputField}
                  />
                </GlassBox>
                <Text style={styles.studiosInputTip}>Max 30 characters. Hand-piped by a master decorator.</Text>

              </ScrollView>

              {/* Apply Button */}
              <View style={styles.customizerFooter}>
                <Button 
                  title="Save Custom Design"
                  onPress={handleSaveCustomization}
                  style={styles.saveCustomizationBtn}
                />
              </View>
            </GlassBox>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F2',
  },
  scrollContentStyle: {
    paddingBottom: 120,
  },
  carouselContainer: {
    width: width,
    height: height * 0.46,
    backgroundColor: '#FFF0EA',
  },
  carouselImage: {
    width: width,
    height: '100%',
  },
  indicatorsWrapper: {
    position: 'absolute',
    bottom: 24,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    gap: 6,
  },
  indicatorDot: {
    height: 6,
    width: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  indicatorDotActive: {
    backgroundColor: '#FFFFFF',
  },
  detailsCardBody: {
    backgroundColor: '#FFF8F2',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    marginTop: -30,
    paddingHorizontal: 24,
    paddingTop: 28,
  },
  headlineRow: {
    width: '100%',
    marginBottom: 20,
  },
  categoryLabelText: {
    fontFamily: 'Cairo-Bold',
    fontSize: 9,
    color: '#D4A373',
    letterSpacing: 2,
    marginBottom: 4,
  },
  titlePriceBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 16,
  },
  cakeTitleText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 26,
    color: '#2C1B18',
    flex: 1,
  },
  cakePriceText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 26,
    color: '#D4A373',
  },
  metaBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  ratingBadgePlate: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingBadgeVal: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 13,
    color: '#2C1B18',
  },
  ratingCountText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#8C7A77',
    marginLeft: 5,
  },
  metaDividerDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(140, 122, 119, 0.3)',
    marginHorizontal: 12,
  },
  prepHourBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prepBadgeLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#8C7A77',
  },
  gourmetDescriptionBox: {
    marginBottom: 20,
  },
  detailSectionHeading: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#2C1B18',
    marginBottom: 8,
  },
  descriptionNarrativeText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#8C7A77',
    lineHeight: 22,
    marginBottom: 16,
  },
  sensoryProfileBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderColor: 'rgba(212, 163, 115, 0.2)',
    borderWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    padding: 0,
  },
  sensoryProfileLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#8C7A77',
  },
  craftsmanshipBox: {
    marginBottom: 22,
  },
  craftsmanshipBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 18,
    backgroundColor: 'rgba(212, 163, 115, 0.1)',
  },
  craftsmanshipBannerText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 11,
    color: '#D4A373',
    flex: 1,
  },
  ingredientsContainerBlock: {
    marginBottom: 22,
  },
  ingredientsGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 4,
  },
  ingredientCardCell: {
    width: (width - 58) / 2,
    borderRadius: 20,
    overflow: 'hidden',
  },
  ingredientGlassCard: {
    borderRadius: 20,
    padding: 14,
    borderColor: 'rgba(232, 211, 194, 0.35)',
    borderWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    alignItems: 'center',
  },
  ingredientEmoji: {
    fontSize: 22,
    marginBottom: 6,
  },
  ingredientTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#2C1B18',
    textAlign: 'center',
  },
  ingredientOriginLabel: {
    fontFamily: 'Cairo-Bold',
    fontSize: 8,
    color: '#D4A373',
    letterSpacing: 1,
    marginTop: 2,
    textAlign: 'center',
  },
  testimonialsBlock: {
    marginBottom: 10,
  },
  reviewsScrollContent: {
    gap: 12,
    paddingRight: 24,
    paddingTop: 4,
  },
  testimonialGlassCard: {
    width: 260,
    borderRadius: 20,
    padding: 16,
    borderColor: 'rgba(232, 211, 194, 0.3)',
    borderWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  testimonialStarsRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  testimonialCommentText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#8C7A77',
    lineHeight: 18,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  testimonialAuthorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  testimonialAuthorName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 11,
    color: '#2C1B18',
  },
  testimonialDateLabel: {
    fontFamily: 'Cairo-Medium',
    fontSize: 8,
    color: '#8C7A77',
    opacity: 0.6,
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  floatingHeaderCircleBtn: {
    borderRadius: 22,
    overflow: 'hidden',
  },
  headerBtnIconGlass: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderWidth: 1.2,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
  },
  stickyBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(232, 211, 194, 0.3)',
    paddingHorizontal: 24,
    paddingTop: 14,
  },
  bottomRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  quantityPickerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'rgba(212, 163, 115, 0.3)',
    borderWidth: 1.2,
    borderRadius: 24,
    height: 48,
    paddingHorizontal: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  quantityMathBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityValueLabel: {
    fontFamily: 'Poppins-Bold',
    fontSize: 15,
    color: '#2C1B18',
    paddingHorizontal: 12,
    minWidth: 32,
    textAlign: 'center',
  },
  btnCTAsWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  customizeTouchBtn: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  customizeBtnGlass: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'rgba(212, 163, 115, 0.35)',
    borderWidth: 1.2,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    padding: 0,
  },
  addCartSolidBtn: {
    flex: 1,
    height: 48,
  },
  modalBackdropOverlay: {
    flex: 1,
    backgroundColor: 'rgba(61, 44, 41, 0.45)',
    justifyContent: 'flex-end',
  },
  customizerSheetCard: {
    width: '100%',
    maxHeight: height * 0.82,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    overflow: 'hidden',
  },
  customizerModalInnerGlass: {
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderWidth: 0,
    paddingHorizontal: 28,
    paddingTop: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 25,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
  },
  customizerModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(232, 211, 194, 0.4)',
  },
  modalHeaderAccentBar: {
    width: 36,
    height: 4.5,
    borderRadius: 2.5,
    backgroundColor: 'rgba(140, 122, 119, 0.25)',
    position: 'absolute',
    left: (width - 36) / 2,
    top: 14,
  },
  customizerTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: '#2C1B18',
    marginTop: 4,
  },
  customizerCloseBtn: {
    padding: 6,
  },
  customizerSectionHeader: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 15,
    color: '#2C1B18',
    marginTop: 22,
    marginBottom: 12,
  },
  customizerSelectorRow: {
    flexDirection: 'row',
    gap: 8,
  },
  customizerSelectionTouch: {
    flex: 1,
    borderRadius: 18,
    overflow: 'hidden',
  },
  customizerSelectionGlass: {
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderColor: 'rgba(232, 211, 194, 0.4)',
    borderWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  customOptionMainLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#8C7A77',
  },
  customOptionSubLabel: {
    fontFamily: 'Cairo-Bold',
    fontSize: 9,
    color: '#D4A373',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  checkBoxRowItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 4,
  },
  customCheckBox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: 'rgba(212, 163, 115, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  customCheckBoxActive: {
    borderColor: '#D4A373',
    backgroundColor: '#D4A373',
  },
  checkBoxMainText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: '#8C7A77',
  },
  checkBoxSubText: {
    fontFamily: 'Cairo-Medium',
    fontSize: 9,
    color: '#8C7A77',
    opacity: 0.7,
    marginTop: 1,
  },
  studiosInputWrapper: {
    borderRadius: 16,
    borderColor: 'rgba(232, 211, 194, 0.45)',
    borderWidth: 1.2,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    paddingHorizontal: 16,
    height: 52,
    justifyContent: 'center',
    padding: 0,
  },
  studiosInputField: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: '#2C1B18',
    height: '100%',
    padding: 0,
  },
  studiosInputTip: {
    fontFamily: 'Cairo-Medium',
    fontSize: 9,
    color: '#8C7A77',
    opacity: 0.8,
    marginTop: 6,
  },
  customizerFooter: {
    marginTop: 35,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(232, 211, 194, 0.4)',
    paddingTop: 20,
  },
  saveCustomizationBtn: {
    width: '100%',
  }
});
