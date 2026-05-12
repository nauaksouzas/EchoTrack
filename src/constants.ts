import { PathwayData } from './types';

export const PATHWAYS: PathwayData[] = [
  {
    id: 'business-ops',
    name: 'Business: Business Operations',
    instructors: [
      {
        name: 'Jessica Arevalo',
        classes: ['Comms in the Workplace', 'Intro to Business Operations', 'Professional Skills']
      },
      {
        name: 'Brian Kaufman',
        classes: ['Business Productivity Tools', 'Tech Essentials', 'Using Excel in the Workplace', 'Supporting Business Decisions with Data']
      },
      {
        name: 'Cory Bennett',
        classes: ['CDIR class']
      }
    ]
  },
  {
    id: 'financial-ops',
    name: 'Business: Financial Operation',
    instructors: [
      {
        name: 'Financial Lead',
        classes: ['Financial Accounting', 'Excel for Finance', 'Business Analytics']
      },
      {
        name: 'Cory Bennett',
        classes: ['CDIR class']
      }
    ]
  },
  {
    id: 'project-mgmt',
    name: 'Business: Project Management',
    instructors: [
      {
        name: 'PM Lead',
        classes: ['Agile Fundamentals', 'Project Lifecycle', 'Team Coordination']
      },
      {
        name: 'Cory Bennett',
        classes: ['CDIR class']
      }
    ]
  },
  {
    id: 'it',
    name: 'Information Technology',
    instructors: [
      {
        name: 'IT Specialist',
        classes: ['Hardware & Software', 'Networking Basics', 'Security Fundamentals']
      },
      {
        name: 'Cory Bennett',
        classes: ['CDIR class']
      }
    ]
  },
  {
    id: 'cx',
    name: 'Customer Experience',
    instructors: [
      {
        name: 'CX Specialist',
        classes: ['Customer Relations', 'Service Design', 'Communication Strategies']
      },
      {
        name: 'Cory Bennett',
        classes: ['CDIR class']
      }
    ]
  }
];

export const PROGRAM_MANAGERS = [
  'Kayla Casiano'
];

export const COACHES = [
  'Kayla Casiano',
  'Mark Gentile'
];
