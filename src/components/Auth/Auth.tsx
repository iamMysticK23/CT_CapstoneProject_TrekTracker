// external imports
import * as React from 'react';
import { useState } from 'react';
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { 
    onAuthStateChanged,
    getAuth,
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword, 
    Auth} from 'firebase/auth';

import { setDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import {
    Alert,
    Box,
    Button,
    Snackbar,
    Typography,
    Stack,
    Divider,
    CircularProgress,
    Dialog,
    DialogContent } from '@mui/material';

// internal imports
import { NavBar } from '../sharedComponents';
import { InputText, InputPassword } from '../sharedComponents';
import homepage_image from '../../assets/Images/bike_auth.jpeg';


// styles for sign in/ sign up

const authStyles = {
    main: {
        backgroundImage: `linear-gradient(rgba(0,0,0, 0.2), rgba(0,0,0, 0.3)), url(${homepage_image});`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center top 5px',
        position: 'absolute',
        width: '100vw',
        height: '100vh',
        marginTop: '20px',
        overflow: 'hidden',
        zIndex: 0
    },
    stack: {
        width: '350px',
        marginTop: '100px',
        marginRight: 'auto',
        marginLeft: 'auto',
        color: 'white'
    },
    button: {
        width: '150px',
        fontSize: '14px'
    }
}

// interfaces for functions

interface Props {
    title: string;
}

interface ButtonProps {
    open: boolean;
    onClick: () => void;
  }

interface SubmitProps {
    email: string
    password: string
}


// message alerts
export type MessageType ='error' | 'warning' | 'info' | 'success'


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const GoogleButton = (_props: ButtonProps) => {

    const [ open, setOpen ] = useState(false)
    const [ message, setMessage ] = useState<string>()
    const [ messageType, setMessageType ] = useState<MessageType>()
    const navigate = useNavigate()
    const auth = getAuth()
    const [ signInWithGoogle, user, loading, error ] = useSignInWithGoogle(auth)

    const signIn = async () => {
        await signInWithGoogle();

        localStorage.setItem('auth', 'true')
        onAuthStateChanged(auth, (user) => {

            if (user) {
                createUserProfile(user); 
                localStorage.setItem('user', user.email || '')
                localStorage.setItem('token', user.uid || '')
                setMessage(`User: ${user.email} logged in.`)
                setMessageType('success')
                setOpen(true)
                setTimeout(() => {navigate('/googlemap')}, 2000)
            }
        })

        if (error) {
            setMessage(error.message)
            setMessageType('error')
            setOpen(true)
        }
        if (loading){
            return <CircularProgress />
        }
    }

    return (
        <Box>
            <Button
                variant = 'contained'
                color = 'info'
                size = 'medium'
                sx = {authStyles.button}
                onClick = { signIn }
            >
                Google Sign In
            </Button>
            <Snackbar
                open={open}
                autoHideDuration={3000}
                onClose={() => setOpen(false)}
            >
                <Alert severity={messageType}
                        sx = {{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>
        </Box>
    )
}


// sign in user
const SignInUser = () => {



    const [ open, setOpen ] = useState(false)
    const [ message, setMessage ] = useState<string>()
    const [ messageType, setMessageType ] = useState<MessageType>()
    const navigate = useNavigate()
    const auth = getAuth()
    const { register, handleSubmit } = useForm<SubmitProps>({})

    const onSubmit: SubmitHandler<SubmitProps> = async (data, event) => {
        if (event) event.preventDefault();
        console.log(data.email, data.password)
        signInWithEmailAndPassword(auth, data.email, data.password)
        .then((userCredential) => {
            localStorage.setItem('auth', 'true')
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    createUserProfile(user);  // Add this line here
                    localStorage.setItem('token', user.uid || '');
                    localStorage.setItem('user', user.email || '');
                }
            });
            const user = userCredential.user
            setMessage(`User: ${user.email} logged in.`)
            setMessageType('success')
            setOpen(true)
            setTimeout(() => {navigate('/googlemap')}, 2000)
        })
        .catch((error) => {
            const errorCode = error.code
            const errorMessage = error.message
            setMessage(errorMessage)
            setMessageType('error')
            setOpen(true)
          
        })
    }

    return  (
        <Box>
            <form onSubmit = {handleSubmit(onSubmit)}>
                <Typography variant ='h6'>Sign In</Typography>
                <Box>
                    <label htmlFor='email'></label>
                    <InputText {...register('email')} name='email' placeholder='Enter email address' />
                    <label htmlFor='password'></label>
                    <InputPassword {...register('password')} name='password' placeholder='Enter password (6 or more characters)' />
                </Box>
                <Button type='submit'>Submit</Button>
            </form>
            <Snackbar
                open={open}
                autoHideDuration={3000}
                onClose={() => setOpen(false)}
            >
                <Alert severity={messageType}
                        sx = {{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>
        </Box>
    )

}

// create profile 
const createUserProfile = async (user) => {
    const userRef = doc(db, 'users', user.uid);
    
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
        const { uid, email, displayName } = user;
        const createdAt = new Date();

        await setDoc(userRef, {
            uid,
            email,
            displayName,
            createdAt,
            // ... any other default data you want to set
        });
    }
};

// sign in user
const RegisterUser = () => {

    const [ open, setOpen ] = useState(false)
    const [ message, setMessage ] = useState<string>()
    const [ messageType, setMessageType ] = useState<MessageType>()
    const navigate = useNavigate()
    const auth = getAuth()
    const { register, handleSubmit } = useForm<SubmitProps>({})

    const onSubmit: SubmitHandler<SubmitProps> = async (data, event) => {
        if (event) event.preventDefault();
        console.log(data.email, data.password)
        createUserWithEmailAndPassword(auth, data.email, data.password)
        .then((userCredential) => {
            localStorage.setItem('auth', 'true')
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    createUserProfile(user);  // Add this line here
                    localStorage.setItem('token', user.uid || '');
                    localStorage.setItem('user', user.email || '');
                }
            });
            const user = userCredential.user
            setMessage(`User: ${user.email} created and logged in.`)
            setMessageType('success')
            setOpen(true)
            setTimeout(() => {navigate('/googlemap')}, 2000)
        })
        .catch((error) => {
            const errorCode = error.code
            const errorMessage = error.message
            setMessage(errorMessage)
            setMessageType('error')
            setOpen(true)
          
        })
    }

    return  (
        <Box>
            <form onSubmit = {handleSubmit(onSubmit)}>
                <Typography variant ='h6'>Register for account</Typography>
                <Box>
                    <label htmlFor='email'></label>
                    <InputText {...register('email')} name='email' placeholder='Enter email address' />
                    <label htmlFor='password'></label>
                    <InputPassword {...register('password')} name='password' placeholder='Enter password (6 or more characters)' />
                </Box>
                <Button type='submit'>Submit</Button>
            </form>
            <Snackbar
                open={open}
                autoHideDuration={3000}
                onClose={() => setOpen(false)}
            >
                <Alert severity={messageType}
                        sx = {{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>
        </Box>
    )

}

export const AuthComponent = (props: Props) => {

    const [ open, setOpen ] = useState(false)
    const navigate = useNavigate();
    const [signType, setSignType ] = useState<string>()

    const handleSnackClose = () => {
        setOpen(false)
        navigate('/googlemap')
    }



    return (
        <Box>
            <NavBar />
            <Box sx={authStyles.main}>
                <Stack direction = 'column' alignItems ='center' textAlign='center' sx ={authStyles.stack}>
                    <Typography
                        variant = 'h2'
                        sx = {{color: 'white', fontWeight: 'bold'}}
                    >
                        {props.title}
                    </Typography>
                    <br />
                    <Typography variant = 'h5'>
                        Discover new trails. Make a journal to document your hikes.
                    </Typography>
                    <br />
                    <GoogleButton open={open} onClick={handleSnackClose} />
                    <Divider variant='fullWidth' color ='darkgreen' />
                    <Stack
                        width ='100%'
                        alignItems = 'center'
                        justifyContent='space-between'
                        direction = 'column'
                        padding = "20px"
                        >
                            <Button
                                variant = 'contained'
                                color = 'primary'
                                size = 'small'
                                sx = {{
                                    ...authStyles.button,
                                    marginBottom: "10px"
                                }}
                                onClick ={()=>{setOpen(true); setSignType('login')}}
                                >
                                    Login With Email
                                </Button>
                                <Button
                                variant = 'contained'
                                color = 'primary'
                                size = 'small'
                                sx = {{
                                    ...authStyles.button,
                                   marginTop:"10px" 
                                }}
                                onClick ={()=>{setOpen(true); setSignType('signup')}}
                                >
                                    Sign Up With Email
                                </Button>
                        </Stack>
                </Stack>
                <Dialog open={open} onClose ={()=>{setOpen(false)}}>
                    <DialogContent>
                    {signType === 'login' ? <SignInUser /> : <RegisterUser />}
                    </DialogContent>
                </Dialog>
            </Box>
        </Box>
    )
}