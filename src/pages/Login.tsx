import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter
} from '@ionic/react';

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
        <IonButton onClick={() => doLogin()} expand="full">
          Login
        </IonButton>
      </IonContent>
    </IonPage>
  );
}

export default Login;