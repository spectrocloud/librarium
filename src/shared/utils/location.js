import querystring from "querystring";
import { useLocation } from "@reach/router";

export function useURLQuery() {
  const location = useLocation();
  return querystring.parse(location.search.replace(/^\?/g, ""));
}
