import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Image
} from "react-native";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeToken, removeUserInfo } from "../redux/slices/userTokenSlice";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

export default function HomeScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.userToken.userInfo);

  function logOut() {
    
    navigation.replace("SignInScreen");
    dispatch(removeToken());
    setTimeout(() => {
      dispatch(removeUserInfo());
    }, 1000);
    
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => logOut()}>
          <MaterialIcons
            name="logout"
            size={30}
            color="#007acc"
            style={{ transform: [{ rotateY: "180deg" }] }}
          />
        </TouchableOpacity>

        <View style={styles.accountContainer}>
          <View>
            <Text style={styles.usernameText}>{userInfo.username}</Text>
            <Text style={styles.shopnameText}>{userInfo.shopName}</Text>
          </View>
          <View style={styles.userIcon}>
            <Feather name="user" size={30} color="white" />
          </View>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate("MakeSaleCameraScreen")}
          style={styles.buttons}
        >
          <Image source={require("../assets/images/coin.png")} style={{width:25, height:25, position:"absolute", left:20}}/>
          <Text style={styles.texts}>Make a Sale</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("AddStockCameraScreen")}
          style={styles.buttons}
        >
          <Image source={require("../assets/images/box.png")} style={{width:25, height:25, position:"absolute", left:20}}/>
          <Text style={styles.texts}>Add Stock</Text>
        </TouchableOpacity>
        <View style={styles.rowButtonContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate("PastOrdersScreen")}
            style={[styles.buttons, { width: 140 }]}
          >
            <Text style={styles.texts}>Sales</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("ProductListScreen")}
            style={[styles.buttons, { width: 140 }]}
          >
            <Text style={styles.texts}>Stock</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  buttons: {
    borderWidth: 1,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: "3%",
    height: 55,
    width: 300,
    borderColor: "#007acc",
    shadowColor: "#000",
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4.65,
    elevation: 8,
    backgroundColor: "#007acc",
  },
  texts: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
  },
  headerContainer: {
    flexDirection: "row",
    width: width - 40,
    height: 50,
    marginTop: 25,
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 20,
  },
  accountContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  usernameText: {
    color: "#004c80",
    textAlign: "right",
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 5,
  },
  shopnameText: {
    color: "#004c80",
    textAlign: "right",
  },
  userIcon: {
    padding: 5,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#007acc",
    marginLeft: 10,
    backgroundColor: "#007acc",
  },
  buttonContainer: {
    marginTop: 150,
  },
  rowButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rowButtons: {
    width: 100,
  },
});
