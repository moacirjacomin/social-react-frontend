import React, { useContext,useEffect,useState } from 'react'
import { useQuery } from '@apollo/react-hooks';
import { Grid, Transition } from 'semantic-ui-react';
import { AuthContext } from '../context/auth';
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';
import { FETCH_POST_QUERY } from '../utils/graphql';

function Home() {
    const { user } = useContext(AuthContext);
    const [posts, setPosts] = useState([]);
    // let posts = '';
    const { loading, data } = useQuery(FETCH_POST_QUERY);

    
    // if (data) {
    //     posts = { data: data.getPosts }
    //     console.log('posts.=', posts);
    // }
	useEffect(() => {
        console.log('useEffect data=', data);
		if (data) {
			setPosts(data.getPosts);
		}
	}, [data]);

    // Cannot read property '__typename' of undefined
    // at Object.defaultDataIdFromObject [as dataIdFromObject]

    return (
        <Grid columns={3}>
            <Grid.Row className="page-title">
                <h1>Recent Posts</h1>
            </Grid.Row>
            <Grid.Row>
                {
                    user && (
                        <Grid.Column>
                            <PostForm />
                        </Grid.Column>
                    )
                }
                {
                    loading ? (
                        <h1> Loading.. </h1>
                    )
                        : (
                            <Transition.Group>
                                { posts && posts.map(post => (
                                        <Grid.Column key={post.id} style={{ marginBottom: 20 }}>
                                            <PostCard post={post} />
                                        </Grid.Column>
                                    ))  }
                            </Transition.Group>

                        )
                }
            </Grid.Row>
        </Grid>
    )
}



export default Home;