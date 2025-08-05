"use client";

import { toast } from "sonner";

export const showToast = (message:  string) => {
    toast(
        message,
        {
            actionButtonStyle: {
                backgroundColor: "#fff",
                color: "#141D38",
                fontSize: "14px"
            },
            style: {
                backgroundColor: "#141D38",
                fontFamily: "Inter",
                fontSize: "14px",
                color: "#fff"
            },
            action: {
                label: 'Close',
                onClick(event) {
                },
            },
        }
    )
}