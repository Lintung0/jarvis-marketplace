# Airbnb-like Platform – Feature Architecture Specification

**Target Product:** A two-sided marketplace for short-term accommodation (guests ↔ hosts).  
**Scope:** Core MVP + realistic extensions for a production-grade system.

---

## 1. Overview

This document defines:

- User roles and user flows
- Core features and their behavior
- Search and filtering capabilities
- Database schema and relationships
- Key edge cases and failure scenarios

The design assumes:

- Web + mobile clients
- Real-time booking updates
- Payment processing with escrow/hold logic
- Multi-location, multi-currency support

---

## 2. User Roles

### 2.1 Guest

- Searches for accommodations
- Views property details
- Books and pays for stays
- Leaves reviews after checkout
- Manages bookings and profile

### 2.2 Host

- Creates and manages listings
- Sets pricing, availability, and rules
- Receives and manages booking requests
- Communicates with guests
- Leaves reviews for guests

### 2.3 Platform Admin

- Manages users, listings, and disputes
- Configures global settings (fees, policies)
- Handles fraud, abuse, and compliance

---

## 3. User Flows

### 3.1 Guest Flows

#### 3.1.1 Browse & Search

1. Guest lands on home page.
2. Enters:
   - Location (city, region, or address)
   - Check-in / check-out dates
   - Number of guests
3. System shows:
   - List of matching listings
   - Map view (optional)
4. Guest applies filters (see Section 4).
5. Guest clicks a listing → detailed view.

#### 3.1.2 View Listing Details

Guest sees:

- Photos, title, description
- Price per night, total estimate (with taxes/fees)
- Availability calendar
- House rules (cancellation policy, pets, etc.)
- Host info and response rate
- Reviews and ratings

Actions:

- “Reserve” / “Request to Book”
- “Contact Host”
- Save to wishlist

#### 3.1.3 Booking Flow (Instant Book)

1. Guest selects dates and number of guests.
2. System calculates total price.
3. Guest clicks “Reserve”.
4. If instant book enabled:
   - Booking is created immediately.
   - Payment is processed.
   - Confirmation is sent to guest and host.
5. Guest receives:
   - Booking confirmation
   - Itinerary details
   - Option to message host

#### 3.1.4 Booking Flow (Request to Book)

1. Guest selects dates and number of guests.
2. Guest clicks “Request to Book”.
3. Booking request is created (status: `pending`).
4. Host receives notification.
5. Host can:
   - Accept → booking confirmed, payment processed.
   - Decline → request rejected, guest can search again.
   - Send alternate dates/offer (optional).
6. Guest receives outcome via notification/email.

#### 3.1.5 Post-Stay

1. After checkout date:
   - System marks stay as completed.
2. Guest can:
   - Leave a review (rating + text).
   - View past bookings.
3. Review becomes visible after host review (if applicable) or after a time window.

#### 3.1.6 Profile & Settings

- Manage personal info
- Set notification preferences
- View saved wishlists
- Manage payment methods
- View booking history

---

### 3.2 Host Flows

#### 3.2.1 Create Listing

1. Host navigates to “Create new listing”.
2. Fills in:
   - Property type (entire place, room, private room, shared)
   - Location (address, coordinates)
   - Title and description
   - Photos
   - Amenities (wifi, kitchen, parking, etc.)
   - Capacity (guests, bedrooms, beds, baths)
   - House rules (pets, parties, minimum/maximum stay)
   - Cancellation policy
3. Sets pricing:
   - Base price per night
   - Weekend pricing (optional)
   - Seasonal pricing (optional)
   - Cleaning fee
   - Extra guest fee
4. Sets availability:
   - Default calendar
   - Blocked dates
   - Minimum/maximum stay rules
5. Submits listing for review (optional platform moderation).
6. Listing becomes active (or after approval).

#### 3.2.2 Manage Listings

- View list of active/inactive listings
- Edit details, pricing, availability
- Pause/unpause listing
- Delete listing

#### 3.2.3 Booking Management

Host sees:

- Upcoming bookings
- Pending requests
- Past bookings

Actions:

- Accept/decline requests
- Send special offers (alternate dates/prices)
- Message guest
- Cancel booking (with policy enforcement)

#### 3.2.4 Reviews

- After guest checkout:
  - Host can review guest (rating + text).
- Host reviews are visible to guests when they view past guest behavior (if platform allows).

#### 3.2.5 Financials

- View earnings per listing
- View payout history
- Manage payout method (bank account, etc.)
- See breakdown:
  - Base price
  - Platform fees
  - cleaning fees
  - Taxes

---

## 4. Search & Filters

### 4.1 Core Search Inputs

- Location (text + geolocation)
- Check-in date
- Check-out date
- Number of guests

