import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const testModels = [
  {
    stageName: 'Sophia',
    location: 'Miami, FL',
    bio: 'Luxury lifestyle content creator. Follow for exclusive behind-the-scenes moments.',
    height: '5\'7"',
    eyeColor: 'Green',
    hairColor: 'Blonde',
    ethnicity: 'Caucasian',
    subscriptionPrice: 19.99,
    isFeatured: true,
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=600&fit=crop',
  },
  {
    stageName: 'Luna',
    location: 'Los Angeles, CA',
    bio: 'Glamour and elegance. Exclusive content daily.',
    height: '5\'5"',
    eyeColor: 'Brown',
    hairColor: 'Black',
    ethnicity: 'Latina',
    subscriptionPrice: 24.99,
    isFeatured: true,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
  },
  {
    stageName: 'Victoria',
    location: 'New York, NY',
    bio: 'Premium content for premium followers. Only the best.',
    height: '5\'8"',
    eyeColor: 'Hazel',
    hairColor: 'Brown',
    ethnicity: 'European',
    subscriptionPrice: 29.99,
    isFeatured: true,
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop',
  },
  {
    stageName: 'Jasmine',
    location: 'Las Vegas, NV',
    bio: 'Exotic and sensual. Experience luxury.',
    height: '5\'6"',
    eyeColor: 'Brown',
    hairColor: 'Black',
    ethnicity: 'Asian',
    subscriptionPrice: 19.99,
    isFeatured: false,
    avatarUrl: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=400&h=600&fit=crop',
  },
  {
    stageName: 'Isabella',
    location: 'Miami, FL',
    bio: 'Sensuality and charm combined. Join my exclusive club.',
    height: '5\'4"',
    eyeColor: 'Blue',
    hairColor: 'Blonde',
    ethnicity: 'Caucasian',
    subscriptionPrice: 17.99,
    isFeatured: false,
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=600&fit=crop',
  },
  {
    stageName: 'Scarlett',
    location: 'Chicago, IL',
    bio: 'Red hot content. Exclusive and uncensored.',
    height: '5\'9"',
    eyeColor: 'Green',
    hairColor: 'Red',
    ethnicity: 'Caucasian',
    subscriptionPrice: 22.99,
    isFeatured: false,
    avatarUrl: 'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?w=400&h=600&fit=crop',
  },
  {
    stageName: 'Diamond',
    location: 'Los Angeles, CA',
    bio: 'Diamonds are a girl\'s best friend. Live like a queen.',
    height: '5\'7"',
    eyeColor: 'Brown',
    hairColor: 'Black',
    ethnicity: 'African',
    subscriptionPrice: 24.99,
    isFeatured: true,
    avatarUrl: 'https://images.unsplash.com/photo-1507371341519-ef1eb36f732b?w=400&h=600&fit=crop',
  },
  {
    stageName: 'Amber',
    location: 'San Francisco, CA',
    bio: 'Tech savvy and sexy. New content weekly.',
    height: '5\'6"',
    eyeColor: 'Brown',
    hairColor: 'Brown',
    ethnicity: 'Caucasian',
    subscriptionPrice: 18.99,
    isFeatured: false,
    avatarUrl: 'https://images.unsplash.com/photo-1524310503312-52581002a659?w=400&h=600&fit=crop',
  },
  {
    stageName: 'Phoenix',
    location: 'Phoenix, AZ',
    bio: 'Rising from the ashes. Hottest content on the platform.',
    height: '5\'8"',
    eyeColor: 'Green',
    hairColor: 'Blonde',
    ethnicity: 'Latina',
    subscriptionPrice: 21.99,
    isFeatured: false,
    avatarUrl: 'https://images.unsplash.com/photo-1517504199306-502226b39e1c?w=400&h=600&fit=crop',
  },
  {
    stageName: 'Mystique',
    location: 'New Orleans, LA',
    bio: 'Mysterious and alluring. Discover the magic.',
    height: '5\'5"',
    eyeColor: 'Hazel',
    hairColor: 'Brown',
    ethnicity: 'Mixed',
    subscriptionPrice: 23.99,
    isFeatured: false,
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=600&fit=crop',
  },
];

async function main() {
  console.log('Creating test users and model profiles...\n');

  for (const model of testModels) {
    try {
      // Create user
      const user = await prisma.user.upsert({
        where: { email: `${model.stageName.toLowerCase()}@bellasglamour.com` },
        update: {},
        create: {
          email: `${model.stageName.toLowerCase()}@bellasglamour.com`,
          password_hash: await bcrypt.hash('Password123!', 12),
          name: model.stageName,
          role: 'model',
          email_verified: true,
          age_verified: true,
        },
      });

      // Create profile
      const profile = await prisma.profile.upsert({
        where: { user_id: user.id },
        update: {
          stage_name: model.stageName,
          location: model.location,
          bio: model.bio,
          height: model.height,
          eye_color: model.eyeColor,
          hair_color: model.hairColor,
          ethnicity: model.ethnicity,
          subscription_price: model.subscriptionPrice,
          is_featured: model.isFeatured,
          avatar_url: model.avatarUrl,
          status: 'approved',
          approved_at: new Date(),
        },
        create: {
          user_id: user.id,
          stage_name: model.stageName,
          slug: model.stageName.toLowerCase().replace(/\s+/g, '-'),
          location: model.location,
          bio: model.bio,
          height: model.height,
          eye_color: model.eyeColor,
          hair_color: model.hairColor,
          ethnicity: model.ethnicity,
          subscription_price: model.subscriptionPrice,
          is_featured: model.isFeatured,
          featured_order: model.isFeatured ? testModels.indexOf(model) : 999,
          avatar_url: model.avatarUrl,
          status: 'approved',
          approved_at: new Date(),
        },
      });

      console.log(`✓ Created: ${model.stageName} (${model.location})`);
    } catch (error) {
      console.error(`✗ Error creating ${model.stageName}:`, (error as Error).message);
    }
  }

  console.log('\n✓ Test data seeding complete!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
