/**
 * Integration Test for Search API
 * 
 * This script verifies the /api/search endpoint works correctly after deployment.
 * Run with: node execution/test_api_search.js
 */

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

async function testSearch(query, filters = {}) {
    const params = new URLSearchParams({ query, ...filters });
    const url = `${BASE_URL}/api/search?${params}`;

    console.log(`\n🔍 Testing: ${url}`);

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            console.error(`❌ FAILED: Status ${response.status}`);
            console.error('Error:', data);
            return false;
        }

        console.log(`✅ SUCCESS: Found ${data.count} results`);
        if (data.results && data.results.length > 0) {
            console.log('Sample result:', data.results[0]);
        }
        return true;
    } catch (error) {
        console.error(`❌ FAILED: ${error.message}`);
        return false;
    }
}

async function runTests() {
    console.log('🧪 Search API Integration Tests\n');
    console.log(`Target: ${BASE_URL}`);

    const tests = [
        { name: 'Basic search', query: 'pasta' },
        { name: 'Keto filter', query: 'pasta', filters: { keto: 'true' } },
        { name: 'Empty query (should fail)', query: '' },
        { name: 'Very long query (should fail)', query: 'a'.repeat(101) },
    ];

    let passed = 0;
    let failed = 0;

    for (const test of tests) {
        const result = await testSearch(test.query, test.filters);
        if (result) passed++;
        else failed++;
    }

    console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);
    process.exit(failed > 0 ? 1 : 0);
}

runTests();
