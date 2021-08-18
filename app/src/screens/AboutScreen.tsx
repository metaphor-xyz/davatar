import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { spacing } from "../constants";

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.spaced}>
        Tastes and trends change with every season.
      </Text>
      <Text style={styles.spaced}>
        Our closets are filled with rockin' classics and new purchases bring
        trendy new looks to try.
      </Text>
      <Text style={styles.spaced}>
        Every NFT purchase brings excitement and opportunity to update your
        profile pic to keep it fresh 😎
      </Text>
      <Text style={styles.spaced}>
        Yet, swapping prof pics requires bank. Gas fee every time we update?
        It's like paying someone money every time you change your shoes.
      </Text>
      <Text style={styles.spaced}>
        NFTs are expensive enough, we shouldn't need to pay every time we want a
        fresh new look or throw on an old favorite.
      </Text>
      <Text style={styles.spaced}>Enter DAOvatars.</Text>
      <Text style={styles.spaced}>
        DAOvatars uses IPFS to update your ens profile photo with one of your
        NFTs. Pay for gas once then swamp and you can always come back to swap
        out for new trendy NFTs or an OG look you rocked in the past.
      </Text>
      <Text style={styles.spaced}>Get in now then never pay again.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  spaced: {
    paddingTop: spacing(2),
  },
});
