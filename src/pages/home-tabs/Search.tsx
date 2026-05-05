import { useState, useEffect } from 'react';
import { 
  IonButtons,
  IonContent, 
  IonHeader, 
  IonMenuButton, 
  IonPage, 
  IonTitle, 
  IonToolbar,
  IonSearchbar,
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
  IonLabel
} from '@ionic/react';
import { supabase } from '../../utils/supabaseClient';

interface Post {
  post_id: string;
  user_id: number;
  username: string;
  avatar_url: string;
  post_content: string;
  post_created_at: string;
}

const Search: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<Post[]>([]);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllPosts();
  }, []);

  const fetchAllPosts = async () => {
    setLoading(true);
    console.log('Fetching all posts...');
    
    const { data, error, count } = await supabase
      .from('posts')
      .select('*', { count: 'exact' })
      .order('post_created_at', { ascending: false });
    
    console.log('Posts data:', data);
    console.log('Posts error:', error);
    console.log('Total count:', count);
    
    if (!error && data) {
      setAllPosts(data as Post[]);
      setSearchResults(data as Post[]);
      console.log('Set allPosts count:', data.length);
    } else {
      console.error('Error fetching posts:', error);
    }
    setLoading(false);
  };

  const handleSearch = async (event: CustomEvent) => {
    const query = event.detail.value?.toLowerCase() || '';
    setSearchText(query);
    
    console.log('Searching for:', query);
    
    if (query.trim() === '') {
      console.log('Empty query, showing all posts:', allPosts.length);
      setSearchResults(allPosts);
    } else {
      // Search directly in Supabase for better performance
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .or(`post_content.ilike.%${query}%,username.ilike.%${query}%`)
        .order('post_created_at', { ascending: false });
      
      console.log('Search results:', data);
      console.log('Search error:', error);
      
      if (!error && data) {
        setSearchResults(data as Post[]);
        console.log('Found results count:', data.length);
      } else {
        setSearchResults([]);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Search Posts</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent fullscreen className="ion-padding">
        <IonSearchbar
          value={searchText}
          onIonInput={handleSearch}
          placeholder="Search posts by content or username..."
          showCancelButton="focus"
          animated
        />

        {!loading && (
          <IonLabel style={{ margin: '10px 0', display: 'block' }}>
            {searchText ? `Found ${searchResults.length} result${searchResults.length !== 1 ? 's' : ''} for "${searchText}"` : `Total ${allPosts.length} posts`}
          </IonLabel>
        )}

        {loading && (
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <IonSpinner name="crescent" />
            <IonText>
              <p>Loading posts...</p>
            </IonText>
          </div>
        )}

        {!loading && searchResults.length === 0 && searchText && (
          <IonCard>
            <IonCardContent style={{ textAlign: 'center', padding: '40px' }}>
              <IonText color="medium">
                <h3>No results found</h3>
                <p>No posts match "{searchText}"</p>
              </IonText>
            </IonCardContent>
          </IonCard>
        )}

        {!loading && searchResults.length === 0 && !searchText && (
          <IonCard>
            <IonCardContent style={{ textAlign: 'center', padding: '40px' }}>
              <IonText color="medium">
                <h3>No posts yet</h3>
                <p>Create some posts in the Feed tab to see them here!</p>
              </IonText>
            </IonCardContent>
          </IonCard>
        )}

        {!loading && searchResults.map((post) => (
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
      </IonContent>
    </IonPage>
  );
};

export default Search;