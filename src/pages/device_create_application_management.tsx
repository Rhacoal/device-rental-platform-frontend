import {applyBorrowDeviceAPIs, applyCreateDeviceAPIs} from "../wrapper/requests";
import {ICreateDeviceApplication, IDeviceBorrowApplication} from "../wrapper/types";
import React from "react";
import Typography from "@material-ui/core/Typography";
import {RouteComponentProps} from "react-router-dom";
import {ApplicationViewPage} from "./application_admin";

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

export function DeviceCreateApplicationProviderPage(props: RouteComponentProps) {
    return <ApplicationViewPage {...deviceCreateApplicationProps} role="self" canApprove={false}/>
}
