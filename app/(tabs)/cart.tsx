import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Dimensions, 
  Platform, 
  Alert,
  ActivityIndicator
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  MapPin, 
  Truck, 
  Award, 
  ChevronRight, 
  Clock, 
  Gift, 
  Check, 
  X, 
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react-native';
import { theme } from '../../src/theme';
import { GlassBox } from '../../src/components/ui/GlassBox';
import { Button } from '../../src/components/ui/Button';
import { AppHeader } from '../../src/components/common/AppHeader';

const { width, height } = Dimensions.get('window');

// Miniature Cake Symbol Component rendering the tier stack dynamically
const MiniCakeSymbol = ({ 
  tiersCount, 
  colorHex, 
  hasMacarons, 
  hasBerries 
}: { 
  tiersCount: number; 
  colorHex: string; 
  hasMacarons: boolean; 
  hasBerries: boolean; 
}) => {
  return (
    <View style={styles.miniCakeContainer}>
      {/* Silver cake stand */}
      <View style={styles.miniCakeStandPlate} />
      <View style={styles.miniCakeStandStem} />
      
      {/* Stack of Tiers */}
      <View style={styles.miniCakeStack}>
        {/* Bottom Tier (Always Present) */}
        <View style={[styles.miniCakeTierBase, { backgroundColor: colorHex }]}>
          {hasBerries && <View style={[styles.miniBerry, { left: 4, bottom: 2 }]} />}
          {hasBerries && <View style={[styles.miniBerry, { right: 4, bottom: 2 }]} />}
        </View>
        
        {/* Middle Tier */}
        {tiersCount >= 2 && (
          <View style={[styles.miniCakeTierMiddle, { backgroundColor: colorHex }]}>
            {hasMacarons && <View style={[styles.miniMacaron, { left: 3, bottom: 1 }]} />}
            {hasMacarons && <View style={[styles.miniMacaron, { right: 3, bottom: 1 }]} />}
          </View>
        )}
        
        {/* Top Tier */}
        {tiersCount >= 3 && (
          <View style={[styles.miniCakeTierTop, { backgroundColor: colorHex }]}>
            <View style={styles.miniTopperSparkle} />
          </View>
        )}
      </View>
    </View>
  );
};

