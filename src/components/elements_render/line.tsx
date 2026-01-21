import React from 'react';
import Svg, { Line } from 'react-native-svg';
import { LineItem } from '../types';

interface Props {
  item: LineItem;
}

export const LineRender = ({ item }: Props) => {
  
  const minX = Math.min(item.x, item.width);
  const minY = Math.min(item.y, item.height);

  const x1 = item.x - minX;
  const y1 = item.y - minY;
  const x2 = item.width - minX;
  const y2 = item.height - minY;

  return (
    <Svg width="100%" height="100%">
      <Line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={item.color}
        strokeWidth={4}
        strokeLinecap="round"
      />
    </Svg>
  );
};