import React from "react";

export const Block = ({ isLoading, children }) => (
  <React.Fragment>{isLoading ? "loading..." : children}</React.Fragment>
);
