import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Search, SlidersHorizontal } from 'lucide-react-native';
import { theme } from '../../theme';
import { GlassBox } from '../ui/GlassBox';

export const SearchBar: React.FC = () => {
  return (
    <View className="px-6 mb-8 mt-2">
      <GlassBox intensity={20} style={{ borderRadius: 16, height: 56, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 }}>
        <Search size={20} color={theme.colors.textMuted} />
        <TextInput 
          placeholder="Search for cakes, desserts..."
          className="flex-1 ml-3 font-poppins text-deepBrown"
          placeholderTextColor={theme.colors.textMuted}
        />
        <TouchableOpacity className="w-10 h-10 bg-primary/20 rounded-xl items-center justify-center">
            <SlidersHorizontal size={20} color={theme.colors.primary} />
        </TouchableOpacity>
      </GlassBox>
    </View>
  );
};
