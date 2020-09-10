import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import MuiLink from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {Copyright} from "../components/copyrights";
import {Link, Redirect} from 'react-router-dom';
import {LocalUrls} from "../constants/local_urls";
import {useDispatch, useSelector} from "react-redux";
import {IStore, UserInfoSlice} from "../store/store";
import {login, register} from "../wrapper/requests";
import {Alert} from "@material-ui/lab";
import {Optional} from "../wrapper/types";


const useStyles = makeStyles((theme) => ({
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
}));

export default function SignIn() {
    const classes = useStyles();
    const userInfo = useSelector((store: IStore) => store.user.userInfo);
    const [inSignUp, setInSignUp] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState(null as Optional<string>)
    const dispatch = useDispatch();

    const [registerInfo, setRegisterInfo] = React.useState({
        "username": "",
        "password": "",
    })

    const handleLogin = () => {
        if (inSignUp) {
            return;
        }
        setInSignUp(true);
        if (!registerInfo.username || !registerInfo.password) {
            setErrorMessage("账号或密码为空");
            setInSignUp(false);
        } else {
            login(registerInfo.username, registerInfo.password).then((result) => {
                setInSignUp(false);
                if (result.success) {
                    dispatch(UserInfoSlice.actions.setLoggedIn(true));
                } else {
                    setErrorMessage(result.message);
                }
            }, reason => {
                setInSignUp(false);
                setErrorMessage(reason.toString());
            });
        }
    }

    if (userInfo) {
        return <Redirect to={LocalUrls.main_page}/>
    }
    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    登录
                </Typography>
                <form className={classes.form} noValidate>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="邮箱/学号"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={registerInfo.username}
                        onChange={(event) => {
                            setRegisterInfo({...registerInfo, username: event.target.value})
                        }}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="密码"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={registerInfo.password}
                        onChange={(event) => {
                            setRegisterInfo({...registerInfo, password: event.target.value})
                        }}
                    />
                    {/*<FormControlLabel*/}
                    {/*    control={<Checkbox value="remember" color="primary" />}*/}
                    {/*    label="Remember me"*/}
                    {/*/>*/}
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={handleLogin}
                    >
                        登录
                    </Button>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <MuiLink variant="body2" component={Link} to={LocalUrls.register}>
                                注册
                            </MuiLink>
                        </Grid>
                    </Grid>
                </form>
            </div>
            {
                errorMessage ?
                    <Alert severity="error">{errorMessage}</Alert> : null
            }
        </Container>
    );
}