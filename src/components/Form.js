/*
Component to create a form which update/add data to firebase realtime datebase

props-
    1. heading <string>: The heading that get displayed on top of the form
    2. action <string>: Action to perform using the data. Possible values are 'update' and 'push'.
                        While using 'push' a new key is generated the data is written to at that location.
    3. schema<object>: The schema that represent the structure of data and location to which data and images are added;
                Properties of schema 
                    1. to<string>:location in database to which data is to be added/updated.
                    2. imgLocation<string>: location in storage to which images are to be uploaded.
                    3. data<array>:structure of data in the database. This structure is used to generate the form.
                                Elements inside the array represent the data to be written in database and may correspond
                                to feilds or input inside the form.
                                Each element<object> has properties
                                    1. key<string>:key in database
                                    2. type<string>:Type of input required, possible values are text,textfield,image,select,json,collection.
                                    3. displayName<string>: Label of input field.
                                According to the value of 'type' other properties are avalable.It include
                                    For type 'json'
                                        -data<array>
                                        -notSub<boolean>
                                    For type 'collection'
                                        -schema<array>
                                        And all of that of 'json'
                                    For type 'select'
                                        -values<array>||<string>
        schema prop can also be array of the above object
    4. sameKey<boolean>: Whether to use the same key while adding new data when multiple schemas are used.

schema.data in detail:
    Each entry in schema.data represent input field(s). Type 'text','textfield', 'image' are straight forward. Type 'image'
    corresponds to a image element using which a user can insert image. The image will be uploaded to schema.imgLocation in
    storage, and it's url in database.

    For type 'select' an additional property 'values' is available which provide the values for select input.
    'values' can be an array of values to be shown or string, in that case values are fetched from database.
    The value of that string can be the location at which the array of values are present.For eg: a/b/c
    But if the values are present in multiple location but under the same structure wild cards can be used.
    For eg: If the structure is
                a:{
                    b:{
                        name:
                    },
                    c:{
                        name:
                    },
                    d:{
                        name:
                    }
                }
            It should be a/$/name
    
    Type 'json' represent collection of data. For example:
                a:{
                    b:val1,
                    c:val2,
                    d:val2,
                }
            Here the key is a and data is an array containing corresponding fields of b,c and d
    The whole purpose of 'json' is to visually show the structure of data ie you can use key:a/b also, it will not show the structure visually.
    
    Type 'collection' is used when a collection of json whose strucure is same is to be shown. A button to add a new unit and a button to remove
    each unit will be provided in the form. To represent a unit schema is used. For eg:
                To add data of this format 'collection' can be used
                    a{
                        b:X,
                        c:X,
                        d:X,
                        ...
                    }
                X is a json of same structure, which is described in 'schema' property
    For types 'json' and 'collection' property 'notSub' is available which indicates if the fields inside should 
    contained in the parent container or not.

    Every input element corresponding to schema.data will be placed in a grid.Sub items inside 'json' and 'collection'
    will be contained inside the parent item. To not show this behavior and place sub item in the parent grid 'notSub'
    should be true.


    Example:
        <Form heading='test' action='push' sameKey={true} schema={schema} />
        schema = [
    {
        to: '/stores/',
        imgLocation: 'stores/',
        data: [
            { key: 'name', type: 'text', displayName: 'name' },
            { key: 'location', type: 'text', displayName: 'Location' },
            { key: 'category', type: 'select', displayName: 'category', values: '/categories/$1/name' },
            { key: 'desciption', type: 'textarea', displayName: 'discription' },
            { key: 'img', type: 'image', displayName: 'Image' },
            { key: 'phone', type: 'text', displayName: 'phone' },
            { key: 'stars', type: 'text', displayName: 'stars' },
            {
                key: 'coords', type: 'json', displayName: 'coordinates', notSub: true, data: [
                    { key: 'latitude', type: 'text', displayName: 'latitude' },
                    { key: 'longitude', type: 'text', displayName: 'longitude' },
                ]
            },
            {
                key: 'urls', type: 'json', displayName: 'Links', notSub: true, data: [
                    { key: 'instagram', type: 'text', displayName: 'Instagram' },
                    { key: 'dribbble', type: 'text', displayName: 'Website' },
                ]
            }

        ]
    },
    {
        to: '/store_details/',
        imgLocation: 'stores/',
        data: [
            { key: 'bannerImg', type: 'image', displayName: 'Banner image' },
            {
                key: 'services', type: 'collection', displayName: 'Services', notSub: true, schema: [
                    { key: 'name', type: 'text', displayName: 'Name' },
                    { key: 'charge', type: 'text', displayName: 'Charge' },
                    { key: 'img', type: 'image', displayName: 'Image' },

                ]
            },
        ]

    }

];

*/

