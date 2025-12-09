import { FontAwesome } from "@expo/vector-icons";
import { appColor } from "../constants/appColor";
import { globalStyle } from "../styles/globalStyle";
import RowComponent from "./containers/RowComponent";
import SectionComponent from "./containers/SectionComponent";
import { View } from "react-native";
import TextComponent from "./ui/TextComponent";
import { fontFamilies } from "../constants/fontFamilies";

const ConfirmCard = ({
  icon,
  title,
  line1,
  line2,
}: {
  icon: any;
  title: string;
  line1: string;
  line2?: string;
}) => {
  return (
    <SectionComponent
      styles={[
        globalStyle.shadow,
        {
          backgroundColor: appColor.white,
          borderRadius: 12,
          padding: 18,
          borderWidth: 0.3,
          borderColor: "#E5E5E5",
        },
      ]}
    >
      <RowComponent styles={{ alignItems: "flex-start", gap: 14 }} justify="flex-start">
        <FontAwesome name={icon} size={24} color={appColor.primary} />

        <View style={{ gap: 4 }}>
          <TextComponent
            text={title}
            size={16}
            font={fontFamilies.roboto_medium}
            color={appColor.text}
          />

          <TextComponent text={line1} size={15} color={appColor.text} />

          {line2 && (
            <TextComponent text={line2} size={14} color={appColor.gray2} />
          )}
        </View>
      </RowComponent>
    </SectionComponent>
  );
};

export default ConfirmCard;
