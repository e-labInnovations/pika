import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Plus, Check } from "lucide-react"

// Mock people data
const people = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    email: "sarah@example.com",
    description: "College friend",
  },
  {
    id: 2,
    name: "John Smith",
    avatar: "/placeholder.svg?height=40&width=40",
    email: "john@example.com",
    description: "Work colleague",
  },
  {
    id: 3,
    name: "Mom",
    avatar: "/placeholder.svg?height=40&width=40",
    email: "mom@family.com",
    description: "Family",
  },
  {
    id: 4,
    name: "Alex Chen",
    avatar: "/placeholder.svg?height=40&width=40",
    email: "alex@example.com",
    description: "Gym buddy",
  },
  {
    id: 5,
    name: "Emma Wilson",
    avatar: "/placeholder.svg?height=40&width=40",
    email: "emma@example.com",
    description: "Neighbor",
  },
  {
    id: 6,
    name: "Dad",
    avatar: "/placeholder.svg?height=40&width=40",
    email: "dad@family.com",
    description: "Family",
  },
]

interface PeoplePickerProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (person: any) => void
  selectedPersonId?: string
}

export function PeoplePicker({ isOpen, onClose, onSelect, selectedPersonId }: PeoplePickerProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredPeople = people.filter(
    (person) =>
      person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSelect = (person: any) => {
    onSelect(person)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Select Person</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search people..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Add New Person Button */}
          <Button
            variant="outline"
            className="w-full justify-start text-emerald-600 border-emerald-200 hover:bg-emerald-50"
            onClick={() => {
              // Handle add new person
              console.log("Add new person")
              onClose()
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Person
          </Button>

          {/* People List */}
          <div className="max-h-96 overflow-y-auto space-y-2">
            {filteredPeople.map((person) => (
              <div
                key={person.id}
                className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedPersonId === person.id.toString()
                    ? "bg-emerald-100 dark:bg-emerald-900 border border-emerald-200 dark:border-emerald-800"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
                onClick={() => handleSelect(person)}
              >
                <Avatar className="w-10 h-10">
                  <AvatarImage src={person.avatar || "/placeholder.svg"} alt={person.name} />
                  <AvatarFallback className="bg-emerald-500 text-white font-semibold">
                    {person.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 dark:text-white truncate">{person.name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{person.description}</p>
                </div>
                {selectedPersonId === person.id.toString() && (
                  <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                )}
              </div>
            ))}
          </div>

          {filteredPeople.length === 0 && (
            <div className="text-center py-8">
              <p className="text-slate-500 dark:text-slate-400">No people found</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
