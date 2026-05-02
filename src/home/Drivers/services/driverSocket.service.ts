// src/services/driverSocket.service.ts
import io, { Socket } from "socket.io-client";
import { IPA_BASE } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface NewRideRequestData {
  bookingId: string;
  userId: string;
  userName: string;
  userPhone: string;
  userImage?: string;
  pickupLocation: { lat: number; lng: number; address: string };
  dropoffLocation: { lat: number; lng: number; address: string };
  distance: number;
  duration: number;
  fare: number;
  vehicleType: string;
  scheduleDate?: string;
  scheduleTime?: string;
  workNotes?: string;
}

class DriverSocketService {
  private socket: Socket | null = null;
  private isConnected = false;

  async connect(): Promise<Socket> {
    if (this.socket && this.isConnected) return this.socket;

    const token = await AsyncStorage.getItem("vToken");
    const userId = await AsyncStorage.getItem("userId"); // must be stored on login
    const role = "DRIVER";

    this.socket = io(IPA_BASE, {
      transports: ["websocket"],
      auth: { userId, role, token: `Bearer ${token}` },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on("connect", () => {
      console.log("✅ Driver socket connected");
      this.isConnected = true;
    });
    this.socket.on("disconnect", () => {
      this.isConnected = false;
    });
    this.socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });

    return this.socket;
  }

  // ---------- Ride request events (matching backend) ----------
  onNewRideRequest(callback: (data: NewRideRequestData) => void) {
    this.socket?.on("new-ride-request", callback);
  }

  acceptRide(bookingId: string) {
    this.socket?.emit("accept-ride", { bookingId });
  }

  rejectRide(bookingId: string) {
    this.socket?.emit("reject-ride", { bookingId });
  }

  // ---------- Ride room (live tracking) ----------
  joinRide(rideId: string) {
    this.socket?.emit("join-ride", { rideId });
    console.log("📡 join-ride emitted", rideId);
  }

  leaveRide(rideId: string) {
    this.socket?.emit("leave-ride", { rideId });
  }

  // ---------- Dedicated ride status events ----------
  driverArrived(rideId: string) {
    this.socket?.emit("driver-arrived", { rideId });
    console.log("🚗 driver-arrived emitted", rideId);
  }

  startRide(rideId: string) {
    this.socket?.emit("start-ride", { rideId });
    console.log("▶️ start-ride emitted", rideId);
  }

  completeRide(rideId: string) {
    this.socket?.emit("complete-ride", { rideId });
    console.log("🏁 complete-ride emitted", rideId);
  }

  // ---------- Live location (exactly as backend expects) ----------
  sendLocationUpdate(data: {
    rideId: string;
    latitude: number;
    longitude: number;
  }) {
    if (!this.isConnected) return;
    this.socket?.emit("driver-location-update", data);
  }

  // ---------- Listen for ride status updates from backend ----------
  onRideStatusUpdate(callback: (data: any) => void) {
    this.socket?.on("ride-status-update", callback);
  }

  // ---------- Cancel ride ----------
  cancelRide(rideId: string, reason?: string) {
    this.socket?.emit("cancel-ride", { rideId, reason });
  }

  // ---------- Driver online/offline ----------
  setDriverStatus(status: "active" | "offline" | "busy") {
    this.socket?.emit("driver-status-change", { status });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }
}

export const driverSocketService = new DriverSocketService();
