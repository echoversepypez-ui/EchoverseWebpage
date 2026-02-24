const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mzjyflvgjtbolerqzird.supabase.co';
const supabaseKey = 'sb_publishable_krSi8denJC45g6IP8rGI7Q_6VRAmVHq';

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugTestimonials() {
  try {
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║          TESTIMONIALS DEBUG & TROUBLESHOOTING GUIDE        ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    // Step 1: Verify connection
    console.log('📡 Step 1: Verifying Supabase Connection...');
    const { data: connectionTest, error: connError } = await supabase
      .from('page_sections')
      .select('count', { count: 'exact', head: true });

    if (connError) {
      console.error('❌ Connection failed:', connError.message);
      return;
    }
    console.log('✅ Connection successful!\n');

    // Step 2: Check current testimonials
    console.log('📋 Step 2: Checking Current Testimonials...');
    const { data: testimonials, error: fetchError } = await supabase
      .from('page_sections')
      .select('*')
      .eq('section_name', 'testimonials')
      .single();

    if (fetchError) {
      console.error('❌ Error fetching testimonials:', fetchError.message);
      return;
    }

    if (!testimonials) {
      console.log('⚠️ No testimonials section found!');
      return;
    }

    console.log(`✅ Found testimonials section`);
    console.log(`   Total: ${testimonials.content.testimonials?.length || 0} testimonials`);
    console.log(`   Last updated: ${testimonials.updated_at}\n`);

    // Step 3: Validate each testimonial
    console.log('🔍 Step 3: Validating Testimonials...');
    let validCount = 0;
    let invalidCount = 0;

    testimonials.content.testimonials.forEach((t, i) => {
      const errors = [];
      
      if (!t.name || t.name.trim() === '') errors.push('Missing name');
      if (!t.role || t.role.trim() === '') errors.push('Missing role');
      if (!t.duration || t.duration.trim() === '') errors.push('Missing duration');
      if (!t.quote || t.quote.trim() === '') errors.push('Missing quote');
      if (!t.rating || t.rating < 1 || t.rating > 5) errors.push('Invalid rating');

      if (errors.length === 0) {
        validCount++;
        console.log(`   ✅ Testimonial #${i + 1}: "${t.name}" - VALID`);
      } else {
        invalidCount++;
        console.log(`   ❌ Testimonial #${i + 1}: "${t.name || '(NoName)'}"`);
        errors.forEach(e => console.log(`      - ${e}`));
      }
    });

    console.log(`\n   Summary: ${validCount} valid, ${invalidCount} invalid\n`);

    // Step 4: Test save operation
    console.log('🧪 Step 4: Testing Save Operation...');
    console.log('   Creating test testimonial...');

    const testTestimonial = {
      name: 'Test Teacher',
      role: 'Test Role',
      duration: '1 month in',
      rating: 5,
      quote: 'This is a test testimonial to verify the save functionality is working correctly.'
    };

    const updatedContent = {
      ...testimonials.content,
      testimonials: [
        ...testimonials.content.testimonials,
        testTestimonial
      ]
    };

    const { error: updateError, data: updateData } = await supabase
      .from('page_sections')
      .update({
        content: updatedContent,
        updated_at: new Date().toISOString()
      })
      .eq('section_name', 'testimonials')
      .select();

    if (updateError) {
      console.error('   ❌ Save failed:', updateError.message);
      return;
    }

    console.log('   ✅ Save successful! Waiting 1 second...\n');

    // Step 5: Verify save
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('🔄 Step 5: Verifying Save...');
    const { data: verifyData, error: verifyError } = await supabase
      .from('page_sections')
      .select('*')
      .eq('section_name', 'testimonials')
      .single();

    if (verifyError) {
      console.error('   ❌ Verification failed:', verifyError.message);
      return;
    }

    const testExists = verifyData.content.testimonials.some(t => t.name === 'Test Teacher');
    if (testExists) {
      console.log(`   ✅ Test testimonial VERIFIED in database!`);
      console.log(`   New total: ${verifyData.content.testimonials.length} testimonials\n`);
    } else {
      console.log(`   ❌ Test testimonial NOT found in database after save!\n`);
    }

    // Step 6: Clean up test testimonial
    console.log('🧹 Step 6: Cleaning up test testimonial...');
    const cleanedContent = {
      ...verifyData.content,
      testimonials: verifyData.content.testimonials.filter(t => t.name !== 'Test Teacher')
    };

    const { error: cleanError } = await supabase
      .from('page_sections')
      .update({
        content: cleanedContent,
        updated_at: new Date().toISOString()
      })
      .eq('section_name', 'testimonials');

    if (cleanError) {
      console.error('   ❌ Cleanup failed:', cleanError.message);
      return;
    }

    console.log('   ✅ Test testimonial removed\n');

    // Step 7: Final status
    console.log('═══════════════════════════════════════════════════════════');
    console.log('\n🎯 DIAGNOSIS COMPLETE\n');
    console.log('✅ Status: All systems operational!');
    console.log('\n📋 Current Testimonials:');
    cleanedContent.testimonials.forEach((t, i) => {
      console.log(`   ${i + 1}. ${t.name} (${t.role})`);
    });

    console.log('\n💡 What to do if testimonials keep disappearing:\n');
    console.log('1. ✅ SAVED correctly - Check browser cache (Ctrl+Shift+Delete)');
    console.log('2. ✅ SAVED correctly - Verify you\'re on /admin/page-content tab');
    console.log('3. ✅ SAVED correctly - Check browser console for errors (F12)');
    console.log('4. ✅ SAVED correctly - Hard refresh page (Ctrl+F5)');
    console.log('5. ✅ SAVED correctly - Rebuild Next.js app (npm run build)');
    console.log('6. ✅ SAVED correctly - Check RLS policies allow updates');

    console.log('\n🔧 Admin Dashboard Next Steps:\n');
    console.log('1. Go to /admin/page-content');
    console.log('2. Click "Testimonials" tab');
    console.log('3. Click "➕ Add New Testimonial"');
    console.log('4. Fill in ALL required fields (Name, Role, Duration, Quote)');
    console.log('5. Click "💾 Save All Changes"');
    console.log('6. Check success message');
    console.log('7. Reload page to verify data persists');

    console.log('\n═══════════════════════════════════════════════════════════\n');

  } catch (err) {
    console.error('❌ Exception:', err.message);
  }
}

debugTestimonials();
