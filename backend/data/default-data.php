<?php

/**
 * Default data for Pika plugin
 * 
 * @package Pika
 */

if (!defined('ABSPATH')) {
  exit;
}

class Pika_Default_Data {

  /**
   * Default expense categories with parent-child relationships
   */
  const DEFAULT_EXPENSE_CATEGORIES = [
    // Food & Dining
    [
      'name' => 'Food & Dining',
      'icon' => 'utensils-crossed',
      'color' => '#FFFFFF',
      'bg_color' => '#E53E3E', // Red - appetite stimulating
      'type' => 'expense',
      'description' => 'Food and dining expenses',
      'children' => [
        [
          'name' => 'Dining Out',
          'icon' => 'utensils',
          'color' => '#FFFFFF',
          'bg_color' => '#DD6B20', // Orange - warm dining
          'type' => 'expense',
          'description' => 'Restaurant and dining out expenses',
        ],
        [
          'name' => 'Groceries',
          'icon' => 'shopping-basket',
          'color' => '#FFFFFF',
          'bg_color' => '#38A169', // Green - healthy food
          'type' => 'expense',
          'description' => 'Grocery shopping expenses',
        ],
        [
          'name' => 'Coffee & Snacks',
          'icon' => 'coffee',
          'color' => '#FFFFFF',
          'bg_color' => '#975A16', // Brown - coffee color
          'type' => 'expense',
          'description' => 'Coffee and snack expenses',
        ]
      ]
    ],
    // Shopping
    [
      'name' => 'Shopping',
      'icon' => 'shopping-cart',
      'color' => '#FFFFFF',
      'bg_color' => '#D53F8C', // Pink - retail/shopping
      'type' => 'expense',
      'description' => 'Shopping expenses',
      'children' => [
        [
          'name' => 'Clothing',
          'icon' => 'shirt',
          'color' => '#FFFFFF',
          'bg_color' => '#805AD5', // Purple - fashion
          'type' => 'expense',
          'description' => 'Clothing and apparel expenses',
        ],
        [
          'name' => 'Electronics',
          'icon' => 'monitor-speaker',
          'color' => '#FFFFFF',
          'bg_color' => '#2B6CB0', // Blue - technology
          'type' => 'expense',
          'description' => 'Electronics and gadgets',
        ],
        [
          'name' => 'Home Goods',
          'icon' => 'sofa',
          'color' => '#FFFFFF',
          'bg_color' => '#B83280', // Magenta - home decor
          'type' => 'expense',
          'description' => 'Home and furniture expenses',
        ]
      ]
    ],
    // Transportation
    [
      'name' => 'Transportation',
      'icon' => 'car',
      'color' => '#FFFFFF',
      'bg_color' => '#3182CE', // Blue - movement/travel
      'type' => 'expense',
      'description' => 'Transportation expenses',
      'children' => [
        [
          'name' => 'Fuel',
          'icon' => 'fuel',
          'color' => '#FFFFFF',
          'bg_color' => '#C53030', // Red - energy/fuel
          'type' => 'expense',
          'description' => 'Fuel and gas expenses',
        ],
        [
          'name' => 'Public Transit',
          'icon' => 'bus',
          'color' => '#FFFFFF',
          'bg_color' => '#2C5282', // Navy - public service
          'type' => 'expense',
          'description' => 'Public transportation expenses',  
        ],
        [
          'name' => 'Maintenance',
          'icon' => 'wrench',
          'color' => '#FFFFFF',
          'bg_color' => '#744210', // Dark orange - maintenance
          'type' => 'expense',
          'description' => 'Vehicle maintenance expenses',
        ]
      ]
    ],
    // Housing
    [
      'name' => 'Housing',
      'icon' => 'home',
      'color' => '#FFFFFF',
      'bg_color' => '#319795', // Teal - stability/home
      'type' => 'expense',
      'description' => 'Housing expenses',
      'children' => [
        [
          'name' => 'Rent',
          'icon' => 'key',
          'color' => '#FFFFFF',
          'bg_color' => '#2D3748', // Dark gray - fixed cost
          'type' => 'expense',
          'description' => 'Rent payments',
        ],
        [
          'name' => 'Mortgage',
          'icon' => 'building-2',
          'color' => '#FFFFFF',
          'bg_color' => '#2A4365', // Dark blue - long-term
          'type' => 'expense',
          'description' => 'Mortgage payments',
        ],
        [
          'name' => 'Maintenance',
          'icon' => 'hammer',
          'color' => '#FFFFFF',
          'bg_color' => '#B7791F', // Gold - home improvement
          'type' => 'expense',
          'description' => 'Home maintenance expenses',
        ]
      ]
    ],
    // Utilities
    [
      'name' => 'Utilities',
      'icon' => 'zap',
      'color' => '#000000',
      'bg_color' => '#F6E05E', // Yellow - electricity/energy
      'type' => 'expense',
      'description' => 'Utility bills',
      'children' => [
        [
          'name' => 'Electricity',
          'icon' => 'plug-zap',
          'color' => '#000000',
          'bg_color' => '#ECC94B', // Gold - electrical
          'type' => 'expense',
          'description' => 'Electricity bills',
        ],
        [
          'name' => 'Water',
          'icon' => 'droplet',
          'color' => '#FFFFFF',
          'bg_color' => '#0987A0', // Cyan - water
          'type' => 'expense',
          'description' => 'Water bills',
        ],
        [
          'name' => 'Internet',
          'icon' => 'wifi',
          'color' => '#FFFFFF',
          'bg_color' => '#553C9A', // Indigo - connectivity
          'type' => 'expense',
          'description' => 'Internet and phone bills',
        ]
      ]
    ],
    // Entertainment
    [
      'name' => 'Entertainment',
      'icon' => 'film',
      'color' => '#FFFFFF',
      'bg_color' => '#ED64A6', // Pink - fun/entertainment
      'type' => 'expense',
      'description' => 'Entertainment expenses',
      'children' => [
        [
          'name' => 'Movies',
          'icon' => 'clapperboard',
          'color' => '#FFFFFF',
          'bg_color' => '#702459', // Dark pink - cinema
          'type' => 'expense',
          'description' => 'Movie and theater expenses',  
        ],
        [
          'name' => 'Games',
          'icon' => 'gamepad-2',
          'color' => '#FFFFFF',
          'bg_color' => '#4C51BF', // Purple - gaming
          'type' => 'expense',
          'description' => 'Gaming expenses',
        ],
        [
          'name' => 'Music',
          'icon' => 'music',
          'color' => '#FFFFFF',
          'bg_color' => '#9F7AEA', // Lavender - music/arts
          'type' => 'expense',
          'description' => 'Music and concerts',
        ],
        [
          'name' => 'Sports',
          'icon' => 'volleyball',
          'color' => '#FFFFFF',
          'bg_color' => '#F56500', // Orange - sports/activity
          'type' => 'expense',
          'description' => 'Sports and fitness expenses',
        ]
      ]
    ],
    // Healthcare
    [
      'name' => 'Healthcare',
      'icon' => 'heart-pulse',
      'color' => '#FFFFFF',
      'bg_color' => '#E53E3E', // Red - medical/health
      'type' => 'expense',
      'description' => 'Healthcare expenses',
      'children' => [
        [
          'name' => 'Medical',
          'icon' => 'stethoscope',
          'color' => '#FFFFFF',
          'bg_color' => '#C53030', // Dark red - medical
          'type' => 'expense',
          'description' => 'Medical expenses',
        ],
        [
          'name' => 'Pharmacy',
          'icon' => 'pill',
          'color' => '#FFFFFF',
          'bg_color' => '#2B6CB0', // Blue - pharmaceutical
          'type' => 'expense',
          'description' => 'Pharmacy expenses',
        ]
      ]
    ],
    // Education
    [
      'name' => 'Education',
      'icon' => 'graduation-cap',
      'color' => '#FFFFFF',
      'bg_color' => '#4299E1', // Blue - knowledge/education
      'type' => 'expense',
      'description' => 'Education expenses',
      'children' => [
        [
          'name' => 'Tuition',
          'icon' => 'school',
          'color' => '#FFFFFF',
          'bg_color' => '#3182CE', // Blue - academic
          'type' => 'expense',
          'description' => 'Tuition fees',
        ],
        [
          'name' => 'Books',
          'icon' => 'book',
          'color' => '#FFFFFF',
          'bg_color' => '#2C5282', // Navy - books/knowledge
          'type' => 'expense',
          'description' => 'Books and supplies',
        ],
        [
          'name' => 'Courses',
          'icon' => 'notebook-pen',
          'color' => '#FFFFFF',
          'bg_color' => '#2A4365', // Dark blue - learning
          'type' => 'expense',
          'description' => 'Online courses and training',
        ]
      ]
    ],
    // Personal Care
    [
      'name' => 'Personal Care',
      'icon' => 'smile',
      'color' => '#FFFFFF',
      'bg_color' => '#48BB78', // Green - wellness/health
      'type' => 'expense',
      'description' => 'Personal care expenses',  
      'children' => [
        [
          'name' => 'Hair Care',
          'icon' => 'scissors',
          'color' => '#FFFFFF',
          'bg_color' => '#38A169', // Green - beauty/care
          'type' => 'expense',
          'description' => 'Hair care and styling',
        ],
        [
          'name' => 'Skincare',
          'icon' => 'sparkles',
          'color' => '#FFFFFF',
          'bg_color' => '#68D391', // Light green - beauty
          'type' => 'expense',
          'description' => 'Skincare and beauty',
        ],
        [
          'name' => 'Fitness',
          'icon' => 'dumbbell',
          'color' => '#FFFFFF',
          'bg_color' => '#2F855A', // Dark green - fitness
          'type' => 'expense',
          'description' => 'Fitness and gym expenses',
        ]
      ]
    ],
    // Gifts
    [
      'name' => 'Gifts',
      'icon' => 'gift',
      'color' => '#FFFFFF',
      'bg_color' => '#E53E3E', // Red - celebration/gifts
      'type' => 'expense',
      'description' => 'Gift expenses',
      'children' => [
        [
          'name' => 'Birthday',
          'icon' => 'cake',
          'color' => '#FFFFFF',
          'bg_color' => '#ED8936', // Orange - celebration
          'type' => 'expense',
          'description' => 'Birthday gifts',
        ],
        [
          'name' => 'Holiday',
          'icon' => 'tent-tree',
          'color' => '#FFFFFF',
          'bg_color' => '#38A169', // Green - holidays
          'type' => 'expense',
          'description' => 'Holiday gifts',
        ],
        [
          'name' => 'Special Occasion',
          'icon' => 'party-popper',
          'color' => '#FFFFFF',
          'bg_color' => '#D69E2E', // Gold - special events
          'type' => 'expense',
          'description' => 'Special occasion gifts',
        ]
      ]
    ],
    // Travel
    [
      'name' => 'Travel',
      'icon' => 'plane',
      'color' => '#FFFFFF',
      'bg_color' => '#3182CE', // Blue - travel/sky
      'type' => 'expense',
      'description' => 'Travel expenses',
      'children' => [
        [
          'name' => 'Flights',
          'icon' => 'plane-takeoff',
          'color' => '#FFFFFF',
          'bg_color' => '#2B6CB0', // Blue - aviation
          'type' => 'expense',
          'description' => 'Flight expenses',
        ],
        [
          'name' => 'Hotels',
          'icon' => 'hotel',
          'color' => '#FFFFFF',
          'bg_color' => '#B7791F', // Gold - luxury/accommodation
          'type' => 'expense',
          'description' => 'Hotel and accommodation',
        ],
        [
          'name' => 'Activities',
          'icon' => 'umbrella',
          'color' => '#FFFFFF',
          'bg_color' => '#319795', // Teal - leisure/vacation
          'type' => 'expense',
          'description' => 'Travel activities and tours',
        ]
      ]
    ],
    // Uncategorized
    [
      'name' => 'Uncategorized',
      'icon' => 'receipt-text',
      'color' => '#FFFFFF',
      'bg_color' => '#718096', // Gray - neutral/unknown
      'type' => 'expense',
      'description' => 'Uncategorized expenses',
      'children' => [
        [
          'name' => 'Other',
          'icon' => 'receipt-text',
          'color' => '#FFFFFF',
          'bg_color' => '#4A5568', // Dark gray - miscellaneous
          'type' => 'expense',
          'description' => 'Other expenses',
          'children' => []
        ]
      ]
    ]
  ];

