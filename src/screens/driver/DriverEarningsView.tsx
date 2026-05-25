import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions, 
  ActivityIndicator,
  Modal
} from 'react-native';
import Animated, { 
  FadeInDown, 
  FadeInUp, 
  FadeInLeft,
  Layout,
  ZoomIn
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Svg, { 
  Path, 
  Defs, 
  LinearGradient as SvgLinearGradient, 
  Stop, 
  Circle, 
  Rect,
  Line,
  Text as SvgText,
  G
} from 'react-native-svg';
import { 
  Wallet, 
  DollarSign, 
  CheckCircle, 
  Clock, 
  ArrowUpRight, 
  Gift, 
  Trophy, 
  CreditCard, 
  ArrowRight, 
  Lock, 
  Sparkles, 
  Coins,
  ChevronRight,
  TrendingUp,
  ShieldCheck
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

// Type definitions for data filtering
type MetricType = 'daily' | 'weekly' | 'monthly' | 'deliveries' | 'avgTime';

export const DriverEarningsView = () => {
  // State
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('weekly');
  const [balance, setBalance] = useState<number>(1482.50);
  const [isCashoutOpen, setIsCashoutOpen] = useState<boolean>(false);
  const [cashoutStatus, setCashoutStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  
  // Simulated interactive data change
  const metricLabels: Record<MetricType, string> = {
    daily: 'Today\'s Earnings',
    weekly: 'Weekly Performance',
    monthly: 'Monthly Volume',
    deliveries: 'Completed Deliveries',
    avgTime: 'Average Delivery Time'
  };

  // SVGs Chart Coordinate Computations
  // Let's create beautiful pre-calculated path data for each metric to show stunning SVG lines!
  const chartPaths: Record<MetricType, { path: string; fillPath: string; dots: Array<{ x: number; y: number; val: string }> }> = {
    daily: {
      path: "M 40 120 Q 90 60 140 90 T 240 40 T 340 70",
      fillPath: "M 40 120 Q 90 60 140 90 T 240 40 T 340 70 L 340 180 L 40 180 Z",
      dots: [
        { x: 40, y: 120, val: '$20' },
        { x: 115, y: 75, val: '$45' },
        { x: 190, y: 70, val: '$82' },
        { x: 265, y: 45, val: '$134' },
        { x: 340, y: 70, val: '$184' }
      ]
    },
    weekly: {
      path: "M 40 130 Q 90 140 140 80 T 240 50 T 340 30",
      fillPath: "M 40 130 Q 90 140 140 80 T 240 50 T 340 30 L 340 180 L 40 180 Z",
      dots: [
        { x: 40, y: 130, val: '$110' },
        { x: 115, y: 120, val: '$140' },
        { x: 190, y: 70, val: '$210' },
        { x: 265, y: 48, val: '$280' },
        { x: 340, y: 30, val: '$892' }
      ]
    },
    monthly: {
      path: "M 40 100 Q 90 120 140 60 T 240 30 T 340 15",
      fillPath: "M 40 100 Q 90 120 140 60 T 240 30 T 340 15 L 340 180 L 40 180 Z",
      dots: [
        { x: 40, y: 100, val: '$520' },
        { x: 115, y: 95, val: '$1.2K' },
        { x: 190, y: 55, val: '$2.1K' },
        { x: 265, y: 25, val: '$2.8K' },
        { x: 340, y: 15, val: '$3.4K' }
      ]
    },
    deliveries: {
      path: "M 40 140 Q 90 100 140 120 T 240 80 T 340 50",
      fillPath: "M 40 140 Q 90 100 140 120 T 240 80 T 340 50 L 340 180 L 40 180 Z",
      dots: [
        { x: 40, y: 140, val: '8' },
        { x: 115, y: 115, val: '22' },
        { x: 190, y: 105, val: '64' },
        { x: 265, y: 75, val: '110' },
        { x: 340, y: 50, val: '142' }
      ]
    },
    avgTime: {
      path: "M 40 60 Q 90 80 140 70 T 240 90 T 340 110",
      fillPath: "M 40 60 Q 90 80 140 70 T 240 90 T 340 110 L 340 180 L 40 180 Z",
      dots: [
        { x: 40, y: 60, val: '22m' },
        { x: 115, y: 72, val: '20m' },
        { x: 190, y: 78, val: '19m' },
        { x: 265, y: 92, val: '18.5m' },
        { x: 340, y: 110, val: '18.2m' }
      ]
    }
  };

  // Run simulated cashout process
  const triggerCashout = () => {
    setCashoutStatus('processing');
    setTimeout(() => {
      setCashoutStatus('success');
      setTimeout(() => {
        setBalance(0.00); // Balance updates instantly to simulate a real payment process!
        setIsCashoutOpen(false);
        setCashoutStatus('idle');
      }, 1500);
    }, 2000);
  };

  return (
    <ScrollView 
      contentContainerStyle={{ paddingBottom: 150, paddingHorizontal: 20 }}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. PREMIUM HEADER / CURRENT BALANCE */}
      <Animated.View entering={FadeInUp.duration(600)} className="mt-4 mb-6">
        <View className="bg-white/70 rounded-[32px] border-2 border-rose-200/50 shadow-xl overflow-hidden">
          <LinearGradient
            colors={['rgba(248, 182, 200, 0.15)', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />
          <BlurView intensity={60} tint="light" className="p-6">
            <View className="flex-row justify-between items-center mb-6">
              <View className="flex-row items-center bg-rose-100/50 px-3 py-1.5 rounded-xl border border-rose-200/30">
                <Wallet size={14} color="#F8B6C8" />
                <Text className="font-cairo-bold text-[9px] text-rose-400 ml-2 tracking-widest uppercase">Secure Wallet</Text>
              </View>
              <View className="flex-row items-center">
                <View className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2" />
                <Text className="font-cairo-bold text-[10px] text-green-500">Instant Cashout Active</Text>
              </View>
            </View>

            <Text className="font-poppins-bold text-5xl text-adminText tracking-tighter">${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</Text>
            <Text className="font-cairo-medium text-adminMuted text-xs mt-1">Current Available Balance • Auto-payouts Monday</Text>

            <View className="mt-8">
              <TouchableOpacity 
                activeOpacity={0.8} 
                onPress={() => balance > 0 && setIsCashoutOpen(true)}
                className={`rounded-2xl overflow-hidden shadow-lg ${balance > 0 ? 'shadow-rose-400/30' : 'opacity-60'}`}
                disabled={balance === 0}
              >
                <LinearGradient 
                  colors={balance > 0 ? ['#F8B6C8', '#F472B6'] : ['#E2E8F0', '#CBD5E1']} 
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="flex-row items-center justify-center h-16"
                >
                  <Coins size={18} color={balance > 0 ? "#FFFFFF" : "#94A3B8"} className="mr-3" />
                  <Text className={`font-poppins-bold text-sm tracking-widest uppercase ${balance > 0 ? 'text-white' : 'text-slate-400'}`}>
                    {balance > 0 ? 'INSTANT CASH OUT' : 'BALANCE TRANSFERRED'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </BlurView>
        </View>
      </Animated.View>

      {/* 2. CORE STATISTICAL ROW CARDS (Tappable to filter the SVG Charts) */}
      <Animated.View entering={FadeInDown.duration(600).delay(100)}>
        <View className="flex-row items-center mb-4 ml-1">
          <Sparkles size={14} color="#D4A373" />
          <Text className="ml-2 font-cairo-bold text-gold/80 text-[10px] tracking-widest uppercase">Metrics Filter</Text>
        </View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 30, gap: 12, marginBottom: 24 }}
        >
          {[
            { id: 'daily', label: 'Daily Earn', val: '$184.50', icon: DollarSign, color: '#D4A373' },
            { id: 'weekly', label: 'Weekly Earn', val: '$892.00', icon: TrendingUp, color: '#F8B6C8' },
            { id: 'monthly', label: 'Monthly Earn', val: '$3,421', icon: Wallet, color: '#D4A373' },
            { id: 'deliveries', label: 'Deliveries', val: '142', icon: CheckCircle, color: '#4ADE80' },
            { id: 'avgTime', label: 'Avg Duration', val: '18.2m', icon: Clock, color: '#60A5FA' },
          ].map((metric) => (
            <TouchableOpacity 
              key={metric.id}
              activeOpacity={0.8}
              onPress={() => setSelectedMetric(metric.id as MetricType)}
              className={`w-[110] p-4 rounded-3xl border ${selectedMetric === metric.id ? 'bg-white border-rose-200/50 shadow-md' : 'bg-white/40 border-rose-200/20'}`}
            >
                <View className="w-9 h-9 rounded-xl items-center justify-center mb-3" style={{ backgroundColor: `${metric.color}15` }}>
                  <metric.icon size={16} color={metric.color} />
                </View>
                <Text className="font-poppins-bold text-base text-adminText">{metric.val}</Text>
                <Text className="font-cairo-medium text-adminMuted text-[10px] uppercase tracking-wider">{metric.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>

      {/* 3. PREMIUM SVG ANALYTICS CANVAS */}
      <Animated.View entering={FadeInDown.duration(600).delay(200)} className="mb-6">
        <View className="bg-white/70 rounded-[32px] border border-rose-200/30 overflow-hidden shadow-sm">
          <LinearGradient
            colors={['rgba(248, 182, 200, 0.05)', 'transparent']}
            style={StyleSheet.absoluteFillObject}
          />
          <BlurView intensity={40} tint="light" className="p-5">
            <View className="flex-row justify-between items-center mb-6">
              <View>
                <Text className="font-poppins-bold text-lg text-adminText">{metricLabels[selectedMetric]}</Text>
                <Text className="font-cairo-medium text-adminMuted text-xs mt-1">Real-time performance & trends</Text>
              </View>
              <Sparkles size={18} color="#D4A373" />
            </View>

            {/* SVG Canvas Chart Rendering */}
            <View className="items-center justify-center mt-2">
              <Svg width={width - 80} height={200} viewBox="0 0 380 200">
                <Defs>
                  <SvgLinearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0%" stopColor="#F8B6C8" stopOpacity={0.4} />
                    <Stop offset="100%" stopColor="#F8B6C8" stopOpacity={0.0} />
                  </SvgLinearGradient>
                </Defs>

                {/* Grid guide lines */}
                <Line x1="40" y1="30" x2="340" y2="30" stroke="rgba(248, 182, 200, 0.1)" strokeWidth="1" />
                <Line x1="40" y1="80" x2="340" y2="80" stroke="rgba(248, 182, 200, 0.1)" strokeWidth="1" />
                <Line x1="40" y1="130" x2="340" y2="130" stroke="rgba(248, 182, 200, 0.1)" strokeWidth="1" />
                <Line x1="40" y1="180" x2="340" y2="180" stroke="rgba(248, 182, 200, 0.2)" strokeWidth="1" />

                {/* Dynamic Path underlay and outline */}
                <Path 
                  d={chartPaths[selectedMetric].fillPath}
                  fill="url(#chartGradient)"
                />
                <Path 
                  d={chartPaths[selectedMetric].path}
                  fill="none"
                  stroke="#F8B6C8"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Graph Interactive Data Dots */}
                {chartPaths[selectedMetric].dots.map((dot, index) => (
                  <G key={index}>
                    <Circle 
                      cx={dot.x} 
                      cy={dot.y} 
                      r="6" 
                      fill="#FFFFFF" 
                      stroke="#F8B6C8" 
                      strokeWidth="2.5" 
                    />
                    <SvgText
                      x={dot.x}
                      y={dot.y - 12}
                      fill="#2C1B18"
                      fontSize="10"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {dot.val}
                    </SvgText>
                  </G>
                ))}

                {/* X Axis labels */}
                <SvgText x="40" y="196" fill="#8C7A77" fontSize="9" textAnchor="middle">Mon</SvgText>
                <SvgText x="115" y="196" fill="#8C7A77" fontSize="9" textAnchor="middle">Tue</SvgText>
                <SvgText x="190" y="196" fill="#8C7A77" fontSize="9" textAnchor="middle">Wed</SvgText>
                <SvgText x="265" y="196" fill="#8C7A77" fontSize="9" textAnchor="middle">Thu</SvgText>
                <SvgText x="340" y="196" fill="#2C1B18" fontSize="9" fontWeight="bold" textAnchor="middle">Today</SvgText>
              </Svg>
            </View>
          </BlurView>
        </View>
      </Animated.View>

      {/* 4. ACTIVE BONUSES & STREAK ACHIVEMENTS */}
      <Animated.View entering={FadeInDown.duration(600).delay(300)}>
        <View className="flex-row items-center mb-4 ml-1">
          <Trophy size={14} color="#D4A373" />
          <Text className="ml-2 font-cairo-bold text-gold/80 text-[10px] tracking-widest uppercase">Active Bonuses</Text>
        </View>
        <View className="bg-white/70 rounded-[32px] border border-rose-200/30 overflow-hidden shadow-sm mb-6">
          <LinearGradient
            colors={['rgba(74, 222, 128, 0.05)', 'transparent']}
            style={StyleSheet.absoluteFillObject}
          />
          <BlurView intensity={40} tint="light" className="p-6">
            <View className="flex-row items-center mb-6">
              <View className="w-12 h-12 rounded-2xl bg-green-50 items-center justify-center">
                <Gift size={20} color="#4ADE80" />
              </View>
              <View className="flex-1 ml-4">
                <Text className="font-poppins-bold text-base text-adminText">Weekend Warrior</Text>
                <Text className="font-cairo-bold text-xs text-green-500 mt-0.5">Reward: +$150.00 Boost</Text>
              </View>
              <View className="bg-green-50/50 px-2 py-1 rounded-lg">
                <Text className="font-cairo-bold text-[9px] text-green-600">10/15 Active</Text>
              </View>
            </View>

            <View className="mb-6">
              <View className="h-2 bg-green-100 rounded-full overflow-hidden">
                <View className="h-full bg-green-500 rounded-full" style={{ width: '66%' }} />
              </View>
            </View>

            <View className="h-[1] bg-rose-200/20 mb-6" />

            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="font-poppins-bold text-xs text-adminText">Delivery Streak</Text>
                <Text className="font-cairo-medium text-[10px] text-adminMuted mt-1">Deliver 5 orders for +$25</Text>
              </View>
              <View className="flex-row gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <View key={i} className="w-7 h-7 rounded-full bg-rose-400 items-center justify-center shadow-sm">
                    <CheckCircle size={14} color="#FFFFFF" />
                  </View>
                ))}
                <View className="w-7 h-7 rounded-full bg-white border border-rose-200/50 items-center justify-center shadow-sm">
                  <Text className="font-poppins-bold text-[10px] text-rose-400">5</Text>
                </View>
              </View>
            </View>
          </BlurView>
        </View>
      </Animated.View>

      {/* 5. GAMIFIED PREMIUM BADGES GALLERY */}
      <Animated.View entering={FadeInDown.duration(600).delay(400)}>
        <View className="flex-row items-center mb-4 ml-1">
          <ShieldCheck size={14} color="#D4A373" />
          <Text className="ml-2 font-cairo-bold text-gold/80 text-[10px] tracking-widest uppercase">Achievements</Text>
        </View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 30, gap: 16, marginBottom: 24 }}
        >
          {[
            { label: "Master Patissier", icon: Trophy },
            { label: "Gold Specialist", icon: Sparkles },
            { label: "Express Driver", icon: Clock },
            { label: "Perfect Fragility", icon: CheckCircle },
          ].map((badge, i) => (
            <View key={i} className="items-center w-24">
              <View className="w-16 h-16 rounded-full bg-white/70 border border-rose-200/30 items-center justify-center shadow-sm mb-2">
                <badge.icon size={24} color="#D4A373" />
              </View>
              <Text className="font-cairo-bold text-[9px] text-adminMuted text-center uppercase tracking-tighter leading-tight" numberOfLines={2}>{badge.label}</Text>
            </View>
          ))}
        </ScrollView>
      </Animated.View>

      {/* 6. HOLOGRAPHIC LUXURY DEBIT CARD RENDER */}
      <Animated.View entering={FadeInDown.duration(600).delay(500)}>
        <View className="flex-row items-center mb-4 ml-1">
          <CreditCard size={14} color="#D4A373" />
          <Text className="ml-2 font-cairo-bold text-gold/80 text-[10px] tracking-widest uppercase">Prestige Card</Text>
        </View>
        <LinearGradient
          colors={['#F8B6C8', '#FADADD', '#D4A373']}
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 1.0, y: 1.0 }}
          className="h-[180] rounded-[32px] p-6 relative overflow-hidden shadow-xl shadow-rose-200/50"
        >
          {/* Card Glass Sheen Overlay */}
          <View className="absolute -top-[50] -left-[50] w-[250] h-[250] bg-white/20 transform rotate-45" />
          
          <View className="flex-row justify-between items-center z-10">
            <Text className="font-poppins-bold text-white text-base tracking-[3px]">FAST PASTRY</Text>
            <Text className="font-cairo-bold text-[8px] text-white/80 tracking-widest uppercase">Driver Prestige</Text>
          </View>

          <View className="w-10 h-7 rounded-lg overflow-hidden mt-4 z-10">
            <LinearGradient
              colors={['#FFE494', '#CFA33D']}
              className="flex-1"
            />
          </View>

          <View className="mt-5 z-10">
            <Text className="font-poppins-bold text-xl text-white tracking-[4px]">••••  ••••  ••••  4921</Text>
          </View>

          <View className="flex-row justify-between items-end mt-2 z-10">
            <View>
              <Text className="font-cairo-bold text-[7px] text-white/60 tracking-widest uppercase">Cardholder</Text>
              <Text className="font-poppins-bold text-xs text-white uppercase">Michael Sterling</Text>
            </View>
            <View className="opacity-80">
              <CreditCard size={28} color="#FFFFFF" />
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* 7. DETAILED PAYOUT HISTORY */}
      <Animated.View entering={FadeInDown.duration(600).delay(600)} className="mt-8">
        <View className="flex-row items-center mb-4 ml-1">
          <ArrowUpRight size={14} color="#D4A373" />
          <Text className="ml-2 font-cairo-bold text-gold/80 text-[10px] tracking-widest uppercase">Transaction Registry</Text>
        </View>
        <View className="bg-white/70 rounded-[32px] border border-rose-200/30 overflow-hidden shadow-sm">
          <BlurView intensity={20} tint="light" className="p-5">
            {[
              { method: "Instant Cashout Transfer", date: "May 19, 2026 • Card **** 4921", amount: "$412.00", status: "Success" },
              { method: "Weekly Automated Payout", date: "May 12, 2026 • Bank Deposit", amount: "$940.50", status: "Success" },
              { method: "Instant Cashout Transfer", date: "May 08, 2026 • Card **** 4921", amount: "$284.00", status: "Processing" },
            ].map((trans, i) => (
              <View key={i}>
                <View className="flex-row justify-between items-center py-4">
                  <View className="flex-row items-center flex-1">
                    <View className="w-10 h-10 rounded-full bg-white/80 border border-rose-200/30 items-center justify-center">
                      <ArrowUpRight size={16} color={trans.status === "Success" ? "#4ADE80" : "#60A5FA"} />
                    </View>
                    <View className="ml-4 flex-1">
                      <Text className="font-poppins-bold text-xs text-adminText">{trans.method}</Text>
                      <Text className="font-cairo-medium text-[10px] text-adminMuted mt-0.5">{trans.date}</Text>
                    </View>
                  </View>
                  <View className="items-end">
                    <Text className="font-poppins-bold text-sm text-adminText">{trans.amount}</Text>
                    <View className={`px-2 py-0.5 rounded-lg mt-1 ${trans.status === "Success" ? "bg-green-50" : "bg-blue-50"}`}>
                      <Text className={`font-cairo-bold text-[8px] uppercase tracking-widest ${trans.status === "Success" ? "text-green-500" : "text-blue-500"}`}>{trans.status}</Text>
                    </View>
                  </View>
                </View>
                {i < 2 && <View className="h-[1] bg-rose-200/20" />}
              </View>
            ))}
          </BlurView>
        </View>
      </Animated.View>

      {/* ==============================================
          8. INTERACTIVE CASHOUT POPUP / DIALOG SHEET 
          ============================================== */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isCashoutOpen}
        onRequestClose={() => setIsCashoutOpen(false)}
      >
        <View className="flex-1 justify-center items-center bg-adminText/60 p-6">
          <BlurView intensity={60} tint="dark" className="absolute inset-0" />
          
          <Animated.View entering={ZoomIn.duration(300)} className="w-full max-w-[360px]">
            <View className="bg-white rounded-[40px] border border-rose-200/50 shadow-2xl overflow-hidden">
              <LinearGradient
                colors={['rgba(248, 182, 200, 0.1)', 'transparent']}
                style={StyleSheet.absoluteFillObject}
              />

              {cashoutStatus === 'idle' && (
                <View className="p-8">
                  <View className="flex-row items-center gap-4 mb-6">
                    <View className="w-12 h-12 rounded-2xl bg-gold/10 items-center justify-center">
                      <Coins size={24} color="#D4A373" />
                    </View>
                    <Text className="font-poppins-bold text-xl text-adminText tracking-tight">Confirm Transfer</Text>
                  </View>
                  
                  <Text className="font-cairo-medium text-adminMuted text-sm leading-relaxed mb-8">
                    You are withdrawing your entire available pastry driver earnings to your prestige card.
                  </Text>

                  <View className="bg-rose-50/50 rounded-3xl p-5 border border-rose-100 mb-8">
                    <View className="flex-row justify-between items-center mb-3">
                      <Text className="font-cairo-medium text-xs text-adminMuted">Transfer Amount</Text>
                      <Text className="font-poppins-bold text-sm text-adminText">${balance.toFixed(2)}</Text>
                    </View>
                    <View className="flex-row justify-between items-center mb-3">
                      <Text className="font-cairo-medium text-xs text-adminMuted">Express Instant Fee</Text>
                      <Text className="font-poppins-bold text-sm text-adminText">$1.99</Text>
                    </View>
                    <View className="h-[1] bg-rose-200/20 my-2" />
                    <View className="flex-row justify-between items-center">
                      <Text className="font-cairo-bold text-sm text-gold">Total Received</Text>
                      <Text className="font-poppins-bold text-xl text-gold">${(balance - 1.99).toFixed(2)}</Text>
                    </View>
                  </View>

                  <View className="flex-row items-center mb-8">
                    <CreditCard size={14} color="#D4A373" className="mr-3" />
                    <Text className="flex-1 font-cairo-medium text-[10px] text-adminMuted">Instantly depositing to Fast Pastry Prestige Card **** 4921</Text>
                  </View>

                  <View className="flex-row gap-3">
                    <TouchableOpacity 
                      activeOpacity={0.8}
                      onPress={() => setIsCashoutOpen(false)}
                      className="flex-1 h-14 rounded-2xl bg-rose-50 items-center justify-center border border-rose-100"
                    >
                      <Text className="font-poppins-bold text-xs text-rose-400">CANCEL</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      activeOpacity={0.8}
                      onPress={triggerCashout}
                      className="flex-[1.8] h-14 rounded-2xl bg-rose-400 items-center justify-center shadow-lg shadow-rose-400/30"
                    >
                        <View className="flex-row items-center">
                          <Lock size={14} color="#FFFFFF" className="mr-2" />
                          <Text className="font-poppins-bold text-white text-xs tracking-widest uppercase">Withdraw Now</Text>
                        </View>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {cashoutStatus === 'processing' && (
                <View className="p-10 items-center justify-center">
                  <ActivityIndicator size="large" color="#F8B6C8" className="mb-6" />
                  <Text className="font-poppins-bold text-base text-adminText text-center uppercase tracking-widest">Securing Ledger...</Text>
                  <Text className="font-cairo-medium text-sm text-adminMuted text-center mt-3 leading-relaxed">Verifying driver credentials and dispersing assets.</Text>
                </View>
              )}

              {cashoutStatus === 'success' && (
                <View className="p-10 items-center justify-center">
                  <View className="w-20 h-20 rounded-full bg-green-50 items-center justify-center mb-6 border-2 border-green-100">
                    <CheckCircle size={40} color="#4ADE80" />
                  </View>
                  <Text className="font-poppins-bold text-lg text-green-500 text-center uppercase tracking-widest">Transfer Success</Text>
                  <Text className="font-cairo-medium text-sm text-adminMuted text-center mt-3 leading-relaxed">Funds are now available on your Prestige Card.</Text>
                </View>
              )}
            </View>
          </Animated.View>
        </View>
      </Modal>
    </ScrollView>
  );
};

// Internal minimal Blur support representation to safeguard against varying Expo components
const BlurBox: React.FC<{ intensity: number; style: any }> = ({ style }) => {
  return (
    <View style={[style, { backgroundColor: 'rgba(0, 0, 0, 0.75)' }]} />
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 150, 
    paddingHorizontal: 20,
  },
  balanceContainer: {
    marginTop: 15,
    marginBottom: 24,
  },
  balanceCard: {
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(212, 163, 115, 0.3)',
    backgroundColor: 'rgba(20, 20, 22, 0.65)',
    padding: 24,
    overflow: 'hidden',
  },
  balanceHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  purseWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  purseLabel: {
    fontFamily: 'Cairo-Bold',
    fontSize: 9,
    color: '#D4A373',
    marginLeft: 6,
    letterSpacing: 0.5,
  },
  payoutStatusPulse: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  payoutStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4ADE80',
    marginRight: 6,
  },
  payoutStatusText: {
    fontFamily: 'Cairo-SemiBold',
    fontSize: 10,
    color: '#4ADE80',
  },
  balanceAmount: {
    fontFamily: 'Poppins-Bold',
    fontSize: 38,
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  balanceSubtext: {
    fontFamily: 'Cairo-Medium',
    fontSize: 12,
    color: '#8E99A8',
    marginTop: 4,
  },
  balanceActions: {
    marginTop: 24,
  },
  cashoutBtn: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  cashoutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  disabledBtn: {
    opacity: 0.6,
  },
  cashoutText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 13,
    letterSpacing: 1.5,
  },
  sectionTitle: {
    fontFamily: 'Cairo-Bold',
    fontSize: 11,
    color: '#D4A373',
    letterSpacing: 2.5,
    marginBottom: 12,
    marginLeft: 4,
  },
  statsHorizontalScroll: {
    paddingRight: 30,
    gap: 12,
    marginBottom: 24,
  },
  statScrollCard: {
    width: 105,
    padding: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(20, 20, 22, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  activeScrollCard: {
    borderColor: 'rgba(212, 163, 115, 0.45)',
    backgroundColor: 'rgba(212, 163, 115, 0.08)',
  },
  statIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statScrollVal: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: '#FFFFFF',
  },
  statScrollLabel: {
    fontFamily: 'Cairo-Medium',
    fontSize: 10,
    color: '#8E99A8',
    marginTop: 2,
  },
  analyticsSection: {
    marginBottom: 24,
  },
  analyticsCard: {
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(16, 16, 18, 0.6)',
    padding: 20,
    overflow: 'hidden',
  },
  analyticsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  analyticsTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  analyticsSubtitle: {
    fontFamily: 'Cairo-Regular',
    fontSize: 12,
    color: '#8E99A8',
    marginTop: 2,
  },
  canvasContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  bonusCard: {
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: 'rgba(20, 20, 22, 0.6)',
    padding: 20,
    marginBottom: 24,
  },
  bonusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bonusIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(74, 222, 128, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bonusTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 13,
    color: '#FFFFFF',
  },
  bonusReward: {
    fontFamily: 'Cairo-Bold',
    fontSize: 11,
    color: '#4ADE80',
    marginTop: 2,
  },
  bonusProgressBadge: {
    backgroundColor: 'rgba(74, 222, 128, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  bonusProgressText: {
    fontFamily: 'Cairo-Bold',
    fontSize: 9,
    color: '#4ADE80',
  },
  progressContainer: {
    marginTop: 16,
    marginBottom: 12,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginVertical: 16,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  streakTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 12,
    color: '#FFFFFF',
  },
  streakSubtitle: {
    fontFamily: 'Cairo-Medium',
    fontSize: 11,
    color: '#8E99A8',
    marginTop: 2,
  },
  streakCircles: {
    flexDirection: 'row',
    gap: 6,
  },
  streakCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  streakCircleActive: {
    backgroundColor: '#D4A373',
    borderColor: '#D4A373',
  },
  streakCircleNext: {
    borderWidth: 1.5,
    borderColor: '#D4A373',
    backgroundColor: 'transparent',
  },
  streakCircleCheck: {
    color: '#1C1C1E',
    fontSize: 11,
    fontWeight: 'bold',
  },
  streakCirclePending: {
    color: '#D4A373',
    fontSize: 10,
    fontFamily: 'Poppins-Bold',
  },
  badgeItem: {
    alignItems: 'center',
    width: 80,
  },
  badgeOutline: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: 'rgba(212, 163, 115, 0.3)',
    backgroundColor: 'rgba(212, 163, 115, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#D4A373',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  badgeLabel: {
    fontFamily: 'Cairo-Bold',
    fontSize: 9,
    color: '#8E99A8',
    textAlign: 'center',
  },
  holoCard: {
    height: 180,
    borderRadius: 24,
    padding: 24,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    marginBottom: 24,
  },
  cardSheen: {
    position: 'absolute',
    top: -50,
    left: -50,
    width: 250,
    height: 250,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    transform: [{ rotate: '45deg' }],
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  cardType: {
    fontFamily: 'Cairo-Bold',
    fontSize: 9,
    color: '#FFE494',
    letterSpacing: 1.5,
  },
  chipGraphic: {
    width: 36,
    height: 26,
    borderRadius: 6,
    marginTop: 16,
    overflow: 'hidden',
  },
  cardMiddleRow: {
    marginTop: 20,
  },
  cardNumber: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#FFFFFF',
    letterSpacing: 3,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 10,
  },
  cardHolderLabel: {
    fontFamily: 'Cairo-Bold',
    fontSize: 8,
    color: 'rgba(255, 255, 255, 0.5)',
    letterSpacing: 1,
  },
  cardHolderName: {
    fontFamily: 'Poppins-Bold',
    fontSize: 12,
    color: '#FFFFFF',
    marginTop: 2,
  },
  cardBrandIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyCard: {
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: 'rgba(20, 20, 22, 0.6)',
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  transMethod: {
    fontFamily: 'Poppins-Bold',
    fontSize: 12,
    color: '#FFFFFF',
  },
  transDate: {
    fontFamily: 'Cairo-Regular',
    fontSize: 11,
    color: '#8E99A8',
    marginTop: 2,
  },
  historyRight: {
    alignItems: 'flex-end',
  },
  transAmount: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  transStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusSuccess: {
    backgroundColor: 'rgba(74, 222, 128, 0.12)',
  },
  statusProcessing: {
    backgroundColor: 'rgba(96, 165, 250, 0.12)',
  },
  transStatusText: {
    fontFamily: 'Cairo-Bold',
    fontSize: 8,
    letterSpacing: 0.5,
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
  },
  modalWrapper: {
    width: width * 0.88,
    maxWidth: 360,
  },
  modalCard: {
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(212, 163, 115, 0.3)',
    backgroundColor: 'rgba(10,10,12,0.98)',
    padding: 24,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  modalTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#FFFFFF',
    letterSpacing: 1.5,
  },
  modalBody: {
    fontFamily: 'Cairo-Medium',
    fontSize: 13,
    color: '#8E99A8',
    lineHeight: 20,
    marginBottom: 20,
  },
  cashoutBreakdown: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 16,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  breakdownLabel: {
    fontFamily: 'Cairo-Medium',
    fontSize: 12,
    color: '#8E99A8',
  },
  breakdownVal: {
    fontFamily: 'Poppins-Bold',
    fontSize: 13,
    color: '#FFFFFF',
  },
  breakdownLabelTotal: {
    fontFamily: 'Cairo-Bold',
    fontSize: 13,
    color: '#D4A373',
  },
  breakdownValTotal: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#D4A373',
  },
  destinationDisclaimer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  disclaimerText: {
    flex: 1,
    fontFamily: 'Cairo-Medium',
    fontSize: 11,
    color: '#8E99A8',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 12,
    color: '#8E99A8',
  },
  confirmBtn: {
    flex: 1.8,
    borderRadius: 14,
    overflow: 'hidden',
  },
  confirmGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  confirmText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 12,
    color: '#1C1C1E',
    letterSpacing: 1,
  },
  statusPanel: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
  },
  statusPanelTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: '#FFFFFF',
    letterSpacing: 1,
    marginBottom: 8,
    textAlign: 'center',
  },
  statusPanelSub: {
    fontFamily: 'Cairo-Medium',
    fontSize: 12,
    color: '#8E99A8',
    textAlign: 'center',
    lineHeight: 18,
  },
  successCheckCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(74, 222, 128, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'rgba(74, 222, 128, 0.3)',
  }
});
