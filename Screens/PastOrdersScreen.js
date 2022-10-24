import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Image
} from "react-native";
import React, { useState, useEffect } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { useSelector } from "react-redux";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;


export default function PastOrderScreen({navigation}) {
  const userToken = useSelector((state) => state.userToken.token);
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const getPastOrderList = () => {
    setLoading(true);
    axios
      .get("https://jotform-intern.herokuapp.com/Order.php", {
        headers: {
          token: userToken,
        },
      })
      .then((res) => {
        console.log("gelen data ", res.data);
        setData(res.data.data);
        setLoading(false)
      });
  };

  const ProductListHeader = () => {
    return (
      <View style={styles.productListHeader}>
        <Text style={styles.productInfoText}>PRODUCT NAME</Text>
        <Text style={[styles.productInfoText, {marginLeft:7}]}>AMOUNT</Text>
        <Text style={styles.productInfoText}>PRICE</Text>
      </View>
    );
  };

  useEffect(() => {
    getPastOrderList();
  }, []);

  const renderItem = ({ item, index }) => (
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
    <Text style={styles.productStock}>{item.adet}</Text>
    <View
      style={{
        backgroundColor: "rgba(0, 153, 255, 0.9)",
        width: 1,
        height: 60,
        marginLeft: 10,
      }}
    />
    <Text style={styles.productPrice}>₺{item.fiyat*item.adet}</Text>
  </View>
);


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <MaterialIcons name="keyboard-backspace" size={40} color="#004C80" />
        </TouchableOpacity>
        <Text style={styles.productListText}>Sales History</Text>
      </View>
      <ProductListHeader />
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#007acc"
          style={styles.container}
        />
      ) : (
        <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
      )}
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    width,
    alignItems: "center",
    justifyContent: "space-around",
    flexDirection: "row",
    backgroundColor: "#DFDFDF",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 22,
  },
  information: {
    justifyContent: "space-around",
    flexDirection: "row",
    backgroundColor: "white",
    padding: 10,
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
  productListText: {
    fontSize: 35,
    fontWeight: "bold",
    color: "#004C80",
  },
  productListHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
    width: 220,
    marginLeft: 130,
  },
  productInfoText: {
    fontSize: 14,
    color: "#004C80",
  },
  productItem: {
    flexDirection: "row",
    backgroundColor: "rgba(0, 153, 255, 0.3)",
    marginBottom: 20,
    paddingHorizontal: 10,
    height: 60,

    alignItems: "center",
    width: width - 15,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  index: {
    fontSize: 15,
    color: "#004C80",
    fontWeight: "bold",
    marginRight: 10,
  },
  productImgContainer: {
    backgroundColor:"white",
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
  productStock: {
    fontSize: 15,
    color:"#004C80",
    width: 30,
    textAlign: "center",
  },
  productPrice: {
    fontSize: 14,
    width: 50,
    textAlign: "center",
    marginLeft: 5,
    color:"#004C80",
  },
  productName: {
    fontSize: 15,
    marginHorizontal: 10,
    color:"#004C80",
    width: 130,
    textAlign: "center",
  },
});
