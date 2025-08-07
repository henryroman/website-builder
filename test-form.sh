#!/bin/bash

# Test form submission to the API
echo "Testing form submission..."

# Test data
TEST_DATA='{
  "businessInfo": {
    "businessName": "Test Business Corp",
    "description": "A test business for form submission",
    "industry": "Technology",
    "email": "test@business.com",
    "phone": "+1 (555) 123-4567",
    "address": "123 Test Street",
    "city": "Test City",
    "state": "Test State",
    "zipCode": "12345",
    "country": "Test Country"
  },
  "designPreferences": {
    "primaryColor": "#3b82f6",
    "secondaryColor": "#10b981",
    "template": "modern",
    "layout": "Single Page",
    "style": "Modern"
  },
  "websiteContent": {
    "services": "Web Development\nMobile Apps\nConsulting",
    "products": "Software\nHardware\nSupport",
    "hours": "Monday-Friday: 9AM-6PM\nSaturday: 10AM-4PM\nSunday: Closed",
    "features": "Contact form, Photo gallery, Blog"
  }
}'

echo "Submitting form data..."
echo "Data: $TEST_DATA"

# Submit to API
RESPONSE=$(curl -s -X POST http://localhost:3000/api/websites/generate \
  -H "Content-Type: application/json" \
  -d "$TEST_DATA")

echo "Response: $RESPONSE"

# Check if response contains success
if echo "$RESPONSE" | grep -q '"success":true'; then
    echo "✅ Form submission successful!"
else
    echo "❌ Form submission failed!"
    echo "Response: $RESPONSE"
fi