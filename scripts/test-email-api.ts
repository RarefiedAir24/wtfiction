/**
 * Test script for email subscription API
 * Tests the /api/subscribe endpoint with SMTP configuration
 */

async function testEmailAPI() {
  // Get test email from command line or use default
  const testEmail = process.argv[2] || 'test@example.com';
  
  // For production testing, set API_URL to your Vercel URL
  // Example: API_URL=https://wtfiction.com/api/subscribe npm run test-email
  const apiUrl = process.env.API_URL || 'http://localhost:3000/api/subscribe';
  
  console.log('🧪 Testing Email Subscription API...');
  console.log(`📧 Test email: ${testEmail}`);
  console.log(`🔗 API URL: ${apiUrl}`);
  console.log(`\n📋 Environment check:`);
  console.log(`   SMTP_HOST: ${process.env.SMTP_HOST || '❌ Not set'}`);
  console.log(`   SMTP_USER: ${process.env.SMTP_USER || '❌ Not set'}`);
  console.log(`   SMTP_PASSWORD: ${process.env.SMTP_PASSWORD ? '✅ Set' : '❌ Not set'}`);
  console.log(`   SUBSCRIBE_EMAIL: ${process.env.SUBSCRIBE_EMAIL || '❌ Not set (will use default)'}\n`);

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: testEmail }),
    });

    const data = await response.json();

    console.log(`📊 Status: ${response.status} ${response.statusText}`);
    console.log(`📦 Response:`, JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log('\n✅ SUCCESS: Email subscription API is working!');
      console.log('   Check subscribe@wtfiction.com for the test email.');
    } else {
      console.log('\n❌ ERROR: API returned an error');
      console.log(`   Error: ${data.error || 'Unknown error'}`);
      
      if (data.error?.includes('configuration') || data.error?.includes('not configured')) {
        console.log('\n💡 Tip: Check that all SMTP environment variables are set in Vercel:');
        console.log('   - SMTP_HOST');
        console.log('   - SMTP_USER');
        console.log('   - SMTP_PASSWORD');
        console.log('   - SUBSCRIBE_EMAIL');
      }
      
      if (data.error?.includes('authentication') || data.error?.includes('verification')) {
        console.log('\n💡 Tip: SMTP authentication failed. Check:');
        console.log('   - SMTP_USER and SMTP_PASSWORD are correct');
        console.log('   - App password is valid (if using app password)');
        console.log('   - SMTP AUTH is enabled on the account');
      }
    }
  } catch (error: any) {
    console.error('\n❌ ERROR: Failed to call API');
    console.error(`   ${error.message}`);
    
    if (error.message.includes('fetch')) {
      console.log('\n💡 Tip: Make sure the API is running:');
      console.log('   - For local: Run "npm run dev"');
      console.log('   - For production: Check Vercel deployment URL');
      console.log('   - Set API_URL environment variable if testing production');
    }
  }
}

// Run the test
testEmailAPI().catch(console.error);
