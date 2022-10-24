import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av'
import { useDispatch, useSelector } from 'react-redux';
import { setBarcodes, getBarcodes, setCount, incrCount } from '../redux/slices/getBarcodeSlice'
import axios from 'axios';


export default function App({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [sound, setSound] = React.useState();

  const barcodes = useSelector((state) => state.getBarcode.barcodes)
  const dispatch = useDispatch()

  async function playSound() {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync(
      require('../assets/ses.mp3')
    );
    setSound(sound);

    console.log('Playing Sound');
    await sound.playAsync();
  }

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const submitBarcodes = () => {
    axios.post('https://jotform-intern.herokuapp.com/Barcode.php', {
      ...barcodes
    }).then((res) => {
      dispatch(getBarcodes(res.data.data))
      navigation.navigate("CartScreen")
    }).catch((e) => {
      console.log('Errorr', e)
    })
  }

  const myIncludes = (data) => {
    if (barcodes == "") {
      return false
    }
    else {
      let bool = false
      barcodes.map((item, index) => {
        if (item.barcode == data) {
          bool = true
          dispatch(incrCount(index))
        }
      })
      return bool
    }
  }

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    playSound()

    setTimeout(() => {
      setScanned(false)
    }, 2500);

    if (myIncludes(data) == false) {
      dispatch(setBarcodes(data))
      dispatch(setCount(1))
    }


    // alert(`Bar code with type ${type} and data ${data} has been scanned!`);

  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {/* {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />} */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("HomeScreen")}>
        <MaterialIcons name="keyboard-backspace" size={50} color="#007acc" />
      </TouchableOpacity>
      <MaterialCommunityIcons name="scan-helper" size={250} color="white" style={styles.scanIcon} />
      <TouchableOpacity style={styles.doneButton} onPress={() => submitBarcodes()}>
        <Text style={styles.doneText}>Done</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  doneButton: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    borderWidth: 1,
    borderColor: "#007acc",
    borderRadius: 10,
    backgroundColor: "#007acc",
    padding: 10,
    width: 150,
    alignItems: "center",
    paddingVertical: 15
  },
  doneText: {
    color: 'white',
    fontSize: 18,
    fontWeight: "bold"
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 8
  },
  scanIcon: {
    alignSelf: 'center',
  }
});
