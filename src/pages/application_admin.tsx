import React, {PropsWithChildren} from "react";
import {IApplication, IDeviceBorrowApplication, Optional} from "../wrapper/types";
import {
    Button,
    ButtonGroup,
    Collapse, colors,
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
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import HelpIcon from '@material-ui/icons/Help';
import {
    ApplicationApproved, ApplicationApprovedReturned, ApplicationCanceled,
    ApplicationPending,
    ApplicationRejected, ApplicationStatusOrder,
    ApplicationUnknown
} from "../constants/application_status";
import clsx from "clsx";
import {ApplicationAPISet, applyBorrowDeviceAPIs, Result} from "../wrapper/requests";
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
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';

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
    canceledStatus: {
        color: colors.grey[700],
    },
    marginTopBottom1: {
        margin: theme.spacing(1, 0),
    },
    approveButton: {
        backgroundColor: theme.palette.success.light,
        color: "#fff",
        "&:hover": {
            backgroundColor: theme.palette.success.main,
        }
    },
    rejectButton: {
        backgroundColor: theme.palette.error.light,
        color: "#fff",
        "&:hover": {
            backgroundColor: theme.palette.error.main,
        }
    },
    cancelButton: {
        backgroundColor: theme.palette.grey.A700,
        color: "#fff",
        "&:hover": {
            backgroundColor: theme.palette.grey.A400,
        }
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
                    case ApplicationCanceled.code:
                        return <React.Fragment>
                            <RemoveCircleIcon className={classes.canceledStatus}/>
                            <Typography className={classes.canceledStatus} variant="body1" component="span">
                                {ApplicationCanceled.description}
                            </Typography>
                        </React.Fragment>
                    case ApplicationApprovedReturned.code:
                        return <React.Fragment>
                            <CheckCircleIcon color="primary"/>
                            <Typography color="primary" variant="body1" component="span">
                                {ApplicationApprovedReturned.description}
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
    canCancel: boolean,
    onApprove: (id: number, reason: string) => unknown,
    onReject: (id: number, reason: string) => unknown,
    onCancel: (id: number, reason: string) => unknown,
}>;

export function ApplicationView<T extends IApplication>(props: ApplicationViewProps<T>) {
    const classes = useStyles(useTheme());
    const [handleReason, setHandleReason] = React.useState("");
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
            {
                props.application.status == ApplicationApprovedReturned.code && (props.application as any).return_time ?
                    <Typography variant="body2"
                                color="textSecondary">
                        归还时间: {formatTime((props.application as any).return_time)}
                    </Typography> : null
            }
            {props.canApprove && props.application.status === ApplicationPending.code ? <React.Fragment>
                <TextField fullWidth
                           variant="outlined"
                           value={handleReason}
                           placeholder="备注"
                           multiline
                           rows={2}
                           onChange={(event) => setHandleReason(event.target.value)}
                           className={classes.marginTopBottom1}
                />
                <div style={{
                    display: "flex",
                    justifyContent: "flex-end",
                }}><ButtonGroup>
                    <Button className={classes.approveButton} variant="contained"
                            onClick={() => props.onApprove(props.application.apply_id, handleReason)}>通过</Button>
                    <Button className={classes.rejectButton} variant="contained"
                            onClick={() => props.onReject(props.application.apply_id, handleReason)}>拒绝</Button>
                    <Button className={classes.cancelButton} variant="contained"
                            onClick={() => props.onCancel(props.application.apply_id, handleReason)}>撤销</Button>
                </ButtonGroup></div>
            </React.Fragment> : null}
            {!props.canApprove && props.canCancel && props.application.status === ApplicationPending.code ? <React.Fragment>
                <div style={{
                    display: "flex",
                    justifyContent: "flex-end",
                }}><ButtonGroup>
                    <Button className={classes.cancelButton} variant="contained"
                            onClick={() => props.onCancel(props.application.apply_id, handleReason)}>撤销</Button>
                </ButtonGroup></div>
            </React.Fragment> : null}
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
        margin: theme.spacing(0, 0, 1.5),
        display: "flex",
        flexDirection: "column",
    },
    marginTopBottom1: {
        margin: theme.spacing(1, 0),
    },
    divider: {
        backgroundColor: theme.palette.divider,
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

    const handleApprove = (id: number, reason: string) => {
        props.apiRoot.approve(id, reason).then((result) => {
            if (result.success) {
                triggerRefresh();
            } else {
                setHandleErrorMessage(result.message);
            }
        });
    }

    const handleReject = (id: number, reason: string) => {
        props.apiRoot.reject(id, reason).then((result) => {
            if (result.success) {
                triggerRefresh()
            } else {
                setHandleErrorMessage(result.message);
            }
        });
    }

    const handleCancel = (id: number, reason: string) => {
        props.apiRoot.cancel(id, reason).then((result) => {
            if (result.success) {
                triggerRefresh()
            } else {
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
                        <React.Fragment key={index}>
                            <ApplicationView application={value} applicationTitle={props.titleRenderer(value)}
                                             canApprove={props.canApprove} canCancel={true} onApprove={handleApprove}
                                             onReject={handleReject} onCancel={handleCancel}>
                                {handleErrorMessage ? <Alert className={classes.marginTopBottom1}
                                                             severity="error">{handleErrorMessage}</Alert> : null}
                                {props.renderer(value)}
                            </ApplicationView>
                            <Divider className={classes.divider} component="li"/>
                        </React.Fragment>
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