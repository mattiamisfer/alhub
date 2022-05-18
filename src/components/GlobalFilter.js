import React from 'react';
import TextField from '@material-ui/core/TextField';


export const GlobalFilter = ({ filter, setFilter }) => {
    return (
        <TextField variant="outlined"
            value={filter || ""}
            onChange={e => setFilter(e.target.value)}
            label="Search"
        />
    )
}