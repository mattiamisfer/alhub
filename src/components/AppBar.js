import React from 'react';
import clsx from 'clsx';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
//import firebase from "firebase/app";
import { useHistory } from "react-router-dom";
import { Redirect } from 'react-router-dom';

export default function AppBarComponent({ classes, drawer, open }) {


    const history = useHistory();
    function logout(){
        // console.log('--------logout-----pressed----');
        // //firebase.auth().signOut();
        // localStorage.setItem('is_login', false);
        // localStorage.setItem('full_name', null);
        // localStorage.setItem('token', null);
        // localStorage.setItem('user_id', null);
        // window.location.reload(false);
        
        localStorage.clear()
        window.location.reload(false);
    }
    return (
        <AppBar position="absolute"
            className={clsx(classes.appBar, open && classes.appBarShift)}
        >
            <Toolbar className={classes.toolbar}>
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="open drawer"
                    onClick={drawer}
                    className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
                >
                    <MenuIcon />
                </IconButton>
                <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
                    Dashboard
          </Typography>
                <IconButton color="inherit" >
                <ExitToAppIcon onClick={() => logout()} />

                </IconButton>
            </Toolbar>
        </AppBar>
    )
}