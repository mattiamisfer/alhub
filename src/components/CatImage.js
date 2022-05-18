import { Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Component } from 'react';
import { Grid } from '@material-ui/core';
import 'antd/dist/antd.css';

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
}

class CatImage extends Component {
    state = {
        loading: false,
    };

    handleChange = info => {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            console.log('info', info.file.response.imageId);
            if (this.props.multiple) {
                let value = this.props.value;
                this.props.onChange(value === "" ? info.file.response.imageId : value + ","+info.file.response.imageId)
            }else{
                this.props.onChange(info.file.response.imageId)
            }
            
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, imageUrl =>
                this.setState({
                    imageUrl,
                    loading: false,
                }),
            );
        }
    };

    render() {
        const { loading, imageUrl } = this.state;
        const uploadButton = (
            <div>
                {loading ? <LoadingOutlined /> : <PlusOutlined />}
                <div style={{ marginTop: 8 }}>Upload</div>
            </div>
        );
        return (
            <>
                <Grid container spacing={3}>
                    <Grid item xs={4}>
                        {this.props.title}
                    </Grid>
                    <Grid item xs={4}>
                        {/* <input
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
                                            className='formImg'
                                            onClick={clickInput}></img>
                                    )
                                })

                        } */}



                         {/* <img 
                         
        src={process.env.REACT_APP_API_URL + 'static/Images/Category/'+rhi} />
 */}


                        <Upload
                            name="image"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={this.props.multiple}
                            multiple={this.props.multiple}
                            action={process.env.REACT_APP_API_URL + 'api/category/upload'}
                            beforeUpload={beforeUpload}
                            onChange={this.handleChange}
                            value={this.props.value}
                        >
                            {console.log('this.props.multiple', this.props.multiple)}
                            {this.props.multiple ?
                                <>
                                    {uploadButton}

                                </>
                                 
                                :
                                <>
                                    {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                                </>
                            }




                            

                        </Upload>
                    </Grid>

                    <Grid item xs={4}>
                        {
                            this.props.value ? 
                            <>
                            <img width={150} src={process.env.REACT_APP_API_URL + 'static/Images/Category/'+this.props.value} />
                            </>
                            :
                            <>

                            </>
                        }

                         
                    </Grid>

                </Grid>
            </>

        );
    }
}

export default CatImage;