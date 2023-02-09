export const MOBILE_BREAK_POINT = 900;

export const SECOND = 1;
export const MINUTES = SECOND * 60;
export const HOUR = MINUTES * 60;
export const DAY = HOUR * 24;
export const MONTH = DAY * 30;
export const YEAR = DAY * 365;

export const START_TIME = 1660140000 * 1000 + 86400000*2;

export const truncAddress = (addr) => {
  if (addr && addr.length === 42) {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  }
  return "";
};

// check if a timestamp is from the past, need to be in millisecond
export const checkTime = (ts) => new Date().getTime() > ts;

export const PLAN_TYPE = {
  SIMPLE: 0,
  COMPOUND: 1,
};

export const FETCH_STATE = {
  INIT: 0,
  SUCCESS: 1,
  FAILURE: 2,
};
// reducer for general contract calls including states: loading, error, data
export const readContractReducer = (state, action) => {
  switch (action.type) {
    case FETCH_STATE.INIT:
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case FETCH_STATE.SUCCESS:
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case FETCH_STATE.FAILURE:
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    default:
      throw new Error("Invalid general contract action");
  }
};

export const MIN_DEPOSIT = 0.05;
export const toHex = (decimalNum) => `0x${decimalNum.toString(16)}`;

export const simpleMonth = (m) =>{
  if(m === 0) return 'Jan';
  if(m === 1) return 'Feb';
  if(m === 2) return 'Mar';
  if(m === 3) return 'Apr';
  if(m === 4) return 'May';
  if(m === 5) return 'Jun';
  if(m === 6) return 'Jul';
  if(m === 7) return 'Aug';
  if(m === 8) return 'Sep';
  if(m === 9) return 'Otc';
  if(m === 10) return 'Nov';
  if(m === 11) return 'Dec';
}