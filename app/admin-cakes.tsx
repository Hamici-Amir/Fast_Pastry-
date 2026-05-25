import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, TextInput, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation, useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { 
  Menu, 
  Search, 
  Bell, 
  Plus, 
  Filter, 
  SlidersHorizontal,
  ChevronDown,
  LayoutGrid,
  List,
  Sparkles
} from 'lucide-react-native';

import { AppHeader } from '../src/components/common/AppHeader';
import { AdminCakeCard } from '../src/components/ui/AdminCakeCard';

const { width } = Dimensions.get('window');

// MOCK DATA
const CAKES = [
  { 
    id: 'C-001', 
    name: 'Midnight Velvet', 
    category: 'Signature', 
    price: '$85.00', 
    stock: 24, 
    isFeatured: true,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=400&auto=format&fit=crop' 
  },
  { 
    id: 'C-002', 
    name: 'Golden Praline', 
    category: 'Premium', 
    price: '$92.00', 
    stock: 12, 
    isFeatured: false,
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=400&auto=format&fit=crop' 
  },
  { 
    id: 'C-003', 
    name: 'Rose Bloom', 
    category: 'Wedding', 
    price: '$120.00', 
    stock: 5, 
    isFeatured: true,
    image: 'https://images.unsplash.com/photo-1535254973040-607b474cb8c2?q=80&w=400&auto=format&fit=crop' 
  },
  { 
    id: 'C-004', 
    name: 'Classic Berry', 
    category: 'Signature', 
    price: '$65.00', 
    stock: 45, 
    isFeatured: false,
    image: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?q=80&w=400&auto=format&fit=crop' 
  },
  { 
    id: 'C-005', 
    name: 'Citrus Zest', 
    category: 'Summer', 
    price: '$58.00', 
    stock: 0, 
    isFeatured: false,
    image: 'https://images.unsplash.com/photo-1519340333755-5ec8039c9f0c?q=80&w=400&auto=format&fit=crop' 
  },
];

const CATEGORIES = ['All Cakes', 'Signature', 'Premium', 'Wedding', 'Summer', 'Classic'];

export default function AdminCakesScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('All Cakes');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredCakes = CAKES.filter(cake => {
    const matchesCategory = activeCategory === 'All Cakes' || cake.category === activeCategory;
    const matchesSearch = cake.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <View className="flex-1 bg-background">
      <ScrollView 
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}
      >
        <AppHeader 
          title="Catalog" 
          subtitle="Admin Hub" 
          showBell 
          hasNotifications
        />

        <View className="px-6 pt-8">
          {/* HEADER SECTION */}
          <View className="flex-row justify-between items-end mb-8">
            <View>
              <View className="flex-row items-center mb-1">
                <Sparkles size={14} color="#D4A373" />
                <Text className="ml-2 font-cairo-medium text-gold/80 text-[10px] tracking-widest uppercase">Premium Inventory</Text>
              </View>
              <Text className="font-poppins-bold text-3xl text-adminText tracking-tightest">Cakes Library</Text>
            </View>
            <TouchableOpacity 
              onPress={() => router.push('/admin-cake-editor')}
              className="bg-gold px-4 py-3 rounded-2xl flex-row items-center shadow-xl shadow-[#D4A373]/20"
            >
              <Plus size={18} color="#FFFFFF" />
              <Text className="ml-2 font-poppins-bold text-white text-sm">Add Cake</Text>
            </TouchableOpacity>
          </View>

          {/* SEARCH & FILTERS */}
          <View className="mb-8">
            <View className="flex-row items-center h-12 bg-surface rounded-2xl px-4 border border-[#D4A373]/10 mb-4 shadow-sm">
              <Search size={18} color="#8C7A77" />
              <TextInput 
                placeholder="Search catalog..." 
                placeholderTextColor="#A18E8B"
                value={searchQuery}
                onChangeText={setSearchQuery}
                className="flex-1 ml-3 text-adminText font-poppins text-sm"
              />
              <TouchableOpacity className="ml-2 w-8 h-8 items-center justify-center rounded-lg bg-gold/10">
                <SlidersHorizontal size={14} color="#D4A373" />
              </TouchableOpacity>
            </View>

            <View className="flex-row justify-between items-center mb-4">
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                {CATEGORIES.map((cat, i) => ( activeCategory === cat ? (
                  <TouchableOpacity 
                    key={i}
                    onPress={() => setActiveCategory(cat)}
                    className="px-5 py-2 rounded-xl bg-gold border border-gold shadow-sm"
                  >
                    <Text className="font-poppins-bold text-xs text-white">
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity 
                    key={i}
                    onPress={() => setActiveCategory(cat)}
                    className="px-5 py-2 rounded-xl border border-[#D4A373]/10 bg-surface shadow-sm"
                  >
                    <Text className="font-poppins-bold text-xs text-adminMuted">
                      {cat}
                    </Text>
                  </TouchableOpacity>
                )))}
              </ScrollView>
              
              <View className="flex-row bg-surface rounded-xl border border-[#D4A373]/10 p-1 ml-4 shadow-sm">
                <TouchableOpacity 
                  onPress={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-[#D4A373]/10' : ''}`}
                >
                  <LayoutGrid size={14} color={viewMode === 'grid' ? '#2C1B18' : '#8C7A77'} />
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-[#D4A373]/10' : ''}`}
                >
                  <List size={14} color={viewMode === 'list' ? '#2C1B18' : '#8C7A77'} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* CAKES GRID */}
          <View className="flex-row flex-wrap justify-between">
            {filteredCakes.map((cake, i) => (
              <AdminCakeCard 
                key={cake.id} 
                {...cake} 
                index={i} 
                onEdit={() => router.push(`/admin-cake-editor?id=${cake.id}`)}
                onDelete={() => {}}
              />
            ))}
          </View>

          {filteredCakes.length === 0 && (
            <View className="py-20 items-center justify-center">
              <Text className="font-poppins-bold text-adminText text-lg">No cakes found</Text>
              <Text className="font-cairo-medium text-adminMuted text-sm mt-2">Try a different category or search term</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
