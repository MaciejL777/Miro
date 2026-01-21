import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Platform, Pressable, StyleSheet, View } from "react-native";


interface ColourBarProps {
  currentColor: string;             
  setColor: (color: string) => void; 
}

export default function ColourBar({ currentColor, setColor }: ColourBarProps) {
  const [contentHeight, setContentHeight] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  

  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const translateY = useRef(new Animated.Value(-1000)).current;

  const items = [
    { id: 1, color: "#FF0000" },
    { id: 2, color: "#FF8000" },
    { id: 3, color: "#FFFF00" },
    { id: 4, color: "#80FF00" },
    { id: 5, color: "#00FF00" },
    { id: 6, color: "#00FF80" },
    { id: 7, color: "#00FFFF" },
    { id: 8, color: "#0080FF" },
    { id: 9, color: "#0000FF" },
    { id: 10, color: "#8000FF" },
    { id: 11, color: "#FF00FF" },
    { id: 12, color: "#FF0080" },
    { id: 13, color: "#e61e75" }, 
    { id: 14, color: "#774b23" },
    { id: 15, color: "#b6a7ae" },
    { id: 16, color: "#000000" },
  ];

  //animacja
  useEffect(() => {
    if (contentHeight === 0) return;

    const toValue = isOpen ? 0 : -contentHeight;

    Animated.timing(translateY, {
      toValue,
      duration: 300,
      useNativeDriver: true, 
    }).start();
  }, [isOpen, contentHeight]);

  return (
    <Animated.View
      style={[
        styles.wrapper,
        { transform: [{ translateY: translateY }] },
      ]}
    >
      <View
        style={styles.gridContainer}
        onLayout={(e) => {
          const h = e.nativeEvent.layout.height;
          setContentHeight(h);

          if (contentHeight === 0) {
            translateY.setValue(-h);
          }
        }}
      >
        {items.map((item) => (
          <Pressable
            key={item.id}
            style={[
              styles.item,
              hoveredId === item.id && styles.hoveredItem,
              item.color === currentColor && styles.selectedItem, 
            ]}
            // @ts-ignore 
            onHoverIn={() => setHoveredId(item.id)}
            onHoverOut={() => setHoveredId(null)}
            onPress={() => {
              setColor(item.color); 
            }}
          >
            <MaterialIcons
              name={"square"}
              size={22}
              color={item.color}
            />
          </Pressable>
        ))}
      </View>

      <Pressable 
        style={styles.tab} 
        onPress={() => setIsOpen(!isOpen)}
        hitSlop={10}
      >
        <MaterialIcons 
            name={isOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
            size={24} 
            color="#555" 
        />

        <MaterialIcons
            name="square"
            size={24}
            color={currentColor} 
            style={{ marginLeft: 5 }}
        />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    alignItems: "center", 
    zIndex: 100,
  },
  gridContainer: {
    backgroundColor: "#f1f1f1",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    padding: 12,
    borderWidth: 1,
    borderTopWidth: 0, 
    borderColor: "#ccc",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    width: Platform.OS === 'web' ? 300 : "80%", 
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  item: {
    width: 40,
    height: 40,
    margin: 2,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'transparent'
  },
  selectedItem: {
    borderColor: '#333',
    backgroundColor: '#e6e6e6'
  },
  hoveredItem: {
    backgroundColor: "#d0e8ff",
  },
  tab: {
    width: 80,
    height: 35,
    backgroundColor: "#f1f1f1",
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    marginTop: -1, 
    flexDirection: "row",
  },
});