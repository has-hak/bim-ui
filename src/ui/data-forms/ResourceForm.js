import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import {withStyles} from "@material-ui/core";
import {withRouter} from "react-router-dom";
import HttpClient from "../../infrastructure/HttpClient";
import {BACKEND_URL} from "../../Static";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import Chip from "@material-ui/core/Chip";
import InputLabel from "@material-ui/core/InputLabel";

class ResourceForm extends React.Component {

    state = {
        compilations: [],
        workforces: [],
        machines: [],
        materials: [],
        selectedWorkforces: [],
        selectedMachines: [],
        selectedMaterials: [],
    };

    requestForm = {
        compilationId: null,
        code: null,
        title: null,
    }

    componentDidMount() {
        HttpClient.doRequest(axios => {
            return axios.get(`${BACKEND_URL}/api/compilations`)
                .then((response) => {
                    this.setState({compilations: response.data})
                })
        })
        HttpClient.doRequest(axios => {
            return axios.get(`${BACKEND_URL}/api/workforces`)
                .then((response) => {
                    this.setState({workforces: response.data})
                })
        })
        HttpClient.doRequest(axios => {
            return axios.get(`${BACKEND_URL}/api/machines`)
                .then((response) => {
                    this.setState({machines: response.data})
                })
        })
        HttpClient.doRequest(axios => {
            return axios.get(`${BACKEND_URL}/api/materials`)
                .then((response) => {
                    this.setState({materials: response.data})
                })
        })
    }

    render() {
        const ITEM_HEIGHT = 48;
        const ITEM_PADDING_TOP = 8;
        const MenuProps = {
            PaperProps: {
                style: {
                    maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                    width: 250,
                },
            },
        };

        const {classes} = this.props;

        return (
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LibraryBooksIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Create new resource
                    </Typography>
                    <InputLabel>Compilation</InputLabel>
                    <Select
                        variant="outlined"
                        required
                        fullWidth
                        onChange={(event) => this.requestForm.compilationId = event.target.value.id}
                        inputProps={{'aria-label': 'Without label'}}
                    >
                        <MenuItem value="" disabled>
                            Compilation
                        </MenuItem>
                        {this.state.compilations.map(compilation => (
                            <MenuItem key={compilation.id} value={compilation}>{compilation.title}</MenuItem>))}
                    </Select>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Code"
                        autoFocus
                        onChange={event => this.requestForm.code = event.target.value}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Title"
                        autoFocus
                        onChange={event => this.requestForm.title = event.target.value}
                    />
                    <InputLabel>Workforce</InputLabel>
                    <Select
                        style={{width: 400}}
                        multiple
                        value={this.state.selectedWorkforces}
                        onChange={(event) => this.setState({selectedWorkforces: event.target.value})}
                        input={<Input id="select-multiple-chip"/>}
                        renderValue={(selected) => (
                            <div className={classes.chips}>
                                {selected.map((workforce) => (
                                    <Chip key={workforce.id} label={workforce.title} className={classes.chip}/>
                                ))}
                            </div>
                        )}
                        MenuProps={MenuProps}
                    >
                        {this.state.workforces.map((workforce) => (
                            <MenuItem key={workforce.id} value={workforce}>
                                {workforce.title}
                            </MenuItem>
                        ))}
                    </Select>
                    <Select
                        style={{width: 400}}
                        multiple
                        value={this.state.selectedMachines}
                        onChange={(event) => this.setState({selectedMachines: event.target.value})}
                        input={<Input id="select-multiple-chip"/>}
                        renderValue={(selected) => (
                            <div className={classes.chips}>
                                {selected.map((machine) => (
                                    <Chip key={machine.id} label={machine.title} className={classes.chip}/>
                                ))}
                            </div>
                        )}
                        MenuProps={MenuProps}
                    >
                        {this.state.machines.map((machine) => (
                            <MenuItem key={machine.id} value={machine}>
                                {machine.title}
                            </MenuItem>
                        ))}
                    </Select>
                    <Select
                        style={{width: 400}}
                        multiple
                        value={this.state.selectedMaterials}
                        onChange={(event) => this.setState({selectedMaterials: event.target.value})}
                        input={<Input id="select-multiple-chip"/>}
                        renderValue={(selected) => (
                            <div className={classes.chips}>
                                {selected.map((material) => (
                                    <Chip key={material.id} label={material.title} className={classes.chip}/>
                                ))}
                            </div>
                        )}
                        MenuProps={MenuProps}
                    >
                        {this.state.materials.map((material) => (
                            <MenuItem key={material.id} value={material}>
                                {material.title}
                            </MenuItem>
                        ))}
                    </Select>
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={this.createCompilation.bind(this)}
                    >
                        Create
                    </Button>
                </div>
            </Container>
        );
    }

    createCompilation() {
        const body = {
            ...this.requestForm,
            workforceIds: this.state.workforces.map(value => value.id),
            machineIds: this.state.machines.map(value => value.id),
            materialIds: this.state.materials.map(value => value.id),
        };

        HttpClient.doRequest(axios => {
            return axios.post(`${BACKEND_URL}/api/resources`, body, {})
        })
    }
}

const useStyles = (theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    chip: {
        margin: 2,
    },
});

export default withRouter(withStyles(useStyles)(ResourceForm))
