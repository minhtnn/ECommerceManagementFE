import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./user/user-slice";
import modalSlice from '@/redux/modal/modal-slice';
import paymentSlice from "@/redux/payment/payment-slice";

const store = configureStore( {
    reducer: {
        user: userSlice,
        modal: modalSlice,
        payment: paymentSlice,
    },
} );
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;