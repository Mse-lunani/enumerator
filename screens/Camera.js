import { Camera, CameraType } from "expo-camera";
import * as React from "react";
import {
	Dimensions,
	Image,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import { URL } from "@env";
import generateToken from "./test";
import { Button } from "@ui-kitten/components";

export default function App() {
	const [type, setType] = React.useState(CameraType.back);
	const [image, setImage] = React.useState(null);
	const [b64, setb64] = React.useState(null);
	const [permission, requestPermission] = React.useState(false);
	const ref = React.useRef(null);

	React.useEffect(() => {
		(async () => {
			MediaLibrary.requestPermissionsAsync();
			const camera = await Camera.requestCameraPermissionsAsync();

			requestPermission(camera.status === "granted");
		})();
	}, []);

	function toggleCameraType() {
		setType((current) =>
			current === CameraType.back ? CameraType.front : CameraType.back
		);
	}

	const Save = () => {};

	const Upload = () => {
		const data = new FormData();
		data.append("token", generateToken());
		uri = image;
		data.append("poster", {
			uri: uri,
			name: "photo.jpg",
			type: "image/jpeg",
		});
		console.log(data);

		const url = URL + "api_image.php";
		const options = {
			method: "POST",
			body: data,
		};
		console.log(url);
		fetch(url, options)
			.then((res) => res.text())
			.then((res) => {
				console.log(res);
			})
			.catch((e) => {
				console.log(e);
			});
	};

	if (requestPermission === false) {
		return (
			<View>
				<Text>Give access</Text>
			</View>
		);
	}

	const TakePic = async () => {
		if (ref) {
			try {
				const data = await ref.current.takePictureAsync({
					quality: 0.3,
					base64: true,
				});
				console.log(data);
				setImage(data.uri);
				setb64(data.base64);
				//Upload(data.uri);
			} catch (error) {
				console.log(error);
			}
		}
	};

	return (
		<View style={styles.container}>
			{image ? (
				<View style={styles.camera}>
					<Image
						source={{ uri: image }}
						style={{
							height: Dimensions.get("window").height / 2,
							width: Dimensions.get("window").width / 2,
						}}
					/>
					<Button onPress={Upload}>Upload image</Button>
					<Button
						onPress={() => {
							setImage(null);
						}}
					>
						Retake
					</Button>
				</View>
			) : (
				<Camera style={styles.camera} type={type} ref={ref}>
					<View style={styles.buttonContainer}>
						<TouchableOpacity style={styles.button} onPress={TakePic}>
							<Text style={styles.text}>Take picture</Text>
						</TouchableOpacity>
					</View>
				</Camera>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
	},
	camera: {
		flex: 1,
	},
	buttonContainer: {
		flex: 1,
		flexDirection: "row",
		backgroundColor: "transparent",
		margin: 64,
	},
	button: {
		flex: 1,
		alignSelf: "flex-end",
		alignItems: "center",
	},
	text: {
		fontSize: 24,
		fontWeight: "bold",
		color: "white",
	},
});
