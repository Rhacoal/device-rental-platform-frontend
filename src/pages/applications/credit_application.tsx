import {applyCredit, applyCreditAPIs} from "../../wrapper/requests";
import {ICreditApplication} from "../../wrapper/types";
import React from "react";
import {KeyValueView} from "../user_list";
import {VerticalSpacer} from "../../components/vertical_spacer";
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
import Typography from "@material-ui/core/Typography";
import {Edit, Replay} from "@material-ui/icons";
import {makeStyles} from "@material-ui/core/styles";

const creditApplicationPageProps = {
    apiRoot: applyCreditAPIs,
    filter: (filterString: string, value: ICreditApplication) => {
        if (filterString) {
            return (
                value.applicant.name.indexOf(filterString) !== -1
                || value.applicant.email.indexOf(filterString) !== -1
                || value.applicant.student_id.toString().indexOf(filterString) !== -1
            )
        }
        return true;
    },
    filterPlaceholder: "申请者姓名/学号/邮箱",
    renderer: (value: ICreditApplication) => {
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
            <KeyValueView keyString={"申请理由"}
                          value={value.reason}/>
            <KeyValueView keyString={"申请人"}
                          value={value.applicant.name}/>
            <KeyValueView keyString={"学号"}
                          value={value.applicant.student_id}/>
            <KeyValueView keyString={"邮箱"}
                          value={value.applicant.email}/>
            <VerticalSpacer />

        </React.Fragment>
    },
    titleRenderer: (value: ICreditApplication) => {
        return `${value.applicant.name} 的申请`;
    }
}

export function CreditApplicationAdminPage(props: RouteComponentProps) {
    return <ApplicationViewPage {...creditApplicationPageProps} role="admin" canApprove={true}/>
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

export function CreditApplicationSelfPage(props: RouteComponentProps) {
    const classes = useStyles(useTheme());
    const [open, setOpen] = React.useState(false);
    const [applyReason, setApplyReason] = React.useState("");
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
        applyCredit(applyReason)
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
                <Typography variant="h5" component="span">信用分恢复</Typography>
                <ButtonGroup component="span">
                    <Button variant={open ? "outlined" : "contained"} onClick={() => {
                        setOpen(true);
                        setApplyReason("");
                    }}
                            color="primary">
                        <Replay/>
                        申请恢复信用分
                    </Button>
                </ButtonGroup>
            </div>
            <Collapse in={open}>
                <Paper className={classes.paper}>
                    <TextField label="申请理由"
                               multiline
                               rows={3}
                               variant="outlined"
                               onChange={(event) => {
                                   setApplyReason(event.target.value);
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
        <ApplicationViewPage {...creditApplicationPageProps} role="self" canApprove={false} refresh={refresh}/>
    </React.Fragment>
}