import React, { useEffect } from "react";
import {
  TouchableOpacity,
  View,
  ScrollView,
  useWindowDimensions,
  StyleSheet,
} from "react-native";
import { Motorbike } from "../../../assets/svg";
import {
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from "../../../components";
import { appColor } from "../../../constants/appColor";
import { fontFamilies } from "../../../constants/fontFamilies";
import { globalStyle } from "../../../styles/globalStyle";
import { Vehicle } from "../../../types/vehicle.type";
import { getWarrantyRemaining } from "../../../utils/formatDate";
import { Fontisto } from "@expo/vector-icons";

interface Props {
  vehicles: Vehicle[];
  initialSelectedId?: number | string | null;
  onSelect?: (vehicle: Vehicle) => void;
  errorMessage?: string;
}

const ChooseVehicle = (props: Props) => {
  const { vehicles, initialSelectedId, onSelect, errorMessage } = props;
  const [isSelected, setIsSelected] = React.useState<number | string | null>(
    initialSelectedId ?? vehicles[0]?.id ?? null
  );

  useEffect(() => {
    if (
      (isSelected === null || isSelected === undefined) &&
      vehicles.length > 0
    ) {
      setIsSelected(vehicles[0].id);
    }
  }, [vehicles, isSelected]);

  const handleSelect = (v: Vehicle) => {
    setIsSelected(v.id);
    if (onSelect) {
      onSelect(v);
    }
  };

  const { height } = useWindowDimensions();
  const maxListHeight = Math.min(320, Math.floor(height * 0.35));

  return (
    <View>
      <SectionComponent styles={{ paddingHorizontal: 6 }}>
        <TextComponent
          text="Chọn xe"
          size={16}
          font={fontFamilies.roboto_regular}
          color={appColor.text}
        />
        <SpaceComponent height={8} />

        <View
          style={[
            styles.listContainer,
            globalStyle.shadow,
            {
              maxHeight: maxListHeight,
              backgroundColor: appColor.white,
              padding: 2,
              borderRadius: 8,
            },
          ]}
        >
          <ScrollView
            contentContainerStyle={{ paddingBottom: 8 }}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
            style={{ flexGrow: 0 }}
          >
            {vehicles.map((v) => {
              const selected = isSelected === v.id;
              const warranty = getWarrantyRemaining(v.warrantyExpiry);
              return (
                <TouchableOpacity
                  key={String(v.id)}
                  onPress={() => handleSelect(v)}
                  activeOpacity={0.85}
                >
                  <RowComponent
                    justify="flex-start"
                    styles={[
                      {
                        alignItems: "flex-start",
                        backgroundColor: selected
                          ? appColor.primary
                          : appColor.white,
                        padding: 14,
                        borderRadius: 12,
                        marginTop: 12,
                        borderWidth: 1,
                        borderColor: selected ? appColor.primary : "#E5E5E5",
                        shadowColor: "rgba(0,0,0,0.12)",
                        shadowOpacity: 0.25,
                        shadowOffset: { width: 0, height: 4 },
                        shadowRadius: 8,
                        elevation: selected ? 6 : 2,
                      },
                    ]}
                  >
                    <Fontisto
                      name="motorcycle"
                      size={30}
                      color={selected ? appColor.white : appColor.primary}
                      style={{ marginTop: 2 }}
                    />
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <TextComponent
                        text={v.modelName ?? "Không rõ"}
                        size={15}
                        color={selected ? appColor.white : appColor.text}
                        font={fontFamilies.roboto_medium}
                      />
                      <SpaceComponent height={6} />
                      <RowComponent justify="flex-start" styles={{ gap: 6 }}>
                        <TextComponent
                          text="Bảo hành:"
                          size={13}
                          color={selected ? appColor.white : appColor.gray2}
                          font={fontFamilies.roboto_regular}
                        />
                        <TextComponent
                          text={warranty.expired ? "Hết" : "Còn"}
                          size={13}
                          color={selected ? appColor.white : appColor.gray2}
                          font={fontFamilies.roboto_regular}
                        />
                      </RowComponent>
                    </View>
                  </RowComponent>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
        {/* {errorMessage && (
          <>
            <SpaceComponent height={4} />
            <TextComponent
              text={errorMessage}
              size={12}
              color={appColor.warning}
              font={fontFamilies.roboto_regular}
            />
          </>
        )} */}
      </SectionComponent>
    </View>
  );
};
export default ChooseVehicle;

const styles = StyleSheet.create({
  listContainer: {
    width: "100%",
  },
});
