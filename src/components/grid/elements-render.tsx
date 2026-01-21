import React from 'react';
import { Platform, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { GhostRender } from '../elements_render/ghost-renders';
import { useGestures } from '../gestures-movement';
import { GridBackground, VIRTUAL_CANVAS_SIZE } from '../grid-component';
import LineControls from '../resize/line-resize';
import ResizeBorder from '../resize/resize-logic';
import * as All from '../types';
import { useWhiteboardLogic } from './grid-logics';

import { api } from '../api';
import { CircleRender } from '../elements_render/circle';
import { LineRender } from '../elements_render/line';
import { RectangleRender } from '../elements_render/rectangle';
import { TextRender } from '../elements_render/text';

interface WhiteboardProps {
  activeTool: All.Tool;
  activeColor: string;
  gridId: number | null;
}

export default function Whiteboard({ activeTool, activeColor, gridId }: WhiteboardProps) {
  const { width, height } = useWindowDimensions();


  const gestures = useGestures({
    onTap: (x, y) => logic.handleBackgroundTap(x, y), 
    activeTool,
  });


  const logic = useWhiteboardLogic({
    activeTool,
    activeColor,
    gridId,
    width,
    height,
    gestures,
  });


  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: gestures.translateX.value },
      { translateY: gestures.translateY.value },
      { scale: gestures.scale.value },
    ],
  }));


  const selectedItem = logic.elements.find((el) => el.id === logic.selectedId);

  const renderShape = (el: All.CanvasItem) => {
    const isSelected = logic.selectedId === el.id;

    switch (el.type) {
      case 'text':
        return (
          <TextRender
            item={el as All.TextItem}
            isSelected={isSelected}
            isEditing={logic.isEditing}
            onUpdate={(changes) => {
              logic.handleUpdateElement(el.id, changes);
              if (changes.fontSize && gridId) {
                api.updateElement({ ...el, ...changes });
              }
            }}
            onBlur={() => {
                logic.setIsEditing(false);
                if(gridId) api.updateElement(el);
            }}
          />
        );
      case 'line':
        return <LineRender item={el as All.LineItem} />;
      case 'circle':
        return <CircleRender item={el as All.CircleItem} />;
      case 'rectangle':
      default:
        return <RectangleRender item={el as All.RectangleItem} />;
    }
  };

  return (
    <View
      style={[
        styles.container,
        Platform.OS === 'web' ? { outlineStyle: 'none' } as any : undefined,
      ]}
      onPointerMove={logic.handlePointerMove}
      // @ts-ignore
      onWheel={Platform.OS === 'web' ? logic.handleLocalWheel : undefined}
    >
      <GestureDetector gesture={gestures.composedGesture}>
        <Animated.View
          style={[
            { flex: 1 },
            Platform.OS === 'web'
              ? ({ cursor: activeTool === 'hand' ? 'grab' : 'crosshair' } as any)
              : undefined,
          ]}
        >
          <Animated.View
            style={[
              styles.canvasLayer,
 
              { left: logic.initialOffsetLeft, top: logic.initialOffsetTop },
              animatedStyle,
            ]}
          >
            <GridBackground />

            {logic.elements.map((el) => {
              const styleProps = logic.getElementStyle(el);

              return (
                <Pressable
                  key={el.id}
                  onPress={(e) => {
                    e.stopPropagation();
                    logic.handleShapeTap(el.id);
                  }}
                  style={{
                    position: 'absolute',
                    left: styleProps.left,
                    top: styleProps.top,
                    width: styleProps.width,
                    height: styleProps.height,
                    opacity: el.synced === false ? 0.7 : 1,
                    zIndex: (logic.selectedId === el.id && logic.isEditing) ? 999 : (el.type === 'text' ? 10 : 1)
                  }}
                >
                  {renderShape(el)}

                  {logic.selectedId === el.id &&
                    el.type === 'line' &&
                    activeTool === 'hand' && (
                      <LineControls
                        selectedItem={el as All.LineItem}
                        zoomScale={gestures.scale}
                        onUpdate={logic.handleUpdateElement}
                        onDrag={logic.handleDrag}
                        onDragEnd={logic.handleDragEnd}
                        onUpdateEnd={(id) => {
                          if (gridId)
                            api.updateElement(
                              logic.elements.find((e) => e.id === id)!
                            );
                        }}
                      />
                    )}
                </Pressable>
              );
            })}

            {selectedItem &&
              selectedItem.type !== 'line' &&
              !logic.isEditing && (
                <ResizeBorder
                  selectedItem={selectedItem}
                  zoomScale={gestures.scale}
                  onResize={logic.handleResize}
                  onResizeEnd={logic.handleResizeEnd}
                  onDrag={logic.handleDrag}
                  onDragEnd={logic.handleDragEnd}
                  onTap={logic.handleShapeTap}
                />
              )}


            {logic.ghostPos && activeTool !== 'hand' && (
              <GhostRender
                type={activeTool}
                x={logic.ghostPos.x}
                y={logic.ghostPos.y}
                color={activeColor}
              />
            )}
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    overflow: 'hidden',
  },
  canvasLayer: {
    position: 'absolute',
    width: VIRTUAL_CANVAS_SIZE,
    height: VIRTUAL_CANVAS_SIZE,
  },
});