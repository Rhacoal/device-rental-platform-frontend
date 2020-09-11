import {applyBorrowDeviceAPIs, applyCreateDevice, applyCreateDeviceAPIs} from "../wrapper/requests";
import {ICreateDeviceApplication, IDeviceBorrowApplication} from "../wrapper/types";
import React from "react";
import Typography from "@material-ui/core/Typography";
import {RouteComponentProps} from "react-router-dom";
import {ApplicationViewPage} from "./application_admin";
import {
    Box,
    Button,
    ButtonGroup,
    Collapse,
    Container,
    createStyles, Divider,
    Paper, Snackbar,
    TextField,
    useTheme
} from "@material-ui/core";
import {Edit} from "@material-ui/icons";
import {makeStyles} from "@material-ui/core/styles";
import {Alert} from "@material-ui/lab";
import {KeyValueView} from "./user_list";
import {Urls} from "../wrapper/urls";
import {VerticalSpacer} from "../components/vertical_spacer";
import {DeviceDescription} from "../utils/device_description_renderer";

const deviceCreateApplicationProps = {
    apiRoot: applyCreateDeviceAPIs,
    filter: (filterString: string, value: ICreateDeviceApplication) => {
        if (filterString) {
            return (
                value.device_name.indexOf(filterString) !== -1
                || value.device_description.indexOf(filterString) !== -1
            )
        }
        return true;
    },
    filterPlaceholder: "设备名称/描述",
    renderer: (value: ICreateDeviceApplication) => {
        return <React.Fragment>
            {value.handler ? <React.Fragment>
                <KeyValueView keyString={"处理人"}
                              value={value.handler.name}/>
                <KeyValueView keyString={"邮箱"}
                              value={value.handler.email}/>
                <KeyValueView keyString={"处理者备注"}
                              value={value.handle_reason || "无"}/>
                <VerticalSpacer/>
            </React.Fragment> : null}
            <KeyValueView keyString={"申请人"}
                          value={value.applicant.name}/>
            <KeyValueView keyString={"学号"}
                          value={value.applicant.student_id}/>
            <KeyValueView keyString={"邮箱"}
                          value={value.applicant.email}/>
            <VerticalSpacer/>
            <KeyValueView keyString={"设备名称"}
                          value={value.device_name}/>
            <KeyValueView keyString={"设备信息"} value={""}/>
            <DeviceDescription value={value.device_description}/>
        </React.Fragment>
    },
    titleRenderer: (value: ICreateDeviceApplication) => {
        return `上架 ${value.device_name}`;
    }
}

export function DeviceCreateApplicationAdminPage(props: RouteComponentProps) {
    return <ApplicationViewPage {...deviceCreateApplicationProps} role="admin" canApprove={true}/>
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

export function DeviceCreateApplicationProviderPage(props: RouteComponentProps) {
    const classes = useStyles(useTheme());
    const [open, setOpen] = React.useState(false);
    const [deviceName, setDeviceName] = React.useState("");
    const [deviceAddress, setDeviceAddress] = React.useState("");
    const [deviceDescription, setDeviceDescription] = React.useState("");
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
        applyCreateDevice(deviceName, `<address:${deviceAddress}>${deviceDescription}`)
            .then((result) => {
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
                <Typography variant="h5" component="span">上架申请</Typography>
                <ButtonGroup component="span">
                    <Button variant={open ? "outlined" : "contained"} onClick={() => {
                        setOpen(true);
                    }}
                            color="primary">
                        <Edit/>
                        申请上架设备
                    </Button>
                </ButtonGroup>
            </div>
            <Collapse in={open}>
                <Paper className={classes.paper}>
                    <TextField label="设备名称"
                               variant="outlined"
                               onChange={(event) => {
                                   setDeviceName(event.target.value);
                               }}
                    />
                    <TextField label="地址"
                               variant="outlined"
                               onChange={(event) => {
                                   setDeviceAddress(event.target.value);
                               }}
                    />
                    <TextField multiline
                               rows={10}
                               label="设备信息"
                               variant="outlined"
                               onChange={(event) => {
                                   setDeviceDescription(event.target.value)
                               }}
                    />
                    <ButtonGroup>
                        <Button color="primary"
                                variant="contained"
                                onClick={handleSubmitApplication}>
                            提交申请
                        </Button>
                        <Button color="default"
                                variant="contained"
                                onClick={() => setOpen(false)}>
                            取消
                        </Button>
                    </ButtonGroup>
                    {errorMessage ? <Alert severity="error">
                        {errorMessage}
                    </Alert> : null}
                </Paper>
            </Collapse>
        </Container>
        <ApplicationViewPage {...deviceCreateApplicationProps} role="self" canApprove={false} refresh={refresh}/>
    </React.Fragment>
}
