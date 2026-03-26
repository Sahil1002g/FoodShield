import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainRoute, RootRoutes } from '../Routes';
import HomeScreen from '../../screens/HomeScreen';
import HistoryScreen from '../../screens/HistoryScreen';
import Scan from '../../screens/Scan';
import AccountScreen from '../../screens/AccountScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NavigationContainer } from '@react-navigation/native';
import AuthStackNavigator from './AuthStack';
import { navigationRef, parseAndLogRoute, setIsNavigationReady } from '../Navigation';
import BotScreen from '../../screens/BotScreen';
import ScanReport from '../../screens/ScanReportScreen';
import SplashScreen from '../../screens/SplashScreen';
import AuthStack from './AuthStack';



const RootStack = createNativeStackNavigator();
const MainStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: '#000',
                tabBarInactiveTintColor: '#999',
                tabBarLabelStyle: { fontSize: 12, fontWeight: 600 },
                tabBarIcon: ({ color }) => {
                    let iconName;
                    if (route.name === MainRoute.Home) iconName = 'home';
                    else if (route.name === MainRoute.History) iconName = 'time-outline';
                    else if (route.name === MainRoute.ScanProduct) iconName = 'scan';
                    else if (route.name === MainRoute.Bot) iconName = 'chatbubble-ellipses-outline';
                    else if (route.name === MainRoute.Account)
                        iconName = 'person-outline'
                    return <Ionicons name={iconName} size={22} color={color} />;
                },
            })}
        >
            <Tab.Screen name={MainRoute.Home} component={HomeScreen} />
            <Tab.Screen name={MainRoute.History} component={HistoryScreen} />
            <Tab.Screen name={MainRoute.ScanProduct} component={Scan} />
            <Tab.Screen name={MainRoute.Bot} component={BotScreen} />
            <Tab.Screen name={MainRoute.Account} component={AccountScreen} />
        </Tab.Navigator>

        
    )
};

const AppNavigation = () => {
  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={setIsNavigationReady}
      onStateChange={state => parseAndLogRoute(state as any)}
    >
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen
          name={RootRoutes.Splash}
          component={SplashScreen}
        />
        <RootStack.Screen
          name={RootRoutes.AuthStack}
          component={AuthStackNavigator}
        />
        <RootStack.Screen
          name={RootRoutes.MainTabs}
          component={MainStackScreen}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

const MainStackScreen: React.FC = () => {
    return (

            <MainStack.Navigator >
            <MainStack.Screen name="Tabs" component={MainTabs} options={{ headerShown: false }} />

        <MainStack.Screen
                name={MainRoute.ScanReport}
                component={ScanReport}
            />

        </MainStack.Navigator>
    );
}


export default AppNavigation;

const styles = StyleSheet.create({});
