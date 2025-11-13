import React, { useEffect, useRef } from "react";
import { ScrollView, TouchableOpacity, View, StyleSheet, Animated, ActivityIndicator } from "react-native";
import {
  SectionComponent,
  RowComponent,
  SpaceComponent,
  TextComponent,
  ButtonComponent,
} from "../../../components";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { appColor } from "../../../constants/appColor";
import { fontFamilies } from "../../../constants/fontFamilies";
import { statusLabel } from "../../../utils/generateStatus";

interface Props {
  displayed: any[];
  selectedMaintenance: number;
  setSelectedMaintenance: (n: number) => void;
  mainDetailId: string | number | null;
  setMainDetailId: (v: string | number | null) => void;
  navigation: any;
  loading?: boolean;
}

const MaintenanceSection: React.FC<Props> = ({
  displayed,
  selectedMaintenance,
  setSelectedMaintenance,
  mainDetailId,
  setMainDetailId,
  navigation,
  loading,
}) => {
  // animated scales for pills
  const scalesRef = useRef<Animated.Value[]>([]);

  // ensure scalesRef length matches displayed
  useEffect(() => {
    scalesRef.current = displayed.map((_, i) => scalesRef.current[i] ?? new Animated.Value(i === selectedMaintenance ? 1.06 : 1));
  }, [displayed]);

  // set preferred selected index: prefer UPCOMING; if none, pick SUCCESS/COMPLETED closest to today
  // BUT: respect the `selectedMaintenance` index passed by the parent — only auto-select
  // when that index is invalid (out of range / missing)
  useEffect(() => {
    if (!Array.isArray(displayed) || displayed.length === 0) return;

    // If parent provided a valid selectedMaintenance index, keep it as default
    if (typeof selectedMaintenance === "number" && displayed[selectedMaintenance]) {
      // ensure mainDetailId is in sync
      setMainDetailId(displayed[selectedMaintenance]?.maintenanceId ?? null);
      return;
    }

    // try UPCOMING first
    const upcomingIdx = displayed.findIndex((d) => String(d.status).toUpperCase() === "UPCOMING");
    if (upcomingIdx >= 0) {
      setSelectedMaintenance(upcomingIdx);
      setMainDetailId(displayed[upcomingIdx]?.maintenanceId ?? null);
      return;
    }

    // fallback: find SUCCESS / COMPLETED items and choose the one nearest to today
    const successCandidates: { idx: number; dateValue: number | null }[] = [];
    const now = Date.now();
    displayed.forEach((d, i) => {
      const st = String(d.status).toUpperCase();
      if (st === "SUCCESS" || st === "COMPLETED") {
        const rawDate = d?.raw?.dateOfImplementation ?? d?.raw?.date ?? null;
        let dateValue: number | null = null;
        if (rawDate) {
          const parsed = new Date(rawDate);
          if (!isNaN(parsed.getTime())) dateValue = parsed.getTime();
        }
        successCandidates.push({ idx: i, dateValue });
      }
    });

    if (successCandidates.length > 0) {
      // prefer candidate with closest absolute date to now; if some have null date, push them to end
      successCandidates.sort((a, b) => {
        const aDiff = a.dateValue == null ? Number.MAX_SAFE_INTEGER : Math.abs((a.dateValue as number) - now);
        const bDiff = b.dateValue == null ? Number.MAX_SAFE_INTEGER : Math.abs((b.dateValue as number) - now);
        return aDiff - bDiff;
      });
      const chosen = successCandidates[0];
      setSelectedMaintenance(chosen.idx);
      setMainDetailId(displayed[chosen.idx]?.maintenanceId ?? null);
      return;
    }

    // otherwise default to first item
    setSelectedMaintenance(0);
    setMainDetailId(displayed[0]?.maintenanceId ?? null);
  }, [displayed, selectedMaintenance, setSelectedMaintenance, setMainDetailId]);

  useEffect(() => {
    // animate scales when selection changes
    const animations = scalesRef.current.map((val, i) =>
      Animated.timing(val, {
        toValue: i === selectedMaintenance ? 1.06 : 1,
        duration: 180,
        useNativeDriver: true,
      })
    );
    Animated.parallel(animations).start();
  }, [selectedMaintenance]);
  return (
    <SectionComponent
      styles={[
        {
          backgroundColor: appColor.white,
          padding: 12,
          borderRadius: 14,
          marginHorizontal: 8,
        },
      ]}
    >
      <View>
        <RowComponent justify="space-between" styles={{ alignItems: 'center' }}>
          <TextComponent
            text="Bảo dưỡng định kỳ"
            title
            font={fontFamilies.roboto_bold}
            color={appColor.primary}
          />
          <ButtonComponent
            text="Xem tất cả"
            type="link"
            onPress={() => {
              // optionally navigate to maintenance list
            }}
            styles={{ paddingHorizontal: 0 }}
          />
        </RowComponent>
        <View style={styles.line} />

        {loading ? (
          <View style={{ paddingVertical: 18, alignItems: 'center' }}>
            <ActivityIndicator size="small" color={appColor.primary} />
          </View>
        ) : displayed.length > 0 ? (
          <>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 8, paddingHorizontal: 4 }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {displayed.map((item: any, idx: number) => {
                  const selected = selectedMaintenance === idx;
                  const scale = scalesRef.current[idx] ?? new Animated.Value(1);
                  return (
                    <Animated.View key={item.maintenanceId ?? idx} style={{ transform: [{ scale }], marginRight: 10 }}>
                      <TouchableOpacity
                        onPress={() => {
                          setSelectedMaintenance(idx);
                          setMainDetailId(item.maintenanceId ?? null);
                        }}
                        activeOpacity={0.9}
                        style={[styles.pillWrap, selected && styles.pillSelected]}
                      >
                        <View style={[styles.pillCircle, { backgroundColor: item.pillColor }]}> 
                          <Ionicons name="car" size={14} color="#fff" />
                        </View>
                        <TextComponent text={item.title} size={12} styles={{ marginTop: 8, textAlign: 'center', width: 84 }} />
                      </TouchableOpacity>
                    </Animated.View>
                  );
                })}
              </View>
            </ScrollView>

            <SpaceComponent height={12} />
            {displayed[selectedMaintenance] ? (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <TextComponent text={displayed[selectedMaintenance].title} size={18} font={fontFamilies.roboto_bold} />
                  <TextComponent text={displayed[selectedMaintenance].date} size={12} color={appColor.gray} />
                </View>
                <TextComponent text={displayed[selectedMaintenance].raw?.description ?? ''} size={14} color={appColor.text} styles={{ marginTop: 8 }} />
                <RowComponent justify="space-between" styles={{ marginTop: 12, alignItems: 'center' }}>
                  <View>
                    <TextComponent text="Trạng thái" size={12} color={appColor.gray} />
                    <TextComponent text={statusLabel(displayed[selectedMaintenance].status)} size={14} font={fontFamilies.roboto_bold} styles={{ marginTop: 4 }} />
                  </View>
                  <ButtonComponent
                    text="Chi tiết"
                    type="primary"
                    onPress={() => {
                      const maintenanceStageId = displayed[selectedMaintenance]?.maintenanceStageId ?? mainDetailId;
                      const stage = displayed[selectedMaintenance]?.id;
                      if (!maintenanceStageId) {
                        console.warn("No maintenance id to navigate");
                        return;
                      }
                      navigation.navigate("MaintenanceDetail", { maintenanceStageId, stage });
                    }}
                    styles={{ paddingHorizontal: 12 }}
                  />
                </RowComponent>
              </View>
            ) : (
              <TextComponent text="Không có lịch bảo dưỡng" size={14} />
            )}
          </>
        ) : (
          <TextComponent text="Không có lịch bảo dưỡng" size={14} />
        )}
        <SpaceComponent height={12} />
      </View>
    </SectionComponent>
  );
};

export default MaintenanceSection;

const styles = StyleSheet.create({
  line: {
    height: 1.2,
    backgroundColor: appColor.gray,
    marginVertical: 8,
  },
  maintenanceStatus: {
    height: 20,
    width: 46,
    backgroundColor: appColor.primary,
    borderRadius: 20,
  },
  pillWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    marginRight: 10,
    width: 90,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
  },
  pillCircle: {
    width: 36,
    height: 36,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pillSelected: {
    elevation: 6,
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    transform: [{ scale: 1.02 }],
  },
  hiddenText: {
    height: 0,
    width: 0,
    opacity: 0,
  },
  card: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
