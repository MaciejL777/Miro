import React, { useEffect, useRef } from 'react';
import { NativeSyntheticEvent, Platform, StyleSheet, TextInput, TextInputKeyPressEvent } from 'react-native';
import { TextItem } from '../types';

interface Props {
  item: TextItem;
  isSelected: boolean;
  isEditing:boolean;
  onUpdate: (changes: Partial<TextItem>) => void;
  onBlur: () => void;
}

export const TextRender = ({ item, isSelected, onUpdate, onBlur,isEditing }: Props) => {
  const inputRef = useRef<TextInput>(null)
  useEffect(() => {
    if (isEditing && isSelected) {
        inputRef.current?.focus();
    }
  }, [isEditing, isSelected]);

  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEvent>) => {
    if (Platform.OS !== 'web') return;
    const webEvent = e.nativeEvent as any;
    const isCmdOrCtrl = webEvent.ctrlKey || webEvent.metaKey;
    

    if (isCmdOrCtrl) {
      if (webEvent.key === '=' || webEvent.key === '+') {
        e.preventDefault();
        onUpdate({ fontSize: (item.fontSize || 20) + 2 });
      }
      if (webEvent.key === '-') {
        e.preventDefault();
        onUpdate({ fontSize: Math.max(8, (item.fontSize || 20) - 2) });
      }
    }
  };
  
    return (
    <TextInput
      value={item.text}
      onChangeText={(txt) => onUpdate({ text: txt })}
      onBlur={onBlur}
      multiline
      style={[
        styles.input, 
        {
          color: item.color,
          fontSize: item.fontSize,
          borderWidth: isSelected ? 1 : 0,
        },
        Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : undefined
      ]}
      editable={isSelected} 
    />
  );
};

const styles = StyleSheet.create({
  input: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    padding: 5,
    borderColor: '#00a8ff',
  }
});