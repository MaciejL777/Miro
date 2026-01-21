import { useEffect } from 'react';
import { Platform } from 'react-native';
import { CanvasItem } from '../components/types';
import { api } from './api';

interface UseKeyboardShortcutsProps {
  selectedId: string | number | null;
  setSelectedId: (id: string | number | null) => void;
  setElements: React.Dispatch<React.SetStateAction<CanvasItem[]>>;
  gridId: number | null;
}

export const useKeyboardShortcuts = ({ 
  selectedId, 
  setSelectedId, 
  setElements, 
  gridId 
}: UseKeyboardShortcutsProps) => {
  
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const handleKeyDown = (e: KeyboardEvent) => {

      if (e.key === 'Escape') {
        setSelectedId(null);
        return;
      }

 
      if (selectedId && (e.key === 'Backspace' || e.key === 'Delete')) {

        setElements((prev) => prev.filter((el) => el.id !== selectedId));
        

        if (gridId) {
            api.deleteElement(selectedId);
        }
        
        setSelectedId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, gridId, setElements, setSelectedId]);
};