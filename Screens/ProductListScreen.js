import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { useSelector } from "react-redux";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

export default function ProductsListScreen({ navigation }) {
  const [search, setSearch] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const userToken = useSelector((state) => state.userToken.token);
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  console.log("userToken", userToken);
  useEffect(() => {
    getProductList();
  }, []);

  const getProductList = () => {
    setLoading(true);
    axios
      .get("https://jotform-intern.herokuapp.com/Stock.php", {
        headers: {
          token: userToken,
        },
      })
      .then((res) => {
        setData(res.data.data);
        setFilteredProducts(res.data.data);
        console.log(res.data.data);
        setLoading(false);
      });
  };

  const renderItem = ({ item, index }) => {
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
  };

  const ProductListHeader = () => {
    return (
      <View style={styles.productListHeader}>
        <Text style={styles.productInfoText}>PRODUCT NAME</Text>
        <Text style={[styles.productInfoText, {marginLeft:9}]}>AMOUNT</Text>
        <Text style={styles.productInfoText}>PRICE</Text>
      </View>
    );
  };

  const searchFilter = (text) => {
    if (text) {
      const newData = data.filter((item) => {
        console.log(item.urunAdi);
        const itemData = item.urunAdi
          ? item.urunAdi.toUpperCase()
          : "".toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredProducts(newData);
      setSearch(text);
    } else {
      setFilteredProducts(data);
      setSearch(text);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <MaterialIcons name="keyboard-backspace" size={40} color="#004C80" />
      </TouchableOpacity>
      <View style={styles.headerContainer}>
        <Ionicons name="ios-search" size={23} color="gray" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="gray"
          value={search}
          onChangeText={(text) => searchFilter(text)}
        />
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
          data={filteredProducts}
          renderItem={renderItem}
          style={styles.list}
        />
      )}

      <TouchableOpacity
        style={styles.addProductButton}
        onPress={() => navigation.navigate("AddStockCameraScreen")}
      >
        <Ionicons name="add-circle" size={70} color="#007acc" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    marginLeft: 60,
    marginVertical: 30,
    flexDirection: "row",
    backgroundColor: "#e5e5e5",
    width: width - 100,
    padding: 8,
    borderRadius: 10,
  },
  list: {
    width,
  },
  productListText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
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
  productName: {
    fontSize: 15,
    marginHorizontal: 10,
    color:"#004C80",
    width: 130,
    textAlign: "center",
  },
  backButton: {
    position: "absolute",
    top: 30,
    left: 10,
  },
  addProductButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
  },
  productStock: {
    fontSize: 15,
    color:"#004C80",
    width: 30,
    textAlign: "center",
  },
  productPrice: {
    fontSize: 14,
    color:"#004C80",
    width: 50,
    textAlign: "center",
    marginLeft: 5,
  },
  productNameContainer: {
    flexDirection: "row",
    width: 150,
    alignItems: "center",
  },
  productListHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
    width: 217,
    marginLeft: 130,
  },
  productInfoText: {
    fontSize: 14,
    color: "#004C80",
  },
  searchInput: {
    marginLeft: 8,
    width: 200,
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
});
