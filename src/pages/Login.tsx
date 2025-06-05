import {
  IonAlert,
  IonAvatar,
  IonButton,
  IonContent,
  IonInput,
  IonInputPasswordToggle,
  IonPage,
  IonToast,
  useIonRouter
} from '@ionic/react';
import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';

const AlertBox: React.FC<{ message: string; isOpen: boolean; onClose: () => void }> = ({ message, isOpen, onClose }) => (
  <IonAlert
    isOpen={isOpen}
    onDidDismiss={onClose}
    header="Notification"
    message={message}
    buttons={['OK']}
  />
);

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
        className="ion-padding"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: '#f5f6fa'
        }}
      >
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '48px 32px',
            width: '100%',
            maxWidth: '420px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <IonAvatar style={{ margin: '0 auto 24px', width: '100px', height: '100px' }}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/727/727245.png"
              alt="music note"
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
            />
          </IonAvatar>
          <h2 style={{ marginBottom: '28px', fontWeight: 'bold', fontSize: '2rem' }}>Music Login</h2>
          <IonInput
            label="Email"
            labelPlacement="floating"
            fill="outline"
            type="email"
            placeholder="Enter your music email"
            value={email}
            onIonChange={e => setEmail(e.detail.value!)}
            style={{ fontSize: '1.1rem' }}
          />
          <IonInput
            style={{ marginTop: '16px', fontSize: '1.1rem' }}
            fill="outline"
            type="password"
            placeholder="Enter your password"
            value={password}
            onIonChange={e => setPassword(e.detail.value!)}
          >
            <IonInputPasswordToggle slot="end" />
          </IonInput>
          <IonButton onClick={doLogin} expand="block" color="primary" style={{ marginTop: '28px', fontSize: '1.1rem' }}>
            Login
          </IonButton>
          <IonButton
            routerLink="/it35-lab/register"
            expand="block"
            fill="clear"
            color="medium"
            style={{ marginTop: '12px', fontSize: '1rem' }}
          >
            Don't have an account? Register
          </IonButton>
        </div>
        <AlertBox message={alertMessage} isOpen={showAlert} onClose={() => setShowAlert(false)} />
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message="Login successful! Redirecting..."
          duration={1500}
          position="middle"
          color="primary"
        />
      </IonContent>
    </IonPage>
  );
};

export default Login;