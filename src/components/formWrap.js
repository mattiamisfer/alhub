import React from 'react';
import { useLocation, useHistory } from "react-router-dom";
import Form from '../components/Form';
import schemaFactory from '../functions/schemaFactory'

export default function FormWrap() {
    const location = useLocation();
    let heading = location?.state.heading;
    let action = location?.state.action;
    let [schemaName, loc] = location?.state.schema
    let schema = schemaFactory(schemaName, loc || '');
    let sameKey = location?.state.sameKey
    console.log("================================================="+heading);
 return <Form heading={heading} action={action} schema={schema} sameKey={true} />

}