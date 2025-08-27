import { useEffect } from "react";

interface UseAutoCheckoutProps {
  clockedIn: boolean;
  isCheckOut: boolean;
  elapsedSeconds: number;
  onBreak: boolean;
  SHIFT_SECONDS: number;
  handleBreakOut: () => Promise<void>;
  handleCheckOut: () => Promise<void>;
}

export const useAutoCheckout = ({
  clockedIn,
  isCheckOut,
  elapsedSeconds,
  onBreak,
  SHIFT_SECONDS,
  handleBreakOut,
  handleCheckOut,
}: UseAutoCheckoutProps) => {
  useEffect(() => {
    if (clockedIn && !isCheckOut && elapsedSeconds >= SHIFT_SECONDS) {
      (async () => {
        console.log("⏳ Auto-checkout triggered after 9 hours");

        if (onBreak) {
          console.log("☕ Auto break-out before checkout");
          await handleBreakOut();
        }

        await handleCheckOut();
      })();
    }
  }, [elapsedSeconds, clockedIn, isCheckOut, onBreak, SHIFT_SECONDS, handleBreakOut, handleCheckOut]);
};