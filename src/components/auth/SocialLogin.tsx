import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { theme } from '../../theme';

export const SocialLogin: React.FC = () => {
  return (
    <View className="mt-8">
      <View className="flex-row items-center mb-8">
        <View className="flex-1 h-[1px] bg-secondary/20" />
        <Text className="mx-4 font-poppins text-xs text-[#8C7A77] uppercase tracking-widest">
            or continue with
        </Text>
        <View className="flex-1 h-[1px] bg-secondary/20" />
      </View>

      <View className="flex-row justify-center gap-6">
        <SocialButton 
          icon="https://cdn-icons-png.flaticon.com/512/2991/2991148.png" 
          onPress={() => {}} 
        />
        <SocialButton 
          icon="https://cdn-icons-png.flaticon.com/512/0/747.png" 
          onPress={() => {}} 
        />
        <SocialButton 
          icon="https://cdn-icons-png.flaticon.com/512/124/124010.png" 
          onPress={() => {}} 
        />
      </View>
    </View>
  );
};

const SocialButton = ({ icon, onPress }: { icon: string; onPress: () => void }) => (
  <TouchableOpacity 
    onPress={onPress}
    className="w-14 h-14 rounded-2xl bg-white/50 border border-white/80 justify-center items-center shadow-sm"
    style={{ elevation: 2 }}
  >
    <Image source={{ uri: icon }} style={{ width: 24, height: 24 }} resizeMode="contain" />
  </TouchableOpacity>
);
