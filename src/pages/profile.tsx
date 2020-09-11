import {Button, ButtonGroup, Container, createStyles, Divider, Paper, Typography, useTheme} from "@material-ui/core";
import React from "react";
import {RouteComponentProps} from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
import {IStore, UserInfoSlice} from "../store/store";
import {makeStyles} from "@material-ui/core/styles";
import {logout} from "../wrapper/requests";

const useStyles = makeStyles(theme => createStyles({
    container: {
        display: "flex",
        flexDirection: "column",
        "& .MuiDivider-root": {
            backgroundColor: theme.palette.divider,
        }
    },
    title: {
        margin: theme.spacing(1, 0),
    },
    error: {
        color: theme.palette.error.contrastText,
        backgroundColor: theme.palette.error.main,
        '&:hover': {
            backgroundColor: theme.palette.error.dark,
        },
    }
}));

export function PendingLogin(props: {errorMessage: string}) {
    const classes = useStyles(useTheme());
    return <Container>
        <Typography variant="h4" component="h1" className={classes.title}>
            设备租赁平台
        </Typography>
        {
            props.errorMessage ? <React.Fragment>
                <Typography variant="h6" component="h2" className={classes.title}>
                    登入失败！
                </Typography>
                <Typography variant="body1">
                    登入中遇到了一些困难，可能是网络波动等导致的，请尝试刷新页面或联系网站管理员。
                </Typography>
                <Typography variant="body1" color="textSecondary">
                    {"错误信息: " + props.errorMessage}
                </Typography>
                <Button className={classes.error} variant="contained" onClick={() => {
                    document.location.reload();
                }}>
                    刷新页面
                </Button>
            </React.Fragment> : <Typography variant="body1">
                登入中
            </Typography>
        }
    </Container>
}

export function Profile(props: RouteComponentProps) {
    const classes = useStyles(useTheme());
    const userInfo = useSelector((store: IStore) => store.user.userInfo);
    const dispatch = useDispatch();
    const handleLogout = () => {
        logout().then((result) => {
            if (result.success) {
                dispatch(UserInfoSlice.actions.globalLogout(null));
            }
        })
    }

    return <Container className={classes.container}>
            {userInfo ? <React.Fragment>
                <Typography variant="h4" component="h1" className={classes.title}>
                    欢迎回来，{userInfo.name}！
                </Typography>
                <Divider/>
                <Typography variant="body1">
                    {userInfo.student_id}
                </Typography>
                <Button style={{alignSelf: "flex-end"}} variant="outlined" color="secondary" onClick={handleLogout}>
                    登出
                </Button>
            </React.Fragment> : <React.Fragment>
                <Typography variant="h6" component="div">用户信息正在加载中</Typography>
            </React.Fragment>}
    </Container>
}