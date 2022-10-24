import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import React, { useState } from 'react'
import axios from "axios";
import { useDispatch } from 'react-redux';
import { setToken, setUserInfo } from '../redux/slices/userTokenSlice'
import * as Sentry from "@sentry/react-native";

export default function SignInScreen({ navigation }) {
  const [username, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch();


  function handleSignIn() {
    Sentry.captureException("Sign in button pressed");
    const url = `https://jotform-intern.herokuapp.com/Login.php`;
    if (username == '' || password == '') {
      alert('Please fill in the informations!')
    }
    else {
      axios
        .post(
          url,
          {
            username: username,
            password: password,
          }
        ).then((res) => {console.log(res.data)
          if (res.data.message === "Logged in successfully") {
            dispatch(setUserInfo(res.data.data));
            dispatch(setToken(res.data.data.userToken))
            
            navigation.replace("HomeScreen");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  return (
    <View style={styles.main}>
      <View style={{ paddingTop: 100 }}>
        <Text style={{ fontSize: 30, fontWeight: 'bold', color: '#004C80' }}>Log into your account</Text>
        <View style={{ paddingTop: 20 }}>
          <Text style={styles.paragraph}>Log into your account to make sales and</Text>
          <Text style={styles.paragraph}>manage your inventory</Text>
        </View>
      </View>
      <View style={{ paddingTop: 50, paddingBottom: 110 }}>
        <TextInput
          style={styles.textInput}
          placeholder='Username'
          placeholderTextColor={'#0099FF'}
          onChangeText={(text) => setUserName(text)}
        />
        <TextInput
          placeholderTextColor={'#0099FF'}
          style={styles.textInput}
          placeholder='Password'
          onChangeText={(text) => setPassword(text)}
          secureTextEntry={true}
        />
      </View>
      <TouchableOpacity onPress={() => handleSignIn()}>
        <View style={styles.signIn}>
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>Sign In</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('SignUpScreen')}>
        <View style={styles.createAnAccount}>
          <Text style={{ color: '#0099FF', fontWeight: 'bold', fontSize: 20 }}>Create an Account</Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: 'center',
  },
  textInput: {
    width: wp('80%'),
    borderWidth: 2,
    borderColor: "#0099FF",
    padding: wp('3%'),
    paddingLeft:20,
    borderRadius: 8,
    marginVertical: 10,
    height:50
  },
  signIn: {
    width: wp('80%'),
    height: wp('15%'),
    backgroundColor: '#0099FF',
    alignItems: 'center',
    justifyContent: 'center',
    margin: wp('2%'),
    borderRadius: 8
  },
  createAnAccount: {
    width: wp('80%'),
    height: wp('15%'),
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    margin: wp('2%'),
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#0099FF'
  },
  paragraph: {
    fontSize: 17,
    color: '#004C80'
  },
})