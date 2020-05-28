import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import {withStyles} from "@material-ui/core";
import UserContext from "../../infrastructure/UserContext";
import {withRouter} from "react-router-dom";
import {redirectionToDefault, signUpRouting} from "../../infrastructure/Router";
import {getMessages} from "../../infrastructure/LanguagesSystem";

class SignIn extends React.Component {

    messagesSubscription;

    state = {
        messages: {
            "ui.sign-in": "Sign In"
        }
    }

    formData = {
        username: null,
        password: null
    };

    componentDidMount() {
        this.messagesSubscription = getMessages().subscribe(messages => {
            this.setState({messages: messages})
        }); }

    componentWillUnmount() {
        this.messagesSubscription.unsubscribe();
    }

    render() {
        if (UserContext.signed) {
            return redirectionToDefault();
        }

        const {classes} = this.props;

        return (
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        {this.state.messages['ui.sign-in']}
                    </Typography>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address or Username"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        onChange={event => this.formData.username = event.target.value}
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
                        onClick={() => UserContext.login(this.formData)}
                    >
                        {this.state.messages['ui.sign-in']}
                    </Button>
                    <Grid container>
                        <Grid item>
                            <Link href={signUpRouting} variant="body2">
                                {"Don't have an account? Sign Up"}
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
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
});

export default withRouter(withStyles(useStyles)(SignIn))