import React from 'react';
import { useFormik } from 'formik';
import { useLocation, useHistory } from "react-router-dom";
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';
import Backdrop from '@material-ui/core/Backdrop';
import RemoveIcon from '@material-ui/icons/Remove';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import NativeSelect from '@material-ui/core/NativeSelect';
import { useNotFormik } from '../functions/useNotFormik'
import { uploadFile, DbInsert, DbUpdate, generatePushID, DbGet, deleteFile } from '../functions/firebase';
import { stringToObject, getObjectValueUsingString, collectionToJsonSchema, collectObjectValues, schemaToStringKeys, getValidationSchema, getElementsOfType } from '../functions/objectStringSchema';
import { arrayIntersect, arrayDifference, objectDifference, removeEmptyProperties } from '../functions/general'
import UImage from './ImageUpload';
import img from '../Placeholder.jpg';
import toast, { Toaster } from 'react-hot-toast';
import copy from "fast-copy";
import merge from 'deepmerge';
import * as Yup from 'yup';
import axios from 'axios';

const validationSchema = Yup.object().shape({
    ['/stores/category']: Yup.string()
        .required('Required'),
    ['/stores/name']: Yup.string()
        .required('Required'),

});

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: 100,
        color: '#fff',
    },
    card: {
        backgroundColor: 'rgba(255,255,255,1)',
        marginBottom: '10px',
        boxShadow: '1px 1px 4px -2px rgba(0,0,0,0.59)',

    },
    submitArea: {
        margin: '30px 0 10px 0'
    },
    form: {
        margin: '5px 0 20px 0'
    }

}));

const resolveDependentData = (schema) => {
    //console.log('----------resolveDependentData---------');
    return new Promise(async (res, rej) => {
        let s = copy(schema);
        for (const e of s) {
            if (e.type === 'select') {
                if (typeof e.values === 'string') {
                    let pos = e.values.search(/\$/);
                    if (pos !== -1) {
                        let before = e.values.slice(0, pos),
                            after = e.values.slice(pos);
                        try {
                            let baseData = await DbGet(before);
                            let data = collectObjectValues(baseData, after);
                            e.values = Array.isArray(data) ? data : [];
                        }
                        catch (error) {
                            e.values = [];
                            rej(error);
                        }


                    }
                    else { //not tested
                        let data = DbGet(e.values)
                        e.values = data;
                    }
                }
                else if (!Array.isArray(e.values))
                    e.values = [];
            }
            if (e.type === 'json') {
                e.data = await resolveDependentData(e.data);
            }
            if (e.type === 'collection')
                e.schema = await resolveDependentData(e.schema);

        }

        res(s);
    });

}

const removeFromSchema = (schema, objString) => {
    //console.log('----------removeFromSchema---------');
    if (objString) {
        let formattedKey = objString.replaceAll(/^\/|\/$/g, '').split('/');
        if (formattedKey.length === 1) {
            schema.data.forEach((e, i) => {
                if (e.key === formattedKey[0])
                    schema.data.splice(i, 1);
            });
        }
        else if (formattedKey.length > 1) {
            schema.data.forEach((e) => {
                if (e.key === formattedKey[0])
                    removeFromSchema(e, formattedKey.slice(1).join(''))
            });
        }

    }
}

const addToSchema = (schema, objString, item) => {
    //console.log('----------addToSchema---------');
    if (objString) {
        let formattedKey = objString.replaceAll(/^\/|\/$/g, '').split('/');
        if (formattedKey.length === 1) {
            schema.data.forEach((e, i) => {
                if (e.key === formattedKey[0]) {
                    if (!e.data)
                        e.data = []
                    if (Array.isArray(item))
                        e.data.push(...item);
                    else
                        e.data.push(...item);

                }
            });
        }
        else if (formattedKey.length > 1) {
            schema.data.forEach((e) => {
                if (e.key === formattedKey[0])
                    addToSchema(e, formattedKey.slice(1).join(''), item)
            });
        }
    }
}

