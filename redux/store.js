import { configureStore } from '@reduxjs/toolkit'
import userTokenSlice from "./slices/userTokenSlice";
import barcodeSlice from './slices/getBarcodeSlice';
import orderSlice from './slices/orderSlice';

export const store = configureStore({
  reducer: {
    userToken: userTokenSlice.reducer,
    getBarcode: barcodeSlice.reducer,
    orderSlice: orderSlice.reducer
  },
})