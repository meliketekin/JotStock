import { createSlice } from "@reduxjs/toolkit";
const orderSlice = createSlice({
    name: "orderSlice",
    initialState: {
        orders: [],
        count: []
    },
    reducers: {
        setOrders: (state, action) => {
            let array = []
            action.payload.map((item, index) => {
                let tmpItem = {
                    "urunAdi": item.urunAdi,
                    "barcode": item.barcode,
                    "fiyat": item.fiyat,
                    "adet": (state.count[index]).toString()
                }
                array.push(tmpItem)
            })
            state.orders = array
        },
        setCounts: (state, action) => {
            state.count = action.payload
        },
    },
});

export const { setOrders, setCounts } = orderSlice.actions;

export default orderSlice;