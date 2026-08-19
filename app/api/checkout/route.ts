import { NextResponse } from "next/server";
import Stripe from "stripe";
import { resolveCartItem } from "@/lib/cart-pricing";
import type { CartItem } from "@/lib/CartContext";

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
      // Physical art needs a shipping address. Add/remove country codes
      // to match wherever the artist is actually willing to ship.
      shipping_address_collection: {
        allowed_countries: [
          "GR",
          "CY",
          "US",
          "GB",
          "DE",
          "FR",
          "IT",
          "ES",
          "NL",
          "IE",
        ],
      },
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
