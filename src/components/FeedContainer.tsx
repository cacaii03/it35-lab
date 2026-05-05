import { useState, useEffect } from 'react';
import { IonContent, IonButton, IonInput, IonLabel, IonModal, IonFooter, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonAlert, IonText, IonAvatar, IonCol, IonRow, IonIcon, IonPopover, IonSpinner, IonHeader, IonTitle, IonToolbar, IonRefresher, IonRefresherContent } from '@ionic/react';
import { supabase } from '../utils/supabaseClient';
import { pencil, trash, refreshOutline, heart, heartOutline } from 'ionicons/icons';

interface Post {
  post_id: string;
  user_id: number;
  username: string;
  avatar_url: string;
  post_content: string;
  post_created_at: string;
  post_updated_at: string;
  is_favorite: boolean;
}

const FeedContainer = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [postContent, setPostContent] = useState('');
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [user, setUser] = useState<any>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [popoverState, setPopoverState] = useState<{ open: boolean; event: Event | null; postId: string | null }>({ 
    open: false, event: null, postId: null 
  });

  useEffect(() => {
    fetchUserAndPosts();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchUserAndPosts();
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserAndPosts = async () => {
    setLoading(true);
    
    try {
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user?.email) {
        // Fetch user from users table using email
        const { data: userData, error } = await supabase
          .from('users')
          .select('*')
          .eq('user_email', session.user.email)
          .maybeSingle();
        
        if (userData) {
          setUser(userData);
          setUsername(userData.username);
        } else {
          setUser(null);
          setUsername(null);
        }
      } else {
        setUser(null);
        setUsername(null);
      }
      
      // Fetch all posts with favorite status
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('post_created_at', { ascending: false });
      
      if (!error && data) {
        setPosts(data as Post[]);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async (event: CustomEvent) => {
    await fetchUserAndPosts();
    event.detail.complete();
  };

  const toggleFavorite = async (postId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('posts')
      .update({ is_favorite: !currentStatus })
      .match({ post_id: postId });
    
    if (!error) {
      // Update local state
      setPosts(posts.map(post => 
        post.post_id === postId 
          ? { ...post, is_favorite: !currentStatus }
          : post
      ));
      setAlertMessage(!currentStatus ? 'Added to favorites!' : 'Removed from favorites');
      setIsAlertOpen(true);
    } else {
      setAlertMessage('Error updating favorite');
      setIsAlertOpen(true);
    }
  };

  const createPost = async () => {
    if (!postContent.trim()) {
      setAlertMessage('Please enter some content');
      setIsAlertOpen(true);
      return;
    }
    
    // Get fresh session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      setAlertMessage('You must be logged in to post');
      setIsAlertOpen(true);
      return;
    }
    
    if (!user) {
      setAlertMessage('Please complete your profile first');
      setIsAlertOpen(true);
      return;
    }
    
    const userId = user.id;
    
    const { data: userData } = await supabase
      .from('users')
      .select('user_avatar_url')
      .eq('id', userId)
      .maybeSingle();
    
    const avatarUrl = userData?.user_avatar_url || 'https://ionicframework.com/docs/img/demos/avatar.svg';
    
    const { data, error } = await supabase
      .from('posts')
      .insert([
        { 
          post_content: postContent, 
          user_id: userId, 
          username: username, 
          avatar_url: avatarUrl,
          is_favorite: false
        }
      ])
      .select('*');
    
    if (!error && data) {
      setPosts([data[0] as Post, ...posts]);
      setPostContent('');
      setAlertMessage('Post created successfully!');
      setIsAlertOpen(true);
    } else {
      setAlertMessage('Error creating post: ' + error?.message);
      setIsAlertOpen(true);
    }
  };

  const deletePost = async (post_id: string) => {
    const { error } = await supabase
      .from('posts')
      .delete()
      .match({ post_id });
    
    if (!error) {
      setPosts(posts.filter(post => post.post_id !== post_id));
      setAlertMessage('Post deleted successfully!');
      setIsAlertOpen(true);
    } else {
      setAlertMessage('Error deleting post: ' + error.message);
      setIsAlertOpen(true);
    }
  };

  const startEditingPost = (post: Post) => {
    setEditingPost(post);
    setPostContent(post.post_content);
    setIsModalOpen(true);
  };

  const savePost = async () => {
    if (!postContent.trim() || !editingPost) return;
    
    const { data, error } = await supabase
      .from('posts')
      .update({ post_content: postContent })
      .match({ post_id: editingPost.post_id })
      .select('*');
    
    if (!error && data) {
      const updatedPost = data[0] as Post;
      setPosts(posts.map(post => (post.post_id === updatedPost.post_id ? updatedPost : post)));
      setPostContent('');
      setEditingPost(null);
      setIsModalOpen(false);
      setAlertMessage('Post updated successfully!');
      setIsAlertOpen(true);
    } else {
      setAlertMessage('Error updating post: ' + error?.message);
      setIsAlertOpen(true);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <IonSpinner name="crescent" />
        <IonText>
          <p>Loading feed...</p>
        </IonText>
      </div>
    );
  }

  return (
    <>
      <IonContent className="ion-padding">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent pullingIcon={refreshOutline} pullingText="Pull to refresh" refreshingSpinner="circles" />
        </IonRefresher>

        {user ? (
          <>
            {/* Create Post Card */}
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Create Post</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonInput 
                  value={postContent} 
                  onIonChange={e => setPostContent(e.detail.value!)} 
                  placeholder="What's on your mind?" 
                />
              </IonCardContent>
              <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0.5rem' }}>
                <IonButton onClick={createPost}>Post</IonButton>
              </div>
            </IonCard>

            {posts.length === 0 ? (
              <IonCard>
                <IonCardContent style={{ textAlign: 'center', padding: '40px' }}>
                  <IonText color="medium">
                    <h3>No posts yet</h3>
                    <p>Be the first to create a post!</p>
                  </IonText>
                </IonCardContent>
              </IonCard>
            ) : (
              posts.map(post => (
                <IonCard key={post.post_id} style={{ marginTop: '1rem' }}>
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
                        <IonCardTitle style={{ fontSize: '18px', marginTop: '0' }}>{post.username}</IonCardTitle>
                        <IonCardSubtitle>
                          {new Date(post.post_created_at).toLocaleString()}
                        </IonCardSubtitle>
                      </IonCol>
                      <IonCol size="auto">
                        {/* Favorite Button */}
                        <IonButton
                          fill="clear"
                          onClick={() => toggleFavorite(post.post_id, post.is_favorite)}
                        >
                          <IonIcon 
                            icon={post.is_favorite ? heart : heartOutline} 
                            color={post.is_favorite ? 'danger' : 'medium'}
                            style={{ fontSize: '24px' }}
                          />
                        </IonButton>
                      </IonCol>
                      {post.user_id === user?.id && (
                        <IonCol size="auto">
                          <IonButton
                            fill="clear"
                            onClick={(e) => setPopoverState({ open: true, event: e.nativeEvent, postId: post.post_id })}
                          >
                            <IonIcon icon={pencil} />
                          </IonButton>
                        </IonCol>
                      )}
                    </IonRow>
                  </IonCardHeader>
                
                  <IonCardContent>
                    <IonText style={{ color: 'black' }}>
                      <p style={{ fontSize: '16px', whiteSpace: 'pre-wrap' }}>{post.post_content}</p>
                    </IonText>
                  </IonCardContent>
                  
                  <IonPopover
                    isOpen={popoverState.open && popoverState.postId === post.post_id}
                    event={popoverState.event}
                    onDidDismiss={() => setPopoverState({ open: false, event: null, postId: null })}
                  >
                    <IonButton 
                      fill="clear" 
                      expand="full"
                      onClick={() => { 
                        startEditingPost(post); 
                        setPopoverState({ open: false, event: null, postId: null }); 
                      }}
                    >
                      Edit
                    </IonButton>
                    <IonButton 
                      fill="clear" 
                      expand="full"
                      color="danger" 
                      onClick={() => { 
                        deletePost(post.post_id); 
                        setPopoverState({ open: false, event: null, postId: null }); 
                      }}
                    >
                      Delete
                    </IonButton>
                  </IonPopover>
                </IonCard>
              ))
            )}
          </>
        ) : (
          <IonCard>
            <IonCardContent style={{ textAlign: 'center', padding: '40px' }}>
              <IonText color="medium">
                <h3>Please Log In</h3>
                <p>You need to be logged in to view and create posts.</p>
                <IonButton routerLink="/it35-lab/login" expand="block" style={{ marginTop: '20px' }}>
                  Go to Login
                </IonButton>
              </IonText>
            </IonCardContent>
          </IonCard>
        )}
      </IonContent>

      <IonModal isOpen={isModalOpen} onDidDismiss={() => setIsModalOpen(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Edit Post</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonLabel position="stacked">Edit your post:</IonLabel>
          <IonInput 
            value={postContent} 
            onIonChange={e => setPostContent(e.detail.value!)} 
            placeholder="Edit your post..."
          />
        </IonContent>
        <IonFooter>
          <IonButton expand="full" onClick={savePost}>Save Changes</IonButton>
          <IonButton expand="full" fill="outline" onClick={() => setIsModalOpen(false)}>Cancel</IonButton>
        </IonFooter>
      </IonModal>

      <IonAlert
        isOpen={isAlertOpen}
        onDidDismiss={() => setIsAlertOpen(false)}
        header="Notification"
        message={alertMessage}
        buttons={['OK']}
      />
    </>
  );
};

export default FeedContainer;