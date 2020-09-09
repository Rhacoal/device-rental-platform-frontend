import React from "react";
import {IUserInfo} from "../wrapper/types";
import {configureStore, createSlice, PayloadAction} from "@reduxjs/toolkit";

export type Optional<T> = T | null;

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

export interface IStore {
    user: {
        userInfo: Optional<IUserInfo>,
        loggedIn: boolean
    }
}

export const store = configureStore<IStore>({
    reducer: {
        user: UserInfoSlice.reducer,
    }
})