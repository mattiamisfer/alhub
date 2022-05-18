import React from 'react';
import { BrowserRouter as Router, Switch, Route,withRouter } from 'react-router-dom';


import clsx from 'clsx';
import CssBaseline from '@material-ui/core/CssBaseline';

import Container from '@material-ui/core/Container';


import AppBar from '../components/AppBar'
import Drawer from '../components/Drawer'
import { useStyles } from '../components/styles'
import Stores from './Stores';

import ViewStoreDetails from './ViewStoreDetails';
import Categories from './Categories';
import AdBanner from './AdBanner';
import Form from '../components/Form';
import FormWrap from '../components/formWrap';
import StoreAdd from '../components/StoreAdd'
import StoreEdit from '../components/StoreEdit';
import EditCategory from '../components/EditCategory';
import { createBrowserHistory } from 'history'

const history = createBrowserHistory()



function Dashboard() {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpen(false);
    };
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
    return (

        <>
            <Router>  

            <div className={classes.root}>
                <CssBaseline />
                <AppBar classes={classes} drawer={handleDrawerOpen} open={open} />
                <Drawer classes={classes} drawer={handleDrawerClose} open={open} />
                <main className={classes.content}>
                    <div className={classes.appBarSpacer} />
                    <Container maxWidth="lg" className={classes.container}>

                        <Switch>

                            <Route path="/ads">
                                <AdBanner />
                            </Route>

                            <Route path="/categories">
                                <Categories />
                            </Route>

                            <Route path="/view">
                                <ViewStoreDetails />
                            </Route>
                            <Route path='/store/add'>
                                <StoreAdd />
                            </Route>
                            <Route path='/store/edit/:id'>
                                <StoreEdit />
                            </Route>
                            <Route path='/form'>
                                <FormWrap />
                            </Route>

                            <Route path='/categories-edit/:id' >
                            <EditCategory />

                                </Route>

 
 

                            <Route path="/">
                                <Stores />
                            </Route>
                        </Switch>

                    </Container>

                </main>
            </div>
            </Router>
        </>
    );
}

export default Dashboard;