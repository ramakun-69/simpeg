import React from "react";
import { Icon } from "@iconify/react"; // atau spinner favoritmu

export default function DeleteButton({ type,isLoading, children, ...props }) {
    return (
       
        <button
            type={type}
            className="w-32-px h-32-px me-8 bg-danger-focus text-danger-main rounded-circle d-inline-flex align-items-center justify-content-center"
            disabled={isLoading}
            {...props}
        >
            {isLoading ? (
                <>
                    <Icon icon="line-md:loading-loop" className=" me-2" width="20" height="20" />
                    Loading...
                </>
            ) : (
                <>
                    <Icon icon="mingcute:delete-2-line" className="me-2 " width="20" height="20" />
                    {children}
                </>
            )}
        </button>
    );
}
