import React from "react";
import { View, Text } from "react-native";

const getColor = (grade: string) => {
  if (grade=="unknown") grade='e'
  switch (grade?.toLowerCase()) {
    case "a": return "#2ecc71";
    case "b": return "#27ae60";
    case "c": return "#f1c40f";
    case "d": return "#e67e22";
    case "e": return "#e74c3c";
    default: return "#999";
  }
};

const ScoreBadge = ({ grade }: { grade: string }) => {
  return (
    <View
      style={{
        backgroundColor: getColor(grade),
      }}
      className="px-2 py-2 rounded-full w-10 flex items-center justify-end"
    >
      <Text className="text-white font-bold text-lg">
        {grade.toLowerCase() =="unknown" ?(<Text>E</Text>):(<Text>{grade?.toUpperCase()}</Text>)}
      </Text>
    </View>
  );
};

export default ScoreBadge;
