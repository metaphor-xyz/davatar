import { useNavigation } from '@react-navigation/native';
import React from 'react';

import Button from './Button';
import CustomModal from './CustomModal';

export default function MoreModal() {
  const navigation = useNavigation();

  return (
    <CustomModal title="More Menu">
      <Button title="Close" onPress={navigation.goBack} />
    </CustomModal>
  );
}
