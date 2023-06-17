import {
  Button,
  Input,
  Layout,
  Spinner,
  Text,
  useTheme,
} from "@ui-kitten/components";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { URL } from "@env";
import generateToken from "./test";
import * as React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  TextInput,
  useColorScheme,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { View } from "react-native";
import Loading from "../components/Loading";
import * as SQLite from "expo-sqlite";
import Fetching from "../components/Fetching";

export default (props) => {
  const db = SQLite.openDatabase("fao.db");
  const uitheme = useTheme();
  const [email, setemail] = React.useState();
  const [password, setpassword] = React.useState();
  const [loading, setloading] = React.useState();
  const [loaddata, setloadata] = React.useState(true);
  const [textEntry, setTextEntry] = React.useState(true);

  React.useEffect(() => {
    console.log(URL);
    (async () => {
      let result = await SecureStore.getItemAsync("user");
      if (result) {
        let data = JSON.parse(result);
        global.user = data;
        db.transaction((tx) => {
          tx.executeSql(
            "select * from project",
            null,
            (_, res) => {
              data = res.rows._array;
              global.projects = data;
            },
            (_, error) => {
              console.log(error);
            }
          );
          tx.executeSql(
            "select * from seasons",
            null,
            (_, res) => {
              data = res.rows._array;
              global.seasons = data;
            },
            (_, error) => {
              console.log(error);
            }
          );
        });
        props.navigation.replace("HomeScreen");
      } else {
        setloadata(false);
      }
    })();
  }, []);

  const scheme = useColorScheme();
  let image =
    scheme == "dark"
      ? require("../assets/fao.png")
      : require("../assets/logo.png");
  const Login = () => {
    setloading(true);
    const data = new FormData();
    data.append("token", generateToken());
    data.append("email", email);
    data.append("password", password);
    const options = {
      method: "post",
      body: data,
    };
    const url = URL + "api_login.php";

    fetch(url, options)
      .then((res) => res.json())
      .then(async (res) => {
        console.log(res);
        if (res.status) {
          let user = JSON.stringify(res.data);
          let projects = res.projects;
          let seasons = res.seasons;
          await SecureStore.setItemAsync("user", user);

          db.transaction((tx) => {
            tx.executeSql(`DELETE FROM seasons`);
            tx.executeSql(`DELETE FROM projects`);
          });

          projects.forEach((element) => {
            db.transaction((tx) => {
              tx.executeSql(
                "INSERT INTO `project` (`project_code`, `project_acronym`, `manager_id`, `project_title`, `voucher_value`, `initiative`, `donor`, `season`, `start_date`, `end_date`) VALUES( '" +
                  element.project_code +
                  "', '" +
                  element.project_acronym +
                  "', '" +
                  element.manager_id +
                  "', '" +
                  element.project_title +
                  "', '" +
                  element.voucher_value +
                  "', '" +
                  element.initiative +
                  "', '" +
                  element.donor +
                  "', '" +
                  element.season +
                  "', '" +
                  element.start_date +
                  "', '" +
                  element.end_date +
                  "')",
                null,
                (txobj, result) => {},
                (txobj, error) => {
                  console.log(error);
                }
              );
            });
          });
          seasons.forEach((element) => {
            db.transaction((tx) => {
              tx.executeSql(
                "INSERT INTO `seasons` (`name`,`description`) VALUES(?,?)",
                [element.name, element.description],
                (txobj, result) => {
                  console.log(result);
                },
                (txobj, error) => {
                  console.log(error);
                }
              );
            });
          });

          global.user = res.data;
          global.projects = res.projects;
          global.seasons = res.seasons;
          props.navigation.replace("HomeScreen");
        } else {
          alert("it seems the email or password is wrong");
        }
        setloading(false);
      })
      .catch((e) => {
        console.log(e);
        setloading(false);
      });
  };
  return (
    <>
      {loaddata ? (
        <Fetching />
      ) : (
        <Layout style={styles.parent}>
          <Image source={image} style={styles.image} />
          <View>
            <Text category="h2" style={styles.title}>
              Welcome Back!
            </Text>
            <Text style={{ color: "grey" }}>
              Use credentials to access your account
            </Text>
          </View>

          <View
            style={{
              width: "100%",
              paddingHorizontal: 30,
            }}
          >
            <View>
              <TextInput
                style={styles.input}
                onChangeText={(text) => setemail(text)}
                placeholder="Enter Username"
                placeholderTextColor="#0495EE"
              />
              <FontAwesome5
                name="user"
                color="#0495EE"
                size={17.5}
                style={{ position: "absolute", top: 20, left: 10 }}
              />
            </View>
            <View>
              <TextInput
                style={styles.input}
                secureTextEntry={textEntry}
                onChangeText={(text) => setpassword(text)}
                placeholder="Enter Password"
                placeholderTextColor="#0495EE"
              />
              <FontAwesome5
                name="lock"
                color="#0495EE"
                size={17.5}
                style={{ position: "absolute", top: 20, left: 10 }}
              />
              <FontAwesome5
                name={textEntry ? "eye-slash" : "eye"}
                onPress={() => setTextEntry((val) => (val = !val))}
                color="black"
                size={17.5}
                style={{ position: "absolute", top: 20, right: 10 }}
              />
            </View>
          </View>
          {loading ? (
            <Loading />
          ) : (
            <Button onPress={Login} status="info" style={styles.btn}>
              Login
            </Button>
          )}
        </Layout>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    justifyContent: "center",
    gap: 40,
    alignItems: "center",
  },

  image: {
    height: 150,
    width: 150,
  },
  title: {
    margin: 10,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 35,
    marginVertical: 0,
  },
  input: {
    position: "relative",
    borderColor: "#0495EE",
    borderWidth: 1.5,
    paddingHorizontal: 35,
    paddingVertical: 15,
    fontSize: 16,
    borderRadius: 7,
    marginBottom: 25,
  },
  btn: {
    width: "80%",
    margin: 10,
    paddingVertical: 20,
  },
  loadingparent: {
    alignItems: "center",
    justifyContent: "center",
  },
});
