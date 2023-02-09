// import React from 'react';
import { Interface } from "@ethersproject/abi";
// import { useMulticallContract } from '../hooks/useContract';

const PAGE = 100;
export const multicallHelper = async (multicallContract, abi, calls) => {
  const multi = await multicallContract;
  const itf = new Interface(abi);
  let res = [];
  if (calls.length > PAGE) {
    const pageNumber = Math.ceil(calls.length / PAGE);
    const promises = [];
    // create promise
    // eslint-disable-next-line no-restricted-syntax
    for (const i of Array(pageNumber).keys()) {
      const newCalls = calls.slice(i * PAGE, PAGE * (i + 1));
      const calldata = newCalls.map((call) => [
        call[0].toLowerCase(),
        itf.encodeFunctionData(call[1], call[2]),
      ]);
      promises.push(multi.aggregate(calldata));
    }
    // wait for promise
    const responses = await Promise.all(promises);
    // decode response
    // eslint-disable-next-line no-restricted-syntax
    for (const i of Array(pageNumber).keys()) {
      const newCalls = calls.slice(i * PAGE, PAGE * (i + 1));
      const { returnData } = responses[i];
      res = res.concat(
        returnData.map((call, index) =>
          itf.decodeFunctionResult(newCalls[index][1], call)
        )
      );
    }
  } else {
    const calldata = calls.map((call) => [
      call[0].toLowerCase(),
      itf.encodeFunctionData(call[1], call[2]),
    ]);
    const { returnData } = await multi.aggregate(calldata);
    res = returnData.map((call, i) =>
      itf.decodeFunctionResult(calls[i][1], call)
    );
  }
  return res;
};

export default multicallHelper;
