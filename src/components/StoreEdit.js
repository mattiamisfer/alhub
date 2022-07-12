import { Backdrop, Button, CircularProgress, FormHelperText, Grid, InputLabel, NativeSelect, TextField, Typography } from "@material-ui/core";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useLocation, useHistory, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import AntImageUpload from "./AntImageUpload";
import toast from "react-hot-toast";
import { Alert, Select } from "antd";

const StoreEdit = () => {
    const history = useHistory();
    const [categoryData, setCategoryData] = useState([]);
    const [banners,setBanners] = useState([]);
    const [count, setCount] = useState(0);
    const [banner,setBanner] = useState();
    const [store,setStore] =useState();
    const [image,setImage] = useState();
    const [service,setService] = useState([])
    const [updateService,setUpdateService] = useState([{id:'',name:'',charge:'', image: {
        filename: "",
        destination: ""
      }}]);
    const { register, handleSubmit, watch, control, setValue, formState: { errors } } = useForm();
    const params = useParams();

    console.log('useParams', params.id);

    useEffect(() => {


        axios({ method: 'GET', url: process.env.REACT_APP_API_URL + 'api/category/getall' })
            .then(function (response) {
                if (response.status == 200) {
                    console.log('=======response.data========', response.data);
                    setCategoryData(response.data.data)
                }
            }).catch(function (error) {
                console.log(error);
            });
        axios.post(process.env.REACT_APP_API_URL + 'api/store/getone', {
            id: params.id
        })
            .then(function (response) {
                if (response.status == 200) {
                    console.log('=======response.data========', response.data);
                    // setCategoryData(response.data.data)
                    setValue("name", response.data.data[0].name)
                    setValue("location", response.data.data[0].location)
                    setValue("category", response.data.data[0].category)
                    setValue("description", response.data.data[0].desciption)
                    setValue("phone", response.data.data[0].phone)
                    setValue("stars", response.data.data[0].stars)
                    setValue("latitude", response.data.data[0].latitude)
                    setValue("longitude", response.data.data[0].longitude)
                    setValue("instagram", response.data.data[0].instagram)
                    setValue("website", response.data.data[0].dribbble)
                    setValue("offer", response.data.data[0].offer)
                    setValue('image',response.data.data[0].image)

                    setImage(response.data.data[0].filename)
                    //setValue('banners',)
                          setValue('banner',response.data.data[0].bannerimg)

                    setBanners(response.data.data[0].bannerImages)

                    console.log('banners'+ JSON.stringify(response.data.data[0].bannerImages))
                    setValue("images", [process.env.REACT_APP_API_URL + "static/Images/Store/" + response.data.data[0].filename])
                    setValue("keywords", response.data.data[0].keywords.split(","))
                 setValue("services", response.data.data[0].services);

                 setUpdateService(response.data.data[0].services)
                    setService(response.data.data[0].services)
                    setValue("id",params.id);

                }
            }).catch(function (error) {
                console.log(error);
            });
            //window.reload();
    }, []);

    const handleInputServiceChange = index => e => {
        ///const { name, value } = event.target;
      //  alert(name + value)
       // setTutorial({ ...tutorial, [name]: value });
       let newArr = [...updateService]; // copying the old datas array
       newArr[index] = e.target.value; // replace e.target.value with whatever you want to change it to
     
       setUpdateService(newArr);
      //  alert(JSON.stringify(newArr));
       
      };

      const saveService =(id) => {

        alert(JSON.stringify(id))

      }
    

      const handleDelete =(id) => {
          //alert(id);
          console.log('iiiii ',id);
        axios.post(process.env.REACT_APP_API_URL + 'api/store/delete-service', {id})
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
      }

    const handleStoreEdit = (data) => {


       // let newdata = data.push({banner:"name"});

     // const obj = {'banner':'123'};

    //  const obj = {'banner':'newItemInput'};
    //  const newArray = data.slice(); // Create a copy
    //  newArray.push(obj); 
    // data.push({'banner':'newItemInput'});

    //data.banner = setValue('banner');
    

//alert(setValue('banner')

//alert(JSON.stringify(data))

       console.log('dddd ', JSON.stringify(data));
        axios({ method: 'POST', url: process.env.REACT_APP_API_URL + 'api/store/update', data })
            .then(function (response) {
                if (response.status == 200) {
                    console.log(response.data);
                    // toast.dismiss(toastId);
                    toast.success('Updaated');
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

    let { fields, append, remove,replace,update } = useFieldArray({
        control,
        name: "services",
    });

    return <>

        <ArrowBackIcon onClick={() => history.goBack()}></ArrowBackIcon>
        <Typography variant="h4" gutterBottom>
            Edit Store
        </Typography>

        {/* <Backdrop className={classes.backdrop} open={loading} onClick={handleClick}>
            <CircularProgress color="inherit" />
        </Backdrop> */}
        <form
            // className={classes.form}
            onSubmit={handleSubmit(handleStoreEdit)}
            encType="multipart/form-data">

            <Grid container spacing={3}>
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
                        name="location"
                        defaultValue=""
                        render={({ field: { onChange, onBlur, value, ref } }) => (
                            <>

                                <TextField
                                    InputLabelProps={{ shrink: true }}
                                    // id="name"
                                    // name="name"
                                    label="Location"
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
                        name="category"
                        defaultValue=""
                        render={({ field: { onChange, onBlur, value, ref } }) => (
                            <>

                                <InputLabel id="demo-simple-select-label">Category</InputLabel>
                                <NativeSelect
                                    // name={inputId}
                                    id="category"
                                    onChange={onChange}
                                    onBlur={onBlur}
                                    value={value}
                                // error={formik.touched[inputId] && !!formik.errors[inputId]}
                                >
                                    <option aria-label="None" value="Select" />
                                    {
                                        Array.isArray(categoryData) && categoryData.map((m, i) => <option key={i} value={m.id}>{m.name}</option>)
                                    }
                                </NativeSelect>
                                {/* <FormHelperText error>{formik.touched[inputId] && formik.errors[inputId]}</FormHelperText> */}
                            </>

                        )}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Controller
                        control={control}
                        name="description"
                        defaultValue=""
                        render={({ field: { onChange, onBlur, value, ref } }) => (
                            <>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        InputLabelProps={{ shrink: true }}
                                        label={"Description"}
                                        multiline
                                        fullWidth
                                        rows={6}
                                        rowsMax={15}
                                        onChange={onChange}
                                        value={value}
                                        // error={formik.touched[inputId] && !!formik.errors[inputId]}
                                        // helperText={formik.touched[inputId] && formik.errors[inputId]}
                                        onBlur={onBlur}

                                    />
                                </Grid>
                            </>

                        )}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Controller
                        control={control}
                        name="offer"
                        defaultValue=""
                        render={({ field: { onChange, onBlur, value, ref } }) => (
                            <>

                                <InputLabel id="demo-simple-select-label">Offer</InputLabel>
                                <NativeSelect
                                    // name={inputId}
                                    id="offer"
                                    onChange={onChange}
                                    onBlur={onBlur}
                                    value={value}
                                // error={formik.touched[inputId] && !!formik.errors[inputId]}
                                >
                                    <option aria-label="None" value="" />
                                    <option value={"Get 20% discount on total bill amount"}>Get 20% discount on total bill amount</option>
                                    <option value={"Get 25% discount on total bill amount"}>Get 25% discount on total bill amount</option>
                                    <option value={"Get 30% discount on total bill amount"}>Get 30% discount on total bill amount</option>
                                    <option value={"Complimentary desert"}>Complimentary desert</option>
                                <option value={"Buy one Get one free on main courses"}>Buy one Get one free on main courses</option>
                                    <option value={"Buy one Get one free on selected services"}>Buy one Get one free on selected services</option>

                                </NativeSelect>
                                {/* <FormHelperText error>{formik.touched[inputId] && formik.errors[inputId]}</FormHelperText> */}
                            </>

                        )}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Controller
                        control={control}
                        name="phone"
                        defaultValue=""
                        render={({ field: { onChange, onBlur, value, ref } }) => (
                            <>

                                <TextField
                                    InputLabelProps={{ shrink: true }}
                                    // id="name"
                                    // name="name"
                                    label="Phone"
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
                        name="stars"
                        defaultValue=""
                        render={({ field: { onChange, onBlur, value, ref } }) => (
                            <>

                                <TextField
                                    InputLabelProps={{ shrink: true }}
                                    // id="name"
                                    // name="name"
                                    label="Stars"
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

                <Grid item xs={12} sm={12}>
                    <Typography variant="h5" >
                        Coordinates
                    </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Controller
                        control={control}
                        name="latitude"
                        defaultValue=""
                        render={({ field: { onChange, onBlur, value, ref } }) => (
                            <>

                                <TextField
                                    InputLabelProps={{ shrink: true }}
                                    // id="name"
                                    // name="name"
                                    label="Latitude"
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
                        name="longitude"
                        defaultValue=""
                        render={({ field: { onChange, onBlur, value, ref } }) => (
                            <>

                                <TextField
                                    InputLabelProps={{ shrink: true }}
                                    // id="name"
                                    // name="name"
                                    label="Longitude"
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

                <Grid item xs={12} sm={12}>
                    <Typography variant="h5" >
                        Links
                    </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Controller
                        control={control}
                        name="instagram"
                        defaultValue=""
                        render={({ field: { onChange, onBlur, value, ref } }) => (
                            <>

                                <TextField
                                    InputLabelProps={{ shrink: true }}
                                    // id="name"
                                    // name="name"
                                    label="Instagram"
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
                        name="website"
                        defaultValue=""
                        render={({ field: { onChange, onBlur, value, ref } }) => (
                            <>

                                <TextField
                                    InputLabelProps={{ shrink: true }}
                                    // id="name"
                                    // name="name"
                                    label="Website"
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
                    {/* {id} */}
                    <Controller
                        control={control}
                        name="image"
                       // value={store_image}
                        defaultValue=""
                        render={({ field: { onChange, onBlur, value, ref } }) => (
                            <>

                                <AntImageUpload title="Image" single={true} image={image} multiple={false} onChange={onChange} value={value} />
                            </>

                        )}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Controller
                        control={control}
                        name="banner"
                        defaultValue=""
                        render={({ field: { onChange, onBlur, value, ref } }) => (
                            <>
                                <AntImageUpload banners={banners} storeid={params.id} title="Banner Image" multiple={true} onChange={onChange} value={value} />
                            </>

                        )}
                    />


                </Grid>
           

                <Grid container spacing={3}>
                    <Grid item xs={12} sm={12}>
                        <Button variant="contained" color="primary" onClick={() => {

                            append({ name: "", charge: "", image: "" })
                        }}>
                            +

                        </Button>
                    </Grid>
 

                    {fields.map((x, i) => {
                        return <>
                            <Grid item xs={12} sm={5} key={x.id}>
                                <Controller
                                    control={control}
                                    name={`services.${i}.name`}
                                    // defaultValue=""
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
                            <Grid item xs={12} sm={2}>
                                <Controller
                                    control={control}
                                    name={`services.${i}.charge`}
                                    // defaultValue=""
                                    render={({ field: { onChange, onBlur, value, ref } }) => (
                                        <>

                                            <TextField
                                                InputLabelProps={{ shrink: true }}
                                                // id="name"
                                                // name="name"
                                                label="Charge"
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
                                    name={`services.${i}.image`}
                                    // defaultValue=""
                                    render={({ field: { onChange, onBlur, value, ref } }) => (
                                        <>

                                        
                                         
                                            <AntImageUpload title="image" single={true} image={x.image.filename}  multiple={false} onChange={onChange} value={value} />
                                          
                                            </>

                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>

                                 <Button color="danger" variant="contained" onClick={e => handleDelete(x.newid)}>Delete</Button>
 
                            </Grid>
                        </>
                    })}

                </Grid>

                <Grid item xs={12} sm={6}>
                    <Controller
                        control={control}
                        name="keywords"
                        defaultValue={[]}
                        render={({ field: { onChange, onBlur, value, ref } }) => (
                            <>
                                {console.log('vvv ', value)}
                                {/* <AntImageUpload title="Banner Image" multiple={true} onChange={onChange} value={value} /> */}
                                <Select
                                    mode="tags"
                                    size="middle"
                                    placeholder="Enter Keywords"
                                    // defaultValue={['a10', 'c12']}
                                    value={value == "" ? [] : value}
                                    onChange={onChange}
                                    style={{ width: '100%' }}
                                >
                                </Select>
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

    </>;
}

export default StoreEdit;