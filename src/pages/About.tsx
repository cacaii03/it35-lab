import { 
  IonButtons,
  IonContent, 
  IonHeader, 
  IonMenuButton, 
  IonPage, 
  IonTitle, 
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonIcon,
  IonLabel,
  IonList,
  IonAvatar,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/react';
import { 
  mailOutline, 
  logoGithub, 
  logoLinkedin, 
  globeOutline,
  codeSlashOutline,
  layersOutline,
  rocketOutline,
  peopleOutline
} from 'ionicons/icons';
import { useState } from 'react';
import './About.css';

const About: React.FC = () => {
  const [showFullTeam, setShowFullTeam] = useState(false);
  
  const teamMembers = [
    {
      name: 'Alex Johnson',
      role: 'Lead Developer',
      avatar: 'https://i.pravatar.cc/150?img=1',
      contacts: {
        email: 'alex@appcompany.com',
        github: 'alexjdev',
        linkedin: 'alexjohnson'
      }
    },
    {
      name: 'Sarah Chen',
      role: 'UX Designer',
      avatar: 'https://i.pravatar.cc/150?img=5',
      contacts: {
        email: 'sarah@appcompany.com',
        github: 'sarahchen',
        linkedin: 'sarahchenux'
      }
    },
    {
      name: 'Maricar balagan',
      role: 'Backend Engineer',
      avatar: 'https://i.pravatar.cc/150?img=3',
      contacts: {
        email: 'marcus@appcompany.com',
        github: 'marcusw',
        linkedin: 'marcuswilliams'
      }
    },
    {
      name: 'Renalou Cudo',
      role: 'Product Manager',
      avatar: 'https://i.pravatar.cc/150?img=8',
      contacts: {
        email: 'priya@appcompany.com',
        linkedin: 'priyapatel'
      }
    }
  ];

  const visibleTeam = showFullTeam ? teamMembers : teamMembers.slice(0, 2);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonMenuButton></IonMenuButton>
          </IonButtons>
          <IonTitle>About Us</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonCard className="about-card">
          <IonCardHeader>
            <IonCardTitle>Our Mission</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            We build intuitive, performant applications that solve real-world problems. 
            Our team combines technical expertise with design thinking to create 
            exceptional digital experiences.
          </IonCardContent>
        </IonCard>

        <IonCard className="tech-stack-card">
          <IonCardHeader>
            <IonCardTitle>
              <IonIcon icon={codeSlashOutline} className="section-icon" />
              Tech Stack
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonGrid>
              <IonRow>
                <IonCol>
                  <div className="tech-item">
                    <div className="tech-icon react"></div>
                    <div>React</div>
                  </div>
                </IonCol>
                <IonCol>
                  <div className="tech-item">
                    <div className="tech-icon ionic"></div>
                    <div>Ionic</div>
                  </div>
                </IonCol>
                <IonCol>
                  <div className="tech-item">
                    <div className="tech-icon typescript"></div>
                    <div>TypeScript</div>
                  </div>
                </IonCol>
                <IonCol>
                  <div className="tech-item">
                    <div className="tech-icon node"></div>
                    <div>Node.js</div>
                  </div>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>

        <IonCard className="team-card">
          <IonCardHeader>
            <IonCardTitle>
              <IonIcon icon={peopleOutline} className="section-icon" />
              Our Team
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            {visibleTeam.map((member, index) => (
              <IonItem key={index} lines="none" className="team-member">
                <IonAvatar slot="start">
                  <img src={member.avatar} alt={member.name} />
                </IonAvatar>
                <IonLabel>
                  <h2>{member.name}</h2>
                  <p>{member.role}</p>
                  <div className="contact-links">
                    {member.contacts.email && (
                      <a href={`mailto:${member.contacts.email}`}>
                        <IonIcon icon={mailOutline} />
                      </a>
                    )}
                    {member.contacts.github && (
                      <a href={`https://github.com/${member.contacts.github}`} target="_blank" rel="noopener noreferrer">
                        <IonIcon icon={logoGithub} />
                      </a>
                    )}
                    {member.contacts.linkedin && (
                      <a href={`https://linkedin.com/in/${member.contacts.linkedin}`} target="_blank" rel="noopener noreferrer">
                        <IonIcon icon={logoLinkedin} />
                      </a>
                    )}
                  </div>
                </IonLabel>
              </IonItem>
            ))}
            <div className="show-more">
              <IonItem button onClick={() => setShowFullTeam(!showFullTeam)} lines="none" detail={false}>
                <IonLabel color="primary">
                  {showFullTeam ? 'Show Less' : 'Show More Team Members'}
                </IonLabel>
              </IonItem>
            </div>
          </IonCardContent>
        </IonCard>

        <IonCard className="contact-card">
          <IonCardHeader>
            <IonCardTitle>Contact Us</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
              <IonItem href="mailto:info@appcompany.com">
                <IonIcon icon={mailOutline} slot="start" />
                <IonLabel>info@appcompany.com</IonLabel>
              </IonItem>
              <IonItem href="https://github.com/appcompany" target="_blank">
                <IonIcon icon={logoGithub} slot="start" />
                <IonLabel>github.com/appcompany</IonLabel>
              </IonItem>
              <IonItem href="https://appcompany.com" target="_blank">
                <IonIcon icon={globeOutline} slot="start" />
                <IonLabel>appcompany.com</IonLabel>
              </IonItem>
            </IonList>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default About;