export const VIEW_STEPS = {
  // Screens
  ABOUT: 'ABOUT',
  CONNECT: 'CONNECT',
  SELECT_SOCIALS_MODAL: 'SELECT_SOCIALS_MODAL',
  ERROR: 'ERROR',

  // Modals
  CONNECT_WALLET_MODAL: 'CONNECT_WALLET_MODAL',
  SUCCESS_SCREEN: 'SUCCESS_SCREEN',
  DONATION_MODAL: 'DONATION_MODAL',
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
