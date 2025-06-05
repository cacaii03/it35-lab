import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonAvatar,
  IonImg
} from '@ionic/react';

const AboutMe: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>About Me</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonCard style={{ maxWidth: 400, margin: '40px auto' }}>
          <IonCardHeader>
            <IonAvatar style={{ margin: '0 auto', width: 100, height: 100 }}>
              <IonImg src="https://cdn-icons-png.flaticon.com/512/727/727245.png" alt="Avatar" />
            </IonAvatar>
            <IonCardTitle style={{ textAlign: 'center', marginTop: 16 }}>MARICAR D. BALAGAN</IonCardTitle>
          </IonCardHeader>
          <IonCardContent style={{ textAlign: 'center' }}>
            <p>Hello! I'm a 3rd Year Student in Northern Bukidnon State Collage.</p>
            <p>Im 21 years old</p>
            <p>
              <strong>Favorite song:</strong> with a smile,Youll be safe here ,
            </p>
            <p>
              <strong>Email:</strong> 20221557@nbsc.edu.ph
            </p>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default AboutMe;