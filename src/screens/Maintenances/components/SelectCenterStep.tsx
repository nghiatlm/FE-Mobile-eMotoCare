import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from "../../../components";
import { appColor } from "../../../constants/appColor";
import { fontFamilies } from "../../../constants/fontFamilies";
import { getServiceCenter } from "../../../services/serviceCenter.service";

const parseDistance = (d?: string) => {
  if (!d) return Infinity;
  const s = d.toString().toLowerCase().trim();
  const normalized = s.replace(/\s+/g, "").replace(",", ".");
  const match = normalized.match(/^([\d.]+)(km|m)$/);
  if (!match) return Infinity;
  const num = parseFloat(match[1]);
  if (isNaN(num)) return Infinity;
  const unit = match[2];
  return unit === "km" ? num * 1000 : num;
};

const renderStars = (rating: number) => {
  const stars: React.ReactNode[] = [];
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;
  const empty = 5 - full - (hasHalf ? 1 : 0);

  for (let i = 0; i < full; i++) {
    stars.push(
      <MaterialIcons
        key={`full-${i}`}
        name="star"
        size={14}
        color={appColor.warning}
        style={{ marginRight: 2 }}
      />
    );
  }
  if (hasHalf) {
    stars.push(
      <MaterialIcons
        key="half"
        name="star-half"
        size={14}
        color={appColor.warning}
        style={{ marginRight: 2 }}
      />
    );
  }
  for (let i = 0; i < empty; i++) {
    stars.push(
      <MaterialIcons
        key={`empty-${i}`}
        name="star-border"
        size={14}
        color={appColor.gray2}
        style={{ marginRight: 2 }}
      />
    );
  }
  return stars;
};

const SelectCenterStep = ({ state, dispatch, onSelectCenter }: any) => {
   const [serviceCenter, setServiceCenter] = useState<any[]>([]);
   const [loading, setLoading] = useState(false);

   useEffect(() => {
     fetchServiceCenter();
   }, []);

   const fetchServiceCenter = async () => {
     try {
       setLoading(true);
       const params = {
         page: 1,
         pageSize: 10,
       };

       const result = await getServiceCenter(params);
       // keep a console for debugging
       console.log("API result: ", result);

       if (result?.success) {
         setServiceCenter(result.data.rowDatas || []);
       } else {
         console.log("Fetch error:", result?.message || "Unknown error");
         setServiceCenter([]);
       }
     } catch (err) {
       console.log("API call failed:", err);
       setServiceCenter([]);
     } finally {
       setLoading(false);
     }
   };

   const bestId = useMemo(() => {
     if (!serviceCenter.length) return null;
     const best = serviceCenter.reduce((bestSoFar, cur) => {
       return parseDistance(cur.distance) < parseDistance(bestSoFar.distance)
         ? cur
         : bestSoFar;
     }, serviceCenter[0]);
     return best?.id ?? null;
   }, [serviceCenter]);

   return (
     <View>
       <SectionComponent styles={{ alignItems: "center", marginTop: 20 }}>
         <TextComponent
           text="Chọn trung tâm bảo dưỡng"
           size={20}
           font={fontFamilies.roboto_medium}
           color={appColor.text}
         />
         <TextComponent
           text="Tìm trung tâm gần bạn nhất"
           color={appColor.gray2}
           font={fontFamilies.roboto_regular}
           size={18}
           styles={{ marginTop: 10 }}
         />
       </SectionComponent>

       <SpaceComponent height={15} />

       {loading ? (
         <SectionComponent styles={{ alignItems: "center", marginTop: 20 }}>
           <TextComponent
             text="Đang tải trung tâm..."
             size={18}
             color={appColor.gray2}
           />
         </SectionComponent>
       ) : serviceCenter.length === 0 ? (
         <SectionComponent styles={{ alignItems: "center", marginTop: 20 }}>
           <TextComponent
             text="Không tìm thấy trung tâm nào."
             size={16}
             color={appColor.gray2}
           />
         </SectionComponent>
       ) : (
         serviceCenter.map((item) => {
           const selected = state.serviceCenterId === item.id;
           const isBest = item.id === bestId;
           return (
             <TouchableOpacity
               key={item.id}
               onPress={() => {
                 dispatch({
                   type: "SET",
                   payload: { serviceCenterId: item.id },
                 });
                 // notify parent — parent will advance to step 1
                 onSelectCenter?.(item);
               }}
               style={[
                 styles.item,
                 {
                   borderColor: selected ? appColor.primary : "#EAEAEA",
                   borderWidth: selected ? 2 : 1,
                   backgroundColor: selected ? "#FBFDFF" : "#FFFFFF",
                 },
               ]}
             >
               <View style={styles.left}>
                 <TextComponent
                   text={item.name}
                   size={18}
                   font={fontFamilies.roboto_medium}
                   color={appColor.text}
                 />
                 <SpaceComponent height={6} />
                 <RowComponent justify="flex-start">
                   <TextComponent
                     text="Địa chỉ: "
                     size={14}
                     font={fontFamilies.roboto_regular}
                     color={appColor.text}
                     styles={{ flexShrink: 0 }}
                   />
                    <TextComponent
                      text={item.address}
                      size={14}
                      font={fontFamilies.roboto_regular}
                      color={appColor.text}
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      styles={{
                        marginLeft: 12,
                        flex: 1,
                      }}
                    />
                 </RowComponent>
                 <SpaceComponent height={6} />
                 <View style={styles.metaRow}>
                   <View style={{ flexDirection: "row", alignItems: "center" }}>
                     {renderStars(item.rating || 4)}
                   </View>
                   <View style={{ width: 12 }} />
                   <TextComponent
                     text={(item.rating || 4).toFixed(1)}
                     size={14}
                     color={appColor.gray2}
                   />
                   <View style={{ width: 8 }} />
                   <TextComponent
                     text={item.distance || "1km"}
                     size={14}
                     color={appColor.gray2}
                   />
                 </View>
               </View>

                  {isBest ? (
                    <View style={styles.badgeWrapper}>
                      <View style={styles.badge}>
                        <TextComponent
                          text="Lựa chọn tốt nhất"
                          size={12}
                          font={fontFamilies.roboto_medium}
                          color={appColor.white}
                        />
                      </View>
                    </View>
                  ) : null}

                  {/* selection radio on right */}
                  <View style={styles.selectWrapper} accessible accessibilityRole="button" accessibilityState={{ selected }}>
                    <View style={[styles.radio, selected && styles.radioSelected]}>
                      {selected && (
                        <MaterialIcons name="check" size={14} color={appColor.white} />
                      )}
                    </View>
                  </View>
             </TouchableOpacity>
           );
         })
       )}
     </View>
   );
};

const styles = StyleSheet.create({
  item: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  left: {
    flex: 1,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  badgeWrapper: {
    marginLeft: 12,
    position: "absolute",
    top: 8,
    right: 12,
  },
  badge: {
    backgroundColor: appColor.primary,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 100,
  },
  placeholder: {
    width: 12,
  },
  selectWrapper: {
    width: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  radio: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: "#E0E0E0",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: appColor.white,
  },
  radioSelected: {
    backgroundColor: appColor.primary,
    borderColor: appColor.primary,
  },
});

export default SelectCenterStep;
