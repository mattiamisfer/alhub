import React from 'react';

//import firebase from 'firebase/app';
//import 'firebase/storage';
import { Link, useHistory, useLocation } from 'react-router-dom'
import schemaFactory from '../functions/schemaFactory'
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';

import { deleteFromDb as deleteData } from '../functions/deleteData';


import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';



const useStyles = makeStyles({
    root: {
        maxWidth: 345,
    },
});





export default function CardComponent({ data }) {

    const [url, setUrl] = React.useState();
    const [render,sr] = React.useState(false);
    let location = useLocation()


    const deleteCat = () => {
        confirmAlert({
            title: 'Confirm to delete',
            message: 'Are you sure to do this.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        console.log( data.key)
                        deleteData(`/categories/${data.key}`);
                    }
                },
                {
                    label: 'No',
                    //onClick: () => alert('Click No')
                }
            ]
        });
    };

    React.useEffect(() => {
        // //wa....
        // if(location.pathname === "/categories") sr(true);
        // // else setpath('/store_details/services')
        // async function getImage() {
        //     try {
        //         let res = await firebase.storage().refFromURL(data.value.img).getDownloadURL();
        //         console.log(res)
        //         setUrl(res);
        //     }
        //     catch (e) {
        //         console.log(e)
        //     }
        // }
        // getImage();
    }, [])

    

    console.log('=======data====', data)
    const classes = useStyles();
    return (
        <>
            { data &&
                <Card className={classes.root}>
                    <CardActionArea>
                        <CardMedia
                            component="img"
                            alt={data.value?.label || data.value?.name}
                            height="150"
                            image={process.env.REACT_APP_API_URL + 'static/Images/Category/'+data.value?.filename}
                            title={data.value?.label || data.value?.name} 
                        />
                        <CardContent>

                            <Typography gutterBottom variant="h6" component="h2" noWrap>
                                {data.value?.label || data.value?.name}

                            </Typography>
                            {/*
                                <Typography gutterBottom variant="h6" component="h2">
                                {data.value?.category}

                            </Typography>
                            <Typography variant="body2" color="textSecondary" component="p">
                                {data.value?.charge}
                            </Typography>
                            */
                            }
                        </CardContent>
                    </CardActionArea>

                    {
                        render &&
                        <CardActions>
                            <Link to={{
                                pathname: "/form",
                                state: {
                                    heading: 'Edit Category',
                                    schema: ['category', data.key],
                                    action: 'update',
                                }
                            }}>
                                <Button size="small" color="primary">Edit</Button>
                            </Link>
                            <Button size="small" color="secondary" onClick={() => {
                                deleteCat()
                            }}>Delete</Button>
                        </CardActions>

                    }




                </Card>

            }
        </>
    );
}