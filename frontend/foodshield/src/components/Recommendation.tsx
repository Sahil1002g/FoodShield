import { View, Text } from 'react-native'
import React from 'react'

const getColor = (reco: string) => {
  switch (reco?.toLowerCase()) {
    case "highly recommended": return "#00FF00";
    case "moderately safe": return "#FFA500";
    case "not recommended": return "#FF0000";
    default: return "#999";
  }
};

const Recommendation = ({ product }: any) => {
  return (
    <View className="h-10 bg-[#efe9e2] my-4 mx-3 rounded-xl flex justify-center " >
        <View className='flex flex-row justify-between px-6'>
            <Text style={{
        backgroundColor: getColor(product.recommendation),
      }} className="rounded-xl h-6 w-[170px] text-center">{product.recommendation}</Text>
        <Text className='pr-6'>
           100g
        </Text>
        </View>
        
      </View>
  )
}

export default Recommendation