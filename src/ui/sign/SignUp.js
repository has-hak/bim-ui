import * as React from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Avatar from "@material-ui/core/Avatar";
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import Box from "@material-ui/core/Box";
import {withRouter} from "react-router-dom";
import {withStyles} from "@material-ui/core";
import UserContext from "../../infrastructure/UserContext";
import {signInRouting} from "../../infrastructure/Router";
import {getMessages} from "../../infrastructure/LanguagesSystem";

class SignUp extends React.Component {

    messagesSubscription ;

    state = {
        messages: {
            "ui.sign-up": "Sign Up"
        }
    }

    formData = {
        fullName: undefined,
        email: undefined,
        password: undefined
    };

    componentDidMount() {
        this.messagesSubscription = getMessages().subscribe(messages => {
            this.setState({messages: messages})
        });
    }

    componentWillUnmount() {
       this.messagesSubscription.unsubscribe();
    }

    render() {
        const {classes} = this.props;

        return (
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <AssignmentIndIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        {this.state.messages['ui.sign-up']}
                    </Typography>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="name"
                        label="Full Name"
                        name="name"
                        autoComplete="name"
                        autoFocus
                        onChange={event => this.formData.fullName = event.target.value}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        onChange={event => this.formData.email = event.target.value}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        onChange={event => this.formData.password = event.target.value}
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={() => UserContext.register(this.formData)}
                    >
                        {this.state.messages['ui.sign-up']}
                    </Button>
                    <Grid container>
                        <Grid item>
                            <Link href={signInRouting} variant="body2">
                                {"Already have an account? Sign in"}
                            </Link>
                        </Grid>
                    </Grid>
                </div>
                <Box mt={8}>
                    <Typography variant="body2" color="textSecondary" align="center">
                        {'Copyright © '}
                        Bim Project
                        {' '}
                        {new Date().getFullYear()}
                    </Typography>
                </Box>
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
        backgroundColor: theme.palette.primary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
        backgroundColor: theme.palette.secondary.main
    },
});

export default withRouter(withStyles(useStyles)(SignUp))