  /**
   * Default income categories
   */
  const DEFAULT_INCOME_CATEGORIES = [
    [
      'name' => 'Work',
      'icon' => 'briefcase',
      'color' => '#FFFFFF',
      'bg_color' => '#38A169', // Green - income/money
      'type' => 'income',
      'description' => 'Work-related income',
      'children' => [
        [
          'name' => 'Salary',
          'icon' => 'dollar-sign',
          'color' => '#FFFFFF',
          'bg_color' => '#48BB78', // Light green - steady income
          'type' => 'income',
          'description' => 'Regular salary income',
        ],
        [
          'name' => 'Bonus',
          'icon' => 'gem',
          'color' => '#FFFFFF',
          'bg_color' => '#ECC94B', // Gold - bonus/reward
          'type' => 'income',
          'description' => 'Bonus and incentives',
        ],
        [
          'name' => 'Freelance',
          'icon' => 'laptop',
          'color' => '#FFFFFF',
          'bg_color' => '#4299E1', // Blue - freelance work
          'type' => 'income',
          'description' => 'Freelance income',
        ],
        [
          'name' => 'Investment',
          'icon' => 'trending-up',
          'color' => '#FFFFFF',
          'bg_color' => '#2F855A', // Dark green - growth/investment
          'type' => 'income',
          'description' => 'Investment returns',
        ]
      ]
    ],
    // Uncategorized
    [
      'name' => 'Uncategorized',
      'icon' => 'receipt-text',
      'color' => '#FFFFFF',
      'bg_color' => '#718096', // Gray - neutral/unknown
      'type' => 'income',
      'description' => 'Uncategorized income',
      'children' => [
        [
          'name' => 'Other',
          'icon' => 'receipt-text',
          'color' => '#FFFFFF',
          'bg_color' => '#4A5568', // Dark gray - miscellaneous
          'type' => 'income',
          'description' => 'Other income sources',
          'children' => []
        ]
      ]
    ]
  ];

