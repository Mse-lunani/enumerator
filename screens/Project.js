import {
	Button,
	Card,
	IndexPath,
	Layout,
	Select,
	SelectItem,
	Text,
} from "@ui-kitten/components";
import * as React from "react";
import { Dimensions, StyleSheet } from "react-native";
import Fetching from "../components/Fetching";
import generateToken from "./test";
import { URL } from "@env";

export default (props) => {
	const [projects, setprojects] = React.useState(global.projects);
	const [fetching, setfetch] = React.useState(false);
	const [selectedIndex, setSelectedIndex] = React.useState(new IndexPath(0));

	const Continue = () => {
		let project = projects[selectedIndex.row];
		console.log(project);
		props.navigation.navigate("Benform", {
			project: project,
		});
		console.log(global.seasons);
	};

	return (
		<>
			{fetching ? (
				<Fetching />
			) : (
				<Layout style={styles.parent}>
					<Card
						style={styles.card}
						header={() => {
							return (
								<Text status="info" category="h5" style={styles.title}>
									Choose a project
								</Text>
							);
						}}
					>
						<Select
							selectedIndex={selectedIndex}
							label="Type of response"
							value={projects[selectedIndex.row]["project_acronym"]}
							onSelect={(index) => setSelectedIndex(index)}
						>
							{global.projects.map((item) => (
								<SelectItem key={item.id} title={item.project_acronym} />
							))}
						</Select>
					</Card>
					<Button onPress={Continue} style={styles.button}>
						Continue
					</Button>
				</Layout>
			)}
		</>
	);
};
const styles = StyleSheet.create({
	parent: {
		flex: 1,
	},
	card: {
		margin: 10,
	},
	button: {
		alignSelf: "flex-end",
		width: Dimensions.get("window").width / 2,
		margin: 10,
	},
	title: {
		margin: 10,
	},
});
