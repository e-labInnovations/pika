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
      'color' => '#ffffff',
      'bg_color' => '#FF6B6B',
      'type' => 'expense',
      'description' => 'Food and dining expenses',
      'children' => [
        [
          'name' => 'Dining Out',
          'icon' => 'utensils',
          'color' => '#ffffff',
          'bg_color' => '#FFB347',
          'type' => 'expense',
          'description' => 'Restaurant and dining out expenses',
        ],
        [
          'name' => 'Groceries',
          'icon' => 'shopping-basket',
          'color' => '#ffffff',
          'bg_color' => '#FFD700',
          'type' => 'expense',
          'description' => 'Grocery shopping expenses',
        ],
        [
          'name' => 'Coffee & Snacks',
          'icon' => 'coffee',
          'color' => '#ffffff',
          'bg_color' => '#A3E635',
          'type' => 'expense',
          'description' => 'Coffee and snack expenses',
        ]
      ]
    ],
    // Shopping
    [
      'name' => 'Shopping',
      'icon' => 'shopping-cart',
      'color' => '#ffffff',
      'bg_color' => '#4ECDC4',
      'type' => 'expense',
      'description' => 'Shopping expenses',
      'children' => [
        [
          'name' => 'Clothing',
          'icon' => 'shirt',
          'color' => '#ffffff',
          'bg_color' => '#7C3AED',
          'type' => 'expense',
          'description' => 'Clothing and apparel expenses',
        ],
        [
          'name' => 'Electronics',
          'icon' => 'monitor-speaker',
          'color' => '#ffffff',
          'bg_color' => '#38BDF8',
          'type' => 'expense',
          'description' => 'Electronics and gadgets',
        ],
        [
          'name' => 'Home Goods',
          'icon' => 'sofa',
          'color' => '#ffffff',
          'bg_color' => '#F472B6',
          'type' => 'expense',
          'description' => 'Home and furniture expenses',
        ]
      ]
    ],
    // Transportation
    [
      'name' => 'Transportation',
      'icon' => 'car',
      'color' => '#ffffff',
      'bg_color' => '#45B7D1',
      'type' => 'expense',
      'description' => 'Transportation expenses',
      'children' => [
        [
          'name' => 'Fuel',
          'icon' => 'fuel',
          'color' => '#ffffff',
          'bg_color' => '#F59E42',
          'type' => 'expense',
          'description' => 'Fuel and gas expenses',
        ],
        [
          'name' => 'Public Transit',
          'icon' => 'bus',
          'color' => '#ffffff',
          'bg_color' => '#6366F1',
          'type' => 'expense',
          'description' => 'Public transportation expenses',  
        ],
        [
          'name' => 'Maintenance',
          'icon' => 'wrench',
          'color' => '#ffffff',
          'bg_color' => '#F87171',
          'type' => 'expense',
          'description' => 'Vehicle maintenance expenses',
        ]
      ]
    ],
    // Housing
    [
      'name' => 'Housing',
      'icon' => 'home',
      'color' => '#ffffff',
      'bg_color' => '#96CEB4',
      'type' => 'expense',
      'description' => 'Housing expenses',
      'children' => [
        [
          'name' => 'Rent',
          'icon' => 'key',
          'color' => '#ffffff',
          'bg_color' => '#FBBF24',
          'type' => 'expense',
          'description' => 'Rent payments',
        ],
        [
          'name' => 'Mortgage',
          'icon' => 'building-2',
          'color' => '#ffffff',
          'bg_color' => '#60A5FA',
          'type' => 'expense',
          'description' => 'Mortgage payments',
        ],
        [
          'name' => 'Maintenance',
          'icon' => 'hammer',
          'color' => '#ffffff',
          'bg_color' => '#F472B6',
          'type' => 'expense',
          'description' => 'Home maintenance expenses',
        ]
      ]
    ],
    // Utilities
    [
      'name' => 'Utilities',
      'icon' => 'zap',
      'color' => '#333333',
      'bg_color' => '#FFEEAD',
      'type' => 'expense',
      'description' => 'Utility bills',
      'children' => [
        [
          'name' => 'Electricity',
          'icon' => 'plug-zap',
          'color' => '#333333',
          'bg_color' => '#FDE68A',
          'type' => 'expense',
          'description' => 'Electricity bills',
        ],
        [
          'name' => 'Water',
          'icon' => 'droplet',
          'color' => '#333333',
          'bg_color' => '#38BDF8',
          'type' => 'expense',
          'description' => 'Water bills',
        ],
        [
          'name' => 'Internet',
          'icon' => 'wifi',
          'color' => '#333333',
          'bg_color' => '#A3E635',
          'type' => 'expense',
          'description' => 'Internet and phone bills',
        ]
      ]
    ],
    // Entertainment
    [
      'name' => 'Entertainment',
      'icon' => 'film',
      'color' => '#ffffff',
      'bg_color' => '#D4A5A5',
      'type' => 'expense',
      'description' => 'Entertainment expenses',
      'children' => [
        [
          'name' => 'Movies',
          'icon' => 'clapperboard',
          'color' => '#ffffff',
          'bg_color' => '#F59E42',
          'type' => 'expense',
          'description' => 'Movie and theater expenses',  
        ],
        [
          'name' => 'Games',
          'icon' => 'gamepad-2',
          'color' => '#ffffff',
          'bg_color' => '#6366F1',
          'type' => 'expense',
          'description' => 'Gaming expenses',
        ],
        [
          'name' => 'Music',
          'icon' => 'music',
          'color' => '#ffffff',
          'bg_color' => '#A3E635',
          'type' => 'expense',
          'description' => 'Music and concerts',
        ],
        [
          'name' => 'Sports',
          'icon' => 'volleyball',
          'color' => '#ffffff',
          'bg_color' => '#F87171',
          'type' => 'expense',
          'description' => 'Sports and fitness expenses',
        ]
      ]
    ],
    // Healthcare
    [
      'name' => 'Healthcare',
      'icon' => 'heart-pulse',
      'color' => '#ffffff',
      'bg_color' => '#9B59B6',
      'type' => 'expense',
      'description' => 'Healthcare expenses',
      'children' => [
        [
          'name' => 'Medical',
          'icon' => 'stethoscope',
          'color' => '#ffffff',
          'bg_color' => '#38BDF8',
          'type' => 'expense',
          'description' => 'Medical expenses',
        ],
        [
          'name' => 'Pharmacy',
          'icon' => 'pill',
          'color' => '#ffffff',
          'bg_color' => '#FBBF24',
          'type' => 'expense',
          'description' => 'Pharmacy expenses',
        ]
      ]
    ],
    // Education
    [
      'name' => 'Education',
      'icon' => 'graduation-cap',
      'color' => '#ffffff',
      'bg_color' => '#3498DB',
      'type' => 'expense',
      'description' => 'Education expenses',
      'children' => [
        [
          'name' => 'Tuition',
          'icon' => 'school',
          'color' => '#ffffff',
          'bg_color' => '#A3E635',
          'type' => 'expense',
          'description' => 'Tuition fees',
        ],
        [
          'name' => 'Books',
          'icon' => 'book',
          'color' => '#ffffff',
          'bg_color' => '#6366F1',
          'type' => 'expense',
          'description' => 'Books and supplies',
        ],
        [
          'name' => 'Courses',
          'icon' => 'notebook-pen',
          'color' => '#ffffff',
          'bg_color' => '#F472B6',
          'type' => 'expense',
          'description' => 'Online courses and training',
        ]
      ]
    ],
    // Personal Care
    [
      'name' => 'Personal Care',
      'icon' => 'shield-user',
      'color' => '#ffffff',
      'bg_color' => '#E67E22',
      'type' => 'expense',
      'description' => 'Personal care expenses',  
      'children' => [
        [
          'name' => 'Hair Care',
          'icon' => 'scissors',
          'color' => '#ffffff',
          'bg_color' => '#60A5FA',
          'type' => 'expense',
          'description' => 'Hair care and styling',
        ],
        [
          'name' => 'Skincare',
          'icon' => 'sparkles',
          'color' => '#ffffff',
          'bg_color' => '#A3E635',
          'type' => 'expense',
          'description' => 'Skincare and beauty',
        ],
        [
          'name' => 'Fitness',
          'icon' => 'dumbbell',
          'color' => '#ffffff',
          'bg_color' => '#6366F1',
          'type' => 'expense',
          'description' => 'Fitness and gym expenses',
        ]
      ]
    ],
    // Gifts
    [
      'name' => 'Gifts',
      'icon' => 'gift',
      'color' => '#ffffff',
      'bg_color' => '#E74C3C',
      'type' => 'expense',
      'description' => 'Gift expenses',
      'children' => [
        [
          'name' => 'Birthday',
          'icon' => 'cake',
          'color' => '#ffffff',
          'bg_color' => '#FFD700',
          'type' => 'expense',
          'description' => 'Birthday gifts',
        ],
        [
          'name' => 'Holiday',
          'icon' => 'tent-tree',
          'color' => '#ffffff',
          'bg_color' => '#7C3AED',
          'type' => 'expense',
          'description' => 'Holiday gifts',
        ],
        [
          'name' => 'Special Occasion',
          'icon' => 'party-popper',
          'color' => '#ffffff',
          'bg_color' => '#38BDF8',
          'type' => 'expense',
          'description' => 'Special occasion gifts',
        ]
      ]
    ],
    // Travel
    [
      'name' => 'Travel',
      'icon' => 'plane',
      'color' => '#ffffff',
      'bg_color' => '#2ECC71',
      'type' => 'expense',
      'description' => 'Travel expenses',
      'children' => [
        [
          'name' => 'Flights',
          'icon' => 'plane-takeoff',
          'color' => '#ffffff',
          'bg_color' => '#60A5FA',
          'type' => 'expense',
          'description' => 'Flight expenses',
        ],
        [
          'name' => 'Hotels',
          'icon' => 'hotel',
          'color' => '#ffffff',
          'bg_color' => '#FFD700',
          'type' => 'expense',
          'description' => 'Hotel and accommodation',
        ],
        [
          'name' => 'Activities',
          'icon' => 'umbrella',
          'color' => '#ffffff',
          'bg_color' => '#A3E635',
          'type' => 'expense',
          'description' => 'Travel activities and tours',
        ]
      ]
    ],
    // Other
    [
      'name' => 'Other',
      'icon' => 'receipt-text',
      'color' => '#ffffff',
      'bg_color' => '#A1A1AA',
      'type' => 'expense',
      'description' => 'Other expenses',
      'children' => []
    ]
  ];

  /**
   * Default income categories
   */
  const DEFAULT_INCOME_CATEGORIES = [
    [
      'name' => 'Work',
      'icon' => 'briefcase',
      'color' => '#ffffff',
      'bg_color' => '#2ECC71',
      'type' => 'income',
      'description' => 'Work-related income',
      'children' => [
        [
          'name' => 'Salary',
          'icon' => 'dollar-sign',
          'color' => '#ffffff',
          'bg_color' => '#FFD700',
          'type' => 'income',
          'description' => 'Regular salary income',
        ],
        [
          'name' => 'Bonus',
          'icon' => 'gem',
          'color' => '#ffffff',
          'bg_color' => '#7C3AED',
          'type' => 'income',
          'description' => 'Bonus and incentives',
        ],
        [
          'name' => 'Freelance',
          'icon' => 'laptop',
          'color' => '#ffffff',
          'bg_color' => '#38BDF8',
          'type' => 'income',
          'description' => 'Freelance income',
        ],
        [
          'name' => 'Investment',
          'icon' => 'trending-up',
          'color' => '#ffffff',
          'bg_color' => '#F59E42',
          'type' => 'income',
          'description' => 'Investment returns',
        ]
      ]
    ],
    [
      'name' => 'Other',
      'icon' => 'receipt-text',
      'color' => '#ffffff',
      'bg_color' => '#A1A1AA',
      'type' => 'income',
      'description' => 'Other income sources',
      'children' => []
    ]
  ];

  /**
   * Default transfer categories
   */
  const DEFAULT_TRANSFER_CATEGORIES = [
    [
      'name' => 'Transfer',
      'icon' => 'piggy-bank',
      'color' => '#ffffff',
      'bg_color' => '#14B8A6',
      'type' => 'transfer',
      'description' => 'Transfer expenses',
      'children' => [
        [
          'name' => 'Bank Transfer',
          'icon' => 'landmark',
          'color' => '#ffffff',
          'bg_color' => '#60A5FA',
          'type' => 'transfer',
          'description' => 'Bank transfers',
          'children' => []
        ],
        [
          'name' => 'ATM',
          'icon' => 'banknote-arrow-down',
          'color' => '#ffffff',
          'bg_color' => '#FFD700',
          'type' => 'transfer',
          'description' => 'ATM withdrawals',
          'children' => []
        ],
        [
          'name' => 'CDM',
          'icon' => 'banknote-arrow-up',
          'color' => '#ffffff',
          'bg_color' => '#A3E635',
          'type' => 'transfer',
          'description' => 'Cash deposit machine',
          'children' => []
        ],
        [
          'name' => 'Other',
          'icon' => 'receipt-text',
          'color' => '#ffffff',
          'bg_color' => '#A1A1AA',
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
      'color' => '#ffffff',
      'bg_color' => '#10B981',
      'description' => 'Initial account balance transaction',
    ],
    [
      'name' => 'Recurring',
      'icon' => 'repeat',
      'color' => '#ffffff',
      'bg_color' => '#3498DB',
      'description' => 'Recurring transactions',
    ],
    [
      'name' => 'Urgent',
      'icon' => 'alert-circle',
      'color' => '#ffffff',
      'bg_color' => '#E74C3C',
      'description' => 'Urgent transactions',
    ],
    [
      'name' => 'Shared',
      'icon' => 'users',
      'color' => '#ffffff',
      'bg_color' => '#2ECC71',
      'description' => 'Shared expenses',
    ],
    [
      'name' => 'Personal',
      'icon' => 'user',
      'color' => '#333333',
      'bg_color' => '#F1C40F',
      'description' => 'Personal transactions',
    ],
    [
      'name' => 'Business',
      'icon' => 'briefcase-business',
      'color' => '#ffffff',
      'bg_color' => '#9B59B6',
      'description' => 'Business transactions',
    ]
  ];
}
