import { put, call, takeLatest } from "redux-saga/effects";
import { eventSlice } from "./eventSlicer";
import { routerSlice } from "../routerSlice";
import * as Api from "./eventAPI";
import { PayloadAction } from "@reduxjs/toolkit";
import { EventData, GetCompanyEventsData } from "./eventData";
import { mapToEventData, mapToEventModel, mapToEventModelArray } from "./eventMapper";
import { EventInviteUsersModel, EventModel, EventNewFormModel, EventUploadModel, GetCompanyEventsModel } from "./eventModel";
import { BadRequestError } from "../../api/exceptions";
import { snackbarSlice } from "../snackbar/snackbarSlice";

export function* eventSaga() {
    yield takeLatest(eventSlice.actions.getAllEventsByUserRequested, getAllEventsByUserRequested);
    yield takeLatest(eventSlice.actions.getCompanyEventsRequested, getCompanyEventsRequested);
    yield takeLatest(eventSlice.actions.createEventRequested, createEventRequested);
    yield takeLatest(eventSlice.actions.uploadPhotoRequested, uploadPhotoRequested);
    yield takeLatest(eventSlice.actions.addUsersCSVRequested, addUsersCSVRequested);
    yield takeLatest(eventSlice.actions.inviteUsersRequested, inviteUsersRequested);
}

function* getAllEventsByUserRequested(action: PayloadAction<URLSearchParams>) {
    try {
        const data: EventData[] = yield call(Api.getAllEventsByUser, action.payload);
        const model = data.map(x => { return mapToEventModel(x) });

        yield put(eventSlice.actions.getAllEventsByUserSucceed(model));
    } catch (e) {
        yield put(eventSlice.actions.getAllEventsByUserFailed(e))
    }
}

function* getCompanyEventsRequested(action: PayloadAction<URLSearchParams>) {
    try {
        const data: GetCompanyEventsData = yield call(Api.getCompanyEvents, action.payload);
        const model: GetCompanyEventsModel = { ...data, events: mapToEventModelArray(data.events!) }

        yield put(eventSlice.actions.getCompanyEventsSucceed(model));
    } catch (e) {
        yield put(eventSlice.actions.getCompanyEventsFailed(e))
    }
}

function* createEventRequested(action: PayloadAction<EventNewFormModel>) {
    try {
        const data: EventData = yield call(Api.createEvent, mapToEventData(action.payload.eventModel));
        const model: EventModel = mapToEventModel(data);

        let param = new URLSearchParams();
        param.append("eventId", String(model.id));

        if (action.payload.eventUploadPhotoModel) {
            yield put(eventSlice.actions.uploadPhotoRequested({ ...action.payload.eventUploadPhotoModel, param: param }));
        }

        if (action.payload.eventAddUsersCSVModel) {
            yield put(eventSlice.actions.addUsersCSVRequested({ ...action.payload.eventAddUsersCSVModel, param: param }));
        }

        if (action.payload.eventInviteUsersModel) {
            yield put(eventSlice.actions.inviteUsersRequested({ ...action.payload.eventInviteUsersModel, eventId: model.id }));
        }

        yield put(routerSlice.actions.routerRedirect(`/event/${model.id}`));

        yield put(eventSlice.actions.createEventSucceed(model));
    } catch (e) {
        yield put(eventSlice.actions.createEventFailed(e))
        if (e instanceof BadRequestError) {
            yield put(snackbarSlice.actions.snackbarOpen({ message: e.message, severity: 'error' }))
        }
    }
}

function* uploadPhotoRequested(action: PayloadAction<EventUploadModel>) {
    try {
        const data: EventData = yield call(Api.uploadPhoto, action.payload);
        const model: EventModel = mapToEventModel(data);

        yield put(eventSlice.actions.uploadPhotoSucceed(model));
    } catch (e) {
        yield put(eventSlice.actions.uploadPhotoFailed(e))
        if (e instanceof BadRequestError) {
            yield put(snackbarSlice.actions.snackbarOpen({ message: e.message, severity: 'error' }))
        }
    }
}

function* addUsersCSVRequested(action: PayloadAction<EventUploadModel>) {
    try {
        const result:string = yield call(Api.addUsersCSV, action.payload);

        // yield put(snackbarSlice.actions.snackbarOpen({ message: result, severity: 'error' }));
        yield put(eventSlice.actions.addUsersCSVSucceed());
    } catch (e) {
        yield put(eventSlice.actions.addUsersCSVFailed(e))
        if (e instanceof BadRequestError) {
            yield put(snackbarSlice.actions.snackbarOpen({ message: e.message, severity: 'error' }));
        }
    }
}

function* inviteUsersRequested(action: PayloadAction<EventInviteUsersModel>) {
    try {
        const result:string = yield call(Api.inviteUsers, action.payload);

        yield put(snackbarSlice.actions.snackbarOpen({ message: result, severity: 'success' }));
        yield put(eventSlice.actions.inviteUsersSucceed());
    } catch (e) {
        yield put(eventSlice.actions.inviteUsersFailed(e))
        if (e instanceof BadRequestError) {
            yield put(snackbarSlice.actions.snackbarOpen({ message: e.message, severity: 'error' }));
        }
    }
}