const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mzjyflvgjtbolerqzird.supabase.co';
const supabaseKey = 'sb_publishable_krSi8denJC45g6IP8rGI7Q_6VRAmVHq';

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateSteps() {
  try {
    const { data, error } = await supabase
      .from('page_sections')
      .update({
        subtitle: '5 Simple Steps from Application to Teaching Your First Class',
        content: {
          steps: [
            {
              number: 1,
              title: 'Submit Application',
              description: 'Complete our detailed registration form with your qualifications and experience',
              whatHappens: [
                'Name, location, & contact info',
                'Educational background',
                'Teaching certifications (TEFL, CELTA, etc.)',
                'Years of teaching experience',
                'Your preferred working hours',
                'Why you want to teach with us'
              ],
              time: '10-15 minutes',
              details: 'Resume, diplomas (photos ok)',
              proTip: 'Upload clear photos of your documents to speed up verification'
            },
            {
              number: 2,
              title: 'Admin Review',
              description: 'Our team reviews your qualifications & experience. We verify your credentials',
              whatHappens: [
                'Complete profile review (24-48hrs)',
                'Certificate verification',
                'Background check',
                'Experience validation',
                'Qualification assessment',
                'Approval or need clarification'
              ],
              time: '24-48 hours',
              details: 'Email update on status',
              proTip: 'Have your certifications ready - uploads speed up the process significantly'
            },
            {
              number: 3,
              title: 'Video Interview',
              description: 'Brief interview with our HR team to assess teaching style & communication skills',
              whatHappens: [
                'Teaching philosophy & methods',
                'Your experience & background',
                'How you handle students',
                'Classroom management skills',
                'Communication style',
                'Questions for us'
              ],
              time: '15-30 minutes',
              details: 'Zoom/Video call',
              proTip: 'Schedule at YOUR convenient time - you have full control of timing!'
            },
            {
              number: 4,
              title: 'Training and Orientation',
              description: 'Get platform training, review teaching materials, and meet your support team',
              whatHappens: [
                'Platform training & orientation',
                'Review teaching materials & resources',
                'Meet your dedicated support team',
                'Technical setup guidance',
                'Classroom management strategies',
                'First class with support'
              ],
              time: '1-2 hours',
              details: 'Online session & materials',
              proTip: 'Attend live or use recorded sessions - flexibility is key!'
            },
            {
              number: 5,
              title: 'Start Teaching!',
              description: 'Get onboarding training, set up your schedule, and teach your first class',
              whatHappens: [
                'Platform training & orientation',
                'Teaching materials access',
                'Student profile preview',
                'Set your availability hours',
                'Technical setup guidance',
                'First class with support!'
              ],
              time: '24-72 hours',
              details: 'Within 24-72 hours',
              proTip: '24/7 support team always ready - enjoy flexible, premium teaching!'
            }
          ]
        }
      })
      .eq('section_name', 'how_it_works');

    if (error) {
      console.error('Error updating steps:', error);
    } else {
      console.log('✅ Successfully updated to 5 steps!');
      console.log('Steps:', data);
    }
  } catch (err) {
    console.error('Exception:', err);
  }
}

updateSteps();
