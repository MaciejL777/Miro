import React, { useState, CSSProperties } from 'react';

interface Props {
  onLoginSuccess: (username: string) => void;
}

function Loginform({ onLoginSuccess }: Props) {
  const [isLogin, setIsLogin] = useState(true); 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState(''); 
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(isLogin ? 'Trwa logowanie...' : 'Trwa rejestracja...');

    const url = isLogin ? 'http://127.0.0.1:8000/api/login/' : 'http://127.0.0.1:8000/api/register/';
    const bodyData = isLogin 
      ? { username, password } 
      : { username, password, email };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        if (isLogin) {
          setMessage(`✅ Witaj, ${data.username}!`);
          onLoginSuccess(data.username);
        } else {
          setMessage('✅ Konto założone! Możesz się teraz zalogować.');
          setIsLogin(true); 
        }
      } else {
        const errorMsg = typeof data === 'object' && data !== null
          ? Object.values(data).flat().join(' ') 
          : 'Wystąpił błąd.';
        setMessage(` ${errorMsg}`);
      }
    } catch (error: any) {
      setMessage(` Błąd sieci: ${error.message}`);
    }
  };

  const containerStyle: CSSProperties = {
    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
    width: '350px', padding: '40px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    borderRadius: '10px', backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif',
  };

  const inputStyle: CSSProperties = {
    width: '100%', padding: '10px', margin: '8px 0 20px 0', border: '1px solid #ccc',
    borderRadius: '4px', boxSizing: 'border-box',
  };

  const buttonStyle: CSSProperties = {
    width: '100%', backgroundColor: '#007bff', color: 'white', padding: '14px 20px',
    margin: '8px 0', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px',
  };

  const toggleButtonStyle: CSSProperties = {
    width: '100%', backgroundColor: 'transparent', color: '#007bff', padding: '10px',
    border: '1px solid #007bff', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', marginTop: '10px'
  };

  const messageStyle: CSSProperties = {
    marginTop: '15px', textAlign: 'center', fontWeight: 'bold',
    color: message.startsWith('❌') ? 'red' : message.startsWith('✅') ? 'green' : 'black',
  };

  return (
    <div style={containerStyle}>
      <form onSubmit={handleSubmit}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
          {isLogin ? 'Logowanie' : 'Rejestracja'}
        </h2>

        <div>
          <label style={{ fontWeight: 'bold' }}>Nazwa użytkownika</label>
          <input
            type="text"
            value={username}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
            required
            style={inputStyle}
            placeholder="Wpisz nazwę użytkownika"
          />
        </div>

        {!isLogin && (
          <div>
            <label style={{ fontWeight: 'bold' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              required
              style={inputStyle}
              placeholder="twoj@email.com"
            />
          </div>
        )}

        <div>
          <label style={{ fontWeight: 'bold' }}>Hasło</label>
          <input
            type="password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            required
            style={inputStyle}
            placeholder="Wpisz hasło"
          />
        </div>

        <button type="submit" style={buttonStyle}>
          {isLogin ? 'Zaloguj się' : 'Zarejestruj się'}
        </button>

        {message && <p style={messageStyle}>{message}</p>}
      </form>

      <hr style={{ margin: '20px 0', border: '0', borderTop: '1px solid #eee' }} />

      <p style={{ textAlign: 'center', fontSize: '14px' }}>
        {isLogin ? 'Nie masz konta?' : 'Masz już konto?'}
      </p>
      
      <button 
        onClick={() => { setIsLogin(!isLogin); setMessage(''); }} 
        style={toggleButtonStyle}
      >
        {isLogin ? 'Stwórz nowe konto' : 'Wróć do logowania'}
      </button>
    </div>
  );
}

export default Loginform;