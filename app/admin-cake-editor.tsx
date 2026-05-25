import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, TextInput, StyleSheet, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';
import { 
  ArrowLeft, 
  Upload, 
  Plus, 
  Trash2, 
  Save, 
  Eye, 
  EyeOff, 
  DollarSign, 
  Package, 
  ChevronRight,
  Info,
  Sparkles
} from 'lucide-react-native';
import { AppHeader } from '../src/components/common/AppHeader';

const { width } = Dimensions.get('window');

export default function AdminCakeEditorScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const isEditing = !!id;

  const [form, setForm] = useState({
    title: isEditing ? 'Midnight Velvet' : '',
    description: isEditing ? 'A classic cocoa-rich velvet cake with cream cheese frosting and a hint of gold dust.' : '',
    ingredients: isEditing ? 'Cocoa, Flour, Butter, Cream Cheese, Gold Leaf' : '',
    price: isEditing ? '85.00' : '',
    stock: isEditing ? '24' : '',
    category: isEditing ? 'Signature' : 'Select Category',
    isVisibilityOn: true,
    isFeatured: isEditing ? true : false,
  });

  const [customizations, setCustomizations] = useState([
    { id: '1', label: 'Size', options: 'Small, Medium, Large' },
    { id: '2', label: 'Flavors', options: 'Vanilla, Chocolate, Red Velvet' },
  ]);

  const addCustomization = () => {
    setCustomizations([...customizations, { id: Math.random().toString(), label: '', options: '' }]);
  };

  const removeCustomization = (id: string) => {
    setCustomizations(customizations.filter(c => c.id !== id));
  };

  return (
    <View className="flex-1 bg-adminBg">
      <LinearGradient
        colors={['#FFF8F2', '#FADADD', '#F8B6C8']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      
      {/* Ambient Gloss Effects */}
      <View className="absolute -top-[100] -left-[100] w-[400] h-[400] rounded-full bg-white/40 blur-[100px]" pointerEvents="none" />
      <View className="absolute bottom-[100] -right-[150] w-[350] h-[350] rounded-full bg-gold/10 blur-[100px]" pointerEvents="none" />

      <ScrollView 
        contentContainerStyle={{ paddingBottom: 150 }}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}
      >
        {/* Universal Modern Header */}
        <AppHeader 
          title={isEditing ? 'Edit Cake' : 'New Cake'}
          subtitle="Inventory Editor"
          showBack
          onBackPress={() => router.back()}
        />

        <View className="px-6">
          {/* IMAGE UPLOAD SECTION */}
          <Animated.View entering={FadeInUp.duration(600)} className="mb-8">
            <View className="flex-row items-center mb-3 px-1">
               <Sparkles size={14} color="#D4A373" />
               <Text className="ml-2 font-cairo-bold text-gold/80 text-[10px] tracking-widest uppercase">Product Media</Text>
            </View>
            <TouchableOpacity className="relative h-56 w-full rounded-[32px] overflow-hidden border-2 border-dashed border-rose-200/50 bg-white/60 items-center justify-center shadow-sm">
              {isEditing ? (
                <Image 
                  source={{ uri: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=600&auto=format&fit=crop' }}
                  style={{ width: '100%', height: '100%', opacity: 0.8 }}
                />
              ) : null}
              <View className="absolute items-center">
                <View className="w-14 h-14 rounded-full bg-rose-100 items-center justify-center border border-rose-200/50 mb-3 shadow-inner">
                  <Upload size={24} color="#D4A373" />
                </View>
                <Text className="font-poppins-bold text-adminText text-sm">Upload Cover Image</Text>
                <Text className="font-cairo-medium text-adminMuted text-[10px]">PNG, JPG up to 10MB</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* BASIC INFORMATION */}
          <Animated.View entering={FadeInDown.duration(600).delay(100)} className="mb-8">
             <Text className="font-cairo-bold text-gold/80 text-[10px] tracking-widest uppercase mb-3 px-1">General Details</Text>
             <View className="bg-white/70 rounded-[32px] border border-rose-200/30 p-6 gap-6 shadow-sm overflow-hidden">
                <BlurView intensity={40} tint="light" style={StyleSheet.absoluteFillObject} />
                <View>
                   <Text className="font-cairo-bold text-[10px] text-adminMuted mb-2">CAKE TITLE</Text>
                   <TextInput 
                      value={form.title}
                      onChangeText={(t) => setForm({...form, title: t})}
                      className="bg-white/60 rounded-2xl border border-rose-200/50 px-5 h-14 text-adminText font-poppins text-sm shadow-sm"
                      placeholder="Enter cake name..."
                      placeholderTextColor="#A18E8B"
                   />
                </View>

                <View>
                   <Text className="font-cairo-bold text-[10px] text-adminMuted mb-2">DESCRIPTION</Text>
                   <TextInput 
                      value={form.description}
                      onChangeText={(t) => setForm({...form, description: t})}
                      className="bg-white/60 rounded-2xl border border-rose-200/50 px-5 py-4 min-h-[120] text-adminText font-poppins text-sm shadow-sm"
                      placeholder="Enter detailed description..."
                      placeholderTextColor="#A18E8B"
                      multiline
                      textAlignVertical="top"
                   />
                </View>

                <View>
                   <Text className="font-cairo-bold text-[10px] text-adminMuted mb-2">INGREDIENTS</Text>
                   <TextInput 
                      value={form.ingredients}
                      onChangeText={(t) => setForm({...form, ingredients: t})}
                      className="bg-white/60 rounded-2xl border border-rose-200/50 px-5 py-4 text-adminText font-poppins text-sm shadow-sm"
                      placeholder="Comma separated ingredients..."
                      placeholderTextColor="#A18E8B"
                   />
                </View>
             </View>
          </Animated.View>

          {/* PRICING & INVENTORY */}
          <Animated.View entering={FadeInDown.duration(600).delay(200)} className="mb-8">
             <Text className="font-cairo-bold text-gold/80 text-[10px] tracking-widest uppercase mb-3 px-1">Pricing & Inventory</Text>
             <View className="bg-white/70 rounded-[32px] border border-rose-200/30 p-6 flex-row gap-4 shadow-sm overflow-hidden">
                <BlurView intensity={40} tint="light" style={StyleSheet.absoluteFillObject} />
                <View className="flex-1">
                   <Text className="font-cairo-bold text-[10px] text-adminMuted mb-2">PRICE ($)</Text>
                   <View className="flex-row items-center bg-white/60 rounded-2xl border border-rose-200/50 px-5 h-14 shadow-sm">
                      <DollarSign size={14} color="#D4A373" />
                      <TextInput 
                        value={form.price}
                        keyboardType="numeric"
                        onChangeText={(t) => setForm({...form, price: t})}
                        className="flex-1 ml-2 text-adminText font-poppins text-sm"
                      />
                   </View>
                </View>

                <View className="flex-1">
                   <Text className="font-cairo-bold text-[10px] text-adminMuted mb-2">STOCK LEVEL</Text>
                   <View className="flex-row items-center bg-white/60 rounded-2xl border border-rose-200/50 px-5 h-14 shadow-sm">
                      <Package size={14} color="#D4A373" />
                      <TextInput 
                        value={form.stock}
                        keyboardType="numeric"
                        onChangeText={(t) => setForm({...form, stock: t})}
                        className="flex-1 ml-2 text-adminText font-poppins text-sm"
                      />
                   </View>
                </View>
             </View>
          </Animated.View>

          {/* CUSTOMIZATIONS */}
          <Animated.View entering={FadeInDown.duration(600).delay(300)} className="mb-8">
             <View className="flex-row justify-between items-center mb-3 px-1">
                <Text className="font-cairo-bold text-gold/80 text-[10px] tracking-widest uppercase">Customization Options</Text>
                <TouchableOpacity onPress={addCustomization} className="w-8 h-8 rounded-full bg-gold/10 items-center justify-center">
                   <Plus size={16} color="#D4A373" />
                </TouchableOpacity>
             </View>
             
             <View className="gap-4">
                {customizations.map((item, index) => (
                  <View key={item.id} className="bg-white/70 rounded-[28px] border border-rose-200/30 p-5 shadow-sm overflow-hidden">
                     <BlurView intensity={40} tint="light" style={StyleSheet.absoluteFillObject} />
                     <View className="flex-row items-center justify-between mb-4">
                        <TextInput 
                          value={item.label}
                          placeholder="Option name (e.g. Size)"
                          placeholderTextColor="#A18E8B"
                          className="font-poppins-bold text-adminText text-sm flex-1"
                        />
                        <TouchableOpacity onPress={() => removeCustomization(item.id)} className="w-8 h-8 rounded-lg bg-rose-100 items-center justify-center">
                           <Trash2 size={16} color="#F43F5E" />
                        </TouchableOpacity>
                     </View>
                     <TextInput 
                        value={item.options}
                        placeholder="Values (comma separated)"
                        placeholderTextColor="#A18E8B"
                        className="bg-white/60 rounded-2xl border border-rose-200/50 px-5 h-12 text-adminText font-poppins text-xs shadow-sm"
                     />
                  </View>
                ))}
             </View>
          </Animated.View>

          {/* SETTINGS & VISIBILITY */}
          <Animated.View entering={FadeInDown.duration(600).delay(400)} className="mb-10">
             <Text className="font-cairo-bold text-gold/80 text-[10px] tracking-widest uppercase mb-3 px-1">Visibility & Promotion</Text>
             <View className="bg-white/70 rounded-[32px] border border-rose-200/30 p-6 gap-6 shadow-sm overflow-hidden">
                <BlurView intensity={40} tint="light" style={StyleSheet.absoluteFillObject} />
                <View className="flex-row items-center justify-between">
                   <View className="flex-row items-center">
                      <View className="w-10 h-10 rounded-xl bg-white/60 items-center justify-center mr-4 border border-rose-200/30">
                        <Eye size={16} color={form.isVisibilityOn ? '#4ADE80' : '#8C7A77'} />
                      </View>
                      <View>
                         <Text className="font-poppins-bold text-adminText text-sm">Online Visibility</Text>
                         <Text className="font-cairo-medium text-adminMuted text-[10px]">Show in public catalog</Text>
                      </View>
                   </View>
                   <Switch 
                      value={form.isVisibilityOn}
                      onValueChange={(v) => setForm({...form, isVisibilityOn: v})}
                      trackColor={{ false: '#E2E8F0', true: '#4ADE80' }}
                      thumbColor="#FFFFFF"
                   />
                </View>

                <View className="h-[1px] w-full bg-rose-200/10" />

                <View className="flex-row items-center justify-between">
                   <View className="flex-row items-center">
                      <View className="w-10 h-10 rounded-xl bg-white/60 items-center justify-center mr-4 border border-rose-200/30">
                        <Sparkles size={16} color={form.isFeatured ? '#D4A373' : '#8C7A77'} />
                      </View>
                      <View>
                         <Text className="font-poppins-bold text-adminText text-sm">Feature on Home</Text>
                         <Text className="font-cairo-medium text-adminMuted text-[10px]">Boost visibility for this cake</Text>
                      </View>
                   </View>
                   <Switch 
                      value={form.isFeatured}
                      onValueChange={(v) => setForm({...form, isFeatured: v})}
                      trackColor={{ false: '#E2E8F0', true: '#D4A373' }}
                      thumbColor="#FFFFFF"
                   />
                </View>
             </View>
          </Animated.View>
        </View>
      </ScrollView>

      {/* STICKY FOOTER ACTIONS */}
      <BlurView intensity={90} tint="light" className="absolute bottom-0 left-0 right-0 p-8 border-t border-rose-200/30">
         <View className="flex-row gap-4">
            <TouchableOpacity 
               onPress={() => router.back()}
               className="flex-1 h-14 rounded-2xl bg-white/80 border border-rose-200/50 items-center justify-center shadow-sm"
            >
               <Text className="font-poppins-bold text-adminText text-base">Discard</Text>
            </TouchableOpacity>
            <TouchableOpacity 
               onPress={() => router.back()}
               className="flex-[1.5] h-14 rounded-2xl bg-rose-400 items-center justify-center shadow-xl shadow-rose-400/30"
            >
               <View className="flex-row items-center">
                  <Save size={20} color="#FFFFFF" />
                  <Text className="ml-2 font-poppins-bold text-white text-base">{isEditing ? 'Save Changes' : 'Create Product'}</Text>
               </View>
            </TouchableOpacity>
         </View>
      </BlurView>
    </View>
  );
}
