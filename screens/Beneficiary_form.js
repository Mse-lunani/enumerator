import {
  Button,
  Card,
  Datepicker,
  IndexPath,
  Input,
  Layout,
  Select,
  SelectItem,
  Text,
} from "@ui-kitten/components";
import * as React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import CheckBox from "expo-checkbox";
import { Dimensions } from "react-native";
import { default as Locations } from "../location.json";
import { FontAwesome5 } from "@expo/vector-icons";
import { useColorScheme } from "react-native";
import * as MediaLibrary from "expo-media-library";
import { Camera, CameraType } from "expo-camera";
import * as SQLite from "expo-sqlite";
import Loading from "../components/Loading";

export default (props) => {
  const project = props.route.params.project;
  const [permission, requestPermission] = React.useState(false);
  const [type, setType] = React.useState(CameraType.back);
  const ref = React.useRef(null);
  const [showcam, setshowcam] = React.useState(false);
  const seasons = global.seasons;
  const theme = useColorScheme();
  const db = SQLite.openDatabase("fao.db");
  React.useEffect(() => {
    (async () => {
      MediaLibrary.requestPermissionsAsync();
      const camera = await Camera.requestCameraPermissionsAsync();

      requestPermission(camera.status === "granted");
    })();
  }, []);
  const TakePic = async () => {
    if (ref) {
      try {
        const data = await ref.current.takePictureAsync({
          quality: 0.3,
          base64: true,
        });
        const asset = await MediaLibrary.createAssetAsync(data.uri);
        MediaLibrary.createAlbumAsync("FAO", asset)
          .then(async (album) => {
            const albumAssets = await MediaLibrary.getAssetsAsync({
              album,
              sortBy: MediaLibrary.SortBy.creationTime,
            });
            let arr = albumAssets.assets;
            lastElement = arr[0];
            const savedImagePath = lastElement.uri;

            setpicture(savedImagePath);
            setshowcam(false);
          })
          .catch((error) => {
            console.log("An error occurred while saving the photo: " + error);
            setshowcam(false);
          });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const Save = () => {
    let data = {
      project_id: project_id,
      gdpr: gdpr,
      data_collection: data_collection,
      registration_date: registration_date,
      response_type: response_type,
      intervention_type: intervention_type,
      agency_type: agency_type,
      beneficiary_name: beneficiary_name,
      beneficiary_email: beneficiary_email,
      beneficiary_age: beneficiary_age,
      beneficiary_gender: beneficiary_gender,
      beneficiary_marital_status: beneficiary_marital_status,
      beneficiary_phone: beneficiary_phone,
      beneficiary_passport: beneficiary_passport,
      alt_beneficiary_name: alt_beneficiary_name,
      alt_beneficiary_age: alt_beneficiary_age,
      alt_beneficiary_gender: alt_beneficiary_gender,
      alt_beneficiary_phone: alt_beneficiary_phone,
      beneficiary_soc_name: beneficiary_soc_name,
      beneficiary_soc_num: beneficiary_soc_num,
      land_size: land_size,
      land_use: land_use,
      state: state,
      county: county,
      payam: payam,
      boma: boma,
      picture: picture,
      created_by: created_by,
    };

    data = JSON.stringify(data);

    let insertStatement = "insert into registry (`des`) values (?)";
    db.transaction((tx) => {
      tx.executeSql(
        insertStatement,
        [data],
        (_, resultset) => {
          console.log(resultset.rowsAffected); // Log the number of affected rows
          console.log(resultset.insertId); // Log the insert ID
        },
        (_, error) => {
          console.log(error);
        }
      );
    });
  };

  React.useEffect(() => {
    Getdata();
  }, []);

  const thcolor = theme === "dark" ? "#fff" : "#000";
  let states = [];
  for (let key in Locations) {
    states.push(key);
  }

  const [gdpr, setgdpr] = React.useState(false);
  const { id: project_id } = project;
  const [data_collection, setdatacollection] = React.useState(false);

  const [registration_date, setregistration_date] = React.useState(new Date());

  const [agency_type, setagency_type] = React.useState();
  const [beneficiary_name, setbeneficiary_name] = React.useState("");
  const [beneficiary_email, setbeneficiary_email] = React.useState(null);
  const [beneficiary_age, setbeneficiary_age] = React.useState(null);
  const [beneficiary_phone, setbeneficiary_phone] = React.useState(null);
  const [beneficiary_passport, setbeneficiary_passport] = React.useState(null);
  const [alt_beneficiary_email, setalt_beneficiary_email] =
    React.useState(null);

  const [alt_beneficiary_name, setaltbeneficiary_name] = React.useState(null);
  const [alt_beneficiary_age, setalt_beneficiary_age] = React.useState(null);
  const [alt_beneficiary_phone, setalt_beneficiary_phone] =
    React.useState(null);
  const [beneficiary_soc_name, setbensocname] = React.useState(null);
  const [beneficiary_soc_num, setbensocnum] = React.useState(null);
  const [land_size, setland_size] = React.useState(null);

  const [chiefdom, setchiefdom] = React.useState(null);
  const [picture, setpicture] = React.useState(null);
  const [created_by, setcreated_by] = global.user.id;

  const intervention = [
    "Nutrition Vouchers",
    "Cash for seeds",
    "Input trade fair",
    "Agriculture Kits Distribution",
    "Livestock Vaccination",
    "Livestock Treatment",
  ];

  const [index, setindex] = React.useState(0);
  const [date, setDate] = React.useState(new Date());
  const [selectedIndex, setSelectedIndex] = React.useState(new IndexPath(0));
  const [response_type, setresponse_type] = React.useState(
    seasons[selectedIndex.row].name
  );
  const [interventionindex, setinterventionindex] = React.useState(
    new IndexPath(0)
  );
  const [intervention_type, setintervention_type] = React.useState(
    intervention[interventionindex.row]
  );

  const status = ["Single", "Married", "Widowed", "Divorced"];
  const resgender = ["Male", "Female"];
  const landuse = ["Forestry", "Farming", "Livestock Herding", "Floriculture"];

  const [genderindex, setgenderindex] = React.useState(new IndexPath(0));
  const [beneficiary_gender, setbeneficiary_gender] = React.useState(
    resgender[genderindex.row]
  );

  const [altgenderindex, setaltgenderindex] = React.useState(new IndexPath(0));
  const [alt_beneficiary_gender, setalt_beneficiary_gender] = React.useState(
    resgender[genderindex.row]
  );

  const [maritalindex, setmaritalindex] = React.useState(new IndexPath(0));
  const [beneficiary_marital_status, setmarital_status] = React.useState(
    status[maritalindex.row]
  );
  const [loading, setloading] = React.useState(false);
  const [landindex, setlandindex] = React.useState(new IndexPath(0));
  const [land_use, setland_use] = React.useState(landuse[landindex.row]);

  const [stateindex, setstateindex] = React.useState(new IndexPath(0));
  const [state, setstate] = React.useState(states[stateindex.row]);

  const [countyindex, setcountyindex] = React.useState(new IndexPath(0));
  const [counties, setcounties] = React.useState([]);
  const [county, setcounty] = React.useState(counties[countyindex.row]);

  const [payamindex, setpayamindex] = React.useState(new IndexPath(0));
  const [payams, setpayams] = React.useState([]);
  const [payam, setpayam] = React.useState(payams[payamindex.row]);

  const [bomaindex, setbomaindex] = React.useState(new IndexPath(0));
  const [bomas, setbomas] = React.useState([]);
  const [boma, setboma] = React.useState(null);
  const [isVisited, setIsVisited] = React.useState([]);

  const Getdata = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "select * from registry",
        null,
        (txobj, result) => {
          console.log(result.rows._array);
        },
        (txobj, error) => {
          console.log(error);
        }
      );
    });
  };

  // Form validations

  const namesPattern = /^(\b\w+\b\s*){2,}$/; //Pattern to validate entry of at least 2 names
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; //Pattern to validate entry of valid email address

  // function that enables/disables next button depending on whether form screen is valid
  const CheckValidity = (screen) => {
    let validityObject = { isValid: false };

    switch (screen) {
      case 0:
        if (gdpr && data_collection) {
          validityObject.isValid = true;
        } else {
          validityObject.isValid = false;
        }
        break;
      case 1:
        validityObject.isValid = true;
        break;
      case 2:
        if (
          namesPattern.test(beneficiary_name) &&
          beneficiary_age &&
          +beneficiary_age >= 18 &&
          +beneficiary_age <= 100 &&
          beneficiary_email &&
          emailPattern.test(beneficiary_email) &&
          beneficiary_phone &&
          beneficiary_phone.toString().length === 10 &&
          beneficiary_passport &&
          beneficiary_passport.length > 0
        ) {
          validityObject.isValid = true;
        } else {
          validityObject.isValid = false;
        }
        break;
      case 3:
        let emptyFields = [
          alt_beneficiary_name,
          alt_beneficiary_age,
          alt_beneficiary_email,
          alt_beneficiary_phone,
        ];
        if (emptyFields.every((v) => v === null || v.length === 0)) {
          validityObject.isValid = true;
        } else {
          if (
            namesPattern.test(alt_beneficiary_name) &&
            alt_beneficiary_age &&
            +alt_beneficiary_age >= 18 &&
            +alt_beneficiary_age <= 100 &&
            alt_beneficiary_email &&
            emailPattern.test(alt_beneficiary_email) &&
            alt_beneficiary_phone &&
            alt_beneficiary_phone.toString().length === 10
          ) {
            validityObject.isValid = true;
          } else {
            validityObject.isValid = false;
          }
        }
        break;
      case 4:
        validityObject.isValid = true;
        break;
      case 5:
        validityObject.isValid = true;
        break;

      default:
        break;
    }
    return validityObject;
  };

  return (
    <>
      {showcam ? (
        <Camera style={styles.camera} type={type} ref={ref}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={TakePic}>
              <Text style={styles.textbtn}>Take picture</Text>
            </TouchableOpacity>
          </View>
        </Camera>
      ) : (
        <Layout style={styles.parent} keyboardShouldPersistTaps="always">
          <Text style={styles.simpletext}>
            You are adding a beneficiary under {"\t"}
            <Text status="primary">
              {props.route.params.project.project_acronym}
            </Text>
            {"\t"}{" "}
            <Text
              category="success"
              onPress={() => {
                props.navigation.navigate("Beneficiary_form");
              }}
            >
              Change
            </Text>
          </Text>
          {index == 0 && (
            <ScrollView keyboardShouldPersistTaps="always">
              <Card style={styles.card}>
                <Text category="h5" status="info">
                  Consent Form
                </Text>
                <Text category="h6">GDPR CONSENT STATEMENT </Text>
                <Text style={styles.text}>
                  To ensure the beneficiaries understand how their personal data
                  will be used by FAO’s and to ensure that they are aware that
                  their data will be shared with other service providers
                  including third party monitors in order to facilitate the
                  distribution of inputs, cash payments as well as monitoring
                  the intervention.
                  {"\n\n"}
                  By signing the beneficiary list the beneficiaries will be
                  consenting to what you will be reading to them. It is the
                  responsibility of FAO’s implementing partner (IP/NGO) to
                  ensure that the below statement is read out and understood by
                  the beneficiaries. By signing a copy of this form, the
                  implementing partner attests that all beneficiaries have
                  understood the below statement and agreed to it.
                </Text>
                <Text category="h6" style={{ padding: 10 }}>
                  Collection of data consent Eastern Equatoriament{" "}
                </Text>
                <Text style={styles.text}>
                  I have to read out the below Eastern Equatoriament to you
                  because if you want to be part of the FAO's programme in South
                  Sudan, then you need to give permission to FAOSS to use your
                  personal data.Here are the rules about how FAOSS will use your
                  personal data: 1. FAOSS use your personal data to:
                  {"\n\n"}
                  1. Provide agriculture inputs or cash payments to you and
                  {"\n\n"}
                  2. verify that you have received your entitlements 2. FAOSS
                  will share only the necessary personal data with service
                  providers to facilitate the delivery of agriculture inputs and
                  cash payments when needed (shared data: name, boma, payam,
                  county,Eastern Equatoria, gender, photo, mobile phone and
                  biometrics).
                  {"\n\n"}
                  3. FAOSS will use your personal data to learn how to make
                  FAOSS's interventions relevant to you.
                  {"\n\n"}
                  4. If you think that FAOSS or someone that FAOSS has shared
                  your personal data and has broken the rules you can complain
                  on FAO's toll free number: 515.
                  {"\n\n"}
                  By signing or thumb printing the registration form, you
                  acknowledge that you have given consent to what has just been
                  read to you.
                </Text>
              </Card>
              <View style={styles.row2}>
                <CheckBox
                  style={styles.checkbox}
                  value={gdpr}
                  onValueChange={setgdpr}
                  color={gdpr ? "#4630EB" : undefined}
                />
                <Text
                  style={{ marginTop: 10, margin: 10, textAlign: "justify" }}
                >
                  Has the User Agreed To The GDPR Consent statement
                </Text>
              </View>
              <View style={styles.row2}>
                <CheckBox
                  style={styles.checkbox}
                  value={data_collection}
                  onValueChange={setdatacollection}
                  color={data_collection ? "#4630EB" : undefined}
                />
                <Text
                  style={{ marginTop: 10, margin: 10, textAlign: "justify" }}
                >
                  Has the User Agreed To The Collection of data consent Eastern
                  Equatoriament
                </Text>
              </View>
            </ScrollView>
          )}
          {index == 1 && (
            <Card style={styles.card}>
              <Text status="info" category="h5" style={styles.title}>
                Farmer Placement
              </Text>
              <Datepicker
                date={registration_date}
                onSelect={(nextDate) => setDate(nextDate)}
                disabled
                label="Registration date"
              />
              <Select
                selectedIndex={selectedIndex}
                label="Type of season"
                value={response_type}
                onSelect={(index) => {
                  setSelectedIndex(index),
                    setresponse_type(seasons[index.row].name);
                }}
              >
                {seasons.map((element, index) => (
                  <SelectItem key={index} title={element.name} />
                ))}
              </Select>
              <Select
                selectedIndex={interventionindex}
                label="Type of inervention"
                value={intervention_type}
                onSelect={(index) => {
                  setinterventionindex(index),
                    setintervention_type(intervention[index.row]);
                }}
              >
                {intervention.map((element, index) => (
                  <SelectItem key={"m" + index} title={element} />
                ))}
              </Select>
              <Input label="Donor" disabled value={project.donor} />
            </Card>
          )}
          {index == 2 && (
            <Card style={styles.card}>
              <Text status="info" category="h5" style={styles.title}>
                Beneficiary Details
              </Text>
              <Input
                value={beneficiary_name}
                onChangeText={(text) => {
                  setbeneficiary_name(text);
                }}
                style={
                  isVisited.includes("beneficiary_name") &&
                  (!namesPattern.test(beneficiary_name) ||
                    beneficiary_name.length < 1) &&
                  styles.errorInput
                }
                onBlur={() => {
                  !isVisited.includes("beneficiary_name")
                    ? setIsVisited((val) => {
                        return [...val, "beneficiary_name"];
                      })
                    : null;
                }}
                label="Name"
              />
              {isVisited.includes("beneficiary_name") &&
                (!namesPattern.test(beneficiary_name) ||
                  beneficiary_name.length < 1) && (
                  <Text style={{ ...styles.errorText, maxWidth: "auto" }}>
                    Please input at least 2 names
                  </Text>
                )}

              <View style={styles.row}>
                <View>
                  <Input
                    label="Age"
                    value={beneficiary_age}
                    onChangeText={(text) => {
                      setbeneficiary_age(text);
                    }}
                    keyboardType="numeric"
                    style={
                      isVisited.includes("beneficiary_age") &&
                      (!beneficiary_age ||
                        !(+beneficiary_age >= 18) ||
                        !(+beneficiary_age <= 100))
                        ? { ...styles.input, ...styles.errorInput }
                        : { ...styles.input }
                    }
                    onBlur={() => {
                      !isVisited.includes("beneficiary_age")
                        ? setIsVisited((val) => {
                            return [...val, "beneficiary_age"];
                          })
                        : null;
                    }}
                  />
                  {isVisited.includes("beneficiary_age") &&
                    (!beneficiary_age ||
                      !(+beneficiary_age >= 18) ||
                      !(+beneficiary_age <= 100)) && (
                      <Text style={styles.errorText}>
                        Age must be between 18 and 100
                      </Text>
                    )}
                </View>

                <View>
                  <Input
                    label="Email"
                    value={beneficiary_email}
                    onChangeText={(text) => {
                      setbeneficiary_email(text);
                    }}
                    keyboardType="email-address"
                    style={
                      isVisited.includes("beneficiary_email") &&
                      (!beneficiary_email ||
                        !emailPattern.test(beneficiary_email))
                        ? { ...styles.input, ...styles.errorInput }
                        : { ...styles.input }
                    }
                    onBlur={() => {
                      !isVisited.includes("beneficiary_email")
                        ? setIsVisited((val) => {
                            return [...val, "beneficiary_email"];
                          })
                        : null;
                    }}
                  />
                  {isVisited.includes("beneficiary_email") &&
                    (!beneficiary_email ||
                      !emailPattern.test(beneficiary_email)) && (
                      <Text style={styles.errorText}>
                        Please enter a valid email address
                      </Text>
                    )}
                </View>
              </View>
              <View style={styles.row}>
                <View>
                  <Input
                    label="Society name"
                    value={beneficiary_soc_name}
                    onChangeText={(text) => {
                      setbensocname(text);
                    }}
                    style={styles.input}
                  />
                </View>
                <View>
                  <Input
                    label="Society number"
                    value={beneficiary_soc_num}
                    onChangeText={(text) => {
                      setbensocnum(text);
                    }}
                    style={styles.input}
                  />
                </View>
              </View>
              <View style={styles.row}>
                <Select
                  selectedIndex={genderindex}
                  label="Gender"
                  style={styles.input}
                  value={beneficiary_gender}
                  onSelect={(index) => {
                    setgenderindex(index),
                      setbeneficiary_gender(resgender[index.row]);
                  }}
                >
                  {resgender.map((element, index) => (
                    <SelectItem key={"g" + index} title={element} />
                  ))}
                </Select>
                <Select
                  selectedIndex={maritalindex}
                  label="Marital status"
                  style={styles.input}
                  value={beneficiary_marital_status}
                  onSelect={(index) => {
                    setmaritalindex(index),
                      setmarital_status(status[index.row]);
                  }}
                >
                  {status.map((element, index) => (
                    <SelectItem key={"s" + index} title={element} />
                  ))}
                </Select>
              </View>
              <View style={styles.row}>
                <View>
                  <Input
                    label="Phone"
                    value={beneficiary_phone}
                    onChangeText={(text) => {
                      setbeneficiary_phone(text);
                    }}
                    keyboardType="phone-pad"
                    style={
                      isVisited.includes("beneficiary_phone") &&
                      (!beneficiary_phone ||
                        beneficiary_phone.toString().length !== 10)
                        ? { ...styles.errorInput, ...styles.input }
                        : { ...styles.input }
                    }
                    onBlur={() => {
                      !isVisited.includes("beneficiary_phone")
                        ? setIsVisited((val) => {
                            return [...val, "beneficiary_phone"];
                          })
                        : null;
                    }}
                  />
                  {isVisited.includes("beneficiary_phone") &&
                    (!beneficiary_phone ||
                      beneficiary_phone.toString().length !== 10) && (
                      <Text style={styles.errorText}>
                        Phone number must be 10 digits
                      </Text>
                    )}
                </View>
                <View>
                  <Input
                    label="ID/Passport"
                    value={beneficiary_passport}
                    onChangeText={(text) => {
                      setbeneficiary_passport(text);
                    }}
                    style={
                      isVisited.includes("beneficiary_passport") &&
                      (!beneficiary_passport || beneficiary_passport === "")
                        ? { ...styles.errorInput, ...styles.input }
                        : { ...styles.input }
                    }
                    onBlur={() => {
                      !isVisited.includes("beneficiary_passport")
                        ? setIsVisited((val) => {
                            return [...val, "beneficiary_passport"];
                          })
                        : null;
                    }}
                  />
                  {isVisited.includes("beneficiary_passport") &&
                    (!beneficiary_passport || beneficiary_passport === "") && (
                      <Text style={styles.errorText}>
                        ID/Passport cannot be empty
                      </Text>
                    )}
                </View>
              </View>
            </Card>
          )}
          {index == 3 && (
            <Card style={styles.card}>
              <Text status="info" category="h5" style={styles.title}>
                Alternative Beneficiary Details
              </Text>
              <Input
                label="Name"
                value={alt_beneficiary_name}
                onChangeText={(text) => {
                  setaltbeneficiary_name(text);
                }}
                style={
                  isVisited.includes("alt_beneficiary_name") &&
                  (!namesPattern.test(alt_beneficiary_name) ||
                    alt_beneficiary_name.length < 1) &&
                  styles.errorInput
                }
                onBlur={() => {
                  !isVisited.includes("alt_beneficiary_name")
                    ? setIsVisited((val) => {
                        return [...val, "alt_beneficiary_name"];
                      })
                    : null;
                }}
              />
              {isVisited.includes("alt_beneficiary_name") &&
                (!namesPattern.test(alt_beneficiary_name) ||
                  alt_beneficiary_name.length < 1) && (
                  <Text style={{ ...styles.errorText, maxWidth: "auto" }}>
                    Please input at least 2 names
                  </Text>
                )}
              <View style={styles.row}>
                <View>
                  <Input
                    label="Age"
                    value={alt_beneficiary_age}
                    onChangeText={(text) => {
                      setalt_beneficiary_age(text);
                    }}
                    keyboardType="numeric"
                    style={
                      isVisited.includes("alt_beneficiary_age") &&
                      (!alt_beneficiary_age ||
                        !(+alt_beneficiary_age >= 18) ||
                        !(+alt_beneficiary_age <= 100))
                        ? { ...styles.input, ...styles.errorInput }
                        : { ...styles.input }
                    }
                    onBlur={() => {
                      !isVisited.includes("alt_beneficiary_age")
                        ? setIsVisited((val) => {
                            return [...val, "alt_beneficiary_age"];
                          })
                        : null;
                    }}
                  />
                  {isVisited.includes("alt_beneficiary_age") &&
                    (!alt_beneficiary_age ||
                      !(+alt_beneficiary_age >= 18) ||
                      !(+alt_beneficiary_age <= 100)) && (
                      <Text style={styles.errorText}>
                        Age must be between 18 and 100
                      </Text>
                    )}
                </View>
                <View>
                  <Input
                    label="Email"
                    value={alt_beneficiary_email}
                    onChangeText={(text) => {
                      setalt_beneficiary_email(text);
                    }}
                    keyboardType="email-address"
                    style={
                      isVisited.includes("alt_beneficiary_email") &&
                      (!alt_beneficiary_email ||
                        !emailPattern.test(alt_beneficiary_email))
                        ? { ...styles.input, ...styles.errorInput }
                        : { ...styles.input }
                    }
                    onBlur={() => {
                      !isVisited.includes("alt_beneficiary_email")
                        ? setIsVisited((val) => {
                            return [...val, "alt_beneficiary_email"];
                          })
                        : null;
                    }}
                  />
                  {isVisited.includes("alt_beneficiary_email") &&
                    (!alt_beneficiary_email ||
                      !emailPattern.test(alt_beneficiary_email)) && (
                      <Text style={styles.errorText}>
                        Please enter a valid email address
                      </Text>
                    )}
                </View>
              </View>

              <Select
                selectedIndex={altgenderindex}
                label="Gender"
                value={alt_beneficiary_gender}
                onSelect={(index) => {
                  setaltgenderindex(index),
                    setalt_beneficiary_gender(resgender[index.row]);
                }}
              >
                {resgender.map((element, index) => (
                  <SelectItem key={"ag" + index} title={element} />
                ))}
              </Select>

              <Input
                label="Phone"
                value={alt_beneficiary_phone}
                onChangeText={(text) => {
                  setalt_beneficiary_phone(text);
                }}
                keyboardType="phone-pad"
                style={
                  isVisited.includes("alt_beneficiary_phone") &&
                  (!alt_beneficiary_phone ||
                    alt_beneficiary_phone.toString().length !== 10) &&
                  styles.errorInput
                }
                onBlur={() => {
                  !isVisited.includes("alt_beneficiary_phone")
                    ? setIsVisited((val) => {
                        return [...val, "alt_beneficiary_phone"];
                      })
                    : null;
                }}
              />
              {isVisited.includes("alt_beneficiary_phone") &&
                (!alt_beneficiary_phone ||
                  alt_beneficiary_phone.toString().length !== 10) && (
                  <Text style={{ ...styles.errorText, maxWidth: "auto" }}>
                    Phone number must be 10 digits
                  </Text>
                )}
            </Card>
          )}
          {index == 4 && (
            <Card style={styles.card}>
              <Text status="info" category="h5" style={styles.title}>
                Land details
              </Text>
              <Input
                label="Size of Land"
                value={land_size}
                onChangeText={(text) => {
                  setland_size(text);
                }}
              />

              <Select
                selectedIndex={landindex}
                label="Land use"
                value={land_use}
                onSelect={(index) => {
                  setlandindex(index);
                  setland_use(landuse[index.row]);
                }}
              >
                {landuse.map((element, index) => (
                  <SelectItem key={"l" + index} title={element} />
                ))}
              </Select>
            </Card>
          )}
          {index == 5 && (
            <Card style={styles.card}>
              <Text status="info" category="h5" style={styles.title}>
                Location details
              </Text>
              <Select
                selectedIndex={stateindex}
                label="State"
                value={state}
                onSelect={(index) => {
                  let st = states[index.row];
                  let countie = [];
                  setstateindex(index);
                  setstate(states[index.row]);
                  for (key in Locations[st]) {
                    countie.push(key);
                  }
                  setcounties(countie);
                  setcounty(countie[0]);
                }}
              >
                {states.map((element, index) => (
                  <SelectItem key={"s" + index} title={element} />
                ))}
              </Select>
              {counties.length > 0 && (
                <Select
                  selectedIndex={countyindex}
                  label="County"
                  value={county}
                  onSelect={(index) => {
                    let st = counties[index.row];
                    let countie = [];
                    setcountyindex(index);
                    setcounty(counties[index.row]);
                    for (key in Locations[state][st]) {
                      countie.push(key);
                    }
                    setpayams(countie);
                    setpayam(countie[0]);
                  }}
                >
                  {counties.map((element, index) => (
                    <SelectItem key={"c" + index} title={element} />
                  ))}
                </Select>
              )}

              {payams.length > 0 && (
                <Select
                  selectedIndex={payamindex}
                  label="Payam"
                  value={payam}
                  onSelect={(index) => {
                    let st = payams[index.row];
                    let countie = [];
                    setpayamindex(index);
                    setpayam(payams[index.row]);
                    for (key in Locations[state][county][st]) {
                      countie.push(key);
                    }
                    setbomas(countie);
                    setboma(countie[0]);
                  }}
                >
                  {payams.map((element, index) => (
                    <SelectItem key={"c" + index} title={element} />
                  ))}
                </Select>
              )}
              {bomas.length > 0 && (
                <Select
                  selectedIndex={bomaindex}
                  label="Boma"
                  value={boma}
                  onSelect={(index) => {
                    let st = bomas[index.row];
                    setbomaindex(index);
                    setboma(bomas[index.row]);
                  }}
                >
                  {bomas.map((element, index) => (
                    <SelectItem key={"c" + index} title={element} />
                  ))}
                </Select>
              )}
            </Card>
          )}
          {index == 6 && (
            <Card
              style={{
                ...styles.card,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                setshowcam(true);
              }}
              header={() => (
                <Text style={{ margin: 10 }} status="primary" category="h6">
                  Upload image
                </Text>
              )}
            >
              {picture ? (
                <>
                  <Image source={{ uri: picture }} style={styles.image} />
                  <Button
                    onPress={() => {
                      setpicture(null);
                    }}
                  >
                    Retake
                  </Button>
                </>
              ) : (
                <View style={styles.imagebox}>
                  <FontAwesome5
                    onPress={() => {
                      setshowcam(true);
                    }}
                    name="camera"
                    size={20}
                    color={thcolor}
                  />
                </View>
              )}
            </Card>
          )}
          {loading ? (
            <Loading />
          ) : (
            <View style={styles.row1}>
              {index !== 0 && (
                <Button
                  status="basic"
                  style={{ margin: 10 }}
                  onPress={() => {
                    setindex(index - 1);
                    setIsVisited([]);
                  }}
                >
                  Back
                </Button>
              )}
              {index !== 6 ? (
                <Button
                  style={{ margin: 10 }}
                  onPress={() => {
                    setindex(index + 1);
                    setIsVisited([]);
                  }}
                  disabled={!CheckValidity(index).isValid}
                >
                  Next
                </Button>
              ) : (
                <Button
                  style={{ margin: 10 }}
                  onPress={() => {
                    Save();
                    alert("saved to device");
                    props.navigation.replace("Benform", { project: project });
                  }}
                >
                  Finish
                </Button>
              )}
            </View>
          )}
        </Layout>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
  },

  simpletext: {
    margin: 10,
  },

  card: {
    margin: 10,
  },
  text: {
    textAlign: "justify",
  },
  checkbox: {
    margin: 10,
  },
  errorInput: {
    borderColor: "red",
  },
  errorText: {
    fontSize: 12,
    color: "red",
    maxWidth: Dimensions.get("window").width / 2 - 40,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  row1: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  input: {
    width: Dimensions.get("window").width / 2 - 40,
  },
  title: {
    margin: 10,
  },
  row2: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    margin: 10,
  },
  imagebox: {
    width: Dimensions.get("window").width / 2,
    height: 200,
    borderWidth: 1,
    borderStyle: "dotted",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: Dimensions.get("window").width / 2,
    height: 200,
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
  textbtn: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
