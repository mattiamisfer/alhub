import React from 'react';
import Grid from '@material-ui/core/Grid';
import firebase from 'firebase/app';
import Skeleton from '@material-ui/lab/Skeleton';
import './form.css';
const Image = ({ title, defaultImage, style, src }) => {
    React.useEffect(() => {
        async function getImage() {
            setLoading(true);
            try {
                let res = await firebase.storage().refFromURL(src).getDownloadURL();
                setImgState({
                    previewImage: res
                });
            }
            catch (e) {
                setImgState({
                    previewImage: defaultImage,
                });
                console.log(e)
            }
            setLoading(false);
        }
        if (src)
            if (src.match(/^(gs:\/\/)/))
                getImage();
            else if (src.match(/^(https:\/\/)/))
                setImgState({
                    previewImage: src
                });
    }, [src]);
    const [loading, setLoading] = React.useState(false);
    const [imgState, setImgState] = React.useState(
        {
            previewImage: src ? null : defaultImage,
        });
    return (
        <Grid container spacing={3}>
            <Grid item xs={3}>
                {title}
            </Grid>
            <Grid item xs={9}>
                {
                    loading ? <Skeleton variant="rect" width={70} height={60} animation="wave" />
                        :
                        <img src={imgState.previewImage}
                            onError={() => setImgState({
                                currentFile: null,
                                previewImage: defaultImage,
                            })}
                            style={style}
                        ></img>

                }
            </Grid>

        </Grid >
    );
}
export default Image;