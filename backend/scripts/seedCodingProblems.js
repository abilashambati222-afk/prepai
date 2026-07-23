require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const CodingProblem = require('../models/CodingProblem');

const sampleProblems = [
  {
    "title": "Two Sum",
    "slug": "two-sum",
    "description": "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.",
    "difficulty": "Easy",
    "category": "Arrays",
    "constraints": [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists."
    ],
    "examples": [
      {
        "input": "nums = [2,7,11,15], target = 9",
        "output": "[0,1]",
        "explanation": "Because nums[0] + nums[1] == 9, we return [0, 1]."
      }
    ],
    "testCases": [
      {
        "input": "[2,7,11,15]\n9",
        "output": "[0,1]",
        "isHidden": false
      },
      {
        "input": "[3,2,4]\n6",
        "output": "[1,2]",
        "isHidden": false
      },
      {
        "input": "[3,3]\n6",
        "output": "[0,1]",
        "isHidden": true
      }
    ],
    "tags": [
      "Array",
      "Hash Table"
    ],
    "companyTags": [
      "Google",
      "Amazon",
      "Meta",
      "Microsoft"
    ],
    "acceptanceRate": 72.5,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function twoSum(nums, target) {\n    // Write your code here\n    return [];\n}"
      },
      {
        "language": "python",
        "code": "def twoSum(nums, target):\n    # Write your code here\n    return []\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your code here\n        return new int[0];\n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write your code here\n        return {};\n    }\n};"
      },
      {
        "language": "c",
        "code": "int* twoSum(int* nums, int numsSize, int target, int* returnSize) {\n    // Write your code here\n    *returnSize = 0;\n    return NULL;\n}"
      }
    ]
  },
  {
    "title": "Contains Duplicate",
    "slug": "contains-duplicate",
    "description": "Given an integer array `nums`, return `true` if any value appears at least twice in the array, and return `false` if every element is distinct.",
    "difficulty": "Easy",
    "category": "Arrays",
    "constraints": [
      "1 <= nums.length <= 10^5",
      "-10^9 <= nums[i] <= 10^9"
    ],
    "examples": [
      {
        "input": "nums = [1,2,3,1]",
        "output": "true"
      }
    ],
    "testCases": [
      {
        "input": "[1,2,3,1]",
        "output": "true",
        "isHidden": false
      },
      {
        "input": "[1,2,3,4]",
        "output": "false",
        "isHidden": false
      },
      {
        "input": "[1,1,1,3,3,4,3,2,4,2]",
        "output": "true",
        "isHidden": true
      }
    ],
    "tags": [
      "Array",
      "Hash Table",
      "Sorting"
    ],
    "companyTags": [
      "Apple",
      "Adobe",
      "Microsoft"
    ],
    "acceptanceRate": 61.2,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function containsDuplicate(nums) {\n    // Write your code here\n    return false;\n}"
      },
      {
        "language": "python",
        "code": "def containsDuplicate(nums):\n    # Write your code here\n    return False\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public boolean containsDuplicate(int[] nums) {\n        // Write your code here\n        return false;\n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool containsDuplicate(vector<int>& nums) {\n        // Write your code here\n        return false;\n    }\n};"
      },
      {
        "language": "c",
        "code": "bool containsDuplicate(int* nums, int numsSize) {\n    // Write your code here\n    return false;\n}"
      }
    ]
  },
  {
    "title": "Best Time to Buy and Sell Stock",
    "slug": "best-time-to-buy-and-sell-stock",
    "description": "You are given an array `prices` where `prices[i]` is the price of a given stock on the `i`th day.\n\nYou want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.\n\nReturn the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return `0`.",
    "difficulty": "Easy",
    "category": "Arrays",
    "constraints": [
      "1 <= prices.length <= 10^5",
      "0 <= prices[i] <= 10^4"
    ],
    "examples": [
      {
        "input": "prices = [7,1,5,3,6,4]",
        "output": "5",
        "explanation": "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5."
      }
    ],
    "testCases": [
      {
        "input": "[7,1,5,3,6,4]",
        "output": "5",
        "isHidden": false
      },
      {
        "input": "[7,6,4,3,1]",
        "output": "0",
        "isHidden": false
      },
      {
        "input": "[1,2]",
        "output": "1",
        "isHidden": true
      }
    ],
    "tags": [
      "Array",
      "Dynamic Programming"
    ],
    "companyTags": [
      "Amazon",
      "Microsoft",
      "Google",
      "Meta"
    ],
    "acceptanceRate": 64.3,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function maxProfit(prices) {\n    // Write your code here\n    return 0;\n}"
      },
      {
        "language": "python",
        "code": "def maxProfit(prices):\n    # Write your code here\n    return 0\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public int maxProfit(int[] prices) {\n        // Write your code here\n        return 0;\n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        // Write your code here\n        return 0;\n    }\n};"
      },
      {
        "language": "c",
        "code": "int maxProfit(int* prices, int pricesSize) {\n    // Write your code here\n    return 0;\n}"
      }
    ]
  },
  {
    "title": "Reverse String",
    "slug": "reverse-string",
    "description": "Write a function that reverses a string. The input string is given as an array of characters `s`.\n\nYou must do this by modifying the input array in-place with O(1) extra memory.",
    "difficulty": "Easy",
    "category": "Strings",
    "constraints": [
      "1 <= s.length <= 10^5",
      "s[i] is a printable ascii character."
    ],
    "examples": [
      {
        "input": "s = [\"h\",\"e\",\"l\",\"l\",\"o\"]",
        "output": "[\"o\",\"l\",\"l\",\"e\",\"h\"]"
      }
    ],
    "testCases": [
      {
        "input": "[\"h\",\"e\",\"l\",\"l\",\"o\"]",
        "output": "[\"o\",\"l\",\"l\",\"e\",\"h\"]",
        "isHidden": false
      },
      {
        "input": "[\"H\",\"a\",\"n\",\"n\",\"a\",\"h\"]",
        "output": "[\"h\",\"a\",\"n\",\"n\",\"a\",\"H\"]",
        "isHidden": true
      }
    ],
    "tags": [
      "String",
      "Two Pointers"
    ],
    "companyTags": [
      "Microsoft",
      "Amazon",
      "Apple"
    ],
    "acceptanceRate": 77.8,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function reverseString(s) {\n    // Write your code here\n    \n}"
      },
      {
        "language": "python",
        "code": "def reverseString(s):\n    # Write your code here\n    pass\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public void reverseString(char[] s) {\n        // Write your code here\n        \n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    void reverseString(vector<char>& s) {\n        // Write your code here\n        \n    }\n};"
      },
      {
        "language": "c",
        "code": "void reverseString(char* s, int sSize) {\n    // Write your code here\n    \n}"
      }
    ]
  },
  {
    "title": "Valid Anagram",
    "slug": "valid-anagram",
    "description": "Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.\n\nAn Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.",
    "difficulty": "Easy",
    "category": "Strings",
    "constraints": [
      "1 <= s.length, t.length <= 5 * 10^4",
      "s and t consist of lowercase English letters."
    ],
    "examples": [
      {
        "input": "s = \"anagram\", t = \"nagaram\"",
        "output": "true"
      }
    ],
    "testCases": [
      {
        "input": "\"anagram\"\n\"nagaram\"",
        "output": "true",
        "isHidden": false
      },
      {
        "input": "\"rat\"\n\"car\"",
        "output": "false",
        "isHidden": false
      },
      {
        "input": "\"a\"\n\"ab\"",
        "output": "false",
        "isHidden": true
      }
    ],
    "tags": [
      "String",
      "Hash Table",
      "Sorting"
    ],
    "companyTags": [
      "Bloomberg",
      "Goldman Sachs",
      "Snapchat"
    ],
    "acceptanceRate": 63.5,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function isAnagram(s, t) {\n    // Write your code here\n    return false;\n}"
      },
      {
        "language": "python",
        "code": "def isAnagram(s, t):\n    # Write your code here\n    return False\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public boolean isAnagram(String s, String t) {\n        // Write your code here\n        return false;\n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool isAnagram(string s, string t) {\n        // Write your code here\n        return false;\n    }\n};"
      },
      {
        "language": "c",
        "code": "bool isAnagram(char* s, char* t) {\n    // Write your code here\n    return false;\n}"
      }
    ]
  },
  {
    "title": "Longest Common Prefix",
    "slug": "longest-common-prefix",
    "description": "Write a function to find the longest common prefix string amongst an array of strings.\n\nIf there is no common prefix, return an empty string `\"\"`.",
    "difficulty": "Easy",
    "category": "Strings",
    "constraints": [
      "1 <= strs.length <= 200",
      "0 <= strs[i].length <= 200",
      "strs[i] consists of only lowercase English letters."
    ],
    "examples": [
      {
        "input": "strs = [\"flower\",\"flow\",\"flight\"]",
        "output": "\"fl\""
      }
    ],
    "testCases": [
      {
        "input": "[\"flower\",\"flow\",\"flight\"]",
        "output": "\"fl\"",
        "isHidden": false
      },
      {
        "input": "[\"dog\",\"racecar\",\"car\"]",
        "output": "\"\"",
        "isHidden": false
      },
      {
        "input": "[\"a\"]",
        "output": "\"a\"",
        "isHidden": true
      }
    ],
    "tags": [
      "String",
      "Trie"
    ],
    "companyTags": [
      "Pinterest",
      "Yelp",
      "Twitter"
    ],
    "acceptanceRate": 61.8,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function longestCommonPrefix(strs) {\n    // Write your code here\n    return \"\";\n}"
      },
      {
        "language": "python",
        "code": "def longestCommonPrefix(strs):\n    # Write your code here\n    return \"\"\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public String longestCommonPrefix(String[] strs) {\n        // Write your code here\n        return \"\";\n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    string longestCommonPrefix(vector<string>& strs) {\n        // Write your code here\n        return \"\";\n    }\n};"
      },
      {
        "language": "c",
        "code": "char* longestCommonPrefix(int strs) {\n    // Write your code here\n    return \"\";\n}"
      }
    ]
  },
  {
    "title": "Merge Two Sorted Lists",
    "slug": "merge-two-sorted-lists",
    "description": "You are given the heads of two sorted linked lists `list1` and `list2`.\n\nMerge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.\n\nReturn the head of the merged linked list.",
    "difficulty": "Easy",
    "category": "Linked Lists",
    "constraints": [
      "The number of nodes in both lists is in the range [0, 50].",
      "-100 <= Node.val <= 100",
      "Both list1 and list2 are sorted in non-decreasing order."
    ],
    "examples": [
      {
        "input": "list1 = [1,2,4], list2 = [1,3,4]",
        "output": "[1,1,2,3,4,4]"
      }
    ],
    "testCases": [
      {
        "input": "[1,2,4]\n[1,3,4]",
        "output": "[1,1,2,3,4,4]",
        "isHidden": false
      },
      {
        "input": "[]\n[]",
        "output": "[]",
        "isHidden": false
      },
      {
        "input": "[]\n[0]",
        "output": "[0]",
        "isHidden": true
      }
    ],
    "tags": [
      "Linked List",
      "Recursion"
    ],
    "companyTags": [
      "Amazon",
      "Microsoft",
      "TCS"
    ],
    "acceptanceRate": 63.4,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function mergeTwoLists(list1, list2) {\n    // Write your code here\n    return null;\n}"
      },
      {
        "language": "python",
        "code": "def mergeTwoLists(list1, list2):\n    # Write your code here\n    return None\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {\n        // Write your code here\n        return new ArrayList<>();\n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {\n        // Write your code here\n        return nullptr;\n    }\n};"
      },
      {
        "language": "c",
        "code": "struct ListNode* mergeTwoLists(struct ListNode* list1, struct ListNode* list2) {\n    // Write your code here\n    return NULL;\n}"
      }
    ]
  },
  {
    "title": "Reverse Linked List",
    "slug": "reverse-linked-list",
    "description": "Given the head of a singly linked list, reverse the list, and return the reversed list.",
    "difficulty": "Easy",
    "category": "Linked Lists",
    "constraints": [
      "The number of nodes in the list is the range [0, 5000].",
      "-5000 <= Node.val <= 5000"
    ],
    "examples": [
      {
        "input": "head = [1,2,3,4,5]",
        "output": "[5,4,3,2,1]"
      }
    ],
    "testCases": [
      {
        "input": "[1,2,3,4,5]",
        "output": "[5,4,3,2,1]",
        "isHidden": false
      },
      {
        "input": "[1,2]",
        "output": "[2,1]",
        "isHidden": false
      },
      {
        "input": "[]",
        "output": "[]",
        "isHidden": true
      }
    ],
    "tags": [
      "Linked List",
      "Recursion"
    ],
    "companyTags": [
      "Nvidia",
      "Intel",
      "Walmart"
    ],
    "acceptanceRate": 75.1,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function reverseList(head) {\n    // Write your code here\n    return null;\n}"
      },
      {
        "language": "python",
        "code": "def reverseList(head):\n    # Write your code here\n    return None\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public ListNode reverseList(ListNode head) {\n        // Write your code here\n        return new ArrayList<>();\n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    ListNode* reverseList(ListNode* head) {\n        // Write your code here\n        return nullptr;\n    }\n};"
      },
      {
        "language": "c",
        "code": "struct ListNode* reverseList(struct ListNode* head) {\n    // Write your code here\n    return NULL;\n}"
      }
    ]
  },
  {
    "title": "Linked List Cycle",
    "slug": "linked-list-cycle",
    "description": "Given `head`, the head of a linked list, determine if the linked list has a cycle in it.\n\nThere is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the `next` pointer.\n\nReturn `true` if there is a cycle in the linked list. Otherwise, return `false`.",
    "difficulty": "Easy",
    "category": "Linked Lists",
    "constraints": [
      "The number of nodes in the list is in the range [0, 10^4].",
      "-10^5 <= Node.val <= 10^5"
    ],
    "examples": [
      {
        "input": "head = [3,2,0,-4], pos = 1",
        "output": "true",
        "explanation": "There is a cycle in the linked list, where the tail connects to the 1st node (0-indexed)."
      }
    ],
    "testCases": [
      {
        "input": "[3,2,0,-4]\n1",
        "output": "true",
        "isHidden": false
      },
      {
        "input": "[1,2]\n0",
        "output": "true",
        "isHidden": false
      },
      {
        "input": "[1]\n-1",
        "output": "false",
        "isHidden": true
      }
    ],
    "tags": [
      "Linked List",
      "Two Pointers",
      "Hash Table"
    ],
    "companyTags": [
      "Amazon",
      "Microsoft",
      "Oracle"
    ],
    "acceptanceRate": 68.9,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function hasCycle(head) {\n    // Write your code here\n    return false;\n}"
      },
      {
        "language": "python",
        "code": "def hasCycle(head):\n    # Write your code here\n    return False\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public boolean hasCycle(ListNode head) {\n        // Write your code here\n        return false;\n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool hasCycle(ListNode* head) {\n        // Write your code here\n        return false;\n    }\n};"
      },
      {
        "language": "c",
        "code": "bool hasCycle(struct ListNode* head) {\n    // Write your code here\n    return false;\n}"
      }
    ]
  },
  {
    "title": "Valid Parentheses",
    "slug": "valid-parentheses",
    "description": "Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.",
    "difficulty": "Easy",
    "category": "Stacks",
    "constraints": [
      "1 <= s.length <= 10^4",
      "s consists of parentheses only '()[]{}'."
    ],
    "examples": [
      {
        "input": "s = \"()[]{}\"",
        "output": "true"
      }
    ],
    "testCases": [
      {
        "input": "\"()\"",
        "output": "true",
        "isHidden": false
      },
      {
        "input": "\"()[]{}\"",
        "output": "true",
        "isHidden": false
      },
      {
        "input": "\"(]\"",
        "output": "false",
        "isHidden": true
      }
    ],
    "tags": [
      "String",
      "Stack"
    ],
    "companyTags": [
      "Google",
      "Amazon",
      "Meta",
      "Bloomberg"
    ],
    "acceptanceRate": 80.5,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function isValid(s) {\n    // Write your code here\n    return false;\n}"
      },
      {
        "language": "python",
        "code": "def isValid(s):\n    # Write your code here\n    return False\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public boolean isValid(String s) {\n        // Write your code here\n        return false;\n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool isValid(string s) {\n        // Write your code here\n        return false;\n    }\n};"
      },
      {
        "language": "c",
        "code": "bool isValid(char* s) {\n    // Write your code here\n    return false;\n}"
      }
    ]
  },
  {
    "title": "Implement Queue using Stacks",
    "slug": "implement-queue-using-stacks",
    "description": "Implement a first in first out (FIFO) queue using only two stacks. The implemented queue should support all the functions of a normal queue (`push`, `peek`, `pop`, and `empty`).",
    "difficulty": "Easy",
    "category": "Stacks",
    "constraints": [
      "1 <= x <= 9",
      "At most 100 calls will be made to push, pop, peek, and empty."
    ],
    "examples": [
      {
        "input": "[\"MyQueue\",\"push\",\"push\",\"peek\",\"pop\",\"empty\"]\n[[],[1],[2],[],[],[]]",
        "output": "[null,null,null,1,1,false]"
      }
    ],
    "testCases": [
      {
        "input": "[\"MyQueue\",\"push\",\"push\",\"peek\",\"pop\",\"empty\"]\n[[],[1],[2],[],[],[]]",
        "output": "[null,null,null,1,1,false]",
        "isHidden": false
      },
      {
        "input": "[\"MyQueue\",\"push\",\"empty\"]\n[[],[5],[]]",
        "output": "[null,null,false]",
        "isHidden": true
      }
    ],
    "tags": [
      "Stack",
      "Design",
      "Queue"
    ],
    "companyTags": [
      "Goldman Sachs",
      "Amazon",
      "Microsoft"
    ],
    "acceptanceRate": 64.2,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function MyQueue() {\n    // Write your code here\n    \n}"
      },
      {
        "language": "python",
        "code": "def MyQueue():\n    # Write your code here\n    pass\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public void MyQueue() {\n        // Write your code here\n        \n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    void MyQueue() {\n        // Write your code here\n        \n    }\n};"
      },
      {
        "language": "c",
        "code": "typedef struct {\n    \n} MyQueue;\n\nMyQueue* myQueueCreate() {\n    return NULL;\n}\nvoid myQueuePush(MyQueue* obj, int x) {\n    \n}\nint myQueuePop(MyQueue* obj) {\n    return 0;\n}\nint myQueuePeek(MyQueue* obj) {\n    return 0;\n}\nbool myQueueEmpty(MyQueue* obj) {\n    return true;\n}\nvoid myQueueFree(MyQueue* obj) {\n    \n}"
      }
    ]
  },
  {
    "title": "Implement Stack using Queues",
    "slug": "implement-stack-using-queues",
    "description": "Implement a last-in-first-out (LIFO) stack using only two queues. The implemented stack should support all functions of a normal stack (`push`, `top`, `pop`, and `empty`).",
    "difficulty": "Easy",
    "category": "Queues",
    "constraints": [
      "1 <= x <= 9",
      "At most 100 calls will be made to push, pop, top, and empty."
    ],
    "examples": [
      {
        "input": "[\"MyStack\",\"push\",\"push\",\"top\",\"pop\",\"empty\"]\n[[],[1],[2],[],[],[]]",
        "output": "[null,null,null,2,2,false]"
      }
    ],
    "testCases": [
      {
        "input": "[\"MyStack\",\"push\",\"push\",\"top\",\"pop\",\"empty\"]\n[[],[1],[2],[],[],[]]",
        "output": "[null,null,null,2,2,false]",
        "isHidden": false
      },
      {
        "input": "[\"MyStack\",\"push\",\"empty\"]\n[[],[3],[]]",
        "output": "[null,null,false]",
        "isHidden": true
      }
    ],
    "tags": [
      "Stack",
      "Design",
      "Queue"
    ],
    "companyTags": [
      "Bloomberg",
      "Amazon"
    ],
    "acceptanceRate": 62.1,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function MyStack() {\n    // Write your code here\n    \n}"
      },
      {
        "language": "python",
        "code": "def MyStack():\n    # Write your code here\n    pass\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public void MyStack() {\n        // Write your code here\n        \n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    void MyStack() {\n        // Write your code here\n        \n    }\n};"
      },
      {
        "language": "c",
        "code": "typedef struct {\n    \n} MyStack;\n\nMyStack* myStackCreate() {\n    return NULL;\n}\nvoid myStackPush(MyStack* obj, int x) {\n    \n}\nint myStackPop(MyStack* obj) {\n    return 0;\n}\nint myStackTop(MyStack* obj) {\n    return 0;\n}\nbool myStackEmpty(MyStack* obj) {\n    return true;\n}\nvoid myStackFree(MyStack* obj) {\n    \n}"
      }
    ]
  },
  {
    "title": "Number of Recent Calls",
    "slug": "number-of-recent-calls",
    "description": "You have a `RecentCounter` class which counts the number of recent requests within a certain time frame. It returns the number of pings in the last 3000 milliseconds.",
    "difficulty": "Easy",
    "category": "Queues",
    "constraints": [
      "1 <= t <= 10^9",
      "Each ping call has strictly increasing values of t."
    ],
    "examples": [
      {
        "input": "[\"RecentCounter\",\"ping\",\"ping\",\"ping\",\"ping\"]\n[[],[1],[100],[3001],[3002]]",
        "output": "[null,1,2,3,3]"
      }
    ],
    "testCases": [
      {
        "input": "[\"RecentCounter\",\"ping\",\"ping\",\"ping\",\"ping\"]\n[[],[1],[100],[3001],[3002]]",
        "output": "[null,1,2,3,3]",
        "isHidden": false
      },
      {
        "input": "[\"RecentCounter\",\"ping\"]\n[[],[10]]",
        "output": "[null,1]",
        "isHidden": true
      }
    ],
    "tags": [
      "Design",
      "Queue",
      "Data Stream"
    ],
    "companyTags": [
      "Google",
      "Uber",
      "Facebook"
    ],
    "acceptanceRate": 74.2,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function RecentCounter() {\n    // Write your code here\n    \n}"
      },
      {
        "language": "python",
        "code": "def RecentCounter():\n    # Write your code here\n    pass\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public void RecentCounter() {\n        // Write your code here\n        \n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    void RecentCounter() {\n        // Write your code here\n        \n    }\n};"
      },
      {
        "language": "c",
        "code": "typedef struct {\n    \n} RecentCounter;\n\nRecentCounter* recentCounterCreate() {\n    return NULL;\n}\nint recentCounterPing(RecentCounter* obj, int t) {\n    return 0;\n}\nvoid recentCounterFree(RecentCounter* obj) {\n    \n}"
      }
    ]
  },
  {
    "title": "Same Tree",
    "slug": "same-tree",
    "description": "Given the roots of two binary trees `p` and `q`, write a function to check if they are the same or not.\n\nTwo binary trees are considered the same if they are structurally identical, and the nodes have the same value.",
    "difficulty": "Easy",
    "category": "Trees",
    "constraints": [
      "The number of nodes in both trees is in the range [0, 100].",
      "-10^4 <= Node.val <= 10^4"
    ],
    "examples": [
      {
        "input": "p = [1,2,3], q = [1,2,3]",
        "output": "true"
      }
    ],
    "testCases": [
      {
        "input": "[1,2,3]\n[1,2,3]",
        "output": "true",
        "isHidden": false
      },
      {
        "input": "[1,2]\n[1,null,2]",
        "output": "false",
        "isHidden": false
      },
      {
        "input": "[1,2,1]\n[1,1,2]",
        "output": "false",
        "isHidden": true
      }
    ],
    "tags": [
      "Tree",
      "Depth-First Search",
      "Breadth-First Search",
      "Binary Tree"
    ],
    "companyTags": [
      "Bloomberg",
      "Tesla",
      "Tencent"
    ],
    "acceptanceRate": 60.1,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function isSameTree(p, q) {\n    // Write your code here\n    return false;\n}"
      },
      {
        "language": "python",
        "code": "def isSameTree(p, q):\n    # Write your code here\n    return False\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public boolean isSameTree(TreeNode p, TreeNode q) {\n        // Write your code here\n        return false;\n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool isSameTree(TreeNode* p, TreeNode* q) {\n        // Write your code here\n        return false;\n    }\n};"
      },
      {
        "language": "c",
        "code": "bool isSameTree(struct TreeNode* p, struct TreeNode* q) {\n    // Write your code here\n    return false;\n}"
      }
    ]
  },
  {
    "title": "Invert Binary Tree",
    "slug": "invert-binary-tree",
    "description": "Given the root of a binary tree, invert the tree, and return its root.",
    "difficulty": "Easy",
    "category": "Trees",
    "constraints": [
      "The number of nodes in the tree is in the range [0, 100].",
      "-100 <= Node.val <= 100"
    ],
    "examples": [
      {
        "input": "root = [4,2,7,1,3,6,9]",
        "output": "[4,7,2,9,6,3,1]"
      }
    ],
    "testCases": [
      {
        "input": "[4,2,7,1,3,6,9]",
        "output": "[4,7,2,9,6,3,1]",
        "isHidden": false
      },
      {
        "input": "[2,1,3]",
        "output": "[2,3,1]",
        "isHidden": false
      },
      {
        "input": "[]",
        "output": "[]",
        "isHidden": true
      }
    ],
    "tags": [
      "Tree",
      "Depth-First Search",
      "Breadth-First Search",
      "Binary Tree"
    ],
    "companyTags": [
      "Google",
      "Facebook",
      "Microsoft"
    ],
    "acceptanceRate": 76.2,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function invertTree(root) {\n    // Write your code here\n    return null;\n}"
      },
      {
        "language": "python",
        "code": "def invertTree(root):\n    # Write your code here\n    return None\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public TreeNode invertTree(TreeNode root) {\n        // Write your code here\n        return null;\n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    TreeNode* invertTree(TreeNode* root) {\n        // Write your code here\n        return nullptr;\n    }\n};"
      },
      {
        "language": "c",
        "code": "struct TreeNode* invertTree(struct TreeNode* root) {\n    // Write your code here\n    return NULL;\n}"
      }
    ]
  },
  {
    "title": "Maximum Depth of Binary Tree",
    "slug": "maximum-depth-of-binary-tree",
    "description": "Given the root of a binary tree, return its maximum depth.\n\nA binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.",
    "difficulty": "Easy",
    "category": "Trees",
    "constraints": [
      "The number of nodes in the tree is in the range [0, 10^4].",
      "-100 <= Node.val <= 100"
    ],
    "examples": [
      {
        "input": "root = [3,9,20,null,null,15,7]",
        "output": "3"
      }
    ],
    "testCases": [
      {
        "input": "[3,9,20,null,null,15,7]",
        "output": "3",
        "isHidden": false
      },
      {
        "input": "[1,null,2]",
        "output": "2",
        "isHidden": false
      },
      {
        "input": "[]",
        "output": "0",
        "isHidden": true
      }
    ],
    "tags": [
      "Tree",
      "Depth-First Search",
      "Breadth-First Search",
      "Binary Tree"
    ],
    "companyTags": [
      "LinkedIn",
      "Uber",
      "eBay"
    ],
    "acceptanceRate": 74.5,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function maxDepth(root) {\n    // Write your code here\n    return 0;\n}"
      },
      {
        "language": "python",
        "code": "def maxDepth(root):\n    # Write your code here\n    return 0\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public int maxDepth(TreeNode root) {\n        // Write your code here\n        return 0;\n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    int maxDepth(TreeNode* root) {\n        // Write your code here\n        return 0;\n    }\n};"
      },
      {
        "language": "c",
        "code": "int maxDepth(struct TreeNode* root) {\n    // Write your code here\n    return 0;\n}"
      }
    ]
  },
  {
    "title": "Diameter of Binary Tree",
    "slug": "diameter-of-binary-tree",
    "description": "Given the root of a binary tree, return the length of the diameter of the tree.\n\nThe diameter of a binary tree is the length of the longest path between any two nodes in a tree. This path may or may not pass through the root.",
    "difficulty": "Easy",
    "category": "Binary Trees",
    "constraints": [
      "The number of nodes in the tree is in the range [1, 10^4].",
      "-100 <= Node.val <= 100"
    ],
    "examples": [
      {
        "input": "root = [1,2,3,4,5]",
        "output": "3",
        "explanation": "3 is the length of the path [4,2,1,3] or [5,2,1,3]."
      }
    ],
    "testCases": [
      {
        "input": "[1,2,3,4,5]",
        "output": "3",
        "isHidden": false
      },
      {
        "input": "[1,2]",
        "output": "1",
        "isHidden": false
      }
    ],
    "tags": [
      "Tree",
      "Depth-First Search",
      "Binary Tree"
    ],
    "companyTags": [
      "Meta",
      "Amazon",
      "Microsoft"
    ],
    "acceptanceRate": 67.8,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function diameterOfBinaryTree(root) {\n    // Write your code here\n    return 0;\n}"
      },
      {
        "language": "python",
        "code": "def diameterOfBinaryTree(root):\n    # Write your code here\n    return 0\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public int diameterOfBinaryTree(TreeNode root) {\n        // Write your code here\n        return 0;\n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    int diameterOfBinaryTree(TreeNode* root) {\n        // Write your code here\n        return 0;\n    }\n};"
      },
      {
        "language": "c",
        "code": "int diameterOfBinaryTree(struct TreeNode* root) {\n    // Write your code here\n    return 0;\n}"
      }
    ]
  },
  {
    "title": "Binary Tree Inorder Traversal",
    "slug": "binary-tree-inorder-traversal",
    "description": "Given the root of a binary tree, return the inorder traversal of its nodes' values.",
    "difficulty": "Easy",
    "category": "Binary Trees",
    "constraints": [
      "The number of nodes in the tree is in the range [0, 100].",
      "-100 <= Node.val <= 100"
    ],
    "examples": [
      {
        "input": "root = [1,null,2,3]",
        "output": "[1,3,2]"
      }
    ],
    "testCases": [
      {
        "input": "[1,null,2,3]",
        "output": "[1,3,2]",
        "isHidden": false
      },
      {
        "input": "[]",
        "output": "[]",
        "isHidden": false
      }
    ],
    "tags": [
      "Tree",
      "Stack",
      "Depth-First Search",
      "Binary Tree"
    ],
    "companyTags": [
      "Adobe",
      "Amazon",
      "Google"
    ],
    "acceptanceRate": 74.3,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function inorderTraversal(root) {\n    // Write your code here\n    return [];\n}"
      },
      {
        "language": "python",
        "code": "def inorderTraversal(root):\n    # Write your code here\n    return []\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public int[] inorderTraversal(TreeNode root) {\n        // Write your code here\n        return new int[0];\n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> inorderTraversal(TreeNode* root) {\n        // Write your code here\n        return {};\n    }\n};"
      },
      {
        "language": "c",
        "code": "int* inorderTraversal(struct TreeNode* root, int* returnSize) {\n    // Write your code here\n    *returnSize = 0;\n    return NULL;\n}"
      }
    ]
  },
  {
    "title": "Search in a Binary Search Tree",
    "slug": "search-in-a-binary-search-tree",
    "description": "You are given the root of a binary search tree (BST) and an integer `val`. Find the node in the BST that the node's value equals `val` and return the subtree rooted with that node. If such a node does not exist, return `null`.",
    "difficulty": "Easy",
    "category": "Binary Search Trees",
    "constraints": [
      "The number of nodes in the tree is in the range [1, 5000].",
      "1 <= Node.val <= 10^7",
      "val is an integer."
    ],
    "examples": [
      {
        "input": "root = [4,2,7,1,3], val = 2",
        "output": "[2,1,3]"
      }
    ],
    "testCases": [
      {
        "input": "[4,2,7,1,3]\n2",
        "output": "[2,1,3]",
        "isHidden": false
      },
      {
        "input": "[4,2,7,1,3]\n5",
        "output": "[]",
        "isHidden": false
      }
    ],
    "tags": [
      "Tree",
      "Binary Search Tree",
      "Binary Tree"
    ],
    "companyTags": [
      "Amazon",
      "Google",
      "LinkedIn"
    ],
    "acceptanceRate": 79.1,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function searchBST(root, val) {\n    // Write your code here\n    return null;\n}"
      },
      {
        "language": "python",
        "code": "def searchBST(root, val):\n    # Write your code here\n    return None\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public TreeNode searchBST(TreeNode root, int val) {\n        // Write your code here\n        return null;\n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    TreeNode* searchBST(TreeNode* root, int val) {\n        // Write your code here\n        return nullptr;\n    }\n};"
      },
      {
        "language": "c",
        "code": "struct TreeNode* searchBST(struct TreeNode* root, int val) {\n    // Write your code here\n    return NULL;\n}"
      }
    ]
  },
  {
    "title": "Flood Fill",
    "slug": "flood-fill",
    "description": "An image is represented by an `m x n` integer grid `image` where `image[i][j]` represents the pixel value of the image.\n\nYou are also given three integers `sr`, `sc`, and `color`. You should perform a flood fill on the image starting from the pixel `image[sr][sc]`.\n\nReturn the modified image after performing the flood fill.",
    "difficulty": "Easy",
    "category": "Graphs",
    "constraints": [
      "m == image.length",
      "n == image[i].length",
      "1 <= m, n <= 50",
      "0 <= image[i][j], color < 2^16",
      "0 <= sr < m",
      "0 <= sc < n"
    ],
    "examples": [
      {
        "input": "image = [[1,1,1],[1,1,0],[1,0,1]], sr = 1, sc = 1, color = 2",
        "output": "[[2,2,2],[2,2,0],[2,0,1]]"
      }
    ],
    "testCases": [
      {
        "input": "[[1,1,1],[1,1,0],[1,0,1]]\n1\n1\n2",
        "output": "[[2,2,2],[2,2,0],[2,0,1]]",
        "isHidden": false
      },
      {
        "input": "[[0,0,0],[0,0,0]]\n0\n0\n0",
        "output": "[[0,0,0],[0,0,0]]",
        "isHidden": false
      },
      {
        "input": "[[1,1,1],[1,1,0],[1,0,1]]\n1\n1\n0",
        "output": "[[1,1,1],[1,1,0],[1,0,1]]",
        "isHidden": true
      }
    ],
    "tags": [
      "Array",
      "Depth-First Search",
      "Breadth-First Search",
      "Matrix"
    ],
    "companyTags": [
      "Uber",
      "Google",
      "Amazon"
    ],
    "acceptanceRate": 63.1,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function floodFill(image, sr, sc, color) {\n    // Write your code here\n    return null;\n}"
      },
      {
        "language": "python",
        "code": "def floodFill(image, sr, sc, color):\n    # Write your code here\n    return None\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public void floodFill(int[][] image, int sr, int sc, int color) {\n        // Write your code here\n        \n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    void floodFill(vector<vector<int>>& image, int sr, int sc, int color) {\n        // Write your code here\n        \n    }\n};"
      },
      {
        "language": "c",
        "code": "int** floodFill(int** image, int imageSize, int* imageColSize, int sr, int sc, int color, int* returnSize, int** returnColumnSizes) {\n    // Write your code here\n    return image;\n}"
      }
    ]
  },
  {
    "title": "Find if Path Exists in Graph",
    "slug": "find-if-path-exists-in-graph",
    "description": "There is a bi-directional graph with `n` vertices, where each vertex is labeled from `0` to `n - 1`. Given the edges and source, destination, return `true` if there is a valid path from source to destination.",
    "difficulty": "Easy",
    "category": "Graphs",
    "constraints": [
      "1 <= n <= 2 * 10^5",
      "0 <= edges.length <= 2 * 10^5",
      "source != destination"
    ],
    "examples": [
      {
        "input": "n = 3, edges = [[0,1],[1,2],[2,0]], source = 0, destination = 2",
        "output": "true"
      }
    ],
    "testCases": [
      {
        "input": "3\n[[0,1],[1,2],[2,0]]\n0\n2",
        "output": "true",
        "isHidden": false
      },
      {
        "input": "6\n[[0,1],[0,2],[3,5],[5,4],[4,3]]\n0\n5",
        "output": "false",
        "isHidden": false
      }
    ],
    "tags": [
      "Graph",
      "Depth-First Search",
      "Breadth-First Search",
      "Union Find"
    ],
    "companyTags": [
      "Microsoft",
      "Meta",
      "Amazon"
    ],
    "acceptanceRate": 52.4,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function validPath(n, edges, source, destination) {\n    // Write your code here\n    return false;\n}"
      },
      {
        "language": "python",
        "code": "def validPath(n, edges, source, destination):\n    # Write your code here\n    return False\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public boolean validPath(int n, int[][] edges, int source, int destination) {\n        // Write your code here\n        return false;\n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool validPath(int n, vector<vector<int>>& edges, int source, int destination) {\n        // Write your code here\n        return false;\n    }\n};"
      },
      {
        "language": "c",
        "code": "bool validPath(int n, int** edges, int edgesSize, int* edgesColSize, int source, int destination) {\n    return false;\n}"
      }
    ]
  },
  {
    "title": "Climbing Stairs",
    "slug": "climbing-stairs",
    "description": "You are climbing a staircase. It takes `n` steps to reach the top.\n\nEach time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    "difficulty": "Easy",
    "category": "Dynamic Programming",
    "constraints": [
      "1 <= n <= 45"
    ],
    "examples": [
      {
        "input": "n = 2",
        "output": "2",
        "explanation": "There are two ways to climb to the top: 1 step + 1 step, or 2 steps."
      }
    ],
    "testCases": [
      {
        "input": "2",
        "output": "2",
        "isHidden": false
      },
      {
        "input": "3",
        "output": "3",
        "isHidden": false
      },
      {
        "input": "5",
        "output": "8",
        "isHidden": true
      }
    ],
    "tags": [
      "Math",
      "Dynamic Programming",
      "Memoization"
    ],
    "companyTags": [
      "Adobe",
      "Apple",
      "Goldman Sachs"
    ],
    "acceptanceRate": 52.4,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function climbStairs(n) {\n    // Write your code here\n    return 0;\n}"
      },
      {
        "language": "python",
        "code": "def climbStairs(n):\n    # Write your code here\n    return 0\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public int climbStairs(int n) {\n        // Write your code here\n        return 0;\n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    int climbStairs(int n) {\n        // Write your code here\n        return 0;\n    }\n};"
      },
      {
        "language": "c",
        "code": "int climbStairs(int n) {\n    // Write your code here\n    return 0;\n}"
      }
    ]
  },
  {
    "title": "Min Cost Climbing Stairs",
    "slug": "min-cost-climbing-stairs",
    "description": "You are given an integer array `cost` where `cost[i]` is the cost of `i`th step on a staircase. Once you pay the cost, you can either climb one or two steps. Return the minimum cost to reach the top.",
    "difficulty": "Easy",
    "category": "Dynamic Programming",
    "constraints": [
      "2 <= cost.length <= 1000",
      "0 <= cost[i] <= 999"
    ],
    "examples": [
      {
        "input": "cost = [10,15,20]",
        "output": "15"
      }
    ],
    "testCases": [
      {
        "input": "[10,15,20]",
        "output": "15",
        "isHidden": false
      },
      {
        "input": "[1,100,1,1,1,100,1,1,100,1]",
        "output": "6",
        "isHidden": false
      }
    ],
    "tags": [
      "Array",
      "Dynamic Programming"
    ],
    "companyTags": [
      "Amazon",
      "Google",
      "Microsoft"
    ],
    "acceptanceRate": 64.9,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function minCostClimbingStairs(cost) {\n    // Write your code here\n    return 0;\n}"
      },
      {
        "language": "python",
        "code": "def minCostClimbingStairs(cost):\n    # Write your code here\n    return 0\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public int minCostClimbingStairs(int[] cost) {\n        // Write your code here\n        return 0;\n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    int minCostClimbingStairs(vector<int>& cost) {\n        // Write your code here\n        return 0;\n    }\n};"
      },
      {
        "language": "c",
        "code": "int minCostClimbingStairs(int* cost, int costSize) {\n    // Write your code here\n    return 0;\n}"
      }
    ]
  },
  {
    "title": "Assign Cookies",
    "slug": "assign-cookies",
    "description": "Assume you are an awesome parent and want to give your children some cookies. But, you should give each child at most one cookie.\n\nEach child `i` has a greed factor `g[i]`, which is the minimum size of a cookie that the child will be content with; and each cookie `j` has a size `s[j]`. If `s[j] >= g[i]`, we can assign the cookie `j` to the child `i`, and the child `i` will be content. Your goal is to maximize the number of your content children and output the maximum number.",
    "difficulty": "Easy",
    "category": "Greedy Algorithms",
    "constraints": [
      "1 <= g.length, s.length <= 3 * 10^4",
      "1 <= g[i], s[j] <= 2^31 - 1"
    ],
    "examples": [
      {
        "input": "g = [1,2,3], s = [1,1]",
        "output": "1"
      }
    ],
    "testCases": [
      {
        "input": "[1,2,3]\n[1,1]",
        "output": "1",
        "isHidden": false
      },
      {
        "input": "[1,2]\n[1,2,3]",
        "output": "2",
        "isHidden": false
      },
      {
        "input": "[1,2,3]\n[]",
        "output": "0",
        "isHidden": true
      }
    ],
    "tags": [
      "Array",
      "Two Pointers",
      "Greedy",
      "Sorting"
    ],
    "companyTags": [
      "Bloomberg",
      "Amazon"
    ],
    "acceptanceRate": 51.2,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function findContentChildren(g, s) {\n    // Write your code here\n    return 0;\n}"
      },
      {
        "language": "python",
        "code": "def findContentChildren(g, s):\n    # Write your code here\n    return 0\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public int findContentChildren(int[] g, int[] s) {\n        // Write your code here\n        return 0;\n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    int findContentChildren(vector<int>& g, vector<int>& s) {\n        // Write your code here\n        return 0;\n    }\n};"
      },
      {
        "language": "c",
        "code": "int findContentChildren(int* g, int gSize, int* s, int sSize) {\n    // Write your code here\n    return 0;\n}"
      }
    ]
  },
  {
    "title": "Lemonade Change",
    "slug": "lemonade-change",
    "description": "At a lemonade stand, each lemonade costs `$5`. Customers pay with either a `$5`, `$10`, or `$20` bill. You must provide the correct change to each customer. Return `true` if you can provide every customer with correct change, otherwise `false`.",
    "difficulty": "Easy",
    "category": "Greedy Algorithms",
    "constraints": [
      "1 <= bills.length <= 10^5",
      "bills[i] is either 5, 10, or 20."
    ],
    "examples": [
      {
        "input": "bills = [5,5,5,10,20]",
        "output": "true"
      }
    ],
    "testCases": [
      {
        "input": "[5,5,5,10,20]",
        "output": "true",
        "isHidden": false
      },
      {
        "input": "[5,5,10,10,20]",
        "output": "false",
        "isHidden": false
      }
    ],
    "tags": [
      "Array",
      "Greedy"
    ],
    "companyTags": [
      "Google",
      "Amazon"
    ],
    "acceptanceRate": 53.6,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function lemonadeChange(bills) {\n    // Write your code here\n    return false;\n}"
      },
      {
        "language": "python",
        "code": "def lemonadeChange(bills):\n    # Write your code here\n    return False\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public boolean lemonadeChange(int[] bills) {\n        // Write your code here\n        return false;\n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool lemonadeChange(vector<int>& bills) {\n        // Write your code here\n        return false;\n    }\n};"
      },
      {
        "language": "c",
        "code": "bool lemonadeChange(int* bills, int billsSize) {\n    // Write your code here\n    return false;\n}"
      }
    ]
  },
  {
    "title": "Binary Search",
    "slug": "binary-search",
    "description": "Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, then return its index. Otherwise, return `-1`.\n\nYou must write an algorithm with `O(log n)` runtime complexity.",
    "difficulty": "Easy",
    "category": "Binary Search",
    "constraints": [
      "1 <= nums.length <= 10^4",
      "-10^4 < nums[i], target < 10^4",
      "All the integers in nums are unique.",
      "nums is sorted in ascending order."
    ],
    "examples": [
      {
        "input": "nums = [-1,0,3,5,9,12], target = 9",
        "output": "4"
      }
    ],
    "testCases": [
      {
        "input": "[-1,0,3,5,9,12]\n9",
        "output": "4",
        "isHidden": false
      },
      {
        "input": "[-1,0,3,5,9,12]\n2",
        "output": "-1",
        "isHidden": false
      },
      {
        "input": "[5]\n5",
        "output": "0",
        "isHidden": true
      }
    ],
    "tags": [
      "Array",
      "Binary Search"
    ],
    "companyTags": [
      "Google",
      "Apple",
      "Microsoft"
    ],
    "acceptanceRate": 56.7,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function search(nums, target) {\n    // Write your code here\n    return 0;\n}"
      },
      {
        "language": "python",
        "code": "def search(nums, target):\n    # Write your code here\n    return 0\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public int search(int[] nums, int target) {\n        // Write your code here\n        return 0;\n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        // Write your code here\n        return 0;\n    }\n};"
      },
      {
        "language": "c",
        "code": "int search(int* nums, int numsSize, int target) {\n    // Write your code here\n    return 0;\n}"
      }
    ]
  },
  {
    "title": "First Bad Version",
    "slug": "first-bad-version",
    "description": "Suppose you have `n` versions `[1, 2, ..., n]` and you want to find out the first bad one, which causes all the following ones to be bad. You are given an API `bool isBadVersion(version)` which returns whether `version` is bad. Implement a function to find the first bad version.",
    "difficulty": "Easy",
    "category": "Binary Search",
    "constraints": [
      "1 <= bad <= n <= 2^31 - 1"
    ],
    "examples": [
      {
        "input": "n = 5, bad = 4",
        "output": "4"
      }
    ],
    "testCases": [
      {
        "input": "5\n4",
        "output": "4",
        "isHidden": false
      },
      {
        "input": "1\n1",
        "output": "1",
        "isHidden": false
      }
    ],
    "tags": [
      "Binary Search",
      "Interactive"
    ],
    "companyTags": [
      "Google",
      "Facebook",
      "Microsoft"
    ],
    "acceptanceRate": 43.6,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function firstBadVersion(n) {\n    // Write your code here\n    return 0;\n}"
      },
      {
        "language": "python",
        "code": "def firstBadVersion(n):\n    # Write your code here\n    return 0\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public int firstBadVersion(int n) {\n        // Write your code here\n        return 0;\n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    int firstBadVersion(int n) {\n        // Write your code here\n        return 0;\n    }\n};"
      },
      {
        "language": "c",
        "code": "int firstBadVersion(int n) {\n    return 1;\n}"
      }
    ]
  },
  {
    "title": "Two Sum II - Input Array Is Sorted",
    "slug": "two-sum-ii-input-array-is-sorted",
    "description": "Given a 1-indexed array of integers `numbers` that is already sorted in non-decreasing order, find two numbers such that they add up to a specific `target` number. Return indices as a 1-based array of size 2.",
    "difficulty": "Easy",
    "category": "Two Pointers",
    "constraints": [
      "2 <= numbers.length <= 3 * 10^4",
      "-1000 <= numbers[i] <= 1000",
      "-1000 <= target <= 1000"
    ],
    "examples": [
      {
        "input": "numbers = [2,7,11,15], target = 9",
        "output": "[1,2]"
      }
    ],
    "testCases": [
      {
        "input": "[2,7,11,15]\n9",
        "output": "[1,2]",
        "isHidden": false
      },
      {
        "input": "[2,3,4]\n6",
        "output": "[1,3]",
        "isHidden": false
      }
    ],
    "tags": [
      "Array",
      "Two Pointers",
      "Binary Search"
    ],
    "companyTags": [
      "Amazon",
      "Meta",
      "Google"
    ],
    "acceptanceRate": 60.1,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function twoSum(numbers, target) {\n    // Write your code here\n    return [];\n}"
      },
      {
        "language": "python",
        "code": "def twoSum(numbers, target):\n    # Write your code here\n    return []\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public int[] twoSum(int[] numbers, int target) {\n        // Write your code here\n        return new int[0];\n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& numbers, int target) {\n        // Write your code here\n        return {};\n    }\n};"
      },
      {
        "language": "c",
        "code": "int* twoSum(int* numbers, int numbersSize, int target, int* returnSize) {\n    // Write your code here\n    *returnSize = 0;\n    return NULL;\n}"
      }
    ]
  },
  {
    "title": "Valid Palindrome",
    "slug": "valid-palindrome",
    "description": "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Return true if valid.",
    "difficulty": "Easy",
    "category": "Two Pointers",
    "constraints": [
      "1 <= s.length <= 2 * 10^5",
      "s consists only of printable ASCII characters."
    ],
    "examples": [
      {
        "input": "s = \"A man, a plan, a canal: Panama\"",
        "output": "true"
      }
    ],
    "testCases": [
      {
        "input": "\"A man, a plan, a canal: Panama\"",
        "output": "true",
        "isHidden": false
      },
      {
        "input": "\"race a car\"",
        "output": "false",
        "isHidden": false
      }
    ],
    "tags": [
      "Two Pointers",
      "String"
    ],
    "companyTags": [
      "Microsoft",
      "Facebook",
      "Apple"
    ],
    "acceptanceRate": 46.5,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function isPalindrome(s) {\n    // Write your code here\n    return false;\n}"
      },
      {
        "language": "python",
        "code": "def isPalindrome(s):\n    # Write your code here\n    return False\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public boolean isPalindrome(String s) {\n        // Write your code here\n        return false;\n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool isPalindrome(string s) {\n        // Write your code here\n        return false;\n    }\n};"
      },
      {
        "language": "c",
        "code": "bool isPalindrome(char* s) {\n    // Write your code here\n    return false;\n}"
      }
    ]
  },
  {
    "title": "Move Zeroes",
    "slug": "move-zeroes",
    "description": "Given an integer array `nums`, move all `0`'s to the end of it while maintaining the relative order of the non-zero elements. You must do this in-place.",
    "difficulty": "Easy",
    "category": "Two Pointers",
    "constraints": [
      "1 <= nums.length <= 10^4",
      "-2^31 <= nums[i] <= 2^31 - 1"
    ],
    "examples": [
      {
        "input": "nums = [0,1,0,3,12]",
        "output": "[1,3,12,0,0]"
      }
    ],
    "testCases": [
      {
        "input": "[0,1,0,3,12]",
        "output": "[1,3,12,0,0]",
        "isHidden": false
      },
      {
        "input": "[0]",
        "output": "[0]",
        "isHidden": false
      }
    ],
    "tags": [
      "Array",
      "Two Pointers"
    ],
    "companyTags": [
      "Facebook",
      "Microsoft",
      "Amazon"
    ],
    "acceptanceRate": 61.4,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function moveZeroes(nums) {\n    // Write your code here\n    \n}"
      },
      {
        "language": "python",
        "code": "def moveZeroes(nums):\n    # Write your code here\n    pass\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public void moveZeroes(int[] nums) {\n        // Write your code here\n        \n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    void moveZeroes(vector<int>& nums) {\n        // Write your code here\n        \n    }\n};"
      },
      {
        "language": "c",
        "code": "void moveZeroes(int* nums, int numsSize) {\n    // Write your code here\n    \n}"
      }
    ]
  },
  {
    "title": "Range Sum Query - Immutable",
    "slug": "range-sum-query-immutable",
    "description": "Given an integer array `nums`, handle multiple queries of the sum of the elements between indices `left` and `right` inclusive.",
    "difficulty": "Easy",
    "category": "Prefix Sum",
    "constraints": [
      "1 <= nums.length <= 10^4",
      "-10^5 <= nums[i] <= 10^5"
    ],
    "examples": [
      {
        "input": "[\"NumArray\",\"sumRange\",\"sumRange\",\"sumRange\"]\n[[[-2,0,3,-5,2,-1]],[0,2],[2,5],[0,5]]",
        "output": "[null,1,-1,-3]"
      }
    ],
    "testCases": [
      {
        "input": "[\"NumArray\",\"sumRange\",\"sumRange\",\"sumRange\"]\n[[[-2,0,3,-5,2,-1]],[0,2],[2,5],[0,5]]",
        "output": "[null,1,-1,-3]",
        "isHidden": false
      }
    ],
    "tags": [
      "Array",
      "Design",
      "Prefix Sum"
    ],
    "companyTags": [
      "Facebook",
      "Google"
    ],
    "acceptanceRate": 62.8,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function NumArray() {\n    // Write your code here\n    \n}"
      },
      {
        "language": "python",
        "code": "def NumArray():\n    # Write your code here\n    pass\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public void NumArray() {\n        // Write your code here\n        \n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    void NumArray() {\n        // Write your code here\n        \n    }\n};"
      },
      {
        "language": "c",
        "code": "typedef struct {\n    \n} NumArray;\n\nNumArray* numArrayCreate(int* nums, int numsSize) {\n    return NULL;\n}\nint numArraySumRange(NumArray* obj, int left, int right) {\n    return 0;\n}\nvoid numArrayFree(NumArray* obj) {\n    \n}"
      }
    ]
  },
  {
    "title": "Find Pivot Index",
    "slug": "find-pivot-index",
    "description": "Given an array of integers `nums`, calculate the pivot index of this array. The pivot index is the index where the sum of all the numbers strictly to the left of the index is equal to the sum of all the numbers strictly to the index's right.",
    "difficulty": "Easy",
    "category": "Prefix Sum",
    "constraints": [
      "1 <= nums.length <= 10^4",
      "-1000 <= nums[i] <= 1000"
    ],
    "examples": [
      {
        "input": "nums = [1,7,3,6,5,6]",
        "output": "3"
      }
    ],
    "testCases": [
      {
        "input": "[1,7,3,6,5,6]",
        "output": "3",
        "isHidden": false
      },
      {
        "input": "[1,2,3]",
        "output": "-1",
        "isHidden": false
      }
    ],
    "tags": [
      "Array",
      "Prefix Sum"
    ],
    "companyTags": [
      "Facebook",
      "Amazon",
      "Google"
    ],
    "acceptanceRate": 54.3,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function pivotIndex(nums) {\n    // Write your code here\n    return 0;\n}"
      },
      {
        "language": "python",
        "code": "def pivotIndex(nums):\n    # Write your code here\n    return 0\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public int pivotIndex(int[] nums) {\n        // Write your code here\n        return 0;\n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    int pivotIndex(vector<int>& nums) {\n        // Write your code here\n        return 0;\n    }\n};"
      },
      {
        "language": "c",
        "code": "int pivotIndex(int* nums, int numsSize) {\n    // Write your code here\n    return 0;\n}"
      }
    ]
  },
  {
    "title": "Number of 1 Bits",
    "slug": "number-of-1-bits",
    "description": "Write a function that takes the binary representation of an unsigned integer and returns the number of '1' bits it has (also known as the Hamming weight).",
    "difficulty": "Easy",
    "category": "Bit Manipulation",
    "constraints": [
      "The input must be a binary string of length 32"
    ],
    "examples": [
      {
        "input": "n = 11 (00000000000000000000000000001011)",
        "output": "3"
      }
    ],
    "testCases": [
      {
        "input": "11",
        "output": "3",
        "isHidden": false
      },
      {
        "input": "128",
        "output": "1",
        "isHidden": false
      }
    ],
    "tags": [
      "Divide and Conquer",
      "Bit Manipulation"
    ],
    "companyTags": [
      "Apple",
      "Microsoft",
      "Google"
    ],
    "acceptanceRate": 68.2,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function hammingWeight(n) {\n    // Write your code here\n    return 0;\n}"
      },
      {
        "language": "python",
        "code": "def hammingWeight(n):\n    # Write your code here\n    return 0\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public int hammingWeight(int n) {\n        // Write your code here\n        return 0;\n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    int hammingWeight(int n) {\n        // Write your code here\n        return 0;\n    }\n};"
      },
      {
        "language": "c",
        "code": "int hammingWeight(int n) {\n    // Write your code here\n    return 0;\n}"
      }
    ]
  },
  {
    "title": "Single Number",
    "slug": "single-number",
    "description": "Given a non-empty array of integers `nums`, every element appears twice except for one. Find that single one. You must implement a solution with a linear runtime complexity and use only constant extra space.",
    "difficulty": "Easy",
    "category": "Bit Manipulation",
    "constraints": [
      "1 <= nums.length <= 3 * 10^4",
      "-3 * 10^4 <= nums[i] <= 3 * 10^4"
    ],
    "examples": [
      {
        "input": "nums = [2,2,1]",
        "output": "1"
      }
    ],
    "testCases": [
      {
        "input": "[2,2,1]",
        "output": "1",
        "isHidden": false
      },
      {
        "input": "[4,1,2,1,2]",
        "output": "4",
        "isHidden": false
      }
    ],
    "tags": [
      "Array",
      "Bit Manipulation"
    ],
    "companyTags": [
      "Amazon",
      "Google",
      "Microsoft"
    ],
    "acceptanceRate": 72.8,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function singleNumber(nums) {\n    // Write your code here\n    return 0;\n}"
      },
      {
        "language": "python",
        "code": "def singleNumber(nums):\n    # Write your code here\n    return 0\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public int singleNumber(int[] nums) {\n        // Write your code here\n        return 0;\n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    int singleNumber(vector<int>& nums) {\n        // Write your code here\n        return 0;\n    }\n};"
      },
      {
        "language": "c",
        "code": "int singleNumber(int* nums, int numsSize) {\n    // Write your code here\n    return 0;\n}"
      }
    ]
  },
  {
    "title": "Majority Element",
    "slug": "majority-element",
    "description": "Given an array `nums` of size `n`, return the majority element. The majority element is the element that appears more than `⌊n / 2⌋` times. You may assume that the majority element always exists in the array.",
    "difficulty": "Easy",
    "category": "Divide and Conquer",
    "constraints": [
      "n == nums.length",
      "1 <= n <= 5 * 10^4",
      "-10^9 <= nums[i] <= 10^9"
    ],
    "examples": [
      {
        "input": "nums = [3,2,3]",
        "output": "3"
      }
    ],
    "testCases": [
      {
        "input": "[3,2,3]",
        "output": "3",
        "isHidden": false
      },
      {
        "input": "[2,2,1,1,1,2,2]",
        "output": "2",
        "isHidden": false
      }
    ],
    "tags": [
      "Array",
      "Hash Table",
      "Divide and Conquer",
      "Sorting"
    ],
    "companyTags": [
      "Amazon",
      "Microsoft",
      "Google"
    ],
    "acceptanceRate": 63.9,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function majorityElement(nums) {\n    // Write your code here\n    return 0;\n}"
      },
      {
        "language": "python",
        "code": "def majorityElement(nums):\n    # Write your code here\n    return 0\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public int majorityElement(int[] nums) {\n        // Write your code here\n        return 0;\n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    int majorityElement(vector<int>& nums) {\n        // Write your code here\n        return 0;\n    }\n};"
      },
      {
        "language": "c",
        "code": "int majorityElement(int* nums, int numsSize) {\n    // Write your code here\n    return 0;\n}"
      }
    ]
  },
  {
    "title": "Three Sum",
    "slug": "three-sum",
    "description": "Given an integer array `nums`, return all the triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, and `j != k`, and `nums[i] + nums[j] + nums[k] == 0`. The solution set must not contain duplicate triplets.",
    "difficulty": "Medium",
    "category": "Arrays",
    "constraints": [
      "3 <= nums.length <= 3000",
      "-10^5 <= nums[i] <= 10^5"
    ],
    "examples": [
      {
        "input": "nums = [-1,0,1,2,-1,-4]",
        "output": "[[-1,-1,2],[-1,0,1]]"
      }
    ],
    "testCases": [
      {
        "input": "[-1,0,1,2,-1,-4]",
        "output": "[[-1,-1,2],[-1,0,1]]",
        "isHidden": false
      },
      {
        "input": "[0,1,1]",
        "output": "[]",
        "isHidden": false
      }
    ],
    "tags": [
      "Array",
      "Two Pointers",
      "Sorting"
    ],
    "companyTags": [
      "Facebook",
      "Amazon",
      "Microsoft",
      "Google"
    ],
    "acceptanceRate": 43.5,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function threeSum(nums) {\n    // Write your code here\n    return null;\n}"
      },
      {
        "language": "python",
        "code": "def threeSum(nums):\n    # Write your code here\n    return None\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public List<List<Integer>> threeSum(int[] nums) {\n        // Write your code here\n        return new ArrayList<>();\n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<vector<int>> threeSum(vector<int>& nums) {\n        // Write your code here\n        return {};\n    }\n};"
      },
      {
        "language": "c",
        "code": "void threeSum(int* nums, int numsSize) {\n    // Write your code here\n    \n}"
      }
    ]
  },
  {
    "title": "Four Sum",
    "slug": "four-sum",
    "description": "Given an array `nums` of `n` integers, return an array of all the unique quadruplets `[nums[a], nums[b], nums[c], nums[d]]` such that they sum to a given `target`.",
    "difficulty": "Medium",
    "category": "Arrays",
    "constraints": [
      "1 <= nums.length <= 200",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9"
    ],
    "examples": [
      {
        "input": "nums = [1,0,-1,0,-2,2], target = 0",
        "output": "[[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]"
      }
    ],
    "testCases": [
      {
        "input": "[1,0,-1,0,-2,2]\n0",
        "output": "[[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]",
        "isHidden": false
      }
    ],
    "tags": [
      "Array",
      "Two Pointers",
      "Sorting"
    ],
    "companyTags": [
      "Amazon",
      "Apple"
    ],
    "acceptanceRate": 36.4,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function fourSum(nums, target) {\n    // Write your code here\n    return null;\n}"
      },
      {
        "language": "python",
        "code": "def fourSum(nums, target):\n    # Write your code here\n    return None\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public List<List<Integer>> fourSum(int[] nums, int target) {\n        // Write your code here\n        return new ArrayList<>();\n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<vector<int>> fourSum(vector<int>& nums, int target) {\n        // Write your code here\n        return {};\n    }\n};"
      },
      {
        "language": "c",
        "code": "void fourSum(int* nums, int numsSize, int target) {\n    // Write your code here\n    \n}"
      }
    ]
  },
  {
    "title": "Product of Array Except Self",
    "slug": "product-of-array-except-self",
    "description": "Given an integer array `nums`, return an array `answer` such that `answer[i]` is equal to the product of all the elements of `nums` except `nums[i]`. Solve in O(n) and without division.",
    "difficulty": "Medium",
    "category": "Arrays",
    "constraints": [
      "2 <= nums.length <= 10^5",
      "-30 <= nums[i] <= 30"
    ],
    "examples": [
      {
        "input": "nums = [1,2,3,4]",
        "output": "[24,12,8,6]"
      }
    ],
    "testCases": [
      {
        "input": "[1,2,3,4]",
        "output": "[24,12,8,6]",
        "isHidden": false
      },
      {
        "input": "[-1,1,0,-3,3]",
        "output": "[0,0,9,0,0]",
        "isHidden": false
      }
    ],
    "tags": [
      "Array",
      "Prefix Sum"
    ],
    "companyTags": [
      "Facebook",
      "Amazon",
      "Microsoft",
      "Apple"
    ],
    "acceptanceRate": 65.2,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function productExceptSelf(nums) {\n    // Write your code here\n    return [];\n}"
      },
      {
        "language": "python",
        "code": "def productExceptSelf(nums):\n    # Write your code here\n    return []\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public int[] productExceptSelf(int[] nums) {\n        // Write your code here\n        return new int[0];\n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> productExceptSelf(vector<int>& nums) {\n        // Write your code here\n        return {};\n    }\n};"
      },
      {
        "language": "c",
        "code": "int* productExceptSelf(int* nums, int numsSize, int* returnSize) {\n    // Write your code here\n    *returnSize = 0;\n    return NULL;\n}"
      }
    ]
  },
  {
    "title": "Rotate Array",
    "slug": "rotate-array",
    "description": "Given an integer array `nums`, rotate the array to the right by `k` steps, where `k` is non-negative.",
    "difficulty": "Medium",
    "category": "Arrays",
    "constraints": [
      "1 <= nums.length <= 10^5",
      "-2^31 <= nums[i] <= 2^31 - 1",
      "0 <= k <= 10^5"
    ],
    "examples": [
      {
        "input": "nums = [1,2,3,4,5,6,7], k = 3",
        "output": "[5,6,7,1,2,3,4]"
      }
    ],
    "testCases": [
      {
        "input": "[1,2,3,4,5,6,7]\n3",
        "output": "[5,6,7,1,2,3,4]",
        "isHidden": false
      },
      {
        "input": "[-1,-100,3,99]\n2",
        "output": "[3,99,-1,-100]",
        "isHidden": false
      }
    ],
    "tags": [
      "Array",
      "Two Pointers",
      "Recursion"
    ],
    "companyTags": [
      "Microsoft",
      "Amazon",
      "Google"
    ],
    "acceptanceRate": 39.8,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function rotate(nums, k) {\n    // Write your code here\n    \n}"
      },
      {
        "language": "python",
        "code": "def rotate(nums, k):\n    # Write your code here\n    pass\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public void rotate(int[] nums, int k) {\n        // Write your code here\n        \n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    void rotate(vector<int>& nums, int k) {\n        // Write your code here\n        \n    }\n};"
      },
      {
        "language": "c",
        "code": "void rotate(int* nums, int numsSize, int k) {\n    // Write your code here\n    \n}"
      }
    ]
  },
  {
    "title": "Merge Intervals",
    "slug": "merge-intervals",
    "description": "Given an array of `intervals` where `intervals[i] = [starti, endi]`, merge all overlapping intervals, and return an array of the non-overlapping intervals.",
    "difficulty": "Medium",
    "category": "Arrays",
    "constraints": [
      "1 <= intervals.length <= 10^4",
      "intervals[i].length == 2"
    ],
    "examples": [
      {
        "input": "intervals = [[1,3],[2,6],[8,10],[15,18]]",
        "output": "[[1,6],[8,10],[15,18]]"
      }
    ],
    "testCases": [
      {
        "input": "[[1,3],[2,6],[8,10],[15,18]]",
        "output": "[[1,6],[8,10],[15,18]]",
        "isHidden": false
      },
      {
        "input": "[[1,4],[4,5]]",
        "output": "[[1,5]]",
        "isHidden": false
      }
    ],
    "tags": [
      "Array",
      "Sorting"
    ],
    "companyTags": [
      "Google",
      "Amazon",
      "Facebook",
      "Microsoft"
    ],
    "acceptanceRate": 46.5,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function merge(intervals) {\n    // Write your code here\n    return null;\n}"
      },
      {
        "language": "python",
        "code": "def merge(intervals):\n    # Write your code here\n    return None\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public void merge(int[][] intervals) {\n        // Write your code here\n        \n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    void merge(vector<vector<int>>& intervals) {\n        // Write your code here\n        \n    }\n};"
      },
      {
        "language": "c",
        "code": "int** merge(int** intervals, int intervalsSize, int* intervalsColSize, int* returnSize, int** returnColumnSizes) {\n    return NULL;\n}"
      }
    ]
  },
  {
    "title": "Spiral Matrix",
    "slug": "spiral-matrix",
    "description": "Given an `m x n` matrix, return all elements of the matrix in spiral order.",
    "difficulty": "Medium",
    "category": "Arrays",
    "constraints": [
      "m == matrix.length",
      "n == matrix[i].length",
      "1 <= m, n <= 10"
    ],
    "examples": [
      {
        "input": "matrix = [[1,2,3],[4,5,6],[7,8,9]]",
        "output": "[1,2,3,6,9,8,7,4,5]"
      }
    ],
    "testCases": [
      {
        "input": "[[1,2,3],[4,5,6],[7,8,9]]",
        "output": "[1,2,3,6,9,8,7,4,5]",
        "isHidden": false
      }
    ],
    "tags": [
      "Array",
      "Matrix",
      "Simulation"
    ],
    "companyTags": [
      "Microsoft",
      "Google",
      "Amazon"
    ],
    "acceptanceRate": 47.9,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function spiralOrder(matrix) {\n    // Write your code here\n    return [];\n}"
      },
      {
        "language": "python",
        "code": "def spiralOrder(matrix):\n    # Write your code here\n    return []\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public int[] spiralOrder(int[][] matrix) {\n        // Write your code here\n        return new int[0];\n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> spiralOrder(vector<vector<int>>& matrix) {\n        // Write your code here\n        return {};\n    }\n};"
      },
      {
        "language": "c",
        "code": "int* spiralOrder(int matrix, int* returnSize) {\n    // Write your code here\n    *returnSize = 0;\n    return NULL;\n}"
      }
    ]
  },
  {
    "title": "String Compression",
    "slug": "string-compression",
    "description": "Given an array of characters `chars`, compress it using the following algorithm: Begin with an empty string `s`. For each group of consecutive repeating characters in `chars`...",
    "difficulty": "Medium",
    "category": "Strings",
    "constraints": [
      "1 <= chars.length <= 2000",
      "chars[i] is a lowercase English letter, uppercase English letter, digit, or symbol."
    ],
    "examples": [
      {
        "input": "chars = [\"a\",\"a\",\"b\",\"b\",\"c\",\"c\",\"c\"]",
        "output": "Return 6, and input array becomes [\"a\",\"2\",\"b\",\"2\",\"c\",\"3\"]"
      }
    ],
    "testCases": [
      {
        "input": "[\"a\",\"a\",\"b\",\"b\",\"c\",\"c\",\"c\"]",
        "output": "6",
        "isHidden": false
      }
    ],
    "tags": [
      "Two Pointers",
      "String"
    ],
    "companyTags": [
      "Amazon",
      "Microsoft",
      "Goldman Sachs"
    ],
    "acceptanceRate": 52.1,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function compress(chars) {\n    // Write your code here\n    return 0;\n}"
      },
      {
        "language": "python",
        "code": "def compress(chars):\n    # Write your code here\n    return 0\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public int compress(char[] chars) {\n        // Write your code here\n        return 0;\n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    int compress(vector<char>& chars) {\n        // Write your code here\n        return 0;\n    }\n};"
      },
      {
        "language": "c",
        "code": "int compress(char* chars, int charsSize) {\n    // Write your code here\n    return 0;\n}"
      }
    ]
  },
  {
    "title": "Longest Substring Without Repeating Characters",
    "slug": "longest-substring-without-repeating-characters",
    "description": "Given a string `s`, find the length of the longest substring without repeating characters.",
    "difficulty": "Medium",
    "category": "Strings",
    "constraints": [
      "0 <= s.length <= 5 * 10^4",
      "s consists of English letters, digits, symbols and spaces."
    ],
    "examples": [
      {
        "input": "s = \"abcabcbb\"",
        "output": "3",
        "explanation": "The answer is \"abc\", with the length of 3."
      }
    ],
    "testCases": [
      {
        "input": "\"abcabcbb\"",
        "output": "3",
        "isHidden": false
      },
      {
        "input": "\"bbbbb\"",
        "output": "1",
        "isHidden": false
      },
      {
        "input": "\"pwwkew\"",
        "output": "3",
        "isHidden": true
      }
    ],
    "tags": [
      "Hash Table",
      "String",
      "Sliding Window"
    ],
    "companyTags": [
      "Google",
      "Amazon",
      "Meta",
      "Bloomberg"
    ],
    "acceptanceRate": 34.1,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function lengthOfLongestSubstring(s) {\n    // Write your code here\n    return 0;\n}"
      },
      {
        "language": "python",
        "code": "def lengthOfLongestSubstring(s):\n    # Write your code here\n    return 0\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public int lengthOfLongestSubstring(String s) {\n        // Write your code here\n        return 0;\n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        // Write your code here\n        return 0;\n    }\n};"
      },
      {
        "language": "c",
        "code": "int lengthOfLongestSubstring(char* s) {\n    // Write your code here\n    return 0;\n}"
      }
    ]
  },
  {
    "title": "Longest Palindromic Substring",
    "slug": "longest-palindromic-substring",
    "description": "Given a string `s`, return the longest palindromic substring in `s`.",
    "difficulty": "Medium",
    "category": "Strings",
    "constraints": [
      "1 <= s.length <= 1000",
      "s consists of only digits and English letters."
    ],
    "examples": [
      {
        "input": "s = \"babad\"",
        "output": "\"bab\"",
        "explanation": "\"aba\" is also a valid answer."
      }
    ],
    "testCases": [
      {
        "input": "\"babad\"",
        "output": "\"bab\"",
        "isHidden": false
      },
      {
        "input": "\"cbbd\"",
        "output": "\"bb\"",
        "isHidden": false
      }
    ],
    "tags": [
      "String",
      "Dynamic Programming"
    ],
    "companyTags": [
      "Amazon",
      "Microsoft",
      "Meta",
      "Google"
    ],
    "acceptanceRate": 32.8,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function longestPalindrome(s) {\n    // Write your code here\n    return \"\";\n}"
      },
      {
        "language": "python",
        "code": "def longestPalindrome(s):\n    # Write your code here\n    return \"\"\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public String longestPalindrome(String s) {\n        // Write your code here\n        return \"\";\n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    string longestPalindrome(string s) {\n        // Write your code here\n        return \"\";\n    }\n};"
      },
      {
        "language": "c",
        "code": "char* longestPalindrome(char* s) {\n    // Write your code here\n    return \"\";\n}"
      }
    ]
  },
  {
    "title": "Remove Nth Node From End of List",
    "slug": "remove-nth-node-from-end-of-list",
    "description": "Given the head of a linked list, remove the `n`-th node from the end of the list and return its head.",
    "difficulty": "Medium",
    "category": "Linked Lists",
    "constraints": [
      "The number of nodes in the list is sz.",
      "1 <= sz <= 30",
      "0 <= Node.val <= 100",
      "1 <= n <= sz"
    ],
    "examples": [
      {
        "input": "head = [1,2,3,4,5], n = 2",
        "output": "[1,2,3,5]"
      }
    ],
    "testCases": [
      {
        "input": "[1,2,3,4,5]\n2",
        "output": "[1,2,3,5]",
        "isHidden": false
      },
      {
        "input": "[1]\n1",
        "output": "[]",
        "isHidden": false
      }
    ],
    "tags": [
      "Linked List",
      "Two Pointers"
    ],
    "companyTags": [
      "Google",
      "Amazon",
      "Facebook"
    ],
    "acceptanceRate": 42.4,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function removeNthFromEnd(head, n) {\n    // Write your code here\n    return null;\n}"
      },
      {
        "language": "python",
        "code": "def removeNthFromEnd(head, n):\n    # Write your code here\n    return None\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public ListNode removeNthFromEnd(ListNode head, int n) {\n        // Write your code here\n        return new ArrayList<>();\n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    ListNode* removeNthFromEnd(ListNode* head, int n) {\n        // Write your code here\n        return nullptr;\n    }\n};"
      },
      {
        "language": "c",
        "code": "struct ListNode* removeNthFromEnd(struct ListNode* head, int n) {\n    // Write your code here\n    return NULL;\n}"
      }
    ]
  },
  {
    "title": "Copy List with Random Pointer",
    "slug": "copy-list-with-random-pointer",
    "description": "A linked list of length `n` is given such that each node contains an additional random pointer, which could point to any node in the list, or `null`. Construct a deep copy.",
    "difficulty": "Medium",
    "category": "Linked Lists",
    "constraints": [
      "0 <= n <= 1000",
      "-10^4 <= Node.val <= 10^4"
    ],
    "examples": [
      {
        "input": "head = [[7,null],[13,0],[11,4],[10,2],[1,0]]",
        "output": "[[7,null],[13,0],[11,4],[10,2],[1,0]]"
      }
    ],
    "testCases": [
      {
        "input": "[[7,null],[13,0]]",
        "output": "[[7,null],[13,0]]",
        "isHidden": false
      }
    ],
    "tags": [
      "Hash Table",
      "Linked List"
    ],
    "companyTags": [
      "Amazon",
      "Microsoft",
      "Google"
    ],
    "acceptanceRate": 53.9,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function copyRandomList(head) {\n    // Write your code here\n    return null;\n}"
      },
      {
        "language": "python",
        "code": "def copyRandomList(head):\n    # Write your code here\n    return None\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public ListNode copyRandomList(ListNode head) {\n        // Write your code here\n        return new ArrayList<>();\n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    ListNode* copyRandomList(ListNode* head) {\n        // Write your code here\n        return nullptr;\n    }\n};"
      },
      {
        "language": "c",
        "code": "struct ListNode* copyRandomList(struct ListNode* head) {\n    // Write your code here\n    return NULL;\n}"
      }
    ]
  },
  {
    "title": "Min Stack",
    "slug": "min-stack",
    "description": "Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.",
    "difficulty": "Medium",
    "category": "Stacks",
    "constraints": [
      "-2^31 <= val <= 2^31 - 1",
      "Methods pop, top and getMin will always be called on non-empty stacks."
    ],
    "examples": [
      {
        "input": "[\"MinStack\",\"push\",\"push\",\"push\",\"getMin\",\"pop\",\"top\",\"getMin\"]\n[[],[-2],[0],[-3],[],[],[],[]]",
        "output": "[null,null,null,null,-3,null,0,-2]"
      }
    ],
    "testCases": [
      {
        "input": "[\"MinStack\",\"push\",\"push\",\"push\",\"getMin\",\"pop\",\"top\",\"getMin\"]\n[[],[-2],[0],[-3],[],[],[],[]]",
        "output": "[null,null,null,null,-3,null,0,-2]",
        "isHidden": false
      }
    ],
    "tags": [
      "Stack",
      "Design"
    ],
    "companyTags": [
      "Microsoft",
      "Bloomberg",
      "Google"
    ],
    "acceptanceRate": 53.5,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function MinStack() {\n    // Write your code here\n    \n}"
      },
      {
        "language": "python",
        "code": "def MinStack():\n    # Write your code here\n    pass\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public void MinStack() {\n        // Write your code here\n        \n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    void MinStack() {\n        // Write your code here\n        \n    }\n};"
      },
      {
        "language": "c",
        "code": "typedef struct {\n    \n} MinStack;\n\nMinStack* minStackCreate() {\n    return NULL;\n}\nvoid minStackPush(MinStack* obj, int val) {\n    \n}\nvoid minStackPop(MinStack* obj) {\n    \n}\nint minStackTop(MinStack* obj) {\n    return 0;\n}\nint minStackGetMin(MinStack* obj) {\n    return 0;\n}\nvoid minStackFree(MinStack* obj) {\n    \n}"
      }
    ]
  },
  {
    "title": "Design Circular Queue",
    "slug": "design-circular-queue",
    "description": "Design your implementation of the circular queue. The circular queue is a linear data structure in which the operations are performed based on FIFO principle and the last position is connected back to the first position to make a circle.",
    "difficulty": "Medium",
    "category": "Queues",
    "constraints": [
      "1 <= k <= 1000",
      "0 <= value <= 1000",
      "At most 3000 calls will be made."
    ],
    "examples": [
      {
        "input": "[\"MyCircularQueue\",\"enQueue\",\"enQueue\",\"enQueue\",\"enQueue\",\"Rear\",\"isFull\",\"deQueue\",\"enQueue\",\"Rear\"]\n[[3],[1],[2],[3],[4],[],[],[],[4],[]]",
        "output": "[null,true,true,true,false,3,true,true,true,4]"
      }
    ],
    "testCases": [
      {
        "input": "[\"MyCircularQueue\",\"enQueue\",\"enQueue\",\"enQueue\",\"enQueue\",\"Rear\",\"isFull\",\"deQueue\",\"enQueue\",\"Rear\"]\n[[3],[1],[2],[3],[4],[],[],[],[4],[]]",
        "output": "[null,true,true,true,false,3,true,true,true,4]",
        "isHidden": false
      }
    ],
    "tags": [
      "Design",
      "Queue",
      "Array",
      "Linked List"
    ],
    "companyTags": [
      "Amazon",
      "Microsoft",
      "Facebook"
    ],
    "acceptanceRate": 51.9,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function MyCircularQueue(k) {\n    // Write your code here\n    \n}"
      },
      {
        "language": "python",
        "code": "def MyCircularQueue(k):\n    # Write your code here\n    pass\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public void MyCircularQueue(int k) {\n        // Write your code here\n        \n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    void MyCircularQueue(int k) {\n        // Write your code here\n        \n    }\n};"
      },
      {
        "language": "c",
        "code": "typedef struct {\n    \n} MyCircularQueue;\n\nMyCircularQueue* myCircularQueueCreate(int k) {\n    return NULL;\n}\nbool myCircularQueueEnQueue(MyCircularQueue* obj, int value) {\n    return false;\n}\nbool myCircularQueueDeQueue(MyCircularQueue* obj) {\n    return false;\n}\nint myCircularQueueFront(MyCircularQueue* obj) {\n    return -1;\n}\nint myCircularQueueRear(MyCircularQueue* obj) {\n    return -1;\n}\nbool myCircularQueueIsEmpty(MyCircularQueue* obj) {\n    return true;\n}\nbool myCircularQueueIsFull(MyCircularQueue* obj) {\n    return true;\n}\nvoid myCircularQueueFree(MyCircularQueue* obj) {\n    \n}"
      }
    ]
  },
  {
    "title": "Validate Binary Search Tree",
    "slug": "validate-binary-search-tree",
    "description": "Given the root of a binary tree, determine if it is a valid binary search tree (BST).",
    "difficulty": "Medium",
    "category": "Binary Search Trees",
    "constraints": [
      "The number of nodes in the tree is sz.",
      "1 <= sz <= 10^4",
      "-2^31 <= Node.val <= 2^31 - 1"
    ],
    "examples": [
      {
        "input": "root = [2,1,3]",
        "output": "true"
      }
    ],
    "testCases": [
      {
        "input": "[2,1,3]",
        "output": "true",
        "isHidden": false
      },
      {
        "input": "[5,1,4,null,null,3,6]",
        "output": "false",
        "isHidden": false
      }
    ],
    "tags": [
      "Tree",
      "Depth-First Search",
      "Binary Search Tree",
      "Binary Tree"
    ],
    "companyTags": [
      "Amazon",
      "Microsoft",
      "Google",
      "Facebook"
    ],
    "acceptanceRate": 32.2,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function isValidBST(root) {\n    // Write your code here\n    return false;\n}"
      },
      {
        "language": "python",
        "code": "def isValidBST(root):\n    # Write your code here\n    return False\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public boolean isValidBST(TreeNode root) {\n        // Write your code here\n        return false;\n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool isValidBST(TreeNode* root) {\n        // Write your code here\n        return false;\n    }\n};"
      },
      {
        "language": "c",
        "code": "bool isValidBST(struct TreeNode* root) {\n    // Write your code here\n    return false;\n}"
      }
    ]
  },
  {
    "title": "Kth Smallest Element in a BST",
    "slug": "kth-smallest-element-in-a-bst",
    "description": "Given the root of a binary search tree, and an integer `k`, return the `k`th smallest value (1-indexed) of all the values of the nodes in the tree.",
    "difficulty": "Medium",
    "category": "Binary Search Trees",
    "constraints": [
      "The number of nodes in the tree is n.",
      "1 <= k <= n <= 10^4",
      "0 <= Node.val <= 10^4"
    ],
    "examples": [
      {
        "input": "root = [3,1,4,null,2], k = 1",
        "output": "1"
      }
    ],
    "testCases": [
      {
        "input": "[3,1,4,null,2]\n1",
        "output": "1",
        "isHidden": false
      },
      {
        "input": "[5,3,6,2,4,null,null,1]\n3",
        "output": "3",
        "isHidden": false
      }
    ],
    "tags": [
      "Tree",
      "Depth-First Search",
      "Binary Search Tree",
      "Binary Tree"
    ],
    "companyTags": [
      "Google",
      "Amazon",
      "Meta"
    ],
    "acceptanceRate": 70.8,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function kthSmallest(root, k) {\n    // Write your code here\n    return 0;\n}"
      },
      {
        "language": "python",
        "code": "def kthSmallest(root, k):\n    # Write your code here\n    return 0\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public int kthSmallest(TreeNode root, int k) {\n        // Write your code here\n        return 0;\n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    int kthSmallest(TreeNode* root, int k) {\n        // Write your code here\n        return 0;\n    }\n};"
      },
      {
        "language": "c",
        "code": "int kthSmallest(struct TreeNode* root, int k) {\n    // Write your code here\n    return 0;\n}"
      }
    ]
  },
  {
    "title": "Binary Tree Level Order Traversal",
    "slug": "binary-tree-level-order-traversal",
    "description": "Given the root of a binary tree, return the level order traversal of its nodes' values. (i.e., from left to right, level by level).",
    "difficulty": "Medium",
    "category": "Binary Trees",
    "constraints": [
      "The number of nodes in the tree is in the range [0, 2000].",
      "-1000 <= Node.val <= 1000"
    ],
    "examples": [
      {
        "input": "root = [3,9,20,null,null,15,7]",
        "output": "[[3],[9,20],[15,7]]"
      }
    ],
    "testCases": [
      {
        "input": "[3,9,20,null,null,15,7]",
        "output": "[[3],[9,20],[15,7]]",
        "isHidden": false
      }
    ],
    "tags": [
      "Tree",
      "Breadth-First Search",
      "Binary Tree"
    ],
    "companyTags": [
      "LinkedIn",
      "Amazon",
      "Microsoft"
    ],
    "acceptanceRate": 64.7,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function levelOrder(root) {\n    // Write your code here\n    return null;\n}"
      },
      {
        "language": "python",
        "code": "def levelOrder(root):\n    # Write your code here\n    return None\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public List<List<Integer>> levelOrder(TreeNode root) {\n        // Write your code here\n        return new ArrayList<>();\n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<vector<int>> levelOrder(TreeNode* root) {\n        // Write your code here\n        return {};\n    }\n};"
      },
      {
        "language": "c",
        "code": "void levelOrder(struct TreeNode* root) {\n    // Write your code here\n    \n}"
      }
    ]
  },
  {
    "title": "Lowest Common Ancestor of a Binary Tree",
    "slug": "lowest-common-ancestor-of-a-binary-tree",
    "description": "Given a binary tree, find the lowest common ancestor (LCA) of two given nodes in the tree.",
    "difficulty": "Medium",
    "category": "Binary Trees",
    "constraints": [
      "The number of nodes in the tree is sz.",
      "2 <= sz <= 10^5",
      "p != q"
    ],
    "examples": [
      {
        "input": "root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1",
        "output": "3"
      }
    ],
    "testCases": [
      {
        "input": "[3,5,1,6,2,0,8,null,null,7,4]\n5\n1",
        "output": "3",
        "isHidden": false
      }
    ],
    "tags": [
      "Tree",
      "Depth-First Search",
      "Binary Tree"
    ],
    "companyTags": [
      "Facebook",
      "Microsoft",
      "Amazon"
    ],
    "acceptanceRate": 59.2,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function lowestCommonAncestor(root, p, q) {\n    // Write your code here\n    return null;\n}"
      },
      {
        "language": "python",
        "code": "def lowestCommonAncestor(root, p, q):\n    # Write your code here\n    return None\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {\n        // Write your code here\n        return null;\n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {\n        // Write your code here\n        return nullptr;\n    }\n};"
      },
      {
        "language": "c",
        "code": "struct TreeNode* lowestCommonAncestor(struct TreeNode* root, struct TreeNode* p, struct TreeNode* q) {\n    // Write your code here\n    return NULL;\n}"
      }
    ]
  },
  {
    "title": "Number of Islands",
    "slug": "number-of-islands",
    "description": "Given an `m x n` 2D binary grid `grid` which represents a map of `'1'`s (land) and `'0'`s (water), return the number of islands.",
    "difficulty": "Medium",
    "category": "Graphs",
    "constraints": [
      "m == grid.length",
      "n == grid[i].length",
      "1 <= m, n <= 300",
      "grid[i][j] is '0' or '1'."
    ],
    "examples": [
      {
        "input": "grid = [[\"1\",\"1\",\"1\",\"1\",\"0\"],[\"1\",\"1\",\"0\",\"1\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"0\",\"0\"]]",
        "output": "1"
      }
    ],
    "testCases": [
      {
        "input": "[[\"1\",\"1\",\"1\",\"1\",\"0\"],[\"1\",\"1\",\"0\",\"1\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"0\",\"0\"]]",
        "output": "1",
        "isHidden": false
      },
      {
        "input": "[[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"1\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"1\",\"1\"]]",
        "output": "3",
        "isHidden": false
      }
    ],
    "tags": [
      "Array",
      "Depth-First Search",
      "Breadth-First Search",
      "Union Find",
      "Matrix"
    ],
    "companyTags": [
      "Amazon",
      "Microsoft",
      "Salesforce",
      "Google"
    ],
    "acceptanceRate": 58.4,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function numIslands(grid) {\n    // Write your code here\n    return 0;\n}"
      },
      {
        "language": "python",
        "code": "def numIslands(grid):\n    # Write your code here\n    return 0\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public int numIslands(char[][] grid) {\n        // Write your code here\n        return 0;\n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    int numIslands(vector<vector<char>>& grid) {\n        // Write your code here\n        return 0;\n    }\n};"
      },
      {
        "language": "c",
        "code": "int numIslands(char** grid, int gridSize, int* gridColSize) {\n    return 0;\n}"
      }
    ]
  },
  {
    "title": "Clone Graph",
    "slug": "clone-graph",
    "description": "Given a reference of a node in a connected undirected graph. Return a deep copy (clone) of the graph.",
    "difficulty": "Medium",
    "category": "Graphs",
    "constraints": [
      "The number of nodes in the graph is in the range [0, 100].",
      "1 <= Node.val <= 100"
    ],
    "examples": [
      {
        "input": "adjList = [[2,4],[1,3],[2,4],[1,3]]",
        "output": "[[2,4],[1,3],[2,4],[1,3]]"
      }
    ],
    "testCases": [
      {
        "input": "[[2,4],[1,3],[2,4],[1,3]]",
        "output": "[[2,4],[1,3],[2,4],[1,3]]",
        "isHidden": false
      }
    ],
    "tags": [
      "Hash Table",
      "Depth-First Search",
      "Breadth-First Search",
      "Graph"
    ],
    "companyTags": [
      "Facebook",
      "Pocket Gems",
      "Google"
    ],
    "acceptanceRate": 55.2,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function cloneGraph(node) {\n    // Write your code here\n    return null;\n}"
      },
      {
        "language": "python",
        "code": "def cloneGraph(node):\n    # Write your code here\n    return None\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public ListNode cloneGraph(ListNode node) {\n        // Write your code here\n        return new ArrayList<>();\n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    ListNode* cloneGraph(ListNode* node) {\n        // Write your code here\n        return nullptr;\n    }\n};"
      },
      {
        "language": "c",
        "code": "struct ListNode* cloneGraph(struct ListNode* node) {\n    // Write your code here\n    return NULL;\n}"
      }
    ]
  },
  {
    "title": "Course Schedule",
    "slug": "course-schedule",
    "description": "There are a total of `numCourses` courses you have to take, labeled from `0` to `numCourses - 1`. You are given an array `prerequisites` where `prerequisites[i] = [ai, bi]` indicates that you must take course `bi` first if you want to take course `ai`.\n\nReturn `true` if you can finish all courses. Otherwise, return `false`.",
    "difficulty": "Medium",
    "category": "Graphs",
    "constraints": [
      "1 <= numCourses <= 2000",
      "0 <= prerequisites.length <= 5000"
    ],
    "examples": [
      {
        "input": "numCourses = 2, prerequisites = [[1,0]]",
        "output": "true"
      }
    ],
    "testCases": [
      {
        "input": "2\n[[1,0]]",
        "output": "true",
        "isHidden": false
      },
      {
        "input": "2\n[[1,0],[0,1]]",
        "output": "false",
        "isHidden": false
      }
    ],
    "tags": [
      "Depth-First Search",
      "Breadth-First Search",
      "Graph",
      "Topological Sort"
    ],
    "companyTags": [
      "Google",
      "Amazon",
      "Microsoft",
      "Uber"
    ],
    "acceptanceRate": 46.1,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function canFinish(numCourses, prerequisites) {\n    // Write your code here\n    return false;\n}"
      },
      {
        "language": "python",
        "code": "def canFinish(numCourses, prerequisites):\n    # Write your code here\n    return False\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public boolean canFinish(int numCourses, int[][] prerequisites) {\n        // Write your code here\n        return false;\n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {\n        // Write your code here\n        return false;\n    }\n};"
      },
      {
        "language": "c",
        "code": "bool canFinish(int numCourses, int** prerequisites, int prerequisitesSize, int* prerequisitesColSize) {\n    return false;\n}"
      }
    ]
  },
  {
    "title": "Pacific Atlantic Water Flow",
    "slug": "pacific-atlantic-water-flow",
    "description": "There is an `m x n` rectangular island that borders both the Pacific Ocean and Atlantic Ocean. Water can flow from cell to ocean in 4 directions if height <= current height. Return a list of grid coordinates.",
    "difficulty": "Medium",
    "category": "Graphs",
    "constraints": [
      "m == heights.length",
      "n == heights[r].length",
      "1 <= m, n <= 200"
    ],
    "examples": [
      {
        "input": "heights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]",
        "output": "[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]"
      }
    ],
    "testCases": [
      {
        "input": "[[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]",
        "output": "[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]",
        "isHidden": false
      }
    ],
    "tags": [
      "Array",
      "Depth-First Search",
      "Breadth-First Search",
      "Matrix"
    ],
    "companyTags": [
      "Google",
      "Amazon"
    ],
    "acceptanceRate": 54.8,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function pacificAtlantic(heights) {\n    // Write your code here\n    return null;\n}"
      },
      {
        "language": "python",
        "code": "def pacificAtlantic(heights):\n    # Write your code here\n    return None\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public void pacificAtlantic(int[][] heights) {\n        // Write your code here\n        \n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    void pacificAtlantic(vector<vector<int>>& heights) {\n        // Write your code here\n        \n    }\n};"
      },
      {
        "language": "c",
        "code": "int** pacificAtlantic(int** heights, int heightsSize, int* heightsColSize, int* returnSize, int** returnColumnSizes) {\n    return NULL;\n}"
      }
    ]
  },
  {
    "title": "House Robber",
    "slug": "house-robber",
    "description": "You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected... Return the max money you can rob.",
    "difficulty": "Medium",
    "category": "Dynamic Programming",
    "constraints": [
      "1 <= nums.length <= 100",
      "0 <= nums[i] <= 400"
    ],
    "examples": [
      {
        "input": "nums = [1,2,3,1]",
        "output": "4",
        "explanation": "Rob house 1 (money = 1) and then rob house 3 (money = 3). Total = 1 + 3 = 4."
      }
    ],
    "testCases": [
      {
        "input": "[1,2,3,1]",
        "output": "4",
        "isHidden": false
      },
      {
        "input": "[2,7,9,3,1]",
        "output": "12",
        "isHidden": false
      }
    ],
    "tags": [
      "Array",
      "Dynamic Programming"
    ],
    "companyTags": [
      "Google",
      "Microsoft",
      "Amazon"
    ],
    "acceptanceRate": 50.1,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function rob(nums) {\n    // Write your code here\n    return 0;\n}"
      },
      {
        "language": "python",
        "code": "def rob(nums):\n    # Write your code here\n    return 0\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public int rob(int[] nums) {\n        // Write your code here\n        return 0;\n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    int rob(vector<int>& nums) {\n        // Write your code here\n        return 0;\n    }\n};"
      },
      {
        "language": "c",
        "code": "int rob(int* nums, int numsSize) {\n    // Write your code here\n    return 0;\n}"
      }
    ]
  },
  {
    "title": "Coin Change",
    "slug": "coin-change",
    "description": "You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money.\n\nReturn the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return `-1`.",
    "difficulty": "Medium",
    "category": "Dynamic Programming",
    "constraints": [
      "1 <= coins.length <= 12",
      "1 <= coins[i] <= 2^31 - 1",
      "0 <= amount <= 10^4"
    ],
    "examples": [
      {
        "input": "coins = [1,2,5], amount = 11",
        "output": "3",
        "explanation": "11 = 5 + 5 + 1"
      }
    ],
    "testCases": [
      {
        "input": "[1,2,5]\n11",
        "output": "3",
        "isHidden": false
      },
      {
        "input": "[2]\n3",
        "output": "-1",
        "isHidden": false
      },
      {
        "input": "[1]\n0",
        "output": "0",
        "isHidden": true
      }
    ],
    "tags": [
      "Array",
      "Dynamic Programming",
      "Breadth-First Search"
    ],
    "companyTags": [
      "Google",
      "Amazon",
      "Microsoft",
      "Goldman Sachs"
    ],
    "acceptanceRate": 42.9,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function coinChange(coins, amount) {\n    // Write your code here\n    return 0;\n}"
      },
      {
        "language": "python",
        "code": "def coinChange(coins, amount):\n    # Write your code here\n    return 0\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public int coinChange(int[] coins, int amount) {\n        // Write your code here\n        return 0;\n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    int coinChange(vector<int>& coins, int amount) {\n        // Write your code here\n        return 0;\n    }\n};"
      },
      {
        "language": "c",
        "code": "int coinChange(int* coins, int coinsSize, int amount) {\n    // Write your code here\n    return 0;\n}"
      }
    ]
  },
  {
    "title": "Longest Increasing Subsequence",
    "slug": "longest-increasing-subsequence",
    "description": "Given an integer array `nums`, return the length of the longest strictly increasing subsequence.",
    "difficulty": "Medium",
    "category": "Dynamic Programming",
    "constraints": [
      "1 <= nums.length <= 2500",
      "-10^4 <= nums[i] <= 10^4"
    ],
    "examples": [
      {
        "input": "nums = [10,9,2,5,3,7,101,18]",
        "output": "4",
        "explanation": "The longest increasing subsequence is [2,3,7,101], therefore the length is 4."
      }
    ],
    "testCases": [
      {
        "input": "[10,9,2,5,3,7,101,18]",
        "output": "4",
        "isHidden": false
      },
      {
        "input": "[0,1,0,3,2,3]",
        "output": "4",
        "isHidden": false
      }
    ],
    "tags": [
      "Array",
      "Binary Search",
      "Dynamic Programming"
    ],
    "companyTags": [
      "Google",
      "Amazon",
      "Meta",
      "Microsoft"
    ],
    "acceptanceRate": 53.4,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function lengthOfLIS(nums) {\n    // Write your code here\n    return 0;\n}"
      },
      {
        "language": "python",
        "code": "def lengthOfLIS(nums):\n    # Write your code here\n    return 0\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public int lengthOfLIS(int[] nums) {\n        // Write your code here\n        return 0;\n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    int lengthOfLIS(vector<int>& nums) {\n        // Write your code here\n        return 0;\n    }\n};"
      },
      {
        "language": "c",
        "code": "int lengthOfLIS(int* nums, int numsSize) {\n    // Write your code here\n    return 0;\n}"
      }
    ]
  },
  {
    "title": "Decode Ways",
    "slug": "decode-ways",
    "description": "A message containing letters from A-Z can be encoded into numbers using 'A' -> '1', ..., 'Z' -> '26'. Given a string `s` containing only digits, return the number of ways to decode it.",
    "difficulty": "Medium",
    "category": "Dynamic Programming",
    "constraints": [
      "1 <= s.length <= 100",
      "s contains only digits and may contain leading zero."
    ],
    "examples": [
      {
        "input": "s = \"12\"",
        "output": "2",
        "explanation": "\"12\" could be decoded as \"AB\" (1 2) or \"L\" (12)."
      }
    ],
    "testCases": [
      {
        "input": "\"12\"",
        "output": "2",
        "isHidden": false
      },
      {
        "input": "\"226\"",
        "output": "3",
        "isHidden": false
      },
      {
        "input": "\"06\"",
        "output": "0",
        "isHidden": true
      }
    ],
    "tags": [
      "String",
      "Dynamic Programming"
    ],
    "companyTags": [
      "Facebook",
      "Amazon",
      "Uber"
    ],
    "acceptanceRate": 33.9,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function numDecodings(s) {\n    // Write your code here\n    return 0;\n}"
      },
      {
        "language": "python",
        "code": "def numDecodings(s):\n    # Write your code here\n    return 0\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public int numDecodings(String s) {\n        // Write your code here\n        return 0;\n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    int numDecodings(string s) {\n        // Write your code here\n        return 0;\n    }\n};"
      },
      {
        "language": "c",
        "code": "int numDecodings(char* s) {\n    // Write your code here\n    return 0;\n}"
      }
    ]
  },
  {
    "title": "Partition Equal Subset Sum",
    "slug": "partition-equal-subset-sum",
    "description": "Given an integer array `nums`, return `true` if you can partition the array into two subsets such that the sum of the elements in both subsets is equal or `false` otherwise.",
    "difficulty": "Medium",
    "category": "Dynamic Programming",
    "constraints": [
      "1 <= nums.length <= 200",
      "1 <= nums[i] <= 100"
    ],
    "examples": [
      {
        "input": "nums = [1,5,11,5]",
        "output": "true",
        "explanation": "The array can be partitioned as [1, 5, 5] and [11]."
      }
    ],
    "testCases": [
      {
        "input": "[1,5,11,5]",
        "output": "true",
        "isHidden": false
      },
      {
        "input": "[1,2,3,5]",
        "output": "false",
        "isHidden": false
      }
    ],
    "tags": [
      "Array",
      "Dynamic Programming"
    ],
    "companyTags": [
      "Amazon",
      "Microsoft",
      "Google"
    ],
    "acceptanceRate": 46.2,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function canPartition(nums) {\n    // Write your code here\n    return false;\n}"
      },
      {
        "language": "python",
        "code": "def canPartition(nums):\n    # Write your code here\n    return False\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public boolean canPartition(int[] nums) {\n        // Write your code here\n        return false;\n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool canPartition(vector<int>& nums) {\n        // Write your code here\n        return false;\n    }\n};"
      },
      {
        "language": "c",
        "code": "bool canPartition(int* nums, int numsSize) {\n    // Write your code here\n    return false;\n}"
      }
    ]
  },
  {
    "title": "Jump Game",
    "slug": "jump-game",
    "description": "You are given an integer array `nums`. You are initially positioned at the array's first index, and each element in the array represents your maximum jump length at that position. Return true if you can reach the last index.",
    "difficulty": "Medium",
    "category": "Greedy Algorithms",
    "constraints": [
      "1 <= nums.length <= 10^4",
      "0 <= nums[i] <= 10^5"
    ],
    "examples": [
      {
        "input": "nums = [2,3,1,1,4]",
        "output": "true"
      }
    ],
    "testCases": [
      {
        "input": "[2,3,1,1,4]",
        "output": "true",
        "isHidden": false
      },
      {
        "input": "[3,2,1,0,4]",
        "output": "false",
        "isHidden": false
      }
    ],
    "tags": [
      "Array",
      "Dynamic Programming",
      "Greedy"
    ],
    "companyTags": [
      "Amazon",
      "Microsoft",
      "Google"
    ],
    "acceptanceRate": 38.4,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function canJump(nums) {\n    // Write your code here\n    return false;\n}"
      },
      {
        "language": "python",
        "code": "def canJump(nums):\n    # Write your code here\n    return False\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public boolean canJump(int[] nums) {\n        // Write your code here\n        return false;\n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool canJump(vector<int>& nums) {\n        // Write your code here\n        return false;\n    }\n};"
      },
      {
        "language": "c",
        "code": "bool canJump(int* nums, int numsSize) {\n    // Write your code here\n    return false;\n}"
      }
    ]
  },
  {
    "title": "Gas Station",
    "slug": "gas-station",
    "description": "There are `n` gas stations along a circular route, where the amount of gas at the `i`th station is `gas[i]`. You have a car with an unlimited gas tank and it costs `cost[i]` of gas to travel from the `i`th station to its next `(i + 1)`th station. Return the starting gas station index.",
    "difficulty": "Medium",
    "category": "Greedy Algorithms",
    "constraints": [
      "gas.length == cost.length",
      "1 <= gas.length <= 10^5"
    ],
    "examples": [
      {
        "input": "gas = [1,2,3,4,5], cost = [3,4,5,1,2]",
        "output": "3"
      }
    ],
    "testCases": [
      {
        "input": "[1,2,3,4,5]\n[3,4,5,1,2]",
        "output": "3",
        "isHidden": false
      },
      {
        "input": "[2,3,4]\n[3,4,3]",
        "output": "-1",
        "isHidden": false
      }
    ],
    "tags": [
      "Array",
      "Greedy"
    ],
    "companyTags": [
      "Google",
      "Amazon",
      "Uber"
    ],
    "acceptanceRate": 45.1,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function canCompleteCircuit(gas, cost) {\n    // Write your code here\n    return 0;\n}"
      },
      {
        "language": "python",
        "code": "def canCompleteCircuit(gas, cost):\n    # Write your code here\n    return 0\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public int canCompleteCircuit(int[] gas, int[] cost) {\n        // Write your code here\n        return 0;\n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    int canCompleteCircuit(vector<int>& gas, vector<int>& cost) {\n        // Write your code here\n        return 0;\n    }\n};"
      },
      {
        "language": "c",
        "code": "int canCompleteCircuit(int* gas, int gasSize, int* cost, int costSize) {\n    // Write your code here\n    return 0;\n}"
      }
    ]
  },
  {
    "title": "Task Scheduler",
    "slug": "task-scheduler",
    "description": "Given a characters array `tasks`, representing the tasks a CPU needs to do, and a cooling time `n`, return the least number of units of times that the CPU will take to finish all the given tasks.",
    "difficulty": "Medium",
    "category": "Greedy Algorithms",
    "constraints": [
      "1 <= tasks.length <= 10^4",
      "0 <= n <= 100"
    ],
    "examples": [
      {
        "input": "tasks = [\"A\",\"A\",\"A\",\"B\",\"B\",\"B\"], n = 2",
        "output": "8",
        "explanation": "A -> B -> idle -> A -> B -> idle -> A -> B"
      }
    ],
    "testCases": [
      {
        "input": "[\"A\",\"A\",\"A\",\"B\",\"B\",\"B\"]\n2",
        "output": "8",
        "isHidden": false
      }
    ],
    "tags": [
      "Array",
      "Hash Table",
      "Greedy",
      "Queue",
      "Counting"
    ],
    "companyTags": [
      "Facebook",
      "Amazon",
      "Google"
    ],
    "acceptanceRate": 57.2,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function leastInterval(tasks, n) {\n    // Write your code here\n    return 0;\n}"
      },
      {
        "language": "python",
        "code": "def leastInterval(tasks, n):\n    # Write your code here\n    return 0\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public int leastInterval(char[] tasks, int n) {\n        // Write your code here\n        return 0;\n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    int leastInterval(vector<char>& tasks, int n) {\n        // Write your code here\n        return 0;\n    }\n};"
      },
      {
        "language": "c",
        "code": "int leastInterval(char* tasks, int tasksSize, int n) {\n    // Write your code here\n    return 0;\n}"
      }
    ]
  },
  {
    "title": "Subsets",
    "slug": "subsets",
    "description": "Given an integer array `nums` of unique elements, return all possible subsets (the power set). The solution set must not contain duplicate subsets.",
    "difficulty": "Medium",
    "category": "Backtracking",
    "constraints": [
      "1 <= nums.length <= 10",
      "-10 <= nums[i] <= 10"
    ],
    "examples": [
      {
        "input": "nums = [1,2,3]",
        "output": "[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]"
      }
    ],
    "testCases": [
      {
        "input": "[1,2,3]",
        "output": "[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]",
        "isHidden": false
      },
      {
        "input": "[0]",
        "output": "[[],[0]]",
        "isHidden": false
      }
    ],
    "tags": [
      "Array",
      "Backtracking",
      "Bit Manipulation"
    ],
    "companyTags": [
      "Facebook",
      "Amazon",
      "Google",
      "Microsoft"
    ],
    "acceptanceRate": 76.5,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function subsets(nums) {\n    // Write your code here\n    return null;\n}"
      },
      {
        "language": "python",
        "code": "def subsets(nums):\n    # Write your code here\n    return None\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public List<List<Integer>> subsets(int[] nums) {\n        // Write your code here\n        return new ArrayList<>();\n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<vector<int>> subsets(vector<int>& nums) {\n        // Write your code here\n        return {};\n    }\n};"
      },
      {
        "language": "c",
        "code": "void subsets(int* nums, int numsSize) {\n    // Write your code here\n    \n}"
      }
    ]
  },
  {
    "title": "Permutations",
    "slug": "permutations",
    "description": "Given an array `nums` of distinct integers, return all the possible permutations. You can return the answer in any order.",
    "difficulty": "Medium",
    "category": "Backtracking",
    "constraints": [
      "1 <= nums.length <= 6",
      "-10 <= nums[i] <= 10"
    ],
    "examples": [
      {
        "input": "nums = [1,2,3]",
        "output": "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]"
      }
    ],
    "testCases": [
      {
        "input": "[1,2,3]",
        "output": "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]",
        "isHidden": false
      },
      {
        "input": "[0,1]",
        "output": "[[0,1],[1,0]]",
        "isHidden": false
      }
    ],
    "tags": [
      "Array",
      "Backtracking"
    ],
    "companyTags": [
      "LinkedIn",
      "Microsoft",
      "Google"
    ],
    "acceptanceRate": 77.2,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function permute(nums) {\n    // Write your code here\n    return null;\n}"
      },
      {
        "language": "python",
        "code": "def permute(nums):\n    # Write your code here\n    return None\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public List<List<Integer>> permute(int[] nums) {\n        // Write your code here\n        return new ArrayList<>();\n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<vector<int>> permute(vector<int>& nums) {\n        // Write your code here\n        return {};\n    }\n};"
      },
      {
        "language": "c",
        "code": "void permute(int* nums, int numsSize) {\n    // Write your code here\n    \n}"
      }
    ]
  },
  {
    "title": "Combination Sum",
    "slug": "combination-sum",
    "description": "Given an array of distinct integers `candidates` and a target integer `target`, return a list of all unique combinations of candidates where the chosen numbers sum to `target`. You may choose candidates multiple times.",
    "difficulty": "Medium",
    "category": "Backtracking",
    "constraints": [
      "1 <= candidates.length <= 30",
      "1 <= target <= 40"
    ],
    "examples": [
      {
        "input": "candidates = [2,3,6,7], target = 7",
        "output": "[[2,2,3],[7]]"
      }
    ],
    "testCases": [
      {
        "input": "[2,3,6,7]\n7",
        "output": "[[2,2,3],[7]]",
        "isHidden": false
      },
      {
        "input": "[2,3,5]\n8",
        "output": "[[2,2,2,2],[2,3,3],[3,5]]",
        "isHidden": false
      }
    ],
    "tags": [
      "Array",
      "Backtracking"
    ],
    "companyTags": [
      "Reddit",
      "Amazon",
      "Microsoft",
      "Airbnb"
    ],
    "acceptanceRate": 69.8,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function combinationSum(candidates, target) {\n    // Write your code here\n    return null;\n}"
      },
      {
        "language": "python",
        "code": "def combinationSum(candidates, target):\n    # Write your code here\n    return None\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public List<List<Integer>> combinationSum(int[] candidates, int target) {\n        // Write your code here\n        return new ArrayList<>();\n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<vector<int>> combinationSum(vector<int>& candidates, int target) {\n        // Write your code here\n        return {};\n    }\n};"
      },
      {
        "language": "c",
        "code": "void combinationSum(int* candidates, int candidatesSize, int target) {\n    // Write your code here\n    \n}"
      }
    ]
  },
  {
    "title": "Word Search",
    "slug": "word-search",
    "description": "Given an `m x n` grid of characters `board` and a string `word`, return `true` if `word` exists in the grid.",
    "difficulty": "Medium",
    "category": "Backtracking",
    "constraints": [
      "m == board.length",
      "n = board[i].length",
      "1 <= m, n <= 6",
      "1 <= word.length <= 15"
    ],
    "examples": [
      {
        "input": "board = [[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]], word = \"ABCCED\"",
        "output": "true"
      }
    ],
    "testCases": [
      {
        "input": "[[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]]\n\"ABCCED\"",
        "output": "true",
        "isHidden": false
      },
      {
        "input": "[[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]]\n\"SEE\"",
        "output": "true",
        "isHidden": false
      }
    ],
    "tags": [
      "Array",
      "Backtracking",
      "Matrix"
    ],
    "companyTags": [
      "Amazon",
      "Google",
      "Facebook"
    ],
    "acceptanceRate": 41.5,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function exist(board, word) {\n    // Write your code here\n    return false;\n}"
      },
      {
        "language": "python",
        "code": "def exist(board, word):\n    # Write your code here\n    return False\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public boolean exist(char[][] board, String word) {\n        // Write your code here\n        return false;\n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool exist(vector<vector<char>>& board, string word) {\n        // Write your code here\n        return false;\n    }\n};"
      },
      {
        "language": "c",
        "code": "bool exist(char** board, int boardSize, int* boardColSize, char* word) {\n    return false;\n}"
      }
    ]
  },
  {
    "title": "Search in Rotated Sorted Array",
    "slug": "search-in-rotated-sorted-array",
    "description": "Given the array `nums` after a possible rotation and an integer `target`, return the index of `target` if it is in `nums`, or `-1` if it is not in `nums`.\n\nYou must write an algorithm with `O(log n)` runtime complexity.",
    "difficulty": "Medium",
    "category": "Binary Search",
    "constraints": [
      "1 <= nums.length <= 5000",
      "-10^4 <= nums[i], target <= 10^4",
      "All values of nums are unique."
    ],
    "examples": [
      {
        "input": "nums = [4,5,6,7,0,1,2], target = 0",
        "output": "4"
      }
    ],
    "testCases": [
      {
        "input": "[4,5,6,7,0,1,2]\n0",
        "output": "4",
        "isHidden": false
      },
      {
        "input": "[4,5,6,7,0,1,2]\n3",
        "output": "-1",
        "isHidden": false
      }
    ],
    "tags": [
      "Array",
      "Binary Search"
    ],
    "companyTags": [
      "Facebook",
      "Microsoft",
      "Uber",
      "Amazon"
    ],
    "acceptanceRate": 40.1,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function search(nums, target) {\n    // Write your code here\n    return 0;\n}"
      },
      {
        "language": "python",
        "code": "def search(nums, target):\n    # Write your code here\n    return 0\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public int search(int[] nums, int target) {\n        // Write your code here\n        return 0;\n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        // Write your code here\n        return 0;\n    }\n};"
      },
      {
        "language": "c",
        "code": "int search(int* nums, int numsSize, int target) {\n    // Write your code here\n    return 0;\n}"
      }
    ]
  },
  {
    "title": "Group Anagrams",
    "slug": "group-anagrams",
    "description": "Given an array of strings `strs`, group the anagrams together. You can return the answer in any order.",
    "difficulty": "Medium",
    "category": "Hash Tables",
    "constraints": [
      "1 <= strs.length <= 10^4",
      "0 <= strs[i].length <= 100"
    ],
    "examples": [
      {
        "input": "strs = [\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]",
        "output": "[[\"bat\"],[\"nat\",\"tan\"],[\"ate\",\"eat\",\"tea\"]]"
      }
    ],
    "testCases": [
      {
        "input": "[\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]",
        "output": "[[\"bat\"],[\"nat\",\"tan\"],[\"ate\",\"eat\",\"tea\"]]",
        "isHidden": false
      }
    ],
    "tags": [
      "Array",
      "Hash Table",
      "String",
      "Sorting"
    ],
    "companyTags": [
      "Amazon",
      "Yelp",
      "Salesforce"
    ],
    "acceptanceRate": 67.2,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function groupAnagrams(strs) {\n    // Write your code here\n    return null;\n}"
      },
      {
        "language": "python",
        "code": "def groupAnagrams(strs):\n    # Write your code here\n    return None\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public List<List<Integer>> groupAnagrams(String[] strs) {\n        // Write your code here\n        return new ArrayList<>();\n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<vector<int>> groupAnagrams(vector<string>& strs) {\n        // Write your code here\n        return {};\n    }\n};"
      },
      {
        "language": "c",
        "code": "void groupAnagrams(int strs) {\n    // Write your code here\n    \n}"
      }
    ]
  },
  {
    "title": "Longest Repeating Character Replacement",
    "slug": "longest-repeating-character-replacement",
    "description": "You are given a string `s` and an integer `k`. You can choose any character of the string and change it to any other uppercase English character. You can perform this operation at most `k` times. Return the length of the longest substring containing the same letter.",
    "difficulty": "Medium",
    "category": "Sliding Window",
    "constraints": [
      "1 <= s.length <= 10^5",
      "0 <= k <= s.length"
    ],
    "examples": [
      {
        "input": "s = \"ABAB\", k = 2",
        "output": "4"
      }
    ],
    "testCases": [
      {
        "input": "\"ABAB\"\n2",
        "output": "4",
        "isHidden": false
      },
      {
        "input": "\"AABABBA\"\n1",
        "output": "4",
        "isHidden": false
      }
    ],
    "tags": [
      "Hash Table",
      "String",
      "Sliding Window"
    ],
    "companyTags": [
      "Google",
      "Amazon",
      "Meta"
    ],
    "acceptanceRate": 53.1,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function characterReplacement(s, k) {\n    // Write your code here\n    return 0;\n}"
      },
      {
        "language": "python",
        "code": "def characterReplacement(s, k):\n    # Write your code here\n    return 0\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public int characterReplacement(String s, int k) {\n        // Write your code here\n        return 0;\n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    int characterReplacement(string s, int k) {\n        // Write your code here\n        return 0;\n    }\n};"
      },
      {
        "language": "c",
        "code": "int characterReplacement(char* s, int k) {\n    // Write your code here\n    return 0;\n}"
      }
    ]
  },
  {
    "title": "Container With Most Water",
    "slug": "container-with-most-water",
    "description": "You are given an integer array `height` of length `n`. Find two lines that together with the x-axis form a container, such that the container contains the most water. Return the max water.",
    "difficulty": "Medium",
    "category": "Two Pointers",
    "constraints": [
      "n == height.length",
      "2 <= n <= 10^5",
      "0 <= height[i] <= 10^4"
    ],
    "examples": [
      {
        "input": "height = [1,8,6,2,5,4,8,3,7]",
        "output": "49"
      }
    ],
    "testCases": [
      {
        "input": "[1,8,6,2,5,4,8,3,7]",
        "output": "49",
        "isHidden": false
      },
      {
        "input": "[1,1]",
        "output": "1",
        "isHidden": false
      }
    ],
    "tags": [
      "Array",
      "Two Pointers",
      "Greedy"
    ],
    "companyTags": [
      "Google",
      "Amazon",
      "Meta",
      "Adobe"
    ],
    "acceptanceRate": 54.3,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function maxArea(height) {\n    // Write your code here\n    return 0;\n}"
      },
      {
        "language": "python",
        "code": "def maxArea(height):\n    # Write your code here\n    return 0\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public int maxArea(int[] height) {\n        // Write your code here\n        return 0;\n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    int maxArea(vector<int>& height) {\n        // Write your code here\n        return 0;\n    }\n};"
      },
      {
        "language": "c",
        "code": "int maxArea(int* height, int heightSize) {\n    // Write your code here\n    return 0;\n}"
      }
    ]
  },
  {
    "title": "Subarray Sum Equals K",
    "slug": "subarray-sum-equals-k",
    "description": "Given an array of integers `nums` and an integer `k`, return the total number of subarrays whose sum equals to `k`.",
    "difficulty": "Medium",
    "category": "Prefix Sum",
    "constraints": [
      "1 <= nums.length <= 2 * 10^4",
      "-1000 <= nums[i] <= 1000",
      "-10^7 <= k <= 10^7"
    ],
    "examples": [
      {
        "input": "nums = [1,1,1], k = 2",
        "output": "2"
      }
    ],
    "testCases": [
      {
        "input": "[1,1,1]\n2",
        "output": "2",
        "isHidden": false
      },
      {
        "input": "[1,2,3]\n3",
        "output": "2",
        "isHidden": false
      }
    ],
    "tags": [
      "Array",
      "Hash Table",
      "Prefix Sum"
    ],
    "companyTags": [
      "Meta",
      "Amazon",
      "Google"
    ],
    "acceptanceRate": 44.1,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function subarraySum(nums, k) {\n    // Write your code here\n    return 0;\n}"
      },
      {
        "language": "python",
        "code": "def subarraySum(nums, k):\n    # Write your code here\n    return 0\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public int subarraySum(int[] nums, int k) {\n        // Write your code here\n        return 0;\n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    int subarraySum(vector<int>& nums, int k) {\n        // Write your code here\n        return 0;\n    }\n};"
      },
      {
        "language": "c",
        "code": "int subarraySum(int* nums, int numsSize, int k) {\n    // Write your code here\n    return 0;\n}"
      }
    ]
  },
  {
    "title": "Top K Frequent Elements",
    "slug": "top-k-frequent-elements",
    "description": "Given an integer array `nums` and an integer `k`, return the `k` most frequent elements. You may return the answer in any order.",
    "difficulty": "Medium",
    "category": "Heap / Priority Queue",
    "constraints": [
      "1 <= nums.length <= 10^5",
      "k is in the range [1, the number of unique elements in the array]."
    ],
    "examples": [
      {
        "input": "nums = [1,1,1,2,2,3], k = 2",
        "output": "[1,2]"
      }
    ],
    "testCases": [
      {
        "input": "[1,1,1,2,2,3]\n2",
        "output": "[1,2]",
        "isHidden": false
      },
      {
        "input": "[1]\n1",
        "output": "[1]",
        "isHidden": false
      }
    ],
    "tags": [
      "Array",
      "Hash Table",
      "Divide and Conquer",
      "Sorting",
      "Heap (Priority Queue)"
    ],
    "companyTags": [
      "Google",
      "Amazon",
      "Microsoft"
    ],
    "acceptanceRate": 63.8,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function topKFrequent(nums, k) {\n    // Write your code here\n    return [];\n}"
      },
      {
        "language": "python",
        "code": "def topKFrequent(nums, k):\n    # Write your code here\n    return []\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public int[] topKFrequent(int[] nums, int k) {\n        // Write your code here\n        return new int[0];\n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> topKFrequent(vector<int>& nums, int k) {\n        // Write your code here\n        return {};\n    }\n};"
      },
      {
        "language": "c",
        "code": "int* topKFrequent(int* nums, int numsSize, int k, int* returnSize) {\n    // Write your code here\n    *returnSize = 0;\n    return NULL;\n}"
      }
    ]
  },
  {
    "title": "Kth Largest Element in an Array",
    "slug": "kth-largest-element-in-an-array",
    "description": "Given an integer array `nums` and an integer `k`, return the `k`th largest element in the array. Note that it is the `k`th largest element in the sorted order, not the `k`th distinct element.",
    "difficulty": "Medium",
    "category": "Heap / Priority Queue",
    "constraints": [
      "1 <= k <= nums.length <= 10^5",
      "-10^4 <= nums[i] <= 10^4"
    ],
    "examples": [
      {
        "input": "nums = [3,2,1,5,6,4], k = 2",
        "output": "5"
      }
    ],
    "testCases": [
      {
        "input": "[3,2,1,5,6,4]\n2",
        "output": "5",
        "isHidden": false
      },
      {
        "input": "[3,2,3,1,2,4,5,5,6]\n4",
        "output": "4",
        "isHidden": false
      }
    ],
    "tags": [
      "Array",
      "Divide and Conquer",
      "Sorting",
      "Heap (Priority Queue)",
      "Quickselect"
    ],
    "companyTags": [
      "Facebook",
      "Amazon",
      "Microsoft",
      "Google"
    ],
    "acceptanceRate": 66.1,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function findKthLargest(nums, k) {\n    // Write your code here\n    return 0;\n}"
      },
      {
        "language": "python",
        "code": "def findKthLargest(nums, k):\n    # Write your code here\n    return 0\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public int findKthLargest(int[] nums, int k) {\n        // Write your code here\n        return 0;\n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    int findKthLargest(vector<int>& nums, int k) {\n        // Write your code here\n        return 0;\n    }\n};"
      },
      {
        "language": "c",
        "code": "int findKthLargest(int* nums, int numsSize, int k) {\n    // Write your code here\n    return 0;\n}"
      }
    ]
  },
  {
    "title": "Implement Trie (Prefix Tree)",
    "slug": "implement-trie-prefix-tree",
    "description": "A trie (pronounced as \"try\") or prefix tree is a tree data structure used to efficiently store and retrieve keys in a dataset of strings. Implement the Trie class.",
    "difficulty": "Medium",
    "category": "Trie",
    "constraints": [
      "1 <= word.length, prefix.length <= 2000",
      "word and prefix consist only of lowercase English letters."
    ],
    "examples": [
      {
        "input": "[\"Trie\",\"insert\",\"search\",\"startsWith\"]\n[[],[\"apple\"],[\"apple\"],[\"app\"]]",
        "output": "[null,null,true,true]"
      }
    ],
    "testCases": [
      {
        "input": "[\"Trie\",\"insert\",\"search\",\"startsWith\"]\n[[],[\"apple\"],[\"apple\"],[\"app\"]]",
        "output": "[null,null,true,true]",
        "isHidden": false
      }
    ],
    "tags": [
      "Design",
      "Trie",
      "Hash Table",
      "String"
    ],
    "companyTags": [
      "Google",
      "Amazon",
      "Microsoft"
    ],
    "acceptanceRate": 63.8,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function Trie() {\n    // Write your code here\n    \n}"
      },
      {
        "language": "python",
        "code": "def Trie():\n    # Write your code here\n    pass\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public void Trie() {\n        // Write your code here\n        \n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    void Trie() {\n        // Write your code here\n        \n    }\n};"
      },
      {
        "language": "c",
        "code": "typedef struct {\n    \n} Trie;\n\nTrie* trieCreate() {\n    return NULL;\n}\nvoid trieInsert(Trie* obj, char* word) {\n    \n}\nbool trieSearch(Trie* obj, char* word) {\n    return false;\n}\nbool trieStartsWith(Trie* obj, char* prefix) {\n    return false;\n}\nvoid trieFree(Trie* obj) {\n    \n}"
      }
    ]
  },
  {
    "title": "Design Add and Search Words Data Structure",
    "slug": "design-add-and-search-words-data-structure",
    "description": "Design a data structure that supports adding new words and finding if a string matches any previously added string.",
    "difficulty": "Medium",
    "category": "Trie",
    "constraints": [
      "word consists of lowercase English letters or '.' representing any single letter."
    ],
    "examples": [
      {
        "input": "[\"WordDictionary\",\"addWord\",\"addWord\",\"search\",\"search\"]\n[[],[\"bad\"],[\"dad\"],[\"pad\"],[\"bad\"]]",
        "output": "[null,null,null,false,true]"
      }
    ],
    "testCases": [
      {
        "input": "[\"WordDictionary\",\"addWord\",\"addWord\",\"search\",\"search\"]\n[[],[\"bad\"],[\"dad\"],[\"pad\"],[\"bad\"]]",
        "output": "[null,null,null,false,true]",
        "isHidden": false
      }
    ],
    "tags": [
      "String",
      "Depth-First Search",
      "Design",
      "Trie"
    ],
    "companyTags": [
      "Google",
      "Facebook"
    ],
    "acceptanceRate": 43.9,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function WordDictionary() {\n    // Write your code here\n    \n}"
      },
      {
        "language": "python",
        "code": "def WordDictionary():\n    # Write your code here\n    pass\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public void WordDictionary() {\n        // Write your code here\n        \n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    void WordDictionary() {\n        // Write your code here\n        \n    }\n};"
      },
      {
        "language": "c",
        "code": "typedef struct {\n    \n} WordDictionary;\n\nWordDictionary* wordDictionaryCreate() {\n    return NULL;\n}\nvoid wordDictionaryAddWord(WordDictionary* obj, char* word) {\n    \n}\nbool wordDictionarySearch(WordDictionary* obj, char* word) {\n    return false;\n}\nvoid wordDictionaryFree(WordDictionary* obj) {\n    \n}"
      }
    ]
  },
  {
    "title": "Generate Parentheses",
    "slug": "generate-parentheses",
    "description": "Given `n` pairs of parentheses, generate all combinations of well-formed parentheses.",
    "difficulty": "Medium",
    "category": "Recursion",
    "constraints": [
      "1 <= n <= 8"
    ],
    "examples": [
      {
        "input": "n = 3",
        "output": "[\"((()))\",\"(()())\",\"(())()\",\"()(())\",\"()()()\"]"
      }
    ],
    "testCases": [
      {
        "input": "3",
        "output": "[\"((()))\",\"(()())\",\"(())()\",\"()(())\",\"()()()\"]",
        "isHidden": false
      },
      {
        "input": "1",
        "output": "[\"()\"]",
        "isHidden": false
      }
    ],
    "tags": [
      "String",
      "Dynamic Programming",
      "Backtracking"
    ],
    "companyTags": [
      "Amazon",
      "Microsoft",
      "Google"
    ],
    "acceptanceRate": 72.8,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function generateParenthesis(n) {\n    // Write your code here\n    return [];\n}"
      },
      {
        "language": "python",
        "code": "def generateParenthesis(n):\n    # Write your code here\n    return []\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public int[] generateParenthesis(int n) {\n        // Write your code here\n        return new int[0];\n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> generateParenthesis(int n) {\n        // Write your code here\n        return {};\n    }\n};"
      },
      {
        "language": "c",
        "code": "int* generateParenthesis(int n, int* returnSize) {\n    // Write your code here\n    *returnSize = 0;\n    return NULL;\n}"
      }
    ]
  },
  {
    "title": "Number of Provinces",
    "slug": "number-of-provinces",
    "description": "There are `n` cities. Some of them are connected, while some are not. If city a is connected directly with city b, and city b is connected directly with city c, then city a is connected indirectly with city c. Return the total number of provinces.",
    "difficulty": "Medium",
    "category": "Union Find (Disjoint Set)",
    "constraints": [
      "1 <= n <= 200",
      "isConnected[i][j] is 1 or 0."
    ],
    "examples": [
      {
        "input": "isConnected = [[1,1,0],[1,1,0],[0,0,1]]",
        "output": "2"
      }
    ],
    "testCases": [
      {
        "input": "[[1,1,0],[1,1,0],[0,0,1]]",
        "output": "2",
        "isHidden": false
      },
      {
        "input": "[[1,0,0],[0,1,0],[0,0,1]]",
        "output": "3",
        "isHidden": false
      }
    ],
    "tags": [
      "Depth-First Search",
      "Breadth-First Search",
      "Union Find",
      "Graph"
    ],
    "companyTags": [
      "Google",
      "Amazon",
      "Microsoft"
    ],
    "acceptanceRate": 65.1,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function findCircleNum(isConnected) {\n    // Write your code here\n    return 0;\n}"
      },
      {
        "language": "python",
        "code": "def findCircleNum(isConnected):\n    # Write your code here\n    return 0\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public int findCircleNum(int[][] isConnected) {\n        // Write your code here\n        return 0;\n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    int findCircleNum(vector<vector<int>>& isConnected) {\n        // Write your code here\n        return 0;\n    }\n};"
      },
      {
        "language": "c",
        "code": "int findCircleNum(int** isConnected, int isConnectedSize, int* isConnectedColSize) {\n    return 0;\n}"
      }
    ]
  },
  {
    "title": "Daily Temperatures",
    "slug": "daily-temperatures",
    "description": "Given an array of integers `temperatures` represents the daily temperatures, return an array `answer` such that `answer[i]` is the number of days you have to wait after the `i`th day to get a warmer temperature.",
    "difficulty": "Medium",
    "category": "Monotonic Stack",
    "constraints": [
      "1 <= temperatures.length <= 10^5",
      "30 <= temperatures[i] <= 100"
    ],
    "examples": [
      {
        "input": "temperatures = [73,74,75,71,69,72,76,73]",
        "output": "[1,1,4,2,1,1,0,0]"
      }
    ],
    "testCases": [
      {
        "input": "[73,74,75,71,69,72,76,73]",
        "output": "[1,1,4,2,1,1,0,0]",
        "isHidden": false
      }
    ],
    "tags": [
      "Array",
      "Stack",
      "Monotonic Stack"
    ],
    "companyTags": [
      "Google",
      "Amazon",
      "Microsoft",
      "Meta"
    ],
    "acceptanceRate": 66,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function dailyTemperatures(temperatures) {\n    // Write your code here\n    return [];\n}"
      },
      {
        "language": "python",
        "code": "def dailyTemperatures(temperatures):\n    # Write your code here\n    return []\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public int[] dailyTemperatures(int[] temperatures) {\n        // Write your code here\n        return new int[0];\n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> dailyTemperatures(vector<int>& temperatures) {\n        // Write your code here\n        return {};\n    }\n};"
      },
      {
        "language": "c",
        "code": "int* dailyTemperatures(int* temperatures, int temperaturesSize, int* returnSize) {\n    // Write your code here\n    *returnSize = 0;\n    return NULL;\n}"
      }
    ]
  },
  {
    "title": "Trapping Rain Water",
    "slug": "trapping-rain-water",
    "description": "Given `n` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
    "difficulty": "Hard",
    "category": "Arrays",
    "constraints": [
      "n == height.length",
      "1 <= n <= 2 * 10^4",
      "0 <= height[i] <= 10^5"
    ],
    "examples": [
      {
        "input": "height = [0,1,0,2,1,0,1,3,2,1,2,1]",
        "output": "6",
        "explanation": "The above elevation map is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water are being trapped."
      }
    ],
    "testCases": [
      {
        "input": "[0,1,0,2,1,0,1,3,2,1,2,1]",
        "output": "6",
        "isHidden": false
      },
      {
        "input": "[4,2,0,3,2,5]",
        "output": "9",
        "isHidden": false
      }
    ],
    "tags": [
      "Array",
      "Two Pointers",
      "Dynamic Programming",
      "Stack",
      "Monotonic Stack"
    ],
    "companyTags": [
      "Google",
      "Amazon",
      "Microsoft",
      "Meta",
      "Goldman Sachs"
    ],
    "acceptanceRate": 35.8,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function trap(height) {\n    // Write your code here\n    return 0;\n}"
      },
      {
        "language": "python",
        "code": "def trap(height):\n    # Write your code here\n    return 0\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public int trap(int[] height) {\n        // Write your code here\n        return 0;\n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    int trap(vector<int>& height) {\n        // Write your code here\n        return 0;\n    }\n};"
      },
      {
        "language": "c",
        "code": "int trap(int* height, int heightSize) {\n    // Write your code here\n    return 0;\n}"
      }
    ]
  },
  {
    "title": "Minimum Window Substring",
    "slug": "minimum-window-substring",
    "description": "Given two strings `s` and `t` of lengths `m` and `n` respectively, return the minimum window substring of `s` such that every character in `t` (including duplicates) is included in the window. If there is no such substring, return the empty string `\"\"`.",
    "difficulty": "Hard",
    "category": "Strings",
    "constraints": [
      "m == s.length",
      "n == t.length",
      "1 <= m, n <= 10^5",
      "s and t consist of uppercase and lowercase English letters."
    ],
    "examples": [
      {
        "input": "s = \"ADOBECODEBANC\", t = \"ABC\"",
        "output": "\"BANC\"",
        "explanation": "The minimum window substring \"BANC\" includes 'A', 'B', and 'C' from string t."
      }
    ],
    "testCases": [
      {
        "input": "\"ADOBECODEBANC\"\n\"ABC\"",
        "output": "\"BANC\"",
        "isHidden": false
      },
      {
        "input": "\"a\"\n\"a\"",
        "output": "\"a\"",
        "isHidden": false
      },
      {
        "input": "\"a\"\n\"aa\"",
        "output": "\"\"",
        "isHidden": true
      }
    ],
    "tags": [
      "Hash Table",
      "String",
      "Sliding Window"
    ],
    "companyTags": [
      "Amazon",
      "Google",
      "Microsoft",
      "Meta",
      "Uber"
    ],
    "acceptanceRate": 31.4,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function minWindow(s, t) {\n    // Write your code here\n    return \"\";\n}"
      },
      {
        "language": "python",
        "code": "def minWindow(s, t):\n    # Write your code here\n    return \"\"\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public String minWindow(String s, String t) {\n        // Write your code here\n        return \"\";\n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    string minWindow(string s, string t) {\n        // Write your code here\n        return \"\";\n    }\n};"
      },
      {
        "language": "c",
        "code": "char* minWindow(char* s, char* t) {\n    // Write your code here\n    return \"\";\n}"
      }
    ]
  },
  {
    "title": "Merge K Sorted Lists",
    "slug": "merge-k-sorted-lists",
    "description": "You are given an array of `k` linked-lists `lists`, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.",
    "difficulty": "Hard",
    "category": "Linked Lists",
    "constraints": [
      "k == lists.length",
      "0 <= k <= 10^4",
      "0 <= lists[i].length <= 500",
      "-10^4 <= lists[i][j] <= 10^4"
    ],
    "examples": [
      {
        "input": "lists = [[1,4,5],[1,3,4],[2,6]]",
        "output": "[1,1,2,3,4,4,5,6]"
      }
    ],
    "testCases": [
      {
        "input": "[[1,4,5],[1,3,4],[2,6]]",
        "output": "[1,1,2,3,4,4,5,6]",
        "isHidden": false
      },
      {
        "input": "[]",
        "output": "[]",
        "isHidden": false
      }
    ],
    "tags": [
      "Linked List",
      "Divide and Conquer",
      "Heap (Priority Queue)",
      "Merge Sort"
    ],
    "companyTags": [
      "Google",
      "Amazon",
      "Facebook",
      "Microsoft"
    ],
    "acceptanceRate": 28.9,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function mergeKLists(lists) {\n    // Write your code here\n    return null;\n}"
      },
      {
        "language": "python",
        "code": "def mergeKLists(lists):\n    # Write your code here\n    return None\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public ListNode mergeKLists(ListNode[] lists) {\n        // Write your code here\n        return new ArrayList<>();\n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    ListNode* mergeKLists(vector<ListNode*>& lists) {\n        // Write your code here\n        return nullptr;\n    }\n};"
      },
      {
        "language": "c",
        "code": "struct ListNode* mergeKLists(struct ListNode** lists, int listsSize) {\n    return NULL;\n}"
      }
    ]
  },
  {
    "title": "LRU Cache",
    "slug": "lru-cache",
    "description": "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.",
    "difficulty": "Hard",
    "category": "Linked Lists",
    "constraints": [
      "1 <= capacity <= 3000",
      "At most 2 * 10^5 calls will be made to get and put."
    ],
    "examples": [
      {
        "input": "[\"LRUCache\",\"put\",\"put\",\"get\",\"put\",\"get\"]\n[[2],[1,1],[2,2],[1],[3,3],[2]]",
        "output": "[null,null,null,1,null,-1]"
      }
    ],
    "testCases": [
      {
        "input": "[\"LRUCache\",\"put\",\"put\",\"get\",\"put\",\"get\"]\n[[2],[1,1],[2,2],[1],[3,3],[2]]",
        "output": "[null,null,null,1,null,-1]",
        "isHidden": false
      }
    ],
    "tags": [
      "Design",
      "Hash Table",
      "Linked List",
      "Doubly-Linked List"
    ],
    "companyTags": [
      "Google",
      "Amazon",
      "Facebook",
      "Microsoft",
      "Apple"
    ],
    "acceptanceRate": 41.2,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function LRUCache(capacity) {\n    // Write your code here\n    \n}"
      },
      {
        "language": "python",
        "code": "def LRUCache(capacity):\n    # Write your code here\n    pass\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public void LRUCache(int capacity) {\n        // Write your code here\n        \n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    void LRUCache(int capacity) {\n        // Write your code here\n        \n    }\n};"
      },
      {
        "language": "c",
        "code": "typedef struct {\n    \n} LRUCache;\n\nLRUCache* lRUCacheCreate(int capacity) {\n    return NULL;\n}\nint lRUCacheGet(LRUCache* obj, int key) {\n    return -1;\n}\nvoid lRUCachePut(LRUCache* obj, int key, int value) {\n    \n}\nvoid lRUCacheFree(LRUCache* obj) {\n    \n}"
      }
    ]
  },
  {
    "title": "LFU Cache",
    "slug": "lfu-cache",
    "description": "Design a data structure that follows the constraints of a Least Frequently Used (LFU) cache.",
    "difficulty": "Hard",
    "category": "Linked Lists",
    "constraints": [
      "1 <= capacity <= 10^4",
      "At most 2 * 10^5 calls will be made to get and put."
    ],
    "examples": [
      {
        "input": "[\"LFUCache\",\"put\",\"put\",\"get\",\"put\",\"get\",\"get\",\"put\",\"get\",\"get\",\"get\"]\n[[2],[1,1],[2,2],[1],[3,3],[2],[3],[4,4],[1],[3],[4]]",
        "output": "[null,null,null,1,null,-1,3,null,-1,3,4]"
      }
    ],
    "testCases": [
      {
        "input": "[\"LFUCache\",\"put\",\"put\",\"get\",\"put\",\"get\",\"get\",\"put\",\"get\",\"get\",\"get\"]\n[[2],[1,1],[2,2],[1],[3,3],[2],[3],[4,4],[1],[3],[4]]",
        "output": "[null,null,null,1,null,-1,3,null,-1,3,4]",
        "isHidden": false
      }
    ],
    "tags": [
      "Design",
      "Hash Table",
      "Linked List",
      "Doubly-Linked List"
    ],
    "companyTags": [
      "Google",
      "Amazon",
      "Microsoft",
      "Meta"
    ],
    "acceptanceRate": 34.2,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function LFUCache(capacity) {\n    // Write your code here\n    \n}"
      },
      {
        "language": "python",
        "code": "def LFUCache(capacity):\n    # Write your code here\n    pass\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public void LFUCache(int capacity) {\n        // Write your code here\n        \n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    void LFUCache(int capacity) {\n        // Write your code here\n        \n    }\n};"
      },
      {
        "language": "c",
        "code": "typedef struct {\n    \n} LFUCache;\n\nLFUCache* lFUCacheCreate(int capacity) {\n    return NULL;\n}\nint lFUCacheGet(LFUCache* obj, int key) {\n    return -1;\n}\nvoid lFUCachePut(LFUCache* obj, int key, int value) {\n    \n}\nvoid lFUCacheFree(LFUCache* obj) {\n    \n}"
      }
    ]
  },
  {
    "title": "Serialize and Deserialize Binary Tree",
    "slug": "serialize-and-deserialize-binary-tree",
    "description": "Serialization is the process of converting a data structure or object into a sequence of bits so that it can be stored in a file or memory buffer, or transmitted across a network connection link to be reconstructed later in the same or another computer environment. Design an algorithm to serialize and deserialize a binary tree.",
    "difficulty": "Hard",
    "category": "Trees",
    "constraints": [
      "The number of nodes in the tree is in the range [0, 10^4].",
      "-1000 <= Node.val <= 1000"
    ],
    "examples": [
      {
        "input": "root = [1,2,3,null,null,4,5]",
        "output": "[1,2,3,null,null,4,5]"
      }
    ],
    "testCases": [
      {
        "input": "[1,2,3,null,null,4,5]",
        "output": "[1,2,3,null,null,4,5]",
        "isHidden": false
      }
    ],
    "tags": [
      "String",
      "Tree",
      "Depth-First Search",
      "Breadth-First Search",
      "Design",
      "Binary Tree"
    ],
    "companyTags": [
      "Google",
      "Amazon",
      "Meta",
      "Microsoft",
      "LinkedIn"
    ],
    "acceptanceRate": 36.5,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function Codec() {\n    // Write your code here\n    \n}"
      },
      {
        "language": "python",
        "code": "def Codec():\n    # Write your code here\n    pass\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public void Codec() {\n        // Write your code here\n        \n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    void Codec() {\n        // Write your code here\n        \n    }\n};"
      },
      {
        "language": "c",
        "code": "char* serialize(struct TreeNode* root) {\n    return \"\";\n}\nstruct TreeNode* deserialize(char* data) {\n    return NULL;\n}"
      }
    ]
  },
  {
    "title": "Word Ladder",
    "slug": "word-ladder",
    "description": "A transformation sequence from word `beginWord` to word `endWord` using a dictionary `wordList` is a sequence of words `beginWord -> s1 -> s2 -> ... -> sk` such that: Every adjacent pair of words differs by a single character. Return the number of words in the shortest transformation sequence.",
    "difficulty": "Hard",
    "category": "Graphs",
    "constraints": [
      "1 <= beginWord.length <= 10",
      "wordList.length <= 5000"
    ],
    "examples": [
      {
        "input": "beginWord = \"hit\", endWord = \"cog\", wordList = [\"hot\",\"dot\",\"dog\",\"lot\",\"log\",\"cog\"]",
        "output": "5",
        "explanation": "As one shortest transformation is \"hit\" -> \"hot\" -> \"dot\" -> \"dog\" -> \"cog\", return its length 5."
      }
    ],
    "testCases": [
      {
        "input": "\"hit\"\n\"cog\"\n[\"hot\",\"dot\",\"dog\",\"lot\",\"log\",\"cog\"]",
        "output": "5",
        "isHidden": false
      }
    ],
    "tags": [
      "Hash Table",
      "String",
      "Breadth-First Search"
    ],
    "companyTags": [
      "Google",
      "Amazon",
      "Microsoft",
      "Meta"
    ],
    "acceptanceRate": 37.1,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function ladderLength(beginWord, endWord, wordList) {\n    // Write your code here\n    return 0;\n}"
      },
      {
        "language": "python",
        "code": "def ladderLength(beginWord, endWord, wordList):\n    # Write your code here\n    return 0\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public int ladderLength(String beginWord, String endWord, String[] wordList) {\n        // Write your code here\n        return 0;\n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    int ladderLength(string beginWord, string endWord, vector<string>& wordList) {\n        // Write your code here\n        return 0;\n    }\n};"
      },
      {
        "language": "c",
        "code": "int ladderLength(char* beginWord, char* endWord, int wordList) {\n    // Write your code here\n    return 0;\n}"
      }
    ]
  },
  {
    "title": "Word Ladder II",
    "slug": "word-ladder-ii",
    "description": "Given two words, `beginWord` and `endWord`, and a dictionary `wordList`, return all the shortest transformation sequences from `beginWord` to `endWord`.",
    "difficulty": "Hard",
    "category": "Graphs",
    "constraints": [
      "1 <= beginWord.length <= 5",
      "wordList.length <= 500"
    ],
    "examples": [
      {
        "input": "beginWord = \"hit\", endWord = \"cog\", wordList = [\"hot\",\"dot\",\"dog\",\"lot\",\"log\",\"cog\"]",
        "output": "[[\"hit\",\"hot\",\"dot\",\"dog\",\"cog\"],[\"hit\",\"hot\",\"lot\",\"log\",\"cog\"]]"
      }
    ],
    "testCases": [
      {
        "input": "\"hit\"\n\"cog\"\n[\"hot\",\"dot\",\"dog\",\"lot\",\"log\",\"cog\"]",
        "output": "[[\"hit\",\"hot\",\"dot\",\"dog\",\"cog\"],[\"hit\",\"hot\",\"lot\",\"log\",\"cog\"]]",
        "isHidden": false
      }
    ],
    "tags": [
      "Hash Table",
      "String",
      "Backtracking",
      "Breadth-First Search",
      "Graph"
    ],
    "companyTags": [
      "Google",
      "Yelp"
    ],
    "acceptanceRate": 26.5,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function findLadders(beginWord, endWord, wordList) {\n    // Write your code here\n    return null;\n}"
      },
      {
        "language": "python",
        "code": "def findLadders(beginWord, endWord, wordList):\n    # Write your code here\n    return None\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public List<List<Integer>> findLadders(String beginWord, String endWord, String[] wordList) {\n        // Write your code here\n        return new ArrayList<>();\n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<vector<int>> findLadders(string beginWord, string endWord, vector<string>& wordList) {\n        // Write your code here\n        return {};\n    }\n};"
      },
      {
        "language": "c",
        "code": "char*** findLadders(char* beginWord, char* endWord, char** wordList, int wordListSize, int* returnSize, int** returnColumnSizes) {\n    return NULL;\n}"
      }
    ]
  },
  {
    "title": "Alien Dictionary",
    "slug": "alien-dictionary",
    "description": "There is a new alien language that uses the English alphabet. However, the order among the letters is unknown to you. You are given a list of strings `words` from the alien language's dictionary, where the strings in `words` are sorted lexicographically according to the rules of this new language. Return the order of letters.",
    "difficulty": "Hard",
    "category": "Graphs",
    "constraints": [
      "1 <= words.length <= 100",
      "1 <= words[i].length <= 100"
    ],
    "examples": [
      {
        "input": "words = [\"wrt\",\"wrf\",\"er\",\"ett\",\"rftt\"]",
        "output": "\"wertf\""
      }
    ],
    "testCases": [
      {
        "input": "[\"wrt\",\"wrf\",\"er\",\"ett\",\"rftt\"]",
        "output": "\"wertf\"",
        "isHidden": false
      }
    ],
    "tags": [
      "Array",
      "String",
      "Depth-First Search",
      "Breadth-First Search",
      "Graph",
      "Topological Sort"
    ],
    "companyTags": [
      "Google",
      "Amazon",
      "Microsoft",
      "Meta",
      "Uber"
    ],
    "acceptanceRate": 35,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function alienOrder(words) {\n    // Write your code here\n    return \"\";\n}"
      },
      {
        "language": "python",
        "code": "def alienOrder(words):\n    # Write your code here\n    return \"\"\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public String alienOrder(String[] words) {\n        // Write your code here\n        return \"\";\n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    string alienOrder(vector<string>& words) {\n        // Write your code here\n        return \"\";\n    }\n};"
      },
      {
        "language": "c",
        "code": "char* alienOrder(int words) {\n    // Write your code here\n    return \"\";\n}"
      }
    ]
  },
  {
    "title": "Critical Connections in a Network",
    "slug": "critical-connections-in-a-network",
    "description": "There are `n` servers numbered from `0` to `n - 1` connected by undirected server-to-server connections forming a network. Return all critical connections (bridges).",
    "difficulty": "Hard",
    "category": "Graphs",
    "constraints": [
      "1 <= n <= 10^5",
      "n - 1 <= connections.length <= 10^5"
    ],
    "examples": [
      {
        "input": "n = 4, connections = [[0,1],[1,2],[2,0],[1,3]]",
        "output": "[[1,3]]",
        "explanation": "[[1,3]] is the only critical connection."
      }
    ],
    "testCases": [
      {
        "input": "4\n[[0,1],[1,2],[2,0],[1,3]]",
        "output": "[[1,3]]",
        "isHidden": false
      }
    ],
    "tags": [
      "Depth-First Search",
      "Graph",
      "Biconnected Component"
    ],
    "companyTags": [
      "Amazon",
      "Google"
    ],
    "acceptanceRate": 39.5,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function criticalConnections(n, connections) {\n    // Write your code here\n    return null;\n}"
      },
      {
        "language": "python",
        "code": "def criticalConnections(n, connections):\n    # Write your code here\n    return None\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public List<List<Integer>> criticalConnections(int n, int[][] connections) {\n        // Write your code here\n        return new ArrayList<>();\n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<vector<int>> criticalConnections(int n, vector<vector<int>>& connections) {\n        // Write your code here\n        return {};\n    }\n};"
      },
      {
        "language": "c",
        "code": "int** criticalConnections(int n, int** connections, int connectionsSize, int* connectionsColSize, int* returnSize, int** returnColumnSizes) {\n    return NULL;\n}"
      }
    ]
  },
  {
    "title": "Redundant Connection II",
    "slug": "redundant-connection-ii",
    "description": "In this problem, a rooted tree is a directed graph such that, there is exactly one node (the root) for which all other nodes are reachable. Find the edge that can be removed so that the resulting graph is a rooted tree.",
    "difficulty": "Hard",
    "category": "Union Find (Disjoint Set)",
    "constraints": [
      "n == edges.length",
      "3 <= n <= 1000",
      "edges[i].length == 2"
    ],
    "examples": [
      {
        "input": "edges = [[1,2],[1,3],[2,3]]",
        "output": "[2,3]"
      }
    ],
    "testCases": [
      {
        "input": "[[1,2],[1,3],[2,3]]",
        "output": "[2,3]",
        "isHidden": false
      },
      {
        "input": "[[1,2],[2,3],[3,1],[4,1]]",
        "output": "[3,1]",
        "isHidden": false
      }
    ],
    "tags": [
      "Depth-First Search",
      "Breadth-First Search",
      "Union Find",
      "Graph"
    ],
    "companyTags": [
      "Google",
      "Amazon"
    ],
    "acceptanceRate": 36.8,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function findRedundantDirectedConnection(edges) {\n    // Write your code here\n    return [];\n}"
      },
      {
        "language": "python",
        "code": "def findRedundantDirectedConnection(edges):\n    # Write your code here\n    return []\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public int[] findRedundantDirectedConnection(int[][] edges) {\n        // Write your code here\n        return new int[0];\n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> findRedundantDirectedConnection(vector<vector<int>>& edges) {\n        // Write your code here\n        return {};\n    }\n};"
      },
      {
        "language": "c",
        "code": "int* findRedundantDirectedConnection(int edges, int* returnSize) {\n    // Write your code here\n    *returnSize = 0;\n    return NULL;\n}"
      }
    ]
  },
  {
    "title": "N Queens",
    "slug": "n-queens",
    "description": "The n-queens puzzle is the problem of placing `n` queens on an `n x n` chessboard such that no two queens attack each other. Given an integer `n`, return all distinct solutions.",
    "difficulty": "Hard",
    "category": "Backtracking",
    "constraints": [
      "1 <= n <= 9"
    ],
    "examples": [
      {
        "input": "n = 4",
        "output": "[[\".Q..\",\"...Q\",\"Q...\",\"..Q.\"],[\"..Q.\",\"Q...\",\"...Q\",\".Q..\"]]"
      }
    ],
    "testCases": [
      {
        "input": "4",
        "output": "[[\".Q..\",\"...Q\",\"Q...\",\"..Q.\"],[\"..Q.\",\"Q...\",\"...Q\",\".Q..\"]]",
        "isHidden": false
      },
      {
        "input": "1",
        "output": "[[\"Q\"]]",
        "isHidden": false
      }
    ],
    "tags": [
      "Array",
      "Backtracking"
    ],
    "companyTags": [
      "Google",
      "Amazon",
      "Microsoft",
      "Meta"
    ],
    "acceptanceRate": 32.5,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function solveNQueens(n) {\n    // Write your code here\n    return null;\n}"
      },
      {
        "language": "python",
        "code": "def solveNQueens(n):\n    # Write your code here\n    return None\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public List<List<Integer>> solveNQueens(int n) {\n        // Write your code here\n        return new ArrayList<>();\n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<vector<int>> solveNQueens(int n) {\n        // Write your code here\n        return {};\n    }\n};"
      },
      {
        "language": "c",
        "code": "char*** solveNQueens(int n, int* returnSize, int** returnColumnSizes) {\n    return NULL;\n}"
      }
    ]
  },
  {
    "title": "Sudoku Solver",
    "slug": "sudoku-solver",
    "description": "Write a program to solve a Sudoku puzzle by filling the empty cells. Empty cells are indicated by the character `'.'`.",
    "difficulty": "Hard",
    "category": "Backtracking",
    "constraints": [
      "board.length == 9",
      "board[i].length == 9",
      "It is guaranteed that the input board has only one unique solution."
    ],
    "examples": [
      {
        "input": "board = [[5,3,.,.,7,.,.,.,.],...]",
        "output": "Modified board in-place."
      }
    ],
    "testCases": [
      {
        "input": "[[\"5\",\"3\",\".\",\".\",\"7\",\".\",\".\",\".\",\".\"],[\"6\",\".\",\".\",\"1\",\"9\",\"5\",\".\",\".\",\".\"],[\".\",\"9\",\"8\",\".\",\".\",\".\",\".\",\"6\",\".\"],[\"8\",\".\",\".\",\".\",\"6\",\".\",\".\",\".\",\"3\"],[\"4\",\".\",\".\",\"8\",\".\",\"3\",\".\",\".\",\"1\"],[\"7\",\".\",\".\",\".\",\"2\",\".\",\".\",\".\",\"6\"],[\".\",\"6\",\".\",\".\",\".\",\".\",\"2\",\"8\",\".\"],[\".\",\".\",\".\",\"4\",\"1\",\"9\",\".\",\".\",\"5\"],[\".\",\".\",\".\",\".\",\"8\",\".\",\".\",\"7\",\"9\"]]",
        "output": "[[\"5\",\"3\",\"4\",\"6\",\"7\",\"8\",\"9\",\"1\",\"2\"],[\"6\",\"7\",\"2\",\"1\",\"9\",\"5\",\"3\",\"4\",\"8\"],[\"1\",\"9\",\"8\",\"3\",\"4\",\"2\",\"5\",\"6\",\"7\"],[\"8\",\"5\",\"9\",\"7\",\"6\",\"1\",\"4\",\"2\",\"3\"],[\"4\",\"2\",\"6\",\"8\",\"5\",\"3\",\"7\",\"9\",\"1\"],[\"7\",\"1\",\"3\",\"9\",\"2\",\"4\",\"8\",\"5\",\"6\"],[\"9\",\"6\",\"1\",\"5\",\"3\",\"7\",\"2\",\"8\",\"4\"],[\"2\",\"8\",\"7\",\"4\",\"1\",\"9\",\"6\",\"3\",\"5\"],[\"3\",\"4\",\"5\",\"2\",\"8\",\"6\",\"1\",\"7\",\"9\"]]",
        "isHidden": false
      }
    ],
    "tags": [
      "Array",
      "Hash Table",
      "Backtracking",
      "Matrix"
    ],
    "companyTags": [
      "Google",
      "Amazon",
      "Microsoft",
      "Meta"
    ],
    "acceptanceRate": 31.9,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function solveSudoku(board) {\n    // Write your code here\n    \n}"
      },
      {
        "language": "python",
        "code": "def solveSudoku(board):\n    # Write your code here\n    pass\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public void solveSudoku(char[][] board) {\n        // Write your code here\n        \n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    void solveSudoku(vector<vector<char>>& board) {\n        // Write your code here\n        \n    }\n};"
      },
      {
        "language": "c",
        "code": "void solveSudoku(char** board, int boardSize, int* boardColSize) {\n    \n}"
      }
    ]
  },
  {
    "title": "Median of Two Sorted Arrays",
    "slug": "median-of-two-sorted-arrays",
    "description": "Given two sorted arrays `nums1` and `nums2` of size `m` and `n` respectively, return the median of the two sorted arrays. The overall run time complexity should be `O(log (m+n))`.",
    "difficulty": "Hard",
    "category": "Binary Search",
    "constraints": [
      "nums1.length == m",
      "nums2.length == n",
      "0 <= m, n <= 1000",
      "1 <= m + n <= 2000"
    ],
    "examples": [
      {
        "input": "nums1 = [1,3], nums2 = [2]",
        "output": "2.00000",
        "explanation": "merged array = [1,2,3] and median is 2."
      }
    ],
    "testCases": [
      {
        "input": "[1,3]\n[2]",
        "output": "2.0",
        "isHidden": false
      },
      {
        "input": "[1,2]\n[3,4]",
        "output": "2.5",
        "isHidden": false
      }
    ],
    "tags": [
      "Array",
      "Binary Search",
      "Divide and Conquer"
    ],
    "companyTags": [
      "Google",
      "Amazon",
      "Microsoft",
      "Meta",
      "Apple"
    ],
    "acceptanceRate": 29.3,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function findMedianSortedArrays(nums1, nums2) {\n    // Write your code here\n    return 0;\n}"
      },
      {
        "language": "python",
        "code": "def findMedianSortedArrays(nums1, nums2):\n    # Write your code here\n    return 0\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public int findMedianSortedArrays(int[] nums1, int[] nums2) {\n        // Write your code here\n        return 0;\n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    int findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {\n        // Write your code here\n        return 0;\n    }\n};"
      },
      {
        "language": "c",
        "code": "double findMedianSortedArrays(int* nums1, int nums1Size, int* nums2, int nums2Size) {\n    return 0.0;\n}"
      }
    ]
  },
  {
    "title": "Sliding Window Maximum",
    "slug": "sliding-window-maximum",
    "description": "You are given an array of integers `nums`, there is a sliding window of size `k` which is moving from the very left of the array to the very right. Return the max sliding window.",
    "difficulty": "Hard",
    "category": "Sliding Window",
    "constraints": [
      "1 <= nums.length <= 10^5",
      "-10^4 <= nums[i] <= 10^4",
      "1 <= k <= nums.length"
    ],
    "examples": [
      {
        "input": "nums = [1,3,-1,-3,5,3,6,7], k = 3",
        "output": "[3,3,5,5,6,7]"
      }
    ],
    "testCases": [
      {
        "input": "[1,3,-1,-3,5,3,6,7]\n3",
        "output": "[3,3,5,5,6,7]",
        "isHidden": false
      }
    ],
    "tags": [
      "Array",
      "Queue",
      "Sliding Window",
      "Heap (Priority Queue)",
      "Monotonic Queue"
    ],
    "companyTags": [
      "Google",
      "Amazon",
      "Meta",
      "Uber"
    ],
    "acceptanceRate": 26.1,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function maxSlidingWindow(nums, k) {\n    // Write your code here\n    return [];\n}"
      },
      {
        "language": "python",
        "code": "def maxSlidingWindow(nums, k):\n    # Write your code here\n    return []\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public int[] maxSlidingWindow(int[] nums, int k) {\n        // Write your code here\n        return new int[0];\n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> maxSlidingWindow(vector<int>& nums, int k) {\n        // Write your code here\n        return {};\n    }\n};"
      },
      {
        "language": "c",
        "code": "int* maxSlidingWindow(int* nums, int numsSize, int k, int* returnSize) {\n    // Write your code here\n    *returnSize = 0;\n    return NULL;\n}"
      }
    ]
  },
  {
    "title": "Largest Rectangle in Histogram",
    "slug": "largest-rectangle-in-histogram",
    "description": "Given an array of integers `heights` representing the histogram's bar height where the width of each bar is 1, return the area of the largest rectangle in the histogram.",
    "difficulty": "Hard",
    "category": "Monotonic Stack",
    "constraints": [
      "1 <= heights.length <= 10^5",
      "0 <= heights[i] <= 10^4"
    ],
    "examples": [
      {
        "input": "heights = [2,1,5,6,2,3]",
        "output": "10"
      }
    ],
    "testCases": [
      {
        "input": "[2,1,5,6,2,3]",
        "output": "10",
        "isHidden": false
      },
      {
        "input": "[2,4]",
        "output": "4",
        "isHidden": false
      }
    ],
    "tags": [
      "Array",
      "Stack",
      "Monotonic Stack"
    ],
    "companyTags": [
      "Amazon",
      "Google",
      "Microsoft",
      "Meta"
    ],
    "acceptanceRate": 34.2,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function largestRectangleArea(heights) {\n    // Write your code here\n    return 0;\n}"
      },
      {
        "language": "python",
        "code": "def largestRectangleArea(heights):\n    # Write your code here\n    return 0\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public int largestRectangleArea(int[] heights) {\n        // Write your code here\n        return 0;\n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    int largestRectangleArea(vector<int>& heights) {\n        // Write your code here\n        return 0;\n    }\n};"
      },
      {
        "language": "c",
        "code": "int largestRectangleArea(int* heights, int heightsSize) {\n    // Write your code here\n    return 0;\n}"
      }
    ]
  },
  {
    "title": "Maximal Rectangle",
    "slug": "maximal-rectangle",
    "description": "Given a `rows x cols` binary `matrix` filled with `0`'s and `1`'s, find the largest rectangle containing only `1`'s and return its area.",
    "difficulty": "Hard",
    "category": "Monotonic Stack",
    "constraints": [
      "rows == matrix.length",
      "cols == matrix[i].length",
      "0 <= rows, cols <= 200"
    ],
    "examples": [
      {
        "input": "matrix = [[\"1\",\"0\",\"1\",\"0\",\"0\"],[\"1\",\"0\",\"1\",\"1\",\"1\"],[\"1\",\"1\",\"1\",\"1\",\"1\"],[\"1\",\"0\",\"0\",\"1\",\"0\"]]",
        "output": "6"
      }
    ],
    "testCases": [
      {
        "input": "[[\"1\",\"0\",\"1\",\"0\",\"0\"],[\"1\",\"0\",\"1\",\"1\",\"1\"],[\"1\",\"1\",\"1\",\"1\",\"1\"],[\"1\",\"0\",\"0\",\"1\",\"0\"]]",
        "output": "6",
        "isHidden": false
      }
    ],
    "tags": [
      "Array",
      "Dynamic Programming",
      "Stack",
      "Matrix",
      "Monotonic Stack"
    ],
    "companyTags": [
      "Google",
      "Amazon",
      "Microsoft",
      "Meta"
    ],
    "acceptanceRate": 33.1,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function maximalRectangle(matrix) {\n    // Write your code here\n    return 0;\n}"
      },
      {
        "language": "python",
        "code": "def maximalRectangle(matrix):\n    # Write your code here\n    return 0\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public int maximalRectangle(char[][] matrix) {\n        // Write your code here\n        return 0;\n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    int maximalRectangle(vector<vector<char>>& matrix) {\n        // Write your code here\n        return 0;\n    }\n};"
      },
      {
        "language": "c",
        "code": "int maximalRectangle(char** matrix, int matrixSize, int* matrixColSize) {\n    return 0;\n}"
      }
    ]
  },
  {
    "title": "Edit Distance",
    "slug": "edit-distance",
    "description": "Given two strings `word1` and `word2`, return the minimum number of operations required to convert `word1` to `word2`. You have 3 operations: insert, delete, or replace a character.",
    "difficulty": "Hard",
    "category": "Dynamic Programming",
    "constraints": [
      "0 <= word1.length, word2.length <= 500",
      "word1 and word2 consist of lowercase English letters."
    ],
    "examples": [
      {
        "input": "word1 = \"horse\", word2 = \"ros\"",
        "output": "3",
        "explanation": "horse -> rorse -> rose -> ros"
      }
    ],
    "testCases": [
      {
        "input": "\"horse\"\n\"ros\"",
        "output": "3",
        "isHidden": false
      },
      {
        "input": "\"intention\"\n\"execution\"",
        "output": "5",
        "isHidden": false
      }
    ],
    "tags": [
      "String",
      "Dynamic Programming"
    ],
    "companyTags": [
      "Google",
      "Amazon",
      "Microsoft",
      "Meta"
    ],
    "acceptanceRate": 35.2,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function minDistance(word1, word2) {\n    // Write your code here\n    return 0;\n}"
      },
      {
        "language": "python",
        "code": "def minDistance(word1, word2):\n    # Write your code here\n    return 0\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public int minDistance(String word1, String word2) {\n        // Write your code here\n        return 0;\n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    int minDistance(string word1, string word2) {\n        // Write your code here\n        return 0;\n    }\n};"
      },
      {
        "language": "c",
        "code": "int minDistance(char* word1, char* word2) {\n    // Write your code here\n    return 0;\n}"
      }
    ]
  },
  {
    "title": "Burst Balloons",
    "slug": "burst-balloons",
    "description": "You are given `n` balloons, indexed from `0` to `n - 1`. Each balloon is painted with a number on it, represented by an array `nums`. You are asked to burst all the balloons. If you burst balloon `i` you will get `nums[i - 1] * nums[i] * nums[i + 1]` coins.",
    "difficulty": "Hard",
    "category": "Dynamic Programming",
    "constraints": [
      "n == nums.length",
      "1 <= n <= 300",
      "0 <= nums[i] <= 100"
    ],
    "examples": [
      {
        "input": "nums = [3,1,5,8]",
        "output": "167"
      }
    ],
    "testCases": [
      {
        "input": "[3,1,5,8]",
        "output": "167",
        "isHidden": false
      },
      {
        "input": "[1,5]",
        "output": "10",
        "isHidden": false
      }
    ],
    "tags": [
      "Array",
      "Dynamic Programming"
    ],
    "companyTags": [
      "Google",
      "Amazon",
      "Microsoft",
      "Meta"
    ],
    "acceptanceRate": 28.5,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function maxCoins(nums) {\n    // Write your code here\n    return 0;\n}"
      },
      {
        "language": "python",
        "code": "def maxCoins(nums):\n    # Write your code here\n    return 0\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public int maxCoins(int[] nums) {\n        // Write your code here\n        return 0;\n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    int maxCoins(vector<int>& nums) {\n        // Write your code here\n        return 0;\n    }\n};"
      },
      {
        "language": "c",
        "code": "int maxCoins(int* nums, int numsSize) {\n    // Write your code here\n    return 0;\n}"
      }
    ]
  },
  {
    "title": "Range Sum Query - Mutable",
    "slug": "range-sum-query-mutable",
    "description": "Given an integer array `nums`, handle multiple queries of updating elements and calculating the range sum. Implement NumArray using Segment Tree.",
    "difficulty": "Hard",
    "category": "Segment Tree",
    "constraints": [
      "1 <= nums.length <= 3 * 10^4",
      "-100 <= nums[i] <= 100"
    ],
    "examples": [
      {
        "input": "[\"NumArray\",\"sumRange\",\"update\",\"sumRange\"]\n[[[1,3,5]],[0,2],[1,2],[0,2]]",
        "output": "[null,9,null,8]"
      }
    ],
    "testCases": [
      {
        "input": "[\"NumArray\",\"sumRange\",\"update\",\"sumRange\"]\n[[[1,3,5]],[0,2],[1,2],[0,2]]",
        "output": "[null,9,null,8]",
        "isHidden": false
      }
    ],
    "tags": [
      "Design",
      "Binary Indexed Tree",
      "Segment Tree",
      "Array"
    ],
    "companyTags": [
      "Google",
      "Amazon"
    ],
    "acceptanceRate": 31.2,
    "starterCode": [
      {
        "language": "javascript",
        "code": "function NumArrayMutable() {\n    // Write your code here\n    \n}"
      },
      {
        "language": "python",
        "code": "def NumArrayMutable():\n    # Write your code here\n    pass\n"
      },
      {
        "language": "java",
        "code": "import java.util.*;\n\nclass Solution {\n    public void NumArrayMutable() {\n        // Write your code here\n        \n    }\n}"
      },
      {
        "language": "cpp",
        "code": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    void NumArrayMutable() {\n        // Write your code here\n        \n    }\n};"
      },
      {
        "language": "c",
        "code": "typedef struct {\n    \n} NumArray;\n\nNumArray* numArrayCreate(int* nums, int numsSize) {\n    return NULL;\n}\nvoid numArrayUpdate(NumArray* obj, int index, int val) {\n    \n}\nint numArraySumRange(NumArray* obj, int left, int right) {\n    return 0;\n}\nvoid numArrayFree(NumArray* obj) {\n    \n}"
      }
    ]
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
    console.log('[MDB] CURATED Coding Problems seeded successfully! Count:', sampleProblems.length);

    process.exit(0);
  } catch (err) {
    console.error('[ERR] Seeding failed! Details:', err.message);
    process.exit(1);
  }
};

seedDatabase();
