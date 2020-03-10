import React, { useState } from 'react'
import { Icon, Button, Confirm } from 'semantic-ui-react';
import { useMutation } from '@apollo/react-hooks';
import { FETCH_POST_QUERY } from '../utils/graphql';
import gql from 'graphql-tag';
import MyPopup from './MyPopup';

function DeleteButton({ postId, commentId, callback }) {
    const [confirmOpen, setConfirmOpen] = useState(false);

    const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

    const [deletePostOrComment] = useMutation(mutation, {
        update(proxy) {
            setConfirmOpen(false);

            if (!commentId) {
                // updating cache to remove deleted post
                const data = proxy.readQuery({
                    query: FETCH_POST_QUERY
                });

                proxy.writeQuery({
                    query: FETCH_POST_QUERY,
                    data: { getPosts: data.getPosts.filter(p => p.id !== postId) }
                });
            }

            if (callback) callback();
        },
        variables: {
            postId,
            commentId
        }
    });

    return (
        <>
            <MyPopup content={commentId ? 'Delete Comment' : 'Delete Post'} >
                <Button
                    as="div"
                    color="red"
                    onClick={() => setConfirmOpen(true)}
                    floated="right" >
                    <Icon name="trash" style={{ margin: 0 }} />
                </Button>
            </MyPopup>

            <Confirm
                open={confirmOpen}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={deletePostOrComment}
            />
        </>

    )
}

const DELETE_POST_MUTATION = gql`  
    mutation deletePost($postId: ID!){
        deletePost(postId: $postId)
    }
`;

const DELETE_COMMENT_MUTATION = gql`
    mutation deleteComment($postId: ID!, $commentId: ID!){
        deleteComment(postId: $postId, commentId: $commentId){
            id 
            comments{
                id username createdAt body
            }
        }
        commentCount
    }
`;

export default DeleteButton;
