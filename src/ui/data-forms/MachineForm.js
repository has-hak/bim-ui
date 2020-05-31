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
import {getMessages} from "../../infrastructure/LanguagesSystem";

class MachineForm extends React.Component {

    messagesSubscription;

    state = {
        messages: {},
    }

    formData = {
        code: null,
        title: null,
        unit: null,
        unitCost: null,
    }

    componentDidMount() {
        this.messagesSubscription = getMessages().subscribe(messages => {
            this.setState({messages: messages})
        });

        this.formData = {...this.props.inputFormData};
    }

    componentWillUnmount() {
        this.messagesSubscription.unsubscribe();
    }

    render() {
        const {classes, inputFormData = {}, onSubmit} = this.props;

        return (
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LibraryBooksIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        {this.state.messages['ui.forms.machine.create']}
                    </Typography>
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
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        type="number"
                        label={this.state.messages['fields.unit']}
                        autoFocus
                        defaultValue={inputFormData.unit}
                        onChange={event => this.formData.unit = event.target.value}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        type="number"
                        label={this.state.messages['fields.unit-cost']}
                        autoFocus
                        defaultValue={inputFormData.unitCost}
                        onChange={event => this.formData.unitCost = event.target.value}
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={() => onSubmit(this.formData)}
                    >
                        {this.state.messages['ui.create']}
                    </Button>
                </div>
            </Container>
        );
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

export default withRouter(withStyles(useStyles)(MachineForm))
