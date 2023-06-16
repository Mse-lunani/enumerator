import { Layout, Spinner, Text } from "@ui-kitten/components";
import * as React from "react";
import { StyleSheet, View } from "react-native";

export default (props) => {
	return (
		<Layout style={styles.parent}>
			<Text>Fetching data...</Text>
		</Layout>
	);
};
const styles = StyleSheet.create({
	parent: {
		justifyContent: "center",
		alignItems: "center",
		flex: 1,
	},
});
