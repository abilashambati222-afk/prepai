require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const MCQQuestion = require('../models/MCQQuestion');

const questions = [
  // ==========================================
  // SUBJECT: Aptitude
  // ==========================================
  // Quantitative Aptitude
  {
    question: "A train running at the speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train in meters?",
    options: ["120 meters", "150 meters", "180 meters", "324 meters"],
    correctOptionIndex: 1,
    explanation: "First, convert speed from km/hr to m/s: Speed = 60 * (5 / 18) = 50/3 m/s. \nDistance = Speed * Time = (50/3) * 9 = 150 meters. \nThus, the length of the train is 150 meters.",
    subject: "Aptitude",
    topic: "Quantitative Aptitude",
    difficulty: "Easy",
    tags: ["Time and Distance", "Trains"],
    companyTags: ["TCS", "Wipro", "Cognizant"]
  },
  {
    question: "A sum of money at simple interest amounts to $815 in 3 years and to $854 in 4 years. What is the principal amount?",
    options: ["$650", "$690", "$698", "$700"],
    correctOptionIndex: 2,
    explanation: "Simple Interest (S.I.) for 1 year = Amount in 4 years - Amount in 3 years = $854 - $815 = $39. \nS.I. for 3 years = $39 * 3 = $117. \nPrincipal = Amount in 3 years - S.I. for 3 years = $815 - $117 = $698.",
    subject: "Aptitude",
    topic: "Quantitative Aptitude",
    difficulty: "Medium",
    tags: ["Simple Interest", "Finance"],
    companyTags: ["Infosys", "Capgemini", "Accenture"]
  },
  {
    question: "Three partners shared the profit in a business in the ratio 5 : 7 : 8. They had partnered for 14 months, 8 months and 7 months respectively. What was the ratio of their investments?",
    options: ["20 : 49 : 64", "38 : 28 : 21", "20 : 35 : 64", "None of these"],
    correctOptionIndex: 0,
    explanation: "Let the investments be X, Y, Z. \nProfit = Investment * Time. \nSo, Investment Ratio = Profit Ratio / Time Ratio. \nInvestment Ratio = 5/14 : 7/8 : 8/7. \nTo clear fractions, multiply by the LCM of denominators (14, 8, 7), which is 56. \nRatio = (5/14 * 56) : (7/8 * 56) : (8/7 * 56) = 20 : 49 : 64.",
    subject: "Aptitude",
    topic: "Quantitative Aptitude",
    difficulty: "Hard",
    tags: ["Partnership", "Ratios"],
    companyTags: ["Amazon", "TCS", "Infosys"]
  },
  // Logical Reasoning
  {
    question: "Look at this series: 2, 1, (1/2), (1/4), ... What number should come next?",
    options: ["(1/3)", "(1/8)", "(2/8)", "(1/16)"],
    correctOptionIndex: 1,
    explanation: "This is a simple division series; each number is half of the previous number. \n2/2 = 1; 1/2 = 1/2; (1/2)/2 = 1/4; (1/4)/2 = 1/8. \nSo, the next number is 1/8.",
    subject: "Aptitude",
    topic: "Logical Reasoning",
    difficulty: "Easy",
    tags: ["Number Series"],
    companyTags: ["Accenture", "TCS", "Tech_Mahindra"]
  },
  {
    question: "Pointing to a photograph, Vipul said, 'She is the daughter of my grandfather's only son.' How is Vipul related to the girl in the photograph?",
    options: ["Father", "Brother", "Cousin", "Uncle"],
    correctOptionIndex: 1,
    explanation: "'Grandfather's only son' refers to Vipul's father. \nThe girl is the daughter of Vipul's father, which makes her Vipul's sister. \nTherefore, Vipul is the brother of the girl.",
    subject: "Aptitude",
    topic: "Logical Reasoning",
    difficulty: "Medium",
    tags: ["Blood Relations"],
    companyTags: ["Cognizant", "Infosys", "Deloitte"]
  },
  {
    question: "In a certain code language, 'COMPUTER' is written as 'RFUVQNPC'. How is 'MEDICINE' written in that code?",
    options: ["EOJDEJFM", "EOMHDJFM", "EOJDJEFM", "DJFMEOJD"],
    correctOptionIndex: 2,
    explanation: "The coding pattern is: The first letter becomes the last letter and vice versa. \nFor intermediate letters: reverse their order and add +1 to each. \nSo 'MEDICINE' becomes: first M -> E, last E -> M. \nThe middle letters 'EDICIN' reversed is 'NICIDE'. Add +1 to each: N(+1)->O, I(+1)->J, C(+1)->D, I(+1)->J, D(+1)->E, E(+1)->F. \nCombining these gives 'EOJDJEFM'.",
    subject: "Aptitude",
    topic: "Logical Reasoning",
    difficulty: "Hard",
    tags: ["Coding-Decoding"],
    companyTags: ["Infosys", "Wipro", "Amazon"]
  },
  // Verbal Ability
  {
    question: "Choose the word which is most nearly SYNONYMOUS with: CANDID",
    options: ["Vague", "Outspoken", "Deceptive", "Arrogant"],
    correctOptionIndex: 1,
    explanation: "Candid means truthful and straightforward; frank. Outspoken is the closest synonym.",
    subject: "Aptitude",
    topic: "Verbal Ability",
    difficulty: "Easy",
    tags: ["Synonyms", "Vocabulary"],
    companyTags: ["Accenture", "Capgemini", "Deloitte"]
  },
  {
    question: "Find the correctly spelled word.",
    options: ["Accomodate", "Acommodate", "Accommodate", "Accomodate"],
    correctOptionIndex: 2,
    explanation: "The correct spelling is 'Accommodate', with two 'c's and two 'm's.",
    subject: "Aptitude",
    topic: "Verbal Ability",
    difficulty: "Medium",
    tags: ["Spelling Check"],
    companyTags: ["TCS", "Wipro"]
  },

  // ==========================================
  // SUBJECT: Computer Science
  // ==========================================
  // Operating Systems
  {
    question: "Which of the following is NOT a valid state of a process in an Operating System?",
    options: ["New", "Running", "Waiting", "Executing"],
    correctOptionIndex: 3,
    explanation: "The classic process states are New, Ready, Running, Waiting (or Blocked), and Terminated. 'Executing' is not a standard process state (it is covered under the Running state).",
    subject: "Computer Science",
    topic: "Operating Systems",
    difficulty: "Easy",
    tags: ["Process Management"],
    companyTags: ["Google", "Microsoft", "Oracle"]
  },
  {
    question: "What is the primary condition that leads to Thrashing in an Operating System?",
    options: ["High CPU utilization", "The system spends more time paging than executing processes", "Multiple deadlocks occurring simultaneously", "Shortage of secondary storage memory"],
    correctOptionIndex: 1,
    explanation: "Thrashing occurs when the page fault rate is very high, causing the operating system to spend a large portion of its time swapping pages in and out of main memory (paging) rather than executing actual instructions.",
    subject: "Computer Science",
    topic: "Operating Systems",
    difficulty: "Medium",
    tags: ["Memory Management", "Virtual Memory"],
    companyTags: ["Microsoft", "Amazon", "Adobe"]
  },
  {
    question: "Which scheduling algorithm can potentially lead to starvation of processes?",
    options: ["Round Robin", "First-Come, First-Served", "Shortest Job First (non-preemptive)", "Priority Scheduling"],
    correctOptionIndex: 3,
    explanation: "Priority Scheduling can cause starvation because low-priority processes may wait indefinitely if higher-priority processes continue to arrive. SJF can also cause starvation, but Priority Scheduling is the most direct cause listed.",
    subject: "Computer Science",
    topic: "Operating Systems",
    difficulty: "Medium",
    tags: ["CPU Scheduling"],
    companyTags: ["Google", "Meta", "Oracle"]
  },
  {
    question: "Consider a system with 3 processes sharing 4 resources of the same type. Each process needs a maximum of 2 resources. Can a deadlock occur?",
    options: ["Yes, always", "Yes, under specific execution sequences", "No, deadlock is impossible", "Insufficient information"],
    correctOptionIndex: 2,
    explanation: "If there are N processes and each needs a max of M resources, the condition to prevent deadlock is: Total Resources >= N * (M - 1) + 1. \nHere, N = 3, M = 2. \nTotal Resources needed to prevent deadlock = 3 * (2 - 1) + 1 = 4. \nSince we have 4 resources, a deadlock is impossible.",
    subject: "Computer Science",
    topic: "Operating Systems",
    difficulty: "Hard",
    tags: ["Deadlocks", "Resource Allocation"],
    companyTags: ["Google", "Microsoft", "Amazon"]
  },
  // DBMS
  {
    question: "In a relational database, what does 'Atomicity' in ACID properties represent?",
    options: ["Data must be written to disk immediately", "All parts of a transaction succeed, or the entire transaction fails", "Transactions must execute in isolation", "Only verified users can perform transactions"],
    correctOptionIndex: 1,
    explanation: "Atomicity ensures that a transaction is treated as a single 'unit', which either completes entirely or has no effect at all (all-or-nothing).",
    subject: "Computer Science",
    topic: "DBMS",
    difficulty: "Easy",
    tags: ["ACID Properties", "Transactions"],
    companyTags: ["Oracle", "Salesforce", "TCS"]
  },
  {
    question: "Which of the following database normal forms prevents multi-valued dependencies?",
    options: ["1NF", "2NF", "3NF", "4NF"],
    correctOptionIndex: 3,
    explanation: "Fourth Normal Form (4NF) is specifically designed to eliminate multi-valued dependencies. BCNF addresses anomalies from functional dependencies, and 4NF builds on this by tackling multi-valued dependencies.",
    subject: "Computer Science",
    topic: "DBMS",
    difficulty: "Medium",
    tags: ["Database Normalization"],
    companyTags: ["Microsoft", "Oracle", "IBM"]
  },
  {
    question: "What is the primary difference between a clustered index and a non-clustered index?",
    options: ["Clustered index is faster for insertions", "Clustered index determines the physical order of data rows in the table", "A table can have multiple clustered indexes", "Non-clustered indexes are stored in the primary data file itself"],
    correctOptionIndex: 1,
    explanation: "A clustered index defines the physical sorting order of rows in the table. Because the data rows can only be sorted in one order, there can be only one clustered index per table.",
    subject: "Computer Science",
    topic: "DBMS",
    difficulty: "Medium",
    tags: ["Indexing"],
    companyTags: ["Google", "Adobe", "Amazon"]
  },
  // Computer Networks
  {
    question: "Which layer of the OSI model is responsible for routing packets across different networks?",
    options: ["Data Link Layer", "Network Layer", "Transport Layer", "Session Layer"],
    correctOptionIndex: 1,
    explanation: "The Network Layer is responsible for routing packets, logical addressing (IP addresses), and packet forwarding across network boundaries.",
    subject: "Computer Science",
    topic: "Computer Networks",
    difficulty: "Easy",
    tags: ["OSI Model", "Routing"],
    companyTags: ["Cisco", "TCS", "Accenture"]
  },
  {
    question: "What is the size of an IPv6 address in bits?",
    options: ["32 bits", "64 bits", "128 bits", "256 bits"],
    correctOptionIndex: 2,
    explanation: "An IPv6 address consists of 128 bits, representing a massive expansion over IPv4's 32-bit address space.",
    subject: "Computer Science",
    topic: "Computer Networks",
    difficulty: "Easy",
    tags: ["IP Addressing"],
    companyTags: ["Infosys", "Wipro", "Google"]
  },
  {
    question: "Which TCP transition state occurs when a host has sent a FIN packet and is waiting for the final ACK from the receiver?",
    options: ["FIN_WAIT_1", "FIN_WAIT_2", "CLOSE_WAIT", "LAST_ACK"],
    correctOptionIndex: 0,
    explanation: "In TCP connection teardown, when an application closes and sends a FIN, the TCP connection enters the FIN_WAIT_1 state, waiting for an ACK of its FIN or for a FIN from the peer.",
    subject: "Computer Science",
    topic: "Computer Networks",
    difficulty: "Hard",
    tags: ["TCP/IP Protocol", "Three-Way Handshake"],
    companyTags: ["Google", "Meta", "Microsoft"]
  },
  // OOPs
  {
    question: "What is the key mechanism that allows a subclass to provide a specific implementation of a method that is already defined in its superclass?",
    options: ["Method Overloading", "Method Overriding", "Encapsulation", "Polymorphism"],
    correctOptionIndex: 1,
    explanation: "Method Overriding allows a child class to override a method implementation defined in the parent class, enabling runtime polymorphism.",
    subject: "Computer Science",
    topic: "OOPs",
    difficulty: "Easy",
    tags: ["Inheritance", "Polymorphism"],
    companyTags: ["TCS", "Wipro", "Infosys"]
  },
  {
    question: "Which C++ feature allows a class to access private and protected members of another class without inheritance?",
    options: ["Virtual functions", "Friend functions/classes", "Namespaces", "Templates"],
    correctOptionIndex: 1,
    explanation: "Friend functions and friend classes in C++ are granted access to private and protected members of the class declaring them as friends.",
    subject: "Computer Science",
    topic: "OOPs",
    difficulty: "Medium",
    tags: ["C++ Core", "Access Specifiers"],
    companyTags: ["Microsoft", "Adobe", "Oracle"]
  },

  // ==========================================
  // SUBJECT: Company Prep
  // ==========================================
  // Google Prep
  {
    question: "Which data structure is most efficient to check for the presence of cycles in a large, sparse undirected graph?",
    options: ["Adjacency Matrix", "Breadth-First Search Queue", "Disjoint Set Union (DSU) / Union-Find", "Red-Black Tree"],
    correctOptionIndex: 2,
    explanation: "For undirected graphs, Disjoint Set Union (DSU) with path compression and union by rank is extremely efficient to check and merge components for cycles, running in almost linear O(alpha(V)) time.",
    subject: "Company Prep",
    topic: "Google",
    difficulty: "Hard",
    tags: ["Graphs", "Algorithms"],
    companyTags: ["Google"]
  },
  {
    question: "In JavaScript, what is the time complexity of looking up a key in a Map in the average case?",
    options: ["O(1)", "O(log n)", "O(n)", "O(d) where d is key length"],
    correctOptionIndex: 0,
    explanation: "JavaScript Maps are backed by hash tables, providing O(1) average time complexity for basic operations like get, set, and has.",
    subject: "Company Prep",
    topic: "Google",
    difficulty: "Easy",
    tags: ["Data Structures", "JavaScript"],
    companyTags: ["Google"]
  },
  // Microsoft Prep
  {
    question: "Which of the following traversal methods visits a Binary Search Tree (BST) in sorted ascending order?",
    options: ["Pre-order Traversal", "In-order Traversal", "Post-order Traversal", "Level-order Traversal"],
    correctOptionIndex: 1,
    explanation: "In-order traversal visits the left subtree, then the root node, and finally the right subtree. In a BST, this yields nodes in sorted ascending order.",
    subject: "Company Prep",
    topic: "Microsoft",
    difficulty: "Easy",
    tags: ["Trees", "Binary Search Tree"],
    companyTags: ["Microsoft"]
  },
  {
    question: "What is the runtime time complexity of searching for an element in a balanced Red-Black Tree containing N elements?",
    options: ["O(1)", "O(log N)", "O(N)", "O(N log N)"],
    correctOptionIndex: 1,
    explanation: "A Red-Black Tree is a self-balancing binary search tree. The maximum height of the tree is O(log N), so searching for an element takes O(log N) time in the worst case.",
    subject: "Company Prep",
    topic: "Microsoft",
    difficulty: "Medium",
    tags: ["Data Structures", "Red-Black Tree"],
    companyTags: ["Microsoft"]
  },
  // TCS Prep
  {
    question: "What is the output of the expression 5 + 3 * 2 - 8 / 4 in standard operator precedence?",
    options: ["12", "9", "5", "8"],
    correctOptionIndex: 1,
    explanation: "Following BODMAS rules (Precedence: *, / have higher than +, -): \n3 * 2 = 6. \n8 / 4 = 2. \nExpression becomes: 5 + 6 - 2 = 9.",
    subject: "Company Prep",
    topic: "TCS",
    difficulty: "Easy",
    tags: ["Operator Precedence", "C Programming"],
    companyTags: ["TCS"]
  },
  {
    question: "Which sorting algorithm has a worst-case time complexity of O(n^2) but is generally fast and works in-place?",
    options: ["Merge Sort", "Quick Sort", "Heap Sort", "Bubble Sort"],
    correctOptionIndex: 1,
    explanation: "Quick Sort has a worst-case time complexity of O(n^2) when the pivot is poorly chosen. However, on average it is O(n log n), in-place, and performs extremely well in practice.",
    subject: "Company Prep",
    topic: "TCS",
    difficulty: "Medium",
    tags: ["Sorting", "Algorithms"],
    companyTags: ["TCS"]
  },
  // Accenture Prep
  {
    question: "If a card is drawn at random from a standard deck of 52 cards, what is the probability that it is a Face Card (Jack, Queen, or King)?",
    options: ["3/13", "1/13", "4/13", "12/52"],
    correctOptionIndex: 0,
    explanation: "A standard deck has 4 suits, each containing 3 face cards (J, Q, K). \nTotal Face Cards = 4 * 3 = 12. \nProbability = 12 / 52 = 3/13.",
    subject: "Company Prep",
    topic: "Accenture",
    difficulty: "Easy",
    tags: ["Probability", "Mathematics"],
    companyTags: ["Accenture"]
  },
  {
    question: "A merchant marks his goods 20% above the cost price and then allows a discount of 10%. What is his net gain percentage?",
    options: ["10%", "8%", "12%", "15%"],
    correctOptionIndex: 1,
    explanation: "Let Cost Price (CP) = 100. \nMarked Price (MP) = 100 + 20% of 100 = 120. \nDiscount = 10% of 120 = 12. \nSelling Price (SP) = MP - Discount = 120 - 12 = 108. \nNet Gain = SP - CP = 108 - 100 = 8. \nGain Percentage = (8 / 100) * 100 = 8%.",
    subject: "Company Prep",
    topic: "Accenture",
    difficulty: "Medium",
    tags: ["Profit and Loss", "Percentages"],
    companyTags: ["Accenture"]
  },
  // Infosys Prep
  {
    question: "In a class of 60 students, 40% are girls. In an exam, 60% of the boys passed. If the overall pass percentage is 68%, how many girls passed?",
    options: ["20", "24", "18", "22"],
    correctOptionIndex: 1,
    explanation: "Total Students = 60. \nGirls = 40% of 60 = 24. \nBoys = 60 - 24 = 36. \nOverall passed = 68% of 60 = 40.8 (approx 41). Let's calculate exactly: \nPassed Boys = 60% of 36 = 21.6. \nPassed Girls = Total Passed - Passed Boys = 40.8 - 21.6 = 19.2. \nWait, let's look at the numbers. Overall pass is 68% of 60 = 40.8. Boys passed is 60% of 36 = 21.6. Girls passed = 40.8 - 21.6 = 19.2. \nWait, if the numbers are rounded: \nLet's assume boys passed is 60% of 36 = 21.6. If exact count of girls passed is 24, that would mean 24 girls passed out of 24 (100% pass rate). Let's review the math. \nIf SP = 68% * 60 = 40.8. \nLet's refine: Boys = 36, Girls = 24. \nPassed boys = 60% of 36 = 21.6. Let's make the numbers cleaner: \nGirls = 24, Boys = 36. \nIf we want the answer to be 24: \nIf 24 girls passed, then total passed is 21.6 + 24 = 45.6 (76%). \nLet's re-verify the question parameters. If 60% of boys passed = 21.6 boys. \nIf girls pass rate is 80%, passed girls = 0.8 * 24 = 19.2. Total passed = 40.8 (68%). \nSo passed girls = 19.2 (approx 19 or 20). If the answer choice is 19.2, it's 19.2. \nWait, if the question means: Girls = 24. Passed boys = 0.6 * 36 = 21.6. Total passed = 0.68 * 60 = 40.8. Girls passed = 40.8 - 21.6 = 19.2. \nIf the question used rounded integer values, let's say total passed was 41, passed boys 22. Girls passed = 41 - 22 = 19. Or if boys was 36, girls 24. If 24 girls passed, that's 24. Let's write the options clearly. A correct option index of 1 (24) is fine, let's change explanation to match the numbers: 'Total students = 60. Girls = 24. Boys = 36. Boys passed = 21.6. Total passed = 40.8. Girls passed = 40.8 - 21.6 = 19.2. Wait, let's fix the question to make the math perfectly clean with integers: \nIn a class of 50 students, 40% are girls. 60% of the boys passed. If the overall pass percentage is 68%, how many girls passed?' \nLet's recalculate for N=50: \nTotal students = 50. \nGirls = 40% of 50 = 20. \nBoys = 30. \nBoys passed = 60% of 30 = 18. \nOverall passed = 68% of 50 = 34. \nGirls passed = Total Passed - Passed Boys = 34 - 18 = 16. \nLet's modify the question text and options to N=50 so the math is clean: \nQuestion: 'In a class of 50 students, 40% are girls. In an exam, 60% of the boys passed. If the overall pass percentage is 68%, how many girls passed?' \nOptions: ['12', '16', '14', '18']. Correct index: 1 (16).",
    options: ["12", "16", "14", "18"],
    correctOptionIndex: 1,
    explanation: "Total Students = 50. \nGirls = 40% of 50 = 20. \nBoys = 50 - 20 = 30. \nBoys passed = 60% of 30 = 18. \nOverall passed = 68% of 50 = 34. \nGirls passed = Total Passed - Passed Boys = 34 - 18 = 16.",
    subject: "Company Prep",
    topic: "Infosys",
    difficulty: "Medium",
    tags: ["Percentages", "Aptitude"],
    companyTags: ["Infosys"]
  },
  {
    question: "What is the worst-case time complexity of searching for an element in a Hash Table when collisions are resolved using Chaining?",
    options: ["O(1)", "O(log N)", "O(N)", "O(N log N)"],
    correctOptionIndex: 2,
    explanation: "In the worst case, all keys hash to the same bucket (index) in the hash table. The chaining mechanism stores them in a linked list, requiring a sequential scan of all elements, which takes O(N) time.",
    subject: "Company Prep",
    topic: "Infosys",
    difficulty: "Easy",
    tags: ["Data Structures", "Hashing"],
    companyTags: ["Infosys"]
  }
];

const seedMCQs = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/prepai';
    console.log('[Seed] Connecting to database at:', mongoUri);
    await mongoose.connect(mongoUri, { family: 4 });
    console.log('[Seed] Database connection successful.');

    // Clean existing MCQ questions to avoid duplicates
    console.log('[Seed] Cleaning existing MCQ questions...');
    await MCQQuestion.deleteMany({});

    console.log(`[Seed] Inserting ${questions.length} MCQ questions...`);
    const inserted = await MCQQuestion.insertMany(questions);
    console.log(`[Seed] Successfully seeded ${inserted.length} questions.`);

    await mongoose.connection.close();
    console.log('[Seed] Connection closed.');
    process.exit(0);
  } catch (err) {
    console.error('[Seed] Error during seeding:', err.message);
    process.exit(1);
  }
};

seedMCQs();
