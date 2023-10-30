"use client"
import React, { useState } from 'react'

const PaymentCheckout = (channel:string) => {
  const [amount, setAmount] = useState(1)
  const [card, setCard] = useState("")
  const [cvc, setCvc] = useState(0)
  const [expiration, setExpiration] = useState("")

  const handlePaymentRequest = async(e:any) => {
    e.preventDefault()

  }
  console.log(amount, card, cvc, expiration)
  return (
    <div style={{background: 'blue'}}>
      <form onSubmit={handlePaymentRequest}>
        {/* <input type='text'  /> */}
        <input onChange={(e) => setCard(e.target.value)} id="ccn" type="tel" inputMode='numeric' pattern="[0-9\s]{13,19}" autoComplete="cc-number" maxLength={19} placeholder="xxxx xxxx xxxx xxxx" />
        <input type="number" onChange={(e) => setAmount(parseFloat(e.target.value))} placeholder='1$ USD' />
        <input type="number" maxLength={3} onChange={(e) => setCvc(parseFloat(e.target.value))} placeholder='1$ USD' />
      <button type="submit">Checkout</button>
    </form>
    </div>
  )
}

export default PaymentCheckout