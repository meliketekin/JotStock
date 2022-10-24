import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Dimensions,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Image,
  ScrollView,
  Modal,
} from "react-native";
import React, { useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

export default function AddStockScreen({navigation}) {

  const [stock, setStock] = React.useState(1);
  const [modalVisible, setModalVisible] = React.useState(false);



  const product = useSelector((state) => state.getBarcode.barcodesInfo);
  const userToken = useSelector((state) => state.userToken.token);
  const dispatch = useDispatch();

  const submitBarcode = () => {
    let tmpArray = [
      {
        urunAdi: product[0].urunAdi,
        barcode: product[0].barcode,
        fiyat: product[0].fiyat,
        stok: stock,
      },
    ];

    axios
      .post(
        "https://jotform-intern.herokuapp.com/Stock.php",
        { ...tmpArray },
        {
          headers: {
            token: userToken,
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        //clearBarcodes
      })
      .catch((e) => {
        console.log("Errorr", e);
      });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <>
            <View style={styles.headerContainer}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => {
                  navigation.goBack();
                }}
              >
                <MaterialIcons
                  name="keyboard-backspace"
                  size={40}
                  color="#004C80"
                />
              </TouchableOpacity>
              <Text style={styles.productListText}>Add Stock</Text>
            </View>
            <Modal
              animationType="fade"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <View style={styles.modalImage}>
                    <Image
                      source={require("../assets/images/box.png")}
                      style={{ width: 30, height: 30 }}
                    />
                  </View>

                  <Text style={styles.modalText}>Great!</Text>
                  <Text style={styles.modalText2}>
                    You added {stock.toString()} pcs to your inventory
                  </Text>
                  <Text style={styles.modalText3}>
                    Check your Stock to get detailed information
                  </Text>
                  <TouchableOpacity
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => {
                        setModalVisible(!modalVisible);
                         navigation.navigate("HomeScreen");
                     
                     
                    }}
                  >
                    <Text style={styles.doneButton}>Done</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
            {!modalVisible && (<View style={styles.productInputContainer}>
              <View style={styles.imageView}>
                <Image
                  style={styles.image}
                  source={{ uri: product[0]["resim"] }}
                  resizeMode="contain"
                />
              </View>

              <View style={styles.productInfoView}>
                <Text style={[styles.productInfoText, { fontSize: 25 }]}>
                  {product[0]["urunAdi"]}
                </Text>
                <Text
                  style={[
                    styles.productInfoText,
                    { fontSize: width * 0.06, color: "#FF6100" },
                  ]}
                >
                  {product[0]["fiyat"]} TL
                </Text>
              </View>
              <View style={styles.addStockView}>
                <View style={styles.incDecContainer}>
                  <TouchableOpacity
                    style={styles.stockButton}
                    onPress={() => {
                      if (stock > 0) {
                        setStock(parseInt(stock) - 1);
                      }
                    }}
                  >
                    <Ionicons name="ios-remove" size={30} color="black" />
                  </TouchableOpacity>
                  <TextInput
                    style={[styles.textInput, styles.stockTextInput]}
                    onChangeText={(text) => setStock(text)}
                    value={stock.toString()}
                    keyboardType="numeric"
                    onSubmitEditing={() => {
                      priceRef.current.focus();
                    }}
                  />
                  <TouchableOpacity
                    style={styles.stockButton}
                    onPress={() => setStock(parseInt(stock) + 1)}
                  >
                    <Ionicons name="ios-add" size={26} color="black" />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    submitBarcode();
                    setModalVisible(true);
                  }}
                  style={styles.addStockButton}
                >
                  <Image
                    source={require("../assets/images/box.png")}
                    style={{
                      width: 25,
                      height: 25,
                      position: "absolute",
                      left: 20,
                    }}
                  />
                  <Text style={styles.addStockButtonText}>Add to Stock</Text>
                  <Image
                    source={require("../assets/images/box.png")}
                    style={{
                      width: 25,
                      height: 25,
                      position: "absolute",
                      right: 20,
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>)}
            
          </>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  productInputContainer: {
    marginTop: width * 0.1,
  },
  imageView: {
    width,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 180,
    height: 180,
  },
  stockButton: {
    padding: width * 0.03,
  },
  productInfoView: {
    width: width - 100,
    marginTop: 30,
    height: 100,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "space-around",
  },
  addStockView: {
    marginTop: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  productInfoText: {
    fontWeight: "bold",
    color: "#0A1551",
  },
  textInput: {
    marginHorizontal: 30,
    height: 45,
    borderRadius: 5,
    backgroundColor: "white",
    fontSize: 20,
  },
  stockTextInput: {
    width: 60,
    textAlign: "center",
  },
  incDecContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    height: 70,
    alignSelf: "center",
    backgroundColor: "#0099FF",
    borderRadius: width * 0.03,
  },
  addStockButton: {
    marginTop: 20,
    borderRadius: width * 0.03,
    backgroundColor: "#0099FF",
    height: width * 0.15,
    width: width * 0.9,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: "center",
  },
  addStockButtonText: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
  },

  headerContainer: {
    marginTop: 25,
    width: width - 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 10,
  },
  addStockText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  productListText: {
    fontSize: 35,
    fontWeight: "bold",
    color: "#004C80",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    height: 50,
    justifyContent: "center",
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginTop: 5,
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "bold",
    color: "#004C80",
    fontSize: 25,
  },
  modalImage: {
    position: "absolute",
    top: -20,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#004C80",
  },
  modalText2: {
    fontSize: 18,
    marginBottom: 15,
    color: "#004C80",
  },
  modalText3: {
    fontSize: 14,
    color: "rgba(0,76,128,0.5)",
    marginBottom: 15,
  },
  doneButton: {
    backgroundColor: "#0099FF",
    width: 260,
    borderRadius: 10,
    color: "white",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
});
