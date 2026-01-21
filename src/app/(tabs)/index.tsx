import { api } from '@/components/api';
import ColourBar from '@/components/colour-bar';
import Whiteboard from '@/components/grid/elements-render';
import LoginForm from '@/components/login-form';
import Sidebar from '@/components/sidebar_';
import { Tool } from '@/components/types';
import UserPane from '@/components/user-pane';
import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

export default function App() {
  const [loggedInUsername, setLoggedInUsername] = useState<string | null>(null);
  const [currentGridId, setCurrentGridId] = useState<number | null>(null);
  
  //statusy parametry do zmiany componentow
  const [activeTool, setActiveTool] = useState<Tool>('hand');
  const [activeColor, setActiveColor] = useState('#ff5733');
  const [isLoading, setIsLoading] = useState(false);

    const handleLoginSuccess = async (username: string) => {
    setIsLoading(true);
    setLoggedInUsername(username);

    try {
      const grids = await api.fetchUserGrids();

      if (grids.length > 0) {
        console.log("Znaleziono siatke:", grids[0].id);
        setCurrentGridId(grids[0].id);
      } else {
        console.log("Nie znaleziono, tworzenie nowej");
        const newGrid = await api.createGrid("Ma 1 siatka");
        setCurrentGridId(newGrid.id);
      }
    } catch (error) {
      console.error("Nie udała się siatka", error);
    } finally {
      setIsLoading(false);
    }
  };
const handleLogout = useCallback(() => {
    setLoggedInUsername(null);
    setCurrentGridId(null);
  }, []);
  

  return (
    <View style={styles.container}>
      
      <Whiteboard 
        activeTool={activeTool} 
        activeColor={activeColor} 
        gridId={currentGridId}
      />


      <Sidebar 
        currentTool={activeTool} 
        setTool={setActiveTool} 
      />
      
      <ColourBar 
        currentColor={activeColor} 
        setColor={setActiveColor} 
      />

      {loggedInUsername ? (
        <UserPane username={loggedInUsername} onLogout={handleLogout} />
      ) : (
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
  },
});