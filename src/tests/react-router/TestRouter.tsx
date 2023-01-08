import * as React from "react";
import RouterContext from "../../lib/react-router/internal/RouterContext";

type Props = {
  url: string;
  children: React.ReactNode;
  goto?: (url: string, opts?: { replaceState?: boolean }) => void;
};

const TestRouter: React.FC<Props> = ({ children, url, goto = () => {} }) => {
  return (
    <RouterContext.Provider
      value={{
        url: new URL(url, "http://localhost/"),
        params: {},
        goto,
      }}
    >
      {children}
    </RouterContext.Provider>
  );
};
export default TestRouter;
