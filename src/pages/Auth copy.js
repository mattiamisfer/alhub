import React from 'react'
//import firebase from "firebase/app";
import 'firebase/auth';
import { useHistory } from "react-router-dom";

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import toast, { Toaster } from 'react-hot-toast';


const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export const signout = (setter) => firebase.app().auth().signOut();

const googleAuth = async (history) => {
    return new Promise(async (resolve, reject) => {
        const auth = firebase.auth();
        const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
        try {
            let res = await auth.signInWithPopup(googleAuthProvider);
            console.log(res)
            resolve(res)
        }
        catch (e) {
            console.log(e)
            reject(e)

        }
    })

};

export default function AuthPage(props) {
    const history = useHistory();
    const classes = useStyles();

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">Sign in</Typography>
                <form className={classes.form} noValidate>
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={() =>
                            googleAuth(
                                history
                            ).then(()=>{
                                toast.success("Login success")
                            }).catch(e => toast.error(e))
                        }
                    >Continue with Google</Button>

                </form>
            </div>
            <Toaster />
        </Container>

    );

}