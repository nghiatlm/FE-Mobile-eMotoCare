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
              return (
                <TouchableOpacity
                  key={String(v.id)}
                  onPress={() => handleSelect(v)}
                  activeOpacity={0.8}
                >
                  <RowComponent
                    justify="flex-start"
                    styles={[
                      globalStyle.shadow,
                      {
                        alignItems: "flex-start",
                        backgroundColor: selected
                          ? appColor.primary
                          : appColor.white,
                        padding: 12,
                        borderRadius: 8,
                        marginTop: 12,
                        borderWidth: 1,
                        borderColor: selected ? appColor.primary : "#EEE",
                      },
                    ]}
                  >
                    <Motorbike width={52} height={56} />
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <TextComponent
                        text={v.modelName ?? "Không rõ"}
                        size={14}
                        color={selected ? appColor.white : appColor.text}
                        font={fontFamilies.roboto_medium}
                      />
                      <SpaceComponent height={4} />
                      <RowComponent justify="flex-start">
                        <TextComponent
                          text="Bảo hành:"
                          size={14}
                          color={selected ? appColor.white : appColor.gray2}
                          font={fontFamilies.roboto_regular}
                        />
                        <TextComponent
                          text={
                            getWarrantyRemaining(v.warrantyExpiry).expired
                              ? "Hết hạn"
                              : `Còn ${
                                  getWarrantyRemaining(v.warrantyExpiry)
                                    .formatted
                                }`
                          }
                          size={14}
                          color={selected ? appColor.white : appColor.gray2}
                          font={fontFamilies.roboto_regular}
                          styles={{ marginLeft: 6 }}
                        />
                      </RowComponent>
                    </View>
                  </RowComponent>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
        {errorMessage && (
          <>
            <SpaceComponent height={4} />
            <TextComponent
              text={errorMessage}
              size={12}
              color={appColor.warning}
              font={fontFamilies.roboto_regular}
            />
          </>
        )}
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
