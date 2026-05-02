import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import {
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const GREEN = "#43B047";
const BG = "#F6F7F9";
const TEXT = "#111827";
const MUTED = "#8B95A1";
const CARD = "#FFFFFF";
const ORANGE = "#F59E0B";

type CompletedDetails = {
    route: { pickup: string; dropoff: string };
    delivery: { title: string; date: string; statusPill: string };
    driver: { name: string; rating: number; vehicleLine: string };
    payment: {
        items: { label: string; amount: number }[];
        serviceCharge: number;
        total: number;
    };
};

const demo: CompletedDetails = {
    route: {
        pickup: "New York, NY",
        dropoff: "2045 Lodgeville Road, Eagan, MN",
    },
    delivery: {
        title: "Delivered Successfully",
        date: "Oct 24, 2023",
        statusPill: "On time",
    },
    driver: {
        name: "Bessie Lora",
        rating: 4.9,
        vehicleLine: "Volvo FH16 • KX-942-L",
    },
    payment: {
        items: [
            { label: "Vehicle (Mini Truck)", amount: 20 },
            { label: "Distance Cost", amount: 15 },
            { label: "Additional Hours Cost", amount: 10 },
        ],
        serviceCharge: 2,
        total: 47,
    },
};

export default function UserCompleteJobsDetails({ navigation }: any) {
    const data = demo;

    const downloadReceipt = () => {
        // এখানে receipt download / share / pdf generate দিতে পারো
        console.log("DOWNLOAD RECEIPT");
    };

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
                    <View style={styles.fakeMap}>
                        <MaterialCommunityIcons name="map-marker-radius" size={36} color="#C8D0DB" />
                        <Text style={styles.fakeMapText}>Map Preview</Text>
                    </View>

                    <View style={styles.mapOverlayRow}>
                        <View style={{ width: 1 }} />
                        <TouchableOpacity style={styles.viewMapBtn} activeOpacity={0.85} onPress={() => { }}>
                            <Ionicons name="map-outline" size={18} color={MUTED} />
                            <Text style={styles.viewMapText}>View Map</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Route Details */}
                <View style={styles.card}>
                    <Text style={styles.sectionLabel}>Route Details</Text>

                    <View style={{ marginTop: 12 }}>
                        <RouteRow
                            title="PICKUP LOCATION"
                            icon={<Ionicons name="radio-button-on" size={18} color={ORANGE} />}
                            value={data.route.pickup}
                        />

                        <View style={styles.routeDivider} />

                        <RouteRow
                            title="DROP-OFF LOCATION"
                            icon={<Ionicons name="star" size={18} color={GREEN} />}
                            value={data.route.dropoff}
                        />
                    </View>
                </View>

                {/* Delivered Summary */}
                <View style={styles.deliveryCard}>
                    <View style={styles.deliveryLeft}>
                        <View style={styles.doneIcon}>
                            <Ionicons name="checkmark" size={18} color="#fff" />
                        </View>
                        <View>
                            <Text style={styles.deliveryTitle}>{data.delivery.title}</Text>
                            <Text style={styles.deliveryDate}>{data.delivery.date}</Text>
                        </View>
                    </View>

                    <View style={styles.statusPill}>
                        <Text style={styles.statusPillText}>{data.delivery.statusPill}</Text>
                    </View>
                </View>

                {/* Driver Details */}
                <View style={styles.card}>
                    <Text style={styles.sectionLabel}>DRIVER DETAILS</Text>

                    <View style={styles.driverRow}>
                        <View style={styles.avatarWrap}>
                            <Ionicons name="person" size={26} color="#9AA4B2" />
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

                {/* Payment Details */}
                <View style={styles.card}>
                    <Text style={styles.sectionLabel}>PAYMENT DETAILS</Text>
                    <View style={styles.hr} />

                    {data.payment.items.map((it) => (
                        <Row key={it.label} left={it.label} right={`$${it.amount}`} />
                    ))}

                    <View style={styles.hr} />
                    <Row left="Service Charge" right={`$${data.payment.serviceCharge}`} />
                    <View style={styles.hr} />

                    <View style={styles.totalRow}>
                        <View>
                            <Text style={styles.totalLeft}>Total</Text>
                            <Text style={styles.totalSub}>(Estimated Cost)</Text>
                        </View>
                        <Text style={styles.totalValue}>${data.payment.total}</Text>
                    </View>
                </View>

                <View style={{ height: 110 }} />
            </ScrollView>

            {/* Bottom Sticky Button */}
            <View style={styles.bottomBar}>
                <TouchableOpacity activeOpacity={0.9} style={styles.downloadBtn} onPress={downloadReceipt}>
                    <Ionicons name="document-text-outline" size={18} color="#fff" />
                    <Text style={styles.downloadText}>DOWNLOAD RECEIPT</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

function Row({ left, right }: { left: string; right: string }) {
    return (
        <View style={styles.row}>
            <Text style={styles.rowLeft}>{left}</Text>
            <Text style={styles.rowRight}>{right}</Text>
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
    fakeMap: { height: 170, alignItems: "center", justifyContent: "center" },
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
            ios: { shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 14, shadowOffset: { width: 0, height: 10 } },
            android: { elevation: 2 },
        }),
    },

    sectionLabel: {
        fontSize: 12,
        fontWeight: "900",
        letterSpacing: 0.6,
        color: TEXT,
        textTransform: "uppercase",
    },

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

    deliveryCard: {
        backgroundColor: CARD,
        borderRadius: 18,
        padding: 14,
        marginBottom: 14,
        borderLeftWidth: 4,
        borderLeftColor: GREEN,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        ...Platform.select({
            ios: { shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 14, shadowOffset: { width: 0, height: 10 } },
            android: { elevation: 2 },
        }),
    },
    deliveryLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
    doneIcon: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: GREEN,
        alignItems: "center",
        justifyContent: "center",
    },
    deliveryTitle: { fontSize: 14, fontWeight: "900", color: TEXT },
    deliveryDate: { marginTop: 4, fontSize: 12, fontWeight: "700", color: MUTED },

    statusPill: {
        height: 26,
        paddingHorizontal: 10,
        borderRadius: 999,
        backgroundColor: "#E9F7EA",
        alignItems: "center",
        justifyContent: "center",
    },
    statusPillText: { color: GREEN, fontWeight: "900", fontSize: 12 },

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
    },
    driverNameRow: { flexDirection: "row", alignItems: "center", gap: 10 },
    driverName: { fontSize: 15, fontWeight: "900", color: TEXT },
    ratingRow: { flexDirection: "row", alignItems: "center", gap: 4 },
    ratingText: { fontSize: 13, fontWeight: "900", color: TEXT },
    driverSub: { marginTop: 4, fontSize: 12, fontWeight: "700", color: MUTED },

    hr: { height: 1, backgroundColor: "#EEF2F7", marginVertical: 12 },

    row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 8 },
    rowLeft: { color: "#9AA4B2", fontWeight: "800" },
    rowRight: { color: TEXT, fontWeight: "900" },

    totalRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginTop: 6 },
    totalLeft: { fontSize: 13, fontWeight: "900", color: TEXT },
    totalSub: { marginTop: 2, fontSize: 12, fontWeight: "700", color: "#9AA4B2" },
    totalValue: { fontSize: 30, fontWeight: "900", color: ORANGE },

    bottomBar: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: Platform.OS === "ios" ? 22 : 14,
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 22,
        borderTopRightRadius: 22,
        ...Platform.select({
            ios: { shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 16, shadowOffset: { width: 0, height: -6 } },
            android: { elevation: 10 },
        }),
    },
    downloadBtn: {
        height: 54,
        borderRadius: 16,
        backgroundColor: GREEN,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
    },
    downloadText: { color: "#fff", fontWeight: "900", letterSpacing: 0.6 },
});
