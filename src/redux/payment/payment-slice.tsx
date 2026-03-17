import { EOrderStatus } from "@/types/enums/order-status.enum";
import { EPaymentStatus } from "@/types/enums/payment-status.enum";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface PaymentState {
  currentOrderId: string | null;
  paymentStatus: EPaymentStatus | null;
  orderStatus: EOrderStatus | null;
  isPolling: boolean;
  pollInterval: number;
  showSuccessPopup: boolean;
  showCancelConfirm: boolean;
  expiresAt: number | null;
  timeRemaining: number | null;
}

const STORAGE_KEY = "payment_session";

// Load from localStorage
const loadFromStorage = (): Partial<PaymentState> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      // Only restore if not expired
      if (data.expiresAt && data.expiresAt > Date.now()) {
        return data;
      }
    }
  } catch (error) {
    console.error("Failed to load payment session:", error);
  }
  return {};
};

// Save to localStorage
const saveToStorage = (state: PaymentState) => {
  try {
    const dataToSave = {
      currentOrderId: state.currentOrderId,
      paymentStatus: state.paymentStatus,
      orderStatus: state.orderStatus,
      expiresAt: state.expiresAt,
      isPolling: state.isPolling,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  } catch (error) {
    console.error("Failed to save payment session:", error);
  }
};

// Clear storage
const clearStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear payment session:", error);
  }
};

const storedData = loadFromStorage();

const initialState: PaymentState = {
  currentOrderId: storedData.currentOrderId || null,
  paymentStatus: storedData.paymentStatus || null,
  orderStatus: storedData.orderStatus || null,
  isPolling: storedData.isPolling || false,
  pollInterval: 3000,
  showSuccessPopup: false,
  showCancelConfirm: false,
  expiresAt: storedData.expiresAt || null,
  timeRemaining: null,
};

export const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    handleStartPaymentSession(
      state,
      action: PayloadAction<{
        orderId: string;
        expiresInMinutes?: number;
      }>
    ) {
      state.currentOrderId = action.payload.orderId;
      state.paymentStatus = EPaymentStatus.Pending;
      state.orderStatus = EOrderStatus.WaitingPayment;
      state.isPolling = true;
      
      const expiryMinutes = action.payload.expiresInMinutes || 15;
      state.expiresAt = Date.now() + expiryMinutes * 60 * 1000;
      state.timeRemaining = expiryMinutes * 60;
      
      // Save to localStorage
      saveToStorage(state);
    },

    handleUpdatePaymentStatus(
      state,
      action: PayloadAction<{
        paymentStatus: EPaymentStatus;
        orderStatus: EOrderStatus;
      }>
    ) {
      state.paymentStatus = action.payload.paymentStatus;
      state.orderStatus = action.payload.orderStatus;

      if (
        action.payload.paymentStatus === EPaymentStatus.Completed ||
        action.payload.paymentStatus === EPaymentStatus.Failed
      ) {
        state.isPolling = false;

        if (action.payload.paymentStatus === EPaymentStatus.Completed) {
          state.showSuccessPopup = true;
        }
        
        // Clear storage when payment completed/failed
        clearStorage();
      } else {
        // Update storage
        saveToStorage(state);
      }
    },

    handleStartPolling(state) {
      state.isPolling = true;
      saveToStorage(state);
    },

    handleStopPolling(state) {
      state.isPolling = false;
      saveToStorage(state);
    },

    handleUpdateTimeRemaining(state, action: PayloadAction<number>) {
      state.timeRemaining = action.payload;

      if (action.payload <= 0) {
        state.isPolling = false;
        // Clear storage when expired
        clearStorage();
      }
    },

    handleShowSuccessPopup(state) {
      state.showSuccessPopup = true;
    },

    handleHideSuccessPopup(state) {
      state.showSuccessPopup = false;
    },

    handleShowCancelConfirm(state) {
      state.showCancelConfirm = true;
    },

    handleHideCancelConfirm(state) {
      state.showCancelConfirm = false;
    },

    handleResetPaymentSession() {
      // Clear storage
      clearStorage();
      return initialState;
    },
  },
});

export const {
  handleStartPaymentSession,
  handleUpdatePaymentStatus,
  handleStartPolling,
  handleStopPolling,
  handleUpdateTimeRemaining,
  handleShowSuccessPopup,
  handleHideSuccessPopup,
  handleShowCancelConfirm,
  handleHideCancelConfirm,
  handleResetPaymentSession,
} = paymentSlice.actions;

export default paymentSlice.reducer;