const deleteImages = (images) => {
    //console.log('----------deleteImages---------');
    return new Promise(async (res, rej) => {
        let result = { deleted: [], failed: [] }
        for (var k of images) {
            try {
                let del = await deleteFile(k);
                result.deleted.push(k);
            }
            catch (e) {
                console.log(e);
                result.failed.push(k);
            }
        }
        res(result);
    });

}

const jsonToFormMap = (json, level = '') => {
    // //console.log('----------jsonToFormMap---------');
    if (!json)
        return {};
    const formMap = new Object();
    for (var p of Object.entries(json)) {
        if (typeof p[1] === 'object') {
            Object.assign(formMap, jsonToFormMap(p[1], `${level}/${p[0]}`));
        }
        else
            formMap[`${level}/${p[0]}`] = p[1];
    }
    //console.log('----------formMap---------',formMap);
    return formMap;
}

const getFiles = (formObject) => {
    //console.log('----------getFiles---------');
    let files = {}
    let keys = Object.keys(formObject);
    for (var k of keys) {
        if (formObject[k] instanceof File) {
            console.log('----------k---------', k);
            files[k] = formObject[k];
        }
    }
    return files;
}

const removeEmptyFiles = (files) => {
    //console.log('----------removeEmptyFiles---------');
    let f = { ...files };
    let keys = Object.keys(f);
    for (var k of keys) {
        if (f[k].size === 0) {
            delete f[k];
        }
    }
    return f;
}

const resolveEmptyFiles = (formObject, data) => {
    //console.log('----------resolveEmptyFiles---------');
    let f = getFiles(formObject);
    let keys = Object.keys(f);
    for (var k of keys) {
        if (f[k].size === 0) {
            if (data && data[k])
                formObject[k] = data[k];
            else
                delete formObject[k];
        }
    }
    return formObject;
}

const uploadImages = (files, imgLocation) => {
    //console.log('----------uploadImages---------');
    return new Promise(async (res, rej) => {
        let result = { uploaded: {}, failed: {} }
        let keys = Object.keys(files);
        //console.log('----------result---------',result);
        //console.log('----------keys---------',keys);
        for (var k of keys) {
            try {
                let imgUrl = await uploadFile(imgLocation, files[k]);
                result.uploaded[k] = imgUrl;
            }
            catch (e) {
                console.log(e);
                result.failed[k] = files[k];
            }
        }
        res(result);
    });

}

