import { Spinner } from "@ui-kitten/components";
import * as React from "react";
import { Text } from "react-native";
import { Dimensions } from "react-native";
import { StyleSheet, View } from "react-native";

export default (props) => {
	return (
		<View style={styles.parent}>
			<Spinner />
			<Text style={{ margin: 10 }}>Please wait for the process to finish</Text>
		</View>
	);
};
const styles = StyleSheet.create({
	parent: {
		justifyContent: "center",
		alignItems: "center",
		flex: 1,
	},
});
