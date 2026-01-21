// components/GhostRenderer.tsx
import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Line, Rect } from 'react-native-svg';
import { Tool } from '.././types';

interface GhostRenderProps {
  type: Tool;
  x: number;
  y: number;
  color: string;
}

export const GhostRender = ({ type, x, y, color }: GhostRenderProps) => {

  const containerStyle = {
    position: 'absolute' as const,
    left: x - 50, 
    top: y - 50,
    width: 100,
    height: 100,
    opacity: 0.5,
    pointerEvents: 'none' as const, 
  };

  const renderContent = () => {
    switch (type) {
      case 'circle':
        return (
          <View style={[containerStyle, { borderWidth: 1, borderColor: color, borderStyle: 'dashed', borderRadius: 50 }]}>
            <Svg width="100%" height="100%">
              <Circle cx="50%" cy="50%" r="48%" fill={color} opacity={0.3} />
            </Svg>
          </View>
        );

      case 'text':
        return (
          <View style={[containerStyle, { borderWidth: 1, borderColor: '#00a8ff', borderStyle: 'dashed', justifyContent: 'center', padding: 10 }]}>
             <View style={{ width: 2, height: 20, backgroundColor: color }} />
             <View style={{ position: 'absolute', bottom: -20, left: 0 }}>
             </View>
          </View>
        );
        case 'line':
                 return (
        <View style={{
            position: 'absolute',
            left: x,
            top: y,
            width: 100, 
            height: 100,
            opacity: 0.5,
            pointerEvents: 'none'
        }}>
           <Svg width="100%" height="100%">
             <Line x1={0} y1={0} x2={100} y2={100} stroke={color} strokeWidth={4} strokeDasharray="5, 5" />
           </Svg>
        </View>
     ); 

      case 'rectangle':
      default:
        return (
          <View style={[containerStyle, { borderWidth: 1, borderColor: color, borderStyle: 'dashed' }]}>
            <Svg width="100%" height="100%">
              <Rect width="100%" height="100%" fill={color} opacity={0.3} />
            </Svg>
          </View>
        );
    }
  };

  return renderContent();
};