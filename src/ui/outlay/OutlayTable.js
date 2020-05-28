import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import {getMessages} from "../../infrastructure/LanguagesSystem";

const useRowStyles = makeStyles({
    root: {
        '& > *': {
            borderBottom: 'unset',
        },
    },
});

function ResourceRow(props) {
    const {resource, totalStatistics, messages} = props;
    const [open, setOpen] = React.useState(false);
    const [workforcesOpen, setWorkforcesOpen] = React.useState(false);
    const [machinesOpen, setMachinesOpen] = React.useState(false);
    const [materialsOpen, setMaterialsOpen] = React.useState(false);
    const [totalOpen, setTotalOpen] = React.useState(false);
    const classes = useRowStyles();

    return (
        <React.Fragment>
            <TableRow className={classes.root} onClick={() => setOpen(!open)}>
                <TableCell>
                    <IconButton aria-label="expand row" size="small">
                        {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                    </IconButton>
                    {resource.title}
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                            <Typography variant="h6" gutterBottom component="div">
                                {messages['ui.main.outlay-table.structure']}
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableBody>

                                    <TableRow key="Workforces" onClick={() => setWorkforcesOpen(!workforcesOpen)}>
                                        <TableCell>
                                            <IconButton aria-label="expand row" size="small">
                                                {workforcesOpen ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                                            </IconButton>
                                            {messages['workforces']}
                                        </TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell>
                                            <Collapse in={workforcesOpen} timeout="auto" unmountOnExit>
                                                <Box margin={1}>
                                                    <Table aria-label="collapsible table">
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell
                                                                    align="left"> {messages['fields.code']}</TableCell>
                                                                <TableCell
                                                                    align="left">{messages['fields.title']}</TableCell>
                                                                <TableCell
                                                                    align="left">{messages['fields.measure-type']}</TableCell>
                                                                <TableCell
                                                                    align="left">{messages['measure-types.VOLUME']}</TableCell>
                                                                <TableCell
                                                                    align="left">{messages['fields.unit-cost']}</TableCell>
                                                                <TableCell
                                                                    align="left">{messages['ui.main.outlay-table.total-cost']}</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {resource.workforces.map((workforce) => (
                                                                <WorkforcesRow key={workforce.id}
                                                                               workforce={workforce}/>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </Box>
                                            </Collapse>
                                        </TableCell>
                                    </TableRow>

                                    <TableRow key="Machines" onClick={() => setMachinesOpen(!machinesOpen)}>
                                        <TableCell>
                                            <IconButton aria-label="expand row" size="small">
                                                {machinesOpen ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                                            </IconButton>
                                            {messages['ui.main.outlay-table.machine/mechanisms']}
                                        </TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell>
                                            <Collapse in={machinesOpen} timeout="auto" unmountOnExit>
                                                <Box margin={1}>
                                                    <Table aria-label="collapsible table">
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell
                                                                    align="left"> {messages['fields.code']}</TableCell>
                                                                <TableCell
                                                                    align="left">{messages['fields.title']}</TableCell>
                                                                <TableCell
                                                                    align="left">{messages['fields.measure-type']}</TableCell>
                                                                <TableCell
                                                                    align="left">{messages['measure-types.VOLUME']}</TableCell>
                                                                <TableCell
                                                                    align="left">{messages['fields.unit-cost']}</TableCell>
                                                                <TableCell
                                                                    align="left">{messages['ui.main.outlay-table.total-cost']}</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {resource.machines.map((machine) => (
                                                                <MachineRow key={machine.id} machine={machine}/>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </Box>
                                            </Collapse>
                                        </TableCell>
                                    </TableRow>

                                    <TableRow key="Materials" onClick={() => setMaterialsOpen(!materialsOpen)}>
                                        <TableCell>
                                            <IconButton aria-label="expand row" size="small">
                                                {materialsOpen ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                                            </IconButton>
                                            {messages['materials']}
                                        </TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell>
                                            <Collapse in={materialsOpen} timeout="auto" unmountOnExit>
                                                <Box margin={1}>
                                                    <Table aria-label="collapsible table">
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell
                                                                    align="left"> {messages['fields.code']}</TableCell>
                                                                <TableCell
                                                                    align="left">{messages['fields.title']}</TableCell>
                                                                <TableCell
                                                                    align="left">{messages['fields.measure-type']}</TableCell>
                                                                <TableCell
                                                                    align="left">{messages['measure-types.VOLUME']}</TableCell>
                                                                <TableCell
                                                                    align="left">{messages['fields.unit-cost']}</TableCell>
                                                                <TableCell
                                                                    align="left">{messages['ui.main.outlay-table.total-cost']}</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {resource.materials.map((material) => (
                                                                <MaterialRow key={material.id} material={material}/>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </Box>
                                            </Collapse>
                                        </TableCell>
                                    </TableRow>

                                    <TableRow key="Total" onClick={() => setTotalOpen(!totalOpen)}>
                                        <TableCell>
                                            <IconButton aria-label="expand row" size="small">
                                                {totalOpen ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                                            </IconButton>
                                            {messages['ui.main.outlay-table.overall-cost']}
                                        </TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell>
                                            <Collapse in={totalOpen} timeout="auto" unmountOnExit>
                                                <Box margin={1}>
                                                    <Table aria-label="collapsible table">
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell
                                                                    align="left">   {messages['ui.main.outlay-table.direct-cost']}  </TableCell>
                                                                <TableCell
                                                                    align="left">{messages['ui.main.outlay-table.overhead-cost']} 13.3
                                                                    %</TableCell>
                                                                <TableCell
                                                                    align="left">{messages['ui.main.outlay-table.net-cost']}</TableCell>
                                                                <TableCell
                                                                    align="left">{messages['ui.main.outlay-table.profit']} 10.0
                                                                    %</TableCell>
                                                                <TableCell
                                                                    align="left">{messages['ui.main.outlay-table.outlay-cost']}</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            <TableRow className={classes.root}>
                                                                <TableCell
                                                                    align="left">{totalStatistics.directCost}</TableCell>
                                                                <TableCell
                                                                    align="left">{totalStatistics.overheadCost}</TableCell>
                                                                <TableCell
                                                                    align="left">{totalStatistics.netCost}</TableCell>
                                                                <TableCell
                                                                    align="left">{totalStatistics.profit}</TableCell>
                                                                <TableCell
                                                                    align="left">{totalStatistics.totalCost}</TableCell>
                                                            </TableRow>
                                                        </TableBody>
                                                    </Table>
                                                </Box>
                                            </Collapse>
                                        </TableCell>
                                    </TableRow>

                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

function WorkforcesRow(props) {
    const {workforce} = props;
    const classes = useRowStyles();

    return (
        <React.Fragment>
            <TableRow className={classes.root}>
                <TableCell align="left">{workforce.code}</TableCell>
                <TableCell align="left">{workforce.title}</TableCell>
                <TableCell align="left">մարդ-ժամ</TableCell>
                <TableCell align="left">{workforce.unit}</TableCell>
                <TableCell align="left">{workforce.unitCost}</TableCell>
                <TableCell align="left">{workforce.unit * workforce.unitCost}</TableCell>
            </TableRow>
        </React.Fragment>
    );
}

function MachineRow(props) {
    const {machine} = props;
    const classes = useRowStyles();

    return (
        <React.Fragment>
            <TableRow className={classes.root}>
                <TableCell align="left">{machine.code}</TableCell>
                <TableCell align="left">{machine.title}</TableCell>
                <TableCell align="left">մեքենա-ժամ</TableCell>
                <TableCell align="left">{machine.unit}</TableCell>
                <TableCell align="left">{machine.unitCost}</TableCell>
                <TableCell align="left">{machine.unit * machine.unitCost}</TableCell>
            </TableRow>
        </React.Fragment>
    );
}

function MaterialRow(props) {
    const {material} = props;
    const classes = useRowStyles();

    return (
        <React.Fragment>
            <TableRow className={classes.root}>
                <TableCell align="left">{material.code}</TableCell>
                <TableCell align="left">{material.title}</TableCell>
                <TableCell align="left">{material.measureType}</TableCell>
                <TableCell align="left">{material.unit}</TableCell>
                <TableCell align="left">{material.unitCost}</TableCell>
                <TableCell align="left">{material.unit * material.unitCost}</TableCell>
            </TableRow>
        </React.Fragment>
    );
}

export default class OutlayTable extends React.Component {

    state = {
        messages: {}
    }

    componentDidMount() {
        this.messagesSubscription = getMessages().subscribe(messages => {
            this.setState({messages: messages})
        });
    }

    componentWillUnmount() {
        this.messagesSubscription.unsubscribe();
    }

    render() {
        const data = this.props.data;
        if (!data) {
            return (
                <div></div>
            );
        }

        return (
            <TableContainer component={Paper}>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell>{this.state.messages['fields.title']}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.resources.map((resource) => (
                            <ResourceRow messages={this.state.messages} key={resource.id} resource={resource}
                                         totalStatistics={calculateResourceTotalStatistics(resource)}/>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }
}

function calculateResourceTotalStatistics(resource) {
    const totalWorkforceCost = resource.workforces
        .map(workforce => workforce.unit * workforce.unitCost)
        .reduce((previousValue, currentValue) => currentValue + previousValue, 0)

    const totalMachinesCost = resource.machines
        .map(machine => machine.unit * machine.unitCost)
        .reduce((previousValue, currentValue) => currentValue + previousValue, 0)

    const totalMaterialsCost = resource.materials
        .map(material => material.unit * material.unitCost)
        .reduce((previousValue, currentValue) => currentValue + previousValue, 0)

    const directCost = totalWorkforceCost + totalMachinesCost + totalMaterialsCost;
    const overheadCost = directCost * 0.133;
    const netCost = directCost + overheadCost;
    const profit = netCost * 0.1;
    const totalCost = netCost + profit;

    return {
        directCost: directCost,
        overheadCost: overheadCost,
        netCost: netCost,
        profit: profit,
        totalCost: totalCost
    }
}
