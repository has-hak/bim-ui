import * as React from "react";
import {BACKEND_URL} from "../../Static";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import {Paper} from "@material-ui/core";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import {makeStyles} from "@material-ui/styles";
import HttpClient from "../../infrastructure/HttpClient";

export default class MaterialsTable extends React.Component {

    state = {
        materials: []
    }

    componentDidMount() {
        HttpClient.doRequest(axios => {
            return axios.get(`${BACKEND_URL}/api/materials`)
                .then((response) => {
                    this.setState({materials: response.data})
                })
        });
    }

    render() {
        const classes = makeStyles({
            table: {
                minWidth: 650,
            },
        });

        return (
            <TableContainer component={Paper} className='table'>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Id</TableCell>
                            <TableCell align="left">Code</TableCell>
                            <TableCell align="left">Title</TableCell>
                            <TableCell align="left">Unit</TableCell>
                            <TableCell align="left">Unit cost</TableCell>
                            <TableCell align="left">Measure type</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.materials.map((material) => (
                            <TableRow key={material.id}>
                                <TableCell align="left">{material.id}</TableCell>
                                <TableCell align="left">{material.code}</TableCell>
                                <TableCell align="left">{material.title}</TableCell>
                                <TableCell align="left">{material.unit}</TableCell>
                                <TableCell align="left">{material.unitCost}</TableCell>
                                <TableCell align="left">{material.measureType}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }
}
