import React from 'react';
import firebase from 'firebase/app';
import "firebase/database";
import "firebase/storage"
import { Container, Typography, Grid, Paper } from '@material-ui/core';
import Card from '../components/Card'

import LocationOnIcon from '@material-ui/icons/LocationOn';
import CategoryIcon from '@material-ui/icons/Category';

import { useLocation } from 'react-router-dom'

async function getData(id) {
    return new Promise(async (resolve, reject) => {
        const db = firebase.database();
        try {
            const storeSnapshot = await db.ref('/stores/' + id).once('value');
            const storeDetailsSnapshot = await db.ref('/store_details/' + id).once('value');
            resolve({ ...storeSnapshot.val(), ...storeDetailsSnapshot.val() })
        }
        catch (e) {
            reject(e)
        }
    });
}


export default function ViewStoreDetails() {
    let location = useLocation();
    let id = location.id;
    const [data, setData] = React.useState(null)
    React.useEffect(() => {
        getData(id)
            .then((result) => {
                console.log(result)
                setData(result);
            })
            .catch(e => {
                console.log(e)
                // throw new Error(e);
            })
    }, []);
    if (data)
        return (
            <Container component={Paper}>
                <Grid>
                    <Typography gutterBottom variant="h3" component="h2">
                        {data.name}
                    </Typography>
                    <Typography gutterBottom variant="h6" component="h6">
                        {data.desciption}
                    </Typography>



                    <Typography gutterBottom variant="h5" component="h2">
                        <CategoryIcon></CategoryIcon>
                        <span>{data.category}</span>
                    </Typography>

                    <Typography gutterBottom variant="h5" component="h2">
                        <LocationOnIcon></LocationOnIcon>
                        <span>{data.location}</span>
                    </Typography>

                </Grid>


                { data.services &&
                    <Grid>
                        <Typography gutterBottom variant="h4" component="h2">Services</Typography>
                        <Grid container spacing={2}>{
                            Object.keys(data.services).map(element => (
                                <Grid item xs={6} sm={3}>
                                    <Card data={{ value: data.services[element], key: element }} key={element} />
                                </Grid>
                            ))
                        }
                        </Grid>
                    </Grid>
                }

            </Container>

        )
    else
        return <></>
}