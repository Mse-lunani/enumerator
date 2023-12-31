import { Button, Layout, Text } from "@ui-kitten/components";
import * as React from "react";
import {
  Dimensions,
  View,
  ImageBackground,
  StyleSheet,
  Image,
} from "react-native";

export default (props) => {
  return (
    <>
      <View style={styles.container}>
        <ImageBackground
          source={require("../assets/Woman.jpg")}
          style={styles.coverImage}
          resizeMode="cover"
        >
          <View style={styles.darkness} />
          <Layout style={styles.parent}>
            <Text category="h1" style={styles.title}>
              Welcome to{"\n"} FAO
            </Text>
            <Text category="h5" style={styles.subtitle}>
              Food and Agriculture Organization of the United Nations
            </Text>
          </Layout>
          <Button
            onPress={() => {
              props.navigation.navigate("Login");
            }}
            style={styles.btn}
            status="info"
            size="large"
          >
            Get started
          </Button>
          <Text style={styles.footerText}>
            Already have an account?{" "}
            <Text
              style={styles.footerText}
              onPress={() => {
                props.navigation.navigate("Login");
              }}
            >
              Login
            </Text>
          </Text>
        </ImageBackground>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },

  coverImage: {
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
    position: "relative",
  },
  darkness: {
    backgroundColor: "rgba(0,0,0,0.5)",
    width: "100%",
    height: "100%",
    position: "absolute",
  },

  parent: {
    height: Dimensions.get("window").height * 0.65,
    paddingBottom: 50,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    backgroundColor: "transparent",
  },

  image: {
    height: 150,
    width: 150,
  },
  title: {
    marginVertical: 10,
    textAlign: "center",
    lineHeight: 40,
    letterSpacing: 1.15,
    fontWeight: "900",
    color: "#fff",
  },
  subtitle: {
    marginVertical: 10,
    lineHeight: 30,
    textAlign: "center",
    color: "#fff",
  },

  btn: {
    width: "80%",
    marginBottom: 8,
    marginTop: 20,
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 16,
    letterSpacing: 1.15,
    color: "#fff",
  },
});
