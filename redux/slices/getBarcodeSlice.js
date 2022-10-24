import { createSlice } from "@reduxjs/toolkit";
const barcodeSlice = createSlice({
    name: "getBarcode",
    initialState: {
        barcodes: [],
        barcodesInfo: [],
        count: [],
        oneBarcode: []
    },
    reducers: {
        setBarcodes: (state, action) => {
            state.barcodes = [...state.barcodes, { "barcode": Number(action.payload) }];

        },
        getBarcodes: (state, action) => {
            state.barcodesInfo = action.payload;
            console.log(action.payload)
        },
        setCount: (state, action) => {
            state.count.push(action.payload)
        },
        incrCount: (state, action) => {
            state.count[action.payload]++;
            console.log(state.count)
        },
        clearBarcodes: (state, action) => {
            state.barcodes = []
            state.barcodesInfo = []
            state.count = []
        },
        setBarcodesInfo: (state, action) => {
            state.barcodesInfo = action.payload
        }
    },
});

export const { setBarcodes, getBarcodes, setCount, incrCount, clearBarcodes, setBarcodesInfo } = barcodeSlice.actions;

export default barcodeSlice;