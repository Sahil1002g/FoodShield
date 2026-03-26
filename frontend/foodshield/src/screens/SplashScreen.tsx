import React, { useEffect } from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootRoutes } from '../navigation/Routes';
import { images } from '../assets/images';

const { height, width } = Dimensions.get('window');

const SplashScreen = ({ navigation }: any) => {
  useEffect(() => {
    let timer: NodeJS.Timeout;

    const checkAuth = async () => {
      try {
        // await AsyncStorage.clear();
        const token = await AsyncStorage.getItem('userToken');
        const isLoggedIn = false;     // !!token

        timer = setTimeout(() => {
          navigation.replace(
            isLoggedIn ? RootRoutes.MainTabs : RootRoutes.AuthStack
          );
        }, 1000);
      } catch (error) {
        navigation.replace(RootRoutes.AuthStack);
      }
    };

    checkAuth();

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={images.logo} style={styles.logo} />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5f7f99',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: width * 0.7,
    height: height * 0.7,
    resizeMode: 'contain',
  },
});
