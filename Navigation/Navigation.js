import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import AddStockScreen from "../Screens/AddStockScreen";
import CartScreen from "../Screens/CartScreen";
import MakeSaleCameraScreen from "../Screens/MakeSaleCameraScreen";
import HomeScreen from "../Screens/HomeScreen";
import PastOrdersScreen from "../Screens/PastOrdersScreen";
import ProductListScreen from "../Screens/ProductListScreen";
import SignInScreen from "../Screens/SignInScreen";
import SignUpScreen from "../Screens/SignUpScreen";
import AddStockCameraScreen from "../Screens/AddStockCameraScreen";
import IntroductionScreen from "../Screens/IntroductionScreen";

const Stack = createStackNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
         <Stack.Screen
          name="IntroductionScreen"
          component={IntroductionScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignUpScreen"
          component={SignUpScreen}
          options={{ headerShown: false }}
        />
       
        <Stack.Screen
          name="SignInScreen"
          component={SignInScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MakeSaleCameraScreen"
          component={MakeSaleCameraScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddStockScreen"
          component={AddStockScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="CartScreen"
          component={CartScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="PastOrdersScreen"
          component={PastOrdersScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProductListScreen"
          component={ProductListScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddStockCameraScreen"
          component={AddStockCameraScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
