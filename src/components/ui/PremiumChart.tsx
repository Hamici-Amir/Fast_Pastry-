import React, { useEffect } from 'react';
import { View, Text, Dimensions } from 'react-native';
import Svg, { Path, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import Animated, { 
  useAnimatedProps, 
  useSharedValue, 
  withTiming, 
  Easing 
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const AnimatedPath = Animated.createAnimatedComponent(Path);

interface PremiumChartProps {
  data: number[];
  color?: string;
  height?: number;
  width?: number;
}

export const PremiumChart: React.FC<PremiumChartProps> = ({ 
  data, 
  color = '#D4A373', 
  height = 120, 
  width = SCREEN_WIDTH - 80 
}) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(1, { 
      duration: 2000, 
      easing: Easing.bezier(0.25, 0.1, 0.25, 1) 
    });
  }, []);

  const maxValue = Math.max(...data);
  const stepX = width / (data.length - 1);
  
  const points = data.map((val, i) => ({
    x: i * stepX,
    y: height - (val / maxValue) * height * 0.8 - 20
  }));

  // Create smooth curved path
  let pathData = `M ${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const curr = points[i];
    const next = points[i + 1];
    const controlX = (curr.x + next.x) / 2;
    pathData += ` C ${controlX},${curr.y} ${controlX},${next.y} ${next.x},${next.y}`;
  }

  const fillPathData = `${pathData} L ${width},${height} L 0,${height} Z`;

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: (1 - progress.value) * 1000,
  }));

  return (
    <View className="items-center justify-center py-4">
      <Svg width={width} height={height}>
        <Defs>
          <SvgLinearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={color} stopOpacity="0.3" />
            <Stop offset="1" stopColor={color} stopOpacity="0" />
          </SvgLinearGradient>
        </Defs>
        
        {/* Fill */}
        <Path d={fillPathData} fill="url(#gradient)" />
        
        {/* Line */}
        <AnimatedPath
          d={pathData}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeDasharray="1000"
          animatedProps={animatedProps}
        />
      </Svg>
    </View>
  );
};
