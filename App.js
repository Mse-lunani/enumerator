import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import Navigation from "./Navigation/Navigation";
import { useColorScheme } from "react-native";
import * as eva from "@eva-design/eva";
import * as SQLite from "expo-sqlite";
import * as React from "react";
import { EvaIconsPack } from "@ui-kitten/eva-icons";

export default function App() {
	const color = useColorScheme();
	const theme = color == "dark" ? eva.dark : eva.light;
	const bkcolor = color === "dark" ? "#000" : "#fff";
	const fkcolor = color === "dark" ? "#fff" : "#000";
	const db = SQLite.openDatabase("fao.db");
	const [loading, setloading] = React.useState(true);

	React.useEffect(() => {
		db.transaction(
			(tx) => {
				//tx.executeSql("DROP TABLE IF EXISTS registry");
				//tx.executeSql("DROP TABLE IF EXISTS seasons");
				//tx.executeSql("DROP TABLE IF EXISTS projects");
				tx.executeSql(
					"CREATE TABLE if not exists `registry`(" +
						"`id` INTEGER PRIMARY KEY AUTOINCREMENT," +
						"`des` TEXT" +
						"`date_created` datetime NOT NULL DEFAULT current_timestamp" +
						");",
					null,
					(txobj, result) => {},
					(txobj, error) => {
						console.log(error);
					}
				);
				tx.executeSql(
					"CREATE TABLE if not exists `seasons` (" +
						" `id` INTEGER PRIMARY KEY AUTOINCREMENT," +
						" `name` varchar(255) NOT NULL," +
						" `description` varchar(255) NOT NULL," +
						" `date_created` date NOT NULL DEFAULT current_timestamp" +
						");",
					null,
					(txobj, result) => {},
					(txobj, error) => {
						console.log(error);
					}
				);
				tx.executeSql(
					"CREATE TABLE if not exists `project`  (" +
						"`id` INTEGER PRIMARY KEY AUTOINCREMENT," +
						"`project_code` varchar(255) NOT NULL," +
						"`project_acronym` varchar(255) NOT NULL," +
						"`manager_id` varchar(255) NOT NULL," +
						"`project_title` varchar(255) NOT NULL," +
						"`voucher_value` double NOT NULL," +
						"`initiative` varchar(255) NOT NULL," +
						"`donor` varchar(255) NOT NULL," +
						"`season` varchar(255) NOT NULL," +
						"`start_date` date NOT NULL," +
						"`end_date` date NOT NULL" +
						");",
					null,
					(txobj, result) => {},
					(txobj, error) => {
						console.log(error);
					}
				);
			},
			null,
			() => {
				//console.log("All tables dropped successfully");
			}
		);

		setloading(false);
	}, []);

	if (loading) {
		return (
			<View
				style={{
					flex: 1,
					backgroundColor: bkcolor,
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<Text style={{ color: fkcolor }}>Loading</Text>
			</View>
		);
	}

	return (
		<>
			<IconRegistry icons={EvaIconsPack} />
			<ApplicationProvider {...eva} theme={theme}>
				<Navigation />
				<StatusBar style="auto" />
			</ApplicationProvider>
		</>
	);
}
