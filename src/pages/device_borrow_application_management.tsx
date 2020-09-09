import React from "react";
import {IDeviceBorrowApplication} from "../wrapper/types";
import {applyBorrowDeviceAPIs, deviceList, Result} from "../wrapper/requests";
import {RouteComponentProps} from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import {ApplicationViewPage} from "./application_admin";

const deviceBorrowApplicationPageProps = {
    apiRoot: applyBorrowDeviceAPIs,
    filter: (filterString: string, value: IDeviceBorrowApplication) => {
        if (filterString) {
            return (
                value.device.name.indexOf(filterString) !== -1
                || value.device.description.indexOf(filterString) !== -1
            )
        }
        return true;
    },
    filterPlaceholder: "设备名称/描述",
    renderer: (value: IDeviceBorrowApplication) => {
        return <React.Fragment>
            <Typography variant="h6" component="h1">申请人: {value.applicant.name}</Typography>
            <Typography variant="body2" color="secondary">
                {value.applicant.student_id}&nbsp;
                {value.applicant.email}</Typography>
            <Typography variant="h6">申请借用设备</Typography>
            <Typography variant="body1">{value.device.name}({value.device.device_id})</Typography>
            <Typography variant="body1">{value.device.description}</Typography>
        </React.Fragment>
    },
    titleRenderer: (value: IDeviceBorrowApplication) => {
        return `借用 ${value.device.name}`;
    }
}

export function DeviceBorrowApplicationAdminPage(props: RouteComponentProps) {
    return <ApplicationViewPage {...deviceBorrowApplicationPageProps} role="admin" canApprove={true}/>
}

export function DeviceBorrowApplicationProviderPage(props: RouteComponentProps) {
    return <ApplicationViewPage {...deviceBorrowApplicationPageProps} role="provider" canApprove={true}/>
}

export function DeviceBorrowApplicationSelfPage(props: RouteComponentProps) {
    return <ApplicationViewPage {...deviceBorrowApplicationPageProps} role="self" canApprove={false}/>
}