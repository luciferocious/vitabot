import React from "react";
import { View, Text, StyleSheet } from "react-native";

type Props = {
  name: string;
};

const UserInitialsAvatar = ({ name }: Props) => {
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  const backgroundColor = "#79DB90";

  return (
    <View style={[styles.avatar, { backgroundColor }]}>
      <Text style={styles.initials}>{initials}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  initials: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default UserInitialsAvatar;
