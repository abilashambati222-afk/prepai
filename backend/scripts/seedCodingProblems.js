require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const CodingProblem = require('../models/CodingProblem');

const sampleProblems = [
  {
    title: "Two Sum",
    slug: "two-sum",
    description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.",
    difficulty: "Easy",
    category: "Arrays",
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists."
    ],
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
      }
    ],
    starterCode: [
      {
        language: "javascript",
        code: "function twoSum(nums, target) {\n    // Write your code here\n    return [];\n}"
      },
      {
        language: "python",
        code: "def twoSum(nums, target):\n    # Write your code here\n    return []"
      },
      {
        language: "java",
        code: "import java.util.*;\n\nclass Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your code here\n        return new int[0];\n    }\n}"
      },
      {
        language: "cpp",
        code: "#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write your code here\n        return {};\n    }\n};"
      },
      {
        language: "c",
        code: "int* twoSum(int* nums, int numsSize, int target, int* returnSize) {\n    // Write your code here\n    *returnSize = 0;\n    return NULL;\n}"
      }
    ],
    testCases: [
      { input: "[2,7,11,15]\n9", output: "[0,1]", isHidden: false },
      { input: "[3,2,4]\n6", output: "[1,2]", isHidden: false },
      { input: "[3,3]\n6", output: "[0,1]", isHidden: true }
    ],
    tags: ["Array", "Hash Table"],
    companyTags: ["Google", "Amazon", "Meta", "Microsoft"],
    acceptanceRate: 51.2
  },
  {
    title: "Reverse String",
    slug: "reverse-string",
    description: "Write a function that reverses a string. The input string is given as an array of characters `s`.\n\nYou must do this by modifying the input array in-place with O(1) extra memory.",
    difficulty: "Easy",
    category: "Strings",
    constraints: [
      "1 <= s.length <= 10^5",
      "s[i] is a printable ascii character."
    ],
    examples: [
      {
        input: 's = ["h","e","l","l","o"]',
        output: '["o","l","l","e","h"]'
      }
    ],
    starterCode: [
      {
        language: "javascript",
        code: "function reverseString(s) {\n    // Write your code here\n    s.reverse();\n}"
      },
      {
        language: "python",
        code: "def reverseString(s):\n    # Write your code here\n    s.reverse()"
      },
      {
        language: "java",
        code: "class Solution {\n    public void reverseString(char[] s) {\n        // Write your code here\n    }\n}"
      },
      {
        language: "cpp",
        code: "#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    void reverseString(vector<char>& s) {\n        // Write your code here\n    }\n};"
      },
      {
        language: "c",
        code: "void reverseString(char* s, int sSize) {\n    // Write your code here\n}"
      }
    ],
    testCases: [
      { input: '["h","e","l","l","o"]', output: '["o","l","l","e","h"]', isHidden: false },
      { input: '["H","a","n","n","a","h"]', output: '["h","a","n","n","a","H"]', isHidden: true }
    ],
    tags: ["String", "Two Pointers"],
    companyTags: ["Microsoft", "Amazon", "Apple"],
    acceptanceRate: 77.8
  },
  {
    title: "Valid Parentheses",
    slug: "valid-parentheses",
    description: "Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.",
    difficulty: "Easy",
    category: "Stack",
    constraints: [
      "1 <= s.length <= 10^4",
      "s consists of parentheses only '()[]{}'."
    ],
    examples: [
      {
        input: 's = "()[]{}"',
        output: "true"
      }
    ],
    starterCode: [
      {
        language: "javascript",
        code: "function isValid(s) {\n    // Write your code here\n    return false;\n}"
      },
      {
        language: "python",
        code: "def isValid(s):\n    # Write your code here\n    return False"
      },
      {
        language: "java",
        code: "class Solution {\n    public boolean isValid(String s) {\n        // Write your code here\n        return false;\n    }\n}"
      },
      {
        language: "cpp",
        code: "#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool isValid(string s) {\n        // Write your code here\n        return false;\n    }\n};"
      },
      {
        language: "c",
        code: "bool isValid(char* s) {\n    // Write your code here\n    return false;\n}"
      }
    ],
    testCases: [
      { input: '"()"', output: "true", isHidden: false },
      { input: '"()[]{}"', output: "true", isHidden: false },
      { input: '"(]"', output: "false", isHidden: true }
    ],
    tags: ["String", "Stack"],
    companyTags: ["Google", "Amazon", "Meta", "Bloomberg"],
    acceptanceRate: 40.5
  },
  {
    title: "Merge Two Sorted Lists",
    slug: "merge-two-sorted-lists",
    description: "You are given the heads of two sorted linked lists `list1` and `list2`.\n\nMerge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.\n\nReturn the head of the merged linked list.",
    difficulty: "Easy",
    category: "Linked Lists",
    constraints: [
      "The number of nodes in both lists is in the range [0, 50].",
      "-100 <= Node.val <= 100",
      "Both list1 and list2 are sorted in non-decreasing order."
    ],
    examples: [
      {
        input: "list1 = [1,2,4], list2 = [1,3,4]",
        output: "[1,1,2,3,4,4]"
      }
    ],
    starterCode: [
      {
        language: "javascript",
        code: "/*\n * Definition for singly-linked list.\n * function ListNode(val, next) {\n *     this.val = (val===undefined ? 0 : val)\n *     this.next = (next===undefined ? null : next)\n * }\n */\nfunction mergeTwoLists(list1, list2) {\n    // Write your code here\n    return null;\n}"
      },
      {
        language: "python",
        code: "# Definition for singly-linked list.\n# class ListNode:\n#     def __init__(self, val=0, next=None):\n#         self.val = val\n#         self.next = next\ndef mergeTwoLists(list1, list2):\n    # Write your code here\n    return None"
      },
      {
        language: "java",
        code: "class Solution {\n    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {\n        // Write your code here\n        return null;\n    }\n}"
      },
      {
        language: "cpp",
        code: "class Solution {\npublic:\n    ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {\n        // Write your code here\n        return nullptr;\n    }\n};"
      },
      {
        language: "c",
        code: "struct ListNode* mergeTwoLists(struct ListNode* list1, struct ListNode* list2) {\n    // Write your code here\n    return NULL;\n}"
      }
    ],
    testCases: [
      { input: "[1,2,4]\n[1,3,4]", output: "[1,1,2,3,4,4]", isHidden: false },
      { input: "[]\n[]", output: "[]", isHidden: false },
      { input: "[]\n[0]", output: "[0]", isHidden: true }
    ],
    tags: ["Linked List", "Recursion"],
    companyTags: ["Amazon", "Microsoft", "TCS"],
    acceptanceRate: 63.4
  },
  {
    title: "Maximum Subarray",
    slug: "maximum-subarray",
    description: "Given an integer array `nums`, find the subarray with the largest sum, and return its sum.",
    difficulty: "Medium",
    category: "Dynamic Programming",
    constraints: [
      "1 <= nums.length <= 10^5",
      "-10^4 <= nums[i] <= 10^4"
    ],
    examples: [
      {
        input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
        output: "6",
        explanation: "The subarray [4,-1,2,1] has the largest sum = 6."
      }
    ],
    starterCode: [
      {
        language: "javascript",
        code: "function maxSubArray(nums) {\n    // Write your code here\n    return 0;\n}"
      },
      {
        language: "python",
        code: "def maxSubArray(nums):\n    # Write your code here\n    return 0"
      },
      {
        language: "java",
        code: "class Solution {\n    public int maxSubArray(int[] nums) {\n        // Write your code here\n        return 0;\n    }\n}"
      },
      {
        language: "cpp",
        code: "#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int maxSubArray(vector<int>& nums) {\n        // Write your code here\n        return 0;\n    }\n};"
      },
      {
        language: "c",
        code: "int maxSubArray(int* nums, int numsSize) {\n    // Write your code here\n    return 0;\n}"
      }
    ],
    testCases: [
      { input: "[-2,1,-3,4,-1,2,1,-5,4]", output: "6", isHidden: false },
      { input: "[1]", output: "1", isHidden: false },
      { input: "[5,4,-1,7,8]", output: "23", isHidden: true }
    ],
    tags: ["Array", "Divide and Conquer", "Dynamic Programming"],
    companyTags: ["Google", "Amazon", "Microsoft", "Cisco"],
    acceptanceRate: 50.3
  },
  {
    title: "Coin Change",
    slug: "coin-change",
    description: "You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money.\n\nReturn the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return `-1`.\n\nYou may assume that you have an infinite number of each kind of coin.",
    difficulty: "Medium",
    category: "Dynamic Programming",
    constraints: [
      "1 <= coins.length <= 12",
      "1 <= coins[i] <= 2^31 - 1",
      "0 <= amount <= 10^4"
    ],
    examples: [
      {
        input: "coins = [1,2,5], amount = 11",
        output: "3",
        explanation: "11 = 5 + 5 + 1"
      }
    ],
    starterCode: [
      {
        language: "javascript",
        code: "function coinChange(coins, amount) {\n    // Write your code here\n    return -1;\n}"
      },
      {
        language: "python",
        code: "def coinChange(coins, amount):\n    # Write your code here\n    return -1"
      },
      {
        language: "java",
        code: "class Solution {\n    public int coinChange(int[] coins, int amount) {\n        // Write your code here\n        return -1;\n    }\n}"
      },
      {
        language: "cpp",
        code: "#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int coinChange(vector<int>& coins, int amount) {\n        // Write your code here\n        return -1;\n    }\n};"
      },
      {
        language: "c",
        code: "int coinChange(int* coins, int coinsSize, int amount) {\n    // Write your code here\n    return -1;\n}"
      }
    ],
    testCases: [
      { input: "[1,2,5]\n11", output: "3", isHidden: false },
      { input: "[2]\n3", output: "-1", isHidden: false },
      { input: "[1]\n0", output: "0", isHidden: true }
    ],
    tags: ["Array", "Dynamic Programming", "Breadth-First Search"],
    companyTags: ["Google", "Amazon", "Microsoft", "Goldman Sachs"],
    acceptanceRate: 42.9
  }
];

const seedDatabase = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/prepai';
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('[MDB] Connection established for seeding.');

    // Clear existing coding problems
    await CodingProblem.deleteMany({});
    console.log('[MDB] Cleared old coding problems.');

    // Insert sample problems
    await CodingProblem.insertMany(sampleProblems);
    console.log('[MDB] CURATED Coding Problems seeded successfully!');

    process.exit(0);
  } catch (err) {
    console.error('[ERR] Seeding failed! Details:', err.message);
    process.exit(1);
  }
};

seedDatabase();
