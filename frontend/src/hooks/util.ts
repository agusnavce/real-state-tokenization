import { ShareWithOrder } from '../types';

export const getSharesForSelling = (swo: ShareWithOrder) => {
  if (swo === undefined || swo === null) return 0;
  const orderShares = swo.order ? swo.order.shareAmount : 0;
  return swo.shareAmount - orderShares;
};
