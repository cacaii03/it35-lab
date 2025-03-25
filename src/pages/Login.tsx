import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonCheckbox,
  IonContent, 
  IonHeader, 
  IonIcon, 
  IonInput, 
  IonInputPasswordToggle, 
  IonItem, 
  IonMenuButton, 
  IonPage, 
  IonTitle, 
  IonToolbar, 
  useIonRouter
} from '@ionic/react';
import { logoIonic } from 'ionicons/icons';

function Login() {
  const navigation = useIonRouter();
  const doLogin = () => {
    navigation.push('/it35-lab/app', 'forward', 'replace');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonMenuButton></IonMenuButton>
          </IonButtons>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className='ion-padding'>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <IonAvatar>
            <img alt="Silhouette of a person's head" src="https://ionicframework.com/docs/img/demos/avatar.svg" />
          </IonAvatar>
        </div>
        
        <IonItem>
          <IonInput label="Username:" placeholder="Username" />
        </IonItem>
        <IonItem>
          <IonInput type="password" label="Password:" placeholder="Password">
            <IonInputPasswordToggle slot="end" />
          </IonInput>
        </IonItem>
        
        <IonItem>
          <IonCheckbox>I agree to the terms and conditions</IonCheckbox>
        </IonItem>
        
        <IonButton onClick={doLogin} expand="full">
          Login
        </IonButton>
        <IonButton routerLink="/it35-lab/register" expand="full" fill="clear" shape='round'>
                 Don't have an account? Register here
             </IonButton>
      </IonContent>
    </IonPage>
  );
}

export default Login;
