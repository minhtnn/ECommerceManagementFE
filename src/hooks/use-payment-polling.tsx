import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  handleUpdatePaymentStatus,
  handleStopPolling,
} from "@/redux/payment/payment-slice";
import { paymentApi } from "@/apis/payment.api";

export const usePaymentPolling = () => {
  const dispatch = useDispatch();
  const { currentOrderId, isPolling, pollInterval } = useSelector(
    (state: RootState) => state.payment,
  );
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Don't start polling if conditions not met
    if (!isPolling || !currentOrderId) {
      console.log("Polling stopped:", { isPolling, currentOrderId });
      return;
    }

    console.log("🔄 Starting payment polling for order:", currentOrderId);

    // Poll function
    const poll = async () => {
      try {
        console.log("📡 Polling payment status...");

        const response = await paymentApi.getPaymentStatus(
          currentOrderId,
          Intl.DateTimeFormat().resolvedOptions().timeZone,
        );
        const paymentData = response?.data?.data;

        console.log("✅ Payment status response:", paymentData);

        if (paymentData) {
          dispatch(
            handleUpdatePaymentStatus({
              paymentStatus: paymentData.paymentStatus,
              orderStatus: paymentData.orderStatus,
            }),
          );

          // Log status for debugging
          console.log("💳 Payment Status:", {
            payment: paymentData.paymentStatus,
            order: paymentData.orderStatus,
          });
        }
      } catch (error) {
        console.error("❌ Polling error:", error);
        // Don't stop polling on error, just log it
      }
    };

    // Poll immediately on start
    poll();

    // Then poll at interval
    intervalRef.current = setInterval(poll, pollInterval);

    console.log(`⏰ Polling interval set to: ${pollInterval}ms`);

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        console.log("🛑 Stopping payment polling");
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPolling, currentOrderId, pollInterval, dispatch]);

  return {
    isPolling,
    stopPolling: () => dispatch(handleStopPolling()),
  };
};
