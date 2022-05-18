import React from 'react';
import { Container } from '@material-ui/core/';
import Form from '../components/Form';
import schemaFactory from '../functions/schemaFactory'

export default function Ad() {

    return (
        <Container>
            <Form heading='Ad Banner' schema={schemaFactory('ads')} name={'ad'} action='update' />
        </Container>
    )

}