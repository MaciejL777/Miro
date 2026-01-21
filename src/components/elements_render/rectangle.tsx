import React from 'react';
import Svg, { Rect } from 'react-native-svg';
import { RectangleItem } from '../types';

export const RectangleRender = ({ item }: { item: RectangleItem }) => (
  <Svg width="100%" height="100%">
    <Rect width="100%" height="100%" fill={item.color} stroke="black" strokeWidth={2} />
  </Svg>
);