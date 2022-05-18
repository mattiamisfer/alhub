
import { Backdrop, Button, CircularProgress, FormHelperText, Grid, InputLabel, NativeSelect, TextField, Typography } from "@material-ui/core";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useLocation, useHistory, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import CatImage from "./CatImage";
import toast from "react-hot-toast";
import { Select } from "antd";
import UImage from './ImageUpload';
import img from '../Placeholder.jpg';
import Skeleton from '@material-ui/lab/Skeleton';
import { Upload, message } from 'antd';

export default function EditCategory() {
  const history = useHistory();
    const [categoryData, setCategoryData] = useState([]);
    const [count, setCount] = useState(0);
    const { register, handleSubmit, watch, control, setValue, formState: { errors } } = useForm();
    const params = useParams();
    const [nodeData, updateNodeData] = React.useState(null);
    const inputsRef = React.useRef({});
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
      
     
      axios.post(process.env.REACT_APP_API_URL + 'api/category/getone', {id:params.id})
          .then(function (response) {
              if (response.status == 200) {
                  console.log('=======response.data.misfer========', response.data);
                  setValue("name", response.data.data[0].name)
                  setValue("label", response.data.data[0].label)
                  setValue("id",params.id);
                  axios.post(process.env.REACT_APP_API_URL + 'api/banner/getone',{id:response.data.data[0].image_id})
                      .then(function (responseImg) {
                        if(responseImg.status == 200) {
                          console.log('=======response.data.image========', responseImg.data);
                          setValue("image", responseImg.data.data[0].filename)

                        }
                      }).catch(function (error) {
                        console.log(error)
                      });

                      
               }
          }).catch(function (error) {
              console.log(error);
          });


          
      
  }, []);


  const handleStoreEdit = (data) => {


    console.log('new data ', data);
    
    axios({ method: 'POST', url: process.env.REACT_APP_API_URL + 'api/category/update', data })
        .then(function (response) {
            if (response.status == 200) {
                console.log(response.data);
                // toast.dismiss(toastId);
                toast.success('Successfully Updated!');
              //  window.location.reload(false);
            } else {
                // toast.dismiss(toastId);
                // toast.error('Upload Failed');
            }
        }).catch(function (error) {
            console.log(error);
            // toast.dismiss(toastId);
            // toast.error('Upload Failed');
        });
}
  return (
    <>
          <ArrowBackIcon ></ArrowBackIcon>
          <Typography variant="h4" gutterBottom>
            Edit Category 
        </Typography>

        
        <form
            onSubmit={handleSubmit(handleStoreEdit)}
            // className={classes.form}
             encType="multipart/form-data">

            <Grid container spacing={4}>
            <Grid item xs={12} sm={6}>
                    <Controller
                        control={control}
                        name="name"
                        defaultValue=""
                        render={({ field: { onChange, onBlur, value, ref } }) => (
                            <>

                                <TextField
                                    InputLabelProps={{ shrink: true }}
                                    // id="name"
                                    // name="name"
                                    label="Name"
                                    fullWidth
                                    onChange={onChange}
                                    value={value}
                                    // error={formik.touched[inputId] && !!formik.errors[inputId]}
                                    // helperText={formik.touched[inputId] && formik.errors[inputId]}
                                    onBlur={onBlur}
                                />
                            </>

                        )}
                    />
                
                </Grid>

 

                <Grid item xs={12} sm={6}>
                    <Controller
                        control={control}
                        name="label"
                        defaultValue=""
                        render={({ field: { onChange, onBlur, value, ref } }) => (
                            <>

                                <TextField
                                    InputLabelProps={{ shrink: true }}
                                    // id="name"
                                    // name="name"
                                    label="Label"
                                    fullWidth
                                    onChange={onChange}
                                    value={value}
                                    // error={formik.touched[inputId] && !!formik.errors[inputId]}
                                    // helperText={formik.touched[inputId] && formik.errors[inputId]}
                                    onBlur={onBlur}
                                />
                            </>

                        )}
                    />
                
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Controller
                        control={control}
                        name="image"
                        defaultValue=""
                        render={({ field: { onChange, onBlur, value, ref } }) => (
                            <>


            
                                <CatImage title="Image" multiple={false} onChange={onChange} value={value} />
                            </>

                        )}
                    />

            

                    
                </Grid>


                    </Grid>

                    <Grid container direction="row-reverse">
                <Button type="submit" variant="contained" color="primary" >
                    Submit
                </Button>
            </Grid>
                    </form>

    </>
  )
}