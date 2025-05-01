import {
  IonAlert,
  IonAvatar,
  IonButton,
  IonContent,
  IonIcon,
  IonInput,
  IonInputPasswordToggle,
  IonPage,
  IonToast,
  useIonRouter
} from '@ionic/react';
import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';

const AlertBox: React.FC<{ message: string; isOpen: boolean; onClose: () => void }> = ({ message, isOpen, onClose }) => {
  return (
    <IonAlert
      isOpen={isOpen}
      onDidDismiss={onClose}
      header="Notification"
      message={message}
      buttons={['OK']}
    />
  );
};

const Login: React.FC = () => {
  const navigation = useIonRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const doLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setAlertMessage(error.message);
      setShowAlert(true);
      return;
    }

    setShowToast(true);
    setTimeout(() => {
      navigation.push('/it35-lab/app', 'forward', 'replace');
    }, 300);
  };

  return (
    <IonPage>
      <IonContent
        fullscreen
        style={{
          position: 'relative', // Make sure the content is positioned correctly
        }}
      >
        {/* Background Image */}
        <div
          style={{
            position: 'fixed', // fixed ensures it sticks even if content scrolls
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url("https://i.pinimg.com/originals/17/f2/b5/17f2b53208febbb2c3b503e1e9087a20.gif")',
            backgroundSize: 'cover',        // ensures image covers entire screen
            backgroundPosition: 'center',   // keeps image centered
            backgroundRepeat: 'no-repeat',
            zIndex: -1,
            width: '100vw',
            height: '100vh',
          }}
          
        />

        {/* Login Form */}
        <div
         style={{
          backgroundColor: 'rgba(255, 255, 255, 0.88)',
          borderRadius: '10px',
          padding: '20px',
          width: '90%',
          maxWidth: '400px',
          margin: 'auto',
          marginTop: '15%',
          textAlign: 'center',
          border: '1px solid black', // Black border
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4), 0 0 15px yellow' // Black + Yellow shadow
        }}
        
        >
         <IonAvatar
  style={{
    margin: '0 auto',
    marginBottom: '20px',
    width: '100px',
    height: '100px',
    border: '1px solid black', // Yellow border
    borderRadius: '50%',
    boxSizing: 'border-box',
    boxShadow: '0 0 20px 5px rgba(255, 255, 0, 0.6)'
  }}
>
  <img
    src="https://thumbs.dreamstime.com/b/fashion-illustration-girl-holding-sunflower-woman-portrait-fashion-illustration-girl-holding-sunflower-woman-portrait-hand-150840175.jpg"
    alt="sun"
    style={{
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      borderRadius: '50%',
    }}
  />
</IonAvatar>

          <h2 style={{ marginBottom: '20px', fontWeight: 'bold' }}>User Login</h2>

          <IonInput
            label="Email"
            labelPlacement="floating"
            fill="outline"
            color={'dark'}
            type="email"
            placeholder="Enter Email"
            value={email}
            onIonChange={e => setEmail(e.detail.value!)}
          />
          <IonInput
            style={{ marginTop: '10px' }}
            fill="outline"
            color={'dark'}
            type="password"
            placeholder="Password"
            value={password}
            onIonChange={e => setPassword(e.detail.value!)}
          >
            <IonInputPasswordToggle slot="end" color={'dark'} className="custom-eye-icon" />
          </IonInput>

          <IonButton onClick={doLogin} expand="full" color={'dark'} shape="round" style={{ marginTop: '20px' }}>
            Login
          </IonButton>

          <IonButton
            routerLink="/it35-lab/register"
            expand="full"
            fill="clear"
            color={'dark'}
            shape="round"
            style={{ marginTop: '10px' }}
          >
            Don't have an account? Register here
          </IonButton>
        </div>

        {/* Alert and Toast */}
        <AlertBox message={alertMessage} isOpen={showAlert} onClose={() => setShowAlert(false)} />

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message="Login successful! Redirecting..."
          duration={1500}
          position="top"
          color="primary"
        />
      </IonContent>
    </IonPage>
  );
};

export default Login;