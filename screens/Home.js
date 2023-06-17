import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  FlatList,
} from "react-native";
import React from "react";
import { Card, Layout, Text, Avatar } from "@ui-kitten/components";
import FeatureCard from "../components/FeatureCard";

export default (props) => {
  const cardData = [
    {
      iconName: "account",
      text: "BENEFICIARIES",
      value: 54,
      rate: 2.3,
      color: "#2F80ED",
      textColor: "#FFF",
      chipColor: "rgba(255, 255, 255, 0.4)",
      link: "AddedContacts",
    },
    {
      iconName: "rocket-launch",
      text: "PROJECTS",
      value: 16,
      rate: 2.3,
      color: "#FAF0EB",
      textColor: "#8F4724",
      chipColor: "rgba(241, 171, 136, 0.4)",
      link: "HomeScreen",
    },
    {
      iconName: "rocket-launch",
      text: "POINTS",
      value: 20,
      rate: 2.3,
      color: "#EFEBFA",
      textColor: "#4400FF",
      chipColor: "rgba(175, 147, 251, 1)",
      link: "HomeScreen",
    },
    {
      iconName: "account",
      text: "PEOPLE PER PROJECT",
      value: 7,
      rate: 2.3,
      color: "#02D3E0",
      textColor: "#FFF",
      chipColor: "rgba(255, 255, 255, 0.4)",
      link: "HomeScreen",
    },
  ];
  return (
    <Layout style={styles.container}>
      <View style={styles.profile}>
        <Avatar
          source={{
            uri: "https://images.unsplash.com/photo-1620794108219-aedbaded4eea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YmxhY2slMjB3b21hbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
          }}
          size="large"
          style={{ marginRight: 5 }}
        />
        <View>
          <Text style={styles.userName}>{global.user.name}</Text>
          <Text style={styles.userRole}>Enumerator</Text>
        </View>
      </View>
      <Card style={styles.welcomeCard}>
        <Image
          source={require("../assets/welcomeFarmer.png")}
          style={styles.welcomeCardImage}
        />
        <View style={{ marginLeft: 120, marginTop: 10 }}>
          <Text category="h3">Welcome</Text>
          <Text>Your system is ready 100% {"\n"} setup</Text>
        </View>
        <Text style={styles.browse}>Browse</Text>
      </Card>
      <Text category="h5" style={styles.category}>
        Main Features
      </Text>
      <View style={styles.featureCardsWrapper}>
        <FlatList
          data={cardData}
          numColumns={2}
          renderItem={({ item }) => {
            return <FeatureCard item={item} navigation={props.navigation} />;
          }}
        />
      </View>
      {/* <Text category="h5" style={styles.category}>
        Members per intervention
      </Text> */}
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight,
    flex: 1,
    padding: 10,
  },
  profile: {
    flexDirection: "row",
    alignItems: "center",
  },
  userName: {
    fontWeight: "bold",
    fontSize: 18,
  },
  userRole: {
    fontWeight: "400",
  },
  welcomeCard: {
    position: "relative",
    backgroundColor: "#E8F1FD",
    borderWidth: 0,
    marginVertical: 25,
    height: 140,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 0,
    borderRadius: 10,
  },
  welcomeCardImage: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    position: "absolute",
    left: 10,
    bottom: -1.5,
  },
  featureCardsWrapper: { width: "100%", marginHorizontal: "auto" },
  browse: {
    position: "absolute",
    right: 30,
    bottom: 20,
    color: "rgba(47, 128, 237, 1)",
    textDecorationLine: "underline",
  },
  category: {
    marginVertical: 4,
  },
});
