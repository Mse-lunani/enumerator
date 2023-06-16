import { View, StyleSheet } from "react-native";
import { Text } from "@ui-kitten/components";
import React from "react";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";

export default (props) => {
  const { item } = props;
  return (
    <View
      style={{
        backgroundColor: item.color,
        ...styles.displayCard,
      }}
    >
      <MaterialCommunityIcons
        name={item.iconName}
        size={20}
        color={item.textColor}
      />
      <Text style={{ color: item.textColor }}>{item.text}</Text>
      <Text category="h3" style={{ color: item.textColor }}>
        {item.value}
      </Text>
      <View
        style={{
          backgroundColor: item.chipColor,
          ...styles.chip,
        }}
      >
        <Text appearance="alternative" style={{ textAlign: "center" }}>
          +{item.rate}%
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  displayCard: {
    flex: 1,
    maxWidth: "50%",
    margin: 5,
    height: 150,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    justifyContent: "space-around",
  },
  chip: { padding: 2, borderRadius: 6, width: 45 },
});
