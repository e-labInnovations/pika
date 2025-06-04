import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Calendar, ArrowUpRight, ArrowDownLeft } from "lucide-react"
import { Label } from "@/components/ui/label"

// Mock members data
const people = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    email: "sarah@example.com",
    phone: "+1 (555) 123-4567",
    description: "College friend and roommate",
    balance: 125.5,
    lastTransaction: "2024-11-15",
    transactionCount: 12,
    transactions: [
      { id: 1, title: "Grocery Shopping", amount: -85.5, date: "2024-11-15", type: "expense" },
      { id: 2, title: "Dinner Split", amount: -40.0, date: "2024-11-10", type: "expense" },
    ],
  },
  {
    id: 2,
    name: "John Smith",
    avatar: "/placeholder.svg?height=40&width=40",
    email: "john@example.com",
    phone: "+1 (555) 987-6543",
    description: "Work colleague",
    balance: -25.75,
    lastTransaction: "2024-11-15",
    transactionCount: 8,
    transactions: [
      { id: 3, title: "Coffee with John", amount: -12.75, date: "2024-11-15", type: "expense" },
      { id: 4, title: "Lunch Meeting", amount: -13.0, date: "2024-11-12", type: "expense" },
    ],
  },
  {
    id: 3,
    name: "Mom",
    avatar: "/placeholder.svg?height=40&width=40",
    email: "mom@family.com",
    phone: "+1 (555) 456-7890",
    description: "Family",
    balance: 0,
    lastTransaction: "2024-11-12",
    transactionCount: 5,
    transactions: [{ id: 5, title: "Birthday Gift", amount: -45.0, date: "2024-11-12", type: "expense" }],
  },
  {
    id: 4,
    name: "Alex Chen",
    avatar: "/placeholder.svg?height=40&width=40",
    email: "alex@example.com",
    phone: "+1 (555) 321-0987",
    description: "Gym buddy",
    balance: 50.0,
    lastTransaction: "2024-11-08",
    transactionCount: 3,
    transactions: [{ id: 6, title: "Gym Membership Split", amount: 50.0, date: "2024-11-08", type: "income" }],
  },
]

interface PeopleListProps {
  onPersonSelect: (id: number) => void
  people: any[]
  onAdd: (person: any) => void
  onEdit: (id: number, updates: any) => void
  onDelete: (id: number) => void
  triggerAddPerson?: boolean
  onAddPersonTriggered?: () => void
}

// Change the component name from MembersList to PeopleList
export function PeopleList({
  onPersonSelect,
  people,
  onAdd,
  onEdit,
  onDelete,
  triggerAddPerson,
  onAddPersonTriggered,
}: PeopleListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [newPerson, setNewPerson] = useState({
    name: "",
    email: "",
    phone: "",
    description: "",
    avatar: "/placeholder.svg?height=40&width=40",
    balance: 0,
    lastTransaction: new Date().toISOString().split("T")[0],
    transactionCount: 0,
  })

  const filteredPeople = people.filter(
    (person) =>
      person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getBalanceColor = (balance: number) => {
    if (balance > 0) return "text-emerald-600 dark:text-emerald-400"
    if (balance < 0) return "text-red-500 dark:text-red-400"
    return "text-slate-600 dark:text-slate-400"
  }

  const getTransactionIcon = (type: string) => {
    return type === "income" ? (
      <ArrowDownLeft className="w-3 h-3 text-emerald-600" />
    ) : (
      <ArrowUpRight className="w-3 h-3 text-red-500" />
    )
  }

  const handleAddPerson = () => {
    if (!newPerson.name.trim() || !newPerson.email.trim()) {
      alert("Name and email are required")
      return
    }

    onAdd(newPerson)
    setNewPerson({
      name: "",
      email: "",
      phone: "",
      description: "",
      avatar: "/placeholder.svg?height=40&width=40",
      balance: 0,
      lastTransaction: new Date().toISOString().split("T")[0],
      transactionCount: 0,
    })
    setShowAddForm(false)
    alert("Person added successfully!")
  }

  useEffect(() => {
    if (triggerAddPerson) {
      setShowAddForm(true)
      onAddPersonTriggered?.()
    }
  }, [triggerAddPerson, onAddPersonTriggered])

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
        <Input
          placeholder="Search people..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200 dark:border-slate-700"
        />
      </div>

      {showAddForm && (
        <Card className="bg-white/50 dark:bg-slate-800/50 border-emerald-200 dark:border-emerald-800">
          <CardContent className="p-4 space-y-4">
            <h4 className="font-medium text-slate-900 dark:text-white">Add New Person</h4>
            <div className="space-y-3">
              <div>
                <Label>Name *</Label>
                <Input
                  value={newPerson.name}
                  onChange={(e) => setNewPerson({ ...newPerson, name: e.target.value })}
                  placeholder="Person's name"
                />
              </div>
              <div>
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={newPerson.email}
                  onChange={(e) => setNewPerson({ ...newPerson, email: e.target.value })}
                  placeholder="person@example.com"
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input
                  value={newPerson.phone}
                  onChange={(e) => setNewPerson({ ...newPerson, phone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Input
                  value={newPerson.description}
                  onChange={(e) => setNewPerson({ ...newPerson, description: e.target.value })}
                  placeholder="Relationship or notes"
                />
              </div>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={handleAddPerson}
                  disabled={!newPerson.name || !newPerson.email}
                  className="bg-emerald-500 hover:bg-emerald-600"
                >
                  Add Person
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Members List */}
      <div className="space-y-3">
        {filteredPeople.map((person) => (
          <Card
            key={person.id}
            className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:shadow-md transition-all duration-200 cursor-pointer"
            onClick={() => onPersonSelect(person.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={person.avatar || "/placeholder.svg"} alt={person.name} />
                    <AvatarFallback className="bg-emerald-500 text-white font-semibold">
                      {person.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-slate-900 dark:text-white truncate">{person.name}</h4>
                      <div className="text-right">
                        <span className={`font-semibold ${getBalanceColor(person.balance)}`}>
                          {person.balance === 0 ? "Even" : `$${Math.abs(person.balance).toFixed(2)}`}
                        </span>
                        {person.balance !== 0 && (
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {person.balance > 0 ? "owes you" : "you owe"}
                          </p>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{person.description}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        Last: {person.lastTransaction}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {person.transactionCount} transactions
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPeople.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500 dark:text-slate-400">No people found</p>
        </div>
      )}
    </div>
  )
}
