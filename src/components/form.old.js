import React from 'react';
import { useFormik } from 'formik';
import { useLocation, useHistory } from "react-router-dom";
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Backdrop from '@material-ui/core/Backdrop';
import RemoveIcon from '@material-ui/icons/Remove';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import { useNotFormik } from '../functions/useNotFormik'
import { uploadFile, DbInsert, DbUpdate, generatePushID, DbGet, deleteFile } from '../functions/firebase';
import { stringToObject, getObjectValueUsingString, collectionToJsonSchema, getCollectionList, collectObjectValues, schemaToStringKeys } from '../functions/objectStringSchema';
import { arrayIntersect, arrayDifference, objectDifference } from '../functions/general'
import InputLabel from '@material-ui/core/InputLabel';
import UImage from './ImageUpload';
import img from '../Placeholder.jpg';
import NativeSelect from '@material-ui/core/NativeSelect';
import toast, { Toaster } from 'react-hot-toast';

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
    }

}));
const resolveDependentData = (schema) => {
    console.log(schema)
    return new Promise(async (res, rej) => {
        let s = JSON.parse(JSON.stringify(schema));
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
                        catch (e) {
                            e.values = [];
                            console.log(e)
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
                e.data = await resolveDependentData(e.schema);

        }

        res(s);
    });

}
const removeFromSchema = (schema, objString) => {
    console.log(objString)
    if (objString) {
        let formattedKey = objString.replaceAll(/^\/|\/$/g, '').split('/');
        if (formattedKey.length === 1) {
            schema.data.forEach((e, i) => {
                if (e.key === formattedKey[0])
                    delete schema.data[i];
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
    console.log(objString)
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
    return formMap;
}
const getFiles = (formObject) => {
    let files = {}
    let keys = Object.keys(formObject);
    for (var k of keys) {
        if (formObject[k] instanceof File) {
            files[k] = formObject[k];
        }
    }
    return files;
}
const removeEmptyFiles = (files) => {
    let f = { ...files };
    let keys = Object.keys(f);
    for (var k of keys) {
        if (f[k].size === 0) {
            delete f[k];

        }
    }
    return f;
}
const uploadImages = (files, imgLocation) => {
    return new Promise(async (res, rej) => {
        let result = { uploaded: {}, failed: {} }
        let keys = Object.keys(files);
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
        console.log(result)
        res(result);
    });

}
const submitData = (formData, action, to) => {

    let f = stringToObject(formData);
    if (action === 'update')
        return DbUpdate(to, f);
    else if (action === 'push')
        return DbInsert(to, f);
}

export default function Form({ heading, schema, action }) { //props has precedence over location.state
    console.log('FORM')
    let location = useLocation();
    let history = useHistory();
    console.log(location)
    let heading_ = heading || location?.state.heading;
    let action_ = action || location?.state.action;
    const [submitting, updateSubmitting] = React.useState(false);
    const [loading, updateLoading] = React.useState(false);
    const [nodeData, updateNodeData] = React.useState(null);
    const [currentSchema, updateCurrentSchema] = React.useState(schema || location?.state.schema);
    const inputsRef = React.useRef({});
    const formikRef = React.useRef();
    const classes = useStyles();
    const formik = useFormik({
        initialValues: jsonToFormMap(nodeData),
        enableReinitialize: true,
    });
    formikRef.current = formik
    React.useEffect(() => {
        console.log('use effect []')
        if (currentSchema) {
            updateLoading(true);
            resolveDependentData(currentSchema.data).then(updatedSchema => {
                let schemaC = JSON.parse(JSON.stringify(currentSchema));
                schemaC.data = updatedSchema;
                updateCurrentSchema(schemaC);
                if (action_ === 'update') {
                    DbGet(currentSchema.to).then((data) => {
                        if (data) {
                            let collections = getCollectionList(schemaC.data);
                            Object.keys(collections).map((e) => {
                                let cNode = getObjectValueUsingString(data, e);
                                if (typeof cNode === 'object' && cNode !== null) {
                                    let sc = collectionToJsonSchema(collections[e], Object.keys(cNode));
                                    let s = { ...JSON.parse(JSON.stringify(schemaC)) };
                                    addToSchema(s, e, sc);
                                    updateCurrentSchema(s);
                                }
                            });
                        }
                        updateNodeData(data);
                    }).catch((e) => {
                        console.log(e);
                    }).finally(() => updateLoading(false));

                }
                else if (action_ === 'push') {
                    updateLoading(false);

                }
            });

        }


    }, []);
    const removeFormFiles = () => {
        for (const v of Object.values(inputsRef.current)) {
            v.clear();
        }
    }
    const handleClick = (e) => {
        e.preventDefault();
    };
    const submit = (e) => {
        e.preventDefault();
        updateSubmitting(true);
        const toastId = toast.loading('updating...');
        let formdata = Object.fromEntries((new FormData(e.target)).entries());
        let fileList = getFiles(formdata);
        formdata = objectDifference(formdata, fileList);
        let files = removeEmptyFiles(fileList);
        let submitCleanUp = () => {
            removeFormFiles();
            if (action_ === 'push') {
                formik.setValues(
                    Object.fromEntries(schemaToStringKeys(currentSchema.data).map(e => [e, '']))
                );
                toast.success('Successfully added');
            }
            if (action_ === 'update') {
                DbGet(currentSchema.to).then((data) => {
                    updateNodeData(data);
                });
                toast.success('Successfully updated');

            }
            toast.dismiss(toastId);
        }
        if (Object.keys(files).length === 0)
            submitData(formdata, action_, currentSchema.to).then(() =>
                submitCleanUp()).finally(() =>
                    updateSubmitting(false)
                );
        else {
            uploadImages(files, currentSchema.imgLocation).then((res) => {
                formdata = { ...formdata, ...res.uploaded };
                submitData(formdata, action_, currentSchema.to).then(() =>
                    submitCleanUp()).finally(() =>
                        updateSubmitting(false)
                    );

                //File deletion
                let currentData = jsonToFormMap(nodeData);
                let updated = arrayIntersect(Object.keys(currentData), Object.keys(res.uploaded));
                let toBeRemoved = updated.map((e) => {
                    return currentData[e];
                });
                deleteImages(toBeRemoved);
                //

            }).catch(e => {
                toast.error('Failed');
                console.log(e)
            });
        }



    }
    const generateFeilds = (map, level = '', parent) => {
        if (!map || !Array.isArray(map))
            return;
        const fieldElements = map.map((e, i) => {
            let levelInt = level.match(/\//);
            levelInt = levelInt ? levelInt.length : 0;
            let keyProp = `${levelInt}_${i}`;
            if (e.type == 'text')
                return (
                    <Grid key={keyProp} item xs={12} sm={6}>
                        <TextField
                            InputLabelProps={{ shrink: true }}
                            id={`${level}/${e.key}`}
                            name={`${level}/${e.key}`}
                            label={e.displayName}
                            fullWidth
                            onChange={formik.handleChange}
                            value={formik.values[`${level}/${e.key}`]}
                        />
                    </Grid>
                )
            else if (e.type == 'textarea')
                return (
                    <Grid key={keyProp} item xs={12} sm={6}>
                        <TextField
                            InputLabelProps={{ shrink: true }}
                            id={`${level}/${e.key}`}
                            name={`${level}/${e.key}`}
                            label={e.displayName}
                            multiline
                            fullWidth
                            rows={6}
                            rowsMax={15}
                            onChange={formikRef.current.handleChange}
                            value={formikRef.current.values[`${level}/${e.key}`]}
                        />
                    </Grid>
                )
            else if (e.type == 'select')
                return (
                    <Grid key={keyProp} item xs={12} sm={6}>
                        <InputLabel id="demo-simple-select-label">{e.key}</InputLabel>
                        <NativeSelect
                            name={`${level}/${e.key}`}
                            id={`${level}/${e.key}`}
                            value={formik.values[`${level}/${e.key}`]}
                        >
                            <option aria-label="None" value="" />
                            {Array.isArray(e.values) &&
                                e.values.map((m, i) => <option key={i} value={m}>{m}</option>)
                            }
                        </NativeSelect>
                    </Grid>
                )

            else if (e.type == 'image')
                return (
                    <Grid key={keyProp} item xs={12} sm={6}>
                        <UImage title={e.displayName} ref={e => inputsRef.current[keyProp] = e} name={`${level}/${e.key}`} src={getObjectValueUsingString(nodeData, `${level}/${e.key}`)} defaultImage={img}></UImage>
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
                                            let s = { ...JSON.parse(JSON.stringify(currentSchema)) };
                                            removeFromSchema(s, `${level}/${e.key}`);
                                            updateCurrentSchema(s);
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
                                {generateFeilds(e.data, `${level}/${e.key}`)}
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
                                {generateFeilds(e.data, `${level}/${e.key}`)}
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
                            <Button variant="contained" color="primary" onClick={() => {
                                let s = { ...JSON.parse(JSON.stringify(currentSchema)) };
                                addToSchema(s, `${level}/${e.key}`, collectionToJsonSchema(e, [generatePushID()]));
                                console.log(s);
                                updateCurrentSchema(s);
                            }}>
                                +
                            </Button>
                        </Grid>
                        <Grid container spacing={3}>
                            {
                                generateFeilds(e.data, `${level}/${e.key}`)
                            }

                        </Grid>
                    </Grid >
                )
            }
        })
        return fieldElements;
    }
    return (
        <> {
            currentSchema &&
            <React.Fragment >
                <ArrowBackIcon onClick={() => history.goBack()}></ArrowBackIcon>
                <Typography variant="h4" gutterBottom>
                    {heading_}
                </Typography>

                <Backdrop className={classes.backdrop} open={loading} onClick={handleClick}>
                    <CircularProgress color="inherit" />
                </Backdrop>

                <form
                    encType="multipart/form-data" onSubmit={submit}>
                    <Grid container spacing={3}>
                        {generateFeilds(currentSchema.data, '')}
                        <Grid container direction="row-reverse"
                        >
                            <Button disabled={submitting} type="submit" variant="contained" color="primary" className={classes.submitArea}>
                                Submit
      </Button>
                        </Grid>

                    </Grid>

                </form>
                <Toaster />
            </React.Fragment >
        }
        </>


    );
}