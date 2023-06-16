import {
  Button,
  Input,
  Layout,
  Spinner,
  Text,
  useTheme,
} from "@ui-kitten/components";
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
        props.navigation.replace("AddedContacts");
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
          props.navigation.replace("AddedContacts");
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
          <Text category="h4" style={styles.title}>
            Login to your account
          </Text>

          <Input
            style={{ margin: 10 }}
            onChangeText={(text) => setemail(text)}
            placeholder="Email"
          />
          <Input
            style={{ margin: 10 }}
            secureTextEntry
            onChangeText={(text) => setpassword(text)}
            placeholder="Password"
          />
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
    alignItems: "center",
  },

  image: {
    height: 150,
    width: 150,
    marginVertical: 20,
  },
  title: {
    margin: 10,
  },
  btn: {
    width: "80%",
    margin: 10,
  },
  loadingparent: {
    alignItems: "center",
    justifyContent: "center",
  },
});