import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Tool } from "./types";



interface SidebarProps {
  currentTool: Tool;
  setTool: (tool: Tool) => void; 
}

export default function Sidebar({currentTool, setTool }: SidebarProps) {
  const [height, setHeight] = useState(0);
  const [hoveredId, setHoveredId] = useState<string | null>(null);


  const items: { id: number; icon: keyof typeof MaterialIcons.glyphMap; tool: Tool }[] = [
    { id: 0, icon: "pan-tool", tool: "hand" },       
    { id: 1, icon: "square", tool: "rectangle" },   
    { id: 2, icon: "circle", tool: "circle" },    
    { id:3,  icon:"title",tool:"text"} ,  
    { id:4,  icon:"remove",tool:"line"}   

  ];
  return (
    <View
      style={[styles.container, { transform: [{ translateY: -height / 2 }] }]}
      onLayout={(e) => setHeight(e.nativeEvent.layout.height)}
    >
      {items.map((item) => (
        <Pressable
          key={item.icon}
          style={[
            styles.item,
            hoveredId === item.icon && { backgroundColor: '#d0e8ff' }, 
            currentTool === item.tool && { backgroundColor: '#646464', borderColor: '#333' }
          ]}
          onHoverIn={() => setHoveredId(item.icon)}
          onHoverOut={() => setHoveredId(null)}
          onPress={()=>{
            setTool(item.tool);

          }}
        >
          <MaterialIcons
            name={item.icon as any}
            size={22}
            color="black"
          />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    top: '40%',
    backgroundColor: '#f1f1f1',
    borderRadius: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  item: {
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});