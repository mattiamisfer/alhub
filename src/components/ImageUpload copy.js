import React from 'react';
import Grid from '@material-ui/core/Grid';
//import firebase from 'firebase/app';
import Skeleton from '@material-ui/lab/Skeleton';
import './form.css';
const ImageUpload = React.forwardRef(({ title, defaultImage, name, src }, ref) => {
    const inputRef = React.useRef();
    React.useImperativeHandle(ref, () => ({
        clearInputs: () => {
            inputRef.current.value = null;

        },
        clearImages: () => {
            setImgState({
                currentFile: null,
                previewImage: defaultImage,
            });
        }
    }));
    React.useEffect(() => {
        async function getImage() {
            setLoading(true);
            try {
                // let res = await firebase.storage().refFromURL(src).getDownloadURL();
                // setImgState({
                //     currentFile: null,
                //     previewImage: res
                // });
            }
            catch (e) {
                setImgState({
                    currentFile: defaultImage,
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
                    currentFile: null,
                    previewImage: src
                });
    }, [src]);
    const [loading, setLoading] = React.useState(false);
    const [imgState, setImgState] = React.useState(
        {
            currentFile: src ? null : defaultImage,
            previewImage: src ? null : defaultImage,
        });
    function selectFile(e) {
        //const file = e.target.files[0];
        const file = e.target.files;
        if (file[0].type.startsWith('image/')) {
            setImgState(
                {
                    currentFile: file[0],
                    previewImage: URL.createObjectURL(file[0]),
                }
            );
        }
    }
    function clickInput() {
        inputRef.current.click();
    }
    return (
        <Grid container spacing={3}>
            <Grid item xs={3}>
                {title}
            </Grid>
            <Grid item xs={9}>
                <input
                    ref={inputRef}
                    hidden
                    accept="image/*"
                    type="file"
                    onChange={selectFile}
                    multiple
                    name={name || ""}
                />
                {console.log(imgState)}
                {
                    loading ? <Skeleton variant="rect" width={210} height={118} animation="wave" />
                        :
                        
                        <img src={imgState.previewImage}
                            alt=''
                            onError={() => setImgState({
                                currentFile: null,
                                previewImage: defaultImage,
                            })}
                            className='formImg'
                            onClick={clickInput}></img>

                }
            </Grid>

        </Grid>
    );
});
export default ImageUpload;