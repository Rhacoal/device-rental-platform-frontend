import React from "react";
import {IDeviceBorrowApplication} from "../wrapper/types";
import {applyBorrowDeviceAPIs, deviceList, Result} from "../wrapper/requests";
import {RouteComponentProps} from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import {ApplicationViewPage} from "./application_admin";
import {KeyValueView} from "./user_list";
import {VerticalSpacer} from "../components/vertical_spacer";

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
            {value.handler ? <React.Fragment>
                <KeyValueView keyString={"处理人"}
                              value={value.handler.name}/>
                <KeyValueView keyString={"邮箱"}
                              value={value.handler.email}/>
                <VerticalSpacer />
            </React.Fragment> : null}
            <KeyValueView keyString={"申请原因"}
                          value={value.reason}/>
            <KeyValueView keyString={"申请人"}
                          value={value.applicant.name}/>
            <KeyValueView keyString={"学号"}
                          value={value.applicant.student_id}/>
            <KeyValueView keyString={"邮箱"}
                          value={value.applicant.email}/>
            <VerticalSpacer />
            <KeyValueView keyString={"设备提供者"} value={value.device.owner.name}/>
            <KeyValueView keyString={"设备信息"} value={value.device.description}/>

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