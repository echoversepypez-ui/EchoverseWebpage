const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mzjyflvgjtbolerqzird.supabase.co';
const supabaseKey = 'sb_publishable_krSi8denJC45g6IP8rGI7Q_6VRAmVHq';

const supabase = createClient(supabaseUrl, supabaseKey);

async function addFifthStep() {
  try {
    console.log('📊 Checking current journey steps...');
    const { data: currentSteps, error: fetchError } = await supabase
      .from('journey_steps')
      .select('*')
      .order('step_number', { ascending: true });

    if (fetchError) {
      console.error('❌ Error fetching:', fetchError);
      return;
    }

    console.log(`Found ${currentSteps.length} steps:`);
    currentSteps.forEach(step => {
      console.log(`  ${step.step_number}. ${step.title}`);
    });

    // Find the "Start Teaching!" step (currently step 4)
    const startTeachingStep = currentSteps.find(s => s.title === 'Start Teaching!');
    
    if (!startTeachingStep) {
      console.error('❌ Could not find "Start Teaching!" step');
      return;
    }

    console.log('\n⏳ Updating "Start Teaching!" from step 4 to step 5...');
    const { error: updateError } = await supabase
      .from('journey_steps')
      .update({ step_number: 5 })
      .eq('id', startTeachingStep.id);

    if (updateError) {
      console.error('❌ Error updating:', updateError);
      return;
    }

    console.log('✅ Updated "Start Teaching!" to step 5');

    console.log('\n⏳ Inserting "Training and Orientation" as step 4...');
    const { error: insertError } = await supabase
      .from('journey_steps')
      .insert({
        step_number: 4,
        title: 'Training and Orientation',
        description: 'Get platform training, review teaching materials, and meet your support team',
        emoji: '🎓',
        color_theme: 'blue',
        what_happens: 'Platform training & orientation, Review teaching materials & resources, Meet your dedicated support team, Technical setup guidance, Classroom management strategies, First class with support',
        time_to_complete: '1-2 hours',
        duration_detail: 'Online session & materials',
        pro_tip: 'Attend live or use recorded sessions - flexibility is key!'
      });

    if (insertError) {
      console.error('❌ Error inserting:', insertError);
      return;
    }

    console.log('✅ Inserted "Training and Orientation" as step 4');

    console.log('\n🔍 Verifying all steps...');
    const { data: allSteps } = await supabase
      .from('journey_steps')
      .select('*')
      .order('step_number', { ascending: true });

    console.log(`\n✅ SUCCESS! Now showing ${allSteps.length} steps:`);
    allSteps.forEach(step => {
      console.log(`  ${step.step_number}. ${step.title}`);
    });

  } catch (err) {
    console.error('Exception:', err);
  }
}

addFifthStep();
