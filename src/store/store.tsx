import React from "react";
import {IUserInfo, Optional} from "../wrapper/types";
import {configureStore, createSlice, PayloadAction} from "@reduxjs/toolkit";

export const UserInfoSlice = createSlice({
    name: "userInfo",
    initialState: {
        loggedIn: true,
        userInfo: null as Optional<IUserInfo>
    },
    reducers: {
        setLoggedIn(state, action: PayloadAction<any>) {
            state.loggedIn = true;
            return state;
        },

        setUserInfo(state, action: PayloadAction<IUserInfo>) {
            state.userInfo = action.payload;
            return state;
        },

        globalLogout(state, action: PayloadAction<any>) {
            state.loggedIn = false;
            state.userInfo = null;
            return state;
        }
    }
})

export const PMCountSlice = createSlice({
    name: "pmCount",
    initialState: 0,
    reducers: {
        setCount(state, action: PayloadAction<number>) {
            return action.payload
        }
    }
})

export interface IStore {
    user: {
        userInfo: Optional<IUserInfo>,
        loggedIn: boolean
    },
    pmCount: number,
}

export const store = configureStore<IStore>({
    reducer: {
        user: UserInfoSlice.reducer,
        pmCount: PMCountSlice.reducer,
    }
})