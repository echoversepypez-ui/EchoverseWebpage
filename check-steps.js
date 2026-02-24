const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mzjyflvgjtbolerqzird.supabase.co';
const supabaseKey = 'sb_publishable_krSi8denJC45g6IP8rGI7Q_6VRAmVHq';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSteps() {
  try {
    const { data, error } = await supabase
      .from('page_sections')
      .select('*')
      .eq('section_name', 'how_it_works')
      .single();

    if (error) {
      console.error('Error fetching data:', error);
    } else {
      console.log('Current subtitle:', data.subtitle);
      console.log('Number of steps:', data.content.steps.length);
      console.log('\nAll steps:');
      data.content.steps.forEach((step, index) => {
        console.log(`${step.number}. ${step.title}`);
      });
    }
  } catch (err) {
    console.error('Exception:', err);
  }
}

checkSteps();
