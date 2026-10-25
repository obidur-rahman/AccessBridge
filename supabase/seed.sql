-- DEMO DATA ONLY. These records are not real Chattogram venue data and must
-- never be published to a live pilot. The `(demo)` name suffix and the
-- demo_seed_20261025 import batch mark them as demo records.

insert into public.listings (
  id, name_en, name_bn, category, place_type, summary_en, summary_bn,
  address_en, address_bn, area_name, latitude, longitude, location_precision,
  phone_public, source_type, source_label, source_checked_at,
  ingestion_method, import_batch_id, publication_status
) values
  (
    '00000000-0000-4000-8000-000000000001',
    'Mezban Kitchen (demo)', 'মেজবান কিচেন (ডেমো)', 'accessibility', 'restaurant',
    'Demo record for the accessibility pilot. Not a real restaurant.',
    'প্রবেশগম্যতা পাইলটের ডেমো রেকর্ড। বাস্তব রেস্তোরাঁ নয়।',
    'Demo address, Kotwali, Chattogram', 'ডেমো ঠিকানা, কোতোয়ালী, চট্টগ্রাম', 'Kotwali',
    22.337500, 91.832600, 'approximate',
    null, 'reviewer_observation', 'Reviewer observation, demo data', '2026-10-12T00:00:00Z',
    'manual_research', 'demo_seed_20261025', 'published'
  ),
  (
    '00000000-0000-4000-8000-000000000002',
    'Chattogram Community Clinic (demo)', 'চট্টগ্রাম কমিউনিটি ক্লিনিক (ডেমো)', 'health', 'clinic',
    'Demo record for the accessibility pilot. Not a real clinic.',
    'প্রবেশগম্যতা পাইলটের ডেমো রেকর্ড। বাস্তব ক্লিনিক নয়।',
    'Demo address, Panchlaish, Chattogram', 'ডেমো ঠিকানা, পাঁচলাইশ, চট্টগ্রাম', 'Panchlaish',
    22.359200, 91.833400, 'approximate',
    null, 'reviewer_observation', 'Reviewer observation, demo data', '2026-09-28T00:00:00Z',
    'manual_research', 'demo_seed_20261025', 'published'
  ),
  (
    '00000000-0000-4000-8000-000000000003',
    'Passport Office Counter (demo)', 'পাসপোর্ট অফিস কাউন্টার (ডেমো)', 'government', 'office',
    'Demo record for the accessibility pilot. Not a real office.',
    'প্রবেশগম্যতা পাইলটের ডেমো রেকর্ড। বাস্তব অফিস নয়।',
    'Demo address, Agrabad, Chattogram', 'ডেমো ঠিকানা, আগ্রাবাদ, চট্টগ্রাম', 'Agrabad',
    22.325400, 91.809000, 'approximate',
    null, 'official_source', 'Official source, demo data', '2026-08-30T00:00:00Z',
    'manual_research', 'demo_seed_20261025', 'published'
  ),
  (
    '00000000-0000-4000-8000-000000000004',
    'Sholoshahar Bus Stop (demo)', 'ষোলশহর বাস স্টপ (ডেমো)', 'transport', 'bus stop',
    'Demo record with no accepted accessibility observation yet.',
    'স্বীকৃত প্রবেশগম্যতা পর্যবেক্ষণ এখনো নেই এমন ডেমো রেকর্ড।',
    'Demo address, Sholoshahar, Chattogram', 'ডেমো ঠিকানা, ষোলশহর, চট্টগ্রাম', 'Sholoshahar',
    null, null, 'unknown',
    null, 'other', 'Source not available, demo data', '2026-10-01T00:00:00Z',
    'manual_research', 'demo_seed_20261025', 'published'
  );

insert into public.accessibility_observations (
  id, listing_id, feature_states, notes_public, observed_at, source_type,
  source_url, source_label, ingestion_method, import_batch_id,
  review_status, reviewer_id, reviewed_at, submitted_at
) values
  (
    '00000000-0000-4000-8000-000000000101',
    '00000000-0000-4000-8000-000000000001',
    '{"step_free_entrance": "yes", "ramp": "yes", "toilet_available": "yes", "accessible_toilet": "no", "internal_step_free_route": "partial", "entrance_steps": "no", "lift": "not_applicable", "accessible_parking": "not_checked", "accessible_seating": "yes", "other_access_note": "not_checked"}'::jsonb,
    'The toilet door is too narrow for a standard wheelchair.',
    '2026-10-12', 'reviewer_observation', null,
    'Reviewer observation, demo data', 'manual_research', 'demo_seed_20261025',
    'accepted', null, '2026-10-13T09:00:00Z', '2026-10-12T18:00:00Z'
  ),
  (
    '00000000-0000-4000-8000-000000000102',
    '00000000-0000-4000-8000-000000000002',
    '{"step_free_entrance": "yes", "ramp": "yes", "lift": "yes", "toilet_available": "yes", "accessible_toilet": "partial", "internal_step_free_route": "yes", "entrance_steps": "not_applicable", "accessible_parking": "no", "accessible_seating": "yes", "other_access_note": "not_checked"}'::jsonb,
    'Lift reaches the first floor. The accessible toilet fits a wheelchair but has no grab bar on the left side.',
    '2026-09-28', 'organisation_source', null,
    'Organisation source, demo data', 'manual_research', 'demo_seed_20261025',
    'accepted', null, '2026-10-02T11:30:00Z', '2026-09-29T10:00:00Z'
  ),
  (
    '00000000-0000-4000-8000-000000000103',
    '00000000-0000-4000-8000-000000000003',
    '{"step_free_entrance": "no", "entrance_steps": "yes", "ramp": "partial", "toilet_available": "not_checked", "accessible_toilet": "not_checked", "lift": "not_checked", "internal_step_free_route": "not_checked", "accessible_parking": "not_checked", "accessible_seating": "not_checked", "other_access_note": "not_checked"}'::jsonb,
    'A removable ramp is available at the side entrance when requested from the guard desk.',
    '2026-03-02', 'official_source', null,
    'Official source, demo data', 'manual_research', 'demo_seed_20261025',
    'accepted', null, '2026-03-04T08:00:00Z', '2026-03-03T09:15:00Z'
  );
