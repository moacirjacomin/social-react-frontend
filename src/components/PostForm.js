import React from 'react'
import { Form, Button } from 'semantic-ui-react';
import { useForm } from './../utils/util_hooks';
import { useMutation } from '@apollo/react-hooks';
import { FETCH_POST_QUERY } from '../utils/graphql';
import gql from 'graphql-tag';


function PostForm() {
    const { values, onChange, onSubmit } = useForm(createPostCallBack, {
        body: ''
    });

    const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
        variables: values,
        update(proxy, result) {
            console.log('result', result);
            const data = proxy.readQuery({
                query: FETCH_POST_QUERY
            });
            console.log('data==', data);
            const new_post = result.data.createPost;
 			proxy.writeQuery({
				query: FETCH_POST_QUERY,
				data: { getPosts: [new_post, ...data.getPosts] }
			});
            values.body = '';
        },
        onError(err) {
            console.log(err);
        }
        
    });

    function createPostCallBack() {
        createPost();
    }

    return (
        <>
            <Form onSubmit={onSubmit}>
                <h2>Create a post:</h2>
                <Form.Field>
                    <Form.Input
                        placeholder="Hi World"
                        name="body"
                        onChange={onChange}
                        value={values.body}
                        error={error ? true : false }
                    />
                    <Button type="submit" color="teal">
                        Submit
                </Button>
                </Form.Field>
            </Form>
            {error && (
                <div className="ui error message" style={{marginBottom:20}}>
                    <ul className="list">
                        <li>{error.graphQLErrors[0].message}</li>
                    </ul>
                </div>
            )}
        </>

    )
};

const CREATE_POST_MUTATION = gql`
    mutation createPost( $body: String!){
        createPost(body: $body){
            id body createdAt username 
            likes { 
                id username createdAt
            }
            likeCount
            comments{
                id body username createdAt
            }
            commentCount
        }
    }
`;



export default PostForm;
