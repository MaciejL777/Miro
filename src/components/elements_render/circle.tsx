import React from 'react';
import Svg, { Circle } from 'react-native-svg';
import { CircleItem } from '../types';

export const CircleRender = ({ item }: { item: CircleItem }) => (
  <Svg width="100%" height="100%">
    <Circle  cx="50%" cy="50%" r="48%" fill={item.color} stroke="black" strokeWidth={2} />
  </Svg>
);