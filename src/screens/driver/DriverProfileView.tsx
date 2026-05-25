import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Switch, 
  Dimensions, 
  Modal,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, { 
  FadeInDown, 
  FadeInUp, 
  Layout, 
  ZoomIn 
} from 'react-native-reanimated';
import { 
  User, 
  Star, 
  ShieldCheck, 
  Truck, 
  Coins, 
  Settings, 
  LogOut, 
  ChevronRight, 
  Check, 
  Bell, 
  Globe, 
  Moon, 
  ShieldAlert,
  HelpCircle,
  TrendingUp,
  FileText,
  Sparkles,
  Shield
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

export const DriverProfileView = () => {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isLogoutOpen, setIsLogoutOpen] = useState<boolean>(false);

  const handleConfirmLogout = () => {
    setIsLogoutOpen(false);
  };

  return (
    <ScrollView 
      contentContainerStyle={{ paddingBottom: 150, paddingHorizontal: 20 }}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. IDENTITY HEADER */}
      <Animated.View entering={FadeInDown.duration(600).delay(100)} className="items-center mt-6 mb-8">
        <View className="relative justify-center items-center mb-4">
            <View className={`absolute w-[104] h-[104] rounded-full border-[2.5px] opacity-30 shadow-xl ${isOnline ? 'border-rose-400 shadow-rose-400/50' : 'border-slate-300'}`} />
            <View className={`w-24 h-24 rounded-full bg-white border-2 items-center justify-center shadow-lg ${isOnline ? 'border-rose-200' : 'border-slate-200'}`}>
                <Text className={`font-poppins-bold text-3xl ${isOnline ? 'text-rose-400' : 'text-slate-400'}`}>MS</Text>
            </View>
            <View className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-rose-400 items-center justify-center border-2 border-white shadow-md">
                <Check size={14} color="#FFFFFF" strokeWidth={3} />
            </View>
        </View>

        <Text className="font-poppins-bold text-2xl text-adminText">Michael Sterling</Text>
        <Text className="font-cairo-bold text-[10px] text-adminMuted tracking-[2px] mt-1 uppercase">Driver ID: #FP-99281</Text>
        
        <View className="flex-row items-center gap-3 mt-4 mb-6">
            <View className={`flex-row items-center px-3 py-1.5 rounded-xl border ${isOnline ? 'bg-green-50 border-green-100' : 'bg-slate-50 border-slate-100'}`}>
                <View className={`w-1.5 h-1.5 rounded-full mr-2 ${isOnline ? 'bg-green-500' : 'bg-slate-400'}`} />
                <Text className={`font-cairo-bold text-[9px] tracking-widest ${isOnline ? 'text-green-600' : 'text-slate-500'}`}>{isOnline ? 'ONLINE' : 'OFFLINE'}</Text>
            </View>
            <View className="flex-row items-center bg-gold/10 px-3 py-1.5 rounded-xl border border-gold/20">
                <Star size={12} color="#D4A373" className="mr-2" />
                <Text className="font-poppins-bold text-[9px] text-gold tracking-widest uppercase">Platinum Class</Text>
            </View>
        </View>

        <View className="w-full bg-white/70 rounded-[32px] border border-rose-200/30 p-5 shadow-sm overflow-hidden">
            <LinearGradient
                colors={['rgba(248, 182, 200, 0.05)', 'transparent']}
                style={StyleSheet.absoluteFillObject}
            />
            <View className="flex-row items-center justify-between">
                <View className="flex-1">
                    <Text className="font-poppins-bold text-sm text-adminText">Duty Status</Text>
                    <Text className="font-cairo-medium text-[11px] text-adminMuted mt-0.5">
                        {isOnline ? 'Active on pastry routing stream' : 'Paused. Delivery offers locked.'}
                    </Text>
                </View>
                <Switch
                    value={isOnline}
                    onValueChange={setIsOnline}
                    trackColor={{ false: '#E2E8F0', true: '#FEE2E2' }}
                    thumbColor={isOnline ? '#F8B6C8' : '#94A3B8'}
                />
            </View>
        </View>
      </Animated.View>

      {/* 2. PERFORMANCE LEDGER */}
      <Animated.View entering={FadeInDown.duration(600).delay(200)}>
        <View className="flex-row items-center mb-4 ml-1">
            <TrendingUp size={14} color="#D4A373" />
            <Text className="ml-2 font-cairo-bold text-gold/80 text-[10px] tracking-widest uppercase">Performance Ledger</Text>
        </View>
        <View className="flex-row flex-wrap gap-4">
            {[
                { label: "Completed", val: "142", icon: Truck, color: "#D4A373", trend: "+12 this week" },
                { label: "Success Rate", val: "98%", icon: TrendingUp, color: "#4ADE80", trend: "Platinum Standard" },
                { label: "Satisfaction", val: "4.98", icon: Star, color: "#FBBF24", trend: "Based on 130 reviews" },
                { label: "Month Earn", val: "$3.4K", icon: Coins, color: "#F8B6C8", trend: "Paid Instantly" },
            ].map((stat, i) => (
                <View key={i} className="w-[47%] bg-white/70 rounded-3xl p-5 border border-rose-200/20 shadow-sm">
                    <View className="w-10 h-10 rounded-xl items-center justify-center mb-4" style={{ backgroundColor: `${stat.color}15` }}>
                        <stat.icon size={18} color={stat.color} />
                    </View>
                    <Text className="font-poppins-bold text-xl text-adminText">{stat.val}</Text>
                    <Text className="font-cairo-medium text-[10px] text-adminMuted">{stat.label}</Text>
                    <Text className="font-cairo-bold text-[9px] mt-2" style={{ color: stat.color }}>{stat.trend}</Text>
                </View>
            ))}
        </View>
      </Animated.View>

      {/* 3. VEHICLE CONFIG */}
      <Animated.View entering={FadeInDown.duration(600).delay(300)} className="mt-8">
        <View className="flex-row items-center mb-4 ml-1">
            <Truck size={14} color="#D4A373" />
            <Text className="ml-2 font-cairo-bold text-gold/80 text-[10px] tracking-widest uppercase">Active Vehicle</Text>
        </View>
        <View className="bg-white/70 rounded-[32px] border border-rose-200/30 overflow-hidden shadow-sm">
          <LinearGradient
            colors={['rgba(248, 182, 200, 0.05)', 'transparent']}
            style={StyleSheet.absoluteFillObject}
          />
          <BlurView intensity={20} tint="light" className="p-6">
            <View className="flex-row items-center mb-6">
                <View className="w-12 h-12 rounded-2xl bg-rose-50 items-center justify-center">
                    <Truck size={22} color="#F8B6C8" />
                </View>
                <View className="ml-4 flex-1">
                    <Text className="font-poppins-bold text-sm text-adminText">Mercedes Sprinter 2500</Text>
                    <Text className="font-cairo-medium text-[11px] text-adminMuted mt-0.5">Refrigerated Pastry Compartment</Text>
                </View>
            </View>

            <View className="h-[1] bg-rose-200/20 mb-6" />

            <View className="flex-row justify-between">
                <View className="items-center flex-1">
                    <Text className="font-cairo-bold text-[8px] text-adminMuted tracking-widest uppercase mb-1">Plate</Text>
                    <Text className="font-poppins-bold text-xs text-adminText">PST-RY77</Text>
                </View>
                <View className="w-px h-8 bg-rose-200/20" />
                <View className="items-center flex-1">
                    <Text className="font-cairo-bold text-[8px] text-adminMuted tracking-widest uppercase mb-1">Telemetry</Text>
                    <Text className="font-poppins-bold text-xs text-green-500">64°F Stable</Text>
                </View>
                <View className="w-px h-8 bg-rose-200/20" />
                <View className="items-center flex-1">
                    <Text className="font-cairo-bold text-[8px] text-adminMuted tracking-widest uppercase mb-1">Insurance</Text>
                    <Text className="font-poppins-bold text-xs text-green-500">Active</Text>
                </View>
            </View>
          </BlurView>
        </View>
      </Animated.View>

      {/* 4. DOCUMENTS */}
      <Animated.View entering={FadeInDown.duration(600).delay(400)} className="mt-8">
        <View className="flex-row items-center mb-4 ml-1">
            <Shield size={14} color="#D4A373" />
            <Text className="ml-2 font-cairo-bold text-gold/80 text-[10px] tracking-widest uppercase">Verifications</Text>
        </View>
        <View className="bg-white/70 rounded-[32px] border border-rose-200/30 overflow-hidden shadow-sm">
          <BlurView intensity={20} tint="light" className="p-4">
            {[
                "Government issued ID Card",
                "Commercial Driver's License",
                "Specialized Pastry Permit"
            ].map((doc, i) => (
                <View key={i}>
                    <View className="flex-row items-center justify-between py-3 px-2">
                        <View className="flex-row items-center flex-1">
                            <View className="w-9 h-9 rounded-xl bg-blue-50 items-center justify-center mr-4">
                                <FileText size={18} color="#60A5FA" />
                            </View>
                            <View>
                                <Text className="font-poppins-bold text-xs text-adminText">{doc}</Text>
                                <Text className="font-cairo-medium text-[10px] text-adminMuted mt-0.5">Verified • Valid</Text>
                            </View>
                        </View>
                        <View className="w-5 h-5 rounded-full bg-green-500 items-center justify-center shadow-sm">
                            <Check size={12} color="#FFFFFF" strokeWidth={3} />
                        </View>
                    </View>
                    {i < 2 && <View className="h-[1] bg-rose-200/10 mx-2" />}
                </View>
            ))}
          </BlurView>
        </View>
      </Animated.View>

      {/* 5. PREFERENCES */}
      <Animated.View entering={FadeInDown.duration(600).delay(500)} className="mt-8">
        <View className="flex-row items-center mb-4 ml-1">
            <Settings size={14} color="#D4A373" />
            <Text className="ml-2 font-cairo-bold text-gold/80 text-[10px] tracking-widest uppercase">Preferences</Text>
        </View>
        <View className="bg-white/70 rounded-[32px] border border-rose-200/30 overflow-hidden shadow-sm px-4">
            {[
                { label: "Account Profile", icon: User, color: "#8E99A8" },
                { label: "Alert Filters", icon: Bell, color: "#8E99A8" },
                { label: "Language", icon: Globe, val: "English", color: "#8E99A8" },
                { label: "Sign out session", icon: LogOut, color: "#EF4444", danger: true },
            ].map((item, i) => (
                <TouchableOpacity 
                    key={i} 
                    onPress={() => item.danger && setIsLogoutOpen(true)}
                    activeOpacity={0.7}
                    className={`flex-row items-center justify-between py-5 ${i < 3 ? 'border-b border-rose-200/10' : ''}`}
                >
                    <View className="flex-row items-center">
                        <View className={`w-9 h-9 rounded-xl items-center justify-center mr-4 ${item.danger ? 'bg-red-50' : 'bg-slate-50'}`}>
                            <item.icon size={18} color={item.color} />
                        </View>
                        <Text className={`font-cairo-bold text-sm ${item.danger ? 'text-red-500' : 'text-adminText'}`}>{item.label}</Text>
                    </View>
                    <View className="flex-row items-center">
                        {item.val && <Text className="font-cairo-medium text-xs text-adminMuted mr-3">{item.val}</Text>}
                        <ChevronRight size={18} color={item.danger ? "#EF4444" : "#8E99A8"} />
                    </View>
                </TouchableOpacity>
            ))}
        </View>
      </Animated.View>

      {/* LOGOUT MODAL */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isLogoutOpen}
        onRequestClose={() => setIsLogoutOpen(false)}
      >
        <View className="flex-1 justify-center items-center bg-adminText/60 p-6">
          <BlurView intensity={60} tint="dark" className="absolute inset-0" />
          <Animated.View entering={ZoomIn.duration(300)} className="w-full max-w-[340px]">
             <View className="bg-white rounded-[40px] border border-rose-200/50 shadow-2xl p-8 overflow-hidden">
                <LinearGradient colors={['rgba(239, 68, 68, 0.05)', 'transparent']} style={StyleSheet.absoluteFillObject} />
                <View className="items-center">
                    <View className="w-20 h-20 rounded-full bg-red-50 items-center justify-center mb-6">
                        <ShieldAlert size={40} color="#EF4444" />
                    </View>
                    <Text className="font-poppins-bold text-xl text-adminText text-center uppercase tracking-widest">End Session?</Text>
                    <Text className="font-cairo-medium text-sm text-adminMuted text-center mt-3 leading-relaxed mb-8">
                        You will stop receiving routing requests. Are you sure you want to log out?
                    </Text>
                </View>
                <View className="flex-row gap-3">
                    <TouchableOpacity 
                      activeOpacity={0.8}
                      onPress={() => setIsLogoutOpen(false)}
                      className="flex-1 h-14 rounded-2xl bg-slate-50 items-center justify-center border border-slate-100"
                    >
                      <Text className="font-poppins-bold text-xs text-slate-400 uppercase tracking-widest">STAY</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      activeOpacity={0.8}
                      onPress={handleConfirmLogout}
                      className="flex-[1.5] h-14 rounded-2xl bg-red-500 items-center justify-center shadow-lg shadow-red-500/30"
                    >
                        <Text className="font-poppins-bold text-white text-xs uppercase tracking-widest">LOG OUT</Text>
                    </TouchableOpacity>
                </View>
             </View>
          </Animated.View>
        </View>
      </Modal>
    </ScrollView>
  );
};
