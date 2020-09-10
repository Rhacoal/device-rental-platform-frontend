import React, {PropsWithChildren} from "react";
import {IApplication, IDeviceBorrowApplication} from "../wrapper/types";
import {
    Button,
    ButtonGroup,
    Collapse,
    createStyles, Divider,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Typography,
    useTheme
} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import CachedIcon from '@material-ui/icons/Cached';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import HelpIcon from '@material-ui/icons/Help';
import {
    ApplicationApproved,
    ApplicationPending,
    ApplicationRejected, ApplicationStatusOrder,
    ApplicationUnknown
} from "../constants/application_status";
import clsx from "clsx";
import {ApplicationAPISet, applyBorrowDeviceAPIs, Result} from "../wrapper/requests";
import {Optional} from "../store/store";
import Paper from "@material-ui/core/Paper";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import SearchIcon from "@material-ui/icons/Search";
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";
import RefreshIcon from "@material-ui/icons/Refresh";
import {MaxApplicationsPerPage, MaxDevicesPerPage} from "../constants/constants";
import {Alert, Pagination} from "@material-ui/lab";
import {formatTime, toShortTimeString} from "../utils/time_format";

const useStyles = makeStyles(theme => createStyles({
    listItem: {
        flexDirection: "column",
        alignItems: "stretch",
    },
    listItemLine1: {
        display: "flex",
        justifyContent: "space-between",
    },
    applicationDescription: {
        flex: "1 1",
    },
    applicationStatus: {
        display: "flex",
        alignItems: "center",
    },
    pendingStatus: {
        color: theme.palette.warning.main,
    },
    approvedStatus: {
        color: theme.palette.success.main,
    },
    rejectedStatus: {
        color: theme.palette.error.main,
    },
    approveButton: {
        backgroundColor: theme.palette.success.light,
        color: "#fff",
    },
    rejectButton: {
        backgroundColor: theme.palette.error.light,
        color: "#fff",
    },
    unknownStatus: {
        color: theme.palette.grey.A400,
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
}))

function ApplicationStatus(props: {
    statusCode: number,
    className?: string
}) {
    const classes = useStyles(useTheme());
    return <span className={props.className}>
        {
            ((code: number) => {
                switch (code) {
                    case ApplicationPending.code:
                        return <React.Fragment>
                            <CachedIcon className={classes.pendingStatus}/>
                            <Typography className={classes.pendingStatus} variant="body1" component="span">
                                {ApplicationPending.description}
                            </Typography>
                        </React.Fragment>
                    case ApplicationApproved.code:
                        return <React.Fragment>
                            <CheckCircleIcon className={classes.approvedStatus}/>
                            <Typography className={classes.approvedStatus} variant="body1" component="span">
                                {ApplicationApproved.description}
                            </Typography>
                        </React.Fragment>
                    case ApplicationRejected.code:
                        return <React.Fragment>
                            <CancelIcon className={classes.rejectedStatus}/>
                            <Typography className={classes.rejectedStatus} variant="body1" component="span">
                                {ApplicationRejected.description}
                            </Typography>
                        </React.Fragment>
                    default:
                        return <React.Fragment>
                            <HelpIcon className={classes.unknownStatus}/>
                            <Typography className={classes.unknownStatus} variant="body1" component="span">
                                {ApplicationUnknown.description}
                            </Typography>
                        </React.Fragment>
                }
            })(props.statusCode)
        }
    </span>
}

export type ApplicationViewProps<T extends IApplication> = PropsWithChildren<{
    application: T,
    applicationTitle: string,
    canApprove: boolean,
    onApprove: (id: number) => unknown,
    onReject: (id: number) => unknown,
}>;

export function ApplicationView<T extends IApplication>(props: ApplicationViewProps<T>) {
    const classes = useStyles(useTheme());
    const [expanded, setExpanded] = React.useState(false);
    const handleExpandClick = () => setExpanded(!expanded);
    return <ListItem className={classes.listItem}>
        <span className={classes.listItemLine1}>
            <Typography className={classes.applicationDescription} variant="h6"
                        component="span">{props.applicationTitle}</Typography>
            <ApplicationStatus className={classes.applicationStatus} statusCode={props.application.status}/>
        </span>
        <Grid container justify="space-between">
            <Grid item>
                <Typography variant="body2" color="textSecondary">申请人: {props.application.applicant.name}</Typography>
                {
                    props.application.status === ApplicationPending.code ?
                        <Typography variant="body2"
                                    color="textSecondary">
                            申请时间: {formatTime(props.application.apply_time)}
                        </Typography>
                        : <Typography variant="body2"
                                      color="textSecondary">
                            处理时间: {formatTime(props.application.handle_time || 0)}
                        </Typography>
                }
            </Grid>
            <Grid item>
                <IconButton className={clsx(classes.expand, {
                    [classes.expandOpen]: expanded,
                })}
                            onClick={handleExpandClick}
                            aria-expanded={expanded}
                            aria-label="show more">
                    <ExpandMoreIcon/>
                </IconButton>
            </Grid>
        </Grid>
        <Collapse in={expanded}>
            {
                props.application.status !== ApplicationPending.code ?
                    <Typography variant="body2"
                                color="textSecondary">
                        申请时间: {formatTime(props.application.apply_time)}
                    </Typography> : null
            }
            {props.canApprove && props.application.status === ApplicationPending.code ? <div style={{
                display: "flex",
                justifyContent: "flex-end",
            }}><ButtonGroup>
                <Button className={classes.approveButton} variant="contained"
                        onClick={() => props.onApprove(props.application.apply_id)}>通过</Button>
                <Button className={classes.rejectButton} variant="contained"
                        onClick={() => props.onReject(props.application.apply_id)}>拒绝</Button>
            </ButtonGroup></div> : null}
            {props.children}
        </Collapse>
    </ListItem>
}


const useApplicationPageStyles = makeStyles(theme => createStyles({
    paper: {
        maxWidth: 960,
        margin: 'auto',
        overflow: 'hidden',
    },
    searchBar: {
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
    },
    searchInput: {
        fontSize: theme.typography.fontSize,
    },
    block: {
        display: 'block',
    },
    addUser: {
        marginRight: theme.spacing(1),
    },
    contentWrapper: {
        margin: '40px 16px',
    },
    contentWrapperLight: {
        margin: theme.spacing(2, 1),
        display: "flex",
        flexDirection: "column",
    },
    marginTopBottom1: {
        margin: theme.spacing(1, 0),
    }
}))

export function ApplicationViewPage<T extends IApplication>(props: {
    // request: () => Promise<Result<T[]>>,
    apiRoot: ApplicationAPISet<T>,
    role: "self" | "provider" | "admin",
    filter: (filterString: string, application: T) => boolean,
    filterPlaceholder: string,
    // title: (application: T) => React.ReactNode,
    renderer: (application: T) => React.ReactNode,
    titleRenderer: (application: T) => string,
    canApprove: boolean,
    refresh?: boolean,
}) {
    const classes = useApplicationPageStyles(useTheme());
    const [applications, setApplications] = React.useState(null as Optional<T[]>);
    const [errorMessage, setErrorMessage] = React.useState(null as Optional<string>);
    const [handleErrorMessage, setHandleErrorMessage] = React.useState(null as Optional<string>);
    const [page, setPage] = React.useState(1);
    const [filterString, setFilterString] = React.useState("");
    const [refresh, setRefresh] = React.useState(false);
    const [refreshTimeout, setRefreshTimeout] = React.useState(false);

    React.useEffect(() => {
        setErrorMessage(null);
        setApplications([])
        props.apiRoot[props.role]().then((result) => {
            if (result.success) {
                setErrorMessage(null);
                setApplications(result.data.sort((a: T, b: T) => {
                    if (a.status === ApplicationPending.code && b.status === ApplicationPending.code) {
                        return b.apply_time - a.apply_time;
                    } else if (a.status === ApplicationPending.code) {
                        return -1;
                    } else if (b.status === ApplicationPending.code) {
                        return 1;
                    } else {
                        return (b.handle_time || 0) - (a.handle_time || 0);
                    }
                }));
            } else {
                setErrorMessage(result.message);
            }
        }, reason => {
            setErrorMessage(reason.toString());
        })
    }, [props.apiRoot, props.role, props.refresh, refresh]);

    React.useEffect(() => {
        if (refreshTimeout) {
            const timeout = setTimeout(() => {
                setRefresh(!refresh);
                setRefreshTimeout(false);
            }, 1000)
            return () => clearTimeout(timeout);
        }
    })

    const triggerRefresh = () => {
        setRefresh(!refresh);
    }

    const handleApprove = (id: number) => {
        props.apiRoot.approve(id).then((result) => {
            if (result.success) {
                triggerRefresh()
            } else {
                setRefreshTimeout(true);
                setHandleErrorMessage(result.message);
            }
        });
    }

    const handleReject = (id: number) => {
        props.apiRoot.reject(id).then((result) => {
            if (result.success) {
                triggerRefresh()
            } else {
                setRefreshTimeout(true);
                setHandleErrorMessage(result.message);
            }
        });
    }

    const actualList = applications === null ? null : applications.filter((value) => props.filter(filterString, value))

    return <Paper className={classes.paper}>
        <AppBar className={classes.searchBar} position="static" color="default" elevation={0}>
            <Toolbar>
                <Grid container spacing={2} alignItems="center">
                    <Grid item>
                        <SearchIcon className={classes.block} color="inherit"/>
                    </Grid>
                    <Grid item xs>
                        <TextField
                            fullWidth
                            placeholder={props.filterPlaceholder}
                            InputProps={{
                                disableUnderline: true,
                                className: classes.searchInput,
                            }}
                            value={filterString}
                            onChange={event => {
                                setFilterString(event.target.value);
                            }}
                        />
                    </Grid>
                    <Grid item>
                        <Tooltip title="Reload">
                            <IconButton onClick={triggerRefresh}>
                                <RefreshIcon className={classes.block} color="inherit"/>
                            </IconButton>
                        </Tooltip>
                    </Grid>
                </Grid>
            </Toolbar>
        </AppBar>
        {
            (actualList === null || actualList.length === 0) ? (
                <div className={classes.contentWrapper}>
                    {errorMessage ? <Typography color="textSecondary" align="center">
                        {errorMessage}
                    </Typography> : <Typography color="textSecondary" align="center">
                        {actualList === null ? "加载中" : "暂无申请"}
                    </Typography>}
                </div>
            ) : (
                <div className={classes.contentWrapperLight}><List>
                    {actualList.slice(MaxDevicesPerPage * (page - 1), MaxDevicesPerPage * page).map((value, index) => (
                        <ApplicationView application={value} applicationTitle={props.titleRenderer(value)} key={index}
                                         canApprove={props.canApprove} onApprove={handleApprove}
                                         onReject={handleReject}>
                            {handleErrorMessage ? <Alert className={classes.marginTopBottom1} severity="error">{handleErrorMessage}</Alert> : null}
                            {props.renderer(value)}
                        </ApplicationView>
                    ))}
                </List>
                    <Pagination style={{alignSelf: "center"}}
                                page={page}
                                onChange={(evt, page1) => setPage(page1)}
                                count={Math.max(1, Math.ceil(actualList.length / MaxApplicationsPerPage))}/>
                </div>
            )
        }
    </Paper>
}