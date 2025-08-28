import React, { useState } from 'react'

export default function useEditDialogState() {
    const [editName, setEditName] = useState("")
    const [editEmail, setEditEmail] = useState("")
    const [editSalary, setEditSalary] = useState("")
    const [editPhone, setEditPhone] = useState("")
    const [editCnic, setEditCnic] = useState("")
    const [editAddress, setEditAddress] = useState("")
  return {
    editName,
    editEmail,
    editSalary,
    editPhone,
    editCnic,
    editAddress,
    setEditName,
    setEditEmail,
    setEditSalary,
    setEditPhone,
    setEditCnic,
    setEditAddress
  }
}
