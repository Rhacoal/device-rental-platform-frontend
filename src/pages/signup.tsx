import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import MuiLink from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {Copyright} from '../components/copyrights';
import {Link, Redirect, RouteComponentProps} from "react-router-dom";
import {LocalUrls} from "../constants/local_urls";
import {login, register, registerLegacy, sendVerificationMail} from "../wrapper/requests";
import {IStore} from "../store/store";
import {Alert, AlertTitle} from "@material-ui/lab";
import {Simulate} from "react-dom/test-utils";
import {useSelector} from "react-redux";
import {Optional} from "../wrapper/types";

const useStyles = makeStyles((theme) => ({
    root: {
        "& .MuiAlertTitle-root": {
            fontWeight: 1000,
        },
    },
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        "& .code-box": {
            marginRight: theme.spacing(1),
        },
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

interface Timeout {
    activated: boolean,
    onFinish: () => any,
}

export default function SignUp(props: RouteComponentProps) {
    const classes = useStyles();
    const userInfo = useSelector((store: IStore) => store.user.userInfo);
    const [inSignUp, setInSignUp] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState(null as Optional<string>)
    const [page, setPage] = React.useState(1);
    const [sent, setSent] = React.useState(false);
    const [timeLeft, setTimeLeft] = React.useState(0);
    const isTraditional = props.location.search.indexOf("legacy") !== -1;
    React.useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(Math.max(0, timeLeft - 1));
        }, 1000);
        // Clear timeout if the component is unmounted
        return () => clearTimeout(timer);
    });

    const [registerInfo, setRegisterInfo] = React.useState({
        "name": "",
        "email": "",
        "password": "",
        "student_id": "",
        "code": "",
    })

    const canNextStep = () => {
        return registerInfo.name && registerInfo.email && registerInfo.password && registerInfo.student_id;
    }

    const canSubmit = () => {
        return registerInfo.code;
    }

    const handleSignUp = () => {
        if (inSignUp) {
            return;
        }
        setInSignUp(true);
        // const studentId = parseInt(registerInfo.student_id);
        // if (isNaN(studentId) || studentId <= 0) {
        //     setErrorMessage("注册失败&学生 ID 有误");
        //     setInSignUp(false);
        // } else {
        (isTraditional ? registerLegacy(registerInfo.email, registerInfo.name, registerInfo.student_id, registerInfo.password)
            : register(registerInfo.email, registerInfo.name, registerInfo.student_id, registerInfo.password, registerInfo.code)).then((result) => {
            setInSignUp(false);
            if (result.success) {
                props.history.push(LocalUrls.login + "?registered=1");
            } else {
                setErrorMessage("注册失败&" + result.message);
            }
        }, reason => {
            setInSignUp(false);
            setErrorMessage("注册失败&" + reason.toString());
        });
        //}
    }

    const handleSendCode = () => {
        if (!sent) {
            setSent(true);
            setErrorMessage(null);
            setTimeLeft(45);
            sendVerificationMail(registerInfo.email).then(result => {
                setSent(false);
                if (!result.success) {
                    setErrorMessage("验证码发送失败&" + result.message);
                    setTimeLeft(0);
                }
            }, reason => {
                setSent(false);
                setErrorMessage("验证码发送失败&" + reason.toString())
                setTimeLeft(0);
            })
        }
    }

    if (userInfo) {
        return <Redirect to={LocalUrls.main_page}/>
    }
    return (
        <Container component="main" maxWidth="xs" className={classes.root}>
            <CssBaseline/>
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    注册
                </Typography>
                {
                    page === 1 ?
                        <form className={classes.form} noValidate>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        autoComplete="name"
                                        name="name"
                                        variant="outlined"
                                        required
                                        fullWidth
                                        id="name"
                                        label="姓名"
                                        autoFocus
                                        value={registerInfo.name}
                                        onChange={(event) => {
                                            setRegisterInfo({...registerInfo, name: event.target.value})
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        name="student_id"
                                        variant="outlined"
                                        required
                                        fullWidth
                                        id="student_id"
                                        type="number"
                                        label="学号"
                                        autoFocus
                                        value={registerInfo.student_id}
                                        onChange={(event) => {
                                            setRegisterInfo({...registerInfo, student_id: event.target.value})
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        id="email"
                                        label="邮箱地址"
                                        name="email"
                                        autoComplete="email"
                                        value={registerInfo.email}
                                        onChange={(event) => {
                                            setRegisterInfo({...registerInfo, email: event.target.value})
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
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
                                </Grid>
                            </Grid>
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                                disabled={!canNextStep()}
                                onClick={(event) => {
                                    // event.preventDefault();
                                    if (isTraditional) {
                                        handleSignUp()
                                    } else {
                                        setPage(2);
                                    }
                                }}
                            >
                                注册
                            </Button>
                        </form>
                        :
                        <form className={classes.form} noValidate>
                            <Grid container spacing={2}>
                                <Grid item xs={12} justify="space-between" style={{
                                    display: "flex",
                                }}>
                                    <Typography variant="body1">
                                        邮箱
                                    </Typography>
                                    <Typography variant="body1">
                                        {registerInfo.email}
                                    </Typography>
                                </Grid>
                                <Grid item xs={8}>
                                    <TextField
                                        name="code"
                                        required
                                        id="code"
                                        fullWidth
                                        placeholder="验证码"
                                        autoFocus
                                        value={registerInfo.code}
                                        onChange={(event) => {
                                            setRegisterInfo({...registerInfo, code: event.target.value})
                                        }}
                                        className="code-box"
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <Button variant={"outlined"}
                                            onClick={handleSendCode}
                                            fullWidth
                                            disabled={timeLeft > 0}>
                                        发送{timeLeft > 0 ? ` (${timeLeft})` : ""}
                                    </Button>
                                </Grid>
                                <Grid item xs={12}>
                                    <Button fullWidth
                                            color="primary"
                                            variant="contained"
                                            disabled={!canSubmit()}
                                            onClick={handleSignUp}>
                                        确认
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                }
                <Grid container justify="flex-end">
                    <Grid item>
                        <MuiLink variant="body2" component={Link} to={LocalUrls.login}>
                            已经有帐号了？点击登录
                        </MuiLink>
                    </Grid>
                </Grid>
            </div>
            {
                errorMessage ?
                    <Alert severity="error"><AlertTitle>{errorMessage.split("&", 2)[0]}</AlertTitle>
                        {errorMessage.split("&", 2)[1] || ""}</Alert> : null
            }
        </Container>
    );
}