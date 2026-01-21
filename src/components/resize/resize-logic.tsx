import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { SharedValue, useSharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { CanvasItem } from '../types';

interface ResizeBorderProps {
  selectedItem: CanvasItem;
  zoomScale: SharedValue<number>; //żeby przeliczyc porawnie skalę
  onResize: (id: string | number, w: number, h: number) => void;
  onResizeEnd: (id: string | number) => void;
  onDrag: (id: string | number, newX: number, newY: number) => void;
  onDragEnd: (id: string | number) => void;
  onTap:(id:string|number)=>void;
}

export default function ResizeBorder({ 
  selectedItem, 
  zoomScale, 
  onResize,
  onResizeEnd,
  onDrag,
  onDragEnd
  ,onTap
}: ResizeBorderProps) {
//początek chwytu, bez tego rośnie 'dziwnie'
    const startWidth = useSharedValue(0);
    const startHeight = useSharedValue(0);

  //klikniecie rogu zczyna skalowanie
  const resizeGesture = Gesture.Pan()
      .onStart(() => {
      startWidth.value = selectedItem.width;
      startHeight.value = selectedItem.height;
    })
    .onUpdate((e) => {
            //dzielimy przez zooma żeby kształt śledził myszkę
        const newWidth = Math.max(20, startWidth.value + (e.translationX / zoomScale.value));
        const newHeight = Math.max(20, startHeight.value + (e.translationY / zoomScale.value));
      
      scheduleOnRN(onResize,selectedItem.id, newWidth, newHeight);
    })
    .onEnd(()=>{scheduleOnRN(onResizeEnd,selectedItem.id)});

  const startX = useSharedValue(0);
  const startY = useSharedValue(0);

  const dragGesture = Gesture.Pan()
    .onStart(() => {
      startX.value = selectedItem.x;
      startY.value = selectedItem.y;
    })
    .onUpdate((e) => {
  
      const newX = startX.value + (e.translationX / zoomScale.value);
      const newY = startY.value + (e.translationY / zoomScale.value);
      scheduleOnRN(onDrag,selectedItem.id, newX, newY);
    })
    .onEnd(() => {
      scheduleOnRN(onDragEnd,selectedItem.id);
    });
    
    // dal 2kliku an edycje tekstu
    const tapGesture = Gesture.Tap()
    .numberOfTaps(1) 
    .onEnd(() => {
      scheduleOnRN(onTap,selectedItem.id);
    });


  const suma = Gesture.Race(dragGesture, tapGesture);

  return (
    <GestureDetector gesture={suma}>
    <View
      style={[
        styles.overlay,
        {
          left: selectedItem.x,
          top: selectedItem.y,
          width: selectedItem.width,
          height: selectedItem.height,
        }
      ]}
    >
      <View style={styles.border} />

      <GestureDetector gesture={resizeGesture}>
        <View style={styles.handle} />
      </GestureDetector>
    </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
//żeby obramówka nie ukryła się za kształtem
    zIndex: 999, 
    pointerEvents: 'auto',
  },
  border: {
    width: '100%',
    height: '100%',
    borderWidth: 2,
    borderColor: '#00a8ff',
    borderStyle: 'dashed',
    backgroundColor: 'transparent',
  },
  handle: {
    position: 'absolute',
    bottom: -6, 
    right: -6,
    width: 15,
    height: 15,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#00a8ff',
    borderRadius: 2,
    zIndex: 1000,
  },
});