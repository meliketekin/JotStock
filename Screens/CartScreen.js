import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import NumericInput from "react-native-numeric-input";

import { useSelector } from "react-redux";
import { setOrders, setCounts } from "../redux/slices/orderSlice";
import { clearBarcodes } from "../redux/slices/getBarcodeSlice";
import { useDispatch } from "react-redux";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

export default function CartScreen({ navigation }) {
  const products = useSelector((state) => state.getBarcode.barcodesInfo);
  const count = useSelector((state) => state.getBarcode.count);
  const orders = useSelector((state) => state.orderSlice.orders);
  const userToken = useSelector((state) => state.userToken.token);
  const [isLoading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [countArray, setCountArray] = useState(count);
  const [stocks, setStocks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const [basket, setBasket] = useState(0);

  useEffect(() => {
    let total = 0;
    products.map((item, index) => {
      total += Number(item.fiyat) * countArray[index];
    });
    setBasket(total);
  }, [countArray]);

  useEffect(() => {
    setLoading(true);
    axios
      .get("https://jotform-intern.herokuapp.com/Stock.php", {
        headers: {
          token: userToken,
        },
      })
      .then((res) => {
        setStocks(res.data.data);
        setLoading(false);
      });
  }, []);

  const checkStocks = (newArray) => {
    console.log(countArray);
    let bool = true;
    products.map((item, index) => {
      stocks.map((sItem, sIndex) => {
        if (
          item.urunAdi == sItem.urunAdi &&
          newArray[index] > Number(sItem.adet)
        ) {
          // alert("You don't have enough stock for your " + item.urunAdi + " product")
          bool = false;
        }
      });
    });
    return bool;
  };

  const addOrders = () => {
    dispatch(setCounts(countArray));
    dispatch(setOrders(products));
    axios
      .post(
        "https://jotform-intern.herokuapp.com/Order.php",
        { ...orders },
        {
          headers: {
            token: userToken,
          },
        }
      )
      .then((res) => {
        setModalVisible(true);

        dispatch(clearBarcodes());
      })
      .catch((e) => {
        console.log("Errorr", e);
      });
  };

  const renderItem = ({ item, index }) => {
    let totalPrice = countArray[index] * Number(item.fiyat);
    return (
      <View style={styles.productItem}>
        <Text style={styles.index}>{index + 1}</Text>
        <View
          style={{
            backgroundColor: "rgba(0, 153, 255, 0.9)",
            width: 1,
            height: 60,
          }}
        />
        <View style={styles.productImgContainer}>
          <Image
            source={{ uri: item.resim }}
            style={{ width: 38, height: 38 }}
            resizeMode="contain"
          />
        </View>
        <View
          style={{
            backgroundColor: "rgba(0, 153, 255, 0.9)",
            width: 1,
            height: 60,
          }}
        />

        <Text style={styles.productName}>{item.urunAdi}</Text>
        <View
          style={{
            backgroundColor: "rgba(0, 153, 255, 0.9)",
            width: 1,
            height: 60,
            marginRight: 10,
          }}
        />
        <NumericInput
          value={countArray[index]}
          onChange={(value) => {
            let newArray = [...countArray];
            newArray[index] = value;

            // if(value==0) {
            //   newArray.splice(1, index)
            //   setCountArray(newArray)
            // }

            if (checkStocks(newArray)) {
              setCountArray(newArray);
            } else {
              newArray[index] = value - 1;
              setCountArray(newArray);
              alert("There aren't enough stock for this product");
            }
          }}
          rightButtonBackgroundColor="transparent"
          leftButtonBackgroundColor="transparent"
          iconStyle={{ color: "#5F99BF", fontSize: 20 }}
          totalWidth={64}
          totalHeight={28}
          minValue={0}
          inputStyle={{ fontSize: 17 }}
          rounded
          borderColor="#5F99BF"
        />
        <View
          style={{
            backgroundColor: "rgba(0, 153, 255, 0.9)",
            width: 1,
            height: 60,
            marginLeft: 10,
          }}
        />
        <Text style={styles.productPrice}>₺{totalPrice}</Text>
      </View>
    );
  };

  const ProductListHeader = () => {
    return (
      <View style={styles.productListHeader}>
        <Text style={styles.productInfoText}>PRODUCT NAME</Text>
        <Text style={[styles.productInfoText, { marginLeft: 15 }]}>AMOUNT</Text>
        <Text style={styles.productInfoText}>PRICE</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            dispatch(clearBarcodes());
            navigation.goBack();
          }}
        >
          <MaterialIcons name="keyboard-backspace" size={40} color="#004C80" />
        </TouchableOpacity>
        <Text style={styles.productListText}>Make a Sale</Text>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalImage}>
              <Image
                source={require("../assets/images/coin.png")}
                style={{ width: 30, height: 30 }}
              />
            </View>

            <Text style={styles.modalText}>Great!</Text>
            <Text style={styles.modalText2}>You earned ₺{basket}</Text>
            <Text style={styles.modalText3}>
              Check your Sales to get detailed information
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
      {!modalVisible && (
        <>
          <ProductListHeader />
          {isLoading && (
            <ActivityIndicator
              size="large"
              color="#007acc"
              style={{ flex: 1 }}
            />
          )}
          {!isLoading && (
            <FlatList
              data={products}
              renderItem={renderItem}
              style={styles.list}
            />
          )}

          <View style={styles.productItem}>
            <Text style={styles.totalAmountText}>Total Amount</Text>
            <Text style={styles.totalAmount}>₺{basket}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              marginHorizontal: 40,
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              style={[
                styles.sellButton,
                {
                  backgroundColor: "transparent",
                  borderWidth: 2,
                  borderColor: "#0099FF",
                },
              ]}
              onPress={() => {
                dispatch(clearBarcodes());
                navigation.navigate("HomeScreen");
              }}
            >
              <Text style={[styles.sellText, { color: "#0099FF" }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sellButton} onPress={addOrders}>
              <Image
                source={require("../assets/images/coin.png")}
                style={{
                  width: 25,
                  height: 25,
                  position: "absolute",
                  left: 20,
                }}
              />
              <Text style={[styles.sellText, { marginLeft: 15 }]}>Sell</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    marginTop: 25,
    width: width - 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 10,
    marginBottom: 40,
  },
  list: {
    width,
  },
  productListText: {
    fontSize: 35,
    fontWeight: "bold",
    color: "#004C80",
  },
  productItem: {
    flexDirection: "row",
    backgroundColor: "rgba(0, 153, 255, 0.3)",
    marginBottom: 20,
    paddingHorizontal: 10,
    height: 60,
    justifyContent: "space-between",
    alignItems: "center",
    width: width - 15,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  productName: {
    fontSize: 15,
    marginHorizontal: 5,
    width: 115,
    textAlign: "center",
    color: "#004C80",
  },
  productStock: {
    fontSize: 15,
  },
  productPrice: {
    color: "#004C80",
    fontSize: 14,

    width: 50,
    textAlign: "center",
    marginLeft: 0,
  },

  productListHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
    width: 236,
    marginLeft: 115,
  },
  productInfoText: {
    fontSize: 14,
    color: "#004C80",
  },
  sellButton: {
    justifyContent: "center",
    alignItems: "center",
    height: 60,
    width: 130,
    backgroundColor: "#0099FF",
    marginBottom: 20,
    borderRadius: 10,
  },
  sellText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  basket: {
    height: height * 0.08,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#e5e5e5",
  },
  index: {
    fontSize: 15,
    color: "#004C80",
    fontWeight: "bold",
    marginRight: 10,
  },
  productImgContainer: {
    backgroundColor: "white",
    height: 50,
    width: 50,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
    borderColor: "rgba(0, 153, 255, 0.9)",
    marginRight: 10,
  },
  totalAmountText: {
    fontSize: 24,
    color: "#004C80",
    marginLeft: 20,
  },
  totalAmount: {
    color: "#004C80",
    fontSize: 24,
    marginRight: 20,
  },
  modalView: {
    margin: 20,
    backgroundColor: "#BFE5FF",
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
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
  modalImage: {
    position: "absolute",
    top: -20,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#004C80",
  },
});