const submitData = (formData, action, to, key, heading, toastId) => {
    //console.log('----------submitData----formData-----', formData);
    // console.log('----------submitData----action-----', action);
    //console.log('----------submitData----to-----', to);
    // console.log('----------submitData----key-----', key);
    //console.log('----------submitData----heading-----', heading);

    if (action === 'update') {
        switch (heading) {
            case 'Add category':
                console.log('----------Update Category-------misfer');
                break;
            case 'Ad Banner':
                console.log('----------Ad Banner-----');
                Object.entries(formData).map(([k, v]) => {
                    console.log('----------k-----', k.replace('/ads/frontPage/RQJCOSIF4JF/', ''));
                    console.log('----------v-----', v);
                    const pushData = new FormData();
                    pushData.append("image", v);
                    axios({ method: 'POST', url: process.env.REACT_APP_API_URL + 'api/banner/create', data: pushData, headers: { 'Content-Type': 'multipart/form-data' } })
                        .then(function (response) {
                            if (response.status == 200) {
                                console.log(response.data);
                                toast.dismiss(toastId);
                                toast.success('Added!');
                                window.location.reload(false);
                            }
                        }).catch(function (error) {
                            console.log(error);
                            toast.dismiss(toastId);
                            toast.error('Upload Failed');
                        });
                });
                break;
        }
    } else if (action == 'push') {
        switch (heading) {
            case 'Add category':
                console.log('----------Add New Category-----');
                const pushData = new FormData();
                Object.entries(formData).map(([k, v]) => {
                    //console.log('----------k-----', k.replace('/categories/', ''));
                    // console.log('----------v-----', v);
                    let Key = k.replace('/categories/', '');
                    console.log('----------Key-----', Key);
                    if (Key == 'name') {
                        pushData.append("name", v);
                    }
                    if (Key == 'label') {
                        pushData.append("label", v);
                    }
                    if (Key == 'img') {
                        pushData.append("image", v);
                    }
                });
                pushData.append("auth_user", localStorage.getItem('user_id'));
                //console.log('----------pushData-----', pushData);
                axios({ method: 'POST', url: process.env.REACT_APP_API_URL + 'api/category/create', data: pushData, headers: { 'Content-Type': 'multipart/form-data' } })
                    .then(function (response) {
                        if (response.status == 200) {
                            console.log(response.data);
                            toast.dismiss(toastId);
                            toast.success('Added!');
                            window.location.reload(false);
                        }
                    }).catch(function (error) {
                        console.log(error);
                        toast.dismiss(toastId);
                        toast.error('Upload Failed');
                    });
                break;
            case 'Add Store':
                //console.log('----------Ad Banner-----');
                Object.entries(formData).map(([k, v]) => {
                    const postData = new FormData();
                    //console.log('----------v-----', v);  
                    let Key = k.replace('/stores/', '');
                    console.log('----------Key-----', Key);
                    if (Key == 'name') {
                        //console.log('----------name-----', v);
                        postData.append("name", v);
                    }
                    if (Key == 'location') {
                        // console.log('----------location-----', v);
                        postData.append("location", v);
                    }
                    if (Key == 'category') {
                        //console.log('----------category-----', v);
                        postData.append("category", v);
                    }
                    if (Key == 'desciption') {
                        // console.log('----------desciption-----', v);
                        postData.append("desciption", v);
                    }
                    if (Key == 'phone') {
                        // console.log('----------phone-----', v);
                        postData.append("phone", v);
                    }
                    if (Key == 'stars') {
                        // console.log('----------stars-----', v);
                        postData.append("stars", v);
                    }
                    if (Key == 'coords/latitude') {
                        //console.log('----------latitude-----', v);
                        postData.append("latitude", v);
                    }
                    if (Key == 'coords/longitude') {
                        // console.log('----------longitude-----', v);
                        postData.append("longitude", v);
                    }
                    if (Key == 'urls/instagram') {
                        console.log('----------instagram-----', v);
                        postData.append("instagram", v);
                    }
                    if (Key == 'urls/dribbble') {
                        console.log('----------dribbble-----', v);
                        postData.append("dribbble", v);
                    }
                    if (Key == 'img') {
                        // console.log('----------image-----', v);
                        postData.append("image", v);
                    }
                    if (Key == 'bannerImg') {
                        console.log('----------bannerImg-----', v);
                        postData.append("bannerImg", v);
                    }
                    console.log('----------postData-----', postData);
                    axios({ method: 'POST', url: process.env.REACT_APP_API_URL + 'api/store/create', data: postData, headers: { 'Content-Type': 'multipart/form-data' } })
                    .then(function (response) {
                        if (response.status == 200) {
                            console.log(response.data);
                            // toast.dismiss(toastId);
                            // toast.success('Added!');
                            // window.location.reload(false);
                        } else {
                            // toast.dismiss(toastId);
                            // toast.error('Upload Failed');
                        }
                    }).catch(function (error) {
                        console.log(error);
                        // toast.dismiss(toastId);
                        // toast.error('Upload Failed');
                    });
                });

                
                break;
            case 'Ad Banner':
                //console.log('----------Ad Banner-----');
                Object.entries(formData).map(([k, v]) => {
                    console.log('----------k-----', k.replace('/ads/frontPage/RQJCOSIF4JF/', ''));
                    console.log('----------v-----', v);
                    const pushData = new FormData();
                    pushData.append("image", v);
                    axios({ method: 'POST', url: process.env.REACT_APP_API_URL + 'api/banner/create', data: pushData, headers: { 'Content-Type': 'multipart/form-data' } })
                        .then(function (response) {
                            if (response.status == 200) {
                                console.log(response.data);
                                toast.dismiss(toastId);
                                toast.success('Added!');
                                window.location.reload(false);
                            }
                        }).catch(function (error) {
                            console.log(error);
                            toast.dismiss(toastId);
                            toast.error('Upload Failed');
                        });
                });
                break;

        }
    } else if (action === 'delete') {
        console.log('----------action === delete-----');
    }
    // formData = removeEmptyProperties(copy(formData));
    // if (Object.keys(formData).length > 0) {
    //     let f = stringToObject(formData);
    //     f = getObjectValueUsingString(f, to);
    //     if (f) {

    //         if (action === 'update') {
    //             console.log('----------submitData----update-----',to, f, true);
    //             return DbInsert(to, f, true);

    //         }
    //         else if (action === 'push') {
    //             if (key) return DbInsert(to.replace(/\/$/, '') + `/${key}`, f, true);
    //             console.log('----------submitData----push-----',to, f);
    //             return DbInsert(to, f);
    //         }

    //     }
    // }
    // return true;
}