### 4.2 Filter Categories

#### 4.2.1 Price

- Minimum price per night
- Maximum price per night
- Total price range (including fees)

#### 4.2.2 Property Type

- Entire place
- Private room
- Shared room
- Unique stays (e.g., boat, cabin)

#### 4.2.3 Room & Capacity

- Minimum bedrooms
- Minimum beds
- Minimum bathrooms
- Maximum guests

#### 4.2.4 Amenities

- WiFi
- Kitchen
- Parking
- Pool
- Air conditioning
- Heating
- Washer / dryer
- Pet-friendly

#### 4.2.5 Availability

- Instant book only
- Available on selected dates
- Minimum stay length

#### 4.2.6 Ratings & Reviews

- Minimum review score (e.g., 4.0+)
- Number of reviews (e.g., 10+)

#### 4.2.7 Location-based

- Distance from landmark / city center
- Neighborhood / area
- Proximity to transit

### 4.3 Sorting Options

- Recommended (business logic)
- Price (low → high, high → low)
- Review score
- Number of reviews
- Distance

---

## 5. Database Needs

### 5.1 Core Entities

#### 5.1.1 Users

```text
users
- id (PK)
- email
- password_hash
- first_name
- last_name
- phone
- avatar_url
- role (guest, host, admin)
- is_active
- created_at
- updated_at
```

#### 5.1.2 Profiles & Preferences

```text
user_profiles
- id (PK)
- user_id (FK → users.id)
- bio
- location
- languages
- verification_status
- created_at
- updated_at

user_preferences
- id (PK)
- user_id (FK → users.id)
- notification_email
- notification_sms
- preferred_currency
- preferred_language
```

#### 5.1.3 Listings

```text
listings
- id (PK)
- host_id (FK → users.id)
- title
- description
- property_type
- room_type
- address
- city
- state
- country
- postal_code
- latitude
- longitude
- min_guests
- max_guests
- bedrooms
- beds
- bathrooms
- base_price_per_night
- currency
- cleaning_fee
- extra_guest_fee
- weekend_price_multiplier (optional)
- cancellation_policy_id (FK → cancellation_policies.id)
- is_active
- created_at
- updated_at
```

#### 5.1.4 Amenities

```text
amenities
- id (PK)
- name
- category

listing_amenities
- id (PK)
- listing_id (FK → listings.id)
- amenity_id (FK → amenities.id)
```

#### 5.1.5 Photos

```text
listing_photos
- id (PK)
- listing_id (FK → listings.id)
- url
- caption
- is_primary
- created_at
```

#### 5.1.6 House Rules

```text
house_rules
- id (PK)
- listing_id (FK → listings.id)
- allows_pets
- allows_parties
- allows_smoking
- check_in_from
- check_in_until
- check_out_until
- additional_rules_text
```

#### 5.1.7 Cancellation Policies

```text
cancellation_policies
- id (PK)
- name (e.g., Flexible, Moderate, Strict)
- description
- refund_window_days
- partial_refund_window_days
- partial_refund_percentage
```

#### 5.1.8 Availability & Calendar

```text
listing_availability
- id (PK)
- listing_id (FK → listings.id)
- date
- is_available
- price_per_night (optional override)
- min_stay_override (optional)
- max_stay_override (optional)
```

#### 5.1.9 Bookings

```text
bookings
- id (PK)
- listing_id (FK → listings.id)
- guest_id (FK → users.id)
- host_id (FK → users.id)
- check_in_date
- check_out_date
- num_guests
- status (pending, confirmed, cancelled_by_guest, cancelled_by_host, completed, rejected)
- instant_book (boolean)
- total_price
- currency
- created_at
- confirmed_at
- cancelled_at
- completed_at
```

#### 5.1.10 Payments

```text
payments
- id (PK)
- booking_id (FK → bookings.id)
- user_id (FK → users.id)
- amount
- currency
- status (pending, paid, failed, refunded, partial_refund)
- payment_method_id (FK → payment_methods.id)
- provider_transaction_id
- created_at
- processed_at
```

#### 5.1.11 Payment Methods

```text
payment_methods
- id (PK)
- user_id (FK → users.id)
- type (card, bank, wallet)
- provider
- token_or_reference
- is_default
- created_at
```

#### 5.1.12 Reviews

```text
reviews
- id (PK)
- booking_id (FK → bookings.id)
- listing_id (FK → listings.id)
- guest_id (FK → users.id)
- host_id (FK → users.id)
- guest_rating
- host_rating
- guest_review_text
- host_review_text
- is_visible
- created_at
```

#### 5.1.13 Messages

