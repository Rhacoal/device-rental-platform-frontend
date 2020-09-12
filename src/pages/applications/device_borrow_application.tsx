import React from "react";
import {IDeviceBorrowApplication} from "../../wrapper/types";
import {applyBorrowDeviceAPIs, deviceList, Result} from "../../wrapper/requests";
import {RouteComponentProps} from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import {ApplicationViewPage} from "./application_admin";
import {KeyValueView} from "../user_list";
import {VerticalSpacer} from "../../components/vertical_spacer";
import {formatTime} from "../../utils/time_format";
import {UserNameLink} from "../../components/user_name_link";

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
                              value={<UserNameLink userInfo={value.handler}/>}/>
                <KeyValueView keyString={"邮箱"}
                              value={value.handler.email}/>
                <KeyValueView keyString={"处理者备注"}
                              value={value.handle_reason || "无"}/>
                <VerticalSpacer />
            </React.Fragment> : null}
            <KeyValueView keyString={"申请原因"}
                          value={value.reason}/>
            <KeyValueView keyString={"申请人"}
                          value={<UserNameLink userInfo={value.applicant}/>}/>
            <KeyValueView keyString={"学号"}
                          value={value.applicant.student_id}/>
            <KeyValueView keyString={"邮箱"}
                          value={value.applicant.email}/>
            <KeyValueView keyString={"归还时间"}
                          value={formatTime(value.return_time)}/>
            <VerticalSpacer />
            <KeyValueView keyString={"设备提供者"} value={<UserNameLink userInfo={value.device.owner}/>}/>
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