import React from "react";
import {RouteComponentProps} from "react-router-dom";
import {useSelector} from "react-redux";
import {IStore} from "../store/store";
import {IDashboard, Optional} from "../wrapper/types";
import {getDashboard} from "../wrapper/requests";
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    colors,
    Container,
    createStyles,
    Divider, Typography,
    useTheme
} from "@material-ui/core";
import {Alert, Skeleton} from "@material-ui/lab";
import {Chart} from "react-google-charts";
import {makeStyles} from "@material-ui/core/styles";
import clsx from "clsx";
import {Doughnut} from "react-chartjs-2";

const useStyles = makeStyles(() => createStyles({
    root: {
        height: '100%'
    }
}));

function DeviceUsageView(props: {
    dashboard: IDashboard
    className: string
}) {
    const {className, dashboard} = props;
    const classes = useStyles();
    const theme = useTheme();

    const data = {
        datasets: [
            {
                data: [dashboard.device_borrowed, dashboard.device_expired,
                    (dashboard.device_total - dashboard.device_expired - dashboard.device_borrowed)],
                backgroundColor: [
                    colors.indigo[500],
                    colors.red[600],
                    colors.orange[600]
                ],
                borderWidth: 8,
                borderColor: colors.common.white,
                hoverBorderColor: colors.common.white
            }
        ],
        labels: ['待归还的设备', '过期借用设备', '空闲设备']
    };

    const options = {
        animation: false,
        cutoutPercentage: 80,
        layout: {padding: 0},
        legend: {
            display: false
        },
        maintainAspectRatio: false,
        responsive: true,
        tooltips: {
            backgroundColor: theme.palette.background.default,
            bodyFontColor: theme.palette.text.secondary,
            borderColor: theme.palette.divider,
            borderWidth: 1,
            enabled: true,
            footerFontColor: theme.palette.text.secondary,
            intersect: false,
            mode: 'index',
            titleFontColor: theme.palette.text.primary
        }
    };

    const devices = [
        {
            title: '待归还的设备',
            value: dashboard.device_borrowed,
            //icon: LaptopMacIcon,
            color: colors.indigo[500]
        },
        {
            title: '过期借用设备',
            value: dashboard.device_expired,
            //icon: TabletIcon,
            color: colors.red[600]
        },
        {
            title: '空闲设备',
            value: (dashboard.device_total - dashboard.device_expired - dashboard.device_borrowed),
            //icon: PhoneIcon,
            color: colors.orange[600]
        }
    ];

    return (
        <Card
            className={clsx(classes.root, className)}
            //{...rest}
        >
            <CardHeader title="设备借用情况"/>
            <Divider/>
            <CardContent>
                <Box
                    height={300}
                    position="relative"
                >
                    <Doughnut
                        data={data}
                        options={options}
                    />
                </Box>
                <Box
                    display="flex"
                    justifyContent="center"
                    mt={2}
                >
                    {devices.map(({
                                      color,
                                      // icon: Icon,
                                      title,
                                      value
                                  }) => (
                        <Box
                            key={title}
                            p={1}
                            textAlign="center"
                        >
                            {/*<Icon color="action"/>*/}
                            <Typography
                                color="textPrimary"
                                variant="body1"
                            >
                                {title}
                            </Typography>
                            <Typography
                                style={{color}}
                                variant="h2"
                            >
                                {value}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </CardContent>
        </Card>
    );
};

function DashboardView(props: {
    dashboard: IDashboard
}) {
    const {dashboard} = props;

    const pieDevices = [
        ["类别", "数量"],
        ["待归还的设备", dashboard.device_borrowed],
        ["过期借用设备", dashboard.device_expired],
        ["空闲设备", (dashboard.device_total - dashboard.device_expired - dashboard.device_borrowed)],
    ]


    return <DeviceUsageView dashboard={dashboard} className={""}/>
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