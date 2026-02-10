# Echoverse Website Customization Guide

## Quick Edits You Can Make

### 1. Change Website Title & Description
**File**: `src/app/layout.tsx`
```typescript
export const metadata: Metadata = {
  title: "Your Title Here",
  description: "Your description here",
};
```

### 2. Update Courses
**File**: `src/app/courses/page.tsx`

Find the `courses` array and modify:
```typescript
const courses = [
  {
    id: 1,
    title: 'Your Course Title',
    instructor: 'Instructor Name',
    duration: '8 weeks',
    level: 'Beginner',
    students: 2500,
    rating: 4.8,
    price: 49.99,
    image: '🎓', // Change emoji
    description: 'Course description',
  },
  // Add more courses...
];
```

### 3. Update Pricing Plans
**File**: `src/app/pricing/page.tsx`

Find the `pricingPlans` array:
```typescript
const pricingPlans = [
  {
    name: 'Plan Name',
    price: 29.99,
    period: 'per month',
    description: 'Plan description',
    features: [
      'Feature 1',
      'Feature 2',
      'Feature 3',
    ],
    popular: false,
  },
];
```

### 4. Update Team Members
**File**: `src/app/about/page.tsx`

Find the `team` array:
```typescript
const team = [
  {
    name: 'Team Member Name',
    role: 'Job Title',
    image: '👤', // Change emoji
  },
];
```

### 5. Update Company Info
**File**: `src/app/contact/page.tsx`

Find the contact info section:
```typescript
{
  icon: '📧',
  title: 'Email',
  content: 'your-email@example.com',
}
```

### 6. Update Footer Content
Search for "Echoverse" in each page and replace with your company name.

## Color Scheme Changes

### Change Primary Colors
Replace instances of:
- `from-purple-600 to-pink-600` with your gradient
- `from-slate-900 via-purple-900 to-slate-900` with your background

### Tailwind Color Options
Common colors:
- `blue-600`, `indigo-600`, `red-600`, `orange-600`, `green-600`
- `slate-900`, `gray-900`, `zinc-900`

## Adding New Features

### Add a New Page
1. Create folder: `src/app/your-page/`
2. Create file: `src/app/your-page/page.tsx`
3. Add navigation link in other pages

### Add a New Section
Copy any component section and modify the content.

### Add Images
1. Place images in `public/` folder
2. Use Next.js Image component:
```typescript
import Image from 'next/image';

<Image 
  src="/image-name.jpg" 
  alt="Description"
  width={400}
  height={300}
/>
```

## Form Customization

### Contact Form Fields
**File**: `src/app/contact/page.tsx`

Add new fields:
```typescript
const [formData, setFormData] = useState({
  name: '',
  email: '',
  subject: '',
  message: '',
  newField: '', // Add here
});
```

### Sign Up Fields
**File**: `src/app/signup/page.tsx`

Similar pattern to contact form.

## Content Examples

### Hero Section Text
Current: "Learn Anything, Anytime"
Options:
- "Master New Skills Today"
- "Your Path to Success Starts Here"
- "Transform Your Career"

### CTA Button Text
Current: "Explore Courses"
Options:
- "Browse Courses"
- "Start Learning"
- "View All Courses"

## Performance Tips

1. **Optimize Images**: Compress images before adding
2. **Lazy Loading**: Images load on demand
3. **Caching**: Static pages are cached automatically
4. **SEO**: Update metadata for each page

## Deployment Checklist

- [ ] Update all company information
- [ ] Change colors to match brand
- [ ] Add real course data
- [ ] Add team member photos/info
- [ ] Update pricing plans
- [ ] Test all forms
- [ ] Check mobile responsiveness
- [ ] Set up email notifications
- [ ] Add analytics
- [ ] Deploy to production

## Testing Locally

```bash
npm run dev
# Open http://localhost:3000
```

Test:
- Click all navigation links
- Try all forms (contact, login, signup)
- Test responsive design (resize browser)
- Check all pages load correctly

## Common Customizations

### Add Social Media Links
Add to footer in each page:
```typescript
<div className="flex space-x-4">
  <a href="https://twitter.com" className="text-gray-400 hover:text-white">Twitter</a>
  <a href="https://facebook.com" className="text-gray-400 hover:text-white">Facebook</a>
</div>
```

### Change Logo
Replace the `w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-600 rounded-lg` div with your logo:
```typescript
<img src="/logo.png" alt="Logo" className="w-8 h-8" />
```

### Add Newsletter Signup
Add to footer:
```typescript
<div className="flex space-x-2">
  <input 
    type="email" 
    placeholder="Enter your email" 
    className="flex-1 bg-slate-700 text-white px-4 py-2 rounded"
  />
  <button className="bg-purple-600 text-white px-4 py-2 rounded">Subscribe</button>
</div>
```

## Getting Help

- Check Next.js docs: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com
- React: https://react.dev
- TypeScript: https://www.typescriptlang.org

Good luck with your Echoverse website! 🚀
