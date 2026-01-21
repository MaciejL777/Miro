import { v4 as uuidv4 } from 'uuid';
import { CanvasItem, ShapeType } from './types';

export const createShape = (type: ShapeType, x: number, y: number, color: string): CanvasItem => {
  const base = {
    id: uuidv4(),
    x: x - 50,
    y: y - 50,
    width: 100,
    height: 100,
    color: color,
    synced: false,
  };

  switch (type) {
    case 'text':
      return { ...base, type: 'text', text: 'Wpisz coś', fontSize: 20 };
    case 'circle':
      return { ...base, type: 'circle' };
    case 'line':
      return {...base,type: 'line',       
         x: x,          
        y: y, 
        width: x + 100, 
        height: y + 100 
        };
    case 'rectangle':
    default:
      return { ...base, type: 'rectangle' };
  }
};