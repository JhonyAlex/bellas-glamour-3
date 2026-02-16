"use client";

import { motion } from "framer-motion";
import { Crown, Loader2 } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SubscriptionButtonProps extends ButtonProps {
  price?: number;
  isLoading?: boolean;
  isSubscribed?: boolean;
  showPrice?: boolean;
}

export function SubscriptionButton({
  price,
  isLoading = false,
  isSubscribed = false,
  showPrice = true,
  className,
  children,
  disabled,
  ...props
}: SubscriptionButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
    >
      <Button
        className={cn(
          "relative overflow-hidden font-semibold transition-all duration-300",
          isSubscribed
            ? "bg-green-600 text-white hover:bg-green-700"
            : "bg-primary text-primary-foreground hover:bg-primary/90",
          "btn-shine",
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {/* Animated shine effect */}
        <span className="absolute inset-0 overflow-hidden">
          <span
            className="absolute inset-0 -translate-x-full animate-[shine_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"
          />
        </span>

        <span className="relative flex items-center gap-2">
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : isSubscribed ? (
            <Crown className="w-4 h-4" />
          ) : (
            <Crown className="w-4 h-4" />
          )}
          {children || (
            <>
              {isLoading
                ? "Processing..."
                : isSubscribed
                ? "Subscribed"
                : showPrice && price !== undefined
                ? `Subscribe $${price.toFixed(2)}`
                : "Subscribe"}
            </>
          )}
        </span>
      </Button>
    </motion.div>
  );
}
