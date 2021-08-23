import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { spacing } from '../constants';
import Button from '../views/Button';
import PageContainer from '../views/PageContainer';
import Typography from '../views/Typography';

export default function ErrorScreen() {
  const navigator = useNavigation();
  return (
    <PageContainer>
      <View style={styles.container}>
        <Typography style={styles.headerText}>Oops this is awkward 😅</Typography>

        <Typography style={styles.spaced}>Looks like something went wrong. Sorry about that.</Typography>
        <View style={styles.spaced}>
          <Button title="Take me back" onPress={navigator.goBack} />
        </View>
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  headerText: {
    fontSize: 48,
    fontWeight: '600',
    paddingTop: spacing(2),
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  spaced: {
    paddingTop: spacing(2),
  },
});
