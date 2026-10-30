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

-- The remaining demo places, so the database matches lib/data/demo.ts.
insert into public.listings (
  id, name_en, name_bn, category, place_type, summary_en, summary_bn,
  address_en, address_bn, area_name, latitude, longitude, location_precision,
  phone_public, source_type, source_label, source_checked_at,
  ingestion_method, import_batch_id, publication_status
) values
  (
    '00000000-0000-4000-8000-000000000005', 'Agrabad General Hospital (demo)', 'আগ্রাবাদ জেনারেল হাসপাতাল (ডেমো)', 'health',
    'hospital', 'Demo hospital entry. Every access detail here is invented for the pilot.',
    'ডেমো হাসপাতাল এন্ট্রি। এখানকার প্রতিটি প্রবেশগম্যতার তথ্য পাইলটের জন্য কাল্পনিক।',
    'Demo address, Agrabad, Chattogram', 'ডেমো ঠিকানা, আগ্রাবাদ, চট্টগ্রাম',
    'Agrabad', 22.3259, 91.8097,
    'approximate', null,
    'reviewer_observation', 'Reviewer observation, demo data',
    '2026-10-05T00:00:00Z', 'manual_research',
    'demo_seed_20261025', 'published'
  ),
  (
    '00000000-0000-4000-8000-000000000006', 'District Social Welfare Office (demo)', 'জেলা সমাজকল্যাণ অফিস (ডেমো)', 'benefits',
    'government office', 'Demo benefits desk. Only the entrance and toilet were checked.',
    'ডেমো সেবা অফিস। শুধু প্রবেশপথ ও টয়লেট যাচাই করা হয়েছে।',
    'Demo address, Kotwali, Chattogram', 'ডেমো ঠিকানা, কোতোয়ালী, চট্টগ্রাম',
    'Kotwali', 22.3391, 91.8315,
    'approximate', null,
    'reviewer_observation', 'Official source, demo data',
    '2026-09-18T00:00:00Z', 'manual_research',
    'demo_seed_20261025', 'published'
  ),
  (
    '00000000-0000-4000-8000-000000000007', 'Bahaddarhat Bus Terminal (demo)', 'বহদ্দারহাট বাস টার্মিনাল (ডেমো)', 'transport',
    'bus terminal', 'Demo terminal with a step at the gate and no accessible toilet.',
    'ডেমো টার্মিনাল। গেটে সিঁড়ি আছে, প্রবেশগম্য টয়লেট নেই।',
    'Demo address, Bahaddarhat, Chattogram', 'ডেমো ঠিকানা, বহদ্দারহাট, চট্টগ্রাম',
    'Bahaddarhat', 22.3672, 91.8041,
    'approximate', null,
    'reviewer_observation', 'Reviewer observation, demo data',
    '2026-09-05T00:00:00Z', 'manual_research',
    'demo_seed_20261025', 'published'
  ),
  (
    '00000000-0000-4000-8000-000000000008', 'Halishahar Stadium (demo)', 'হালিশাহর স্টেডিয়াম (ডেমো)', 'accessibility',
    'stadium', 'Demo stadium entry with a full set of checked features.',
    'ডেমো স্টেডিয়াম এন্ট্রি। সব সুবিধা যাচাই করা অবস্থায় আছে।',
    'Demo address, Halishahar, Chattogram', 'ডেমো ঠিকানা, হালিশাহর, চট্টগ্রাম',
    'Halishahar', 22.3472, 91.8067,
    'approximate', null,
    'reviewer_observation', 'Organisation source, demo data',
    '2026-10-12T00:00:00Z', 'manual_research',
    'demo_seed_20261025', 'published'
  ),
  (
    '00000000-0000-4000-8000-000000000009', 'Oxygen Bazar (demo)', 'অক্সিজেন বাজার (ডেমো)', 'accessibility',
    'market', 'Demo market stalls. Crowded aisles, one step-free lane at the rear.',
    'ডেমো বাজার। গলি ভিড়তুল্য, পেছনের পথটি সিঁড়ি ছাড়া।',
    'Demo address, Oxygen, Chattogram', 'ডেমো ঠিকানা, অক্সিজেন, চট্টগ্রাম',
    'Oxygen', 22.3639, 91.8174,
    'approximate', null,
    'reviewer_observation', 'Community report, reviewed, demo data',
    '2026-09-28T00:00:00Z', 'manual_research',
    'demo_seed_20261025', 'published'
  ),
  (
    '00000000-0000-4000-8000-000000000010', 'Muradpur Flyover Bus Stop (demo)', 'মুরাদপুর ওভারব্রিজ বাস স্টপ (ডেমো)', 'transport',
    'bus stop', 'Demo record with no accepted accessibility observation yet.',
    'স্বীকৃত প্রবেশগম্যতা পর্যবেক্ষণ এখনো নেই এমন ডেমো রেকর্ড।',
    'Demo address, Muradpur, Chattogram', 'ডেমো ঠিকানা, মুরাদপুর, চট্টগ্রাম',
    'Muradpur', 22.3548, 91.8129,
    'approximate', null,
    'reviewer_observation', 'Source not available, demo data',
    '2026-10-14T00:00:00Z', 'manual_research',
    'demo_seed_20261025', 'published'
  ),
  (
    '00000000-0000-4000-8000-000000000011', 'New Market Eye Hospital (demo)', 'নিউমার্কেট চক্ষু হাসপাতাল (ডেমো)', 'health',
    'clinic', 'Demo clinic entry in a busy lane. The rear entrance is step-free.',
    'ভিড় ভরা গলিতে ডেমো ক্লিনিক। পেছনের প্রবেশপথ সিঁড়ি ছাড়া।',
    'Demo address, New Market, Chattogram', 'ডেমো ঠিকানা, নিউ মার্কেট, চট্টগ্রাম',
    'New Market', 22.3416, 91.8273,
    'approximate', null,
    'reviewer_observation', 'Organisation source, demo data',
    '2026-08-22T00:00:00Z', 'manual_research',
    'demo_seed_20261025', 'published'
  ),
  (
    '00000000-0000-4000-8000-000000000012', 'Laladighi Police Service Counter (demo)', 'লালাদিঘি পুলিশ সেবা কাউন্টার (ডেমো)', 'government',
    'service counter', 'Demo service counter. Two features checked, the rest are open.',
    'ডেমো সেবা কাউন্টার। দুটি সুবিধা যাচাই করা, বাকিগুলো খোলা।',
    'Demo address, Kotwali, Chattogram', 'ডেমো ঠিকানা, কোতোয়ালী, চট্টগ্রাম',
    'Kotwali', 22.3367, 91.8299,
    'approximate', null,
    'reviewer_observation', 'Official source, demo data',
    '2026-10-01T00:00:00Z', 'manual_research',
    'demo_seed_20261025', 'published'
  ),
  (
    '00000000-0000-4000-8000-000000000013', 'Panchlaish Public Library (demo)', 'পাঁচলাইশ সর্বজনীন গ্রন্থাগার (ডেমো)', 'accessibility',
    'library', 'Demo library entry with a ramp, a lift and checked seating.',
    'ডেমো গ্রন্থাগার। র‍্যাম্প, লিফট ও আসন যাচাই করা আছে।',
    'Demo address, Panchlaish, Chattogram', 'ডেমো ঠিকানা, পাঁচলাইশ, চট্টগ্রাম',
    'Panchlaish', 22.3578, 91.8341,
    'approximate', null,
    'reviewer_observation', 'Reviewer observation, demo data',
    '2026-09-20T00:00:00Z', 'manual_research',
    'demo_seed_20261025', 'published'
  ),
  (
    '00000000-0000-4000-8000-000000000014', 'Chattogram Disability Rights Forum (demo)', 'চট্টগ্রাম প্রতিবন্ধক অধিকার ফোরাম (ডেমো)', 'ngo',
    'community organisation', 'Demo community office. Volunteers keep the access notes current.',
    'ডেমো কমিউনিটি অফিস। স্বেচ্ছাসেবীরা প্রবেশ তথ্য হালনাগাদ রাখেন।',
    'Demo address, Panchlaish, Chattogram', 'ডেমো ঠিকানা, পাঁচলাইশ, চট্টগ্রাম',
    'Panchlaish', 22.3605, 91.8318,
    'approximate', null,
    'reviewer_observation', 'Organisation source, demo data',
    '2026-10-08T00:00:00Z', 'manual_research',
    'demo_seed_20261025', 'published'
  ),
  (
    '00000000-0000-4000-8000-000000000015', 'Agrabad Employment Exchange (demo)', 'আগ্রাবাদ কর্মসংস্থান অফিস (ডেমো)', 'benefits',
    'government office', 'Demo record with no accepted accessibility observation yet.',
    'স্বীকৃত প্রবেশগম্যতা পর্যবেক্ষণ এখনো নেই এমন ডেমো রেকর্ড।',
    'Demo address, Agrabad, Chattogram', 'ডেমো ঠিকানা, আগ্রাবাদ, চট্টগ্রাম',
    'Agrabad', 22.3288, 91.8131,
    'approximate', null,
    'reviewer_observation', 'Source not available, demo data',
    '2026-10-10T00:00:00Z', 'manual_research',
    'demo_seed_20261025', 'published'
  ),
  (
    '00000000-0000-4000-8000-000000000016', 'Khulshi Community Centre (demo)', 'খুলশী কমিউনিটি সেন্টার (ডেমো)', 'ngo',
    'community centre', 'Demo community hall. The survey team has not visited yet.',
    'ডেমো কমিউনিটি হল। জরিপ দল এখনো ঘরেনি।',
    'Demo address, Khulshi, Chattogram', 'ডেমো ঠিকানা, খুলশী, চট্টগ্রাম',
    'Khulshi', null, null,
    'unknown', null,
    'reviewer_observation', 'Source not available, demo data',
    '2026-10-15T00:00:00Z', 'manual_research',
    'demo_seed_20261025', 'published'
  );

