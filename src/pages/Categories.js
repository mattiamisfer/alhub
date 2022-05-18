import React from 'react';
//import firebase from 'firebase/app';
import { Link,useHistory } from "react-router-dom";
//import 'firebase/database';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Container, Fab } from '@material-ui/core/';
import AddIcon from '@material-ui/icons/Add';
import Card from '../components/Card';
import schemaFactory from '../functions/schemaFactory'
import axios from 'axios';
import { CButton } from '@coreui/react';
import toast from 'react-hot-toast';
//import history from '../history';
import { createBrowserHistory } from 'history'

const history = createBrowserHistory();
export const useStyles = makeStyles({
    fab: {
        margin: '0',
        top: 'auto',
        right: '30px',
        bottom: '30px',
        left: 'auto',
        position: 'fixed',
    }
});

export default function Categories() {
    const classes = useStyles();
 
    const [data, update] = React.useState([]);

//  const history = useHistory();

    React.useEffect(() => {
        const init = async () => {
            // let category = firebase.database().ref('/categories');
            // return category.on('value', (snapshot) => {
            //     update(snapshot.val())
            // });

            axios({ method: 'GET', url: process.env.REACT_APP_API_URL + 'api/category/getall' })
                .then(function (response) {
                    if (response.status == 200) {
                        console.log('=======response.data========', response.data);
                        update(response.data.data)
                    }
                }).catch(function (error) {
                    console.log(error);
                });
        }
        init()
    }, []);

    const hanldeDelete = (id) => {
        console.log('iiiii ', id);
        axios.post(process.env.REACT_APP_API_URL + 'api/category/delete', { id })
            .then(function (response) {
                if (response.status == 200) {
                    console.log('=======response.data========', response.data);
                    // update(response.data.data)
                    toast.success('Deleted!');
                    window.location.reload(false);
                }
            }).catch(function (error) {
                console.log(error);
            });
    };
    // const someEventHandler = (id) => {
    //     history.push({

    
    //         pathname: `/categoriess`,
    //         state: {
    //             heading: 'Edit category',
    //             schema: ['category'],
    //             action: 'push',
    //         }
    //     });
    //  //   window.location.reload(false);

    //   //  window.location.reload(false);
 
    //  };
 
 
 

    return (data !== null ? (
        <Container>
            <Grid container spacing={2}>{
                Object.keys(data).map(element => (

                    <Grid item xs={6} sm={3}>
                        <Card data={{ value: data[element], key: element }} key={element} />

                        <Link 

to={{
    pathname: "/categories-edit/"+data[element].id,
    state: {
        heading: 'Edit category',
        schema: ['category'],
        action: 'update',
    }
}}
                    
                    
                    
                    >
                        
 
<CButton color="warning" className="px-4">
    Edit
</CButton>
 
                    </Link>

                         
                        <CButton color="danger" className="px-4" onClick={() => hanldeDelete(data[element].id)}>
                            Delete
                        </CButton>
                    </Grid>
                ))
            }

            </Grid>
            <Link to={{
                pathname: "/form",
                state: {
                    heading: 'Add category',
                    schema: ['category'],
                    action: 'push',
                }
            }}>
                <Fab color="primary" className={classes.fab} aria-label="add">
                    <AddIcon />
                </Fab>
            </Link>
        </Container>
    ) : (<Container>
        <h1>No Data</h1>
        <Link to={{
            pathname: "/form",
            state: {
                heading: 'Add category',
                schema: ['category'],
                action: 'push',
            }
        }}>
            <Fab color="primary" className={classes.fab} aria-label="add">
                <AddIcon />
            </Fab>
        </Link>
    </Container>)
    )
}