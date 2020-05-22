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
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

class MaterialForm extends React.Component {

    state = {
        measureTypes: [],
    };

    requestForm = {
        code: null,
        title: null,
        unit: null,
        unitCost: null,
        measureType: null
    }

    componentDidMount() {
        HttpClient.doRequest(axios => {
            return axios.get(`${BACKEND_URL}/api/util/measure-types`)
                .then((response) => {
                    this.setState({measureTypes: response.data})
                })
        })
    }

    render() {
        const {classes} = this.props;

        return (
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LibraryBooksIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Create new material
                    </Typography>
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
                    <Select
                        variant="outlined"
                        required
                        fullWidth
                        onChange={(event) => this.requestForm.measureType = event.target.value}
                        inputProps={{'aria-label': 'Without label'}}
                    >
                        <MenuItem value="" disabled>
                            Measure Type
                        </MenuItem>
                        {this.state.measureTypes.map(measureType => (
                            <MenuItem value={measureType}>{measureType}</MenuItem>))}
                    </Select>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        type="number"
                        label="Unit"
                        autoFocus
                        onChange={event => this.requestForm.unit = event.target.value}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        type="number"
                        label="Unit cost"
                        autoFocus
                        onChange={event => this.requestForm.unitCost = event.target.value}
                    />
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
        HttpClient.doRequest(axios => {
            return axios.post(`${BACKEND_URL}/api/materials`, this.requestForm, {})
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
});

export default withRouter(withStyles(useStyles)(MaterialForm))
