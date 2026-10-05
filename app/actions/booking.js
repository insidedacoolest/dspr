"use server";

import { prisma } from "../lib/db";

export async function createBooking(prevState, formData) {
  const values = {
    name: String(formData.get("name") || "").trim(),
    email: String(formData.get("email") || "").trim(),
    phone: String(formData.get("phone") || "").trim(),
    car: String(formData.get("car") || "").trim(),
    service: String(formData.get("service") || "").trim(),
    preferredDate: String(formData.get("preferredDate") || "").trim(),
    message: String(formData.get("message") || "").trim().slice(0, 4000),
  };

  if (!values.name || !values.email || !values.phone || !values.car) {
    return { error: "Please fill in your name, email, phone and car.", values };
  }

  const booking = await prisma.booking.create({ data: values });
  return { success: true, id: booking.id };
}
