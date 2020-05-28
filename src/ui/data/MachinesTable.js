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
import {getMessages} from "../../infrastructure/LanguagesSystem";

export default class MachinesTable extends React.Component {

    messagesSubscription;

    state = {
        workforces: [],
        messages:{}
    }

    componentDidMount() {
        HttpClient.doRequest(axios => {
            return axios.get(`${BACKEND_URL}/api/machines`)
                .then((response) => {
                    this.setState({workforces: response.data})
                })
        })

        this.messagesSubscription = getMessages().subscribe(messages => {
            this.setState({messages: messages})
        });
    }

    componentWillUnmount() {
        this.messagesSubscription.unsubscribe();
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
                            <TableCell align="left">{this.state.messages['fields.id']}</TableCell>
                            <TableCell align="left">{this.state.messages['fields.code']}</TableCell>
                            <TableCell align="left">{this.state.messages['fields.title']}</TableCell>
                            <TableCell align="left">{this.state.messages['fields.unit']}</TableCell>
                            <TableCell align="left">{this.state.messages['fields.unit-cost']}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.workforces.map((workforce) => (
                            <TableRow key={workforce.id}>
                                <TableCell align="left">{workforce.id}</TableCell>
                                <TableCell align="left">{workforce.code}</TableCell>
                                <TableCell align="left">{workforce.title}</TableCell>
                                <TableCell align="left">{workforce.unit}</TableCell>
                                <TableCell align="left">{workforce.unitCost}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }
}
