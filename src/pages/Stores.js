import React, { useEffect } from 'react';
//import firebase from 'firebase/app';
import "firebase/database";
import "firebase/storage";
import { useHistory, Link } from 'react-router-dom';
import { useStyles } from './Categories';
import toast, { Toaster } from 'react-hot-toast';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, Container
} from '@material-ui/core/';
import { Fab } from '@material-ui/core/';
import AddIcon from '@material-ui/icons/Add';
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import axios from 'axios';
import { CButton } from '@coreui/react';
 import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';

const pagination = paginationFactory({
    page: 1,
    sizePerPage: 10,
});

function view(history, key) {
    history.push({
        pathname: '/view',
        id: key,
    })
}

// function edit(history, key) {
//     history.push({
//         pathname: '/store/add',
//         state: {
//             heading: 'Update store',
//             schema: ['stores_full', key],
//             action: 'update',
//         },
//     })
// }


export default function Stores() {
     const { SearchBar } = Search;

    const classes = useStyles();
    const [data, update] = React.useState([]);


    useEffect(() => {


        axios.get(process.env.REACT_APP_API_URL + 'api/store/getall')
            .then(function (response) {
                if (response.status == 200) {
                    console.log('=======response.data========', response.data);
                    update(response.data.data)
                }
            }).catch(function (error) {
                console.log(error);
            });
    }, []);

    const actionsFormatter = (cell, row) => {
        return (
            <>
                <Link to={"/store/edit/" + row.id}>

                    <CButton color="warning" className="px-4">
                        Edit
                    </CButton>
                </Link>

                <CButton color="danger" className="px-4" onClick={() => hanldeDelete(row.id)}>
                    Delete
                </CButton>
            </>
        );
    };

    const hanldeDelete = (id) => {
        console.log('iiiii ',id);
        axios.post(process.env.REACT_APP_API_URL + 'api/store/delete', {id})
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


    const columns = [
        {
            dataField: "id",
            text: "ID",
            isDummyField: true,
            formatter: (cell, row, rowIndex) => ++rowIndex,
        },
        {
            dataField: "name",
            text: "Name",
            searchable: true,
        },
        {
            dataField: "category",
            text: "Category",
            searchable: true,
        },
        {
            dataField: "phone",
            text: "Phone Number",
            searchable: true,
        },
        {
            dataField: "location",
            text: "Location",
            searchable: true,
        },
        {
            dataField: "pin",
            text: "Pin",
            searchable: true,
        },
        {
            dataField: "claim",
            text: "Offer Claim",
            searchable: true,
        },

        {
            dataField: "actions",
            text: "Actions",
            isDummyField: true,
            csvExport: false,
            formatter: actionsFormatter,
        },
    ];
      

    return (
        <>
            <Container>


            <ToolkitProvider
  keyField="id"
  data={ data }
  columns={ columns }
  search
>
  {
    props => (
      <div>
        <h3>Search Store Details :</h3>
        <SearchBar { ...props.searchProps } />
        <hr />
        <BootstrapTable
          { ...props.baseProps }
          pagination={pagination}
          wrapperClasses="table-responsive"
        />
      </div>
    )
  }
</ToolkitProvider> 

            
{/* 
                <BootstrapTable
                    keyField="id"
                    data={data}
                    columns={[
                        {
                            dataField: "id",
                            text: "ID",
                            isDummyField: true,
                            formatter: (cell, row, rowIndex) => ++rowIndex,
                        },
                        {
                            dataField: "name",
                            text: "Name",
                            searchable: true,
                        },
                        {
                            dataField: "phone",
                            text: "Phone Number",
                            searchable: true,
                        },
                        {
                            dataField: "location",
                            text: "Location",
                            searchable: true,
                        },
                        {
                            dataField: "pin",
                            text: "Pin",
                            searchable: true,
                        },

                        {
                            dataField: "actions",
                            text: "Actions",
                            isDummyField: true,
                            csvExport: false,
                            formatter: actionsFormatter,
                        },
                    ]}
                    pagination={pagination}
                    wrapperClasses="table-responsive"
                /> */}


                {/* <Link to={{
                    pathname: "/form",
                    state: {
                        heading: 'Add Store',
                        schema: ['stores_full'],
                        action: 'push',
                    }
                }}>
                    <Fab color="primary" className={classes.fab} aria-label="add">
                        <AddIcon />
                    </Fab>
                </Link> */}
                <Link to={{
                    pathname: "/store/add",
                    state: {
                        heading: 'Add Store',
                        schema: ['stores_full'],
                        action: 'push',
                    }
                }}>
                    <Fab color="primary" className={classes.fab} aria-label="add">
                        <AddIcon />
                    </Fab>
                </Link>
                <Toaster />
            </Container>

        </>
    )
}
