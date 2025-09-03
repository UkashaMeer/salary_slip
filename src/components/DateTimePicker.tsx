"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Calendar as CalendarIcon, Clock } from "lucide-react"

interface DateTimePickerProps {
  value?: Date
  onChange?: (date: Date) => void
}

export default function DateTimePicker({ value, onChange }: DateTimePickerProps) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<Date | undefined>(value)

  const handleDateChange = (date: Date | undefined) => {
    setSelected(date)
    if (date && onChange) {
      onChange(date)
    }
  }

  return (
    <div className="w-full relative">
      {/* Fake Input */}
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer hover:bg-gray-50"
      >
        <CalendarIcon className="h-5 w-5 text-gray-500" />
        <span className="text-gray-700 text-sm truncate">
          {selected ? selected.toLocaleString() : "Select Date & Time"}
        </span>
      </div>

      {/* Inline Dropdown Picker */}
      {open && (
        <div className="absolute mt-2 p-3 border rounded-lg shadow-md bg-white">
          {/* Calendar */}
          <Calendar
            mode="single"
            selected={selected}
            onSelect={handleDateChange}
            className="rounded-md border shadow-sm"
          />

          {/* Time Input */}
          <div className="flex items-center gap-2 mt-3">
            <Clock className="h-5 w-5 text-gray-500" />
            <input
              type="time"
              value={
                selected
                  ? `${selected.getHours().toString().padStart(2, "0")}:${selected
                      .getMinutes()
                      .toString()
                      .padStart(2, "0")}`
                  : ""
              }
              onChange={(e) => {
                if (selected) {
                  const [hours, minutes] = e.target.value.split(":")
                  const newDate = new Date(selected)
                  newDate.setHours(Number(hours))
                  newDate.setMinutes(Number(minutes))
                  setSelected(newDate)
                  if (onChange) onChange(newDate)
                }
              }}
              className="border rounded-md px-2 py-1 text-sm w-full"
            />
          </div>
        </div>
      )}
    </div>
  )
}
