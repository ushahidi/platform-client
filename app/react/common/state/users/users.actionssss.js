// import configureMockStore from "redux-mock-store";
// import thunk from "redux-thunk";
// import "isomorphic-fetch";
// import fetchMock from "fetch-mock";
// import {
//     SAVE_NEW_USER,
//     UPDATE_USERS_STATE,
//     saveNewUser
// } from "./users.actions";

// const middlewares = [thunk];
// const mockStore = configureMockStore(middlewares);

// describe("async actions", () => {
//     afterEach(() => {
//         fetchMock.reset();
//         fetchMock.restore();
//     });

//     it("creates UPDATE_USERS_STATE when POST user has been done", () => {
//         fetchMock.postOnce("*", {
//             id: 5,
//             url: "https://carolyntest.api.ushahidi.io/api/v3/users/5",
//             email: "testdata@gmail.com",
//             realname: "Test Data",
//             logins: 0,
//             failed_attempts: 0,
//             last_login: null,
//             last_attempt: null,
//             created: "2018-05-16T16:36:24+00:00",
//             updated: null,
//             role: "user",
//             language: null,
//             contacts: [],
//             allowed_privileges: [
//                 "read",
//                 "create",
//                 "update",
//                 "delete",
//                 "search",
//                 "read_full",
//                 "register"
//             ],
//             gravatar: "c1fa5461d96de458f87f6f9e82903587"
//         });
//         const expectedActions = [
//             { type: SAVE_NEW_USER },
//             {
//                 type: UPDATE_USERS_STATE,
//                 user: {
//                     id: 5,
//                     url: "https://carolyntest.api.ushahidi.io/api/v3/users/5",
//                     email: "testdata@gmail.com",
//                     realname: "Test Data",
//                     logins: 0,
//                     failed_attempts: 0,
//                     last_login: null,
//                     last_attempt: null,
//                     created: "2018-05-16T16:36:24+00:00",
//                     updated: null,
//                     role: "user",
//                     language: null,
//                     contacts: [],
//                     allowed_privileges: [
//                         "read",
//                         "create",
//                         "update",
//                         "delete",
//                         "search",
//                         "read_full",
//                         "register"
//                     ],
//                     gravatar: "c1fa5461d96de458f87f6f9e82903587"
//                 }
//             }
//         ];
//         const store = mockStore({ users: [] });
//         return store.dispatch(saveNewUser()).then(() => {
//             // return of async actions
//             expect(store.getActions()).toEqual(expectedActions);
//         });
//     });
// });
