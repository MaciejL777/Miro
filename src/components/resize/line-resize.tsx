// components/LineControls.tsx
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { SharedValue, useSharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import * as All from '.././types';

interface LineControlsProps {
  selectedItem: All.LineItem;
  zoomScale: SharedValue<number>;
  onUpdate: (id: string | number, changes: Partial<All.CanvasItem>) => void;
  onUpdateEnd: (id: string | number) => void;
  onDrag: (id: string | number, newX: number, newY: number) => void;
  onDragEnd: (id: string | number) => void;
}

export default function LineControls({ 
  selectedItem, 
  zoomScale, 
  onUpdate, 
  onUpdateEnd,
  onDrag,
  onDragEnd

}: LineControlsProps) {

    //poczatek punkt
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);

  const moveStartGesture = Gesture.Pan()
    .onStart(() => {
      startX.value = selectedItem.x;
      startY.value = selectedItem.y;
    })
    .onUpdate((e) => {
      const newX = startX.value + (e.translationX / zoomScale.value);
      const newY = startY.value + (e.translationY / zoomScale.value);
      scheduleOnRN(onUpdate,selectedItem.id, { x: newX, y: newY });
    })
    .onEnd(() => scheduleOnRN(onUpdateEnd,selectedItem.id));

 //koniec punkt
  const endX = useSharedValue(0);
  const endY = useSharedValue(0);

  const moveEndGesture = Gesture.Pan()
    .onStart(() => {
      endX.value = selectedItem.width;
      endY.value = selectedItem.height;
    })
    .onUpdate((e) => {
      const newEndX = endX.value + (e.translationX / zoomScale.value);
      const newEndY = endY.value + (e.translationY / zoomScale.value);
      scheduleOnRN(onUpdate,selectedItem.id, { width: newEndX, height: newEndY });
    })
    .onEnd(() => scheduleOnRN(onUpdateEnd,selectedItem.id));

    //żeby przeciągnąć
    const dragStartX = useSharedValue(0);
    const dragStartY = useSharedValue(0);

  const dragGesture = Gesture.Pan()
    .onStart(() => {
      dragStartX.value = selectedItem.x;
      dragStartY.value = selectedItem.y;
    })
    .onUpdate((e) => {
      // Calculate new Start X/Y
      const newX = dragStartX.value + (e.translationX / zoomScale.value);
      const newY = dragStartY.value + (e.translationY / zoomScale.value);
      
      // Pass to parent. 
      // NOTE: Parent handleDrag logic will calculate the delta and move the End point too.
      scheduleOnRN(onDrag,selectedItem.id, newX, newY);
    })
    .onEnd(() => {
      scheduleOnRN(onDragEnd,selectedItem.id);
    });

  //osadzamy raczki
  const minX = Math.min(selectedItem.x, selectedItem.width);
  const minY = Math.min(selectedItem.y, selectedItem.height);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      
      {/* poczatek */}
      <GestureDetector gesture={moveStartGesture}>
         <View 
           style={[styles.handle, { 
             left: selectedItem.x - minX - 10, 
             top: selectedItem.y - minY - 10 
           },Platform.OS === 'web' ? { cursor: 'move' } as any : undefined]} 
         />
      </GestureDetector>

      {/* koncowka */}
      <GestureDetector gesture={moveEndGesture}>
         <View 
           style={[styles.handle, { 
             left: selectedItem.width - minX - 10, 
             top: selectedItem.height - minY - 10 
           },Platform.OS === 'web' ? { cursor: 'move' } as any : undefined]} 
         />
      </GestureDetector>

    </View>
  );
}

const styles = StyleSheet.create({
  handle: {
    position: 'absolute',
    width: 20,
    height: 20,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#00a8ff',
    borderRadius: 10,
    zIndex: 1000,
  },
});