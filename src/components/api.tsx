
import { CanvasItem, DjangoBoardElement, ShapeType } from './types';
// interfejs kształtu

function getCookie(name: string) {
  if (typeof document === 'undefined') return null; // Safety for non-web envs
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}
const API_URL = "http://127.0.0.1:8000";

const getHeaders = async () => {
  const csrftoken = getCookie('csrftoken');
  
  return {
    'Content-Type': 'application/json',
    'X-CSRFToken': csrftoken || '', 
  };
};

export const api = {
  
  //pobranie elementow 
  fetchGridElements: async (gridId: number): Promise<CanvasItem[]> => {
    try {
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/api/grids/${gridId}/`, {
         headers,
          credentials:'include' });

      
      if (!res.ok) {
        console.warn(`Grid ${gridId} not found or server error.`);
        return [];
      }
      const data = await res.json();
      // transformata z django na canvasitem
      return data.elements.map((el: DjangoBoardElement) => ({
        id: el.id,
        type: el.element_type as ShapeType,
        x: el.x,
        y: el.y,
        width: el.properties.width || 100,
        height: el.properties.height || 100,
        color: el.properties.color || '#c73333',
        text: el.properties.text || "",         
        fontSize: el.properties.fontSize || 20,
        synced: true,
      }));
    } catch (e) {
      console.error("Fetch Error:", e);
      return [];
    }
  },

  // C od stwórz element
  addElement: async (gridId: number, item: CanvasItem): Promise<number> => {
    const headers = await getHeaders();
    
    const payload = {
      element_type: item.type,
      x: item.x,
      y: item.y,
      properties: {
        width: item.width,
        height: item.height,
        color: item.color,
        text: (item as any).text,         
        fontSize: (item as any).fontSize,
      }
    };

    const res = await fetch(`${API_URL}/api/grids/${gridId}/elements/add/`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      credentials:'include'
    });

    if (!res.ok) throw new Error("Failed to add");
    const data = await res.json();
    return data.id; 
  },

  //U od aktualizacja elementu
  updateElement: async (item: CanvasItem) => {
    if (typeof item.id === 'string') return;

    const headers = await getHeaders();
    const payload = {
      element_type: item.type,
      x: item.x,
      y: item.y,
      properties: {
        width: item.width,
        height: item.height,
        color: item.color,
        text: (item as any).text,          
        fontSize: (item as any).fontSize,
      }
    };

    await fetch(`${API_URL}/api/elements/${item.id}/update/`, {
      method: 'PATCH', 
      headers,
      body: JSON.stringify(payload),
      credentials:'include'
    });
  },

  //D od wytępienia elementu
  deleteElement: async (id: number | string) => {
    if (typeof id === 'string') return;
    const headers = await getHeaders();
    await fetch(`${API_URL}/api/elements/${id}/delete/`, {
      method: 'DELETE',
      headers,
      credentials:'include'
    });
  },
//Czyli SCAT


   fetchUserGrids: async () => {
    const headers = await getHeaders();
    const res = await fetch(`${API_URL}/api/grids/`, { headers,
      credentials:'include'
     });
    if (!res.ok) throw new Error("Failed to fetch grids");
    return await res.json(); // Returns array: [{id: 1, name: "Map"}, ...]
  },

    createGrid: async (name: string) => {
    const headers = await getHeaders();
    const res = await fetch(`${API_URL}/api/grids/create/`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ name }),
      credentials:'include'
    });
    if (!res.ok) throw new Error("Failed to create grid");
    return await res.json(); // Returns: {id: 2, name: "New Grid", ...}
  },
};
