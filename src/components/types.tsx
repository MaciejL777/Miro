/*
Instukcja jak dodać nowe kształty:
1. dodać interfejs
2. dodac do CnavasItem
3. dodać do elements_render
4. dodac do shape-factory
5. dodac do switcha w ghost-renders
6. dodac do switcha w elements render




*/
export type CanvasItem = RectangleItem | CircleItem | TextItem|LineItem;
export type ShapeType = CanvasItem['type'];
export type Tool = 'hand' | ShapeType; 
export interface BaseItem {
  id: string|number; // UUID
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  synced?: boolean; // do czekania na potweirdzeniez backendu
}
export interface RectangleItem extends BaseItem{
  type: 'rectangle';
}
export interface CircleItem extends BaseItem{
  type: 'circle';
}
export interface TextItem extends BaseItem {
  type: 'text';
  text: string;      
  fontSize: number;  
}
export interface LineItem extends BaseItem{
  type: 'line';
}



export interface DjangoBoardElement {
  id: number;
  board: number;
  element_type: string;
  x: number;
  y: number;
  properties: {
    width: number;
    height: number;
    color: string;
    text:string;
    fontSize:number;
    angle:number;
  };
}