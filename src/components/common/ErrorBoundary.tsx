import React from "react";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallbackRender: (props: { error: Error }) => React.ReactNode;
}

export const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children, fallbackRender }) => {
  return (
    <ReactErrorBoundary fallbackRender={fallbackRender}>
      {children}
    </ReactErrorBoundary>
  );
};
