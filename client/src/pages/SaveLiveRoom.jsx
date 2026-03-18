import React from "react";
import { Link } from "react-router-dom";
import { useRoom } from "../utils/RoomContext";
import { useFurniture } from "../utils/FurnitureContext";
import { saveLiveRoom } from "../utils/saveLiveRoom";
import { AppNavbar } from "../components/layout/AppNavbar";
import Footer from "../components/layout/Footer";
import { ArrowRight, Save } from "lucide-react";

export default function SaveLiveRoom() {
  const roomContext = useRoom();
  const furnitureContext = useFurniture();

  return (
    <div className="min-h-screen bg-gray-50">
      <AppNavbar />
      <main className="pt-16">
        <div className="max-w-2xl mx-auto px-6 py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Save Current Room</h1>
          <p className="text-gray-500 text-sm mb-8">
            Save your design to the database to access it later.
          </p>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-700">Walls</span>
                <span className="text-sm text-gray-900 font-semibold">{(roomContext?.getLiveWalls?.() ?? roomContext?.walls ?? []).length}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-700">Furniture pieces</span>
                <span className="text-sm text-gray-900 font-semibold">{(furnitureContext?.getLiveFurniture?.() ?? []).length}</span>
              </div>
            </div>
            <button
              onClick={() => saveLiveRoom(furnitureContext, roomContext)}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              <Save className="size-4" />
              Save Room to Database
            </button>
          </div>
          <Link
            to="/designer"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-orange-500 hover:text-orange-600"
          >
            <ArrowRight className="size-4 rotate-180" />
            Back to Designer
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}