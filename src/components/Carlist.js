import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';

import Addcar from './Addcar';
import Editcar from './Editcar';

function Carlist() {
    const [cars, setCars] = useState([]);
    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);
    const gridOptions = [
        { suppressSizeToFit: true },
        { sizeColumnsToFit: true }
    ]
    const columns = [
        { field: 'brand', sortable: true, filter: true },
        { field: 'model', sortable: true, filter: true },
        { field: 'color', sortable: true, filter: true },
        { field: 'fuel', sortable: true, filter: true },
        { field: 'year', sortable: true, filter: true },
        { field: 'price', sortable: true, filter: true },
        {
            field: 'mofidy', cellRendererFramework: function (params) {
                return (
                    <div>
                        <Editcar variant="contained" car={params.data} updateCar={updateCar} />
                    </div>
                );
            }
        },
        {
            field: 'detele', cellRendererFramework: function (params) {
                return (
                    <div>
                        <Button variant="contained" onClick={() => deleteEntry(params.data._links.self.href)} color="error">Delete</Button>
                    </div>
                );
            }
        },
    ]

    const onGridReady = (params) => {
        setGridApi(params.api);
        setGridColumnApi(params.columnApi);
    }

    const fetchData = () => {
        fetch('https://carstockrest.herokuapp.com/cars')
            .then(response => response.json())
            .then(data => setCars(data._embedded.cars))
            .catch(err => console.error(err))
    }

    const updateCar = (car, link) => {
        fetch(link, { method: 'PUT', headers: { 'Content-type': 'application/json' }, body: JSON.stringify(car) })
            .then(response => response.json())
            .then(data => fetchData())
            .catch(err => console.error(err))
    }

    const saveCar = (car) => {
        fetch('https://carstockrest.herokuapp.com/cars', { method: 'POST', headers: { 'Content-type': 'application/json' }, body: JSON.stringify(car) })
            .then(response => response.json())
            .then(data => fetchData())
            .catch(err => console.error(err))
    }

    const deleteEntry = (link) => {
        console.log("Delete URL: " + link);
        if (window.confirm("Would you like to delete the selected vehicle?")) {
            fetch(link, { method: 'DELETE' })
                .then(res => fetchData())
                .catch(err => console.error(err));
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div style={{ agCell: { display: 'flex', alignItems: 'center' } }}>
            <Addcar saveCar={saveCar} />
            <TextField label="Search..." variant="outlined" onChange={(e) => gridApi.setQuickFilter(e.target.value)} />
            <div className="ag-theme-material" style={{ marginTop: 20, height: 600, margin: 'auto' }}>
                <AgGridReact
                    rowData={cars}
                    columnDefs={columns}
                    pagination="true"
                    paginationPageSize="10"
                    gridOptions={gridOptions}
                    onGridReady={onGridReady}>
                </AgGridReact>
            </div>
        </div>
    );
}

export default Carlist;