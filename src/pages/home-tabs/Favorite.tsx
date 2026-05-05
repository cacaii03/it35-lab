import { useState, useEffect } from 'react';
import { 
  IonButtons,
  IonContent, 
  IonHeader, 
  IonMenuButton, 
  IonPage, 
  IonTitle, 
  IonToolbar,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonAvatar,
  IonText,
  IonRow,
  IonCol,
  IonSpinner,
  IonButton,
  IonIcon,
  IonRefresher,
  IonRefresherContent
} from '@ionic/react';
import { supabase } from '../../utils/supabaseClient';
import { heart, refreshOutline, trash, pencil } from 'ionicons/icons';

interface Post {
  post_id: string;
  user_id: number;
  username: string;
  avatar_url: string;
  post_content: string;
  post_created_at: string;
  is_favorite: boolean;
}

const Favorites: React.FC = () => {
  const [favoritePosts, setFavoritePosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    setLoading(true);
    
    try {
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user?.email) {
        // Fetch user from users table
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('user_email', session.user.email)
          .maybeSingle();
        
        if (userData) {
          setUser(userData);
        }
      }
      
      // Fetch only favorited posts
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('is_favorite', true)
        .order('post_created_at', { ascending: false });
      
      if (!error && data) {
        setFavoritePosts(data as Post[]);
      } else {
        console.error('Error fetching favorites:', error);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async (event: CustomEvent) => {
    await fetchFavorites();
    event.detail.complete();
  };

  const removeFavorite = async (postId: string) => {
    const { error } = await supabase
      .from('posts')
      .update({ is_favorite: false })
      .match({ post_id: postId });
    
    if (!error) {
      setFavoritePosts(favoritePosts.filter(post => post.post_id !== postId));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot='start'>
              <IonMenuButton />
            </IonButtons>
            <IonTitle>Favorites</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <IonSpinner name="crescent" />
            <IonText>
              <p>Loading favorites...</p>
            </IonText>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Favorites</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent fullscreen className="ion-padding">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent pullingIcon={refreshOutline} pullingText="Pull to refresh" refreshingSpinner="circles" />
        </IonRefresher>

        {favoritePosts.length === 0 ? (
          <IonCard>
            <IonCardContent style={{ textAlign: 'center', padding: '60px 20px' }}>
              <IonIcon 
                icon={heart} 
                style={{ fontSize: '64px', color: '#ccc', marginBottom: '20px' }} 
              />
              <IonText color="medium">
                <h3>No favorites yet</h3>
                <p>Go to the Feed tab and click the heart icon on posts you like!</p>
              </IonText>
              <IonButton 
                routerLink="/it35-lab/app/home/feed" 
                expand="block" 
                style={{ marginTop: '20px' }}
              >
                Go to Feed
              </IonButton>
            </IonCardContent>
          </IonCard>
        ) : (
          <>
            <IonText style={{ margin: '10px 0', display: 'block' }}>
              <p>You have {favoritePosts.length} favorite{ favoritePosts.length !== 1 ? 's' : '' }</p>
            </IonText>
            
            {favoritePosts.map((post) => (
              <IonCard key={post.post_id} style={{ marginTop: '16px' }}>
                <IonCardHeader>
                  <IonRow style={{ alignItems: 'center' }}>
                    <IonCol size="2">
                      <IonAvatar>
                        <img 
                          alt={post.username} 
                          src={post.avatar_url || 'https://ionicframework.com/docs/img/demos/avatar.svg'} 
                        />
                      </IonAvatar>
                    </IonCol>
                    <IonCol>
                      <IonCardTitle style={{ fontSize: '18px', marginTop: '0' }}>
                        {post.username}
                      </IonCardTitle>
                      <IonCardSubtitle>
                        {formatDate(post.post_created_at)}
                      </IonCardSubtitle>
                    </IonCol>
                    <IonCol size="auto">
                      <IonButton
                        fill="clear"
                        color="danger"
                        onClick={() => removeFavorite(post.post_id)}
                      >
                        <IonIcon icon={heart} style={{ fontSize: '24px' }} />
                      </IonButton>
                    </IonCol>
                  </IonRow>
                </IonCardHeader>
                
                <IonCardContent>
                  <IonText style={{ color: 'black' }}>
                    <p style={{ fontSize: '16px', whiteSpace: 'pre-wrap' }}>
                      {post.post_content}
                    </p>
                  </IonText>
                </IonCardContent>
              </IonCard>
            ))}
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Favorites;