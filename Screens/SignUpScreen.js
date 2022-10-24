import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Dimensions,
  ScrollView,
  Platform
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import { Formik } from "formik";
import axios from "axios";
import API_URL from "../url.json";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;



export default function SignupScreen({ navigation }) {
  const usernameRef = useRef();
  const shopNameRef = useRef();
  const passwordRef = useRef();
  const [isPasswordVisible, setPasswordVisible] = useState(false);


  function handleSignUp(values) {
    console.log("POST PARAMS", values.password);
    const url = `https://jotform-intern.herokuapp.com/Register.php`;
    axios
      .post(
        url,
        {
          email: values.email,
          username: values.username,
          password: values.password,
          shop_name: values.shopName,

        }
      ).then((res) => {

        if (res.data.message === "You has been registered successfully!") {
          navigation.replace("SignInScreen");
        }
      })
      .catch((err) => {
        console.log("error", err);
      });
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView style={styles.container}>
        <Formik
          initialValues={{ email: "", username: "", password: "", shopName: "" }}
          validateOnMount={true}
          onSubmit={(values) => handleSignUp(values)}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            isValid,
          }) => (
            <View style={styles.main}>
              <View style={{ marginTop:50 }}>
                <Text style={{ fontSize: 30, fontWeight: 'bold', color: '#004C80' }}>Create your account</Text>
                <View style={{ paddingTop: 20 }}>
                  <Text style={styles.paragraph}>Create an account to make sales and</Text>
                  <Text style={styles.paragraph}>manage your inventory</Text>
                </View>
              </View>
              <View style={styles.textInputContainer}>
                <TextInput
                  placeholder="E-mail"
                  placeholderTextColor={'#0099FF'}
                  style={styles.textInput}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  value={values.email}
                  keyboardType={"email-address"}
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    usernameRef.current.focus();
                  }}
                  blurOnSubmit={false}
                />
                <TextInput
                  placeholder="Username"
                  placeholderTextColor={'#0099FF'}
                  style={styles.textInput}
                  onChangeText={handleChange("username")}
                  onBlur={handleBlur("username")}
                  value={values.username}
                  ref={usernameRef}
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    shopNameRef.current.focus();
                  }}
                  blurOnSubmit={false}
                />
                <TextInput
                  placeholder="Shop Name"
                  placeholderTextColor={'#0099FF'}
                  style={styles.textInput}
                  onChangeText={handleChange("shopName")}
                  onBlur={handleBlur("shopName")}
                  value={values.shopName}
                  ref={shopNameRef}
                  onSubmitEditing={() => {
                    passwordRef.current.focus();
                  }}
                />
                <View style={styles.passwordInputContainer}>
                  <TextInput
                    placeholder="Password"
                    placeholderTextColor={'#0099FF'}
                    style={styles.passwordInput}
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    value={values.password}
                    secureTextEntry={isPasswordVisible ? false : true}
                    ref={passwordRef}
                  />
                  <TouchableOpacity style={styles.eyeIcon} onPress={() => setPasswordVisible(!isPasswordVisible)}>
                    <Ionicons name={isPasswordVisible ? "eye" : "eye-off"} size={20} color="#333333" />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={styles.signUpButton}
                  onPress={handleSubmit}
                >
                  <Text style={styles.singUpButtonText}>Create an Account</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.signInButton}
                  onPress={() => navigation.replace("SignInScreen")}
                >
                  <Text style={styles.signInButtonText}>Sign In</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  main: {
    flex: 1,
    alignItems: 'center',
  },
  signupText: {
    fontSize: 25,
    fontWeight: "bold",
    marginTop: '10%',
    alignSelf: "center",
    color: "#0A1551",
    marginBottom: '33%',
  },
  textInputContainer: {
    borderWidth: 0,
    height: '80%',
    marginTop:30
  },
  nameText: {
    marginLeft: 30,
    fontWeight: "bold",
    color: "#0A1551",
  },
  textInput: {
    borderWidth: 2,
    marginHorizontal: 30,
    height: 50,
    paddingLeft: 20,
    marginTop: '3%',
    borderColor: "#0099FF",
    borderRadius: 7,
    marginBottom: '4%',
  },
  signUpButton: {
    borderRadius: 8,
    backgroundColor: "#0099FF",
    height: '10%',
    marginHorizontal: 30,
    justifyContent: "center",
    marginTop: 40,

  },
  signInButton: {
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#0099FF',
    backgroundColor: "#FFFFFF",
    height: '10%',
    marginHorizontal: 30,
    justifyContent: "center",
    marginTop: '2%',
  },
  singUpButtonText: {
    fontSize: 20,
    color: "white",
    alignSelf: "center",
    fontWeight: "bold",
  },
  signInButtonText: {
    fontSize: 20,
    color: "#0099FF",
    alignSelf: "center",
    fontWeight: "bold",
  },
  agreeText: {
    marginLeft: 10,
    alignSelf: "center",
  },
  termsText: {
    color: "#0099ff",
    alignSelf: "center",
    fontWeight: "bold",
  },
  headerContainer: {
    marginTop: '5%',
    alignItems: "center",
  },
  logo: {
    fontSize: 50,
    fontWeight: "bold",
    color: "#0A1551",
    marginLeft: 10,
  },
  description: {
    color: "#6F76A7",
    fontSize: 16,
  },
  passwordInputContainer: {
    flexDirection: "row",
    borderWidth: 2,
    marginHorizontal: 30,
    height: '10%',
    paddingLeft: 20,
    marginTop: '2%',
    borderColor: "#0099FF",
    borderRadius: 8,
    marginBottom: '5%',
    alignItems: "center",
    justifyContent: "space-between"
  },
  passwordInput: {
    width: 230,
    height:80
  },
  eyeIcon: {
    marginRight: 20
  },
  paragraph: {
    fontSize: 17,
    color: '#004C80'
  },
});
