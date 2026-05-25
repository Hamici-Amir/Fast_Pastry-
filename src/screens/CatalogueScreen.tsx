import React, { useState, useMemo, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  Dimensions, 
  Modal, 
  ScrollView, 
  Pressable, 
  Platform,
  ActivityIndicator
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  Search, 
  SlidersHorizontal, 
  Heart, 
  Star, 
  X, 
  Sparkles, 
  Check,
  ShoppingBag,
  Eye
} from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming, 
  Easing,
  FadeInDown,
  Layout
} from 'react-native-reanimated';
import { theme } from '../theme';
import { GlassBox } from '../components/ui/GlassBox';
import { Button } from '../components/ui/Button';

const { width, height } = Dimensions.get('window');

// Premium Mock Data
interface CakeItem {
  id: string;
  title: string;
  description: string;
  price: number;
  rating: number;
  reviewsCount: number;
  image: string;
  category: 'Signature' | 'Custom Cakes' | 'Pastries' | 'Vegan';
  flavor: 'Raspberry-Rose' | 'Chocolate' | 'Pistachio-Matcha' | 'Salted Caramel' | 'Vanilla';
  event: 'Wedding' | 'Birthday' | 'Anniversary' | 'High Tea' | 'Celebration';
  isPopular?: boolean;
}

const PREMIUM_CAKES: CakeItem[] = [
  {
    id: '1',
    title: "L'Amour Rose",
    description: "A masterpiece of organic raspberry purée, whipped white chocolate rosewater ganache, and soft almond sponge biscuit, crowned with edible 24k gold leaf.",
    price: 120.00,
    rating: 4.9,
    reviewsCount: 148,
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=400&auto=format&fit=crop",
    category: 'Signature',
    flavor: 'Raspberry-Rose',
    event: 'Anniversary',
    isPopular: true
  },
  {
    id: '2',
    title: "Le Chocolat Royale",
    description: "Decadent layers of 70% Single-Origin Valrhona dark chocolate cremeux, light cocoa-infused sponge, and salted hazelnut caramel praline crunch.",
    price: 95.00,
    rating: 4.8,
    reviewsCount: 92,
    image: "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?q=80&w=400&auto=format&fit=crop",
    category: 'Signature',
    flavor: 'Chocolate',
    event: 'Birthday',
    isPopular: true
  },
  {
    id: '3',
    title: "Pistachio Matcha Bliss",
    description: "Ceremonial-grade Japanese Uji Matcha mousse layers coupled with a Sicilian pistachio sponge, finished with dry rose petals and white chocolate velvet spray.",
    price: 110.00,
    rating: 4.7,
    reviewsCount: 76,
    image: "https://images.unsplash.com/photo-1535141192574-5d4897c13636?q=80&w=400&auto=format&fit=crop",
    category: 'Custom Cakes',
    flavor: 'Pistachio-Matcha',
    event: 'High Tea'
  },
  {
    id: '4',
    title: "Golden Salted Caramel",
    description: "Rich brown sugar sponge layered with sea salt fleur-de-sel caramel ganache, light caramelized pecans, and delicate gold leaf brushing.",
    price: 85.00,
    rating: 4.9,
    reviewsCount: 210,
    image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?q=80&w=400&auto=format&fit=crop",
    category: 'Signature',
    flavor: 'Salted Caramel',
    event: 'Celebration',
    isPopular: true
  },
  {
    id: '5',
    title: "Le Rêve de Vanille",
    description: "Double-origin Tahitian vanilla bean sponge, rich whipped white chocolate vanilla bean whipped cream, and wild strawberry gelée inserts.",
    price: 75.00,
    rating: 4.6,
    reviewsCount: 64,
    image: "https://images.unsplash.com/photo-1519869325930-281384150729?q=80&w=400&auto=format&fit=crop",
    category: 'Pastries',
    flavor: 'Vanilla',
    event: 'Celebration'
  },
  {
    id: '6',
    title: "Vegan Raspberry Opera",
    description: "A 100% plant-based delicacy of organic almond meal layers, fresh raspberries, light espresso syrup, and rich organic dark chocolate ganache glaze.",
    price: 89.00,
    rating: 4.8,
    reviewsCount: 85,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=400&auto=format&fit=crop",
    category: 'Vegan',
    flavor: 'Raspberry-Rose',
    event: 'Birthday'
  },
  {
    id: '7',
    title: "Orchid Wedding Signature",
    description: "Multi-tiered masterpiece containing delicate lemon curd, elderflower-infused organic sponge, and decorated with magnificent handmade sugar orchid flowers.",
    price: 280.00,
    rating: 5.0,
    reviewsCount: 42,
    image: "https://images.unsplash.com/photo-1535254973040-607b474cb50d?q=80&w=400&auto=format&fit=crop",
    category: 'Custom Cakes',
    flavor: 'Vanilla',
    event: 'Wedding'
  },
  {
    id: '8',
    title: "Praline Choux Tower",
    description: "A spectacular arrangement of fresh organic cream puffs filled with praline creme patissiere, piled in a majestic tower and wrapped in gold caramel threading.",
    price: 65.00,
    rating: 4.9,
    reviewsCount: 53,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=400&auto=format&fit=crop",
    category: 'Pastries',
    flavor: 'Chocolate',
    event: 'High Tea'
  }
];

