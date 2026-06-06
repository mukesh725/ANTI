"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar as CalendarIcon, Clock } from "lucide-react";
import { useState } from "react";

interface SchedulerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SchedulerModal({ isOpen, onClose }: SchedulerModalProps) {
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  
  const dates = [12, 13, 14, 15, 16]; // Mock dates
  const times = ["09:00 AM", "11:30 AM", "02:00 PM", "04:15 PM"];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        >
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-charcoal/40 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative bg-alabaster w-full max-w-2xl shadow-2xl rounded-sm overflow-hidden flex flex-col md:flex-row"
          >
            {/* Left Col: Info */}
            <div className="bg-charcoal text-alabaster p-8 md:w-2/5 flex flex-col justify-between">
              <div>
                <span className="text-[10px] tracking-widest uppercase text-alabaster/60 mb-4 block">AIRO Clinical</span>
                <h2 className="font-serif text-3xl mb-4 leading-tight">MinuteClinic<br/>Consultation</h2>
                <p className="font-sans text-sm text-alabaster/70 leading-relaxed">
                  A seamless, private session with our holistic practitioners. 
                  Collective Members receive priority booking.
                </p>
              </div>
              
              <div className="mt-12">
                <div className="flex items-center gap-3 text-sm text-alabaster/80 mb-3">
                  <CalendarIcon className="w-4 h-4" /> 15-Minute Session
                </div>
                <div className="flex items-center gap-3 text-sm text-alabaster/80">
                  <Clock className="w-4 h-4" /> Video or In-Person
                </div>
              </div>
            </div>

            {/* Right Col: Scheduler */}
            <div className="p-8 md:w-3/5 bg-alabaster">
              <div className="flex justify-between items-start mb-8">
                <h3 className="font-serif text-xl">Select a Time</h3>
                <button onClick={onClose} className="p-2 hover:bg-charcoal/5 rounded-full silent-luxury-transition text-charcoal/50 hover:text-charcoal">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Date Selection */}
              <div className="mb-8">
                <p className="text-[10px] tracking-widest uppercase text-charcoal/50 mb-3">October 2026</p>
                <div className="flex gap-2">
                  {dates.map((date) => (
                    <button
                      key={date}
                      onClick={() => setSelectedDate(date)}
                      className={`w-12 h-12 rounded-full flex flex-col items-center justify-center border silent-luxury-transition ${
                        selectedDate === date 
                          ? "bg-charcoal text-alabaster border-charcoal" 
                          : "border-charcoal/20 hover:border-charcoal text-charcoal"
                      }`}
                    >
                      <span className="text-xs font-serif">{date}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Selection */}
              <div className="mb-10">
                <p className="text-[10px] tracking-widest uppercase text-charcoal/50 mb-3">Available Slots</p>
                <div className="grid grid-cols-2 gap-3">
                  {times.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`py-3 px-4 border text-sm font-sans tracking-wide silent-luxury-transition rounded-sm ${
                        selectedTime === time
                          ? "border-charcoal bg-charcoal/5 text-charcoal font-medium"
                          : "border-charcoal/10 hover:border-charcoal/30 text-charcoal/70"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                disabled={!selectedDate || !selectedTime}
                className="w-full py-4 bg-charcoal text-alabaster tracking-widest uppercase text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-charcoal/90 silent-luxury-transition rounded-sm"
              >
                Confirm Appointment
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
