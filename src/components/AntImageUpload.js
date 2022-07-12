import { Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import React,{ Component } from 'react';
import { Grid,Button } from '@material-ui/core';
import 'antd/dist/antd.css';
import axios from 'axios';
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

class AntImageUpload extends Component {
    state = {
        loading: false,
        delete:'Delete'
    };
    removeValue(list, value) {
        return list.replace(new RegExp(",?" + value + ",?"), function (match) {
          var first_comma = match.charAt(0) === ",",
            second_comma;
      
          if (
            first_comma &&
            (second_comma = match.charAt(match.length - 1) === ",")
          ) {
            return ",";
          }
          return "";
        });
      }

handleDelete =(id) => {

    axios.post(process.env.REACT_APP_API_URL + 'api/store/delete-img', {
        id: id,
        store_id: this.props.storeid
      })
      .then(function (response) {
        console.log(response);

        alert('Image is Deleted')
        window.location.reload()

        
      })
      .catch(function (error) {
        console.log(error);
      });

      
//this.removeValue(this.props.value, id); // 2,3
//alert(this.removeValue(this.props.value,id)); // 2,3   
// if(this.props.multiple) {


//         this.props.onChange(this.removeValue(this.props.value,id))
//         this.setState({
//             delete: 'Click Submit Button to Confirm Delete'
//         })
//     } else {
// //this.props.onChange(file.response.imageId)
//     }
     }


     componentDidMount() {

     }

   

    handleChange = info => {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            console.log('info...', info.file.response.imageId);
            if (this.props.multiple) {
                let value = this.props.value;
                this.props.onChange(value === "" ? info.file.response.imageId : value + ","+info.file.response.imageId)
            }else{
                //alert(info.file.response.imageId)
               this.props.onChange(info.file.response.imageId)
//this.props.handleInputServiceChange(info.file.response.imageId)
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


    fetchEvent =() => {
        const filteredUsers = this.props.banners.filter((user) => {
            return [this.props.value].includes(user)
          });

      console.log('Data is'+ filteredUsers)
    }

 
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
                        
                        <Upload
                            name="image"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={this.props.multiple}
                            multiple={this.props.multiple}
                            action={process.env.REACT_APP_API_URL + 'api/store/upload'}
                            beforeUpload={beforeUpload}
                            onChange={this.handleChange}
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

   
                    
                    </Grid>

                    <Grid item xs={4}>
                        {/* {this.props.banners} */}
                       


                        {
                            this.props.multiple ===false && this.props.value && this.props.single === true? 
                            <>
                        
                            
                            <img width={150} src={process.env.REACT_APP_API_URL + "static/Images/Store/" +this.props.image}/>
                            </>
                            :
                            <>

                            </>
                        }


                        {/* {
                           this.props.services?.map((service,key) => (
                               <>
     <Grid item xs={3} key={key}>
    
     
    
    <img width={150} src={process.env.REACT_APP_API_URL + "static/Images/Store/" +service.image.filename} />
    </Grid>

                               </>
                           ))
                        } */}

                         
                    </Grid>


                    
                    {this.props.banners === null? <> 
            

            </>
            :
            <>
                        {this.props.banners?.map((product,key) => (
    
                            
    
    <Grid item xs={3} key={key}>
    
     
    
     <img width={150} src={process.env.REACT_APP_API_URL + "static/Images/Store/" +product.filename} />
    <Button variant="outlined" color="error" onClick={e=> this.handleDelete(product.id)}>Delete</Button>  
    </Grid>
    ))};
            </>
                            }

                </Grid>
            </>

        );
    }
}

export default AntImageUpload;