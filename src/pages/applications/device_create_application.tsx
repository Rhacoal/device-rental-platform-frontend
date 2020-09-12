import {applyBorrowDeviceAPIs, applyCreateDevice, applyCreateDeviceAPIs} from "../../wrapper/requests";
import {ICreateDeviceApplication, IDeviceBorrowApplication} from "../../wrapper/types";
import React from "react";
import Typography from "@material-ui/core/Typography";
import {RouteComponentProps} from "react-router-dom";
import {ApplicationViewPage} from "./application_admin";
import BusinessIcon from "@material-ui/icons/Business";
import DnsIcon from '@material-ui/icons/Dns';
import {
    Box,
    Button,
    ButtonGroup,
    Collapse,
    Container,
    createStyles, Divider, InputAdornment,
    Paper, Snackbar,
    TextField,
    useTheme
} from "@material-ui/core";
import {Edit} from "@material-ui/icons";
import {makeStyles} from "@material-ui/core/styles";
import {Alert} from "@material-ui/lab";
import {KeyValueView} from "../user_list";
import {Urls} from "../../wrapper/urls";
import {VerticalSpacer} from "../../components/vertical_spacer";
import {DeviceDetailRenderer} from "../../utils/device_description_renderer";
import {MetaKeyDescription} from "../../constants/meta_header_keys";
import {UserNameLink} from "../../components/user_name_link";
import {PageTitle} from "../../components/page_title";

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
                              value={<UserNameLink userInfo={value.handler}/>}/>
                <KeyValueView keyString={"邮箱"}
                              value={value.handler.email}/>
                <KeyValueView keyString={"处理者备注"}
                              value={value.handle_reason || "无"}/>
                <VerticalSpacer/>
            </React.Fragment> : null}
            <KeyValueView keyString={"申请人"}
                          value={<UserNameLink userInfo={value.applicant}/>}/>
            <KeyValueView keyString={"学号"}
                          value={value.applicant.student_id}/>
            <KeyValueView keyString={"邮箱"}
                          value={value.applicant.email}/>
            <VerticalSpacer/>
            <KeyValueView keyString={"设备名称"}
                          value={value.device_name}/>
            <KeyValueView keyString={MetaKeyDescription.address}
                          value={value.meta_header ? ((JSON.parse(value.meta_header) || {}).address || "") : ""}/>
            <KeyValueView keyString={"描述"} value={value.device_description}/>
        </React.Fragment>
    },
    titleRenderer: (value: ICreateDeviceApplication) => {
        return `上架 ${value.device_name}`;
    }
}

export function DeviceCreateApplicationAdminPage(props: RouteComponentProps) {
    return <React.Fragment>
        <PageTitle>
            <Typography variant="h5" component="span">{"设备上架申请处理"}</Typography>
        </PageTitle>
        <ApplicationViewPage {...deviceCreateApplicationProps} role="admin" canApprove={true}/>
    </React.Fragment>
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
        marginBottom: theme.spacing(2),
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
        applyCreateDevice(deviceName, deviceDescription, {address: deviceAddress})
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
        <Container maxWidth="lg" className={classes.container}>
            <Snackbar open={snackOpen} autoHideDuration={6000} onClose={() => setSnackOpen(false)}>
                <Alert onClose={() => setSnackOpen(false)} severity="success">
                    申请成功
                </Alert>
            </Snackbar>
            <div className="title">
                <Typography variant="h5" component="span">上架设备申请</Typography>
                <ButtonGroup component="span">
                    <Button variant={open ? "outlined" : "contained"} onClick={() => {
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
                    <TextField placeholder="设备名称"
                               InputProps={{
                                   startAdornment: (
                                       <InputAdornment position="start">
                                           <DnsIcon />
                                       </InputAdornment>
                                   ),
                               }}
                               variant="outlined"
                               onChange={(event) => {
                                   setDeviceName(event.target.value);
                               }}
                    />
                    <TextField placeholder={MetaKeyDescription.address}
                               InputProps={{
                                   startAdornment: (
                                       <InputAdornment position="start">
                                           <BusinessIcon />
                                       </InputAdornment>
                                   ),
                               }}
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
