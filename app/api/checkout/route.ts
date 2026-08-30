import { NextResponse } from "next/server";
import Stripe from "stripe";
import { resolveCartItem } from "@/lib/cart-pricing";
import type { CartItem } from "@/lib/CartContext";
import { WORLDWIDE_SHIPPING_COUNTRIES } from "@/lib/shipping-countries";

export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    return NextResponse.json(
      { error: "Payments aren't configured yet (missing STRIPE_SECRET_KEY)." },
      { status: 500 },
    );
  }

  const stripe = new Stripe(secretKey, {
    apiVersion: "2026-07-29.dahlia",
  });

  let items: CartItem[];
  try {
    const body = await request.json();
    items = body.items;
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error("empty");
    }
  } catch {
    return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
  }

  // Every price/title/image is resolved fresh from our own data here —
  // never trusted from whatever the browser sent. This is what stops
  // someone from editing a price in devtools before checkout.
  const resolved = items
    .map(resolveCartItem)
    .filter((r): r is NonNullable<typeof r> => r !== null);

  if (resolved.length === 0) {
    return NextResponse.json(
      { error: "Nothing in your cart could be found." },
      { status: 400 },
    );
  }

  const origin = request.headers.get("origin") ?? "http://localhost:3000";

  // A plain, readable summary of what was bought — shows up directly in
  // the "Metadata" section on the payment's detail page in the Stripe
  // Dashboard, so it's visible at a glance without digging through the
  // checkout summary sub-section.
  const orderSummary = resolved
    .map((item) => `${item.title} (${item.meta})`)
    .join(" | ");

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: resolved.map((item) => ({
        quantity: 1,
        price_data: {
          currency: "eur",
          unit_amount: Math.round(item.price * 100),
          product_data: {
            name: item.title,
            description: item.meta,
            images: [`${origin}${item.image}`],
          },
        },
      })),
      metadata: {
        order_summary: orderSummary,
      },
      payment_intent_data: {
        metadata: {
          order_summary: orderSummary,
        },
      },
      // Ships worldwide — see lib/shipping-countries.ts for the full list.
      shipping_address_collection: {
        allowed_countries: [...WORLDWIDE_SHIPPING_COUNTRIES],
      },
      // Customer picks the zone that matches where they're shipping to.
      // All tracked (recommended for commercial/merchandise sales, not
      // plain mail) — figures based on ELTA's international tracked
      // letter/small-packet rates for a lightweight A4/A5 envelope.
      // Stripe doesn't verify the customer actually lives in the zone
      // they pick, so this runs on an honor-system basis — fine for a
      // small shop, just worth knowing it isn't enforced.
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: 400, currency: "eur" },
            display_name: "Greece",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 1 },
              maximum: { unit: "business_day", value: 3 },
            },
          },
        },
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: 690, currency: "eur" },
            display_name: "Europe",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 4 },
              maximum: { unit: "business_day", value: 8 },
            },
          },
        },
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: 1190, currency: "eur" },
            display_name: "USA & Canada",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 4 },
              maximum: { unit: "business_day", value: 10 },
            },
          },
        },
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: 1290, currency: "eur" },
            display_name: "Asia",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 4 },
              maximum: { unit: "business_day", value: 10 },
            },
          },
        },
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: 1490, currency: "eur" },
            display_name: "Rest of World",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 5 },
              maximum: { unit: "business_day", value: 12 },
            },
          },
        },
      ],
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout session error:", err);
    return NextResponse.json(
      { error: "Something went wrong starting checkout." },
      { status: 500 },
    );
  }
}
