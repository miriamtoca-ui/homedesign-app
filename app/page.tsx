"use client"

import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

export default function Home() {

  const [clients, setClients] = useState<any[]>([])
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")

  async function loadClients() {
    const { data } = await supabase
      .from("clients")
      .select("*")
      .order("created_at", { ascending: false })

    setClients(data || [])
  }

  async function createClient() {

    await supabase.from("clients").insert([
      {
        name,
        email,
        phone
      }
    ])

    setName("")
    setEmail("")
    setPhone("")

    loadClients()
  }

  useEffect(() => {
    loadClients()
  }, [])

  return (
    <main style={{ padding: 40 }}>

      <h1>Clientes</h1>

      <h2>Nuevo cliente</h2>

      <input
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <br/>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br/>

      <input
        placeholder="Teléfono"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <br/>

      <button onClick={createClient}>
        Crear cliente
      </button>

      <h2>Lista</h2>

      <ul>
        {clients.map((client) => (
          <li key={client.id}>
            {client.name} — {client.email}
          </li>
        ))}
      </ul>

    </main>
  )
}