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
import {getMessages} from "../../infrastructure/LanguagesSystem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";

class ResourceForm extends React.Component {

    messagesSubscription;

    nullCompilation = {};

    state = {
        compilations: [],
        workforces: [],
        machines: [],
        materials: [],
        selectedCompilation: this.nullCompilation,
        selectedWorkforces: [],
        selectedMachines: [],
        selectedMaterials: [],
        messages: {'ui.forms.resource.create': 'Create'}
    };

    formData = {
        code: null,
        title: null,
    }

    componentDidMount() {
        HttpClient.doRequest(axios => {
            return axios.get(`${BACKEND_URL}/api/compilations`)
                .then((response) => {
                    const compilations = response.data
                    const selectedCompilation = compilations.find(compilation => compilation.id === this.props.inputFormData.compilationId) || this.nullCompilation
                    this.setState({compilations: compilations, selectedCompilation: selectedCompilation})
                })
        })
        HttpClient.doRequest(axios => {
            return axios.get(`${BACKEND_URL}/api/workforces`)
                .then((response) => {
                    const workforces = response.data;
                    let selectedWorkforces = [];
                    const inputFormData = this.props.inputFormData;
                    if (inputFormData.workforceIds) {
                        selectedWorkforces = workforces.filter(workforce => inputFormData.workforceIds.includes(workforce.id))
                    }
                    this.setState({workforces: workforces, selectedWorkforces: selectedWorkforces})
                })
        })
        HttpClient.doRequest(axios => {
            return axios.get(`${BACKEND_URL}/api/machines`)
                .then((response) => {
                    const machines = response.data;
                    let selectedMachines = []
                    const inputFormData = this.props.inputFormData;
                    if (inputFormData.machineIds) {
                        selectedMachines = machines.filter(machine => inputFormData.machineIds.includes(machine.id))
                    }
                    this.setState({machines: machines, selectedMachines: selectedMachines})
                })
        })
        HttpClient.doRequest(axios => {
            return axios.get(`${BACKEND_URL}/api/materials`)
                .then((response) => {
                    const materials = response.data
                    let selectedMaterials = []
                    const inputFormData = this.props.inputFormData;
                    if (inputFormData.materialIds) {
                        selectedMaterials = materials.filter(material => inputFormData.materialIds.includes(material.id))
                    }
                    this.setState({materials: materials, selectedMaterials: selectedMaterials})
                })
        })

        this.messagesSubscription = getMessages().subscribe(messages => {
            this.setState({messages: messages})
        });

        this.formData = {...this.props.inputFormData};
    }


    componentWillUnmount() {
        this.messagesSubscription.unsubscribe();
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

        const {classes, inputFormData = {}} = this.props;

        return (
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LibraryBooksIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        {this.state.messages['ui.forms.resource.create']}
                    </Typography>
                    <Select
                        variant="outlined"
                        required
                        fullWidth
                        value={this.state.selectedCompilation}
                        onChange={(event) => this.setState({selectedCompilation: event.target.value})}
                    >
                        <MenuItem value={this.nullCompilation} disabled>
                            {this.state.messages['compilation']}
                        </MenuItem>
                        {this.state.compilations.map(compilation => (
                            <MenuItem key={compilation.id} value={compilation}>{compilation.title}</MenuItem>))}
                    </Select>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label={this.state.messages['fields.code']}
                        autoFocus
                        defaultValue={inputFormData.code}
                        onChange={event => this.formData.code = event.target.value}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label={this.state.messages['fields.title']}
                        autoFocus
                        defaultValue={inputFormData.title}
                        onChange={event => this.formData.title = event.target.value}
                    />
                    <FormControl>
                        <Select
                            style={{width: 400}}
                            multiple
                            value={this.state.selectedWorkforces}
                            onChange={(event) => this.setState({selectedWorkforces: event.target.value})}
                            input={<Input id="select-multiple-chip"/>}
                            className={classes.select}
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
                        <FormHelperText
                            className={classes.helperText}>{this.state.messages['workforces']}</FormHelperText>
                    </FormControl>
                    <FormControl>
                        <Select
                            style={{width: 400}}
                            multiple
                            value={this.state.selectedMachines}
                            onChange={(event) => this.setState({selectedMachines: event.target.value})}
                            input={<Input id="select-multiple-chip"/>}
                            className={classes.select}
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
                        <FormHelperText
                            className={classes.helperText}>{this.state.messages['machines']}</FormHelperText>
                    </FormControl>
                    <FormControl>
                        <Select
                            style={{width: 400}}
                            multiple
                            value={this.state.selectedMaterials}
                            onChange={(event) => this.setState({selectedMaterials: event.target.value})}
                            input={<Input id="select-multiple-chip"/>}
                            className={classes.select}
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
                        <FormHelperText
                            className={classes.helperText}>{this.state.messages['materials']}</FormHelperText>
                    </FormControl>
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={this.submit.bind(this)}
                    >
                        {this.state.messages['ui.create']}
                    </Button>
                </div>
            </Container>
        );
    }

    submit() {
        const data = {
            ...this.formData,
            compilationId: this.state.selectedCompilation.id,
            workforceIds: this.state.selectedWorkforces.map(value => value.id),
            machineIds: this.state.selectedMachines.map(value => value.id),
            materialIds: this.state.selectedMaterials.map(value => value.id),
        };

        console.log(data)
        this.props.onSubmit(data);
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
    select: {
        margin: theme.spacing(3, 0, 0, 0)
    },
    helperText: {}
});

export default withRouter(withStyles(useStyles)(ResourceForm))
