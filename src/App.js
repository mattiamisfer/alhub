import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import '../src/Assets/style.scss';
//import firebase from "firebase/app";
import { firebaseConfig } from "./config/firebase";
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import toast, { Toaster } from 'react-hot-toast';

import { CircularProgress, Box } from '@material-ui/core';
import Login from "./pages/Login";
const authContext = React.createContext(null);


export default function App() {
  React.useEffect(() => {
    //firebase.initializeApp(firebaseConfig);
    // let authObserver = firebase.auth().onAuthStateChanged((user) => {
    //   if (user) {
    //     firebase.auth().currentUser.getIdTokenResult().then((idToken) => {
    //       if (idToken?.claims?.roles)
    //         if (idToken.claims.roles[0] === "ADMIN") {
    //           console.log("success")
    //           localStorage.setItem('wasLoggedIn', 1);
    //           updateUser(user);
    //         }
    //         else {
    //           console.log("errrrrr")
    //           toast.error("Not an admin")
    //           firebase.auth().signOut();
    //         }

    //     })

    //   }
    //   else {
    //     localStorage.removeItem('wasLoggedIn');
    //     updateUser(null);
    //   }
    // });
    // if (localStorage.getItem('wasLoggedIn'))
    //   setTimeout(() => updateInitialized(true), 2000)
    // else
    //   updateInitialized(true);
    // return authObserver;

    //console.log('full_name:',localStorage.getItem('full_name'));
    console.log('is_login:',localStorage.getItem('is_login'));
    console.log('token:',localStorage.getItem('token'));
    //console.log('user_id:',localStorage.getItem('user_id'));
    let is_login = localStorage.getItem('is_login');
    if (is_login) {
      console.log('------Logged------');
      let userdata = {
        full_name: localStorage.getItem('full_name'),
        token: localStorage.getItem('token'),
        user_id: localStorage.getItem('user_id')
      }
      updateUser(userdata);
    } else {
      console.log('----not--Logged------');
      updateUser(null);
    }

  }, []);
  const [initialized, updateInitialized] = React.useState(false);
  const [user, updateUser] = React.useState(null);
  console.log('----user--------',user);
  // if (initialized !== true) {
  //   return (
  //     <Box
  //       display="flex"
  //       justifyContent="center"
  //       alignItems="center"
  //       minHeight="100vh"
  //     >
  //       <CircularProgress />
  //     </Box>
  //   )

  // }


  return (
    <>
      <authContext.Provider value={{ user, updateUser }}>
        <Router >
          <Switch>
            <Route path="/auth"> {user ? <Redirect to="/" /> : <Login />} </Route>
            <PrivateRoute path="/"> <Dashboard /> </PrivateRoute>
          </Switch>
        </Router>
      </authContext.Provider>
      <Toaster />
    </>
  )
}

function PrivateRoute({ children, ...rest }) {
  let auth = useContext(authContext);
  console.log(auth)
  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.user !== null ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/auth",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}