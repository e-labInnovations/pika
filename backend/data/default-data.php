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
      'icon' => 'utensils',
      'color' => '#ffffff',
      'bg_color' => '#FF6B6B',
      'type' => 'expense',
      'description' => 'Food and dining expenses',
      'is_system' => 1,
      'children' => [
        [
          'name' => 'Dining Out',
          'icon' => 'utensils',
          'color' => '#ffffff',
          'bg_color' => '#FF8E8E',
          'type' => 'expense',
          'description' => 'Restaurant and dining out expenses',
          'is_system' => 1
        ],
        [
          'name' => 'Groceries',
          'icon' => 'shopping-basket',
          'color' => '#ffffff',
          'bg_color' => '#FF8E8E',
          'type' => 'expense',
          'description' => 'Grocery shopping expenses',
          'is_system' => 1
        ],
        [
          'name' => 'Coffee & Snacks',
          'icon' => 'coffee',
          'color' => '#ffffff',
          'bg_color' => '#FF8E8E',
          'type' => 'expense',
          'description' => 'Coffee and snack expenses',
          'is_system' => 1
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
      'is_system' => 1,
      'children' => [
        [
          'name' => 'Clothing',
          'icon' => 'shirt',
          'color' => '#ffffff',
          'bg_color' => '#6ED7D0',
          'type' => 'expense',
          'description' => 'Clothing and apparel expenses',
          'is_system' => 1
        ],
        [
          'name' => 'Electronics',
          'icon' => 'laptop',
          'color' => '#ffffff',
          'bg_color' => '#6ED7D0',
          'type' => 'expense',
          'description' => 'Electronics and gadgets',
          'is_system' => 1
        ],
        [
          'name' => 'Home Goods',
          'icon' => 'sofa',
          'color' => '#ffffff',
          'bg_color' => '#6ED7D0',
          'type' => 'expense',
          'description' => 'Home and furniture expenses',
          'is_system' => 1
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
      'is_system' => 1,
      'children' => [
        [
          'name' => 'Fuel',
          'icon' => 'fuel',
          'color' => '#ffffff',
          'bg_color' => '#67C5DB',
          'type' => 'expense',
          'description' => 'Fuel and gas expenses',
          'is_system' => 1
        ],
        [
          'name' => 'Public Transit',
          'icon' => 'bus',
          'color' => '#ffffff',
          'bg_color' => '#67C5DB',
          'type' => 'expense',
          'description' => 'Public transportation expenses',
          'is_system' => 1
        ],
        [
          'name' => 'Maintenance',
          'icon' => 'wrench',
          'color' => '#ffffff',
          'bg_color' => '#67C5DB',
          'type' => 'expense',
          'description' => 'Vehicle maintenance expenses',
          'is_system' => 1
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
      'is_system' => 1,
      'children' => [
        [
          'name' => 'Rent',
          'icon' => 'key',
          'color' => '#ffffff',
          'bg_color' => '#B1D9C3',
          'type' => 'expense',
          'description' => 'Rent payments',
          'is_system' => 1
        ],
        [
          'name' => 'Mortgage',
          'icon' => 'home',
          'color' => '#ffffff',
          'bg_color' => '#B1D9C3',
          'type' => 'expense',
          'description' => 'Mortgage payments',
          'is_system' => 1
        ],
        [
          'name' => 'Maintenance',
          'icon' => 'hammer',
          'color' => '#ffffff',
          'bg_color' => '#B1D9C3',
          'type' => 'expense',
          'description' => 'Home maintenance expenses',
          'is_system' => 1
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
      'is_system' => 1,
      'children' => [
        [
          'name' => 'Electricity',
          'icon' => 'zap',
          'color' => '#333333',
          'bg_color' => '#FFF0C0',
          'type' => 'expense',
          'description' => 'Electricity bills',
          'is_system' => 1
        ],
        [
          'name' => 'Water',
          'icon' => 'droplet',
          'color' => '#333333',
          'bg_color' => '#FFF0C0',
          'type' => 'expense',
          'description' => 'Water bills',
          'is_system' => 1
        ],
        [
          'name' => 'Internet',
          'icon' => 'wifi',
          'color' => '#333333',
          'bg_color' => '#FFF0C0',
          'type' => 'expense',
          'description' => 'Internet and phone bills',
          'is_system' => 1
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
      'is_system' => 1,
      'children' => [
        [
          'name' => 'Movies',
          'icon' => 'film',
          'color' => '#ffffff',
          'bg_color' => '#E5BDBD',
          'type' => 'expense',
          'description' => 'Movie and theater expenses',
          'is_system' => 1
        ],
        [
          'name' => 'Games',
          'icon' => 'gamepad-2',
          'color' => '#ffffff',
          'bg_color' => '#E5BDBD',
          'type' => 'expense',
          'description' => 'Gaming expenses',
          'is_system' => 1
        ],
        [
          'name' => 'Music',
          'icon' => 'music',
          'color' => '#ffffff',
          'bg_color' => '#E5BDBD',
          'type' => 'expense',
          'description' => 'Music and concerts',
          'is_system' => 1
        ],
        [
          'name' => 'Sports',
          'icon' => 'volleyball',
          'color' => '#ffffff',
          'bg_color' => '#E5BDBD',
          'type' => 'expense',
          'description' => 'Sports and fitness expenses',
          'is_system' => 1
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
      'is_system' => 1,
      'children' => [
        [
          'name' => 'Medical',
          'icon' => 'stethoscope',
          'color' => '#ffffff',
          'bg_color' => '#B07CC7',
          'type' => 'expense',
          'description' => 'Medical expenses',
          'is_system' => 1
        ],
        [
          'name' => 'Pharmacy',
          'icon' => 'pill',
          'color' => '#ffffff',
          'bg_color' => '#B07CC7',
          'type' => 'expense',
          'description' => 'Pharmacy expenses',
          'is_system' => 1
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
      'is_system' => 1,
      'children' => [
        [
          'name' => 'Tuition',
          'icon' => 'school',
          'color' => '#ffffff',
          'bg_color' => '#5DABE3',
          'type' => 'expense',
          'description' => 'Tuition fees',
          'is_system' => 1
        ],
        [
          'name' => 'Books',
          'icon' => 'book',
          'color' => '#ffffff',
          'bg_color' => '#5DABE3',
          'type' => 'expense',
          'description' => 'Books and supplies',
          'is_system' => 1
        ],
        [
          'name' => 'Courses',
          'icon' => 'notebook-pen',
          'color' => '#ffffff',
          'bg_color' => '#5DABE3',
          'type' => 'expense',
          'description' => 'Online courses and training',
          'is_system' => 1
        ]
      ]
    ],
    // Personal Care
    [
      'name' => 'Personal Care',
      'icon' => 'user',
      'color' => '#ffffff',
      'bg_color' => '#E67E22',
      'type' => 'expense',
      'description' => 'Personal care expenses',
      'is_system' => 1,
      'children' => [
        [
          'name' => 'Hair Care',
          'icon' => 'scissors',
          'color' => '#ffffff',
          'bg_color' => '#EB9950',
          'type' => 'expense',
          'description' => 'Hair care and styling',
          'is_system' => 1
        ],
        [
          'name' => 'Skincare',
          'icon' => 'sparkles',
          'color' => '#ffffff',
          'bg_color' => '#EB9950',
          'type' => 'expense',
          'description' => 'Skincare and beauty',
          'is_system' => 1
        ],
        [
          'name' => 'Fitness',
          'icon' => 'dumbbell',
          'color' => '#ffffff',
          'bg_color' => '#EB9950',
          'type' => 'expense',
          'description' => 'Fitness and gym expenses',
          'is_system' => 1
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
      'is_system' => 1,
      'children' => [
        [
          'name' => 'Birthday',
          'icon' => 'cake',
          'color' => '#ffffff',
          'bg_color' => '#EC6B5D',
          'type' => 'expense',
          'description' => 'Birthday gifts',
          'is_system' => 1
        ],
        [
          'name' => 'Holiday',
          'icon' => 'tent-tree',
          'color' => '#ffffff',
          'bg_color' => '#EC6B5D',
          'type' => 'expense',
          'description' => 'Holiday gifts',
          'is_system' => 1
        ],
        [
          'name' => 'Special Occasion',
          'icon' => 'gift',
          'color' => '#ffffff',
          'bg_color' => '#EC6B5D',
          'type' => 'expense',
          'description' => 'Special occasion gifts',
          'is_system' => 1
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
      'is_system' => 1,
      'children' => [
        [
          'name' => 'Flights',
          'icon' => 'plane',
          'color' => '#ffffff',
          'bg_color' => '#58D68D',
          'type' => 'expense',
          'description' => 'Flight expenses',
          'is_system' => 1
        ],
        [
          'name' => 'Hotels',
          'icon' => 'building-2',
          'color' => '#ffffff',
          'bg_color' => '#58D68D',
          'type' => 'expense',
          'description' => 'Hotel and accommodation',
          'is_system' => 1
        ],
        [
          'name' => 'Activities',
          'icon' => 'umbrella',
          'color' => '#ffffff',
          'bg_color' => '#58D68D',
          'type' => 'expense',
          'description' => 'Travel activities and tours',
          'is_system' => 1
        ]
      ]
    ],
    // Other
    [
      'name' => 'Other',
      'icon' => 'more-horizontal',
      'color' => '#ffffff',
      'bg_color' => '#95A5A6',
      'type' => 'expense',
      'description' => 'Other expenses',
      'is_system' => 1,
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
      'is_system' => 1,
      'children' => [
        [
          'name' => 'Salary',
          'icon' => 'dollar-sign',
          'color' => '#ffffff',
          'bg_color' => '#2ECC71',
          'type' => 'income',
          'description' => 'Regular salary income',
          'is_system' => 1
        ],
        [
          'name' => 'Bonus',
          'icon' => 'gem',
          'color' => '#ffffff',
          'bg_color' => '#2ECC71',
          'type' => 'income',
          'description' => 'Bonus and incentives',
          'is_system' => 1
        ],
        [
          'name' => 'Freelance',
          'icon' => 'laptop',
          'color' => '#ffffff',
          'bg_color' => '#2ECC71',
          'type' => 'income',
          'description' => 'Freelance income',
          'is_system' => 1
        ],
        [
          'name' => 'Investment',
          'icon' => 'trending-up',
          'color' => '#ffffff',
          'bg_color' => '#2ECC71',
          'type' => 'income',
          'description' => 'Investment returns',
          'is_system' => 1
        ]
      ]
    ],
    [
      'name' => 'Other',
      'icon' => 'more-horizontal',
      'color' => '#ffffff',
      'bg_color' => '#95A5A6',
      'type' => 'income',
      'description' => 'Other income sources',
      'is_system' => 1,
      'children' => []
    ]
  ];

  /**
   * Default transfer categories
   */
  const DEFAULT_TRANSFER_CATEGORIES = [
    [
      'name' => 'Bank Transfer',
      'icon' => 'banknote-arrow-up',
      'color' => '#ffffff',
      'bg_color' => '#2ECC71',
      'type' => 'transfer',
      'description' => 'Bank transfers',
      'is_system' => 1,
      'children' => []
    ],
    [
      'name' => 'ATM',
      'icon' => 'banknote-arrow-down',
      'color' => '#ffffff',
      'bg_color' => '#2ECC71',
      'type' => 'transfer',
      'description' => 'ATM withdrawals',
      'is_system' => 1,
      'children' => []
    ],
    [
      'name' => 'CDM',
      'icon' => 'coins',
      'color' => '#ffffff',
      'bg_color' => '#2ECC71',
      'type' => 'transfer',
      'description' => 'Cash deposit machine',
      'is_system' => 1,
      'children' => []
    ],
    [
      'name' => 'Other',
      'icon' => 'more-horizontal',
      'color' => '#ffffff',
      'bg_color' => '#95A5A6',
      'type' => 'transfer',
      'description' => 'Other transfers',
      'is_system' => 1,
      'children' => []
    ]
  ];

  /**
   * Default tags
   */
  const DEFAULT_TAGS = [
    [
      'name' => 'Recurring',
      'icon' => 'repeat',
      'color' => '#ffffff',
      'bg_color' => '#3498DB',
      'description' => 'Recurring transactions',
      'is_system' => 1
    ],
    [
      'name' => 'Urgent',
      'icon' => 'alert-circle',
      'color' => '#ffffff',
      'bg_color' => '#E74C3C',
      'description' => 'Urgent transactions',
      'is_system' => 1
    ],
    [
      'name' => 'Shared',
      'icon' => 'users',
      'color' => '#ffffff',
      'bg_color' => '#2ECC71',
      'description' => 'Shared expenses',
      'is_system' => 1
    ],
    [
      'name' => 'Personal',
      'icon' => 'user',
      'color' => '#333333',
      'bg_color' => '#F1C40F',
      'description' => 'Personal transactions',
      'is_system' => 1
    ],
    [
      'name' => 'Business',
      'icon' => 'briefcase',
      'color' => '#ffffff',
      'bg_color' => '#9B59B6',
      'description' => 'Business transactions',
      'is_system' => 1
    ]
  ];
}
