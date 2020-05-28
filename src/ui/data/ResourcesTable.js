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

export default class ResourcesTable extends React.Component {

    state = {
        resources: [],
        availableMeasures: [],
        messages: []
    }

    componentDidMount() {
        HttpClient.doRequest(axios => {
            return axios.get(`${BACKEND_URL}/api/resources`)
                .then((response) => {
                    const data = response.data;
                    const measures = new Set();
                    data.resources.forEach(resource => Array.from(Object.keys(resource.measures)).forEach(measure => measures.add(measure)))

                    const measureUnits = data.standards.measureUnits;

                    this.setState({
                        resources: data.resources,
                        availableMeasures: Array.from(measures.values()).map(value => {
                            return {
                                type: value,
                                unit: measureUnits[value]
                            }
                        })
                    })
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
                            <TableCell align="left">{this.state.messages['fields.title']}</TableCell>
                            {this.state.availableMeasures.map(measure => (
                                <TableCell key={measure.type}
                                           align="left">{`${this.state.messages[`measure-types.${measure.type}`]} (${this.state.messages[`measure-units.${measure.unit}`]})`}</TableCell>))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.resources.map((resource) => (
                            <TableRow key={resource.id}>
                                <TableCell align="left">{resource.id}</TableCell>
                                <TableCell align="left">{resource.title}</TableCell>
                                {this.state.availableMeasures.map(measure => (
                                    <TableCell key={measure.type}
                                               align="left">{resource.measures[measure.type] ? `${resource.measures[measure.type].startValue}-${resource.measures[measure.type].endValue}` : 'N/A'}</TableCell>))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }
}