insert into public.accessibility_observations (
  id, listing_id, feature_states, notes_public, observed_at, source_type,
  source_url, source_label, ingestion_method, import_batch_id,
  review_status, reviewer_id, reviewed_at, submitted_at
) values
  (
    'b181da18-465a-417d-9e66-ed59284e9af8', '00000000-0000-4000-8000-000000000005',
    '{"step_free_entrance":"yes","entrance_steps":"no","ramp":"partial","lift":"not_checked","toilet_available":"yes","accessible_toilet":"partial","internal_step_free_route":"partial","accessible_parking":"not_checked","accessible_seating":"yes","other_access_note":"not_checked"}'::jsonb,
    null, '2026-10-05',
    'reviewer_observation', null,
    'Reviewer observation, demo data', 'manual_research',
    'demo_seed_20261025', 'accepted',
    null, '2026-10-05T10:00:00Z', '2026-10-05T10:00:00Z'
  ),
  (
    'ef40395f-1453-4081-84a0-5e3c7d5a1b4a', '00000000-0000-4000-8000-000000000006',
    '{"step_free_entrance":"yes","entrance_steps":"not_checked","ramp":"not_checked","lift":"not_checked","toilet_available":"yes","accessible_toilet":"not_checked","internal_step_free_route":"not_checked","accessible_parking":"not_checked","accessible_seating":"not_checked","other_access_note":"not_checked"}'::jsonb,
    null, '2026-09-18',
    'official_source', null,
    'Official source, demo data', 'manual_research',
    'demo_seed_20261025', 'accepted',
    null, '2026-09-18T10:00:00Z', '2026-09-18T10:00:00Z'
  ),
  (
    'f0b21ac9-3bf8-4319-9fe3-81db5c4b2db9', '00000000-0000-4000-8000-000000000007',
    '{"step_free_entrance":"no","entrance_steps":"yes","ramp":"no","lift":"not_checked","toilet_available":"yes","accessible_toilet":"no","internal_step_free_route":"no","accessible_parking":"not_checked","accessible_seating":"partial","other_access_note":"not_checked"}'::jsonb,
    'The approach has two steps at the gate.', '2026-09-05',
    'reviewer_observation', null,
    'Reviewer observation, demo data', 'manual_research',
    'demo_seed_20261025', 'accepted',
    null, '2026-09-05T10:00:00Z', '2026-09-05T10:00:00Z'
  ),
  (
    'a16cea4c-01bf-4ed5-9b05-4692d95b19cf', '00000000-0000-4000-8000-000000000008',
    '{"step_free_entrance":"yes","entrance_steps":"not_applicable","ramp":"yes","lift":"yes","toilet_available":"yes","accessible_toilet":"yes","internal_step_free_route":"yes","accessible_parking":"partial","accessible_seating":"yes","other_access_note":"not_checked"}'::jsonb,
    null, '2026-10-12',
    'organisation_source', null,
    'Organisation source, demo data', 'manual_research',
    'demo_seed_20261025', 'accepted',
    null, '2026-10-12T10:00:00Z', '2026-10-12T10:00:00Z'
  ),
  (
    '9248a7db-8c91-4600-ace4-7c0b9b7d47ba', '00000000-0000-4000-8000-000000000009',
    '{"step_free_entrance":"yes","entrance_steps":"no","ramp":"partial","lift":"not_checked","toilet_available":"yes","accessible_toilet":"partial","internal_step_free_route":"partial","accessible_parking":"not_checked","accessible_seating":"yes","other_access_note":"not_checked"}'::jsonb,
    'Crowded aisles; the rear lane is the step-free one.', '2026-09-28',
    'community_report', null,
    'Community report, reviewed, demo data', 'manual_research',
    'demo_seed_20261025', 'accepted',
    null, '2026-09-28T10:00:00Z', '2026-09-28T10:00:00Z'
  ),
  (
    'bf2856c4-123e-4e6b-8014-4eeafddc7180', '00000000-0000-4000-8000-000000000011',
    '{"step_free_entrance":"yes","entrance_steps":"no","ramp":"partial","lift":"not_checked","toilet_available":"yes","accessible_toilet":"partial","internal_step_free_route":"partial","accessible_parking":"not_checked","accessible_seating":"yes","other_access_note":"not_checked"}'::jsonb,
    null, '2026-08-22',
    'organisation_source', null,
    'Organisation source, demo data', 'manual_research',
    'demo_seed_20261025', 'accepted',
    null, '2026-08-22T10:00:00Z', '2026-08-22T10:00:00Z'
  ),
  (
    'bec3fd0d-da19-400c-89f4-16ca55acde87', '00000000-0000-4000-8000-000000000012',
    '{"step_free_entrance":"yes","entrance_steps":"not_checked","ramp":"not_checked","lift":"not_checked","toilet_available":"yes","accessible_toilet":"not_checked","internal_step_free_route":"not_checked","accessible_parking":"not_checked","accessible_seating":"not_checked","other_access_note":"not_checked"}'::jsonb,
    null, '2026-10-01',
    'official_source', null,
    'Official source, demo data', 'manual_research',
    'demo_seed_20261025', 'accepted',
    null, '2026-10-01T10:00:00Z', '2026-10-01T10:00:00Z'
  ),
  (
    '55f9c42c-b3b1-4321-afcd-9ea5e82bcc48', '00000000-0000-4000-8000-000000000013',
    '{"step_free_entrance":"yes","entrance_steps":"not_applicable","ramp":"yes","lift":"yes","toilet_available":"yes","accessible_toilet":"yes","internal_step_free_route":"yes","accessible_parking":"partial","accessible_seating":"yes","other_access_note":"not_checked"}'::jsonb,
    null, '2026-09-20',
    'reviewer_observation', null,
    'Reviewer observation, demo data', 'manual_research',
    'demo_seed_20261025', 'accepted',
    null, '2026-09-20T10:00:00Z', '2026-09-20T10:00:00Z'
  ),
  (
    '0adb1126-337a-4423-9e55-101a8cd82248', '00000000-0000-4000-8000-000000000014',
    '{"step_free_entrance":"yes","entrance_steps":"no","ramp":"partial","lift":"not_checked","toilet_available":"yes","accessible_toilet":"partial","internal_step_free_route":"partial","accessible_parking":"not_checked","accessible_seating":"yes","other_access_note":"not_checked"}'::jsonb,
    null, '2026-10-08',
    'organisation_source', null,
    'Organisation source, demo data', 'manual_research',
    'demo_seed_20261025', 'accepted',
    null, '2026-10-08T10:00:00Z', '2026-10-08T10:00:00Z'
  );
