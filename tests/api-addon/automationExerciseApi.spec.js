
const { test, expect } = require('@playwright/test');

const BASE_URL = 'https://automationexercise.com/api';

test.describe('Automation Exercise Safe API Tests', () => {

    test('API 1 - Get All Products List', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/productsList`);

        expect(response.status()).toBe(200);

        const body = await response.json();

        expect(body.products.length).toBeGreaterThan(0);
    });

    test('API 2 - POST To All Products List', async ({ request }) => {
        const response = await request.post(`${BASE_URL}/productsList`);

        const body = await response.json();

        expect(body.responseCode).toBe(405);
    });

    test('API 3 - Get All Brands List', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/brandsList`);

        expect(response.status()).toBe(200);

        const body = await response.json();

        expect(body.brands.length).toBeGreaterThan(0);
    });

    test('API 4 - PUT To All Brands List', async ({ request }) => {
        const response = await request.put(`${BASE_URL}/brandsList`);

        const body = await response.json();

        expect(body.responseCode).toBe(405);
    });

    test('API 5 - Search Product', async ({ request }) => {
        const response = await request.post(`${BASE_URL}/searchProduct`, {
            form: {
                search_product: 'top'
            }
        });

        expect(response.status()).toBe(200);

        const body = await response.json();

        expect(body.products.length).toBeGreaterThan(0);
    });

    test('API 6 - Search Product Without Parameter', async ({ request }) => {
        const response = await request.post(`${BASE_URL}/searchProduct`);

        const body = await response.json();

        expect(body.responseCode).toBe(400);
    });

    test('API 7 - Verify Login Without Email', async ({ request }) => {
        const response = await request.post(`${BASE_URL}/verifyLogin`, {
            form: {
                password: 'Password123'
            }
        });

        const body = await response.json();

        expect(body.responseCode).toBe(400);
    });

    test('API 8 - DELETE To Verify Login', async ({ request }) => {
        const response = await request.delete(`${BASE_URL}/verifyLogin`);

        const body = await response.json();

        expect(body.responseCode).toBe(405);
    });

    test('API 9 - Verify Login With Invalid Details', async ({ request }) => {
        const response = await request.post(`${BASE_URL}/verifyLogin`, {
            form: {
                email: 'invalid@test.com',
                password: 'wrongpassword'
            }
        });

        const body = await response.json();

        expect(body.responseCode).toBe(404);
    });

    test('API 10 - Products Response Contains Product Data', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/productsList`);

        const body = await response.json();

        expect(body.products[0]).toHaveProperty('id');
        expect(body.products[0]).toHaveProperty('name');
    });

    test('API 11 - Brands Response Contains Brand Data', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/brandsList`);

        const body = await response.json();

        expect(body.brands[0]).toHaveProperty('id');
        expect(body.brands[0]).toHaveProperty('brand');
    });

});

