import * as React from "react";
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Start from "../screens/Start";
import { useColorScheme } from "react-native";
import { Icon, useTheme } from "@ui-kitten/components";
import Login from "../screens/Login";
import Added_contacts from "../screens/Added_contacts";
import Beneficiary_form from "../screens/Beneficiary_form";
import Camera from "../screens/Camera";

import Tokengen from "../screens/Tokengen";
import Project from "../screens/Project";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import OfflineMode from "../screens/OfflineMode";
import { FontAwesome } from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
const Stack = createNativeStackNavigator();
export default () => {
  const scheme = useColorScheme();
  const uitheme = useTheme();
  const MyTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: uitheme["color-basic-800"],
    },
  };

  // const Tab = createBottomTabNavigator();
  const Tab = createMaterialTopTabNavigator();

  const BottomApp = () => (
    <Tab.Navigator>
      <Tab.Screen name="Uploaded" component={Added_contacts} />
      <Tab.Screen name="Offline" component={OfflineMode} />
    </Tab.Navigator>
  );

  return (
    <NavigationContainer theme={scheme === "dark" ? MyTheme : DefaultTheme}>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen
          name="Start"
          options={{
            headerShown: false,
          }}
          component={Start}
        />
        <Stack.Screen
          name="Login"
          options={{
            headerShown: false,
          }}
          component={Login}
        />
        <Stack.Screen
          name="AddedContacts"
          options={{
            headerTitle: "Beneficiaries",
          }}
          component={BottomApp}
        />
        <Stack.Screen
          name="Beneficiary_form"
          options={{
            headerTitle: "Beneficiary form",
          }}
          component={Project}
        />
        <Stack.Screen
          name="Benform"
          options={{
            headerTitle: "Beneficiary form",
          }}
          component={Beneficiary_form}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
