import React, { useState } from 'react';
import {
    IonButton,
    IonContent,
    IonInput,
    IonInputPasswordToggle,
    IonPage,
    IonTitle,
    IonModal,
    IonText,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonAlert,
} from '@ionic/react';
import { supabase } from '../utils/supabaseClient';
import { useEffect } from 'react';
import bcrypt from 'bcryptjs';

// Reusable Alert Component
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

const Register: React.FC = () => {
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showVerificationModal, setShowVerificationModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);



    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `
          ion-content {
            --background: transparent;
           background-image: url('https://i.pinimg.com/originals/17/f2/b5/17f2b53208febbb2c3b503e1e9087a20.gif');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            height: 100%;
            width: 100%;
            position: absolute;
            top: 0;
            left: 0;
          }
    
          .login-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background-color: rgba(0, 0, 0, 0.65);
            padding: 30px;
            border-radius: 20px;
            backdrop-filter: blur(6px);
            box-shadow: 0 0 20px aqua;
            max-width: 90%;
            margin: 25% auto 0 auto;
          }
    
          .login-avatar {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            overflow: hidden;
            border: 5px solid aqua;
            box-shadow: 0 0 12px aqua;
            margin-bottom: 20px;
          }
    
          .login-avatar img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 50%;
          }
    
          .login-header {
            font-size: 28px;
            font-weight: bold;
            color: white;
            text-shadow: 0 0 8px aqua;
            text-align: center;
            margin-bottom: 20px;
          }
    
          .login-password-input {
            margin-top: 10px;
          }
    
          ion-input {
            width: 100%;
            --background: #111;
            --color: white;
            --placeholder-color: #aaa;
            --highlight-color-focused: aqua;
            --border-color: aqua;
            --padding-start: 16px;
            --padding-end: 16px;
            margin-bottom: 10px;
            border-radius: 10px;
          }
    
          ion-button[fill="clear"] {
            color: orange;
            --color: orange;
            --background-hover: rgba(0, 255, 255, 0.1);
            text-decoration: underline;
            margin-top: 5px;
            font-size: 14px;
            font-weight: 500;
          }
    
          .login-input {
            --color: orange;
            --placeholder-color: rgba(0, 255, 255, 0.5);
            --highlight-color-focused: aqua;
            --border-color: aqua;
            color: aqua;
            margin-bottom: 16px;
            font-size: 16px;
            --padding-start: 12px;
            --padding-end: 12px;
            --padding-top: 14px;
            --padding-bottom: 14px;
            transition: all 0.3s ease;
            border-radius: 12px;
            box-shadow: 0 0 10px rgba(0, 255, 255, 0.2);
          }
    
          .login-input:hover {
            box-shadow: 0 0 20px rgba(234, 179, 15, 0.6);
            transform: scale(1.02);
            border-color: cyan;
          }
    
          .login-input:focus-within {
            box-shadow: 0 0 25px rgba(226, 167, 17, 0.8);
            border-color: deepskyblue;
          }
    
          .register-text {
            margin-top: 20px;
            text-align: center;
            color: white;
            font-size: 16px;
            font-weight: 400;
          }
    
          .register-text a {
            color: orange;
            text-decoration: none;
            font-weight: 600;
            transition: color 0.3s ease, text-shadow 0.3s ease;
          }
    
          .register-text a:hover {
            color:rgb(223, 170, 23);
            text-shadow: 0 0 10px orange;
          }
        `;
        document.head.appendChild(style);
        return () => {
          document.head.removeChild(style);
        };
      }, []);

    const handleOpenVerificationModal = () => {
        if (!email.endsWith("@nbsc.edu.ph")) {
            setAlertMessage("Only @nbsc.edu.ph emails are allowed to register.");
            setShowAlert(true);
            return;
        }

        if (password !== confirmPassword) {
            setAlertMessage("Passwords do not match.");
            setShowAlert(true);
            return;
        }

        setShowVerificationModal(true);
    };

    const doRegister = async () => {
        setShowVerificationModal(false);
    
        try {
            // Sign up in Supabase authentication
            const { data, error } = await supabase.auth.signUp({ email, password });
    
            if (error) {
                throw new Error("Account creation failed: " + error.message);
            }
    
            // Hash password before storing in the database
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
    
            // Insert user data into 'users' table
            const { error: insertError } = await supabase.from("users").insert([
                {
                    username,
                    user_email: email,
                    user_firstname: firstName,
                    user_lastname: lastName,
                    user_password: hashedPassword,
                },
            ]);
    
            if (insertError) {
                throw new Error("Failed to save user data: " + insertError.message);
            }
    
            setShowSuccessModal(true);
        } catch (err) {
            // Ensure err is treated as an Error instance
            if (err instanceof Error) {
                setAlertMessage(err.message);
            } else {
                setAlertMessage("An unknown error occurred.");
            }
            setShowAlert(true);
        }
    };
    
    return (
        <IonPage>
            <IonContent className='ion-padding'>
            <div
  style={{
    display: 'flex',
    justifyContent: 'center',      // Horizontally centers the content
    alignItems: 'center',          // Vertically centers the content
                 // Full viewport height
    margin: 0,
  }}
>
  <h1
    style={{
      display: 'inline-block',
      padding: '10px 20px',
      border: '2px solid black',
      borderRadius: '8px',
      boxShadow: '0 0 10px yellow',
      backgroundColor: 'white',
      color: 'black',
      fontWeight: 'bold',
    }}
  >
    Create your account
  </h1>
</div>


                <IonInput label="Username" labelPlacement="stacked" fill="outline" type="text" placeholder="Enter a unique username" value={username} onIonChange={e => setUsername(e.detail.value!)} style={{ marginTop: '15px' ,color:'white'}} />
                <IonInput label="First Name" labelPlacement="stacked" fill="outline" type="text" placeholder="Enter your first name" value={firstName} onIonChange={e => setFirstName(e.detail.value!)} style={{ marginTop: '15px',color:'white' }} />
                <IonInput label="Last Name" labelPlacement="stacked" fill="outline" type="text" placeholder="Enter your last name" value={lastName} onIonChange={e => setLastName(e.detail.value!)} style={{ marginTop: '15px',color:'white' }} />
                <IonInput label="Email" labelPlacement="stacked" fill="outline" type="email" placeholder="youremail@nbsc.edu.ph" value={email} onIonChange={e => setEmail(e.detail.value!)} style={{ marginTop: '15px' ,color:'white'}} />
                <IonInput label="Password" labelPlacement="stacked" fill="outline" type="password" placeholder="Enter password" value={password} onIonChange={e => setPassword(e.detail.value!)} style={{ marginTop: '15px' ,color:'white'}} >
                    <IonInputPasswordToggle slot="end" />
                </IonInput>
                <IonInput label="Confirm Password" labelPlacement="stacked" fill="outline" type="password" placeholder="Confirm password" value={confirmPassword} onIonChange={e => setConfirmPassword(e.detail.value!)} style={{ marginTop: '15px',color:'white' }} >
                    <IonInputPasswordToggle slot="end" />
                </IonInput>

                <IonButton onClick={handleOpenVerificationModal} color={'dark'} expand="full" shape='round' style={{ marginTop: '15px' ,color:'white'}}>
                    Register
                </IonButton>
                <p style={{ textAlign: 'center',color:'white' }}>
  Already have an account? <a href="/it35-lab">Sign in</a>
</p>


                {/* Verification Modal */}
                <IonModal isOpen={showVerificationModal} onDidDismiss={() => setShowVerificationModal(false)}>
                    <IonContent className="ion-padding">
                        <IonCard className="ion-padding" style={{ marginTop: '25%' ,color:'orange'}}>
                            <IonCardHeader>
                                <IonCardTitle>User Registration Details</IonCardTitle>
                                <hr />
                                <IonCardSubtitle>Username</IonCardSubtitle>
                                <IonCardTitle>{username}</IonCardTitle>

                                <IonCardSubtitle>Email</IonCardSubtitle>
                                <IonCardTitle>{email}</IonCardTitle>

                                <IonCardSubtitle>Name</IonCardSubtitle>
                                <IonCardTitle>{firstName} {lastName}</IonCardTitle>
                            </IonCardHeader>
                            <IonCardContent></IonCardContent>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginRight: '5px' }}>
                                <IonButton fill="clear" color="white" onClick={() => setShowVerificationModal(false)}>Cancel</IonButton>
                                <IonButton color="primary" onClick={doRegister}>Confirm</IonButton>
                            </div>
                        </IonCard>
                    </IonContent>
                </IonModal>

                {/* Success Modal */}
                <IonModal isOpen={showSuccessModal} onDidDismiss={() => setShowSuccessModal(false)}>
                    <IonContent className="ion-padding" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', textAlign: 'center', marginTop: '35%' }}>
                        <IonTitle style={{ marginTop: '35%' }}>Registration Successful 🎉</IonTitle>
                        <IonText>
                            <p>Your account has been created successfully.</p>
                            <p>Please check your email address.</p>
                        </IonText>
                        <IonButton routerLink="/it35-lab" routerDirection="back" color="primary">
                            Go to Login
                        </IonButton>
                    </IonContent>
                </IonModal>

                {/* Reusable AlertBox Component */}
                <AlertBox message={alertMessage} isOpen={showAlert} onClose={() => setShowAlert(false)} />

            </IonContent>
        </IonPage>
    );
};

export default Register;