import React, { useState, useContext } from 'react'
import { Form, Button } from 'semantic-ui-react';
import { useMutation } from '@apollo/react-hooks';
import { useForm } from '../utils/util_hooks';
import gql from 'graphql-tag';
import { AuthContext } from '../context/auth';

function Login(props) {
    const context = useContext(AuthContext);
    const initialState = {
        password: '',
        username: '',
    };

    const [errors, setErrors] = useState({});

    // my custom hooks
    const { onChange, onSubmit, values} = useForm(loginUserCallback,initialState);

    const [loginUser, { loading }] = useMutation(LOGIN_USER, {
        
        update(_, { data: { login: userData}}) {
            // alternativa mais simples
            // update(_, result) { 
            // console.log(result);
            // context.login(result.data.login);
            console.log(userData);
            context.login(userData);

            props.history.push('/');
        },
        onError(err) {
            console.log(err.graphQLErrors[0].extensions.exception.errors);
            setErrors(err.graphQLErrors[0].extensions.exception.errors);
        },
        variables: values
    });

    function loginUserCallback(){
        loginUser();
    }



    return (
        <div className="form-container">
            <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : " "}>
                <h1>Login</h1>

                <Form.Input
                    label="User Name"
                    placeholder="User Name"
                    name="username"
                    type="username"
                    value={values.username}
                    error={errors.username ? true : false }
                    onChange={onChange}
                />

                <Form.Input
                    label="Password"
                    placeholder="Password"
                    name="password"
                    type="password"
                    value={values.password}
                    error={errors.password ? true : false }
                    onChange={onChange}
                />

                <Button type="submit" primary >
                    Login
                </Button>{
                    Object.keys(errors).length
                   
                }
                 {Object.values(errors).map((value) => ( value
                    ))}
                {Object.keys(errors).length > 0 && (
                    <div className="ui error message">
                        <ul >
                            {Object.values(errors).map((value) => (
                                <li key={value}>{value}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </Form>
        </div>
    )
}

// mutation
const LOGIN_USER = gql`
    mutation login(
        $username : String! 
        $password : String! 
    ){
        login( 
            username: $username
            password: $password  
        ){
            id email username createdAt token
        }
    }
`;

export default Login;