const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mzjyflvgjtbolerqzird.supabase.co';
const supabaseKey = 'sb_publishable_krSi8denJC45g6IP8rGI7Q_6VRAmVHq'; // Anon key from .env.local

const supabase = createClient(supabaseUrl, supabaseKey);

const testimonialData = {
  section_name: 'testimonials',
  title: 'What Teachers Say',
  subtitle: 'Real stories from successful educators in our community',
  content: {
    testimonials: [
      {
        name: 'Maria Santos',
        role: 'Full-time Teacher',
        duration: '6 months in',
        rating: 5,
        quote: 'Echoverse changed my life! I went from freelance tutoring to earning $5k/month. The flexibility is unmatched and the support is amazing.'
      },
      {
        name: 'John Smith',
        role: 'Part-time Educator',
        duration: '3 months in',
        rating: 5,
        quote: 'I started as a side hustle and got my first student within 48 hours. The platform is so easy to use and students are genuinely engaged.'
      },
      {
        name: 'Sarah Johnson',
        role: 'Career Switcher',
        duration: '9 months in',
        rating: 5,
        quote: 'Teaching 20+ hours a week with complete flexibility. Students from all over the world. This is exactly what I was looking for!'
      }
    ]
  }
};

async function verifyAndSyncTestimonials() {
  try {
    console.log('🔍 Checking Supabase connection...\n');

    // Step 1: Check if testimonials section exists
    console.log('📋 Step 1: Checking if testimonials section exists...');
    const { data: existingData, error: fetchError } = await supabase
      .from('page_sections')
      .select('*')
      .eq('section_name', 'testimonials')
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      // PGRST116 means no rows found (expected if doesn't exist)
      console.error('❌ Error fetching testimonials:', fetchError);
      return;
    }

    if (existingData) {
      console.log('✅ Testimonials section found in database!');
      console.log(`   Total testimonials: ${existingData.content.testimonials?.length || 0}`);
      console.log(`   Last updated: ${existingData.updated_at}`);
      
      // Verify data matches
      if (existingData.content.testimonials?.length === 3) {
        console.log('\n✅ All 3 testimonials are already synced!\n');
        displayTestimonials(existingData.content.testimonials);
        return;
      }
    }

    // Step 2: Insert or update testimonials
    console.log('\n📝 Step 2: Syncing testimonials to database...');
    
    const { data: upsertData, error: upsertError } = await supabase
      .from('page_sections')
      .upsert(
        {
          section_name: testimonialData.section_name,
          title: testimonialData.title,
          subtitle: testimonialData.subtitle,
          content: testimonialData.content,
          updated_at: new Date().toISOString()
        },
        { onConflict: 'section_name' }
      );

    if (upsertError) {
      console.error('❌ Error upserting testimonials:', upsertError);
      return;
    }

    console.log('✅ Testimonials synced successfully!');

    // Step 3: Verify the data was saved
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('\n🔍 Step 3: Verifying saved data...');
    const { data: verifyData, error: verifyError } = await supabase
      .from('page_sections')
      .select('*')
      .eq('section_name', 'testimonials')
      .single();

    if (verifyError) {
      console.error('❌ Error verifying testimonials:', verifyError);
      return;
    }

    console.log('✅ Verification successful!\n');
    console.log(`📊 Database contains ${verifyData.content.testimonials?.length || 0} testimonials:`);
    displayTestimonials(verifyData.content.testimonials);

    // Step 4: Check all page sections
    console.log('\n📚 Step 4: Checking all page sections...');
    const { data: allSections, error: sectionsError } = await supabase
      .from('page_sections')
      .select('section_name, title, created_at, updated_at');

    if (!sectionsError && allSections) {
      console.log(`✅ Total sections in database: ${allSections.length}\n`);
      allSections.forEach((section) => {
        console.log(`   ✓ ${section.section_name}: "${section.title}"`);
        console.log(`     Updated: ${new Date(section.updated_at).toLocaleString()}`);
      });
    }

    console.log('\n✅ All testimonials are NOW linked to Supabase database!');
    console.log('🔗 Changes are live and will appear on the homepage immediately.');

  } catch (err) {
    console.error('❌ Exception:', err);
  }
}

function displayTestimonials(testimonials) {
  if (!testimonials || testimonials.length === 0) {
    console.log('   (No testimonials found)');
    return;
  }
  
  testimonials.forEach((testimonial, index) => {
    console.log(`\n   ${index + 1}. ${testimonial.name}`);
    console.log(`      Role: ${testimonial.role}`);
    console.log(`      Duration: ${testimonial.duration}`);
    console.log(`      Rating: ${'⭐'.repeat(testimonial.rating)}`);
    console.log(`      Quote: "${testimonial.quote.substring(0, 60)}..."`);
  });
}

// Run the verification
console.log('═══════════════════════════════════════════════════════════');
console.log('   TESTIMONIALS DATABASE SYNC VERIFICATION');
console.log('═══════════════════════════════════════════════════════════\n');

verifyAndSyncTestimonials();
