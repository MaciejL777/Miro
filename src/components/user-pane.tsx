import React, { useEffect, useCallback, useRef, CSSProperties } from 'react';

interface Props {
  username: string;
  onLogout: () => void;
}

function UserPane({ username, onLogout }: Props) {
  const isRefreshing = useRef(false);

  const refreshAccessToken = useCallback(async () => {
    if (isRefreshing.current) return;
    
    try {
      isRefreshing.current = true;
      const response = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (response.ok) {
        console.log("Token odświeżony pomyślnie.");
      } else {
        console.warn("Sesja wygasła podczas odświeżania.");
        onLogout();
      }
    } catch (error) {
      console.error("Błąd sieci:", error);
    } finally {
      isRefreshing.current = false;
    }
  }, [onLogout]);

  useEffect(() => {
    if (!username) return;
    const intervalId = setInterval(() => {
      refreshAccessToken();
    }, 1000 * 60 * 4); // Co 4 minuty

    return () => clearInterval(intervalId);
  }, [username, refreshAccessToken]);

  const handleLogout = async () => {
    console.log("Próba wylogowania...");
    try {
      const response = await fetch('http://127.0.0.1:8000/api/logout/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Serwer zwrócił błąd przy wylogowaniu:", errorText);
      }
    } catch (error) {
      console.error("Błąd sieciowy:", error);
    } finally {
      onLogout();
    }
  };


  const displayStyle: CSSProperties = {
    position: 'absolute',
    top: '20px',
    right: '20px',
    backgroundColor: '#f8f9fa',
    border: '1px solid #dee2e6',
    borderRadius: '5px',
    padding: '10px 15px',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    zIndex: 100,
  };

  const buttonStyle: CSSProperties = {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '3px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px',
    transition: 'background-color 0.2s',
  };
  
  const usernameStyle: CSSProperties = {
      fontWeight: 'bold',
      color: '#007bff'
  };

  return (
    <div style={displayStyle}>
      <span>Zalogowano: <span style={usernameStyle}>{username}</span></span>
      
      <button 
        style={buttonStyle}
        onClick={handleLogout} 
        onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => 
          (e.currentTarget.style.backgroundColor = '#a71d2a')
        }
        onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => 
          (e.currentTarget.style.backgroundColor = '#dc3545')
        }
      >
        Wyloguj
      </button>
    </div>
  );
}

export default UserPane;