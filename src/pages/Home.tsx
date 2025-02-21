import { 
  IonButton,
    IonContent, 
    IonHeader, 
    IonMenuButton, 
    IonPage, 
    IonTitle, 
    IonToolbar 
} from '@ionic/react';

const Home: React.FC = () => {
  return (
    <IonPage>
          <IonHeader>
          <IonToolbar>
          <IonButton slot='start'>
              <IonMenuButton ></IonMenuButton>
            </IonButton>
            <IonTitle>Home</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
        <IonButton routerLink="/it35-lab/app/home/details" expand="full">
        Details
          </IonButton>
        </IonContent>
      </IonPage>
    );
  };
  
export default Home;
 