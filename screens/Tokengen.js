import { Layout, Text } from "@ui-kitten/components";
import * as React from "react";
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import generateToken from "./test";

const YourComponent = (props) => {
	const token = generateToken();
	console.log(token);

	return (
		<Layout style={styles.parent}>
			<Text>{token}</Text>
		</Layout>
	);
};

const styles = StyleSheet.create({
	parent: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});

export default YourComponent;
