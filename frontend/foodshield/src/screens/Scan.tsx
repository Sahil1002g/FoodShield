// import { StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native'
// import React, { useEffect, useRef } from 'react'
// import { useCameraDevices, Camera } from 'react-native-vision-camera'

// const Scan = () => {
//   const devices = useCameraDevices();
//   const device = devices.find(d => d.position === 'back');
//   const camera = useRef(null);
//   const [imgData,setImgData]=React.useState<string|null>(null);
//   const [clickPicClicked,setClickPicClicked]=React.useState<boolean>(false);

//   useEffect(()=>{
//      checkPermission();
//   },[]);
//   const checkPermission = async()=>{
//     const newCameraPermission = await Camera.requestCameraPermission();
    
//     console.log("Camera permission: ",newCameraPermission);
//   };

//   if (device == null) return <View><Text>Loading Camera...</Text></View>;

//   const takePicture = async()=>{
//     if (!camera !=null){
//     const photo= await camera.current.takePhoto({flash:'off'});
//     setImgData(photo.path);
//     console.log("Photo taken: ",photo.path);
//     }
//   };

//   return (
//     <View style={{flex:1}}>
//       {clickPicClicked ? (<View style={{flex:1}}>
//       <Camera 
//         ref={camera}
//         style={StyleSheet.absoluteFill}
//         device={device}
//         isActive={true}
//         photo={true}
//       />
//       <TouchableOpacity style={{position:'absolute',bottom:50,alignSelf:'center',backgroundColor:'white',padding:20,borderRadius:50}} className='' onPress={takePicture}></TouchableOpacity>
//       </View>) : (<View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
//         <Text style={{fontSize:18,fontWeight:'bold',marginBottom:20}}>Click below to scan product barcode</Text>
//       </View>)}
      
      
//     </View>
//   )
// }

// export default Scan

// const styles = StyleSheet.create({})





import React, { useEffect, useRef } from "react";
import { View, Text } from "react-native";
import {
  Camera,
  useCameraDevices,
  useCodeScanner,
} from "react-native-vision-camera";
import { useNavigation } from "@react-navigation/native";
import { MainRoute } from "../navigation/Routes";

export default function Scan() {
  const camera = useRef<Camera>(null);
  const navigation = useNavigation<any>();

  const devices = useCameraDevices();
  const device = devices.find((d) => d.position === "back");

  useEffect(() => {
    (async () => {
      await Camera.requestCameraPermission();
    })();
  }, []);

  const codeScanner = useCodeScanner({
    codeTypes: ["ean-13"],
    onCodeScanned: (codes) => {
      if (codes.length > 0) {
        const barcode = codes[0].value;

        if (barcode) {
          console.log("SCANNED BARCODE:", barcode);

          
          navigation.navigate(MainRoute.ScanReport,{
            barcode
          });
        }
      }
    },
  });

  if (!device) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading camera...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <Camera
        ref={camera}
        style={{ flex: 1 }}
        device={device}
        isActive={true}
        codeScanner={codeScanner}
      />
    </View>
  );
}
