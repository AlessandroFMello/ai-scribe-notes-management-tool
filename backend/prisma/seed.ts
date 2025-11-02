import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Clear existing data
  await prisma.note.deleteMany();
  await prisma.patient.deleteMany();

  // Create mock patients
  const patients = await prisma.patient.createMany({
    data: [
      {
        name: 'Sarah Johnson',
        dateOfBirth: new Date('1985-03-15'),
        patientId: 'PAT-001',
        phone: '+1-555-0123',
        email: 'sarah.johnson@email.com',
        address: '123 Oak Street, Springfield, IL 62701',
      },
      {
        name: 'Michael Chen',
        dateOfBirth: new Date('1972-11-08'),
        patientId: 'PAT-002',
        phone: '+1-555-0456',
        email: 'm.chen@email.com',
        address: '456 Pine Avenue, Chicago, IL 60601',
      },
      {
        name: 'Emily Rodriguez',
        dateOfBirth: new Date('1995-07-22'),
        patientId: 'PAT-003',
        phone: '+1-555-0789',
        email: 'emily.rodriguez@email.com',
        address: '789 Maple Drive, Rockford, IL 61101',
      },
    ],
  });

  console.log(`Created ${patients.count} patients`);

  // Get the created patients to create notes
  const createdPatients = await prisma.patient.findMany();

  // Create some sample notes for each patient
  const notes = await prisma.note.createMany({
    data: [
      // Notes for Sarah Johnson
      {
        patientId: createdPatients[0].id,
        rawText:
          'Patient reports feeling tired and having difficulty sleeping for the past week.',
        noteType: 'TEXT',
        aiSummary:
          'Patient experiencing fatigue and insomnia. Recommend sleep hygiene assessment and potential sleep study if symptoms persist.',
        soapFormat: {
          subjective:
            'Patient reports feeling tired and having difficulty sleeping for the past week',
          objective: 'No physical examination performed during this visit',
          assessment: 'Fatigue and insomnia, duration 1 week',
          plan: 'Recommend sleep hygiene assessment and potential sleep study if symptoms persist',
        },
      },
      {
        patientId: createdPatients[0].id,
        rawText:
          'Follow-up visit. Patient reports improvement in sleep quality after implementing sleep hygiene recommendations.',
        noteType: 'TEXT',
        aiSummary:
          'Follow-up visit shows improvement in sleep quality. Patient responding well to sleep hygiene interventions.',
        soapFormat: {
          subjective:
            'Patient reports improvement in sleep quality after implementing sleep hygiene recommendations',
          objective: 'Patient appears well-rested, good energy levels',
          assessment:
            'Improvement in sleep quality, responding well to interventions',
          plan: 'Continue current sleep hygiene practices, monitor for continued improvement',
        },
      },
      // Notes for Michael Chen
      {
        patientId: createdPatients[1].id,
        rawText:
          'Annual physical examination. Patient reports no significant health concerns.',
        noteType: 'TEXT',
        aiSummary:
          'Annual physical examination completed. Patient in good health with no significant concerns reported.',
        soapFormat: {
          subjective: 'Patient reports no significant health concerns',
          objective:
            'Vital signs within normal limits, physical examination unremarkable',
          assessment: 'Healthy adult male, no acute concerns',
          plan: 'Continue routine health maintenance, schedule next annual physical in 12 months',
        },
      },
      // Notes for Emily Rodriguez
      {
        patientId: createdPatients[2].id,
        rawText:
          'Patient presents with seasonal allergies. Reports sneezing, runny nose, and itchy eyes.',
        noteType: 'TEXT',
        aiSummary:
          'Patient presenting with seasonal allergy symptoms including sneezing, rhinorrhea, and ocular pruritus.',
        soapFormat: {
          subjective: 'Patient reports sneezing, runny nose, and itchy eyes',
          objective:
            'Mild nasal congestion, clear nasal discharge, mild conjunctival injection',
          assessment: 'Seasonal allergic rhinitis with conjunctivitis',
          plan: 'Recommend antihistamine therapy and nasal saline irrigation. Follow up if symptoms worsen',
        },
      },
    ],
  });

  console.log(`Created ${notes.count} notes`);

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
