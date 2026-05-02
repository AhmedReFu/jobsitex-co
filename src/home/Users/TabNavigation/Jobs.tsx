import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useMemo, useState } from "react";
import { FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthStackParamList } from "../../../Navigation/type";


type JobStatus = "active" | "completed";

type Job = {
    id: string;
    title: string;
    dateText: string; // "Oct 24"
    status: JobStatus;
    price: number; // 120
};

const DATA: Job[] = [
    { id: "1", title: "Dump Truck (IOT)", dateText: "Oct 24", status: "completed", price: 120 },
    { id: "2", title: "Pickup Truck", dateText: "Oct 12", status: "completed", price: 120 },
    { id: "3", title: "Pickup Truck", dateText: "Oct 12", status: "completed", price: 120 },
    { id: "4", title: "Pickup Truck", dateText: "Oct 12", status: "completed", price: 120 },

    // Active examples (টেস্টের জন্য)
    { id: "5", title: "Dump Truck (IOT)", dateText: "Nov 02", status: "active", price: 150 },
    { id: "6", title: "Pickup Truck", dateText: "Nov 05", status: "active", price: 90 },
];

export default function Jobs() {
    const navigation = useNavigation<NavigationProp<AuthStackParamList>>()
    const [tab, setTab] = useState<JobStatus>("active");

    const list = useMemo(() => DATA.filter((j) => j.status === tab), [tab]);

    const goDetails = (job: Job) => {
        if (job.status === "active") {
            navigation.navigate("UserActiveJobsDetails", { jobId: job.id });
        } else {
            navigation.navigate("UserCompleteJobsDetails", { jobId: job.id });
        }
    };

    const onView = (job: Job) => {
        console.log("View:", job.id, job.status);
        goDetails(job);
    };

    const onPrimary = (job: Job) => {
        console.log(job.status === "active" ? "Track Job:" : "Rebook:", job.id);
        goDetails(job);
    };

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.container}>
                
                    <Text style={styles.title}>My Jobs</Text>
             

                {/* Segmented Tabs */}
                <View style={styles.segmentWrap}>
                    <View style={styles.segment}>
                        <TouchableOpacity
                            activeOpacity={0.85}
                            onPress={() => setTab("active")}
                            style={[styles.segmentBtn, tab === "active" && styles.segmentBtnActive]}
                        >
                            <Text style={[styles.segmentText, tab === "active" && styles.segmentTextActive]}>
                                Active
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.85}
                            onPress={() => setTab("completed")}
                            style={[styles.segmentBtn, tab === "completed" && styles.segmentBtnActive]}
                        >
                            <Text
                                style={[styles.segmentText, tab === "completed" && styles.segmentTextActive]}
                            >
                                Completed
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <FlatList
                    data={list}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <JobCard job={item} onView={() => onView(item)} onPrimary={() => onPrimary(item)} />
                    )}
                    ListEmptyComponent={
                        <View style={styles.emptyBox}>
                            <Text style={styles.emptyTitle}>No jobs found</Text>
                            <Text style={styles.emptyText}>
                                {tab === "active" ? "You have no active jobs." : "You have no completed jobs."}
                            </Text>
                        </View>
                    }
                />
            </View>
        </SafeAreaView>
    );
}

function JobCard({
    job,
    onView,
    onPrimary,
}: {
    job: Job;
    onView: () => void;
    onPrimary: () => void;
}) {
    const primaryLabel = job.status === "active" ? "TRACK JOB" : "REBOOK";
    const subText = `${job.dateText} • ${job.status === "active" ? "Active" : "Completed"}`;

    return (
        <View style={styles.card}>
            <View style={styles.cardTop}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>{job.title}</Text>
                    <Text style={styles.cardSub}>{subText}</Text>
                </View>

                <Text style={styles.price}>${job.price.toFixed(2)}</Text>
            </View>

            <View style={styles.cardBottom}>
                <TouchableOpacity activeOpacity={0.85} onPress={onView} style={styles.btnGhost}>
                    <Text style={styles.btnGhostText}>View</Text>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.85} onPress={onPrimary} style={styles.btnPrimary}>
                    <Text style={styles.btnPrimaryText}>{primaryLabel}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const GREEN = "#43B047";
const BORDER = "#D6DCE3";
const TEXT_GRAY = "#8B95A1";

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: "#F7F8FA" },
    container: { flex: 1, paddingHorizontal: 18, paddingTop: 10 },

    title: {
        fontSize: 26,
        fontWeight: "800",
        color: "#111827",
        marginTop: 4,
        marginBottom: 14,
    },

    segmentWrap: { marginBottom: 14 },
    segment: {
        borderRadius: 12,
        borderWidth: 1,
        borderColor: BORDER,
        backgroundColor: "#F2F4F7",
        padding: 4,
        flexDirection: "row",
    },
    segmentBtn: {
        flex: 1,
        borderRadius: 10,
        paddingVertical:16,
        alignItems: "center",
        justifyContent: "center",
    },
    segmentBtnActive: {
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#E7EBF0",
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOpacity: 0.08,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 4 },
            },
            android: { elevation: 3 },
        }),
    },
    segmentText: { fontSize: 14, fontWeight: "700", color: "#111827" },
    segmentTextActive: { color: "#111827" },

    listContent: { paddingBottom: 120 },

    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 14,
        marginBottom: 14,
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOpacity: 0.06,
                shadowRadius: 12,
                shadowOffset: { width: 0, height: 8 },
            },
            android: { elevation: 2 },
        }),
    },
    cardTop: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
    cardTitle: { fontSize: 15, fontWeight: "800", color: "#111827" },
    cardSub: { marginTop: 4, fontSize: 12, fontWeight: "600", color: TEXT_GRAY },

    price: { fontSize: 16, fontWeight: "800", color: GREEN },

    cardBottom: { flexDirection: "row", gap: 12, marginTop: 14 },

    btnGhost: {
        flex: 1,
        height: 46,
        borderRadius: 12,
        backgroundColor: "#EAF6EA",
        alignItems: "center",
        justifyContent: "center",
    },
    btnGhostText: { color: GREEN, fontSize: 14, fontWeight: "800" },

    btnPrimary: {
        flex: 1,
        height: 46,
        borderRadius: 12,
        backgroundColor: GREEN,
        alignItems: "center",
        justifyContent: "center",
    },
    btnPrimaryText: { color: "#FFFFFF", fontSize: 14, fontWeight: "900", letterSpacing: 0.4 },

    emptyBox: {
        marginTop: 30,
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: "#EEF2F7",
    },
    emptyTitle: { fontSize: 16, fontWeight: "800", color: "#111827" },
    emptyText: { marginTop: 6, fontSize: 13, fontWeight: "600", color: TEXT_GRAY },
});
