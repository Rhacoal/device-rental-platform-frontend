import {applyBecomeProviderAPIs, applyBorrowDeviceAPIs, applyCreateDeviceAPIs} from "../wrapper/requests";
import {IPermissionApplication} from "../wrapper/types";
import React from "react";
import Typography from "@material-ui/core/Typography";
import {RouteComponentProps} from "react-router-dom";
import {ApplicationViewPage} from "./application_admin";

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
            <Typography variant="h6" component="h1">申请人: {value.applicant.name}</Typography>
            <Typography variant="body2" color="secondary">
                {value.applicant.student_id}&nbsp;
                {value.applicant.email}</Typography>
            <Typography variant="h6" component="h1">申请原因</Typography>
            <Typography variant="body1">{value.reason}</Typography>
        </React.Fragment>
    },
    titleRenderer: (value: IPermissionApplication) => {
        return `${value.applicant.name} 的申请`;
    }
}

export function PermissionApplicationAdminPage(props: RouteComponentProps) {
    return <ApplicationViewPage {...permissionApplicationProps} role="admin" canApprove={true}/>
}

export function PermissionApplicationSelfPage(props: RouteComponentProps) {
    return <ApplicationViewPage {...permissionApplicationProps} role="self" canApprove={false}/>
}