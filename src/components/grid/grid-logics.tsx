import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { api } from '../api';
import { CENTER } from '../grid-component';
import { createShape } from '../shape-factory';
import { useKeyboardShortcuts } from '../shortcuts-key';
import * as All from '../types';

interface UseWhiteboardLogicProps {
  activeTool: All.Tool;
  activeColor: string;
  gridId: number | null;
  width: number;
  height: number;
  gestures: any; 
}

export const useWhiteboardLogic = ({
  activeTool,
  activeColor,
  gridId,
  width,
  height,
  gestures,
}: UseWhiteboardLogicProps) => {

  const [elements, setElements] = useState<All.CanvasItem[]>([]);
  const [ghostPos, setGhostPos] = useState<{ x: number; y: number } | null>(null);
  const [selectedId, setSelectedId] = useState<string | number | null>(null);
  
  const lastMouseScreenPos = useRef({ x: 0, y: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const isDoubleClick = useRef<number>(0);

  const initialOffsetLeft = -CENTER + width / 2;
  const initialOffsetTop = -CENTER + height / 2;

  useEffect(() => {
    if (gridId) {
      api.fetchGridElements(gridId).then(setElements);
    } else {
      setElements([]);
    }
  }, [gridId]);

  useKeyboardShortcuts({ selectedId, setSelectedId, setElements, gridId });


  const screenToWorld = (screenX: number, screenY: number) => {
    const currentScale = gestures.scale.value;
    const currentTx = gestures.translateX.value;
    const currentTy = gestures.translateY.value;

    return {
      x: ((screenX - currentTx) / currentScale - initialOffsetLeft),
      y: ((screenY - currentTy) / currentScale - initialOffsetTop),
    };
  };

  const getElementStyle = (el: All.CanvasItem) => {
    if (el.type === 'line') {
      const minX = Math.min(el.x, el.width);
      const minY = Math.min(el.y, el.height);
      const w = Math.abs(el.width - el.x);
      const h = Math.abs(el.height - el.y);

      return {
        left: minX,
        top: minY,
        width: Math.max(w, 20),
        height: Math.max(h, 20),
      };
    }
    // default
    return { left: el.x, top: el.y, width: el.width, height: el.height };
  };


  const handleUpdateElement = useCallback((id: string | number, changes: Partial<All.CanvasItem>) => {
    setElements((prev) =>
      prev.map((el) => {
        if (el.id === id) {
          return { ...el, ...changes, synced: false } as All.CanvasItem;
        }
        return el;
      })
    );
  }, []);

  const handleShapeTap = (id: string | number) => {
    if (activeTool === 'hand') {
      const now = Date.now();
      const DOUBLE_PRESS_DELAY = 300;

      if (selectedId === id && (now - isDoubleClick.current < DOUBLE_PRESS_DELAY)) {
         setIsEditing(true);
      } else {
         setSelectedId(id);
         setIsEditing(false); 
      }
      isDoubleClick.current = now;
    }
  };

  const handleAddShape = (screenX: number, screenY: number) => {
    if (activeTool === 'hand') {
      setSelectedId(null);
      return;
    }

    const { x, y } = screenToWorld(screenX, screenY);
    const newItem = createShape(activeTool, x, y, activeColor);

    setElements((prev) => [...prev, newItem]);

    if (activeTool === 'text') setSelectedId(newItem.id);

    if (gridId) {
      api.addElement(gridId, newItem)
        .then((realDbId) => {
          setElements((prev) =>
            prev.map((el) =>
              el.id === newItem.id ? { ...el, id: realDbId, synced: true } : el
            )
          );
        })
        .catch((err) => {
          console.error('Save failed', err);
          setElements((prev) => prev.filter((el) => el.id !== newItem.id));
        });
    }
  };

  const handleBackgroundTap = (screenX: number, screenY: number) => {
    if (activeTool === 'hand') {
      setSelectedId(null);
      setIsEditing(false);
      return;
    }
    handleAddShape(screenX, screenY);
  };

  const handleResize = (id: string | number, newWidth: number, newHeight: number) => {
    setElements((prev) =>
      prev.map((el) =>
        el.id === id
          ? ({ ...el, width: newWidth, height: newHeight, synced: false } as All.CanvasItem)
          : el
      )
    );
  };

  const handleResizeEnd = (id: string | number) => {
    if (gridId) {
      const item = elements.find((el) => el.id === id);
      if (item) api.updateElement(item);
    }
  };

  const handleDrag = (id: string | number, newX: number, newY: number) => {
    setElements((prev) =>
      prev.map((el) => {
        if (el.id === id) {
          if (el.type === 'line') {
            const dx = newX - el.x;
            const dy = newY - el.y;
            return {
              ...el,
              x: newX,
              y: newY,
              width: el.width + dx,
              height: el.height + dy,
              synced: false,
            } as All.CanvasItem;
          }
          return { ...el, x: newX, y: newY, synced: false } as All.CanvasItem;
        }
        return el;
      })
    );
  };

  const handleDragEnd = (id: string | number) => {
    if (gridId) {
      const item = elements.find((el) => el.id === id);
      if (item) api.updateElement(item);
    }
  };

  const handlePointerMove = (e: any) => {
    const { clientX, clientY } = e.nativeEvent;
    lastMouseScreenPos.current = { x: clientX, y: clientY };

    if (activeTool === 'hand' || Platform.OS !== 'web') {
      setGhostPos(null);
      return;
    }
    setGhostPos(screenToWorld(clientX, clientY));
  };

  const handleLocalWheel = (e: any) => {
    if (Platform.OS === 'web') {
      gestures.handleWheel(e);


      if (activeTool !== 'hand') {
        requestAnimationFrame(() => {
          const { x, y } = lastMouseScreenPos.current;
          const newWorldPos = screenToWorld(x, y);
          setGhostPos(newWorldPos);
        });
      }
    }
  };


  return {
    elements,
    ghostPos,
    selectedId,
    initialOffsetLeft,
    initialOffsetTop,

    getElementStyle,
    handleShapeTap,
    handleBackgroundTap,
    handleResize,
    handleResizeEnd,
    handleDrag,
    handleDragEnd,
    handlePointerMove,
    handleLocalWheel,
    handleUpdateElement,

    setElements,
    setSelectedId,
    isEditing,
    setIsEditing
  };
};