export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Shopping bag item states
  const [cartItems, setCartItems] = useState([
    {
      id: '1',
      title: 'Imperial Gold Opulence Cake ⚜️',
      price: 168.00,
      quantity: 1,
      tiersCount: 3,
      size: '3 Tiers (Grand 10" + 8" + 6")',
      flavor: 'Cacao Royale (70% Valrhona Ganache)',
      finish: 'Rustic Spatula Texture',
      piping: 'Imperial Gold Shells Border',
      toppings: ['macarons', 'goldLeaf'],
      toppingsList: 'Parisian Macarons, 24k Gold Leaf Flakes',
      topper: 'celebrate',
      topperLabel: 'Sparkly "Cheers" Gold Plaque',
      sugarPrint: false,
      giftingMode: false,
      giftCardMessage: '',
      colorHex: '#E8C39E'
    },
    {
      id: '2',
      title: 'Rosy Ispahan Secret Garden 🌸',
      price: 95.00,
      quantity: 2,
      tiersCount: 1,
      size: '1 Tier (Petite 6")',
      flavor: 'L\'Amour Rose (Raspberry Rosewater)',
      finish: 'Matte Velvet Shadow',
      piping: 'White Pearls Border',
      toppings: ['berries'],
      toppingsList: 'Wild Berries & Fruits',
      topper: 'birthday',
      topperLabel: 'Gold "HBD" Topper Plaque',
      sugarPrint: false,
      giftingMode: true,
      giftCardMessage: 'Joyeux Anniversaire, ma chérie! - Antoine',
      colorHex: '#FCE1DC'
    }
  ]);

  // Delivery configuration states
  const [deliveryMode, setDeliveryMode] = useState<'courier' | 'pickup'>('courier');
  const [pickupTime, setPickupTime] = useState('Tomorrow, 4:00 PM');
  
  // Promo code states
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState('');

  // Checkout execution state
  const [checkoutInProgress, setCheckoutInProgress] = useState(false);
  const [showSealModal, setShowSealModal] = useState(false);
  const [orderReference, setOrderReference] = useState('');

  // Calculations
  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }, [cartItems]);

  const deliveryFee = useMemo(() => {
    return deliveryMode === 'courier' ? 15.00 : 0.00;
  }, [deliveryMode]);

  const discountAmount = useMemo(() => {
    return subtotal * discountPercent;
  }, [subtotal, discountPercent]);

  const grandTotal = useMemo(() => {
    return Math.max(0, subtotal + deliveryFee - discountAmount);
  }, [subtotal, deliveryFee, discountAmount]);

  // State Adjusters
  const handleIncreaseQty = (id: string) => {
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item));
  };

  const handleDecreaseQty = (id: string) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        if (item.quantity > 1) {
          return { ...item, quantity: item.quantity - 1 };
        } else {
          Alert.alert(
            "Remove Creation",
            "Do you wish to remove this bespoke pastry creation from your bag?",
            [
              { text: "Cancel", style: "cancel" },
              { text: "Remove", style: "destructive", onPress: () => handleRemoveItem(id) }
            ]
          );
        }
      }
      return item;
    }));
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  // Promo code execution
  const applyPromoCode = () => {
    if (promoCodeInput.trim().toUpperCase() === 'HAUTEPASTRY') {
      setAppliedPromo('HAUTEPASTRY');
      setDiscountPercent(0.1); // 10% discount
      setPromoError('');
      setPromoCodeInput('');
      Alert.alert("Coupon Verified", "The Haute Pastry signature 10% discount has been applied to your basket.", [{ text: "Magnifique!" }]);
    } else {
      setPromoError('Non-applicable voucher. Try "HAUTEPASTRY".');
      setAppliedPromo(null);
      setDiscountPercent(0);
    }
  };

  const removeAppliedPromo = () => {
    setAppliedPromo(null);
    setDiscountPercent(0);
    setPromoError('');
  };

  // Checkout modal execution
  const handleCheckoutInitiation = () => {
    if (cartItems.length === 0) {
      Alert.alert("Bag is Empty", "Please add a gourmet pastry creation to your bag to check out.");
      return;
    }
    setCheckoutInProgress(true);
    setTimeout(() => {
      setCheckoutInProgress(false);
      router.push({ 
        pathname: '/checkout', 
        params: { 
          deliveryMode: deliveryMode,
          appliedPromo: appliedPromo || '',
          discountPercent: discountPercent.toString()
        } 
      } as any);
    }, 1200);
  };

  const handleConfirmOrderFinal = () => {
    setShowSealModal(false);
    setCartItems([]);
    removeAppliedPromo();
    Alert.alert(
      "Order Transmitted",
      `Order ${orderReference} is now active. Pastry chefs at Rue Royale have commenced preparation.`,
      [
        { text: "Gourmet Home", onPress: () => router.push('/catalogue' as any) }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Universal Modern Header */}
      <AppHeader 
        title="My Shopping Bag"
        subtitle="Boutique Fast Pastry"
        rightContent={
          <View className="w-11 h-11 items-center justify-center rounded-2xl bg-white/80 border border-[#D4A373]/20 shadow-sm mr-3">
            <ShoppingBag size={20} color="#D4A373" />
          </View>
        }
      />

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 290 }]}
      >
        {/* Main List Deck */}
        {cartItems.length > 0 ? (
          <View style={styles.itemsBlockList}>
            <Text style={styles.listSectionTitle}>Custom Creations ({cartItems.length})</Text>
            
            {cartItems.map((item) => (
              <GlassBox key={item.id} intensity={80} style={styles.cartCardItem}>
                <View style={styles.cardHeaderRow}>
                  {/* Miniature live visual representation of custom cake */}
                  <MiniCakeSymbol 
                    tiersCount={item.tiersCount} 
                    colorHex={item.colorHex}
                    hasMacarons={item.toppings.includes('macarons')}
                    hasBerries={item.toppings.includes('berries')}
                  />
                  
                  {/* Meta descriptions */}
                  <View style={styles.cardDetailsColumn}>
                    <Text style={styles.cardMainTitle} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.cardMetaSummary}>{item.size} • {item.flavor}</Text>
                    <Text style={styles.cardSurchargesText}>Frosting Finish: <Text style={{ color: '#2C1B18', fontFamily: 'Poppins-Medium' }}>{item.finish}</Text></Text>
                    
                    {item.toppingsList.length > 0 && (
                      <Text style={styles.cardSurchargesText}>Toppings: <Text style={{ color: '#2C1B18', fontFamily: 'Poppins-Medium' }}>{item.toppingsList}</Text></Text>
                    )}
                    
                    {item.topper !== 'none' && (
                      <Text style={styles.cardSurchargesText}>Topper: <Text style={{ color: '#D4A373', fontFamily: 'Poppins-Medium' }}>{item.topperLabel}</Text></Text>
                    )}

                    {item.giftingMode && (
                      <View style={styles.cardGiftIndicatorRow}>
                        <Gift size={11} color="#E06D6D" style={{ marginRight: 4 }} />
                        <Text style={styles.giftCardSubText} numberOfLines={1}>
                          Gift Cloche Card: "{item.giftCardMessage}"
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* Divider */}
                <View style={styles.cardHorizontalLine} />

                {/* Bottom Actions Row */}
                <View style={styles.cardBottomActionsRow}>
                  {/* Edit design simulation button */}
                  <TouchableOpacity 
                    style={styles.editDesignBtnTouch}
                    onPress={() => {
                      Alert.alert(
                        "Modify Design", 
                        "Return to the Configuration Studio to adjust this pastry recipe?",
                        [
                          { text: "Cancel", style: "cancel" },
                          { text: "Modify", onPress: () => router.push('/customizer' as any) }
                        ]
                      );
                    }}
                  >
                    <Sparkles size={13} color="#D4A373" style={{ marginRight: 4 }} />
                    <Text style={styles.editDesignText}>Edit Recipe</Text>
                  </TouchableOpacity>

                  {/* Quantity & Trash selectors */}
                  <View style={styles.qtyControlWidget}>
                    <TouchableOpacity 
                      style={styles.qtyAdjustBtn} 
                      onPress={() => handleDecreaseQty(item.id)}
                    >
                      {item.quantity === 1 ? (
                        <Trash2 size={13} color="#E06D6D" />
                      ) : (
                        <Minus size={13} color="#8C7A77" />
                      )}
                    </TouchableOpacity>
                    
                    <Text style={styles.qtyValueLabel}>{item.quantity}</Text>
                    
                    <TouchableOpacity 
                      style={styles.qtyAdjustBtn} 
                      onPress={() => handleIncreaseQty(item.id)}
                    >
                      <Plus size={13} color="#8C7A77" />
                    </TouchableOpacity>
                  </View>

                  {/* Dynamic Pricing label */}
                  <Text style={styles.cardPricingCalculated}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </Text>
                </View>

              </GlassBox>
            ))}
          </View>
        ) : (
          /* Empty Bag State */
          <View style={styles.emptyBasketPanel}>
            <View style={styles.emptyBasketCircle}>
              <ShoppingBag size={36} color="rgba(212, 163, 115, 0.45)" />
            </View>
            <Text style={styles.emptyBasketTitle}>Your bag is currently empty</Text>
            <Text style={styles.emptyBasketSub}>Assemble an elegant, customized pastry in our Design Studio to place an order.</Text>
            <Button 
              title="Open Design Studio" 
              style={styles.openStudioBtn}
              onPress={() => router.push('/customizer' as any)}
            />
          </View>
        )}

        {cartItems.length > 0 && (
          <>
            {/* Fulfillment Mode Selectors */}
            <Text style={[styles.listSectionTitle, { marginTop: 24 }]}>Select Delivery Mode</Text>
            <View style={styles.deliveryModeRow}>
              {/* Courier Mode Option */}
              <TouchableOpacity 
                style={styles.deliveryModeTouch}
                onPress={() => setDeliveryMode('courier')}
              >
                <GlassBox 
                  intensity={deliveryMode === 'courier' ? 70 : 20}
                  style={[
                    styles.deliveryModeGlass,
                    deliveryMode === 'courier' && styles.deliveryModeGlassActive
                  ]}
                >
                  <View style={styles.deliveryIconDisk}>
                    <Truck size={16} color={deliveryMode === 'courier' ? '#FFFFFF' : '#D4A373'} />
                  </View>
                  <Text style={[styles.deliveryLabelTitle, deliveryMode === 'courier' && styles.deliveryLabelTitleActive]}>
                    White-Glove Courier
                  </Text>
                  <Text style={styles.deliveryLabelDetail}>Refrigerated delivery • +$15.00</Text>
                </GlassBox>
              </TouchableOpacity>

              {/* Pickup Mode Option */}
              <TouchableOpacity 
                style={styles.deliveryModeTouch}
                onPress={() => setDeliveryMode('pickup')}
              >
                <GlassBox 
                  intensity={deliveryMode === 'pickup' ? 70 : 20}
                  style={[
                    styles.deliveryModeGlass,
                    deliveryMode === 'pickup' && styles.deliveryModeGlassActive
                  ]}
                >
                  <View style={styles.deliveryIconDisk}>
                    <MapPin size={16} color={deliveryMode === 'pickup' ? '#FFFFFF' : '#D4A373'} />
                  </View>
                  <Text style={[styles.deliveryLabelTitle, deliveryMode === 'pickup' && styles.deliveryLabelTitleActive]}>
                    Boutique Pick-up
                  </Text>
                  <Text style={styles.deliveryLabelDetail}>Rue Royale, Paris • Free</Text>
                </GlassBox>
              </TouchableOpacity>
            </View>

            {/* Time Slot Details */}
            <GlassBox intensity={30} style={styles.timeSlotDetailsBanner}>
              <Clock size={15} color="#D4A373" style={{ marginRight: 10 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.timeSlotLabelTitle}>
                  {deliveryMode === 'courier' ? 'Scheduled Refrigerated Courier Arrival:' : 'Scheduled Boutique Pick-up Time:'}
                </Text>
                <Text style={styles.timeSlotValueText}>{pickupTime}</Text>
              </View>
              <TouchableOpacity 
                onPress={() => {
                  Alert.alert("Select Delivery Time", "Gourmet pastry preparation requires 24 hours custom baking. Order timing is locked for tomorrow afternoon.", [{ text: "Understood" }]);
                }}
                style={styles.timeSlotEditTouch}
              >
                <Text style={styles.timeSlotEditText}>Adjust</Text>
              </TouchableOpacity>
            </GlassBox>

            {/* Promo Code Input widget */}
            <Text style={[styles.listSectionTitle, { marginTop: 24 }]}>Boutique Voucher Code</Text>
            {appliedPromo ? (
              <GlassBox intensity={60} style={styles.promoAppliedSuccessBox}>
                <View style={styles.promoAppliedIconRow}>
                  <Check size={14} color="#FFFFFF" strokeWidth={3} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.promoAppliedCodeLabel}>Voucher "{appliedPromo}" Applied</Text>
                  <Text style={styles.promoAppliedDiscountText}>10% discount on boutique subtotal</Text>
                </View>
                <TouchableOpacity onPress={removeAppliedPromo} style={styles.promoRemoveTouch}>
                  <Text style={styles.promoRemoveText}>Remove</Text>
                </TouchableOpacity>
              </GlassBox>
            ) : (
              <View style={styles.promoCodeInputRow}>
                <GlassBox intensity={30} style={styles.promoCodeInputGlass}>
                  <TextInput 
                    placeholder="Enter code (E.g. HAUTEPASTRY)"
                    placeholderTextColor="rgba(140, 122, 119, 0.45)"
                    value={promoCodeInput}
                    onChangeText={setPromoCodeInput}
                    autoCapitalize="characters"
                    style={styles.promoCodeTextInput}
                  />
                </GlassBox>
                <TouchableOpacity 
                  onPress={applyPromoCode}
                  style={styles.promoApplyTouchBtn}
                >
                  <Text style={styles.promoApplyBtnText}>Apply</Text>
                </TouchableOpacity>
              </View>
            )}
            {promoError.length > 0 && <Text style={styles.promoErrorLabelText}>{promoError}</Text>}
          </>
        )}
      </ScrollView>

      {/* Luxury Checkout Sticky Panel */}
      {cartItems.length > 0 && (
        <View style={styles.pricingCheckoutStickyPanel}>
          {/* Subtle horizontal break line */}
          <View style={styles.pricingSeparatorLine} />
          
          <View style={styles.pricingBreakdownList}>
            <View style={styles.pricingBreakdownRow}>
              <Text style={styles.pricingBreakdownLabel}>Pastry Creations Subtotal</Text>
              <Text style={styles.pricingBreakdownValue}>${subtotal.toFixed(2)}</Text>
            </View>

            {deliveryFee > 0 && (
              <View style={styles.pricingBreakdownRow}>
                <Text style={styles.pricingBreakdownLabel}>White-Glove Cold Courier Fee</Text>
                <Text style={styles.pricingBreakdownValue}>${deliveryFee.toFixed(2)}</Text>
              </View>
            )}

            {discountPercent > 0 && (
              <View style={styles.pricingBreakdownRow}>
                <Text style={[styles.pricingBreakdownLabel, { color: '#E06D6D' }]}>10% Signature Discount</Text>
                <Text style={[styles.pricingBreakdownValue, { color: '#E06D6D' }]}>-${discountAmount.toFixed(2)}</Text>
              </View>
            )}

            {/* Solid Grand Total */}
            <View style={[styles.pricingBreakdownRow, { marginTop: 4 }]}>
              <Text style={styles.grandTotalLabel}>Grand Sum Total</Text>
              <Text style={styles.grandTotalValue}>${grandTotal.toFixed(2)}</Text>
            </View>
          </View>

          {/* Verification CTA Button */}
          <Button 
            title={checkoutInProgress ? "Verifying..." : "Verify & Checkout"}
            leftIcon={<Award size={18} color="#FFFFFF" strokeWidth={2} />}
            rightIcon={<ArrowRight size={16} color="#FFFFFF" />}
            loading={checkoutInProgress}
            onPress={handleCheckoutInitiation}
            style={styles.boutiqueCheckoutBtn}
          />
        </View>
      )}

      {/* Chef's Signature Approved wax-seal Modal overlay */}
      {showSealModal && (
        <View style={styles.modalFullOverlay}>
          <View style={styles.sealDialogBox}>
            <GlassBox intensity={99} style={styles.sealInnerGlassCard}>
              
              {/* Header Close */}
              <TouchableOpacity 
                style={styles.modalCloseIconBtn}
                onPress={() => setShowSealModal(false)}
              >
                <X size={20} color={theme.colors.text} />
              </TouchableOpacity>

              {/* Gold Medal Wax Seal visual badge */}
              <View style={styles.waxSealOutermost}>
                <LinearGradient
                  colors={['#C59567', '#D4A373', '#E8C39E']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.waxSealInnerGradient}
                >
                  <Award size={36} color="#FFFFFF" strokeWidth={1.8} />
                </LinearGradient>
              </View>

              <Text style={styles.sealChefApprovalTitle}>Chef's Signature Seal Approved</Text>
              <Text style={styles.sealChefDescriptionSub}>
                Your order is officially sealed by the head chef of **Boutique Fast Pastry**.
              </Text>
              
              <View style={styles.signatureScriptBox}>
                <Text style={styles.signatureScriptText}>Jean-Luc V.</Text>
                <Text style={styles.signatureTitleLabel}>Maitre Pâtissier, Paris</Text>
              </View>

              {/* Checklist verification items */}
              <View style={styles.sealChecklistDeck}>
                <View style={styles.sealChecklistItemRow}>
                  <ShieldCheck size={16} color="#D4A373" style={{ marginRight: 10, marginTop: 1 }} />
                  <Text style={styles.sealChecklistItemText}>
                    <Text style={{ fontFamily: 'Poppins-SemiBold' }}>Refrigerated Cloche:</Text> Pastry will be transported below 4°C in hand-blown custom packaging.
                  </Text>
                </View>

                <View style={styles.sealChecklistItemRow}>
                  <ShieldCheck size={16} color="#D4A373" style={{ marginRight: 10, marginTop: 1 }} />
                  <Text style={styles.sealChecklistItemText}>
                    <Text style={{ fontFamily: 'Poppins-SemiBold' }}>Calligraphy Card:</Text> Custom handwritten greetings cards are finalized in gold cacao script.
                  </Text>
                </View>

                <View style={styles.sealChecklistItemRow}>
                  <ShieldCheck size={16} color="#D4A373" style={{ marginRight: 10, marginTop: 1 }} />
                  <Text style={styles.sealChecklistItemText}>
                    <Text style={{ fontFamily: 'Poppins-SemiBold' }}>Guaranteed Craftsmanship:</Text> Built with selected tier details, flavor layers, and toppings.
                  </Text>
                </View>
              </View>

              {/* Final submission buttons */}
              <View style={styles.sealActionBtnColumn}>
                <Button 
                  title={`Place Order • $${grandTotal.toFixed(2)}`}
                  style={styles.sealConfirmButton}
                  onPress={handleConfirmOrderFinal}
                />
                
                <TouchableOpacity 
                  onPress={() => setShowSealModal(false)}
                  style={styles.sealCancelTouch}
                >
                  <Text style={styles.sealCancelText}>Refine Custom Recipe</Text>
                </TouchableOpacity>
              </View>

            </GlassBox>
          </View>
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
  headerBar: {
    paddingHorizontal: 28,
    paddingBottom: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(232, 211, 194, 0.3)',
    backgroundColor: 'rgba(255, 248, 242, 0.85)',
    zIndex: 10,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  headerTitleText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: '#2C1B18',
  },
  headerSubtitleText: {
    fontFamily: 'Cairo-Bold',
    fontSize: 9,
    color: '#D4A373',
    letterSpacing: 2,
    marginTop: 2,
  },
  scrollContent: {
    paddingHorizontal: 28,
    paddingTop: 18,
  },
  itemsBlockList: {
    gap: 12,
  },
  listSectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 15,
    color: '#2C1B18',
    marginBottom: 8,
  },
  cartCardItem: {
    borderRadius: 22,
    borderWidth: 1.2,
    borderColor: 'rgba(232, 211, 194, 0.45)',
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    padding: 14,
  },
  cardHeaderRow: {
    flexDirection: 'row',
  },
  cardDetailsColumn: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  cardMainTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: '#2C1B18',
  },
  cardMetaSummary: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: '#8C7A77',
    marginTop: 2,
  },
  cardSurchargesText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 10,
    color: '#8C7A77',
    marginTop: 1.5,
  },
  cardGiftIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(224, 109, 109, 0.06)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginTop: 5,
    alignSelf: 'flex-start',
    maxWidth: '90%',
  },
  giftCardSubText: {
    fontFamily: 'Cairo-SemiBold',
    fontSize: 8.5,
    color: '#E06D6D',
  },
  cardHorizontalLine: {
    height: 0.5,
    backgroundColor: 'rgba(232, 211, 194, 0.35)',
    marginVertical: 12,
  },
  cardBottomActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  editDesignBtnTouch: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(212, 163, 115, 0.06)',
  },
  editDesignText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 11,
    color: '#D4A373',
  },
  qtyControlWidget: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(212, 163, 115, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 2,
  },
  qtyAdjustBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyValueLabel: {
    fontFamily: 'Poppins-Bold',
    fontSize: 12,
    color: '#2C1B18',
    paddingHorizontal: 8,
  },
  cardPricingCalculated: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: '#D4A373',
  },
  
  // Fulfillment Mode
  deliveryModeRow: {
    flexDirection: 'row',
    gap: 10,
  },
  deliveryModeTouch: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  deliveryModeGlass: {
    borderRadius: 20,
    padding: 14,
    borderColor: 'rgba(232, 211, 194, 0.45)',
    borderWidth: 1.2,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    alignItems: 'center',
  },
  deliveryModeGlassActive: {
    borderColor: '#D4A373',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
  },
  deliveryIconDisk: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#D4A373',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  deliveryLabelTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#8C7A77',
    textAlign: 'center',
  },
  deliveryLabelTitleActive: {
    fontFamily: 'Poppins-SemiBold',
    color: '#2C1B18',
  },
  deliveryLabelDetail: {
    fontFamily: 'Poppins-Regular',
    fontSize: 9,
    color: '#8C7A77',
    opacity: 0.8,
    marginTop: 2,
    textAlign: 'center',
  },

  // Time slots details banner
  timeSlotDetailsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    padding: 12,
    borderColor: 'rgba(212, 163, 115, 0.35)',
    borderWidth: 1.2,
    backgroundColor: 'rgba(212, 163, 115, 0.04)',
    marginTop: 12,
  },
  timeSlotLabelTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 10,
    color: '#8C7A77',
  },
  timeSlotValueText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 12,
    color: '#D4A373',
    marginTop: 1,
  },
  timeSlotEditTouch: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(212, 163, 115, 0.3)',
    backgroundColor: '#FFFFFF',
  },
  timeSlotEditText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 10,
    color: '#D4A373',
  },

  // Promo Code Widget
  promoCodeInputRow: {
    flexDirection: 'row',
    gap: 10,
    height: 48,
  },
  promoCodeInputGlass: {
    flex: 1,
    borderRadius: 14,
    borderColor: 'rgba(232, 211, 194, 0.45)',
    borderWidth: 1.2,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    paddingHorizontal: 14,
    height: '100%',
    padding: 0,
  },
  promoCodeTextInput: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#2C1B18',
    height: '100%',
    padding: 0,
  },
  promoApplyTouchBtn: {
    width: 80,
    height: '100%',
    borderRadius: 14,
    backgroundColor: '#2C1B18',
    alignItems: 'center',
    justifyContent: 'center',
  },
  promoApplyBtnText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    color: '#FFFFFF',
  },
  promoErrorLabelText: {
    fontFamily: 'Cairo-Bold',
    fontSize: 9,
    color: '#E06D6D',
    marginTop: 6,
    marginLeft: 4,
  },
  promoAppliedSuccessBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderColor: '#D4A373',
    borderWidth: 1.2,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    padding: 12,
  },
  promoAppliedIconRow: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#D4A373',
    alignItems: 'center',
    justifyContent: 'center',
  },
  promoAppliedCodeLabel: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    color: '#2C1B18',
  },
  promoAppliedDiscountText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: '#8C7A77',
  },
  promoRemoveTouch: {
    padding: 6,
  },
  promoRemoveText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 11,
    color: '#E06D6D',
  },

  // Empty Basket Panel
  emptyBasketPanel: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyBasketCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(212, 163, 115, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyBasketTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#2C1B18',
  },
  emptyBasketSub: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#8C7A77',
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 6,
    paddingHorizontal: 20,
  },
  openStudioBtn: {
    marginTop: 18,
    paddingHorizontal: 24,
    height: 44,
  },

  // Checkout Panel
  pricingCheckoutStickyPanel: {
    position: 'absolute',
    bottom: 112,
    left: 20,
    right: 20,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(232, 211, 194, 0.45)',
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
  pricingSeparatorLine: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(232, 211, 194, 0.5)',
    alignSelf: 'center',
    marginBottom: 8,
  },
  pricingBreakdownList: {
    gap: 4,
    marginBottom: 12,
  },
  pricingBreakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pricingBreakdownLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: '#8C7A77',
  },
  pricingBreakdownValue: {
    fontFamily: 'Poppins-Medium',
    fontSize: 11,
    color: '#2C1B18',
  },
  grandTotalLabel: {
    fontFamily: 'Poppins-Bold',
    fontSize: 13,
    color: '#2C1B18',
  },
  grandTotalValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#D4A373',
  },
  boutiqueCheckoutBtn: {
    width: '100%',
    height: 48,
  },

  // Mini Cake Preview Render CSS
  miniCakeContainer: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'relative',
  },
  miniCakeStandPlate: {
    width: 44,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#D4A373',
    position: 'absolute',
    bottom: 3,
  },
  miniCakeStandStem: {
    width: 8,
    height: 3,
    backgroundColor: '#C59567',
    position: 'absolute',
    bottom: 0,
  },
  miniCakeStack: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%',
    height: 46,
    paddingBottom: 6,
  },
  miniCakeTierBase: {
    width: 36,
    height: 12,
    borderRadius: 3,
    position: 'relative',
    overflow: 'hidden',
    borderColor: 'rgba(0, 0, 0, 0.05)',
    borderWidth: 0.5,
  },
  miniCakeTierMiddle: {
    width: 26,
    height: 10,
    borderRadius: 2.5,
    marginBottom: -2,
    position: 'relative',
    overflow: 'hidden',
    borderColor: 'rgba(0, 0, 0, 0.05)',
    borderWidth: 0.5,
    zIndex: 2,
  },
  miniCakeTierTop: {
    width: 18,
    height: 9,
    borderRadius: 2,
    marginBottom: -2,
    position: 'relative',
    overflow: 'hidden',
    borderColor: 'rgba(0, 0, 0, 0.05)',
    borderWidth: 0.5,
    zIndex: 3,
  },
  miniBerry: {
    position: 'absolute',
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#E06D6D',
  },
  miniMacaron: {
    position: 'absolute',
    width: 4,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#FFF2CC',
  },
  miniTopperSparkle: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D4A373',
    alignSelf: 'center',
    marginTop: 1,
  },

  // Modal Full Overlay
  modalFullOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(61, 44, 41, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  sealDialogBox: {
    width: width * 0.88,
    maxHeight: height * 0.82,
    borderRadius: 32,
    overflow: 'hidden',
  },
  sealInnerGlassCard: {
    borderWidth: 0,
    borderRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    alignItems: 'center',
  },
  modalCloseIconBtn: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 6,
  },
  waxSealOutermost: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderColor: 'rgba(212, 163, 115, 0.25)',
    borderWidth: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#D4A373',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  waxSealInnerGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sealChefApprovalTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#2C1B18',
    textAlign: 'center',
  },
  sealChefDescriptionSub: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: '#8C7A77',
    textAlign: 'center',
    lineHeight: 16,
    marginTop: 6,
    paddingHorizontal: 12,
  },
  signatureScriptBox: {
    alignItems: 'center',
    marginVertical: 14,
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderWidth: 0.5,
    borderStyle: 'dashed',
    borderColor: 'rgba(212, 163, 115, 0.45)',
    borderRadius: 14,
    backgroundColor: 'rgba(212, 163, 115, 0.03)',
  },
  signatureScriptText: {
    fontFamily: 'Cairo-Bold',
    fontSize: 16,
    color: '#C59567',
    letterSpacing: 1.5,
    fontStyle: 'italic',
  },
  signatureTitleLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 8.5,
    color: '#8C7A77',
    opacity: 0.7,
    marginTop: 1,
    textTransform: 'uppercase',
  },
  sealChecklistDeck: {
    width: '100%',
    gap: 8,
    marginBottom: 20,
  },
  sealChecklistItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(212, 163, 115, 0.03)',
    padding: 10,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: 'rgba(212, 163, 115, 0.15)',
  },
  sealChecklistItemText: {
    flex: 1,
    fontFamily: 'Poppins-Regular',
    fontSize: 10.5,
    color: '#8C7A77',
    lineHeight: 14,
  },
  sealActionBtnColumn: {
    width: '100%',
    gap: 8,
  },
  sealConfirmButton: {
    width: '100%',
    height: 46,
  },
  sealCancelTouch: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  sealCancelText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 11,
    color: '#8C7A77',
  }
});