```text
messages
- id (PK)
- conversation_id (FK → conversations.id)
- sender_id (FK → users.id)
- content
- created_at
- is_deleted

conversations
- id (PK)
- booking_id (FK → bookings.id, nullable for pre-booking chats)
- listing_id (FK → listings.id, nullable)
- guest_id (FK → users.id)
- host_id (FK → users.id)
- created_at
- updated_at
```

#### 5.1.14 Wishlists

```text
wishlists
- id (PK)
- user_id (FK → users.id)
- name
- created_at

wishlist_items
- id (PK)
- wishlist_id (FK → wishlists.id)
- listing_id (FK → listings.id)
- created_at
```

#### 5.1.15 Disputes & Support

```text
disputes
- id (PK)
- booking_id (FK → bookings.id)
- reporter_id (FK → users.id)
- respondent_id (FK → users.id)
- type (safety, cleanliness, not_as_described, payment, other)
- status (open, in_progress, resolved, closed)
- description
- created_at
- resolved_at

support_tickets
- id (PK)
- user_id (FK → users.id)
- booking_id (FK → bookings.id, nullable)
- category
- status
- description
- created_at
- resolved_at
```

### 5.2 Indexing & Performance

- Index on:
  - `listings.city`, `listings.country`
  - `listings.latitude`, `listings.longitude`
  - `listing_availability.listing_id`, `listing_availability.date`
  - `bookings.listing_id`, `bookings.guest_id`, `bookings.status`
  - `payments.booking_id`, `payments.status`
  - `reviews.listing_id`, `reviews.guest_id`
- Use spatial indexes for location-based queries (if supported).

---

## 6. Key Edge Cases

### 6.1 Booking & Availability

- **Double booking:**
  - Two guests request same dates simultaneously.
  - Solution:
    - Use database-level constraints on overlapping bookings.
    - Lock rows or use optimistic locking on `listing_availability`.

- **Last-minute cancellation:**
  - Guest cancels close to check-in.
  - Solution:
    - Enforce cancellation policy.
    - Partial or no refund based on policy.
    - Notify host and adjust availability.

- **Host overbooking:**
  - Host manually blocks dates but listing still shows as available.
  - Solution:
    - Always derive availability from `listing_availability` + `bookings`.
    - Prevent manual overrides that conflict with existing bookings.

### 6.2 Payments

- **Payment failure after booking created:**
  - Booking status stays `pending` until payment succeeds.
  - Auto-cancel after timeout if payment fails.

- **Refunds:**
  - Partial refunds based on policy.
  - Track refund amount and reason in `payments`.

- **Currency mismatches:**
  - Guest pays in different currency than listing.
  - Solution:
    - Store prices in listing currency.
    - Convert at time of payment using stored exchange rate.

### 6.3 Reviews & Ratings

- **Review bombing:**
  - Multiple negative reviews in short time.
  - Solution:
    - Flag for admin review.
    - Possibly hide or delay visibility.

- **Host/guest review imbalance:**
  - Only one side leaves review.
  - Solution:
    - Show partial review data.
    - Encourage both sides to review.

- **Fake reviews:**
  - Solution:
    - Only allow reviews from verified bookings.
    - Detect patterns (same user, similar text).

### 6.4 Safety & Abuse

- **Fraudulent listings:**
  - Solution:
    - Verification steps (ID, phone, address).
    - Manual review for new hosts.
    - Suspicious activity detection.

- **Guest misconduct:**
  - Solution:
    - Dispute system.
    - Host can report incident.
    - Platform can block users.

- **Data privacy:**
  - Solution:
    - Mask phone/email until booking confirmed.
    - Secure storage of sensitive data.

### 6.5 Technical Edge Cases

- **Concurrent edits:**
  - Host updates listing while guest is viewing.
  - Solution:
    - Versioning or optimistic locking.
    - Show updated content on next load.

- **Timezone issues:**
  - Check-in/out times across countries.
  - Solution:
    - Store dates in UTC.
    - Display in user’s local timezone.

- **Scalability:**
  - High traffic search.
  - Solution:
    - Use search index (e.g., Elasticsearch) for geo + filter queries.
    - Cache popular listings and search results.

---

## 7. Non-Functional Requirements

- **Performance:**
  - Search results in < 300ms for typical queries.
  - Booking confirmation in < 2s.

- **Security:**
  - HTTPS only.
  - Encrypted storage of sensitive data.
  - Role-based access control.

- **Reliability:**
  - 99.9% uptime target.
  - Automated backups and disaster recovery.

- **Compliance:**
  - GDPR/CCPA compliance for user data.
  - Local regulations for short-term rentals.

---

## 8. Future Extensions (Optional)

- Long-term rentals module
- Corporate travel accounts
- Multi-property host dashboards
- Dynamic pricing engine
- Integration with local tourism APIs
- Advanced analytics for hosts
