import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


type StepKey = "booked" | "arrived" | "loaded" | "transit" | "delivered";

type TimelineStep = {
    key: StepKey;
    title: string;
    subtitle: string;
    timeText?: string;     // right side time
    etaText?: string;      // right side ETA
};

type JobDetailsData = {
    statusPill: string; // "On time"
    currentStep: StepKey; // active step highlight
    steps: TimelineStep[];

    driver: {
        name: string;
        rating: number;
        vehicleLine: string; // "Volvo FH16 • KX-942-L"
        avatar?: string;
    };

    vehicle: {
        model: string;
        plate: string;
        trailerType: string;
        weight: string;
    };

    route: {
        pickup: string;
        dropoff: string;
    };
};

const GREEN = "#43B047";
const BG = "#F6F7F9";
const TEXT = "#111827";
const MUTED = "#8B95A1";
const CARD = "#FFFFFF";

const demo: JobDetailsData = {
    statusPill: "On time",
    currentStep: "transit",
    steps: [
        {
            key: "booked",
            title: "Booked",
            subtitle: "Order confirmed details verified.",
            timeText: "Oct 12, 6:00 AM",
        },
        {
            key: "arrived",
            title: "Driver Arrived",
            subtitle: "Order confirmed details verified.",
            timeText: "Oct 12, 7:15 AM",
        },
        {
            key: "loaded",
            title: "Loaded",
            subtitle: "Order confirmed details verified.",
            timeText: "Oct 12, 8:00 AM",
        },
        {
            key: "transit",
            title: "In Transit",
            subtitle: "Currently on I-55 South heading towards St. Louis.",
            etaText: "Est 2:30 PM",
        },
        {
            key: "delivered",
            title: "Delivered",
            subtitle: "Pending arrival.",
        },
    ],
    driver: {
        name: "Bessie Lora",
        rating: 4.9,
        vehicleLine: "Volvo FH16 • KX-942-L",
        // avatar: "https://..." // চাইলে বসাতে পারো
    },
    vehicle: {
        model: "Volvo VNL 860",
        plate: "CA 55829",
        trailerType: "53' Dry Van",
        weight: "42,000 lbs",
    },
    route: {
        pickup: "New York, NY",
        dropoff: "2045 Lodgeville Road, Eagan, MN",
    },
};

