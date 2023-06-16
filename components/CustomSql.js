import { Input, Layout } from "@ui-kitten/components";
import * as SQLite from "expo-sqlite";
import * as React from "react";
import { StyleSheet } from "react-native";

export default (props) => {
	const db = SQLite.openDatabase("test.db");
	const [loading, setloading] = useState(false);

	const [names, setNames] = useState([]);
	const [currentName, setCurrentName] = useState();

	React.useEffect(() => {
		db.transaction((tx) => {
			tx.executeSql(
				"CREATE TABLE `project` (" +
					"`id` int(11) PRIMARY KEY AUTOINCREMENT," +
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
					");" +
					"CREATE TABLE `registry` (" +
					"`id` int(11) PRIMARY KEY AUTOINCREMENT," +
					"`project_id` varchar(255) DEFAULT NULL," +
					"`gdpr` varchar(255) DEFAULT NULL," +
					"`data_collection` varchar(255) DEFAULT NULL," +
					"`registration_date` date NOT NULL," +
					"`response_type` varchar(255) NOT NULL," +
					"`intervention_type` varchar(255) NOT NULL," +
					"`agency_type` varchar(255) NOT NULL," +
					"`beneficiary_name` varchar(255) NOT NULL," +
					"`beneficiary_age` int(11) NOT NULL," +
					"`beneficiary_email` varchar(255) NOT NULL," +
					"`beneficiary_gender` varchar(255) NOT NULL," +
					"`beneficiary_marital_status` varchar(255) NOT NULL," +
					"`beneficiary_phone` varchar(255) NOT NULL," +
					"`beneficiary_passport` varchar(255) NOT NULL," +
					"`alt_beneficiary_name` varchar(255) NOT NULL," +
					"`alt_beneficiary_age` int(11) NOT NULL," +
					"`alt_beneficiary_gender` varchar(255) NOT NULL," +
					"`alt_beneficiary_phone` varchar(255) NOT NULL," +
					"`beneficiary_soc_name` varchar(255) DEFAULT NULL," +
					"`beneficiary_soc_num` varchar(255) DEFAULT NULL," +
					"`land_size` varchar(255) NOT NULL," +
					"`land_use` varchar(255) NOT NULL," +
					"`state` varchar(255) NOT NULL," +
					"`county` varchar(255) DEFAULT NULL," +
					"`payam` varchar(255) NOT NULL," +
					"`boma` varchar(255) NOT NULL," +
					"`chiefdom` varchar(255) DEFAULT NULL," +
					"`gps_coordinates` varchar(255) DEFAULT NULL," +
					"`picture` varchar(255) DEFAULT NULL," +
					"`created_by` varchar(255) DEFAULT NULL," +
					"`date_created` datetime NOT NULL DEFAULT current_timestamp()" +
					");"
			);
		});
		db.transaction((tx) => {
			tx.executeSql(
				"select * from names",
				null,
				(txObj, result) => {
					setNames(result.rows._array);
				},
				(txObj, error) => {
					console.log(error);
				}
			);
		});
	}, []);
	return (
		<Layout style={styles.parent}>
			<Input
				value={currentName}
				onChangeText={(text) => {
					setCurrentName(text);
				}}
			></Input>
		</Layout>
	);
};
const styles = StyleSheet.create({
	parent: {
		flex: 1,
	},
});
