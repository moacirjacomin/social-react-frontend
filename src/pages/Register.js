import React, { useState, useContext } from 'react'
import { Form, Button } from 'semantic-ui-react';
import { useMutation } from '@apollo/react-hooks';
import { useForm } from '../utils/util_hooks';
import gql from 'graphql-tag';
import { AuthContext } from '../context/auth';

function Register(props) {
    const context = useContext(AuthContext);
    const initialState = {
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
    };

    const [errors, setErrors] = useState({});

    // my custom hooks
    const { onChange, onSubmit, values} = useForm(registerUser,initialState);

    const [addUser, { loading }] = useMutation(REGISTER_USER, {
        update(_, { data: { register: userData}}) {
            console.log(userData);
            context.login(userData)
            props.history.push('/');
        },
        onError(err) {
            console.log(err.graphQLErrors[0].extensions.exception.errors);
            setErrors(err.graphQLErrors[0].extensions.exception.errors);
        },
        variables: values
    });

    function registerUser(){
        addUser();
    }



    return (
        <div className="form-container">
            <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : " "}>
                <h1>Register</h1>
                <Form.Input
                    label="username"
                    placeholder="Username"
                    name="username"
                    type="email"
                    value={values.username}
                    error={errors.username ? true : false }
                    onChange={onChange}
                />

                <Form.Input
                    label="E-mail"
                    placeholder="E-mail"
                    name="email"
                    type="email"
                    value={values.email}
                    error={errors.email ? true : false }
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

                <Form.Input
                    label="Confirm Password"
                    placeholder="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    value={values.confirmPassword}
                    error={errors.confirmPassword ? true : false }
                    onChange={onChange}
                />

                <Button type="submit" primary >
                    Register
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
const REGISTER_USER = gql`
    mutation register(
        $username : String!
        $email : String!
        $password : String!
        $confirmPassword : String!
    ){
        register( 
            registerInput:{
                username: $username
                email: $email
                password: $password
                confirmPassword: $confirmPassword
            }
        ){
            id email username createdAt token
        }
    }
`;

export default Register;