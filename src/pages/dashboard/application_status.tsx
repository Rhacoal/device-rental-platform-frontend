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

export function ApplicationStatistics(props: {
    dashboard: IDashboard
    className: string
} & any) {
    const {className, dashboard: _dashboard, ...rest} = props;
    const dashboard: IDashboard = _dashboard;
    const classes = useStyles();
    const theme = useTheme();

    const data = {
        datasets: [
            {
                data: [dashboard.apply_borrow_pending,
                    (dashboard.apply_borrow_total)],
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
        labels: ['待处理的借用请求', '已处理的借用请求']
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

    const applies = [
        {
            title: '待处理',
            value: dashboard.apply_borrow_pending,
            //icon: LaptopMacIcon,
            color: colors.indigo[500]
        },
        {
            title: '已处理',
            value: dashboard.apply_borrow_total,
            color: colors.red[600]
        }
    ];

    return (
        <Card
            className={clsx(classes.root, className)}
            {...rest}
        >
            <CardHeader title="借用请求处理情况"/>
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
                    {applies.map(({
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