const CATEGORIES = ['All', 'Signature', 'Custom Cakes', 'Pastries', 'Vegan'];
const FLAVORS = ['All', 'Chocolate', 'Raspberry-Rose', 'Pistachio-Matcha', 'Salted Caramel', 'Vanilla'];
const EVENTS = ['All', 'Wedding', 'Birthday', 'Anniversary', 'High Tea', 'Celebration'];
const PRICE_RANGES = [
  { label: 'All Prices', min: 0, max: 1000 },
  { label: 'Under $90', min: 0, max: 90 },
  { label: '$90 - $150', min: 90, max: 150 },
  { label: '$150+', min: 150, max: 1000 },
];

import { AppHeader } from '../components/common/AppHeader';

export const CatalogueScreen = () => {
  const insets = useSafeAreaInsets();
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedFlavor, setSelectedFlavor] = useState('All');
  const [selectedEvent, setSelectedEvent] = useState('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState(PRICE_RANGES[0]);
  
  // Modals Visibility
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [activePreviewCake, setActivePreviewCake] = useState<CakeItem | null>(null);
  
  // Customization in Preview
  const [selectedSize, setSelectedSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [customWriting, setCustomWriting] = useState('');
  const [addToCartLoading, setAddToCartLoading] = useState(false);
  
  // Favorites list state
  const [favorites, setFavorites] = useState<string[]>(['1', '4']); // default favorites

  // Filter Logic
  const filteredCakes = useMemo(() => {
    return PREMIUM_CAKES.filter(cake => {
      const matchesSearch = cake.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            cake.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'All' || cake.category === selectedCategory;
      const matchesFlavor = selectedFlavor === 'All' || cake.flavor === selectedFlavor;
      const matchesEvent = selectedEvent === 'All' || cake.event === selectedEvent;
      const matchesPrice = cake.price >= selectedPriceRange.min && cake.price <= selectedPriceRange.max;
      
      return matchesSearch && matchesCategory && matchesFlavor && matchesEvent && matchesPrice;
    });
  }, [searchQuery, selectedCategory, selectedFlavor, selectedEvent, selectedPriceRange]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleOpenPreview = (cake: CakeItem) => {
    setActivePreviewCake(cake);
    setSelectedSize('md');
    setCustomWriting('');
    setPreviewModalVisible(true);
  };

  const handleAddToCart = () => {
    setAddToCartLoading(true);
    setTimeout(() => {
      setAddToCartLoading(false);
      setPreviewModalVisible(false);
      // Simulating a luxury toast or callback
    }, 1800);
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSelectedFlavor('All');
    setSelectedEvent('All');
    setSelectedPriceRange(PRICE_RANGES[0]);
    setFilterModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Universal Modern Header */}
      <AppHeader 
        title="Catalogue"
        subtitle="Exclusive Collection"
        showSearch
        searchPlaceholder="Find your perfect cake..."
        onSearchChange={setSearchQuery}
        rightContent={
          <TouchableOpacity 
            onPress={() => setFilterModalVisible(true)}
            className="w-11 h-11 items-center justify-center rounded-2xl bg-white/80 border border-[#D4A373]/20 shadow-sm mr-3 relative"
          >
            <SlidersHorizontal size={20} color="#2C1B18" strokeWidth={1.8} />
            {(selectedFlavor !== 'All' || selectedEvent !== 'All' || selectedPriceRange !== PRICE_RANGES[0]) && (
              <View className="absolute top-3 right-3 w-2.5 h-2.5 bg-[#D4A373] rounded-full border-2 border-white" />
            )}
          </TouchableOpacity>
        }
      />

      {/* Main Content Area */}
      <View style={{ flex: 1 }}>
        {/* Horizontal Category Pill Selector */}
        <View style={styles.categoriesOuterWrap}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContentStyle}
          >
            {CATEGORIES.map((category) => {
              const isActive = category === selectedCategory;
              return (
                <TouchableOpacity 
                  key={category} 
                  onPress={() => setSelectedCategory(category)}
                  activeOpacity={0.8}
                  style={styles.categoryPillContainer}
                >
                  <GlassBox 
                    intensity={isActive ? 80 : 25} 
                    style={[
                      styles.categoryGlassPill,
                      isActive && { borderColor: 'rgba(212, 163, 115, 0.45)', backgroundColor: 'rgba(255, 255, 255, 0.8)' }
                    ]}
                  >
                    <Text style={[
                      styles.categoryPillText,
                      isActive && styles.categoryPillTextActive
                    ]}>
                      {category}
                    </Text>
                  </GlassBox>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Premium Cake Grid */}
        {filteredCakes.length > 0 ? (
          <Animated.FlatList 
            data={filteredCakes}
            numColumns={2}
            keyExtractor={(item) => item.id}
            itemLayoutAnimation={Layout.springify().damping(15)}
            contentContainerStyle={[
              styles.gridScrollContent, 
              { paddingBottom: Math.max(insets.bottom + 20, 40) }
            ]}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={styles.gridColumnWrapper}
            renderItem={({ item, index }) => (
              <Animated.View entering={FadeInDown.duration(600).delay(index * 100).springify().damping(12)}>
                <CakeCard 
                  item={item} 
                  index={index}
                  isFav={favorites.includes(item.id)}
                  onFavToggle={() => toggleFavorite(item.id)}
                  onOpenPreview={() => handleOpenPreview(item)}
                />
              </Animated.View>
            )}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyMainText}>No Creations Found</Text>
            <Text style={styles.emptySubText}>We couldn't find any cakes matching your current filters. Try refining your selections.</Text>
            <Button 
              title="Clear All Filters" 
              variant="outline" 
              size="sm"
              onPress={handleResetFilters}
              style={styles.emptyResetBtn}
            />
          </View>
        )}
      </View>

      {/* Expanded Glassmorphic Filter Drawer Modal */}
      <Modal
        visible={filterModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <Pressable 
          style={styles.modalBackdropOverlay} 
          onPress={() => setFilterModalVisible(false)}
        >
          <Pressable style={styles.filterModalCard} pointerEvents="auto">
            <GlassBox intensity={95} style={styles.filterModalInnerGlass}>
              {/* Modal Header */}
              <View style={styles.modalHeaderRow}>
                <Text style={styles.modalTitleText}>Refine Selection</Text>
                <TouchableOpacity onPress={() => setFilterModalVisible(false)} style={styles.modalCloseBtn}>
                  <X size={20} color={theme.colors.text} />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, marginTop: 10 }}>
                {/* Flavor Category */}
                <Text style={styles.filterSectionTitle}>Flavors</Text>
                <View style={styles.filterOptionsGrid}>
                  {FLAVORS.map(flavor => {
                    const isSelected = selectedFlavor === flavor;
                    return (
                      <TouchableOpacity 
                        key={flavor} 
                        style={styles.filterOptionItem}
                        onPress={() => setSelectedFlavor(flavor)}
                      >
                        <GlassBox 
                          intensity={isSelected ? 60 : 20} 
                          style={[
                            styles.filterPillElement,
                            isSelected && { borderColor: theme.colors.secondary }
                          ]}
                        >
                          <Text style={[styles.filterPillLabelText, isSelected && { color: theme.colors.secondary, fontFamily: 'Poppins-SemiBold' }]}>
                            {flavor}
                          </Text>
                        </GlassBox>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Event Category */}
                <Text style={styles.filterSectionTitle}>Occasions</Text>
                <View style={styles.filterOptionsGrid}>
                  {EVENTS.map(event => {
                    const isSelected = selectedEvent === event;
                    return (
                      <TouchableOpacity 
                        key={event} 
                        style={styles.filterOptionItem}
                        onPress={() => setSelectedEvent(event)}
                      >
                        <GlassBox 
                          intensity={isSelected ? 60 : 20} 
                          style={[
                            styles.filterPillElement,
                            isSelected && { borderColor: theme.colors.secondary }
                          ]}
                        >
                          <Text style={[styles.filterPillLabelText, isSelected && { color: theme.colors.secondary, fontFamily: 'Poppins-SemiBold' }]}>
                            {event}
                          </Text>
                        </GlassBox>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Price Ranges */}
                <Text style={styles.filterSectionTitle}>Investment Range</Text>
                <View style={styles.priceRangesColumn}>
                  {PRICE_RANGES.map(range => {
                    const isSelected = selectedPriceRange.label === range.label;
                    return (
                      <TouchableOpacity 
                        key={range.label} 
                        style={styles.priceRowItem}
                        onPress={() => setSelectedPriceRange(range)}
                      >
                        <View style={[styles.customRadioBtn, isSelected && styles.customRadioBtnActive]}>
                          {isSelected && <View style={styles.radioDotInner} />}
                        </View>
                        <Text style={[styles.priceRowTextLabel, isSelected && { fontFamily: 'Poppins-Medium', color: theme.colors.text }]}>
                          {range.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </ScrollView>

              {/* Action Buttons */}
              <View style={styles.modalActionButtonsRow}>
                <TouchableOpacity onPress={handleResetFilters} style={styles.modalResetActionBtn}>
                  <Text style={styles.modalResetBtnText}>Reset</Text>
                </TouchableOpacity>
                <Button 
                  title="Apply Selection" 
                  onPress={() => setFilterModalVisible(false)}
                  style={styles.modalApplyButton}
                />
              </View>
            </GlassBox>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Luxury Quick Preview Drawer Modal */}
      {activePreviewCake && (
        <Modal
          visible={previewModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setPreviewModalVisible(false)}
        >
          <Pressable 
            style={styles.modalBackdropOverlay} 
            onPress={() => setPreviewModalVisible(false)}
          >
            <Pressable style={styles.previewDrawerCard} pointerEvents="auto">
              <GlassBox intensity={98} style={styles.previewModalInnerGlass}>
                {/* Closing Header */}
                <View style={styles.previewModalHeader}>
                  <View style={styles.modalHeaderAccentBar} />
                  <TouchableOpacity onPress={() => setPreviewModalVisible(false)} style={styles.previewCloseBtnContainer}>
                    <X size={20} color={theme.colors.text} />
                  </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.previewScrollContent}>
                  {/* Large High-Res Image Showcase */}
                  <View style={styles.previewImageFrameOuter}>
                    <Image 
                      source={{ uri: activePreviewCake.image }} 
                      style={styles.previewFeaturedImage} 
                      contentFit="cover"
                      transition={600}
                    />
                    <GlassBox intensity={60} style={styles.imageFloatingCategoryBadge}>
                      <Text style={styles.floatingBadgeText}>{activePreviewCake.category}</Text>
                    </GlassBox>
                  </View>

                  {/* Title & Core Meta */}
                  <View style={styles.previewProductHeadlineWrap}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.previewCakeTitleText}>{activePreviewCake.title}</Text>
                      <View style={styles.previewRatingRow}>
                        <Star size={14} color="#D4A373" fill="#D4A373" />
                        <Text style={styles.previewRatingValue}>{activePreviewCake.rating}</Text>
                        <Text style={styles.previewReviewCount}>({activePreviewCake.reviewsCount} organic reviews)</Text>
                      </View>
                    </View>
                    <Text style={styles.previewProductPriceText}>
                      ${activePreviewCake.price.toFixed(2)}
                    </Text>
                  </View>

                  {/* Divider Line */}
                  <View style={styles.previewModalSectionDivider} />

                  {/* Gourmet Narrative */}
                  <Text style={styles.previewSectionHeading}>Sensory Profile</Text>
                  <Text style={styles.previewDescriptionText}>
                    {activePreviewCake.description}
                  </Text>

                  {/* Customizable Sizing */}
                  <Text style={styles.previewSectionHeading}>Gourmet Size Selection</Text>
                  <View style={styles.sizingOptionsContainer}>
                    {[
                      { key: 'sm', label: 'Petite (6")', desc: 'Serves 4 - 6' },
                      { key: 'md', label: 'Signature (8")', desc: 'Serves 8 - 12' },
                      { key: 'lg', label: 'Grand (10")', desc: 'Serves 15 - 20' }
                    ].map(size => {
                      const isChosen = selectedSize === size.key;
                      return (
                        <TouchableOpacity 
                          key={size.key}
                          style={styles.sizeTouchOption}
                          onPress={() => setSelectedSize(size.key as any)}
                        >
                          <GlassBox 
                            intensity={isChosen ? 75 : 20} 
                            style={[
                              styles.sizeOptionGlassBox,
                              isChosen && { borderColor: theme.colors.secondary, backgroundColor: 'rgba(255, 255, 255, 0.7)' }
                            ]}
                          >
                            <Text style={[styles.sizeOptionLabelTitle, isChosen && { fontFamily: 'Poppins-SemiBold', color: theme.colors.text }]}>
                              {size.label}
                            </Text>
                            <Text style={styles.sizeOptionDescSub}>{size.desc}</Text>
                          </GlassBox>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  {/* Custom Inscription */}
                  <Text style={styles.previewSectionHeading}>Gold-Leaf Custom Calligraphy</Text>
                  <GlassBox intensity={30} style={styles.inscriptionInputWrapper}>
                    <TextInput 
                      placeholder="E.g., Joyeux Anniversaire, Laurent..."
                      placeholderTextColor="rgba(140, 122, 119, 0.45)"
                      value={customWriting}
                      onChangeText={setCustomWriting}
                      maxLength={40}
                      style={styles.calligraphyInputField}
                    />
                  </GlassBox>
                  <Text style={styles.inscriptionCharacterLimit}>Max 40 luxury characters. Hand-piped in dark cacao.</Text>
                </ScrollView>

                {/* Bottom Add To Cart Execution Bar */}
                <View style={[styles.executionBarContainer, { paddingBottom: Math.max(insets.bottom, 15) }]}>
                  <Button 
                    title={addToCartLoading ? "Adding to Vault..." : `Curate Creation - $${(activePreviewCake.price + (selectedSize === 'sm' ? -15 : selectedSize === 'lg' ? 45 : 0)).toFixed(2)}`}
                    leftIcon={<ShoppingBag size={20} color="#FFFFFF" strokeWidth={1.8} />}
                    loading={addToCartLoading}
                    onPress={handleAddToCart}
                    style={styles.addToCartExecutionBtn}
                  />
                </View>
              </GlassBox>
            </Pressable>
          </Pressable>
        </Modal>
      )}
    </View>
  );
};

// Internal Individual CakeCard Component with Spring Bounce Favorite animations
interface CakeCardProps {
  item: CakeItem;
  index: number;
  isFav: boolean;
  onFavToggle: () => void;
  onOpenPreview: () => void;
}

const CakeCard: React.FC<CakeCardProps> = ({ item, index, isFav, onFavToggle, onOpenPreview }) => {
  const router = useRouter();
  const heartScale = useSharedValue(1);

  const handleFavPress = (e: any) => {
    e.stopPropagation();
    onFavToggle();
    heartScale.value = withSpring(1.4, { damping: 5, stiffness: 200 }, () => {
      heartScale.value = withSpring(1);
    });
  };

  const animStyleHeart = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }]
  }));

  return (
    <Pressable style={styles.cardOuterCell} onPress={() => router.push(`/cake/${item.id}` as any)}>
      <GlassBox intensity={35} style={styles.cardContainerGlass}>
        {/* Image Showcase Frame */}
        <View style={styles.cardImageContainer}>
          <Image 
            source={{ uri: item.image }} 
            style={styles.cardImage} 
            contentFit="cover"
            transition={500}
          />
          
          {/* Floating Rating Badge */}
          <GlassBox intensity={70} style={styles.cardFloatingRatingPlate}>
            <Star size={10} color="#D4A373" fill="#D4A373" style={{ marginRight: 3 }} />
            <Text style={styles.cardRatingValueText}>{item.rating}</Text>
          </GlassBox>

          {/* Premium Floating Favorite Circle */}
          <TouchableOpacity 
            onPress={handleFavPress} 
            activeOpacity={0.8}
            style={styles.favoriteButtonCircle}
          >
            <Animated.View style={animStyleHeart}>
              <Heart 
                size={16} 
                color={isFav ? '#E06D6D' : 'rgba(44, 27, 24, 0.6)'} 
                fill={isFav ? '#E06D6D' : 'transparent'} 
                strokeWidth={1.8}
              />
            </Animated.View>
          </TouchableOpacity>
        </View>

        {/* Content Meta Text Block */}
        <View style={styles.cardMetaBlock}>
          <Text style={styles.cardCategoryLabel}>{item.category.toUpperCase()}</Text>
          <Text style={styles.cardCakeTitle} numberOfLines={1}>{item.title}</Text>
          
          {/* Bottom row with price and quick preview */}
          <View style={styles.cardBottomRow}>
            <Text style={styles.cardPriceLabel}>${item.price.toFixed(2)}</Text>
            <TouchableOpacity 
              onPress={(e) => {
                e.stopPropagation();
                onOpenPreview();
              }}
              style={styles.quickEyeButton}
            >
              <Eye size={16} color={theme.colors.secondary} strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </View>
      </GlassBox>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F2',
  },
  headerContainer: {
    paddingHorizontal: 24,
    paddingBottom: 15,
    backgroundColor: 'rgba(255, 248, 242, 0.95)',
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(232, 211, 194, 0.4)',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 10,
  },
  pageHeaderTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    color: '#2C1B18',
    letterSpacing: 0.5,
  },
  headerIndicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D4A373',
    marginLeft: 8,
    alignSelf: 'flex-end',
    marginBottom: 8,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchBoxWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderRadius: 26,
    paddingHorizontal: 16,
    borderColor: 'rgba(232, 211, 194, 0.45)',
    borderWidth: 1.2,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    padding: 0,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInputField: {
    flex: 1,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#2C1B18',
    height: '100%',
    padding: 0,
  },
  clearSearchBtn: {
    padding: 6,
  },
  filterBtnIconWrapper: {
    borderRadius: 26,
    overflow: 'hidden',
  },
  filterIconGlass: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    borderColor: 'rgba(232, 211, 194, 0.45)',
    borderWidth: 1.2,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  activeFilterAlertBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D4A373',
    borderColor: '#FFF8F2',
    borderWidth: 1,
  },
  categoriesOuterWrap: {
    height: 64,
    marginTop: 10,
    justifyContent: 'center',
  },
  categoriesContentStyle: {
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 10,
  },
  categoryPillContainer: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  categoryGlassPill: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderColor: 'rgba(232, 211, 194, 0.3)',
    borderWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    padding: 0,
  },
  categoryPillText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
    color: '#8C7A77',
  },
  categoryPillTextActive: {
    fontFamily: 'Poppins-SemiBold',
    color: '#2C1B18',
  },
  gridScrollContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
    flexGrow: 1,
  },
  gridColumnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardOuterCell: {
    width: (width - 44) / 2,
    borderRadius: 24,
    overflow: 'hidden',
  },
  cardContainerGlass: {
    borderRadius: 24,
    padding: 10,
    borderColor: 'rgba(212, 163, 115, 0.22)',
    borderWidth: 1.2,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
  },
  cardImageContainer: {
    width: '100%',
    aspectRatio: 1.05,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#FFF0EA',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardFloatingRatingPlate: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    borderWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    padding: 0,
  },
  cardRatingValueText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 9,
    color: '#2C1B18',
  },
  favoriteButtonCircle: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#D4A373',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardMetaBlock: {
    marginTop: 10,
    paddingHorizontal: 4,
  },
  cardCategoryLabel: {
    fontFamily: 'Cairo-Bold',
    fontSize: 8,
    color: '#D4A373',
    letterSpacing: 1.5,
  },
  cardCakeTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: '#2C1B18',
    marginTop: 2,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  cardPriceLabel: {
    fontFamily: 'Poppins-Bold',
    fontSize: 15,
    color: '#D4A373',
  },
  quickEyeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(212, 163, 115, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginTop: 80,
  },
  emptyMainText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#2C1B18',
    textAlign: 'center',
  },
  emptySubText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: '#8C7A77',
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 8,
  },
  emptyResetBtn: {
    marginTop: 20,
    minWidth: 160,
  },
  modalBackdropOverlay: {
    flex: 1,
    backgroundColor: 'rgba(61, 44, 41, 0.45)',
    justifyContent: 'flex-end',
  },
  filterModalCard: {
    width: '100%',
    maxHeight: height * 0.8,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    overflow: 'hidden',
  },
  filterModalInnerGlass: {
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderWidth: 0,
    borderColor: 'transparent',
    paddingHorizontal: 28,
    paddingTop: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 25,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(232, 211, 194, 0.4)',
  },
  modalTitleText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: '#2C1B18',
  },
  modalCloseBtn: {
    padding: 6,
  },
  filterSectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 15,
    color: '#2C1B18',
    marginTop: 20,
    marginBottom: 12,
  },
  filterOptionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterOptionItem: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  filterPillElement: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 16,
    borderColor: 'rgba(232, 211, 194, 0.4)',
    borderWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    padding: 0,
  },
  filterPillLabelText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#8C7A77',
  },
  priceRangesColumn: {
    gap: 12,
  },
  priceRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  customRadioBtn: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(212, 163, 115, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  customRadioBtnActive: {
    borderColor: '#D4A373',
  },
  radioDotInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#D4A373',
  },
  priceRowTextLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#8C7A77',
  },
  modalActionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 35,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(232, 211, 194, 0.4)',
    paddingTop: 20,
  },
  modalResetActionBtn: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  modalResetBtnText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 15,
    color: '#8C7A77',
  },
  modalApplyButton: {
    flex: 1,
  },
  previewDrawerCard: {
    width: '100%',
    height: height * 0.9,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    overflow: 'hidden',
  },
  previewModalInnerGlass: {
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderWidth: 0,
    padding: 0,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
  },
  previewModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingTop: 16,
    paddingBottom: 10,
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
  previewCloseBtnContainer: {
    padding: 6,
    marginLeft: 'auto',
  },
  previewScrollContent: {
    paddingHorizontal: 28,
    paddingBottom: 130,
  },
  previewImageFrameOuter: {
    width: '100%',
    aspectRatio: 1.15,
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: '#FFF0EA',
    marginTop: 10,
    shadowColor: '#D4A373',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  previewFeaturedImage: {
    width: '100%',
    height: '100%',
  },
  imageFloatingCategoryBadge: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    borderWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    padding: 0,
  },
  floatingBadgeText: {
    fontFamily: 'Cairo-Bold',
    fontSize: 9,
    color: '#D4A373',
    letterSpacing: 1.5,
  },
  previewProductHeadlineWrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 22,
    gap: 16,
  },
  previewCakeTitleText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#2C1B18',
  },
  previewRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  previewRatingValue: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 13,
    color: '#2C1B18',
    marginLeft: 5,
  },
  previewReviewCount: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#8C7A77',
    marginLeft: 6,
  },
  previewProductPriceText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 26,
    color: '#D4A373',
  },
  previewModalSectionDivider: {
    height: 0.5,
    backgroundColor: 'rgba(232, 211, 194, 0.4)',
    marginVertical: 20,
  },
  previewSectionHeading: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 15,
    color: '#2C1B18',
    marginBottom: 8,
  },
  previewDescriptionText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#8C7A77',
    lineHeight: 22,
    marginBottom: 20,
  },
  sizingOptionsContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 22,
  },
  sizeTouchOption: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  sizeOptionGlassBox: {
    borderRadius: 20,
    padding: 12,
    borderColor: 'rgba(232, 211, 194, 0.4)',
    borderWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    minHeight: 68,
    justifyContent: 'center',
  },
  sizeOptionLabelTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#8C7A77',
    textAlign: 'center',
  },
  sizeOptionDescSub: {
    fontFamily: 'Cairo-Medium',
    fontSize: 9,
    color: '#8C7A77',
    opacity: 0.7,
    marginTop: 2,
    textAlign: 'center',
  },
  inscriptionInputWrapper: {
    borderRadius: 16,
    borderColor: 'rgba(232, 211, 194, 0.45)',
    borderWidth: 1.2,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    paddingHorizontal: 16,
    height: 52,
    justifyContent: 'center',
    padding: 0,
  },
  calligraphyInputField: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: '#2C1B18',
    height: '100%',
    padding: 0,
  },
  inscriptionCharacterLimit: {
    fontFamily: 'Cairo-Medium',
    fontSize: 9,
    color: '#8C7A77',
    opacity: 0.8,
    marginTop: 6,
    letterSpacing: 0.3,
  },
  executionBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    paddingHorizontal: 28,
    paddingTop: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(232, 211, 194, 0.3)',
  },
  addToCartExecutionBtn: {
    width: '100%',
  }
});
