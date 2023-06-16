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
import LoadingMajor from "../components/LoadingMajor";
export default (props) => {
	const uitheme = useTheme();
	const color = useColorScheme();
	const [fetching, setFetch] = React.useState(true);
	const [loading, setloading] = React.useState(false);
	const [people, setpeople] = React.useState([]);
	const [erroraray, seterrorarray] = React.useState([]);
	const bordercolor =
		color == "dark" ? uitheme["color-basic-700"] : uitheme["color-basic-400"];
	const db = SQLite.openDatabase("fao.db");
	React.useEffect(() => {
		Fetch();
	}, []);
	React.useEffect(() => {
		if (erroraray.length > 0) {
			console.log(erroraray);
			alert(
				"some errors occured while attempting to insert records, try again later"
			);
		}
	}, [erroraray]);

	const uploadbeneficiaries = async () => {
		setloading(true);
		const data = new FormData();
		data.append("token", generateToken());
		let uri, options, register_id;
		const url = URL + "api_registry.php";
		const peo = [];
		try {
			for (const element of people) {
				uri = element.picture;
				register_id = element.register_id;

				delete element["picture"];
				delete element["register_id"];
				element.gdpr = element.gdpr ? "yes" : "no";
				element.data_collection = element.data_collection ? "yes" : "no";
				for (const [key, value] of Object.entries(element)) {
					data.append(key, value);
				}
				if (uri) {
					data.append("picture", {
						uri: uri,
						type: "image/jpeg",
						name: "photo.jpg",
					});
				}

				options = { method: "post", body: data };
				const res = await fetch(url, options);
				const result = await res.json();
				console.log(register_id);
				if (result.status) {
					peo.push(register_id);
				}
			}

			if (peo.length === people.length) {
				await db.transaction(async (tx) => {
					try {
						await tx.executeSql(
							"delete from registry",
							null,
							(_, res) => {
								console.log(res);
							},
							(_, error) => {
								console.log(error);
							}
						);
						Fetch();
						setloading(false);
					} catch (error) {
						console.log(error);
					}
				});
			} else {
				db.transaction((tx) => {
					peo.forEach(async (element) => {
						await tx.executeSql(
							"delete from registry where id = '" + element + "'",
							null,
							(_, res) => {
								console.log(res);
							},
							(_, error) => {
								seterrorarray([...erroraray, error]);
							}
						);
					});
				});
			}
		} catch (e) {
			seterrorarray([...erroraray, e]);
			setloading(false);
			Fetch();
		}
	};

	const Fetch = () => {
		setFetch(true);
		db.transaction((tx) => {
			tx.executeSql("select * from registry", null, (_, res) => {
				let obj = res.rows._array;
				let data = [];
				let arr;
				console.log(obj);
				obj.forEach((element) => {
					arr = element.des;
					arr = JSON.parse(arr);
					arr.register_id = element.id;
					data.push(arr);
				});
				setpeople(data);
				setFetch(false);
			});
		});
	};

	const Contact = ({ item }) => {
		const firstLetter = item.beneficiary_name.charAt(0).toUpperCase();
		return (
			<View style={{ ...styles.row, borderBottomColor: bordercolor }}>
				<LinearGradient
					style={styles.cirlce}
					colors={[uitheme["color-info-500"], uitheme["color-info-700"]]}
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
		<>
			{loading ? (
				<LoadingMajor />
			) : (
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
						onPress={uploadbeneficiaries}
						style={styles.fcirlce}
					>
						<LinearGradient
							style={styles.fcirlce2}
							colors={[
								uitheme["color-success-500"],
								uitheme["color-success-700"],
							]}
						>
							<Text style={{ color: "white" }}>Upload beneficiaries</Text>
						</LinearGradient>
					</TouchableOpacity>
				</Layout>
			)}
		</>
	);
};

const styles = StyleSheet.create({
	parent: {
		flex: 1,
	},
	row: {
		margin: 10,
		flexDirection: "row",
		paddingBottom: 5,
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
		width: 200,
		borderRadius: 25,
		alignItems: "center",
		justifyContent: "center",
	},
	text: {
		marginLeft: 10,
		marginVertical: 2,
	},
});
