export const VIEW_STEPS = {
  ABOUT: 'ABOUT',
  CONNECT: 'CONNECT',
  SELECT_NFT: 'SELECT_NFT',
  SELECT_SOCIAL_WEBSITES: 'SELECT_SOCIAL_WEBSITES',
  ERROR: 'ERROR',
  MORE_MODAL: 'MORE_MODAL',
  CONNECT_WALLET_MODAL: 'CONNECT_WALLET_MODAL',
};

export function spacing(multiple: number) {
  return `${multiple * 8}px`;
}

export function sliceWalletAddress(address: string) {
  if (!address) return '';

  const slicedAddress = address
    .slice(0, 6)
    .concat('...')
    .concat(address.slice(address.length - 4));

  return slicedAddress;
}
