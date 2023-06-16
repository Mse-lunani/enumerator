import { View, StyleSheet, SafeAreaView, StatusBar, Image } from "react-native";
import React from "react";
import { Card, Layout, Text, Avatar } from "@ui-kitten/components";

export default (props) => {
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
          <Text style={styles.userName}>Jane Doe</Text>
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
    color: "#253141",
  },
  userRole: {
    fontWeight: "400",
    color: "#253141",
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
    bottom: 0,
  },
  browse: {
    position: "absolute",
    right: 30,
    bottom: 20,
    color: "blue",
    textDecorationLine: "underline",
  },
});
