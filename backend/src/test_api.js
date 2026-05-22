import assert from 'assert';

const BASE_URL = 'http://localhost:5000';

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  const data = await response.json().catch(() => ({}));
  return { status: response.status, data };
}

async function runTests() {
  console.log('--- Starting Backend API E2E Verification Tests ---');

  // Helper dynamic suffixes to prevent unique constraints issues
  const ts = Date.now();
  const testUserEmail = `user_${ts}@test.com`;
  const testOwnerEmail = `owner_${ts}@test.com`;
  const registeredUserEmail = `reg_${ts}@test.com`;
  const storeEmail = `store_${ts}@test.com`;

  let adminToken = '';
  let userToken = '';
  let ownerToken = '';
  let registeredUserToken = '';
  let ownerId = '';
  let storeId = '';
  let userId = '';

  // 1. LOGIN AS ADMIN
  console.log('\n[1] Testing Admin Login...');
  const adminLoginRes = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: 'admin@admin.com', password: 'Admin@123' }),
  });
  assert.strictEqual(adminLoginRes.status, 200, 'Admin login should succeed');
  assert.strictEqual(adminLoginRes.data.user.role, 'ADMIN', 'Admin role mismatch');
  adminToken = adminLoginRes.data.token;
  console.log('✔ Admin logged in successfully.');

  // 2. CREATE A STORE OWNER USER AS ADMIN
  console.log('\n[2] Creating STORE_OWNER user via Admin...');
  const createOwnerRes = await request('/api/admin/users', {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify({
      name: 'Owner Account Long Name For Validation 20 Chars',
      email: testOwnerEmail,
      address: 'Owner Address Suite 100',
      password: 'Owner@123',
      role: 'STORE_OWNER',
    }),
  });
  assert.strictEqual(createOwnerRes.status, 201, 'Should create Store Owner');
  ownerId = createOwnerRes.data.id;
  console.log(`✔ Store Owner created with ID: ${ownerId}`);

  // 3. CREATE A STORE AND ASSIGN IT TO STORE_OWNER
  console.log('\n[3] Creating Store via Admin...');
  const createStoreRes = await request('/api/admin/stores', {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify({
      name: 'The Mega Super Store',
      email: storeEmail,
      address: '123 Retail Lane, Shoptown',
      ownerId: ownerId,
    }),
  });
  assert.strictEqual(createStoreRes.status, 201, 'Should create Store');
  storeId = createStoreRes.data.id;
  console.log(`✔ Store created with ID: ${storeId}`);

  // 4. CREATE A USER ACCOUNT VIA REGISTER (PUBLIC ROUTE)
  console.log('\n[4] Testing Public Registration...');
  const registerUserRes = await request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Regular Reviewer Long Name 20 Chars',
      email: registeredUserEmail,
      address: 'Reviewer House 45',
      password: 'Reviewer@123',
    }),
  });
  assert.strictEqual(registerUserRes.status, 201, 'Registration should succeed');
  registeredUserToken = registerUserRes.data.token;
  userId = registerUserRes.data.user.id;
  console.log(`✔ Registered user with ID: ${userId}`);

  // 5. TEST INPUT VALIDATIONS ON PUBLIC REGISTRATION
  console.log('\n[5] Testing Registration Validations...');
  // Too short name
  const invalidNameRes = await request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Short Name',
      email: `invalid_${ts}@test.com`,
      address: 'Some address',
      password: 'Pass@123',
    }),
  });
  assert.strictEqual(invalidNameRes.status, 400, 'Registration with short name should fail (400)');

  // Invalid password (no uppercase)
  const invalidPassRes = await request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Valid Name Longer Than Twenty Chars',
      email: `invalid_${ts}@test.com`,
      address: 'Some address',
      password: 'password@123',
    }),
  });
  assert.strictEqual(invalidPassRes.status, 400, 'Registration without uppercase in password should fail (400)');

  // Invalid password (no special char)
  const invalidPassRes2 = await request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Valid Name Longer Than Twenty Chars',
      email: `invalid_${ts}@test.com`,
      address: 'Some address',
      password: 'Password123',
    }),
  });
  assert.strictEqual(invalidPassRes2.status, 400, 'Registration without special char in password should fail (400)');
  console.log('✔ Input validations working correctly.');

  // 6. LOG IN AS REGISTERED USER
  console.log('\n[6] Testing Registered User Login...');
  const userLoginRes = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: registeredUserEmail, password: 'Reviewer@123' }),
  });
  assert.strictEqual(userLoginRes.status, 200, 'User login should succeed');
  userToken = userLoginRes.data.token;
  console.log('✔ User logged in successfully.');

  // 7. USER SUBMITS RATING
  console.log('\n[7] User Submitting Rating...');
  const ratingRes = await request('/api/ratings', {
    method: 'POST',
    headers: { Authorization: `Bearer ${userToken}` },
    body: JSON.stringify({ storeId: storeId, value: 5 }),
  });
  assert.strictEqual(ratingRes.status, 200, 'Rating submission should succeed');
  console.log('✔ Rating submitted successfully.');

  // 8. VERIFY STORE LIST REFLECTS RATING FOR USER
  console.log('\n[8] Fetching Stores List (User role)...');
  const storesRes = await request('/api/stores', {
    method: 'GET',
    headers: { Authorization: `Bearer ${userToken}` },
  });
  assert.strictEqual(storesRes.status, 200, 'Getting stores should succeed');
  const targetStore = storesRes.data.find((s) => s.id === storeId);
  assert.ok(targetStore, 'Store should be in user listing');
  assert.strictEqual(targetStore.averageRating, 5, 'Store average rating should be 5');
  assert.strictEqual(targetStore.userRating, 5, 'User rating should be 5');
  console.log('✔ Store listing average rating and user rating are verified.');

  // 9. LOG IN AS STORE OWNER AND CHECK DASHBOARD
  console.log('\n[9] Store Owner Login and Dashboard metrics...');
  const ownerLoginRes = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: testOwnerEmail, password: 'Owner@123' }),
  });
  assert.strictEqual(ownerLoginRes.status, 200, 'Owner login should succeed');
  ownerToken = ownerLoginRes.data.token;

  const ownerDashboardRes = await request('/api/owner/dashboard', {
    method: 'GET',
    headers: { Authorization: `Bearer ${ownerToken}` },
  });
  assert.strictEqual(ownerDashboardRes.status, 200, 'Owner dashboard request should succeed');
  assert.strictEqual(ownerDashboardRes.data.averageRating, 5, 'Dashboard average rating mismatch');
  assert.strictEqual(ownerDashboardRes.data.reviewers.length, 1, 'Reviewers count mismatch');
  assert.strictEqual(ownerDashboardRes.data.reviewers[0].rating, 5, 'Reviewer rating mismatch');
  console.log('✔ Store Owner dashboard is verified successfully.');

  // 10. CHANGE USER PASSWORD AND LOG IN WITH NEW PASSWORD
  console.log('\n[10] Testing Change Password...');
  const changePasswordRes = await request('/api/auth/change-password', {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${userToken}` },
    body: JSON.stringify({ password: 'NewPassword@999' }),
  });
  assert.strictEqual(changePasswordRes.status, 200, 'Password change should succeed');

  // Verify can't login with old password anymore
  const oldLoginRes = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: registeredUserEmail, password: 'Reviewer@123' }),
  });
  assert.strictEqual(oldLoginRes.status, 401, 'Login with old password should fail');

  // Login with new password
  const newLoginRes = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: registeredUserEmail, password: 'NewPassword@999' }),
  });
  assert.strictEqual(newLoginRes.status, 200, 'Login with new password should succeed');
  console.log('✔ Password change and login re-verification succeeded.');

  // 11. ADMIN DASHBOARD & LISTING CHECKS
  console.log('\n[11] Admin Dashboard & Listing validations...');
  const adminDashboardRes = await request('/api/admin/dashboard', {
    method: 'GET',
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert.strictEqual(adminDashboardRes.status, 200);
  assert.ok(adminDashboardRes.data.totalUsers >= 3, 'User count check'); // Admin, testOwner, registeredUser, and maybe others from seed
  assert.ok(adminDashboardRes.data.totalStores >= 1, 'Store count check');
  assert.ok(adminDashboardRes.data.totalRatings >= 1, 'Rating count check');

  // Fetch admin user detail for the owner user
  const adminOwnerDetailRes = await request(`/api/admin/users/${ownerId}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert.strictEqual(adminOwnerDetailRes.status, 200);
  assert.strictEqual(adminOwnerDetailRes.data.store.averageRating, 5);
  assert.strictEqual(adminOwnerDetailRes.data.store.name, 'The Mega Super Store');
  console.log('✔ Admin details and dashboard statistics verified.');

  console.log('\n=============================================');
  console.log('✔ ALL BACKEND ENDPOINT E2E TESTS PASSED SUCCESSFULLY!');
  console.log('=============================================\n');
}

runTests().catch((err) => {
  console.error('\n❌ Test Failure occurred:');
  console.error(err);
  process.exit(1);
});
