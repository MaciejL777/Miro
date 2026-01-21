import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, Line, Pattern, Rect } from 'react-native-svg';


const GRID_SIZE = 40; // wielkosć siatki
export const GRID_COLOR = '#a8a1a1ff';
export const CANVAS_SIZE = 10000;
export const VIRTUAL_CANVAS_SIZE = 100000; 
export const CENTER = VIRTUAL_CANVAS_SIZE / 2;

// NIESTETY pełnej genracji sitaki się nie udało zroibć,
// SKIA, jej dependencje, .wasm i builder facebookwy postanowiły nie zdaiłać razemze sobą w expo
//Generuje wielką siatke, może nikt nie doskroluje do końca

export  function GridBackground() {
  return (
   <View pointerEvents="none" style={styles.vectorLayer}>
    <Svg height="100%" width="100%">
      <Defs>
        <Pattern
          id="grid-pattern"
          width={GRID_SIZE}
          height={GRID_SIZE}
          patternUnits="userSpaceOnUse"
        >
          {/* //poziome */}
          <Line
            x1={GRID_SIZE} y1="0"
            x2={GRID_SIZE} y2={GRID_SIZE}
            stroke={GRID_COLOR}
            strokeWidth="1"
          />
          {/* pionowe */}
          <Line
            x1="0" y1={GRID_SIZE}
            x2={GRID_SIZE} y2={GRID_SIZE}
            stroke={GRID_COLOR}
            strokeWidth="1"
          />
        </Pattern>
      </Defs>
      {/* kwadrat wypełnia canve, to jest siatka, w nim jest siatka*/}
      <Rect 
        x="0" 
        y="0" 
        width={VIRTUAL_CANVAS_SIZE} 
        height={VIRTUAL_CANVAS_SIZE} 
        fill="url(#grid-pattern)" 
      />
    </Svg>
  </View>
  ); 
}
const styles = StyleSheet.create({

    vectorLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#f9f9f9', // tło
  }
  

  });