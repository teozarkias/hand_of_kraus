import { NextResponse } from "next/server";
import Stripe from "stripe";
import { resolveCartItem } from "@/lib/cart-pricing";
import type { CartItem } from "@/lib/CartContext";
import { WORLDWIDE_SHIPPING_COUNTRIES } from "@/lib/shipping-countries";
import { getShippingZone, type ShippingZoneId } from "@/lib/shipping-zones";

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
  let zoneId: ShippingZoneId;
  try {
    const body = await request.json();
    items = body.items;
    zoneId = body.zoneId;
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error("empty");
    }
  } catch {
    return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
  }

  const zone = getShippingZone(zoneId);
  if (!zone) {
    return NextResponse.json(
      { error: "Pick where you're shipping to before checking out." },
      { status: 400 },
    );
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
  const orderSummary =
    resolved.map((item) => `${item.title} (${item.meta})`).join(" | ") +
    ` | Shipping: ${zone.label} (EUR ${zone.price})`;

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
      // Only the zone the customer actually picked on the cart page is
      // sent to Stripe — not a list of all five for them to (maybe)
      // notice and correct. This is what fixes the earlier bug where
      // Greece's rate stayed selected by default even for a Belgium
      // address, since Stripe's shipping_options aren't tied to the
      // address someone types in.
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: Math.round(zone.price * 100),
              currency: "eur",
            },
            display_name: zone.label,
            delivery_estimate: {
              minimum: { unit: "business_day", value: zone.minDays },
              maximum: { unit: "business_day", value: zone.maxDays },
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
