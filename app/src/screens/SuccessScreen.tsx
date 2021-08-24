import React from 'react';
import { StyleSheet, View } from 'react-native';

import { spacing } from '../constants';
import PageContainer from '../views/PageContainer';
import Typography from '../views/Typography';

export default function SuccessScreen() {
  return (
    <PageContainer>
      <View style={styles.container}>
        <Typography style={styles.spaced} variant="header">
          WOOP WOOP YOU DID IT!
        </Typography>
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    textAlign: 'center',
  },
  spaced: {
    paddingTop: spacing(2),
  },
});
