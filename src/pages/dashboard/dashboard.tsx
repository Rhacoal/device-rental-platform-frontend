import React from "react";
import {RouteComponentProps} from "react-router-dom";
import {useSelector} from "react-redux";
import {IStore} from "../../store/store";
import {IDashboard, Optional} from "../../wrapper/types";
import {getDashboard} from "../../wrapper/requests";
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    colors,
    Container,
    createStyles,
    Divider, Grid, Typography,
    useTheme
} from "@material-ui/core";
import {Alert, Skeleton} from "@material-ui/lab";
import {DeviceUsageView} from "./device_usage";
import {ApplicationStatistics} from "./application_statistics";
import {BorrowCount} from "./borrow_count";
import {makeStyles} from "@material-ui/core/styles";
import {UserCount} from "./user_count";
import {formatTime} from "../../utils/time_format";

const useStyles = makeStyles(createStyles({
    "card": {
        "& .MuiCardContent-root": {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingLeft: "12px",
            paddingRight: "12px",
        }
    }
}))

function DashboardView(props: {
    dashboard: IDashboard
}) {
    const {dashboard} = props;
    const classes = useStyles();

    return (
        <React.Fragment>
            <Grid container spacing={3}>
                <Grid item lg={4} md={6} xs={12}>
                    <DeviceUsageView dashboard={dashboard} className={classes.card}/>
                </Grid>
                <Grid item lg={4} md={6} xs={12}>
                    <ApplicationStatistics dashboard={dashboard} className={classes.card}/>
                </Grid>
                <Grid item lg={4} md={12} xs={12} container>
                    <Grid item xs={12} style={{height: "min-content"}}>
                        <BorrowCount dashboard={dashboard} className={classes.card}/>
                    </Grid>
                    <Grid item xs={12} style={{marginTop: 24}}>
                        <UserCount dashboard={dashboard} className={""} />
                    </Grid>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}

export function DashboardPage(props: RouteComponentProps) {
    const userInfo = useSelector((store: IStore) => store.user.userInfo);
    const [dashboardData, setDashboardData] = React.useState(null as Optional<IDashboard>);
    const [errorMessage, setErrorMessage] = React.useState("");
    const [progress, setProgress] = React.useState(false);

    React.useEffect(() => {
        if (!userInfo) return;
        setErrorMessage("");
        setProgress(true);
        getDashboard().then((result) => {
            setProgress(false);
            if (result.success) {
                setDashboardData(result.data);
            } else {
                setErrorMessage(result.message);
            }
        }, reason => {
            setErrorMessage(reason.toString());
        })
    }, [props, userInfo]);

    return <Container maxWidth={false}>
        <div style={{marginBottom: 16}}>
            <Typography variant="h4" component="h1">统计数据</Typography>
            <Typography variant="body1" color="textSecondary">{`截至 ${formatTime(new Date().getTime() / 1000)}`}</Typography>
        </div>
        {
            dashboardData ?
                <DashboardView dashboard={dashboardData}/>
                : (
                    errorMessage ?
                        <Alert severity="error">{errorMessage}</Alert>
                        : <React.Fragment>
                            <Skeleton height={200}/>
                            <Skeleton height={100}/>
                            <Skeleton height={100}/>
                        </React.Fragment>
                )
        }
    </Container>
}