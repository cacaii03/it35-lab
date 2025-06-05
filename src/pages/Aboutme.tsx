import React, { useState, useRef, useEffect } from 'react';
import {
  IonContent, IonPage, IonInput, IonButton, IonAlert, IonHeader,
  IonBackButton, IonButtons, IonItem, IonText, IonAvatar, IonImg
} from '@ionic/react';
import { supabase } from '../utils/supabaseClient';
import { useHistory } from 'react-router-dom';

const EditProfile: React.FC = () => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const history = useHistory();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchSessionAndData = async () => {
      const { data: session, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session || !session.session) {
        setAlertMessage('You must be logged in to access this page.');
        setShowAlert(true);
        history.push('/it35-lab/login');
        return;
      }
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('user_firstname, user_lastname, user_avatar_url, user_email, username')
        .eq('user_email', session.session.user.email)
        .single();
      if (userError || !user) {
        setAlertMessage('User data not found.');
        setShowAlert(true);
        return;
      }
      setFirstName(user.user_firstname || '');
      setLastName(user.user_lastname || '');
      setAvatarPreview(user.user_avatar_url);
      setEmail(user.user_email);
      setUsername(user.username || '');
    };
    fetchSessionAndData();
  }, [history]);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async () => {
    // Fetch the current session
    const { data: session, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session || !session.session) {
      setAlertMessage('Error fetching session or no session available.');
      setShowAlert(true);
      return;
    }
    const user = session.session.user;
    if (!user.email) {
      setAlertMessage('Error: User email is missing.');
      setShowAlert(true);
      return;
    }

    // Handle avatar upload if the avatar file is changed
    let avatarUrl = avatarPreview;
    if (avatarFile) {
      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;
      const { error: uploadError } = await supabase.storage
        .from('user-avatars')
        .upload(filePath, avatarFile, {
          cacheControl: '3600',
          upsert: true,
        });
      if (uploadError) {
        setAlertMessage(`Avatar upload failed: ${uploadError.message}`);
        setShowAlert(true);
        return;
      }
      const { data } = supabase.storage.from('user-avatars').getPublicUrl(filePath);
      avatarUrl = data.publicUrl;
    }

    // Update user data in the users table
    const { error: updateError } = await supabase
      .from('users')
      .update({
        user_firstname: firstName,
        user_lastname: lastName,
        user_avatar_url: avatarUrl,
        username: username,
      })
      .eq('user_email', user.email);

    if (updateError) {
      setAlertMessage(updateError.message);
      setShowAlert(true);
      return;
    }

    setAlertMessage('Profile updated successfully!');
    setShowAlert(true);
    history.push('/it35-lab/app');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonButtons slot="start">
          <IonBackButton defaultHref="/it35-lab/app" />
        </IonButtons>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem>
          <IonText color="secondary">
            <h1>Edit Profile</h1>
          </IonText>
        </IonItem>
        <br />

        {/* Avatar Upload Section */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          {avatarPreview && (
            <IonAvatar style={{ width: '120px', height: '120px', margin: '10px auto' }}>
              <IonImg src={avatarPreview} style={{ objectFit: 'cover' }} />
            </IonAvatar>
          )}
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept="image/*"
            onChange={handleAvatarChange}
          />
          <IonButton expand="block" onClick={() => fileInputRef.current?.click()}>
            Upload Avatar
          </IonButton>
        </div>

        <IonInput
          label="Username"
          type="text"
          labelPlacement="floating"
          fill="outline"
          placeholder="Enter username"
          value={username}
          onIonChange={(e) => setUsername(e.detail.value!)}
          style={{ marginBottom: '12px' }}
        />
        <IonInput
          label="First Name"
          type="text"
          labelPlacement="floating"
          fill="outline"
          placeholder="Enter First Name"
          value={firstName}
          onIonChange={(e) => setFirstName(e.detail.value!)}
          style={{ marginBottom: '12px' }}
        />
        <IonInput
          label="Last Name"
          type="text"
          labelPlacement="floating"
          fill="outline"
          placeholder="Enter Last Name"
          value={lastName}
          onIonChange={(e) => setLastName(e.detail.value!)}
          style={{ marginBottom: '12px' }}
        />

        <IonButton expand="full" onClick={handleUpdate} shape="round" style={{ marginTop: '20px' }}>
          Update Profile
        </IonButton>

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          message={alertMessage}
          buttons={['OK']}
        />
      </IonContent>
    </IonPage>
  );
};

export default EditProfile;