const UserActiveJobsDetails =({ navigation }: any)=> {
    const data = demo;

    const stepIndex = useMemo(() => {
        const keys = data.steps.map((s) => s.key);
        return keys.indexOf(data.currentStep);
    }, [data]);

    return (
        <SafeAreaView style={styles.safe}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation?.goBack?.()}
                    activeOpacity={0.8}
                    style={styles.backBtn}
                >
                    <Ionicons name="chevron-back" size={22} color={TEXT} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Job Details</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                {/* Map Preview */}
                <View style={styles.mapBox}>
                    {/* Placeholder "Map" */}
                    <View style={styles.fakeMap}>
                        <MaterialCommunityIcons name="map-marker-radius" size={36} color="#C8D0DB" />
                        <Text style={styles.fakeMapText}>Map Preview</Text>
                    </View>

                    <View style={styles.mapOverlayRow}>
                        <View style={styles.livePill}>
                            <View style={styles.dot} />
                            <Text style={styles.livePillText}>Live Tracking</Text>
                        </View>

                        <TouchableOpacity style={styles.viewMapBtn} activeOpacity={0.85} onPress={() => { }}>
                            <Ionicons name="map-outline" size={18} color={MUTED} />
                            <Text style={styles.viewMapText}>View Map</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Status Card */}
                <View style={styles.card}>
                    <View style={styles.cardHeaderRow}>
                        <Text style={styles.cardTitle}>Status</Text>
                        <View style={styles.statusPill}>
                            <Text style={styles.statusPillText}>{data.statusPill}</Text>
                        </View>
                    </View>

                    <View style={{ marginTop: 10 }}>
                        {data.steps.map((step, i) => {
                            const isDone = i < stepIndex;
                            const isCurrent = i === stepIndex;

                            return (
                                <TimelineItem
                                    key={step.key}
                                    step={step}
                                    isDone={isDone}
                                    isCurrent={isCurrent}
                                    isLast={i === data.steps.length - 1}
                                />
                            );
                        })}
                    </View>
                </View>

                {/* Driver Details */}
                <View style={styles.card}>
                    <Text style={styles.sectionLabel}>DRIVER DETAILS</Text>

                    <View style={styles.driverRow}>
                        <View style={styles.avatarWrap}>
                            {data.driver.avatar ? (
                                <Image source={{ uri: data.driver.avatar }} style={styles.avatar} />
                            ) : (
                                <Ionicons name="person" size={26} color="#9AA4B2" />
                            )}
                        </View>

                        <View style={{ flex: 1 }}>
                            <View style={styles.driverNameRow}>
                                <Text style={styles.driverName}>{data.driver.name}</Text>
                                <View style={styles.ratingRow}>
                                    <Ionicons name="star" size={14} color="#F4B400" />
                                    <Text style={styles.ratingText}>{data.driver.rating.toFixed(1)}</Text>
                                </View>
                            </View>
                            <Text style={styles.driverSub}>{data.driver.vehicleLine}</Text>
                        </View>
                    </View>
                </View>

                {/* Vehicle Info */}
                <View style={styles.card}>
                    <View style={styles.vehicleHeader}>
                        <Text style={styles.sectionLabel}>VEHICLE INFO</Text>
                        <View style={styles.vehicleIconPill}>
                            <MaterialCommunityIcons name="truck-outline" size={18} color="#2F80ED" />
                        </View>
                    </View>

                    <View style={styles.vehicleGrid}>
                        <InfoCell label="Vehicle Model" value={data.vehicle.model} />
                        <InfoCell label="License Plate" value={data.vehicle.plate} pill />
                        <InfoCell label="Trailer Type" value={data.vehicle.trailerType} />
                        <InfoCell label="Weight" value={data.vehicle.weight} />
                    </View>
                </View>

                {/* Route Details */}
                <View style={styles.card}>
                    <Text style={styles.sectionLabel}>Route Details</Text>

                    <View style={{ marginTop: 12 }}>
                        <RouteRow
                            title="PICKUP LOCATION"
                            icon={<Ionicons name="radio-button-on" size={18} color="#F59E0B" />}
                            value={data.route.pickup}
                        />

                        <View style={styles.routeDivider} />

                        <RouteRow
                            title="DROP-OFF LOCATION"
                            icon={<Ionicons name="flag" size={18} color={GREEN} />}
                            value={data.route.dropoff}
                        />
                    </View>
                </View>

                <View style={{ height: 30 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

function TimelineItem({
    step,
    isDone,
    isCurrent,
    isLast,
}: {
    step: TimelineStep;
    isDone: boolean;
    isCurrent: boolean;
    isLast: boolean;
}) {
    const dotStyle = isDone ? styles.dotDone : isCurrent ? styles.dotCurrent : styles.dotPending;
    const lineStyle = isDone ? styles.lineDone : styles.linePending;

    return (
        <View style={styles.timelineRow}>
            <View style={styles.timelineLeft}>
                <View style={[styles.dotBase, dotStyle]}>
                    {isDone && <Ionicons name="checkmark" size={14} color="#fff" />}
                </View>
                {!isLast && <View style={[styles.line, lineStyle]} />}
            </View>

            <View style={styles.timelineBody}>
                <View style={styles.timelineTopRow}>
                    <Text style={[styles.stepTitle, isCurrent && { color: GREEN }]}>{step.title}</Text>

                    {!!(step.timeText || step.etaText) && (
                        <Text style={[styles.stepRight, step.etaText ? { color: "#F59E0B" } : null]}>
                            {step.etaText ?? step.timeText}
                        </Text>
                    )}
                </View>

                <Text style={[styles.stepSub, isCurrent && { color: "#5B6472" }]}>{step.subtitle}</Text>
            </View>
        </View>
    );
}

function InfoCell({ label, value, pill }: { label: string; value: string; pill?: boolean }) {
    return (
        <View style={styles.infoCell}>
            <Text style={styles.infoLabel}>{label}</Text>
            {pill ? (
                <View style={styles.platePill}>
                    <Text style={styles.plateText}>{value}</Text>
                </View>
            ) : (
                <Text style={styles.infoValue}>{value}</Text>
            )}
        </View>
    );
}

function RouteRow({
    title,
    icon,
    value,
}: {
    title: string;
    icon: React.ReactNode;
    value: string;
}) {
    return (
        <View style={styles.routeRow}>
            <View style={styles.routeIconCol}>{icon}</View>
            <View style={{ flex: 1 }}>
                <Text style={styles.routeTitle}>{title}</Text>
                <View style={styles.routeInputLike}>
                    <Text numberOfLines={1} style={styles.routeValue}>
                        {value}
                    </Text>
                </View>
            </View>
        </View>
    );
}

export default UserActiveJobsDetails;

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: BG },

    header: {
        height: 56,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 14,
        justifyContent: "space-between",
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    headerTitle: { fontSize: 20, fontWeight: "800", color: TEXT },

    content: { paddingHorizontal: 16, paddingBottom: 30 },

    mapBox: {
        borderRadius: 18,
        overflow: "hidden",
        backgroundColor: "#EAF0F6",
        marginTop: 6,
        marginBottom: 14,
    },
    fakeMap: {
        height: 170,
        alignItems: "center",
        justifyContent: "center",
    },
    fakeMapText: { marginTop: 6, color: "#A6B0BE", fontWeight: "700" },

    mapOverlayRow: {
        position: "absolute",
        left: 12,
        right: 12,
        top: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    livePill: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingHorizontal: 12,
        height: 34,
        borderRadius: 999,
        backgroundColor: "rgba(255,255,255,0.92)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.6)",
    },
    dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: GREEN },
    livePillText: { fontWeight: "800", color: TEXT, fontSize: 13 },

    viewMapBtn: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingHorizontal: 14,
        height: 36,
        borderRadius: 999,
        backgroundColor: "rgba(255,255,255,0.92)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.6)",
    },
    viewMapText: { fontWeight: "800", color: MUTED, fontSize: 13 },

    card: {
        backgroundColor: CARD,
        borderRadius: 18,
        padding: 14,
        marginBottom: 14,
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOpacity: 0.06,
                shadowRadius: 14,
                shadowOffset: { width: 0, height: 10 },
            },
            android: { elevation: 2 },
        }),
    },

    cardHeaderRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    cardTitle: { fontSize: 16, fontWeight: "900", color: TEXT },

    statusPill: {
        height: 26,
        paddingHorizontal: 10,
        borderRadius: 999,
        backgroundColor: "#E9F7EA",
        alignItems: "center",
        justifyContent: "center",
    },
    statusPillText: { color: GREEN, fontWeight: "900", fontSize: 12 },

    timelineRow: { flexDirection: "row", gap: 12, paddingVertical: 10 },
    timelineLeft: { width: 28, alignItems: "center" },

    dotBase: {
        width: 22,
        height: 22,
        borderRadius: 11,
        alignItems: "center",
        justifyContent: "center",
    },
    dotDone: { backgroundColor: GREEN },
    dotCurrent: { backgroundColor: "#FFFFFF", borderWidth: 3, borderColor: GREEN },
    dotPending: { backgroundColor: "#FFFFFF", borderWidth: 3, borderColor: "#F59E0B" },

    line: { width: 2, flex: 1, marginTop: 6, borderRadius: 1 },
    lineDone: { backgroundColor: GREEN },
    linePending: { backgroundColor: "#CFE6CF" },

    timelineBody: { flex: 1 },
    timelineTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    stepTitle: { fontSize: 14, fontWeight: "900", color: TEXT },
    stepRight: { fontSize: 12, fontWeight: "800", color: "#A0A8B3" },
    stepSub: { marginTop: 4, fontSize: 12, fontWeight: "600", color: "#B0B8C3" },

    sectionLabel: {
        fontSize: 12,
        fontWeight: "900",
        letterSpacing: 0.6,
        color: TEXT,
        textTransform: "uppercase",
    },

    driverRow: {
        marginTop: 12,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        backgroundColor: "#F6F7F9",
        borderRadius: 16,
        padding: 12,
    },
    avatarWrap: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "#E9EDF3",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
    },
    avatar: { width: 44, height: 44 },
    driverNameRow: { flexDirection: "row", alignItems: "center", gap: 10 },
    driverName: { fontSize: 15, fontWeight: "900", color: TEXT },
    ratingRow: { flexDirection: "row", alignItems: "center", gap: 4 },
    ratingText: { fontSize: 13, fontWeight: "900", color: TEXT },
    driverSub: { marginTop: 4, fontSize: 12, fontWeight: "700", color: MUTED },

    vehicleHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    vehicleIconPill: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: "#EAF2FF",
        alignItems: "center",
        justifyContent: "center",
    },

    vehicleGrid: {
        marginTop: 12,
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
    },
    infoCell: {
        width: "47%",
        minHeight: 52,
    },
    infoLabel: { fontSize: 12, fontWeight: "700", color: "#A0A8B3" },
    infoValue: { marginTop: 6, fontSize: 14, fontWeight: "900", color: TEXT },
    platePill: {
        marginTop: 8,
        alignSelf: "flex-start",
        paddingHorizontal: 10,
        height: 28,
        borderRadius: 999,
        backgroundColor: "#F0F2F5",
        justifyContent: "center",
    },
    plateText: { fontWeight: "900", color: TEXT, fontSize: 13 },

    routeRow: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
    routeIconCol: { width: 22, alignItems: "center", paddingTop: 18 },
    routeTitle: { fontSize: 11, fontWeight: "900", color: TEXT, letterSpacing: 0.5 },
    routeInputLike: {
        marginTop: 8,
        height: 42,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: "#E6EAF0",
        backgroundColor: "#FBFCFD",
        paddingHorizontal: 14,
        justifyContent: "center",
    },
    routeValue: { fontSize: 13, fontWeight: "800", color: TEXT },
    routeDivider: {
        height: 22,
        marginLeft: 10,
        borderLeftWidth: 2,
        borderLeftColor: "#CFE6CF",
        marginBottom: 6,
    },
});
