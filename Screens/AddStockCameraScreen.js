import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av'
import { useDispatch } from 'react-redux';
import { setBarcodesInfo } from '../redux/slices/getBarcodeSlice';

import axios from 'axios';


export default function App({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [sound, setSound] = React.useState();

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


  const handleBarCodeScanned = ({ data }) => {
    setScanned(true)
    playSound()
    let tmpData = [
      {
        'barcode': data
      }
    ]

    axios.post('https://jotform-intern.herokuapp.com/Barcode.php', {
      ...tmpData
    }).then((res) => {
      dispatch(setBarcodesInfo(res.data.data))
      navigation.navigate('AddStockScreen')
    }).catch((e) => {
      console.log('Errorr', e)
    })

    setTimeout(() => {
      setScanned(false)
    }, 2500)


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
      <MaterialIcons name="keyboard-backspace" size={40} color="#004C80" />
      </TouchableOpacity>
      <MaterialCommunityIcons name="scan-helper" size={250} color="white" style={styles.scanIcon} />

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
    bottom: 10,
    right: 10,
    borderWidth: 1,
    borderColor: "green",
    borderRadius: 10,
    backgroundColor: "green",
    padding: 10
  },
  doneText: {
    color: 'white',
    fontSize: 18
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 10
  },
  scanIcon: {
    alignSelf: 'center',
  }
});
