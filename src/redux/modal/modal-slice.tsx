import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ModalState {
  isOpen: boolean;
  createdId?: string;
  isHeaderMenuOpenWhenChangingMobile: boolean;
  chosenCategoryId?: string;
  isAuthLoading: boolean;
  isEditAccountDialogOpen: boolean;
}

const initialState: ModalState = {
  isOpen: false,
  createdId: undefined,
  isHeaderMenuOpenWhenChangingMobile: false,
  chosenCategoryId: undefined,
  isAuthLoading: true,
  isEditAccountDialogOpen: false,
};

export const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    handleChangeModalState(state, action: PayloadAction<boolean>) {
      state.isOpen = action?.payload;
    },
    handleSetCreatedId(state, action: PayloadAction<string | undefined>) {
      state.createdId = action?.payload;
    },
    handleChangeHeaderMenuOpenWhenChangingMobile(
      state,
      action: PayloadAction<boolean>
    ) {
      state.isHeaderMenuOpenWhenChangingMobile = action?.payload;
    },
    handleSetChosenCategoryId(
      state,
      action: PayloadAction<string | undefined>
    ) {
      state.chosenCategoryId = action?.payload;
    },
    handleSetIsAuthLoading(
      state,
      action: PayloadAction<boolean | undefined>
    ) {
      state.isAuthLoading = action?.payload;
    },
    handleSetIsEditAccountDialogOpen(
      state,
      action: PayloadAction<boolean | undefined>
    ) {
      state.isEditAccountDialogOpen = action?.payload;
    },
  },
});

export const {
  handleChangeModalState,
  handleSetCreatedId,
  handleChangeHeaderMenuOpenWhenChangingMobile,
  handleSetChosenCategoryId,
  handleSetIsAuthLoading,
  handleSetIsEditAccountDialogOpen
} = modalSlice.actions;

export default modalSlice.reducer;
