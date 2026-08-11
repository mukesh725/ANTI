"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Plus, Trash2, MapPin, Loader2, Save } from "lucide-react";

export function LocationsManager() {
  const [locations, setLocations] = useState<string[]>([]);
  const [newLocation, setNewLocation] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const docRef = doc(db, "settings", "locations");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && docSnap.data().list) {
        setLocations(docSnap.data().list);
      } else {
        // Default locations if the document doesn't exist
        setLocations(["Kondapur", "Kompally"]);
      }
    } catch (err) {
      console.error("Failed to load locations", err);
      setError("Failed to load locations");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocation.trim()) return;
    
    const trimmed = newLocation.trim();
    if (locations.includes(trimmed)) {
      setError("Location already exists");
      return;
    }

    setLocations([...locations, trimmed]);
    setNewLocation("");
    setError(null);
    setSuccess(null);
  };

  const handleRemoveLocation = (locationToRemove: string) => {
    setLocations(locations.filter(loc => loc !== locationToRemove));
    setSuccess(null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const docRef = doc(db, "settings", "locations");
      await setDoc(docRef, { list: locations });
      setSuccess("Locations updated successfully");
    } catch (err) {
      console.error("Failed to save locations", err);
      setError("Failed to save locations. Check permissions.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif text-gray-900">Clinic Locations</h1>
          <p className="text-sm text-gray-500 mt-1">Manage the locations available for health scans.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-[#0A84FF] text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-[#0A84FF]/90 transition-colors disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 text-emerald-600 p-4 rounded-xl border border-emerald-100 text-sm">
          {success}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-8">
        <form onSubmit={handleAddLocation} className="flex gap-3">
          <input
            type="text"
            value={newLocation}
            onChange={(e) => setNewLocation(e.target.value)}
            placeholder="e.g. Banjara Hills"
            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0A84FF] transition-colors"
          />
          <button
            type="submit"
            className="bg-gray-900 text-white px-6 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-black transition-colors disabled:opacity-50"
            disabled={!newLocation.trim()}
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </form>

        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Current Locations</h3>
          {locations.length === 0 ? (
            <p className="text-sm text-gray-500">No locations added yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {locations.map((loc, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 group">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-[#0A84FF]" />
                    <span className="font-medium text-gray-900">{loc}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveLocation(loc)}
                    className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
