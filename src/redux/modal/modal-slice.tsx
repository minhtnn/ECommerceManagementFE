import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ModalState {
  isOpen: boolean;
  createdId?: string;
  isHeaderMenuOpenWhenChangingMobile: boolean;
  isChangePasswordDashboardDialogOpen: boolean;
  chosenCategoryId?: string;
  isAuthLoading: boolean;
  isEditAccountDialogOpen: boolean;
  registerEmail: string | undefined;
  showOTPModal: boolean;
}

const initialState: ModalState = {
  isOpen: false,
  createdId: undefined,
  isHeaderMenuOpenWhenChangingMobile: false,
  chosenCategoryId: undefined,
  isAuthLoading: true,
  isEditAccountDialogOpen: false,
  registerEmail: undefined,
  showOTPModal: false,
  isChangePasswordDashboardDialogOpen: false,
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
    handleSetRegisterEmail(
      state,
      action: PayloadAction<string | undefined>
    ) {
      state.registerEmail = action?.payload;
    },
    handleToggleOTPModal(
      state,
      action: PayloadAction<boolean>
    ) {
      state.showOTPModal = action?.payload;
    },
    handleChangePasswordDashboardDialogOpen(
      state,
      action: PayloadAction<boolean>
    ) {
      state.isChangePasswordDashboardDialogOpen = action?.payload;
    },
  },
});

export const {
  handleChangeModalState,
  handleSetCreatedId,
  handleChangeHeaderMenuOpenWhenChangingMobile,
  handleSetChosenCategoryId,
  handleSetIsAuthLoading,
  handleSetIsEditAccountDialogOpen,
  handleSetRegisterEmail,
  handleToggleOTPModal,
  handleChangePasswordDashboardDialogOpen
} = modalSlice.actions;

export default modalSlice.reducer;
