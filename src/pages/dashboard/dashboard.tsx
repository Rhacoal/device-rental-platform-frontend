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
import {ApplicationStatus} from "./application_status";
import {BorrowThisMonth} from "./borrow_this_month";
import {makeStyles} from "@material-ui/core/styles";

function DashboardView(props: {
    dashboard: IDashboard
}) {
    const {dashboard} = props;

    return (
        <React.Fragment>
            <Grid container spacing={3}>
                <Grid item lg={4} md={6} xl={3} xs={12}>
                    <DeviceUsageView dashboard={dashboard} className={""}/>
                </Grid>
                <Grid item lg={4} md={6} xl={3} xs={12}>
                    <ApplicationStatus dashboard={dashboard} className={""}/>
                </Grid>
                <Grid item lg={4} md={12} xl={4} xs={12} container spacing={3}>
                    <Grid item xs={12}>
                        <BorrowThisMonth dashboard={dashboard} className={""} style={{height: "min-content"}}/>
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

    return <Container maxWidth="lg">
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