import {
    applyBecomeProvider,
    applyBecomeProviderAPIs,
    applyBorrowDeviceAPIs,
    applyCreateDevice,
    applyCreateDeviceAPIs
} from "../wrapper/requests";
import {IPermissionApplication} from "../wrapper/types";
import React from "react";
import Typography from "@material-ui/core/Typography";
import {RouteComponentProps} from "react-router-dom";
import {ApplicationViewPage} from "./application_admin";
import {
    Button,
    ButtonGroup,
    Collapse,
    Container,
    createStyles,
    Paper,
    Snackbar,
    TextField,
    useTheme
} from "@material-ui/core";
import {Alert} from "@material-ui/lab";
import {Edit} from "@material-ui/icons";
import {makeStyles} from "@material-ui/core/styles";
import {KeyValueView} from "./user_list";
import {VerticalSpacer} from "../components/vertical_spacer";

const permissionApplicationProps = {
    apiRoot: applyBecomeProviderAPIs,
    filter: (filterString: string, value: IPermissionApplication) => {
        if (filterString) {
            return (
                value.applicant.student_id.toString().indexOf(filterString) !== -1
                || value.applicant.name.indexOf(filterString) !== -1
            )
        }
        return true;
    },
    filterPlaceholder: "姓名/学号",
    renderer: (value: IPermissionApplication) => {
        return <React.Fragment>
            {value.handler ? <React.Fragment>
                <KeyValueView keyString={"处理人"}
                              value={value.handler.name}/>
                <KeyValueView keyString={"邮箱"}
                              value={value.handler.email}/>
                <KeyValueView keyString={"处理者备注"}
                              value={value.handle_reason || "无"}/>
                <VerticalSpacer />
            </React.Fragment> : null}
            <KeyValueView keyString={"学号"}
                          value={value.applicant.student_id}/>
            <KeyValueView keyString={"邮箱"}
                          value={value.applicant.email}/>
            <KeyValueView keyString={"申请原因"}
                          value={value.reason}/>
        </React.Fragment>
    },
    titleRenderer: (value: IPermissionApplication) => {
        return `${value.applicant.name} 的申请`;
    }
}

export function PermissionApplicationAdminPage(props: RouteComponentProps) {
    return <ApplicationViewPage {...permissionApplicationProps} role="admin" canApprove={true}/>
}


const useStyles = makeStyles(theme => createStyles({
    paper: {
        padding: theme.spacing(2),
        flexDirection: "column",
        margin: theme.spacing(1, 0),
        display: "flex",
        "& .MuiButton-root": {
            alignSelf: "flex-end",
            margin: theme.spacing(0, 0, 1, 0),
        },
        "& .MuiTextField-root": {
            margin: theme.spacing(0, 0, 1, 0),
        }
    },
    container: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        padding: 0,
        // display: "flex",
        // flexDirection: "column",
        // alignItems: "stretch",
        "& .MuiButtonGroup-root": {
            alignSelf: "flex-end",
        },
        "& .title": {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
        }
    },
}))

export function PermissionApplicationSelfPage(props: RouteComponentProps) {
    const classes = useStyles(useTheme());
    const [open, setOpen] = React.useState(false);
    const [applicationReason, setApplicationReason] = React.useState("");
    const [refresh, setRefresh] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");
    const [inSubmit, setInSubmit] = React.useState(false);
    const [snackOpen, setSnackOpen] = React.useState(false);

    const handleSubmitApplication = () => {
        if (inSubmit) {
            return;
        }
        setInSubmit(true);
        setErrorMessage("");
        applyBecomeProvider(applicationReason).then((result) => {
            setInSubmit(false);
            if (result.success) {
                setRefresh(!refresh);
                setOpen(false);
                setSnackOpen(true);
            } else {
                setErrorMessage(result.message);
            }
        }, (reason) => {
            setInSubmit(false);
            setErrorMessage(reason.toString());
        })
    }

    return <React.Fragment>
        <Container maxWidth="md" className={classes.container}>
            <Snackbar open={snackOpen} autoHideDuration={6000} onClose={() => setSnackOpen(false)}>
                <Alert onClose={() => setSnackOpen(false)} severity="success">
                    申请成功
                </Alert>
            </Snackbar>
            <div className="title">
                <Typography variant="h5" component="span">成为设备提供者申请</Typography>
                <ButtonGroup component="span">
                    <Button variant="contained" onClick={() => {
                        setOpen(true);
                    }}
                            color="primary">
                        <Edit/>
                        申请
                    </Button>
                </ButtonGroup>
            </div>
            <Collapse in={open}>
                <Paper className={classes.paper}>
                    <TextField multiline
                               rows={10}
                               label="申请理由"
                               variant="outlined"
                               onChange={(event) => {
                                   setApplicationReason(event.target.value)
                               }}
                    />
                    <Button color="primary"
                            variant="outlined"
                            onClick={handleSubmitApplication}>
                        提交申请
                    </Button>
                    {errorMessage ? <Alert severity="error">
                        {errorMessage}
                    </Alert> : null}
                </Paper>
            </Collapse>
        </Container>
        <ApplicationViewPage {...permissionApplicationProps} role="self" canApprove={false} refresh={refresh}/>
    </React.Fragment>;
}