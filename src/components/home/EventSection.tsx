import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Calendar, ChevronRight, Gift } from 'lucide-react-native';
import { theme } from '../../theme';
import { GlassBox } from '../ui/GlassBox';
import { LinearGradient } from 'expo-linear-gradient';

export const EventSection: React.FC = () => {
  return (
    <View className="px-6 mb-10">
      <View className="flex-row justify-between items-center mb-5">
        <Text className="font-poppins-bold text-2xl text-deepBrown tracking-wide">Event Reminders</Text>
        <TouchableOpacity>
            <Calendar size={22} color={theme.colors.secondary} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity activeOpacity={0.9}>
        <LinearGradient
            colors={[theme.colors.primary, theme.colors.rosePastel]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="rounded-[32px] p-6 shadow-lg shadow-primary/20"
        >
            <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                    <View className="w-14 h-14 bg-white/30 rounded-2xl items-center justify-center border border-white/40">
                        <Gift size={28} color="white" />
                    </View>
                    <View className="ml-4 flex-1">
                        <Text className="font-poppins-bold text-white text-lg leading-6">
                            Sarah's Birthday
                        </Text>
                        <Text className="font-poppins text-white/80 text-sm mt-1">
                            In 3 days • Needs a custom cake
                        </Text>
                    </View>
                </View>
                <ChevronRight size={24} color="white" />
            </View>

            <View className="mt-6 pt-6 border-t border-white/20">
                <GlassBox intensity={20} style={{ padding: 12, borderRadius: 16, flexDirection: 'row', alignItems: 'center' }}>
                    <Text className="font-poppins-bold text-white text-xs tracking-wide">
                        View Suggested Personalizations
                    </Text>
                </GlassBox>
            </View>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};
