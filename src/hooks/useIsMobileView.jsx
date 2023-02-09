import { MOBILE_BREAK_POINT } from "../utils/utils";
import { useWindowDimensions } from "./useWindowDimensions";

export const useIsMobileView = () => {
  const { width } = useWindowDimensions();
  return width <= MOBILE_BREAK_POINT;
};
