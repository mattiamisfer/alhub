import React from 'react';
import Grid from '@material-ui/core/Grid';
//import firebase from 'firebase/app';
import Skeleton from '@material-ui/lab/Skeleton';
import './form.css';
const ImageUpload = React.forwardRef(({ title, defaultImage, name, src}, ref) => {
    const inputRef = React.useRef();
    React.useImperativeHandle(ref, () => ({
        clearInputs: () => {
            inputRef.current.value = null;

        },
        clearImages: () => {
            setImgState([{ currentFile: null, previewImage: defaultImage, }]);
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
                setImgState([{ currentFile: defaultImage, previewImage: defaultImage, }]);
                console.log(e)
            }
            setLoading(false);
        }
        if (src){
            console.log('----src-----', src);
        }
            // if (src.match(/^(gs:\/\/)/))
            //     getImage();
            // else if (src.match(/^(https:\/\/)/))
            //     setImgState({currentFile: null,  previewImage: src });
    }, [src]);
    const [loading, setLoading] = React.useState(false);
    const [imgState, setImgState] = React.useState([{ currentFile: src ? null : defaultImage, previewImage: src ? null : defaultImage, }]);
    function selectFile(event) {
        //console.log('----target-----', event.target.files.length);
        let img = [];
        for (let i = 0; i < event.target.files.length; i++) {
            let image =  event.target.files[i];
            if (image.type.startsWith('image/')) {
                //console.log('----mapData-----', image);
                img.push({ currentFile:image, previewImage: URL.createObjectURL(image) });
            }
        }
        console.log('----img-----', img);
        setImgState(img);
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
                {
                    loading ? <Skeleton variant="rect" width={210} height={118} animation="wave" />
                        :
                        imgState.map((mapData) => {
                            //console.log('------mapData----', mapData)
                            return (
                                <img src={mapData.previewImage}
                                    alt={name}
                                    onError={() => setImgState([{
                                        currentFile: null,
                                        previewImage: defaultImage,
                                    }])}
                                    className=''
                                    onClick={clickInput}></img>
                            )
                        })

                }
            </Grid>

        </Grid>
    );
});
export default ImageUpload;