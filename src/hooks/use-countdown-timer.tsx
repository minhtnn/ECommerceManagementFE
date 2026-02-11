import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { handleStopPolling, handleUpdateTimeRemaining } from "@/redux/payment/payment-slice";

export const useCountdownTimer = () => {
  const dispatch = useDispatch();
  const { expiresAt, timeRemaining } = useSelector(
    (state: RootState) => state.payment
  );

  useEffect(() => {
    if (!expiresAt) return;

    const updateTimer = () => {
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((expiresAt - now) / 1000));
      
      dispatch(handleUpdateTimeRemaining(remaining));

      if (remaining === 0) {
        dispatch(handleStopPolling());
      }
    };

    // Update immediately
    updateTimer();

    // Update every second
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, dispatch]);

  // Format time as MM:SS
  const formatTime = (seconds: number | null): string => {
    if (seconds === null || seconds < 0) return "00:00";
    
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return {
    timeRemaining,
    formattedTime: formatTime(timeRemaining),
    isExpired: timeRemaining !== null && timeRemaining <= 0,
  };
};