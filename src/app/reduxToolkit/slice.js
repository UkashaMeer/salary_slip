// "use client"

// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//     employees: []
// }

// export const EmployeeSlice = createSlice({
//     name: "employee",
//     initialState,
//     reducers: {
//         createEmployee: (state, action) => {
//             const data = {
//                 name: action.payload.name,
//                 email: action.payload.email,
//                 salary: action.payload.salary,
//                 phone: action.payload.phone,
//                 cnic: action.payload.address,
//             }
//             state.employees.push(data)
//         }
//     }
// })