import {makeStyles} from "@material-ui/core/styles";
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    colors,
    createStyles,
    Divider,
    Typography,
    useTheme
} from "@material-ui/core";
import {IDashboard} from "../../wrapper/types";
import clsx from "clsx";
import {Doughnut} from "react-chartjs-2";
import React from "react";


const useStyles = makeStyles(() => createStyles({
    root: {
        height: '100%'
    }
}));

export function DeviceUsageView(props: {
    dashboard: IDashboard
    className: string
} & any) {
    const {className, dashboard, ...rest} = props;
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
        labels: ['待归还', '过期借用', '空闲']
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
            title: '待归还',
            value: dashboard.device_borrowed,
            //icon: LaptopMacIcon,
            color: colors.indigo[500]
        },
        {
            title: '过期借用',
            value: dashboard.device_expired,
            //icon: TabletIcon,
            color: colors.red[600]
        },
        {
            title: '空闲',
            value: (dashboard.device_total - dashboard.device_expired - dashboard.device_borrowed),
            //icon: PhoneIcon,
            color: colors.orange[600]
        }
    ];

    return (
        <Card
            className={clsx(classes.root, className)}
            {...rest}
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
                                variant="h4"
                            >
                                {value}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </CardContent>
        </Card>
    );
}