  /**
   * Default transfer categories
   */
  const DEFAULT_TRANSFER_CATEGORIES = [
    [
      'name' => 'Transfer',
      'icon' => 'piggy-bank',
      'color' => '#FFFFFF',
      'bg_color' => '#319795', // Teal - movement/transfer
      'type' => 'transfer',
      'description' => 'Transfer expenses',
      'children' => [
        [
          'name' => 'Bank Transfer',
          'icon' => 'landmark',
          'color' => '#FFFFFF',
          'bg_color' => '#2C5282', // Navy - banking
          'type' => 'transfer',
          'description' => 'Bank transfers',
          'children' => []
        ],
        [
          'name' => 'ATM',
          'icon' => 'hand-coins',
          'color' => '#FFFFFF',
          'bg_color' => '#B7791F', // Gold - cash/ATM
          'type' => 'transfer',
          'description' => 'ATM withdrawals',
          'children' => []
        ],
        [
          'name' => 'CDM',
          'icon' => 'badge-dollar-sign',
          'color' => '#FFFFFF',
          'bg_color' => '#D69E2E', // Gold - cash deposit
          'type' => 'transfer',
          'description' => 'Cash deposit machine',
          'children' => []
        ]
      ],
    ],
    // Uncategorized
    [
      'name' => 'Uncategorized',
      'icon' => 'receipt-text',
      'color' => '#FFFFFF',
      'bg_color' => '#718096', // Gray - neutral/unknown
      'type' => 'transfer',
      'description' => 'Uncategorized transfer',
      'children' => [
        [
          'name' => 'Other',
          'icon' => 'receipt-text',
          'color' => '#FFFFFF',
          'bg_color' => '#4A5568', // Dark gray - miscellaneous
          'type' => 'transfer',
          'description' => 'Other transfers',
          'children' => []
        ]
      ]
    ]
  ];

