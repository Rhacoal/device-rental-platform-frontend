import {applyBorrowDeviceAPIs, applyCreateDeviceAPIs} from "../wrapper/requests";
import {ICreateDeviceApplication, IDeviceBorrowApplication} from "../wrapper/types";
import React from "react";
import Typography from "@material-ui/core/Typography";
import {RouteComponentProps} from "react-router-dom";
import {ApplicationViewPage} from "./application_admin";
import {Button, ButtonGroup, Collapse, Container, createStyles, Paper, useTheme} from "@material-ui/core";
import {Edit} from "@material-ui/icons";
import {makeStyles} from "@material-ui/core/styles";

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
            <Typography variant="h6" component="h1">申请人: {value.applicant.name}</Typography>
            <Typography variant="body2" color="secondary">
                {value.applicant.student_id}&nbsp;
                {value.applicant.email}</Typography>
            <Typography variant="h6">上架设备</Typography>
            <Typography variant="body1">{value.device_name}</Typography>
            <Typography variant="body1">{value.device_description}</Typography>
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
        margin: theme.spacing(1),
    },
    container: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
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

    return <React.Fragment>
        <Container maxWidth="md" className={classes.container}>
            <div className="title">
                <Typography variant="h5" component="span" >上架申请</Typography>
                <ButtonGroup component="span">
                    <Button variant="contained" onClick={() => {
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

                </Paper>
            </Collapse>
        </Container>
        <ApplicationViewPage {...deviceCreateApplicationProps} role="self" canApprove={false}/>
    </React.Fragment>
}
