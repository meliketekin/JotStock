import { StyleSheet, Text, View, Image, Dimensions } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

export default function IntroductionScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <View style={styles.topContainer}>
                <Text style={{ fontSize: 50, fontWeight: 'bold', color: '#004C80' }}>Welcome!</Text>
                <View style={{ paddingTop: 20 }}>
                    <Text style={styles.paragraph}>Make your sales and</Text>
                    <Text style={styles.paragraph}>manage your inventory</Text>
                    <Text style={styles.paragraph}>in one place</Text>
                </View>
            </View>
            <Image source={require('../assets/images/jotStock.png')} style={{ width: width, height: height * 0.35, alignSelf: "center", marginTop: 20, marginRight: width * 0.1 }} resizeMode="contain" />
            <View style={styles.bottomContainer}>
                <TouchableOpacity
                    style={styles.createAnAccount}
                    onPress={() => navigation.navigate("SignUpScreen")}
                >
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>Create an Account</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.signIn}
                    onPress={() => navigation.navigate("SignInScreen")}
                >
                    <Text style={{ color: 'white', fontWeight: 'bold', color: '#0099FF', fontSize: 20 }}>Sign In </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    topContainer: {
        paddingTop: 50,
        padding: 30,
        borderWidth: 0,
    },
    container: {
        flex: 1,
        borderWidth: 0,
        borderColor: 'green'
    },
    paragraph: {
        fontSize: 17,
        color: '#004C80'
    },

    bottomContainer: {
        borderWidth: 0,
        borderColor: 'blue',
        height: '65%',
        marginTop: 70
    },
    createAnAccount: {
        backgroundColor: '#0099FF',
        width: '90%',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        borderRadius: 8
    },
    signIn: {
        marginTop: 10,
        borderWidth: 2,
        borderColor: '#0099FF',
        width: '90%',
        height: 50,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8
    }
})