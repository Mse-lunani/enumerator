import { FontAwesome5 } from "@expo/vector-icons";
import { Layout, List, Text, useTheme } from "@ui-kitten/components";
import { LinearGradient } from "expo-linear-gradient";
import * as React from "react";
import {
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { View } from "react-native";
import generateToken from "./test";
import Fetching from "../components/Fetching";
import { URL } from "@env";
import * as SQLite from "expo-sqlite";
import Noitems from "../components/Noitems";
export default (props) => {
  const uitheme = useTheme();
  const color = useColorScheme();
  const [fetching, setFetch] = React.useState(true);
  const [people, setpeople] = React.useState([]);
  const bordercolor =
    color == "dark" ? uitheme["color-basic-700"] : uitheme["color-basic-400"];
  const db = SQLite.openDatabase("fao.db");
  React.useEffect(() => {
    Fetch();
    db.transaction((tx) => {
      tx.executeSql(
        "select * from seasons",
        null,
        (txobj, result) => {
          console.log(result.rows._array);
        },
        (txobj, error) => {
          console.log(error);
        }
      );
    });
  }, []);

  const Fetch = () => {
    setFetch(true);

    const data = new FormData();
    data.append("token", generateToken());
    data.append("id", global.user.id);
    const options = {
      method: "POST",
      body: data,
    };
    const url = URL + "api_data.php";
    console.log(url);
    fetch(url, options)
      .then((res) => res.json())
      .then((res) => {
        //console.log(res);
        setpeople(res);
        setFetch(false);
      })

      .catch((e) => {
        console.log(e);
        setFetch(false);
      });
  };

  const Contact = ({ item }) => {
    const firstLetter = item.beneficiary_name.charAt(0).toUpperCase();
    return (
      <View style={{ ...styles.row, borderBottomColor: bordercolor }}>
        <LinearGradient
          style={styles.cirlce}
          colors={[uitheme["color-info-500"], uitheme["color-info-500"]]}
        >
          <Text category="h6" style={{ color: "white" }}>
            {firstLetter}
          </Text>
        </LinearGradient>
        <View>
          <Text category="h6" style={styles.text}>
            {item.beneficiary_name}
          </Text>
          <Text appearance="hint" style={styles.text}>
            {item.beneficiary_phone}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <Layout style={styles.parent}>
      {fetching ? (
        <Fetching />
      ) : (
        <>
          {people.length > 0 ? (
            <List
              refreshControl={
                <RefreshControl refreshing={fetching} onRefresh={Fetch} />
              }
              data={people}
              renderItem={Contact}
            />
          ) : (
            <Noitems onPress={Fetch} />
          )}
        </>
      )}
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate("Beneficiary_form");
        }}
        style={styles.fcirlce}
      >
        <LinearGradient
          style={styles.fcirlce2}
          colors={[uitheme["color-info-500"], uitheme["color-info-500"]]}
        >
          <FontAwesome5
            onPress={() => {
              props.navigation.navigate("Beneficiary_form");
            }}
            name="plus"
            color="white"
            size={20}
          />
        </LinearGradient>
      </TouchableOpacity>
    </Layout>
  );
};
const styles = StyleSheet.create({
  parent: {
    flex: 1,
  },
  row: {
    paddingHorizontal: 10,
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  cirlce: {
    height: 50,
    width: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  fcirlce: {
    position: "absolute",
    bottom: 30,
    right: 10,
    backgroundColor: "transparent",
  },
  fcirlce2: {
    height: 50,
    width: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    marginLeft: 10,
    marginVertical: 2,
  },
});
