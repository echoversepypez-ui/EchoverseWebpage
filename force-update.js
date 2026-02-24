const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mzjyflvgjtbolerqzird.supabase.co';
const supabaseKey = 'sb_publishable_krSi8denJC45g6IP8rGI7Q_6VRAmVHq';

const supabase = createClient(supabaseUrl, supabaseKey);

async function forceUpdateSteps() {
  try {
    console.log('🔍 Checking current data first...');
    const { data: beforeData } = await supabase
      .from('page_sections')
      .select('*')
      .eq('section_name', 'how_it_works')
      .single();

    console.log('Before - Steps:', beforeData.content.steps.length);
    console.log('Before - Subtitle:', beforeData.subtitle);

    console.log('\n⏳ Updating database...');
    
    const { error } = await supabase
      .from('page_sections')
      .update({
        subtitle: '5 Simple Steps from Application to Teaching Your First Class',
        content: {
          steps: [
            {
              number: 1,
              title: 'Submit Application',
              description: 'Complete our detailed registration form with your qualifications and experience'
            },
            {
              number: 2,
              title: 'Admin Review',
              description: 'Our team reviews your qualifications & experience. We verify your credentials'
            },
            {
              number: 3,
              title: 'Video Interview',
              description: 'Brief interview with our HR team to assess teaching style & communication skills'
            },
            {
              number: 4,
              title: 'Training and Orientation',
              description: 'Get platform training, review teaching materials, and meet your support team'
            },
            {
              number: 5,
              title: 'Start Teaching!',
              description: 'Get onboarding training, set up your schedule, and teach your first class'
            }
          ]
        },
        updated_at: new Date().toISOString()
      })
      .eq('section_name', 'how_it_works');

    if (error) {
      console.error('❌ Error:', error);
    } else {
      console.log('✅ Update sent to database');

      // Wait a moment then verify
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('\n🔍 Verifying update...');
      const { data: afterData } = await supabase
        .from('page_sections')
        .select('*')
        .eq('section_name', 'how_it_works')
        .single();

      console.log('After - Steps:', afterData.content.steps.length);
      console.log('After - Subtitle:', afterData.subtitle);

      if (afterData.content.steps.length === 5) {
        console.log('\n✅ SUCCESS! All 5 steps are now in the database:');
        afterData.content.steps.forEach((step) => {
          console.log(`   ${step.number}. ${step.title}`);
        });
        console.log('\n🔄 NOW REBUILD YOUR NEXT.JS APP:');
        console.log('   npm run build');
        console.log('   npm start');
      }
    }
  } catch (err) {
    console.error('Exception:', err);
  }
}

forceUpdateSteps();