  /**
   * Default tags
   */
  const DEFAULT_TAGS = [
    [
      'name' => 'Initial Balance',
      'icon' => 'plus-circle',
      'color' => '#FFFFFF',
      'bg_color' => '#38A169', // Green - positive/initial
      'description' => 'Initial account balance transaction',
    ],
    [
      'name' => 'Recurring',
      'icon' => 'repeat',
      'color' => '#FFFFFF',
      'bg_color' => '#3182CE', // Blue - repetition/cycle
      'description' => 'Recurring transactions',
    ],
    [
      'name' => 'Urgent',
      'icon' => 'alert-circle',
      'color' => '#FFFFFF',
      'bg_color' => '#E53E3E', // Red - urgent/alert
      'description' => 'Urgent transactions',
    ],
    [
      'name' => 'Shared',
      'icon' => 'users',
      'color' => '#FFFFFF',
      'bg_color' => '#805AD5', // Purple - shared/collaborative
      'description' => 'Shared expenses',
    ],
    [
      'name' => 'Personal',
      'icon' => 'user',
      'color' => '#FFFFFF',
      'bg_color' => '#DD6B20', // Orange - personal/individual
      'description' => 'Personal transactions',
    ],
    [
      'name' => 'Business',
      'icon' => 'briefcase-business',
      'color' => '#FFFFFF',
      'bg_color' => '#2D3748', // Dark gray - professional/business
      'description' => 'Business transactions',
    ]
  ];
}
