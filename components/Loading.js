import { Spinner } from "@ui-kitten/components";
import * as React from "react";
import { StyleSheet, View } from "react-native";

export default (props) => {
	return (
		<View style={styles.parent}>
			<Spinner />
		</View>
	);
};
const styles = StyleSheet.create({
	parent: {
		justifyContent: "center",
		alignItems: "center",
	},
});
