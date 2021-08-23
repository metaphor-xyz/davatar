import { Dimensions } from 'react-native';

export default function useIsMoWeb(): boolean {
  const { width } = Dimensions.get('window');
  return width <= 600;
}