const createSchemaCollection = (schema) => {
    ////console.log('----------createSchemaCollection---------');
    return schema ?
        !Array.isArray(schema) ? { [schema.to.replaceAll(/^\/|\/$/g, '')]: schema } : Object.fromEntries(schema.map((e, i) => { return [e.to.replaceAll(/^\/|\/$/g, ''), e] }))
        : null;
}

const getStringKeysFromSchema = (currentSchema) => {
    //console.log('----------getStringKeysFromSchema---------');
    let ret = []
    for (const k of Object.keys(currentSchema)) {
        //console.log('----------getStringKeysFromSchema---------');
        ret.push(...schemaToStringKeys(currentSchema[k].data).map(e => `/${k}${e}`))
    }
    return ret;
}

export default function Form({ heading, schema, action, sameKey }) {

    const location = useLocation();
    const history = useHistory();
    const [resolvedSchema, updateResolvedSchema] = React.useState({});
    const [submitting, updateSubmitting] = React.useState(false);
    const [loading, updateLoading] = React.useState(false);
    const [nodeData, updateNodeData] = React.useState(null);
    const [categoryData, setCategoryData] = React.useState([]);
    const [currentSchema, updateCurrentSchema] = React.useState(createSchemaCollection(schema));
    const [validationSchema, updateValidationSchema] = React.useState(null);
    const inputsRef = React.useRef({});
    const forms = React.useRef({});
    const classes = useStyles();
    const formik = useFormik({ initialValues: jsonToFormMap(categoryData), enableReinitialize: true, validationSchema: validationSchema, });
    //abc
    const updateS = (key) => (val) => updateCurrentSchema(prev => { return { ...prev, [key]: val } })
    const updateN = (key) => (val) => updateNodeData(prev => { return { ...prev, [key]: val } });
    const initialize = async (schema, updateSchema, updateNode) => {
        //console.log('----------initialize---------');
        updateLoading(true);
        let updatedSchema = await resolveDependentData(schema.data);
        let schemaC = copy(schema);
        schemaC.data = updatedSchema;
        updateSchema(schemaC);
        if (action === 'update') {
            let data = await DbGet(schema.to);
            if (data) {
                let collections = getElementsOfType(schemaC.data, 'collection');
                Object.keys(collections).map((e) => {
                    let cNode = getObjectValueUsingString(data, e);
                    if (typeof cNode === 'object' && cNode !== null) {
                        let sc = collectionToJsonSchema(collections[e], Object.keys(cNode));
                        console.log(sc)
                        let s = copy(schemaC);
                        addToSchema(s, e, sc);
                        updateSchema(s);
                    }
                });
            }
            updateNode(data);
        }
        updateLoading(false)

    }
    React.useEffect(() => {
        //console.log('----------useEffect---------');
        // if (currentSchema) {
        //     if (typeof currentSchema === 'object' && currentSchema !== null) {
        //         let validation = {};
        //         Object.keys(currentSchema).forEach(e => {
        //             try {
        //                 initialize(
        //                     currentSchema[e],
        //                     (val) => {
        //                         updateS(e)(val);
        //                         updateResolvedSchema(prev => { return { [e]: val, ...prev } })
        //                     },
        //                     updateN(e));
        //                 validation = { ...validation, ...getValidationSchema(currentSchema[e].data, '/' + e) }
        //             }
        //             catch (e) {
        //                 console.log(e);
        //                 toast.error('An error occured');
        //                 history.goBack();

        //             }
        //         });
        //         updateValidationSchema(Yup.object().shape(validation));
        //         console.log(validationSchema, formik.validationSchema, validation)
        //     }
        // }
       // axios.post(process.env.REACT_APP_API_URL + 'api/store/getone', {
       if(action ==='update') {
        axios.post(process.env.REACT_APP_API_URL + 'api/category/getone', {id:11})
            .then(function (response) {
                if (response.status == 200) {
                    console.log('=======response.data.misfer========'+action, response.data);
                    setCategoryData(response.data.data)
                }
            }).catch(function (error) {
                console.log(error);
            });
        }
    }, []);
    const removeFormFiles = (id) => {
        //console.log('----------removeFormFiles---------');
        for (const v of Object.values(inputsRef.current[id])) {
            v && v.clearInputs();
        }
    }
    const removeImages = (id) => {
        //console.log('----------removeImages---------');
        for (const v of Object.values(inputsRef.current[id])) {
            v.clearImages();
        }
    }
    const handleClick = (e) => {
        //console.log('----------handleClick---------');
        e.preventDefault();
    };
    const submitMultiple = async () => {
        //console.log('----------submitMultiple---------',currentSchema);
        let schemaStringKeys = getStringKeysFromSchema(currentSchema);
        schemaStringKeys.forEach(e => { //console.log('----------submitMultiple---e------',e); 
            formik.setFieldTouched(e, true, false)
        });
        let errors = await formik.validateForm();
        if (Object.keys(errors).length === 0) {
            updateSubmitting(true);
            const toastId = toast.loading('please wait...');
            const notif = {
                success: () => {
                    toast.dismiss(toastId);
                    if (action === 'push') toast.success('Added!');
                    else if (action === 'update') toast.success('Updated!');
                },
                failed: () => {
                    toast.dismiss(toastId);
                    toast.error('Upload Failed');
                }
            }
            let key = null, fail = false;
            // if (action === 'push' && sameKey === true)
            //     key = generatePushID();
            for (const k of Object.keys(forms.current)) {
                //console.log('----------submitMultiple---k------',k);
                try {
                    await submit(forms.current[k], currentSchema[k], nodeData && jsonToFormMap({ [k]: nodeData[k] }), key, toastId);
                    removeFormFiles(k);
                    if (action === 'update') {
                        // DbGet(currentSchema[k].to).then((data) => {
                        //     updateN(data);
                        // });

                    }
                    else if (action === 'push') {
                        removeImages(k);

                    }
                }
                catch (e) {
                    console.log(e)
                    fail = true;
                    notif.failed();
                    history.goBack();
                    break;
                }

            }
            if (action === 'push') {
                formik.setValues(Object.fromEntries(schemaStringKeys.map(e => [e, ''])));
                //console.log('----------resolvedSchema---------',resolvedSchema);
                updateCurrentSchema(resolvedSchema);
            }
            if (!fail) {
                schemaStringKeys.forEach(e => formik.setFieldTouched(e, false, false));
                notif.success();

            }
            updateSubmitting(false);

        }

    }
    const submit = (form, schema, nodeDataStr = {}, key = null, toastId) => {
        //console.log('----------submit-----form----',form);
        //console.log('----------submit-----schema----',schema);
        //console.log('----------submit-----nodeDataStr----',nodeDataStr);
        return new Promise(async (resolve, reject) => {
            let formdata = Object.fromEntries((new FormData(form)).entries());
            formdata = resolveEmptyFiles(formdata, nodeDataStr);
            //console.log('----------submit----2-----',copy(formdata));
            let files = getFiles(formdata);
            if (action === 'update') {
                let imgRegexp = Object.keys(getElementsOfType(schema.data, "image")).map(e => {
                    return `${e.replaceAll(/\/\$.*\//g, "\/.+\/")}$`;
                });
                let oldImgs = Object.keys(nodeDataStr).filter((e) => {
                    return imgRegexp.some(k => {
                        let pattern = new RegExp(k);
                        return !!e.match(pattern);
                    })
                })
                let toDelete = arrayDifference(arrayDifference(oldImgs, Object.keys(files)), Object.keys(formdata)).map(e => {
                    return nodeDataStr[e];
                });
                //console.log('----------submit-----3----',nodeDataStr);
                //console.log('----------submit-----4----',oldImgs, Object.keys(files), Object.keys(formdata), arrayDifference(oldImgs, Object.keys(files)));
                //console.log('----------submit-----5----',toDelete);
                deleteImages(toDelete);
            }


            // console.log('----------submit---------',formdata);
            // console.log('----------Object.keys(files).length---------',Object.keys(files).length);
            // console.log('----------files---------',files);
            /*if (Object.keys(files).length === 0) {
                await submitData(formdata, action, schema.to, key,heading);
                resolve(true);
            }else {
                uploadImages(files, schema.imgLocation).then(async (res) => {
                    formdata = { ...formdata, ...res.uploaded };
                    await submitData(formdata, action, schema.to, key,heading);
                    if (action === 'update') {
                        let currentData = nodeDataStr;
                        if (currentData) {
                            let updated = arrayIntersect(Object.keys(currentData), Object.keys(res.uploaded));
                            let toBeRemoved = updated.map((e) => { return currentData[e]; });
                            deleteImages(toBeRemoved);
                        }

                    }
                    resolve(true);
                }).catch(e => {
                    reject(e);

                });
            }*/
            console.log('----------Object.keys(files).length---------', Object.keys(files).length);
            await submitData(formdata, action, schema.to, key, heading, toastId);
        });

    }
    const loadMultipleImages = (e, keyProp, inputId, id, level) => {
        //console.log('----------loadMultipleImages---------');
        if (inputsRef.current.length == 0) {
            return (<UImage title={e.displayName} ref={e => {
                inputsRef.current[id] = inputsRef.current[id] ?? {};
                inputsRef.current[id][keyProp] = e;
            }}
                name={inputId}
                src={getObjectValueUsingString(nodeData ? nodeData[id] : null, `${level}/${e.key}`)}
                defaultImage={img} />
            )
        }
        else {
            for (let i = 0; i < inputsRef.current.length; i++) {
                return (
                    <UImage title={e.displayName} ref={e => {
                        inputsRef.current[i] = inputsRef.current[i] ?? {};
                        inputsRef.current[i][keyProp] = e;
                    }}
                        name={inputId}
                        src={getObjectValueUsingString(nodeData ? nodeData[id] : null, `${level}/${e.key}`)}
                        defaultImage={img} />
                )
            }
        }


    }
    const generateFeilds = (map, level = '', parent, sch = {}) => {
        // console.log('----------map---------',map);
        // console.log('----------level---------',level);
        // console.log('----------parent---------',parent);
        // console.log('----------sch---------',sch);
        let { schema, updateSchema, id } = sch;

        if (!map || !Array.isArray(map))
            return;
        const fieldElements = map.map((e, i) => {
            let levelInt = level.match(/\//);
            levelInt = levelInt ? levelInt.length : 0;
            let keyProp = `${levelInt}_${i}`, inputId = level === '' ? `/${id}/${e.key}` : `/${id}${level}/${e.key}`;
            if (e.type == 'text')
                return (
                    <Grid key={keyProp} item xs={12} sm={6}>
                        <TextField
                            InputLabelProps={{ shrink: true }}
                            id={inputId}
                            name={inputId}
                            label={e.displayName}
                            fullWidth
                            onChange={formik.handleChange}
                            value={formik.values[inputId]}
                            error={formik.touched[inputId] && !!formik.errors[inputId]}
                            helperText={formik.touched[inputId] && formik.errors[inputId]}
                            onBlur={() => formik.setFieldTouched(inputId, true)}
                        /> .....
                    </Grid>
                )
            else if (e.type == 'textarea')
                return (
                    <Grid key={keyProp} item xs={12} sm={6}>
                        <TextField
                            InputLabelProps={{ shrink: true }}
                            id={inputId}
                            name={inputId}
                            label={e.displayName}
                            multiline
                            fullWidth
                            rows={6}
                            rowsMax={15} 

                        />
                    </Grid>
                )
            else if (e.type == 'select')
                return (
                    <Grid key={keyProp} item xs={12} sm={6}>
                        <InputLabel id="demo-simple-select-label">{e.key}</InputLabel>
                        <NativeSelect
                            name={inputId}
                            id={inputId}
                            onChange={(e) => formik.setFieldValue(inputId, e.target.value)}
                            onBlur={() => formik.setFieldTouched(inputId, true)}
                            value={formik.values[inputId]}
                            error={formik.touched[inputId] && !!formik.errors[inputId]}>
                            <option aria-label="None" value="Select" />
                            {
                                Array.isArray(categoryData) && categoryData.map((m, i) => <option key={i} value={m.name}>{m.name}</option>)
                            }
                        </NativeSelect>
                        <FormHelperText error>{formik.touched[inputId] && formik.errors[inputId]}</FormHelperText>
                    </Grid>
                )

            else if (e.type == 'image')
                return (
                    <Grid key={keyProp} item xs={12} sm={6}>
                        <UImage title={e.displayName} ref={e => { inputsRef.current[id] = inputsRef.current[id] ?? {}; inputsRef.current[id][keyProp] = e; }}
                            name={inputId}
                            src={getObjectValueUsingString(nodeData ? nodeData[id] : null, `${level}/${e.key}`)}
                            defaultImage={img}
                        />
                        

                    </Grid>
                )
            else if (e.type == 'json' && e.data) {

                if (e.notSub)
                    return (
                        <Grid key={keyProp} item xs={12} sm={12}>
                            <Grid container spacing={3} className={e.parent?.type === 'collection' ? classes.card : null}>
                                {
                                    e.parent?.type === 'collection' &&
                                    <Fab color="primary" aria-label="add"
                                        onClick={() => {
                                            let s = copy(schema);
                                            removeFromSchema(s, `${level}/${e.key}`);
                                            updateSchema(s);
                                        }

                                        }>
                                        <RemoveIcon />
                                    </Fab>
                                }
                                <Grid item xs={12} sm={12}>
                                    <Typography variant="h6" className={classes.formSubHeading} >
                                        {e.displayName}
                                    </Typography>
                                </Grid>
                                {generateFeilds(e.data, `${level}/${e.key}`, e, sch)}
                            </Grid>

                        </Grid>
                    )
                else
                    return (
                        <Grid key={i} item xs={12} sm={6}>
                            <Grid item xs={12} sm={12}>
                                <Typography variant="h6" gutterBottom>
                                    {e.displayName}
                                </Typography>
                            </Grid>
                            <Grid container spacing={3} >
                                {generateFeilds(e.data, `${level}/${e.key}`, e, sch)}
                            </Grid>
                        </Grid>
                    )
            } else if (e.type == 'collection') {
                return (
                    <Grid key={keyProp} item xs={12} sm={12}>
                        <Grid item xs={12} sm={12}>
                            <Typography variant="h6" gutterBottom>
                                {e.displayName}
                            </Typography>

                        </Grid>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={12}>
                                <Button variant="contained" color="primary" onClick={() => {
                                    let s = copy(schema);
                                    addToSchema(s, `${level}/${e.key}`, collectionToJsonSchema(e, ['sdgfjsd']));
                                    console.log(s);
                                    updateSchema(s);
                                }}>
                                    +
                                </Button>
                            </Grid>

                            {
                                generateFeilds(e.data, `${level}/${e.key}`, e, sch)
                            }

                        </Grid>
                    </Grid>
                )
            }
        })
        return fieldElements;
    }
    if (!schema || !action)
        return <></>
    return (
        <>
            {
                currentSchema && (typeof currentSchema === 'object' && currentSchema !== null) &&
                <React.Fragment >
                    <ArrowBackIcon onClick={() => history.goBack()}></ArrowBackIcon>
                    <Typography variant="h4" gutterBottom>
                        {heading}
                    </Typography>

                    <Backdrop className={classes.backdrop} open={loading} onClick={handleClick}>
                        <CircularProgress color="inherit" />
                    </Backdrop>
                    {Object.keys(currentSchema).map((e) => {
                        ////console.log('----------e---------', e);
                        return (
                            <form
                                className={classes.form}
                                key={e}
                                ref={k => forms.current[e] = k}
                                encType="multipart/form-data">
                                <Grid container spacing={3}>
                                    {generateFeilds(currentSchema[e]?.data, '', null, { schema: currentSchema[e], updateSchema: updateS(e), id: e })}
                                </Grid>
                            </form>
                        )
                    }

                    )}
                    <Grid container direction="row-reverse"
                    >
                        <Button disabled={submitting} onClick={submitMultiple} variant="contained" color="primary" className={classes.submitArea}>
                            Submit.....
                        </Button>
                    </Grid>
                </React.Fragment>
            }
        </>
    );
}