import JWT from "expo-jwt";
import { API_KEY } from "@env";

const generateToken = () => {
	const key = "" + API_KEY;
	const expirationTime = Math.floor(Date.now() / 1000) + 60;
	const token = JWT.encode({ app: "fao", exp: expirationTime }, key, {
		algorithm: "HS256",
	});

	return token;
};

export default generateToken;
